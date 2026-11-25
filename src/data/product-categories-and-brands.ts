/**
 * Product Categories and Brands — 1:1 data for
 * `/product-solutions/product-categories-and-brands/`.
 *
 * MEASURED on the reference (1440×1000, 2026-11-09):
 *   hero          img 643×514 (5:4) at x=745 | H1 64px/70.4 #004975 x=70
 *   article 1     y=993  h=1444  H2 44px  "Discover Our Product Categories"
 *                 grid 2 cols × 6 rows, row-gap 32, tile 202×202 + text 401
 *   article 2     y=2485 h=446   H2 21.008px "Buy Fastening Elements"
 *                 grid 3 cols, card 428.33 wide, icon 48×48
 *
 * Every string, link and image below was read off the reference DOM.
 */

export interface CategoryTile {
	href: string;
	image: string;
	alt: string;
	/** Overline above the title — the reference uses the same label on every tile. */
	label: string;
	title: string;
	description: string;
}

export interface ServiceCard {
	href: string;
	image: string;
	alt: string;
	label: string;
	title: string;
	description: string;
}

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

export const PRODUCT_CATEGORIES_AND_BRANDS = {
	seo: {
		title: 'Product Categories and Brands',
		description:
			'Discover the diverse world of fastening elements and brands — rivets, thread inserts, self-clinching fasteners, access solutions and much more.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands' },
		] as BreadcrumbItem[],
		eyebrow: 'Product Solutions',
		heading: 'Product Categories and Brands',
		lead:
			'No matter your fastening challenge, our comprehensive product portfolio offers solutions. Discover the diverse world of fastening elements and brands, including rivets, thread inserts, self-clinching fasteners, access solutions and much more.',
		image:
			'/images/product-categories-and-brands/01-woman-in-business-attire-holding-a-screw-in-her-.webp',
		imageAlt: 'Woman in business attire holding a screw in her hand',
		imageWidth: 634,
		imageHeight: 507,
	},
	intro:
		'We work with trusted brand partners from all over the world to provide you with the best fit for your fastening application. In addition to our branded products, we also offer a wide range of standard parts (ISO/DIN).',
	categories: {
		heading: 'Discover Our Product Categories',
		label: 'Products and Brands',
		tiles: [
			{
				href: '/product-solutions/product-categories-and-brands/direct-assembly-screws/',
				image: '/images/product-categories-and-brands/02-different-types-of-direct-assembly-screws-on-a-w.webp',
				alt: 'Different types of direct assembly screws on a white background.',
				label: 'Products and Brands',
				title: 'Direct Assembly Screws',
				description:
					'Ensure fast, efficient assembly for durable connections between all materials',
			},
			{
				href: '/product-solutions/product-categories-and-brands/securing-and-anti-loosening-elements/',
				image: '/images/product-categories-and-brands/03-different-types-of-securing-and-anti-loosening-e.webp',
				alt: 'Different types of securing and anti-loosening elements for fastening',
				label: 'Products and Brands',
				title: 'Securing and Anti-Loosening Elements',
				description: 'Self-locking fasteners to prevent loosening and loss',
			},
			{
				href: '/product-solutions/product-categories-and-brands/clinching-technology/',
				image: '/images/product-categories-and-brands/04-different-types-of-self-clinching-fasteners-incl.webp',
				alt: 'Different types of self-clinching fasteners, including nuts, studs and standoffs',
				label: 'Products and Brands',
				title: 'Clinching Technology',
				description:
					'Fasteners for strong permanent threads and mounting points in thin sheet metal, PCBs, and other materials',
			},
			{
				href: '/product-solutions/product-categories-and-brands/rivet-technology/',
				image: '/images/product-categories-and-brands/05-an-overview-of-different-types-of-rivets-blind-r.webp',
				alt: 'An overview of different types of rivets, blind rivet nuts and lockbolts.',
				label: 'Products and Brands',
				title: 'Rivet Technology',
				description:
					'Riveting solutions, tools, systems, and engineering support from lightweight to high-strength applications',
			},
			{
				href: '/product-solutions/product-categories-and-brands/threaded-inserts/',
				image: '/images/product-categories-and-brands/06-different-types-of-threaded-inserts-including-br.webp',
				alt: 'Different types of threaded inserts, including brass inserts, wire thread inserts and key-locking inserts.',
				label: 'Products and Brands',
				title: 'Threaded Inserts',
				description:
					'Create strong threads in weak materials such as light metals and plastics',
			},
			{
				href: '/product-solutions/product-categories-and-brands/clip-fasteners/',
				image:
					'/images/product-categories-and-brands/07-six-different-types-of-clip-fasteners-on-a-white.webp',
				alt: 'Six different types of clip fasteners on a white background.',
				label: 'Products and Brands',
				title: 'Clip Fasteners',
				description:
					'Quick-release fasteners for time-sensitive connections, replacements, and holding, fixing, and securing',
			},
			{
				href: '/product-solutions/product-categories-and-brands/welding-technology/',
				image:
					'/images/product-categories-and-brands/08-various-fastening-elements-for-stud-welding-and-.webp',
				alt: 'Various fastening elements for stud welding and ultrasonic welding',
				label: 'Products and Brands',
				title: 'Welding Technology',
				description:
					'Strong, permanent fastening connections with welding studs, machines, and related tools',
			},
			{
				href: '/product-solutions/product-categories-and-brands/embedding-and-surface-bonding-fasteners/',
				image:
					'/images/product-categories-and-brands/09-six-different-types-of-embedding-and-surface-bon.webp',
				alt: 'Six different types of embedding and surface bonding fasteners on a white bakcground.',
				label: 'Products and Brands',
				title: 'Embedding and Surface Bonding Fasteners',
				description:
					'The solution for lightweight, multi-material, and composite applications',
			},
			{
				href: '/product-solutions/product-categories-and-brands/electrical-products/',
				image:
					'/images/product-categories-and-brands/10-an-overview-of-fastening-elements-for-electrical.webp',
				alt: 'An overview of fastening elements for electrical applications',
				label: 'Products and Brands',
				title: 'Electrical Products',
				description:
					'Cable entry and cable connection technology as well as cable mounting and cable protection',
			},
			{
				href: '/product-solutions/product-categories-and-brands/access-solutions/',
				image:
					'/images/product-categories-and-brands/11-various-access-locking-and-control-elements-such.webp',
				alt: 'Various access, locking and control elements, such as handles, latches, hinges and more.',
				label: 'Products and Brands',
				title: 'Access, Locking and Control Solutions',
				description:
					'Access and locking solutions, hinges, and various standard machine elements',
			},
			{
				href: '/product-solutions/product-categories-and-brands/fluid-management/',
				image:
					'/images/product-categories-and-brands/12-pressure-intensifiers-and-quick-connectors-for-f.webp',
				alt: 'Pressure intensifiers and quick connectors for fluid management',
				label: 'Products and Brands',
				title: 'Fluid Management',
				description:
					'Pressure intensifiers and quick connectors for hydraulic and pneumatic applications',
			},
			{
				href: '/product-solutions/product-categories-and-brands/sealing-technology/',
				image:
					'/images/product-categories-and-brands/13-an-overview-of-sealing-plugs-and-check-valves-on.webp',
				alt: 'An overview of sealing plugs and check valves on a white background.',
				label: 'Products and Brands',
				title: 'Sealing Technology',
				description:
					'Reliable hydraulic and pneumatic sealing plugs, check valves, and related tools',
			},
		],
	},
	services: [
		{
			href: '/products/',
			image: '/images/product-categories-and-brands/14-saved-cart-icon.svg',
			alt: 'Saved Cart Icon',
			label: 'Product Catalogue',
			title: 'Buy Fastening Elements',
			description: 'You already know what product you need? Get it directly in our product catalogue.',
		},
		{
			href: '/product-solutions/components-specific-solutions/fastener-coatings/',
			image:
				'/images/product-categories-and-brands/15-selection-of-material-and-coatings-for-corrosion.svg',
			alt: 'Selection of material and coatings for corrosion protection Calculator Icon',
			label: 'Surface Treatments',
			title: 'Fastener Coatings',
			description:
				'We offer various fastener surface treatments, such as functional coatings, tribological dry coatings, and corrosion protection coatings.',
		},
		{
			href: '/product-solutions/special-parts-and-custom-fasteners/',
			image: '/images/product-categories-and-brands/16-fasteners-icon.svg',
			alt: 'Fasteners icon',
			label: 'Special Parts',
			title: 'Custom Fasteners',
			description:
				'Have non-standard requirements? We also supply you with customized parts, such as turned and milled parts, formed parts, or punched and bent parts.',
		},
	],
};
