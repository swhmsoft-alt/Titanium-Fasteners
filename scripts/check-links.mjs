#!/usr/bin/env node
/**
 * scripts/check-links.mjs — internal link integrity gate.
 *
 * WHY
 * ---
 * This site is a static build, so a link to a page that does not exist is
 * not a soft 404 in the browser — it is a hard 404 at deploy time. The
 * project copies reference-site copy (which links to reference-site routes
 * that were never built here), so dead links are the default failure mode
 * unless something checks them mechanically.
 *
 * WHAT IT DOES
 * ------------
 * Scans the built `dist/` tree:
 *   1. Collects every emitted HTML page -> the set of REAL routes.
 *   2. Collects every emitted asset -> real static files.
 *   3. Reads every `href="..."` in every page and reports internal targets
 *      that resolve to neither a page nor an asset.
 *
 * External links (http/https/mailto/tel) and protocol-relative URLs
 * (`//host/...`) are out of scope — they are not ours to police.
 *
 * USAGE
 * -----
 *   node scripts/check-links.mjs            # human report, exit 1 if dead
 *   node scripts/check-links.mjs --quiet    # only the summary line
 *   node scripts/check-links.mjs --json     # machine-readable worklist
 *
 * Requires `dist/` to exist (run `npm run build` first).
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const argv = process.argv.slice(2);
const quiet = argv.includes('--quiet');
const asJson = argv.includes('--json');

/* ── collect emitted files ─────────────────────────────────────────────── */

const htmlFiles = [];
const assets = new Set();

function walk(dir) {
	let entries;
	try {
		entries = readdirSync(dir, { withFileTypes: true });
	} catch {
		console.error('[check-links] dist/ not found — run `npm run build` first.');
		process.exit(2);
	}
	for (const entry of entries) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			walk(full);
			continue;
		}
		const rel = relative(DIST, full).split(/[\\/]/).join('/');
		assets.add('/' + rel);
		if (entry.name.endsWith('.html')) htmlFiles.push(rel);
	}
}
walk(DIST);

/* ── derive the real route table ───────────────────────────────────────── */

const routes = new Set(['/']);
for (const rel of htmlFiles) {
	if (rel === '404.html') continue;
	if (rel.endsWith('/index.html')) {
		routes.add('/' + rel.slice(0, -'index.html'.length));
	} else {
		routes.add('/' + rel.replace(/\.html$/, '/'));
	}
}

/* ── find dead internal hrefs ──────────────────────────────────────────── */

/** @type {Map<string, Set<string>>} dead target -> pages that link to it */
const dead = new Map();

for (const rel of htmlFiles) {
	const html = readFileSync(join(DIST, rel), 'utf8');
	for (const match of html.matchAll(/href="([^"]*)"/g)) {
		const href = match[1];
		if (!href.startsWith('/')) continue; // external, relative or anchor
		if (href.startsWith('//')) continue; // protocol-relative external
		const path = href.split('#')[0].split('?')[0];
		if (!path) continue; // pure fragment
		if (assets.has(path)) continue; // static file (image, css, sprite…)
		if (routes.has(path)) continue; // real page
		if (routes.has(path.replace(/\/$/, ''))) continue; // trailing-slash variant
		if (!dead.has(path)) dead.set(path, new Set());
		dead.get(path).add(rel);
	}
}

/* ── report ────────────────────────────────────────────────────────────── */

const entries = [...dead.entries()].sort((a, b) => b[1].size - a[1].size || a[0].localeCompare(b[0]));

if (asJson) {
	console.log(
		JSON.stringify(
			{
				pages: htmlFiles.length,
				deadCount: entries.length,
				dead: entries.map(([target, pages]) => ({ target, pages: [...pages] })),
			},
			null,
			2,
		),
	);
	process.exit(entries.length > 0 ? 1 : 0);
}

if (!quiet) {
	for (const [target, pages] of entries) {
		console.log(`${String(pages.size).padStart(3)} page(s)  ${target}`);
	}
}

console.log(
	`\n[check-links] ${htmlFiles.length} pages scanned · ${routes.size} routes · ` +
		`${entries.length} dead internal link(s)` +
		(entries.length ? ' — FAIL' : ' — OK'),
);

process.exit(entries.length > 0 ? 1 : 0);
