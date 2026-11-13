/**
 * scripts/dump-nav-tree.mjs — 打印落盘面板 HTML 的元素树（tag + class + 关键属性）。
 * 用法：node scripts/dump-nav-tree.mjs <panel-slug> [maxDepth]
 *   例：node scripts/dump-nav-tree.mjs product-solutions 6
 */
import { readFileSync } from 'node:fs';

const slug = process.argv[2] ?? 'product-solutions';
const maxDepth = Number(process.argv[3] ?? 6);
const html = readFileSync(`qa/ref/nav-panel-${slug}.html`, 'utf8');

const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'use', 'path', 'stop', 'rect', 'circle', 'polygon', 'area', 'col', 'embed', 'track', 'wbr']);
const SKIP_TEXT = new Set(['script', 'style']);

const tokens = html
	.replace(/<!--[\s\S]*?-->/g, '')
	.replace(/>\s+</g, '><')
	.split(/(<[^>]+>)/)
	.filter((t) => t.trim());

const root = { tag: '#root', cls: '', attrs: {}, children: [], text: '' };
let cur = root;
let inText = false;

for (const tok of tokens) {
	if (tok.startsWith('</')) {
		const name = tok.slice(2, -1).trim().toLowerCase();
		if (cur.tag === name) cur = cur.parent ?? root;
		continue;
	}
	if (tok.startsWith('<')) {
		const selfClose = tok.endsWith('/>');
		const inner = tok.replace(/^<|\/?>$/g, '');
		const name = (inner.match(/^[a-zA-Z0-9-]+/) || [''])[0].toLowerCase();
		const attrs = {};
		for (const m of inner.matchAll(/([a-zA-Z0-9-:]+)="([^"]*)"/g)) attrs[m[1]] = m[2];
		const node = {
			tag: name,
			cls: (attrs.class ?? '').slice(0, 120),
			attrs,
			children: [],
			text: '',
			parent: cur,
		};
		cur.children.push(node);
		if (!selfClose && !VOID.has(name)) {
			if (SKIP_TEXT.has(name)) {
				cur = node;
			} else {
				cur = node;
			}
		}
		inText = false;
		continue;
	}
	// text node
	const t = tok.replace(/\s+/g, ' ').trim();
	if (t) cur.text = (cur.text + ' ' + t).trim();
}

const skipAttrs = new Set(['class', 'data-analytics-navi-item-type', 'data-analytics-navi-item-name', 'data-analytics-navi-item-section', 'data-analytics-navi-item-subsection', 'data-analytics-navi-item-level', 'data-analytics-navi-item-position', 'data-testid']);

function print(node, depth) {
	if (depth > maxDepth) return;
	const pad = '  '.repeat(depth);
	const extra = Object.entries(node.attrs)
		.filter(([k]) => !skipAttrs.has(k))
		.map(([k, v]) => `${k}=${v.length > 70 ? v.slice(0, 70) + '…' : v}`)
		.join(' ');
	const label = node.tag === '#root' ? '' : `<${node.tag}${node.cls ? ` class="${node.cls}"` : ''}${extra ? ' ' + extra : ''}>`;
	const txt = node.text && !node.children.length ? ` “${node.text.slice(0, 80)}”` : '';
	if (label || txt) console.log(pad + label + txt);
	for (const c of node.children) print(c, depth + 1);
}

print(root, 0);
