/**
 * Electric vehicles — application page data for `/industries/electric-vehicles/`.
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

export const ELECTRIC_VEHICLES: AppPageData = {
	slug: 'electric-vehicles',
	industry: 'Electric Vehicles',
	seo: {
		title: 'Electric Vehicle Titanium Fasteners — Battery, Chassis, Grade 5',
		description:
			'Grade 5 Ti-6Al-4V and Grade 2 titanium fasteners for EV battery housings, chassis joints and e-bike assemblies, M1.6-M36, with EN 10204 3.1 certificates per lot.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Industries', href: '/industries/' },
			{ label: 'Electric Vehicles' },
		],
		eyebrow: 'Electric Vehicles',
		heading: 'Titanium Fasteners for EV Battery and Chassis Assemblies',
		lead:
			'Grade 5 Ti-6Al-4V fasteners for battery enclosures, subframes and chassis joints, where mass, heat cycling and galvanic isolation have to be solved with the same part.',
		badges: [
			{ value: 'M1.6-M36', label: 'Full thread range' },
			{ value: 'EN 10204 3.1', label: 'Certificate per heat' },
			{ value: '100% PMI', label: 'Grade verification' },
		],
		cta: { label: 'Request an EV fastener quote', href: '#rfq-form' },
		secondaryCta: { label: 'See Grade 5 supply', href: '/products/grade-5-fasteners/' },
		image: {
			src: '/images/industries-electric-vehicles/01-a-woman-and-two-men-standing-in-front-of-an-elec.webp',
			alt: 'Engineers in front of an electric vehicle on a development programme.',
			width: 1152,
			height: 922,
		},
	},
	subApplications: {
		heading: 'Where EV fasteners are specified',
		lead:
			'Two assemblies dominate the fastener call-off: the battery enclosure that carries the pack, and the chassis joints that carry everything else.',
		items: [
			{
				id: 'battery-enclosure',
				eyebrow: 'Battery systems',
				heading: 'Battery enclosure, module and busbar fixings',
				lead:
					'The enclosure is a sealed structure with a thermal budget and a vibration life. Fasteners hold the lid, the modules and the busbar shields together through both.',
				image: {
					src: '/images/industries-electric-vehicles/17-hybrid-electric-truck-charging-at-station-3d-ren.webp',
					alt: 'Electric truck at a charging station showing the high-voltage energy architecture.',
					width: 960,
					height: 720,
				},
				points: [
					{ label: 'Grade 5 Ti-6Al-4V', text: '828 MPa proof strength, published nominal' },
					{ label: 'Sealed joints', text: 'anodised or passivated, no zinc to outgas' },
					{ label: 'Galvanic isolation', text: 'titanium avoids the steel-to-aluminium couple' },
				],
				cta: { label: 'View cap screw and stud families', familyId: 'hex-socket-head-cap-bolts' },
				families: [
					'hex-socket-head-cap-bolts',
					'double-end-stud-bolts',
					'hex-nut',
					'plain-washers',
				],
			},
			{
				id: 'chassis-and-frames',
				eyebrow: 'Chassis and frames',
				heading: 'Subframe, suspension and body joint hardware',
				lead:
					'Chassis joints see the full vehicle mass over every kerb and speed bump. They also see heat from the pack and the motors, which rules out coatings that cannot take it.',
				image: {
					src: '/images/industries/03-electric-car-standing-on-the-roadside-being-char.webp',
					alt: 'Electric car on the roadside during a charging stop.',
					width: 834,
					height: 667,
				},
				points: [
					{ label: 'Heat tolerant', text: 'Grade 5 rated to 315 C service' },
					{ label: 'Anti-galling', text: 'AMS 2488 anodising or DLC dry film' },
					{ label: 'Mass saving', text: 'about 44% lighter than steel at the same size' },
				],
				cta: { label: 'See flange and torx options', familyId: 'hexagon-flange-bolts' },
				families: ['hexagon-flange-bolts', 'torx-flange-head-bolts', '12-point-flange-bolts'],
			},
		],
	},
	comparison: {
		heading: 'Grades for EV fastening',
		lead:
			'Published nominal values for the grades specified in electric vehicle work. Every lot ships with the certificate that confirms the lot behind it.',
		note: 'Grade 7 is confirmed per order. We publish no torque, preload or friction figures; the certificate states the measured values of that lot.',
	},
	qa: {
		heading: 'How EV supply is controlled',
		lead:
			'A vehicle programme repeats the same part hundreds of thousands of times. These are the practices that make every one of those parts the same.',
	},
	reference: {
		eyebrow: 'Reference application',
		heading: 'Two-wheel electric vehicle drive assembly',
		lead:
			'A two-wheeler puts the motor, the controller and the battery in one small frame that is ridden in rain and heat. The fasteners have to hold it together and stay quiet.',
		points: [
			{ label: 'Grade 5 on the motor mount', text: 'carries vibration and road load' },
			{ label: 'Grade 2 on covers', text: 'corrosion resistance where it is washed' },
			{ label: 'Anti-galling finish', text: 'protects the titanium interface' },
		],
		image: {
			src: '/images/industries-electric-vehicles/03-fasteners-for-diverse-industries.webp',
			alt: 'Assorted titanium fasteners used in vehicle and industrial assembly.',
			width: 935,
			height: 401,
		},
		facts: [
			{ label: 'Profile', value: 'Electric two-wheeler, motor mount, controller cover and battery bracket' },
			{ label: 'Challenge', value: 'vibration, road splash and a low mass budget in one frame' },
			{ label: 'Solution', value: 'Grade 5 cap screws, flange bolts and hex nuts, anti-galling finish' },
			{ label: 'Result', value: 'one heat per box, 3.1 certificate per lot, MOQ from 100 pieces' },
		],
		cta: { label: 'Discuss your EV assembly', href: '#rfq-form' },
		secondaryCta: { label: 'Grade 2 supply', href: materialHref('ti-gr2') },
	},
	faq: {
		heading: 'Questions EV engineers ask before ordering',
		items: [
			{
				question: 'Why titanium rather than steel in an EV battery enclosure?',
				answer:
					'Two reasons dominate. Titanium does not corrode in the presence of a battery electrolyte or road salt, and it does not form a galvanic couple with the aluminium enclosure it is bolted to, so the surrounding metal is not sacrificed at the joint.',
			},
			{
				question: 'Which grade should a battery module fixing use?',
				answer:
					'Grade 5 Ti-6Al-4V is the normal choice where the fixing carries load or sees vibration. Grade 2 commercially pure titanium is used for covers and light brackets that only need corrosion resistance and the ability to be formed or bent.',
			},
			{
				question: 'Can you machine EV fasteners to our drawings?',
				answer:
					'Yes. Special parts are machined or cold-forged to your drawing under NDA, with MOQ from 100 pieces per size. Your drawing is opened only after the mutual NDA is signed.',
			},
			{
				question: 'How do you handle galling between titanium fasteners?',
				answer:
					'The surface is the answer, not the torque. We supply AMS 2488 Type II and Type III anodised, ASTM F86 passivated and DLC dry-film finishes, and the finish is written on the order so every batch is made the same way.',
			},
		],
	},
	rfq: {
		heading: 'Send your EV fastener list',
		lead:
			'Send the standard, the quantity and the drawing. Our engineering desk quotes from your bill of materials directly and confirms the grade, the certificate scope and the delivery date in writing.',
		note: 'NDA protected. Direct factory quote within 12 business hours. EN 10204 3.1 certified.',
	},
};
