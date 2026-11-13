/**
 * scripts/recipe.mjs — ONE COMMAND reference-site pipeline.
 *
 * Give it the reference site's URL and a page name; it performs the three
 * mechanical stages of docs/RECIPE.md back to back:
 *
 *   ① probe    → qa/ref/<page>.json   +  qa/ref/<page>.html   (one browser call)
 *   ② assets   → public/images/<page>/ +  _manifest.json
 *   ③ target   → qa/targets/<page>.json                        (no hand copying)
 *
 * Stages ④ (read the project base) and ⑤ (write the page) are the human/AI
 * part and are printed at the end as a checklist — this script deliberately
 * does NOT try to guess a page's structure.
 *
 * Usage:
 *   node scripts/recipe.mjs <ref-url> [page] [--viewport 1440x1000]
 *                                     [--out-dir public/images/<page>]
 *                                     [--skip-assets]
 *
 * Examples:
 *   node scripts/recipe.mjs https://www.bossard.com/global-en/eshop/ eshop
 *   node scripts/recipe.mjs https://www.bossard.com/us-en/ usen
 *
 * The page name defaults to the last path segment of the URL
 * ("…/global-en/eshop/" -> "eshop").
 */
import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith('--'));
const flag = (name, fallback) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : fallback;
};
const has = (name) => args.includes(name);

const url = positional[0];
if (!url) {
	console.error(
		'usage: node scripts/recipe.mjs <ref-url> [page] [--viewport WxH] [--skip-assets]',
	);
	process.exit(1);
}

/** "https://x.com/global-en/eshop/" -> "eshop" */
const slugFromUrl = (u) => {
	const path = u.split('?')[0].split('#')[0].replace(/\/+$/, '');
	const last = path.split('/').pop() ?? '';
	const slug = last
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	return slug || 'page';
};

const page = positional[1] ?? slugFromUrl(url);
const viewport = flag('--viewport', '1440x1000');
const refDir = 'qa/ref';
const targetDir = 'qa/targets';
const refJson = join(refDir, `${page}.json`);
const refHtml = join(refDir, `${page}.html`);
const targetJson = join(targetDir, `${page}.json`);
const outDir = flag('--out-dir', join('public/images', page));

const run = (label, script, scriptArgs) => {
	console.log(`\n── ${label} ─────────────────────────────────────────────`);
	const r = spawnSync(process.execPath, [script, ...scriptArgs], {
		stdio: 'inherit',
		encoding: 'utf8',
	});
	if (r.status !== 0) {
		console.error(`\n✗ ${label} failed (exit ${r.status}) — stopping.`);
		process.exit(r.status ?? 1);
	}
};

/* ── ① probe ─────────────────────────────────────────────────────────── */
run('① probe reference', 'scripts/probe-ref.mjs', [
	url,
	'--out',
	refJson,
	'--viewport',
	viewport,
]);
if (!existsSync(refJson)) {
	console.error(`\n✗ probe produced no ${refJson} — stopping.`);
	process.exit(1);
}

/* ── ② assets ────────────────────────────────────────────────────────── */
if (has('--skip-assets')) {
	console.log('\n── ② assets ───────────────────────────────────────────');
	console.log('skipped (--skip-assets)');
} else {
	run('② download assets', 'scripts/dl-assets.mjs', [
		refJson,
		'--out-dir',
		outDir,
	]);
}

/* ── ③ target ────────────────────────────────────────────────────────── */
run('③ generate acceptance target', 'scripts/gen-target.mjs', [
	refJson,
	'--out',
	targetJson,
]);

if (!existsSync(targetJson)) {
	console.error(`\n✗ target produced no ${targetJson} — stopping.`);
	process.exit(1);
}

/* ── what is left ────────────────────────────────────────────────────── */
console.log('\n══ artifacts ═════════════════════════════════════════');
for (const f of [refJson, refHtml, targetJson]) {
	const size = existsSync(f) ? `${(statSync(f).size / 1024).toFixed(1)} KB` : 'MISSING';
	console.log(`  ${f.padEnd(34)} ${size}`);
}

console.log('\n══ remaining stages (the AI/you part) ═════════════════');
console.log('  ④ read once: src/styles/global.css, src/config/site.ts,');
console.log('               src/components/layout/SiteHeader.astro + SiteFooter.astro');
console.log('  ⑤ write:');
console.log(`       src/data/${page}.ts`);
console.log(`       src/components/sections/${page}/<Block>.astro`);
console.log(`       src/pages/<route>.astro`);
console.log('  ⑥ verify:');
console.log('       npm run build');
console.log(`       npm run measure -- /<route>/ --target ${targetJson}`);
console.log('\n  Copy the copy text out of', refHtml, '— never re-open the browser.');
console.log('  Known deviations go to qa/DEVIATIONS.md, not into the page.');
