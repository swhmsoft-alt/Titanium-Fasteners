/**
 * src/data/category-detail/electrical-products.ts
 *
 * 由 scripts/gen-category-detail.mjs 从参考站 HTML 生成 —— 禁止手改。
 * 参考：https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/electrical-products/
 */

import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'electrical-products',
	seo: { title: 'Electrical Products and Brands', description: 'Brand overview of electrical products. Discover our solutions for wire management, contact parts, cable ties, cable glands, enclosures, and more.' },
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Electrical Products' },
		],
		eyebrow: 'Product Categories',
		heading: 'Electrical Products',
		lead: 'In the broad field of electrical applications, we are your one-stop shop. From wire management solutions and contact parts to industrial enclosures or mountings, we have the right electrical fasteners for you.',
		image: '/images/category-detail-electrical-products/01-an-overview-of-fastening-elements-for-electrical.webp',
		imageAlt: 'An overview of fastening elements for electrical applications',
		imageWidth: 634,
		imageHeight: 507,
		buttons: [
		],
	},
	intro: 'With our large network of brand partners for electrical products, we cover the requirements of the electrical engineering and machinery industries, power plants, the chemical sector, railway and tunnel engineering, as well as many other markets. Our renowned manufacturers ensure a comprehensive range of innovative and high-quality solutions.',
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{ kind: 'paragraph', text: 'Our electrical fasteners portfolio includes:' },
		{ kind: 'list', items: [
			{ lead: 'Cable glands', text: '' },
			{ lead: 'Contact parts', text: 'such as cable lugs, compression joints, terminals, crimping tools, terminal blocks, and end sleeves' },
			{ lead: 'Cable ties', text: '' },
			{ lead: 'Mountings', text: '' },
			{ lead: 'Industrial enclosures', text: '' },
			{ lead: 'Cable protection', text: 'such as tubings, braided sleeves, harness wraps, and wiring ducts' },
			{ lead: 'Heat shrink technology', text: '' },
			{ lead: 'Cable identifications', text: 'such as labels, markings, printers, and accessories' },
		] },
	],
	brands: {
		heading: 'Meet Our Electrical Products Brands',
		tiles: [
			{
				href: '/product-solutions/product-categories-and-brands/electrical-products/bm-group/',
				image: '/images/category-detail-electrical-products/04-three-different-solderless-terminals-by-bm-group.webp',
				alt: 'Three different solderless terminals by BM Group in yellow, blue and red on white background',
				label: 'Electrical Connection Technology',
				title: 'BM Group',
				description: 'Compression cable lugs and joints, solderless terminals, terminal blocks and more.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/electrical-products/reiku/',
				image: '/images/category-detail-electrical-products/16-a-black-reiku-tupe-connector-on-a-white-backgrou.webp',
				alt: 'A black Reiku tupe connector on a white background.',
				label: 'Cable Protection',
				title: 'Reiku',
				description: 'Comprehensive cable protection solutions, including tubing, connectors, heat and radiation protection.',
			},
		],
	},
	note: { text: 'The products listed here may not be available in all countries. In case of questions, please', linkLabel: 'contact us', linkHref: '/contact/', linkSuffix: '.' },
	services: {
		cards: [
			{
				href: '/products/03.100/',
				image: '/images/category-detail-electrical-products/19-saved-cart-icon.svg',
				alt: ' Saved Cart Icon',
				label: 'Product Catalogue',
				title: 'Buy Electrical Products',
				description: 'Browse our large assortment of electrical products and find the right solution for your fastening challenge.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/',
				image: '/images/category-detail-electrical-products/20-fasteners-icon.svg',
				alt: 'Fasteners icon',
				label: 'Product Categories',
				title: 'Discover More Fasteners',
				description: 'Find an overview of our product categories with brand partners, from Access Solutions to Welding Technology.',
			},
			{
				href: '/services/benefits/',
				image: '/images/category-detail-electrical-products/21-proven-productivity-thumbs-up-icon-surrounded-by.svg',
				alt: 'Proven productivity - thumbs up icon surrounded by arrows',
				label: 'About Us',
				title: 'Proven Productivity',
				description: 'Learn more about how we enable our customers to develop solutions that are better, faster, and more efficient.',
			},
		],
	},
};
