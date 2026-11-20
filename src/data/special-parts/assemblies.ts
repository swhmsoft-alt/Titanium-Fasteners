/**
 * Special Parts & Custom Fasteners — band 3: assemblies, kits and supply.
 *
 * The buyer who has moved past a single part needs the parts counted, marked and
 * packed so the assembly line receives a usable set rather than a box of loose
 * pieces. This band answers that, and points at the real packaging and delivery
 * pages on this site.
 */
import { ROUTES } from './routes';
import type { SpecialBand } from './types';

export const ASSEMBLIES: SpecialBand = {
	id: 'assemblies-and-kits',
	eyebrow: 'Capability 03 — Assemblies and Kits',
	heading: 'Parts that arrive counted, marked and ready for your line',
	lead:
		'A titanium part set can leave the workshop as a counted sub-assembly or a ' +
		'mounting kit, labelled and packed in the format your line expects.',
	highlights: [
		{
			label: 'Counted, not estimated',
			text: 'every kit checked against your bill of materials before it is closed',
		},
		{
			label: 'Your packaging',
			text: 'labelled, barcoded and boxed in the format you specify',
		},
		{
			label: 'Assembled and checked',
			text: 'sub-assemblies fitted and function-checked before despatch',
		},
	],
	images: [
		{
			src: '/images/public-images/special-parts-assemblies-machined-component-assembly.webp',
			alt: 'An assembly built from individually machined component parts.',
		},
	],
	reverse: true,
	points: [
		{
			label: 'Assemblies',
			heading: 'Sub-assemblies built and function-checked',
			body:
				'Fully assembled units from simple sub-assemblies to electro-mechanical ' +
				'groups, fitted and checked before they are packed, so the assembly ' +
				'step on your side is removed.',
			href: ROUTES.aboutCnc,
			icon: '/images/innovations/14-engineering-icon.svg',
		},
		{
			label: 'Mounting kits',
			heading: 'Kits of varied components, counted and labelled',
			body:
				'Kits are supplied with the components you specify — accurately ' +
				'counted, neatly packed and labelled, or printed to your own ' +
				'requirements.',
			href: ROUTES.packaging,
			icon: '/images/special-parts-and-custom-fasteners/05-smart-factory-logistics-icon.svg',
		},
		{
			label: 'Lot marking',
			heading: 'Grade and lot marked on the part',
			body:
				'Grade, lot number and quantity are marked on the part and on the ' +
				'packaging, so a mixed batch can be told apart on the shelf and in ' +
				'assembly.',
			href: ROUTES.aboutPmi,
			icon: '/images/innovations/16-inspection-of-a-screw.svg',
		},
		{
			label: 'Scheduled supply',
			heading: 'Blanket orders and scheduled delivery',
			body:
				'Once the part is released, repeat batches are supplied on a scheduled ' +
				'call-off arrangement with the same documentation as the first lot.',
			href: ROUTES.blanket,
			icon: '/images/innovations/18-global-logistic-icon.svg',
		},
	],
	facts: [
		{ label: 'Kit control', value: 'Each kit checked against the released bill of materials' },
		{ label: 'Marking', value: 'Grade, lot and quantity marked on part and packaging' },
		{ label: 'Documents', value: 'EN 10204 3.1 and inspection report per lot' },
		{ label: 'Supply', value: 'Blanket orders and scheduled call-off deliveries' },
	],
	cta: { label: 'Discuss an assembly or a kit', href: ROUTES.contact },
	secondaryCta: { label: 'Distributor labelling and packaging', href: ROUTES.packaging },
};
