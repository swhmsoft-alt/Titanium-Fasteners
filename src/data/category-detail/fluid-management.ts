/**
 * src/data/category-detail/fluid-management.ts
 *
 * 主题：钛合金紧固件 — 流体管理（氢气等液/气介质）。
 *
 * 参考站原文（Fluid Management，第三方增压泵/快插接头品牌目录）与 BOZE 的
 * 源头工厂定位不符：本页改为钛紧固件在承载液/气介质（氢气、液氢、氧气、
 * 液压油、海水、工艺化学品、高温工艺气）中的角色 —— 法兰、阀体、歧管、
 * 换热器与试验台上的螺栓、螺母、垫圈及其对应的牌号、表面处理与可追溯要求。
 *
 * 维护说明：scripts/gen-category-detail.mjs 已不在仓库中，本文件现为手工维护。
 * 数值全部取自生成产物 src/data/products/materials.ts 与 finishes.ts；
 * 图片全部为本地已落盘资源；链接全部指向已发布路由。
 */
import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'fluid-management',
	seo: {
		title: 'Titanium Fasteners for Hydrogen and Fluid Media — Grade 2 / Grade 5',
		description:
			'Titanium bolts, studs, nuts and washers for hydrogen, cryogenic, oxygen, hydraulic and seawater service. Grade 2 and Grade 5, passivated or anodised, with EN 10204 3.1 traceability.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Titanium Fluid Management' },
		],
		eyebrow: 'Titanium Fasteners',
		heading: 'Titanium Fasteners for Hydrogen and Fluid Media',
		lead:
			'Hydrogen, cryogenic gas, oxygen and hydraulic media all load the fastener, not just the pipe. Grade 2 and Grade 5 titanium, finished and traced per lot.',
		image: '/images/category-detail-fluid-management/titanium-fluid-gas-fasteners-hero.webp',
		imageAlt:
			'Anodised titanium fasteners and washers arranged for a fluid handling assembly, showing the coloured anodic finish used for grade and batch identification.',
		imageWidth: 1250,
		imageHeight: 1000,
		buttons: [
			{
				label: 'View Titanium Fasteners',
				href: '/products/',
				kind: 'link',
				variant: 'primary',
			},
			{ label: 'Send the Medium Details', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro:
		'A fluid system is held together by its joints. What passes through the pipe — hydrogen at pressure, liquid hydrogen at cryogenic temperature, oxygen, hydraulic oil, seawater, aggressive process chemicals — decides which grade and which surface condition the fastener can carry.',
	/* 参考站的第三方视频与其品牌目录同源，已从本页移除：视频块仅在有缩略图时渲染。 */
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{
			kind: 'list',
			items: [
				{ lead: 'Grade against the medium.', text: 'Grade 2 for corrosion-led duty, Grade 5 where the joint is loaded.' },
				{ lead: 'Hydrogen control.', text: 'Controlled hydrogen content, no acid pickling, no electroplating on the part.' },
				{ lead: 'Traceability.', text: 'EN 10204 3.1 certification, with the heat number carried on every lot.' },
			],
		},
		{ kind: 'heading', text: 'Hydrogen service: the fastener is the safety part' },
		{
			kind: 'paragraph',
			text: 'In a hydrogen line the joint has to hold pressure and stay ductile at the same time. Titanium is not a shortcut here: hydrogen can enter the material and change its behaviour, so the fastener is specified with a controlled hydrogen content and a controlled surface. We do not acid pickle and we do not electroplate titanium fasteners, because both processes are a route for hydrogen to enter the part. Where a component has been chemically machined, alpha-case is removed chemically rather than by pickling.',
		},
		{
			kind: 'paragraph',
			text: 'The same discipline applies to the surface. Passivation to ASTM F86 and AMS 2700 leaves a clean, uncoated surface with no free-iron contamination. Anodising to AMS 2488 Type II or Type III gives a controlled anodic oxide, and it is the finish used where parts have to be told apart by grade, by batch or by function on the assembly line. On a hydrogen or oxygen installation, that identification is a safety function rather than a convenience.',
		},
		{
			kind: 'paragraph',
			text: 'Tightening is decided with the material as well as the joint. Titanium is soft, it is prone to galling against itself, and its preload behaviour is not the preload behaviour of the steel torque tables a fitter already has in hand. Where titanium meets titanium and the joint is opened repeatedly, a dry-film or PVD anti-galling finish is the practical answer, and the assembly is torqued to a calibrated value with the angle method rather than with a copied steel number.',
		},
		{ kind: 'heading', text: 'Which medium decides which grade and finish' },
		{
			kind: 'table',
			caption: 'Fastener selection by service medium.',
			columns: ['Medium', 'Where it is used', 'Grade', 'Finish', 'What we control'],
			rows: [
				[
					'Hydrogen, gaseous, high pressure',
					'Piping, valve flanges, compression and regulating stations',
					'Grade 5 Ti-6Al-4V',
					'Anodised AMS 2488',
					'Hydrogen content controlled; no acid pickling, no electroplating',
				],
				[
					'Liquid hydrogen, cryogenic',
					'Cryogenic valve joints, vessel and skid connections',
					'Grade 5 Ti-6Al-4V',
					'Passivated ASTM F86',
					'Cryogenic impact confirmed for each order before release',
				],
				[
					'Oxygen and oxygen-enriched gas',
					'Manifolds, regulators, instrument and sampling lines',
					'Grade 2 CP-Ti',
					'Passivated ASTM F86',
					'Oil-free handling and segregated, labelled lots',
				],
				[
					'Hydraulic and pneumatic media',
					'Manifolds, blocks, cylinders, test rigs',
					'Grade 5 Ti-6Al-4V',
					'Plain or passivated',
					'Torque coefficient measured per lot; dry-film anti-galling on request',
				],
				[
					'Seawater, cooling water, brine',
					'Heat exchangers, pipework, pumps, screens',
					'Grade 2 CP-Ti',
					'Plain or passivated',
					'Grade 2 rates 4 of 5 and Grade 5 rates 5 of 5 on our published corrosion scale',
				],
				[
					'Aggressive process chemicals',
					'Dosing skids, reactors, transfer pumps',
					'Grade 2 CP-Ti',
					'Passivated ASTM F86',
					'Grade selected against the specific medium, not against a price list',
				],
				[
					'Elevated temperature process gas',
					'Furnace, dryer and thermal process service',
					'Grade 9 Ti-3Al-2.5V',
					'Plain or passivated',
					'Grade 9 rated to 600 °C, Grade 5 to 315 °C on our published data',
				],
			],
		},
		{
			kind: 'paragraph',
			text: 'One warning belongs on the same page. Titanium is the more noble metal in almost every pair it will meet, so in a joint with aluminium or with carbon steel it becomes the cathode and can accelerate corrosion of the other metal. Titanium washers are not electrical insulators, and a titanium fastener does not by itself protect an aluminium substructure. Where dissimilar metals have to be combined, the joint is designed with that in mind, not with the fastener label.',
		},
		{
			kind: 'paragraph',
			text: 'The lots behind these parts are traceable. Each shipment carries the EN 10204 3.1 certificate for the heat it was cut from, the material is verified by XRF/PMI before it leaves the shop, and the packaging is specified so that grades are not mixed on a distributor shelf or on an OEM bench. Chemical and corrosion service is covered in more detail on our chemical and corrosion application page, and the grades we hold are listed in the grade supply matrix.',
			link: {
				label: 'See the grade supply matrix',
				href: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
			},
		},
	],
	brands: {
		heading: 'The titanium parts that carry the fluid load',
		tiles: [
			{
				href: '/products/bolts/double-end-stud-bolts/',
				image: '/images/products/TI-DOUBLE-END-STUD-BOLTS-BZ-110-bolts-titanium.webp',
				alt: 'Titanium double end stud bolts for high-pressure flange joints.',
				label: 'Fasteners',
				title: 'Titanium Double End Stud Bolts',
				description:
					'DIN 938 and DIN 939 studs for flanged pressure joints — the through-bolt that closes a hydrogen or chemical line.',
			},
			{
				href: '/products/bolts/hexagon-flange-bolts/',
				image: '/images/products/TI-HEXAGON-FLANGE-BOLTS-BZ-105-bolts-titanium.webp',
				alt: 'Titanium hexagon flange bolts with integrated washer bases.',
				label: 'Fasteners',
				title: 'Titanium Flange Bolts',
				description:
					'DIN 6921 flange bolts with an integrated washer base — one part, one sealing face, no separate washer to lose.',
			},
			{
				href: '/products/nuts/hex-nut/',
				image: '/images/products/TI-HEX-NUT-BZ-301-nuts-titanium.webp',
				alt: 'Titanium hexagon full nuts in Grade 2 and Grade 5.',
				label: 'Fasteners',
				title: 'Titanium Hexagon Nuts',
				description:
					'DIN 934 full nuts on the clamped side of the joint, cut from the same heat as the bolt where the lot allows.',
			},
			{
				href: '/products/washers/plain-washers/',
				image: '/images/products/TI-PLAIN-WASHERS-BZ-401-washers-titanium.webp',
				alt: 'Titanium plain washers stacked on a white background.',
				label: 'Fasteners',
				title: 'Titanium Plain Washers',
				description:
					'Form A to DIN 125 and ISO 7089 — the element that spreads the load and defines the sealing face under the bolt head.',
			},
		],
	},
	note: {
		text: 'Availability, minimum order and lead time depend on diameter, length, grade and finish.',
		linkLabel: 'Send us the medium and the joint detail',
		linkHref: '/contact/',
		linkSuffix:
			' — we will confirm what can be produced from stock, what is made to order, and the grade and finish we would run.',
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
					'/images/category-detail-fluid-management/05-proven-productivity-thumbs-up-icon-surrounded-by.svg',
				alt: 'Contact our factory',
				label: 'Contact',
				title: 'Send the Medium Details',
				description:
					'Tell us the medium, the pressure, the temperature and the fastener size. We will come back with the grade and finish we would run.',
			},
		],
	},
};
