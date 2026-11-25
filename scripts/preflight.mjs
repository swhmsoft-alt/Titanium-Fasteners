/**
 * scripts/preflight.mjs — 开工闸门：把 `.clinerules` 的"充分性"
 * 从散文变成可执行检查。❌ 存在时退出码 2，调用方不得进入写入阶段。
 *
 * 用法：
 *   npm run preflight -- <slug>
 *   npm run preflight -- industries --write
 *
 * 检查项（缺任何一项即 FAIL）：
 *   1. 路由与文件落点   src/pages/ 下的 slug 路由，或 src/data/slug.ts
 *   2. 真相源就绪       data/products/*.csv 存在且非空（Phase B 内容源）
 *   3. 生成产物新鲜     src/data/products/ 已生成且不早于真相源
 *   4. 素材本地路径     public/images/** 的 manifest 映射文件均存在
 *   5. 数据闸门         npm run gen:products 的 error 数为 0
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
/* slug 里的连字符可代表路径层级：industries-aerospace-uav → industries/aerospace/uav */
const nested = slug.replace(/-/g, '/');
const pageCandidates = [
	`src/pages/${slug}.astro`,
	`src/pages/${slug}/index.astro`,
	`src/pages/${nested}.astro`,
	`src/pages/${nested}/index.astro`,
];
const dataCandidates = [
	`src/data/${slug}.ts`,
	`src/data/${slug}/index.ts`,
];
/* 动态路由：族页 /products/[category]/[family]、分类页 /products/[category]
 * —— 文件名里的方括号是 Astro 的动态参数，slug 走 getStaticPaths，不体现在文件名中。
 * 因此这里判定「该 slug 是否被某个动态路由承载」：看动态路由文件存在即可。 */
const dynamicRoutes = [
	'src/pages/products/[category]/[family].astro',
	'src/pages/products/[category]/index.astro',
	'src/pages/product-solutions/product-categories-and-brands/[slug].astro',
	'src/pages/services/benefits/[slug].astro',
	'src/pages/services/[family]/[slug].astro',
];
const foundDynamic = dynamicRoutes.find((p) => existsSync(p));
const foundPage = pageCandidates.find((p) => existsSync(p));
const foundData = dataCandidates.find((p) => existsSync(p));
const routeOk = Boolean(foundPage || foundData || foundDynamic);
check(
	'route',
	'路由与文件落点',
	routeOk,
	routeOk
		? `data=${foundData ?? '(none)'} page=${foundPage ?? '(none)'} dynamic=${foundDynamic ?? '(none)'}`
		: `none of: ${[...pageCandidates, ...dataCandidates].join(', ')}`,
);

/* ── 2. 真相源就绪 ─────────────────────────────────────────────────── */
const truthDir = 'data/products';
const requiredTruth = ['families.csv', 'categories.csv', 'standards.csv', 'materials.csv'];
const missingTruth = requiredTruth.filter((f) => !existsSync(`${truthDir}/${f}`));
let truthSize = 0;
try {
	truthSize = statSync(truthDir).isDirectory() ? readdirSync(truthDir).length : 0;
} catch {
	truthSize = 0;
}
check(
	'truth',
	'真相源就绪',
	missingTruth.length === 0 && truthSize > 0,
	missingTruth.length
		? `missing ${missingTruth.join(', ')}`
		: `${truthDir}/ — ${truthSize} entries`,
);

/* ── 3. 生成产物新鲜 ───────────────────────────────────────────────── */
const gateReport = 'qa/.session/products-gate.json';
const newestTruth = Math.max(
	...readdirSync(truthDir)
		.filter((f) => f.endsWith('.csv'))
		.map((f) => statSync(`${truthDir}/${f}`).mtimeMs),
);
let genOk = false;
let genDetail = `missing ${gateReport} — run: npm run gen:products`;
if (existsSync(gateReport)) {
	try {
		const g = JSON.parse(readFileSync(gateReport, 'utf8'));
		const gateTruth = Number(g.truthMtime ?? 0);
		genOk = gateTruth >= newestTruth;
		genDetail = genOk
			? `src/data/products/ up to date (${g.families ?? '?'} families)`
			: 'STALE — 真相源比上次闸门新，跑: npm run gen:products';
	} catch {
		genDetail = `${gateReport} unreadable`;
	}
}
check('generated', '生成产物新鲜', genOk, genDetail);

/* ── 4. 素材本地路径 ───────────────────────────────────────────────── */
let assetsOk = true;
let assetsDetail = 'no manifest found (skipped)';
const imgRoot = 'public/images';
if (existsSync(imgRoot)) {
	const missingFiles = [];
	let manifests = 0;
	const walk = (dir) => {
		for (const e of readdirSync(dir, { withFileTypes: true })) {
			const full = `${dir}/${e.name}`;
			if (e.isDirectory()) walk(full);
			else if (e.name === '_manifest.json') {
				manifests++;
				const m = JSON.parse(readFileSync(full, 'utf8'));
				for (const v of Object.values(m)) {
					const p = String(v).replace(/^\/public\//, 'public/');
					if (!existsSync(p)) missingFiles.push(p);
				}
			}
		}
	};
	walk(imgRoot);
	assetsOk = missingFiles.length === 0;
	assetsDetail = manifests
		? `${manifests} manifests, missing files: ${missingFiles.length}`
		: 'no manifests';
	if (missingFiles.length) {
		assetsDetail += ` → ${missingFiles.slice(0, 3).join(', ')}`;
	}
}
check('assets', '素材本地路径', assetsOk, assetsDetail);

/* ── 5. 数据闸门（gen:products error 数） ──────────────────────────── */
let gateOk = false;
let gateDetail = `missing ${gateReport} — run: npm run gen:products`;
if (existsSync(gateReport)) {
	try {
		const g = JSON.parse(readFileSync(gateReport, 'utf8'));
		gateOk = Number(g.errors ?? 0) === 0;
		gateDetail = `errors=${g.errors ?? '?'} warnings=${g.warnings ?? '?'}`;
	} catch {
		gateDetail = `${gateReport} unreadable`;
	}
}
check('gate', '数据闸门', gateOk, gateDetail);

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
