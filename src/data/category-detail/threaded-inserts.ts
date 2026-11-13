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
			{ label: 'Bossard Group - Fasteners, Engineering, Logistics', href: '/global-en/' },
			{ label: 'Product Solutions', href: '/global-en/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/global-en/product-solutions/product-categories-and-brands/' },
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
			{ label: 'Go to eShop', kind: 'link', variant: 'primary', href: '/global-en/eshop/c/02.300/' },
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
		tiles: [
			{
				href: '/global-en/product-solutions/product-categories-and-brands/threaded-inserts/fasteks-compression-limiters/',
				image: '/images/category-detail-threaded-inserts/03-a-fasteks-compression-limiter-in-a-round-unheade.webp',
				alt: 'A FASTEKS compression limiter in a round, unheaded version on white background.',
				label: 'Compression Limiters',
				title: 'FASTEKS® FCL',
				description: 'Limit compressive forces on molded plastic parts and protect your material by preventing overloading.',
			},
			{
				href: '/global-en/product-solutions/product-categories-and-brands/threaded-inserts/fasteks-threaded-inserts/',
				image: '/images/category-detail-threaded-inserts/04-silver-fasteks-metal-threaded-insert-with-precis.webp',
				alt: 'Silver FASTEKS metal threaded insert with precise internal and external thread structure on a white background.',
				label: 'Self-Tapping Threaded Inserts',
				title: 'FASTEKS® FTI',
				description: 'Threaded inserts made of steel or stainless steel for precise, durable female threads in components made of light metal and other materials with low shear strength.',
			},
			{
				href: '/global-en/product-solutions/product-categories-and-brands/threaded-inserts/filtec/',
				image: '/images/category-detail-threaded-inserts/05-silver-filtec-metal-wire-thread-insert-with-spir.webp',
				alt: 'Silver FILTEC metal wire thread insert with spiral structure and tang on a white background.',
				label: 'Wire Threaded Inserts',
				title: 'FILTEC®',
				description: 'Create high-strength threads with optimal transmission from the bolt to the nut thread.',
			},
			{
				href: '/global-en/product-solutions/product-categories-and-brands/threaded-inserts/kato/',
				image: '/images/category-detail-threaded-inserts/06-two-kato-threaded-inserts-one-pink-and-one-silve.webp',
				alt: 'Two KATO threaded inserts, one pink and one silver, made of coiled wire with spiral structure on a white background.',
				label: 'Wire Threaded Inserts',
				title: 'KATO®',
				description: 'Ideal for threads subjected to heavy loads, connections that need to be disassembled frequently, or repairing damaged threads.',
			},
			{
				href: '/global-en/product-solutions/product-categories-and-brands/threaded-inserts/keenserts/',
				image: '/images/category-detail-threaded-inserts/07-a-keenserts-high-strength-thread-insert-on-a-whi.webp',
				alt: 'A Keenserts high strength thread insert on a white background.',
				label: 'High-Strength Threaded Inserts',
				title: 'Keenserts®',
				description: 'Extremely durable stainless steel threaded inserts. Prevent threads from becoming stripped or replace damaged threads.',
			},
			{
				href: '/global-en/product-solutions/product-categories-and-brands/threaded-inserts/pem-castsert/',
				image: '/images/category-detail-threaded-inserts/08-two-pem-castsert-press-in-threaded-inserts-on-wh.webp',
				alt: 'Two PEM CastSert press-in threaded inserts on white background',
				label: 'Press-In Threaded Inserts',
				title: 'PEM® CastSert™',
				description: 'Stainless steel press-in inserts for strong, durable metal threads in soft metals and die-cast alloys. Ideal for castings and soft materials HRB 70 / HB 125 or less.',
			},
			{
				href: '/global-en/product-solutions/product-categories-and-brands/threaded-inserts/tappex/',
				image: '/images/category-detail-threaded-inserts/09-close-up-of-a-tappex-trisert-brass-threaded-inse.webp',
				alt: 'Close-up of a Tappex Trisert brass threaded insert',
				label: 'Threaded Inserts',
				title: 'Tappex®',
				description: 'Brass, steel, or stainless steel threaded inserts for press-in, screw-in, or mold-in applications in plastic or wood. Versatile and anti-corrosion.',
			},
		],
	},
	note: { text: 'The products listed here may not be available in all countries. In case of questions, please', linkLabel: 'contact us', linkHref: '/global-en/about-us/contact/', linkSuffix: '.' },
	services: {
		cards: [
			{
				href: '/global-en/eshop/c/02.300/',
				image: '/images/category-detail-threaded-inserts/10-saved-cart-icon.svg',
				alt: ' Saved Cart Icon',
				label: 'eShop',
				title: 'Buy Threaded Inserts',
				description: 'Browse our large assortment of threaded inserts and find the right solution for your fastening challenge.',
			},
			{
				href: '/global-en/product-solutions/product-categories-and-brands/',
				image: '/images/category-detail-threaded-inserts/11-fasteners-icon.svg',
				alt: 'Fasteners icon',
				label: 'Product Categories',
				title: 'Discover More Fasteners',
				description: 'Find an overview of our product categories with brand partners, from Access Solutions to Welding Technology.',
			},
			{
				href: '/global-en/services/benefits/',
				image: '/images/category-detail-threaded-inserts/12-proven-productivity-thumbs-up-icon-surrounded-by.svg',
				alt: 'Proven productivity - thumbs up icon surrounded by arrows',
				label: 'About Us',
				title: 'Proven Productivity',
				description: 'Learn more about how we enable our customers to develop solutions that are better, faster, and more efficient.',
			},
		],
	},
};
