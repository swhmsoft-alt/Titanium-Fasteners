/**
 * src/data/category-detail/access-solutions.ts
 *
 * 主题：钛合金紧固件 — 检修口/设备门与维护通道（flush access panels、快拆面板、
 * 检修盖板）。
 *
 * 参考站原文（Access Solutions，第三方快拆面板紧固件品牌目录）与 BOZE 的源头
 * 工厂定位不符：本页改为钛紧固件在设备检修口与维护通道中的角色 —— 快拆
 * 面板由客户指定，本厂提供的是把面板固定到机架上的钛紧固件、铰链与锁紧件，
 * 以及这些件在潮湿、洁净与海洋环境中的材料选择。
 *
 * 维护说明：scripts/gen-category-detail.mjs 已不在仓库中，本文件现为手工维护。
 * 数值全部取自生成产物 src/data/products/materials.ts 与 finishes.ts；
 * 图片全部为本地已落盘资源；链接全部指向已发布路由。
 */
import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'access-solutions',
	seo: {
		title: 'Titanium Fasteners for Access Panels and Service Access',
		description:
			'Titanium studs, bolts, screws and washers for machine access panels, covers and maintenance access in marine, cleanroom and process environments. Grade 2 and Grade 5, with EN 10204 3.1 traceability.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Titanium Fasteners for Service Access' },
		],
		eyebrow: 'Titanium Fasteners',
		heading: 'Titanium Fasteners for Access Panels and Service Access',
		lead:
			'An access panel is opened and closed on a schedule. The fastener behind it has to survive that schedule, and it has to survive the environment it opens into.',
		image: '/images/category-detail-access-solutions/titanium-access-solutions-hero.webp',
		imageAlt:
			'Titanium access panel frame and fastener assembly in a factory setting, showing the machined titanium parts used in service access.',
		imageWidth: 1250,
		imageHeight: 1000,
		buttons: [
			{
				label: 'View Titanium Fasteners',
				href: '/products/',
				kind: 'link',
				variant: 'primary',
			},
			{ label: 'Send the Access Detail', kind: 'dialog', variant: 'secondary' },
		],
	},
	intro:
		'Service access is where a fastener is judged hardest. The panel comes off regularly, often by someone in a hurry, often in the dark, often with tools that are not cleanroom tools. Then the panel goes back on and the seal has to hold.',
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{
			kind: 'list',
			items: [
				{ lead: 'Reopening, not just closing.', text: 'Grade 2 for corrosion-led duty, Grade 5 where the fastener carries the panel load.' },
				{ lead: 'Anti-galling surface.', text: 'Passivation ASTM F86 / AMS 2700, or a dry-film coating for repeated removal.' },
				{ lead: 'Traceability.', text: 'EN 10204 3.1 certification, with the heat number carried on every lot.' },
			],
		},
		{ kind: 'heading', text: 'What the access fastener has to do' },
		{
			kind: 'paragraph',
			text: 'The quick-release captive fastener, the latch, the hinge and the seal retainer are specified by the customer against their own access standard, and we do not make them. What we supply is the titanium hardware that holds the panel to the machine — the stud, the bolt, the nut, the washer, and any hinge or bracket that is machined for the frame. Those are the parts that live in the environment: the splash zone, the wash-down bay, the cleanroom, the offshore deck.',
		},
		{
			kind: 'paragraph',
			text: 'In those environments the failure mode is consistent. A steel fastener in a wash-down bay rusts, the threads fill with oxide, and the panel that has to come off for inspection cannot be unscrewed. A stainless fastener resists that but still galling against a titanium or aluminium frame, and it still picks up free-iron contamination from adjacent carbon steel work. Grade 2 CP-Ti does not form iron oxide rust, and rates 4 of 5 on our published corrosion scale.',
		},
		{
			kind: 'paragraph',
			text: 'The second requirement is that the fastener has to be removable by hand tools, repeatedly, and put back without a calibration. That is a thread condition question rather than a material question. A passivated titanium thread is clean and free of free-iron contamination, which removes most of the galling risk against an aluminium frame; where the panel is removed far more often than a normal service interval, a dry-film anti-galling coating on the thread is the practical answer.',
		},
		{ kind: 'heading', text: 'Which grade and finish suit the access condition' },
		{
			kind: 'table',
			caption: 'Fastener selection for access panels and maintenance access.',
			columns: ['Access condition', 'Grade', 'Finish', 'Fastener choice', 'What we control'],
			rows: [
				[
					'Wash-down bay, food and pharmaceutical equipment',
					'Grade 2 CP-Ti',
					'Passivated ASTM F86',
					'DIN 912 socket head cap screw',
					'No iron oxide rust on the threads that get opened for cleaning',
				],
				[
					'Cleanroom and semiconductor equipment',
					'Grade 2 CP-Ti',
					'Passivated ASTM F86',
					'DIN 7991 countersunken head cap screw',
					'Clean, oxide-free surface with no free-iron contamination',
				],
				[
					'Marine and offshore equipment hatches',
					'Grade 2 CP-Ti',
					'Plain or passivated',
					'DIN 939 double end stud with nut and washer',
					'Grade 2 rates 4 of 5 on our published corrosion scale',
				],
				[
					'Machine guards and heavy access covers',
					'Grade 5 Ti-6Al-4V',
					'Plain or passivated',
					'DIN 6921 flange bolt',
					'One integrated washer base, so nothing extra to lose in service',
				],
				[
					'Frequently opened access, daily service',
					'Grade 5 Ti-6Al-4V',
					'Dry-film anti-galling coating',
					'DIN 933 hex head bolt with DIN 934 nut',
					'Coating specification filed against the lot for repeat orders',
				],
				[
					'Medical and diagnostic equipment access',
					'Grade 23 Ti-6Al-4V ELI',
					'Passivated ASTM F86',
					'DIN 938 double end stud',
					'ELI grade verified by XRF/PMI and filed against the lot',
				],
			],
		},
		{
			kind: 'paragraph',
			text: 'Where the access hardware itself is a special part — a hinge barrel, a frame bracket, a retainer plate — we machine it on the CNC route from your drawing, in the grade that matches the fastener going into it, with the same material and traceability rules applied. Every lot that leaves the shop carries the EN 10204 3.1 certificate for the heat it was cut from, and the grade is verified by XRF/PMI before dispatch.',
			link: {
				label: 'See the grade supply matrix',
				href: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
			},
		},
	],
	brands: {
		heading: 'The titanium parts that hold an access panel on',
		tiles: [
			{
				href: '/products/screws/hex-socket-head-cap-screw/',
				image: '/images/products/TI-HEX-SOCKET-HEAD-CAP-SCREW-BZ-201-screws-titanium.webp',
				alt: 'Titanium hexagon socket head cap screws for access panel fixing.',
				label: 'Fasteners',
				title: 'Titanium Socket Head Cap Screws',
				description:
					'DIN 912 full thread — the fastener that holds a panel and has to come out again for service.',
			},
			{
				href: '/products/bolts/double-end-stud-bolts/',
				image: '/images/products/TI-DOUBLE-END-STUD-BOLTS-BZ-110-bolts-titanium.webp',
				alt: 'Titanium double end stud bolts for access frames and hatches.',
				label: 'Fasteners',
				title: 'Titanium Double End Stud Bolts',
				description:
					'DIN 938 and DIN 939 studs for access frames installed from one side only.',
			},
			{
				href: '/products/bolts/hexagon-flange-bolts/',
				image: '/images/products/TI-HEXAGON-FLANGE-BOLTS-BZ-105-bolts-titanium.webp',
				alt: 'Titanium hexagon flange bolts with integrated washer bases.',
				label: 'Fasteners',
				title: 'Titanium Flange Bolts',
				description:
					'DIN 6921 flange bolts for guards and heavy covers — one part, nothing extra to lose.',
			},
			{
				href: '/products/washers/plain-washers/',
				image: '/images/products/TI-PLAIN-WASHERS-BZ-401-washers-titanium.webp',
				alt: 'Titanium plain washers stacked on a white background.',
				label: 'Fasteners',
				title: 'Titanium Plain Washers',
				description:
					'Form A to DIN 125 and ISO 7089 — the element that spreads the load behind an access panel.',
			},
		],
	},
	note: {
		text: 'Availability, minimum order and lead time depend on diameter, length, grade and finish.',
		linkLabel: 'Send us the access detail',
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
				title: 'Hinges, Brackets and Retainers',
				description:
					'Access hardware machined in titanium to your drawing, matched to the fastener going into it.',
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
				title: 'Send the Access Detail',
				description:
					'Tell us the environment, the service interval and the quantity. We will come back with the grade we would run.',
			},
		],
	},
};
