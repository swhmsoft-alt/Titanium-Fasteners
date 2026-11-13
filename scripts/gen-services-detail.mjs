/**
 * scripts/gen-services-detail.mjs — reference HTML → data files for the
 * service sub-pages under /global-en/services/**.
 *
 * The reference site renders each sub-page from CMS blocks, so the RENDERED
 * DOM (not the Astro island props) is the source of truth. This script reads
 * the saved reference HTML (`qa/ref/<page>.html`) and extracts, per page:
 *
 *   hero    — breadcrumb items, eyebrow, h1, lead
 *   steps[] — the numbered "copy-text-image" articles
 *   cta     — the "Discover the Secret of 15-85" callout article
 *
 * Remote images are mapped to their local copies through the `_manifest.json`
 * that scripts/dl-assets.mjs writes beside them, so the emitted data never
 * references a remote asset.
 *
 * Usage: node scripts/gen-services-detail.mjs <page> [...]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const pages = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!pages.length) {
	console.error('usage: node scripts/gen-services-detail.mjs <page> [...]');
	process.exit(1);
}

const dec = (s) =>
	s
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&');

const stripTags = (s) => dec(s.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

/** Remove Astro island `props="{...}"` payloads so the rendered DOM is readable. */
const stripProps = (html) => html.replace(/ props="[^"]*"/g, '');

/** Every `<article …>…</article>` chunk whose opening tag matches `clsTest`. */
function articles(html, clsTest) {
	const out = [];
	const re = /<article\b[^>]*>/g;
	let m;
	while ((m = re.exec(html))) {
		const open = m[0];
		if (!clsTest.test(open)) continue;
		let depth = 1;
		let i = re.lastIndex;
		const start = i;
		const tagRe = /<(\/?)article\b[^>]*>/g;
		tagRe.lastIndex = i;
		let t;
		while ((t = tagRe.exec(html))) {
			depth += t[1] === '/' ? -1 : 1;
			if (depth === 0) {
				i = t.index + t[0].length;
				break;
			}
		}
		out.push(html.slice(start, i));
		re.lastIndex = i;
	}
	return out;
}

/** First capture group of `re` inside `s`, or null. */
const pick = (s, re) => {
	const m = s.match(re);
	return m ? m[1] : null;
};

/** Hero: breadcrumb nav + eyebrow + h1 (+ optional lead). */
function parseHero(html) {
	const nav = pick(html, /<nav[^>]*aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/);
	const breadcrumb = [];
	if (nav) {
		const itemRe = /<li\b[^>]*>([\s\S]*?)<\/li>/g;
		let m;
		while ((m = itemRe.exec(nav))) {
			const li = m[1];
			const href = pick(li, /<a\b[^>]*href="([^"]*)"/);
			const label = stripTags(
				pick(li, /<span\b[^>]*>([\s\S]*?)<\/span>/) ??
					pick(li, />([^<>]+)<\/a>/) ??
					'',
			);
			if (label) breadcrumb.push({ label, href: href ?? undefined });
		}
	}
	const eyebrow = pick(
		html,
		/<p class="text-label mb-8 text-gray-medium lg:mb-12">([\s\S]*?)<\/p>/,
	);
	const heading = pick(html, /<h1 class="text-h1[^"]*"[^>]*>([\s\S]*?)<\/h1>/);
	const lead = pick(
		html,
		/<p class="text-lead mb-24 text-gray sm:mb-0">([\s\S]*?)<\/p>/,
	);
	return {
		breadcrumb,
		eyebrow: eyebrow ? stripTags(eyebrow) : '',
		heading: heading ? stripTags(heading) : '',
		lead: lead ? stripTags(lead) : '',
	};
}

/** The numbered copy-text-image articles. */
function parseSteps(html) {
	return articles(html, /container-fluid py-64 md:py-80/).map((body) => {
		const imgCls = pick(body, /<img\b[^>]*class="([^"]*)"/) ?? '';
		const ratio = imgCls.match(/aspect-(\d+\/\d+)/);
		const heading = stripTags(pick(body, /<h2\b[^>]*>([\s\S]*?)<\/h2>/) ?? '');
		const para = stripTags(
			pick(body, /<p class="text-p pb-12[^"]*"[^>]*>([\s\S]*?)<\/p>/) ?? '',
		);
		const ctaHref = pick(body, /<a\b[^>]*href="([^"]*)"/);
		const ctaLabel = stripTags(pick(body, /<a\b[^>]*>([\s\S]*?)<\/a>/) ?? '');
		return {
			heading,
			body: para,
			cta: ctaLabel ? { label: ctaLabel, href: ctaHref } : null,
			image: {
				src: pick(body, /<img\b[^>]*src="([^"]*)"/),
				alt: pick(body, /<img\b[^>]*alt="([^"]*)"/),
				ratio: ratio ? ratio[1] : '5/4',
				width: Number(pick(body, /<img\b[^>]*width="(\d+)"/) ?? 1340),
				height: Number(pick(body, /<img\b[^>]*height="(\d+)"/) ?? 1072),
			},
			imageFirst: !/md:order-last/.test(
				pick(body, /<div class="(sm:w-full[^"]*)">\s*<figure/) ?? '',
			),
		};
	});
}

/** The TCO callout article. */
function parseCta(html) {
	const list = articles(html, /py-56 lg:py-72 bg-gray-vlight/);
	if (!list.length) return null;
	const body = list[0];
	const imgCls = pick(body, /<img\b[^>]*class="([^"]*)"/) ?? '';
	const ratio = imgCls.match(/aspect-(\d+\/\d+)/);
	return {
		eyebrow: stripTags(
			pick(body, /<p class="mb-12 text-p-l[^"]*"[^>]*>([\s\S]*?)<\/p>/) ?? '',
		),
		heading: stripTags(pick(body, /<h2\b[^>]*>([\s\S]*?)<\/h2>/) ?? ''),
		lead: stripTags(
			pick(body, /<p class="text-lead[^"]*"[^>]*>([\s\S]*?)<\/p>/) ?? '',
		),
		cta: (() => {
			const href = pick(body, /<a\b[^>]*href="([^"]*)"/);
			const label = stripTags(pick(body, /<a\b[^>]*>([\s\S]*?)<\/a>/) ?? '');
			return label ? { label, href } : null;
		})(),
		image: {
			src: pick(body, /<img\b[^>]*src="([^"]*)"/),
			alt: pick(body, /<img\b[^>]*alt="([^"]*)"/),
			ratio: ratio ? ratio[1] : '4/3',
			width: Number(pick(body, /<img\b[^>]*width="(\d+)"/) ?? 942),
			height: Number(pick(body, /<img\b[^>]*height="(\d+)"/) ?? 706),
		},
	};
}

/** The RichText intro paragraph between the hero and the first step. */
function parseIntro(html) {
	const m = html.match(
		/<div class="container-fluid">\s*<p class="text-p pb-12 text-gray lg:pb-20 max-w-rich-text">([\s\S]*?)<\/p>/,
	);
	if (!m) return null;
	const inner = m[1];
	const strong = pick(inner, /<strong>([\s\S]*?)<\/strong>/);
	const text = stripTags(inner);
	if (!strong) return { before: text, strong: null, after: '' };
	const plain = stripTags(strong);
	const i = text.indexOf(plain);
	return {
		before: i >= 0 ? text.slice(0, i) : text,
		strong: plain,
		after: i >= 0 ? text.slice(i + plain.length) : '',
	};
}

/** Map a remote URL to the local file written by scripts/dl-assets.mjs. */
function localise(page, src) {
	if (!src) return src;
	const manifestPath = join('public', 'images', page, '_manifest.json');
	if (!existsSync(manifestPath)) return src;
	const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
	const key = Object.keys(manifest).find((k) => k.split('?')[0] === src.split('?')[0]);
	if (!key) return src;
	return manifest[key].replace('/public/', '/');
}

const q = (s) => JSON.stringify(s, null, '\t').replace(/\n/g, '\n\t');

/** Write one data file per page. */
function emit(page, d) {
	const dir = 'src/data/services-detail';
	mkdirSync(dir, { recursive: true });
	const slug = page.replace(/^services-/, '');
	const file = join(dir, `${slug}.ts`);
	const body = `/**
 * ${slug} — data for /global-en/services/${d.path}/.
 *
 * AUTO-GENERATED by scripts/gen-services-detail.mjs from
 * qa/ref/${page}.html. Do not hand-edit — regenerate instead.
 */

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

export interface ServiceStep {
	heading: string;
	body: string;
	cta: { label: string; href: string } | null;
	image: { src: string; alt: string; ratio: string; width: number; height: number };
	/** true = the image column comes first, false = the copy column does. */
	imageFirst: boolean;
}

export interface ServiceCta {
	eyebrow: string;
	heading: string;
	lead: string;
	cta: { label: string; href: string } | null;
	image: { src: string; alt: string; ratio: string; width: number; height: number };
}

export interface ServiceIntro {
	before: string;
	strong: string | null;
	after: string;
}

export const PAGE = {
	slug: ${q(slug)},
	path: ${q(d.path)},
	seo: {
		title: ${q(d.seo.title)},
		description: ${q(d.seo.description)},
	},
	hero: {
		breadcrumb: ${q(d.hero.breadcrumb)} as BreadcrumbItem[],
		eyebrow: ${q(d.hero.eyebrow)},
		heading: ${q(d.hero.heading)},
		lead: ${q(d.hero.lead)},
	},
	intro: ${q(d.intro)} as ServiceIntro | null,
	steps: ${q(d.steps)} as ServiceStep[],
	cta: ${q(d.cta)} as ServiceCta,
};
`;
	writeFileSync(file, body);
	console.log(`✓ ${file}  steps=${d.steps.length} cta=${d.cta ? 'yes' : 'no'}`);
}

for (const page of pages) {
	const refPath = join('qa', 'ref', `${page}.html`);
	const jsonPath = join('qa', 'ref', `${page}.json`);
	if (!existsSync(refPath) || !existsSync(jsonPath)) {
		console.error(`✗ missing qa/ref/${page}.{html,json}`);
		continue;
	}
	const html = stripProps(readFileSync(refPath, 'utf8'));
	const probe = JSON.parse(readFileSync(jsonPath, 'utf8'));

	const steps = parseSteps(html).map((s) => ({
		...s,
		image: { ...s.image, src: localise(page, s.image.src) },
	}));
	const ctaRaw = parseCta(html);
	const cta = ctaRaw
		? { ...ctaRaw, image: { ...ctaRaw.image, src: localise(page, ctaRaw.image.src) } }
		: null;

	/* The route path comes from the page's own URL in the reference probe. */
	const path = probe.url.replace(/^https?:\/\/[^/]+\/global-en\//, '').replace(/\/$/, '');

	emit(page, {
		path,
		seo: { title: probe.title ?? '', description: probe.description ?? '' },
		hero: parseHero(html),
		intro: parseIntro(html),
		steps,
		cta,
	});
}
