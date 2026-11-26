/**
 * src/data/category-detail/electrical-products.ts
 *
 * 主题：钛合金紧固件 — 电气/电子设备结构件与接地连接（电气箱体、散热器、
 * 面板安装、以及金属与非金属外壳的连接）。
 *
 * 参考站原文（Electrical Products，第三方绝缘/电气紧固件品牌目录）与 BOZE
 * 的源头工厂定位不符：本页改为钛紧固件在电气与电子结构中的角色 —— 非导
 * 电外壳的机械连接、接地/等电位连接点的要求、以及钛的低导电性对紧固件
 * 选型的影响。
 *
 * 维护说明：scripts/gen-category-detail.mjs 已不在仓库中，本文件现为手工维护。
 * 数值全部取自生成产物 src/data/products/materials.ts 与 finishes.ts；
 * 图片全部为本地已落盘资源；链接全部指向已发布路由。
 */
import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'electrical-products',
	seo: {
		title: 'Titanium Fasteners for Electrical and Electronic Assemblies',
		description:
			'Titanium screws, studs, nuts and washers for electrical enclosures, heat sinks, panels and chassis mounting. Grade 2 and Grade 5, essentially non-magnetic, with EN 10204 3.1 traceability.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Titanium Fasteners for Electrical Assemblies' },
		],
		eyebrow: 'Titanium Fasteners',
		heading: 'Titanium Fasteners for Electrical and Electronic Assemblies',
		lead:
			'Titanium is essentially non-magnetic and sits at the noble end of the galvanic series. It conducts, but far less well than copper, so it is specified for sensors, heat sinks and enclosures rather than for the bonding path.',
		image: '/images/category-detail-electrical-products/titanium-electrical-products-hero.webp',
		imageAlt:
			'Titanium fasteners and machined titanium parts used in electrical enclosure and heat sink assembly.',
		imageWidth: 1250,
		imageHeight: 1000,
		buttons: [
			{
				label: 'View Titanium Fasteners',
				href: '/products/',
				kind: 'link',
				variant: 'primary',
			},
			{ label: 'Send the Electrical Detail', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro:
		'An electrical fastener has to hold a mechanical joint without disturbing the electrical behaviour around it. Titanium is specified where the joint sits close to a sensor, a coil or a measurement field, and where the fastener must not become the corrosion site in a humid enclosure.',
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{
			kind: 'list',
			items: [
				{ lead: 'Non-magnetic.', text: 'Titanium is essentially non-magnetic, so it does not distort a nearby field.' },
				{ lead: 'Grade against the joint.', text: 'Grade 2 for corrosion-led duty, Grade 5 where the fastener carries the load.' },
				{ lead: 'Traceability.', text: 'EN 10204 3.1 certification, with the heat number carried on every lot.' },
			],
		},
		{ kind: 'heading', text: 'Two things titanium does to an electrical assembly' },
		{
			kind: 'paragraph',
			text: 'First, titanium is essentially non-magnetic. That matters in two places. In a sensor, a magnetometer or a coil assembly, a magnetic fastener distorts the field it is supposed to be measuring, and a titanium fastener does not. On an enclosure or a panel, titanium also sits at the noble end of the galvanic series, so it does not drive corrosion into an aluminium or steel frame the way a lesser alloy in the same joint would.',
		},
		{
			kind: 'paragraph',
			text: 'Second, titanium does not produce the incandescent iron sparks that a steel fastener throws when it is struck. In a hazardous area — fuel handling, gas processing, a refinery, a battery facility — that difference is why titanium is specified in explosive atmospheres. The qualification matters: a titanium fastener still has to be assessed against the service condition and the finish, because an anodised or coated surface changes the contact behaviour and has to be specified accordingly.',
		},
		{
			kind: 'paragraph',
			text: 'There is one place where titanium is deliberately not used: a bonding or earthing point that has to carry fault current. Titanium’s electrical resistivity is high, so a through-bolt intended to carry fault current into a chassis is normally a steel or copper-bonded solution with a titanium fastener clamping it. The engineering point is the same in every case — the mechanical fastener and the electrical function are two separate decisions, and the right answer is to take them separately rather than to expect one part to do both jobs.',
		},
		{ kind: 'heading', text: 'Which fastener and grade suit the assembly' },
		{
			kind: 'table',
			caption: 'Fastener selection for electrical and electronic assemblies.',
			columns: ['Assembly', 'Grade', 'Finish', 'Fastener choice', 'What we control'],
			rows: [
				[
					'Sensor and instrument housing',
					'Grade 5 Ti-6Al-4V',
					'Plain or passivated',
					'DIN 912 socket head cap screw',
					'Non-magnetic material, so the fastener does not distort the measurement',
				],
				[
					'Non-metal enclosure and cover',
					'Grade 2 CP-Ti',
					'Passivated ASTM F86',
					'DIN 7991 countersunk head cap screw',
					'Noble metal against the frame, so the joint does not drive galvanic corrosion',
				],
				[
					'Heat sink and cold plate mounting',
					'Grade 5 Ti-6Al-4V',
					'Anodised AMS 2488',
					'DIN 6921 flange bolt',
					'Thermal contact through a flat integrated washer base',
				],
				[
					'Hazardous area equipment, ATEX environments',
					'Grade 2 CP-Ti',
					'Anodised AMS 2488, finish specified for the zone',
					'DIN 933 hex head bolt with DIN 934 nut',
					'Non-ferrous material, with the finish specified for the service area',
				],
				[
					'Chassis and rack mounting',
					'Grade 2 CP-Ti',
					'Plain or passivated',
					'DIN 938 double end stud with nut and washer',
					'Same heat for stud, nut and washer where the lot allows',
				],
				[
					'Medical device and diagnostic equipment',
					'Grade 23 Ti-6Al-4V ELI',
					'Passivated ASTM F86',
					'DIN 7991 countersunk head cap screw',
					'ELI grade verified by XRF/PMI and filed against the lot',
				],
			],
		},
		{
			kind: 'paragraph',
			text: 'Surface condition in an electrical assembly is chosen for the environment rather than for appearance. Passivation to ASTM F86 and AMS 2700 removes the free-iron contamination that machining leaves on the surface, and it is the treatment that keeps the thread from seizing when the enclosure is opened for service. Anodising to AMS 2488 Type II or Type III gives a controlled anodic oxide and a colour, which is used where parts have to be told apart by grade, by batch or by function on the assembly line.',
		},
		{
			kind: 'paragraph',
			text: 'Every lot that leaves the shop carries the EN 10204 3.1 certificate for the heat it was cut from, and the grade is verified by XRF/PMI before dispatch. Where the part is not a catalogue item — a standoff, a clip, a machined enclosure component — it is produced on the CNC route from your drawing.',
			link: {
				label: 'See the grade supply matrix',
				href: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
			},
		},
	],
	brands: {
		heading: 'The titanium parts that hold an electrical assembly together',
		tiles: [
			{
				href: '/products/screws/hex-socket-head-cap-screw/',
				image: '/images/products/TI-HEX-SOCKET-HEAD-CAP-SCREW-BZ-201-screws-titanium.webp',
				alt: 'Titanium hexagon socket head cap screws for enclosure assembly.',
				label: 'Fasteners',
				title: 'Titanium Socket Head Cap Screws',
				description:
					'DIN 912 full thread for housings and covers that are opened and closed during service.',
			},
			{
				href: '/products/screws/countersunk-head-cap-screws/',
				image: '/images/products/TI-COUNTERSUNK-HEAD-CAP-SCREWS-BZ-202-screws-titanium.webp',
				alt: 'Titanium countersunk head cap screws for flush enclosure covers.',
				label: 'Fasteners',
				title: 'Titanium Countersunk Head Cap Screws',
				description:
					'DIN 7991 90-degree flat head — a flush cover with no protruding fastener head.',
			},
			{
				href: '/products/bolts/hexagon-flange-bolts/',
				image: '/images/products/TI-HEXAGON-FLANGE-BOLTS-BZ-105-bolts-titanium.webp',
				alt: 'Titanium hexagon flange bolts with integrated washer bases.',
				label: 'Fasteners',
				title: 'Titanium Flange Bolts',
				description:
					'DIN 6921 flange bolts for heat sinks and cold plates, where the contact face has to be flat.',
			},
			{
				href: '/products/bolts/double-end-stud-bolts/',
				image: '/images/products/TI-DOUBLE-END-STUD-BOLTS-BZ-110-bolts-titanium.webp',
				alt: 'Titanium double end stud bolts for chassis and rack mounting.',
				label: 'Fasteners',
				title: 'Titanium Double End Stud Bolts',
				description:
					'DIN 938 and DIN 939 studs for chassis and rack mounting installed from one side.',
			},
		],
	},
	note: {
		text: 'Availability, minimum order and lead time depend on diameter, length, grade and finish.',
		linkLabel: 'Send us the assembly and the environment',
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
				href: '/product-solutions/special-parts-and-custom-fasteners/',
				image: '/images/fastener-coatings/07-surface-finishing-icon.webp',
				alt: 'Special parts icon',
				label: 'Special Parts',
				title: 'Standoffs and Machined Parts',
				description:
					'Enclosure components and special parts machined in titanium to your drawing.',
			},
			{
				href: '/contact/',
				image: '/images/product-categories-and-brands/16-fasteners-icon.svg',
				alt: 'Contact our factory',
				label: 'Contact',
				title: 'Send the Electrical Detail',
				description:
					'Tell us the assembly, the environment and the quantity. We will come back with the grade and finish we would run.',
			},
		],
	},
};
