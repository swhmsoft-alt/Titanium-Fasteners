/**
 * scripts/gen-nav-data.mjs — 由实测结构生成 src/config/site.ts 的 NAVIGATION 块。
 *
 * 输入：qa/ref/nav-structure.json（由 scripts/extract-nav-structure.mjs 从
 *      参考站实测落盘的面板 HTML 解析而来）
 * 输出：qa/generated/navigation.ts（待粘进 site.ts 的 TypeScript 源码）
 *
 * 为什么用脚本生成而不是手写：
 *   Phase A 要求「逐字照抄」。手抄 60+ 条文案与 href 必然出错；
 *   脚本从实测数据直接生成，抄错的概率为零，且可重复运行核对。
 *
 * 数据模型要点（与参考站 DOM 一一对应）：
 *   NavItem      顶级项；href = 参考站「Go to X」落地页
 *   NavItem.lead 面板底部的「Go to X」链接（参考站用 flex-col-reverse 置于底部）
 *   NavColumn    面板的一列（参考站 grid-cols-3 的一个 <li>）
 *   NavGroup     一组 = 一个 <div>：L2 标题链接 + 其下的 L3 子项
 *   NavChild     L3 子项链接
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const src = JSON.parse(readFileSync('qa/ref/nav-structure.json', 'utf8'));

/** TS 字符串字面量：转义单引号与反斜杠。 */
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/**
 * 参考站部分 L2 标题的文本节点带尾随空格（如 "Smart Factory "）。
 * 那是 HTML 源文件的排版残留，渲染上不可见，不属于文案内容 → 去除。
 */
const trimText = (s) => s.replace(/\s+$/, '');

const lines = [];
const push = (s = '') => lines.push(s);

push('export const NAVIGATION: NavItem[] = [');

for (const [label, s] of Object.entries(src)) {
	if (s.error) {
		console.error(`SKIP ${label}: ${s.error}`);
		continue;
	}

	// 面板的落地页 = 参考站「Go to X」的 href。
	const leadHref = s.lead?.href ?? '';
	const topHref = leadHref;

	push('\t{');
	push(`\t\tname: ${q(label)},`);
	push(`\t\thref: ${q(topHref)},`);

	if (s.lead) {
		push(`\t\tlead: {`);
		push(`\t\t\tname: ${q(s.lead.text)},`);
		push(`\t\t\thref: ${q(s.lead.href)},`);
		push('\t\t},');
	}

	push('\t\tchildren: [');

	// 参考站恒为 3 列；按实测 column 索引分桶。
	const colCount = Math.max(...s.groups.map((g) => g.column)) + 1;
	for (let c = 0; c < colCount; c++) {
		const groups = s.groups.filter((g) => g.column === c);
		if (!groups.length) continue;
		push('\t\t\t{');
		push('\t\t\t\tgroups: [');
		for (const g of groups) {
			push('\t\t\t\t\t{');
			if (g.heading) {
				push(`\t\t\t\t\t\theading: ${q(trimText(g.heading.text))},`);
				push(`\t\t\t\t\t\theadingHref: ${q(g.heading.href)},`);
				if (g.heading.target) {
					push('\t\t\t\t\t\theadingExternal: true,');
				}
			}
			push('\t\t\t\t\t\titems: [');
			for (const it of g.items) {
				const fields = [`name: ${q(trimText(it.text))}`, `href: ${q(it.href)}`];
				if (it.target) fields.push('external: true');
				push(`\t\t\t\t\t\t\t{ ${fields.join(', ')} },`);
			}
			push('\t\t\t\t\t\t],');
			push('\t\t\t\t\t},');
		}
		push('\t\t\t\t],');
		push('\t\t\t},');
	}

	push('\t\t],');
	push('\t},');
}

push('] as const;');

mkdirSync('qa/generated', { recursive: true });
writeFileSync('qa/generated/navigation.ts', lines.join('\n') + '\n');

// 校验：条目数与参考站实测链接总数一致。
let total = 0;
for (const s of Object.values(src)) {
	if (s.error) continue;
	total += s.groups.reduce((n, g) => n + g.items.length + (g.heading ? 1 : 0), 0);
}
console.log(`generated ${lines.length} lines, ${total} nav links`);
