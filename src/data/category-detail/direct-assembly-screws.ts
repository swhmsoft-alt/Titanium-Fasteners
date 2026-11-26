/**
 * src/data/category-detail/direct-assembly-screws.ts
 *
 * 主题：钛合金紧固件 — 直接装配（免垫/免攻丝装配、板材与轻合金连接）。
 *
 * 参考站原文（Direct Assembly Screws，第三方自钻/自攻螺钉品牌目录）与 BOZE
 * 的源头工厂定位不符：本页改为钛紧固件在"一次装配到位"工况中的角色 ——
 * 钛螺钉在薄板、铝与复合材料基体上的直接装配，以及牌号、表面处理与装配
 * 工艺上必须处理的两件事：钛自身的冷焊/咬死，以及与被连接件的电流腐蚀。
 *
 * 维护说明：scripts/gen-category-detail.mjs 已不在仓库中，本文件现为手工维护。
 * 数值全部取自生成产物 src/data/products/materials.ts 与 finishes.ts；
 * 图片全部为本地已落盘资源；链接全部指向已发布路由。
 */
import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'direct-assembly-screws',
	seo: {
		title: 'Titanium Fasteners for Direct Assembly — Screws, Nuts and Studs',
		description:
			'Titanium screws, studs and nuts for direct assembly into sheet metal, aluminium and composites. Grade 2 and Grade 5, plain, passivated or anodised, with EN 10204 3.1 traceability.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Titanium Direct Assembly' },
		],
		eyebrow: 'Titanium Fasteners',
		heading: 'Titanium Fasteners for Direct Assembly',
		lead:
			'One part, one tool, one joint. Titanium screws that go straight into sheet, aluminium or composite, supplied in the grade and finish the base material dictates.',
		image: '/images/category-detail-direct-assembly-screws/titanium-direct-assembly-screws-hero.webp',
		imageAlt:
			'Titanium screws and fasteners produced for direct assembly, laid out with the tools and parts used for one-shot installation.',
		imageWidth: 1250,
		imageHeight: 1000,
		buttons: [
			{
				label: 'View Titanium Fasteners',
				href: '/products/',
				kind: 'link',
				variant: 'primary',
			},
			{ label: 'Send the Assembly Detail', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro:
		'Direct assembly means the fastener creates the thread, or enters a prepared hole, in one operation. In titanium that decision is not free: the material is gummy, it seizes against itself, and it makes the other metal in the joint the corroding party.',
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{
			kind: 'list',
			items: [
				{ lead: 'Grade against the base material.', text: 'Grade 2 for corrosion-led duty, Grade 5 where the joint is loaded.' },
				{ lead: 'Surface condition.', text: 'Plain, passivated ASTM F86 / AMS 2700, or anodised AMS 2488 Type II and III.' },
				{ lead: 'Traceability.', text: 'EN 10204 3.1 certification, with the heat number carried on every lot.' },
			],
		},
		{ kind: 'heading', text: 'Where a titanium screw is actually installed' },
		{
			kind: 'paragraph',
			text: 'We are a fastener factory, so we supply the titanium parts that go into the joint rather than the tooling that drives them. The direct-assembly work we serve is the work where a screw has to form or enter its own thread in a thin or light base: sheet metal enclosures, aluminium frames, composite panels, heat exchanger covers and cleanroom housings. In those applications the fastener is often the only part of the assembly that was specified by grade, because everything else was bought as a sheet or an extrusion.',
		},
		{
			kind: 'paragraph',
			text: 'The grade follows the load, not the base material. Grade 5 Ti-6Al-4V is the engineering default for a screwed joint because its proof strength of 828 MPa leaves room for the thread to be the weak point rather than the shank. Grade 2 CP-Ti, at 275 MPa proof strength, is the right answer where the joint is thin, lightly loaded, and the environment is the deciding factor rather than the force. Grade 23, the ELI variant, is used where the part is also a medical implant or is exposed to seawater under our published test data.',
		},
		{
			kind: 'paragraph',
			text: 'Two practical consequences follow from working with titanium on the assembly line. First, galling: titanium rubs against itself and against aluminium under preload, and it will pick up at the thread rather than slide. Second, galvanic behaviour: titanium is the more noble metal in almost every pairing it will meet, so in a titanium-to-aluminium joint the aluminium is the one that corrodes, and a titanium fastener does not by itself protect it.',
		},
		{ kind: 'heading', text: 'Which grade and finish suit the base material' },
		{
			kind: 'table',
			caption: 'Fastener selection by base material and load.',
			columns: ['Base material', 'Typical joint', 'Grade', 'Finish', 'What we control'],
			rows: [
				[
					'Aluminium, wrought or cast',
					'Frames, housings, heat exchanger covers',
					'Grade 5 Ti-6Al-4V',
					'Plain or passivated',
					'Pilot and thread engagement agreed with the machining drawing',
				],
				[
					'Low carbon or stainless steel',
					'Brackets, covers, general industrial assemblies',
					'Grade 5 Ti-6Al-4V',
					'Plain, passivated or PVD',
					'Dry-film anti-galling finish available for repeated assembly',
				],
				[
					'Sheet metal, thin gauge',
					'Panels, guards, enclosures',
					'Grade 2 CP-Ti',
					'Passivated ASTM F86',
					'Head form and thread length sized to the sheet gauge',
				],
				[
					'FRP, CFRP and sandwich panels',
					'Access covers, equipment mounts, interior panels',
					'Grade 2 CP-Ti',
					'Anodised AMS 2488',
					'Counterbore depth and washer face checked against the insert',
				],
				[
					'Seawater and splash-zone service',
					'Deck and hull equipment, filtration frames',
					'Grade 2 CP-Ti',
					'Plain or passivated',
					'Grade 2 rates 4 of 5 on our published corrosion scale',
				],
				[
					'Elevated temperature process',
					'Furnace and dryer frames, exhaust hardware',
					'Grade 9 Ti-3Al-2.5V',
					'Plain or passivated',
					'Grade 9 rated to 600 °C, Grade 5 to 315 °C on our published data',
				],
			],
		},
		{
			kind: 'paragraph',
			text: 'The surface is decided per joint rather than per order. A chemical passivation to ASTM F86 and AMS 2700 leaves no coating and removes the free-iron contamination that machining can introduce, which is what keeps a titanium thread from seizing after assembly. Anodising to AMS 2488 Type II or Type III produces a controlled anodic oxide and is the finish used where parts have to be told apart by grade, by batch or by function on the assembly line. Where a joint is opened and closed repeatedly, a PVD or DLC dry-film coating is available to suppress galling.',
		},
		{
			kind: 'paragraph',
			text: 'Every lot that leaves the shop carries the EN 10204 3.1 certificate for the heat it was cut from, and the grade is verified by XRF/PMI before dispatch, so the grade named on the certificate is the grade that arrives on the bench. The grades we hold and the standards behind them are listed in the grade supply matrix, and the finish decision is covered on our fastener coatings page.',
			link: {
				label: 'See the grade supply matrix',
				href: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
			},
		},
	],
	brands: {
		heading: 'The titanium parts that go into a direct-assembled joint',
		tiles: [
			{
				href: '/products/screws/hex-socket-head-cap-screw/',
				image: '/images/products/TI-HEX-SOCKET-HEAD-CAP-SCREW-BZ-201-screws-titanium.webp',
				alt: 'Titanium hexagon socket head cap screws in Grade 2 and Grade 5.',
				label: 'Fasteners',
				title: 'Titanium Socket Head Cap Screws',
				description:
					'DIN 912 full thread — the general direct-assembly screw for covers, housings and frames.',
			},
			{
				href: '/products/screws/countersunk-head-cap-screws/',
				image: '/images/products/TI-COUNTERSUNK-HEAD-CAP-SCREWS-BZ-202-screws-titanium.webp',
				alt: 'Titanium countersunk head cap screws for flush mounting.',
				label: 'Fasteners',
				title: 'Titanium Countersunk Head Cap Screws',
				description:
					'DIN 7991 90-degree flat head — flush mounting where the surface profile matters.',
			},
			{
				href: '/products/bolts/double-end-stud-bolts/',
				image: '/images/products/TI-DOUBLE-END-STUD-BOLTS-BZ-110-bolts-titanium.webp',
				alt: 'Titanium double end stud bolts for through-bolted assemblies.',
				label: 'Fasteners',
				title: 'Titanium Double End Stud Bolts',
				description:
					'DIN 938 and DIN 939 studs for through-bolted joints and thin-walled assemblies.',
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
		linkLabel: 'Send us the base material and the joint detail',
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
					'ASTM F86 and AMS 2700 passivation, and AMS 2488 Type II and Type III anodising for the thread.',
			},
			{
				href: '/services/compliance-packaging/pmi-xrf-grade-verification/',
				image: '/images/fastener-coatings/07-surface-finishing-icon.webp',
				alt: 'Surface finishing icon',
				label: 'Quality',
				title: '100% PMI / XRF Grade Verification',
				description:
					'Every part is screened by spectrometer before dispatch, so the grade on the certificate is the grade that arrives.',
			},
			{
				href: '/contact/',
				image: '/images/product-categories-and-brands/16-fasteners-icon.svg',
				alt: 'Contact our factory',
				label: 'Contact',
				title: 'Send the Assembly Detail',
				description:
					'Tell us the base material, the thread and the quantity. We will come back with the grade and finish we would run.',
			},
		],
	},
};
