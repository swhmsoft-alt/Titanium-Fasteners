/**
 * Special Parts & Custom Fasteners — real routes.
 *
 * The base list is imported from the `/product-solutions/` route table, which is
 * already validated against the pages that exist in src/pages/**. Re-using it
 * means this page can never introduce a dead link: every path below resolves to
 * a page that is really built.
 */
import { PATHS } from '@data/product-solutions';

export const ROUTES = {
	...PATHS,
	/** The surface-finishing page on this site. */
	coatings: '/product-solutions/components-specific-solutions/fastener-coatings/',
	/** This page, for the breadcrumb and the self-referencing exit link. */
	specialParts: '/product-solutions/special-parts-and-custom-fasteners/',
} as const;
