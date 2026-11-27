/**
 * Fastener Coatings — shared types.
 *
 * POSITIONING (hard constraint)
 * ------------------------------
 * This page is the titanium surface-finishing capability of a source factory:
 * the buyer holds a part, a drawing or a purchase order, and we say which
 * finish state the part leaves our workshop in, under which standard, and
 * with which documentation.
 *
 * CONTENT RULES (hard constraints)
 * --------------------------------
 * 1. Titanium only. Grades are Grade 2, Grade 5 and Grade 23 (ELI) — Grade 7
 *    is "confirmed per order" and never carries published values.
 * 2. The surface is specified for galling, wear, cleanliness and assembly
 *    identification — never as rust protection, because titanium does not
 *    rust.
 * 3. No measured performance data. No torque coefficient, no friction
 *    coefficient, no galling test figures, no coating thicknesses that the
 *    workshop has not confirmed against the drawing.
 * 4. Every internal href is a route that exists in src/pages/**.
 */

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

/** One image. Alt text describes geometry and process only. */
export interface CoatingsImage {
	src: string;
	alt: string;
}

/** One of the four core titanium surface states (module B). */
export interface FinishCard {
	/** Stable id — also the RFQ checkbox value. */
	id: string;
	name: string;
	/** Governing standard or in-house specification. */
	standard: string;
	/** One-line purpose statement. */
	summary: string;
	/** Short single-line points, rendered as bullets under the summary. */
	points: readonly string[];
	image: CoatingsImage;
	/** CTA label — the button selects this finish in the RFQ form. */
	ctaLabel: string;
}

/** One filter chip above the comparison matrix. */
export interface MatrixFilter {
	id: string;
	label: string;
}

/** One row of the engineering comparison matrix. */
export interface MatrixRow {
	id: string;
	finish: string;
	standard: string;
	thickness: string;
	threadImpact: string;
	purpose: string;
	/** Filter ids this row belongs to. */
	tags: readonly string[];
}

/** One FAQ item — the same strings feed the <details> panel and FAQPage. */
export interface FaqItem {
	question: string;
	answer: string;
}

/** One selectable finish in the RFQ form. */
export interface RfqFinishOption {
	id: string;
	label: string;
}

/** One selectable titanium grade in the RFQ form. */
export interface RfqGradeOption {
	id: string;
	label: string;
}

/** One related resource link in the bottom link row. */
export interface RelatedLink {
	label: string;
	href: string;
	description: string;
}
