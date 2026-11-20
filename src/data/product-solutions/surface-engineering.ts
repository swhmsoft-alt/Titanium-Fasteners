/**
 * Product Solutions — band 3: 钛专属防咬死与功能表面处理方案（C 维度）。
 *
 * Audience: OEM assembly and reliability engineering.
 *
 * The framing matters: on titanium the surface is NOT specified to prevent
 * rust — titanium does not rust. It is specified to prevent thread galling,
 * to control wear, and to identify the part in assembly.
 */
import { PATHS } from './routes';
import type { SolutionBand } from './types';

export const SURFACE_ENGINEERING: SolutionBand = {
	id: 'surface-engineering',
	eyebrow: 'Solution 03 — Titanium Surface Engineering',
	heading: 'Titanium does not need plating for rust. It needs a surface that will not gall.',
	lead:
		'Two titanium surfaces under load can bond and take the mating thread with ' +
		'them. We specify the surface for galling, wear and assembly identification ' +
		'— never for corrosion protection.',
	body: [],
	highlights: [
		{
			label: 'AMS 2700 / ASTM F86 passivation',
			text: 'cleans the surface and leaves it in a defined state, with no dimensional change',
		},
		{
			label: 'AMS 2488 Type II / III anodising',
			text: 'functional wear surface plus colour marking of grade or finish, without changing dimensions',
		},
		{
			label: 'DLC dry film',
			text: 'a deposited low-friction film that keeps the threads separable where the joint is opened and closed repeatedly',
		},
	],
	images: [
		{
			src: '/images/public-images/product-solutions-surface-engineering-anodised-titanium-fasteners.webp',
			alt: 'Two sets of titanium screws and washers, one set with a black anodised finish.',
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
			href: PATHS.finishing,
			icon: '/images/fastener-coatings/07-surface-finishing-icon.webp',
		},
		{
			label: 'AMS 2488 Type II / III',
			heading: 'Functional and colour anodising',
			body:
				'Type II for wear resistance on the functional surface, Type III where ' +
				'the colour is needed to identify the grade or the finish on the ' +
				'assembly line.',
			href: PATHS.finishing,
			icon: '/images/fastener-coatings/06-fastener-finish-icon.webp',
		},
		{
			label: 'PVD / DLC',
			heading: 'Physical vapour deposition',
			body:
				'A deposited film for joints that are opened and closed repeatedly, ' +
				'where the thread has to stay separable under load.',
			href: PATHS.finishing,
			icon: '/images/special-parts-and-custom-fasteners/04-increasing-product-quality-icon.svg',
		},
		{
			label: 'Solid dry film',
			heading: 'Dry-film lubricant for controlled assembly',
			body:
				'A bonded low-friction film applied so the joint can be assembled and ' +
				'dismantled repeatedly without the threads bonding to each other.',
			href: PATHS.finishing,
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
	cta: { label: 'Ask about a finish for your joint', href: PATHS.contact },
	secondaryCta: { label: 'Surface finishing and colour coding', href: PATHS.finishing },
};
