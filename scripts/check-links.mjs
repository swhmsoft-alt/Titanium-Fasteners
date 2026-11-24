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
 *   node scripts/check-links.mjs                    # human report, exit 1 if dead
 *   node scripts/check-links.mjs --quiet            # only the summary line
 *   node scripts/check-links.mjs --json             # machine-readable worklist
 *   node scripts/check-links.mjs --report <path>    # also write the report to <path>
 *
 * `--report` exists so the CI job can publish an audit artefact. Without it
 * the uploaded artefact would always be empty — the report is written even
 * when the gate fails, which is exactly when it is needed.
 *
 * Requires `dist/` to exist (run `npm run build` first).
 */

import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const DIST = 'dist';
const argv = process.argv.slice(2);
const quiet = argv.includes('--quiet');
const asJson = argv.includes('--json');
const reportIndex = argv.indexOf('--report');
const REPORT_PATH = reportIndex !== -1 ? argv[reportIndex + 1] : null;

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

/* ── baseline ────────────────────────────────────────────────────────────── */

/**
 * The site carries a large body of pre-existing dead links (the reference
 * copy links routes that were never rebuilt here). Blocking on all of them
 * would make the gate permanently red and therefore meaningless.
 *
 * The baseline records the dead links that are KNOWN at the time of writing.
 * Only links that are NOT in the baseline fail the gate — so a newly
 * introduced dead link still aborts the deployment, while the inherited debt
 * stays visible in the report without blocking every push.
 *
 * Regenerate deliberately (after fixing pages, or when accepting new debt):
 *   node scripts/check-links.mjs --update-baseline
 */
const BASELINE_FILE = join('scripts', 'lib', 'link-baseline.json');

/** @type {Set<string>} */
let baseline = new Set();
try {
	const raw = JSON.parse(readFileSync(BASELINE_FILE, 'utf8'));
	baseline = new Set(Array.isArray(raw.deadLinks) ? raw.deadLinks : []);
} catch {
	// No baseline yet — every dead link counts.
}

/** Dead links that are NOT covered by the baseline → these block. */
const regressions = entries.filter(([target]) => !baseline.has(target));
/** Dead links that the baseline already knows about → reported, not blocking. */
const inherited = entries.filter(([target]) => baseline.has(target));

if (argv.includes('--update-baseline')) {
	const payload = {
		note: 'Known dead internal links. Regenerate with: node scripts/check-links.mjs --update-baseline',
		deadLinks: entries.map(([target]) => target).sort(),
	};
	mkdirSync(dirname(BASELINE_FILE), { recursive: true });
	writeFileSync(BASELINE_FILE, JSON.stringify(payload, null, 2) + '\n', 'utf8');
	console.log(`[check-links] baseline written to ${BASELINE_FILE} (${payload.deadLinks.length} known dead links)`);
	process.exit(0);
}

/* ── audit report ───────────────────────────────────────────────────────── */

/**
 * Write the audit report to disk. Called on BOTH the pass and the fail path —
 * a report that is only written on success is useless for post-mortems.
 * @param {string} path
 */
function writeReport(path) {
	const lines = [];
	lines.push('# Internal link audit');
	lines.push('');
	lines.push(`- generated: ${new Date().toISOString()}`);
	lines.push(`- pages scanned: ${htmlFiles.length}`);
	lines.push(`- routes: ${routes.size}`);
	lines.push(`- assets: ${assets.size}`);
	lines.push(`- dead internal links: ${entries.length}`);
	lines.push(`- known (baseline, non-blocking): ${inherited.length}`);
	lines.push(`- new (blocking): ${regressions.length}`);
	lines.push(`- result: ${regressions.length ? 'FAIL' : 'OK'}`);
	lines.push('');
	if (regressions.length) {
		lines.push('## New dead links (blocking)');
		lines.push('');
		lines.push('| Target | Linked from |');
		lines.push('| --- | --- |');
		for (const [target, pages] of regressions) {
			lines.push(`| \`${target}\` | ${[...pages].join(', ')} |`);
		}
		lines.push('');
	} else {
		lines.push('No new dead internal links.');
		lines.push('');
	}
	if (inherited.length) {
		lines.push('## Known dead links (baseline, non-blocking)');
		lines.push('');
		for (const [target, pages] of inherited) {
			lines.push(`- \`${target}\` (${pages.size} page(s))`);
		}
		lines.push('');
	}
	try {
		mkdirSync(dirname(path), { recursive: true });
		writeFileSync(path, lines.join('\n'), 'utf8');
		console.log(`[check-links] report written to ${path}`);
	} catch (err) {
		// A failed report write must not mask the gate result.
		console.error(`[check-links] could not write report to ${path}: ${err.message}`);
	}
}

/* ── report ─────────────────────────────────────────────────────────────── */

if (REPORT_PATH) writeReport(REPORT_PATH);

if (asJson) {
	console.log(
		JSON.stringify(
			{
				pages: htmlFiles.length,
				deadCount: entries.length,
				newDeadCount: regressions.length,
				dead: entries.map(([target, pages]) => ({ target, pages: [...pages] })),
			},
			null,
			2,
		),
	);
	process.exit(regressions.length > 0 ? 1 : 0);
}

if (!quiet) {
	for (const [target, pages] of entries) {
		const tag = baseline.has(target) ? 'known' : ' NEW ';
		console.log(`${String(pages.size).padStart(3)} page(s)  [${tag}]  ${target}`);
	}
}

console.log(
	`\n[check-links] ${htmlFiles.length} pages scanned · ${routes.size} routes · ` +
		`${entries.length} dead internal link(s) (${inherited.length} known, ${regressions.length} new)` +
		(regressions.length ? ' — FAIL' : ' — OK'),
);

process.exit(regressions.length > 0 ? 1 : 0);
