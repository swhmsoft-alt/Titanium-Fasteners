/**
 * Industries — data entry point for `@data/industries`.
 *
 * The former `src/data/industries.ts` held the reference site's generic
 * industry tiles, a data-centre callout and a contact form. Those sections
 * were removed from the page, so the module was replaced by this folder:
 *
 *   · `hub.ts` — the content of the rebuilt `/industries/` page.
 *   · the `IndustryCard` type below — still consumed by
 *     `@components/sections/industries/IndustryCards.astro`, which the
 *     aerospace page reuses for its teaser rows.
 */
export * from './hub';

/** A tile of the two-up industry grid. `span` mirrors the reference column span. */
export interface IndustryCard {
	href: string;
	image: string;
	alt: string;
	imageWidth: number;
	imageHeight: number;
	/** 'wide' = aspect-5/4 tile (11 of 18 columns), 'narrow' = aspect-3/4 tile (7 of 18). */
	span: 'wide' | 'narrow';
	title: string;
	description: string;
}
