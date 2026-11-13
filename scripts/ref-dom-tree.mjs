/**
 * scripts/ref-dom-tree.mjs — 把参考 HTML 的 <main> 子树压成缩进大纲。
 *
 * WHY
 * ---
 * 要 1:1 复刻，就���知道参考站的**真实 DOM 嵌套**（谁包着谁、哪些 class、
 * 哪些文案属于哪个块）。整读 480KB 的 HTML 会烧光上下文；grep 又拿不到
 * 父子关系。本脚本用 scripts/lib/html-tree.mjs 解析后，只输出 <main> 内的
 * 标签树 + class + 文案，一页大约几百行，可直接照抄。
 *
 * 用法：
 *   node scripts/ref-dom-tree.mjs qa/ref/<page>.html [--max-text 90]
 *                                          [--max-depth 12] [--out file]
 *
 * 零依赖（复用 scripts/lib/html-tree.mjs），不碰浏览器。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { parseTree, textOf } from './lib/html-tree.mjs';

const args = process.argv.slice(2);
const SRC = args.find((a) => !a.startsWith('--'));
if (!SRC) {
	console.error('usage: node scripts/ref-dom-tree.mjs qa/ref/<page>.html');
	process.exit(1);
}
const flag = (n, d) => {
	const i = args.indexOf(n);
	return i >= 0 ? args[i + 1] : d;
};
const MAX_TEXT = Number(flag('--max-text', 90));
const MAX_DEPTH = Number(flag('--max-depth', 12));
const OUT = flag('--out', null);

/** 只保留有意义的属性；其余一律丢弃。 */
const KEEP_ATTRS = ['href', 'src', 'alt', 'width', 'height', 'style', 'id'];

const roots = parseTree(readFileSync(SRC, 'utf8'));
const lines = [];

/** 深度优先找到第一个 <main>（若没有则用 body）。 */
function findMain(nodes) {
	for (const n of nodes) {
		if (n.tag === 'main') return n;
		const hit = findMain(n.children ?? []);
		if (hit) return hit;
	}
	return null;
}
const main = findMain(roots);
const root = main ?? { tag: 'body', children: roots, attrs: {} };

/** 跳过脚本/样式/内联 SVG 图形等噪声。 */
const SKIP = new Set(['script', 'style', 'noscript', 'template', 'path', 'defs']);

function walk(node, depth) {
	if (depth > MAX_DEPTH) return;
	for (const n of node.children ?? []) {
		if (SKIP.has(n.tag)) continue;
		const attrs = Object.entries(n.attrs ?? {})
			.filter(([k]) => KEEP_ATTRS.includes(k))
			.map(([k, v]) => `${k}="${String(v).slice(0, 110)}"`)
			.join(' ');
		const cls = (n.attrs?.class ?? '').slice(0, 200);
		const own = (n.text ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT);
		const head =
			`<${n.tag}` +
			(cls ? ` class="${cls}"` : '') +
			(attrs ? ` ${attrs}` : '') +
			'>';
		lines.push('  '.repeat(depth) + head + (own ? `  "${own}"` : ''));
		walk(n, depth + 1);
	}
}

lines.push(`# DOM TREE — ${SRC}`);
lines.push(`# <main> found: ${main ? 'yes' : 'no (fell back to body)'}`);
lines.push('');
walk(root, 0);

const text = lines.join('\n');
if (OUT) {
	writeFileSync(OUT, text, 'utf8');
	console.log(`tree ${OUT} (${lines.length} lines)`);
} else {
	console.log(text);
}
