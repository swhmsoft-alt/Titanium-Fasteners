/**
 * Medical devices — application page data for `/industries/medical-devices/`.
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

export const MEDICAL_DEVICES: AppPageData = {
	slug: 'medical-devices',
	industry: 'Medical Devices',
	seo: {
		title: 'Medical Device Titanium Fasteners — Grade 23 ELI',
		description:
			'Grade 23 ELI and Grade 2 titanium fasteners for surgical instruments, implants tooling and diagnostic equipment, M1.6-M36, with EN 10204 3.1 certificates per heat number.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Industries', href: '/industries/' },
			{ label: 'Medical Devices' },
		],
		eyebrow: 'Medical Devices',
		heading: 'Titanium Fasteners for Medical Device Assembly',
		lead:
			'Grade 23 ELI and Grade 2 titanium fasteners for instruments, diagnostic equipment and implant tooling, machined to your drawing with EN 10204 3.1 certification and full lot traceability.',
		badges: [
			{ value: 'Grade 23 ELI', label: 'AMS 4928 bar stock' },
			{ value: 'EN 10204 3.1', label: 'Certificate per heat' },
			{ value: 'NDA', label: 'Drawings never reused' },
		],
		cta: { label: 'Request a medical device quote', href: '#rfq-form' },
		secondaryCta: { label: 'See Grade 23 supply', href: materialHref('ti-gr23') },
		image: {
			src: '/images/industries-medical/01-complicated-medical-devices-in-a-room.webp',
			alt: 'Medical device equipment arranged in a clinical room.',
			width: 1152,
			height: 922,
		},
	},
	subApplications: {
		heading: 'Where medical device fasteners are specified',
		lead:
			'Two different jobs meet here: parts that touch the patient and must be traceable, and the tooling and housings that build and calibrate the device.',
		items: [
			{
				id: 'instrument-assembly',
				eyebrow: 'Patient-contact hardware',
				heading: 'Surgical instruments and diagnostic assemblies',
				lead:
					'Instruments that are handled and reprocessed need a surface that survives repeated cleaning and a lot that can be traced back. Grade 23 ELI gives both.',
				image: {
					src: '/images/industries-medical/15-an-overview-of-machining-turned-and-milled-parts.webp',
					alt: 'Machined and turned titanium parts for medical instrument assembly.',
					width: 928,
					height: 522,
				},
				points: [
					{ label: 'Grade 23 ELI', text: 'AMS 4928 bar, extra low interstitial' },
					{ label: 'Surface finish', text: 'passivated to ASTM F86, no plating' },
					{ label: 'Batch traceability', text: 'one heat number per labelled box' },
				],
				cta: { label: 'View machined cap screw families', familyId: 'hex-socket-head-cap-bolts' },
				families: [
					'hex-socket-head-cap-bolts',
					'countersunk-head-cap-screws',
					'hex-socket-button-head-bolts',
				],
			},
			{
				id: 'device-housings',
				eyebrow: 'Device housings',
				heading: 'Housing, bracket and panel fixings',
				lead:
					'Housings carry the electronics and the shielding. The fastening pattern has to stay flat, stay sealed and stay assembled through service cycles.',
				image: {
					src: '/images/industries-medical/63-surface-mount-fasteners-on-a-white-background.webp',
					alt: 'Surface mount fasteners used in medical device housings.',
					width: 928,
					height: 522,
				},
				points: [
					{ label: 'Flat heads', text: 'DIN 7991 countersunk for flush panels' },
					{ label: 'No plating', text: 'no coating to flake into the device' },
					{ label: 'Repeatable stock', text: 'held grade and finish for call-off' },
				],
				cta: { label: 'See countersunk and washer options', familyId: 'countersunk-head-cap-screws' },
				families: ['countersunk-head-cap-screws', 'plain-washers', 'hex-nut'],
			},
		],
	},
	comparison: {
		heading: 'Grades for medical device fastening',
		lead:
			'Published nominal values for the grades specified in medical work. Every lot ships with the certificate that confirms the lot behind it.',
		note: 'Grade 7 is confirmed per order. We publish no torque, preload or friction figures; the certificate states the measured values of that lot.',
	},
	qa: {
		heading: 'How medical supply is controlled',
		lead:
			'Device work is judged on traceability and cleanliness. These are the practices that sit behind every lot we ship.',
	},
	reference: {
		eyebrow: 'Reference application',
		heading: 'Diagnostic imaging equipment housing',
		lead:
			'An imaging unit is opened for service far more often than it is built. The joint has to come apart cleanly, look intact afterwards and still hold the shield in place.',
		points: [
			{ label: 'Grade 23 ELI', text: 'consistent across the housing build' },
			{ label: 'DIN 7991 flat heads', text: 'keep the panel surface flush' },
			{ label: 'ASTM F86 passivation', text: 'surface protected without a coating' },
		],
		image: {
			src: '/images/industries-medical/89-three-different-point-of-sale-systems-for-the-he.webp',
			alt: 'Medical diagnostic and therapy equipment in use in a hospital setting.',
			width: 960,
			height: 720,
		},
		facts: [
			{ label: 'Profile', value: 'Diagnostic imaging equipment, serviceable housings and panels' },
			{ label: 'Challenge', value: 'repeated service opening with a contamination limit in the build area' },
			{ label: 'Solution', value: 'Grade 23 ELI cap screws, DIN 7991 flat heads, passivated' },
			{ label: 'Result', value: '3.1 certificate per lot, one heat per box, MOQ from 100 pieces' },
		],
		cta: { label: 'Discuss your device assembly', href: '#rfq-form' },
		secondaryCta: { label: 'Grade 2 supply', href: materialHref('ti-gr2') },
	},
	faq: {
		heading: 'Questions medical device buyers ask before ordering',
		items: [
			{
				question: 'Grade 23 or Grade 2 for a medical device?',
				answer:
					'Grade 23 ELI is the normal choice where the part is machined from bar and strength matters. Grade 2 commercially pure titanium is used for lightly loaded fittings, housings and hardware that only needs corrosion resistance and ductility.',
			},
			{
				question: 'Is the titanium used in medical work implant grade?',
				answer:
					'Where the drawing specifies it, we machine from AMS 4928 Grade 23 ELI bar and issue the certificate for the heat that bar came from. Fasteners are supplied under EN 10204 3.1 with PMI verification on every lot.',
			},
			{
				question: 'Do you machine medical fasteners to our drawings?',
				answer:
					'Yes. Special parts are machined or cold-forged to your drawing under NDA, with MOQ from 100 pieces per size. Your drawing is opened only after the mutual NDA is signed, and no drawing data is reused.',
			},
			{
				question: 'How are the lots packed and labelled for medical supply?',
				answer:
					'Each batch is allocated to one heat number and packed in its own labelled box. Distributor labelling to your scheme and plain moisture-barrier packaging are both available, and a call-off programme can hold the grade and finish you repeat.',
			},
		],
	},
	rfq: {
		heading: 'Send your medical device fastener list',
		lead:
			'Send the standard, the quantity and the drawing. Our engineering desk quotes from your bill of materials directly and confirms the grade, the certificate scope and the delivery date in writing.',
		note: 'NDA protected. Direct factory quote within 12 business hours. EN 10204 3.1 certified.',
	},
};
