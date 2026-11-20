/**
 * Product Solutions — band 2: NDA 按图定制与特种钛件制造（B 维度）。
 *
 * Audience: OEM engineering and procurement, who hold the drawing.
 *
 * Information gain: the buyer learns how a non-standard titanium part is
 * released here — review, process route, sample, series — and that the
 * drawing is protected before the file is even opened.
 */
import { PATHS } from './routes';
import type { SolutionBand } from './types';

export const CUSTOM_MANUFACTURING: SolutionBand = {
	id: 'custom-manufacturing',
	eyebrow: 'Solution 02 — Made to Your Drawing',
	heading: 'Non-standard titanium parts, made and released under NDA',
	lead:
		'When a titanium part is defined by a drawing rather than by a catalogue ' +
		'number, we machine it in our own workshop — and the confidentiality ' +
		'agreement is countersigned before the file is opened.',
	body: [],
	highlights: [
		{
			label: 'NDA before the file is opened',
			text: 'countersigned mutual NDA signed before the drawing is opened',
		},
		{
			label: 'Titanium process compensation',
			text: 'poor heat conductivity and springback compensated per geometry — cold heading, hot forging, CNC turning or thread rolling',
		},
		{
			label: 'Sample to series',
			text: 'drawing review, then a sample or development batch, then series production',
		},
	],
	images: [
		{
			src: '/images/public-images/product-solutions-custom-manufacturing-cnc-titanium-part.webp',
			alt: 'A CNC-turned titanium cylinder with a machined step and thread, machined from bar stock.',
		},
	],
	reverse: true,
	points: [
		{
			label: 'Drawing review',
			heading: 'DFM before anything is cut',
			body:
				'Tolerance class, thread form and process route are assessed against ' +
				'your drawing, and anything that cannot be held is flagged before the ' +
				'order is accepted.',
			href: PATHS.cnc,
			icon: '/images/innovations/15-design-icon.svg',
		},
		{
			label: 'Machining',
			heading: 'CNC turning and milling',
			body:
				'Turned, milled and threaded from bar stock or from a billet cut to ' +
				'the drawing, with the process route chosen per geometry.',
			href: PATHS.aboutCnc,
			icon: '/images/special-parts-and-custom-fasteners/03-engineering-measurement-icon.svg',
		},
		{
			label: 'Forming',
			heading: 'Cold heading and hot forging',
			body:
				'Forming routes chosen so the part reaches the mechanical properties ' +
				'its grade is meant to deliver.',
			href: PATHS.forging,
			icon: '/images/innovations/14-engineering-icon.svg',
		},
		{
			label: 'Release',
			heading: 'Sample, development batch, then series',
			body:
				'Fast-turn samples and low minimum order quantities, then a ' +
				'production slot reserved for the agreed schedule.',
			href: PATHS.prototyping,
			icon: '/images/services/05-leadership-accelerator-icon.svg',
		},
	],
	facts: [
		{ label: 'Confidentiality', value: 'NDA signed before the drawing is opened' },
		{
			label: 'Processes in-house',
			value: 'CNC turning, thread rolling, cold forming, heat treatment',
		},
		{ label: 'Batching', value: 'Sample and development runs before series production' },
		{ label: 'Inspection', value: 'Dimensional and thread-fit checks documented per lot' },
	],
	cta: { label: 'Send a drawing for quotation', href: PATHS.contact },
	secondaryCta: { label: 'Read our NDA and IP policy', href: PATHS.nda },
};
