/**
 * Product Solutions — 底部双通道 CTA（分销商 / OEM 工程与采购）。
 *
 * Two audiences, two different next actions — a catalogue filter for a
 * distributor, a drawing brief for an OEM. Both routes exist.
 */
import { PATHS } from './routes';
import type { AudienceColumn } from './types';

export const AUDIENCE = {
	heading: 'Two ways in, depending on what you need',
	lead:
		'A distributor needs the part on the specification, delivered with the ' +
		'paperwork. An OEM needs a titanium part that does exactly what the ' +
		'drawing says, on the surface condition it needs. Both routes start with the ' +
		'same enquiry.',
	columns: [
		{
			heading: 'For distributors and standard-part buyers',
			body:
				'Filter the catalogue by standard, grade, type, thread and length. ' +
				'Grade 2 and Grade 5 are held as standard, and we apply your label, ' +
				'your barcode and your carton format under a distributor programme.',
			image: {
				src: '/images/public-images/product-solutions-distributor-titanium-nuts-stock.webp',
				alt: 'Titanium hexagon full nuts to DIN 934 in Grade 5 and Grade 2.',
			},
			points: [
				{ label: 'Selection', value: 'Filter by standard, grade, type, thread and length' },
				{ label: 'Availability', value: 'Grade 2 and Grade 5 held as standard' },
				{ label: 'Supply', value: 'Blanket orders and scheduled call-off deliveries' },
				{ label: 'Packaging', value: 'Your label, your barcode, your carton format' },
			],
			cta: { label: 'Browse the catalogue', href: PATHS.products },
			secondary: { label: 'Blanket orders and scheduled delivery', href: PATHS.blanket },
		},
		{
			heading: 'For OEM engineering and procurement',
			body:
				'Send the size, grade, finish and quantity — or the drawing itself. ' +
				'A titanium process engineer replies with a quotation and the ' +
				'material certificates, and the file stays with you until the NDA is ' +
				'signed.',
			image: {
				src: '/images/public-images/product-solutions-oem-custom-titanium-part-drawn.webp',
				alt: 'A CNC-turned titanium part produced to a customer drawing.',
			},
			points: [
				{ label: 'Brief', value: 'Size, grade, finish and quantity — no drawing needed to start' },
				{ label: 'Confidentiality', value: 'NDA signed before the file is opened' },
				{ label: 'Documents', value: 'EN 10204 3.1 per lot, inspection report per lot' },
				{ label: 'Reply', value: 'Quotation and certificates within 12 business hours' },
			],
			cta: { label: 'Request a quotation', href: PATHS.contact },
			secondary: { label: 'Technical support and consultation', href: PATHS.aboutTechnical },
		},
	] as AudienceColumn[],
};
