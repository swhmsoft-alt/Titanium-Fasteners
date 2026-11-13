/**
 * Shared types for the `industries-sub` page type.
 *
 * The 8 industry sub pages (electrical-engineering, electric-vehicles, hvac,
 * medical, railway, robotics, semiconductors, data-centers) share one page
 * type on the reference site: a hero, a set of CMS blocks and a CTA band.
 * Each page ships its own generated data file in this folder.
 */

export interface Crumb {
	label: string;
	href?: string;
}

export interface Img {
	src: string;
	alt: string;
	width: number;
	height: number;
}

export interface HeroBlock {
	kind: 'hero';
	breadcrumb: Crumb[];
	eyebrow: string;
	heading: string;
	lead: string;
	image: Img;
}

export interface ContactBandBlock {
	kind: 'contactBand';
	heading: string;
	text: string;
	icon: { src: string; alt: string };
	ctaLabel: string;
	ctaHref?: string;
}

/**
 * The CMS accordion block. Its markup is kept verbatim (localised images)
 * because it carries a nested <article class="container-fluid h-svh"> — the
 * lightbox body — and the reference keeps that body in its own Astro island.
 * The modelled fields describe the accordion for documentation purposes.
 */
export interface MediaBlock {
	kind: 'media';
	heading: string;
	title: string;
	open: boolean;
	image: Img;
	caption: string;
	links: { text: string; href: string }[];
	html: string;
}

/** The horizontal image rail that follows a media block. */
export interface GalleryBlock {
	kind: 'gallery';
	html: string;
}

/** A reference block this build does not model; rendered verbatim. */
export interface RawBlock {
	kind: 'raw';
	html: string;
}

export interface SupportCardsBlock {
	kind: 'supportCards';
	heading: string;
	cards: { icon: string; iconAlt: string; title: string; description: string }[];
}

export interface IconCardsBlock {
	kind: 'iconCards';
	heading: string;
	items: { href: string; image: string; alt: string; title: string; body: string }[];
}

export interface VideoBlock {
	kind: 'video';
	heading: string;
	poster: string;
	posterAlt: string;
	caption: string;
}

export interface BrochureBlock {
	kind: 'brochure';
	heading: string;
	items: { href: string; image: Img; title: string; description: string; label: string }[];
}

export interface CtaBandBlock {
	kind: 'ctaBand';
	heading: string;
	eyebrow: string;
	image: Img;
	description: string;
	cta: { label: string; href: string } | null;
}

export interface RichTextBlock {
	kind: 'richText';
	paragraphs: string[];
}

export type IndustrySubBlock =
	| HeroBlock
	| ContactBandBlock
	| MediaBlock
	| GalleryBlock
	| RawBlock
	| SupportCardsBlock
	| IconCardsBlock
	| VideoBlock
	| BrochureBlock
	| CtaBandBlock
	| RichTextBlock;
