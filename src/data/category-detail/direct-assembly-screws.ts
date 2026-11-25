/**
 * src/data/category-detail/direct-assembly-screws.ts
 *
 * 由 scripts/gen-category-detail.mjs 从参考站 HTML 生成 —— 禁止手改。
 * 参考：https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/direct-assembly-screws/
 */

import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'direct-assembly-screws',
	seo: { title: 'Direct Assembly Screws - Products and Brands | Bossard Group', description: 'Discover self-drilling screws, thread-cutting screws, thread-forming screws, and more. Bossard brand overview of direct assembly screws.' },
	hero: {
		breadcrumb: [
			{ label: 'Bossard Group - Fasteners, Engineering, Logistics', href: '/' },
			{ label: '...' },
			{ label: 'Direct Assembly Screws' },
		],
		eyebrow: 'Product Categories',
		heading: 'Direct Assembly Screws',
		lead: 'Save time and money by choosing a screw that can do more than simply connect two parts! Reduce work steps with self-drilling, thread-forming, and thread-cutting screws, or lower the number of parts you need with multifunctional elements.',
		image: '/images/category-detail-direct-assembly-screws/02-different-types-of-direct-assembly-screws-on-a-w.webp',
		imageAlt: 'Different types of direct assembly screws on a white background.',
		imageWidth: 634,
		imageHeight: 507,
		buttons: [
			{ label: 'View Products', kind: 'link', variant: 'primary', href: '/products/01.200/' },
			{ label: 'Contact Us', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro: 'Direct assembly screws are suitable for numerous applications and materials, such as aluminum, thin sheet metal, steel, thermoplastics, wood, and concrete. Different materials require different screw designs to ensure an optimal connection.',
	video: { heading: 'Find the Right Screw for Your Application', thumbnail: 'https://img.youtube.com/vi/19ozjSem_oI/maxresdefault.jpg', thumbnailAlt: 'PS | Direct Assembly Screws from Bossard', caption: 'Get a quick overview of direct assembly screws and learn which one to use for which application.' },
	richText: [
		{ kind: 'heading', text: 'Different Types of Direct Assembly Screws' },
		{ kind: 'paragraph', text: 'At Bossard, we distinguish between different types of screws for direct assembly:' },
		{ kind: 'list', items: [
			{ lead: 'Self-drilling screws', text: 'require no pre-drilling, which makes them ideal for quick and efficient installation.' },
			{ lead: 'Thread-cutting screws', text: 'create a mating thread in hard materials while still requiring only a low installation torque.' },
			{ lead: 'Thread-forming screws', text: 'are optimal for high clamp load and providing vibration resistance.' },
			{ lead: 'Multifunctional screws', text: 'with integrated washers provide increased security while enabling you to reduce C-parts.' },
		] },
		{ kind: 'paragraph', text: 'Make your installation process faster, safer, and more durable with versatile and economical products from our many expert partners. We offer a broad range of direct assembly solutions, including the following:' },
	],
	brands: {
		heading: 'Our Direct Assembly Screws Brands',
		tiles: [
			{
				href: '/product-solutions/product-categories-and-brands/direct-assembly-screws/din-7500-screw/',
				image: '/images/category-detail-direct-assembly-screws/05-close-up-of-a-din-7500-self-tapping-screw-for-me.webp',
				alt: 'Close-up of a DIN 7500 self-tapping screw for metal',
				label: 'Screws for Metal',
				title: 'DIN 7500',
				description: 'ISO metric thread-forming screw that optimizes both technical performance and cost-effectiveness.',
			},
		],
	},
	note: { text: 'The products listed here may not be available in all countries. In case of questions, please', linkLabel: 'contact us', linkHref: '/contact/', linkSuffix: '.' },
	services: {
		cards: [
			{
				href: '/products/01.200/',
				image: '/images/category-detail-direct-assembly-screws/18-saved-cart-icon.svg',
				alt: ' Saved Cart Icon',
				label: 'Product Catalogue',
				title: 'Buy Direct Assembly Screws',
				description: 'Browse our large assortment of direct assembly screws and find the right solution for your fastening challenge.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/',
				image: '/images/category-detail-direct-assembly-screws/19-fasteners-icon.svg',
				alt: 'Fasteners icon',
				label: 'Product Categories',
				title: 'Discover More Fasteners',
				description: 'Find an overview of our product categories with brand partners, from Access Solutions to Welding Technology.',
			},
			{
				href: '/services/benefits/',
				image: '/images/category-detail-direct-assembly-screws/20-proven-productivity-thumbs-up-icon-surrounded-by.svg',
				alt: 'Proven productivity - thumbs up icon surrounded by arrows',
				label: 'About Us',
				title: 'Proven Productivity',
				description: 'Learn more about how we enable our customers to develop solutions that are better, faster, and more efficient.',
			},
		],
	},
};
