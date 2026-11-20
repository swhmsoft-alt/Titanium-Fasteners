/**
 * src/data/grade-hub.ts — 钛牌号落地页数据源（Grade 2 / Grade 5）。
 *
 * WHY A DEDICATED MODULE
 * ----------------------
 * 两个牌号页结构完全相同，只有牌号本体、可用产品族、规格与 FAQ 文案不同。
 * 把它们集中在这里，改数据不动组件。
 *
 * DATA PROVENANCE（每条都能指回来源，页面不写无出处的数字）
 *   · 可供产品族 / 尺寸区间 / 表面处理 —— src/data/products/category-view.ts + finishes.ts
 *   · 牌号力学值                     —— src/data/products/materials.ts（materials.csv 生成产物）
 *   · 执行标准号                     —— src/data/products/standards.ts
 *
 * 产品族清单**不手写**：按材质从 ALL_PRODUCTS 过滤派生，族上架即自动进页。
 */

import { ALL_PRODUCTS, FINISHES, MATERIALS } from '@data/products';
import type { ProductCardView } from '@data/products';
import type { FaqItem } from '@data/standards-hub';

/** 一行牌号产品表 —— 由产品视图派生，不是手写清单。 */
export interface GradeProductRow {
	/** 产品族名。 */
	title: string;
	/** 族页链接（站内已发布路由）。 */
	href: string;
	/** 执行标准号（族级标准，多个用 " / " 连接）。 */
	standards: string;
	/** 螺纹规格区间，如 "M4 – M10"；无螺纹维度写 "—"。 */
	threadRange: string;
	/** 长度区间（mm），如 "6 – 80 mm"；无长度维度写 "—"。 */
	lengthRange: string;
	/** 可选表面处理（显示名，逗号分隔）。 */
	finishes: string;
}

/** 牌号本体规格 —— 数值全部来自 MATERIALS。 */
export interface GradeSpecRow {
	label: string;
	value: string;
}

export interface GradePage {
	/** 材质 id，如 "ti-gr2"。 */
	materialId: string;
	/** 牌号显示名，如 "Grade 2"。 */
	grade: string;
	/** 合金名，如 "Commercially pure titanium"。 */
	alloy: string;
	/** URL slug。 */
	slug: string;
	/** h1 主标题。 */
	heading: string;
	/** BLUF 摘要（35–50 词，第一句给范围与交付事实）。 */
	lead: string;
	/** 硬指标条。 */
	metrics: { value: string; label: string }[];
	/** 牌号规格表。 */
	specRows: GradeSpecRow[];
	/** 可供产品族（派生）。 */
	products: GradeProductRow[];
	/** 该牌号覆盖的执行标准（派生）。 */
	standards: string;
	/** 图文带（1 张 4:3 图 + 导语 + 3 条要点 + CTA）。 */
	band: {
		heading: string;
		lead: string;
		points: { label: string; text: string }[];
		image: { src: string; alt: string; width: number; height: number };
		cta: { label: string; href: string };
	};
	/** FAQ（首句直答）。 */
	faq: FaqItem[];
}

const FINISH_BY_ID = new Map(FINISHES.map((f) => [f.id, f.name]));

/** 数值排序用的解析：取 "M10" / "10 mm" 里的数字。 */
const numeric = (value: string): number => Number.parseFloat(value.replace(/[^0-9.]/g, ''));

/** 区间字符串："M4 – M10" / "6 – 80 mm"；空集合返回 "—"。 */
function rangeOf(values: string[], unit = ''): string {
	const nums = [...new Set(values)]
		.map(numeric)
		.filter((n) => !Number.isNaN(n))
		.sort((a, b) => a - b);
	if (nums.length === 0) return '—';
	const min = nums[0];
	const max = nums[nums.length - 1];
	const prefix = unit === 'mm' ? '' : 'M';
	const suffix = unit ? ` ${unit}` : '';
	return min === max
		? `${prefix}${min}${suffix}`
		: `${prefix}${min} – ${prefix}${max}${suffix}`;
}

/** 某个材质下的已发布产品族 → 牌号产品表行。 */
function rowsForMaterial(materialId: string): GradeProductRow[] {
	return ALL_PRODUCTS.filter(
		(product) =>
			product.status === 'published' &&
			(product.filters.material ?? []).includes(materialId)
	).map((product) => {
			const finishes = (product.filters.finish ?? [])
				.map((id) => FINISH_BY_ID.get(id) ?? id)
				.join(', ');
			return {
				title: product.title,
				href: product.href,
				standards: product.standards.join(' / '),
				threadRange: rangeOf(product.filters.thread ?? []),
				lengthRange: rangeOf(product.filters.length ?? [], 'mm'),
				finishes: finishes || '—',
			};
		});
}

/** 该材质所有族的螺纹合计区间（跨族取并集）。 */
function unionRange(products: ProductCardView[], key: 'thread' | 'length', unit = ''): string {
	const all: string[] = [];
	for (const product of products) all.push(...((product.filters[key] as string[]) ?? []));
	return rangeOf(all, unit);
}

/** 该材质覆盖的执行标准（去重、排序按族顺序）。 */
function standardsOf(products: ProductCardView[]): string {
	const seen = new Set<string>();
	for (const product of products) for (const s of product.standards) seen.add(s);
	return [...seen].join(' / ');
}

/** 硬指标条 —— 族数与螺纹区间由产品数据算出，不手写。 */
function metricsFor(
	materialId: string,
	strengthLabel: string,
	strengthValue: string
): { value: string; label: string }[] {
	const products = ALL_PRODUCTS.filter(
		(product) =>
			product.status === 'published' && (product.filters.material ?? []).includes(materialId)
	);
	return [
		{
			value: `${products.length} Families`,
			label: 'Published product families supplied in this grade',
		},
		{
			value: unionRange(products, 'thread'),
			label: 'Metric thread range across the published families',
		},
		{ value: strengthValue, label: strengthLabel },
		{
			value: 'EN 10204 3.1 MTR',
			label: 'Heat-number traceability included with every shipment',
		},
	];
}

/** 牌号规格表 —— 数值全部取自 MATERIALS（materials.csv 生成产物）。 */
function specRowsFor(materialId: string): GradeSpecRow[] {
	const m = MATERIALS.find((item) => item.id === materialId);
	if (!m) throw new Error(`grade-hub: unknown material ${materialId}`);
	return [
		{ label: 'Alloy', value: m.name },
		{ label: 'Proof strength', value: `${m.proof_strength_mpa} MPa` },
		{ label: 'Tensile strength', value: `${m.tensile_mpa} MPa` },
		{ label: 'Density', value: `${m.density_g_cm3} g/cm³` },
		{ label: 'Corrosion rating', value: `${m.corrosion_1_5} of 5` },
		{ label: 'Maximum service temperature', value: `${m.max_temp_c} °C` },
		{ label: 'Material specification', value: m.notes ?? '—' },
	];
}

/** 牌号页集合 —— 目前只交付有产品族的 Grade 2 与 Grade 5。 */
export const GRADE_PAGES: GradePage[] = [
	{
		materialId: 'ti-gr2',
		grade: 'Grade 2',
		alloy: 'Commercially pure titanium',
		slug: 'grade-2-fasteners',
		heading: 'Titanium Grade 2 Fasteners',
		lead:
			'Grade 2 commercially pure titanium fasteners resist chloride, acids and salt spray without sacrificial coatings. Eleven published product families are machined from certified ASTM B348 bar, and every shipment leaves with an EN 10204 3.1 certificate.',
		metrics: metricsFor(
			'ti-gr2',
			'Proof strength, ASTM F593 finished-fastener values',
			'275 MPa'
		),
		specRows: specRowsFor('ti-gr2'),
		products: rowsForMaterial('ti-gr2'),
		standards: standardsOf(
			ALL_PRODUCTS.filter(
				(product) =>
					product.status === 'published' &&
					(product.filters.material ?? []).includes('ti-gr2')
			)
		),
		band: {
			heading: 'Corrosion service without a sacrificial coating',
			lead:
				'Grade 2 commercially pure titanium holds its own in chloride and acid service. The native oxide layer does the protecting, so parts need no plating, and the surface is supplied in the mill finish, passivated or anodized.',
			points: [
				{
					label: 'Corrosion rating 4 of 5',
					text: 'recorded for this grade in our material data',
				},
				{
					label: 'ASTM F86 / AMS 2700 passivation',
					text: 'oxide-protected surface with no plating layer',
				},
				{
					label: 'AMS 2488 anodizing available',
					text: 'where a functional or colour finish is specified',
				},
			],
			image: {
				src: '/images/fastener-coatings/04-corrosion-protection-coating-image-screw-with-wa.webp',
				alt: 'Screw and washer shown with a corrosion protective surface coating.',
				width: 960,
				height: 720,
			},
			cta: { label: 'Corrosion resistant fasteners', href: '/products/?material=ti-gr2' },
		},
		faq: [
			{
				question: 'Is Grade 2 titanium strong enough for structural load?',
				answer:
					'Yes for corrosion-driven duties, not for high-load structure. Grade 2 commercially pure titanium carries a proof strength of 275 MPa and a tensile strength of 345 MPa, so it is specified where corrosion resistance governs the design and the load stays low.',
			},
			{
				question: 'Does Grade 2 titanium need plating for corrosion protection?',
				answer:
					'No. Titanium forms its own oxide layer, so Grade 2 parts ship in the mill finish or chemically passivated to ASTM F86 / AMS 2700, with anodizing available to AMS 2488 where a functional or colour finish is required.',
			},
			{
				question: 'Which standards are covered by the Grade 2 range?',
				answer:
					'DIN 912, DIN 933, DIN 931, DIN 934, DIN 125, DIN 6921, DIN 7380, DIN 7991, DIN 938 and DIN 939 are all produced in Grade 2 from M3 to M20, with sizes outside that range machined to order.',
			},
			{
				question: 'What certificate arrives with a Grade 2 order?',
				answer:
					'An EN 10204 3.1 certificate showing the original melt heat number, the chemical composition and the mechanical results travels with every shipment, and third-party inspection by SGS or BV can be arranged on your order.',
			},
			{
				question: 'Can Grade 2 parts be made to my drawing?',
				answer:
					'Yes. Grade 2 is one of the grades we machine to print under NDA, including thread forms, head styles and lengths that are not part of the catalogue.',
			},
		],
	},
	{
		materialId: 'ti-gr5',
		grade: 'Grade 5',
		alloy: 'Ti-6Al-4V',
		slug: 'grade-5-fasteners',
		heading: 'Titanium Grade 5 Fasteners',
		lead:
			'Grade 5 Ti-6Al-4V combines high strength with low mass for aerospace, robotics and motorsport assemblies. Fifteen published product families are machined from certified AMS 4928 or ASTM B348 bar, and every shipment leaves with an EN 10204 3.1 certificate.',
		metrics: metricsFor(
			'ti-gr5',
			'Tensile strength, ASTM F468 / F593 finished-fastener values',
			'895 MPa'
		),
		specRows: specRowsFor('ti-gr5'),
		products: rowsForMaterial('ti-gr5'),
		standards: standardsOf(
			ALL_PRODUCTS.filter(
				(product) =>
					product.status === 'published' &&
					(product.filters.material ?? []).includes('ti-gr5')
			)
		),
		band: {
			heading: 'Strength where the weight matters',
			lead:
				'Grade 5 Ti-6Al-4V carries 895 MPa tensile at 4.43 g/cm³, so a joint takes the load without carrying the mass of a steel fastener. Every part is machined from certified AMS 4928 or ASTM B348 bar.',
			points: [
				{
					label: '895 MPa tensile strength',
					text: 'at 4.43 g/cm³, about half the density of steel',
				},
				{
					label: 'AMS 4928 bar certified',
					text: 'with the mill certificate attached to every lot',
				},
				{
					label: 'AMS 2488 anodizing available',
					text: 'where galling against aluminium must be prevented',
				},
			],
			image: {
				src: '/images/products/TI-TORX-FLANGE-HEAD-BOLTS-BZ-109-bolts-titanium.webp',
				alt: 'Titanium Torx flange head bolts machined in Grade 5 Ti-6Al-4V.',
				width: 1200,
				height: 896,
			},
			cta: { label: 'High strength fasteners', href: '/products/?material=ti-gr5' },
		},
		faq: [
			{
				question: 'What strength does Grade 5 Ti-6Al-4V give me?',
				answer:
					'Grade 5 carries a proof strength of 828 MPa and a tensile strength of 895 MPa, roughly three times the strength of Grade 2, while keeping a density of 4.43 g/cm³ that is about half that of stainless steel.',
			},
			{
				question: 'Is Grade 5 the right grade for aerospace work?',
				answer:
					'Grade 5 is the standard high-strength titanium fastener grade, and aerospace lots are supplied against AMS 4928 bar with the mill certificate attached to the EN 10204 3.1 document.',
			},
			{
				question: 'Which standards are covered by the Grade 5 range?',
				answer:
					'DIN 912, DIN 933, DIN 931, DIN 934, DIN 125, DIN 6921, DIN 7380, DIN 7991, DIN 938, DIN 939, DIN 34800 and ISO 7380-2 are produced in Grade 5 from M3 to M20, with sizes outside that range machined to order.',
			},
			{
				question: 'How is galling against aluminium handled?',
				answer:
					'Parts are passivated to AMS 2700 or ASTM F86 by default, and AMS 2488 Type II or Type III anodizing is available where the fastener runs against an aluminium or composite interface.',
			},
			{
				question: 'Can Grade 5 parts be made to my drawing?',
				answer:
					'Yes. Grade 5 is one of the grades we machine to print under NDA, including thread forms, head styles and lengths that are not part of the catalogue.',
			},
		],
	},
];

/** 按材质 id 取牌号页；未知 id 直接抛错，防止静默占位。 */
export function gradePageByMaterial(materialId: string): GradePage {
	const page = GRADE_PAGES.find((item) => item.materialId === materialId);
	if (!page) throw new Error(`grade-hub: no page for material ${materialId}`);
	return page;
}
