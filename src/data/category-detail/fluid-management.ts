/**
 * src/data/category-detail/fluid-management.ts
 *
 * 由 scripts/gen-category-detail.mjs 从参考站 HTML 生成 —— 禁止手改。
 * 参考：https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/fluid-management/
 */

import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'fluid-management',
	seo: { title: 'Fluid Management Solutions | Bossard Group', description: 'Improve your industrial fluid management systems with pressure intensifiers and quick connectors for hydraulic and pneumatic solutions.' },
	hero: {
		breadcrumb: [
			{ label: 'Bossard Group - Fasteners, Engineering, Logistics', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Fluid Management' },
		],
		eyebrow: 'Product Categories',
		heading: 'Fluid Management Solutions',
		lead: 'We support you in handling pressure in hydraulic and pneumatic applications! Discover our fluid management solutions, including pressure intensifiers and quick connectors.',
		image: '/images/category-detail-fluid-management/01-pressure-intensifiers-and-quick-connectors-for-f.webp',
		imageAlt: 'Pressure intensifiers and quick connectors for fluid management',
		imageWidth: 634,
		imageHeight: 507,
		buttons: [
		],
	},
	intro: 'Fluid management solutions are crucial, especially in the agricultural, machinery, or manufacturing sectors. They ensure that hydraulic and pneumatic systems run reliably and efficiently.',
	video: { heading: 'Fluid Management and Sealing Technology: An Overview', thumbnail: 'https://img.youtube.com/vi/E82RKpQoDT0/maxresdefault.jpg', thumbnailAlt: 'PS | Categories and Brands | Fluid Management and Sealing Technology at Bossard', caption: 'Get an introduction into the world of fluid management solutions and sealing technology.' },
	richText: [
		{ kind: 'heading', text: 'Fluid Management: Challenges and How to Solve Them' },
		{ kind: 'paragraph', text: 'Typical challenges in industrial fluid management are pressure control and optimizing the testing process of hydraulic and pneumatic components. For these use cases, we provide specialized solutions:' },
		{ kind: 'paragraph', text: 'Pressure intensifiers allow you to generate very . The force is applied exactly where it is needed, while the hydraulic pressure load on the pipes and components is limited. In this way, pressure intensifiers allow other inlets and outlets to operate at low pressure, which is beneficial to the safety and longevity of components. high pressure precisely at the point of use' },
		{ kind: 'paragraph', text: 'We supply pressure intensifiers for low-pressure hydraulic systems, covering 12 intensification ratios up to 5,000 bar.' },
		{ kind: 'paragraph', text: 'Hydraulic and pneumatic components need to be tested. This is where quick connectors can save you a lot of time and money. They allow you to within seconds, thus optimizing the process and making you more efficient. connect the testing object' },
		{ kind: 'paragraph', text: 'Our portfolio of quick connectors is ideally suited for pressure testing and function testing (pneumatic, hydraulic, oil-hydraulic, or vacuum).' },
		{ kind: 'paragraph', text: 'Are you dealing with non-standard requirements? We also support you with custom products for hydraulic and pneumatic applications. In addition, our innovative tools and machines can also be integrated into automated serial production workflows.' },
		{ kind: 'paragraph', text: 'We supply branded hydraulic and pneumatic products, including the following:' },
		{ kind: 'list', items: [
			{ lead: '', text: '' },
			{ lead: 'WEH®', text: '' },
		] },
	],
	brands: {
		heading: '',
		tiles: [
		],
	},
	note: { text: 'The products listed here may not be available in all countries. In case of questions, please', linkLabel: 'contact us', linkHref: '/contact/', linkSuffix: '.' },
	services: {
		cards: [
			{
				href: '/knowledge-hub/resources/download-center/white-papers/',
				image: '/images/category-detail-fluid-management/03-factsheet-icon.svg',
				alt: 'Factsheet icon',
				label: 'Fastening Know-How',
				title: 'White Papers',
				description: 'Learn more about topics such as friction in screw connections or corrosion and overcome challenges in fastening with our expert white papers.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/',
				image: '/images/category-detail-fluid-management/04-fasteners-icon.svg',
				alt: 'Fasteners icon',
				label: 'Product Categories',
				title: 'Discover More Fasteners',
				description: 'Find an overview of our product categories with brand partners, from Access Solutions to Welding Technology.',
			},
			{
				href: '/services/benefits/',
				image: '/images/category-detail-fluid-management/05-proven-productivity-thumbs-up-icon-surrounded-by.svg',
				alt: 'Proven productivity - thumbs up icon surrounded by arrows',
				label: 'About Us',
				title: 'Proven Productivity',
				description: 'Learn more about how we enable our customers to develop solutions that are better, faster, and more efficient.',
			},
		],
	},
};
