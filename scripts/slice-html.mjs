/**
 * scripts/slice-html.mjs — 从抓到的参考站 HTML 里切出可读片段。
 *
 * 用法：node scripts/slice-html.mjs <file> <needle> [before] [after]
 * 产物：qa/slice.txt
 */
import { readFileSync, writeFileSync } from 'node:fs';

const file = process.argv[2] ?? 'docs/reference/probe-reference.html';
const needle = process.argv[3] ?? '</figure>';
const before = Number(process.argv[4] ?? 120);
const after = Number(process.argv[5] ?? 2200);
const outFile = process.argv[6] ?? 'qa/slice.txt';

const text = readFileSync(file, 'utf8');
const chunks = [];
let idx = 0;
let n = 0;
while ((idx = text.indexOf(needle, idx)) !== -1 && n < 4) {
	chunks.push(
		`\n===== occurrence ${n} @${idx} =====\n` +
			text.slice(Math.max(0, idx - before), idx + after).replace(/></g, '>\n<'),
	);
	idx += needle.length;
	n++;
}
writeFileSync(outFile, chunks.join('\n'));
console.log(`occurrences=${n} → ${outFile}`);
