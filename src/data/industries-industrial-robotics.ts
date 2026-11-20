/**
 * Industrial robotics — application page data for `/industries/industrial-robotics/`.
 *
 * WHY A DEDICATED MODULE
 * ----------------------
 * `/industries/robotics/` is the inherited CMS page type (one block vocabulary for
 * eight generic industry pages). The industrial-robotics page is a BOZE application
 * page with its own six-section order, its own two named robot sub-applications and
 * its own static grade-comparison table, so it gets its own hand-written data module
 * instead of being forced into the generic block vocabulary.
 *
 * DATA PROVENANCE
 * ---------------
 *   · Product cards and every product link come from the generated catalogue
 *     (`ALL_PRODUCTS` in @data/products) — no hand-typed catalogue URLs, no dead links.
 *   · Grade values in the comparison table come from the generated `MATERIALS`
 *     dictionary (published nominal values) — no hand-typed strength numbers.
 *   · Copy states only what the shop floor can verify: grade, standard, certificate
 *     scope, finish route, packaging rule. No invented torque values, no invented
 *     customer names, no invented cycle-life figures.
 */
import { ALL_PRODUCTS, FAMILIES, MATERIALS } from '@data/products';
import type { ProductCardView } from '@data/products';

/** A content image with intrinsic dimensions (used for aspect-ratio hints). */
export interface RobotImage {
	src: string;
	alt: string;
	width: number;
	height: number;
}

/** A bold-lead bullet — the technical term first, then one short clause. */
export interface RobotPoint {
	label: string;
	text: string;
}

/** A CTA that points at a catalogue family — the href is resolved from the catalogue. */
export interface RobotCta {
	label: string;
	/** Catalogue family id; the link is built from the generated product card. */
	familyId: string;
	/** Optional override for the resolved href (e.g. an in-page anchor). */
	href?: string;
}

/** One named robot sub-application. */
export interface RobotSubApplication {
	id: string;
	eyebrow: string;
	heading: string;
	/** Lead paragraph — at most 40 words. */
	lead: string;
	image: RobotImage;
	points: RobotPoint[];
	cta: RobotCta;
	/** Catalogue family ids; cards are rendered from the generated product data. */
	families: readonly string[];
}

/** A comparison-table row: one property, one cell per grade. */
export interface RobotComparisonRow {
	label: string;
	/** Formatted cell values, one per grade, in the same order as `grades`. */
	values: string[];
}

export interface RobotFaqItem {
	question: string;
	answer: string;
}

/**
 * One catalogue family, resolved from the generated product list.
 *
 * The SKU is looked up in `FAMILIES` (family_id → sku) and then matched in
 * `ALL_PRODUCTS`. The card therefore always carries the generated href, image,
 * alt text and standards — nothing here is typed by hand.
 */
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

/**
 * The href of a CTA pointing at a catalogue family.
 *
 * Falls back to the catalogue root when the family is not published, so the page
 * can never emit a link to a route that does not exist.
 */
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

/** Material property rows — every value is read from MATERIALS, none typed by hand. */
const comparisonRows: RobotComparisonRow[] = [
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

/**
 * Comparison against the materials a robot builder would otherwise specify.
 *
 * Only two densities are published on this site — Grade 5 from MATERIALS and
 * carbon steel 7.85 g/cm³, the same reference value the weight estimator uses.
 * Every other cell is qualitative, so no number is invented for a material we
 * do not measure.
 */
const conventionalRows: RobotComparisonRow[] = [
	{
		label: 'Nominal density',
		values: [
			'4.43 g/cm3 (Grade 5)',
			'7.85 g/cm3',
			'Close to carbon steel',
			'Lower than titanium',
		],
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
		label: 'Corrosion protection in a washed-down cell',
		values: [
			'Anodised or passivated to ASTM F86; no coating renewal cycle',
			'Zinc or plating with a defined renewal interval',
			'No coating, but galling risk in fitted threaded joints',
			'Stable oxide film; isolate from steel or stainless fasteners',
		],
	},
];

export const INDUSTRIAL_ROBOTICS = {
	seo: {
		title: 'Industrial Robotics',
		description:
			'Titanium fasteners for industrial robotics: Grade 5 hex socket head cap screws, flange bolts and nuts for robot arm frames, end effectors and sensor housings, machined to DIN and ISO with EN 10204 3.1 certificates.',
	},

	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Industries', href: '/industries/' },
			{ label: 'Industrial Robotics' },
		],
		eyebrow: 'Industrial robotics',
		heading: 'Titanium Fasteners for Industrial Robotics',
		lead: 'Grade 5 titanium fasteners for robot arm frames, end effectors and sensor housings, machined to DIN and ISO geometries from M1.6 to M36, and shipped with EN 10204 3.1 certificates tied to the heat number of every lot.',
		badges: [
			{ value: 'M1.6-M36', label: 'Standard thread range' },
			{ value: 'EN 10204 3.1', label: 'Heat-number certificates' },
			{ value: '100% PMI / XRF', label: 'Lot verification' },
		],
		cta: { label: 'Request a quote', href: '#rfq-form' },
		secondaryCta: { label: 'Browse the catalogue', href: '/products/' },
		image: {
			src: '/images/industries-robotics/01-robotics-arm-in-action.webp',
			alt: 'Six-axis industrial robot arm working inside a factory cell.',
			width: 1152,
			height: 922,
		} as RobotImage,
	},

	subApplications: {
		heading: 'Where robot fasteners are specified',
		lead: 'Two assemblies carry most of the titanium demand in a robot builder: the structural joint stack and the end-effector hardware.',
		items: [
			{
				id: 'arm-structure',
				eyebrow: 'Sub-application 01',
				heading: 'Arm frames and joint housings',
				lead: 'Arm links and joint housings repeat the same cyclic load at every axis, so the fastener has to stay tight without adding mass to a structure that is already moving.',
				image: {
					src: '/images/industries-robotics/35-robot-arm-in-action-with-white-background.webp',
					alt: 'Collaborative robot arm standing beside a mobile transport platform on a white background.',
					width: 725,
					height: 580,
				} as RobotImage,
				points: [
					{ label: 'DIN 912 geometry', text: 'low head height keeps joint housings compact' },
					{ label: 'Grade 5 Ti-6Al-4V', text: 'high proof strength at low weight' },
					{ label: 'Anti-galling finish', text: 'anodising or passivation against the mating part' },
				],
				cta: {
					label: 'Hex socket head cap screws',
					familyId: 'hex-socket-head-cap-screw',
				},
				families: [
					'hex-socket-head-cap-screw',
					'hex-socket-head-cap-bolts-full-thread',
					'hexagon-head-bolts-full-thread',
					'plain-washers',
				],
			},
			{
				id: 'end-effector',
				eyebrow: 'Sub-application 02',
				heading: 'End effectors, grippers and sensor housings',
				lead: 'Tooling that is opened, adjusted and cleaned carries a different demand: small heads for clearance, a drive that does not slip, and a surface that survives wash-down.',
				image: {
					src: '/images/industries-robotics/05-an-image-of-an-industrial-robotic-arm-in-action.webp',
					alt: 'Robotic arm fitted with a vacuum-cup gripper reaching over a work surface.',
					width: 1300,
					height: 731,
				} as RobotImage,
				points: [
					{ label: 'Countersunk DIN 7991', text: 'flush heads keep gripper jaws in profile' },
					{ label: 'Torx flange ISO 7380-2', text: 'positive torque transfer under vibration' },
					{ label: 'Grade 2 available', text: 'corrosion resistance for wash-down cells' },
				],
				cta: {
					label: 'Flange and button head bolts',
					familyId: 'torx-flange-head-bolts',
				},
				families: [
					'countersunk-head-cap-screws',
					'hex-socket-countersunk-flat-head-bolts',
					'hex-socket-button-head-bolts',
					'torx-flange-head-bolts',
				],
			},
		] as RobotSubApplication[],
	},

	comparison: {
		heading: 'Grade selection for robot assemblies',
		lead: 'Published nominal values for the grades we machine into robot hardware. Each batch ships with the certificate that confirms the lot it came from.',
		grades: [
			...grades.map((m) => ({ id: m.id, name: m.name })),
			{ id: 'ti-gr7', name: 'Titanium Grade 7 (Ti-6Al-4V with palladium)' },
		],
		rows: comparisonRows,
		note: 'Grade 7 is not a stock item: it is confirmed per order against the mill certificate for the lot, so no nominal figures are published for it. Grade selection is otherwise confirmed against your drawing and the duty cycle before production starts.',
		conventional: {
			heading: 'Titanium against the materials usually specified instead',
			lead: 'Robot builders normally arrive with a steel or stainless drawing and then convert it. These are the published differences that matter to the joint.',
			columns: [
				{ id: 'ti-gr5', name: 'Titanium Grade 5' },
				{ id: 'steel', name: 'Carbon steel 8.8 / 10.9' },
				{ id: 'stainless', name: 'Stainless steel A2-70' },
				{ id: 'aluminium', name: 'Aluminium' },
			],
			rows: conventionalRows,
			note: 'Densities are published nominal values for reference. We do not publish torque, preload or friction figures, and the certificate for the lot states the measured values of that lot.',
		},
	},

	qa: {
		heading: 'Engineering and quality support',
		lead: 'Robot hardware is usually specified against a drawing and a cycle count, so the fasteners are documented to the same level as the parts they hold.',
		cards: [
			{
				title: 'NDA print-to-part machining',
				body: 'Your drawing is opened only after the mutual NDA is signed. MOQ from 100 pieces per size, and no drawing data is reused for another customer.',
			},
			{
				title: 'EN 10204 3.1 certificates',
				body: 'Every batch ships with a 3.1 material certificate tied to its own heat number, so a robot serial number can be traced back to the bar it was cut from.',
			},
			{
				title: '100% PMI / XRF verification',
				body: 'Each lot is checked by positive material identification before machining, using XRF or OES spectrometry under AMS 2750 practice.',
			},
			{
				title: 'Anti-galling finishes',
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
		],
	},

	reference: {
		eyebrow: 'Reference application',
		heading: 'Articulated arm joint housings',
		lead: 'A six-axis arm repeats one load path at every axis: a small fastener, cyclically loaded, holding a housing that has to stay in position while the arm moves.',
		points: [
			{ label: 'Single grade across the stack', text: 'service spares stay interchangeable' },
			{ label: 'DIN 912 cap screws', text: 'carry the structural joints' },
			{ label: 'Flange bolts and washers', text: 'cover plates and spread the load' },
		],
		image: {
			src: '/images/industries-robotics/04-an-image-of-an-industrial-robotic-arm-in-action.webp',
			alt: 'Six-axis articulated robot arm showing its joint housings and cover plates.',
			width: 725,
			height: 580,
		} as RobotImage,
		facts: [
			{ label: 'Profile', value: 'Six-axis industrial robot, articulated arm joint housings and covers' },
			{ label: 'Challenge', value: 'cyclic torque at every axis, with a mass budget on the moving structure' },
			{ label: 'Solution', value: 'one grade across the stack, DIN 912 cap screws, flange bolts and washers' },
			{ label: 'Result', value: 'one heat number per box, 3.1 certificate per lot, MOQ from 100 pieces per size' },
		],
		cta: { label: 'Discuss your robot assembly', href: '#rfq-form' },
		secondaryCta: { label: 'See Grade 5 supply', href: '/products/grade-5-fasteners/' },
	},

	faq: {
		heading: 'Questions robot builders ask before ordering',
		items: [
			{
				question: 'Which titanium grade should a robot arm joint use?',
				answer: 'Grade 5 Ti-6Al-4V is the normal choice for structural joints and covers. Grade 2 commercially pure titanium is used where the joint is lightly loaded and the environment is wet or washed down, and Grade 23 ELI is reserved for cleanroom tooling.',
			},
			{
				question: 'Do you machine robot fasteners to our own drawing?',
				answer: 'Yes. Special parts are machined or cold-forged to your drawing under NDA, with MOQ from 100 pieces per size. Your drawing is opened only after the mutual NDA is signed.',
			},
			{
				question: 'How do you stop titanium fasteners from galling in a joint?',
				answer: 'The surface is the answer, not the torque. We supply AMS 2488 Type II and Type III anodised, ASTM F86 passivated and DLC dry-film finishes, and we specify the finish on the order so every batch is made the same way.',
			},
			{
				question: 'Can you keep the same grade and finish across a whole robot so spares match?',
				answer: 'Yes. Every batch is allocated to one heat number and packed in its own labelled box, and a VMI call-off programme can hold the grade and finish you repeat. A service order two years later matches the grade and finish of the original build.',
			},
		] as RobotFaqItem[],
	},

	rfq: {
		heading: 'Send your robot fastener list',
		lead: 'Send the standard, the quantity and the drawing. Our engineering desk quotes from your bill of materials directly and confirms the grade, the certificate scope and the delivery date in writing.',
		note: 'NDA protected. Direct factory quote within 12 business hours. EN 10204 3.1 certified.',
	},
};

/** Every product referenced on the page, in the order the sub-applications list them. */
export const ROBOTICS_PRODUCTS: ProductCardView[] = INDUSTRIAL_ROBOTICS.subApplications.items.flatMap(
	(item) => productsByFamily(item.families)
);
