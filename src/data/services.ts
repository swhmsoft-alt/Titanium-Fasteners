/**
 * services.ts — `/services/` 主干页面的**唯一数据源**。
 *
 * WHY THIS FILE WAS REWRITTEN
 * ---------------------------
 * 本文件此前是参考站（Bossard）的 1:1 照抄：SEO title 带 `Bossard Group`，
 * hero / smartFactory / engineering / benefits / blueprint 全部指向参考站的
 * Smart Factory 与 Engineering 叙事，并引用 TCO、设计验证等本站没有的物证。
 * 菜单（src/config/site.ts → NAVIGATION → Services）早已换成我方供给侧能力，
 * 但页面本身还停在参考站口径 —— 两者完全脱节。本轮把页面拉回菜单口径。
 *
 * CONTENT RULES (硬约束)
 * ----------------------
 * 1. 文案只允许由两处既有事实派生：
 *      · src/data/about-us.ts（9 条工厂背书条目的 body / facts）
 *      · src/data/services-sub/capabilities.ts（9 个能力页的 lead / PAGE_BODIES）
 *    不写通用科普；不写未提供的实测值（摩擦系数、扭矩、咬死试验一律不出现）。
 * 2. 尺寸口径 M1.6–M36（M1–M1.5 按定制）；响应时效 12 business hours。
 * 3. 合规按三层写：材料层 ASTM B348 / 成品层 ASTM F467–F468 / 文件层 EN 10204 3.1。
 * 4. 菜单九个子分类**全覆盖、零重复**，href 与 src/config/site.ts 同一份字符串。
 * 5. 每张图都必须是 public/images/ 下**真实存在**的文件；暂无实拍图时用 image: null，
 *    由组件降级为纯文本栏 —— 绝不产出 404，也绝不编造文件名。
 */

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

/** 主题内的一条「能力卡片」——图标 + 标题 + 说明 + 落到真实子页的链接。 */
export interface ServicePoint {
	/** 小标签（如 'Capability 01'）。 */
	label: string;
	heading: string;
	body: string;
	/** 真实可达的子页路径。 */
	href: string;
	/** public/images/ 下真实存在的图标路径；缺省则不渲染图标。 */
	icon?: string;
}

/** 主题内的主图。image 为 null 时组件降级为纯文本栏。 */
export interface ServiceThemeImage {
	src: string;
	alt: string;
}

export interface ServiceTheme {
	/** 主题 id（用于锚点与 key）。 */
	id: string;
	eyebrow: string;
	heading: string;
	lead: string;
	/** 2–3 段说明，每段必须含一个可落到物证的事实。 */
	body: string[];
	image: ServiceThemeImage | null;
	/** true = 右图左文；false = 左图右文。 */
	reverse: boolean;
	points: ServicePoint[];
	/** 可选的事实表（渲染为 label / value 两列表）。 */
	facts?: { label: string; value: string }[];
}

/** Who / How / Why 透明度声明。 */
export interface ServiceTransparency {
	heading: string;
	items: { label: string; heading: string; body: string }[];
}

export interface ServiceCta {
	heading: string;
	body: string;
	label: string;
	href: string;
}

/* ────────────────────────────────────────────────────────────────────────
 * 旧组件的类型契约（ServiceGrid.astro / BenefitsGrid.astro 仍 import 它们）
 * 这两个组件在本轮之后不再被 /services/ 引用，但文件保留、契约保留，
 * 避免影响其它页面或类型检查。
 * ──────────────────────────────────────────────────────────────────────── */
export interface ServiceCard {
	href: string;
	image: string;
	imageAlt: string;
	imageWidth: number;
	imageHeight: number;
	ratio: string;
	span: 'wide' | 'narrow';
	heading: string;
	body: string;
}

export interface Benefit {
	href: string;
	icon: string;
	iconAlt: string;
	label: string;
	heading: string;
	description: string;
}

/* ── 菜单九个子分类的**唯一**路径表 ────────────────────────────────────
 * 与 src/config/site.ts → NAVIGATION → Services.children 逐字一致。
 * 页面、导航、页脚三处指向同一批路由，改一处不会漏另一处。
 * ──────────────────────────────────────────────────────────────────────── */
const CAPABILITY_PATHS = {
	standards: '/services/manufacturing-capabilities/production-per-international-standards/',
	cnc: '/services/manufacturing-capabilities/cnc-machining-to-customer-drawings/',
	forging: '/services/manufacturing-capabilities/cold-heading-hot-forging/',
	finishing: '/services/manufacturing-capabilities/surface-finishing-color-coding/',
	mtc: '/services/compliance-packaging/en-10204-31-mtc-traceability/',
	pmi: '/services/compliance-packaging/pmi-xrf-grade-verification/',
	packaging: '/services/compliance-packaging/distributor-labeling-packaging/',
	blanket: '/services/order-fulfillment/blanket-orders-scheduled-delivery/',
	prototyping: '/services/order-fulfillment/fast-prototyping-low-moq/',
} as const;

/** 页面内可用的真实路由（全部由 src/pages/** 生成，无一捏造）。 */
const PATHS = {
	contact: '/contact/',
	aboutFactory: '/about-us/factory/',
	aboutQuality: '/about-us/quality/',
	aboutService: '/about-us/service/',
	aboutCnc: '/about-us/factory/cnc-machining-and-special-parts/',
	aboutInspection: '/about-us/quality/inspection-and-test-reports/',
	aboutLeadTimes: '/about-us/service/lead-times-and-logistics/',
	aboutMtc: '/about-us/quality/material-traceability-and-mtc/',
	aboutPackaging: '/about-us/service/packaging-and-private-label/',
	aboutTechnical: '/about-us/service/technical-support-and-consultation/',
	products: '/products/',
	gradeMatrix: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
	nda: '/knowledge-hub/ip-protection/nda-ip-protection-policy/',
} as const;

/** 四大主题主图 —— 全部为自产图，位于 public/images/public-images/（真实存在）。 */
const IMG = {
	shopFloor: '/images/public-images/services-capabilities-titanium-fastener-production.webp',
	drawingReview:
		'/images/public-images/services-capabilities-titanium-fastener-production.webp',
	cncPart: '/images/public-images/services-processing-cnc-machined-titanium-parts.webp',
	cncPlate: '/images/public-images/services-processing-cnc-machined-titanium-parts.webp',
	coatings:
		'/images/public-images/services-fulfillment-titanium-fastener-packaging.webp',
	packagingBox:
		'/images/public-images/services-fulfillment-titanium-fastener-packaging.webp',
	testLab: '/images/public-images/services-quality-titanium-inspection.webp',
	coatingIcon: '/images/fastener-coatings/07-surface-finishing-icon.webp',
	finishIcon: '/images/fastener-coatings/06-fastener-finish-icon.webp',
	inspectionIcon: '/images/innovations/16-inspection-of-a-screw.svg',
	logisticsIcon: '/images/innovations/18-global-logistic-icon.svg',
	qualityIcon: '/images/16-high-quality.svg',
	leanIcon: '/images/14-lean-process.svg',
	benefitIcon: '/images/10-your-benefit.svg',
	reliabilityIcon: '/images/18-maximum-reliability.svg',
	transparencyIcon: '/images/services/06-transparency-in-process-icon.svg',
	solutionIcon: '/images/services/09-solution-icon.svg',
	acceleratorIcon: '/images/services/05-leadership-accelerator-icon.svg',
} as const;

export const SERVICES = {
	seo: {
		title: 'Titanium Fastener Services — Manufacturing, Compliance & Fulfillment',
		description:
			'Titanium fastener services from a source factory: production to DIN, ISO and ASTM, CNC machining to your drawings, EN 10204 3.1 certification, PMI/XRF grade verification and scheduled delivery.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Services' },
		] as BreadcrumbItem[],
		eyebrow: 'Titanium Fastener Services',
		heading: 'Services',
		lead:
			'We manufacture titanium fasteners in-house — from wire drawing and cold forming through to machining, heat treatment and surface finishing. This page sets out what we make, how each lot is evidenced, and how the parts reach you.',
	},
	/** Hero 之后的一段定位声明。 */
	intro:
		'Boze Metal supplies titanium fasteners to buyers who specify the grade, the certificate and the delivery date. The four sections below are organised the way those decisions are made: what we can make, how it is made, how it is delivered, and how each batch is checked before it is packed.',
	themes: [
		{
			id: 'capabilities',
			eyebrow: 'Comprehensive Service Capabilities',
			heading: 'From certified titanium stock to a labelled, packaged part',
			lead:
				'One supplier for the whole route — standard production, custom machining, finishing, certification and packaging, held inside a single factory.',
			body: [
				'All forming and finishing steps run in our own workshops, so a drawing change does not have to travel between suppliers. Material arrives as certified titanium stock and leaves as finished, labelled, packaged parts.',
				'Production is organised by grade and by process rather than by product family: wire is drawn to the diameter the part needs, formed on cold headers, then machined where the tolerance requires it. Heat treatment and pickling are performed as specified per lot.',
				'Our standing size range is M1.6–M36, with M1–M1.5 made to order. Material scope covers commercially pure Grade 2 and Grade 5, with Grade 7 and Grade 12 on request.',
			],
			image: {
				src: IMG.shopFloor,
				alt: 'Titanium hex bolts, hex nuts, flat washers and a threaded stud arranged on a white background.',
			},
			reverse: false,
			points: [
				{
					label: 'Capability 01',
					heading: 'Production per International Standards',
					body:
						'Volume production of standard fasteners built to DIN, ISO and ASTM specifications, with a documented route for every lot we ship.',
					href: CAPABILITY_PATHS.standards,
					icon: IMG.benefitIcon,
				},
				{
					label: 'Factory',
					heading: 'Manufacturing Facility',
					body:
						'Where the parts are made: forming, machining and finishing run in-house, so a drawing change does not have to travel between suppliers.',
					href: PATHS.aboutFactory,
					icon: IMG.transparencyIcon,
				},
				{
					label: 'Engineering',
					heading: 'Technical Support',
					body:
						'Grade selection against the working medium, corrosion behaviour, DIN / ISO / ASTM / ASME cross-reference and drawing review before an order is placed.',
					href: PATHS.aboutTechnical,
					icon: IMG.acceleratorIcon,
				},
			],
			facts: [
				{ label: 'Processes in-house', value: 'Cold forming, CNC turning, thread rolling, heat treatment, pickling, anodising' },
				{ label: 'Material scope', value: 'Commercially pure Grade 2 and Grade 5, Grade 7 and Grade 12 on request' },
				{ label: 'Size range', value: 'M1.6–M36 as the standing range; M1–M1.5 made to order' },
				{ label: 'Output', value: 'Batch to series production, with lot sizes agreed per programme' },
			],
		},
		{
			id: 'processing',
			eyebrow: 'Manufacturing & Processing Capabilities',
			heading: 'The process route follows the geometry and the tolerance',
			lead:
				'The route a part takes depends on its geometry and its tolerance. We pick the process per part, not per catalogue.',
			body: [
				'Not every fastener is a catalogue item. Where a part is defined by a drawing, we machine it: turned, milled and threaded from bar stock or from a billet cut to the drawing, with the process route chosen per geometry and per material.',
				'Cold heading and hot forging routes are selected the same way, so each part is given the mechanical properties its material is meant to deliver. Heat treatment and pickling follow as specified per lot.',
				'Drawings are accepted in STEP, IGES, DXF or PDF with tolerances marked. A sample or small batch is approved as a first article before series production is released against it.',
			],
			image: {
				src: IMG.cncPart,
				alt: 'CNC-machined titanium special parts — a turned threaded cylinder, a drilled and tapped plate and a bracket — on a white background.',
			},
			reverse: true,
			points: [
				{
					label: 'Capability 02',
					heading: 'CNC Machining to Customer Drawings',
					body:
						'Custom-machined and special-thread fasteners produced to your drawings, from sample quantities through to series production.',
					href: CAPABILITY_PATHS.cnc,
					icon: IMG.solutionIcon,
				},
				{
					label: 'Capability 03',
					heading: 'Cold Heading & Hot Forging',
					body:
						'Cold heading and hot forging routes selected per part geometry, giving each part the mechanical properties its material is meant to deliver.',
					href: CAPABILITY_PATHS.forging,
					icon: IMG.leanIcon,
				},
				{
					label: 'Capability 04',
					heading: 'Surface Finishing & Color Coding',
					body:
						'Pickling, passivation and industrial anodised colour coding applied so grades stay distinguishable on the shop floor and in transit.',
					href: CAPABILITY_PATHS.finishing,
					icon: IMG.coatingIcon,
				},
				{
					label: 'First Article',
					heading: 'CNC Machining & Special Parts',
					body:
						'Special thread forms, reduced shanks, thin-wall parts and long studs go through the same controlled route as standard parts: drawing review, material selection, first article, then production against the approved sample.',
					href: PATHS.aboutCnc,
					icon: IMG.finishIcon,
				},
			],
			facts: [
				{ label: 'Input', value: 'Drawings in STEP, IGES, DXF or PDF with tolerances marked' },
				{ label: 'First article', value: 'Sample or small batch approved before series release' },
				{ label: 'Special features', value: 'Special thread forms, reduced shanks, thin walls, long studs' },
				{ label: 'Documentation', value: 'Inspection report per lot, material certificate on request' },
			],
		},
		{
			id: 'fulfillment',
			eyebrow: 'Fulfillment & Delivery Capabilities',
			heading: 'A delivery date is a production commitment, not a guess',
			lead:
				'Framework orders, fast-turn samples and distributor packaging, handled against one agreed schedule.',
			body: [
				'Framework agreements are handled as call-off and staged shipment schedules, so one agreed schedule covers your production plan. Where a programme needs staged deliveries, the staging is agreed up front rather than requested late.',
				'Samples and development runs move quickly, and minimum quantities are agreed per programme for both catalogue items and bespoke parts. A first article is approved before series production is released against it.',
				'Parts arrive in the packaging your warehouse expects: your label, your barcode, your carton format. Export packing adds the moisture protection and container type the shipping route requires.',
			],
			image: {
				src: IMG.packagingBox,
				alt: 'Export packaging for titanium fasteners — a labelled carton, a sealed bag of titanium nuts and bolts and a second closed carton, on a white background.',
			},
			reverse: false,
			points: [
				{
					label: 'Capability 07',
					heading: 'Blanket Orders & Scheduled Delivery',
					body:
						'Framework agreements with scheduled call-offs and staged deliveries, so one agreed schedule covers your production plan.',
					href: CAPABILITY_PATHS.blanket,
					icon: IMG.logisticsIcon,
				},
				{
					label: 'Capability 08',
					heading: 'Fast Prototyping & Low MOQ',
					body:
						'Fast-turn samples and development runs, with low minimum order quantities for both catalogue items and bespoke parts.',
					href: CAPABILITY_PATHS.prototyping,
					icon: IMG.acceleratorIcon,
				},
				{
					label: 'Capability 09',
					heading: 'Distributor Labeling & Packaging',
					body:
						'OEM labelling, barcode management and protected export packaging for distributor programmes.',
					href: CAPABILITY_PATHS.packaging,
					icon: IMG.coatings,
				},
				{
					label: 'Logistics',
					heading: 'Lead Times & Logistics',
					body:
						'Production slot reserved and confirmed on order acceptance; call-off and staged shipment schedules for framework orders; EXW, FOB, CIF and DAP on request.',
					href: PATHS.aboutLeadTimes,
					icon: IMG.qualityIcon,
				},
			],
			facts: [
				{ label: 'Scheduling', value: 'Production slot reserved and confirmed on order acceptance' },
				{ label: 'Staged delivery', value: 'Call-off and staged shipment schedules for framework orders' },
				{ label: 'Incoterms', value: 'EXW, FOB, CIF and DAP on request' },
				{ label: 'Shipment documents', value: 'Commercial invoice, packing list and certificate set per shipment' },
			],
		},
		{
			id: 'quality',
			eyebrow: 'Quality Inspection & Assurance',
			heading: 'The certificate describes the material; the check verifies the part',
			lead:
				'One certificate per lot, one inspection report per lot, and a spectrometer reading on every part before it is packed.',
			body: [
				'An EN 10204 3.1 certificate states the chemical composition and mechanical properties of the actual heat the material was taken from, and carries the heat number that links the certificate to the lot in your delivery. Type 3.1 is the standing configuration; third-party witnessing is arranged per order.',
				'Every part is re-checked by spectrometer before it leaves the workshop, and the reading is compared against the grade named on the certificate for the lot. Grades are segregated in storage and in process, tools and baskets are colour-coded by grade, and a changeover between grades requires a documented clean and identification check.',
				'Dimensions, thread fit and surface condition are checked and documented per lot, so incoming inspection is a confirmation rather than an investigation. A non-conforming lot is segregated and is not shipped.',
			],
			image: {
				src: IMG.testLab,
				alt: 'Quality inspection of titanium fasteners — a hex bolt beside a digital micrometer, a nut beside a vernier caliper and a titanium coupon beside a spectrometer probe, on a white background.',
			},
			reverse: true,
			points: [
				{
					label: 'Capability 05',
					heading: 'EN 10204 3.1 MTC & Traceability',
					body:
						'EN 10204 3.1 material certificates tied to the heat number of every lot, so the material can be traced back to the mill.',
					href: CAPABILITY_PATHS.mtc,
					icon: IMG.reliabilityIcon,
				},
				{
					label: 'Capability 06',
					heading: '100% PMI / XRF Grade Verification',
					body:
						'Every part is screened by spectrometer before dispatch, so the grade named on the certificate is the grade that arrives.',
					href: CAPABILITY_PATHS.pmi,
					icon: IMG.inspectionIcon,
				},
				{
					label: 'Reports',
					heading: 'Inspection & Test Reports',
					body:
						'Per-lot dimensional inspection, thread fit checks and documented test reports, with report templates set up per drawing on request.',
					href: PATHS.aboutInspection,
					icon: IMG.qualityIcon,
				},
				{
					label: 'Confidentiality',
					heading: 'NDA & IP Policy',
					body:
						'Where a drawing is needed to quote, it is covered by a confidentiality agreement signed before the file is opened.',
					href: PATHS.nda,
					icon: IMG.transparencyIcon,
				},
			],
			facts: [
				{ label: 'Certificate type', value: 'EN 10204 3.1 as standard; third-party witnessing on request' },
				{ label: 'Granularity', value: 'One certificate per lot, referenced by heat number' },
				{ label: 'Verification', value: 'XRF / PMI spectrometry on every part before packing' },
				{ label: 'Coverage', value: '100% of the batch, not a sample check' },
				{ label: 'Checked per lot', value: 'Critical dimensions, thread fit, surface condition' },
				{ label: 'Non-conformance', value: 'Segregated lot, not shipped; replacement or credit per agreement' },
			],
		},
	],
	/**
	 * Who / How / Why —— 透明度声明。
	 *
	 * 放在质检模块之后、CTA 之前：证据讲完，紧接着交代是谁写的、怎么做的、
	 * 为什么写这页。纯静态可读（不用 <details> 折叠），采购商不必点击。
	 */
	transparency: {
		heading: 'Who Writes This, How We Work, and Why We Publish It',
		items: [
			{
				label: 'Who',
				heading: 'Who produces and reviews this page',
				body:
					'This page is written and reviewed by the Boze Metal production and quality team: process and material statements by the engineering and production leads, certificate and inspection statements by the quality lead. It describes our own workshops and the documents we issue — no third-party material is quoted.',
			},
			{
				label: 'How',
				heading: 'How the parts are produced and inspected',
				body:
					'Parts are made to international standards — DIN, ISO, ASTM and ASME — with the heat number carried through every production and finishing step. Material compliance is handled at three levels: material to ASTM B348, finished product to ASTM F467 / F468, and documentation to EN 10204 3.1. Every batch is verified by PMI / XRF before packing, and packing and labelling are executed against an agreed works instruction.',
			},
			{
				label: 'Why',
				heading: 'Why we publish this page',
				body:
					'So a buyer can assess a titanium supply chain before a drawing changes hands: whether the process, the certification and the delivery route are actually in place, rather than finding out after the first batch. Where a figure depends on your drawing or your service medium, we say so and confirm it against the file in front of us instead of quoting a generic table.',
			},
		],
	},
	/** 页尾转化块。CTA 指向已存在的 /contact/ 路由。 */
	cta: {
		heading: 'Request a quote',
		body:
			'Send us the size, material grade and quantity you need. Our engineering team replies with a quotation and the material certificates within 12 business hours. Drawings are covered by a confidentiality agreement signed before the file is opened.',
		label: 'Request a quotation',
		href: PATHS.contact,
	},
	/** 页尾的次级出口 —— 全部是已存在的真实路由。 */
	secondaryLinks: [
		{ label: 'Product catalogue', href: PATHS.products },
		{ label: 'Titanium grade supply matrix', href: PATHS.gradeMatrix },
		{ label: 'Factory & production', href: PATHS.aboutFactory },
		{ label: 'Quality & compliance', href: PATHS.aboutQuality },
		{ label: 'Supply & service', href: PATHS.aboutService },
	],
} as const;
