/**
 * src/data/grade-paths.ts — 牌号落地页路径映射（唯一真相源）。
 *
 * WHY A SEPARATE LEAF MODULE
 * --------------------------
 * 牌号落地页本身的数据在 `src/data/grade-hub.ts`，但那份数据反过来 import
 * `@data/standards-hub`（FAQ 类型）。若把映射放在 grade-hub 里，再让
 * standards-hub / product-solutions / config 引用它，就会形成
 * `grade-hub → standards-hub → grade-hub` 的循环依赖。
 * 本模块**不 import 任何东西**，是依赖树最底层的叶子，可以被任意层安全引用。
 *
 * SCOPE
 * -----
 * 只登记**已有落地页**的牌号。没有落地页的牌号（Grade 23 / Grade 9）
 * 不在此表内，调用方按各自的降级规则处理（筛选深链或牌号矩阵页），
 * 因此本表永远不会指向不存在的路由。
 */
export const GRADE_LANDING_PATHS: Record<string, string> = {
	'ti-gr2': '/products/grade-2-fasteners/',
	'ti-gr5': '/products/grade-5-fasteners/',
};

/**
 * 某牌号的落地页路径 —— 该牌号没有落地页时返回 undefined。
 *
 * 用 undefined 而不是空串，调用方才能区分「有专属页」与「需要降级」，
 * 不会把降级链接覆盖成空 href。
 */
export function gradeLandingPath(materialId: string): string | undefined {
	return GRADE_LANDING_PATHS[materialId];
}
