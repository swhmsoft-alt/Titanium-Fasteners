/**
 * scripts/write-megamenu.mjs — 生成 src/components/layout/MegaMenu.astro。
 *
 * 结构逐字对应参考站 DOM：
 *   #mega-menu (fixed, overflow-y auto) > .container-fluid
 *     > [data-mega-panel] × 5 > div.flex.flex-col-reverse.py-56
 *       > a.mt-48（Go to X，DOM 在前 → 渲染在网格下方）
 *       > ul.grid.grid-cols-3.gap-48 > li.flex.flex-col.gap-48 > div
 *         > a.text-p-s.font-bold（组标题，本身是链接）
 *         > ul.mt-24 > li.mt-16.text-lead-l.text-gray-medium > a
 */
import { writeFileSync } from 'node:fs';

const T = '\t';
const L = (...parts) => parts.join('\n');

const HEAD = `---
/**
 * MegaMenu — the full-width dropdown panel.
 *
 * MEASURED on the reference site (1440×1000, 2026-11, CDP):
 *   panel      — fixed, w-full, bg #fff, shadow 0 4px 4px rgba(0,0,0,.05),
 *                overflow-y auto, transition top/max-height 300ms ease-in-out
 *   inner      — .container-fluid + per-panel \`flex flex-col-reverse py-56\`;
 *                the "Go to X" link is a SIBLING of the grid → renders BELOW it
 *   grid       — \`grid grid-cols-3 gap-48\` (measured 401.33px columns)
 *   column     — \`flex flex-col gap-48\`
 *   group      — L2 heading LINK (\`text-p-s font-bold\` = 18px/700/#000) plus
 *                optionally a \`ul.mt-24\` of L3 links
 *   child link — 24px / 400 / #666666 (\`text-lead-l text-gray-medium\`)
 *   "Go to X"  — 16px / 700 / #007ac3 + a 16px arrow-right icon
 *
 * Driven by NAVIGATION (src/config/site.ts) — the same source as the nav.
 *
 * ONE PANEL PER NAV ITEM: the container stays mounted and each top-level
 * item owns a \`[data-mega-panel]\` section; the header script reveals the
 * matching one.
 *
 * NOTE: the container must NOT carry Tailwind's \`hidden\` utility — that
 * class is \`display:none\` and would override the HTML \`hidden\` attribute
 * the script toggles.
 */
import Container from '@components/ui/Container.astro';
import { NAVIGATION } from '@config/site';
---`;

const BODY = L(
	'',
	'<div',
	`${T}id="mega-menu"`,
	`${T}class="fixed left-0 top-91 z-[190] max-h-[calc(100vh-91px)] w-full overflow-y-auto bg-white shadow-[0_4px_4px_rgba(0,0,0,0.05)] transition-[top,max-height] duration-300 ease-in-out"`,
	`${T}data-mega-menu`,
	`${T}hidden`,
	'>',
	`${T}<Container>`,
	`${T}{`,
	`${T}${T}NAVIGATION.map((item, index) => (`,
	`${T}${T}${T}<div data-mega-panel={item.name} hidden={index !== 0}>`,
	`${T}${T}${T}${T}<div class="flex flex-col-reverse py-56">`,
	`${T}${T}${T}${T}${T}{item.lead && (`,
	`${T}${T}${T}${T}${T}${T}<a`,
	`${T}${T}${T}${T}${T}${T}${T}href={item.lead.href}`,
	`${T}${T}${T}${T}${T}${T}${T}class="mt-48 flex items-center font-bold text-body text-blue"`,
	`${T}${T}${T}${T}${T}${T}>`,
	`${T}${T}${T}${T}${T}${T}${T}{item.lead.name}`,
	`${T}${T}${T}${T}${T}${T}${T}<svg class="h-16 w-16 stroke-blue ml-8" aria-hidden="true">`,
	`${T}${T}${T}${T}${T}${T}${T}${T}<use href="/images/sprite.svg#arrow-right" />`,
	`${T}${T}${T}${T}${T}${T}${T}</svg>`,
	`${T}${T}${T}${T}${T}${T}</a>`,
	`${T}${T}${T}${T}${T})}`,
	'',
	`${T}${T}${T}${T}${T}<ul class="grid grid-cols-1 gap-48 md:grid-cols-2 lg:grid-cols-3">`,
	`${T}${T}${T}${T}${T}${T}{item.children?.map((column) => (`,
	`${T}${T}${T}${T}${T}${T}${T}<li class="flex flex-col gap-48">`,
	`${T}${T}${T}${T}${T}${T}${T}${T}{column.groups.map((group) => (`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}<div>`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}{group.heading && (`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}<a`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}href={group.headingHref}`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}class="text-p-s font-bold text-black"`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}target={group.headingExternal ? '_blank' : undefined}`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}rel={group.headingExternal ? 'noreferrer noopener' : undefined}`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}>`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}{group.heading}`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}</a>`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T})}`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}{group.items.length > 0 && (`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}<ul class="mt-24">`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}{group.items.map((child) => (`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}<li class="mt-16 text-lead-l text-gray-medium">`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}<a`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}href={child.href}`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}target={child.external ? '_blank' : undefined}`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}rel={child.external ? 'noreferrer noopener' : undefined}`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}class="transition-colors duration-300 hover:text-blue"`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}>`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}{child.name}`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}</a>`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}</li>`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}))}`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}</ul>`,
	`${T}${T}${T}${T}${T}${T}${T}${T}${T})}`,
	`${T}${T}${T}${T}${T}${T}${T}${T}</div>`,
	`${T}${T}${T}${T}${T}${T}${T}))}`,
	`${T}${T}${T}${T}${T}${T}</li>`,
	`${T}${T}${T}${T}${T}))}`,
	`${T}${T}${T}${T}</ul>`,
	`${T}${T}${T}</div>`,
	`${T}${T}</div>`,
	`${T}))}`,
	`${T}</Container>`,
	'</div>',
);

writeFileSync('src/components/layout/MegaMenu.astro', HEAD + '\n' + BODY + '\n');
console.log('MegaMenu.astro written');
