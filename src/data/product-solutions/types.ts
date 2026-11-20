/**
 * Product Solutions — shared types.
 *
 * POSITIONING (hard constraint)
 * -----------------------------
 * The product-solutions page is NOT a catalogue and NOT a brand directory.
 * The standard-parts catalogue lists parts by specification number. This
 * page explains the SUPPLY AND ENGINEERING PATH: standard coverage,
 * drawing-based custom parts, and the surface engineering that stops titanium
 * fasteners from galling.
 *
 * We are a source factory, not a trading intermediary. No "supplier network",
 * no "brand partners", no "we match you with a manufacturer" anywhere.
 *
 * CONTENT RULES (hard constraints)
 * --------------------------------
 * 1. No generic titanium explainers ("what is titanium", "why titanium is
 *    light"). Every line states a capability, a document or a route.
 * 2. No measured performance data. No torque coefficient K, no friction
 *    coefficient, no galling test figures. Material numbers come from
 *    @data/products and are labelled as published nominal values.
 * 3. Every internal href is a route that exists in src/pages/**, or a deep
 *    link built from a real filter option in @data/products.
 * 4. Surface finishes are described as titanium solutions (galling, wear,
 *    identification) — never as rust protection.
 */

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

export interface SolutionImage {
	src: string;
	alt: string;
}

/** One card in a band's point row. */
export interface SolutionPoint {
	label: string;
	heading: string;
	body: string;
	/** A route that exists in src/pages/**. */
	href: string;
	/** 40×40 icon, optional. */
	icon?: string;
}

export interface SolutionFact {
	label: string;
	value: string;
}

/**
 * One single-line technical takeaway shown as a bold bullet in the text column.
 * `label` is the short technical term, `text` the one-line qualifier.
 */
export interface SolutionHighlight {
	label: string;
	text: string;
}

/** One solution band (figure + text + point cards + facts). */
export interface SolutionBand {
	id: string;
	eyebrow: string;
	heading: string;
	lead: string;
	/** Optional prose paragraphs — kept empty on compact bands. */
	body: string[];
	/**
	 * Bold, single-line technical takeaways rendered as a bullet list under the
	 * lead. Compact bands use these instead of `body` paragraphs.
	 */
	highlights?: SolutionHighlight[];
	/** 1–2 images in the media column. */
	images: SolutionImage[];
	/** true = image on the right, text on the left. */
	reverse: boolean;
	points: SolutionPoint[];
	facts: SolutionFact[];
	cta: { label: string; href: string };
	secondaryCta?: { label: string; href: string };
}

/** One of the two audiences at the bottom of the page. */
export interface AudienceColumn {
	heading: string;
	body: string;
	image: SolutionImage;
	points: { label: string; value: string }[];
	cta: { label: string; href: string };
	secondary: { label: string; href: string };
}

/** A DIN ↔ ISO row, taken from the standards dictionary. */
export interface CrossReferenceRow {
	standard: string;
	iso: string;
	title: string;
	href: string;
}

/** A grade row — published nominal values, never measured lot values. */
export interface GradeRow {
	name: string;
	proof: string;
	tensile: string;
	maxTemp: string;
	note: string;
	href: string;
}
