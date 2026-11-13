/**
 * scripts/patch-global-css.mjs — 重写 global.css 的「Colour」小节（注释 + 令牌）。
 *
 * 背景：参考站实测（qa/ref-gray.json）证明灰阶的真实映射是
 *   gray=#333333  gray-medium=#666666  gray-light=#bfbfbf
 *   gray-soft=#999999  gray-vlight=#f3f3f3  gray-whiteish=#f0f0f0
 * 而本项目原来的令牌把名字与值错位了（gray=#666 / gray-medium=#555）。
 *
 * 做法：整段替换「Colour 注释块 + 令牌定义」，避免逐行匹配踩到 em-dash 编码。
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'src/styles/global.css';
const src = readFileSync(FILE, 'utf8');
const lines = src.split('\n');

const DASH = '\u2014';
const RULE = '\t/* ' + '\u2500'.repeat(62);

/** 整段重建：小节标题 → 注释 → 令牌。 */
const SECTION = [
	`${RULE}`,
	'\t   Colour',
	'\t   Sampled from computed styles on the reference. RGB values are the',
	'\t   raw measurements; hex is the equivalent used in code.',
	'',
	'\t     #0070ba  primary button fill (cookie consent primary)',
	'\t     #007ac3  accent / link / secondary button text / "Go to" links',
	`\t     #004975  blue-dark3  ${DASH} h1 + section h2 colour`,
	`\t     #00314e  blue-dark2  ${DASH} article h2 colour`,
	`\t     #001827  blue-dark   ${DASH} near-black navy, card h3 colour`,
	`\t     #cce4f3  blue-light  ${DASH} soft blue panel / card fill / borders`,
	`\t     #f3f3f3  gray-vlight ${DASH} light section background`,
	'\t     #f0f0f0  gray-whiteish',
	'\t     #bfbfbf  gray-light',
	`\t     #999999  gray-soft   ${DASH} hairline borders`,
	`\t     #666666  gray-medium ${DASH} meta / eyebrow / caption copy`,
	`\t     #333333  gray        ${DASH} body copy colour`,
	'\t     #21272a  gray-cool',
	'\t     #ffffff  white',
	'\t   ---------------------------------------------------------------- */',
	'\t--color-blue: #007ac3;',
	'\t--color-blue-primary: #0070ba;',
	'\t--color-blue-dark: #001827;',
	'\t--color-blue-dark2: #00314e;',
	'\t--color-blue-dark3: #004975;',
	'\t--color-blue-light: #cce4f3;',
	`\t/* ESTIMATED ${DASH} the reference uses \`border-blue-70\` only below the 840px`,
	`\t   breakpoint (at \u2265840px it switches to border-blue-dark3), so this token is`,
	'\t   not observable at the 1440px acceptance viewport. */',
	'\t--color-blue-70: #a9cfe8;',
	'\t--color-gray-vlight: #f3f3f3;',
	'\t--color-gray-whiteish: #f0f0f0;',
	'\t--color-gray-light: #bfbfbf;',
	'\t--color-gray-soft: #999999;',
	'\t--color-gray-medium: #666666;',
	'\t--color-gray: #333333;',
	'\t--color-gray-cool: #21272a;',
	'\t--color-accent-rose: #aa465c;',
];

// 定位小节起点（Colour 注释块）与终点（accent-rose 令牌）。
const start = lines.findIndex((l) => l.includes('Colour') && l.includes('/*'));
const end = lines.findIndex((l) => l.trim().startsWith('--color-accent-rose'));
if (start === -1 || end === -1 || end < start) {
	throw new Error(`section not found (start=${start}, end=${end})`);
}

const out = [...lines.slice(0, start), ...SECTION, ...lines.slice(end + 1)];
writeFileSync(FILE, out.join('\n'));
console.log(`rewrote global.css lines ${start + 1}..${end + 1} -> ${SECTION.length} lines`);
