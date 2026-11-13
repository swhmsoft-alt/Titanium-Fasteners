/**
 * scripts/gen-industries-aerospace.mjs — 参考 HTML → aerospace 子页 data 文件。
 *
 * WHY
 * ---
 * 参考站是 Astro 站点：同一个文件里既有 island 的 JSON payload，也有渲染后的 HTML。
 * 通用 DOM 解析器会同时吃到两段内容，且 <br> 在栈式解析里会被丢掉
 * （联系地址是"一行一段"的版式，必须保留换行）。因此：
 *
 *   - 结构化区块（hero / 卡片 / 新闻 / 支持卡 / 链接网格）→ 走 html-tree.mjs
 *   - 联系手风琴（依赖 <br> 分行）→ 走 raw HTML 切片 + 正则
 *
 * 用法：node scripts/gen-industries-aerospace.mjs
 *
 * 输入：
 *   qa/ref/industries-aerospace.html              参考站 DOM（recipe 阶段产出）
 *   public/images/industries-aerospace/_manifest.json  原图 URL → 本地文件映射
 *
 * 输出：
 *   src/data/industries-aerospace.ts                页面数据（禁止手改）
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { parseTree, findAll, decodeEntities } from './lib/html-tree.mjs';
import { recordRead, recordWrite } from './lib/session-budget.mjs';

const REF_HTML = 'qa/ref/industries-aerospace.html';
const MANIFEST = 'public/images/industries-aerospace/_manifest.json';
const OUT_TS = 'src/data/industries-aerospace.ts';

if (!existsSync(REF_HTML)) {
	console.error(`missing ${REF_HTML}`);
	process.exit(1);
}
recordRead(REF_HTML, 'tool');
if (existsSync(MANIFEST)) recordRead(MANIFEST, 'tool');

const raw = readFileSync(REF_HTML, 'utf8');

/* ── 图片映射：参考 URL → 本地文件 ───────────────────────────────────── */
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
const strip = (p) => p.replace(/^\/public\//, '/');
const localPath = (url) => {
	if (!url) return '';
	const hit = manifest[url];
	return hit ? strip(hit) : '';
};
/** CDN 常只差 ?q= 参数，去掉查询串再匹配一次。 */
const localPathLoose = (url) => {
	if (!url) return '';
	const bare = url.split('?')[0];
	for (const [k, v] of Object.entries(manifest)) {
		if (k.split('?')[0] === bare) return strip(v);
	}
	return '';
};
const img = (url) => localPath(url) || localPathLoose(url) || url;

/* ── DOM 辅助 ───────────────────────────────────────────────────────── */
const roots = parseTree(raw);
const main = findAll(roots, (n) => n.tag === 'main')[0];
if (!main) {
	console.error('no <main> in reference HTML');
	process.exit(1);
}
const cls = (n) => n.attrs.class ?? '';
const has = (n, c) => cls(n).includes(c);
/** 取纯文本，但跳过 script/style（island 的 JSON payload 会污染 textContent）。 */
const txt = (n) => {
	if (!n) return '';
	const parts = [];
	const walk = (x) => {
		if (x.tag === 'script' || x.tag === 'style') return;
		if (x.text) parts.push(x.text);
		for (const c of x.children) walk(c);
	};
	walk(n);
	return decodeEntities(parts.join(' ').replace(/\s+/g, ' ').trim());
};
const first = (node, pred) => findAll(node, (n) => pred(n))[0];
const firstTag = (node, tag) => first(node, (n) => n.tag === tag);
const kids = (node, tag) => node.children.filter((c) => c.tag === tag);

/* ── Hero ───────────────────────────────────────────────────────────── */
const heroHeader = firstTag(main, 'header');
const navOl = firstTag(heroHeader, 'ol');
const crumbs = kids(navOl ?? { children: [] }, 'li').map((li) => {
	const a = firstTag(li, 'a');
	const span = firstTag(li, 'span');
	return { label: txt(a) || txt(span), href: a ? a.attrs.href : undefined };
});
const heroPs = findAll(heroHeader, (n) => n.tag === 'p');
const heroH1 = firstTag(heroHeader, 'h1');
const heroImg = firstTag(heroHeader, 'img');
const hero = {
	breadcrumb: crumbs,
	eyebrow: txt(heroPs[0]),
	heading: txt(heroH1),
	lead: txt(heroPs[1]),
	image: {
		src: img(heroImg?.attrs.src),
		alt: heroImg?.attrs.alt ?? '',
		width: Number(heroImg?.attrs.width ?? 0),
		height: Number(heroImg?.attrs.height ?? 0),
	},
};

/* ── 三个 teaser 区块（container-fluid-wide，各 2 张卡） ────────────── */
const teaserArticles = findAll(main, (n) => n.tag === 'article' && has(n, 'container-fluid-wide'));
const teaserGroups = teaserArticles.map((article) => {
	const grid = first(article, (n) => n.tag === 'div' && has(n, 'ul:grid-cols-18')) ?? article;
	return kids(grid, 'a').map((a) => {
		const image = firstTag(a, 'img');
		const cardCls = cls(a);
		const span = cardCls.includes('ul:col-span-11')
			? 'wide'
			: cardCls.includes('ul:col-span-7')
				? 'narrow'
				: 'wide';
		return {
			href: a.attrs.href,
			image: img(image?.attrs.src),
			alt: image?.attrs.alt ?? '',
			imageWidth: Number(image?.attrs.width ?? 0),
			imageHeight: Number(image?.attrs.height ?? 0),
			span,
			title: txt(firstTag(a, 'h2')),
			description: txt(firstTag(a, 'p')),
		};
	});
});

/* ── 新闻 ───────────────────────────────────────────────────────────── */
const newsArticle = findAll(main, (n) => n.tag === 'article').find((a) => {
	const h2 = firstTag(a, 'h2');
	return h2 && txt(h2) === 'News Overview';
});
const newsGrid = first(newsArticle, (n) => n.tag === 'div' && has(n, 'md:grid-cols-2'));
const newsItems = findAll(newsArticle, (n) => n.tag === 'section').map((section) => {
	const a = firstTag(section, 'a');
	const image = firstTag(section, 'img');
	const ps = findAll(section, (n) => n.tag === 'p');
	return {
		href: a?.attrs.href ?? '',
		image: img(image?.attrs.src),
		alt: image?.attrs.alt ?? '',
		date: txt(ps[0]),
		title: txt(firstTag(section, 'h3')),
		body: txt(ps[1]),
	};
});

/* ── 视频（C-Parts） ────────────────────────────────────────────────── */
const videoArticle = findAll(main, (n) => n.tag === 'article').find((a) => {
	const h2 = firstTag(a, 'h2');
	return h2 && txt(h2).includes('C-Parts');
});
const videoImg = firstTag(videoArticle, 'img');
const video = {
	heading: txt(firstTag(videoArticle, 'h2')),
	poster: img(videoImg?.attrs.src),
	posterAlt: videoImg?.attrs.alt ?? '',
};

/* ── 支持卡（6 张） ─────────────────────────────────────────────────── */
const supportArticle = findAll(main, (n) => n.tag === 'article').find((a) => {
	const h2 = firstTag(a, 'h2');
	return h2 && txt(h2).startsWith('How We Support');
});
const supportCards = findAll(supportArticle, (n) => n.tag === 'section').map((section) => {
	const image = firstTag(section, 'img');
	return {
		icon: img(image?.attrs.src),
		iconAlt: image?.attrs.alt ?? '',
		title: txt(firstTag(section, 'h3')),
		description: txt(firstTag(section, 'p')),
	};
});

/* ── 联系手风琴（依赖 <br> 分行，走 raw HTML） ───────────────────────── */
const deTag = (s) =>
	decodeEntities(
		s
			.replace(/<br\s*\/?>/gi, '\n')
			.replace(/<[^>]+>/g, '')
			.replace(/&nbsp;/g, ' '),
	);
const lines = (s) =>
	deTag(s)
		.split('\n')
		.map((l) => l.replace(/\s+/g, ' ').trim())
		.filter(Boolean);

const detailChunks = raw.split(/<details\b/).slice(1);
const contacts = detailChunks
	.map((chunk) => {
		const head = chunk.slice(0, chunk.indexOf('</summary>'));
		const countryM = /<h3[^>]*>([^<]*)<\/h3>/.exec(head);
		if (!countryM) return null;
		const bodyStart = chunk.indexOf('<div class="accordion-details');
		const body = bodyStart === -1 ? '' : chunk.slice(bodyStart);
		const entries = [];
		const pRe = /<p class="text-p pb-12 text-gray lg:pb-20">([\s\S]*?)<\/p>/g;
		let pm;
		while ((pm = pRe.exec(body)) !== null) {
			const html = pm[1];
			const strongM = /<strong>([\s\S]*?)<\/strong>/.exec(html);
			if (!strongM) continue;
			const company = deTag(strongM[1]).replace(/\s+/g, ' ').trim();
			const rest = html.slice(strongM.index + strongM[0].length);
			const phoneM = /href="(tel:[^"]+)"[^>]*>([^<]*)</.exec(rest);
			const mailM = /href="(mailto:[^"]+)"[^>]*>([^<]*)</.exec(rest);
			const before = rest.split('Phone:')[0];
			entries.push({
				company,
				address: lines(before),
				phone: phoneM ? { label: 'Phone:', value: phoneM[2].trim(), href: phoneM[1] } : null,
				email: mailM ? { label: 'E-Mail:', value: mailM[2].trim(), href: mailM[1] } : null,
			});
		}
		return { country: deTag(countryM[1]).trim(), entries };
	})
	.filter(Boolean);

/* ── 两个链接网格（3 列：图标 + 标题 + 箭头链接） ───────────────────── */
const gridArticles = findAll(main, (n) => n.tag === 'article' && has(n, 'md:grid-cols-3'));
const linkGrids = gridArticles.map((article) => ({
	cards: kids(article, 'section').map((section) => {
		const image = firstTag(section, 'img');
		const ul = firstTag(section, 'ul');
		return {
			icon: img(image?.attrs.src),
			iconAlt: image?.attrs.alt ?? '',
			heading: txt(firstTag(section, 'h2')),
			links: kids(ul ?? { children: [] }, 'li').map((li) => {
				const a = firstTag(li, 'a');
				const span = firstTag(li, 'span');
				return { label: txt(span) || txt(a), href: a?.attrs.href ?? '' };
			}),
		};
	}),
}));

/* ── 输出 TS ────────────────────────────────────────────────────────── */
const q = (s) => JSON.stringify(String(s ?? ''));
const L = [];
L.push(`/**`);
L.push(` * AUTO-GENERATED — do not edit by hand.`);
L.push(` * Regenerate: npm run gen:industries-aerospace`);
L.push(` *`);
L.push(` * Source: qa/ref/industries-aerospace.html  (Bossard Aerospace, ${hero.heading})`);
L.push(` */`);
L.push(``);
L.push(`export interface BreadcrumbItem {`);
L.push(`\tlabel: string;`);
L.push(`\thref?: string;`);
L.push(`}`);
L.push(``);
L.push(`export interface TeaserCard {`);
L.push(`\thref: string;`);
L.push(`\timage: string;`);
L.push(`\talt: string;`);
L.push(`\timageWidth: number;`);
L.push(`\timageHeight: number;`);
L.push(`\tspan: 'wide' | 'narrow';`);
L.push(`\ttitle: string;`);
L.push(`\tdescription: string;`);
L.push(`}`);
L.push(``);
L.push(`export interface NewsItem {`);
L.push(`\thref: string;`);
L.push(`\timage: string;`);
L.push(`\talt: string;`);
L.push(`\tdate: string;`);
L.push(`\ttitle: string;`);
L.push(`\tbody: string;`);
L.push(`}`);
L.push(``);
L.push(`export interface SupportCard {`);
L.push(`\ticon: string;`);
L.push(`\ticonAlt: string;`);
L.push(`\ttitle: string;`);
L.push(`\tdescription: string;`);
L.push(`}`);
L.push(``);
L.push(`export interface ContactLink {`);
L.push(`\tlabel: string;`);
L.push(`\tvalue: string;`);
L.push(`\thref: string;`);
L.push(`}`);
L.push(``);
L.push(`export interface ContactEntry {`);
L.push(`\tcompany: string;`);
L.push(`\taddress: string[];`);
L.push(`\tphone: ContactLink | null;`);
L.push(`\temail: ContactLink | null;`);
L.push(`}`);
L.push(``);
L.push(`export interface ContactCountry {`);
L.push(`\tcountry: string;`);
L.push(`\tentries: ContactEntry[];`);
L.push(`}`);
L.push(``);
L.push(`export interface LinkCard {`);
L.push(`\ticon: string;`);
L.push(`\ticonAlt: string;`);
L.push(`\theading: string;`);
L.push(`\tlinks: { label: string; href: string }[];`);
L.push(`}`);
L.push(``);
L.push(`export const AEROSPACE = {`);
L.push(`\tseo: {`);
L.push(`\t\ttitle: 'Bossard Aerospace: Fasteners for Aerospace | Bossard Group',`);
L.push(`\t\tdescription: ${q(hero.lead)},`);
L.push(`\t},`);
L.push(`\thero: {`);
L.push(`\t\tbreadcrumb: [`);
for (const c of hero.breadcrumb) {
	L.push(`\t\t\t{ label: ${q(c.label)}${c.href ? `, href: ${q(c.href)}` : ''} },`);
}
L.push(`\t\t] as BreadcrumbItem[],`);
L.push(`\t\teyebrow: ${q(hero.eyebrow)},`);
L.push(`\theading: ${q(hero.heading)},`);
L.push(`\tlead: ${q(hero.lead)},`);
L.push(`\t\timage: {`);
L.push(`\t\t\tsrc: ${q(hero.image.src)},`);
L.push(`\t\t\talt: ${q(hero.image.alt)},`);
L.push(`\t\t\twidth: ${hero.image.width},`);
L.push(`\t\t\theight: ${hero.image.height},`);
L.push(`\t\t},`);
L.push(`\t},`);
L.push(`\tteasers: [`);
for (const group of teaserGroups) {
	L.push(`\t\t[`);
	for (const c of group) {
		L.push(`\t\t\t{`);
		L.push(`\t\t\t\thref: ${q(c.href)},`);
		L.push(`\t\t\t\timage: ${q(c.image)},`);
		L.push(`\t\t\t\talt: ${q(c.alt)},`);
		L.push(`\t\t\t\timageWidth: ${c.imageWidth},`);
		L.push(`\t\t\t\timageHeight: ${c.imageHeight},`);
		L.push(`\t\t\t\tspan: ${q(c.span)},`);
		L.push(`\t\t\t\ttitle: ${q(c.title)},`);
		L.push(`\t\t\t\tdescription: ${q(c.description)},`);
		L.push(`\t\t\t},`);
	}
	L.push(`\t\t],`);
}
L.push(`\t],`);
L.push(`\tnews: {`);
L.push(`\t\theading: ${q('News Overview')},`);
L.push(`\t\titems: [`);
for (const n of newsItems) {
	L.push(`\t\t\t{`);
	L.push(`\t\t\t\thref: ${q(n.href)},`);
	L.push(`\t\t\t\timage: ${q(n.image)},`);
	L.push(`\t\t\t\talt: ${q(n.alt)},`);
	L.push(`\t\t\t\tdate: ${q(n.date)},`);
	L.push(`\t\t\t\ttitle: ${q(n.title)},`);
	L.push(`\t\t\t\tbody: ${q(n.body)},`);
	L.push(`\t\t\t},`);
}
L.push(`\t\t],`);
L.push(`\t},`);
L.push(`\tvideo: {`);
L.push(`\t\theading: ${q(video.heading)},`);
L.push(`\t\tposter: ${q(video.poster)},`);
L.push(`\t\tposterAlt: ${q(video.posterAlt)},`);
L.push(`\t},`);
L.push(`\tsupport: {`);
L.push(`\t\theading: ${q('How We Support You in Aerospace Manufacturing')},`);
L.push(`\t\tcards: [`);
for (const c of supportCards) {
	L.push(`\t\t\t{`);
	L.push(`\t\t\t\ticon: ${q(c.icon)},`);
	L.push(`\t\t\t\ticonAlt: ${q(c.iconAlt)},`);
	L.push(`\t\t\t\ttitle: ${q(c.title)},`);
	L.push(`\t\t\t\tdescription: ${q(c.description)},`);
	L.push(`\t\t\t},`);
}
L.push(`\t\t],`);
L.push(`\t},`);
L.push(`\tcontacts: {`);
L.push(`\t\theading: ${q('Bossard Aerospace Contacts')},`);
L.push(`\t\tcountries: [`);
for (const c of contacts) {
	L.push(`\t\t\t{`);
	L.push(`\t\t\t\tcountry: ${q(c.country)},`);
	L.push(`\t\t\t\tentries: [`);
	for (const e of c.entries) {
		L.push(`\t\t\t\t\t{`);
		L.push(`\t\t\t\t\t\tcompany: ${q(e.company)},`);
		L.push(`\t\t\t\t\t\taddress: [${e.address.map((a) => q(a)).join(', ')}],`);
		L.push(`\t\t\t\t\t\tphone: ${e.phone ? `{ label: ${q(e.phone.label)}, value: ${q(e.phone.value)}, href: ${q(e.phone.href)} }` : 'null'},`);
		L.push(`\t\t\t\t\t\temail: ${e.email ? `{ label: ${q(e.email.label)}, value: ${q(e.email.value)}, href: ${q(e.email.href)} }` : 'null'},`);
		L.push(`\t\t\t\t\t},`);
	}
	L.push(`\t\t\t\t],`);
	L.push(`\t\t\t},`);
}
L.push(`\t\t],`);
L.push(`\t},`);
L.push(`\tlinkGrids: [`);
for (const g of linkGrids) {
	L.push(`\t\t{`);
	L.push(`\t\t\tcards: [`);
	for (const c of g.cards) {
		L.push(`\t\t\t\t{`);
		L.push(`\t\t\t\t\ticon: ${q(c.icon)},`);
		L.push(`\t\t\t\t\ticonAlt: ${q(c.iconAlt)},`);
		L.push(`\t\t\t\t\theading: ${q(c.heading)},`);
		L.push(`\t\t\t\t\tlinks: [`);
		for (const l of c.links) {
			L.push(`\t\t\t\t\t\t{ label: ${q(l.label)}, href: ${q(l.href)} },`);
		}
		L.push(`\t\t\t\t\t],`);
		L.push(`\t\t\t\t},`);
	}
	L.push(`\t\t\t],`);
	L.push(`\t\t},`);
}
L.push(`\t],`);
L.push(`};`);
L.push(``);

mkdirSync('src/data', { recursive: true });
writeFileSync(OUT_TS, L.join('\n'), 'utf8');
recordWrite(OUT_TS);

console.log(`data ${OUT_TS}`);
console.log(`  hero="${hero.heading}" crumbs=${hero.breadcrumb.length} img=${hero.image.src.slice(0, 60)}`);
console.log(`  teasers=${teaserGroups.length} groups (${teaserGroups.map((g) => g.length).join('/')})`);
console.log(`  news=${newsItems.length} video="${video.heading}" support=${supportCards.length}`);
console.log(`  contacts=${contacts.length} countries / ${contacts.reduce((n, c) => n + c.entries.length, 0)} entries`);
console.log(`  linkGrids=${linkGrids.length} (${linkGrids.map((g) => g.cards.length).join('/')} cards)`);
const missing = [
	hero.image.src,
	...teaserGroups.flat().map((c) => c.image),
	...newsItems.map((n) => n.image),
	...supportCards.map((c) => c.icon),
	...linkGrids.flatMap((g) => g.cards.map((c) => c.icon)),
].filter((u) => typeof u === 'string' && (u.startsWith('//') || u.startsWith('http')));
if (missing.length) console.log(`  ! ${missing.length} image(s) not localised (remote)`);
