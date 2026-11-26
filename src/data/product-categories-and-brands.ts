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
			'Titanium fasteners organised by the job they do — direct assembly, anti-loosening joints, thin-sheet and composite assembly, welded structures, bonded joints, electrical housings, service access, fluid management and sealing.',
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
			'Twelve ways a titanium fastener gets used. Each solution page sets out the grade, the finish and the fastener we would run for that joint — from direct assembly and anti-loosening to thin sheet, bonded structures, electrical housings and service access.',
		image:
			'/images/product-categories-and-brands/01-woman-in-business-attire-holding-a-screw-in-her-.webp',
		imageAlt: 'Woman in business attire holding a screw in her hand',
		imageWidth: 634,
		imageHeight: 507,
	},
	intro:
		'We are a titanium fastener factory, so every solution page below is written around the part we actually make: the bolt, the stud, the nut, the washer and the special part machined to your drawing. Where a job needs something we do not make — a rivet, a clinching element, a quick-release captive fastener — we say so on the page and tell you what the titanium in the joint has to do instead.',
	categories: {
		heading: 'Discover Our Product Categories',
		label: 'Products and Brands',
		tiles: [
			{
				href: '/product-solutions/product-categories-and-brands/direct-assembly-screws/',
				image:
					'/images/product-categories-and-brands/02-different-types-of-direct-assembly-screws-on-a-w.webp',
				alt: 'Range of titanium direct assembly screws — socket head cap, countersunk and hex head types.',
				label: 'Product Solutions',
				title: 'Titanium Direct Assembly',
				description:
					'Titanium screws that go straight into sheet, aluminium or composite — grade and finish chosen against the base material',
			},
			{
				href: '/product-solutions/product-categories-and-brands/securing-and-anti-loosening-elements/',
				image:
					'/images/product-categories-and-brands/03-different-types-of-securing-and-anti-loosening-e.webp',
				alt: 'Titanium securing and anti-loosening elements — nyloc nuts, plain and split-lock washers and retaining rings.',
				label: 'Product Solutions',
				title: 'Titanium Anti-Loosening Joints',
				description:
					'Bolts, nuts and washers for joints under vibration — controlled preload, and anti-galling finishes',
			},
			{
				href: '/product-solutions/product-categories-and-brands/clinching-technology/',
				image:
					'/images/product-categories-and-brands/04-different-types-of-self-clinching-fasteners-incl.webp',
				alt: 'Titanium self-clinching fasteners — clinching studs, clinching nuts and flush-head types.',
				label: 'Product Solutions',
				title: 'Titanium Thin-Sheet Assembly',
				description:
					'Fasteners for thin sheet, aluminium and composite panels where the sheet cannot hold a thread',
			},
			{
				href: '/product-solutions/product-categories-and-brands/rivet-technology/',
				image:
					'/images/product-categories-and-brands/05-an-overview-of-different-types-of-rivets-blind-r.webp',
				alt: 'Overview of titanium rivets — solid rivets, blind rivets and tubular rivet pins.',
				label: 'Product Solutions',
				title: 'Titanium Permanent and Riveted Joints',
				description:
					'The titanium fastener that carries a permanent sheet joint, and the serviceable alternative to welding',
			},
			{
				href: '/product-solutions/product-categories-and-brands/threaded-inserts/',
				image:
					'/images/product-categories-and-brands/06-different-types-of-threaded-inserts-including-br.webp',
				alt: 'Different types of titanium threaded inserts — brass, steel and press-in inserts for light alloys.',
				label: 'Product Solutions',
				title: 'Titanium Threaded Inserts',
				description:
					'Studs, screws and machined inserts for light metals and composites that need a reusable thread',
			},
			{
				href: '/product-solutions/product-categories-and-brands/clip-fasteners/',
				image:
					'/images/product-categories-and-brands/07-six-different-types-of-clip-fasteners-on-a-white.webp',
				alt: 'Six different types of titanium clip fasteners for cable, hose and panel retention.',
				label: 'Product Solutions',
				title: 'Titanium Clip and Retention',
				description:
					'Fasteners for quick-release panel, cable and hose retention in marine and process service',
			},
			{
				href: '/product-solutions/product-categories-and-brands/welding-technology/',
				image:
					'/images/product-categories-and-brands/08-various-fastening-elements-for-stud-welding-and-.webp',
				alt: 'Fastening elements for stud welding — welding shields, collet holders and welding accessories.',
				label: 'Product Solutions',
				title: 'Titanium Welded Structures',
				description:
					'The fastener that works alongside a weld — including the high-temperature Grade 9 for hot-side service',
			},
			{
				href: '/product-solutions/product-categories-and-brands/embedding-and-surface-bonding-fasteners/',
				image:
					'/images/product-categories-and-brands/09-six-different-types-of-embedding-and-surface-bon.webp',
				alt: 'Six different types of titanium embedding and surface bonding fasteners — anchors and studs.',
				label: 'Product Solutions',
				title: 'Titanium Bonded and Embedded Joints',
				description:
					'Anchors, studs and washers for structural adhesive joints, without a galvanic couple in the panel',
			},
			{
				href: '/product-solutions/product-categories-and-brands/electrical-products/',
				image:
					'/images/product-categories-and-brands/10-an-overview-of-fastening-elements-for-electrical.webp',
				alt: 'An overview of fastening elements for electrical housings, glands and enclosures.',
				label: 'Product Solutions',
				title: 'Titanium Electrical Assemblies',
				description:
					'Non-magnetic fasteners for enclosures, heat sinks, sensors and hazardous areas',
			},
			{
				href: '/product-solutions/product-categories-and-brands/access-solutions/',
				image:
					'/images/product-categories-and-brands/11-various-access-locking-and-control-elements-such.webp',
				alt: 'Various titanium access locking and control elements — clips, brackets and quick-release latches.',
				label: 'Product Solutions',
				title: 'Titanium Service Access',
				description:
					'Fasteners and machined hardware for access panels opened and closed again on a service schedule',
			},
			{
				href: '/product-solutions/product-categories-and-brands/fluid-management/',
				image:
					'/images/product-categories-and-brands/12-pressure-intensifiers-and-quick-connectors-for-f.webp',
				alt: 'Titanium pressure intensifiers and quick connectors for hydrogen and fluid media service.',
				label: 'Product Solutions',
				title: 'Titanium Fluid Management',
				description:
					'Titanium fasteners for hydrogen, cryogenic, oxygen, hydraulic and seawater service',
			},
			{
				href: '/product-solutions/product-categories-and-brands/sealing-technology/',
				image:
					'/images/product-categories-and-brands/13-an-overview-of-sealing-plugs-and-check-valves-on.webp',
				alt: 'An overview of titanium sealing plugs and check valves for sealed fluid joints.',
				label: 'Product Solutions',
				title: 'Titanium Sealing Technology',
				description:
					'Titanium fasteners, washers and flange bolts that keep a sealed joint free of corrosion',
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
