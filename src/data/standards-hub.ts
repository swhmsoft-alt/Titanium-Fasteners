/**
 * src/data/standards-hub.ts — 国际标准聚合页数据源。
 *
 * WHY A DEDICATED MODULE
 * ----------------------
 * 三个聚合页（DIN / ISO / ASTM-ASME）共用同一套组件结构，只有表格条目、
 * 牌号对照与 FAQ 文案不同。把它们集中在这里，改数据不动组件。
 *
 * DATA PROVENANCE（每条都能指回来源，页面不写无出处的数字）
 *   · 标准名称 / ISO 对应号 —— 来自 src/data/products/standards.ts（standards.csv 生成产物）
 *   · 尺寸区间           —— 来自 data/products/dimensions/*.csv
 *   · 产品链接           —— 来自 src/data/products/routes.json（仅已发布路由）
 *   · 牌号力学值         —— 来自 src/data/products/materials.ts（materials.csv 生成产物）
 *   Gr7 无在册数据：**不造数值**，只写「按单确认」，与知识库牌号矩阵页口径一致。
 */
import { gradeLandingPath } from '@data/grade-paths';

/**
 * 品类过滤标签（顺序即展示顺序）。
 *
 * `material` 只在 ASTM/ASME 页出现 —— 该体系的表格含 B348 / F136 / AMS 4928
 * 这类**材料规格**（它们规定的是棒料与锻件，不是紧固件本身）。
 * 页面按实际出现的类别渲染标签，所以 DIN / ISO 页不会多出这个标签。
 */
export const STANDARD_CATEGORIES = [
	{ id: 'all', label: 'All' },
	{ id: 'bolts', label: 'Bolts' },
	{ id: 'screws', label: 'Screws' },
	{ id: 'nuts', label: 'Nuts' },
	{ id: 'washers', label: 'Washers' },
	{ id: 'rods', label: 'Threaded Rods' },
	{ id: 'material', label: 'Material & Bar Stock' },
] as const;

export type StandardCategory = (typeof STANDARD_CATEGORIES)[number]['id'];

export interface StandardRow {
	/** 主标准号，如 "DIN 912"。 */
	standard: string;
	/** 标准英文全称。 */
	product: string;
	/** 对应国际标准号；无对应者写明原因。 */
	equivalent: string;
	/** 尺寸区间。 */
	size: string;
	/** 可供牌号标签。 */
	grades: string[];
	/** 供应状态。 */
	availability: string;
	/** 品类过滤键。 */
	category: Exclude<StandardCategory, 'all'>;
	/** 详情页链接；无独立详情页时指向标准筛选深链。 */
	href: string;
}

/** DIN 页表格数据 —— 10 条有实测尺寸区间 + 1 条按单确认。 */
export const DIN_STANDARD_ROWS: StandardRow[] = [
	{
		standard: 'DIN 912',
		product: 'Hexagon socket head cap screws',
		equivalent: 'ISO 4762 / ASME B18.3.1M',
		size: 'M3 – M10',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'screws',
		href: '/products/screws/hex-socket-head-cap-screw/',
	},
	{
		standard: 'DIN 933',
		product: 'Hexagon head bolts, fully threaded',
		equivalent: 'ISO 4017 / ASME B18.2.1',
		size: 'M4 – M16',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'bolts',
		href: '/products/bolts/hexagon-head-bolts-full-thread/',
	},
	{
		standard: 'DIN 931',
		product: 'Hexagon head bolts, partially threaded',
		equivalent: 'ISO 4014',
		size: 'M6 – M20',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'bolts',
		href: '/products/bolts/hexagon-head-bolts-partial-thread/',
	},
	{
		standard: 'DIN 934',
		product: 'Hexagon nuts, style 1',
		equivalent: 'ISO 4032',
		size: 'M4 – M12',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'nuts',
		href: '/products/nuts/hex-nut/',
	},
	{
		standard: 'DIN 125',
		product: 'Plain washers, form A, 200 HV',
		equivalent: 'ISO 7089',
		size: 'M4 – M12',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'washers',
		href: '/products/washers/plain-washers/',
	},
	{
		standard: 'DIN 7991',
		product: 'Hexagon socket head countersunk screws, 90°',
		equivalent: 'ISO 10642',
		size: 'M3 – M8',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'screws',
		href: '/products/screws/countersunk-head-cap-screws/',
	},
	{
		standard: 'DIN 7380',
		product: 'Hexagon socket head button head screws',
		equivalent: 'ISO 7380',
		size: 'M3 – M8',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'screws',
		href: '/products/bolts/hex-socket-button-head-bolts/',
	},
	{
		standard: 'DIN 6921',
		product: 'Hexagon head bolts with flange',
		equivalent: 'ISO 4162',
		size: 'M5 – M12',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'bolts',
		href: '/products/bolts/hexagon-flange-bolts/',
	},
	{
		standard: 'DIN 938',
		product: 'Hexagon head studs, full length thread',
		equivalent: 'Stud series (no full ISO equivalent)',
		size: 'M6 – M16',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'rods',
		href: '/products/bolts/double-end-stud-bolts/',
	},
	{
		standard: 'DIN 34800',
		product: '12-point flange bolts',
		equivalent: 'Aerospace series (no full ISO equivalent)',
		size: 'M6 – M12',
		grades: ['Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'bolts',
		href: '/products/bolts/12-point-flange-bolts/',
	},
	{
		standard: 'DIN 913',
		product: 'Hexagon socket set screws with flat point',
		equivalent: 'ISO 4026',
		size: 'Set screw series, size on request',
		grades: ['Gr2', 'Gr5'],
		availability: 'Made to Order (7-12 Days)',
		category: 'screws',
		href: '/products/?standard=din-913',
	},
];

/** 牌号对照行。 */
export interface GradeRow {
	grade: string;
	name: string;
	tensile: string;
	yieldStrength: string;
	applications: string;
	note: string;
}

/**
 * 牌号对照 —— 数值取自 MATERIALS（materials.csv 生成产物）。
 * Gr7 不在册：只写「按单确认」，不编造抗拉/屈服值。
 */
export const GRADE_ROWS: GradeRow[] = [
	{
		grade: 'Grade 2',
		name: 'Commercially pure titanium',
		tensile: '345 MPa',
		yieldStrength: '275 MPa',
		applications: 'Chemical processing, electroplating, marine splash zones',
		note: 'ASTM B348 bar stock; ASTM F593 finished-fastener values.',
	},
	{
		grade: 'Grade 5',
		name: 'Ti-6Al-4V',
		tensile: '895 MPa',
		yieldStrength: '828 MPa',
		applications: 'Aerospace, robotics, motorsport, high-cycle assemblies',
		note: 'ASTM F468 / F593 finished-fastener values; AMS 4928 for aerospace.',
	},
	{
		grade: 'Grade 7',
		name: 'Ti-6Al-4V with palladium',
		tensile: 'Confirmed per order',
		yieldStrength: 'Confirmed per order',
		applications: 'Chemical processing, pulp and paper, chloride service',
		note: 'Supplied against the mill certificate for the confirmed lot.',
	},
	{
		grade: 'Grade 23',
		name: 'Ti-6Al-4V ELI',
		tensile: '860 MPa',
		yieldStrength: '790 MPa',
		applications: 'Medical implants, medical devices, clean-room assemblies',
		note: 'AMS 4928 / medical implant grade; corrosion rated for seawater service.',
	},
];

/** 出厂检验项目 —— 执行标准随行。 */
export interface QaItem {
	title: string;
	detail: string;
	standard: string;
}

export const QA_ITEMS: QaItem[] = [
	{
		title: '100% Dimensional Inspection',
		detail:
			'Every part is checked against the drawing and the governing standard before packing: thread form and pitch diameter by go/no-go gauges, head diameter, head height, across-flats, shank length and tolerance class.',
		standard: 'ISO 4759-1 / ISO 228 gauging',
	},
	{
		title: 'PMI Chemical Analysis',
		detail:
			'Positive material identification on every lot confirms the alloy before machining or packing, so a mixed or mis-marked heat cannot reach your line.',
		standard: 'XRF / OES spectrometry, AMS 2750 practice',
	},
	{
		title: 'Mechanical & Hardness Testing',
		detail:
			'Tensile testing to ASTM E8 and hardness to ASTM E18 / E10 are run on the lot. Test reports state the actual measured values and the specimen geometry.',
		standard: 'ASTM E8 / ASTM E18',
	},
	{
		title: 'Full Lot Traceability',
		detail:
			'Each shipment carries the EN 10204 3.1 certificate showing the original melt heat number, the chemical composition and the mechanical results. Third-party inspection by SGS or BV can be arranged on your order.',
		standard: 'EN 10204 3.1 certificate',
	},
];

/** FAQ 条目 —— 答案首句必须直接给结论。 */
export interface FaqItem {
	question: string;
	answer: string;
}

/**
 * ISO 页表格数据 —— ISO 号为主键，列出对应的 DIN 号。
 * 尺寸区间与 DIN 页同源（同一批产品的加工尺寸），链接指向同一批已发布路由。
 */
export const ISO_STANDARD_ROWS: StandardRow[] = [
	{
		standard: 'ISO 4762',
		product: 'Hexagon socket head cap screws',
		equivalent: 'DIN 912 / ASME B18.3.1M',
		size: 'M3 – M10',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'screws',
		href: '/products/screws/hex-socket-head-cap-screw/',
	},
	{
		standard: 'ISO 4017',
		product: 'Hexagon head bolts, fully threaded',
		equivalent: 'DIN 933 / ASME B18.2.1',
		size: 'M4 – M16',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'bolts',
		href: '/products/bolts/hexagon-head-bolts-full-thread/',
	},
	{
		standard: 'ISO 4014',
		product: 'Hexagon head bolts, partially threaded',
		equivalent: 'DIN 931',
		size: 'M6 – M20',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'bolts',
		href: '/products/bolts/hexagon-head-bolts-partial-thread/',
	},
	{
		standard: 'ISO 4032',
		product: 'Hexagon nuts, style 1',
		equivalent: 'DIN 934',
		size: 'M4 – M12',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'nuts',
		href: '/products/nuts/hex-nut/',
	},
	{
		standard: 'ISO 7089',
		product: 'Plain washers, normal series, 200 HV',
		equivalent: 'DIN 125',
		size: 'M4 – M12',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'washers',
		href: '/products/washers/plain-washers/',
	},
	{
		standard: 'ISO 10642',
		product: 'Hexagon socket head countersunk screws, 90°',
		equivalent: 'DIN 7991',
		size: 'M3 – M8',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'screws',
		href: '/products/screws/countersunk-head-cap-screws/',
	},
	{
		standard: 'ISO 7380-1',
		product: 'Hexagon socket head button head screws',
		equivalent: 'DIN 7380',
		size: 'M3 – M8',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'screws',
		href: '/products/bolts/hex-socket-button-head-bolts/',
	},
	{
		standard: 'ISO 7380-2',
		product: 'Torx flange head bolts, flanged series',
		equivalent: 'Flanged series, DIN counterpart on request',
		size: 'M4 – M10',
		grades: ['Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'bolts',
		href: '/products/bolts/torx-flange-head-bolts/',
	},
	{
		standard: 'ISO 4162',
		product: 'Hexagon head bolts with flange',
		equivalent: 'DIN 6921',
		size: 'M5 – M12',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'bolts',
		href: '/products/bolts/hexagon-flange-bolts/',
	},
	{
		standard: 'ISO 4026',
		product: 'Hexagon socket set screws with flat point',
		equivalent: 'DIN 913',
		size: 'Set screw series, size on request',
		grades: ['Gr2', 'Gr5'],
		availability: 'Made to Order (7-12 Days)',
		category: 'screws',
		href: '/products/?standard=din-913',
	},
	{
		standard: 'ISO 4035',
		product: 'Hexagon thin nuts, style 1',
		equivalent: 'DIN 439',
		size: 'Thin series, size on request',
		grades: ['Gr2', 'Gr5'],
		availability: 'Made to Order (7-12 Days)',
		category: 'nuts',
		href: '/products/?standard=din-439',
	},
	{
		standard: 'ISO 14579',
		product: 'Hexagon socket head cap screws with flanged head',
		equivalent: 'DIN 14579',
		size: 'Flanged cap series, size on request',
		grades: ['Gr2', 'Gr5'],
		availability: 'Made to Order (7-12 Days)',
		category: 'screws',
		href: '/products/?standard=din-14579',
	},
];

/**
 * ASTM / ASME 页表格数据。
 *
 * 分两类（对应两个过滤标签）：
 *   · 成品件规范 —— F468 / F467 / F593 / B18.2.1 等；
 *   · 材料规范   —— B348 / F136 / AMS 4928（棒料与锻件，是紧固件的原料依据）。
 */
export const ASTM_STANDARD_ROWS: StandardRow[] = [
	{
		standard: 'ASTM F468',
		product: 'Hexagon head cap screws — steel, aluminium and titanium scope',
		equivalent: 'DIN 933 / ISO 4017',
		size: 'M4 – M16',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'bolts',
		href: '/products/bolts/hexagon-head-bolts-full-thread/',
	},
	{
		standard: 'ASTM F593',
		product: 'Hex socket head cap screws — aluminium and titanium scope',
		equivalent: 'DIN 912 / ISO 4762',
		size: 'M3 – M10',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'screws',
		href: '/products/screws/hex-socket-head-cap-screw/',
	},
	{
		standard: 'ASME B18.2.1',
		product: 'Square, hex and heavy hex structural bolts, metric series',
		equivalent: 'DIN 931 / ISO 4014',
		size: 'M6 – M20',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'bolts',
		href: '/products/bolts/hexagon-head-bolts-partial-thread/',
	},
	{
		standard: 'ASME B18.1.1',
		product: 'Square, hex and heavy hex studs, inch series',
		equivalent: 'DIN 938 / DIN 939',
		size: 'M6 – M16',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'rods',
		href: '/products/bolts/double-end-stud-bolts/',
	},
	{
		standard: 'ASME B18.3',
		product: 'Socket cap, shoulder and set screws, inch series',
		equivalent: 'DIN 912 / ISO 4762',
		size: 'M3 – M10',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'screws',
		href: '/products/bolts/hex-socket-head-cap-bolts/',
	},
	{
		standard: 'ASME B18.2.2',
		product: 'Hexagon nuts, metric series',
		equivalent: 'DIN 934 / ISO 4032',
		size: 'M4 – M12',
		grades: ['Gr2', 'Gr5'],
		availability: 'In Stock (3-5 Days)',
		category: 'nuts',
		href: '/products/nuts/hex-nut/',
	},
	{
		standard: 'ASME B18.21.1',
		product: 'Plain washers, inch series',
		equivalent: 'DIN 125 / ISO 7089',
		size: 'Metric and inch series on request',
		grades: ['Gr2', 'Gr5'],
		availability: 'Made to Order (7-12 Days)',
		category: 'washers',
		href: '/products/washers/plain-washers/',
	},
	{
		standard: 'ASTM B348',
		product: 'Titanium and titanium alloy bars, billets and forgings',
		equivalent: 'Grade 2 / Grade 5 / Grade 23 bar stock',
		size: 'Per mill standard',
		grades: ['Gr2', 'Gr5', 'Gr23'],
		availability: 'In Stock (3-5 Days)',
		category: 'material',
		href: gradeLandingPath('ti-gr5') ?? '/products/?material=ti-gr5',
	},
	{
		standard: 'ASTM F136',
		product: 'Wrought titanium alloy for surgical implant applications',
		equivalent: 'Grade 23 ELI bar and sheet',
		size: 'Per mill standard',
		grades: ['Gr23'],
		availability: 'Made to Order (7-12 Days)',
		category: 'material',
		href: '/products/?material=ti-gr23',
	},
	{
		standard: 'AMS 4928',
		product: 'Titanium alloy Ti-6Al-4V sheet, plate and bar for aerospace',
		equivalent: 'Grade 5 bar stock, aerospace lot',
		size: 'Per aerospace mill standard',
		grades: ['Gr5'],
		availability: 'Made to Order (7-12 Days)',
		category: 'material',
		href: gradeLandingPath('ti-gr5') ?? '/products/?material=ti-gr5',
	},
];

export const DIN_FAQ: FaqItem[] = [
	{
		question: 'Can you supply non-standard or cold DIN numbers to our drawing, and what is the MOQ?',
		answer:
			'Yes, we machine or cold-forge titanium fasteners to your drawing under NDA, with MOQ from 100 pieces per size. Cold heading covers standard geometry, and CNC turning covers threads, shanks and anything a die cannot form. The drawing is only opened after the mutual NDA is signed, and every batch then carries a 3.1 certificate tied to its heat number.',
	},
	{
		question: 'Does every batch of DIN titanium fasteners come with an EN 10204 3.1 certificate and third-party inspection?',
		answer:
			'Yes, every batch ships with an EN 10204 3.1 material certificate as standard. Third-party verification by SGS or BV can be booked on your order, and the inspection scope is agreed in writing before production starts. Test reports for tensile and hardness are attached to the same certificate set.',
	},
	{
		question: 'How do you control thread tolerance for DIN fasteners, such as 6g and 6H?',
		answer:
			'Standard stock is supplied in the tolerance class defined by the DIN standard itself, and non-standard classes are available on request. Every thread is gauged during production, so the class on your purchase order is the class on the certificate. For critical joints we confirm the class in writing before the batch is cut.',
	},
	{
		question: 'What is the delivery time for bulk orders, and which Incoterms do you quote?',
		answer:
			'In-stock standard items ship in 3 to 5 working days and made-to-order parts in 7 to 12 working days after drawing approval. We quote FOB, CIF and DDP, with EXW available on request. Air freight can be arranged for urgent call-off schedules.',
	},
	{
		question: 'Can one order mix grades and finishes across different DIN sizes?',
		answer:
			'Yes, a single order can mix grades and sizes, and each size keeps its own lot certificate. Mixing is handled by separate bagging per heat number so nothing is mixed on the line. If you need a single consolidated certificate for the whole shipment, say so in the order and we will state whether it is possible.',
	},
];

/** ISO 页 FAQ —— 首句直答，问题围绕国际标准采购。 */
export const ISO_FAQ: FaqItem[] = [
	{
		question: 'Is an ISO standard number the same as a DIN number for the same part?',
		answer:
			'Yes, in most cases the two systems describe the same geometry and can be ordered against either number. DIN 912 and ISO 4762 are the same hexagon socket head cap screw, and DIN 933 and ISO 4017 are the same fully threaded hexagon head bolt. Where a DIN number is withdrawn or a part has no direct equivalent, the equivalent column in the table states the reason instead of inventing a match.',
	},
	{
		question: 'Can you supply ISO titanium fasteners to a drawing where the standard is not listed?',
		answer:
			'Yes, we machine or cold-forge titanium fasteners to your drawing under NDA, with MOQ from 100 pieces per size. The drawing is only opened after the mutual NDA is signed, and every batch then carries a 3.1 certificate tied to its heat number.',
	},
	{
		question: 'Do ISO titanium fasteners ship with an EN 10204 3.1 certificate as standard?',
		answer:
			'Yes, every batch ships with an EN 10204 3.1 material certificate as standard. Third-party verification by SGS or BV can be booked on your order, and the inspection scope is agreed in writing before production starts.',
	},
	{
		question: 'How do you control thread tolerance on ISO fasteners, such as 6g and 6H?',
		answer:
			'Standard stock is supplied in the tolerance class defined by the ISO standard itself, and non-standard classes are available on request. Every thread is gauged during production, so the class on your purchase order is the class on the certificate.',
	},
	{
		question: 'What is the delivery time for ISO standard orders, and which Incoterms do you quote?',
		answer:
			'In-stock standard items ship in 3 to 5 working days and made-to-order parts in 7 to 12 working days after drawing approval. We quote FOB, CIF and DDP, with EXW available on request. Air freight can be arranged for urgent call-off schedules.',
	},
];

/** ASTM / ASME 页 FAQ —— 首句直答，问题围绕材料规范与合规证据。 */
export const ASTM_FAQ: FaqItem[] = [
	{
		question: 'Which ASTM specifications cover titanium fasteners, and which cover the bar stock?',
		answer:
			'ASTM F468 and ASTM F593 are the finished-fastener specifications, while ASTM B348, ASTM F136 and AMS 4928 define the titanium bar, billet and forging that the parts are machined from. ASME B18 and B18.2 standards cover fastener dimensions, so they are quoted as the dimensional reference rather than as material certification.',
	},
	{
		question: 'Does every batch of ASTM titanium fasteners come with an EN 10204 3.1 certificate and third-party inspection?',
		answer:
			'Yes, every batch ships with an EN 10204 3.1 material certificate as standard. Third-party verification by SGS or BV can be booked on your order, and tensile and hardness test reports are attached to the same certificate set.',
	},
	{
		question: 'How do you verify that the bar stock matches the grade on the order?',
		answer:
			'Every lot is checked by positive material identification before machining, using XRF or OES spectrometry under AMS 2750 practice. The chemical results on the 3.1 certificate are the results of that lot, not a generic mill statement.',
	},
	{
		question: 'Can you supply Grade 5 bar and Grade 23 ELI under ASTM B348 and ASTM F136?',
		answer:
			'Yes, Grade 5, Grade 23 ELI and Grade 9 bar are supplied against the mill certificate for the confirmed lot, and Grade 7 is confirmed per order against the mill certificate. Each lot keeps its own heat number and certificate rather than being merged.',
	},
	{
		question: 'Can you hold ASME dimensions while certifying the part against ASTM material standards?',
		answer:
			'Yes, that is the usual combination on aerospace and defence work. The part is machined to the ASME dimensional standard while the material is certified to ASTM B348, ASTM F593 or the aerospace mill specification named on the order, and the certificate states both.',
	},
];
