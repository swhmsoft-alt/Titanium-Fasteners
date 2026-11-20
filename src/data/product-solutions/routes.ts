/**
 * Product Solutions — real routes and deep-link helpers.
 *
 * Every path below is a route that exists in src/pages/**. Deep links into
 * the catalogue are built from the filter options that really exist in
 * @data/products, so `?standard=` and `?material=` can never degrade to an
 * empty filter.
 */
import { FILTER_GROUPS, MATERIALS, STANDARDS } from '@data/products';
import { gradeLandingPath } from '@data/grade-paths';
import type { CrossReferenceRow, GradeRow } from './types';

/** Real routes referenced by this page. */
export const PATHS = {
	home: '/',
	products: '/products/',
	contact: '/contact/',
	services: '/services/',
	gradeMatrix: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
	estimator: '/knowledge-hub/tools/steel-to-titanium-weight-estimator/',
	nda: '/knowledge-hub/ip-protection/nda-ip-protection-policy/',
	standards: '/services/manufacturing-capabilities/production-per-international-standards/',
	cnc: '/services/manufacturing-capabilities/cnc-machining-to-customer-drawings/',
	forging: '/services/manufacturing-capabilities/cold-heading-hot-forging/',
	finishing: '/services/manufacturing-capabilities/surface-finishing-color-coding/',
	mtc: '/services/compliance-packaging/en-10204-31-mtc-traceability/',
	pmi: '/services/compliance-packaging/pmi-xrf-grade-verification/',
	packaging: '/services/compliance-packaging/distributor-labeling-packaging/',
	blanket: '/services/order-fulfillment/blanket-orders-scheduled-delivery/',
	prototyping: '/services/order-fulfillment/fast-prototyping-low-moq/',
	aboutFactory: '/about-us/factory/',
	aboutQuality: '/about-us/quality/',
	aboutService: '/about-us/service/',
	aboutCnc: '/about-us/factory/cnc-machining-and-special-parts/',
	aboutPmi: '/about-us/quality/pmi-and-xrf-verification/',
	aboutInspection: '/about-us/quality/inspection-and-test-reports/',
	aboutTechnical: '/about-us/service/technical-support-and-consultation/',
} as const;

/** Only standard ids that really exist as a checkable filter option. */
const STANDARD_OPTION_IDS = new Set(
	(FILTER_GROUPS.find((g) => g.id === 'standard')?.options ?? []).map((o) => o.id),
);

/** Only material ids that really exist as a checkable filter option. */
const MATERIAL_OPTION_IDS = new Set(
	(FILTER_GROUPS.find((g) => g.id === 'material')?.options ?? []).map((o) => o.id),
);

/** A standard deep link — falls back to the catalogue when the id is absent. */
export const standardHref = (id: string): string =>
	STANDARD_OPTION_IDS.has(id) ? `${PATHS.products}?standard=${id}` : PATHS.products;

/**
 * A grade landing link.
 *
 *   ① grade with its own landing page (Grade 2 / Grade 5) → that page
 *   ② grade that is a real filter option              → ?material= deep link
 *   ③ anything else                                    → the grade supply matrix
 *
 * Keeps the same single source of truth as the main navigation
 * (@data/grade-paths), so a grade never gets two different destinations.
 */
export const materialHref = (id: string): string =>
	gradeLandingPath(id) ??
	(MATERIAL_OPTION_IDS.has(id) ? `${PATHS.products}?material=${id}` : PATHS.gradeMatrix);

/** DIN ↔ ISO cross-reference, taken from the standards dictionary. */
export const CROSS_REFERENCE: CrossReferenceRow[] = STANDARDS.filter(
	(s) => s.din !== '' && s.iso !== '' && STANDARD_OPTION_IDS.has(s.id),
)
	.slice(0, 8)
	.map((s) => ({
		standard: s.din,
		iso: s.iso,
		title: s.title,
		href: standardHref(s.id),
	}));

/** Grade comparison rows — published nominal values, never measured lot values. */
export const GRADES: GradeRow[] = MATERIALS.map((m) => ({
	name: m.name,
	proof: `${m.proof_strength_mpa} MPa`,
	tensile: `${m.tensile_mpa} MPa`,
	maxTemp: `${m.max_temp_c} °C`,
	note: m.notes ?? '',
	href: materialHref(m.id),
}));
