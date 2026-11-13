/**
 * scripts/ref-report.mjs — 把 qa/ref/<page>.json 拆成可按需读取的复刻报告。
 *
 * WHY
 * ---
 * probe JSON 动辄 100–200KB（texts 600 条 + links 800 条），直接读进上下文
 * 就是一次小型 token 事故。本脚本把同一份数据投影成**按主题分片**的文本：
 * 结构 / 文案 / 图片 / 网格 / 链接 / 按钮，各自一个文件，读取时只取需要的片。
 *
 * 用法：
 *   node scripts/ref-report.mjs qa/ref/<page>.json [--dir qa/report]
 *                                  [--only sections,texts] [--max-texts 400]
 *
 * 产物：qa/report/<page>/01-sections.txt 等。零依赖，只读 JSON，不碰浏览器。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const SRC = args.find((a) => !a.startsWith('--'));
if (!SRC) {
	console.error('usage: node scripts/ref-report.mjs qa/ref/<page>.json [--dir qa/report]');
	process.exit(1);
}
const flag = (n, d) => {
	const i = args.indexOf(n);
	return i >= 0 ? args[i + 1] : d;
};
const DIR = flag('--dir', 'qa/report');
const only = flag('--only', 'sections,texts,figures,grids,links,buttons,frame');
const want = new Set(only.split(',').map((s) => s.trim()));
const MAX_TEXTS = Number(flag('--max-texts', 400));

const probe = JSON.parse(readFileSync(SRC, 'utf8'));
const PAGE = SRC.replace(/^.*[\\/]/, '').replace(/\.json$/i, '');

/* 参考站的页头/页脚不在 <main> 内，但探针的 texts 仍会捞到导航文案。
 * 用 main 的范围把正文与导航切开（probe 未带 main 时退回 header/footer）。 */
const region = probe.main
	? { top: probe.main.y, bottom: probe.main.y + probe.main.h }
	: {
			top: probe.header ? probe.header.y + probe.header.h : 0,
			bottom: probe.footer ? probe.footer.y : probe.bodyHeight,
		};
const inMain = (t) => t.w > 0 && t.h > 0 && t.y >= region.top - 2 && t.y <= region.bottom + 2;

/** 分片缓冲：每个主题独立成篇。 */
const parts = new Map();
let CUR = '00-index';
const out = (s = '') => {
	if (!parts.has(CUR)) parts.set(CUR, []);
	parts.get(CUR).push(s);
};

/** 文件名末段，用于把 CDN URL 缩成可读 token。 */
const base = (u) => {
	if (!u) return '(none)';
	const s = String(u).split('?')[0];
	return s.slice(s.lastIndexOf('/') + 1) || s;
};

out(`# REF REPORT — ${SRC}`);
out(`url         ${probe.url}`);
out(`title       ${probe.title}`);
out(`viewport    ${probe.viewport.width}x${probe.viewport.height}`);
out(`body        ${probe.bodyHeight}px   overflow ${probe.overflow.scrollWidth - probe.overflow.clientWidth}px`);
out(`sprites     ${probe.sprites.length}`);
out('');

/* ── 区块 ─────────────────────────────────────────────────────────── */
if (want.has('sections')) {
	CUR = '01-sections';
	out('## SECTIONS');
	probe.sections.forEach((s, i) => {
		out(
			`${String(i + 1).padStart(2)} ${s.headTag ?? '--'} ${String(s.headSize ?? '').padEnd(9)} ` +
				`y=${String(s.y).padStart(5)} h=${String(s.h).padStart(5)} x=${String(s.x).padStart(4)} w=${String(s.w).padStart(4)} ` +
				`bg=${s.bg} weight=${s.headWeight ?? ''}`,
		);
		out(`     head: ${s.headText ?? '(none)'}`);
		out(`     cls : ${s.cls}`);
	});
	out('');
}

/* ── 文案（按区块 y 分组） ───────────────────────────────────────── */
if (want.has('texts')) {
	CUR = '02-texts';
	out('## TEXTS (main region only)');
	const texts = probe.texts.filter(inMain).slice(0, MAX_TEXTS);
	let lastY = -1;
	for (const t of texts) {
		if (t.y !== lastY) {
			out(`  -- y=${t.y} --`);
			lastY = t.y;
		}
		out(
			`  ${String(t.tag).padEnd(5)} x=${String(t.x).padStart(4)} y=${String(t.y).padStart(5)} ` +
				`w=${String(t.w).padStart(4)} h=${String(t.h).padStart(4)} fs=${String(t.fs).padEnd(7)} ` +
				`lh=${String(t.lh).padEnd(8)} fw=${String(t.fw).padEnd(4)} ${t.color}`,
		);
		out(`        ${t.text}`);
		out(`        .${t.cls}`);
	}
	out('');
}

/* ── 图片 ─────────────────────────────────────────────────────────── */
if (want.has('figures')) {
	CUR = '03-figures';
	out('## FIGURES');
	const mainFigures = probe.figures.filter(
		(f) => f.w > 0 && f.h > 0 && f.y >= region.top - 2 && f.y <= region.bottom + 2,
	);
	mainFigures.forEach((f, i) => {
		out(
			`${String(i + 1).padStart(2)} y=${String(f.y).padStart(5)} x=${String(f.x).padStart(4)} ` +
				`${f.w}x${f.h} ratio=${f.ratio ?? '-'} aspect=${f.aspect} fit=${f.objectFit} ` +
				`natural=${f.natural ? f.natural.join('x') : '-'}`,
		);
		out(`     alt : ${f.alt ?? '(none)'}`);
		out(`     src : ${base(f.src)}`);
		out(`     cls : ${f.cls}`);
	});
	out('');
	out('## IMAGES (not in figure)');
	probe.images
		.filter(
			(im) =>
				!im.inFigure &&
				im.w > 0 &&
				im.h > 0 &&
				im.y >= region.top - 2 &&
				im.y <= region.bottom + 2,
		)
		.forEach((im, i) => {
		out(
			`${String(i + 1).padStart(2)} y=${String(im.y).padStart(5)} x=${String(im.x).padStart(4)} ` +
				`${im.w}x${im.h} fit=${im.objectFit}`,
		);
		out(`     alt : ${im.alt ?? '(none)'}`);
		out(`     src : ${base(im.src)}`);
	});
	out('');
}

/* ── 网格 ─────────────────────────────────────────────────────────── */
if (want.has('grids')) {
	CUR = '04-grids';
	out('## GRIDS');
	probe.grids.forEach((g, i) => {
		out(`${String(i + 1).padStart(2)} y=${String(g.y).padStart(5)} x=${String(g.x).padStart(4)} w=${g.w} gap=${g.gap}`);
		out(`     cols: ${g.cols}`);
		out(`     cls : ${g.cls}`);
	});
	out('');
}

/* ── 链接 ─────────────────────────────────────────────────────────── */
if (want.has('links')) {
	CUR = '05-links';
	out('## LINKS');
	const seen = new Set();
	for (const l of probe.links) {
		const key = `${l.href}|${l.text}`;
		if (seen.has(key)) continue;
		seen.add(key);
		out(`  ${String(l.text).slice(0, 60).padEnd(62)} ${l.href}`);
	}
	out('');
}

/* ── 按钮 ─────────────────────────────────────────────────────────── */
if (want.has('buttons')) {
	CUR = '06-buttons';
	out('## BUTTONS');
	probe.buttons.forEach((b, i) => {
		out(
			`${String(i + 1).padStart(2)} y=${String(b.y).padStart(5)} x=${String(b.x).padStart(4)} ${b.w}x${b.h} ` +
				`bg=${b.bg} color=${b.color} radius=${b.radius} fs=${b.fontSize}`,
		);
		out(`     ${b.text}`);
		out(`     .${b.cls}`);
	});
	out('');
}

/* ── 页头页脚 ─────────────────────────────────────────────────────── */
if (want.has('frame')) {
	CUR = '07-frame';
	out('## HEADER');
	out(probe.header ? JSON.stringify(probe.header, null, 1) : '(none)');
	out('## FOOTER');
	out(probe.footer ? JSON.stringify(probe.footer, null, 1) : '(none)');
	out('');
}

/* ── 输出：每个主题一个文件，按需读取 ───────────────────────────── */
const outDir = join(DIR, PAGE);
mkdirSync(outDir, { recursive: true });
const written = [];
for (const [name, lines] of parts) {
	if (!lines.length) continue;
	const file = join(outDir, `${name}.txt`);
	writeFileSync(file, lines.join('\n'), 'utf8');
	written.push(`${name}.txt (${lines.length} lines)`);
}
console.log(`report ${outDir}`);
console.log(written.map((x) => `  ${x}`).join('\n'));
