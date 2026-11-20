/**
 * Special Parts & Custom Fasteners — shared types.
 *
 * POSITIONING (hard constraint)
 * ------------------------------
 * This page is NOT a catalogue and NOT a supplier directory. It is the print-to-part
 * route of a titanium source factory: the buyer holds a drawing, and we say how the
 * part is reviewed, machined, formed, finished, released and documented.
 *
 * We are a source factory, not a trading intermediary. No "supplier portfolio", no
 * "we match you with a manufacturer", no multi-vendor language anywhere.
 *
 * CONTENT RULES (hard constraints)
 * --------------------------------
 * 1. Titanium only. Grades are Grade 2, Grade 5 and Grade 23 (ELI) — no steel,
 *    brass or aluminium is offered on this page.
 * 2. No measured performance data. No torque coefficient K, no friction
 *    coefficient, no galling test figures, no invented batch lead times.
 * 3. Every internal href is a route that exists in src/pages/** (or a route built
 *    from a real filter option in @data/products).
 * 4. Surfaces are specified for galling, wear and assembly identification — never
 *    described as rust protection, because titanium does not rust.
 */

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

/** One image. Alt text describes geometry and process only — never an unverified material. */
export interface SpecialImage {
	src: string;
	alt: string;
}

/** One single-line technical takeaway, rendered as a bold bullet under the lead. */
export interface SpecialHighlight {
	/** Short technical term, rendered bold. */
	label: string;
	/** One-line qualifier. */
	text: string;
}

/** One card in a band's point row. */
export interface SpecialPoint {
	label: string;
	heading: string;
	body: string;
	/** A route that exists in src/pages/**. */
	href: string;
	/** 40×40 icon, optional. */
	icon?: string;
}

export interface SpecialFact {
	label: string;
	value: string;
}

/** One capability band (single 4:3 figure + text + point cards + facts). */
export interface SpecialBand {
	id: string;
	eyebrow: string;
	heading: string;
	/** Strictly ≤ 40 words — the text column must stay level against the figure. */
	lead: string;
	highlights: readonly SpecialHighlight[];
	/** Exactly one image in the media column — never a vertical stack. */
	images: readonly SpecialImage[];
	/** true = image on the right, text on the left. */
	reverse: boolean;
	points: readonly SpecialPoint[];
	facts: readonly SpecialFact[];
	cta: { label: string; href: string };
	secondaryCta?: { label: string; href: string };
}

/** One row of the forming-route matrix. */
export interface ProcessRow {
	/** Forming route. */
	process: string;
	/** Batch size the route suits. */
	batch: string;
	/** What the route is used for. */
	bestFor: string;
	/** The titanium-specific consideration. */
	titanium: string;
}

/** One gallery tile — physical proof, 4:3. */
export interface GalleryItem {
	src: string;
	alt: string;
	caption: string;
}

/** One of the two audiences at the bottom of the page. */
export interface AudienceColumn {
	heading: string;
	body: string;
	image: SpecialImage;
	points: readonly { label: string; value: string }[];
	cta: { label: string; href: string };
	secondary: { label: string; href: string };
}
