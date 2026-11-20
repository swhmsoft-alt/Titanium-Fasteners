/**
 * Special Parts & Custom Fasteners — the closing two-channel CTA.
 *
 * Two audiences, two different next actions — a drawing brief for an OEM, a
 * catalogue filter for a distributor. Both routes exist on this site.
 */
import { ROUTES } from './routes';
import type { AudienceColumn } from './types';

export const AUDIENCE = {
	heading: 'Two ways in, depending on what you need',
	lead:
		'An OEM needs a titanium part that does exactly what the drawing says, on ' +
		'the surface condition it needs. A distributor needs the catalogue part on ' +
		'the specification, with the paperwork. Both routes start with the same ' +
		'enquiry.',
	columns: [
		{
			heading: 'For OEM engineering and procurement',
			body:
				'Send the size, grade, finish and quantity — or the drawing itself. ' +
				'A titanium process engineer replies with a quotation and the ' +
				'material certificates, and the file stays with you until the NDA is ' +
				'signed.',
			image: {
				src: '/images/public-images/special-parts-audience-turned-black-part-oem-drawing.webp',
				alt: 'Turned part with a machined step, produced by CNC turning.',
			},
			points: [
				{ label: 'Brief', value: 'Size, grade, finish and quantity — no drawing needed to start' },
				{ label: 'Confidentiality', value: 'NDA signed before the file is opened' },
				{ label: 'Documents', value: 'EN 10204 3.1 per lot, inspection report per lot' },
				{ label: 'Reply', value: 'Quotation and certificates within 12 business hours' },
			],
			cta: { label: 'Request a quotation', href: ROUTES.contact },
			secondary: { label: 'CNC machining and special parts', href: ROUTES.aboutCnc },
		},
		{
			heading: 'For distributors and standard-part buyers',
			body:
				'Filter the catalogue by standard, grade, type, thread and length. ' +
				'Grade 2 and Grade 5 are held as standard, and we apply your label, ' +
				'your barcode and your carton format under a distributor programme.',
			image: {
				src: '/images/public-images/special-parts-audience-titanium-hex-nuts-distributor.webp',
				alt: 'Titanium hexagon full nuts to DIN 934 in Grade 5 and Grade 2.',
			},
			points: [
				{ label: 'Selection', value: 'Filter by standard, grade, type, thread and length' },
				{ label: 'Availability', value: 'Grade 2 and Grade 5 held as standard' },
				{ label: 'Supply', value: 'Blanket orders and scheduled call-off deliveries' },
				{ label: 'Packaging', value: 'Your label, your barcode, your carton format' },
			],
			cta: { label: 'Browse the catalogue', href: ROUTES.products },
			secondary: { label: 'Blanket orders and scheduled delivery', href: ROUTES.blanket },
		},
	] as AudienceColumn[],
};
