/**
 * Special Parts & Custom Fasteners — the single data source for
 * `/product-solutions/special-parts-and-custom-fasteners/`.
 *
 * The page is assembled from a compact hero, three capability bands (print-to-part,
 * surface engineering, assemblies and kits), a forming-route matrix, a physical-proof
 * gallery and a two-channel close. The hero is deliberately compact — one lead
 * paragraph, three credential tags and two CTA channels — so the first screen stays
 * level against the 4:3 figure column.
 */
import { ROUTES } from './routes';
import { MANUFACTURING } from './manufacturing';
import { SURFACE_ENGINEERING } from './surface-engineering';
import { ASSEMBLIES } from './assemblies';
import { PROCESS_MATRIX } from './process-matrix';
import { GALLERY } from './gallery';
import { AUDIENCE } from './audience';
import type { BreadcrumbItem } from './types';

export * from './types';
export { ROUTES } from './routes';

export const SPECIAL_PARTS = {
	seo: {
		title: 'Custom Titanium Fasteners and Special Parts, Made to Your Drawing',
		description:
			'Print-to-part titanium fasteners and special parts from a source factory: CNC turning, milling, cold heading, hot forging and forming to your drawing under NDA, with anti-galling finishes and EN 10204 3.1 certification per lot.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: ROUTES.home },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Special Parts and Custom Fasteners' },
		] as BreadcrumbItem[],
		eyebrow: 'Custom Titanium Parts and Fasteners',
		heading: 'Custom Titanium Parts and Fasteners, Made to Your Drawing',
		/** 主描述 —— 严格控制在 40 词以内，避免首屏文字列被拉高。 */
		lead:
			'Boze Metal machines and forms titanium parts to your drawing in our own ' +
			'workshop — released with the same lot traceability, finish control and ' +
			'certification as our catalogue fasteners.',
		/** 3 枚紧凑厂方资质标签 —— 替代原先冗长的第二段文字。 */
		credentials: [
			'NDA before the drawing is opened',
			'Grade 2 · Grade 5 · Grade 23 (ELI)',
			'EN 10204 3.1 & 100% PMI / XRF',
		],
		facts: [
			{ label: 'Processes', value: 'CNC turning, milling, cold heading, hot forging' },
			{ label: 'Grades', value: 'Grade 2, Grade 5, Grade 23 (ELI)' },
			{ label: 'Batching', value: 'Samples and low MOQ before series production' },
			{ label: 'Certificate', value: 'EN 10204 3.1 per heat number' },
		],
		primaryCta: { label: 'Send a drawing for quotation', href: ROUTES.contact },
		secondaryCta: { label: 'Browse the catalogue', href: ROUTES.products },
		image: {
			src: '/images/public-images/special-parts-hero-titanium-base-plate-cnc-machined.webp',
			alt: 'Base plate with milled features, produced by CNC machining to a drawing.',
		},
	},
	matrix: {
		eyebrow: 'Forming Routes',
		heading: 'Which route holds your geometry and your batch size',
		lead:
			'One drawing can be made in several ways. The route decides what the ' +
			'process can hold, how the batch is released and what the part looks ' +
			'like after finishing — so it is confirmed against your drawing before ' +
			'anything is cut.',
	},
	manufacturing: MANUFACTURING,
	surfaceEngineering: SURFACE_ENGINEERING,
	assemblies: ASSEMBLIES,
	processMatrix: PROCESS_MATRIX,
	gallery: {
		heading: 'What comes off the machines',
		lead:
			'Turned, milled, formed and finished parts, each one released against a ' +
			'drawing and documented per lot.',
		items: GALLERY,
	},
	audience: AUDIENCE,
	secondaryLinks: [
		{ label: 'Product catalogue', href: ROUTES.products },
		{ label: 'CNC machining to customer drawings', href: ROUTES.cnc },
		{ label: 'Cold heading and hot forging', href: ROUTES.forging },
		{ label: 'Surface finishing and colour coding', href: ROUTES.finishing },
		{ label: 'Fast prototyping and low MOQ', href: ROUTES.prototyping },
		{ label: 'EN 10204 3.1 MTC and traceability', href: ROUTES.mtc },
		{ label: 'NDA and IP protection', href: ROUTES.nda },
		{ label: 'Factory and production', href: ROUTES.aboutFactory },
	],
} as const;
