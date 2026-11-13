/**
 * scripts/preflight.mjs — 开工闸门：把 `.clinerules` §8.1 的"五项充分性"
 * 从散文变成可执行检查。❌ 存在时退出码 2，调用方不得进入写入阶段。
 *
 * 用法：
 *   npm run preflight -- <slug>
 *   npm run preflight -- industries --write
 *
 * 检查项（缺任何一项即 FAIL）：
 *   1. 路由与文件落点   src/pages/ 下的 slug 路由，或 src/data/slug.ts
 *   2. DOM 层级与区块   qa/report/<slug>/08-dom-tree.txt
 *   3. 文案与链接       qa/report/<slug>/02-texts.txt + 05-links.txt
 *   4. 素材本地路径     public/images/<slug>/_manifest.json（且每条映射的文件存在）
 *   5. 验收基线         qa/targets/<slug>.json
 *
 * 另外强制检查会话预算（scripts/lib/session-budget.mjs）与 qa/ 残留探针。
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { LIMITS, scratchFiles, violations, recordTool } from './lib/session-budget.mjs';

const slug = process.argv[2];
const writeMode = process.argv.includes('--write');

if (!slug) {
	console.error('usage: node scripts/preflight.mjs <slug> [--write]');
	process.exit(1);
}
recordTool('exploration');

const results = [];
const check = (id, label, ok, detail) => results.push({ id, label, ok, detail });

/* ── 1. 路由与文件落点 ─────────────────────────────────────────────── */
/* slug 里的连字符可代表路径层级：industries-aerospace → industries/aerospace */
const nested = slug.replace(/-/g, '/');
const pageCandidates = [
	`src/pages/global-en/${slug}.astro`,
	`src/pages/global-en/${slug}/index.astro`,
	`src/pages/global-en/${nested}.astro`,
	`src/pages/global-en/${nested}/index.astro`,
	`src/pages/${slug}.astro`,
	`src/pages/${slug}/index.astro`,
	`src/pages/${nested}.astro`,
];
const dataCandidates = [
	`src/data/${slug}.ts`,
	`src/data/${slug}/index.ts`,
	`src/data/industries-sub/${slug.replace(/^industries-/, '')}.ts`,
];
const foundPage = pageCandidates.find((p) => existsSync(p));
const foundData = dataCandidates.find((p) => existsSync(p));
const routeOk = Boolean(foundPage || foundData);
check(
	'route',
	'路由与文件落点',
	routeOk,
	routeOk
		? `data=${foundData ?? '(none)'} page=${foundPage ?? '(none)'}`
		: `none of: ${[...pageCandidates, ...dataCandidates].join(', ')}`,
);

/* ── 2. DOM 层级与区块顺序 ─────────────────────────────────────────── */
const reportDir = `qa/report/${slug}`;
const domTree = existsSync(reportDir)
	? readdirSync(reportDir).filter((f) => f.startsWith('08-dom-tree'))
	: [];
check(
	'dom',
	'DOM 层级与区块顺序',
	domTree.length > 0,
	domTree.length ? `${reportDir}/${domTree.join(', ')}` : `missing ${reportDir}/08-dom-tree*.txt`,
);

/* ── 3. 文案与链接 ─────────────────────────────────────────────────── */
const textsFile = `${reportDir}/02-texts.txt`;
const linksFile = `${reportDir}/05-links.txt`;
const textsOk = existsSync(textsFile);
const linksOk = existsSync(linksFile);
check(
	'copy',
	'文案与链接',
	textsOk && linksOk,
	`texts=${textsOk ? 'ok' : 'MISSING'} links=${linksOk ? 'ok' : 'MISSING'}`,
);

/* ── 4. 素材本地路径与尺寸 ─────────────────────────────────────────── */
const manifestFile = `public/images/${slug}/_manifest.json`;
let assetsOk = false;
let assetsDetail = `missing ${manifestFile}`;
if (existsSync(manifestFile)) {
	const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
	const entries = Object.entries(manifest);
	const missing = entries.filter(([, v]) => !existsSync(v.replace(/^\/public\//, 'public/')));
	assetsOk = missing.length === 0;
	assetsDetail = `${entries.length} entries, missing files: ${missing.length}`;
	if (missing.length) {
		assetsDetail += ` → ${missing.slice(0, 3).map(([, v]) => v).join(', ')}`;
	}
}
check('assets', '素材本地路径与尺寸', assetsOk, assetsDetail);

/* ── 5. 验收基线 ───────────────────────────────────────────────────── */
const targetFile = `qa/targets/${slug}.json`;
let targetOk = false;
let targetDetail = `missing ${targetFile}`;
if (existsSync(targetFile)) {
	const t = JSON.parse(readFileSync(targetFile, 'utf8'));
	const n = t.sections?.length ?? 0;
	targetOk = n > 0;
	targetDetail = `${n} baseline sections`;
}
check('target', '验收基线', targetOk, targetDetail);

/* ── 会话预算与残留探针 ────────────────────────────────────────────── */
const v = violations();
check(
	'budget',
	'会话预算',
	v.length === 0,
	v.length ? v.map((x) => `${x.rule}: ${x.detail}`).join(' | ') : 'clean',
);
const scratch = scratchFiles();
check(
	'scratch',
	'qa/ 残留探针',
	scratch.length === 0,
	scratch.length ? scratch.join(', ') : 'none',
);

/* ── 输出 ───────────────────────────────────────────────────────────── */
const failed = results.filter((r) => !r.ok);
const pad = Math.max(...results.map((r) => r.label.length)) + 2;
console.log(`# PREFLIGHT ${slug}${writeMode ? ' (--write)' : ''}`);
for (const r of results) {
	console.log(`${r.ok ? '✅' : '❌'} ${r.label.padEnd(pad)} ${r.detail}`);
}
console.log('');
console.log(
	failed.length
		? `FAIL ${failed.length}/${results.length} — ${failed.map((f) => f.id).join(', ')}`
		: `PASS ${results.length}/${results.length}`,
);
console.log(
	`limits: readsPerPath=${LIMITS.readsPerPath} toolCalls=${LIMITS.toolCalls} ` +
		`explorationCalls=${LIMITS.explorationCalls} scratchFiles=${LIMITS.scratchFiles}`,
);

if (failed.length) {
	console.error('\n⛔ 开工闸门未通过 — 禁止进入写入阶段。先补齐上面的 ❌ 项。');
	process.exit(2);
}
process.exit(0);
