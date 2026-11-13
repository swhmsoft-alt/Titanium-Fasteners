/**
 * scripts/gen-category-detail.mjs — 参考 HTML → 品类子页 data 文件。
 *
 * WHY
 * ---
 * 12 个品类子页结构完全相同，只有文案/图片/链接不同。把"从参考站抽结构"
 * 交给脚本，模型就只负责"看一眼结果对不对"，不再逐页手抄 16 个品牌卡。
 *
 * 用法：
 *   node scripts/gen-category-detail.mjs <slug>
 *   node scripts/gen-category-detail.mjs direct-assembly-screws
 *
 * 输入：
 *   qa/ref/<slug>.html                       参考站 DOM（recipe 阶段产出）
 *   public/images/<slug>/_manifest.json       原图 URL → 本地文件映射
 *
 * 输出：
 *   src/data/category-detail/<slug>.ts       页面数据
 *
 * 零依赖（复用 scripts/lib/html-tree.mjs），不碰浏览器。
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseTree, findAll, childOf, textOf, classOf, decodeEntities } from './lib/html-tree.mjs';

const slug = process.argv[2];
if (!slug) {
	console.error('usage: node scripts/gen-category-detail.mjs <slug>');
	process.exit(1);
}
/* 参考站与本地资源都带 "category-detail-" 前缀；两种命名都兼容。 */
const pick = (a, b) => (existsSync(a) ? a : b);
const REF_HTML = pick(`qa/ref/category-detail-${slug}.html`, `qa/ref/${slug}.html`);
const MANIFEST = pick(
	`public/images/category-detail-${slug}/_manifest.json`,
	`public/images/${slug}/_manifest.json`,
);
const OUT_TS = `src/data/category-detail/${slug}.ts`;
if (!existsSync(REF_HTML)) {
	console.error(`missing ${REF_HTML}`);
	process.exit(1);
}

/* ── 图片映射：参考 URL → 本地文件 ───────────────────────────────── */
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
/** 把 manifest 的 "/public/x" 规范成站点路径 "/x"。 */
const localPath = (url) => {
	if (!url) return '';
	const hit = manifest[url];
	if (!hit) return '';
	return hit.replace(/^\/public\//, '/');
};
/** 去掉查询串后再匹配一次（CDN 常常只差 ?q= 参数）。 */
const localPathLoose = (url) => {
	if (!url) return '';
	const bare = url.split('?')[0];
	for (const [k, v] of Object.entries(manifest)) {
		if (k.split('?')[0] === bare) return v.replace(/^\/public\//, '/');
	}
	return '';
};
const img = (url) => localPath(url) || localPathLoose(url) || url;

/* ── DOM 辅助 ─────────────────────────────────────────────────────── */
let HTML_SRC = '';
const roots = parseTree((HTML_SRC = readFileSync(REF_HTML, 'utf8')));
const main = findAll(roots, (n) => n.tag === 'main')[0];
if (!main) {
	console.error('no <main> in reference HTML');
	process.exit(1);
}
const cls = classOf;
const has = (n, c) => cls(n).includes(c);
const kid = (n, tag, c) => (n?.children ?? []).find((k) => k.tag === tag && (!c || has(k, c)));
const kidAll = (n, tag, c) => (n?.children ?? []).filter((k) => k.tag === tag && (!c || has(k, c)));
const txt = (n) => (n ? textOf(n).replace(/\s+/g, ' ').trim() : '');
/** astro-island 只是 hydration 壳，展开后按文档顺序取真实块。 */
const flatten = (node) =>
	findAll(node.children ?? [], (n) =>
		['header', 'article', 'div'].includes(n.tag) &&
		(n.tag !== 'div' || has(n, 'container-fluid')),
	);

/* ── 逐块抽取 ─────────────────────────────────────────────────────── */
const blocks = flatten(main);

/* Hero：header 里的面包屑 / eyebrow / h1 / lead / 按钮 / 图 */
const heroNode = blocks.find((b) => b.tag === 'header');
const navOl = findAll(heroNode, (n) => n.tag === 'ol')[0];
const crumbs = kidAll(navOl, 'li').map((li) => {
	const a = kid(li, 'a');
	const span = kid(li, 'span');
	const btn = kid(li, 'button');
	return {
		label: txt(a) || txt(span) || txt(btn),
		href: a ? a.attrs.href : undefined,
	};
});
const heroImg = findAll(heroNode, (n) => n.tag === 'img' && n.attrs.src && !n.attrs.src.includes('sprite'))
	.filter((n) => cls(n).includes('aspect-5/4'))
	.map((n) => n)[0];
const heroBtnBox = findAll(heroNode, (n) => n.tag === 'section')[0];
/* 按钮行是 <div class="flex gap-8 py-8">，只取它的直接子元素（排除弹窗里的关闭键）。 */
const heroBtnRow = findAll(heroBtnBox, (n) => n.tag === 'div' && has(n, 'gap-8'))[0];
const heroButtons = (heroBtnRow?.children ?? []).filter((b) => b.tag === 'a' || b.tag === 'button');

const hero = {
	breadcrumb: crumbs,
	eyebrow: txt(findAll(heroNode, (n) => n.tag === 'p' && has(n, 'text-label'))[0]),
	heading: txt(findAll(heroNode, (n) => n.tag === 'h1')[0]),
	lead: txt(findAll(heroNode, (n) => n.tag === 'p' && has(n, 'text-lead'))[0]),
	image: img(heroImg?.attrs.src),
	imageAlt: heroImg?.attrs.alt ?? '',
	imageWidth: Number(heroImg?.attrs.width ?? 634),
	imageHeight: Number(heroImg?.attrs.height ?? 507),
	buttons: heroButtons.map((b) => ({
		label: txt(b),
		href: b.attrs.href,
		kind: b.tag === 'button' ? 'dialog' : 'link',
		variant: (b.attrs.class ?? '').includes('bg-blue text-white') ? 'primary' : 'secondary',
	})),
};

/* 其余块 */
const video = { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' };
const richText = [];
const brands = { heading: '', tiles: [] };
const services = { cards: [] };
let intro = '';
let note = null;

for (const b of blocks) {
	if (b.tag === 'header') continue;

	if (b.tag === 'article') {
		const h2 = kid(b, 'h2');
		const grid = kid(b, 'div', 'grid');
		const videoImg = findAll(b, (n) => n.tag === 'img' && n.attrs.src?.includes('youtube'))[0];
		if (videoImg) {
			video.heading = txt(h2);
			video.thumbnail = videoImg.attrs.src;
			video.thumbnailAlt = videoImg.attrs.alt ?? '';
			video.caption = txt(kid(b, 'p', 'text-p-sm'));
			continue;
		}
		/* 卡片网格：只有"每个 section 里都有 <a>"才算品牌网格 / 服务卡片网格。
		 * 参考站还有第三种网格（无链接的图标卡，如 embedding 的 "Advantages of
		 * bigHead® Fasteners"），那种网格不属于任何已知块类型 —— 直接跳过，
		 * 不能误判成品牌网格。没有 <a> 的 section 也过滤掉，避免 a.attrs 抛异常。 */
		const sectionsWithLink = (g) =>
			kidAll(g, 'section').filter((sec) => kid(sec, 'a'));
		if (grid && has(grid, 'md:grid-cols-2')) {
			const secs = sectionsWithLink(grid);
			if (secs.length) {
				brands.heading = txt(h2);
				brands.tiles = secs.map((sec) => {
					const a = kid(sec, 'a');
					const fig = kid(a, 'figure');
					const pic = kid(fig, 'img');
					const col = kid(a, 'div', 'pl-16');
					return {
						href: a.attrs.href ?? '',
						image: pic?.attrs?.src ? img(pic.attrs.src) : '',
						alt: pic?.attrs?.alt ?? '',
						label: txt(kid(col, 'p', 'text-label')),
						title: txt(kid(col, 'h3')),
						description: txt(kid(col, 'p', 'text-p-sm')),
					};
				});
				continue;
			}
		}
		if (grid && has(grid, 'md:grid-cols-3')) {
			const secs = sectionsWithLink(grid);
			if (secs.length) {
				services.cards = secs.map((sec) => {
					const a = kid(sec, 'a');
					const pic = kid(kid(a, 'figure'), 'img');
					const col = kid(a, 'div', 'mb-12');
					/* 卡片里有两处 p：label（text-label）与正文（text-gray）。 */
					const desc = kidAll(col, 'p').find((p) => has(p, 'text-gray'));
					return {
						href: a.attrs.href ?? '',
						image: pic?.attrs?.src ? img(pic.attrs.src) : '',
						alt: pic?.attrs?.alt ?? '',
						label: txt(kid(col, 'p', 'text-label')),
						title: txt(kid(col, 'h2')),
						description: txt(desc),
					};
				});
				continue;
			}
		}
		continue;
	}

	/* div.container-fluid —— 富文本段 */
	const h2 = kid(b, 'h2');
	const ul = kid(b, 'ul');
	const p = kid(b, 'p');
	const a = p ? kid(p, 'a') : undefined;
	if (h2) {
		richText.push({ kind: 'heading', text: txt(h2) });
	} else if (ul) {
		richText.push({
			kind: 'list',
			items: kidAll(ul, 'li').map((li) => {
				/* <li><b>lead</b> tail</li> —— 文本节点在 <b> 之后，故用节点自身文本做 tail。 */
				const lead = txt(kid(li, 'b'));
				const tail = (li.text ?? '').replace(/\s+/g, ' ').trim();
				return { lead, text: tail };
			}),
		});
	} else if (p && a) {
		/* <p>前缀 <a>链接</a> 后缀</p> —— 树解析会丢顺序，直接回原始 HTML 切三段。 */
		const strip = (s) =>
			decodeEntities(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
		const re = /<p\b[^>]*>([\s\S]*?)<\/p>/g;
		let m;
		let hit = null;
		while ((m = re.exec(HTML_SRC))) {
			const inner = m[1];
			const am = inner.match(/<a\b[^>]*>([\s\S]*?)<\/a>/);
			if (!am) continue;
			const at = inner.indexOf(am[0]);
			const prefix = strip(inner.slice(0, at));
			if (!prefix || !txt(p).startsWith(prefix.slice(0, 25))) continue;
			hit = {
				text: prefix,
				linkLabel: strip(am[1]),
				linkHref: am[0].match(/href="([^"]*)"/)?.[1] ?? '',
				linkSuffix: strip(inner.slice(at + am[0].length)),
			};
			break;
		}
		note = hit ?? { text: txt(p), linkLabel: txt(a), linkHref: a.attrs.href, linkSuffix: '' };
	} else if (p) {
		const t = txt(p);
		if (!t) continue;
		if (!intro) intro = t;
		else richText.push({ kind: 'paragraph', text: t });
	}
}

/* ── 输出 ─────────────────────────────────────────────────────────── */
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const ts = (v) => (typeof v === 'string' ? q(v) : JSON.stringify(v));

const seoTitle = textOf(findAll(roots, (n) => n.tag === 'title')[0] ?? { children: [], text: '' });
const seoDesc =
	findAll(roots, (n) => n.tag === 'meta' && n.attrs.name === 'description')[0]?.attrs.content ?? '';

const lines = [];
lines.push(`/**`);
lines.push(` * src/data/category-detail/${slug}.ts`);
lines.push(` *`);
lines.push(` * 由 scripts/gen-category-detail.mjs 从参考站 HTML 生成 —— 禁止手改。`);
lines.push(` * 参考：https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/${slug}/`);
lines.push(` */`);
lines.push(``);
lines.push(`import type { CategoryDetailPage } from './types';`);
lines.push(``);
lines.push(`export const CATEGORY_DETAIL: CategoryDetailPage = {`);
lines.push(`\tslug: ${ts(slug)},`);
lines.push(`\tseo: { title: ${ts(seoTitle)}, description: ${ts(seoDesc)} },`);
lines.push(`\thero: {`);
lines.push(`\t\tbreadcrumb: [`);
for (const c of hero.breadcrumb) {
	lines.push(`\t\t\t{ label: ${ts(c.label)}${c.href ? `, href: ${ts(c.href)}` : ''} },`);
}
lines.push(`\t\t],`);
lines.push(`\t\teyebrow: ${ts(hero.eyebrow)},`);
lines.push(`\t\theading: ${ts(hero.heading)},`);
lines.push(`\t\tlead: ${ts(hero.lead)},`);
lines.push(`\t\timage: ${ts(hero.image)},`);
lines.push(`\t\timageAlt: ${ts(hero.imageAlt)},`);
lines.push(`\t\timageWidth: ${hero.imageWidth},`);
lines.push(`\t\timageHeight: ${hero.imageHeight},`);
lines.push(`\t\tbuttons: [`);
for (const b of hero.buttons) {
	lines.push(
		`\t\t\t{ label: ${ts(b.label)}, kind: ${ts(b.kind)}, variant: ${ts(b.variant)}${b.href ? `, href: ${ts(b.href)}` : ''} },`,
	);
}
lines.push(`\t\t],`);
lines.push(`\t},`);
lines.push(`\tintro: ${ts(intro)},`);
lines.push(
	`\tvideo: { heading: ${ts(video.heading)}, thumbnail: ${ts(video.thumbnail)}, thumbnailAlt: ${ts(video.thumbnailAlt)}, caption: ${ts(video.caption)} },`,
);
lines.push(`\trichText: [`);
for (const b of richText) {
	if (b.kind === 'list') {
		lines.push(`\t\t{ kind: 'list', items: [`);
		for (const it of b.items) {
			lines.push(`\t\t\t{ lead: ${ts(it.lead)}, text: ${ts(it.text)} },`);
		}
		lines.push(`\t\t] },`);
	} else {
		lines.push(`\t\t{ kind: ${ts(b.kind)}, text: ${ts(b.text)} },`);
	}
}
lines.push(`\t],`);
lines.push(`\tbrands: {`);
lines.push(`\t\theading: ${ts(brands.heading)},`);
lines.push(`\t\ttiles: [`);
for (const t of brands.tiles) {
	lines.push(`\t\t\t{`);
	lines.push(`\t\t\t\thref: ${ts(t.href)},`);
	lines.push(`\t\t\t\timage: ${ts(t.image)},`);
	lines.push(`\t\t\t\talt: ${ts(t.alt)},`);
	lines.push(`\t\t\t\tlabel: ${ts(t.label)},`);
	lines.push(`\t\t\t\ttitle: ${ts(t.title)},`);
	lines.push(`\t\t\t\tdescription: ${ts(t.description)},`);
	lines.push(`\t\t\t},`);
}
lines.push(`\t\t],`);
lines.push(`\t},`);
lines.push(
	`\tnote: ${note ? `{ text: ${ts(note.text)}, linkLabel: ${ts(note.linkLabel)}, linkHref: ${ts(note.linkHref)}, linkSuffix: ${ts(note.linkSuffix)} }` : 'null'},`,
);
lines.push(`\tservices: {`);
lines.push(`\t\tcards: [`);
for (const c of services.cards) {
	lines.push(`\t\t\t{`);
	lines.push(`\t\t\t\thref: ${ts(c.href)},`);
	lines.push(`\t\t\t\timage: ${ts(c.image)},`);
	lines.push(`\t\t\t\talt: ${ts(c.alt)},`);
	lines.push(`\t\t\t\tlabel: ${ts(c.label)},`);
	lines.push(`\t\t\t\ttitle: ${ts(c.title)},`);
	lines.push(`\t\t\t\tdescription: ${ts(c.description)},`);
	lines.push(`\t\t\t},`);
}
lines.push(`\t\t],`);
lines.push(`\t},`);
lines.push(`};`);
lines.push('');

mkdirSync('src/data/category-detail', { recursive: true });
writeFileSync(OUT_TS, lines.join('\n'), 'utf8');

/* 共享类型文件：12 页共用，只写一次。 */
const TYPES_TS = `src/data/category-detail/types.ts`;
const types = `/**
 * 品类子页的共享类型 —— 由 scripts/gen-category-detail.mjs 维护。
 * 12 个品类子页共用同一套结构，只有数据不同。
 */
export interface Crumb {
	label: string;
	href?: string;
}

export interface HeroButton {
	label: string;
	href?: string;
	kind: 'link' | 'dialog';
	variant: 'primary' | 'secondary';
}

export interface BrandTile {
	href: string;
	image: string;
	alt: string;
	label: string;
	title: string;
	description: string;
}

export interface ServiceCard {
	href: string;
	image: string;
	alt: string;
	label: string;
	title: string;
	description: string;
}

export type RichBlock =
	| { kind: 'heading'; text: string }
	| { kind: 'paragraph'; text: string }
	| { kind: 'list'; items: { lead: string; text: string }[] };

export interface CategoryDetailPage {
	slug: string;
	seo: { title: string; description: string };
	hero: {
		breadcrumb: Crumb[];
		eyebrow: string;
		heading: string;
		lead: string;
		image: string;
		imageAlt: string;
		imageWidth: number;
		imageHeight: number;
		buttons: HeroButton[];
	};
	intro: string;
	video: { heading: string; thumbnail: string; thumbnailAlt: string; caption: string };
	richText: RichBlock[];
	brands: { heading: string; tiles: BrandTile[] };
	note: { text: string; linkLabel: string; linkHref: string; linkSuffix: string } | null;
	services: { cards: ServiceCard[] };
}
`;
writeFileSync(TYPES_TS, types, 'utf8');

/* 索引：把目录下所有已生成的品类子页汇总，供 [slug].astro 动态路由使用。 */
const DIR = 'src/data/category-detail';
const slugs = readdirSync(DIR)
	.filter((f) => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts')
	.map((f) => f.replace(/\.ts$/, ''))
	.sort();
const index = `/**
 * 品类子页索引 —— 由 scripts/gen-category-detail.mjs 自动生成，禁止手改。
 * 已生成 ${slugs.length} / 12 页。
 */
import type { CategoryDetailPage } from './types';
${slugs.map((s) => `import { CATEGORY_DETAIL as ${s.replace(/-(\w)/g, (_, c) => c.toUpperCase())} } from './${s}';`).join('\n')}

export const CATEGORY_DETAIL_SLUGS = [
${slugs.map((s) => `\t'${s}',`).join('\n')}
] as const;

export const CATEGORY_DETAIL_PAGES: Record<string, CategoryDetailPage> = {
${slugs.map((s) => `\t'${s}': ${s.replace(/-(\w)/g, (_, c) => c.toUpperCase())},`).join('\n')}
};
`;
writeFileSync(join(DIR, 'index.ts'), index, 'utf8');
console.log(`data ${OUT_TS}`);
console.log(`index ${join(DIR, 'index.ts')} (${slugs.length}/12 pages)`);
console.log(
	`  hero="${hero.heading}" crumbs=${hero.breadcrumb.length} buttons=${hero.buttons.length} ` +
		`rich=${richText.length} tiles=${brands.tiles.length} cards=${services.cards.length} ` +
		`intro=${intro ? 'yes' : 'no'} note=${note ? 'yes' : 'no'}`,
);

