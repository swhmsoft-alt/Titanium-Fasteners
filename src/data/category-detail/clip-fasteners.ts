/**
 * src/data/category-detail/clip-fasteners.ts
 *
 * 由 scripts/gen-category-detail.mjs 从参考站 HTML 生成 —— 禁止手改。
 * 参考：https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/clip-fasteners/
 */

import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'clip-fasteners',
	seo: { title: 'Clip Fasteners Overview', description: 'Discover quick-release clip fasteners for time-sensitive applications, including cage nuts, hose clamps, spring plungers, ball lock pins, and more. ' },
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Clip Fasteners' },
		],
		eyebrow: 'Product Categories',
		heading: 'Clip Fasteners',
		lead: 'Is your application time-sensitive? Then clip fasteners could be what you’re looking for. Discover quick-release clip fastening elements for connections, replacements, holding, fixing, and securing.',
		image: '/images/category-detail-clip-fasteners/02-six-different-types-of-clip-fasteners-on-a-white.webp',
		imageAlt: 'Six different types of clip fasteners on a white background.',
		imageWidth: 634,
		imageHeight: 507,
		buttons: [
			{ label: 'View Products', kind: 'link', variant: 'primary', href: '/products/02.400/' },
			{ label: 'Contact Us', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro: 'Clip fasteners are used in a wide variety of industries and applications. Some examples of different types of clip fasteners include:',
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{ kind: 'list', items: [
			{ lead: 'Cage nuts', text: 'for tolerance compensation, efficient handling and reliable support' },
			{ lead: 'Clips and snap nuts', text: 'for different sheet thicknesses' },
			{ lead: 'Spring plungers', text: 'for fixing, locking, and positioning' },
			{ lead: 'Ball-ended thrust screws', text: 'for tensioning, supporting, or clamping' },
			{ lead: 'Self-locking ball lock pins', text: 'with push-button release for quick connection and release, corrosion-resistant and suitable for applications with high loads' },
			{ lead: 'Hose clamps', text: 'for quick, safe installation in low-to-high-pressure applications' },
		] },
	],
	brands: {
		heading: 'Our Clip Fastener Brands',
		tiles: [
			{
				href: '/product-solutions/product-categories-and-brands/clip-fasteners/mikalor/',
				image: '/images/category-detail-clip-fasteners/05-close-up-of-a-metal-hose-clamp-on-a-white-backgr.webp',
				alt: 'Close-up of a metal hose-clamp on a white background.',
				label: 'Hose Clamps',
				title: 'Mikalor',
				description: 'Comprehensive portfolio of hose clamps suitable for low, medium and high-pressure applications.',
			},
		],
	},
	note: { text: 'The products listed here may not be available in all countries. In case of questions, please', linkLabel: 'contact us', linkHref: '/contact/', linkSuffix: '.' },
	services: {
		cards: [
			{
				href: '/products/02.400/',
				image: '/images/category-detail-clip-fasteners/06-saved-cart-icon.svg',
				alt: ' Saved Cart Icon',
				label: 'Product Catalogue',
				title: 'Buy Clip Fasteners',
				description: 'Browse our large assortment of clip fasteners and find the right solution for your fastening challenge.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/',
				image: '/images/category-detail-clip-fasteners/07-fasteners-icon.svg',
				alt: 'Fasteners icon',
				label: 'Product Categories',
				title: 'Discover More Fasteners',
				description: 'Find an overview of our product categories with brand partners, from Access Solutions to Welding Technology.',
			},
			{
				href: '/services/benefits/',
				image: '/images/category-detail-clip-fasteners/08-proven-productivity-thumbs-up-icon-surrounded-by.svg',
				alt: 'Proven productivity - thumbs up icon surrounded by arrows',
				label: 'About Us',
				title: 'Proven Productivity',
				description: 'Learn more about how we enable our customers to develop solutions that are better, faster, and more efficient.',
			},
		],
	},
};
