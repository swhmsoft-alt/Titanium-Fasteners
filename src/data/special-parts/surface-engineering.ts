/**
 * Special Parts & Custom Fasteners — band 2: titanium surface engineering.
 *
 * The framing matters: on titanium the surface is NOT specified to prevent rust —
 * titanium does not rust. It is specified to prevent thread galling, to control
 * wear, and to identify the part in assembly.
 */
import { ROUTES } from './routes';
import type { SpecialBand } from './types';

export const SURFACE_ENGINEERING: SpecialBand = {
	id: 'surface-engineering',
	eyebrow: 'Capability 02 — Surface Engineering',
	heading: 'A titanium surface is specified for galling, wear and identification',
	lead:
		'Two titanium surfaces under load can bond and take the mating thread with ' +
		'them. The finish is chosen for galling, wear and assembly identification — ' +
		'never for corrosion protection.',
	highlights: [
		{
			label: 'AMS 2700 / ASTM F86 passivation',
			text: 'cleans the surface and leaves it in a defined state, with no dimensional change',
		},
		{
			label: 'AMS 2488 Type II / III anodising',
			text: 'functional wear surface plus colour marking of grade or finish',
		},
		{
			label: 'DLC and dry-film lubricant',
			text: 'a deposited low-friction film for joints opened and closed repeatedly',
		},
	],
	images: [
		{
			src: '/images/public-images/special-parts-surface-engineering-anodised-screws-and-washers.webp',
			alt: 'Two sets of screws and washers, one set with a black anodised finish.',
		},
	],
	reverse: false,
	points: [
		{
			label: 'AMS 2700 / ASTM F86',
			heading: 'Chemical passivation',
			body:
				'Leaves the surface in a defined, clean state before assembly. No ' +
				'coating, no dimensional change — the standard first step for a ' +
				'titanium joint.',
			href: ROUTES.finishing,
			icon: '/images/fastener-coatings/07-surface-finishing-icon.webp',
		},
		{
			label: 'AMS 2488 Type II / III',
			heading: 'Functional and colour anodising',
			body:
				'Type II for wear resistance on the functional surface, Type III where ' +
				'the colour is needed to identify the grade or the finish on the ' +
				'assembly line.',
			href: ROUTES.finishing,
			icon: '/images/fastener-coatings/06-fastener-finish-icon.webp',
		},
		{
			label: 'PVD / DLC',
			heading: 'Physical vapour deposition',
			body:
				'A deposited film for joints that are opened and closed repeatedly, ' +
				'where the thread has to stay separable under load.',
			href: ROUTES.coatings,
			icon: '/images/special-parts-and-custom-fasteners/04-increasing-product-quality-icon.svg',
		},
		{
			label: 'Mechanical finishing',
			heading: 'Deburring, reaming and thread correction',
			body:
				'Mechanical reworking of standard elements is often the fastest and ' +
				'most cost-effective route for small and medium quantities.',
			href: ROUTES.finishing,
			icon: '/images/services/06-transparency-in-process-icon.svg',
		},
	],
	facts: [
		{ label: 'What it solves', value: 'Thread galling, surface wear, assembly identification' },
		{
			label: 'What it is not for',
			value: 'Titanium does not require plating for corrosion protection',
		},
		{
			label: 'Specification',
			value: 'AMS 2700 / ASTM F86, AMS 2488 Type II and III, PVD, DLC, dry film',
		},
		{ label: 'Confirmation', value: 'Finish agreed against the drawing and the service condition' },
	],
	cta: { label: 'Ask about a finish for your joint', href: ROUTES.contact },
	secondaryCta: { label: 'Surface finishing and colour coding', href: ROUTES.finishing },
};
