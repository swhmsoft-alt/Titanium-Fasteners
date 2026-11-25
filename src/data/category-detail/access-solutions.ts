/**
 * src/data/category-detail/access-solutions.ts
 *
 * 由 scripts/gen-category-detail.mjs 从参考站 HTML 生成 —— 禁止手改。
 * 参考：https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/access-solutions/
 */

import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'access-solutions',
	seo: { title: 'Access Solutions, Locking and Control Elements', description: 'Get an overview of the diverse world of access solutions, from hinges, latches, and handles to positioning elements and quick release fasteners.' },
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Access Solutions' },
		],
		eyebrow: 'Product Categories',
		heading: 'Access, Locking and Control Solutions',
		lead: 'Wherever you need to access, touch, adjust, open, or lock something, we have the right solutions that cater to your unique needs.',
		image: '/images/category-detail-access-solutions/01-various-access-locking-and-control-elements-such.webp',
		imageAlt: 'Various access, locking and control elements, such as handles, latches, hinges and more.',
		imageWidth: 634,
		imageHeight: 507,
		buttons: [
		],
	},
	intro: 'No matter your industry, reliable low-maintenance solutions that control access to your products are crucial to ensuring quality and safety. Access and control elements are a diverse product category that range from simple handles or knobs for opening doors to hinges that adjust display mounts and electronic security levers that prevent unauthorized access.',
	video: { heading: 'The Many Diverse Applications of Access Solutions', thumbnail: 'https://img.youtube.com/vi/-htXGKzlWD4/maxresdefault.jpg', thumbnailAlt: 'PS | Access, Locking and Control Solutions', caption: 'Dive into the world of access solutions and discover some of the unexpected places where these elements are in use.' },
	richText: [
		{ kind: 'heading', text: 'Different Types of Access Solutions' },
		{ kind: 'paragraph', text: 'Access solutions and control elements are used in a wide range of industries, such as machinery, railway, automotive, and many more. Our portfolio ranges from standard machine and control elements, including knobs, handwheels, and hinges to more specialized parts, for example:' },
		{ kind: 'list', items: [
			{ lead: 'Positioning technology,', text: 'such as hinges and display mounts' },
			{ lead: 'Latches', text: 'for varying applications' },
			{ lead: 'Electronic access solutions,', text: 'such as latches, bolts, swing handles, and wireless and electronic controllers' },
			{ lead: 'Quick fasteners,', text: 'such as pins or captive screws' },
			{ lead: 'Control elements,', text: 'including clamping knobs and levers, handles, and levelling feet, as well as indexing elements' },
		] },
		{ kind: 'paragraph', text: 'Through our brand partners, we offer innovative solutions that meet highest quality and design standards.' },
	],
	brands: {
		heading: 'Our Access Solutions Brands',
		tiles: [
			{
				href: '/product-solutions/product-categories-and-brands/access-solutions/camloc-motion-control/',
				image: '/images/category-detail-access-solutions/04-a-black-camloc-motion-control-vari-lift-gas-spri.webp',
				alt: 'A black Camloc Motion Control VARI-LIFT gas spring on white background',
				label: 'Gas Springs and Damper Solutions',
				title: 'Camloc Motion Control',
				description: 'Gas springs, struts and dampers for safely lifting, positioning, lowering, and counterbalancing weights.',
			},
		],
	},
	note: { text: 'The products listed here may not be available in all countries. In case of questions, please', linkLabel: 'contact us', linkHref: '/contact/', linkSuffix: '.' },
	services: {
		cards: [
			{
				href: '/products/03.200/',
				image: '/images/category-detail-access-solutions/13-saved-cart-icon.svg',
				alt: ' Saved Cart Icon',
				label: 'Product Catalogue',
				title: 'Buy Access Solutions',
				description: 'Browse our large assortment of access, locking, and control elements and find the right solution for your fastening challenge.',
			},
			{
				href: '/product-solutions/product-categories-and-brands/',
				image: '/images/category-detail-access-solutions/14-fasteners-icon.svg',
				alt: 'Fasteners icon',
				label: 'Product Categories',
				title: 'Discover More Fasteners',
				description: 'Find an overview of our product categories with brand partners, from Access Solutions to Welding Technology.',
			},
			{
				href: '/services/benefits/',
				image: '/images/category-detail-access-solutions/15-proven-productivity-thumbs-up-icon-surrounded-by.svg',
				alt: 'Proven productivity - thumbs up icon surrounded by arrows',
				label: 'About Us',
				title: 'Proven Productivity',
				description: 'Learn more about how we enable our customers to develop solutions that are better, faster, and more efficient.',
			},
		],
	},
};
