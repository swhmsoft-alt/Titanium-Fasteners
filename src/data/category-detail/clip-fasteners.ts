/**
 * src/data/category-detail/clip-fasteners.ts
 *
 * 主题：钛合金紧固件 — 卡扣/夹持与线缆、面板固定所在的快速装拆场景。
 *
 * 参考站原文（Clip Fasteners，第三方卡扣/线夹品牌目录）与 BOZE 的源头工厂
 * 定位不符：本页改为钛紧固件在快拆、面板保持与线缆夹持工况中的角色 ——
 * 不锈钢卡扣会在海洋/化工介质中失效，而钛在介质中保持、同时仍保持弹性
 * 与夹持力；以及由此带来的牌号与表面处理选择。
 *
 * 维护说明：scripts/gen-category-detail.mjs 已不在仓库中，本文件现为手工维护。
 * 数值全部取自生成产物 src/data/products/materials.ts 与 finishes.ts；
 * 图片全部为本地已落盘资源；链接全部指向已发布路由。
 */
import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'clip-fasteners',
	seo: {
		title: 'Titanium Fasteners for Clip, Panel and Cable Retention',
		description:
			'Titanium screws, nuts and washers for quick-release panel, cable and hose retention in marine, chemical and cleanroom service. Grade 2 and Grade 5, with EN 10204 3.1 traceability.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Titanium Clip and Retention Fasteners' },
		],
		eyebrow: 'Titanium Fasteners',
		heading: 'Titanium Fasteners for Clip, Panel and Cable Retention',
		lead:
			'A clip has to be opened and closed again, and in seawater or process chemical it has to survive that. Titanium keeps the metal in the joint out of the corrosion reaction.',
		image: '/images/category-detail-clip-fasteners/titanium-clip-fasteners-hero.webp',
		imageAlt:
			'Titanium hook bracket machined to a customer drawing, used to retain panels, cables and hoses in corrosive service.',
		imageWidth: 1250,
		imageHeight: 1000,
		buttons: [
			{
				label: 'View Titanium Fasteners',
				href: '/products/',
				kind: 'link',
				variant: 'primary',
			},
			{ label: 'Send the Retention Detail', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro:
		'Retention hardware is a compromise between holding force and the ability to open it again. Titanium changes the arithmetic, because the usual failure mode — a steel clip that seizes or breaks — is a corrosion failure, and corrosion is where titanium performs best.',
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{
			kind: 'list',
			items: [
				{ lead: 'Grade against the medium.', text: 'Grade 2 for corrosion-led duty, Grade 5 where the clamp force is the requirement.' },
				{ lead: 'Surface condition.', text: 'Plain, passivated ASTM F86 / AMS 2700, or anodised AMS 2488 Type II and III.' },
				{ lead: 'Traceability.', text: 'EN 10204 3.1 certification, with the heat number carried on every lot.' },
			],
		},
		{ kind: 'heading', text: 'Where the titanium actually goes in a retention joint' },
		{
			kind: 'paragraph',
			text: 'We are a fastener factory, so the parts we supply in a retention assembly are the screw, the nut and the washer that close the joint, plus any custom bracket or clip body that is machined for the customer. The clip catalogue itself belongs to a different supplier, and so do the crimping tools. What the titanium changes is the fastener that goes through the clip, and the plate or bracket behind it — because that is where the galvanic couple and the seizing happen.',
		},
		{
			kind: 'paragraph',
			text: 'The reason to use titanium in this application is the environment rather than the weight. A stainless clip in seawater, in a wash-down environment or in a chemical process will pit, will gall against the panel it clamps, and will eventually seize at the point where it is opened for service. Grade 2 CP-Ti rates 4 of 5 on our published corrosion scale and does not form iron oxide rust, and it is available in a passivated condition so that the free-iron contamination that makes galling worse is removed.',
		},
		{
			kind: 'paragraph',
			text: 'Grade 5 Ti-6Al-4V is used where the retention has to hold real load — a cable cleat, a hose restraint, a panel that carries a load in service — and where a bolt through the clip has to take shear rather than just clamp. Its proof strength of 828 MPa means the fastener can stay the same size as the steel it replaces, which is the practical reason a titanium clip assembly does not have to be re-engineered around the material.',
		},
		{ kind: 'heading', text: 'Which grade and finish suit the service' },
		{
			kind: 'table',
			caption: 'Fastener selection for retention applications.',
			columns: ['Retention application', 'Grade', 'Finish', 'Fastener choice', 'What we control'],
			rows: [
				[
					'Panel and cover retention in wash-down areas',
					'Grade 2 CP-Ti',
					'Passivated ASTM F86',
					'DIN 912 socket head cap screw',
					'Free-iron contamination removed before the part is packed',
				],
				[
					'Cable cleats and cable tray fittings',
					'Grade 5 Ti-6Al-4V',
					'Plain or passivated',
					'DIN 933 hex head bolt with DIN 934 nut',
					'Torque coefficient measured per lot for the quoted value',
				],
				[
					'Hose and tube restraint',
					'Grade 5 Ti-6Al-4V',
					'Plain, passivated or PVD',
					'DIN 6921 flange bolt',
					'Integrated washer base spreads the clamp on a soft or thin seat',
				],
				[
					'Marine deck and hull equipment',
					'Grade 2 CP-Ti',
					'Plain or passivated',
					'DIN 939 double end stud with nut and washer',
					'Same heat for stud, nut and washer where the lot allows',
				],
				[
					'Cleanroom and medical device housings',
					'Grade 23 Ti-6Al-4V ELI',
					'Passivated ASTM F86',
					'DIN 7991 countersunk head cap screw',
					'ELI grade verified by XRF/PMI and filed against the lot',
				],
				[
					'High temperature process or engine bay',
					'Grade 9 Ti-3Al-2.5V',
					'Plain or passivated',
					'DIN 931 partial thread hex head bolt',
					'Grade 9 rated to 600 °C on our published data',
				],
			],
		},
		{
			kind: 'paragraph',
			text: 'Surface condition on a retention joint is chosen by how often it is opened. A joint that is opened and closed on a schedule wants a dry-film anti-galling coating, because galling rather than corrosion is what will make it impossible to undo. A joint that is closed once and left alone wants the plain or passivated condition, which has nothing to wear out and nothing to renew.',
		},
		{
			kind: 'paragraph',
			text: 'Where the retention hardware itself is a custom part — a hook bracket, a clamp plate, a cleat body — we machine it from your drawing on the CNC route, in the grade and finish that matches the fastener going into it. Every lot that leaves the shop carries the EN 10204 3.1 certificate for the heat it was cut from.',
			link: {
				label: 'See the grade supply matrix',
				href: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
			},
		},
	],
	brands: {
		heading: 'The titanium parts that close a retention joint',
		tiles: [
			{
				href: '/products/screws/hex-socket-head-cap-screw/',
				image: '/images/products/TI-HEX-SOCKET-HEAD-CAP-SCREW-BZ-201-screws-titanium.webp',
				alt: 'Titanium hexagon socket head cap screws in Grade 2 and Grade 5.',
				label: 'Fasteners',
				title: 'Titanium Socket Head Cap Screws',
				description:
					'DIN 912 full thread — the fastener that goes through a clip or panel and has to be reopened.',
			},
			{
				href: '/products/bolts/hexagon-flange-bolts/',
				image: '/images/products/TI-HEXAGON-FLANGE-BOLTS-BZ-105-bolts-titanium.webp',
				alt: 'Titanium hexagon flange bolts with integrated washer bases.',
				label: 'Fasteners',
				title: 'Titanium Flange Bolts',
				description:
					'DIN 6921 flange bolts — one part and one clamp face for cable cleats and hose restraints.',
			},
			{
				href: '/products/bolts/double-end-stud-bolts/',
				image: '/images/products/TI-DOUBLE-END-STUD-BOLTS-BZ-110-bolts-titanium.webp',
				alt: 'Titanium double end stud bolts for marine equipment retention.',
				label: 'Fasteners',
				title: 'Titanium Double End Stud Bolts',
				description:
					'DIN 938 and DIN 939 studs for deck and hull equipment installed from one side.',
			},
			{
				href: '/products/washers/plain-washers/',
				image: '/images/products/TI-PLAIN-WASHERS-BZ-401-washers-titanium.webp',
				alt: 'Titanium plain washers stacked on a white background.',
				label: 'Fasteners',
				title: 'Titanium Plain Washers',
				description:
					'Form A to DIN 125 and ISO 7089 — the element that spreads the clamp on a soft or thin seat.',
			},
		],
	},
	note: {
		text: 'Availability, minimum order and lead time depend on diameter, length, grade and finish.',
		linkLabel: 'Send us the retention detail',
		linkHref: '/contact/',
		linkSuffix:
			' — we will confirm what can be produced from stock, what is made to order, and the grade and finish we would run.',
	},
	services: {
		cards: [
			{
				href: '/product-solutions/special-parts-and-custom-fasteners/',
				image: '/images/fastener-coatings/07-surface-finishing-icon.webp',
				alt: 'Special parts icon',
				label: 'Special Parts',
				title: 'Custom Retention Hardware',
				description:
					'Clip bodies, cleats and brackets machined in titanium to your drawing.',
			},
			{
				href: '/product-solutions/components-specific-solutions/fastener-coatings/',
				image: '/images/fastener-coatings/06-fastener-finish-icon.webp',
				alt: 'Fastener finish icon',
				label: 'Surface Treatments',
				title: 'Passivation and Anodising',
				description:
					'ASTM F86 and AMS 2700 passivation, and AMS 2488 Type II and Type III anodising for the thread.',
			},
			{
				href: '/contact/',
				image: '/images/product-categories-and-brands/16-fasteners-icon.svg',
				alt: 'Contact our factory',
				label: 'Contact',
				title: 'Send the Retention Detail',
				description:
					'Tell us the medium, the clamp load and the service interval. We will come back with the grade we would run.',
			},
		],
	},
};
