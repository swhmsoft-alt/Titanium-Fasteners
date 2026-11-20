/**
 * Chemical & corrosion — application page data for `/industries/chemical-corrosion/`.
 *
 * IMAGE SOURCING NOTE
 * -------------------
 * There is no dedicated chemical-process image set in the local library, so the
 * visuals here are the closest honest matches we hold: corrosion-protection
 * coating samples, functional coating selections and fluid-handling hardware.
 * Nothing here is presented as a photograph of a specific plant.
 *
 * DATA PROVENANCE
 * ---------------
 *   · Product cards and links come from the generated catalogue
 *     (`ALL_PRODUCTS` in @data/products) — no hand-typed catalogue URLs.
 *   · Grade values come from the generated `MATERIALS` dictionary; Grade 7 has
 *     no published row and reads "Confirmed per order".
 */
import type { AppPageData } from '@data/industries-application';

export const CHEMICAL_CORROSION: AppPageData = {
	slug: 'chemical-corrosion',
	industry: 'Chemical & Corrosion',
	seo: {
		title: 'Chemical & Corrosion Titanium Fasteners — Grade 2, Grade 7',
		description:
			'Grade 2 and Grade 7 titanium fasteners for chlor-alkali, acid, salt and process equipment, M1.6-M36, with EN 10204 3.1 certificates per heat number.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Industries', href: '/industries/' },
			{ label: 'Chemical & Corrosion' },
		],
		eyebrow: 'Chemical & Corrosion',
		heading: 'Titanium Fasteners for Chemical Process and Aggressive Service',
		lead:
			'Grade 2 and Grade 7 titanium fasteners for chlor-alkali, acid and salt service, where the joint has to resist the medium without a coating that has to be renewed.',
		badges: [
			{ value: 'Grade 2 / Grade 7', label: 'CP titanium for acid and chloride service' },
			{ value: 'EN 10204 3.1', label: 'Certificate per heat' },
			{ value: 'No plating', label: 'Nothing to flake into the process' },
		],
		cta: { label: 'Request a corrosion fastener quote', href: '#rfq-form' },
		secondaryCta: { label: 'See Grade 2 supply', href: '/products/grade-2-fasteners/' },
		image: {
			src: '/images/fastener-coatings/04-corrosion-protection-coating-image-screw-with-wa.webp',
			alt: 'Titanium screw with a corrosion protection coating sample beside it.',
			width: 960,
			height: 720,
		},
	},
	subApplications: {
		heading: 'Where corrosion-resistant fasteners are specified',
		lead:
			'Process equipment splits into two working environments: the wetted vessel and the frame that carries it. Each asks a different question of the fastener.',
		items: [
			{
				id: 'wetted-process',
				eyebrow: 'Wetted process equipment',
				heading: 'Vessel, flange and heat exchanger fixings',
				lead:
					'The fastener sits in the medium or in the vapour space above it. Titanium handles the environment as the material, not as a coating on top of it.',
				image: {
					src: '/images/special-parts-and-custom-fasteners/47-selection-of-functional-coatings.webp',
					alt: 'Selection of functional coatings and surface finishes for fasteners.',
					width: 1300,
					height: 731,
				},
				points: [
					{ label: 'Grade 2 CP titanium', text: 'rated 4 of 5 for corrosion resistance' },
					{ label: 'Grade 7 on request', text: 'confirmed per order with the certificate' },
					{ label: 'ASTM F86 passivation', text: 'oxide protected surface, no plating' },
				],
				cta: { label: 'View hex nut and stud families', familyId: 'double-end-stud-bolts' },
				families: ['double-end-stud-bolts', 'hex-nut', 'hexagon-flange-bolts'],
			},
			{
				id: 'process-support',
				eyebrow: 'Process support and skid',
				heading: 'Skid frame, platform and guard fixings',
				lead:
					'Outside the vessel the environment is splash, salt air and washdown. Here the fastener has to resist the weather and still be replaceable with a standard tool.',
				image: {
					src: '/images/category-detail-fluid-management/01-pressure-intensifiers-and-quick-connectors-for-f.webp',
					alt: 'Pressure intensifiers and quick connectors used in fluid handling equipment.',
					width: 1152,
					height: 922,
				},
				points: [
					{ label: 'Grade 2 for the frame', text: 'where strength is not the driver' },
					{ label: 'Hex heads', text: 'standard tooling for maintenance crews' },
					{ label: 'Call-off stock', text: 'held grade and finish for repeat orders' },
				],
				cta: { label: 'See hex head and washer options', familyId: 'hexagon-head-bolts-full-thread' },
				families: ['hexagon-head-bolts-full-thread', 'plain-washers', 'hex-head-bolts-fully-threaded'],
			},
		],
	},
	comparison: {
		heading: 'Grades for corrosive service',
		lead:
			'Published nominal values for the grades specified in chemical and chloride service. Every lot ships with the certificate that confirms the lot behind it.',
		note: 'Grade 7 is confirmed per order. We publish no torque, preload or friction figures; the certificate states the measured values of that lot.',
	},
	qa: {
		heading: 'How corrosion supply is controlled',
		lead:
			'In process service the paperwork is part of the product. These are the practices that sit behind every lot we ship.',
	},
	reference: {
		eyebrow: 'Reference application',
		heading: 'Chlor-alkali cell room skid frame',
		lead:
			'A cell room is wet, warm and full of salt. The frame around the cells is opened for inspection every cycle, so the fixings have to resist the atmosphere and still come out cleanly.',
		points: [
			{ label: 'Grade 2 CP titanium', text: 'no coating renewal cycle' },
			{ label: 'Hex head bolts', text: 'standard tooling on the skid' },
			{ label: 'One heat per box', text: 'so a replacement matches the original' },
		],
		image: {
			src: '/images/category-detail-sealing-technology/01-an-overview-of-sealing-plugs-and-check-valves-on.webp',
			alt: 'Sealing plugs and check valves used on process equipment.',
			width: 1152,
			height: 922,
		},
		facts: [
			{ label: 'Profile', value: 'Chlor-alkali cell room, skid frames, platforms and vessel connections' },
			{ label: 'Challenge', value: 'wet salt atmosphere with frequent inspection access' },
			{ label: 'Solution', value: 'Grade 2 hex bolts, flange bolts and hex nuts, passivated' },
			{ label: 'Result', value: '3.1 certificate per lot, one heat per box, MOQ from 100 pieces' },
		],
		cta: { label: 'Discuss your process equipment', href: '#rfq-form' },
		secondaryCta: {
			label: 'Grade supply matrix',
			href: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
		},
	},
	faq: {
		heading: 'Questions process buyers ask before ordering',
		items: [
			{
				question: 'Is Grade 2 titanium enough for chlor-alkali service?',
				answer:
					'Grade 2 commercially pure titanium is the standard answer for chloride and salt service because it forms its own protective oxide layer. Where the medium contains oxidising acid, or where the temperature is higher, Grade 7 or Grade 5 is normally specified instead.',
			},
			{
				question: 'What does Grade 7 add over Grade 2?',
				answer:
					'Grade 7 is Ti-6Al-4V with palladium added. The palladium improves resistance to reducing acids such as hydrochloric and sulphuric acid. Grade 7 is confirmed per order, and the certificate states the values for the lot.',
			},
			{
				question: 'Do titanium fasteners need a protective coating in chemical service?',
				answer:
					'No. The corrosion resistance is in the material. We supply the parts passivated to ASTM F86 so the surface is clean and oxide protected, and there is no plating or zinc layer that can fail and contaminate the process.',
			},
			{
				question: 'Can you machine corrosion-resistant fasteners to our drawings?',
				answer:
					'Yes. Special parts are machined or cold-forged to your drawing under NDA, with MOQ from 100 pieces per size. Your drawing is opened only after the mutual NDA is signed.',
			},
		],
	},
	rfq: {
		heading: 'Send your corrosion fastener list',
		lead:
			'Send the medium, the standard, the quantity and the drawing. Our engineering desk quotes from your bill of materials directly and confirms the grade, the certificate scope and the delivery date in writing.',
		note: 'NDA protected. Direct factory quote within 12 business hours. EN 10204 3.1 certified.',
	},
};
