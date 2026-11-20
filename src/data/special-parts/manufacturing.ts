/**
 * Special Parts & Custom Fasteners — band 1: print-to-part manufacturing.
 *
 * Audience: OEM engineering and procurement, who hold the drawing.
 *
 * Information gain: the buyer learns how a non-standard titanium part is released
 * here — review, process route, sample, series — and that the drawing is protected
 * before the file is even opened.
 */
import { ROUTES } from './routes';
import type { SpecialBand } from './types';

export const MANUFACTURING: SpecialBand = {
	id: 'print-to-part',
	eyebrow: 'Capability 01 — Print to Part',
	heading: 'Your drawing, our machines, one released lot',
	lead:
		'Non-standard titanium parts are made in our own workshop: drawing review, ' +
		'DFM feedback, a sample, then series production on the same process route.',
	highlights: [
		{
			label: 'NDA before the file is opened',
			text: 'countersigned mutual NDA signed before your drawing is opened',
		},
		{
			label: 'DFM before the first cut',
			text: 'tolerance, thread form and process route assessed against the drawing',
		},
		{
			label: 'Sample to series',
			text: 'one approved sample, then the series released on the same route',
		},
	],
	images: [
		{
			src: '/images/public-images/special-parts-print-to-part-lateral-guidance-part.webp',
			alt: 'Lateral guidance part with a machined bore and flat machined faces.',
		},
	],
	reverse: true,
	points: [
		{
			label: 'Drawing review',
			heading: 'DFM before anything is cut',
			body:
				'Tolerance class, thread form and the process route are assessed ' +
				'against your drawing, and anything that cannot be held is flagged ' +
				'before the order is accepted.',
			href: ROUTES.cnc,
			icon: '/images/innovations/15-design-icon.svg',
		},
		{
			label: 'Machining',
			heading: 'CNC turning, milling and threading',
			body:
				'Turned, milled and threaded from bar stock or from a billet cut to ' +
				'the drawing, with the process route chosen per geometry.',
			href: ROUTES.aboutCnc,
			icon: '/images/special-parts-and-custom-fasteners/03-engineering-measurement-icon.svg',
		},
		{
			label: 'Forming',
			heading: 'Cold heading, hot forging and forming',
			body:
				'Forming routes are chosen so the part reaches the mechanical ' +
				'properties the grade is meant to deliver.',
			href: ROUTES.forging,
			icon: '/images/innovations/14-engineering-icon.svg',
		},
		{
			label: 'Release',
			heading: 'Sample, development batch, then series',
			body:
				'Fast-turn samples and low minimum order quantities, then a ' +
				'production slot reserved for the agreed schedule.',
			href: ROUTES.prototyping,
			icon: '/images/innovations/18-global-logistic-icon.svg',
		},
	],
	facts: [
		{ label: 'Confidentiality', value: 'Mutual NDA countersigned before the drawing is opened' },
		{
			label: 'Processes in-house',
			value: 'CNC turning, milling, threading, cold heading, hot forging',
		},
		{ label: 'Batching', value: 'Sample and development runs before series production' },
		{ label: 'Inspection', value: 'Dimensional and thread-fit checks documented per lot' },
	],
	cta: { label: 'Send a drawing for quotation', href: ROUTES.contact },
	secondaryCta: { label: 'CNC machining to customer drawings', href: ROUTES.cnc },
};
