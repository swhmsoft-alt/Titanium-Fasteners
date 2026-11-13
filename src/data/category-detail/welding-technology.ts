/**
 * src/data/category-detail/welding-technology.ts
 *
 * 由 scripts/gen-category-detail.mjs 从参考站 HTML 生成 —— 禁止手改。
 * 参考：https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/welding-technology/
 */

import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'welding-technology',
	seo: { title: 'Welding Technology Overview | Bossard Group', description: 'Discover the technique that creates strong, permanent fastening connections: from classic stud welding to innovative ultrasonic welding.' },
	hero: {
		breadcrumb: [
			{ label: 'Bossard Group - Fasteners, Engineering, Logistics', href: '/global-en/' },
			{ label: 'Product Solutions', href: '/global-en/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/global-en/product-solutions/product-categories-and-brands/' },
			{ label: 'Welding Technology' },
		],
		eyebrow: 'Product Categories',
		heading: 'Welding Technology',
		lead: 'Looking for a strong and permanent fastening connection? Welding could be your solution. From classic stud welding to innovative options for composite and lightweight materials, we have the right technology for you.',
		image: '/images/category-detail-welding-technology/01-various-fastening-elements-for-stud-welding-and-.webp',
		imageAlt: 'Various fastening elements for stud welding and ultrasonic welding',
		imageWidth: 634,
		imageHeight: 507,
		buttons: [
		],
	},
	intro: 'Welding technology in a broad sense comprises all processes in which a solid material is melted and bonds with a second component during subsequent hardening. Usually this involves a compound, like in welding metals.',
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{ kind: 'heading', text: 'What Is Welding?' },
		{ kind: 'paragraph', text: 'In some modern welding processes, only one of the two components is melted, for example, by means of ultrasound. The resulting deformation creates a positive connection with the second component.' },
	],
	brands: {
		heading: 'Meet Our Welding Technology Brands',
		tiles: [
			{
				href: '/global-en/product-solutions/product-categories-and-brands/welding-technology/fasteks-welko/',
				image: '/images/category-detail-welding-technology/05-overview-of-fasteks-welko-stud-welding-fasteners.webp',
				alt: 'Overview of FASTEKS Welko stud welding fasteners, including welding studs, welding bushes and welding pins.',
				label: 'Stud Welding Systems',
				title: 'FASTEKS® WELKO',
				description: 'This capacitor discharge stud welding solution offers weld studs, bushes, pins, and other fasteners, as well as stud welding machines.',
			},
			{
				href: '/global-en/product-solutions/product-categories-and-brands/welding-technology/mm-welding/',
				image: '/images/category-detail-welding-technology/06-light-weight-welding-solutions-for-ev-interior.webp',
				alt: 'Light weight welding solutions for EV interior',
				label: 'Ultrasonic Welding',
				title: 'Multi-Material Welding®',
				description: 'Innovative fastening technique using ultrasonic energy to create connection points in composite and lightweight materials.',
			},
			{
				href: '/global-en/product-solutions/product-categories-and-brands/welding-technology/tucker/',
				image: '/images/category-detail-welding-technology/07-close-up-of-three-different-stanley-tucker-alumi.webp',
				alt: 'Close up of three different Stanley Tucker aluminium welding studs',
				label: 'Stud Welding Systems',
				title: 'TUCKER®',
				description: 'Economical and efficient drawn arc stud welding system. Suitable for manual, semi-automated, and fully automated applications.',
			},
		],
	},
	note: { text: 'The products listed here may not be available in all countries. In case of questions, please', linkLabel: 'contact us', linkHref: '/global-en/about-us/contact/', linkSuffix: '.' },
	services: {
		cards: [
			{
				href: '/global-en/eshop/c/02.500/',
				image: '/images/category-detail-welding-technology/08-saved-cart-icon.svg',
				alt: ' Saved Cart Icon',
				label: 'eShop',
				title: 'Buy Welding Technology',
				description: 'Browse our large assortment of welding studs and machines and find the right solution for your fastening challenge.',
			},
			{
				href: '/global-en/product-solutions/product-categories-and-brands/',
				image: '/images/category-detail-welding-technology/09-fasteners-icon.svg',
				alt: 'Fasteners icon',
				label: 'Product Categories',
				title: 'Discover More Fasteners',
				description: 'Find an overview of our product categories with brand partners, from Access Solutions to Welding Technology.',
			},
			{
				href: '/global-en/services/benefits/',
				image: '/images/category-detail-welding-technology/10-proven-productivity-thumbs-up-icon-surrounded-by.svg',
				alt: 'Proven productivity - thumbs up icon surrounded by arrows',
				label: 'About Us',
				title: 'Proven Productivity',
				description: 'Learn more about how we enable our customers to develop solutions that are better, faster, and more efficient.',
			},
		],
	},
};
