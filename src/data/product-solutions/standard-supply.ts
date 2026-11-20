/**
 * Product Solutions — band 1: 标准钛紧固件全系供应方案（A 维度）。
 *
 * Audience: distributors and standard-part buyers who arrive with a
 * specification number and a thread size, plus OEMs replacing a steel part
 * with a titanium one.
 *
 * Information gain: the buyer leaves with a grade decision, a standard
 * cross-reference and a direct route into the catalogue — not a generic
 * product overview.
 */
import { PATHS, materialHref } from './routes';
import type { SolutionBand } from './types';

export const STANDARD_SUPPLY: SolutionBand = {
	id: 'standard-supply',
	eyebrow: 'Solution 01 — Standard Range',
	heading: 'The standard part you already specified, made in our own workshop',
	lead:
		'Most titanium demand arrives as a specification number and a thread size. ' +
		'We produce those parts ourselves in our own workshop, from titanium bar to ' +
		'the packed fastener, to the standard written on the drawing.',
	body: [],
	highlights: [
		{
			label: 'M1.6–M36',
			text: 'screws, bolts, studs, nuts and washers; M1 and M1.5 made to order',
		},
		{
			label: 'Grade 2 / Grade 5',
			text: 'commercially pure Ti and Ti-6Al-4V, on the DIN and ISO specifications on the drawing',
		},
		{
			label: 'ASTM F467 / F468, EN 10204 3.1',
			text: 'finished part produced and documented to the standard, with the EN 10204 3.1 certificate heat number tied to the lot',
		},
	],
	images: [
		{
			src: '/images/public-images/product-solutions-standard-supply-titanium-parts-range.webp',
			alt: 'A graded range of titanium screws, hex nuts and washers in Grade 2 and Grade 5, laid out by size.',
		},
	],
	reverse: false,
	points: [
		{
			label: 'Grade 2 (CP-Ti)',
			heading: 'Commercially pure titanium',
			body:
				'Commercially pure titanium, held in stock and machined in-house. ' +
				'We ship it with the EN 10204 3.1 certificate for the heat it was ' +
				'cut from.',
			href: materialHref('ti-gr2'),
			icon: '/images/fastener-coatings/07-surface-finishing-icon.webp',
		},
		{
			label: 'Grade 5 (Ti-6Al-4V)',
			heading: 'The high-strength grade',
			body:
				'For loaded joints. We state proof strength and tensile strength ' +
				'for the finished fastener, not for the bar stock.',
			href: materialHref('ti-gr5'),
			icon: '/images/fastener-coatings/06-fastener-finish-icon.webp',
		},
		{
			label: 'Grade 23 (ELI)',
			heading: 'Extra-low interstitial grade',
			body:
				'Made to order against a confirmed specification, and released under ' +
				'the same certificate and inspection regime as the standard grades.',
			href: PATHS.gradeMatrix,
			icon: '/images/innovations/16-inspection-of-a-screw.svg',
		},
		{
			label: 'Standards',
			heading: 'DIN, ISO and ASTM production',
			body:
				'Batch production with a documented route per lot, from certified ' +
				'titanium stock to the packed part.',
			href: PATHS.standards,
			icon: '/images/services/09-solution-icon.svg',
		},
	],
	facts: [
		{ label: 'Size range', value: 'M1.6–M36 as standard; M1–M1.5 made to order' },
		{ label: 'Product families', value: 'Screws, bolts, studs, nuts, washers' },
		{
			label: 'Material scope',
			value: 'Grade 2 and Grade 5 held; Grade 23 and Grade 9 made to order',
		},
		{
			label: 'Compliance',
			value:
				'Material to ASTM B348, finished part to ASTM F467 / F468, documents to EN 10204 3.1',
		},
	],
	cta: { label: 'Browse standard titanium parts', href: PATHS.products },
	secondaryCta: {
		label: 'Compare grades in the supply matrix',
		href: PATHS.gradeMatrix,
	},
};
