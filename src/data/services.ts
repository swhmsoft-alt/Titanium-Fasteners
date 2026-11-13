/**
 * Services — 1:1 data for `/global-en/services/`.
 *
 * MEASURED on the reference (1440×1000, 2026-11-10):
 *   hero        breadcrumb y=255 | label y=313 20px/28 #666
 *               h1 "Services" y=353 64px/70.4 #004975
 *   block 1     y= 604 h=865  H2 32px  "Inventory and C-Parts Management"
 *               grid 18 cols, gap 32 — wide card 812×753 (ul:col-span-11)
 *               + narrow card 505×673 (ul:col-span-7, md:my-40)
 *   block 2     y=1469 h=865  H2 32px  "Fastening Composites"
 *               same grid, order reversed (narrow first, wide second)
 *   block 3     y=2383 h=742  H2 44px  "Explore Your Benefits"
 *               grid 2 cols × 626.5px, gap 32, 5 benefit cards
 *               icon 202×202 (ul:w-[202px]) + text column w=401
 *   tail        h2 y=3193 44px "Explore Our Services in Our Interactive Blueprint"
 *               figure y=3478 1349×759 (16:9)
 *
 * Every string, link and image below was read off the reference DOM.
 */

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

export interface ServiceCard {
	href: string;
	image: string;
	imageAlt: string;
	/** Natural width/height of the source file — used for the img dimensions. */
	imageWidth: number;
	imageHeight: number;
	/** Rendered aspect ratio of the card image (5/4 wide, 3/4 narrow). */
	ratio: string;
	/** Card position inside the 18-column grid. */
	span: 'wide' | 'narrow';
	heading: string;
	body: string;
}

export interface Benefit {
	href: string;
	icon: string;
	iconAlt: string;
	label: string;
	heading: string;
	description: string;
}

export const SERVICES = {
	seo: {
		title: 'Bossard Services Overview | Bossard Group',
		description:
			'We support you every step of the way – from the product design process to finetuning c-parts management. Discover our service portfolio.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Bossard Group - Fasteners, Engineering, Logistics', href: '/global-en/' },
			{ label: 'Services' },
		] as BreadcrumbItem[],
		eyebrow: 'Elevate Your Production',
		heading: 'Services',
		lead: "We don't simply deliver fasteners – we support you holistically from the product design process to finetuning c-parts management. Benefit from our expertise and let us make you faster, leaner and more efficient.",
	},
	/** Block 1 — Smart Factory (wide card first, narrow card second). */
	smartFactory: [
		{
			href: '/global-en/services/smart-factory/inventory-management/',
			image: '/images/services/01-two-people-walk-through-the-shop-floor-the-woman.webp',
			imageAlt:
				'Two people walk through the shop floor, the woman holding a tablet in her hand, the man pointing to a mobile trolley equipped with SmartLabel Cloud bins.',
			imageWidth: 834,
			imageHeight: 667,
			ratio: '5/4',
			span: 'wide',
			heading: 'Inventory and C-Parts Management',
			body: 'Build a resilient supply chain with our smart inventory management services.',
		},
		{
			href: '/global-en/services/smart-factory/smart-assembly/',
			image: '/images/services/02-smart-factory-assembly-guy-with-tablet-in-his-ha.webp',
			imageAlt:
				'Smart Factory Assembly Guy with Tablet in his hands looking at the Dashboard with realt-time data',
			imageWidth: 530,
			imageHeight: 707,
			ratio: '3/4',
			span: 'narrow',
			heading: 'Smart Assembly',
			body: 'Accelerate your manufacturing digitalization with our Smart Factory Assembly solution.',
		},
	],
	/** Block 2 — Engineering (narrow card first, wide card second). */
	engineering: [
		{
			href: '/global-en/services/engineering/fastening-composites/',
			image: '/images/services/03-two-people-at-a-desk-in-a-modern-office-discuss-.webp',
			imageAlt:
				'Two people at a desk in a modern office discuss fastening a composite material; one holds a sandwich panel, the other a fastener.',
			imageWidth: 530,
			imageHeight: 707,
			ratio: '3/4',
			span: 'narrow',
			heading: 'Fastening Composites',
			body: 'Eliminate trial and error, get the right fastening solutions for your application, and build a resilient supply chain.',
		},
		{
			href: '/global-en/services/engineering/engineering-services/',
			image: '/images/services/04-people-around-a-table-discussing-a-technical-dra.webp',
			imageAlt:
				'People around a table discussing a technical drawing in an industrial looking office. ',
			imageWidth: 834,
			imageHeight: 667,
			ratio: '5/4',
			span: 'wide',
			heading: 'Engineering Services',
			body: 'Rooted in Swiss precision, we push the boundaries of productivity and quality in your products.',
		},
	],
	benefits: {
		heading: 'Explore Your Benefits',
		items: [
			{
				href: '/global-en/services/benefits/reduced-time-to-market/',
				icon: '/images/services/05-leadership-accelerator-icon.svg',
				iconAlt: 'Leadership accelerator icon',
				label: 'Benefit No. 1',
				heading: 'Reduce Time to Market',
				description:
					'Discover your crucial competitive advantage in a global environment where speed counts.',
			},
			{
				href: '/global-en/services/benefits/leaner-processes-and-automation/',
				icon: '/images/services/06-transparency-in-process-icon.svg',
				iconAlt: 'Transparency in process icon',
				label: 'Benefit No. 2',
				heading: 'Leaner Processes and Automation',
				description: 'Find out how to boost effectiveness and improve efficiency.',
			},
			{
				href: '/global-en/services/benefits/cost-saving-rationalization/',
				icon: '/images/services/07-costs-icon.svg',
				iconAlt: 'Costs icon',
				label: 'Benefit No. 3',
				heading: 'Cost-Saving Rationalization',
				description:
					'Saving time, money and resources helps you achieve higher margins. Find out how.',
			},
			{
				href: '/global-en/services/benefits/higher-quality-and-safety/',
				icon: '/images/services/08-increasing-product-quality-icon.svg',
				iconAlt: 'Increasing product quality icon',
				label: 'Benefit No. 4',
				heading: 'Higher Quality and Safety',
				description:
					'Explore absolute reliability in terms of product, processes, and production safety.',
			},
			{
				href: '/global-en/services/benefits/design-optimization-and-validation/',
				icon: '/images/services/09-solution-icon.svg',
				iconAlt: 'Solution icon',
				label: 'Benefit No. 5',
				heading: 'Design Optimization and Validation',
				description:
					'Uncover the potential of optimizing your design, manufacturing, and processes.',
			},
		] as Benefit[],
	},
	blueprint: {
		heading: 'Explore Our Services in Our Interactive Blueprint',
		body: 'Jump into our interactive shopfloor and discover the many different ways our services can optimize your workflows and support you. Click on different areas to find out more. All our services are scalable and cross-linkable, depending on your current needs.',
		image: '/images/services/10-factory-layout-with-labeled-zones-workers-and-a-.webp',
		imageAlt:
			"Factory layout with labeled zones, workers, and a blue 'Discover More' button in the center.",
		imageWidth: 1300,
		imageHeight: 731,
	},
};
