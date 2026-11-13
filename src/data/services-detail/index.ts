/**
 * Index of the service sub-page data files.
 *
 * AUTO-GENERATED companion of scripts/gen-services-detail.mjs.
 * The five benefit pages share one template
 * (src/pages/global-en/services/benefits/[slug].astro).
 */
import { PAGE as costSavingRationalization } from './benefits-cost-saving-rationalization';
import { PAGE as designOptimizationAndValidation } from './benefits-design-optimization-and-validation';
import { PAGE as higherQualityAndSafety } from './benefits-higher-quality-and-safety';
import { PAGE as leanerProcessesAndAutomation } from './benefits-leaner-processes-and-automation';
import { PAGE as reducedTimeToMarket } from './benefits-reduced-time-to-market';

export const BENEFIT_SLUGS = [
	'reduced-time-to-market',
	'leaner-processes-and-automation',
	'cost-saving-rationalization',
	'higher-quality-and-safety',
	'design-optimization-and-validation',
] as const;

export type BenefitSlug = (typeof BENEFIT_SLUGS)[number];

export const BENEFIT_PAGES: Record<BenefitSlug, typeof reducedTimeToMarket> = {
	'reduced-time-to-market': reducedTimeToMarket,
	'leaner-processes-and-automation': leanerProcessesAndAutomation,
	'cost-saving-rationalization': costSavingRationalization,
	'higher-quality-and-safety': higherQualityAndSafety,
	'design-optimization-and-validation': designOptimizationAndValidation,
};
