/**
 * Desalination — application page data for `/industries/desalination/`.
 *
 * IMAGE SOURCING NOTE
 * -------------------
 * The local library holds no dedicated desalination image set. The visuals here
 * are the closest honest matches: fluid-handling hardware, sealing elements
 * and machined custom parts. None is presented as a photograph of a specific
 * desalination plant.
 *
 * DATA PROVENANCE
 * ---------------
 *   · Product cards and links come from the generated catalogue
 *     (`ALL_PRODUCTS` in @data/products) — no hand-typed catalogue URLs.
 *   · Grade values come from the generated `MATERIALS` dictionary; Grade 7 has
 *     no published row and reads "Confirmed per order".
 */
import type { AppPageData } from '@data/industries-application';
import { materialHref } from '@data/product-solutions/routes';

export const DESALINATION: AppPageData = {
	slug: 'desalination',
	industry: 'Desalination',
	seo: {
		title: 'Desalination Titanium Fasteners — Grade 2 Seawater Service',
		description:
			'Grade 2 and Grade 7 titanium fasteners for desalination reverse osmosis skids, intake structures and high-pressure piping, M1.6-M36, with EN 10204 3.1 certificates per lot.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Industries', href: '/industries/' },
			{ label: 'Desalination' },
		],
		eyebrow: 'Desalination',
		heading: 'Titanium Fasteners for Reverse Osmosis and Seawater Systems',
		lead:
			'Grade 2 titanium fasteners for reverse osmosis skids, intake structures and high-pressure piping, in continuous contact with seawater and brine.',
		badges: [
			{ value: 'Grade 2 / Grade 7', label: 'Seawater and brine service' },
			{ value: 'EN 10204 3.1', label: 'Certificate per heat' },
			{ value: 'No plating', label: 'No coating to fail underwater' },
		],
		cta: { label: 'Request a desalination quote', href: '#rfq-form' },
		secondaryCta: { label: 'See Grade 2 supply', href: '/products/grade-2-fasteners/' },
		image: {
			src: '/images/category-detail-fluid-management/01-pressure-intensifiers-and-quick-connectors-for-f.webp',
			alt: 'Pressure intensifiers and quick connectors used in high-pressure fluid systems.',
			width: 1152,
			height: 922,
		},
	},
	subApplications: {
		heading: 'Where desalination fasteners are specified',
		lead:
			'A desalination plant is one continuous seawater system with two very different zones: the intake, which is immersed, and the high-pressure skid, which is worked on every day.',
		items: [
			{
				id: 'ro-skid',
				eyebrow: 'Reverse osmosis skid',
				heading: 'High-pressure vessel and membrane housing fixings',
				lead:
					'The pressure vessel and the membrane housings are opened for cleaning and for element replacement. The joint has to hold pressure and resist the brine it sits in.',
				image: {
					src: '/images/industries-data-centers/67-three-stainless-steel-hydraulic-quick-connect-co.webp',
					alt: 'Hydraulic quick connectors used on pressurised process lines.',
					width: 928,
					height: 522,
				},
				points: [
					{ label: 'Grade 2 CP titanium', text: 'rated 4 of 5 for corrosion resistance' },
					{ label: 'Studs and flange bolts', text: 'for flanged pressure connections' },
					{ label: 'Passivated surface', text: 'ASTM F86, oxide protected in brine' },
				],
				cta: { label: 'View stud and flange bolt families', familyId: 'double-end-stud-bolts' },
				families: ['double-end-stud-bolts', 'hexagon-flange-bolts', 'hex-nut', 'plain-washers'],
			},
			{
				id: 'intake-and-piping',
				eyebrow: 'Intake and piping',
				heading: 'Intake structure, screens and pipe supports',
				lead:
					'The intake side works in open seawater with wave motion and debris. Fixings there are chosen for the environment and for the fact that they are inspected rarely but replaced often.',
				image: {
					src: '/images/special-parts-and-custom-fasteners/23-cnc-turned-cylinder-metal.webp',
					alt: 'CNC turned metal cylinders made as custom machined parts.',
					width: 1300,
					height: 731,
				},
				points: [
					{ label: 'Grade 2 for immersion', text: 'constant contact with seawater' },
					{ label: 'Hex heads', text: 'standard tooling for pump crews' },
					{ label: 'Custom machined parts', text: 'printed to part under NDA' },
				],
				cta: { label: 'See hex head and washer options', familyId: 'hexagon-head-bolts-full-thread' },
				families: ['hexagon-head-bolts-full-thread', 'hex-head-bolts-fully-threaded', 'plain-washers'],
			},
		],
	},
	comparison: {
		heading: 'Grades for seawater service',
		lead:
			'Published nominal values for the grades specified in desalination work. Every lot ships with the certificate that confirms the lot behind it.',
		note: 'Grade 7 is confirmed per order. We publish no torque, preload or friction figures; the certificate states the measured values of that lot.',
	},
	qa: {
		heading: 'How desalination supply is controlled',
		lead:
			'A plant expects the same part at every call-off, in the same grade and finish. These are the practices that make that possible.',
	},
	reference: {
		eyebrow: 'Reference application',
		heading: 'Seawater intake pump station frame',
		lead:
			'An intake station is in the splash zone: wet, salty and worked on with the plant partly in service. The fixings have to resist the water and still be reachable with standard tools.',
		points: [
			{ label: 'Grade 2 CP titanium', text: 'no coating renewal cycle' },
			{ label: 'Hex head bolts', text: 'standard tooling on the pump skid' },
			{ label: 'One heat per box', text: 'so a replacement matches the original' },
		],
		image: {
			src: '/images/category-detail-sealing-technology/01-an-overview-of-sealing-plugs-and-check-valves-on.webp',
			alt: 'Sealing plugs and check valves installed on process equipment.',
			width: 1152,
			height: 922,
		},
		facts: [
			{ label: 'Profile', value: 'Seawater intake station, pump skid frames and screen structures' },
			{ label: 'Challenge', value: 'continuous salt exposure with a wet maintenance environment' },
			{ label: 'Solution', value: 'Grade 2 hex bolts, flange bolts and hex nuts, passivated' },
			{ label: 'Result', value: '3.1 certificate per lot, one heat per box, MOQ from 100 pieces' },
		],
		cta: { label: 'Discuss your desalination equipment', href: '#rfq-form' },
		secondaryCta: { label: 'Grade 7 supply', href: materialHref('ti-gr23') },
	},
	faq: {
		heading: 'Questions desalination buyers ask before ordering',
		items: [
			{
				question: 'Which titanium grade suits seawater service?',
				answer:
					'Grade 2 commercially pure titanium is the normal choice. Its corrosion resistance rating in the published table is 4 of 5, and it forms its own protective oxide layer in continuous seawater. Grade 7 is specified where the medium is more aggressive.',
			},
			{
				question: 'Do titanium fasteners need a coating underwater?',
				answer:
					'No. The corrosion resistance is in the material itself. Parts are supplied passivated to ASTM F86 so the surface is clean and oxide protected, and there is no plating or zinc layer that can fail and release into the seawater.',
			},
			{
				question: 'Can you supply studs and flange bolts for pressure vessels?',
				answer:
					'Yes. Double-end stud bolts to DIN 938 and DIN 939 and hexagon flange bolts are produced in the titanium grades, and special parts can be machined to your drawing under NDA with MOQ from 100 pieces per size.',
			},
			{
				question: 'How do you guarantee the same part at every call-off?',
				answer:
					'Every batch is allocated to one heat number and packed in its own labelled box, and a VMI call-off programme can hold the grade and finish you repeat. Each delivery carries its own EN 10204 3.1 certificate.',
			},
		],
	},
	rfq: {
		heading: 'Send your desalination fastener list',
		lead:
			'Send the medium, the standard, the quantity and the drawing. Our engineering desk quotes from your bill of materials directly and confirms the grade, the certificate scope and the delivery date in writing.',
		note: 'NDA protected. Direct factory quote within 12 business hours. EN 10204 3.1 certified.',
	},
};
