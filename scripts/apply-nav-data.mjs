/**
 * scripts/apply-nav-data.mjs — 把生成的 NAVIGATION 块写入 src/config/site.ts。
 *
 * 替换范围：从 `export const NAVIGATION: NavItem[] = [` 到其配对的
 * `] as const;`（按行计数配平，避免误伤其它 `] as const;`）。
 */
import { readFileSync, writeFileSync } from 'node:fs';

const TARGET = 'src/config/site.ts';
const src = readFileSync(TARGET, 'utf8');
const gen = readFileSync('qa/generated/navigation.ts', 'utf8').replace(/\s+$/, '');

const lines = src.split('\n');
const startIdx = lines.findIndex((l) => l.startsWith('export const NAVIGATION: NavItem[] = ['));
if (startIdx === -1) throw new Error('NAVIGATION block not found');

// 找到配对的结束行：第一个恰好为 "] as const;" 的行。
let endIdx = -1;
for (let i = startIdx + 1; i < lines.length; i++) {
	if (lines[i].trim() === '] as const;') {
		endIdx = i;
		break;
	}
}
if (endIdx === -1) throw new Error('NAVIGATION end not found');

const before = lines.slice(0, startIdx);
const after = lines.slice(endIdx + 1);
const out = [...before, ...gen.split('\n'), ...after].join('\n');

writeFileSync(TARGET, out);
console.log(
	`replaced site.ts lines ${startIdx + 1}..${endIdx + 1} (${endIdx - startIdx} lines) with ${gen.split('\n').length} lines`,
);
