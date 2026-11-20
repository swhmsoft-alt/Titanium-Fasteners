/**
 * Shared data layer for the BOZE industry application pages.
 *
 * WHY A SHARED MODULE
 * -------------------
 * Every application page (`/industries/<slug>/`) renders the same six-section
 * funnel: hero -> sub-applications -> grade matrix -> QA pillars -> reference
 * application -> FAQ -> RFQ. Only the copy, the images and the two named
 * sub-applications change from industry to industry.
 *
 * This module owns the parts that must NOT be retyped per page:
 *   · the product lookup helpers (family id -> generated product card), so no
 *     page ever hand-writes a catalogue URL;
 *   · the grade comparison rows, whose every number is read from the generated
 *     MATERIALS dictionary (published nominal values);
 *   · the quality-pillar cards, which describe the factory itself;
 *   · the JSON-LD builder, so the structured data and the visible DOM are
 *     rendered from one source and cannot drift apart.
 */
import { ALL_PRODUCTS, FAMILIES, MATERIALS } from '@data/products';
import type { ProductCardView } from '@data/products';

/** A content image with intrinsic dimensions (used for aspect-ratio hints). */
export interface AppImage {
	src: string;
	alt: string;
	width: number;
	height: number;
}

/** A bold-lead bullet — the technical term first, then one short clause. */
export interface AppPoint {
	label: string;
	text: string;
}

/** A CTA that points at a catalogue family — the href is resolved from the catalogue. */
export interface AppCta {
	label: string;
	/** Catalogue family id; the link is built from the generated product card. */
	familyId: string;
	/** Optional override for the resolved href (e.g. an in-page anchor). */
	href?: string;
}

/** One named sub-application of an industry. */
export interface AppSubApplication {
	id: string;
	eyebrow: string;
	heading: string;
	/** Lead paragraph — at most 40 words. */
	lead: string;
	image: AppImage;
	points: AppPoint[];
	cta: AppCta;
	/** Catalogue family ids; cards are rendered from the generated product data. */
	families: readonly string[];
}

/** A comparison-table row: one property, one cell per column. */
export interface AppComparisonRow {
	label: string;
	/** Formatted cell values, one per column, in the same order as the columns. */
	values: string[];
}

export interface AppFaqItem {
	question: string;
	answer: string;
}

/** One catalogue family, resolved from the generated product list. */
export function productByFamily(familyId: string): ProductCardView | undefined {
	const sku = FAMILIES.find((f) => f.family_id === familyId)?.sku;
	if (!sku) return undefined;
	return ALL_PRODUCTS.find((p) => p.sku === sku);
}

/** Product cards for a set of catalogue family ids. */
export function productsByFamily(familyIds: readonly string[]): ProductCardView[] {
	const out: ProductCardView[] = [];
	for (const id of familyIds) {
		const found = productByFamily(id);
		if (found) out.push(found);
	}
	return out;
}

/** The href of a CTA — falls back to the catalogue root, never a dead route. */
export function familyHref(familyId: string): string {
	return productByFamily(familyId)?.href ?? '/products/';
}

/** The grades compared in the material table — all three exist in MATERIALS. */
const GRADE_IDS = ['ti-gr2', 'ti-gr5', 'ti-gr23'] as const;

const grades = GRADE_IDS.map((id) => MATERIALS.find((m) => m.id === id)).filter(
	(m): m is (typeof MATERIALS)[number] => Boolean(m)
);

/**
 * Grade 7 has no row in materials.csv, so no nominal value is published for it.
 * Every cell therefore reads "Confirmed per order" — the same position the
 * grade supply matrix takes. Nothing about Grade 7 is typed by hand.
 */
const GRADE7_CELL = 'Confirmed per order';

/** Material property rows — every value is read from MATERIALS. */
export const GRADE_ROWS: AppComparisonRow[] = [
	{
		label: 'Proof strength',
		values: [...grades.map((m) => `${m.proof_strength_mpa} MPa`), GRADE7_CELL],
	},
	{
		label: 'Tensile strength',
		values: [...grades.map((m) => `${m.tensile_mpa} MPa`), GRADE7_CELL],
	},
	{
		label: 'Maximum service temperature',
		values: [...grades.map((m) => `${m.max_temp_c} C`), GRADE7_CELL],
	},
	{
		label: 'Corrosion resistance rating',
		values: [...grades.map((m) => `${m.corrosion_1_5} of 5`), GRADE7_CELL],
	},
];

/** The grade column headers, Grade 7 included as a confirmed-per-order column. */
export const GRADE_COLUMNS = [
	...grades.map((m) => ({ id: m.id, name: m.name })),
	{ id: 'ti-gr7', name: 'Titanium Grade 7 (Ti-6Al-4V with palladium)' },
];

/**
 * Comparison against the materials a buyer would otherwise specify.
 *
 * Only two densities are published on this site — Grade 5 from MATERIALS and
 * carbon steel 7.85 g/cm3, the same reference value the weight estimator uses.
 * Every other cell is qualitative, so no number is invented for a material we
 * do not measure.
 */
export const CONVENTIONAL_COLUMNS = [
	{ id: 'ti-gr5', name: 'Titanium Grade 5' },
	{ id: 'steel', name: 'Carbon steel 8.8 / 10.9' },
	{ id: 'stainless', name: 'Stainless steel A2-70' },
	{ id: 'aluminium', name: 'Aluminium' },
];

export const CONVENTIONAL_ROWS: AppComparisonRow[] = [
	{
		label: 'Nominal density',
		values: ['4.43 g/cm3 (Grade 5)', '7.85 g/cm3', 'Close to carbon steel', 'Lower than titanium'],
	},
	{
		label: 'Mass at the same nominal size',
		values: [
			'About 44% lighter than carbon steel',
			'Baseline',
			'Slightly heavier than carbon steel',
			'Lighter than titanium',
		],
	},
	{
		label: 'Corrosion protection in a wet or aggressive environment',
		values: [
			'Anodised or passivated to ASTM F86; no coating renewal cycle',
			'Zinc or plating with a defined renewal interval',
			'Creep and pitting in chloride and acid service',
			'Stable oxide film; isolate from steel or stainless fasteners',
		],
	},
];

/**
 * The quality pillars. These describe the factory, not the industry, so the
 * same cards are reused on every application page.
 */
export const QA_CARDS: { title: string; body: string }[] = [
	{
		title: 'NDA print-to-part machining',
		body: 'Your drawing is opened only after the mutual NDA is signed. MOQ from 100 pieces per size, and no drawing data is reused for another customer.',
	},
	{
		title: 'EN 10204 3.1 certificates',
		body: 'Every batch ships with a 3.1 material certificate tied to its own heat number, so a serial number can be traced back to the bar it was cut from.',
	},
	{
		title: '100% PMI / XRF verification',
		body: 'Each lot is checked by positive material identification before machining, using XRF or OES spectrometry under AMS 2750 practice.',
	},
	{
		title: 'Anti-galling and protective finishes',
		body: 'AMS 2488 Type II and Type III anodising, ASTM F86 passivation, or DLC dry film. The finish is written on the order so the batch is made the same way.',
	},
	{
		title: 'Anti-mixing lot packaging',
		body: 'One heat number per box, labelled to your scheme. Distributor labelling and plain moisture-barrier packaging are both available.',
	},
	{
		title: 'DIN, ISO and ASTM supply',
		body: 'DIN 912, DIN 933, DIN 934, DIN 125 and DIN 7991 with their ISO equivalents, plus ASTM F468 and F593 finished-fastener scope. Sizes outside the stocked range are machined to order.',
	},
	{
		title: 'Accredited testing and call-off stock',
		body: 'Mechanical and metallurgical testing is placed with ISO/IEC 17025 accredited laboratories. A VMI call-off programme can hold the grade and finish a distributor repeats, with each delivery allocated to one heat number.',
	},
];

/** The page data every industry application module conforms to. */
export interface AppPageData {
	/** The route segment — also the canonical path and the RFQ source id. */
	slug: string;
	/** The industry name as shown in the breadcrumb and the H1. */
	industry: string;
	seo: { title: string; description: string };
	hero: {
		breadcrumb: { label: string; href?: string }[];
		eyebrow: string;
		heading: string;
		lead: string;
		badges: { value: string; label: string }[];
		cta: { label: string; href: string };
		secondaryCta: { label: string; href: string };
		image: AppImage;
	};
	subApplications: { heading: string; lead: string; items: AppSubApplication[] };
	comparison: { heading: string; lead: string; note: string };
	qa: { heading: string; lead: string };
	reference: {
		eyebrow: string;
		heading: string;
		lead: string;
		points: AppPoint[];
		image: AppImage;
		facts: { label: string; value: string }[];
		cta: { label: string; href: string };
		secondaryCta: { label: string; href: string };
	};
	faq: { heading: string; items: AppFaqItem[] };
	rfq: { heading: string; lead: string; note: string };
}

/**
 * The JSON-LD graph for an application page.
 *
 * Every value is taken from the page data and the generated catalogue, so the
 * structured data can never point at a route or a product that is not on the
 * page. FAQPage answers are the same strings the <details> elements render.
 */
export function buildAppJsonLd(page: AppPageData, site: { url: string; name: string; legalName: string }) {
	const canonicalPath = `/industries/${page.slug}/`;
	const pageUrl = new URL(canonicalPath, site.url).href;
	const orgId = `${site.url}/#organization`;
	const products = pageProducts(page);

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': orgId,
				name: site.name,
				legalName: site.legalName,
				url: site.url,
				email: 'info@bozemetal.com',
				description:
					'Titanium fastener manufacturer producing standard and custom titanium bolts, screws, studs, nuts and washers to DIN and ISO, M1.6-M36, with EN 10204 3.1 material certification.',
				address: {
					'@type': 'PostalAddress',
					addressLocality: 'Baoji',
					addressRegion: 'Shaanxi',
					addressCountry: 'CN',
				},
			},
			{
				'@type': 'Service',
				name: `${page.industry} titanium fastening supply`,
				serviceType: `Titanium fastener manufacturing and supply for ${page.industry.toLowerCase()}`,
				url: pageUrl,
				description: page.seo.description,
				provider: { '@id': orgId },
				areaServed: ['Europe', 'North America', 'Asia'],
				audience: {
					'@type': 'BusinessAudience',
					name: `${page.industry} engineers and procurement managers`,
				},
			},
			{
				'@type': 'ItemList',
				name: `Titanium fasteners for ${page.industry.toLowerCase()}`,
				numberOfItems: products.length,
				itemListElement: products.map((product, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					name: product.title,
					url: new URL(product.href, site.url).href,
				})),
			},
			{
				'@type': 'FAQPage',
				mainEntity: page.faq.items.map((item) => ({
					'@type': 'Question',
					name: item.question,
					acceptedAnswer: { '@type': 'Answer', text: item.answer },
				})),
			},
		],
	};
}

/** Every product referenced on the page, in the order the sub-applications list them. */
export function pageProducts(page: AppPageData): ProductCardView[] {
	return page.subApplications.items.flatMap((item) => productsByFamily(item.families));
}

