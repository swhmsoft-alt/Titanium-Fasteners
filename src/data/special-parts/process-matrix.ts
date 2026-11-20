/**
 * Special Parts & Custom Fasteners — the forming-route matrix.
 *
 * A buyer with a drawing needs to know which process can hold the geometry and
 * the batch size. That is a matrix, not a paragraph — so it is rendered as a
 * table, with no large photography next to it.
 *
 * No tolerance figures are published here: the achievable tolerance depends on
 * the geometry and the batch, and is confirmed per part against the drawing.
 */
import type { ProcessRow } from './types';

export const PROCESS_MATRIX: readonly ProcessRow[] = [
	{
		process: 'CNC turning and milling',
		batch: 'Sample to mid series',
		bestFor: 'Shafts, bushes, spacers and housings with defined geometry',
		titanium: 'Low heat conductivity is compensated in the tool path and the feed',
	},
	{
		process: 'Thread cutting and thread rolling',
		batch: 'Sample to series',
		bestFor: 'Threads on turned parts and on bar stock',
		titanium: 'Rolling is used where the flank finish has to stay under load',
	},
	{
		process: 'Cold heading',
		batch: 'Series',
		bestFor: 'Small fasteners and rivets formed from wire',
		titanium: 'Material flow and springback are compensated per geometry',
	},
	{
		process: 'Hot forging',
		batch: 'Series',
		bestFor: 'Shanked parts and upset heads needing a coarser form',
		titanium: 'Grain direction follows the load path of the finished part',
	},
	{
		process: 'Punched and bent parts',
		batch: 'Sample to mid series',
		bestFor: 'Brackets, clamps and shims from sheet',
		titanium: 'Sheet thickness and bend radius are confirmed against the drawing',
	},
	{
		process: 'Kitting and sub-assembly',
		batch: 'Any',
		bestFor: 'Parts delivered as a counted set for the assembly line',
		titanium: 'Every component keeps its own lot marking inside the kit',
	},
];
