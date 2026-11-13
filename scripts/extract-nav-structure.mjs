/**
 * scripts/extract-nav-structure.mjs — 从实测落盘的面板 HTML 中提取权威导航结构。
 *
 * 参考站每个链接都带 data-analytics-navi-item-* 属性（section / subsection /
 * level / position），**这就是参考站自己声明的层级**。
 * 比按字号猜层级可靠得多 —— 本脚本按这些属性还原「列 → 组标题 → 条目」。
 *
 * 样式（字号/字重/颜色）来自 CDP 实测的 qa/ref/nav-panels.json，按 href+text 关联。
 *
 * 产物：qa/ref/nav-structure.json（结构化权威结构）
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { parseTree, findAll, childOf, textOf, classOf, analytics } from './lib/html-tree.mjs';

const panels = JSON.parse(readFileSync('qa/ref/nav-panels.json', 'utf8'));
const slugOf = (label) => label.toLowerCase().replace(/\s+/g, '-');
const out = {};

/** href+text → measured style lookup from the CDP dump. */
function styleIndex(panel) {
	const idx = new Map();
	for (const col of panel.columns) {
		for (const g of col.groups) {
			for (const it of g.items) idx.set(it.href + '|' + it.text.trim(), it);
		}
	}
	return idx;
}

for (const label of Object.keys(panels)) {
	if (label === '__meta') continue;
	const p = panels[label];
	if (!p?.ok) {
		out[label] = { error: p?.reason ?? 'failed' };
		continue;
	}
	const file = `qa/ref/nav-panel-${slugOf(label)}.html`;
	const html = readFileSync(file, 'utf8');
	const tree = parseTree(html);
	const styles = styleIndex(p);

	const grid = findAll(tree, (n) => n.tag === 'ul' && classOf(n).includes('grid-cols-3'))[0];
	const columnEls = grid ? grid.children.filter((n) => n.tag === 'li') : [];

	const goToEl = findAll(tree, (n) => n.tag === 'a' && analytics(n).type === 'go-to-link')[0];

	const mk = (a) => {
		const st = styles.get((a.attrs.href ?? '') + '|' + textOf(a));
		return {
			text: textOf(a),
			href: a.attrs.href ?? '',
			target: a.attrs.target ?? null,
			rel: a.attrs.rel ?? null,
			level: analytics(a).level ?? null,
			position: analytics(a).position ? Number(analytics(a).position) : null,
			fs: st?.fs ?? null,
			fw: st?.fw ?? null,
			color: st?.color ?? null,
		};
	};

	const groups = [];
	columnEls.forEach((colEl, colIdx) => {
		for (const div of colEl.children.filter((n) => n.tag === 'div')) {
			const links = findAll(div, (n) => n.tag === 'a');
			if (!links.length) continue;
			const headingEl = links.find(
				(a) => analytics(a).level === 'L2' && classOf(a).includes('font-bold'),
			);
			const itemEls = links.filter((a) => analytics(a).level === 'L3');
			const peerEls = links.filter((a) => analytics(a).level === 'L2' && a !== headingEl);

			if (headingEl) {
				groups.push({ column: colIdx, heading: mk(headingEl), items: itemEls.map(mk) });
			} else {
				groups.push({
					column: colIdx,
					heading: null,
					items: [...itemEls, ...peerEls].map(mk),
				});
			}
		}
	});

	out[label] = {
		panel: p.panel,
		grid: p.gridStyle,
		lead: goToEl
			? {
					text: textOf(goToEl),
					href: goToEl.attrs.href ?? '',
					fs: p.goTo?.fs ?? null,
					fw: p.goTo?.fw ?? null,
					color: p.goTo?.color ?? null,
				}
			: null,
		columns: p.columns.map((c) => ({ index: c.index, x: c.x, w: c.w })),
		groups,
	};
}

writeFileSync('qa/ref/nav-structure.json', JSON.stringify(out, null, 2));

// Compact console report
for (const [label, s] of Object.entries(out)) {
	if (s.error) {
		console.log(`### ${label} — ${s.error}`);
		continue;
	}
	console.log(`\n### ${label}  panel ${s.panel.w}x${s.panel.h}`);
	if (s.lead) {
		console.log(`  LEAD: ${s.lead.text} -> ${s.lead.href} [${s.lead.fs}/${s.lead.fw}]`);
	}
	for (const g of s.groups) {
		const h = g.heading ? `${g.heading.text} -> ${g.heading.href}` : '(no heading)';
		console.log(`  COL${g.column}  ${h}`);
		for (const it of g.items) {
			console.log(
				`      - ${it.text} -> ${it.href} [${it.fs}/${it.fw}]${it.target ? ' target=' + it.target : ''}`,
			);
		}
	}
}
