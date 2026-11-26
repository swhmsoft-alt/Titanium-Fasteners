/**
 * src/data/category-detail/rivet-technology.ts
 *
 * 主题：钛合金紧固件 — 铆接/盲铆与永久连接所在的薄板结构（钛在航空与医疗
 * 结构件中的铆接应用，以及本厂可提供的紧固件替代路径）。
 *
 * 参考站原文（Rivet Technology，第三方铆钉与抽芯铆螺母品牌目录）与 BOZE 的
 * 源头工厂定位不符：本页改为钛紧固件在永久性薄板/蒙皮连接中的角色 ——
 * 可拆与不可拆两条路线，以及各自的牌号、表面处理与工艺约束。
 *
 * 维护说明：scripts/gen-category-detail.mjs 已不在仓库中，本文件现为手工维护。
 * 数值全部取自生成产物 src/data/products/materials.ts 与 finishes.ts；
 * 图片全部为本地已落盘资源；链接全部指向已发布路由。
 */
import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'rivet-technology',
	seo: {
		title: 'Titanium Fasteners for Riveted and Permanent Sheet Joints',
		description:
			'Titanium studs, bolts, nuts and washers for permanent and semi-permanent sheet joints in aerospace, medical and process equipment. Grade 2 and Grade 5, with EN 10204 3.1 traceability.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Titanium Riveted and Permanent Joints' },
		],
		eyebrow: 'Titanium Fasteners',
		heading: 'Titanium Fasteners for Riveted and Permanent Sheet Joints',
		lead:
			'A rivet line is a permanent joint. Where the drawing needs a fastener that stays put, the grade and the surface have to be decided before the tool ever touches the sheet.',
		image: '/images/category-detail-rivet-technology/titanium-rivet-technology-hero.webp',
		imageAlt:
			'Punched and bent titanium sheet component showing the formed edge and the machined titanium fastener used to secure it.',
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
		'Riveting, clinching and bonding all solve the same problem: how do you make a joint in thin sheet that does not depend on a thread the sheet cannot hold? In titanium the fastener has to carry the joint without the sheet contributing much.',
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{
			kind: 'list',
			items: [
				{ lead: 'Grade against the sheet.', text: 'Grade 2 for corrosion-led duty, Grade 5 where the fastener carries the joint.' },
				{ lead: 'Surface condition.', text: 'Plain, passivated ASTM F86 / AMS 2700, or anodised AMS 2488 Type II and III.' },
				{ lead: 'Traceability.', text: 'EN 10204 3.1 certification, with the heat number carried on every lot.' },
			],
		},
		{ kind: 'heading', text: 'Permanent or serviceable — the decision comes first' },
		{
			kind: 'paragraph',
			text: 'We are a fastener factory, so the parts we control are the bolt, the stud, the nut and the washer. Rivets, blind rivets and blind rivet nuts, and the clinching tools that set them, belong to the customer’s assembly line. What we supply is the fastener that the joint is specified around — and in a titanium structure that fastener is often the one carrying the load, because the sheet is aluminium and the aluminium is not going to carry much.',
		},
		{
			kind: 'paragraph',
			text: 'That is why the grade decision is made on the fastener rather than on the sheet. Grade 5 Ti-6Al-4V, at 828 MPa proof strength, is the default where the joint is structural or highly loaded. Grade 2 CP-Ti, at 275 MPa proof strength, is the choice where the environment decides the outcome and the joint is light: Grade 2 rates 4 of 5 on our published corrosion scale, and it is ductile enough to be formed and clamped rather than cracked by a forming operation.',
		},
		{
			kind: 'paragraph',
			text: 'A permanent joint has consequences that a bolted joint does not. A titanium riveted joint cannot be opened for inspection without destroying it, so it is chosen where inspection is not required, or where a doubler and a bolt are used instead. Where the equipment has to be serviced — a filter housing, a heat exchanger cover, a process vessel — the same titanium fastener can be supplied as a bolted joint with a Grade 9 stud for elevated temperature, which is the same material in a serviceable form.',
		},
		{ kind: 'heading', text: 'Which grade and finish suit the joint' },
		{
			kind: 'table',
			caption: 'Fastener selection for permanent and semi-permanent sheet joints.',
			columns: ['Application', 'Grade', 'Finish', 'Fastener choice', 'What we control'],
			rows: [
				[
					'Aerospace skin and fairing attachment',
					'Grade 5 Ti-6Al-4V',
					'Anodised AMS 2488',
					'DIN 933 hex head bolt or DIN 912 socket head cap screw',
					'Anodic colour used to identify the grade on the assembly line',
				],
				[
					'Medical device housing and lid',
					'Grade 23 Ti-6Al-4V ELI',
					'Passivated ASTM F86',
					'DIN 7991 countersunk head cap screw',
					'ELI grade verified by XRF/PMI and filed against the lot',
				],
				[
					'Process equipment covers and filters',
					'Grade 2 CP-Ti',
					'Passivated ASTM F86',
					'DIN 939 double end stud with nut and washer',
					'Grade 2 rates 4 of 5 on our published corrosion scale',
				],
				[
					'Marine and splash-zone panels',
					'Grade 2 CP-Ti',
					'Plain or passivated',
					'DIN 6921 flange bolt',
					'Same heat for bolt and nut where the lot allows',
				],
				[
					'Composite panel and sandwich structure',
					'Grade 2 CP-Ti',
					'Anodised AMS 2488',
					'DIN 912 socket head cap screw into a threaded insert',
					'Bearing area checked against the insert, not the laminate',
				],
				[
					'High temperature process equipment',
					'Grade 9 Ti-3Al-2.5V',
					'Plain or passivated',
					'DIN 931 partial thread hex head bolt',
					'Grade 9 rated to 600 °C on our published data',
				],
			],
		},
		{
			kind: 'paragraph',
			text: 'Surface condition on a permanent joint is mostly about what happens during assembly and afterwards. Passivation to ASTM F86 and AMS 2700 leaves no coating and removes the free-iron contamination that machining can introduce, which matters most where the joint is opened for service. Anodising to AMS 2488 Type II or Type III produces a controlled anodic oxide, and it is the finish used where parts have to be told apart by grade, by batch or by function on the line.',
		},
		{
			kind: 'paragraph',
			text: 'Where a joint in thin titanium sheet has to be made to a shape that is not in our catalogue, we machine it on the CNC route from your drawing — punched, bent and machined components in titanium, with the same material and traceability rules as the catalogue parts.',
			link: {
				label: 'See the grade supply matrix',
				href: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
			},
		},
	],
	brands: {
		heading: 'The titanium parts that carry a permanent joint',
		tiles: [
			{
				href: '/products/bolts/double-end-stud-bolts/',
				image: '/images/products/TI-DOUBLE-END-STUD-BOLTS-BZ-110-bolts-titanium.webp',
				alt: 'Titanium double end stud bolts for through-bolted sheet joints.',
				label: 'Fasteners',
				title: 'Titanium Double End Stud Bolts',
				description:
					'DIN 938 and DIN 939 studs — the through-bolt that closes a sheet joint without a thread in the sheet.',
			},
			{
				href: '/products/bolts/hex-socket-head-cap-bolts/',
				image: '/images/products/TI-HEX-SOCKET-HEAD-CAP-BOLTS-BZ-106-bolts-titanium.webp',
				alt: 'Titanium hex socket head cap bolts for aerospace and medical assemblies.',
				label: 'Fasteners',
				title: 'Titanium Socket Head Cap Bolts',
				description:
					'DIN 912 full thread for aerospace and medical assemblies where the head has to sit low.',
			},
			{
				href: '/products/screws/countersunk-head-cap-screws/',
				image: '/images/products/TI-COUNTERSUNK-HEAD-CAP-SCREWS-BZ-202-screws-titanium.webp',
				alt: 'Titanium countersunk head cap screws for flush mounting.',
				label: 'Fasteners',
				title: 'Titanium Countersunk Head Cap Screws',
				description:
					'DIN 7991 90-degree flat head — flush fasteners for skins and panels with a controlled surface profile.',
			},
			{
				href: '/products/nuts/hex-nut/',
				image: '/images/products/TI-HEX-NUT-BZ-301-nuts-titanium.webp',
				alt: 'Titanium hexagon full nuts in Grade 2 and Grade 5.',
				label: 'Fasteners',
				title: 'Titanium Hexagon Nuts',
				description:
					'DIN 934 full nuts on the clamped side of the joint, cut from the same heat as the bolt.',
			},
		],
	},
	note: {
		text: 'Availability, minimum order and lead time depend on diameter, length, grade and finish.',
		linkLabel: 'Send us the sheet and the joint detail',
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
				title: 'Punched, Bent and Machined Parts',
				description:
					'Non-catalogue titanium sheet and machined components produced to your drawing.',
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
				title: 'Send the Joint Detail',
				description:
					'Tell us the sheet material, the joint and the quantity. We will come back with the grade we would run.',
			},
		],
	},
};
