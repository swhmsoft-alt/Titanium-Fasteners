/**
 * Fastener Coatings — module B: the four core titanium surface states.
 *
 * The framing is deliberately NOT "corrosion protection": titanium does not
 * rust, so a titanium surface is specified for thread galling, wear,
 * cleanliness and assembly identification. The governing standards follow the
 * catalogue dictionary (@data/products → finishes.csv): passivation is
 * ASTM F86 / AMS 2700 and anodising is AMS 2488 Type II / Type III.
 *
 * The images are local .webp files under /images/fastener-coatings/.
 */
import type { FinishCard } from './types';

export const FINISHES: readonly FinishCard[] = [
	{
		id: 'plain',
		name: 'Plain (As-Machined)',
		standard: 'In-house specification — natural oxide, no coating',
		summary:
			'The part leaves the machine with its own titanium surface, cleaned and ' +
			'ready for assembly. Nothing is added, so nothing can chip or flake.',
		points: [
			'No coating, no thickness, no dimensional change',
			'Lowest cost and shortest lead time of the four states',
			'Correct where the joint is opened once and never disturbed',
		],
		image: {
			src: '/images/fastener-coatings/titanium-plain-finish-inspection.webp',
			alt: 'Machined socket cap screws and flange bolts in plain metallic finish on an inspection fixture.',
		},
		ctaLabel: 'Select Plain for RFQ',
	},
	{
		id: 'passivated',
		name: 'Passivated (ASTM F86 / AMS 2700)',
		standard: 'ASTM F86 / AMS 2700 — chemical passivation',
		summary:
			'A chemical passivation leaves the surface in a defined, clean state ' +
			'with no coating and no dimensional change. It is the standard first ' +
			'step for a titanium joint.',
		points: [
			'No coating — thread dimensions are unchanged',
			'Removes free iron and process residue from the surface',
			'Where cleanroom, medical or semiconductor work is specified',
		],
		image: {
			src: '/images/fastener-coatings/titanium-passivated-cleanroom-finish.webp',
			alt: 'Passivated fasteners arranged in a mesh cleanroom tray beside inspection instruments.',
		},
		ctaLabel: 'Select Passivated for RFQ',
	},
	{
		id: 'anodizing',
		name: 'Anodising Type II and Type III (AMS 2488)',
		standard: 'AMS 2488 Type II and Type III',
		summary:
			'An anodic oxide layer is grown onto the surface. Type II is a ' +
			'functional wear layer; Type III carries colour for identification.',
		points: [
			'Type II for wear resistance on the functional surface',
			'Type III for colour marking of grade or finish',
			'Coating thickness confirmed against the drawing before release',
		],
		image: {
			src: '/images/fastener-coatings/titanium-anodized-type2-type3-bolts.webp',
			alt: 'Anodised fasteners in dark grey, blue and gold finishes on an inspection table.',
		},
		ctaLabel: 'Select Anodising for RFQ',
	},
	{
		id: 'pvd',
		name: 'PVD and DLC Coatings',
		standard: 'Vacuum-deposited film to the agreed coating specification',
		summary:
			'A deposited film — DLC, TiN or CrN — for joints that are opened and ' +
			'closed repeatedly, where the thread has to stay separable under load.',
		points: [
			'Matte black DLC, gold TiN and CrN available',
			'For repeatedly opened joints and controlled appearance',
			'Thread allowance checked before the coating is applied',
		],
		image: {
			src: '/images/fastener-coatings/titanium-pvd-dlc-tin-coating.webp',
			alt: 'PVD coated fasteners with matte black and gold metallic films on a granite surface plate.',
		},
		ctaLabel: 'Select PVD / DLC for RFQ',
	},
];
