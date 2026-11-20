/**
 * src/data/home.ts — homepage content (BOZE titanium fastener front door).
 *
 * CONTENT RULES (hard constraints)
 * ---------------------------------
 * 1. No generic titanium explainers ("what is titanium", "why titanium resists
 *    corrosion"). Every line states a capability, a document or a route.
 * 2. No measured performance data. No torque coefficient K, no galling test,
 *    no friction coefficient. Only published nominal material values taken
 *    from @data/products (MATERIALS) are shown, and they are labelled nominal.
 * 3. Every internal href is either a literal route that exists in src/pages/**
 *    or is derived from @data/products (familyPath / FILTER_GROUPS /
 *    CATEGORY_CARDS). Nothing is invented.
 * 4. Standard deep links only use standard ids that really exist as
 *    checkable options in FILTER_GROUPS, so ?standard= never degrades to an
 *    empty filter.
 *
 * DATA FLOW
 * ---------
 * Product links, category links and material names come from the generated
 * product layer. Change data/products/*.csv, run `npm run gen:products`, and
 * the homepage follows without touching this file.
 */

import {
	CATEGORY_CARDS,
	FILTER_GROUPS,
	MATERIALS,
	PUBLISHED_FAMILIES,
	familyPath,
} from '@data/products';
import { gradeLandingPath } from '@data/grade-paths';

/* ── shared shapes ─────────────────────────────────────────────────── */

export interface HomeLink {
	label: string;
	href: string;
}

export interface HomeFact {
	label: string;
	value: string;
}

/* ── real routes referenced by the homepage ────────────────────────── */

const PATHS = {
	products: '/products/',
	contact: '/contact/',
	gradeMatrix: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
	nda: '/knowledge-hub/ip-protection/nda-ip-protection-policy/',
	estimator: '/knowledge-hub/tools/steel-to-titanium-weight-estimator/',
	aboutFactory: '/about-us/factory/',
	aboutQuality: '/about-us/quality/',
	aboutService: '/about-us/service/',
	inspection: '/about-us/quality/inspection-and-test-reports/',
	standards: '/services/manufacturing-capabilities/production-per-international-standards/',
	cnc: '/services/manufacturing-capabilities/cnc-machining-to-customer-drawings/',
	forging: '/services/manufacturing-capabilities/cold-heading-hot-forging/',
	finishing: '/services/manufacturing-capabilities/surface-finishing-color-coding/',
	mtc: '/services/compliance-packaging/en-10204-31-mtc-traceability/',
	pmi: '/services/compliance-packaging/pmi-xrf-grade-verification/',
	packaging: '/services/compliance-packaging/distributor-labeling-packaging/',
	blanket: '/services/order-fulfillment/blanket-orders-scheduled-delivery/',
	prototyping: '/services/order-fulfillment/fast-prototyping-low-moq/',
} as const;



export const HERO = {
	eyebrow: 'ISO 9001 & AS9100D Certified Titanium Fastener Manufacturer',
	/**
	 * H1 显式两行：桌面端（1280px+）必须严格 2 行，不靠自动折行碰运气。
	 * 每一行是完整语义单元，SEO 读作 "Custom & Standard CNC Titanium Fasteners"。
	 */
	heading: ['Custom & Standard CNC', 'Titanium Fasteners'],
	lead:
		'Precision bolts, screws & nuts machined to your drawing or DIN, ISO, ' +
		'ASTM F467/F468 standards. In-house CNC with full lot traceability.',
	primaryCta: { label: 'Browse Catalogue', href: PATHS.products },
	secondaryCta: { label: 'Send Drawing for Quote', href: PATHS.contact },
	facts: [
		{ label: 'Thread Range', value: 'M1–M36 (M1–M1.5 Custom)' },
		{ label: 'Titanium Grades', value: 'CP Grade 2, Grade 5 (Ti-6Al-4V), Grade 23' },
		{ label: 'Quality & Certs', value: 'AS9100D, ISO 9001 & EN 10204 3.1' },
		{ label: 'Engineering Reply', value: 'Within 12 business hours' },
	],
	/**
	 * Hero image — one wide factory shot for the right-hand column.
	 * Real file under /public/images/public-images/.
	 */
	image: {
		src: '/images/public-images/titanium-fasteners-hero.webp',
		alt: 'Custom CNC machined titanium fasteners, bolts, studs, nuts, and washers in Grade 2 and Grade 5 Ti-6Al-4V',
	},
} satisfies {
	eyebrow: string;
	heading: string[];
	lead: string;
	primaryCta: HomeLink;
	secondaryCta: HomeLink;
	facts: HomeFact[];
	image: { src: string; alt: string };
};



/** Only standard ids that really exist as a checkable filter option. */
const STANDARD_OPTION_IDS = new Set(
	(FILTER_GROUPS.find((g) => g.id === 'standard')?.options ?? []).map((o) => o.id),
);

/** Only material ids that really exist as a checkable filter option. */
const MATERIAL_OPTION_IDS = new Set(
	(FILTER_GROUPS.find((g) => g.id === 'material')?.options ?? []).map((o) => o.id),
);

const standardHref = (id: string): string =>
	STANDARD_OPTION_IDS.has(id) ? `/products/?standard=${id}` : PATHS.products;

/**
 * 牌号链接 —— 与主导航、产品解决方案口径完全一致（@data/grade-paths 单一真相源）：
 * 有专属落地页的牌号（Grade 2 / Grade 5）进落地页，其余走筛选深链或牌号矩阵页。
 */
const materialHref = (id: string): string =>
	gradeLandingPath(id) ??
	(MATERIAL_OPTION_IDS.has(id) ? `/products/?material=${id}` : PATHS.gradeMatrix);

export const SPEC_FINDER = {
	heading: 'Select by Standard, Grade or Type',
	lead:
		'Filter the catalogue by DIN or ISO reference, CP Grade 2 or Grade 5, thread ' +
		'and length. Every filtered line is a quotable part with its size table and grade list.',
	standards: [
		{ label: 'DIN 912', note: 'Hex socket head cap screws', href: standardHref('din-912') },
		{ label: 'DIN 933', note: 'Hex head bolts, fully threaded', href: standardHref('din-933') },
		{ label: 'DIN 934', note: 'Hexagon nuts', href: standardHref('din-934') },
		{ label: 'DIN 125', note: 'Plain washers', href: standardHref('din-125') },
		{ label: 'DIN 7991', note: 'Countersunk head cap screws', href: standardHref('din-7991') },
		{ label: 'DIN 7380', note: 'Pan head socket screws', href: standardHref('din-7380') },
		{ label: 'DIN 6921', note: 'Hexagon head bolts with flange', href: standardHref('din-6921') },
		{ label: 'DIN 931', note: 'Hex head bolts, partially threaded', href: standardHref('din-931') },
		{ label: 'DIN 938', note: 'Hexagon head studs', href: standardHref('din-938') },
		{ label: 'DIN 34800', note: '12-point flange bolts', href: standardHref('din-34800') },
		{ label: 'ISO 7380-2', note: 'Hex socket head bolts with flange', href: standardHref('iso-7380-2') },
	],
	materials: [
		{ label: 'Grade 2 (CP-Ti)', note: 'Stocked as standard', href: materialHref('ti-gr2') },
		{ label: 'Grade 5 (Ti-6Al-4V)', note: 'Stocked as standard', href: materialHref('ti-gr5') },
		{ label: 'Grade 23 (ELI)', note: 'Made to order', href: PATHS.gradeMatrix },
	],
	categories: CATEGORY_CARDS.map((card) => ({
		label: card.title,
		note: `${card.products} product${card.products === 1 ? '' : 's'}`,
		href: card.href,
	})),
	crossReference: {
		label: 'DIN / ISO / ASTM cross-reference',
		href: PATHS.gradeMatrix,
	},
} satisfies {
	heading: string;
	lead: string;
	standards: { label: string; note: string; href: string }[];
	materials: { label: string; note: string; href: string }[];
	categories: { label: string; note: string; href: string }[];
	crossReference: HomeLink;
};



export const AUDIENCE = {
	heading: 'Supply Channels: Distributor & OEM',
	lead:
		'Distributors order catalogue lines against DIN, ISO and ASTM references. ' +
		'OEM buyers release drawings for print-to-part CNC. One desk takes both.',
	columns: [
		{
			heading: 'Distributors & Stockists',
			body:
				'Catalogue parts to DIN, ISO, ASTM F467 / F468 and ASME, in CP Grade 2 ' +
				'and Grade 5, packed per lot with your label and barcode.',
			points: [
				{ label: 'Selection', value: 'Filter by standard, grade, type, thread and length' },
				{ label: 'Availability', value: 'Grade 2 and Grade 5 stocked as standard' },
				{ label: 'Supply', value: 'Blanket orders and scheduled call-off deliveries' },
				{ label: 'Packaging', value: 'Your label, your barcode, your carton format' },
			],
			cta: { label: 'Open the catalogue', href: PATHS.products },
			secondary: { label: 'Grade supply matrix', href: PATHS.gradeMatrix },
			image: {
				src: '/images/public-images/for-distributors.webp',
				alt: 'Distributor buyers checking a tray of titanium fasteners in the warehouse.',
			},
		},
		{
			heading: 'OEM Engineers & Buyers',
			body:
				'Machined from your drawing under NDA, with tolerance, heat number ' +
				'and MTC carried through the part.',
			points: [
				{ label: 'Drawing review', value: 'Feasibility feedback before the order is placed' },
				{ label: 'Quality', value: 'PMI / XRF on every batch before packing' },
				{ label: 'Documents', value: 'Inspection report and EN 10204 3.1 MTC with every lot' },
				{ label: 'IP', value: 'NDA signed before the drawing is opened' },
			],
			cta: { label: 'Factory and production', href: PATHS.aboutFactory },
			secondary: { label: 'NDA and IP protection policy', href: PATHS.nda },
			image: {
				src: '/images/public-images/for-oem-engineers-and-buyers.webp',
				alt: 'OEM engineers reviewing a machined titanium part against its CAD drawing.',
			},
		},
	],
} satisfies {
	heading: string;
	lead: string;
	columns: {
		heading: string;
		body: string;
		points: HomeFact[];
		cta: HomeLink;
		secondary: HomeLink;
		image: { src: string; alt: string };
	}[];
};

/* ── Screen 3 · Three factory assets ───────────────────────────────── */

export const CAPABILITIES = {
	heading: 'In-House Cold Heading, Forging & CNC',
	lead:
		'Every route runs in our own workshop, and every lot leaves with its MTC.',
	pillars: [
		{
			label: 'Cold Heading & Forging',
			heading: 'Production to DIN, ISO & ASTM',
			body:
				'M1.6–M36 in CP Grade 2 and Grade 5 Ti-6Al-4V to DIN, ISO, ' +
				'ASTM F467 / F468 and ASME. Drawing parts run on the same lines.',
			facts: [
				{ label: 'Range', value: 'M1.6–M36, M1–M1.5 to order' },
				{ label: 'Routes', value: 'Cold heading, hot forging, CNC machining' },
				{ label: 'Finishing', value: 'AMS 2700 passivation, AMS 2488 anodizing, grade colour coding' },
			],
			cta: { label: 'Production per international standards', href: PATHS.standards },
			image: {
				src: '/images/public-images/produced-to-international-standards.webp',
				alt: 'Titanium fastener range from M1.6 to M36 in CP Grade 2 and Grade 5, size and grade colour coded.',
			},
		},
		{
			label: 'CNC Machining',
			heading: 'Print-to-Part CNC Machining',
			body:
				'Print-to-part CNC from bar or billet, NDA-protected, tolerances held ' +
				'as drawn. STEP, IGES, DXF or PDF accepted.',
			facts: [
				{ label: 'Input', value: 'STEP, IGES, DXF or PDF with tolerances marked' },
				{ label: 'Release', value: 'First article approved before series production' },
				{ label: 'Confidentiality', value: 'NDA signed before the drawing is opened' },
			],
			cta: { label: 'CNC machining to customer drawings', href: PATHS.cnc },
			image: {
				src: '/images/public-images/made-to-your-drawing.webp',
				alt: 'CNC machined titanium special parts checked with a micrometer.',
			},
		},
		{
			label: 'Traceability & Packing',
			heading: 'Lot Traceability & Anti-Mixing Packaging',
			body:
				'Every lot carries an EN 10204 3.1 certificate, is verified by ' +
				'PMI / XRF before packing, and is segregated by grade to prevent mixed material.',
			facts: [
				{ label: 'Material', value: 'ASTM B348 bar stock' },
				{ label: 'Finished product', value: 'ASTM F467 / F468' },
				{ label: 'Documents', value: 'EN 10204 3.1, one certificate per lot' },
			],
			cta: { label: 'EN 10204 3.1 MTC and traceability', href: PATHS.mtc },
			image: {
				src: '/images/public-images/material-compliance-and-packaging.webp',
				alt: 'Titanium hex bolts in a heat-number labelled bag, beside ASTM B348 Grade 5 bar stock.',
			},
		},
	],
} satisfies {
	heading: string;
	lead: string;
	pillars: {
		label: string;
		heading: string;
		body: string;
		facts: HomeFact[];
		cta: HomeLink;
		image: { src: string; alt: string };
	}[];
};



export const GRADES = {
	heading: 'Titanium Grades 2, 5, 9 and 23',
	lead:
		'Nominal values from published standards, stated so you can select a grade ' +
		'before ordering.',
	items: MATERIALS.map((m) => ({
		id: m.id,
		label: m.name,
		density: m.density_g_cm3,
		proof: m.proof_strength_mpa,
		tensile: m.tensile_mpa,
		maxTemp: m.max_temp_c,
		notes: m.notes,
		availability:
			m.id === 'ti-gr2' || m.id === 'ti-gr5'
				? 'Stocked as standard'
				: 'Made to order against a confirmed specification',
		href: materialHref(m.id),
	})),
	cta: { label: 'Titanium grade supply matrix', href: PATHS.gradeMatrix },
} satisfies {
	heading: string;
	lead: string;
	items: {
		id: string;
		label: string;
		density: string;
		proof: string;
		tensile: string;
		maxTemp: string;
		notes: string;
		availability: string;
		href: string;
	}[];
	cta: HomeLink;
};

/* ── Screen 5 · Product matrix (real families) ─────────────────────── */

export const PRODUCT_MATRIX = {
	heading: 'Titanium fastener families',
	lead:
		'Sizes cut to order. Each family carries its size table, standards reference ' +
		'and grade list; certificates are issued per lot.',
	families: PUBLISHED_FAMILIES.map((family) => ({
		title: family.name,
		href: familyPath(family.category, family.family_id),
		image: family.image,
		alt: family.name,
		description: family.description,
		standards: family.standards,
	})),
	all: { label: 'All products', href: PATHS.products },
} satisfies {
	heading: string;
	lead: string;
	families: {
		title: string;
		href: string;
		image: string;
		alt: string;
		description: string;
		standards: string;
	}[];
	all: HomeLink;
};



export const TRUST = {
	heading: 'Shop-Floor Verified Documentation',
	items: [
		{
			label: 'Production and quality',
			heading: 'Signed by Production & Quality Leads',
			body:
				'Process and material statements come from our engineering and ' +
				'production leads. Certificate and inspection statements come from ' +
				'our quality lead, against our own shop-floor records.',
			href: PATHS.aboutFactory,
			linkLabel: 'Factory and production',
		},
		{
			label: 'Traceability and verification',
			heading: 'Heat-Number Traceability, 100% XRF',
			body:
				'Heat number carried through every production and finishing step. ' +
				'Material to ASTM B348, finished product to ASTM F467 / F468, ' +
				'documents to EN 10204 3.1. Every batch verified by PMI / XRF before packing.',
			href: PATHS.aboutQuality,
			linkLabel: 'Quality and compliance',
		},
		{
			label: 'Supply verification',
			heading: 'Feasibility Confirmed Pre-Release',
			body:
				'Check process, certification and delivery route before the drawing ' +
				'changes hands. Figures that depend on your drawing are confirmed ' +
				'against your file.',
			href: PATHS.aboutService,
			linkLabel: 'Supply and service',
		},
	],
} satisfies {
	heading: string;
	items: { label: string; heading: string; body: string; href: string; linkLabel: string }[];
};

/* ── Screen 7 · Compliance closure ─────────────────────────────────── */

export const COMPLIANCE = {
	heading: 'Lot Traceability & MTC Assurance',
	lead:
		'Three evidence steps, then a PMI / XRF check, then packaging that ' +
		'keeps grades apart in your warehouse.',
	steps: [
		{
			label: 'Material Origin',
			heading: 'Mill Heat-Number Traceability',
			body:
				'Bar stock is bought against ASTM B348. Each lot is identified by the ' +
				'mill heat number, and that number follows the material through every step.',
			href: PATHS.mtc,
			linkLabel: 'EN 10204 3.1 MTC and traceability',
		},
		{
			label: 'Finished Part',
			heading: 'Finished Product to ASTM F467',
			body:
				'Finished fasteners are specified to ASTM F467 / F468, with the ' +
				'process route selected per part geometry and per material.',
			href: PATHS.standards,
			linkLabel: 'Production per international standards',
		},
		{
			label: 'Pre-Shipment Check',
			heading: 'PMI / XRF Verification & Packaging',
			body:
				'Every batch passes positive material identification before it is packed. ' +
				'Grades are segregated in storage and in process, and tools and baskets ' +
				'are colour coded by grade.',
			href: PATHS.pmi,
			linkLabel: 'PMI / XRF grade verification',
		},
	],
	secondaryLinks: [
		{ label: 'Distributor labelling and packaging', href: PATHS.packaging },
		{ label: 'Blanket orders and scheduled delivery', href: PATHS.blanket },
		{ label: 'Inspection and test reports', href: PATHS.inspection },
	],
} satisfies {
	heading: string;
	lead: string;
	steps: { label: string; heading: string; body: string; href: string; linkLabel: string }[];
	secondaryLinks: HomeLink[];
};



export const CLOSING = {
	heading: 'RFQ & Production Workflow',
	body:
		'Send a DIN or ISO number, or a drawing. You get a price, the certificate set ' +
		'and a delivery date. Drawings run under NDA, signed before the file is opened.',
	channels: [
		{
			label: 'Standard parts',
			value: 'DIN or ISO number, grade, size and annual quantity',
			href: PATHS.contact,
		},
		{
			label: 'Parts to drawing',
			value: 'STEP, IGES, DXF or PDF with tolerances marked',
			href: PATHS.contact,
		},
		{
			label: 'Low volume and samples',
			value: 'Minimum quantities agreed per programme',
			href: PATHS.prototyping,
		},
	],
	facts: [
		{ label: 'Engineering reply', value: 'Within 12 business hours' },
		{ label: 'Certificate', value: 'EN 10204 3.1 per lot, heat number referenced' },
		{ label: 'Range', value: 'M1.6–M36, M1–M1.5 to order' },
	],
	cta: { label: 'Request a quotation', href: PATHS.contact },
	secondaryLinks: [
		{ label: 'Steel to titanium weight estimator', href: PATHS.estimator },
		{ label: 'Cold heading and hot forging', href: PATHS.forging },
		{ label: 'Surface finishing and colour coding', href: PATHS.finishing },
	],
} satisfies {
	heading: string;
	body: string;
	channels: { label: string; value: string; href: string }[];
	facts: HomeFact[];
	cta: HomeLink;
	secondaryLinks: HomeLink[];
};

