/**
 * scripts/gen-industries.mjs — 参考 HTML → industries 页 data 文件。
 *
 * WHY
 * ---
 * 手抄 DOM 是本项目最大的一处 token 浪费：8 张行业卡 + callout + 联系表单，
 * 靠 read_files 一段段读再手打进 TS，既慢又容易抄错。把"从参考站抽结构"
 * 交给脚本，模型只负责"看一眼脚本产出的摘要对不对"。
 *
 * 用法：node scripts/gen-industries.mjs
 *
 * 输入：
 *   qa/ref/industries.html                    参考站 DOM（recipe 阶段产出）
 *   public/images/industries/_manifest.json    原图 URL → 本地文件映射
 *
 * 输出：
 *   src/data/industries.ts                    页面数据（禁止手改）
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { parseTree, findAll, textOf, classOf } from './lib/html-tree.mjs';
import { recordRead, recordWrite } from './lib/session-budget.mjs';

const REF_HTML = 'qa/ref/industries.html';
const MANIFEST = 'public/images/industries/_manifest.json';
const OUT_TS = 'src/data/industries.ts';

if (!existsSync(REF_HTML)) {
	console.error(`missing ${REF_HTML}`);
	process.exit(1);
}
recordRead(REF_HTML, 'tool');
if (existsSync(MANIFEST)) recordRead(MANIFEST, 'tool');

/* ── 图片映射：参考 URL → 本地文件 ───────────────────────────────────── */
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
const localPath = (url) => {
	if (!url) return '';
	const hit = manifest[url];
	return hit ? hit.replace(/^\/public\//, '/') : '';
};
/** CDN 常只差 ?q= 参数，去掉查询串再匹配一次。 */
const localPathLoose = (url) => {
	if (!url) return '';
	const bare = url.split('?')[0];
	for (const [k, v] of Object.entries(manifest)) {
		if (k.split('?')[0] === bare) return v.replace(/^\/public\//, '/');
	}
	return '';
};
const img = (url) => localPath(url) || localPathLoose(url) || url;

/* ── DOM 辅助 ───────────────────────────────────────────────────────── */
const roots = parseTree(readFileSync(REF_HTML, 'utf8'));
const main = findAll(roots, (n) => n.tag === 'main')[0];
if (!main) {
	console.error('no <main> in reference HTML');
	process.exit(1);
}
const cls = classOf;
const has = (n, c) => cls(n).includes(c);
const txt = (n) => (n ? textOf(n).replace(/\s+/g, ' ').trim() : '');
const first = (node, pred) => findAll(node, (n) => pred(n))[0];
const firstTag = (node, tag) => first(node, (n) => n.tag === tag);

/* ── Hero ───────────────────────────────────────────────────────────── */
const heroHeader = first(main, (n) => n.tag === 'header');
const navOl = firstTag(heroHeader, 'ol');
const crumbs = (navOl?.children ?? []).map((li) => {
	const a = firstTag(li, 'a');
	const span = firstTag(li, 'span');
	return { label: txt(a) || txt(span), href: a ? a.attrs.href : undefined };
});
const heroP = findAll(heroHeader, (n) => n.tag === 'p');
const heroH1 = firstTag(heroHeader, 'h1');
const hero = {
	breadcrumb: crumbs,
	eyebrow: txt(heroP[0]),
	heading: txt(heroH1),
	lead: txt(heroP[1]),
};

/* ── 行业卡（4 个 article × 2 张） ──────────────────────────────────── */
const articles = findAll(main, (n) => n.tag === 'article');
const gridArticles = articles.filter((a) => has(a, 'container-fluid-wide'));
const cards = [];
for (const article of gridArticles) {
	for (const a of findAll(article, (n) => n.tag === 'a')) {
		const image = firstTag(a, 'img');
		const heading = firstTag(a, 'h2');
		const para = findAll(a, (n) => n.tag === 'p');
		const cardCls = cls(a);
		cards.push({
			href: a.attrs.href,
			image: img(image?.attrs.src),
			alt: image?.attrs.alt ?? '',
			imageWidth: Number(image?.attrs.width ?? 0),
			imageHeight: Number(image?.attrs.height ?? 0),
			span: cardCls.includes('ul:col-span-11') ? 'wide' : 'narrow',
			title: txt(heading),
			description: txt(para[0]),
		});
	}
}

/* ── Data Centers callout ───────────────────────────────────────────── */
const calloutArticle = articles.find((a) => has(a, 'py-56') && !has(a, 'container-fluid-wide'));
let callout = null;
if (calloutArticle) {
	const image = firstTag(calloutArticle, 'img');
	const paras = findAll(calloutArticle, (n) => n.tag === 'p');
	const heading = firstTag(calloutArticle, 'h2');
	const cta = first(calloutArticle, (n) => n.tag === 'a' && /rounded-\[28px\]/.test(cls(n)));
	callout = {
		image: img(image?.attrs.src),
		alt: image?.attrs.alt ?? '',
		imageWidth: Number(image?.attrs.width ?? 0),
		imageHeight: Number(image?.attrs.height ?? 0),
		label: txt(paras[0]),
		heading: txt(heading),
		text: txt(paras[1]),
		ctaLabel: txt(cta),
		ctaHref: cta?.attrs.href ?? '',
	};
}

/* ── "You're in Another Industry?" + 联系表单 ───────────────────────── */
const aiHeading = first(main, (n) => n.tag === 'h2' && /Another Industry/i.test(txt(n)));
let contact = null;
if (aiHeading) {
	/* h2 的父容器同时持有正文 <p> 与图文+表单的整行。 */
	const pmap = new Map();
	(function build(n) {
		for (const c of n.children ?? []) {
			pmap.set(c, n);
			build(c);
		}
	})(main);
	const block = pmap.get(aiHeading) ?? aiHeading;

	const bodyText = txt(first(block, (n) => n.tag === 'p'));
	/* SmartBin 图在 contact 容器里，靠 figure 的 lg:w-[72%] 特征定位。 */
	const figure = first(main, (n) => n.tag === 'figure' && has(n, 'lg:w-[72%]'));
	const image = figure ? firstTag(figure, 'img') : null;

	const form = first(main, (n) => n.tag === 'form');
	const fields = [];
	let consent = null;
	if (form) {
		for (const label of findAll(form, (n) => n.tag === 'label')) {
			const control = first(
				label,
				(n) => n.tag === 'input' || n.tag === 'select' || n.tag === 'textarea',
			);
			if (!control) continue;
			if (control.tag === 'input' && control.attrs.type === 'checkbox') continue;
			const spans = findAll(label, (n) => n.tag === 'span');
			const rawLabel = txt(spans[0]).replace(/\s*\*\s*$/, '');
			const field = {
				name: control.attrs.name ?? '',
				type:
					control.tag === 'select'
						? 'select'
						: control.tag === 'textarea'
							? 'textarea'
							: (control.attrs.type ?? 'text'),
				label: rawLabel,
				required: control.attrs.required !== undefined,
			};
			if (field.type === 'select') {
				field.options = findAll(control, (n) => n.tag === 'option').map((o) => txt(o));
			}
			fields.push(field);
		}
		const privacyLink = first(form, (n) => n.tag === 'a');
		/* consent 句式："By submitting this form I consent to the [privacy policy]. This site ..." */
		const consentLabel = first(
			form,
			(n) =>
				n.tag === 'label' &&
				Boolean(findAll(n, (x) => x.tag === 'input' && x.attrs.type === 'checkbox')[0]),
		);
		const linkLabel = txt(privacyLink);
		const consentP = consentLabel ? firstTag(consentLabel, 'p') : null;
		/* 链接在 <p> 的文本流之外，句子里留了一个空位 "the ."，据此切分。 */
		const raw = (txt(consentP) ?? '').split(linkLabel).join('').trim();
		const m = /^([\s\S]*\bthe)\s*\.\s*([\s\S]*)$/.exec(raw);
		consent = {
			before: m ? m[1].trim() : raw,
			linkLabel,
			linkHref: privacyLink?.attrs.href ?? '',
			after: m ? `. ${m[2].trim()}` : '',
		};
	}

	const formH3 = firstTag(form, 'h3');
	const formNote = findAll(form, (n) => n.tag === 'p')[0];
	const submit = firstTag(form, 'button');

	contact = {
		heading: txt(aiHeading),
		text: bodyText,
		image: img(image?.attrs.src),
		imageAlt: image?.attrs.alt ?? '',
		imageWidth: Number(image?.attrs.width ?? 0),
		imageHeight: Number(image?.attrs.height ?? 0),
		form: {
			heading: txt(formH3),
			note: txt(formNote),
			consent,
			submitLabel: txt(submit),
			fields,
		},
	};
}

/* ── 输出 TS ───────────────────────────────────────────────────────── */
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const L = [];
L.push(`/**`);
L.push(` * Industries — 1:1 data for \`/global-en/industries/\`.`);
L.push(` *`);
L.push(` * MEASURED on the reference (1440×1000, 2026-11-10):`);
L.push(` *   hero       label y=313 20px | h1 y=353 64px #004975 | lead 24px`);
L.push(` *   article 1  y=604  h=865  H2 32px "Aerospace"`);
L.push(` *   article 2  y=1469 h=865  H2 32px "Electric Vehicles"`);
L.push(` *   article 3  y=2335 h=865  H2 32px "Medical and Life Science"`);
L.push(` *   article 4  y=3200 h=865  H2 32px "Robotics"`);
L.push(` *   article 5  y=4065 h=913  H2 44px "Data Centers"  bg #ffffff`);
L.push(` *`);
L.push(` * GENERATED by scripts/gen-industries.mjs — do not edit by hand.`);
L.push(` */`);
L.push(``);
L.push(`export interface BreadcrumbItem {`);
L.push(`\tlabel: string;`);
L.push(`\thref?: string;`);
L.push(`}`);
L.push(``);
L.push(`/** A tile of the two-up industry grid. \`span\` mirrors the reference column span. */`);
L.push(`export interface IndustryCard {`);
L.push(`\thref: string;`);
L.push(`\timage: string;`);
L.push(`\talt: string;`);
L.push(`\timageWidth: number;`);
L.push(`\timageHeight: number;`);
L.push(`\t/** 'wide' = aspect-5/4 tile (11 of 18 columns), 'narrow' = aspect-3/4 tile (7 of 18). */`);
L.push(`\tspan: 'wide' | 'narrow';`);
L.push(`\ttitle: string;`);
L.push(`\tdescription: string;`);
L.push(`}`);
L.push(``);
L.push(`export interface DataCentersCallout {`);
L.push(`\timage: string;`);
L.push(`\talt: string;`);
L.push(`\timageWidth: number;`);
L.push(`\timageHeight: number;`);
L.push(`\tlabel: string;`);
L.push(`\theading: string;`);
L.push(`\ttext: string;`);
L.push(`\tctaLabel: string;`);
L.push(`\tctaHref: string;`);
L.push(`}`);
L.push(``);
L.push(`export interface ContactField {`);
L.push(`\tname: string;`);
L.push(`\ttype: 'text' | 'email' | 'select' | 'textarea';`);
L.push(`\tlabel: string;`);
L.push(`\trequired: boolean;`);
L.push(`\toptions?: string[];`);
L.push(`}`);
L.push(``);
L.push(`export interface ContactBlock {`);
L.push(`\theading: string;`);
L.push(`\ttext: string;`);
L.push(`\timage: string;`);
L.push(`\timageAlt: string;`);
L.push(`\timageWidth: number;`);
L.push(`\timageHeight: number;`);
L.push(`\tform: {`);
L.push(`\t\theading: string;`);
L.push(`\t\tnote: string;`);
L.push(`\t\tconsent: { before: string; linkLabel: string; linkHref: string; after: string };`);
L.push(`\t\tsubmitLabel: string;`);
L.push(`\t\tfields: ContactField[];`);
L.push(`\t};`);
L.push(`}`);
L.push(``);

L.push(`export const INDUSTRIES = {`);
L.push(`\tseo: {`);
L.push(`\t\ttitle: 'Industries',`);
L.push(`\t\tdescription: ${q(hero.lead)},`);
L.push(`\t},`);
L.push(`\thero: {`);
L.push(`\t\tbreadcrumb: [`);
for (const c of hero.breadcrumb) {
	L.push(`\t\t\t{ label: ${q(c.label)}${c.href ? `, href: ${q(c.href)}` : ''} },`);
}
L.push(`\t\t] as BreadcrumbItem[],`);
L.push(`\t\teyebrow: ${q(hero.eyebrow)},`);
L.push(`\t\theading: ${q(hero.heading)},`);
L.push(`\t\tlead: ${q(hero.lead)},`);
L.push(`\t},`);
L.push(`\tcards: [`);
for (const c of cards) {
	L.push(`\t\t{`);
	L.push(`\t\t\thref: ${q(c.href)},`);
	L.push(`\t\t\timage: ${q(c.image)},`);
	L.push(`\t\t\talt: ${q(c.alt)},`);
	L.push(`\t\t\timageWidth: ${c.imageWidth},`);
	L.push(`\t\t\timageHeight: ${c.imageHeight},`);
	L.push(`\t\t\tspan: ${q(c.span)},`);
	L.push(`\t\t\ttitle: ${q(c.title)},`);
	L.push(`\t\t\tdescription: ${q(c.description)},`);
	L.push(`\t\t},`);
}
L.push(`\t],`);
if (callout) {
	L.push(`\tdataCenters: {`);
	L.push(`\t\timage: ${q(callout.image)},`);
	L.push(`\t\talt: ${q(callout.alt)},`);
	L.push(`\t\timageWidth: ${callout.imageWidth},`);
	L.push(`\t\timageHeight: ${callout.imageHeight},`);
	L.push(`\t\tlabel: ${q(callout.label)},`);
	L.push(`\t\theading: ${q(callout.heading)},`);
	L.push(`\t\ttext: ${q(callout.text)},`);
	L.push(`\t\tctaLabel: ${q(callout.ctaLabel)},`);
	L.push(`\t\tctaHref: ${q(callout.ctaHref)},`);
	L.push(`\t},`);
}
if (contact) {
	L.push(`\tcontact: {`);
	L.push(`\t\theading: ${q(contact.heading)},`);
	L.push(`\t\ttext: ${q(contact.text)},`);
	L.push(`\t\timage: ${q(contact.image)},`);
	L.push(`\t\timageAlt: ${q(contact.imageAlt)},`);
	L.push(`\t\timageWidth: ${contact.imageWidth},`);
	L.push(`\t\timageHeight: ${contact.imageHeight},`);
	L.push(`\t\tform: {`);
	L.push(`\t\t\theading: ${q(contact.form.heading)},`);
	L.push(`\t\t\tnote: ${q(contact.form.note)},`);
	L.push(`\t\t\tconsent: {`);
	L.push(`\t\t\t\tbefore: ${q(contact.form.consent.before)},`);
	L.push(`\t\t\t\tlinkLabel: ${q(contact.form.consent.linkLabel)},`);
	L.push(`\t\t\t\tlinkHref: ${q(contact.form.consent.linkHref)},`);
	L.push(`\t\t\t\tafter: ${q(contact.form.consent.after)},`);
	L.push(`\t\t\t},`);
	L.push(`\t\t\tsubmitLabel: ${q(contact.form.submitLabel)},`);
	L.push(`\t\t\tfields: [`);
	for (const f of contact.form.fields) {
		L.push(`\t\t\t\t{`);
		L.push(`\t\t\t\t\tname: ${q(f.name)},`);
		L.push(`\t\t\t\t\ttype: ${q(f.type)},`);
		L.push(`\t\t\t\t\tlabel: ${q(f.label)},`);
		L.push(`\t\t\t\t\trequired: ${f.required},`);
		if (f.options) {
			L.push(`\t\t\t\t\toptions: [`);
			L.push(`\t\t\t\t\t\t${f.options.map((o) => q(o)).join(', ')},`);
			L.push(`\t\t\t\t\t],`);
		}
		L.push(`\t\t\t\t},`);
	}
	L.push(`\t\t\t],`);
	L.push(`\t\t},`);
	L.push(`\t},`);
}
L.push(`};`);
L.push(``);

mkdirSync('src/data', { recursive: true });
writeFileSync(OUT_TS, L.join('\n'), 'utf8');
recordWrite(OUT_TS);

console.log(`data ${OUT_TS}`);
console.log(`  hero="${hero.heading}" eyebrow="${hero.eyebrow}" crumbs=${hero.breadcrumb.length}`);
console.log(
	`  cards=${cards.length} (${gridArticles.length} articles) ` +
		`wide=${cards.filter((c) => c.span === 'wide').length} narrow=${cards.filter((c) => c.span === 'narrow').length}`,
);
console.log(`  callout="${callout?.heading ?? '-'}" fields=${contact?.form.fields.length ?? 0}`);
