/**
 * Fastener Coatings — module D: the purchasing and engineering FAQ.
 *
 * The same question/answer strings feed the visible <details> panel and the
 * FAQPage JSON-LD, so the structured data can never drift from the page.
 *
 * No torque coefficient, no friction coefficient, no galling test numbers.
 */
import type { FaqItem } from './types';

export const FAQ: readonly FaqItem[] = [
	{
		question: 'How do I choose between passivated and plain finish for industrial titanium fasteners?',
		answer:
			'Plain leaves the part in its as-machined state with its natural oxide ' +
			'intact — the right choice when the joint is opened once and the cost and ' +
			'lead time matter most. Passivation is a chemical clean that removes free ' +
			'iron and process residue from the surface and leaves it in a defined ' +
			'state, with no coating and no dimensional change. If the part has been ' +
			'through a secondary machining, a deburring or a blasting operation, or if ' +
			'cleanroom, medical or semiconductor work is specified, passivation is ' +
			'normally the correct choice. We confirm which state the drawing calls ' +
			'for before the batch is released.',
	},
	{
		question: 'What is the difference between AMS 2488 Type II and Type III titanium anodising?',
		answer:
			'Both are anodic oxide layers grown onto the titanium surface under ' +
			'AMS 2488. Type II is the functional grade: a thin, hard, low-porosity ' +
			'layer intended for wear resistance and for reducing the risk of thread ' +
			'galling on the functional surface. Type III is the colour grade: it adds ' +
			'chromophores to the oxide so the finish carries a colour that identifies ' +
			'the grade, the finish or the assembly step on the line. Type III is chosen ' +
			'when identification matters as much as performance; Type II when only ' +
			'the functional surface matters.',
	},
	{
		question: 'Do PVD or anodised coatings require undersized thread machining?',
		answer:
			'That depends on the coating thickness and on the tolerance class the ' +
			'part has to hold, and we do not answer it generically. Our workshop ' +
			'checks the allowance against the drawing before the coating process ' +
			'starts: where a coating thickness would take the thread outside the ' +
			'drawing, the thread is machined undersize or the coating specification is ' +
			'reviewed with you. M1.6–M36 is our standing size range, with M1–M1.5 ' +
			'made to order. Send the standard, the size and the tolerance class, and ' +
			'we will state the answer for that part.',
	},
	{
		question: 'What material certifications and inspection reports are provided with coated titanium fasteners?',
		answer:
			'Every batch ships with an EN 10204 3.1 mill certificate carrying the ' +
			'heat number of the lot, and the grade is verified in our own workshop ' +
			'by PMI / XRF. Finished fasteners are produced to ASTM F467 and F468 ' +
			'where the standard calls for it, and each lot keeps its own heat number ' +
			'rather than being merged with another lot. For distributors we pack ' +
			'neutral, moisture-protected, anti-mixed packaging with your own labels, ' +
			'and blanket orders are released in scheduled batches against one ' +
			'agreement.',
	},
];
