/**
 * src/data/contact.ts — /contact/ 落地页的唯一文案真相源。
 *
 * WHY A DATA MODULE
 * -----------------
 * /contact/ 是「工程 + 商务」双轨对接页：左侧表单服务工程师（怕泄密、怕公差失控），
 * 右侧邮件通道服务采购经理（怕中间商、怕缺证、怕沟通繁琐）。两轨的每句英文微文案
 * 都对应一个具体顾虑，因此统一收口在这里：
 *   · 改文案 = 改一个文件，不散落在 .astro / .tsx 里；
 *   · 页面组件保持「无内容」，布局与文案分离；
 *   · 所有内部链接一律指向**已建页**的真实路由（不捏造路径）。
 *
 * 手写文件（非生成产物），可自由编辑。
 *
 * 第二版口径（本轮按新规格覆盖第一版文案）：
 *   · 规格区间 M1.6–M36 —— 全站统一口径（M1–M1.5 按定制）
 *   · 响应时效 12 business hours —— 新规格口径
 *   · 邮箱统一 INQUIRY.fallbackEmail（已切为 info@bozemetal.com），改邮箱只改
 *     src/config/site.ts 一行；body 里的 {email} 占位符由组件在构建期替换，
 *     避免文案与配置两处各写一个邮箱而漂移。
 *   · 合规按「材料层 / 成品层 / 文件层」三层写，避免标准层级混用
 *   · 红线：不提供任何实测数据（扭矩 K 系数、咬死/滞塞试验、摩擦系数实验等），
 *     本页只承诺工艺能力、材料证明与交付流程。
 */

/** 左侧表单的快捷意图标签（单选胶囊，免打字）。 */
export interface ContactIntent {
	/** 提交给 webhook 的取值。 */
	id: string;
	/** 胶囊按钮文案。 */
	label: string;
	/** 胶囊内的补充说明（同时用作无障碍描述）。 */
	hint: string;
	/** 是否为默认推荐项。 */
	recommended?: boolean;
}

/** 右侧「定心丸」条目。 */
export interface ContactValueProp {
	/** 图标键 —— 映射到 ContactValueProps.astro 内的内联 SVG。 */
	icon: 'shield' | 'trace' | 'package' | 'clock';
	title: string;
	body: string;
	/** 站内真实路由（可选）—— 没有就不渲染链接。 */
	href?: string;
	linkLabel?: string;
}

/** 底部对接流程的四个步骤。 */
export interface ContactStep {
	step: string;
	title: string;
	body: string;
}

export const CONTACT_INTENTS: ContactIntent[] = [
	{
		id: 'nda-first',
		label: 'Request Mutual NDA First',
		hint: 'Receive our countersigned Mutual NDA before any file or BOM transfer.',
		recommended: true,
	},
	{
		id: 'standard-quote',
		label: 'Standard Fastener Quote (DIN/ISO)',
		hint: 'DIN & ISO catalogue parts, Grade 2 or Grade 5 (Ti-6Al-4V), M1.6–M36.',
	},
	{
		id: 'print-to-part-dfm',
		label: 'Custom Print-to-Part DFM Review',
		hint: '2D / 3D prints, tolerances and surface finish — manufacturability feedback.',
	},
];

/**
 * 右侧 4 条「定心丸」。
 *
 * 顺序刻意为：工程师痛点 → 采购痛点 → 分销痛点 → 响应承诺。
 * 前三条各带一条站内真实路由链接（合规文件 / NDA 政策），让买家能自助取证。
 */
export const CONTACT_VALUE_PROPS: ContactValueProp[] = [
	{
		icon: 'shield',
		title: 'Strict IP Protection & DFM Support',
		body: 'We execute a binding Mutual NDA before reviewing your 2D/3D prints. Our engineers provide manufacturability (DFM) feedback tailored to Grade 2 & Grade 5 titanium.',
		href: '/knowledge-hub/ip-protection/nda-ip-protection-policy/',
		linkLabel: 'Read our NDA & IP protection policy',
	},
	{
		icon: 'trace',
		title: '100% Mill-to-Part Traceability (EN 10204 3.1)',
		body: 'Direct manufacturing per DIN & ISO standards (M1.6–M36). Every shipment includes full chemical & mechanical MTRs compliant with ASTM/AMS specs.',
		href: '/services/compliance-packaging/en-10204-31-mtc-traceability/',
		linkLabel: 'EN 10204 3.1 MTC & traceability',
	},
	{
		icon: 'package',
		title: 'Distributor-Ready Packaging & Marking',
		body: 'Custom laser marking (grade & lot number), anti-galling protective packaging, and private-label barcoding ready for warehouse intake.',
		href: '/services/compliance-packaging/distributor-labeling-packaging/',
		linkLabel: 'Distributor labelling & packaging',
	},
	{
		icon: 'clock',
		title: '12-Hour Engineering Response',
		body: 'Direct technical sales review—no automated bot runarounds. Accurate lead times and tiered volume pricing.',
	},
];

export const CONTACT_STEPS: ContactStep[] = [
	{
		step: 'Step 1',
		title: 'Zero-Risk Contact',
		body: 'Submit a brief inquiry via form or email (info@bozemetal.com) without exposing sensitive drawings.',
	},
	{
		step: 'Step 2',
		title: 'Mutual NDA Execution',
		body: 'Receive our countersigned Mutual NDA in your inbox within 12 business hours.',
	},
	{
		step: 'Step 3',
		title: 'Secure BOM / Print Review',
		body: 'Reply with your BOM or STEP/PDF prints for DFM assessment and tiered quoting.',
	},
	{
		step: 'Step 4',
		title: 'Production & 3.1 MTR',
		body: 'Precision CNC/cold-heading production delivered with EN 10204 3.1 certification.',
	},
];

export const CONTACT = {
	seo: {
		title: 'Contact & RFQ Desk',
		description:
			'Direct factory RFQ desk for titanium fasteners — DIN/ISO M1.6–M36 standard parts and custom print-to-part. Mutual NDA before file transfer, EN 10204 3.1 certification as standard, 12-hour engineering response.',
	},
	hero: {
		eyebrow: 'Contact & RFQ Desk',
		heading: 'Direct Factory Engineering & RFQ Desk',
		lead: 'Discuss your titanium fastener specifications (DIN/ISO M1.6–M36) or custom print-to-part requirements. Protected by binding Mutual NDA protocols prior to file transfer.',
	},
	form: {
		intentsLabel: 'Inquiry Intent',
		textareaLabel: 'Project Brief & Key Specifications (No confidential files required yet)',
		textareaHint: 'Your brief only — no drawings or attachments are needed at this stage.',
		textareaPlaceholder:
			'Example: Looking for Grade 5 (Ti-6Al-4V) DIN 912 socket head cap screws, M8x30, Est. annual usage 50k pcs. Please send your countersigned Mutual NDA before we share the BOM.',
		emailLabel: 'Work Email *',
		emailHint: 'Use your company email for priority engineering review.',
		cta: 'Initiate Secure Inquiry & Request NDA',
		ctaNote:
			'Zero spam. A titanium process engineer will reply directly to your inbox within 12 business hours.',
		receiptTitle: 'Secure inquiry received',
		receiptBody:
			'Our engineering desk has your brief. A titanium process engineer will reply directly to your inbox within 12 business hours with your countersigned Mutual NDA and next steps.',
		receiptHint:
			'If you need to send drawings immediately or ensure instant delivery to our engineering inbox, click below to open your email client directly.',
		receiptMailtoLabel: 'Open Email Client with This Inquiry',
		resetLabel: 'Submit another inquiry',
	},
	email: {
		heading: 'Prefer Direct Email?',
		body: 'Send your inquiry or request our countersigned Mutual NDA directly at {email}. We accept large STEP/CAD and Excel BOM attachments via email once NDA is executed.',
		copyLabel: 'Copy Email',
		copiedLabel: 'Copied!',
		mailtoLabel: 'Open Email Client to Request NDA',
		mailtoSubject: 'NDA & RFQ Inquiry - Titanium Fasteners',
	},
} as const;
