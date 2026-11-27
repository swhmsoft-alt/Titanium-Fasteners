/**
 * Fastener Coatings — routes.
 *
 * Every path is imported from the `/product-solutions/` route table, which is
 * itself built from routes that exist in src/pages/**. Nothing here is
 * hand-typed, so a link on this page cannot die without the shared table
 * changing first.
 */
import { PATHS } from '@data/product-solutions';

export const ROUTES = {
	...PATHS,
	/** This page, for the breadcrumb and the self-referencing exit link. */
	coatings: '/product-solutions/components-specific-solutions/fastener-coatings/',
	/** The section-finishing service page. */
	finishing: PATHS.finishing,
	/** Neutral OEM packaging specification on the Knowledge Hub. */
	packagingSpec: '/knowledge-hub/packaging/neutral-oem-packaging-specs/',
} as const;
