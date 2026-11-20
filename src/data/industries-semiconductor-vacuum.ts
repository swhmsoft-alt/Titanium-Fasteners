/**
 * Semiconductor & vacuum — application page data for
 * `/industries/semiconductor-vacuum/`.
 *
 * DATA PROVENANCE
 * ---------------
 *   · Product cards and links come from the generated catalogue
 *     (`ALL_PRODUCTS` in @data/products) — no hand-typed catalogue URLs.
 *   · Grade values come from the generated `MATERIALS` dictionary; Grade 7 has
 *     no published row and reads "Confirmed per order".
 *   · Copy states only what the shop floor can verify: grade, standard,
 *     certificate scope, finish route and packaging rule.
 */
import type { AppPageData } from '@data/industries-application';
import { materialHref } from '@data/product-solutions/routes';

export const SEMICONDUCTOR_VACUUM: AppPageData = {
	slug: 'semiconductor-vacuum',
	industry: 'Semiconductor & Vacuum',
	seo: {
		title: 'Semiconductor & Vacuum Titanium Fasteners — Grade 23, Grade 5',
		description:
			'Grade 23 ELI and Grade 5 titanium fasteners for semiconductor cleanroom, vacuum chamber and wafer handling equipment, M1.6-M36, with EN 10204 3.1 certificates per heat.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Industries', href: '/industries/' },
			{ label: 'Semiconductor & Vacuum' },
		],
		eyebrow: 'Semiconductor & Vacuum',
		heading: 'Titanium Fasteners for Cleanroom and Vacuum Hardware',
		lead:
			'Grade 23 ELI and Grade 5 titanium fasteners for process chambers, wafer handling and cleanroom tooling, where the surface must not shed particles or outgas into the tool.',
		badges: [
			{ value: 'Grade 23 ELI', label: 'AMS 4928 bar stock' },
			{ value: 'EN 10204 3.1', label: 'Certificate per heat' },
			{ value: '100% PMI', label: 'Grade verification' },
		],
		cta: { label: 'Request a vacuum fastener quote', href: '#rfq-form' },
		secondaryCta: { label: 'See Grade 23 supply', href: materialHref('ti-gr23') },
		image: {
			src: '/images/industries-semiconductors/01-vacuum-room-for-semiconductor-industry.webp',
			alt: 'Cleanroom vacuum process area with wafer handling equipment.',
			width: 1152,
			height: 922,
		},
	},
	subApplications: {
		heading: 'Where vacuum and cleanroom fasteners are specified',
		lead:
			'Two environments sit close together: the chamber that has to hold vacuum, and the cleanroom tooling that has to stay clean while it is handled.',
		items: [
			{
				id: 'chamber-hardware',
				eyebrow: 'Vacuum hardware',
				heading: 'Chamber, flange and stage hardware',
				lead:
					'A chamber is opened for every clean and every service. The fastening pattern has to hold alignment through vacuum cycles and thermal cycling without leaving particles behind.',
				image: {
					src: '/images/industries-semiconductors/08-a-line-of-wafer-transfer-system-for-semiconducto.webp',
					alt: 'Wafer transfer system inside a semiconductor production line.',
					width: 1300,
					height: 731,
				},
				points: [
					{ label: 'Grade 23 ELI', text: 'low interstitial content for vacuum service' },
					{ label: 'No plating', text: 'nothing to flake into the chamber' },
					{ label: 'Passivated surface', text: 'ASTM F86, oxide protected and clean' },
				],
				cta: { label: 'View cap screw and bolt families', familyId: 'hex-socket-head-cap-bolts' },
				families: [
					'hex-socket-head-cap-bolts',
					'hex-socket-button-head-bolts',
					'hex-nut',
				],
			},
			{
				id: 'cleanroom-tooling',
				eyebrow: 'Cleanroom tooling',
				heading: 'Robot gripper and handling tool fixings',
				lead:
					'Handling tools live in the cleanroom and are wiped down every shift. The fastener selection is about surface cleanliness and repeatable release, not peak strength.',
				image: {
					src: '/images/industries-semiconductors/11-support-system-vacuum-pump-on-a-white-background.webp',
					alt: 'Vacuum pump support system used in semiconductor process tooling.',
					width: 1300,
					height: 731,
				},
				points: [
					{ label: 'Flat heads', text: 'DIN 7991 for flush tool surfaces' },
					{ label: 'Grade 2 or Grade 23', text: 'chosen by the joint, not by the tool' },
					{ label: 'Batch traceability', text: 'one heat number per labelled box' },
				],
				cta: { label: 'See countersunk and button head options', familyId: 'countersunk-head-cap-screws' },
				families: ['countersunk-head-cap-screws', 'hex-socket-button-head-bolts', 'plain-washers'],
			},
		],
	},
	comparison: {
		heading: 'Grades for vacuum and cleanroom service',
		lead:
			'Published nominal values for the grades specified in cleanroom and vacuum work. Every lot ships with the certificate that confirms the lot behind it.',
		note: 'Grade 7 is confirmed per order. We publish no torque, preload or friction figures; the certificate states the measured values of that lot.',
	},
	qa: {
		heading: 'How vacuum supply is controlled',
		lead:
			'A cleanroom buyer judges a lot on material identity and surface state. These are the practices that sit behind every delivery.',
	},
	reference: {
		eyebrow: 'Reference application',
		heading: 'Wafer handling robot end effector',
		lead:
			'A wafer robot picks up a single part worth more than the tool that holds it. The fixings on the end effector are opened and closed millions of times in a controlled atmosphere.',
		points: [
			{ label: 'Grade 23 ELI', text: 'consistent across the tool build' },
			{ label: 'Anti-galling finish', text: 'protects the titanium interface' },
			{ label: '3.1 certificate', text: 'per lot, tied to one heat number' },
		],
		image: {
			src: '/images/industries-semiconductors/17-close-up-of-a-jextar-titan-high-strength-titaniu.webp',
			alt: 'Close-up of a high-strength titanium fastener for cleanroom tooling.',
			width: 1300,
			height: 731,
		},
		facts: [
			{ label: 'Profile', value: 'Wafer handling robot, end effector and gripper body' },
			{ label: 'Challenge', value: 'repeated tool changes with a particle limit and no galling on release' },
			{ label: 'Solution', value: 'Grade 23 ELI cap screws and button head screws, anti-galling finish' },
			{ label: 'Result', value: 'one heat per box, MOQ from 100 pieces, call-off programme available' },
		],
		cta: { label: 'Discuss your vacuum hardware', href: '#rfq-form' },
		secondaryCta: { label: 'Grade 5 supply', href: '/products/grade-5-fasteners/' },
	},
	faq: {
		heading: 'Questions vacuum and cleanroom buyers ask before ordering',
		items: [
			{
				question: 'Why Grade 23 ELI for vacuum chamber hardware?',
				answer:
					'Grade 23 ELI is the extra low interstitial form of Ti-6Al-4V. The lower interstitial content reduces the risk of contamination in vacuum service, and it is the grade normally specified where the part is machined from bar.',
			},
			{
				question: 'Are the fasteners passivated for cleanroom use?',
				answer:
					'Yes. Parts are supplied passivated to ASTM F86, which leaves a clean, oxide-protected surface and no plating or zinc layer that could shed particles into a cleanroom or outgas into a chamber.',
			},
			{
				question: 'Can you produce vacuum fasteners to our drawings?',
				answer:
					'Yes. Special parts are machined or cold-forged to your drawing under NDA, with MOQ from 100 pieces per size. Your drawing is opened only after the mutual NDA is signed.',
			},
			{
				question: 'How do you keep a programme of tools on one grade and finish?',
				answer:
					'Every batch is allocated to one heat number and packed in its own labelled box, and a VMI call-off programme can hold the grade and finish you repeat. A service order years later matches the grade and finish of the original build.',
			},
		],
	},
	rfq: {
		heading: 'Send your vacuum fastener list',
		lead:
			'Send the standard, the quantity and the drawing. Our engineering desk quotes from your bill of materials directly and confirms the grade, the certificate scope and the delivery date in writing.',
		note: 'NDA protected. Direct factory quote within 12 business hours. EN 10204 3.1 certified.',
	},
};
