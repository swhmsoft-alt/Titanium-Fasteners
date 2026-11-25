#!/usr/bin/env node
/**
 * scripts/check-404.mjs — the local 404 acceptance gate.
 *
 * WHY
 * ---
 * The custom 404 page (`src/pages/404.astro` -> `dist/404.html`) is the only
 *承接点 for a visitor who lands on a URL that does not exist. On the live
 * host the mapping is done by Apache/LiteSpeed via
 * `ErrorDocument 404 /404.html` in the document root's `.htaccess`
 * (written by scripts/deploy-ftp-ci.mjs -> ensureErrorDocument()).
 *
 * The trap: `astro dev` and `astro preview` do NOT reproduce that mapping.
 * Astro's own dev-server middleware
 * (node_modules/astro/dist/vite-plugin-astro-server/trailing-slash.js)
 * answers every extension-less URL that lacks a trailing slash with its own
 * built-in 404 template BEFORE the Astro routing pipeline runs — so
 * `src/pages/404.astro` and `src/middleware.ts` never get a chance to render.
 * With `trailingSlash: 'always'` that is:
 *     /no-such-page/   -> the custom 404 page        (correct)
 *     /no-such-page    -> an Astro template page     (dev-server artefact)
 * The production host does not behave that way: with the ErrorDocument
 * mapping in place BOTH forms serve dist/404.html with a 404 status.
 *
 * This script therefore does not trust the dev server. It reproduces the
 * PRODUCTION behaviour locally and asserts it:
 *   1. dist/404.html exists and carries the expected markers.
 *   2. A local static server mimics LiteSpeed: real files are served as
 *      they are, anything else falls back to dist/404.html with status 404
 *      (the ErrorDocument 404 /404.html semantics).
 *   3. Unknown URLs are requested in every shape a visitor can type —
 *      with a trailing slash, without one, nested, and with a query string —
 *      and every one of them must answer 404 WITH the custom page body.
 *
 * USAGE
 * -----
 *   node scripts/check-404.mjs              # human report, exit 1 on failure
 *   node scripts/check-404.mjs --quiet      # only the summary line
 *
 * Requires `dist/` to exist (run `npm run build` first).
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createServer } from 'node:http';

const DIST = 'dist';
const argv = process.argv.slice(2);
const quiet = argv.includes('--quiet');

/* ── 1. the artefact itself ──────────────────────────────────────────────── */

const NOT_FOUND_PAGE = join(DIST, '404.html');

if (!existsSync(NOT_FOUND_PAGE)) {
	console.error('[check-404] dist/404.html not found — run `npm run build` first.');
	process.exit(2);
}

const page = readFileSync(NOT_FOUND_PAGE, 'utf8');

/**
 * Markers that must survive any future edit of the 404 page. They are the
 * page's contract with the visitor and with search engines:
 *   - noindex, nofollow  : the page must never be indexed
 *   - canonical /404.html : the canonical URL stays the flat file
 *   - the visible h1     : the visitor must see "Page not found"
 *   - the three CTAs     : a dead end is a lost lead
 *   - the four entrances : the traffic hand-off to the real sections
 */
const MARKERS = [
	{ name: 'noindex, nofollow', test: (h) => h.includes('content="noindex, nofollow"') },
	{ name: 'canonical /404.html', test: (h) => /rel=["']canonical["'][^>]*\/404\.html/.test(h) },
	{ name: 'h1 "Page not found"', test: (h) => h.includes('Page not found') },
	{ name: 'CTA "Back to homepage"', test: (h) => h.includes('Back to homepage') },
	{ name: 'CTA "Go back"', test: (h) => h.includes('Go back') },
	{ name: 'CTA "Send us an inquiry instead"', test: (h) => h.includes('Send us an inquiry instead') },
	{ name: 'entry /products/', test: (h) => h.includes('href="/products/"') },
	{ name: 'entry /product-solutions/', test: (h) => h.includes('href="/product-solutions/"') },
	{ name: 'entry /services/', test: (h) => h.includes('href="/services/"') },
	{ name: 'entry /contact/', test: (h) => h.includes('href="/contact/"') },
];

/**
 * The Astro dev/preview 404 template. If it ever shows up in a response we
 * are looking at the dev server's trailing-slash artefact, not our page.
 */
const ASTRO_TEMPLATE_MARKERS = ['trailingSlash', 'Do you want to go to'];

const failures = [];
const results = [];

for (const marker of MARKERS) {
	if (!marker.test(page)) {
		failures.push(`dist/404.html is missing the marker: ${marker.name}`);
	}
}

/* ── 2. a server that behaves like the production host ───────────────────── */

const MIME = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webp': 'image/webp',
	'.avif': 'image/avif',
	'.ico': 'image/x-icon',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.txt': 'text/plain; charset=utf-8',
	'.xml': 'application/xml; charset=utf-8',
};

/**
 * Resolve a request path inside dist/ the way a static host does.
 * Returns the file to serve, or null when the path does not exist.
 */
function resolveFile(pathname) {
	const clean = decodeURIComponent(pathname.split('?')[0]);
	const relative = clean.replace(/^\/+/, '');
	const candidate = join(DIST, relative);
	// A directory means the host serves its index.html (trailingSlash: always).
	const indexCandidate = join(candidate, 'index.html');
	if (existsSync(indexCandidate) && statSync(indexCandidate).isFile()) {
		return indexCandidate;
	}
	if (existsSync(candidate) && statSync(candidate).isFile()) {
		return candidate;
	}
	return null;
}

const server = createServer((req, res) => {
	const url = new URL(req.url ?? '/', 'http://localhost');
	const file = resolveFile(url.pathname);

	if (file) {
		const body = readFileSync(file);
		res.writeHead(200, {
			'content-type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
			'content-length': body.length,
		});
		res.end(body);
		return;
	}

	// ErrorDocument 404 /404.html — the production fallback.
	const body = readFileSync(NOT_FOUND_PAGE);
	res.writeHead(404, {
		'content-type': 'text/html; charset=utf-8',
		'content-length': body.length,
	});
	res.end(body);
});

/* ── 3. probe every shape a visitor can type ─────────────────────────────── */

const PROBES = [
	{ path: '/products/din-titanium-fasteners/1/', label: 'nested unknown, trailing slash' },
	{ path: '/products/din-titanium-fasteners/1', label: 'nested unknown, no trailing slash' },
	{ path: '/no-such-page-xyz/', label: 'top-level unknown, trailing slash' },
	{ path: '/no-such-page-xyz', label: 'top-level unknown, no trailing slash' },
	{ path: '/no-such-page-xyz/?utm_source=probe', label: 'unknown with query string' },
	{ path: '/404/', label: 'the 404 route itself' },
];

const PORT = await new Promise((resolve) => {
	server.listen(0, '127.0.0.1', () => resolve(server.address().port));
});

for (const probe of PROBES) {
	const response = await fetch(`http://127.0.0.1:${PORT}${probe.path}`, { redirect: 'manual' });
	const body = await response.text();
	const isAstroTemplate = ASTRO_TEMPLATE_MARKERS.some((m) => body.includes(m));
	const isOurs = body.includes('Page not found');

	let ok = response.status === 404 && isOurs && !isAstroTemplate;
	if (!ok) {
		failures.push(
			`${probe.path} (${probe.label}) answered ${response.status}` +
				(isOurs ? '' : ' without the custom 404 page') +
				(isAstroTemplate ? ' — got the Astro dev-server trailing-slash template' : ''),
		);
	}
	results.push({ path: probe.path, label: probe.label, status: response.status, ok, isOurs, isAstroTemplate });
}

server.closeAllConnections();
server.close();

/* ── report ──────────────────────────────────────────────────────────────── */

if (!quiet) {
	console.log('\n[check-404] local 404 acceptance (production ErrorDocument semantics)\n');
	for (const r of results) {
		const mark = r.ok ? 'PASS' : 'FAIL';
		const note = r.isAstroTemplate ? '  <- Astro dev template' : '';
		console.log(`  ${mark}  ${String(r.status).padEnd(4)} ${r.path}  (${r.label})${note}`);
	}
	console.log('');
}

const summary = `[check-404] ${results.filter((r) => r.ok).length}/${results.length} probes correct, ${MARKERS.length} markers checked`;
if (failures.length) {
	console.error(`${summary} — FAILED`);
	for (const failure of failures) console.error(`  - ${failure}`);
	// Set the code instead of calling process.exit(): the HTTP server has just
	// been closed and a forced exit during its teardown crashes node on Windows.
	process.exitCode = 1;
} else {
	console.log(`${summary} — OK`);
}
