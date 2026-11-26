/**
 * Aerospace & UAV — application page data for `/industries/aerospace-uav/`.
 *
 * WHY A DEDICATED MODULE
 * -----------------------
 * The application page shell (@components/sections/industries-application) is
 * shared by all nine industry pages. Only the copy, the images and the two
 * named sub-applications change, so each industry owns one data module that
 * conforms to `AppPageData`.
 *
 * DATA PROVENANCE
 * ---------------
 *   · Product cards and every product link come from the generated catalogue
 *     (`ALL_PRODUCTS` in @data/products) — no hand-typed catalogue URLs.
 *   · Grade values come from the generated `MATERIALS` dictionary; Grade 7 has
 *     no published row and reads "Confirmed per order".
 *   · Copy states only what the shop floor can verify: grade, standard,
 *     certificate scope, finish route and packaging rule.
 */
import type { AppPageData } from '@data/industries-application';
import { materialHref } from '@data/product-solutions/routes';

export const AEROSPACE_UAV: AppPageData = {
	slug: 'aerospace-uav',
	industry: 'Aerospace & UAV',
	seo: {
		title: 'Aerospace & UAV Titanium Fasteners — Grade 5 & 23',
		description:
			'Grade 5 Ti-6Al-4V and Grade 23 titanium fasteners for aerospace and UAV airframe, payload and flight hardware, M1.6-M36, with EN 10204 3.1 certificates.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Industries', href: '/industries/' },
			{ label: 'Aerospace & UAV' },
		],
		eyebrow: 'Aerospace & UAV',
		heading: 'Titanium Fasteners for Airframe and UAV Assemblies',
		lead:
			'Grade 5 Ti-6Al-4V and Grade 23 fasteners for airframe, payload and flight hardware, machined to DIN, ISO and ASTM with an EN 10204 3.1 certificate for every heat number.',
		badges: [
			{ value: 'M1.6-M36', label: 'Full thread range' },
			{ value: 'EN 10204 3.1', label: 'Certificate per heat' },
			{ value: 'AMS 2750', label: 'PMI on every lot' },
		],
		cta: { label: 'Request an aerospace quote', href: '#rfq-form' },
		secondaryCta: { label: 'See Grade 5 supply', href: '/products/grade-5-fasteners/' },
		image: {
			src: '/images/industries-aerospace/02-airplane-and-parts-illustration-with-gradient-ov.webp',
			alt: 'Aircraft structure with titanium fasteners and airframe parts in view.',
			width: 834,
			height: 667,
		},
	},
	subApplications: {
		heading: 'Where aerospace fasteners are specified',
		lead:
			'Two load paths dominate: primary structure that stays closed for the life of the aircraft, and removable hardware that ground crews open and close every day.',
		items: [
			{
				id: 'airframe-structure',
				eyebrow: 'Primary structure',
				heading: 'Airframe, wing attach and rib joint hardware',
				lead:
					'Primary structure carries cyclic flight loads. We supply the cap screws, flange bolts, nuts and washers that hold skin, spar and rib joints together in Grade 5.',
				image: {
					src: '/images/industries-aerospace/03-two-men-reviewing-cad-engineering-drawings-and-3.webp',
					alt: 'Engineers reviewing CAD drawings of an aircraft assembly.',
					width: 570,
					height: 760,
				},
				points: [
					{ label: 'Grade 5 Ti-6Al-4V', text: '828 MPa proof strength, published nominal' },
					{ label: 'DIN 912 and DIN 933', text: 'geometries held to your released drawing' },
					{ label: 'Finish on the order', text: 'AMS 2488 anodising or ASTM F86 passivation' },
				],
				cta: { label: 'View cap screw and bolt families', familyId: 'hex-socket-head-cap-bolts' },
				families: [
					'hex-socket-head-cap-bolts',
					'hexagon-flange-bolts',
					'hex-nut',
					'plain-washers',
				],
			},
			{
				id: 'removable-flight-hardware',
				eyebrow: 'Removable flight hardware',
				heading: 'Payload, sensor and avionics attachments',
				lead:
					'Gimbal, camera and avionics mounts are opened and closed repeatedly. Fastener selection there is about galling, mass and repeatability, not maximum strength.',
				image: {
					src: '/images/industries-aerospace/05-aircraft-wing-and-enging-landed-with-gradient.webp',
					alt: 'Aircraft wing and engine detail showing titanium fasteners in service.',
					width: 834,
					height: 667,
				},
				points: [
					{ label: 'Grade 5 or Grade 2', text: 'chosen by joint load, not by habit' },
					{ label: 'AMS 2488 anodising', text: 'keeps titanium surfaces from galling' },
					{ label: 'One heat per box', text: 'a spare matches the build it replaces' },
				],
				cta: { label: 'See button head and flange options', familyId: 'hex-socket-button-head-bolts' },
				families: [
					'hex-socket-button-head-bolts',
					'countersunk-head-cap-screws',
					'12-point-flange-bolts',
				],
			},
		],
	},
	comparison: {
		heading: 'Grades for aerospace fastening',
		lead:
			'Published nominal values for the grades that reach flight hardware. Every lot ships with the certificate that confirms the lot behind it.',
		note: 'Grade 7 is confirmed per order. We publish no torque, preload or friction figures; the certificate states the measured values of that lot.',
	},
	qa: {
		heading: 'How aerospace supply is controlled',
		lead:
			'Traceability, verification and finish control decide whether a lot can go into flight hardware. These are the practices behind every delivery.',
	},
	reference: {
		eyebrow: 'Reference application',
		heading: 'Unmanned aircraft airframe and payload joint',
		lead:
			'A small airframe repeats one load path in flight and one assembly sequence on the bench. The fastener has to hold both without adding mass the airframe cannot carry.',
		points: [
			{ label: 'One grade across the stack', text: 'the build stays repeatable' },
			{ label: 'Cap screws and flange bolts', text: 'carry structure and covers' },
			{ label: 'Grade 23 for sensor pods', text: 'where imaging and mass matter' },
		],
		image: {
			src: '/images/product-272/04-product-image-of-hex-socket-head-cap-screws-full.webp',
			alt: 'Titanium hex socket head cap screws from the BOZE catalogue.',
			width: 1280,
			height: 960,
		},
		facts: [
			{ label: 'Profile', value: 'Small unmanned aircraft, airframe joints and payload pod' },
			{ label: 'Challenge', value: 'cyclic flight load against a tight mass budget' },
			{ label: 'Solution', value: 'Grade 5 cap screws, 12-point flange bolts and matched washers' },
			{ label: 'Result', value: 'one heat number per box, 3.1 certificate per lot, MOQ from 100 pieces' },
		],
		cta: { label: 'Discuss your UAV assembly', href: '#rfq-form' },
		secondaryCta: { label: 'Grade 23 supply', href: materialHref('ti-gr23') },
	},
	faq: {
		heading: 'Questions aerospace buyers ask before ordering',
		items: [
			{
				question: 'Which titanium grade should an airframe joint use?',
				answer:
					'Grade 5 Ti-6Al-4V is the normal choice for primary structure and cover joints. Grade 23 ELI is used where mass matters and the joint is lightly loaded, and Grade 2 commercially pure titanium is reserved for non-structural fittings that sit in a wet environment.',
			},
			{
				question: 'Do you produce aerospace fasteners to our own drawings?',
				answer:
					'Yes. Special parts are machined or cold-forged to your drawing under NDA, with MOQ from 100 pieces per size. Your drawing is opened only after the mutual NDA is signed.',
			},
			{
				question: 'How do you stop titanium fasteners from galling in a joint?',
				answer:
					'The surface is the answer, not the torque. We supply AMS 2488 Type II and Type III anodised, ASTM F86 passivated and DLC dry-film finishes, and the finish is written on the order so every batch is made the same way.',
			},
			{
				question: 'Can you keep the same grade and finish across an aircraft programme?',
				answer:
					'Yes. Every batch is allocated to one heat number and packed in its own labelled box, and a VMI call-off programme can hold the grade and finish you repeat. A service order years later matches the grade and finish of the original build.',
			},
		],
	},
	rfq: {
		heading: 'Send your aerospace fastener list',
		lead:
			'Send the standard, the quantity and the drawing. Our engineering desk quotes from your bill of materials directly and confirms the grade, the certificate scope and the delivery date in writing.',
		note: 'NDA protected. Direct factory quote within 12 business hours. EN 10204 3.1 certified.',
	},
};
