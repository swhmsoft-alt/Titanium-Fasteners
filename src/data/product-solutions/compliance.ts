/**
 * Product Solutions — band 4: 工厂合规溯源（三大工厂资产之三）。
 *
 * Audience: procurement and quality, who need the paperwork to be real.
 *
 * Information gain: the buyer learns how a lot is evidenced and how mixed
 * grades are prevented physically, not only on paper.
 */
import { PATHS } from './routes';
import type { SolutionBand } from './types';

export const COMPLIANCE: SolutionBand = {
	id: 'compliance',
	eyebrow: 'Supply Assurance',
	heading: 'Every lot carries its own evidence back to the heat',
	lead:
		'Every lot we ship carries its own evidence: an EN 10204 3.1 certificate ' +
		'tied to the heat it was cut from, and a PMI / XRF reading on every part ' +
		'before it leaves the workshop.',
	body: [],
	highlights: [
		{
			label: 'EN 10204 3.1 per lot',
			text: 'one certificate per lot, tying chemistry and mechanical properties to the heat it was cut from',
		},
		{
			label: '100% PMI / XRF on every part',
			text: 'each part re-checked by spectrometer against the grade named on the certificate',
		},
		{
			label: 'No mixed-grade shipments',
			text: 'grades segregated in store and in process, colour-coded tools and baskets, documented clean check at every changeover',
		},
	],
	images: [
		{
			src: '/images/public-images/product-solutions-compliance-lot-traceability-qa.webp',
			alt: 'Two people walk through the shop floor beside labelled material bins.',
		},
	],
	reverse: true,
	points: [
		{
			label: 'Certificate',
			heading: 'EN 10204 3.1 per heat number',
			body:
				'One certificate per lot, tying the chemistry and the mechanical ' +
				'properties to the heat the lot was cut from.',
			href: PATHS.mtc,
			icon: '/images/innovations/16-inspection-of-a-screw.svg',
		},
		{
			label: 'Verification',
			heading: '100% PMI / XRF on every part',
			body:
				'Each part is re-checked by spectrometer before it leaves the ' +
				'workshop, and the reading is compared against the grade named on the ' +
				'certificate for the lot.',
			href: PATHS.pmi,
			icon: '/images/special-parts-and-custom-fasteners/03-engineering-measurement-icon.svg',
		},
		{
			label: 'Segregation',
			heading: 'No mixed-grade shipments',
			body:
				'Grades are segregated in storage and in process, and a changeover ' +
				'requires a documented clean and identification check.',
			href: PATHS.aboutPmi,
			icon: '/images/special-parts-and-custom-fasteners/04-increasing-product-quality-icon.svg',
		},
		{
			label: 'Packaging',
			heading: 'Packed and labelled per lot',
			body:
				'Separate packing per batch, marked with grade, quantity and lot ' +
				'reference. Your own label and barcodes are applied under the same ' +
				'confidentiality agreement as the drawing.',
			href: PATHS.packaging,
			icon: '/images/special-parts-and-custom-fasteners/05-smart-factory-logistics-icon.svg',
		},
	],
	facts: [
		{ label: 'Material level', value: 'ASTM B348 (bar stock / billet)' },
		{ label: 'Finished part level', value: 'ASTM F467 / F468' },
		{ label: 'Document level', value: 'EN 10204 3.1, issued per lot' },
		{ label: 'Coverage', value: '100% of the batch, not a sample check' },
	],
	cta: { label: 'See the compliance documents', href: PATHS.aboutQuality },
	secondaryCta: { label: 'EN 10204 3.1 and traceability', href: PATHS.mtc },
};
