/**
 * scripts/apply-nav-ledger.mjs — 把生成的台账行并入 docs/copy-ledger.md。
 *
 * 替换范围：`## 2. 顶部导航 / Mega Menu` 小节里，以 `| N-001 |` 开头
 * 到「Phase B 必查」引用块结束之间的表格行 + 注释。
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'docs/copy-ledger.md';
const lines = readFileSync(FILE, 'utf8').split('\n');
const gen = readFileSync('qa/generated/nav-ledger.md', 'utf8').trimEnd().split('\n');

const start = lines.findIndex((l) => l.trimStart().startsWith('| N-001 |'));
if (start === -1) throw new Error('N-001 row not found');

// 结束点：第一行以 "> **Phase B 必查**" 开头的引用块。
let end = -1;
for (let i = start; i < lines.length; i++) {
	if (lines[i].trimStart().startsWith('> **Phase B 必查**')) {
		end = i;
		break;
	}
}
if (end === -1) throw new Error('Phase B note not found');

const NOTE = [
	'> **Phase B 必查**：以上条目的 `href` **逐字照抄参考站**（含 `/global-en/` 前缀），',
	'> Phase A 保留原样以便核对；Phase B 替换文案时必须同时映射到本站最终路由。',
	'> 渲染位置：`src/components/layout/MegaMenu.astro` — 每个顶级项一个 `[data-mega-panel]` 面板，',
	'> 由 `src/components/layout/SiteHeader.astro` 的脚本按 `data-nav-trigger` 名称切换显示。',
];

// 旧的注释块：从 "> **Phase B 必查**" 起的连续 ">" 行，整体丢弃并用 NOTE 替换。
let noteEnd = end;
while (noteEnd < lines.length && lines[noteEnd].trimStart().startsWith('>')) noteEnd++;

const out = [...lines.slice(0, start), ...gen, ...NOTE, ...lines.slice(noteEnd)];
writeFileSync(FILE, out.join('\n'));
console.log(
	`replaced copy-ledger.md rows ${start + 1}..${end + 1} with ${gen.length} rows; note ${end + 1}..${noteEnd}`,
);
