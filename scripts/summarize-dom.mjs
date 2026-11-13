/**
 * scripts/summarize-dom.mjs — 把 homepage-dom.json 压成可读的层级摘要。
 *
 * Phase A 用：1:1 照抄需要逐层看清参考站的盒子（几何 / 内边距 / 标题 / 图片），
 * JSON 太啰嗦，压成缩进文本便于逐条比对与重建。
 *
 * 产物：docs/reference/homepage-outline.txt
 */

import { readFileSync, writeFileSync } from 'node:fs';

const LOCAL = process.argv.includes('--local');
const SRC = LOCAL
	? 'docs/reference/homepage-dom.local.json'
	: 'docs/reference/homepage-dom.json';
const OUT = LOCAL
	? 'docs/reference/homepage-outline.local.txt'
	: 'docs/reference/homepage-outline.txt';

const dom = JSON.parse(readFileSync(SRC, 'utf8'));
const lines = [];

const walk = (n, d) => {
	const pad = '  '.repeat(d);
	const head = n.head
		? ` | ${n.head.tag} ${n.head.size} ${n.head.color} "${n.head.text}"`
		: '';
	const img = n.img
		? ` | IMG ${n.img.w}x${n.img.h}@${n.img.x},${n.img.y} r=${n.img.ratio} ${String(n.img.src).split('/').pop().slice(0, 70)}`
		: '';
	lines.push(
		`${pad}<${n.tag}> y=${n.y} x=${n.x} ${n.w}x${n.h} bg=${n.bg} ` +
			`pt=${n.pt} pb=${n.pb} mt=${n.mt} mb=${n.mb} disp=${n.display}` +
			`${n.cols ? ` cols=${n.cols} gap=${n.gap}` : ''}${head}${img}`,
	);
	if (n.cls) lines[lines.length - 1] += `\n${pad}  .${n.cls}`;
	for (const k of n.kids ?? []) walk(k, d + 1);
};

for (const k of dom.mainKids) walk(k, 0);
lines.push('');
lines.push('=== GRIDS ===');
for (const g of dom.grids ?? []) {
	lines.push(`GRID .${g.cls}`);
	lines.push(`     cols=${g.cols} rows=${g.rows} gap=${g.gap}`);
	for (const k of g.kids) {
		lines.push(
			`   - <${k.tag}> y=${k.y} x=${k.x} ${k.w}x${k.h}` +
				`${k.head ? ` | ${k.head}` : ''}` +
				`${k.img ? ` | IMG ${k.img.w}x${k.img.h} r=${k.img.ratio} ${String(k.img.src).split('/').pop().slice(0, 60)}` : ''}`,
		);
		if (k.cls) lines[lines.length - 1] += `\n       .${k.cls}`;
	}
}
lines.push('');
lines.push('=== MEDIA QUERIES ===');
for (const m of dom.media ?? []) lines.push(m);
lines.push('');
lines.push(`bodyH=${dom.bodyH}  docW=${dom.docW}`);

writeFileSync(OUT, lines.join('\n'));
console.log(`lines=${lines.length} → ${OUT}`);
