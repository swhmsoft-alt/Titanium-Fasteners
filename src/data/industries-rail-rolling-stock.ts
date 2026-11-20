/**
 * Rail & Rolling Stock — application page data for `/industries/rail-rolling-stock/`.
 *
 * IMAGE SOURCING NOTE
 * -------------------
 * The visuals come from the local railway image set: railcar bodies, interior
 * layouts and the specific fastening products used on rolling stock. None is
 * presented as a photograph of a named operator or a specific fleet.
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

export const RAIL_ROLLING_STOCK: AppPageData = {
	slug: 'rail-rolling-stock',
	industry: 'Rail & Rolling Stock',
	seo: {
		title: 'Rail & Rolling Stock Titanium Fasteners — Vibration-Resistant Fixings',
		description:
			'Grade 2 and Grade 5 titanium fasteners for railcar bodies, interiors and lineside equipment, M1.6-M36, with EN 10204 3.1 certificates per heat number.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Industries', href: '/industries/' },
			{ label: 'Rail & Rolling Stock' },
		],
		eyebrow: 'Rail & Rolling Stock',
		heading: 'Titanium Fasteners for Railcar Bodies, Interiors and Lineside Equipment',
		lead:
			'Grade 5 and Grade 2 titanium fasteners for railcar structures, passenger interiors and lineside equipment, where continuous vibration and weather exposure punish the wrong fixing.',
		badges: [
			{ value: 'Grade 2 / Grade 5', label: 'Structure, interior and lineside service' },
			{ value: 'EN 10204 3.1', label: 'Certificate per heat' },
			{ value: 'Anti-loosening geometry', label: 'Tension control and locking options' },
		],
		cta: { label: 'Request a rail fastener quote', href: '#rfq-form' },
		secondaryCta: { label: 'See Grade 5 supply', href: '/products/grade-5-fasteners/' },
		image: {
			src: '/images/industries-railway/21-external-overview-of-a-railcar-body.webp',
			alt: 'External overview of a railcar body showing the body-side fastening points.',
			width: 725,
			height: 580,
		},
	},
	subApplications: {
		heading: 'Where rolling stock fasteners are specified',
		lead:
			'Two assemblies dominate the call-off: the car body and its equipment, and the passenger interior that is handled and cleaned every day of service.',
		items: [
			{
				id: 'carbody-and-equipment',
				eyebrow: 'Car body and equipment',
				heading: 'Body frame, roof equipment and underframe fixings',
				lead:
					'Roof-mounted equipment, underframe components and body panels are fixed to a structure that vibrates continuously and works in rain, snow and washing chemicals.',
				image: {
					src: '/images/industries-railway/74-energy-supply-of-railcar-vehicles-with-white-bac.webp',
					alt: 'Energy supply equipment mounted on the roof of a railcar vehicle.',
					width: 928,
					height: 522,
				},
				points: [
					{ label: 'Grade 5 Ti-6Al-4V', text: '828 MPa proof strength, published nominal' },
					{ label: 'Tension control bolts', text: 'controlled preload on structural joints' },
					{ label: 'Anti-loosening options', text: 'wedge and prevailing-torque geometry' },
				],
				cta: { label: 'View flange bolt and cap screw families', familyId: 'hexagon-flange-bolts' },
				families: [
					'hexagon-flange-bolts',
					'hex-socket-head-cap-bolts',
					'hexagon-head-bolts-partial-thread',
					'hex-nut',
				],
			},
			{
				id: 'interior-and-lineside',
				eyebrow: 'Interior and lineside',
				heading: 'Interior fittings, seating and lineside cabinet fixings',
				lead:
					'Interior fittings are opened daily, cleaned with aggressive chemistry and exposed to passengers. Lineside cabinets sit outdoors on ballast and are rarely looked at again.',
				image: {
					src: '/images/industries-railway/49-interior-layout-of-railway-vehicles.webp',
					alt: 'Interior layout of a railway vehicle showing seating and equipment positions.',
					width: 725,
					height: 580,
				},
				points: [
					{ label: 'Grade 2 CP titanium', text: 'no rust staining on interior surfaces' },
					{ label: 'Corrosion resistant', text: 'rated 4 of 5 for corrosion resistance' },
					{ label: 'Countersunk options', text: 'flush fixings where surfaces are handled' },
				],
				cta: { label: 'View countersunk and button head families', familyId: 'countersunk-head-cap-screws' },
				families: [
					'countersunk-head-cap-screws',
					'hex-socket-button-head-bolts',
					'plain-washers',
					'hex-nut',
				],
			},
		],
	},
	comparison: {
		heading: 'Grades for rolling stock and lineside work',
		lead:
			'Published nominal values for the grades specified in rail work. Every lot ships with the certificate that confirms the lot behind it.',
		note: 'Grade 7 is confirmed per order. We publish no torque, preload or friction figures; the certificate states the measured values of that lot.',
	},
	qa: {
		heading: 'How rail supply is controlled',
		lead:
			'A rolling stock programme repeats the same part for years. These are the practices that make every one of those parts the same.',
	},
	reference: {
		eyebrow: 'Reference application',
		heading: 'Railcar interior fit-out and seat mounting',
		lead:
			'Interior fit-out is specified against cleaning chemistry, passenger wear and a vibration background. The fixings have to stay tight and stay presentable.',
		points: [
			{ label: 'Grade 2 on interior fixings', text: 'no rust staining on visible surfaces' },
			{ label: 'Grade 5 on structure', text: 'carries vibration and road load' },
			{ label: 'One heat per box', text: 'so a replacement matches the original' },
		],
		image: {
			src: '/images/industries-railway/25-close-up-of-a-lockbolt.webp',
			alt: 'Close-up of a lockbolt used on vibration-prone structural joints.',
			width: 928,
			height: 522,
		},
		facts: [
			{ label: 'Profile', value: 'Railcar interior fit-out, seat frames, equipment cabinets and lineside enclosures' },
			{ label: 'Challenge', value: 'continuous vibration with daily cleaning chemistry and passenger wear' },
			{ label: 'Solution', value: 'Grade 2 countersunk and button head fixings, Grade 5 structural bolts' },
			{ label: 'Result', value: '3.1 certificate per lot, one heat per box, MOQ from 100 pieces' },
		],
		cta: { label: 'Discuss your rolling stock project', href: '#rfq-form' },
		secondaryCta: { label: 'Grade 2 supply', href: materialHref('ti-gr2') },
	},
	faq: {
		heading: 'Questions rail buyers ask before ordering',
		items: [
			{
				question: 'Which grade should a structural rail body fixing use?',
				answer:
					'Grade 5 Ti-6Al-4V is the normal choice where the fixing carries load or sees continuous vibration. Its published proof strength is 828 MPa. Grade 2 is used for light interior fittings and covers that only need corrosion resistance.',
			},
			{
				question: 'How do you prevent loosening under vibration?',
				answer:
					'Geometry does the work, not extra torque. We supply wedge-locking fasteners, prevailing-torque hex nuts and tension control bolts for structural joints, and the anti-loosening route is written on the order so every batch is made the same way.',
			},
			{
				question: 'Are titanium fasteners acceptable for interior fittings?',
				answer:
					'Grade 2 is used for interior fit-out where corrosion staining would be visible and cleaning chemistry is aggressive. The corrosion resistance rating in the published table is 4 of 5, and there is no zinc or plating layer to shed.',
			},
			{
				question: 'Can you machine rail fasteners to our drawings?',
				answer:
					'Yes. Special parts are machined or cold-forged to your drawing under NDA, with MOQ from 100 pieces per size. Your drawing is opened only after the mutual NDA is signed.',
			},
		],
	},
	rfq: {
		heading: 'Send your rail fastener list',
		lead:
			'Send the standard, the quantity and the drawing. Our engineering desk quotes from your bill of materials directly and confirms the grade, the certificate scope and the delivery date in writing.',
		note: 'NDA protected. Direct factory quote within 12 business hours. EN 10204 3.1 certified.',
	},
};
