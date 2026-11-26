/**
 * src/data/category-detail/embedding-and-surface-bonding-fasteners.ts
 *
 * 主题：钛合金紧固件 — 埋入式/嵌件式固定与表面粘接结构中的机械紧固件
 * （嵌入件、粘接面结构）。
 *
 * 参考站原文（Embedding and Surface Bonding Fasteners，第三方结构胶与埋入件
 * 品牌目录）与 BOZE 的源头工厂定位不符：本页改为钛紧固件在胶接与埋入结构
 * 中的角色 —— 机械紧固件与结构胶分工、锚固件与拉头的材质选择、以及与
 * 胶接面接触的金属件需要什么样的表面处理。
 *
 * 维护说明：scripts/gen-category-detail.mjs 已不在仓库中，本文件现为手工维护。
 * 数值全部取自生成产物 src/data/products/materials.ts 与 finishes.ts；
 * 图片全部为本地已落盘资源；链接全部指向已发布路由。
 */
import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'embedding-and-surface-bonding-fasteners',
	seo: {
		title: 'Titanium Fasteners for Bonded and Embedded Structures',
		description:
			'Titanium anchors, studs, bolts and washers for structural adhesive joints and embedded fixings in aerospace, medical and automotive structures. Grade 2, Grade 5 and Grade 23, with EN 10204 3.1 traceability.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Titanium Fasteners for Bonded Structures' },
		],
		eyebrow: 'Titanium Fasteners',
		heading: 'Titanium Fasteners for Bonded and Embedded Structures',
		lead:
			'An adhesive joint carries shear and peel. The fastener in it carries everything else, and it has to do it without galvanising the structure it is bonded to.',
		image: '/images/category-detail-embedding-and-surface-bonding-fasteners/titanium-embedding-and-surface-bonding-fasteners-hero.webp',
		imageAlt:
			'Titanium fasteners and a bonded joint sample, showing the machined titanium anchor and the prepared bonding surface.',
		imageWidth: 1250,
		imageHeight: 1000,
		buttons: [
			{
				label: 'View Titanium Fasteners',
				href: '/products/',
				kind: 'link',
				variant: 'primary',
			},
			{ label: 'Send the Joint Detail', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro:
		'A bonded joint is two different technologies doing two different jobs. The adhesive does the shear and the peel. The fastener does the peel-back, the alignment and the load that the adhesive was never going to hold on its own.',
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{
			kind: 'list',
			items: [
				{ lead: 'No galvanic couple.', text: 'Titanium avoids the aluminium-steel couple that eats a bonded joint from the inside.' },
				{ lead: 'Grade against the load.', text: 'Grade 2 for corrosion-led duty, Grade 5 where the fastener carries the load.' },
				{ lead: 'Traceability.', text: 'EN 10204 3.1 certification, with the heat number carried on every lot.' },
			],
		},
		{ kind: 'heading', text: 'Why the metal in a bonded joint matters' },
		{
			kind: 'paragraph',
			text: 'The adhesive in a bonded joint is only as good as the surface it is stuck to, and the surface it is stuck to is a metal. When that metal is aluminium and the fastener going through it is steel, the joint has a galvanic couple running through it, and in the presence of the adhesive’s own moisture the coupling is what corrodes. The adhesive holds, and the joint fails around the fastener in a way that is difficult to predict from a calculation.',
		},
		{
			kind: 'paragraph',
			text: 'Titanium removes that problem by removing the dissimilar metal. In an aluminium structure with a titanium fastener, there is no galvanic couple between the fastener and the panel, and the joint fails — if it ever does — in the aluminium rather than in a hidden attack around the hole. That is a design property, not just a corrosion rate, and it is the reason titanium fasteners appear in bonded structures in aerospace and in the medical devices where the adhesive is the primary load path.',
		},
		{
			kind: 'paragraph',
			text: 'We are a fastener factory, so the adhesive, the surface prep and the cure cycle are the customer’s process. What we control is the metal in the joint: the anchor, the stud, the washer that spreads the load across the bond line, and the geometry that keeps the fastener from peeling the adhesive edge. Where the joint has an embedded insert, that insert is machined on the CNC route to your drawing in the grade you specify.',
		},
		{ kind: 'heading', text: 'Which fastener and grade suit the structure' },
		{
			kind: 'table',
			caption: 'Fastener selection for bonded and embedded structures.',
			columns: ['Structure', 'Fastener role', 'Grade', 'Fastener choice', 'What we control'],
			rows: [
				[
					'Aluminium bonded panel on an aluminium frame',
					'Position the bond line and carry peel-back load',
					'Grade 2 CP-Ti',
					'DIN 933 hex head bolt with DIN 934 nut',
					'No steel in the joint, so no galvanic couple around the hole',
				],
				[
					'Bonded skin over a CFRP sub-frame',
					'Fasten the skin without galvanising the laminate',
					'Grade 2 CP-Ti',
					'DIN 6921 flange bolt',
					'Integrated washer base spreads the clamp over the bond line',
				],
				[
					'Structural adhesive joint, aerospace',
					'Carry the primary load path alongside the adhesive',
					'Grade 5 Ti-6Al-4V',
					'DIN 912 socket head cap screw',
					'Anodised AMS 2488 finish, with colour used for grade identification',
				],
				[
					'Medical device housing with a bonded cover',
					'Secure the cover without visible or contaminating metal',
					'Grade 23 Ti-6Al-4V ELI',
					'DIN 7991 countersunk head cap screw',
					'ELI grade verified by XRF/PMI and filed against the lot',
				],
				[
					'Embedded insert in a composite sub-frame',
					'Provide the reusable thread for the assembly',
					'Grade 2 CP-Ti',
					'DIN 938 double end stud',
					'Insert and stud produced from the same heat where the lot allows',
				],
				[
					'Marine or process plant bonded liner',
					'Fasten the liner in a corrosive, wet environment',
					'Grade 2 CP-Ti',
					'DIN 939 double end stud with nut and washer',
					'Grade 2 rates 4 of 5 on our published corrosion scale',
				],
			],
		},
		{
			kind: 'paragraph',
			text: 'Surface condition decides how the adhesive behaves on the part it is bonded to. A titanium part that will be bonded needs a clean, oxide-free, reproducible surface, and the process that achieves it is passivation to ASTM F86 and AMS 2700 — the same treatment that removes free-iron contamination from the machined surface. Where the fastener is visible or has to be identified, anodising to AMS 2488 Type II or Type III gives a controlled anodic oxide and a colour.',
		},
		{
			kind: 'paragraph',
			text: 'A washer that spreads the load across the bond line is worth specifying explicitly, because a bolt head bearing directly on an adhesive joint concentrates the peel stress. We can supply plain washers to DIN 125 and ISO 7089, or flange bolts to DIN 6921 where the integrated washer base does the same job in one part. Every lot that leaves the shop carries the EN 10204 3.1 certificate for the heat it was cut from.',
			link: {
				label: 'See the grade supply matrix',
				href: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
			},
		},
	],
	brands: {
		heading: 'The titanium parts that sit inside a bonded joint',
		tiles: [
			{
				href: '/products/bolts/hexagon-flange-bolts/',
				image: '/images/products/TI-HEXAGON-FLANGE-BOLTS-BZ-105-bolts-titanium.webp',
				alt: 'Titanium hexagon flange bolts with integrated washer bases.',
				label: 'Fasteners',
				title: 'Titanium Flange Bolts',
				description:
					'DIN 6921 flange bolts — one integrated washer base that spreads the load over the bond line.',
			},
			{
				href: '/products/washers/plain-washers/',
				image: '/images/products/TI-PLAIN-WASHERS-BZ-401-washers-titanium.webp',
				alt: 'Titanium plain washers stacked on a white background.',
				label: 'Fasteners',
				title: 'Titanium Plain Washers',
				description:
					'Form A to DIN 125 and ISO 7089 — the element that keeps the bolt head off the adhesive edge.',
			},
			{
				href: '/products/bolts/double-end-stud-bolts/',
				image: '/images/products/TI-DOUBLE-END-STUD-BOLTS-BZ-110-bolts-titanium.webp',
				alt: 'Titanium double end stud bolts for embedded inserts and liners.',
				label: 'Fasteners',
				title: 'Titanium Double End Stud Bolts',
				description:
					'DIN 938 and DIN 939 studs for embedded inserts and liners installed from one side.',
			},
			{
				href: '/products/screws/countersunk-head-cap-screws/',
				image: '/images/products/TI-COUNTERSUNK-HEAD-CAP-SCREWS-BZ-202-screws-titanium.webp',
				alt: 'Titanium countersunk head cap screws for flush bonded covers.',
				label: 'Fasteners',
				title: 'Titanium Countersunk Head Cap Screws',
				description:
					'DIN 7991 90-degree flat head for bonded covers where the surface profile has to stay flat.',
			},
		],
	},
	note: {
		text: 'Availability, minimum order and lead time depend on diameter, length, grade and finish.',
		linkLabel: 'Send us the structure and the joint detail',
		linkHref: '/contact/',
		linkSuffix:
			' — we will confirm what can be produced from stock, what is made to order, and the grade and finish we would run.',
	},
	services: {
		cards: [
			{
				href: '/services/manufacturing-capabilities/cnc-machining-to-customer-drawings/',
				image: '/images/fastener-coatings/07-surface-finishing-icon.webp',
				alt: 'Machining icon',
				label: 'Manufacturing',
				title: 'CNC Machining to Customer Drawings',
				description:
					'Embedded inserts, anchors and special parts machined in titanium to your drawing.',
			},
			{
				href: '/product-solutions/components-specific-solutions/fastener-coatings/',
				image: '/images/fastener-coatings/06-fastener-finish-icon.webp',
				alt: 'Fastener finish icon',
				label: 'Surface Treatments',
				title: 'Bonding Surface Preparation',
				description:
					'ASTM F86 and AMS 2700 passivation for the clean, oxide-free surface the adhesive is bonded to.',
			},
			{
				href: '/contact/',
				image: '/images/product-categories-and-brands/16-fasteners-icon.svg',
				alt: 'Contact our factory',
				label: 'Contact',
				title: 'Send the Joint Detail',
				description:
					'Tell us the base materials, the adhesive load path and the quantity. We will come back with the grade we would run.',
			},
		],
	},
};
