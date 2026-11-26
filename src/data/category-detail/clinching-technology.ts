/**
 * src/data/category-detail/clinching-technology.ts
 *
 * 主题：钛合金紧固件 — 薄板与复合结构上的永久性/一次性装配（含压铆、自夹紧件
 * 所在的薄壁连接场景）。
 *
 * 参考站原文（Clinching Technology，第三方自夹紧件品牌目录）与 BOZE 的源头
 * 工厂定位不符：本页改为钛紧固件在薄壁、钣金与复合结构中的角色 —— 如何用
 * 机械连接替代焊接、以及钛件在其中的牌号、表面处理与装配工艺选择。
 *
 * 维护说明：scripts/gen-category-detail.mjs 已不在仓库中，本文件现为手工维护。
 * 数值全部取自生成产物 src/data/products/materials.ts 与 finishes.ts；
 * 图片全部为本地已落盘资源；链接全部指向已发布路由。
 */
import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'clinching-technology',
	seo: {
		title: 'Titanium Fasteners for Thin Sheet and Composite Assemblies',
		description:
			'Titanium bolts, screws, studs and nuts for thin sheet metal, aluminium and composite assemblies where a permanent or one-shot joint is required. Grade 2 and Grade 5, with EN 10204 3.1 traceability.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Titanium Thin-Sheet Assembly' },
		],
		eyebrow: 'Titanium Fasteners',
		heading: 'Titanium Fasteners for Thin-Sheet and Composite Assemblies',
		lead:
			'Thin sheet has no thread depth to lose and no heat tolerance to waste. Titanium mechanical joints put the strength in the fastener, not in the base.',
		image: '/images/category-detail-clinching-technology/titanium-clinching-technology-hero.webp',
		imageAlt:
			'CNC machined titanium parts produced for thin-walled assemblies, showing the machined faces and threads of small titanium components.',
		imageWidth: 1250,
		imageHeight: 1000,
		buttons: [
			{
				label: 'View Titanium Fasteners',
				href: '/products/',
				kind: 'link',
				variant: 'primary',
			},
			{ label: 'Send the Sheet Detail', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro:
		'Thin sheet, aluminium panel and composite panel all fail in the same way: there is nothing left for a thread to be cut into, and nothing that can be welded without distortion. The joint has to be carried by the fastener.',
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{
			kind: 'list',
			items: [
				{ lead: 'Grade against the panel.', text: 'Grade 2 for corrosion-led duty, Grade 5 where the joint is loaded.' },
				{ lead: 'Head and thread form.', text: 'Heads sized to the sheet gauge so the bearing face does not dimple the panel.' },
				{ lead: 'Traceability.', text: 'EN 10204 3.1 certification, with the heat number carried on every lot.' },
			],
		},
		{ kind: 'heading', text: 'The joint, not the tool' },
		{
			kind: 'paragraph',
			text: 'We are a fastener factory, so we supply the titanium parts that hold a panel together. Press-in and self-clinching elements, blind rivets and the setting tools that drive them belong to the assembly process, not to the fastener, and they are specified by the customer’s own line. What we control is the part that stays in the joint afterwards: its grade, its surface condition and its geometry.',
		},
		{
			kind: 'paragraph',
			text: 'That distinction matters on thin sheet because the panel is the weak element. A titanium fastener that is too hard for the sheet will dimple it, and a sheet that has been dimpled cannot take a second assembly. Grade 2 CP-Ti, with its 275 MPa proof strength, is often the correct answer on thin aluminium and stainless sheet where the environment, not the load, sets the requirement. Grade 5 Ti-6Al-4V, at 828 MPa proof strength, is used where the fastener itself has to carry the load — and then the sheet gauge and the bearing area have to be worked out rather than assumed.',
		},
		{
			kind: 'paragraph',
			text: 'There is a second reason to reach for a mechanical joint in titanium rather than a welded one: heat. Titanium’s melting point and its poor thermal conductivity make welding a specialised operation with its own shielding and contamination controls, and a welded titanium joint cannot be taken apart for service. A bolted joint can. In aerospace, medical and cleanroom assemblies that reversibility is often the deciding requirement rather than the strength.',
		},
		{ kind: 'heading', text: 'Which joint fits the base material' },
		{
			kind: 'table',
			caption: 'Fastener and joint selection by base material.',
			columns: ['Base material', 'Joint normally used', 'Grade', 'Fastener choice', 'What we control'],
			rows: [
				[
					'Thin aluminium sheet',
					'Screw into a prepared hole, or a through-bolted joint',
					'Grade 2 CP-Ti',
					'DIN 912 socket head cap screw',
					'Head bearing area and thread length sized to the sheet gauge',
				],
				[
					'Stainless or low carbon steel sheet',
					'Through-bolted with nut and washer',
					'Grade 5 Ti-6Al-4V',
					'DIN 938 double end stud',
					'Same heat for stud, nut and washer where the lot allows',
				],
				[
					'FRP, CFRP and sandwich panels',
					'Screw into an insert, not into the laminate',
					'Grade 2 CP-Ti',
					'DIN 7991 countersunk head cap screw',
					'Counterbore depth checked against the insert, not the sheet',
				],
				[
					'Cast or machined housings',
					'Threaded hole, tightened to a controlled preload',
					'Grade 5 Ti-6Al-4V',
					'DIN 933 hex head bolt with DIN 934 nut',
					'Torque coefficient measured per lot for the quoted value',
				],
				[
					'Marine and splash-zone assemblies',
					'Bolted joint with passivated surfaces',
					'Grade 2 CP-Ti',
					'DIN 6921 flange bolt',
					'Grade 2 rates 4 of 5 on our published corrosion scale',
				],
				[
					'Elevated temperature process equipment',
					'Bolted joint, high-temperature grade',
					'Grade 9 Ti-3Al-2.5V',
					'DIN 931 partial thread hex head bolt',
					'Grade 9 rated to 600 °C on our published data',
				],
			],
		},
		{
			kind: 'paragraph',
			text: 'Surface condition on a thin-wall joint is decided by what happens after assembly. Passivation to ASTM F86 and AMS 2700 leaves a clean, uncoated surface with no free-iron contamination, and it is what keeps a titanium thread from seizing in a panel that has to be opened later. Anodising to AMS 2488 Type II or Type III is used where parts have to be told apart by grade or batch, and where a titanium joint is opened and closed repeatedly a PVD or DLC dry-film coating suppresses galling.',
		},
		{
			kind: 'paragraph',
			text: 'Every lot that leaves the shop carries the EN 10204 3.1 certificate for the heat it was cut from, and the grade is verified by XRF/PMI before dispatch. Where a part is not a catalogue item, it is machined from your drawing on our CNC route, with the same material and traceability rules applied.',
			link: {
				label: 'See the grade supply matrix',
				href: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
			},
		},
	],
	brands: {
		heading: 'The titanium parts that hold a panel together',
		tiles: [
			{
				href: '/products/screws/countersunk-head-cap-screws/',
				image: '/images/products/TI-COUNTERSUNK-HEAD-CAP-SCREWS-BZ-202-screws-titanium.webp',
				alt: 'Titanium countersunk head cap screws for flush mounting.',
				label: 'Fasteners',
				title: 'Titanium Countersunk Head Cap Screws',
				description:
					'DIN 7991 90-degree flat head — flush mounting where the panel surface has to stay flat.',
			},
			{
				href: '/products/bolts/double-end-stud-bolts/',
				image: '/images/products/TI-DOUBLE-END-STUD-BOLTS-BZ-110-bolts-titanium.webp',
				alt: 'Titanium double end stud bolts for through-bolted sheet assemblies.',
				label: 'Fasteners',
				title: 'Titanium Double End Stud Bolts',
				description:
					'DIN 938 and DIN 939 studs for through-bolted panels that can still be opened for service.',
			},
			{
				href: '/products/washers/plain-washers/',
				image: '/images/products/TI-PLAIN-WASHERS-BZ-401-washers-titanium.webp',
				alt: 'Titanium plain washers stacked on a white background.',
				label: 'Fasteners',
				title: 'Titanium Plain Washers',
				description:
					'Form A to DIN 125 and ISO 7089 — the element that spreads the clamp load over thin sheet.',
			},
			{
				href: '/products/bolts/hexagon-flange-bolts/',
				image: '/images/products/TI-HEXAGON-FLANGE-BOLTS-BZ-105-bolts-titanium.webp',
				alt: 'Titanium hexagon flange bolts with integrated washer bases.',
				label: 'Fasteners',
				title: 'Titanium Flange Bolts',
				description:
					'DIN 6921 flange bolts with an integrated washer base for thin-wall and sheet assemblies.',
			},
		],
	},
	note: {
		text: 'Availability, minimum order and lead time depend on diameter, length, grade and finish.',
		linkLabel: 'Send us the base material and the sheet gauge',
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
					'Non-catalogue thin-wall parts machined from your drawing, from samples through to series production.',
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
				title: 'Send the Sheet Detail',
				description:
					'Tell us the base material, the sheet gauge and the quantity. We will come back with the grade we would run.',
			},
		],
	},
};
