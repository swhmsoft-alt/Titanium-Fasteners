/**
 * Product Solutions — 1:1 data for `/global-en/product-solutions/`.
 *
 * MEASURED on the reference (1440×1000, 2026-11-09):
 *   hero       breadcrumb y=255 | label y=313 20px/28 #666
 *              h1        y=353  64px/70.4 #004975  (full width w=1285, NO image)
 *              lead      24px/38.4 #333
 *   article 1  y=604  h=865   H2 32px "Product Categories and Brands"
 *              grid y=660 w=1349 gap=32, 18 cols @ul → wide 11 / narrow 7
 *   article 2  y=1469 h=865   H2 32px "Coatings"
 *   article 3  y=2335 h=911   H2 44px "Buy Fasteners Online"  bg #f3f3f3
 *
 * Every string, link and image below was read off the reference DOM.
 */

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

/** A tile of the 2-up solution grid. `span` mirrors the reference's column span. */
export interface SolutionCard {
	href: string;
	image: string;
	alt: string;
	imageWidth: number;
	imageHeight: number;
	/** 'wide' = aspect-5/4 tile (11 of 18 columns), 'narrow' = aspect-3/4 tile (7 of 18). */
	span: 'wide' | 'narrow';
	title: string;
	description: string;
}

export interface EshopCallout {
	image: string;
	alt: string;
	imageWidth: number;
	imageHeight: number;
	label: string;
	heading: string;
	text: string;
	ctaLabel: string;
	ctaHref: string;
}

export const PRODUCT_SOLUTIONS = {
	seo: {
		title: 'Product Solutions',
		description:
			'From standard parts to premium brands, special coatings or custom fasteners – with more than 1 million different fastening elements in our portfolio, we have the right solution for you.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Bossard homepage', href: '/global-en/' },
			{ label: 'Product Solutions' },
		] as BreadcrumbItem[],
		eyebrow: 'Master Any Fastening Challenge',
		heading: 'Product Solutions',
		lead: 'From standard parts to premium brands, special coatings or custom fasteners – with more than 1 million different fastening elements in our portfolio, we have the right solution for you.',
	},
	cards: [
		{
			href: '/global-en/product-solutions/product-categories-and-brands/',
			image: '/images/product-solutions/01-woman-in-business-attire-holding-a-screw-in-her-.webp',
			alt: 'Woman in business attire holding a screw in her hand',
			imageWidth: 834,
			imageHeight: 667,
			span: 'wide',
			title: 'Product Categories and Brands',
			description:
				'No matter your fastening challenge, our comprehensive product portfolio offers solutions. Discover the diverse world of fastening elements and our premium brand partners.',
		},
		{
			href: '/global-en/product-solutions/special-parts-and-custom-fasteners/',
			image: '/images/product-solutions/02-two-people-discussing-design-of-a-fastener.webp',
			alt: 'Two people discussing design of a fastener.',
			imageWidth: 530,
			imageHeight: 707,
			span: 'narrow',
			title: 'Custom Fasteners',
			description:
				'You need non-standard fasteners that fulfil specific requirements? We match you with the right manufacturer from our worldwide supplier portfolio to get you exactly what you need.',
		},
		{
			href: '/global-en/product-solutions/components-specific-solutions/fastener-coatings/',
			image: '/images/product-solutions/03-different-screws-nuts-and-threaded-inserts-with-.webp',
			alt: 'Different screws, nuts, and threaded inserts with different types of coating solutions, such as functional coating patches, on a grey background',
			imageWidth: 530,
			imageHeight: 707,
			span: 'narrow',
			title: 'Coatings',
			description:
				'The right finish matters! Surface treatments for fasteners provide additional functionalities to improve your product. Discover the possibilities of fastener coatings.',
		},
		{
			href: '/global-en/product-solutions/innovations/',
			image: '/images/product-solutions/04-a-futuristic-drone-soaring-above-a-cityscape-sym.webp',
			alt: 'A futuristic drone soaring above a cityscape, symbolizing the advancement of drone delivery technology.',
			imageWidth: 834,
			imageHeight: 667,
			span: 'wide',
			title: 'Innovations',
			description:
				'Get a glimpse into the future and explore new and innovative fastening technologies. Or are you an inventor yourself? Together we make your idea come to life!',
		},
	],
	eshop: {
		image: '/images/product-solutions/05-hand-holding-screws.webp',
		alt: 'Hand holding screws',
		imageWidth: 960,
		imageHeight: 720,
		label: 'eShop',
		heading: 'Buy Fasteners Online',
		text: 'Browse our large assortment of fastening elements, find more product data and buy directly in our online shop.',
		ctaLabel: 'Buy Now',
		ctaHref: '/global-en/eshop/',
	},
};
