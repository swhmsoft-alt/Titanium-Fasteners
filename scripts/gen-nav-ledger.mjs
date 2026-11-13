/**
 * scripts/gen-nav-ledger.mjs — 由实测结构生成《照抄台账》的 Mega Menu 段落。
 *
 * 输入：qa/ref/nav-structure.json
 * 输出：qa/generated/nav-ledger.md（待并入 docs/copy-ledger.md）
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const src = JSON.parse(readFileSync('qa/ref/nav-structure.json', 'utf8'));
const trim = (s) => s.replace(/\s+$/, '');

const rows = [];
let n = 0;
const id = () => `N-${String(++n).padStart(3, '0')}`;

for (const [label, s] of Object.entries(src)) {
	if (s.error) continue;
	const idx = Object.keys(src).indexOf(label);

	// 面板底部「Go to X」
	rows.push(
		`| ${id()} | Mega Menu › ${label} › 底部「Go to X」链接 | ${s.lead.text} | ` +
			`\`src/config/site.ts\` → \`NAVIGATION[${idx}].lead\` | 已抄 | |`,
	);

	s.groups.forEach((g) => {
		const col = g.column + 1;
		// 组在**本列内**的序号（路径里的 groups[] 下标）。
		const colGroups = s.groups.filter((x) => x.column === g.column);
		const gi = colGroups.indexOf(g);
		const groupNo = gi + 1;
		if (g.heading) {
			rows.push(
				`| ${id()} | Mega Menu › ${label} › 第 ${col} 列 › 第 ${groupNo} 组标题（链接，18px/700） | ` +
					`${trim(g.heading.text)} | \`src/config/site.ts\` → ` +
					`\`NAVIGATION[${idx}].children[${col - 1}].groups[${gi}].heading\` | 已抄 | |`,
			);
		}
		if (g.items.length) {
			const list = g.items.map((it) => trim(it.text)).join(' / ');
			const path = `NAVIGATION[${idx}].children[${col - 1}].groups[${gi}].items`;
			rows.push(
				`| ${id()} | Mega Menu › ${label} › 第 ${col} 列 › 第 ${groupNo} 组条目 ×${g.items.length} | ` +
					`${list} | \`src/config/site.ts\` → \`${path}\` | 已抄 | |`,
			);
		}
	});
}

mkdirSync('qa/generated', { recursive: true });
writeFileSync('qa/generated/nav-ledger.md', rows.join('\n') + '\n');
console.log(`${rows.length} ledger rows`);
