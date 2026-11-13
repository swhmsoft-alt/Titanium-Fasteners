/**
 * Fastener Coatings — 1:1 data for
 * `/global-en/product-solutions/components-specific-solutions/fastener-coatings/`.
 *
 * MEASURED on the reference (1440×1000, 2026-11-09):
 *   hero      img 643×514 (5:4) at x=745 | H1 64px/70.4 #004975 x=70
 *   intro     4 × container-fluid (3 filled + 1 empty), p 20px/32 #333
 *   article 1 y=1197 h=938  H2 44px "Different Types of Fastener Coatings"
 *              grid 18 cols @ul, wide 812 (5:4) + narrow 505 (3:4)
 *   article 2 y=2135 h=961  H2 44px "Corrosion Protection Coatings"  bg #fff
 *   article 3 y=3144 h=508  H2 44px "Learn More About Fastener Coatings"
 *              grid 2 cols × 2 rows, icon 202×202
 *
 * Every string, link and image below was read off the reference DOM.
 */

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

export interface SolutionCard {
	href: string;
	image: string;
	alt: string;
	imageWidth: number;
	imageHeight: number;
	title: string;
	description: string;
	span: 'wide' | 'narrow';
}

export interface Callout {
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

export interface WhitePaper {
	href: string;
	image: string;
	alt: string;
	title: string;
	description: string;
}

export const FASTENER_COATINGS = {
	seo: {
		title: 'Fastener Coatings',
		description:
			'Surface treatments for fasteners provide additional technical functionalities or improve the longevity of your product — discover the possibilities of fastener coatings.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Bossard homepage', href: '/global-en/' },
			{ label: '...' },
			{ label: 'Fastener Coatings' },
		] as BreadcrumbItem[],
		eyebrow: 'Components and Other Solutions',
		heading: 'Fastener Coatings',
		lead:
			'The right finish matters! Surface treatments for fasteners can provide additional technical functionalities or improve the longevity of your product. Discover the possibilities of fastener coatings.',
		image: '/images/fastener-coatings/01-an-overview-of-fastening-elements-with-different.webp',
		imageAlt:
			'An overview of fastening elements with different coating solutions, such as corrosion protection coatings, functional coatings, sealing coatings and more',
		imageWidth: 634,
		imageHeight: 507,
	},
	intro: [
		{ strong: 'Do you always need a coating for your fasteners?', text: '' },
		{
			strong: '',
			text: 'No. But in many cases, the right coating can offer significant benefits.',
		},
		{
			strong: '',
			text:
				'Coatings are a great way of adding additional functionalities – such as locking, securing, holding, or sealing properties – to your fastening elements. They also protect your fasteners against corrosion, making your products more secure and durable. Fastener coatings increase process reliability while lowering the total costs of fastening. There is a wide variety of coating solutions available for different application purposes.',
		},
		{ strong: '', text: '' },
	],

	types: {
		heading: 'Different Types of Fastener Coatings',
		cards: [
			{
				href: '/global-en/product-solutions/components-specific-solutions/fastener-coatings/functional-coatings/',
				image: '/images/fastener-coatings/02-different-types-of-screws-nuts-and-bolts-with-di.webp',
				alt: 'Different types of screws, nuts and bolts with different types of coating patches, sealing coatings and more.',
				imageWidth: 834,
				imageHeight: 667,
				title: 'Functional Coatings',
				description:
					'Functional coatings offer additional locking, securing, holding, or sealing functions for fastening elements.',
				span: 'wide',
			},
			{
				href: '/global-en/product-solutions/components-specific-solutions/fastener-coatings/tribological-dry-coatings/',
				image: '/images/fastener-coatings/03-a-grey-and-a-black-bolt-with-tribological-dry-co.webp',
				alt: 'A grey and a black bolt with tribological dry coating and a washer on light grey background',
				imageWidth: 530,
				imageHeight: 707,
				title: 'Tribological Dry Coatings',
				description:
					'These thin, non-electrolytically applied coatings provide lubrication as well as additional corrosion protection.',
				span: 'narrow',
			},
		] as SolutionCard[],
	},
	corrosion: {
		image: '/images/fastener-coatings/04-corrosion-protection-coating-image-screw-with-wa.webp',
		alt: 'Corrosion Protection Coating image, screw with water drops',
		imageWidth: 960,
		imageHeight: 720,
		label: 'Corrosion Protection',
		heading: 'Corrosion Protection Coatings',
		text: 'There are different surface treatments that can protect steel fasteners against corrosion. Discover the options.',
		ctaLabel: 'Read More',
		ctaHref:
			'/global-en/product-solutions/components-specific-solutions/fastener-coatings/corrosion-protection-coatings/',
	} as Callout,
	papers: {
		heading: 'Learn More About Fastener Coatings',
		label: 'White Paper',
		items: [
			{
				href: '/global-en/knowledge-hub/resources/download-center/white-papers/surface-finish-in-stainless-steel/',
				image: '/images/fastener-coatings/05-electroplating-zinc-flake-icon.webp',
				alt: 'electroplating zinc flake Icon',
				title: 'Why Surface Finish Is Important in Stainless Steel',
				description:
					'What you need to know about coatings for stainless steel fasteners and how you can prevent corrosion',
			},
			{
				href: '/global-en/knowledge-hub/resources/download-center/white-papers/selecting-a-fastener-finish/',
				image: '/images/fastener-coatings/06-fastener-finish-icon.webp',
				alt: 'fastener finish Icon',
				title: '7 Tips for Selecting Your Fastener Finish',
				description:
					'A pragmatic 7-step guide on the most important points to consider when choosing your fastener coatings',
			},
			{
				href: '/global-en/knowledge-hub/resources/download-center/white-papers/electroplating-and-zinc-flake-coatings-for-fasteners/',
				image: '/images/fastener-coatings/07-surface-finishing-icon.webp',
				alt: 'surface finishing Icon',
				title: 'Common Platings & Coatings and Their Performance',
				description:
					'An overview of the most common platings and coatings for fasteners and how they compare',
			},
			{
				href: '/global-en/knowledge-hub/resources/download-center/white-papers/appearance-of-coatings/',
				image: '/images/fastener-coatings/08-notion-of-appearance-in-coatings-icon.webp',
				alt: 'Notion of appearance in coatings icon',
				title: 'The Notion of Appearance in Fastener Coatings',
				description:
					'Looks matter. Learn about the aesthetics of fastener coatings, including color, shine, and surface quality',
			},
		] as WhitePaper[],
	},
};
