/**
 * Fastener Coatings — the single data source for
 * `/product-solutions/components-specific-solutions/fastener-coatings/`.
 *
 * The page is assembled from five modules that serve two intents:
 *   Hub    — the four titanium surface states, the engineering comparison
 *            matrix and the technical FAQ (a buyer who is still selecting).
 *   Money  — the factory RFQ form and the trust anchors around it (a buyer
 *            who is ready to quote).
 *
 * IDENTITY
 * --------
 * We are a titanium source factory, not a trading intermediary. No supplier
 * network, no multi-vendor language, no reference-site brands.
 *
 * RED LINKS
 * ---------
 * Every href below is taken from the shared route table, so each one exists
 * in src/pages/**.
 */
import { ROUTES } from './routes';
import { FINISHES } from './finishes';
import { MATRIX_FILTERS, MATRIX_ROWS } from './matrix';
import { FAQ } from './faq';
import type { BreadcrumbItem, RelatedLink, RfqFinishOption, RfqGradeOption } from './types';

export * from './types';
export { ROUTES } from './routes';
export { FINISHES } from './finishes';
export { MATRIX_FILTERS, MATRIX_ROWS } from './matrix';
export { FAQ } from './faq';

export const FASTENER_COATINGS = {
	seo: {
		title: 'Titanium Fastener Coatings & Surface Finishes',
		description:
			'Factory-direct surface finishing for Grade 2, Grade 5 (Ti-6Al-4V) and Grade 23 titanium fasteners, M1.6–M36. Plain, ASTM F86 / AMS 2700 passivation, AMS 2488 Type II and III anodising, PVD and DLC, with EN 10204 3.1 MTC per lot.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: ROUTES.home },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Fastener Coatings' },
		] as BreadcrumbItem[],
		eyebrow: 'Titanium Fastener Surface Engineering',
		heading: 'Titanium Fastener Coatings & Surface Finishes',
		/** Strictly ≤ 40 words — the text column stays level against the figure. */
		lead:
			'Prevent thread galling, hold mating tolerances from M1.6 to M36, and ' +
			'meet aerospace or medical requirements with factory-controlled plain, ' +
			'passivated, anodised and PVD finishes.',
		primaryCta: { label: 'Request surface finish quote', href: '#rfq-quote-section' },
		secondaryCta: { label: 'Compare finish specifications', href: '#finish-comparison-matrix' },
		trust: [
			{ label: 'Standards', value: 'ASTM F86 · AMS 2700 · AMS 2488' },
			{ label: 'Size range', value: 'M1.6–M36 (DIN and ISO)' },
			{ label: 'Certification', value: 'EN 10204 3.1 MTC, PMI / XRF verified' },
		],
		image: {
			src: '/images/fastener-coatings/titanium-surface-finishing-hero.webp',
			alt: 'Titanium fasteners in plain, anodised and PVD finishes arranged on a workshop bench.',
		},
	},
	hub: {
		eyebrow: 'Core Surface States',
		heading: 'Four surface states, and the reason to pick each one',
		lead:
			'A titanium surface is specified for galling, wear, cleanliness and ' +
			'assembly identification — not for rust protection. These are the four ' +
			'states we release.',
	},
	finishes: FINISHES,
	matrix: {
		eyebrow: 'Engineering Selection',
		heading: 'Which finish fits the joint you are designing',
		lead:
			'Filter by what the joint has to achieve. Every value below is a ' +
			'published standard or a statement of practice — no measured torque, ' +
			'friction or galling figures are published on this page.',
		filters: MATRIX_FILTERS,
		rows: MATRIX_ROWS,
	},
	faq: {
		eyebrow: 'Purchasing and Engineering',
		heading: 'Questions asked before a finish is specified',
		lead:
			'The four questions that decide a titanium surface specification — answered ' +
			'from the workshop, with the standards named.',
		items: FAQ,
	},

	rfq: {
		eyebrow: 'Factory RFQ',
		heading: 'Send the finish requirement with your drawing',
		lead:
			'Tell us the finish, the grade and the standard. Our engineering desk ' +
			'confirms the surface specification and the certificate scope for your ' +
			'lot in writing.',
		anchors: [
			{
				label: 'NDA and IP protection',
				text: 'A mutual NDA is signed before we open your drawing (STEP, DXF or PDF).',
			},
			{
				label: 'Full traceability',
				text: 'Every lot carries its EN 10204 3.1 certificate and a PMI / XRF grade check.',
			},
			{
				label: 'Distributor and OEM ready',
				text: 'Neutral white-label packaging, custom labelling and blanket orders released in batches.',
			},
		],
		finishOptions: [
			{ id: 'plain', label: 'Plain (as-machined)' },
			{ id: 'passivated', label: 'Passivated (ASTM F86 / AMS 2700)' },
			{ id: 'anodizing-type-ii', label: 'Anodising Type II (AMS 2488)' },
			{ id: 'anodizing-type-iii', label: 'Anodising Type III (colour)' },
			{ id: 'pvd', label: 'PVD / DLC (DLC, TiN, CrN)' },
			{ id: 'other', label: 'Other / per drawing' },
		] as RfqFinishOption[],
		gradeOptions: [
			{ id: 'ti-gr2', label: 'Grade 2 (commercially pure)' },
			{ id: 'ti-gr5', label: 'Grade 5 (Ti-6Al-4V)' },
			{ id: 'ti-gr23', label: 'Grade 23 (Ti-6Al-4V ELI)' },
			{ id: 'gr7', label: 'Grade 7 (confirmed per order)' },
			{ id: 'other', label: 'Other / per drawing' },
		] as RfqGradeOption[],
	},
	related: {
		heading: 'Related resources',
		items: [
			{
				label: 'Titanium grade supply matrix',
				href: ROUTES.gradeMatrix,
				description: 'Grades, standards and what each certificate confirms.',
			},
			{
				label: 'PMI and XRF verification',
				href: ROUTES.pmi,
				description: 'How the grade of each lot is verified in our workshop.',
			},
			{
				label: 'NDA and IP protection',
				href: ROUTES.nda,
				description: 'How drawings and files are handled under a mutual NDA.',
			},
			{
				label: 'Steel-to-titanium weight estimator',
				href: ROUTES.estimator,
				description: 'Compare the weight of a titanium part against its steel equivalent.',
			},
		] as RelatedLink[],
	},
} as const;
