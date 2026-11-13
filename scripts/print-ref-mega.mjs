/**
 * scripts/print-ref-mega.mjs — 紧凑打印 qa/ref-meganav.json 中指定面板的实测结构。
 * 用法：node scripts/print-ref-mega.mjs [面板名，默认 Product Solutions]
 */
import { readFileSync } from 'node:fs';

const FILE =
	'c:/Users/Administrator/Desktop/Titanium-Fasteners/qa/ref-meganav.json';
const want = process.argv[2] ?? 'Product Solutions';

const data = JSON.parse(readFileSync(FILE, 'utf8'));
const panel = data[want];
if (!panel) {
	console.log('available:', Object.keys(data).join(' | '));
	process.exit(0);
}
if (panel.error) {
	console.log('ERROR:', panel.error);
	process.exit(0);
}
console.log('PANEL:', JSON.stringify(panel.panel));
const rows = [...panel.tree].sort((a, b) => a.y - b.y || a.x - b.x);
for (const n of rows) {
	const kind = n.tag === 'a' ? 'LINK' : 'HEAD';
	console.log(
		`${String(n.x).padStart(5)} ${String(n.y).padStart(5)} ${kind} ${n.fw.padStart(3)} ${n.fs.padStart(6)} ${n.color.padEnd(18)} ${n.text}${n.href ? '  → ' + n.href : ''}`,
	);
}
