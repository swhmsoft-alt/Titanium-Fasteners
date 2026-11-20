/**
 * Special Parts & Custom Fasteners — the physical-proof gallery.
 *
 * Four 4:3 tiles showing what the workshop actually produces. These are the
 * only large images on the page besides the two band figures — the matrix
 * section deliberately carries no photography.
 *
 * Alt text describes geometry and process only. It never claims a material or a
 * tolerance that has not been confirmed for the individual part.
 */
import type { GalleryItem } from './types';

export const GALLERY: readonly GalleryItem[] = [
	{
		src: '/images/public-images/special-parts-gallery-punched-and-bent-sheet-component.webp',
		alt: 'Bent sheet component with a formed return edge.',
		caption: 'Punched and bent components',
	},
	{
		src: '/images/public-images/special-parts-gallery-hook-bracket-to-drawing.webp',
		alt: 'Hook bracket with a curved end and two screw holes.',
		caption: 'Brackets and clips to drawing',
	},
	{
		src: '/images/public-images/special-parts-gallery-punched-and-bent-clamp-part.webp',
		alt: 'Punched and bent clamp part on a white background.',
		caption: 'Clamps and formed parts',
	},
	{
		src: '/images/public-images/special-parts-gallery-cnc-turned-threaded-cylinder.webp',
		alt: 'CNC-turned cylinder with a machined step and thread.',
		caption: 'CNC-turned and threaded parts',
	},
];
