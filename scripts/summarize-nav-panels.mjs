/**
 * scripts/summarize-nav-panels.mjs — 紧凑打印 qa/ref/nav-panels.json 的结构。
 * 用法：node scripts/summarize-nav-panels.mjs [面板名，留空=全部]
 */
import { readFileSync } from 'node:fs';

const FILE = 'qa/ref/nav-panels.json';
const data = JSON.parse(readFileSync(FILE, 'utf8'));
const want = process.argv[2];

for (const [label, p] of Object.entries(data)) {
	if (label === '__meta') {
		console.log(`META ${p.url} ${p.viewport} ${p.capturedAt}`);
		continue;
	}
	if (want && label !== want) continue;
	if (!p?.ok) {
		console.log(`\n### ${label} — FAILED: ${p?.reason}`);
		continue;
	}
	console.log(`\n### ${label}`);
	console.log(
		`panel ${p.panel.w}x${p.panel.h} @(${p.panel.x},${p.panel.y}) pos=${p.panel.pos} bg=${p.panel.bg}`,
	);
	console.log(`grid ${p.grid ? p.grid.tracks + ' tracks / ' + p.grid.links + ' links' : 'NONE'} | images ${p.images.length}`);
	for (const col of p.columns) {
		console.log(`  COL ${col.index} x=${col.x} w=${col.w}`);
		for (const g of col.groups) {
			const hs = g.headingStyle ? ` (${g.headingStyle.fs}/${g.headingStyle.fw}/${g.headingStyle.color})` : '';
			console.log(`    GROUP ${g.heading ?? '(no heading)'}${hs}`);
			for (const it of g.items) {
				console.log(`      - ${it.text}  ->  ${it.href}  [${it.fs}/${it.fw}/${it.color}]`);
			}
		}
	}
}
