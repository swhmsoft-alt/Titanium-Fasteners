/**
 * scripts/extract-ref-nav-html.mjs — 从参考站首页 HTML 的 <header> 区域
 * 按文档顺序输出导航链接与标题（用于 1:1 复刻 Mega Menu）。
 *
 * 用法：node scripts/extract-ref-nav-html.mjs [文件路径]
 */
import { readFileSync } from 'node:fs';

const FILE =
	process.argv[2] ??
	'c:/Users/Administrator/Desktop/Titanium-Fasteners/qa/ref-home.html';

const html = readFileSync(FILE, 'utf8');

const decode = (s) =>
	s
		.replace(/<[^>]+>/g, '')
		.replace(/&quot;/g, '"')
		.replace(/&#x27;|&#39;/g, "'")
		.replace(/&amp;/g, '&')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

/* 取 header 区域 */
const hStart = html.indexOf('<header');
const hEnd = html.indexOf('</header>', hStart);
const region = hStart >= 0 ? html.slice(hStart, hEnd > 0 ? hEnd : hStart + 400000) : '';

/* 按文档顺序抽取 a / h1-h6 / button，并记录每列容器的 class 线索 */
const tokens = [];
const re = /<a\b([^>]*)>([\s\S]*?)<\/a>|<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\3>|<div\b([^>]*)>|<button\b([^>]*)>([\s\S]*?)<\/button>/g;
let m;
while ((m = re.exec(region))) {
	if (m[1] !== undefined) {
		const href = /href="([^"]*)"/.exec(m[1])?.[1] ?? '';
		const label = decode(m[2]);
		tokens.push({ t: 'a', label, href });
	} else if (m[3] !== undefined) {
		tokens.push({ t: 'h' + m[3], label: decode(m[5]) });
	} else if (m[6] !== undefined) {
		const cls = m[6];
		if (/grid|column|col-span|megamenu|navigation/i.test(cls)) {
			tokens.push({ t: 'DIV', label: cls.replace(/"/g, '').slice(0, 110) });
		}
	} else if (m[7] !== undefined) {
		tokens.push({ t: 'button', label: decode(m[8]) });
	}
}

console.log('header region bytes:', region.length, '| tokens:', tokens.length);
console.log('----- NAV TOKENS (document order) -----');
for (const tk of tokens) {
	if (tk.t === 'a') console.log(`a      | ${tk.label} | ${tk.href}`);
	else if (tk.t === 'DIV') console.log(`DIV    | ${tk.label}`);
	else console.log(`${tk.t.padEnd(6)} | ${tk.label}`);
}
