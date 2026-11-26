/**
 * Marine & Offshore — application page data for `/industries/marine-offshore/`.
 *
 * IMAGE SOURCING NOTE
 * -------------------
 * The local library holds no dedicated marine image set. The visuals here are
 * the closest honest matches: sealing and valve hardware, structural rivets,
 * hydraulic quick connectors and anti-loosening elements. None is presented
 * as a photograph of a specific vessel or offshore platform.
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

export const MARINE_OFFSHORE: AppPageData = {
	slug: 'marine-offshore',
	industry: 'Marine & Offshore',
	seo: {
		title: 'Marine & Offshore Titanium Fasteners — Grade 2 Seawater Service',
		description:
			'Grade 2 titanium fasteners for marine deck equipment, offshore piping and splash-zone assemblies, M1.6-M36, with EN 10204 3.1 certificates per heat number.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Industries', href: '/industries/' },
			{ label: 'Marine & Offshore' },
		],
		eyebrow: 'Marine & Offshore',
		heading: 'Titanium Fasteners for Marine and Offshore Equipment',
		lead:
			'Grade 2 titanium fasteners for deck equipment, offshore piping and splash-zone assemblies, where continuous salt exposure would otherwise shorten the life of a steel fixing.',
		badges: [
			{ value: 'Grade 2 / Grade 7', label: 'Seawater and splash-zone service' },
			{ value: 'EN 10204 3.1', label: 'Certificate per heat' },
			{ value: 'No plating', label: 'Nothing to renew underwater' },
		],
		cta: { label: 'Request a marine fastener quote', href: '#rfq-form' },
		secondaryCta: { label: 'See Grade 2 supply', href: '/products/grade-2-fasteners/' },
		image: {
			src: '/images/public-images/industries-corrosion-marine-grade2-titanium-fasteners.webp',
			alt: 'Grade 2 titanium fasteners prepared for marine and offshore service.',
			width: 1600,
			height: 1200,
		},
	},
	subApplications: {
		heading: 'Where marine fasteners are specified',
		lead:
			'Two zones dominate the call-off: the deck and hull work above the waterline, and the offshore piping and process equipment that sits in the splash zone.',
		items: [
			{
				id: 'deck-and-hull',
				eyebrow: 'Deck and hull',
				heading: 'Hull panels, hatches and deck equipment fixings',
				lead:
					'Hull sections, hatch covers and deck machinery are opened, closed and worked on with the vessel in service. The joint has to take the load and survive the wash-down.',
				image: {
					src: '/images/category-detail-sealing-technology/01-an-overview-of-sealing-plugs-and-check-valves-on.webp',
					alt: 'Sealing plugs and check valves used on process and marine equipment.',
					width: 1152,
					height: 922,
				},
				points: [
					{ label: 'Grade 2 CP titanium', text: 'rated 4 of 5 for corrosion resistance' },
					{ label: 'Flange bolts and hex nuts', text: 'for bolted covers and mounting pads' },
					{ label: 'Passivated surface', text: 'ASTM F86, oxide protected in salt air' },
				],
				cta: { label: 'View flange bolt and nut families', familyId: 'hexagon-flange-bolts' },
				families: ['hexagon-flange-bolts', 'hex-nut', 'plain-washers', 'double-end-stud-bolts'],
			},
			{
				id: 'offshore-piping',
				eyebrow: 'Offshore piping',
				heading: 'Manifold, skid and subsea interface connections',
				lead:
					'Pipework manifolds and skid frames are bolted up, opened for inspection and re-torqued. The fixings sit in salt spray and condensation between services.',
				image: {
					src: '/images/category-detail-fluid-management/01-pressure-intensifiers-and-quick-connectors-for-f.webp',
					alt: 'Pressure intensifiers and quick connectors used on high-pressure fluid lines.',
					width: 1152,
					height: 922,
				},
				points: [
					{ label: 'Stud bolts', text: 'for flanged pressure connections' },
					{ label: 'No zinc or plating', text: 'no coating renewal in the splash zone' },
					{ label: 'One heat per box', text: 'so a replacement matches the original' },
				],
				cta: { label: 'View stud and cap screw families', familyId: 'double-end-stud-bolts' },
				families: ['double-end-stud-bolts', 'hex-socket-head-cap-bolts', 'hex-nut', 'plain-washers'],
			},
		],
	},

	comparison: {
		heading: 'Grades for marine and offshore work',
		lead:
			'Published nominal values for the grades specified in marine and offshore work. Every lot ships with the certificate that confirms the lot behind it.',
		note: 'Grade 7 is confirmed per order. We publish no torque, preload or friction figures; the certificate states the measured values of that lot.',
	},
	qa: {
		heading: 'How marine supply is controlled',
		lead:
			'A vessel operator expects the same part at every call-off, in the same grade and finish. These are the practices that make that possible.',
	},
	reference: {
		eyebrow: 'Reference application',
		heading: 'Offshore skid frame and manifold support',
		lead:
			'An offshore skid frame is in the splash zone: wet, salty and worked on with the platform partly in service. The fixings have to resist the water and still be reachable with standard tools.',
		points: [
			{ label: 'Grade 2 CP titanium', text: 'no coating renewal cycle' },
			{ label: 'Hex head bolts', text: 'standard tooling on the skid' },
			{ label: 'Traceable lots', text: 'each delivery allocated to one heat' },
		],
		image: {
			src: '/images/fastener-coatings/04-corrosion-protection-coating-image-screw-with-wa.webp',
			alt: 'Passivated titanium fastener prepared for continuous salt exposure.',
			width: 960,
			height: 720,
		},
		facts: [
			{ label: 'Profile', value: 'Offshore process skid, manifold supports and deck equipment frames' },
			{ label: 'Challenge', value: 'continuous salt exposure with a wet maintenance environment' },
			{ label: 'Solution', value: 'Grade 2 hex bolts, flange bolts and hex nuts, passivated' },
			{ label: 'Result', value: '3.1 certificate per lot, one heat per box, MOQ from 100 pieces' },
		],
		cta: { label: 'Discuss your marine equipment', href: '#rfq-form' },
		secondaryCta: { label: 'Grade 7 supply', href: materialHref('ti-gr23') },
	},
	faq: {
		heading: 'Questions marine buyers ask before ordering',
		items: [
			{
				question: 'Which titanium grade suits seawater service?',
				answer:
					'Grade 2 commercially pure titanium is the normal choice. Its corrosion resistance rating in the published table is 4 of 5, and it forms its own protective oxide layer in continuous seawater. Grade 7 is specified where the medium is more aggressive.',
			},
			{
				question: 'Do marine titanium fasteners need a coating?',
				answer:
					'No. The corrosion resistance is in the material itself. Parts are supplied passivated to ASTM F86 so the surface is clean and oxide protected, and there is no plating or zinc layer that can fail and release into the water.',
			},
			{
				question: 'Can you supply studs and flange bolts for pressure connections?',
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
		heading: 'Send your marine fastener list',
		lead:
			'Send the medium, the standard, the quantity and the drawing. Our engineering desk quotes from your bill of materials directly and confirms the grade, the certificate scope and the delivery date in writing.',
		note: 'NDA protected. Direct factory quote within 12 business hours. EN 10204 3.1 certified.',
	},
};
