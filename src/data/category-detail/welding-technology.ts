/**
 * src/data/category-detail/welding-technology.ts
 *
 * 主题：钛合金紧固件 — 焊接/点焊结构中由紧固件承担的部分（焊接螺柱、焊接
 * 紧固件替代路径，以及可拆解的机械连接）。
 *
 * 参考站原文（Welding Technology，第三方焊接螺柱与焊接设备品牌目录）与
 * BOZE 的源头工厂定位不符：本页改为钛紧固件在焊接结构中的角色 —— 焊接
 * 本身是客户工艺，本厂提供的是结构上与之配套的钛紧固件：焊接螺柱、
 * 焊接替代的螺栓方案，以及热影响区之外的高温牌号选择。
 *
 * 维护说明：scripts/gen-category-detail.mjs 已不在仓库中，本文件现为手工维护。
 * 数值全部取自生成产物 src/data/products/materials.ts 与 finishes.ts；
 * 图片全部为本地已落盘资源；链接全部指向已发布路由。
 */
import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'welding-technology',
	seo: {
		title: 'Titanium Fasteners for Welded and Stud-Welded Structures',
		description:
			'Titanium studs, bolts, nuts and washers for welded structures, stud-welded joints and serviceable alternatives. Grade 2, Grade 5 and high-temperature Grade 9, with EN 10204 3.1 traceability.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Titanium Fasteners for Welded Structures' },
		],
		eyebrow: 'Titanium Fasteners',
		heading: 'Titanium Fasteners for Welded and Stud-Welded Structures',
		lead:
			'A welded joint has to survive the heat it was made with. The fastener next to it has to survive everything that happens afterwards, including service.',
		image: '/images/category-detail-welding-technology/titanium-welding-technology-hero.webp',
		imageAlt:
			'Titanium fastener production in the factory, showing cold heading and machining of the titanium parts used in welded structures.',
		imageWidth: 1250,
		imageHeight: 1000,
		buttons: [
			{
				label: 'View Titanium Fasteners',
				href: '/products/',
				kind: 'link',
				variant: 'primary',
			},
			{ label: 'Send the Structure Detail', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro:
		'Welding is a joining process, and it is the customer’s process. What a fastener supplier has to get right is the fastener that sits next to the weld — the stud that carries the load into the section, and the alternative joint that avoids welding altogether where the design allows it.',
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{
			kind: 'list',
			items: [
				{ lead: 'Grade against the temperature.', text: 'Grade 9 above 300 °C, Grade 5 to 315 °C, Grade 2 for general duty.' },
				{ lead: 'Surface condition.', text: 'Plain, passivated ASTM F86 / AMS 2700, or anodised AMS 2488 Type II and III.' },
				{ lead: 'Traceability.', text: 'EN 10204 3.1 certification, with the heat number carried on every lot.' },
			],
		},
		{ kind: 'heading', text: 'The fastener next to the weld' },
		{
			kind: 'paragraph',
			text: 'Stud welding, resistance welding and the welding of structural sections all have the same consequence: the material near the joint has been heated, and in titanium that heat is not neutral. Titanium’s melting point is high and its thermal conductivity is low, so a local weld on a thin titanium section is a demanding operation with its own shielding and contamination controls. The fastener that has to work next to it is therefore chosen for what it experiences afterwards — corrosion, load, vibration and service temperature — rather than for the weld itself.',
		},
		{
			kind: 'paragraph',
			text: 'For structures that see elevated temperature, the grade changes. Grade 5 Ti-6Al-4V holds to 315 °C on our published data. Grade 9 Ti-3Al-2.5V is the high-temperature titanium, rated to 600 °C, and it is specified where Grade 5 creep is no longer sufficient — exhaust and heat-treat equipment, furnace frames, hot-side ducting. Grade 2 CP-Ti, with 275 MPa proof strength, is the corrosion-led choice for the cold side of the same structure.',
		},
		{
			kind: 'paragraph',
			text: 'The second decision is whether the joint has to be welded at all. A welded joint in titanium is permanent and cannot be inspected without destroying it. Where the design permits it, a bolted joint with a titanium stud gives the same load path, keeps the joint serviceable, and removes the welding operation from the critical path entirely. That substitution is a normal part of the discussion we have with customers who come to us after a welding route has proved difficult.',
		},
		{ kind: 'heading', text: 'Which grade and finish suit the service' },
		{
			kind: 'table',
			caption: 'Fastener selection for welded and stud-welded structures.',
			columns: ['Service condition', 'Grade', 'Finish', 'Fastener choice', 'What we control'],
			rows: [
				[
					'Cold-side structure, ambient temperature',
					'Grade 5 Ti-6Al-4V',
					'Plain or passivated',
					'DIN 938 double end stud',
					'Same heat for stud and nut where the lot allows',
				],
				[
					'Elevated temperature, up to 315 °C',
					'Grade 5 Ti-6Al-4V',
					'Plain or passivated',
					'DIN 933 hex head bolt with DIN 934 nut',
					'Torque coefficient measured per lot for the quoted value',
				],
				[
					'Exhaust, furnace and hot-side service',
					'Grade 9 Ti-3Al-2.5V',
					'Plain or passivated',
					'DIN 931 partial thread hex head bolt',
					'Grade 9 rated to 600 °C on our published data',
				],
				[
					'Marine and process plant structures',
					'Grade 2 CP-Ti',
					'Passivated ASTM F86',
					'DIN 6921 flange bolt',
					'Grade 2 rates 4 of 5 on our published corrosion scale',
				],
				[
					'Aerospace and airframe attachment',
					'Grade 5 Ti-6Al-4V',
					'Anodised AMS 2488',
					'DIN 912 socket head cap screw',
					'Anodic colour used to identify the grade on the assembly line',
				],
				[
					'Medical and cleanroom equipment frames',
					'Grade 23 Ti-6Al-4V ELI',
					'Passivated ASTM F86',
					'DIN 7991 countersunk head cap screw',
					'ELI grade verified by XRF/PMI and filed against the lot',
				],
			],
		},
		{
			kind: 'paragraph',
			text: 'Surface condition on a fastener that sits next to a weld is decided by what the heat and the environment will do to it. Passivation to ASTM F86 and AMS 2700 removes the free-iron contamination that machining introduces, and it is what keeps a titanium thread from seizing after the joint has been heated. Anodising to AMS 2488 Type II or Type III produces a controlled anodic oxide and is the finish used where parts have to be told apart by grade, by batch or by function.',
		},
		{
			kind: 'paragraph',
			text: 'Studs, bolts and special parts for welded structures are produced on the cold heading, hot forging and CNC routes, whichever suits the geometry. Every lot that leaves the shop carries the EN 10204 3.1 certificate for the heat it was cut from, and the grade is verified by XRF/PMI before dispatch.',
			link: {
				label: 'See the grade supply matrix',
				href: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
			},
		},
	],
	brands: {
		heading: 'The titanium parts that work alongside a welded joint',
		tiles: [
			{
				href: '/products/bolts/double-end-stud-bolts/',
				image: '/images/products/TI-DOUBLE-END-STUD-BOLTS-BZ-110-bolts-titanium.webp',
				alt: 'Titanium double end stud bolts for welded and stud-welded structures.',
				label: 'Fasteners',
				title: 'Titanium Double End Stud Bolts',
				description:
					'DIN 938 and DIN 939 studs — the through-bolt that carries load into a welded section.',
			},
			{
				href: '/products/bolts/hexagon-head-bolts-partial-thread/',
				image: '/images/products/TI-HEXAGON-HEAD-BOLTS-PARTIAL-THREAD-BZ-104-bolts-titanium.webp',
				alt: 'Titanium partial thread hex head bolts for elevated temperature service.',
				label: 'Fasteners',
				title: 'Titanium Partial Thread Hex Bolts',
				description:
					'DIN 931 partial thread bolts for high-temperature process and exhaust service.',
			},
			{
				href: '/products/bolts/hex-socket-head-cap-bolts/',
				image: '/images/products/TI-HEX-SOCKET-HEAD-CAP-BOLTS-BZ-106-bolts-titanium.webp',
				alt: 'Titanium hex socket head cap bolts for aerospace and airframe attachment.',
				label: 'Fasteners',
				title: 'Titanium Socket Head Cap Bolts',
				description:
					'DIN 912 full thread for airframe and equipment attachment where the head must sit low.',
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
		linkLabel: 'Send us the structure and the service temperature',
		linkHref: '/contact/',
		linkSuffix:
			' — we will confirm what can be produced from stock, what is made to order, and the grade and finish we would run.',
	},
	services: {
		cards: [
			{
				href: '/services/manufacturing-capabilities/cold-heading-hot-forging/',
				image: '/images/fastener-coatings/07-surface-finishing-icon.webp',
				alt: 'Forging icon',
				label: 'Manufacturing',
				title: 'Cold Heading & Hot Forging',
				description:
					'The forming routes selected per part geometry, giving each part the properties its material is meant to deliver.',
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
				title: 'Send the Structure Detail',
				description:
					'Tell us the joint, the temperature and the load. We will come back with the grade and finish we would run.',
			},
		],
	},
};
