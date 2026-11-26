/**
 * src/data/category-detail/threaded-inserts.ts
 *
 * 主题：钛合金紧固件 — 螺纹衬套所在的轻材料/复合件连接（以及本厂机加螺纹件）。
 *
 * 参考站原文（Threaded Inserts，第三方黄铜/钢丝衬套品牌目录）与 BOZE 的源头
 * 工厂定位不符：本页改为钛紧固件在轻材料与复合材料连接中的角色 —— 用可拆
 * 螺纹件替代一次性螺纹、钛衬套与螺纹件的热处理/表面要求、以及与嵌件配合
 * 的紧固件选择。
 *
 * 维护说明：scripts/gen-category-detail.mjs 已不在仓库中，本文件现为手工维护。
 * 数值全部取自生成产物 src/data/products/materials.ts 与 finishes.ts；
 * 图片全部为本地已落盘资源；链接全部指向已发布路由。
 */
import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'threaded-inserts',
	seo: {
		title: 'Titanium Threaded Inserts and Studs for Light Materials',
		description:
			'Titanium studs, screws, nuts and washers for aluminium, magnesium and composite parts where a strong, reusable thread is needed. Grade 2 and Grade 5, with EN 10204 3.1 traceability.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Titanium Threaded Inserts' },
		],
		eyebrow: 'Titanium Fasteners',
		heading: 'Titanium Threaded Inserts and Studs for Light Materials',
		lead:
			'Aluminium and composites cannot hold a thread for long. A titanium insert or stud gives the joint a thread that can be used, reused and still be traced.',
		image: '/images/category-detail-threaded-inserts/titanium-threaded-inserts-hero.webp',
		imageAlt:
			'CNC turned titanium threaded cylinder showing the machined thread and the turned body of a small titanium component.',
		imageWidth: 1250,
		imageHeight: 1000,
		buttons: [
			{
				label: 'View Titanium Fasteners',
				href: '/products/',
				kind: 'link',
				variant: 'primary',
			},
			{ label: 'Send the Material Detail', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro:
		'A thread in soft metal or in a laminate is a thread with a limited number of uses in it. The engineering answer is to move the thread into something stronger — an insert, a boss, or a stud — and then to decide what that thread has to resist.',
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{
			kind: 'list',
			items: [
				{ lead: 'Grade against the insert.', text: 'Grade 2 for corrosion-led duty, Grade 5 where the fastener carries the joint.' },
				{ lead: 'Machined to drawing.', text: 'Inserts and bosses machined from bar stock on the CNC route, in the grade you specify.' },
				{ lead: 'Traceability.', text: 'EN 10204 3.1 certification, with the heat number carried on every lot.' },
			],
		},
		{ kind: 'heading', text: 'What we actually make' },
		{
			kind: 'paragraph',
			text: 'We are a fastener factory, so the catalogue parts we bring to this application are the stud, the screw, the nut and the washer that engage with the insert. The insert itself — brass, steel or titanium — is a purchased component that the customer specifies against its own base material, and its press-in or heat-set tooling belongs to the assembly line. Where the design calls for a titanium insert, or for a machined boss, we produce it on the CNC route from bar stock to the customer’s drawing.',
		},
		{
			kind: 'paragraph',
			text: 'The choice of insert material decides how the fastener has to behave. A steel insert in an aluminium part is strong and stiff, and it makes the aluminium around it the corroding party unless it is isolated. A titanium insert in an aluminium part removes that galvanic step, and the joint then behaves as a titanium-to-aluminium joint, which is exactly what the material rules for the rest of the assembly already assume. Where the insert is titanium, the screw going into it should be titanium as well, so that the thread pair does not gall on assembly.',
		},
		{
			kind: 'paragraph',
			text: 'This is also where a titanium stud earns its place. A stud carries the load along its length instead of concentrating it in the thread of the base material, it can be installed from one side, and it lets the nut be the part that is removed. Where the base material is a laminate, the load path is in the fastener and the laminate is only clamped.',
		},
		{ kind: 'heading', text: 'Which fastener and grade suit the base material' },
		{
			kind: 'table',
			caption: 'Fastener selection by base material and insert type.',
			columns: ['Base material', 'Thread strategy', 'Grade', 'Fastener choice', 'What we control'],
			rows: [
				[
					'Cast aluminium housing',
					'Threaded insert, steel or titanium',
					'Grade 5 Ti-6Al-4V',
					'DIN 912 socket head cap screw',
					'Same grade offered for insert and screw so the thread pair matches',
				],
				[
					'Extruded aluminium frame',
					'Machined boss or threaded insert',
					'Grade 2 CP-Ti',
					'DIN 933 hex head bolt with DIN 934 nut',
					'Bearing area and thread engagement agreed with the drawing',
				],
				[
					'Magnesium or aluminium-lithium housing',
					'Titanium insert, no steel in the joint',
					'Grade 2 CP-Ti',
					'DIN 7991 countersunk head cap screw',
					'No steel contact surfaces in the thread pair',
				],
				[
					'FRP, CFRP and sandwich panels',
					'Threaded insert in the panel or sub-frame',
					'Grade 2 CP-Ti',
					'DIN 6921 flange bolt',
					'Integrated washer base spreads the clamp over a thin panel',
				],
				[
					'Medical device bodies',
					'ELI grade insert and fastener',
					'Grade 23 Ti-6Al-4V ELI',
					'DIN 938 double end stud',
					'ELI grade verified by XRF/PMI and filed against the lot',
				],
				[
					'Marine and splash-zone equipment',
					'Titanium insert, passivated',
					'Grade 2 CP-Ti',
					'DIN 934 full nut on DIN 939 stud',
					'Grade 2 rates 4 of 5 on our published corrosion scale',
				],
			],
		},
		{
			kind: 'paragraph',
			text: 'The surface on the thread that enters the insert is where the joint is made, so it is decided with the insert in mind. Passivation to ASTM F86 and AMS 2700 leaves a clean, uncoated surface with no free-iron contamination, and it is what keeps the titanium thread from seizing in the insert after the first assembly. Anodising to AMS 2488 Type II or Type III is used where parts have to be told apart by grade, by batch or by function. Where the joint is opened and closed repeatedly, a PVD or DLC dry-film coating suppresses galling on the thread.',
		},
		{
			kind: 'paragraph',
			text: 'Every lot that leaves the shop carries the EN 10204 3.1 certificate for the heat it was cut from, and the grade is verified by XRF/PMI before dispatch. Inserts, bosses and studs that are not catalogue items are machined from your drawing, with the same material and traceability rules applied.',
			link: {
				label: 'See the grade supply matrix',
				href: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
			},
		},
	],
	brands: {
		heading: 'The titanium parts that carry the thread',
		tiles: [
			{
				href: '/products/bolts/double-end-stud-bolts/',
				image: '/images/products/TI-DOUBLE-END-STUD-BOLTS-BZ-110-bolts-titanium.webp',
				alt: 'Titanium double end stud bolts for light-alloy assemblies.',
				label: 'Fasteners',
				title: 'Titanium Double End Stud Bolts',
				description:
					'DIN 938 and DIN 939 studs — the load-carrying thread for parts that cannot hold one themselves.',
			},
			{
				href: '/products/screws/hex-socket-head-cap-screw/',
				image: '/images/products/TI-HEX-SOCKET-HEAD-CAP-SCREW-BZ-201-screws-titanium.webp',
				alt: 'Titanium hexagon socket head cap screws in Grade 2 and Grade 5.',
				label: 'Fasteners',
				title: 'Titanium Socket Head Cap Screws',
				description:
					'DIN 912 full thread for engaging an insert without a protruding head.',
			},
			{
				href: '/products/bolts/hexagon-flange-bolts/',
				image: '/images/products/TI-HEXAGON-FLANGE-BOLTS-BZ-105-bolts-titanium.webp',
				alt: 'Titanium hexagon flange bolts with integrated washer bases.',
				label: 'Fasteners',
				title: 'Titanium Flange Bolts',
				description:
					'DIN 6921 flange bolts that spread the clamp over thin or cast sections.',
			},
			{
				href: '/products/nuts/hex-nut/',
				image: '/images/products/TI-HEX-NUT-BZ-301-nuts-titanium.webp',
				alt: 'Titanium hexagon full nuts in Grade 2 and Grade 5.',
				label: 'Fasteners',
				title: 'Titanium Hexagon Nuts',
				description:
					'DIN 934 full nuts — the reusable side of a stud joint in light materials.',
			},
		],
	},
	note: {
		text: 'Availability, minimum order and lead time depend on diameter, length, grade and finish.',
		linkLabel: 'Send us the base material and the insert detail',
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
					'Titanium inserts, bosses and studs machined from your drawing, from samples through to series.',
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
				title: 'Send the Material Detail',
				description:
					'Tell us the base material, the insert and the quantity. We will come back with the grade we would run.',
			},
		],
	},
};
