/**
 * scripts/gen-services-sub.mjs — reference HTML → block data for the four
 * service sub-pages under /global-en/services/**.
 *
 * The four remaining pages are CMS block compositions, not the linear
 * "numbered steps" shape the benefits pages use. Every page is parsed into an
 * ordered `blocks[]` array; each block carries a `kind` discriminator that
 * src/components/sections/services-sub/ServiceBlocks.astro switches on.
 *
 * Usage: node scripts/gen-services-sub.mjs <page> [...]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const pages = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!pages.length) {
console.error('usage: node scripts/gen-services-sub.mjs <page> [...]');
process.exit(1);
}

const dec = (s) =>
String(s)
.replace(/&lt;/g, '<')
.replace(/&gt;/g, '>')
.replace(/&quot;/g, '"')
.replace(/&#39;/g, "'")
.replace(/&nbsp;/g, ' ')
.replace(/&amp;/g, '&');

const st = (s) => dec(String(s).replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

/** Text of the first element whose tag and class both match. */
function textOf(html, tag, cls) {
const open = new RegExp('<' + tag + '\\b[^>]*>', 'g');
let m;
while ((m = open.exec(html))) {
if (cls && !m[0].includes(cls)) continue;
const close = '</' + tag + '>';
const end = html.indexOf(close, m.index);
if (end < 0) continue;
return st(html.slice(m.index + m[0].length, end));
}
return '';
}

/** Every element of a tag whose class contains `cls`, as { open, inner }. */
function elementsOf(html, tag, cls) {
const out = [];
const open = new RegExp('<' + tag + '\\b[^>]*>', 'g');
let m;
while ((m = open.exec(html))) {
if (cls && !m[0].includes(cls)) continue;
const close = '</' + tag + '>';
const end = html.indexOf(close, m.index);
if (end < 0) continue;
out.push({ open: m[0], inner: html.slice(m.index + m[0].length, end) });
m.lastIndex = end;
}
return out;
}

/** The top-level children of <main>. */
function topBlocks(html) {
const mi = html.indexOf('<main');
const me = html.indexOf('</main>', mi);
const inner = html.slice(mi, me);
const out = [];
const re = /<(\/?)(article|section|div|header|footer)\b([^>]*)>/g;
let depth = 0;
let cur = null;
let m;
while ((m = re.exec(inner))) {
if (m[1] !== '/') {
if (depth === 0) cur = { tag: m[2], attrs: m[3] || '', start: m.index };
depth++;
} else {
depth--;
if (depth === 0 && cur) {
cur.end = m.index + m[0].length;
out.push({ ...cur, html: inner.slice(cur.start, cur.end) });
cur = null;
}
}
}
return out;
}

const clsOf = (b) => (b.attrs.match(/class="([^"]*)"/) || [])[1] || '';

/** Every <img> tag in a chunk, with the attributes we need. */
function images(html) {
return [...html.matchAll(/<img\b[^>]*>/g)].map((m) => {
const tag = m[0];
const src = (tag.match(/src="([^"]*)"/) || [])[1];
const alt = (tag.match(/alt="([^"]*)"/) || [])[1];
const width = Number((tag.match(/width="(\d+)"/) || [])[1] ?? 0);
const height = Number((tag.match(/height="(\d+)"/) || [])[1] ?? 0);
const ratio = ((tag.match(/class="([^"]*)"/) || [])[1] || '').match(/aspect-(\d+\/\d+)/);
const isLogo = /logo/i.test(alt || '') || /logo/i.test(src || '');
return { src, alt: alt ?? '', width, height, ratio: ratio ? ratio[1] : null, isLogo };
});
}

/** Map a remote URL to its local copy via the dl-assets manifest. */
function makeLocaliser(page) {
const manifestPath = join('public', 'images', page, '_manifest.json');
const manifest = existsSync(manifestPath)
? JSON.parse(readFileSync(manifestPath, 'utf8'))
: {};
const byKey = Object.keys(manifest);
return (src) => {
if (!src) return src;
const key = byKey.find((k) => k.split('?')[0] === src.split('?')[0]);
return key ? manifest[key].replace(/^\/public\//, '/') : src;
};
}

/* ── Block parsers ─────────────────────────────────────────────────────── */

function parseHero(html, localise) {
const nav = (html.match(/<nav[^>]*aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/) || [])[1];
const breadcrumb = [];
for (const li of elementsOf(nav || '', 'li', '')) {
const href = (li.inner.match(/<a\b[^>]*href="([^"]*)"/) || [])[1];
const label = textOf(li.inner, 'span', '') || st((li.inner.match(/>([^<>]+)<\/a>/) || [])[1] || '');
if (label) breadcrumb.push({ label, href });
}
const imgs = images(html);
const key = imgs.find((i) => !i.isLogo) || imgs[0];
const ctaHref = (html.match(/<a\b[^>]*class="[^"]*Contact an Expert[^"]*"[^>]*href="([^"]*)"/) || [])[1];
return {
breadcrumb,
eyebrow: textOf(html, 'p', 'text-label mb-8 text-gray-medium'),
heading: textOf(html, 'h1', 'text-h1'),
lead: textOf(html, 'p', 'text-lead mb-24'),
image: key
? {
src: localise(key.src),
alt: key.alt,
ratio: key.ratio || '5/4',
width: key.width || 1340,
height: key.height || 1072,
}
: null,
ctaLabel: /Contact an Expert/.test(html) ? 'Contact an Expert' : null,
ctaHref: ctaHref || null,
};
}

function parseRichText(html, tag = 'div') {
const heading = textOf(html, 'h2', '') || textOf(html, 'h3', '');
const body = elementsOf(html, 'p', 'text-p pb-12')
.map((p) => {
const strong = textOf(p.inner, 'strong', '');
const text = st(p.inner);
if (!strong) return { text, strong: null, strongAt: null };
const i = text.indexOf(strong);
return { text, strong, strongAt: i };
})
.filter((p) => p.text);
return { kind: 'richText', tag, heading: heading || null, body };
}

function parseVideo(html, page) {
const poster = images(html).find((i) => /youtube\.com|maxresdefault/.test(i.src || ''));
const id = poster ? (poster.src.match(/vi\/([\w-]{6,})/) || [])[1] : null;
return {
kind: 'video',
heading: textOf(html, 'h2', 'text-h3 mb-16'),
caption: textOf(html, 'p', 'text-p-sm'),
poster: `/images/services-${page.replace(/^services-/, '')}/video-poster.jpg`,
posterSrc: poster ? poster.src : null,
videoId: id,
};
}

function parseIconCards(html, localise) {
const cards = elementsOf(html, 'section', 'group cursor-pointer');
const heading = cards.length
? textOf(html.slice(0, html.indexOf(cards[0].open)), 'h2', '')
: textOf(html, 'h2', '');
const items = cards.map((c) => {
const img = images(c.inner)[0];
return {
href: (c.inner.match(/<a\b[^>]*href="([^"]*)"/) || [])[1] || null,
label: textOf(c.inner, 'p', 'text-label'),
title: textOf(c.inner, 'h3', ''),
description: textOf(c.inner, 'p', 'text-p-sm'),
icon: img
? { src: localise(img.src), alt: img.alt, width: img.width || 150, height: img.height || 150 }
: null,
};
});
return { kind: 'iconCards', heading, items };
}

function parseCardRail(html) {
const heading = textOf(html, 'h2', 'text-h3 mb-16');
const items = [];
for (const c of html.split('cardInner').slice(1)) {
const front = c.split('cardBack')[0];
const title = textOf(front, 'h3', 'text-h3');
if (!title) continue;
items.push({
label: textOf(front, 'p', 'text-label'),
title,
description: textOf(front, 'p', 'text-p-sm'),
});
}
return { kind: 'cardRail', heading, items };
}

function parseBenefitsGrid(html, localise) {
const heading = textOf(html, 'h2', 'text-h3 text-blue-dark2');
const items = [];
for (const s of elementsOf(html, 'section', 'h-[210px]')) {
const img = images(s.inner)[0];
const title = textOf(s.inner, 'h3', '');
if (!title) continue;
items.push({
title,
description: textOf(s.inner, 'p', 'text-p-sm'),
icon: img
? { src: localise(img.src), alt: img.alt, width: img.width || 150, height: img.height || 150 }
: null,
});
}
return { kind: 'benefitsGrid', heading, items };
}

function parseLogoRail(html, localise) {
const heading = textOf(html, 'h2', 'text-h4 mb-32');
const logos = images(html)
.filter((i) => i.isLogo)
.map((i) => ({ src: localise(i.src), alt: i.alt, width: i.width || 136, height: i.height || 136 }));
return { kind: 'logoRail', heading, logos };
}

function parseImageRows(html, localise) {
	const blocks = [];
	for (const a of elementsOf(html, 'article', 'container-fluid py-64 md:py-80')) {
		const img = images(a.inner)[0];
		const heading = textOf(a.inner, 'h2', '') || textOf(a.inner, 'h3', '');
		if (!heading) continue;
		blocks.push({
			kind: 'imageRow',
			heading,
			body: textOf(a.inner, 'p', 'text-p pb-12'),
			image: img
				? {
						src: localise(img.src),
						alt: img.alt,
						ratio: img.ratio || '5/4',
						width: img.width || 1340,
						height: img.height || 1072,
					}
				: null,
			imageFirst: !/md:order-last/.test(a.inner.slice(0, 800)),
		});
	}
	return { kind: 'imageRows', rows: blocks };
}

function parseFaq(html) {
const items = [];
for (const d of elementsOf(html, 'details', 'mt-16 rounded-lg border border-blue-light')) {
const q = textOf(d.inner, 'h3', 'text-lead');
if (!q) continue;
items.push({ question: q, answer: textOf(d.inner, 'p', 'text-p') });
}
return { kind: 'faq', items };
}

function parseCtaPanel(html, localise) {
const img = images(html)[0];
return {
kind: 'ctaPanel',
eyebrow: textOf(html, 'p', 'mb-12 text-p-l'),
heading: textOf(html, 'h2', ''),
description: textOf(html, 'p', 'text-p pb-32') || textOf(html, 'p', 'text-p '),
cta: (() => {
const a = elementsOf(html, 'a', 'rounded-pill')[0];
return a
? { label: st(a.inner), href: (a.open.match(/href="([^"]*)"/) || [])[1] || '#' }
: null;
})(),
image: img
? {
src: localise(img.src),
alt: img.alt,
ratio: img.ratio || '4/3',
width: img.width || 942,
height: img.height || 706,
}
: null,
};
}

function parseBlueprint(html, localise) {
const img = images(html).find(
(i) => /iFrame_mockup|blueprint/i.test(i.src || '') || /Factory layout/i.test(i.alt || ''),
);
return {
kind: 'blueprint',
image: img
? {
src: localise(img.src),
alt: img.alt,
ratio: img.ratio || '16/9',
width: img.width || 1300,
height: img.height || 731,
}
: null,
};
}

function parseRelatedTopics(html, localise) {
const heading = textOf(html, 'h2', 'text-h3 mb-16');
const items = [];
for (const a of elementsOf(html, 'a', 'group')) {
const title = textOf(a.inner, 'h3', '');
const href = (a.open.match(/href="([^"]*)"/) || [])[1];
if (!title || !href) continue;
const img = images(a.inner)[0];
items.push({
href,
title,
description: textOf(a.inner, 'p', 'text-p-sm'),
image: img
? { src: localise(img.src), alt: img.alt, width: img.width || 634, height: img.height || 507 }
: null,
});
}
return { kind: 'relatedTopics', heading, items };
}

/** Classify one top-level block into a typed block. */
function classify(b, localise, page) {
const cls = clsOf(b);
const html = b.html;

if (b.tag === 'header') return { kind: 'hero', ...parseHero(html, localise) };
if (/pt-\[56/.test(html) && /youtube\.com|maxresdefault/.test(html)) return parseVideo(html, page);
if (/cardInner/.test(html)) return parseCardRail(html);
if (/<details/.test(html)) return parseFaq(html);
if (/h-\[210px\]/.test(html)) return parseBenefitsGrid(html, localise);
if (/scrollbar-area/.test(html) && /logo/i.test(html)) return parseLogoRail(html, localise);
if (/group cursor-pointer/.test(html)) return parseIconCards(html, localise);
if (/container-fluid py-64 md:py-80/.test(cls)) return parseImageRows(html, localise);
if (/py-56 lg:py-72/.test(cls)) return parseCtaPanel(html, localise);
if (/container-fluid-wide/.test(cls) && /aspect-16\/9/.test(html)) return parseBlueprint(html, localise);
if (/Related Topics You Might Be Interested In/.test(html)) return parseRelatedTopics(html, localise);
if (/<h2\b/.test(html) || /<h3\b/.test(html)) return parseRichText(html, b.tag);
if (/<p class="text-p/.test(html)) return parseRichText(html, b.tag);
return null;
}

function emit(page, data) {
const dir = 'src/data/services-sub';
mkdirSync(dir, { recursive: true });
const slug = page.replace(/^services-/, '');
const file = join(dir, `${slug}.ts`);
const q = (s) => JSON.stringify(s, null, '\t').replace(/\n/g, '\n\t');
const body = `/**
 * ${slug} — data for /global-en/services/${data.path}/.
 *
 * AUTO-GENERATED by scripts/gen-services-sub.mjs from
 * qa/ref/${page}.html. Do not hand-edit — regenerate instead.
 */

export interface SubBreadcrumb {
label: string;
href?: string;
}

export interface SubImage {
src: string;
alt: string;
ratio: string;
width: number;
height: number;
}

export interface SubBlock {
kind: string;
[key: string]: unknown;
}

export const PAGE = {
slug: ${q(slug)},
path: ${q(data.path)},
seo: {
title: ${q(data.seo.title)},
description: ${q(data.seo.description)},
},
hero: ${q(data.hero)},
blocks: ${q(data.blocks)} as SubBlock[],
};
`;
writeFileSync(file, body);
console.log(`OK ${file}  blocks=${data.blocks.length}`);
}

for (const page of pages) {
const refPath = join('qa', 'ref', `${page}.html`);
const jsonPath = join('qa', 'ref', `${page}.json`);
if (!existsSync(refPath) || !existsSync(jsonPath)) {
console.error(`MISSING qa/ref/${page}.{html,json}`);
continue;
}
const html = readFileSync(refPath, 'utf8').replace(/ props="[^"]*"/g, '');
const probe = JSON.parse(readFileSync(jsonPath, 'utf8'));
const localise = makeLocaliser(page);

const blocks = topBlocks(html)
.map((b) => classify(b, localise, page))
.filter(Boolean);

const path = probe.url.replace(/^https?:\/\/[^/]+\/global-en\//, '').replace(/\/$/, '');
emit(page, {
path,
seo: { title: probe.title || '', description: probe.description || '' },
hero: parseHero(html, localise),
blocks,
});
}
