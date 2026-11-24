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

import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from 'basic-ftp';

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
// the document root in a sub-directory rather than at the login root. The
// candidates below are the domain names the server actually uses.
const CONFIGURED_REMOTE_PATH = (
	process.env.FTP_REMOTE_PATH ??
	process.env.FTP_DIR ??
	''
)
	.trim();

const REMOTE_PATH_CANDIDATES = [
	'fastener.bozemetal.com',
	'public_html',
	'www.fastener.bozemetal.com',
	'bozemetal.com',
];

// Which sets are available? Only the NAMES are printed, never the values,
// so a misconfigured secret stays visible in the log without leaking.
console.log(
	`[deploy-ftp] credential sets available: ${usableSets
		.map((set) => `${set.user}+${set.password}`)
		.join(', ')} | path=${CONFIGURED_REMOTE_PATH ? 'configured' : 'auto-discover'}`
);

/* ── step 2: validate build output ──────────────────────────────────────── */

if (!existsSync(DIST) || !statSync(DIST).isDirectory()) {
	console.error('[deploy-ftp] ERROR: dist/ not found — run `npm run build` before deploying.');
	process.exit(1);
}

/* ── steps 3-7: connect, upgrade, upload ────────────────────────────────── */

let client = new Client(60 * 1000);

// The host may present a cPanel shared certificate that does not cover the
// subdomain (its altnames list only *.serverhostgroup.com). The name can be
// pinned with FTP_TLS_SERVERNAME; FTP_TLS_STRICT=true forbids the fallback.
const TLS_SERVERNAME = (process.env.FTP_TLS_SERVERNAME ?? '').trim() || HOST;
const TLS_STRICT = (process.env.FTP_TLS_STRICT ?? 'false').trim().toLowerCase() === 'true';

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
	try {
		await client.connect(HOST, PORT);
		await client.useTLS(
			{ servername: TLS_SERVERNAME, minVersion: 'TLSv1.2', rejectUnauthorized: true },
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
		console.warn(
			`[deploy-ftp] The certificate of ${HOST} does not cover that name, so the handshake ` +
				'is retried with the certificate the server presents. The channel stays encrypted, ' +
				'but the server identity is no longer verified — ask the host to install a ' +
				'certificate for this subdomain, or set FTP_TLS_SERVERNAME to a name it covers.'
		);

		try {
			client.close();
		} catch {
			// The failed socket is already unusable; closing must not mask the error.
		}
		client = new Client(60 * 1000);
		await client.connect(HOST, PORT);
		await client.useTLS(
			{ servername: TLS_SERVERNAME, minVersion: 'TLSv1.2', rejectUnauthorized: false },
			'AUTH TLS'
		);
	}
}

/**
 * Connect and log in with the first credential set the server accepts.
 *
 * @returns {Promise<string>} the name of the credential set that worked
 */
async function connectAndLogin() {
	const failures = [];

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
			return set.user;
		} catch (err) {
			const message = err && err.message ? err.message : String(err);
			console.warn(`[deploy-ftp] ${set.user} was rejected: ${message}`);
			failures.push(`${set.user}: ${message}`);
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
	process.exit(1);
}

try {
	console.log(`[deploy-ftp] connecting to ${HOST}:${PORT} (explicit FTPS)`);
	await connectAndLogin();

	// PBSZ 0 / PROT P — protect the DATA channel as well.
	await client.send('PBSZ 0');
	await client.send('PROT P');

	await client.send('TYPE I');

	const pwd = await client.pwd();
	console.log(`[deploy-ftp] logged in, remote PWD = ${pwd}`);

	/**
	 * Resolve the directory that IS the site document root.
	 *
	 * A configured path wins. Otherwise the known candidates are probed: the
	 * first one that can be entered AND listed is used. Falling back to the
	 * login root is the last resort, because uploading into the wrong
	 * directory silently publishes nothing.
	 * @returns {Promise<string>} the directory to upload into
	 */
	async function resolveRemotePath() {
		if (CONFIGURED_REMOTE_PATH && CONFIGURED_REMOTE_PATH !== '/') {
			await client.cd(CONFIGURED_REMOTE_PATH);
			console.log(`[deploy-ftp] using configured remote directory ${CONFIGURED_REMOTE_PATH}`);
			return CONFIGURED_REMOTE_PATH;
		}

		for (const candidate of REMOTE_PATH_CANDIDATES) {
			try {
				await client.cd(candidate);
				await client.list();
				console.log(`[deploy-ftp] discovered remote document root: ${candidate}`);
				return candidate;
			} catch {
				console.log(`[deploy-ftp] candidate "${candidate}" is not usable, trying the next one`);
			}
		}

		console.log('[deploy-ftp] no candidate matched — using the login root as the document root');
		return '/';
	}

	const remotePath = await resolveRemotePath();

	await client.uploadFromDir(DIST);

	console.log(`[deploy-ftp] upload finished -> ${HOST}:${PORT}${remotePath}`);
	console.log('[deploy-ftp] done');
} catch (err) {
	const code = err && typeof err.code === 'number' ? err.code : undefined;
	if (code === 552) {
		console.error('[deploy-ftp] ERROR 552: the server ran out of disk space (quota exceeded).');
		console.error('[deploy-ftp] Ask the host administrator to raise the account quota before retrying.');
	} else if (code === 550 || code === 553) {
		console.error(`[deploy-ftp] ERROR ${code}: the server refused the file or directory.`);
	} else {
		console.error('[deploy-ftp] deployment failed:', err && err.message ? err.message : err);
	}
	process.exitCode = 1;
} finally {
	try {
		client.close();
	} catch {
		// Closing must never mask the real error.
	}
}
