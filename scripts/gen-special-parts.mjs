/**
 * scripts/gen-special-parts.mjs — 参考 HTML → 特殊零件页 data 文件。
 *
 * 用法：node scripts/gen-special-parts.mjs
 * 输入：qa/ref/special-parts-and-custom-fasteners.html + public/images/.../_manifest.json
 * 输出：src/data/special-parts.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { parseTree, findAll, textOf, classOf } from './lib/html-tree.mjs';

const HTML = readFileSync('qa/ref/special-parts-and-custom-fasteners.html', 'utf8');
const manifest = JSON.parse(
	readFileSync('public/images/special-parts-and-custom-fasteners/_manifest.json', 'utf8'),
);
const roots = parseTree(HTML);
const main = findAll(roots, (n) => n.tag === 'main')[0];
const cls = classOf;
const has = (n, c) => cls(n).includes(c);
const txt = (n) => (n ? textOf(n).replace(/\s+/g, ' ').trim() : '');
const all = (n) => findAll(n, () => true);
const pick = (n, tag, c) => all(n).find((x) => x.tag === tag && (!c || has(x, c)));
const img = (url) => {
	const bare = (url || '').split('?')[0];
	for (const [k, v] of Object.entries(manifest))
		if (k.split('?')[0] === bare) return v.replace(/^\/public\//, '/');
	return url || '';
};
const shot = (i) => (i ? { src: img(i.attrs.src), alt: i.attrs.alt || '' } : null);
const pics = (n) => all(n).filter((x) => x.tag === 'img').map((i) => ({ ...shot(i), w: +i.attrs.width || 0, h: +i.attrs.height || 0 }));

/* ── Hero ─────────────────────────────────────────────────────────── */
const hero = pick(main, 'header');
const heroImg = pick(hero, 'img');
const heroCrumbs = findAll(hero, (n) => n.tag === 'li').map((li) => {
	const sr = findAll(li, (n) => n.tag === 'span')[0];
	return sr ? txt(sr) : txt(li);
});
const heroHrefs = findAll(hero, (n) => n.tag === 'a').map((a) => a.attrs.href);

/* ── 四大 article 块 ───────────────────────────────────────────────── */
const arts = all(main).filter((n) => n.tag === 'article' && !has(n, 'h-svh'));
const byHead = (t) => arts.find((a) => txt(pick(a, 'h2') || pick(a, 'h3')).startsWith(t));
const benefitsArt = byHead('Why You Should');
const techArt = byHead('Our Technological');
const coatArt = byHead('Functional Coatings');
const servArt = byHead('Other Custom');
const broArt = arts.find((a) => txt(pick(a, 'h3')).startsWith('Bossard Special Parts'));

/* 折叠面板正文块 */
const blocks = (det) => {
	const panel = pick(det, 'div', 'accordion-details');
	if (!panel) return [];
	const col = panel.children.filter((c) => c.tag === 'div')
		.find((d) => d.children.some((x) => x.tag === 'p' || x.tag === 'ul'));
	if (!col) return [];
	const out = [];
	for (const c of col.children) {
		if (c.tag === 'p') {
			const st = pick(c, 'strong');
			out.push(st ? { kind: 'label', text: txt(st) } : { kind: 'p', text: txt(c) });
		} else if (c.tag === 'ul') {
			out.push({ kind: 'ul', items: all(c).filter((x) => x.tag === 'li').map(txt) });
		}
	}
	return out;
};
const details = (art) =>
	all(art).filter((n) => n.tag === 'details').map((d) => {
		const fc = pick(d, 'figcaption');
		const imgs = pics(d);
		return {
			title: txt(pick(d, 'h3')),
			body: blocks(d),
			image: imgs.find((p) => p.w === 396) || null,
			dialogImage: imgs.find((p) => p.w === 1300) || null,
			caption: fc ? txt(fc) : '',
		};
	});

/* ── 图片滑轨 + 灯箱 ─────────────────────────────────────────────── */
const rails = all(main).filter(
	(n) => n.tag === 'section' && all(n).some((c) => has(c, 'scrollbar-area')),
);
const rail = (sec) => {
	const track = all(sec).find((n) => has(n, 'scrollbar-area'));
	const dlg = all(sec).find((n) => n.tag === 'dialog');
	const slides = (track?.children ?? [])
		.filter((d) => d.tag === 'div')
		.map((d) => shot(pick(d, 'img')))
		.filter(Boolean);
	const thumbs = dlg
		? all(dlg)
				.filter((n) => n.tag === 'li')
				.map((li) => shot(pick(li, 'img')))
				.filter(Boolean)
		: [];
	return {
		slides,
		thumbs,
		dialog: dlg
			? { image: pics(dlg).find((p) => p.w === 1300) || null, caption: txt(pick(dlg, 'figcaption')) }
			: { image: null, caption: '' },
	};
};

/* ── CTA 表单 ─────────────────────────────────────────────────────── */
const ctaBand = all(main).find((n) => n.tag === 'div' && has(n, 'bg-blue-70'));
const form = pick(ctaBand, 'form');
const labels = all(form).filter((n) => n.tag === 'span')
	.map((s) => txt(s)).filter((t) => t && t !== '*' && t.length < 30);

/* ── 组装 ─────────────────────────────────────────────────────────── */
const data = {
	seo: {
		title: 'Special Parts and Custom Fasteners',
		description: txt(pick(hero, 'p', 'text-lead')),
	},
	hero: {
		crumbs: [
			{ label: 'Bossard homepage', href: heroHrefs[0] },
			{ label: 'Product Solutions', href: heroHrefs[1] },
			{ label: heroCrumbs[2] },
		],
		eyebrow: txt(pick(hero, 'p', 'text-label')),
		heading: txt(pick(hero, 'h1')),
		lead: txt(pick(hero, 'p', 'text-lead')),
		image: shot(heroImg),
	},
	benefits: {
		heading: txt(pick(benefitsArt, 'h2')),
		cards: all(benefitsArt).filter((n) => n.tag === 'section').map((s) => ({
			icon: shot(pick(s, 'img')),
			title: txt(pick(s, 'h3')),
			text: txt(pick(s, 'p')),
		})),
	},
	intro: {
		paragraph: txt(all(main).find((n) => n.tag === 'p' && txt(n).startsWith('We understand'))),
		list: [],
		closing: txt(all(main).find((n) => n.tag === 'p' && txt(n).startsWith('Depending on batch sizes'))),
	},
	tech: {
		heading: txt(pick(techArt, 'h2')),
		items: details(techArt),
	},
	rail1: rail(rails[0]),
	coatings: {
		heading: txt(pick(coatArt, 'h2')),
		items: details(coatArt),
	},
	finish: {
		heading: txt(all(main).find((n) => n.tag === 'h3' && txt(n).startsWith('What to Know'))),
		cta: {
			label: txt(all(main).find((n) => n.tag === 'a' && txt(n) === 'Learn More')),
			href: all(main).find((n) => n.tag === 'a' && txt(n) === 'Learn More').attrs.href,
		},
	},
	services: {
		heading: txt(pick(servArt, 'h2')),
		items: details(servArt),
	},
	rail2: rail(rails[1]),
	cta: {
		heading: txt(pick(ctaBand, 'h2')),
		text: txt(all(ctaBand).find((n) => n.tag === 'p')),
		image: pics(ctaBand).find((p) => p.w === 740) || null,
		form: {
			title: txt(pick(form, 'h3')),
			note: txt(all(form).find((n) => n.tag === 'p')),
			countries: all(form).filter((n) => n.tag === 'option').map(txt),
			fields: ['First Name', 'Last Name', 'E-Mail', 'Company', 'Zip Code'],
			messageLabel: 'Your Message',
			consent: 'By submitting this form I consent to the privacy policy. This site is protected by reCAPTCHA.',
			consentHref: '/global-en/privacy-policy/',
			submit: 'Submit',
		},
	},
	brochure: {
		title: txt(pick(broArt, 'h3')),
		text: txt(pick(broArt, 'p')),
		thumb: pics(broArt).find((p) => p.w === 105) || null,
		file: {
			label: txt(all(broArt).find((n) => n.tag === 'span' && txt(n).includes('MB'))),
			href: pick(broArt, 'a').attrs.href,
		},
	},
};

/* intro 列表（8 项） */
const introUl = all(main).find((n) => n.tag === 'ul');
data.intro.list = all(introUl).filter((n) => n.tag === 'li').map(txt);

const TS = `/**
 * src/data/special-parts.ts — 由 scripts/gen-special-parts.mjs 从参考站 DOM 抽取。
 * 参考：https://www.bossard.com/global-en/product-solutions/special-parts-and-custom-fasteners/
 * 手工改动会在下次生成时丢失。
 */

export interface SpecialPartsImage {
	src: string;
	alt: string;
}

export interface RichBlock {
	kind: 'p' | 'label' | 'ul';
	text?: string;
	items?: string[];
}

export interface AccordionItem {
	title: string;
	body: RichBlock[];
	image?: SpecialPartsImage | null;
	dialogImage?: SpecialPartsImage | null;
	caption?: string;
}

export interface Gallery {
	slides: SpecialPartsImage[];
	thumbs: SpecialPartsImage[];
	dialog: { image: SpecialPartsImage | null; caption: string };
}

export const SPECIAL_PARTS = ${JSON.stringify(data, null, '\t')};
`;
writeFileSync('src/data/special-parts.ts', TS, 'utf8');
console.log('src/data/special-parts.ts written');