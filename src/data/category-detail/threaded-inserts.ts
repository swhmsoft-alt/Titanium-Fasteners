/**
 * src/data/category-detail/threaded-inserts.ts
 *
 * 由 scripts/gen-category-detail.mjs 从参考站 HTML 生成 —— 禁止手改。
 * 参考：https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/threaded-inserts/
 */

import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'threaded-inserts',
	seo: { title: 'Threaded Inserts - Products and Brands | Bossard Group', description: 'Explore various threaded inserts and top brands, including wire thread inserts, self-tapping thread inserts, and press-in threaded inserts.' },
	hero: {
		breadcrumb: [
			{ label: 'Bossard Group - Fasteners, Engineering, Logistics', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Threaded Inserts' },
		],
		eyebrow: 'Product Categories',
		heading: 'Threaded Inserts',
		lead: 'Do you need to create strong threads in weak materials such as light metals or plastics? Threaded inserts are the solution of choice for this use case.',
		image: '/images/category-detail-threaded-inserts/02-different-types-of-threaded-inserts-including-br.webp',
		imageAlt: 'Different types of threaded inserts, including brass inserts, wire thread inserts and key-locking inserts.',
		imageWidth: 634,
		imageHeight: 507,
		buttons: [
			{ label: 'View Products', kind: 'link', variant: 'primary', href: '/products/02.300/' },
			{ label: 'Contact Us', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro: 'Threaded inserts create precise, robust, and wear-resistant nut threads in workpieces made of light metal, plastic, and other materials with low shear strength. They also allow you to replace defective threads quickly and cost-effectively.',
	video: { heading: 'Threaded Insert Technology: An Overview', thumbnail: 'https://img.youtube.com/vi/3InS-07jc8I/maxresdefault.jpg', thumbnailAlt: 'PS | Threaded Inserts Fastening Technology from Bossard', caption: 'Watch the video to learn about the different types of threaded inserts and their use cases.' },
	richText: [
		{ kind: 'heading', text: 'Different Types of Threaded Inserts' },
		{ kind: 'paragraph', text: 'Depending on the application, different types of threaded inserts are available. At Bossard, we distinguish between the following types:' },
		{ kind: 'list', items: [
			{ lead: 'Wire', text: 'thread inserts' },
			{ lead: 'Self-tapping', text: 'thread inserts' },
			{ lead: 'Heavy-duty', text: 'threaded inserts with special key-locks' },
			{ lead: 'Mold-in, screw-in, or press-in', text: 'threaded inserts' },
		] },
		{ kind: 'paragraph', text: 'You can also differentiate threaded inserts based on the parent material to be used:' },
		{ kind: 'list', items: [
			{ lead: 'for metal', text: 'Threaded inserts , such as aluminum or zinc die-casting' },
			{ lead: 'for plastic', text: 'Threaded inserts materials such as composites, thermoplastics, and thermosets' },
			{ lead: 'for wood', text: 'Threaded inserts' },
		] },
		{ kind: 'paragraph', text: 'We supply a broad portfolio of branded threaded inserts, including the following:' },
	],
	brands: {
		heading: 'Our Threaded Inserts Brands',
		tiles: [],
	},
	note: { text: 'The products listed here may not be available in all countries. In case of questions, please', linkLabel: 'contact us', linkHref: '/contact/', linkSuffix: '.' },
	services: {
		cards: [
			{
				href: '/products/02.300/',
				image: '/images/category-detail-threaded-inserts/10-saved-cart-icon.svg',
				alt: ' Saved Cart Icon',
				label: 'Product Catalogue',
				title: 'Buy Threaded Inserts',
				description: 'Browse our large assortment of threaded inserts and find the right solution for your fastening challenge.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/',
				image: '/images/category-detail-threaded-inserts/11-fasteners-icon.svg',
				alt: 'Fasteners icon',
				label: 'Product Categories',
				title: 'Discover More Fasteners',
				description: 'Find an overview of our product categories with brand partners, from Access Solutions to Welding Technology.',
			},
			{
				href: '/services/benefits/',
				image: '/images/category-detail-threaded-inserts/12-proven-productivity-thumbs-up-icon-surrounded-by.svg',
				alt: 'Proven productivity - thumbs up icon surrounded by arrows',
				label: 'About Us',
				title: 'Proven Productivity',
				description: 'Learn more about how we enable our customers to develop solutions that are better, faster, and more efficient.',
			},
		],
	},
};
