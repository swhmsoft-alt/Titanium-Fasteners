/**
 * 品类子页索引 —— 由 scripts/gen-category-detail.mjs 自动生成，禁止手改。
 * 已生成 12 / 12 页。
 */
import type { CategoryDetailPage } from './types';
import { CATEGORY_DETAIL as accessSolutions } from './access-solutions';
import { CATEGORY_DETAIL as clinchingTechnology } from './clinching-technology';
import { CATEGORY_DETAIL as clipFasteners } from './clip-fasteners';
import { CATEGORY_DETAIL as directAssemblyScrews } from './direct-assembly-screws';
import { CATEGORY_DETAIL as electricalProducts } from './electrical-products';
import { CATEGORY_DETAIL as embeddingAndSurfaceBondingFasteners } from './embedding-and-surface-bonding-fasteners';
import { CATEGORY_DETAIL as fluidManagement } from './fluid-management';
import { CATEGORY_DETAIL as rivetTechnology } from './rivet-technology';
import { CATEGORY_DETAIL as sealingTechnology } from './sealing-technology';
import { CATEGORY_DETAIL as securingAndAntiLooseningElements } from './securing-and-anti-loosening-elements';
import { CATEGORY_DETAIL as threadedInserts } from './threaded-inserts';
import { CATEGORY_DETAIL as weldingTechnology } from './welding-technology';

export const CATEGORY_DETAIL_SLUGS = [
	'access-solutions',
	'clinching-technology',
	'clip-fasteners',
	'direct-assembly-screws',
	'electrical-products',
	'embedding-and-surface-bonding-fasteners',
	'fluid-management',
	'rivet-technology',
	'sealing-technology',
	'securing-and-anti-loosening-elements',
	'threaded-inserts',
	'welding-technology',
] as const;

export const CATEGORY_DETAIL_PAGES: Record<string, CategoryDetailPage> = {
	'access-solutions': accessSolutions,
	'clinching-technology': clinchingTechnology,
	'clip-fasteners': clipFasteners,
	'direct-assembly-screws': directAssemblyScrews,
	'electrical-products': electricalProducts,
	'embedding-and-surface-bonding-fasteners': embeddingAndSurfaceBondingFasteners,
	'fluid-management': fluidManagement,
	'rivet-technology': rivetTechnology,
	'sealing-technology': sealingTechnology,
	'securing-and-anti-loosening-elements': securingAndAntiLooseningElements,
	'threaded-inserts': threadedInserts,
	'welding-technology': weldingTechnology,
};
