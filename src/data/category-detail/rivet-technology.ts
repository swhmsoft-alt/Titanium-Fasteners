/**
 * src/data/category-detail/rivet-technology.ts
 *
 * 由 scripts/gen-category-detail.mjs 从参考站 HTML 生成 —— 禁止手改。
 * 参考：https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/rivet-technology/
 */

import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'rivet-technology',
	seo: { title: 'Rivet Technology - Products and Brands | Bossard Group', description: 'An overview of rivet technology, from blind rivets and blind rivet nuts to lockbolts, including the proper rivet tools for installation.' },
	hero: {
		breadcrumb: [
			{ label: 'Bossard Group - Fasteners, Engineering, Logistics', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Rivet Technology' },
		],
		eyebrow: 'Product Categories',
		heading: 'Rivet Technology',
		lead: 'Wherever an economical, non-detachable, safe, and easy-to-install connection is required, riveting is the right solution to your fastening challenge.',
		image: '/images/category-detail-rivet-technology/02-an-overview-of-different-types-of-rivets-blind-r.webp',
		imageAlt: 'An overview of different types of rivets, blind rivet nuts and lockbolts.',
		imageWidth: 634,
		imageHeight: 507,
		buttons: [
			{ label: 'View Products', kind: 'link', variant: 'primary', href: '/products/02.200/' },
			{ label: 'Contact Us', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro: 'Rivet technology reliably connects two independent components. Whether you are dealing with steel, plastic, or other materials of different strengths and thicknesses, riveting will securely hold them together.',
	video: { heading: 'Rivet Technology: The Basics', thumbnail: 'https://img.youtube.com/vi/dmzax1ClSPc/maxresdefault.jpg', thumbnailAlt: 'PS | Categories and Brands | Rivet Technology from Bossard', caption: 'Learn more about the different types of rivets, including blind rivets, blind rivet nuts, and lockbolts.' },
	richText: [
		{ kind: 'heading', text: 'Types of Rivets' },
		{ kind: 'paragraph', text: 'There is a rivet for every fastening need. and systems provide the solution for your one-sided access applications, from high-strength to lightweight materials. If you require a high production output, technology allows you to fasten up to 70 rivets per minute. For applications in high-vibration environments, ensure a safe and non-releasable connection. Blind rivet nuts blind riveting speed riveting lockbolts' },
		{ kind: 'paragraph', text: 'Our comprehensive product range covers different types of rivets, head shapes, and diameters for any combination of materials, from steel to plastics, and even composite materials and fiberglass:' },
		{ kind: 'list', items: [
			{ lead: '', text: 'Blind rivets' },
			{ lead: '', text: '' },
			{ lead: '', text: 'Lockbolts' },
			{ lead: '', text: 'Rivet tools, from battery- and pneumatic-powered hand tools to full automation' },
			{ lead: '', text: 'Speed rivets' },
		] },
		{ kind: 'paragraph', text: 'We work with trusted brand partners in riveting, including the following:' },
	],
	brands: {
		heading: 'Our Rivet Technology Brands',
		tiles: [
			{
				href: '/product-solutions/product-categories-and-brands/rivet-technology/avdel/',
				image: '/images/category-detail-rivet-technology/03-two-avdel-monobolt-structural-blind-rivets-on-a-.webp',
				alt: 'Two AVDEL Monobolt structural blind rivets on a white background.',
				label: 'Blind Rivet Systems',
				title: 'AVDEL®',
				description: 'Comprehensive riveting systems, including blind rivet and speed rivet fasteners, lockbolts, and rivet tools.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/rivet-technology/clufix/',
				image: '/images/category-detail-rivet-technology/04-a-clufix-blind-rivet-nut-with-open-end-and-a-hex.webp',
				alt: 'A Clufix blind rivet nut with open end and a hex shaft',
				label: 'Blind Rivet Nuts',
				title: 'Clufix®',
				description: 'Extensive portfolio with a wide range of materials, head, or shank types as well as standard, medium, long, and extra-long grip lengths.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/rivet-technology/fasteks-blind-rivets/',
				image: '/images/category-detail-rivet-technology/05-a-fasteks-multigrip-blind-rivet-on-a-white-backg.webp',
				alt: 'A Fasteks Multigrip blind rivet on a white background.',
				label: 'Blind Rivets',
				title: 'FASTEKS® FBR',
				description: 'Versatile blind rivets for different combinations of materials, head shapes, and diameters. High-strength and vibration-resistant.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/rivet-technology/fasteks-speed-rivets/',
				image: '/images/category-detail-rivet-technology/06-a-speed-rivet-on-a-white-background.webp',
				alt: 'A speed rivet on a white background.',
				label: 'Speed Rivets',
				title: 'FASTEKS® FBR',
				description: 'Rapid installation for a variety of materials. Unique preloading on the riveting mandrel.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/rivet-technology/fasteks-filko/',
				image: '/images/category-detail-rivet-technology/07-two-fasteks-filko-blind-rivet-nuts-with-knurled-.webp',
				alt: 'Two FASTEKS FILKO blind rivet nuts with knurled shank on white background',
				label: 'Blind Rivet Nuts',
				title: 'FASTEKS® FILKO',
				description: 'Round, knurled, and hexagonal shank blind rivet nuts. Resilient threads in thin-walled components with high tear-out strength.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/rivet-technology/huck/',
				image: '/images/category-detail-rivet-technology/08-a-huck-bobtail-high-strength-lockbolt-on-white-b.webp',
				alt: 'A Huck Bobtail high strength lockbolt on white background',
				label: 'Blind Rivets and Lockbolts',
				title: 'Huck®',
				description: 'High-strength structural blind rivets, lockbolts, and tooling for heavy-duty applications.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/rivet-technology/pop/',
				image: '/images/category-detail-rivet-technology/09-a-pop-vgrip-blind-rivet-for-extended-grip-range-.webp',
				alt: 'A POP VGrip blind rivet for extended grip range on white background',
				label: 'Blind Rivet Systems',
				title: 'POP®',
				description: 'The original blind rivet brand offers a vast portfolio of riveting solutions for diverse materials and applications.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/rivet-technology/tubtara/',
				image: '/images/category-detail-rivet-technology/10-close-up-of-a-tubtara-closed-end-blind-rivet-nut.webp',
				alt: 'Close-up of a Tubtara closed-end blind rivet nut with blue underhead seal to ensure water and gas tightness',
				label: 'Blind Rivet Nuts',
				title: 'Tubtara®',
				description: 'Different types of rivet nuts. Also available with underhead seal to ensure water and gas tightness up to IP67 and IP68.',
			},
		],
	},
	note: { text: 'The products listed here may not be available in all countries. In case of questions, please', linkLabel: 'contact us', linkHref: '/contact/', linkSuffix: '.' },
	services: {
		cards: [
			{
				href: '/products/02.200/',
				image: '/images/category-detail-rivet-technology/11-saved-cart-icon.svg',
				alt: ' Saved Cart Icon',
				label: 'Product Catalogue',
				title: 'Buy Rivets and Tools',
				description: 'Browse our large assortment of rivet technology and find the right solution for your fastening challenge.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/',
				image: '/images/category-detail-rivet-technology/12-fasteners-icon.svg',
				alt: 'Fasteners icon',
				label: 'Product Categories',
				title: 'Discover More Fasteners',
				description: 'Find an overview of our product categories with brand partners, from Access Solutions to Welding Technology.',
			},
			{
				href: '/services/benefits/',
				image: '/images/category-detail-rivet-technology/13-proven-productivity-thumbs-up-icon-surrounded-by.svg',
				alt: 'Proven productivity - thumbs up icon surrounded by arrows',
				label: 'About Us',
				title: 'Proven Productivity',
				description: 'Learn more about how we enable our customers to develop solutions that are better, faster, and more efficient.',
			},
		],
	},
};
