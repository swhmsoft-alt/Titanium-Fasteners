/**
 * scripts/lib/html-tree.mjs — 极简 HTML → 树解析器（零依赖）。
 *
 * 只用于解析实测落盘的参考站面板 HTML。参考站由 Astro 输出，标签闭合良好，
 * 因此简单的栈式扫描足够；不需要完整的 HTML5 解析算法。
 */

const VOID = new Set([
	'br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'use', 'path',
	'stop', 'rect', 'circle', 'polygon', 'area', 'col', 'embed', 'track', 'wbr',
]);

const NAMED = {
	amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
	ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’',
	ldquo: '“', rdquo: '”', hellip: '…', middot: '·',
};

/** 解码 HTML 实体（含数字实体）。参考站文案里的 `&` 存为 `&amp;`。 */
export function decodeEntities(s) {
	if (!s || s.indexOf('&') === -1) return s;
	return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, body) => {
		if (body[0] === '#') {
			const code =
				body[1] === 'x' || body[1] === 'X'
					? parseInt(body.slice(2), 16)
					: parseInt(body.slice(1), 10);
			return Number.isFinite(code) ? String.fromCodePoint(code) : m;
		}
		return NAMED[body.toLowerCase()] ?? m;
	});
}

/**
 * @param {string} html
 * @returns {{tag:string, attrs:Record<string,string>, children:Node[], text:string}[]}
 */
export function parseTree(html) {
	const tokens = html
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/>\s+</g, '><')
		.split(/(<[^>]+>)/)
		.filter((t) => t.trim());

	const root = { tag: '#root', attrs: {}, children: [], text: '' };
	const stack = [root];

	for (const tok of tokens) {
		if (tok.startsWith('</')) {
			const name = tok.slice(2, -1).trim().toLowerCase();
			for (let i = stack.length - 1; i > 0; i--) {
				if (stack[i].tag === name) {
					stack.length = i;
					break;
				}
			}
			continue;
		}
		if (tok.startsWith('<')) {
			const selfClose = tok.endsWith('/>');
			const inner = tok.replace(/^<|\/?>$/g, '');
			const name = (inner.match(/^[a-zA-Z0-9-]+/) || [''])[0].toLowerCase();
			const attrs = {};
			for (const m of inner.matchAll(/([a-zA-Z0-9-:]+)="([^"]*)"/g)) {
				attrs[m[1]] = decodeEntities(m[2]);
			}
			const node = { tag: name, attrs, children: [], text: '' };
			stack[stack.length - 1].children.push(node);
			if (!selfClose && !VOID.has(name)) stack.push(node);
			continue;
		}
		const t = decodeEntities(tok.replace(/\s+/g, ' ').trim());
		if (t) {
			const cur = stack[stack.length - 1];
			cur.text = (cur.text + ' ' + t).trim();
		}
	}
	return root.children;
}

/**
 * 深度优先查找，谓词命中即返回。
 * @param {Node|Node[]} nodes 单个节点或节点数组
 */
export function findAll(nodes, pred, out = []) {
	const list = Array.isArray(nodes) ? nodes : nodes ? [nodes] : [];
	for (const n of list) {
		if (pred(n)) out.push(n);
		findAll(n.children, pred, out);
	}
	return out;
}

/** 直接子节点中第一个满足谓词者。 */
export function childOf(node, pred) {
	return node.children.find(pred);
}

/** 取元素的纯文本（拼接后代文本）。 */
export function textOf(node) {
	let out = node.text;
	for (const c of node.children) out += ' ' + textOf(c);
	return decodeEntities(out.replace(/\s+/g, ' ').trim());
}

/** 取 class 属性。 */
export function classOf(node) {
	return node.attrs.class ?? '';
}

/** 取 data-analytics-navi-item-* 属性集合。 */
export function analytics(node) {
	const out = {};
	for (const [k, v] of Object.entries(node.attrs)) {
		if (k.startsWith('data-analytics-navi-item-')) {
			out[k.replace('data-analytics-navi-item-', '')] = v;
		}
	}
	return out;
}
