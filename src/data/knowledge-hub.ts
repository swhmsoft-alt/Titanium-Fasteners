/**
 * src/data/knowledge-hub.ts — 《Knowledge Hub》面板与落地页的数据源。
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * 保密合规校准后，Knowledge Hub 面板整体替换为三列：
 *   ① Sourcing & Spec Tools            —— 规格捕获器（销售工件）
 *   ② Compliance & Quality Docs       —— 只有我们能出具的资产
 *   ③ IP Protection & Manufacturing Specs —— 保密承诺与工厂工艺边界
 *
 * 纪律（不可放宽）：
 *   · 面板里的每一条都指向**真实存在的页面**（路由由 build 校验，不捏造）；
 *   · 绝不出现客户私有设计、客户图纸、实测量产数据、扭矩/摩擦实测值；
 *   · 所有数值只能来自 @data/products（materials.csv）或公开国际标准。
 *
 * 面板条目与站点路由由同一份数据派生 —— 改这里，菜单与落地页同时变。
 */
import { FILTER_GROUPS, STANDARDS } from '@data/products';

export interface KnowledgeHubItem {
	/** 面板条目名（= 卡片标题）。 */
	name: string;
	/** 落点链接 —— 必须指向真实存在的页面。 */
	href: string;
	/** 一句话说明（落地页卡片用）。 */
	description: string;
	/**
	 * 下拉菜单里的短标签（单行用）—— 缺省时回落为 name。
	 *
	 * 为什么要与 name 分开：菜单列宽只有 ~400px，长标题必然折行，
	 * 而落地页卡片标题与页面 SEO 标题需要保留完整实体词。
	 * 两者分离 = 菜单锐利 + 落地页 SEO 权重不减。
	 */
	menuLabel?: string;
}

export interface KnowledgeHubGroup {
	/** kebab-case 唯一 id。 */
	slug: string;
	/** 列标题。 */
	heading: string;
	/** 列标题链接（= 该列代表的那个资产页）。 */
	headingHref: string;
	/** 列内条目。 */
	items: KnowledgeHubItem[];
	/**
	 * 下拉菜单里的短列标题（单行用）—— 缺省时回落为 heading。
	 * 用于让三列小标题宽度在视觉上平衡，同时不改动落地页的 H2。
	 */
	menuHeading?: string;
}

/**
 * 「DIN / ISO / ASTM 标准对照」深链用的标准集合。
 *
 * 取值范围 = 左侧筛选「Standard」维度的**真实可勾选项**（生成产物 FILTER_GROUPS），
 * 所以 ?standard= 不会静默失效；族上架后集合自动扩大，菜单不必改。
 */
export const CROSS_REFERENCE_STANDARD_IDS = (
	FILTER_GROUPS.find((g) => g.id === 'standard')?.options ?? []
)
	.map((o) => o.id)
	.filter((id) => {
		const s = STANDARDS.find((x) => x.id === id);
		return (
			id.startsWith('din-') ||
			id.startsWith('iso-') ||
			id.startsWith('astm-') ||
			id.startsWith('asme-') ||
			(s?.din ?? '') !== '' ||
			(s?.iso ?? '') !== ''
		);
	});

/** 标准对照深链 —— DIN 号、ISO 对应号、ASTM/ASME 规格一次性摊开。 */
export const crossReferenceHref = (): string =>
	CROSS_REFERENCE_STANDARD_IDS.length > 0
		? `/products/?standard=${CROSS_REFERENCE_STANDARD_IDS.join(',')}`
		: '/products/';

/** Knowledge Hub 面板的三列 —— 路由与文案由这一份派生。 */
export const KNOWLEDGE_HUB_GROUPS: KnowledgeHubGroup[] = [
	{
		slug: 'sourcing-spec-tools',
		heading: 'Sourcing & Spec Tools',
		headingHref: '/products/',
		items: [
			{
				name: 'Spec Configurator & RFQ Builder',
				href: '/products/',
				description:
					'Pick standard, grade and size, then turn the selection into a specification sheet and carry it straight into an inquiry.',
			},
			{
				name: 'DIN / ISO / ASTM Standard Cross-Reference',
				menuLabel: 'DIN / ISO / ASTM Cross-Reference',
				href: crossReferenceHref(),
				description:
					'Objective international standard correspondence and a full size index, so a distributor can check a part number against the same table.',
			},
			{
				name: 'Steel-to-Titanium Weight Estimator',
				href: '/knowledge-hub/tools/steel-to-titanium-weight-estimator/',
				description:
					'Weight saving calculated from published nominal densities only — no measured torque, friction or test data of any kind.',
			},
		],
	},
	{
		slug: 'compliance-quality-docs',
		heading: 'Compliance & Quality Docs',
		headingHref: '/services/compliance-packaging/en-10204-31-mtc-traceability/',
		items: [
			{
				name: 'Blank / Internal Sample EN 10204 3.1 MTC',
				menuLabel: 'Sample EN 10204 3.1 MTC',
				href: '/services/compliance-packaging/en-10204-31-mtc-traceability/',
				description:
					'A blank or fully de-identified sample certificate — internal sampling only, with every customer reference removed.',
			},
			{
				name: 'PMI / XRF & Anti-Mixup Inspection Protocol',
				menuLabel: 'PMI / XRF Inspection Protocol',
				href: '/services/compliance-packaging/pmi-xrf-grade-verification/',
				description:
					'Outgoing spectrometer re-verification of grade, plus the segregation and identification rules that stop mixed material.',
			},
			{
				name: 'Titanium Grade Supply Matrix (Gr2 / Gr5 / Gr7)',
				menuLabel: 'Titanium Grade Matrix (Gr2–Gr7)',
				href: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
				description:
					'Which grades we hold and which we make to order, with the ASTM and DIN capability behind each one.',
			},
		],
	},
	{
		slug: 'ip-protection-manufacturing-specs',
		heading: 'IP Protection & Manufacturing Specs',
		menuHeading: 'Specs & IP Protection',
		headingHref: '/knowledge-hub/ip-protection/nda-ip-protection-policy/',
		items: [
			{
				name: 'Strict NDA & IP Protection Policy',
				menuLabel: 'NDA & IP Protection',
				href: '/knowledge-hub/ip-protection/nda-ip-protection-policy/',
				description:
					'A bilingual NDA with legal effect is signed before any drawing is opened. Drawings stay encrypted and segregated, and no customer design is ever shown.',
			},
			{
				name: 'CNC Tolerance & Threading Capabilities',
				menuLabel: 'CNC Tolerances & Threading',
				href: '/services/manufacturing-capabilities/cnc-machining-to-customer-drawings/',
				description:
					'Our own tolerance envelope and special-thread capability, illustrated with standard geometric samples only.',
			},
			{
				name: 'Neutral & OEM Packaging Specifications',
				menuLabel: 'Neutral & OEM Packaging Specs',
				href: '/knowledge-hub/packaging/neutral-oem-packaging-specs/',
				description:
					'The packing specification behind a delivery: what the neutral pack contains, what is marked on it, and the label data an OEM pack needs.',
			},
		],
	},
];

/* ───────────────────────────────────────────────────────────────────────────
   三个新建页面的正文 —— 与 about-us.ts 同构：数据层给 seed，页面只渲染。
   ─────────────────────────────────────────────────────────────────────────── */

export interface KnowledgeHubFact {
	label: string;
	value: string;
}

export interface KnowledgeHubPage {
	slug: string;
	/** 完整路径（含前导与尾斜杠）。 */
	path: string;
	seo: { title: string; description: string };
	hero: {
		breadcrumb: { label: string; href?: string }[];
		eyebrow: string;
		heading: string;
		lead: string;
	};
	body: string[];
	facts: KnowledgeHubFact[];
	/** 可选：规格对照表（参数型页面用；没有表格的页面省略）。 */
	specTable?: KnowledgeHubSpecTable;
}

/** 规格对照表 —— 行=属性，列=包装形态。 */
export interface KnowledgeHubSpecTable {
	heading: string;
	lead: string;
	columns: string[];
	rows: { attribute: string; values: string[] }[];
}

/** Knowledge Hub 落地页（/knowledge-hub/）。 */
export const KNOWLEDGE_HUB_LANDING = {
	seo: {
		title: 'Knowledge Hub',
		description:
			'Sourcing tools, compliance documents and manufacturing specifications for titanium ' +
			'fasteners — cross-reference tables, certificate samples, grade matrices and our ' +
			'own machining capability.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Knowledge Hub' },
		],
		eyebrow: 'Knowledge Hub',
		heading: 'Tools, Documents and Specifications for Titanium Fasteners',
		lead:
			'Everything we can put in front of a buyer without compromising a customer: ' +
			'specification tools, the compliance documents we issue ourselves, and the ' +
			'manufacturing limits of our own workshop.',
	},
	intro:
		'The three columns below are the whole hub. The first is what you use to specify a ' +
		'part. The second is the paperwork that ships with it. The third is the boundary of ' +
		'our own manufacturing and the confidentiality that protects yours.',
};

/** ① 减重估算器页 —— 只用公开密度，不含任何实测数据。 */
export const WEIGHT_ESTIMATOR_PAGE: KnowledgeHubPage = {
	slug: 'steel-to-titanium-weight-estimator',
	path: '/knowledge-hub/tools/steel-to-titanium-weight-estimator/',
	seo: {
		title: 'Steel-to-Titanium Weight Estimator',
		description:
			'Compare steel and titanium fastener weight using published nominal densities. ' +
			'An estimation tool only — no measured torque, friction or test results.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Knowledge Hub', href: '/knowledge-hub/' },
			{ label: 'Steel-to-Titanium Weight Estimator' },
		],
		eyebrow: 'Sourcing & Spec Tools',
		heading: 'Steel-to-Titanium Weight Estimator',
		lead:
			'Enter the grade, the diameter and the length to see what the same part weighs in ' +
			'steel and in titanium. The calculation uses published nominal densities only.',
	},
	body: [
		'Weight saving on a titanium fastener is a property of the material, not of a ' +
			'particular design. The tool below therefore takes only the three inputs that ' +
			'define the volume of a fastener shank — grade, nominal diameter and length — ' +
			'and applies the nominal densities published for those materials.',
		'The result is a shank-mass estimate. Heads, flanges, washers, thread roots and ' +
			'coating thickness are not modelled, so treat the number as a comparable figure ' +
			'rather than a weighed value. If you need a certified part weight, we weigh and ' +
			'record it during incoming inspection.',
		'What this tool deliberately does not do is predict torque, clamp force, friction ' +
			'coefficients or joint strength. Those depend on the actual surface condition, ' +
			'the lubricant and the tightening method, and they have to be established on the ' +
			'finished part. We do not publish estimated figures for them.',
	],
	facts: [
		{
			label: 'Calculation basis',
			value:
				'Nominal shank mass from published material densities. Head, thread and ' +
				'coating geometry are not modelled.',
		},
		{
			label: 'Reference steel',
			value: '7.85 g/cm³ — nominal density of carbon steel.',
		},
		{
			label: 'Titanium densities',
			value:
				'Taken from our own material data (Grade 2, 5, 9 and 23). Published ' +
				'nominal values, not measured lot values.',
		},
		{
			label: 'Not covered',
			value:
				'Torque, preload, friction, galvanic corrosion behaviour and joint ' +
				'strength are not estimated and not published.',
		},
	],
};

/** ② 牌号供应矩阵页。 */
export const GRADE_SUPPLY_MATRIX_PAGE: KnowledgeHubPage = {
	slug: 'titanium-grade-supply-matrix',
	path: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
	seo: {
		title: 'Titanium Grade Supply Matrix (Gr2 / Gr5 / Gr7)',
		description:
			'Which titanium grades we hold in stock, which we make to order, and the ASTM ' +
			'and DIN capability behind each grade.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Knowledge Hub', href: '/knowledge-hub/' },
			{ label: 'Titanium Grade Supply Matrix' },
		],
		eyebrow: 'Compliance & Quality Docs',
		heading: 'Titanium Grade Supply Matrix (Gr2 / Gr5 / Gr7)',
		lead:
			'The grades we hold, the grades we produce to order, and the standards each one ' +
			'is supplied against.',
	},
	body: [
		'Not every grade is a stock item. This matrix separates what we can ship from a ' +
			'bar stock programme from what we buy in for a specific order, so a buyer can ' +
			'plan a call-off schedule against the right grade.',
		'The property values shown are the published nominal values for the grade, taken ' +
			'from our own material data. The certificate that accompanies a shipment always ' +
			'states the values of the actual lot, together with its heat number.',
		'Grade 7 is confirmed per order. We do not present a stock position for it, and the ' +
			'figures normally quoted for it are indicative only — the values that count are ' +
			'the ones on the lot certificate.',
	],
	facts: [
		{
			label: 'Stock position',
			value:
				'Grade 2 and Grade 5 are held as standard. Grade 9 and Grade 23 are made to ' +
				'order against a confirmed specification.',
		},
		{
			label: 'Grade 7',
			value:
				'Confirmed per order against the mill certificate for the lot. We do not ' +
				'publish a stock position or indicative values for it.',
		},
		{
			label: 'Certification',
			value:
				'EN 10204 3.1 certificates per heat number, with grade re-verified by ' +
				'spectrometer before dispatch.',
		},
		{
			label: 'Standards',
			value:
				'ASTM B348 bar stock, ASTM F593 finished fasteners, ASTM F468 for ' +
				'Grade 5. European equivalents are listed in the cross-reference table.',
		},
	],
};

/** ③ NDA 与知识产权保护页。 */
export const NDA_IP_POLICY_PAGE: KnowledgeHubPage = {
	slug: 'nda-ip-protection-policy',
	path: '/knowledge-hub/ip-protection/nda-ip-protection-policy/',
	seo: {
		title: 'Strict NDA & IP Protection Policy',
		description:
			'Our confidentiality commitment: a bilingual NDA with legal effect is signed ' +
			'before any drawing is opened, drawings are encrypted and segregated, and no ' +
			'customer design is ever published.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Knowledge Hub', href: '/knowledge-hub/' },
			{ label: 'Strict NDA & IP Protection Policy' },
		],
		eyebrow: 'IP Protection & Manufacturing Specs',
		heading: 'Strict NDA & IP Protection Policy',
		lead:
			'Your drawing is your property. We sign a confidentiality agreement before we ' +
			'look at it, and we never publish it.',
	},
	body: [
		'We quote from drawings. That is the normal way to price a non-standard fastener, ' +
			'and it means the drawing comes to us. Our commitment is therefore set out in ' +
			'writing before the file is opened: a bilingual NDA with legal effect, signed ' +
			'by both parties, covering the drawing, the resulting part and the quotation.',
		'Drawings are held encrypted and segregated from other customers’ files. They are ' +
			'accessed only by the engineering and production staff working on your order, ' +
			'and they are returned or destroyed on your instruction.',
		'What we publish about ourselves is limited to our own capability. Any image on this ' +
			'site showing a machined part is a standard geometric sample made for ' +
			'photography. We do not publish customer drawings, customer parts, customer ' +
			'names or case studies that could identify a customer design.',
		'If you would rather not send a drawing at all, we can quote from a written ' +
			'specification — grade, standard, dimensions, quantity and any marking — and ' +
			'manufacture to that. Several of our standard ranges are quoted this way.',
	],
	facts: [
		{
			label: 'Before drawing review',
			value:
				'A bilingual NDA with legal effect is signed by both parties before any ' +
				'drawing is opened or reviewed.',
		},
		{
			label: 'Storage',
			value:
				'Drawings are stored encrypted and segregated, with access limited to staff ' +
				'working on your order. Returned or destroyed on instruction.',
		},
		{
			label: 'Publication',
			value:
				'No customer drawing, part, name or identifying case study is published ' +
				'on this site or in any marketing material.',
		},
		{
			label: 'Labelling',
			value:
				'Customer-specific labelling and packaging are executed only under the ' +
				'terms of a signed NDA.',
		},
	],
};

/** ④ 中性包装 / OEM 包装规格页 —— 参数型：写清楚「包装长什么样」，不承诺服务。 */
export const PACKAGING_SPECS_PAGE: KnowledgeHubPage = {
	slug: 'neutral-oem-packaging-specs',
	path: '/knowledge-hub/packaging/neutral-oem-packaging-specs/',
	seo: {
		title: 'Neutral & OEM Packaging Specifications',
		description:
			'The packing specification for titanium fastener deliveries: standard ' +
			'moisture-barrier packing, what is marked on the pack, the label data an ' +
			'OEM programme needs, and export protection.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Knowledge Hub', href: '/knowledge-hub/' },
			{ label: 'Neutral & OEM Packaging Specifications' },
		],
		eyebrow: 'Packaging Specifications',
		heading: 'Neutral & OEM Packaging Specifications',
		lead:
			'What arrives in the box: the standard pack we ship unmarked by default, ' +
			'the data an OEM label needs, and the export protection used on long routes.',
	},
	body: [
		'This page is the specification reference for packaging. It states what the ' +
			'standard pack contains, what is printed or applied on it, and what we need ' +
			'from you to produce an OEM pack. It describes the packing itself — how the ' +
			'labelling is executed as part of a distributor programme is set out on the ' +
			'packaging capability page.',
		'Standard packing is plain industrial packing. Parts are bagged or boxed in ' +
			'moisture-barrier material, and the pack is marked with our own ' +
			'identification, the grade, the quantity and the lot reference. No customer ' +
			'name, part number or artwork appears on a standard pack.',
		'An OEM pack replaces that neutral marking with the customer programme: your ' +
			'label, your barcodes and your carton marks. The label data we need are the ' +
			'customer item number, the barcode format and symbology, the carton ' +
			'configuration, and the packing list fields. The instruction is executed ' +
			'only under a signed confidentiality agreement.',
		'Export packing adds the shock and moisture protection the shipping route ' +
			'requires. The protection level is confirmed in writing before production ' +
			'starts, so the pack is made to the agreed standard rather than adapted ' +
			'afterwards.',
		'Every delivery leaves with the packing list for the lot and the certificate ' +
			'set that belongs to it. Lot reference on the pack, on the packing list and ' +
			'on the certificate is the same reference, which is what makes the shipment ' +
			'traceable back to the heat number.',
	],
	facts: [
		{
			label: 'Standard pack',
			value:
				'Parts bagged or boxed in moisture-barrier material, marked with our ' +
				'identification, grade, quantity and lot reference.',
		},
		{
			label: 'OEM marking',
			value:
				'Customer label, barcodes and carton marks, applied under a signed ' +
				'confidentiality agreement.',
		},
		{
			label: 'Label data required',
			value:
				'Customer item number, barcode symbology and format, carton ' +
				'configuration, and the packing list fields.',
		},
		{
			label: 'Export protection',
			value:
				'Shock and moisture protection matching the shipping route, confirmed ' +
				'in writing before production.',
		},
		{
			label: 'Documents in the delivery',
			value: 'Packing list for the lot plus the certificate set issued for it.',
		},
		{
			label: 'Traceability',
			value:
				'Lot reference on the pack, the packing list and the certificate is the ' +
				'same reference.',
		},
	],
	specTable: {
		heading: 'Packing specification by pack type',
		lead:
			'Three pack states. The programme you order decides which one applies to a ' +
			'lot, and the specification is fixed before production.',
		columns: ['Attribute', 'Standard pack', 'OEM pack', 'Export pack'],
		rows: [
			{
				attribute: 'Marking on the pack',
				values: [
					'Our identification, grade, quantity and lot reference',
					'Customer label, barcodes and carton marks',
					'As the pack it protects, plus route marking',
				],
			},
			{
				attribute: 'Material',
				values: [
					'Moisture-barrier bag or box',
					'Moisture-barrier bag or box',
					'Moisture-barrier pack inside an export carton',
				],
			},
			{
				attribute: 'Protection level',
				values: [
					'Moisture barrier',
					'Moisture barrier',
					'Shock and moisture protection for the shipping route',
				],
			},
			{
				attribute: 'Confidentiality',
				values: [
					'No customer data on the pack',
					'Executed under a signed NDA, same segregation as the drawing',
					'Same rule as the pack it protects',
				],
			},
			{
				attribute: 'Confirmed',
				values: [
					'At order acceptance',
					'In writing before production starts',
					'In writing before production starts',
				],
			},
			{
				attribute: 'Documents supplied',
				values: [
					'Packing list and the certificate set for the lot',
					'Packing list and the certificate set for the lot',
					'Packing list and the certificate set for the lot',
				],
			},
		],
	},
};
