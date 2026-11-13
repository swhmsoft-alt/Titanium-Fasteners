/**
 * scripts/patch-megamenu.mjs — 修 MegaMenu.astro 的结构（补一个闭合 </div>）。
 *
 * 背景：参考站的面板结构是
 *   Container > [data-mega-panel] > div.flex.flex-col-reverse > (a.mt-48 + ul.grid)
 * 「Go to X」必须是网格的**兄弟节点**（flex-col-reverse → 渲染在网格下方）。
 * 改结构时用脚本改，避免 tab 缩进对不上。
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'src/components/layout/MegaMenu.astro';
let src = readFileSync(FILE, 'utf8');

const T = '\t';
const OLD =
	`${T}${T}${T}${T}${T}</ul>\n` +
	`${T}${T}${T}${T}</div>\n` +
	`${T}${T}${T}))}\n`;

const NEW =
	`${T}${T}${T}${T}${T}${T}</ul>\n` +
	`${T}${T}${T}${T}${T}</div>\n` +
	`${T}${T}${T}${T}</div>\n` +
	`${T}${T}${T}))}\n`;

if (!src.includes(OLD)) {
	// 缩进可能已变动 —— 退回到按行处理。
	const lines = src.split('\n');
	const idx = lines.findIndex((l) => l.trim() === '</ul>' && l.includes(T.repeat(4)));
	if (idx === -1) throw new Error('tail not found');
	// 找到该 </ul> 之后的第一个 </div>（列表面板 div）。
	const closeIdx = lines.findIndex((l, i) => i > idx && l.trim() === '</div>');
	lines.splice(closeIdx + 1, 0, `${T}${T}${T}${T}</div>`);
	src = lines.join('\n');
} else {
	src = src.replace(OLD, NEW);
}

writeFileSync(FILE, src);
console.log('MegaMenu.astro structure patched');
