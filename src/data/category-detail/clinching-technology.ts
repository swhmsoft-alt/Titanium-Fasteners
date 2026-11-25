/**
 * src/data/category-detail/clinching-technology.ts
 *
 * 由 scripts/gen-category-detail.mjs 从参考站 HTML 生成 —— 禁止手改。
 * 参考：https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/clinching-technology/
 */

import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'clinching-technology',
	seo: { title: 'Clinching Technology - Self-Clinching Fasteners | Bossard Group', description: 'Discover the world of self-clinching fasteners, including self-clinching nuts, self-clinching studs, standoffs, pins, insertion presses, and more. ' },
	hero: {
		breadcrumb: [
			{ label: 'Bossard Group - Fasteners, Engineering, Logistics', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Clinching Technology' },
		],
		eyebrow: 'Product Categories',
		heading: 'Clinching Technology: Self-Clinching Fasteners',
		lead: 'Self-clinching fasteners are ideal if you want to create strong, reusable threads and mounting points in thin sheet metal, PCBs, and other materials. They help you save time and money, while also reducing damage to the material or bulging.',
		image: '/images/category-detail-clinching-technology/02-different-types-of-self-clinching-fasteners-incl.webp',
		imageAlt: 'Different types of self-clinching fasteners, including nuts, studs and standoffs',
		imageWidth: 634,
		imageHeight: 507,
		buttons: [
			{ label: 'View Products', kind: 'link', variant: 'primary', href: '/products/02.100/' },
			{ label: 'Contact Us', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro: 'Self-clinching is a secure, robust fastening solution suitable for various metals and sheet thicknesses. This is how it works:',
	video: { heading: 'Self-Clinching Fasteners Explained', thumbnail: 'https://img.youtube.com/vi/WpaXUDGw0bE/maxresdefault.jpg', thumbnailAlt: 'PS | Clinching Technology from Bossard', caption: 'Watch the video to gain more insights into the world of clinching technology.' },
	richText: [
		{ kind: 'heading', text: 'What Is Clinching Technology?' },
		{ kind: 'paragraph', text: 'A self-clinching fastener is pressed into the workpiece, displacing the host material around the mounting hole. This causes the material to cold flow into a specially designed annular recess in the fastener’s shank or pilot. A serrated clinching ring or a special head shape prevents the fastener from rotating after installation.' },
		{ kind: 'paragraph', text: 'The self-clinching fasteners for PC boards broach or cut into the material, creating an interference-type fit. In both cases, the result is a permanent connection that eliminates the need for loose parts like nuts and washers.' },
		{ kind: 'heading', text: 'Advantages and Applications' },
		{ kind: 'paragraph', text: 'Self-clinching fasteners provide strong mounting points and high push-out as well as torque-out performance. They are also cleaner than traditional fastening methods like spot welding – all without causing panel damage or bulging. In addition, the easy installation process allows you to save costs and benefit from shorter assembly times.' },
		{ kind: 'paragraph', text: 'Self-clinching fasteners can be installed into a wide variety of materials and provide reliable fastening connections for diverse industries such as aerospace, automotive, electronics, enclosures/housings, mechanical engineering, or medical and life science applications.' },
		{ kind: 'heading', text: 'Types of Self-Clinching Fasteners' },
		{ kind: 'paragraph', text: 'The core product types in an extensive portfolio of clinching fasteners are' },
		{ kind: 'list', items: [
			{ lead: '', text: 'Self-clinching nuts' },
			{ lead: '', text: 'Self-clinching studs' },
			{ lead: '', text: 'Self-clinching standoffs' },
			{ lead: '', text: 'Pins' },
			{ lead: '', text: 'Panel fasteners' },
			{ lead: '', text: 'Right-angle fasteners' },
			{ lead: '', text: 'Snap-top fasteners' },
			{ lead: '', text: 'SpotFast' },
		] },
		{ kind: 'paragraph', text: 'We supply branded self-clinching solutions, including the following:' },
	],
	brands: {
		heading: 'Our Clinching Technology Brands',
		tiles: [],
	},
	note: { text: 'The products listed here may not be available in all countries. In case of questions, please', linkLabel: 'contact us', linkHref: '/contact/', linkSuffix: '.' },
	services: {
		cards: [
			{
				href: '/products/02.100/',
				image: '/images/category-detail-clinching-technology/07-saved-cart-icon.svg',
				alt: ' Saved Cart Icon',
				label: 'Product Catalogue',
				title: 'Buy Clinching Technology',
				description: 'Browse our large assortment of self-clinching fasteners and find the right solution for your fastening challenge.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/',
				image: '/images/category-detail-clinching-technology/08-fasteners-icon.svg',
				alt: 'Fasteners icon',
				label: 'Product Categories',
				title: 'Discover More Fasteners',
				description: 'Find an overview of our product categories with brand partners, from Access Solutions to Welding Technology.',
			},
			{
				href: '/services/benefits/',
				image: '/images/category-detail-clinching-technology/09-proven-productivity-thumbs-up-icon-surrounded-by.svg',
				alt: 'Proven productivity - thumbs up icon surrounded by arrows',
				label: 'About Us',
				title: 'Proven Productivity',
				description: 'Learn more about how we enable our customers to develop solutions that are better, faster, and more efficient.',
			},
		],
	},
};
