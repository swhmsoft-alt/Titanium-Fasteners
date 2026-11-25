/**
 * src/data/category-detail/securing-and-anti-loosening-elements.ts
 *
 * 由 scripts/gen-category-detail.mjs 从参考站 HTML 生成 —— 禁止手改。
 * 参考：https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/securing-and-anti-loosening-elements/
 */

import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'securing-and-anti-loosening-elements',
	seo: { title: 'Securing and Anti-Loosening - Products and Brands | Bossard Group', description: 'Bossard brand overview of self-locking fasteners, including wedge lock washers, locknuts, retaining rings, and self-locking screws. ' },
	hero: {
		breadcrumb: [
			{ label: 'Bossard Group - Fasteners, Engineering, Logistics', href: '/' },
			{ label: '...' },
			{ label: 'Securing and Anti-Loosening Elements' },
		],
		eyebrow: 'Product Categories',
		heading: 'Securing and Anti-Loosening Elements',
		lead: 'The unintended loosening of fasteners is a worst-case scenario which can lead to grave damage. To prevent this, we supply self-locking fasteners that combat loosening and fastener loss.',
		image: '/images/category-detail-securing-and-anti-loosening-elements/02-different-types-of-securing-and-anti-loosening-e.webp',
		imageAlt: 'Different types of securing and anti-loosening elements for fastening',
		imageWidth: 634,
		imageHeight: 507,
		buttons: [
			{ label: 'View Products', kind: 'link', variant: 'primary', href: '/products/01.300/' },
			{ label: 'Contact Us', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro: 'Securing and anti-loosening elements have special properties to prevent the failure of thread-based connections. Through different mechanisms, they maintain the clamp force of the assembly, even under high vibrations. This is crucial especially for safety-critical applications where the loosening or loss of fasteners can create tremendous damage.',
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{ kind: 'heading', text: 'Types of Securing and Anti-Loosening Fasteners' },
		{ kind: 'paragraph', text: 'There are different types of self-locking fasteners, including lock washers, locknuts, and multifunctional screws with special properties to keep bolted connections from coming loose. The following operating mechanisms are most common:' },
		{ kind: 'list', items: [
			{ lead: '', text: 'Securing through friction' },
			{ lead: '', text: 'Securing through mechanical locking' },
			{ lead: '', text: 'Securing through tension' },
		] },
		{ kind: 'paragraph', text: 'In addition to these mechanical solutions, anti-loosening can also be achieved by special adhesives.' },
		{ kind: 'heading', text: 'Finding the Right Solution' },
		{ kind: 'paragraph', text: 'The optimal anti-loosening solution can differ greatly, depending on the application. We support you in finding the right choice for your specific challenge! With our broad portfolio of trusted brand partners, we provide a comprehensive supply of securing and anti-loosening elements, including the following:' },
	],
	brands: {
		heading: 'Our Securing and Anti-Loosening Brands',
		tiles: [],
	},
	note: { text: 'The products listed here may not be available in all countries. In case of questions, please', linkLabel: 'contact us', linkHref: '/contact/', linkSuffix: '.' },
	services: {
		cards: [
			{
				href: '/products/01.300/',
				image: '/images/category-detail-securing-and-anti-loosening-elements/10-saved-cart-icon.svg',
				alt: ' Saved Cart Icon',
				label: 'Product Catalogue',
				title: 'Buy Securing Elements',
				description: 'Browse our large assortment of securing and anti-loosening fasteners and find the right solution for your fastening challenge.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/',
				image: '/images/category-detail-securing-and-anti-loosening-elements/11-fasteners-icon.svg',
				alt: 'Fasteners icon',
				label: 'Product Categories',
				title: 'Discover More Fasteners',
				description: 'Find an overview of our product categories with brand partners, from Access Solutions to Welding Technology.',
			},
			{
				href: '/services/benefits/',
				image: '/images/category-detail-securing-and-anti-loosening-elements/12-proven-productivity-thumbs-up-icon-surrounded-by.svg',
				alt: 'Proven productivity - thumbs up icon surrounded by arrows',
				label: 'About Us',
				title: 'Proven Productivity',
				description: 'Learn more about how we enable our customers to develop solutions that are better, faster, and more efficient.',
			},
		],
	},
};
