/**
 * scripts/extract-ref-nav.mjs — 从参考站原始 HTML 中提取真实导航树。
 *
 * 用法：node scripts/extract-ref-nav.mjs [文件路径]
 *   默认 qa/ref-home.html（由 Invoke-WebRequest 下载的参考站首页原始 HTML）
 *
 * 参考站把导航数据以 devalue（扁平引用）格式内联在 HTML 中。还原后：
 *   navigationMainContainer        = 顶级项（Product Solutions / …）
 *   navigationMainSubgroupContainer= 面板的一列（Column N）
 *   navigationMainSubgroup         = 列内的分组（组标题）
 *   navigationMainSubgroupItemContainer = 分组下的条目（链接）
 */
import { readFileSync } from 'node:fs';

const FILE =
	process.argv[2] ??
	'c:/Users/Administrator/Desktop/Titanium-Fasteners/qa/ref-home.html';

const raw = readFileSync(FILE, 'utf8');
const s = raw
	.replace(/&quot;/g, '"')
	.replace(/&#x27;/g, "'")
	.replace(/&#39;/g, "'")
	.replace(/&amp;/g, '&')
	.replace(/&lt;/g, '<')
	.replace(/&gt;/g, '>')
	.replace(/&nbsp;/g, ' ');

/** devalue 扁平格式还原：[0, value] → value */
function revive(v) {
	if (Array.isArray(v)) {
		if (v.length === 2 && v[0] === 0) return revive(v[1]);
		return v.map(revive);
	}
	if (v && typeof v === 'object') {
		const out = {};
		for (const [k, val] of Object.entries(v)) out[k] = revive(val);
		return out;
	}
	return v;
}

/** 从 text 中切出以 start 处 '[' 开始的最长完整 JSON 数组 */
function sliceJsonArray(text, start) {
	let depth = 0;
	let inStr = false;
	let esc = false;
	for (let i = start; i < text.length; i++) {
		const c = text[i];
		if (esc) {
			esc = false;
			continue;
		}
		if (c === '\\') {
			esc = true;
			continue;
		}
		if (c === '"') inStr = !inStr;
		if (inStr) continue;
		if (c === '[') depth++;
		else if (c === ']') {
			depth--;
			if (depth === 0) return text.slice(start, i + 1);
		}
	}
	return null;
}

function longestJsonArray(text) {
	let best = null;
	let i = 0;
	while (i < text.length) {
		const idx = text.indexOf('[', i);
		if (idx < 0) break;
		const slice = sliceJsonArray(text, idx);
		if (slice && (!best || slice.length > best.length)) best = slice;
		i = idx + 1;
	}
	return best;
}

const jsonText = longestJsonArray(s);
if (!jsonText) {
	console.log('NO JSON ARRAY FOUND');
	process.exit(0);
}
console.log('file:', FILE, '| json slice length:', jsonText.length);

let data;
try {
	data = revive(JSON.parse(jsonText));
} catch (e) {
	console.log('PARSE FAIL:', e.message);
	process.exit(0);
}

const ct = (n) => n?.sys?.contentType?.sys?.id ?? n?.contentType?.sys?.id ?? '';
const labelOf = (n) => n?.label ?? n?.title ?? n?.name ?? n?.text ?? '';
const urlOf = (n) => n?.url ?? n?.href ?? '';

/** 递归打印含 internalName 的导航条目 */
let printed = 0;
function walk(node, depth, path) {
	if (!node || typeof node !== 'object') return;
	if (Array.isArray(node)) {
		node.forEach((n, i) => walk(n, depth, `${path}[${i}]`));
		return;
	}
	if (node.internalName) {
		const type = ct(node);
		const label = labelOf(node);
		const url = urlOf(node);
		const extra = label || url ? ` | label="${label}"${url ? ` | url="${url}"` : ''}` : '';
		console.log(`${'  '.repeat(depth)}· [${type}] ${node.internalName}${extra}`);
		printed++;
	}
	for (const [k, v] of Object.entries(node)) {
		if (k === 'sys' || k === 'internalName') continue;
		walk(v, depth + (node.internalName ? 1 : 0), path + '.' + k);
	}
}
walk(data, 0, '$');
console.log('entries printed:', printed);
