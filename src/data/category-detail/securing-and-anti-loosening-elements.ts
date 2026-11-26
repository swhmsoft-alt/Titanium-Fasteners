/**
 * src/data/category-detail/securing-and-anti-loosening-elements.ts
 *
 * 主题：钛合金紧固件 — 防松与抗振连接（预紧力、咬合型防松、螺纹锁固）。
 *
 * 参考站原文（Securing and Anti-Loosening Elements，第三方锁紧件品牌目录）
 * 与 BOZE 的源头工厂定位不符：本页改为钛紧固件在振动与交变载荷工况中的
 * 角色 —— 预紧力的建立与保持、钛的咬死（galling）风险、以及靠牌号、
 * 表面处理与装配工艺来控制松动的路径。
 *
 * 维护说明：scripts/gen-category-detail.mjs 已不在仓库中，本文件现为手工维护。
 * 数值全部取自生成产物 src/data/products/materials.ts 与 finishes.ts；
 * 图片全部为本地已落盘资源；链接全部指向已发布路由。
 */
import type { CategoryDetailPage } from './types';

export const CATEGORY_DETAIL: CategoryDetailPage = {
	slug: 'securing-and-anti-loosening-elements',
	seo: {
		title: 'Titanium Fasteners for Anti-Loosening and Vibration Joints',
		description:
			'Titanium bolts, nuts and washers for joints that see vibration and alternating load. Grade 2 and Grade 5, plain, passivated or anodised, with controlled preload and anti-galling finishes.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Product Categories and Brands', href: '/product-solutions/product-categories-and-brands/' },
			{ label: 'Titanium Anti-Loosening Joints' },
		],
		eyebrow: 'Titanium Fasteners',
		heading: 'Titanium Fasteners for Anti-Loosening Joints',
		lead:
			'A joint only stays tight if the preload is right and the surfaces do not gall. Titanium makes both decisions explicit, and both are ours to control at the factory.',
		image: '/images/category-detail-securing-and-anti-loosening-elements/titanium-securing-and-anti-loosening-elements-hero.webp',
		imageAlt:
			'Anodised titanium fasteners with a coloured anodic finish, used where parts have to be identified by grade or batch on the assembly line.',
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
		'Loosening is not a material problem, it is a preload problem. A titanium joint fails in service the same way a steel joint does — by losing clamp force — but titanium changes how that clamp force is set and how the threads behave afterwards.',
	video: { heading: '', thumbnail: '', thumbnailAlt: '', caption: '' },
	richText: [
		{
			kind: 'list',
			items: [
				{ lead: 'Preload, not torque.', text: 'Fasteners are tightened to a measured angle after seating, not to a copied torque number.' },
				{ lead: 'Galling control.', text: 'Passivated, anodised or dry-film coated threads keep titanium off titanium.' },
				{ lead: 'Traceability.', text: 'EN 10204 3.1 certification, with the heat number carried on every lot.' },
			],
		},
		{ kind: 'heading', text: 'Why titanium joints loosen differently' },
		{
			kind: 'paragraph',
			text: 'We are a fastener factory, so the parts we control are the bolt, the nut and the washer — not the compound or the clip that a customer adds at the bench. What we can do is make sure those three parts behave predictably under vibration and alternating load: the correct grade for the clamp force required, a defined surface condition on the thread, and a geometry that spreads the load instead of concentrating it at the corner of the nut.',
		},
		{
			kind: 'paragraph',
			text: 'Titanium has a low modulus of elasticity compared with steel, so the same torque produces a different clamp force, and the same clamp force produces a different stretch in the bolt. That is why a steel torque table is not a valid instruction for a titanium joint. We tighten to a measured angle after seating, and where a torque value has to be quoted for the customer, it is quoted against the grade and the finish of the actual lot.',
		},
		{
			kind: 'paragraph',
			text: 'The second titanium-specific risk is galling. Under preload, titanium rubs against titanium and against aluminium, and the thread picks up rather than slides — the joint then seizes, and a seized joint that has to be opened for service is a failure in its own right. A chemical passivation to ASTM F86 and AMS 2700 removes the free-iron contamination that makes this worse, and where the joint is opened and closed repeatedly a PVD or DLC dry-film coating suppresses the pick-up.',
		},
		{ kind: 'heading', text: 'How the joint is specified' },
		{
			kind: 'table',
			caption: 'Anti-loosening decisions by service condition.',
			columns: ['Service condition', 'Grade', 'Finish', 'Fastener choice', 'What we control'],
			rows: [
				[
					'Static structure, occasional access',
					'Grade 5 Ti-6Al-4V',
					'Plain or passivated',
					'DIN 933 hex head bolt with DIN 934 nut',
					'Torque coefficient measured per lot for the quoted value',
				],
				[
					'Vibration, rotating equipment, motors',
					'Grade 5 Ti-6Al-4V',
					'PVD or DLC on request',
					'DIN 6921 flange bolt — integrated washer base',
					'Single sealing and load-spreading face, no separate washer to loosen',
				],
				[
					'Repeated service, frequent removal',
					'Grade 5 Ti-6Al-4V',
					'Dry-film anti-galling',
					'DIN 912 socket head cap screw',
					'Torque angle, thread condition and coating spec filed against the lot',
				],
				[
					'Marine and offshore, splash zone',
					'Grade 2 CP-Ti',
					'Passivated ASTM F86',
					'DIN 939 double end stud with nut and washer',
					'Grade 2 rates 4 of 5 on our published corrosion scale',
				],
				[
					'High temperature process, above 300 °C',
					'Grade 9 Ti-3Al-2.5V',
					'Plain or passivated',
					'DIN 931 partial thread hex head bolt',
					'Grade 9 rated to 600 °C on our published data',
				],
			],
		},
		{
			kind: 'paragraph',
			text: 'The joint geometry does as much work as the material. A flange bolt with an integrated washer base spreads the clamp force over a defined face and removes the separate washer, which is the element that most often leaves the joint. A double end stud with a nut and washer on the far side allows the clamp to be set by nut rotation, which is the practical approach where the fastener is installed from one face only.',
		},
		{
			kind: 'paragraph',
			text: 'Every lot that leaves the shop carries the EN 10204 3.1 certificate for the heat it was cut from, and the grade is verified by XRF/PMI before dispatch. The finishes available against each grade are described on our fastener coatings page, and the grades we hold are listed in the grade supply matrix.',
			link: {
				label: 'See the grade supply matrix',
				href: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
			},
		},
	],
	brands: {
		heading: 'The titanium parts that hold the clamp force',
		tiles: [
			{
				href: '/products/bolts/hexagon-flange-bolts/',
				image: '/images/products/TI-HEXAGON-FLANGE-BOLTS-BZ-105-bolts-titanium.webp',
				alt: 'Titanium hexagon flange bolts with integrated washer bases.',
				label: 'Fasteners',
				title: 'Titanium Flange Bolts',
				description:
					'DIN 6921 flange bolts — one part, one load-spreading face, no separate washer to work loose.',
			},
			{
				href: '/products/bolts/hex-socket-head-cap-bolts/',
				image: '/images/products/TI-HEX-SOCKET-HEAD-CAP-BOLTS-BZ-106-bolts-titanium.webp',
				alt: 'Titanium hex socket head cap bolts for serviceable assemblies.',
				label: 'Fasteners',
				title: 'Titanium Socket Head Cap Bolts',
				description:
					'DIN 912 full thread for joints that are opened and closed again during service.',
			},
			{
				href: '/products/bolts/12-point-flange-bolts/',
				image: '/images/products/TI-12-POINT-FLANGE-BOLTS-BZ-112-bolts-titanium.webp',
				alt: 'Titanium 12-point flange bolts for high-torque clamping.',
				label: 'Fasteners',
				title: 'Titanium 12-Point Flange Bolts',
				description:
					'DIN 34800 high-tensile flange bolts for high-torque clamping at reduced weight.',
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
		linkLabel: 'Send us the joint and the service condition',
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
				href: '/services/manufacturing-capabilities/surface-finishing-color-coding/',
				image: '/images/fastener-coatings/07-surface-finishing-icon.webp',
				alt: 'Surface finishing icon',
				label: 'Finishing',
				title: 'Finishing and Grade Identification',
				description:
					'Anodic colour coding so parts can be told apart by grade, by batch or by function.',
			},
			{
				href: '/contact/',
				image: '/images/product-categories-and-brands/16-fasteners-icon.svg',
				alt: 'Contact our factory',
				label: 'Contact',
				title: 'Send the Joint Detail',
				description:
					'Tell us the load, the vibration and the removal frequency. We will come back with the grade and finish we would run.',
			},
		],
	},
};
