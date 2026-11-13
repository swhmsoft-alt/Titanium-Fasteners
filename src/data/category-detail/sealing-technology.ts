/**
 * src/data/category-detail/sealing-technology.ts
 *
 * 由 scripts/gen-category-detail.mjs 从参考站 HTML 生成 —— 禁止手改。
 * 参考：https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/sealing-technology/
 */

import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'sealing-technology',
	seo: { title: 'Sealing Technology Solutions | Bossard Group', description: 'Discover our world-leading solutions in sealing technology and flow control, including metal-to-metal sealing plugs, check valves, and countersinks.' },
	hero: {
		breadcrumb: [
			{ label: 'Bossard Group - Fasteners, Engineering, Logistics', href: '/global-en/' },
			{ label: 'Product Solutions', href: '/global-en/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/global-en/product-solutions/product-categories-and-brands/' },
			{ label: 'Sealing Technology' },
		],
		eyebrow: 'Product Categories',
		heading: 'Sealing Technology',
		lead: 'Rely on our market-leading solutions for efficient sealing in hydraulic and pneumatic applications. Discover the benefits of sealing plugs, check valves, and support tools.',
		image: '/images/category-detail-sealing-technology/01-an-overview-of-sealing-plugs-and-check-valves-on.webp',
		imageAlt: 'An overview of sealing plugs and check valves on a white background.',
		imageWidth: 634,
		imageHeight: 507,
		buttons: [
		],
	},
	intro: 'Sealing auxiliary holes and managing fluid flow in hydraulic and pneumatic applications is crucial. Thankfully, there are specialized solutions that help you achieve increased system reliability and efficiency, while also dealing with challenges such as:',
	video: { heading: 'Fluid Management and Sealing Technology: An Overview', thumbnail: 'https://img.youtube.com/vi/E82RKpQoDT0/maxresdefault.jpg', thumbnailAlt: 'PS | Categories and Brands | Fluid Management and Sealing Technology at Bossard', caption: 'Get an introduction into the world of fluid management solutions and sealing technology.' },
	richText: [
		{ kind: 'list', items: [
			{ lead: '', text: 'quick, reliable metal-to-metal sealing' },
			{ lead: '', text: 'flow control for drilled hole applications' },
		] },
		{ kind: 'heading', text: 'Solutions for Sealing Technology Challenges' },
		{ kind: 'paragraph', text: 'The manifold is the center of most hydraulic components. In hydraulic manifolds, all auxiliary holes need to be closed permanently and leakage-free. For this purpose, are the technology of choice. sealing plugs' },
		{ kind: 'paragraph', text: 'manage the flow direction of fluids in the manifold. They ensure that fluid can run freely one way, while preventing backflow which could damage the system. Check valves' },
		{ kind: 'paragraph', text: 'We offer engineering solutions, as well as standard and custom products for hydraulics and pneumatics. No matter your requirements, we will solve your sealing challenge with our competitive solutions. Our world-leading portfolio in hydraulic and pneumatic sealing technology includes the following brands:' },
	],
	brands: {
		heading: 'Our Sealing Technology Brands',
		tiles: [
			{
				href: '/global-en/product-solutions/product-categories-and-brands/sealing-technology/koenig-check-valve/',
				image: '/images/category-detail-sealing-technology/03-two-koenig-check-valves-expansion-restrictors-on.webp',
				alt: 'Two Koenig Check Valves expansion restrictors on a white background.',
				label: 'Check Valves',
				title: 'SFC KOENIG Check Valve®',
				description: 'A reliable solution to control flow directions in fluid systems. Leakage-free metal-to-metal sealing, even in high vibration environments.',
			},
			{
				href: '/global-en/product-solutions/product-categories-and-brands/sealing-technology/koenig-expander/',
				image: '/images/category-detail-sealing-technology/04-two-sfc-k-nig-sealing-plugs-on-white-background.webp',
				alt: 'Two SFC König Sealing Plugs on white background',
				label: 'Sealing Plugs',
				title: 'KOENIG EXPANDER®',
				description: 'Seal drill holes in fluid systems with this one-piece, easy-to-install solution. The original KOENIG EXPANDER® plugs.',
			},
		],
	},
	note: { text: 'The products listed here may not be available in all countries. In case of questions, please', linkLabel: 'contact us', linkHref: '/global-en/about-us/contact/', linkSuffix: '.' },
	services: {
		cards: [
			{
				href: '/global-en/eshop/c/03.400/',
				image: '/images/category-detail-sealing-technology/06-saved-cart-icon.svg',
				alt: ' Saved Cart Icon',
				label: 'eShop',
				title: 'Buy Sealing Technology',
				description: 'Browse our large assortment of sealing technology products and find the right solution for your fastening challenge.',
			},
			{
				href: '/global-en/product-solutions/product-categories-and-brands/',
				image: '/images/category-detail-sealing-technology/07-fasteners-icon.svg',
				alt: 'Fasteners icon',
				label: 'Product Categories',
				title: 'Discover More Fasteners',
				description: 'Find an overview of our product categories with brand partners, from Access Solutions to Welding Technology.',
			},
			{
				href: '/global-en/services/benefits/',
				image: '/images/category-detail-sealing-technology/08-proven-productivity-thumbs-up-icon-surrounded-by.svg',
				alt: 'Proven productivity - thumbs up icon surrounded by arrows',
				label: 'About Us',
				title: 'Proven Productivity',
				description: 'Learn more about how we enable our customers to develop solutions that are better, faster, and more efficient.',
			},
		],
	},
};
