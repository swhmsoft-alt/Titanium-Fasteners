/**
 * src/data/category-detail/sealing-technology.ts
 *
 * 主题：钛合金紧固件 — 密封技术（耐腐蚀特性）。
 *
 * 参考站原文（Sealing Technology，第三方密封塞/止回阀品牌目录）与 BOZE 的
 * 源头工厂定位不符：本页改为钛合金紧固件在密封/耐腐蚀工况下的角色 —— 密封
 * 副中的螺栓、垫圈与法兰面，以及其对应的牌号、表面处理与可追溯要求。
 *
 * 维护说明：scripts/gen-category-detail.mjs 已不在仓库中，本文件现为手工维护。
 * 图片全部为本地已落盘资源；链接全部指向 src/data/products/routes.json 中
 * 已发布的路由，或站内存续页面。
 */
import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'sealing-technology',
	seo: {
		title: 'Titanium Sealing Fasteners — Corrosion-Resistant Sealing Technology',
		description:
			'Titanium fasteners, washers and flange bolts for sealed joints in chemical, marine and desalination service. Grade 2 and Grade 5, passivated or anodised, with EN 10204 3.1 traceability.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Titanium Sealing Technology' },
		],
		eyebrow: 'Titanium Fasteners',
		heading: 'Titanium Sealing Technology',
		lead:
			'Titanium fasteners and washers hold a joint in the media that attack steel sealing hardware. Grade 2 and Grade 5, passivated or anodised, cut to order.',
		image: '/images/category-detail-sealing-technology/titanium-sealing-fasteners-hero.webp',
		imageAlt:
			'Titanium plain washers and hex socket head cap screws arranged on a white background, used as the sealing elements of a bolted joint.',
		imageWidth: 1250,
		imageHeight: 1000,
		buttons: [
			{
				label: 'View Titanium Washers',
				href: '/products/washers/plain-washers/',
				kind: 'link',
				variant: 'primary',
			},
			{ label: 'Request Sealing Samples', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro:
		'A sealed joint fails at the fastener, the washer face or the surface beneath it. Titanium removes the corrosion term at all three, with grade and finish chosen against the medium rather than a price list.',
	/* 参考站的第三方视频与其品牌目录同源，已从本页移除：视频块仅在有缩略图时渲染。 */
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{
			kind: 'list',
			items: [
				{ lead: 'Corrosion rating.', text: 'Grade 5 scores 5 of 5, Grade 2 scores 4 of 5 on our published scale.' },
				{ lead: 'Surface condition.', text: 'Passivation to ASTM F86 and AMS 2700, or anodising to AMS 2488.' },
				{ lead: 'Traceability.', text: 'EN 10204 3.1 certification, with the heat number carried on every lot.' },
			],
		},
		{ kind: 'heading', text: 'Where the titanium is actually used' },
		{
			kind: 'paragraph',
			text: 'We are a fastener factory, so we supply the titanium parts that make up a sealed joint rather than the plug or the gasket inside it. On a hydraulic or pneumatic manifold the auxiliary port is closed by a plug, but the plug is only as good as the thread it sits in: a steel plug in a titanium port carries the same corrosion risk as the steel port would. The same applies to the cover plate on a chemical reactor or the access door on a desalination skid.',
		},
		{
			kind: 'paragraph',
			text: 'The material is decided against the medium and the load together. Commercially pure Grade 2 is the ductile choice for chemical service, where forming and sealing surface condition matter more than strength. Grade 5 Ti-6Al-4V is the general engineering choice where the joint is loaded and the environment is marine or mildly aggressive. Grade 23, the ELI variant, is used where the part is also a medical implant or is exposed to seawater under our published test data. Grade 9 sits above 300 °C, where Grade 5 creep is no longer sufficient.',
		},
		{
			kind: 'paragraph',
			text: 'The surface is the second decision, and it is made per joint rather than per order. A chemical passivation to ASTM F86 and AMS 2700 leaves no coating and removes free-iron contamination that machining can introduce, which is what keeps the thread from seizing. Anodising to AMS 2488 Type II or Type III produces a controlled anodic oxide, and it is the finish used where parts have to be told apart by grade, by batch or by function. Where titanium meets titanium and the joint is repeatedly opened, galling is the risk rather than corrosion, and hard coatings such as PVD or DLC are available on request.',
		},
		{
			kind: 'paragraph',
			text: 'Nothing in a sealing application is useful if the lot cannot be traced back to the heat it was cut from. Each shipment carries the EN 10204 3.1 certificate for the lot it contains, and the material is verified by XRF/PMI before it leaves the shop.',
		},
	],
	brands: {
		heading: 'The titanium parts that make up a sealed joint',
		tiles: [
			{
				href: '/products/washers/plain-washers/',
				image: '/images/category/titanium-washers-sealing-square.webp',
				alt: 'Titanium plain washers stacked on a white background.',
				label: 'Fasteners',
				title: 'Titanium Plain Washers',
				description:
					'Form A to DIN 125 and ISO 7089 — the element that spreads the load and defines the sealing face under the bolt head.',
			},
			{
				href: '/products/bolts/hexagon-flange-bolts/',
				image: '/images/category/titanium-bolts-sealing-square.webp',
				alt: 'Titanium hexagon flange bolts with integrated washer bases.',
				label: 'Fasteners',
				title: 'Titanium Flange Bolts',
				description:
					'DIN 6921 flange bolts with an integrated washer base — one part, one sealing face, no separate washer to lose.',
			},
			{
				href: '/products/nuts/hex-nut/',
				image: '/images/category/titanium-nuts-sealing-square.webp',
				alt: 'Titanium hexagon full nuts in Grade 2 and Grade 5.',
				label: 'Fasteners',
				title: 'Titanium Hexagon Nuts',
				description:
					'DIN 934 full nuts on the clamped side of the joint, machined from the same heat as the bolt where the lot allows.',
			},
			{
				href: '/products/screws/hex-socket-head-cap-screw/',
				image: '/images/category/titanium-screws-sealing-square.webp',
				alt: 'Titanium hexagon socket head cap screws on a white background.',
				label: 'Fasteners',
				title: 'Titanium Socket Head Cap Screws',
				description:
					'DIN 912 full thread for covers and housings that have to be opened again without damaging the sealing face.',
			},
		],
	},
	note: {
		text: 'Availability, minimum order and lead time depend on diameter, length, grade and finish.',
		linkLabel: 'Send us the joint detail',
		linkHref: '/contact/',
		linkSuffix: ' — we will confirm what can be produced from stock and what is made to order.',
	},
	services: {
		cards: [
			{
				href: '/product-solutions/components-specific-solutions/fastener-coatings/',
				image: '/images/fastener-coatings/06-fastener-finish-icon.webp',
				alt: 'Fastener finish icon',
				label: 'Surface Treatments',
				title: 'Passivation and Anodising',
				description:
					'ASTM F86 and AMS 2700 passivation, and AMS 2488 Type II and Type III anodising for the thread and the sealing face.',
			},
			{
				href: '/services/manufacturing-capabilities/surface-finishing-color-coding/',
				image: '/images/fastener-coatings/07-surface-finishing-icon.webp',
				alt: 'Surface finishing icon',
				label: 'Finishing',
				title: 'Finishing and Grade Identification',
				description:
					'Finishes are assigned against the joint, so parts can be told apart by grade, by batch or by function on the assembly line.',
			},
			{
				href: '/contact/',
				image:
					'/images/category-detail-sealing-technology/08-proven-productivity-thumbs-up-icon-surrounded-by.svg',
				alt: 'Contact our factory',
				label: 'Contact',
				title: 'Send the Joint Detail',
				description:
					'Tell us the medium, the temperature and the fastener size. We will come back with the grade and finish we would run.',
			},
		],
	},
};
