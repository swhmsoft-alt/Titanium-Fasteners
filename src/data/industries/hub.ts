/**
 * Industries hub — content for `/industries/`.
 *
 * WHY THIS FILE
 * -------------
 * The previous `/industries/` page carried the reference site's generic
 * "industries" copy (eight card tiles, a data-centre callout, a contact
 * form). Those tiles linked to pages this site has no business claiming to
 * serve, and the copy was written for a distributor, not for a titanium
 * fastener factory.
 *
 * The page is now built around the three demand centres that actually
 * consume pure titanium fasteners, matching the navigation panel:
 *   ① Aerospace & High-Strength Lightweight   (Grade 5)
 *   ② Corrosion & Marine Environments         (Grade 2)
 *   ③ Cleanroom & Specialty                    (Grade 23 ELI / Grade 9)
 *
 * LINK DISCIPLINE
 * --------------
 *   · Every internal link points to a route that exists in src/pages/**.
 *   · Grade links go through `materialHref()` (@data/product-solutions/routes),
 *     which sends grades that own a landing page (ti-gr2, ti-gr5) to that
 *     page, emits `?material=` for grades that are real filter options, and
 *     falls back to the grade supply matrix page for the rest
 *     (ti-gr9, ti-gr23) — so no link degrades into an empty filter.
 *   · No metric is invented here: the grade table is rendered from the
 *     generated MATERIALS dictionary (published nominal values).
 */
import { MATERIALS } from '@data/products';
import { materialHref } from '@data/product-solutions/routes';

export interface HubBreadcrumb {
	label: string;
	href?: string;
}

export interface HubBadge {
	value: string;
	label: string;
}

export interface HubPillarPoint {
	/** Bold lead — the technical term. */
	label: string;
	/** One short clause after the lead. */
	text: string;
}

export interface HubPillar {
	id: string;
	eyebrow: string;
	heading: string;
	/** Lead paragraph, at most 35 words. */
	lead: string;
	image: { src: string; alt: string; width: number; height: number };
	points: HubPillarPoint[];
	cta: { label: string; href: string };
	secondaryCta?: { label: string; href: string };
}

export interface HubSector {
	title: string;
	description: string;
	href: string;
}

export interface HubGradeRow {
	name: string;
	href: string;
	spec: string;
	use: string;
}

const GRADE_USE: Record<string, string> = {
	'ti-gr2': 'Chemical processing, desalination, marine equipment',
	'ti-gr5': 'Aerospace, robotics, high-strength assemblies',
	'ti-gr9': 'Elevated-temperature service, power and process',
	'ti-gr23': 'Medical devices, cleanroom and vacuum hardware',
};

export const INDUSTRIES_HUB = {
	seo: {
		title: 'Industries',
		description:
			'Titanium fasteners for aerospace, marine, chemical processing and cleanroom assembly: Grade 2, Grade 5, Grade 9 and Grade 23 in M1.6-M36, supplied with EN 10204 3.1 certification.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Industries' },
		] as HubBreadcrumb[],
		eyebrow: 'Industries',
		heading: 'Titanium Fasteners by Industry',
		lead: 'Grade 2, Grade 5 and Grade 23 titanium fasteners built to DIN, ISO and ASTM standards for aerospace, marine, chemical processing and cleanroom assembly lines.',
		badges: [
			{ value: 'M1.6-M36', label: 'Standard thread range' },
			{ value: 'EN 10204 3.1', label: 'Mill test certificates' },
			{ value: '100% PMI / XRF', label: 'Grade verification' },
		] as HubBadge[],
		cta: { label: 'Browse the fastener range', href: '/products/' },
		secondaryCta: { label: 'Request a quote', href: '/contact/' },
	},
	pillars: [
		{
			id: 'aerospace',
			eyebrow: 'Grade 5 Ti-6Al-4V',
			heading: 'Aerospace & High-Strength Lightweight',
			lead: 'Grade 5 Ti-6Al-4V combines high strength with low mass for UAV and flight hardware, machined from certified bar stock to DIN 912, DIN 931 and ASTM F468.',
			image: {
				src: '/images/public-images/industries-aerospace-grade5-titanium-fasteners.webp',
				alt: 'Grade 5 Ti-6Al-4V aerospace fasteners — hex bolt, hex nut, washer and threaded stud — arranged on a white background.',
				width: 1600,
				height: 1200,
			},
			points: [
				{ label: 'AMS 4928 bar stock', text: 'traceable heat number per lot' },
				{ label: 'AMS 2700 passivation', text: 'anti-galling surface at aluminium interfaces' },
				{ label: 'EN 10204 3.1 MTC', text: 'mill test certificate with every shipment' },
			],
			cta: { label: 'Aerospace fastening solutions', href: '/industries/aerospace-uav/' },
			secondaryCta: { label: 'Grade 5 fasteners', href: materialHref('ti-gr5') },
		},
		{
			id: 'corrosion-marine',
			eyebrow: 'Grade 2 commercially pure',
			heading: 'Corrosion & Marine Environments',
			lead: 'Grade 2 commercially pure titanium resists chloride, acids and salt spray without sacrificial coatings, suited to chemical processing, desalination and marine equipment.',
			image: {
				src: '/images/public-images/industries-corrosion-marine-grade2-titanium-fasteners.webp',
				alt: 'Grade 2 commercially pure titanium fasteners — hex bolt, hex nut, washer and stud with a pickled uncoated surface — on a white background.',
				width: 1600,
				height: 1200,
			},
			points: [
				{ label: 'Grade 2 CP titanium', text: 'seawater and process chemical service' },
				{ label: 'ASTM F86 passivation', text: 'oxide protected surface, no plating' },
				{ label: 'M1.6-M36 stocked', text: 'plant maintenance and new build alike' },
			],
			cta: { label: 'Corrosion resistant fasteners', href: materialHref('ti-gr2') },
			secondaryCta: { label: 'Talk to an engineer', href: '/contact/' },
		},
		{
			id: 'cleanroom-specialty',
			eyebrow: 'Grade 23 ELI / Grade 9',
			heading: 'Cleanroom & Specialty',
			lead: 'Grade 23 ELI and Grade 9 parts for medical device assembly, vacuum chamber hardware and cleanroom tooling, produced under NDA with documented material verification.',
			image: {
				src: '/images/public-images/industries-cleanroom-grade23-titanium-parts.webp',
				alt: 'Grade 23 ELI titanium parts — polished socket head cap screw, precision bracket, washer and hex nut — on a white background.',
				width: 1600,
				height: 1200,
			},
			points: [
				{ label: 'Grade 23 ELI', text: 'extra low interstitial, AMS 4928 bar stock' },
				{ label: 'Grade 9 Ti-3Al-2.5V', text: 'elevated temperature service above 300 C' },
				{ label: 'NDA protected drawings', text: 'print to part machining, no data reuse' },
			],
			cta: { label: 'Medical and vacuum fasteners', href: '/industries/medical-devices/' },
			secondaryCta: { label: 'Grade 23 supply', href: materialHref('ti-gr23') },
		},
	] as HubPillar[],
	sectors: {
		heading: 'Where our fasteners are specified',
		lead: 'Ten industries we machine titanium fasteners for. Each one has its own grade, finish and traceability requirement, and each one is covered by its own page.',
		/*
		 * 行业清单与导航面板（src/config/site.ts → NAVIGATION → Industries）严格一致：
		 * 顺序、名称、href 三者同源，十项全部指向 src/pages/industries/ 下的真实静态页。
		 * 旧版本使用 /industries/aerospace/、/industries/robotics/ 等参考站 slug，
		 * 那些页面已移除；旧 URL 现在由 astro.config.mjs 的 redirects 永久跳转
		 * 到对应的现行页面（见 docs/redirects-industries.md）。
		 */
		items: [
			{
				title: 'Aerospace & UAV',
				description: 'Airframe, payload and flight hardware in Grade 5 and Grade 23.',
				href: '/industries/aerospace-uav/',
			},
			{
				title: 'Medical Devices',
				description: 'Grade 23 ELI parts for instruments, diagnostic equipment and implant tooling.',
				href: '/industries/medical-devices/',
			},
			{
				title: 'Electric Vehicles',
				description: 'Battery enclosures, subframes and chassis joints where mass and heat meet.',
				href: '/industries/electric-vehicles/',
			},
			{
				title: 'Chemical & Corrosion',
				description: 'Chlor-alkali, acid and salt service with no coating to renew.',
				href: '/industries/chemical-corrosion/',
			},
			{
				title: 'Semiconductor & Vacuum',
				description: 'Process chambers and cleanroom tooling that must not shed particles.',
				href: '/industries/semiconductor-vacuum/',
			},
			{
				title: 'Desalination',
				description: 'Reverse osmosis skids, intake structures and high-pressure piping.',
				href: '/industries/desalination/',
			},
			{
				title: 'Marine & Offshore',
				description: 'Deck equipment, offshore piping and splash-zone assemblies in Grade 2.',
				href: '/industries/marine-offshore/',
			},
			{
				title: 'Industrial Robotics',
				description: 'Arm frames, end effectors and sensor housings needing low mass.',
				href: '/industries/industrial-robotics/',
			},
			{
				title: 'Rail & Rolling Stock',
				description: 'Railcar structures, interiors and lineside equipment under vibration.',
				href: '/industries/rail-rolling-stock/',
			},
			{
				title: 'Data Centers',
				description: 'Rack frames, liquid cooling and cable management hardware.',
				href: '/industries/data-centers/',
			},
		] as HubSector[],
	},
	grades: {
		heading: 'Grades and nominal values',
		lead: 'Published nominal values per grade. Every lot ships with the certificate that confirms it.',
		rows: MATERIALS.map((m) => ({
			name: m.name,
			href: materialHref(m.id),
			spec: `Proof ${m.proof_strength_mpa} MPa / tensile ${m.tensile_mpa} MPa`,
			use: GRADE_USE[m.id] ?? 'General engineering',
		})) as HubGradeRow[],
	},
	cta: {
		heading: 'Send the drawing or the specification',
		text: 'Send a drawing, a standard reference or a bill of materials, and our engineering team replies with a manufactured quote within 12 business hours.',
		primary: { label: 'Request a quote', href: '/contact/' },
		secondary: { label: 'Browse standard sizes', href: '/products/' },
	},
};
