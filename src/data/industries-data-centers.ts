/**
 * Data Centers — application page data for `/industries/data-centers/`.
 *
 * ROUTE NOTE
 * ----------
 * This page replaces the inherited CMS industry page of the same slug (the
 * reference-site scrape that still carried the reference brand's voice). The
 * CMS family was generated from `qa/ref/` and has been retired; the static
 * route below owns the URL.
 *
 * IMAGE SOURCING NOTE
 * -------------------
 * The visuals come from the local data centre image set: server racks, cable
 * management and rack-mounted hardware. None is presented as a photograph of a
 * named operator or a specific facility.
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

export const DATA_CENTERS: AppPageData = {
	slug: 'data-centers',
	industry: 'Data Centers',
	seo: {
		title: 'Data Center Titanium Fasteners — Rack, Cooling and Cable Management',
		description:
			'Grade 2 and Grade 5 titanium fasteners for server racks, cooling assemblies and cable management hardware, M1.6-M36, with EN 10204 3.1 certificates per heat number.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Industries', href: '/industries/' },
			{ label: 'Data Centers' },
		],
		eyebrow: 'Data Centers',
		heading: 'Titanium Fasteners for Server Racks, Cooling and Cable Management',
		lead:
			'Grade 2 and Grade 5 titanium fasteners for rack frames, liquid cooling assemblies and cable management, where thermal cycling, low mass and particle control all apply at once.',
		badges: [
			{ value: 'Grade 2 / Grade 5', label: 'Rack, cooling and enclosure service' },
			{ value: 'EN 10204 3.1', label: 'Certificate per heat' },
			{ value: 'No plating', label: 'No coating to shed into the aisle' },
		],
		cta: { label: 'Request a data center quote', href: '#rfq-form' },
		secondaryCta: { label: 'See Grade 2 supply', href: '/products/grade-2-fasteners/' },
		image: {
			src: '/images/industries-data-centers/01-a-man-working-with-high-performance-data-center-.webp',
			alt: 'Technician working with high performance data center equipment.',
			width: 1152,
			height: 922,
		},
	},
	subApplications: {
		heading: 'Where data center fasteners are specified',
		lead:
			'Two assemblies dominate the call-off: the enclosure that carries the servers, and the cooling hardware that keeps them inside their temperature band.',
		items: [
			{
				id: 'rack-and-enclosure',
				eyebrow: 'Racks and enclosures',
				heading: 'Server rack frames, mounting rails and panel fixings',
				lead:
					'A rack frame is opened for every expansion and every replacement drive. It also has to carry the load without adding mass to a cabinet that is often moved.',
				image: {
					src: '/images/industries-data-centers/36-server-hardware-with-black-and-gray-rack-mounted.webp',
					alt: 'Server hardware mounted in a black and gray rack enclosure.',
					width: 725,
					height: 580,
				},
				points: [
					{ label: 'Grade 5 on structure', text: '828 MPa proof strength, published nominal' },
					{ label: 'Galvanic isolation', text: 'titanium avoids the steel-to-aluminium couple' },
					{ label: 'Panel screws', text: 'flush fit for front and rear doors' },
				],
				cta: { label: 'View cap screw and button head families', familyId: 'hex-socket-head-cap-bolts' },
				families: [
					'hex-socket-head-cap-bolts',
					'hex-socket-button-head-bolts',
					'hex-nut',
					'plain-washers',
				],
			},
			{
				id: 'cooling-and-cable',
				eyebrow: 'Cooling and cable management',
				heading: 'Liquid cooling manifolds and cable management hardware',
				lead:
					'Cooling manifolds are opened for leak checks and serviced. Cable management is handled repeatedly by technicians, so fixings have to stay where they were put.',
				image: {
					src: '/images/industries-data-centers/41-vertical-and-horizontal-cable-management-fingers.webp',
					alt: 'Vertical and horizontal cable management fingers in a server rack.',
					width: 928,
					height: 522,
				},
				points: [
					{ label: 'Grade 2 CP titanium', text: 'rated 4 of 5 for corrosion resistance' },
					{ label: 'Torque flange heads', text: 'high clamp load at low head height' },
					{ label: 'No coating particles', text: 'no plating layer to shed near fans' },
				],
				cta: { label: 'View flange head and countersunk families', familyId: 'torx-flange-head-bolts' },
				families: [
					'torx-flange-head-bolts',
					'countersunk-head-cap-screws',
					'12-point-flange-bolts',
					'plain-washers',
				],
			},
		],
	},
	comparison: {
		heading: 'Grades for data center and OEM equipment',
		lead:
			'Published nominal values for the grades specified in data center and OEM work. Every lot ships with the certificate that confirms the lot behind it.',
		note: 'Grade 7 is confirmed per order. We publish no torque, preload or friction figures; the certificate states the measured values of that lot.',
	},
	qa: {
		heading: 'How data center supply is controlled',
		lead:
			'Rack and cooling programmes repeat the same part across many cabinets. These are the practices that make every one of those parts the same.',
	},
	reference: {
		eyebrow: 'Reference application',
		heading: 'Rack build-out and cabinet expansion',
		lead:
			'Rack build-out is done in tranches against a build schedule, often on site. The fixings have to arrive identical every time the next tranche is released.',
		points: [
			{ label: 'Grade 5 on frames', text: 'carries the load of a populated cabinet' },
			{ label: 'Grade 2 on panels', text: 'no rust staining on visible surfaces' },
			{ label: 'One heat per box', text: 'so a replacement matches the original' },
		],
		image: {
			src: '/images/industries-data-centers/40-metal-track-mounting-hardware-kit-with-silver-al.webp',
			alt: 'Metal track mounting hardware kit used to fix equipment into rack rails.',
			width: 928,
			height: 522,
		},
		facts: [
			{ label: 'Profile', value: 'Rack build-out, cabinet expansion, cooling manifolds and containment' },
			{ label: 'Challenge', value: 'thermal cycling, low mass budget and a particle-sensitive environment' },
			{ label: 'Solution', value: 'Grade 5 cap screws and flange bolts, Grade 2 panel fixings, passivated' },
			{ label: 'Result', value: '3.1 certificate per lot, one heat per box, MOQ from 100 pieces' },
		],
		cta: { label: 'Discuss your rack or cooling assembly', href: '#rfq-form' },
		secondaryCta: { label: 'Grade 5 supply', href: materialHref('ti-gr5') },
	},
	faq: {
		heading: 'Questions data center buyers ask before ordering',
		items: [
			{
				question: 'Why use titanium in a server rack?',
				answer:
					'Two reasons dominate. Titanium does not corrode in a cooled, humid environment with condensation, and it does not form a galvanic couple with the aluminium used in racks and enclosures, so the surrounding metal is not sacrificed at the joint.',
			},
			{
				question: 'Which grade suits cooling manifold fixings?',
				answer:
					'Grade 2 commercially pure titanium is the normal choice where the fixing sees coolant and condensation but carries little load. Its corrosion resistance rating in the published table is 4 of 5. Grade 5 is used where the same joint also carries structural load.',
			},
			{
				question: 'Do you supply fasteners that will not shed particles?',
				answer:
					'Parts are supplied passivated to ASTM F86 so the surface is clean and oxide protected. There is no zinc or plating layer that can break down and release into the air path near the fans.',
			},
			{
				question: 'Can you machine parts to our drawings under NDA?',
				answer:
					'Yes. Special parts are machined or cold-forged to your drawing under NDA, with MOQ from 100 pieces per size. Your drawing is opened only after the mutual NDA is signed, and each delivery carries its own EN 10204 3.1 certificate.',
			},
		],
	},
	rfq: {
		heading: 'Send your data center fastener list',
		lead:
			'Send the standard, the quantity and the drawing. Our engineering desk quotes from your bill of materials directly and confirms the grade, the certificate scope and the delivery date in writing.',
		note: 'NDA protected. Direct factory quote within 12 business hours. EN 10204 3.1 certified.',
	},
};
