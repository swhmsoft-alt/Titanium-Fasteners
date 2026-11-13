/**
 * scripts/gen-industries-sub.mjs - reference HTML -> industry sub page data.
 *
 * The eight CMS industry sub pages share one page type on the reference
 * site. The block order has to come from the document (the reference main
 * holds <header>, <div> and <article> children in a fixed order), so the
 * extraction walks the top level elements of <main>.
 *
 * TWO KINDS OF BLOCK
 *   1. modelled blocks - hero, contact band, video, support cards, icon
 *      cards, brochure, CTA band, rich text. They are rendered by the
 *      components in src/components/sections/industries-sub/.
 *   2. raw blocks - the media accordion and its image rail. Their markup
 *      carries nested <article class="container-fluid h-svh"> lightbox
 *      bodies, and the reference keeps them in separate Astro islands.
 *      Reproducing them verbatim keeps the block count, the nesting and the
 *      pixel heights identical; only the image sources are localised and the
 *      CDN srcset is dropped (the variants are not downloaded).
 *
 * Usage: node scripts/gen-industries-sub.mjs <slug> | --all
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import * as S from './lib/html-slice.mjs';
import { recordRead, recordWrite } from './lib/session-budget.mjs';

const SLUGS = [
	'electrical-engineering',
	'electric-vehicles',
	'hvac',
	'medical',
	'railway',
	'robotics',
	'semiconductors',
	'data-centers',
];

const args = process.argv.slice(2);
const wanted = args.includes('--all') ? SLUGS : args.filter((a) => !a.startsWith('--'));
if (!wanted.length) {
	console.error('usage: node scripts/gen-industries-sub.mjs <slug> | --all');
	process.exit(1);
}

const q = (s) => JSON.stringify(String(s ?? ''));

function generate(slug) {
	const refHtml = `qa/ref/industries-${slug}.html`;
	const manifestFile = `public/images/industries-${slug}/_manifest.json`;
	const outTs = `src/data/industries-sub/${slug}.ts`;

	if (!existsSync(refHtml)) {
		console.error(`! ${refHtml} missing - run the recipe for ${slug} first`);
		return null;
	}
	recordRead(refHtml, 'tool');
	if (existsSync(manifestFile)) recordRead(manifestFile, 'tool');

	const raw = readFileSync(refHtml, 'utf8');
	const manifest = existsSync(manifestFile)
		? JSON.parse(readFileSync(manifestFile, 'utf8'))
		: {};

	/* reference URL -> local file (CDN URLs often differ only in ?q=) */
	const local = (url) => {
		if (!url) return '';
		const hit = manifest[url];
		if (hit) return hit.replace(/^\/public\//, '/');
		const bare = url.split('?')[0];
		for (const [k, v] of Object.entries(manifest)) {
			if (k.split('?')[0] === bare) return v.replace(/^\/public\//, '/');
		}
		return url;
	};
	const imgSrc = (open) => local(S.attr(open, 'src'));

	/* localise a raw markup chunk: point <img src> at the local copy and drop
	   the CDN srcset (only the rendered variant is downloaded).
	   `.scrollbar-area` is a marker class on the reference whose stylesheet
	   makes the rail a horizontal scroll box. This build has no such rule
	   (the other rails in the repo add `flex overflow-x-auto` themselves),
	   so the equivalent utilities are added here. */
	const localize = (html) =>
		html
			.replace(/\s+srcset="[^"]*"/g, '')
			.replace(/\ssrc="([^"]+)"/g, (m, url) => ` src="${local(url)}"`)
			.replace(
				/class="([^"]*\bscrollbar-area\b[^"]*)"/g,
				(m, cls) => (/\bflex\b/.test(cls) ? m : `class="${cls} flex overflow-x-auto"`),
			);

	const main = S.mainRegion(raw);
	const elements = S.topElements(S.stripScripts(main));

	/* ---- page meta (from the reference <head>) ---- */
	const descTag = S.blocks(raw, 'meta').find(
		(m) => S.attr(m.open, 'name') === 'description',
	);
	const pageTitle = S.text(S.inner(raw, 'title'));
	const pageDescription = descTag ? S.attr(descTag.open, 'content') : '';

	const blocks = [];
	const unknown = [];
	let hero = null;

	for (let i = 0; i < elements.length; i++) {
		const el = elements[i];
		const c = S.attr(S.openTag(el.html, el.tag), 'class');

		/* ---- hero ---- */
		if (el.tag === 'header') {
			const crumbHtml = S.inner(el.html, 'ol');
			const breadcrumb = S.blocks(crumbHtml, 'li').map((li) => {
				const a = S.openTag(li.inner, 'a');
				return {
					label: S.text(a ? S.inner(li.inner, 'a') : li.inner),
					href: a ? S.attr(a, 'href') : '',
				};
			});
			const heroImg = S.openTag(el.html, 'img');
			hero = {
				kind: 'hero',
				breadcrumb,
				eyebrow: S.textByClass(el.html, 'p', 'text-label'),
				heading: S.text(S.inner(el.html, 'h1')),
				lead: S.textByClass(el.html, 'p', 'text-lead'),
				image: { ...S.imgInfo(heroImg), src: imgSrc(heroImg) },
			};
			blocks.push(hero);
			continue;
		}

		/* ---- rich text / raw div ---- */
		if (el.tag === 'div') {
			const paragraphs = S.blocks(el.html, 'p').map((p) => S.text(p.inner));
			if (paragraphs.length && paragraphs.some((t) => t)) {
				blocks.push({ kind: 'richText', paragraphs });
			} else {
				blocks.push({ kind: 'raw', html: localize(el.html) });
			}
			continue;
		}

		/* ---- image rail (the sibling of a media block) ---- */
		if (el.tag === 'section') {
			blocks.push({ kind: 'gallery', html: localize(el.html) });
			continue;
		}

		if (el.tag !== 'article') {
			unknown.push(`${slug}: top level <${el.tag}> [${c.slice(0, 40)}]`);
			continue;
		}

		/* ---- articles ---- */
		const heading = S.text(S.inner(el.html, 'h2'));

		if (c.includes('container-fluid relative')) {
			const icon = S.openTag(el.html, 'img');
			const btn = S.inner(el.html, 'button');
			const a = S.openTag(el.html, 'a');
			blocks.push({
				kind: 'contactBand',
				heading,
				text: S.text(S.inner(el.html, 'p')),
				icon: { src: imgSrc(icon), alt: S.attr(icon, 'alt') },
				ctaLabel: S.text(btn) || S.text(S.inner(el.html, 'a')),
				ctaHref: a ? S.attr(a, 'href') : '',
			});
			continue;
		}

		if (c.includes('mb-48 mt-32')) {
			const details = S.blocks(el.html, 'details');
			if (details.length) {
				/* media accordion: rendered verbatim (it carries the nested
				   lightbox <article> the block count depends on) */
				const d = details[0];
				const body = S.innerByClass(d.inner, 'div', 'accordion-details');
				const thumb = S.openTag(d.inner, 'img');
				blocks.push({
					kind: 'media',
					heading,
					title: S.text(S.inner(d.inner, 'h3')),
					open: /\bopen\b/.test(d.open),
					image: { ...S.imgInfo(thumb), src: imgSrc(thumb) },
					caption: S.textByClass(body, 'p', 'text-p'),
					links: S.blocks(body, 'a').map((a) => ({
						text: S.text(a.inner),
						href: S.attr(a.open, 'href'),
					})),
					html: localize(el.html),
				});
				continue;
			}
			const tiles = S.blocks(el.html, 'section').filter((s) =>
				S.attr(s.open, 'class').includes('border-blue-70'),
			);
			if (tiles.length) {
				blocks.push({
					kind: 'supportCards',
					heading,
					cards: tiles.map((t) => {
						const icon = S.openTag(t.inner, 'img');
						return {
							icon: imgSrc(icon),
							iconAlt: S.attr(icon, 'alt'),
							title: S.text(S.inner(t.inner, 'h3')),
							description: S.text(S.inner(t.inner, 'p')),
						};
					}),
				});
				continue;
			}
			unknown.push(`${slug}: mb-48 mt-32 without details/tiles`);
			continue;
		}

		if (c.includes('pb-48 pt-32')) {
			const poster = S.openTag(el.html, 'img');
			blocks.push({
				kind: 'video',
				heading,
				poster: imgSrc(poster),
				posterAlt: S.attr(poster, 'alt'),
				caption: S.textByClass(el.html, 'p', 'text-p-sm'),
			});
			continue;
		}

		if (c.includes('py-56') && c.includes('bg-gray-vlight')) {
			const image = S.openTag(el.html, 'img');
			const a = S.openTag(el.html, 'a');
			blocks.push({
				kind: 'ctaBand',
				heading,
				eyebrow: S.textByClass(el.html, 'p', 'text-gray-medium'),
				image: { ...S.imgInfo(image), src: imgSrc(image) },
				description: S.textByClass(el.html, 'p', 'text-lead'),
				cta: a ? { label: S.text(S.inner(el.html, 'a')), href: S.attr(a, 'href') } : null,
			});
			continue;
		}

		if (c.includes('my-48')) {
			const sections = S.blocks(el.html, 'section');
			const isBrochure = sections.some((s) =>
				S.attr(S.openTag(s.inner, 'img'), 'class').includes('aspect-3/4'),
			);
			if (isBrochure) {
				blocks.push({
					kind: 'brochure',
					heading,
					items: sections.map((s) => {
						const image = S.openTag(s.inner, 'img');
						const a = S.openTag(s.inner, 'a');
						return {
							href: a ? S.attr(a, 'href') : '',
							image: { ...S.imgInfo(image), src: imgSrc(image) },
							title: S.text(S.inner(s.inner, 'h3')) || S.text(S.inner(s.inner, 'a')),
							description: S.text(S.inner(s.inner, 'p')),
							label: S.text(S.inner(s.inner, 'a')),
						};
					}),
				});
				continue;
			}
			blocks.push({
				kind: 'iconCards',
				heading,
				items: sections.map((s) => {
					const a = S.openTag(s.inner, 'a');
					const image = S.openTag(s.inner, 'img');
					const ps = S.blocks(s.inner, 'p');
					return {
						href: a ? S.attr(a, 'href') : '',
						image: imgSrc(image),
						alt: S.attr(image, 'alt'),
						title: S.text(S.inner(s.inner, 'h3')),
						body: ps.length ? S.text(ps[ps.length - 1].inner) : '',
					};
				}),
			});
			continue;
		}

		unknown.push(`${slug}: unclassified article [${c.slice(0, 50)}]`);
	}

	if (unknown.length) {
		console.error(`! ${unknown.length} unclassified block(s):`);
		for (const u of unknown) console.error(`   ${u}`);
		process.exitCode = 1;
	}

	/* ---- TS output ---- */
	const L = [];
	L.push(`/**`);
	L.push(` * AUTO-GENERATED - do not edit by hand.`);
	L.push(` * Regenerate: npm run gen:industries-sub -- ${slug}`);
	L.push(` * Source: qa/ref/industries-${slug}.html`);
	L.push(` */`);
	L.push(``);
	L.push(`import type { IndustrySubBlock } from './types';`);
	L.push(``);
	L.push(`export const SEO = {`);
	L.push(`\ttitle: ${q(pageTitle)},`);
	L.push(`\tdescription: ${q(pageDescription)},`);
	L.push(`};`);
	L.push(``);
	L.push(`export const BLOCKS: IndustrySubBlock[] = [`);
	for (const b of blocks) {
		L.push(`\t{`);
		L.push(`\t\tkind: ${q(b.kind)},`);
		if (b.kind === 'hero') {
			L.push(`\t\tbreadcrumb: [`);
			for (const c of b.breadcrumb)
				L.push(`\t\t\t{ label: ${q(c.label)}${c.href ? `, href: ${q(c.href)}` : ''} },`);
			L.push(`\t\t],`);
			L.push(`\t\teyebrow: ${q(b.eyebrow)},`);
			L.push(`\t\theading: ${q(b.heading)},`);
			L.push(`\t\tlead: ${q(b.lead)},`);
			L.push(
				`\t\timage: { src: ${q(b.image.src)}, alt: ${q(b.image.alt)}, width: ${b.image.width}, height: ${b.image.height} },`,
			);
		} else if (b.kind === 'contactBand') {
			L.push(`\t\theading: ${q(b.heading)},`);
			L.push(`\t\ttext: ${q(b.text)},`);
			L.push(`\t\ticon: { src: ${q(b.icon.src)}, alt: ${q(b.icon.alt)} },`);
			L.push(`\t\tctaLabel: ${q(b.ctaLabel)},`);
			if (b.ctaHref) L.push(`\t\tctaHref: ${q(b.ctaHref)},`);
		} else if (b.kind === 'media') {
			L.push(`\t\theading: ${q(b.heading)},`);
			L.push(`\t\ttitle: ${q(b.title)},`);
			L.push(`\t\topen: ${b.open},`);
			L.push(
				`\t\timage: { src: ${q(b.image.src)}, alt: ${q(b.image.alt)}, width: ${b.image.width}, height: ${b.image.height} },`,
			);
			L.push(`\t\tcaption: ${q(b.caption)},`);
			L.push(
				`\t\tlinks: [${b.links.map((l) => `{ text: ${q(l.text)}, href: ${q(l.href)} }`).join(', ')}],`,
			);
			L.push(`\t\thtml: ${q(b.html)},`);
		} else if (b.kind === 'supportCards') {
			L.push(`\t\theading: ${q(b.heading)},`);
			L.push(`\t\tcards: [`);
			for (const cd of b.cards)
				L.push(
					`\t\t\t{ icon: ${q(cd.icon)}, iconAlt: ${q(cd.iconAlt)}, title: ${q(cd.title)}, description: ${q(cd.description)} },`,
				);
			L.push(`\t\t],`);
		} else if (b.kind === 'iconCards') {
			L.push(`\t\theading: ${q(b.heading)},`);
			L.push(`\t\titems: [`);
			for (const it of b.items)
				L.push(
					`\t\t\t{ href: ${q(it.href)}, image: ${q(it.image)}, alt: ${q(it.alt)}, title: ${q(it.title)}, body: ${q(it.body)} },`,
				);
			L.push(`\t\t],`);
		} else if (b.kind === 'video') {
			L.push(`\t\theading: ${q(b.heading)},`);
			L.push(`\t\tposter: ${q(b.poster)},`);
			L.push(`\t\tposterAlt: ${q(b.posterAlt)},`);
			L.push(`\t\tcaption: ${q(b.caption)},`);
		} else if (b.kind === 'brochure') {
			L.push(`\t\theading: ${q(b.heading)},`);
			L.push(`\t\titems: [`);
			for (const it of b.items)
				L.push(
					`\t\t\t{ href: ${q(it.href)}, image: { src: ${q(it.image.src)}, alt: ${q(it.image.alt)}, width: ${it.image.width}, height: ${it.image.height} }, title: ${q(it.title)}, description: ${q(it.description)}, label: ${q(it.label)} },`,
				);
			L.push(`\t\t],`);
		} else if (b.kind === 'ctaBand') {
			L.push(`\t\theading: ${q(b.heading)},`);
			L.push(`\t\teyebrow: ${q(b.eyebrow)},`);
			L.push(
				`\t\timage: { src: ${q(b.image.src)}, alt: ${q(b.image.alt)}, width: ${b.image.width}, height: ${b.image.height} },`,
			);
			L.push(`\t\tdescription: ${q(b.description)},`);
			L.push(
				`\t\tcta: ${b.cta ? `{ label: ${q(b.cta.label)}, href: ${q(b.cta.href)} }` : 'null'},`,
			);
		} else if (b.kind === 'richText') {
			L.push(`\t\tparagraphs: [${b.paragraphs.map((p) => q(p)).join(', ')}],`);
		} else if (b.kind === 'raw' || b.kind === 'gallery') {
			L.push(`\t\thtml: ${q(b.html)},`);
		}
		L.push(`\t},`);
	}
	L.push(`];`);
	L.push(``);

	mkdirSync('src/data/industries-sub', { recursive: true });
	writeFileSync(outTs, L.join('\n'), 'utf8');
	recordWrite(outTs);

	const counts = blocks.reduce((a, b) => ((a[b.kind] = (a[b.kind] ?? 0) + 1), a), {});
	console.log(`data ${outTs}`);
	console.log(`  blocks=${blocks.length} ${JSON.stringify(counts)}`);
	return outTs;
}

for (const slug of wanted) {
	try {
		generate(slug);
	} catch (err) {
		console.error(`! ${slug}: ${err.message}`);
		process.exitCode = 1;
	}
}
