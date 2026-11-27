/**
 * Fastener Coatings — module C: the engineering comparison matrix.
 *
 * HARD CONSTRAINTS
 * ----------------
 * · No measured torque, friction or galling figures.
 * · No coating thickness that the workshop has not confirmed. The thickness
 *   column therefore states the governing document and whether a value is
 *   confirmed per drawing — it does not publish unverified micron figures.
 * · The thread column states the effect qualitatively (none / negligible /
 *   allowance check), never a numeric tolerance change.
 */
import type { MatrixFilter, MatrixRow } from './types';

export const MATRIX_FILTERS: readonly MatrixFilter[] = [
	{ id: 'all', label: 'All finishes' },
	{ id: 'galling', label: 'Anti-galling priority' },
	{ id: 'no-thread-change', label: 'No thread change' },
	{ id: 'medical', label: 'Medical and cleanroom' },
	{ id: 'colour', label: 'Colour coding' },
];

export const MATRIX_ROWS: readonly MatrixRow[] = [
	{
		id: 'plain',
		finish: 'Plain (as-machined)',
		standard: 'In-house specification',
		thickness: 'No coating — natural oxide',
		threadImpact: 'None',
		purpose: 'Cost and lead time',
		tags: ['no-thread-change', 'medical'],
	},
	{
		id: 'passivated',
		finish: 'Passivated',
		standard: 'ASTM F86 / AMS 2700',
		thickness: 'No coating — chemical clean',
		threadImpact: 'None',
		purpose: 'Clean, defined surface state',
		tags: ['galling', 'no-thread-change', 'medical'],
	},
	{
		id: 'anodizing-type-ii',
		finish: 'Anodising Type II',
		standard: 'AMS 2488 Type II',
		thickness: 'Confirmed against the drawing',
		threadImpact: 'Negligible — allowance check on request',
		purpose: 'Anti-galling and wear resistance',
		tags: ['galling'],
	},
	{
		id: 'anodizing-type-iii',
		finish: 'Anodising Type III',
		standard: 'AMS 2488 Type III',
		thickness: 'Confirmed against the drawing',
		threadImpact: 'Negligible — allowance check on request',
		purpose: 'Colour identification',
		tags: ['colour', 'galling'],
	},
	{
		id: 'pvd',
		finish: 'PVD / DLC',
		standard: 'Agreed coating specification',
		thickness: 'Confirmed against the drawing',
		threadImpact: 'Pre-coating allowance check',
		purpose: 'Wear, appearance and repeated opening',
		tags: ['colour'],
	},
];
