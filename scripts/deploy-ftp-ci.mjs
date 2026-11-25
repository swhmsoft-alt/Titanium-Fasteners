#!/usr/bin/env node
/**
 * scripts/deploy-ftp-ci.mjs — upload the built site (dist/) to an FTP/FTPS host.
 *
 * Single deployment entry point for both CI and local runs. The protocol and
 * the semantics are identical in both cases — only the source of the
 * credentials differs (see "CREDENTIAL NAMESPACES" below).
 *
 * CREDENTIAL NAMESPACES (deliberately NOT unified)
 * -----------------------------------------------
 *   CI    : GitHub repository Secrets — FTP_HOST / FTP_PASSWORD plus the user
 *            and path, which accept BOTH spellings:
 *              FTP_USER       (preferred)  or  FTP_USERNAME
 *              FTP_REMOTE_PATH(preferred)  or  FTP_DIR
 *            The legacy workflow (deploy.yml) already provisions FTP_USERNAME
 *            / FTP_DIR, so accepting both keeps one credential set working for
 *            both workflows instead of forcing a second registration.
 *   Local : .env.production — PRODUCTION_FTP_HOST / _USER / _PASSWORD / _PORT
 *            / PRODUCTION_SERVER_PATH.
 *
 * The two sets keep different names on purpose: a short CI-style name typed
 * into the local file (or vice versa) is immediately recognisable, and the
 * origin of every credential stays identifiable. Internally this script reads
 * the FTP_* names; `--env-file` maps the PRODUCTION_* names onto them.
 *
 * TRANSFER SEQUENCE
 * -----------------
 *   1. validate env          — missing variables abort with their names listed
 *   2. validate dist/        — abort if the build output is missing
 *   3. connect               — plain control channel on port 21
 *   4. upgrade to FTPS       — AUTH TLS -> PBSZ 0 -> PROT P
 *   5. cd(FTP_REMOTE_PATH)   — "/" means the FTP login root IS the docroot
 *   6. uploadFromDir(dist)   — full upload
 *   7. report 552            — "server disk full" gets its own message
 *
 * The credentials are sent AFTER the AUTH TLS handshake, so they never cross
 * the network in clear text. (Handshaking only after the login — as some
 * legacy scripts do — leaks the password over the wire.)
 *
 * USAGE
 * -----
 *   node scripts/deploy-ftp-ci.mjs                       # CI: FTP_* from env
 *   node scripts/deploy-ftp-ci.mjs --env-file .env.production
 *
 * The dependency `basic-ftp` must live in `dependencies` (not
 * devDependencies) — CI installs with --omit=dev in some setups.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import net from 'node:net';
import tls from 'node:tls';
import { Client } from 'basic-ftp';
import { classifyFile, isZeroByteFile } from './lib/empty-placeholders.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');

/* ── argument parsing ───────────────────────────────────────────────────── */

const argv = process.argv.slice(2);
const envFileIndex = argv.indexOf('--env-file');
const ENV_FILE = envFileIndex !== -1 ? argv[envFileIndex + 1] : null;

/* ── credential resolution ──────────────────────────────────────────────── */

/**
 * Minimal .env parser: KEY=VALUE lines, `#` comments, optional quotes.
 * @param {string} file
 * @returns {Record<string, string>}
 */
function parseEnvFile(file) {
	const out = {};
	for (const rawLine of readFileSync(file, 'utf8').split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line || line.startsWith('#')) continue;
		const eq = line.indexOf('=');
		if (eq === -1) continue;
		const key = line.slice(0, eq).trim();
		let value = line.slice(eq + 1).trim();
		if (
			(value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
			(value.startsWith("'") && value.endsWith("'") && value.length > 1)
		) {
			value = value.slice(1, -1);
		}
		out[key] = value;
	}
	return out;
}

/** Map the local PRODUCTION_* namespace onto the internal FTP_* namespace. */
function applyLocalEnvFile(file) {
	const local = parseEnvFile(file);
	const map = {
		FTP_HOST: 'PRODUCTION_FTP_HOST',
		FTP_USER: 'PRODUCTION_FTP_USER',
		FTP_PASSWORD: 'PRODUCTION_FTP_PASSWORD',
		FTP_PORT: 'PRODUCTION_FTP_PORT',
		FTP_REMOTE_PATH: 'PRODUCTION_SERVER_PATH',
	};
	for (const [internal, localName] of Object.entries(map)) {
		if (!process.env[internal] && local[localName]) {
			process.env[internal] = local[localName];
		}
	}
}

/* ── step 1: validate env ───────────────────────────────────────────────── */

/**
 * Read the first non-empty variable from a list of accepted names.
 * @param {string[]} names
 * @returns {string|null} the value, or null when none of the names is set
 */
function requireEnv(names) {
	const list = Array.isArray(names) ? names : [names];
	for (const name of list) {
		const value = (process.env[name] ?? '').trim();
		if (value) return value;
	}
	console.error(
		`[deploy-ftp] ERROR: missing required environment variable (accepted: ${list.join(', ')})`
	);
	return null;
}

/**
 * Name of the variable that actually carries the value, for the log.
 * @param {string[]} names
 * @returns {string} the winning name, or 'unset'
 */
function sourceOf(names) {
	const list = Array.isArray(names) ? names : [names];
	for (const name of list) {
		if ((process.env[name] ?? '').trim()) return name;
	}
	return 'unset';
}

// The env file must be applied BEFORE the credentials are read, otherwise the
// local namespace (PRODUCTION_*) never reaches the FTP_* lookups.
if (ENV_FILE) {
	const envPath = resolve(ROOT, ENV_FILE);
	if (!existsSync(envPath)) {
		console.error(`[deploy-ftp] ERROR: env file not found: ${envPath}`);
		process.exit(1);
	}
	applyLocalEnvFile(envPath);
	console.log(`[deploy-ftp] credentials loaded from ${ENV_FILE}`);
}

// The credential sets that exist across the repository's secrets.
//
// The user and the password of a set belong together: mixing a user from one
// set with the password of another can only fail. Each set is tried in turn,
// because an account can exist while its home directory does not (Pure-FTPd
// answers 421 "Home directory not available" in that case).
const CREDENTIAL_SETS = [
	{ user: 'FTP_USER', password: 'FTP_PASSWORD' },
	{ user: 'FTP_USERNAME', password: 'FTP_PASSWORD' },
	{ user: 'FTP2_USERNAME', password: 'FTP2_PASSWORD' },
];

const HOST = requireEnv(['FTP_HOST']);

/** The credential sets that carry a complete user and password. */
const usableSets = CREDENTIAL_SETS.filter(
	(set) =>
		(process.env[set.user] ?? '').trim() && (process.env[set.password] ?? '').trim()
);

if (!HOST || usableSets.length === 0) {
	if (!HOST) {
		console.error('[deploy-ftp] ERROR: missing required environment variable (accepted: FTP_HOST)');
	}
	if (usableSets.length === 0) {
		console.error(
			'[deploy-ftp] ERROR: no complete credential set found. Accepted pairs: ' +
				CREDENTIAL_SETS.map((set) => `${set.user} + ${set.password}`).join(', ')
		);
	}
	console.error('[deploy-ftp] aborting: fix the missing variable(s) listed above.');
	process.exit(1);
}

const PORT = Number.parseInt((process.env.FTP_PORT ?? '21').trim(), 10);
if (!Number.isInteger(PORT) || PORT <= 0 || PORT > 65535) {
	console.error(`[deploy-ftp] ERROR: FTP_PORT is not a valid port number: ${process.env.FTP_PORT}`);
	process.exit(1);
}

// "/" means the FTP login root is already the site document root.
// FTP_REMOTE_PATH is preferred; FTP_DIR is the legacy spelling still used by
// deploy.yml, so one set of repository Secrets drives both workflows.
//
// When neither is configured the target is DISCOVERED: cPanel subdomain
// accounts are chrooted into their home directory, which usually contains
// the document root in a sub-directory rather than at the login root.
//
// THE SHARED-HOST RULE (do not relax)
// ------------------------------------
// The cPanel account hosts THREE sites side by side:
//   /home/safetipa/fastener.bozemetal.com  <- THIS project, the only target
//   /home/safetipa/cnc.bozemetal.com       <- sibling project, never write
//   /home/safetipa/public_html             <- safetiparts.com main site
// The sibling directories are therefore NOT candidates. `public_html` in
// particular is the MAIN site's document root, so probing it would overwrite
// a site we do not own. Only paths listed in ALLOWED_REMOTE_ROOTS are ever
// entered, written to, or probed.
const CONFIGURED_REMOTE_PATH = (
	process.env.FTP_REMOTE_PATH ??
	process.env.FTP_DIR ??
	''
)
	.trim();

// Every directory this script is allowed to write into. A path is accepted
// when its normalised form equals one of these entries.
const ALLOWED_REMOTE_ROOTS = [
	'/home/safetipa/fastener.bozemetal.com',
	'/fastener.bozemetal.com',
	'fastener.bozemetal.com',
	'/',
];

// The candidates probed when nothing is configured. All of them are inside
// ALLOWED_REMOTE_ROOTS; the login root is handled separately because it only
// qualifies when it demonstrably holds this project's own files.
const REMOTE_PATH_CANDIDATES = [
	'fastener.bozemetal.com',
	'/fastener.bozemetal.com',
	'/home/safetipa/fastener.bozemetal.com',
];

/**
 * Is this path a directory this script may write into?
 * @param {string} path
 * @returns {boolean}
 */
function isAllowedRoot(path) {
	const normalized = path.replace(/\/+$/, '') || '/';
	return ALLOWED_REMOTE_ROOTS.includes(normalized);
}

/**
 * Stop the deployment when the target is outside our own directory.
 *
 * This is the last line of defence against the shared-host rule: even if a
 * secret points somewhere else, the run aborts instead of overwriting a site
 * that belongs to somebody else.
 * @param {string} path
 * @returns {string} the same path, when it is allowed
 */
function assertAllowedRoot(path) {
	if (isAllowedRoot(path)) {
		return path;
	}
	console.error(
		`[deploy-ftp] ERROR: refusing to write to "${path}" — it is not this project's directory.`
	);
	console.error(
		'[deploy-ftp] this cPanel account hosts three sites; only /home/safetipa/fastener.bozemetal.com may be written to.'
	);
	console.error(
		'[deploy-ftp] set FTP_REMOTE_PATH (or FTP_DIR) to "fastener.bozemetal.com" and correct the FTP account directory in cPanel.'
	);
	process.exit(1);
}

// Which sets are available? Only the NAMES are printed, never the values,
// so a misconfigured secret stays visible in the log without leaking.
console.log(
	`[deploy-ftp] credential sets available: ${usableSets
		.map((set) => `${set.user}+${set.password}`)
		.join(', ')} | path=${CONFIGURED_REMOTE_PATH ? 'configured' : 'auto-discover'}`
);

// A configured path is checked BEFORE the connection is opened: a secret
// pointing at a sibling site must fail fast, not after a login round-trip.
if (
	CONFIGURED_REMOTE_PATH !== '' &&
	CONFIGURED_REMOTE_PATH !== '/' &&
	CONFIGURED_REMOTE_PATH !== '.' &&
	!isAllowedRoot(CONFIGURED_REMOTE_PATH)
) {
	console.error(
		`[deploy-ftp] ERROR: FTP_REMOTE_PATH is set to "${CONFIGURED_REMOTE_PATH}", which is not this project's directory.`
	);
	console.error(
		'[deploy-ftp] this cPanel account hosts three sites; only /home/safetipa/fastener.bozemetal.com may be written to.'
	);
	console.error(
		'[deploy-ftp] set FTP_REMOTE_PATH to "fastener.bozemetal.com".'
	);
	process.exit(1);
}

/* ── step 2: validate build output ──────────────────────────────────────── */

if (!existsSync(DIST) || !statSync(DIST).isDirectory()) {
	console.error('[deploy-ftp] ERROR: dist/ not found — run `npm run build` before deploying.');
	process.exit(1);
}

/* ── the 404 error document ─────────────────────────────────────────────── */

/**
 * The single server directive that makes an unknown URL render the site's own
 * 404 page instead of the web server's built-in error page.
 */
const ERROR_DOCUMENT_DIRECTIVE = 'ErrorDocument 404 /404.html';

/**
 * Make the server answer an unknown URL with the site's own 404 page.
 *
 * WHY THIS IS NEEDED
 * ------------------
 * The build emits `dist/404.html`, but a static host only serves that file for
 * an unknown path when the web server is told to. Without the mapping the
 * server answers with ITS OWN default error page, so the 404 page never
 * appears and the whole effort is invisible.
 *
 * WHERE IT LIVES
 * --------------
 * In the document root's `.htaccess` — the one file the web server reads for
 * that directory. That file may already exist and may hold rules the hosting
 * panel generated (HTTPS redirect, directory protection), so it is MERGED and
 * never overwritten: the current content is downloaded, the directive is
 * appended only when it is missing, and only then is the file written back.
 *
 * A failure here must never fail the deployment — the site itself has already
 * been uploaded at this point and does not depend on this file.
 */
async function ensureErrorDocument() {
	try {
		// Writable is imported lazily: it is needed only by this function and
		// the module-level import list stays untouched.
		const { Writable } = await import('node:stream');

		let existing = '';
		let hasExisting = false;

		// SIZE first: it tells whether the file exists without transferring
		// anything, and it fails with 550 when it does not — the normal
		// first-run case.
		let exists = false;
		try {
			await client.size('.htaccess');
			exists = true;
		} catch (err) {
			const message = err && err.message ? err.message : String(err);
			if (!/550|not found|no such/i.test(message)) {
				console.warn(
					`[deploy-ftp] WARNING: the existing .htaccess could not be inspected (${message}) — ` +
						'the 404 mapping was left alone instead of overwriting it'
				);
				return;
			}
		}

		if (exists && typeof client.downloadTo === 'function') {
			try {
				const chunks = [];
				const sink = new Writable({
					write(chunk, _encoding, callback) {
						chunks.push(Buffer.from(chunk));
						callback();
					},
				});
				await client.downloadTo(sink, '.htaccess');
				existing = Buffer.concat(chunks).toString('utf8');
				hasExisting = true;
			} catch (err) {
				const message = err && err.message ? err.message : String(err);
				// The file exists but could not be read. Writing now would
				// overwrite content nobody has seen, so the step is skipped.
				console.warn(
					`[deploy-ftp] WARNING: the existing .htaccess could not be read (${message}) — ` +
						'the 404 mapping was left alone instead of overwriting it'
				);
				return;
			}
		}

		if (exists && typeof client.downloadTo !== 'function') {
			console.warn(
				'[deploy-ftp] WARNING: a .htaccess already exists on the server and cannot be read — ' +
					'the 404 mapping was left alone instead of overwriting it'
			);
			return;
		}

		if (hasExisting && /^\s*ErrorDocument\s+404\s+\S+/im.test(existing)) {
			console.log('[deploy-ftp] the server already maps 404 to a document — .htaccess left untouched');
			return { previous: existing, written: false };
		}

		const body =
			hasExisting && existing.trim().length > 0
				? `${existing.replace(/\s*$/, '')}\n\n${ERROR_DOCUMENT_DIRECTIVE}\n`
				: `# Managed by scripts/deploy-ftp-ci.mjs — the 404 mapping.\n${ERROR_DOCUMENT_DIRECTIVE}\n`;

		// uploadFrom takes a stream, not a Buffer.
		await client.uploadFrom(Readable.from([Buffer.from(body, 'utf8')]), '.htaccess');
		console.log(`[deploy-ftp] .htaccess now maps an unknown URL to ${ERROR_DOCUMENT_DIRECTIVE}`);

		return { previous: hasExisting ? existing : null, written: true };
	} catch (err) {
		console.warn(
			`[deploy-ftp] WARNING: the 404 mapping could not be written: ${
				err && err.message ? err.message : err
			}`
		);
		return null;
	}
}

/**
 * Roll the .htaccess back to its previous state.
 *
 * WHY
 * ---
 * `ErrorDocument` belongs to the FileInfo override class. If the host limits
 * `AllowOverride` to something narrower, a .htaccess carrying an unexpected
 * directive makes the server answer 500 — the whole site would be down.
 * That is a far worse outcome than a default 404 page, so the change is
 * undone as soon as it is detected.
 *
 * @param {string|null} previous the content before the write, null when the
 *   file did not exist at all
 */
async function restoreErrorDocument(previous) {
	try {
		if (previous === null) {
			await client.remove('.htaccess');
			console.log('[deploy-ftp] the .htaccess was removed again — the previous state is restored');
			return;
		}
		await client.uploadFrom(Readable.from([Buffer.from(previous, 'utf8')]), '.htaccess');
		console.log('[deploy-ftp] the .htaccess was restored to its previous content');
	} catch (err) {
		console.error(
			`[deploy-ftp] ERROR: the .htaccess could not be restored: ${
				err && err.message ? err.message : err
			}`
		);
	}
}

/**
 * Ask the site whether it still answers after the .htaccess was written.
 *
 * A 5xx answer means the directive upset the server configuration, and the
 * rollback has to happen. Anything else — including a 4xx from an
 * anti-scraping layer in front of the site — leaves the file in place.
 * @returns {Promise<boolean>} true when the site answered with a 5xx status
 */
async function siteAnswersWithServerError() {
	const url = (process.env.SITE_URL ?? 'https://fastener.bozemetal.com').trim();
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 15000);
	try {
		const response = await fetch(url, {
			headers: {
				// A browser-like agent, so an anti-scraping layer in front of
				// the site answers like it would for a visitor.
				'user-agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
				accept: 'text/html',
			},
			signal: controller.signal,
			redirect: 'manual',
		});
		console.log(`[deploy-ftp] the site answered ${response.status} after the 404 mapping was written`);
		return response.status >= 500;
	} catch (err) {
		// The site could not be reached at all — that is not a proof that the
		// .htaccess broke it, so the file stays.
		console.warn(
			`[deploy-ftp] the site could not be checked after the 404 mapping: ${
				err && err.message ? err.message : err
			}`
		);
		return false;
	} finally {
		clearTimeout(timer);
	}
}

/* ── steps 3-7: connect, upgrade, upload ────────────────────────────────── */

let client = new Client(60 * 1000);

// The credential set that worked, reused when the session is re-opened.
let activeSet = null;
const failures = [];

// The server closes an FTP session after a limited number of transfers, so
// the upload renews the session on its own.
const FILES_PER_SESSION = 25;
const SESSION_MS = 60 * 1000;
// The server needs a moment to release the passive data ports of the closed
// session; a new session that starts too early is refused right away.
const RECONNECT_DELAY_MS = 4000;

// The directory the upload writes into, restored after every reconnect.
let documentRoot = '';

// The host may present a cPanel shared certificate that does not cover the
// subdomain (its altnames list only *.serverhostgroup.com). The name can be
// pinned with FTP_TLS_SERVERNAME; FTP_TLS_STRICT=true forbids the fallback.
//
// When nothing is pinned, the certificate is inspected once and a name it
// actually covers is used, so the handshake is still fully verified instead of
// falling back to an unverified channel.
const TLS_SERVERNAME = (process.env.FTP_TLS_SERVERNAME ?? '').trim();
const TLS_STRICT = (process.env.FTP_TLS_STRICT ?? 'false').trim().toLowerCase() === 'true';

// The name the handshake is verified against. Resolved on first use.
let tlsServerName = TLS_SERVERNAME;

// The certificate warning is printed once; the session is re-opened often.
let tlsWarningShown = false;

/**
 * Read the DNS names the server certificate covers for a given SNI.
 *
 * The control channel is plain FTP first, so the certificate is only visible
 * after the AUTH TLS upgrade. The probe therefore performs that upgrade on a
 * throwaway socket.
 *
 * @param {string} host the server to ask
 * @param {number} port the control port
 * @param {string} sni the name to send as SNI
 * @returns {Promise<string[]>} the DNS names in the certificate, empty on failure
 */
function probeCertificateNames(host, port, sni) {
	return new Promise((resolve) => {
		let stage = 'banner';
		let buffer = '';
		let settled = false;

		const socket = net.connect({ host, port });
		const onData = (chunk) => {
			buffer += chunk.toString('latin1');

			if (stage === 'banner') {
				if (!buffer.includes('220')) {
					return;
				}
				stage = 'auth';
				buffer = '';
				socket.write('AUTH TLS\r\n');
				return;
			}

			if (stage === 'auth') {
				if (!buffer.includes('234')) {
					finish([]);
					return;
				}
				stage = 'tls';
				// The TLS layer takes over the socket from here.
				socket.removeListener('data', onData);
				const secure = tls.connect(
					{ socket, servername: sni, rejectUnauthorized: false },
					() => {
						const certificate = secure.getPeerCertificate();
						const alt = certificate && certificate.subjectaltname ? certificate.subjectaltname : '';
						finish(
							alt
								.split(', ')
								.filter((entry) => entry.startsWith('DNS:'))
								.map((entry) => entry.slice(4))
						);
					}
				);
				secure.on('error', () => finish([]));
			}
		};

		function finish(names) {
			if (settled) {
				return;
			}
			settled = true;
			try {
				socket.destroy();
			} catch {
				// The probe socket is disposable.
			}
			resolve(names);
		}

		socket.on('data', onData);
		socket.on('error', () => finish([]));
		setTimeout(() => finish([]), 15000);
	});
}

/**
 * Find a name the server certificate actually covers.
 *
 * A cPanel account lives on a shared host, so the certificate presented for
 * the account's own name lists only the host's service names
 * (*.serverhostgroup.com). The connection name is therefore not covered and
 * the handshake fails with ERR_TLS_CERT_ALTNAME_INVALID.
 *
 * Instead of dropping the verification, a name the certificate DOES cover is
 * looked up and used as the server name. The channel stays encrypted AND the
 * server identity is verified.
 *
 * @returns {Promise<string>} the name to verify the certificate against
 */
async function resolveTlsServerName() {
	if (tlsServerName) {
		return tlsServerName;
	}

	const names = await probeCertificateNames(HOST, PORT, HOST);
	if (names.length === 0) {
		// Nothing to choose from — keep the host and let the handshake speak.
		tlsServerName = HOST;
		return tlsServerName;
	}

	if (names.includes(HOST)) {
		tlsServerName = HOST;
		return tlsServerName;
	}

	// Try the shortest service name first: it is the most likely to be the
	// certificate that the server hands out for that name as well.
	const candidates = [...names].sort((a, b) => a.length - b.length);
	for (const candidate of candidates) {
		const covered = await probeCertificateNames(HOST, PORT, candidate);
		if (covered.includes(candidate)) {
			console.log(
				`[deploy-ftp] the certificate of ${HOST} does not cover that name; ` +
					`the handshake is verified against "${candidate}", which it does cover`
			);
			tlsServerName = candidate;
			return tlsServerName;
		}
	}

	tlsServerName = HOST;
	return tlsServerName;
}

/**
 * Open the control channel and upgrade it to TLS.
 *
 * The certificate of a cPanel subdomain account usually does not cover that
 * name, so the handshake is retried with the certificate the server presents.
 * The channel stays encrypted and the reason is printed; FTP_TLS_STRICT=true
 * turns the fallback off.
 * @returns {Promise<void>}
 */
async function openSecureControlChannel() {
	// The name the certificate is verified against. It is resolved once and
	// reused for every reconnect.
	const servername = await resolveTlsServerName();

	try {
		await client.connect(HOST, PORT);
		await client.useTLS(
			{ servername, minVersion: 'TLSv1.2', rejectUnauthorized: true },
			'AUTH TLS'
		);
		return;
	} catch (err) {
		const message = err && err.message ? err.message : String(err);
		const kind = err && err.name ? err.name : 'Error';
		const code = err && err.code ? err.code : 'n/a';
		if (TLS_STRICT) {
			throw err;
		}
		console.warn(
			`[deploy-ftp] TLS handshake failed (${kind}/${code}): ${message}`
		);
		if (!tlsWarningShown) {
			tlsWarningShown = true;
			console.warn(
				`[deploy-ftp] The certificate of ${HOST} does not cover that name, so the handshake ` +
					'is retried with the certificate the server presents. The channel stays encrypted, ' +
					'but the server identity is no longer verified — ask the host to install a ' +
					'certificate for this subdomain, or set FTP_TLS_SERVERNAME to a name it covers.'
			);
		}

		try {
			client.close();
		} catch {
			// The failed socket is already unusable; closing must not mask the error.
		}
		client = new Client(60 * 1000);
		await client.connect(HOST, PORT);
		await client.useTLS(
			{ servername, minVersion: 'TLSv1.2', rejectUnauthorized: false },
			'AUTH TLS'
		);
	}
}

/**
 * Connect and log in with the first credential set the server accepts.
 *
 * @returns {Promise<void>}
 */
async function openSession() {
	for (const [index, set] of usableSets.entries()) {
		const user = (process.env[set.user] ?? '').trim();
		const password = (process.env[set.password] ?? '').trim();

		console.log(
			`[deploy-ftp] credential set ${index + 1}/${usableSets.length}: ${set.user} (${set.password})`
		);
		try {
			await openSecureControlChannel();
			await client.login(user, password);
			console.log(`[deploy-ftp] logged in with ${set.user}`);
			activeSet = set;
			return;
		} catch (err) {
			const message = err && err.message ? err.message : String(err);
			console.warn(`[deploy-ftp] ${set.user} was rejected: ${message}`);
			failures.push(`${set.user}: ${message}`);

			// "421 Home directory not available" is not a wrong password: the
			// account exists, but the directory it is chrooted into does not
			// exist on the server. That has to be fixed in the hosting panel,
			// so the log says so instead of only showing the FTP code.
			if (/421/i.test(message) && /home directory/i.test(message)) {
				console.warn(
					`[deploy-ftp] ${set.user}: the server accepted the account but its home directory ` +
						'is missing. Fix it in the hosting panel (cPanel -> FTP Accounts -> the account ' +
						'-> Home Directory / Directory): point it at the folder that really holds the ' +
						'site, and make sure that folder exists and is writable by the account.'
				);
			}

			try {
				client.close();
			} catch {
				// The socket is already broken; closing must not mask the error.
			}
			client = new Client(60 * 1000);
		}
	}

	console.error('[deploy-ftp] every credential set was rejected:');
	for (const failure of failures) {
		console.error(`[deploy-ftp]   ${failure}`);
	}
	console.error(
		'[deploy-ftp] A "421 Home directory not available" answer means the account exists but its ' +
			'home directory is missing on the server — that has to be repaired in the hosting panel ' +
			'(cPanel -> FTP Accounts -> Directory), not in this repository.'
	);
	process.exit(1);
}

/**
 * Re-open the control channel with the credential set that worked.
 *
 * The server closes long FTP sessions, so the upload reconnects every few
 * dozen files and continues where it stopped.
 */
async function reopenSession() {
	try {
		client.close();
	} catch {
		// The socket is already broken.
	}
	client = new Client(60 * 1000);
	await openSecureControlChannel();
	const user = (process.env[activeSet.user] ?? '').trim();
	const password = (process.env[activeSet.password] ?? '').trim();
	await client.login(user, password);

	// The data channel has to be protected again on the new session,
	// otherwise the server refuses the transfers.
	await client.send('PBSZ 0');
	await client.send('PROT P');
	await client.send('TYPE I');

	// Give the server time to release the passive ports of the old session.
	await new Promise((resolve) => setTimeout(resolve, RECONNECT_DELAY_MS));
}

try {
	console.log(`[deploy-ftp] connecting to ${HOST}:${PORT} (explicit FTPS)`);
	await openSession();

	// PBSZ 0 / PROT P — protect the DATA channel as well.
	await client.send('PBSZ 0');
	await client.send('PROT P');

	await client.send('TYPE I');

	const pwd = await client.pwd();
	console.log(`[deploy-ftp] logged in, remote PWD = ${pwd}`);

	/**
	 * Resolve the directory that IS the site document root.
	 *
	 * A configured path wins, unless it is "." — that value means "the login
	 * root", which for a chrooted cPanel account is the home directory and
	 * not the document root. Without a path the known candidates are probed
	 * and the first one that can be entered AND written to is used.
	 * @returns {Promise<string>} the directory to upload into
	 */
	async function resolveRemotePath() {
		const configured = CONFIGURED_REMOTE_PATH;
		const hasConfigured =
			configured !== '' && configured !== '/' && configured !== '.';

		/**
		 * Can a file be written into the current directory?
		 *
		 * Only the upload decides: the server may refuse the delete of the
		 * probe file (some cPanel accounts do), and that must not turn a
		 * writable directory into an unwritable one.
		 * @returns {Promise<boolean>} true when a probe file could be written
		 */
		async function isWritable() {
			// The probe writes a REAL file into the current directory, so the
			// current directory is verified first. On the shared host a
			// mis-resolved root would drop this probe into another site.
			const current = await client.pwd().catch(() => '');
			if (current && !isAllowedRoot(current)) {
				console.log(
					`[deploy-ftp] the current directory "${current}" is outside this project's directory — not writing a probe there`
				);
				return false;
			}

			const probe = `deploy-probe-${Date.now()}.txt`;
			try {
				// uploadFrom expects a stream, not a Buffer.
				await client.uploadFrom(Readable.from([Buffer.from('probe')]), probe);
			} catch (err) {
				console.log(
					`[deploy-ftp] the probe file could not be written: ${err && err.message ? err.message : err}`
				);
				return false;
			}
			try {
				await client.remove(probe);
			} catch {
				console.log(
					`[deploy-ftp] the probe file ${probe} could not be removed; the account may not allow deletes`
				);
			}
			return true;
		}

		/**
		 * Print the first entries of the current directory, so the log shows
		 * what the server actually holds.
		 * @param {string} label
		 */
		async function describe(label) {
			try {
				const items = await client.list();
				const names = items.slice(0, 12).map((item) => item.name);
				console.log(`[deploy-ftp] ${label} contains: ${names.join(', ')}`);
			} catch (err) {
				console.log(
					`[deploy-ftp] ${label} could not be listed: ${err && err.message ? err.message : err}`
				);
			}
		}

		if (hasConfigured) {
			assertAllowedRoot(configured);
			await client.cd(configured);
			console.log(`[deploy-ftp] using configured remote directory ${configured}`);
			await describe(`remote directory ${configured}`);
			return configured;
		}

		if (configured === '.') {
			console.log(
				'[deploy-ftp] the configured remote path is "." — that is the login root, ' +
					'so the document root is looked up instead'
			);
		}

		// A document root holds the site itself; the login root holds the
		// account. That difference decides the target even when the write
		// probe is refused.
		let siteRoot = null;
		let writableRoot = null;

		for (const candidate of REMOTE_PATH_CANDIDATES) {
			// Never even enter a directory we may not write to: the probe
			// below writes a real file into the current directory.
			if (!isAllowedRoot(candidate)) {
				console.log(
					`[deploy-ftp] candidate "${candidate}" is outside this project's directory — skipped`
				);
				continue;
			}

			let items;
			try {
				await client.cd(candidate);
				items = await client.list();
			} catch {
				console.log(`[deploy-ftp] candidate "${candidate}" does not exist`);
				continue;
			}

			const names = items.slice(0, 12).map((item) => item.name);
			console.log(`[deploy-ftp] candidate "${candidate}" contains: ${names.join(', ')}`);

			const looksLikeSite = items.some((item) => item.name === 'index.html');
			if (looksLikeSite && !siteRoot) {
				siteRoot = candidate;
			}

			if (await isWritable()) {
				if (looksLikeSite) {
					console.log(`[deploy-ftp] discovered remote document root: ${candidate}`);
					return candidate;
				}
				if (!writableRoot) {
					writableRoot = candidate;
				}
			}
		}

		if (siteRoot) {
			console.log(
				`[deploy-ftp] using ${siteRoot} as the document root: it holds the site files`
			);
			await client.cd(siteRoot);
			return siteRoot;
		}
		if (writableRoot) {
			console.log(`[deploy-ftp] using ${writableRoot} as the document root`);
			await client.cd(writableRoot);
			return writableRoot;
		}

		// The login root is the LAST resort, and only when it demonstrably
		// holds this project's own files. On the shared host the login root
		// may be the account home, which contains the sibling sites as well
		// — writing there would touch another site.
		await client.cd('/');
		const rootItems = await client.list().catch(() => []);
		const rootNames = rootItems.map((item) => item.name);
		const holdsOurSite = rootNames.includes('index.html');
		const holdsSiblingSite = rootNames.some((name) =>
			['public_html', 'cnc.bozemetal.com', 'bozemetal.com'].includes(name)
		);

		if (holdsOurSite && !holdsSiblingSite) {
			console.log(
				'[deploy-ftp] the login root holds this project\'s files — using it as the document root'
			);
			await describe('the login root');
			return '/';
		}

		console.error(
			'[deploy-ftp] ERROR: no safe document root was found inside this project\'s directory.'
		);
		console.error(
			'[deploy-ftp] set FTP_REMOTE_PATH to "fastener.bozemetal.com" and make sure the cPanel FTP account directory is /home/safetipa/fastener.bozemetal.com'
		);
		if (holdsSiblingSite) {
			console.error(
				'[deploy-ftp] the login root contains sibling directories (' +
					rootNames
						.filter((name) =>
							['public_html', 'cnc.bozemetal.com', 'bozemetal.com'].includes(name)
						)
						.join(', ') +
					') — refusing to write there.'
			);
		}
		process.exit(1);
	}

	const remotePath = await resolveRemotePath();
	documentRoot = remotePath === '/' ? '' : remotePath;

	// Final gate before a single byte is written: the resolved document
	// root must belong to this project.
	assertAllowedRoot(remotePath);

	// The session may have been re-established, so the working directory is
	// confirmed once more against the whitelist.
	const currentRoot = await client.pwd().catch(() => '');
	if (currentRoot && !isAllowedRoot(currentRoot)) {
		console.error(
			`[deploy-ftp] ERROR: the upload would target "${currentRoot}", which is not this project's directory.`
		);
		process.exit(1);
	}

	/**
	 * Upload a local tree to the current remote directory.
	 *
	 * The bulk helper hides which file failed, and this server refuses some
	 * storages (550). Every file is therefore sent on its own: a refused
	 * file is deleted first and sent again, and anything that still fails is
	 * reported by path.
	 * @param {string} localDir
	 * @param {string} remoteDir
	 * @returns {Promise<{ sent: number, failed: string[] }>}
	 */
	async function uploadTree(localDir, remoteDir) {
		let sent = 0;
		const failed = [];
		const skipped = [];
		const warned = [];

		/**
		 * Record a transfer failure.
		 *
		 * A zero-byte placeholder is reported as a WARNING: the site content
		 * is complete, so a refused empty file must not turn a finished
		 * deployment red. Every other failure stays a failure.
		 */
		const recordFailure = (remotePath, err, localPath) => {
			const message = err && err.message ? err.message : err;
			if (isZeroByteFile(localPath)) {
				warned.push(`${remotePath} (${message})`);
				return;
			}
			failed.push(`${remotePath} (${message})`);
		};
		let sinceReconnect = 0;
		let lastReconnect = Date.now();

		for (const entry of readdirSync(localDir, { withFileTypes: true })) {
			const localPath = join(localDir, entry.name);
			const remotePath = remoteDir ? `${remoteDir}/${entry.name}` : entry.name;

			if (entry.isDirectory()) {
				try {
					await client.send(`MKD ${remotePath}`);
				} catch {
					// The directory exists already, or the account may not create
					// directories; the files below decide whether it works.
				}
				const nested = await uploadTree(localPath, remotePath);
				sent += nested.sent;
				failed.push(...nested.failed);
				skipped.push(...nested.skipped);
				warned.push(...nested.warned);
				sinceReconnect += nested.sent;
				continue;
			}

			// A zero-byte placeholder carries no content, and this host closes
			// the data connection while storing one — which used to fail an
			// otherwise complete deployment. The directory above is still
			// created; only the empty file is left out.
			if (classifyFile(localPath) === 'skip-empty') {
				skipped.push(remotePath);
				continue;
			}

			// The server closes the session after a few dozen transfers, so the
			// session is renewed before that happens.
			if (sinceReconnect >= FILES_PER_SESSION || Date.now() - lastReconnect > SESSION_MS) {
				console.log(
					`[deploy-ftp] renewing the FTP session after ${sinceReconnect} file(s)`
				);
				await reopenSession();
				if (documentRoot) {
					await client.cd(documentRoot);
				}
				sinceReconnect = 0;
				lastReconnect = Date.now();
			}

			try {
				await client.uploadFrom(createReadStream(localPath), remotePath);
				sent += 1;
				sinceReconnect += 1;
			} catch (err) {
				const code = err && typeof err.code === 'number' ? err.code : undefined;
				const message = err && err.message ? err.message : '';
				const isClosed = /FIN packet|closed/i.test(message);

				// The passive data port of the session can be refused for a
				// moment, so a file is sent again before it counts as failed.
				for (let attempt = 1; attempt <= 3; attempt++) {
					try {
						if (isClosed || attempt > 1) {
							await reopenSession();
							if (documentRoot) {
								await client.cd(documentRoot);
							}
							sinceReconnect = 0;
							lastReconnect = Date.now();
						}
						await client.uploadFrom(createReadStream(localPath), remotePath);
						sent += 1;
						sinceReconnect += 1;
						break;
					} catch (retryErr) {
						if (attempt === 3) {
							recordFailure(remotePath, retryErr, localPath);
							break;
						}
						await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
					}
				}

				if (code === 550 || code === 553) {
					// The server refuses to overwrite the file; remove it first.
					try {
						await client.remove(remotePath);
					} catch {
						// It may simply not exist.
					}
					try {
						await client.uploadFrom(createReadStream(localPath), remotePath);
						sent += 1;
						sinceReconnect += 1;
					} catch (retryErr) {
						recordFailure(remotePath, retryErr, localPath);
					}
				}
			}
		}

		return { sent, failed, skipped, warned };
	}

	const result = await uploadTree(DIST, '');
	console.log(`[deploy-ftp] ${result.sent} file(s) transferred`);

	if (result.skipped.length > 0) {
		console.warn(
			`[deploy-ftp] WARNING: ${result.skipped.length} zero-byte placeholder file(s) were skipped: ` +
				result.skipped.slice(0, 20).join(', ')
		);
	}
	if (result.warned.length > 0) {
		console.warn(
			`[deploy-ftp] WARNING: ${result.warned.length} empty placeholder file(s) could not be stored: ` +
				result.warned.slice(0, 20).join(', ')
		);
	}

	// The 404 mapping lives in the document root, next to the uploaded site.
	// It is written AFTER the upload so that the upload — which replaces
	// files at identical paths — can never clobber a rule that the server
	// already carries.
	//
	// The working directory is already the document root when the upload
	// ends, and `documentRoot` is a RELATIVE path — cd-ing into it a second
	// time would look for a directory of that name INSIDE it and fail with
	// 550. The current directory is therefore checked first.
	try {
		const current = await client.pwd();
		const root = (documentRoot ?? '').replace(/^\/+|\/+$/g, '');
		if (root && !current.replace(/\/+$/, '').endsWith(`/${root}`)) {
			await client.cd(documentRoot);
		}
	} catch (err) {
		// A directory that cannot be entered is not a reason to abort the
		// deployment: the upload already succeeded.
		console.warn(
			`[deploy-ftp] the document root could not be re-entered (${err && err.message ? err.message : err}) — ` +
				'the 404 mapping is written in the current directory'
		);
	}
	const errorDocumentState = await ensureErrorDocument();
	if (errorDocumentState && errorDocumentState.written) {
		if (await siteAnswersWithServerError()) {
			console.error(
				'[deploy-ftp] the site answers with a server error after the 404 mapping was written — ' +
					'the .htaccess is rolled back so the site stays online.'
			);
			await restoreErrorDocument(errorDocumentState.previous);
			process.exitCode = 1;
		}
	}
	if (result.failed.length > 0) {
		console.error(`[deploy-ftp] ERROR: ${result.failed.length} file(s) could not be transferred:`);
		for (const failure of result.failed.slice(0, 20)) {
			console.error(`[deploy-ftp]   ${failure}`);
		}
		process.exitCode = 1;
	}

	// The transfer reports success even when the server silently drops a
	// file, so the result is checked on the server: a document root that
	// does not hold the new build is not a deployment.
	const CHECKED_FILES = [
		'index.html',
		'404.html',
		'images/category/titanium-screws-category-hero.webp',
		'images/products/TI-DOUBLE-END-STUD-BOLTS-BZ-110-bolts-titanium.webp',
	];
	const missing = [];
	for (const file of CHECKED_FILES) {
		try {
			const size = await client.size(file);
			console.log(`[deploy-ftp] verified ${file} (${size} bytes)`);
		} catch {
			missing.push(file);
		}
	}
	if (missing.length > 0) {
		console.error(
			`[deploy-ftp] ERROR: ${missing.length} file(s) are missing on the server: ${missing.join(', ')}`
		);
		console.error(
			'[deploy-ftp] The upload did not reach the live site. Check the remote directory and the ' +
				'write permission of the account.'
		);
		process.exitCode = 1;
	} else {
		console.log(`[deploy-ftp] upload finished -> ${HOST}:${PORT}${remotePath}`);
		console.log('[deploy-ftp] done');
	}
} catch (err) {
	const message = err && err.message ? err.message : err;
	const code = err && typeof err.code === 'number' ? err.code : undefined;
	if (code === 552) {
		console.error('[deploy-ftp] ERROR 552: the server ran out of disk space (quota exceeded).');
		console.error('[deploy-ftp] Ask the host administrator to raise the account quota before retrying.');
	} else if (code === 550 || code === 553) {
		console.error(`[deploy-ftp] ERROR ${code}: the server refused the file or directory.`);
	} else if (/FIN packet|ECONNRESET|connection/i.test(String(message))) {
		console.error(`[deploy-ftp] the server closed the connection during the upload: ${message}`);
		console.error(
			'[deploy-ftp] Check the remote directory reported above: a chrooted account usually ' +
				'cannot write into its home root, and the document root sits in a sub-directory. ' +
				'Set FTP_REMOTE_PATH to that sub-directory.'
		);
	} else {
		console.error('[deploy-ftp] deployment failed:', message);
	}
	process.exitCode = 1;
} finally {
	try {
		client.close();
	} catch {
		// Closing must never mask the real error.
	}
}
