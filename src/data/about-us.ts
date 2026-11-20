/**
 * about-us.ts — About us 面板 + 9 个工厂背书详情页的**唯一数据源**。
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * 原 About us 面板是参考站（Careers / Who we are / News & Media …）的照抄，
 * 对一个钛紧固件外贸站没有说服力，也留着一批从未建页的死链。
 * 本轮把它换成**三列工厂背书菜单**：
 *   ① Factory & Production   ② Quality & Compliance   ③ Supply & Service
 * 每列 3 个条目 = 9 个子项，每个子项都落到一个真实可达的详情页
 * （/about-us/<group>/<slug>/），由 src/pages/about-us/ 的路由生成。
 *
 * SHAPE
 * -----
 * 与 services-sub/capabilities.ts 保持同一套思路（seed → 页面对象）：
 *   group / slug / name / heading / lead / description / body / facts
 * 页面模板与数据解耦：路由只负责取数据，渲染交给组件。
 *
 * BRANDING
 * --------
 * 只用自有品牌口径（Titanium Fasteners / Boze Metal），不出现参考公司名称；
 * 不写「世界级 / 最强 / 实测验证」这类无物证的形容词。
 */

export interface AboutUsFact {
	label: string;
	value: string;
}

export interface AboutUsItem {
	/** 所属列（= URL 的第一段）。 */
	group: string;
	/** 详情页 slug（= URL 的第二段）。 */
	slug: string;
	/** 菜单短标签（mega-menu 的 L3 链接文字）。 */
	name: string;
	/** 详情页 H1。 */
	heading: string;
	/** 详情页导语。 */
	lead: string;
	/** 详情页 meta description + 卡片摘要。 */
	description: string;
	/** 正文段落。 */
	body: string[];
	/** 关键事实（表格式条目，只写能落到物证的说法）。 */
	facts: AboutUsFact[];
}

export interface AboutUsGroup {
	slug: string;
	/** 菜单列标题。 */
	heading: string;
	/** 列说明（落地页该列的导语）。 */
	description: string;
	items: AboutUsItem[];
}

/* ── ① Factory & Production ─────────────────────────────────────────── */
const FACTORY_ITEMS: AboutUsItem[] = [
	{
		group: 'factory',
		slug: 'manufacturing-facility',
		name: 'Manufacturing Facility',
		heading: 'Manufacturing Facility',
		lead:
			'Titanium fastening is made in-house, from wire drawing and cold forming ' +
			'through to machining, heat treatment and surface finishing.',
		description:
			'In-house titanium fastening production: forming, machining, heat treatment and finishing under one roof.',
		body: [
			'All forming and finishing steps run in our own workshops, so a drawing change ' +
				'does not have to travel between suppliers. Material arrives as certified ' +
				'titanium stock and leaves as finished, labelled, packaged parts.',
			'Production is organised by grade and by process rather than by product family: ' +
				'wire is drawn to the diameter the part needs, formed on cold headers, then ' +
				'machined where the tolerance requires it. Heat treatment and pickling are ' +
				'performed as specified per lot.',
		],
		facts: [
			{ label: 'Processes in-house', value: 'Cold forming, CNC turning, thread rolling, heat treatment, pickling, anodising' },
			{ label: 'Material scope', value: 'Commercially pure Grade 2 and Grade 5, Grade 7 and Grade 12 on request' },
			{ label: 'Traceability', value: 'Heat number carried through every production and finishing step' },
			{ label: 'Output', value: 'Batch to series production, with lot sizes agreed per programme' },
		],
	},
	{
		group: 'factory',
		slug: 'production-capacity-and-equipment',
		name: 'Capacity & Equipment',
		heading: 'Production Capacity & Equipment',
		lead:
			'Equipment sized for long-tail titanium demand: the specifications that are ' +
			'hard to find are exactly the ones we are set up to run.',
		description:
			'Cold headers, CNC lathes and finishing lines sized for long-tail titanium specifications.',
		body: [
			'Our capacity is deliberately built around the long tail: uncommon diameters, ' +
				'fine pitches and small quantities are routine here rather than an exception ' +
				'that is declined.',
			'Because equipment is in-house, schedules are controlled by us. Capacity ' +
				'confirmations are given per drawing and per lot, together with the ' +
				'production route we intend to use.',
		],
		facts: [
			{ label: 'Forming', value: 'Cold headers for standard and special thread geometries' },
			{ label: 'Machining', value: 'CNC turning and milling for non-standard and customer drawings' },
			{ label: 'Thread rolling', value: 'Metric, unified and special pitches' },
			{ label: 'Finishing', value: 'Shot peening, pickling, passivation and industrial anodising' },
			{ label: 'Size range', value: 'M1.6–M36 as the standing range; M1–M1.5 made to order' },
		],
	},
	{
		group: 'factory',
		slug: 'cnc-machining-and-special-parts',
		name: 'CNC Machining & Special Parts',
		heading: 'CNC Machining & Special Parts',
		lead:
			'Parts that do not exist in a catalogue are made to your drawing — from ' +
			'samples through to series production.',
		description:
			'Custom-machined titanium parts and special-thread fasteners made to customer drawings.',
		body: [
			'Everything outside the catalogue goes through the same controlled route as ' +
				'standard parts: drawing review, material selection, a first article, and ' +
				'then production against the approved sample.',
			'Special threads, reduced shanks, thin-wall parts and long studs are typical ' +
				'requests. Where a drawing raises a manufacturability question, we raise it ' +
				'before the order is accepted rather than after the first batch.',
		],
		facts: [
			{ label: 'Input', value: 'Drawings in STEP, IGES, DXF or PDF with tolerances marked' },
			{ label: 'First article', value: 'Sample or small batch approved before series release' },
			{ label: 'Special features', value: 'Special thread forms, reduced shanks, thin walls, long studs' },
			{ label: 'Documentation', value: 'Inspection report per lot, material certificate on request' },
			{ label: 'Lead time', value: 'Samples fast; series production scheduled against the agreed plan' },
		],
	},
];

/* ── ② Quality & Compliance ─────────────────────────────────────────── */
const QUALITY_ITEMS: AboutUsItem[] = [
	{
		group: 'quality',
		slug: 'material-traceability-and-mtc',
		name: 'Material Traceability & MTC',
		heading: 'Material Traceability & MTC',
		lead:
			'Every lot leaves with a certificate that names the grade and the heat it ' +
			'came from, so the material can be traced back to the mill.',
		description:
			'EN 10204 3.1 material certificates tied to the heat number of every lot, traceable back to the mill.',
		body: [
			'Certificates are issued per lot and reference the heat number of the material ' +
				'used. The same heat number appears on the label of the delivered packaging, ' +
				'so incoming inspection at your plant is a check against paper rather than ' +
				'a guess.',
			'Type 3.1 certification is the standing configuration. Where a customer requires ' +
				'third-party witnessing, the certification route is arranged per order.',
		],
		facts: [
			{ label: 'Certificate type', value: 'EN 10204 3.1 as standard; third-party witnessing on request' },
			{ label: 'Granularity', value: 'One certificate per lot, referenced by heat number' },
			{ label: 'Labelling', value: 'Heat number and lot reference printed on the packaging label' },
			{ label: 'Retention', value: 'Production records retained per lot for re-issue on request' },
		],
	},
	{
		group: 'quality',
		slug: 'pmi-and-xrf-verification',
		name: 'PMI / XRF Verification',
		heading: 'PMI / XRF Grade Verification',
		lead:
			'Parts are screened by spectrometer before dispatch, so the grade named on ' +
			'the certificate is the grade that arrives.',
		description:
			'100% spectrometer screening of titanium parts before dispatch, so mixed-grade shipments do not reach the customer.',
		body: [
			'Certificates describe the material; verification checks the part. Every batch ' +
				'passes through positive material identification before it is packed, and ' +
				'results are recorded against the lot.',
			'This is what removes the most common doubt a buyer has about a titanium ' +
				'supply: whether the delivered batch really is the grade that was ordered.',
		],
		facts: [
			{ label: 'Method', value: 'XRF / PMI spectrometry on every part before packing' },
			{ label: 'Coverage', value: '100% of the batch, not a sample check' },
			{ label: 'Record', value: 'Verification result filed against the lot reference' },
			{ label: 'Alloy coverage', value: 'Commercially pure grades and Grade 5, 7 and 12' },
		],
	},
	{
		group: 'quality',
		slug: 'inspection-and-test-reports',
		name: 'Inspection & Test Reports',
		heading: 'Inspection & Test Reports',
		lead:
			'Dimensions, thread fit and surface condition are checked and documented per ' +
			'lot, so incoming inspection is a confirmation rather than an investigation.',
		description:
			'Per-lot dimensional inspection, thread fit checks and documented test reports for incoming inspection.',
		body: [
			'Inspection follows the drawing: critical dimensions, thread fit and surface ' +
				'condition are measured against the tolerance scheme that applies to the ' +
				'part, and the result is written up per lot.',
			'Where a customer requires a specific report format, a works instruction is ' +
				'set up for that part so subsequent lots are documented in the same way.',
		],
		facts: [
			{ label: 'Checked per lot', value: 'Critical dimensions, thread fit, surface condition' },
			{ label: 'Report', value: 'Inspection report issued per lot with the delivery' },
			{ label: 'Customer formats', value: 'Report templates set up per drawing on request' },
			{ label: 'Non-conformance', value: 'Segregated lot, not shipped; replacement or credit per agreement' },
		],
	},
];

/* ── ③ Supply & Service ─────────────────────────────────────────────── */
const SERVICE_ITEMS: AboutUsItem[] = [
	{
		group: 'service',
		slug: 'packaging-and-private-label',
		name: 'Packaging & Private Label',
		heading: 'Packaging & Private Label',
		lead:
			'Parts arrive in the packaging your warehouse expects: your label, your ' +
			'barcode, your carton format.',
		description:
			'OEM labelling, barcode management and protected export packaging to distributor requirements.',
		body: [
			'Packaging is agreed before the first shipment and then held as a works ' +
				'instruction, so the second pallet looks like the first one. Labels carry ' +
				'your part number, our lot reference and the heat number where traceability ' +
				'is required.',
			'Export packing is built for the route: metal containers, moisture protection ' +
				'and carton configurations that survive a full sea and inland leg.',
		],
		facts: [
			{ label: 'Labelling', value: 'Your part number, barcode and label layout' },
			{ label: 'Traceability label', value: 'Heat and lot reference printed where required' },
			{ label: 'Cartons', value: 'Carton quantity and format to your warehouse specification' },
			{ label: 'Export protection', value: 'Moisture barrier and metal containers for sea freight' },
			{ label: 'Documentation', value: 'Packing list and certificate set per shipment' },
		],
	},
	{
		group: 'service',
		slug: 'lead-times-and-logistics',
		name: 'Lead Times & Logistics',
		heading: 'Lead Times & Logistics',
		lead:
			'Delivery dates are planned against your schedule, with production slots ' +
			'and shipping milestones confirmed in writing.',
		description:
			'Planned production slots, staged deliveries and export logistics agreed against your schedule.',
		body: [
			'A delivery date is a production commitment, not a guess: the slot is reserved ' +
				'against the schedule and confirmed when the order is accepted. Where a ' +
				'programme needs staged deliveries, the staging is agreed up front.',
			'Logistics are handled either as customer-arranged freight against our ' +
				'consignment terms or as a complete export shipment with documents prepared ' +
				'for the destination.',
		],
		facts: [
			{ label: 'Scheduling', value: 'Production slot reserved and confirmed on order acceptance' },
			{ label: 'Staged delivery', value: 'Call-off and staged shipment schedules for framework orders' },
			{ label: 'Incoterms', value: 'EXW, FOB, CIF and DAP on request' },
			{ label: 'Shipment documents', value: 'Commercial invoice, packing list and certificate set per shipment' },
		],
	},
	{
		group: 'service',
		slug: 'technical-support-and-consultation',
		name: 'Technical Support',
		heading: 'Technical Support',
		lead:
			'Titanium is not a drop-in material. Our engineering support covers grade ' +
			'selection, corrosion behaviour and the drawing questions that decide a part.',
		description:
			'Engineering support on grade selection, corrosion behaviour, standards and drawing review for titanium fasteners.',
		body: [
			'Most titanium questions are not about the fastener itself but about the ' +
				'environment it sits in: chloride exposure, temperature, galvanic contact ' +
				'with other metals, and how the joint is assembled.',
			'We answer those questions with the alloy in mind — which grade fits which ' +
				'medium, where each grade has limits, and how a drawing should be written ' +
				'so the part can be made repeatably.',
		],
		facts: [
			{ label: 'Grade selection', value: 'Grade 2, 5, 7, 12 and 23 against the working medium' },
			{ label: 'Corrosion advice', value: 'Behaviour in chloride, reducing and oxidising service' },
			{ label: 'Standards', value: 'DIN, ISO, ASTM and ASME cross-reference for the specified part' },
			{ label: 'Drawing review', value: 'Feasibility feedback before an order is placed' },
			{ label: 'Response', value: 'Quotation and technical reply within 12 business hours' },
		],
	},
];

/* ── 列（菜单三列）定义 ─────────────────────────────────────────────── */
export const ABOUT_US_GROUPS: AboutUsGroup[] = [
	{
		slug: 'factory',
		heading: 'Factory & Production',
		description:
			'Where the parts are made: forming, machining and finishing run in-house, ' +
			'so a drawing change does not have to travel between suppliers.',
		items: FACTORY_ITEMS,
	},
	{
		slug: 'quality',
		heading: 'Quality & Compliance',
		description:
			'The evidence behind the material: per-lot certificates, spectrometer ' +
			'verification and documented inspection results.',
		items: QUALITY_ITEMS,
	},
	{
		slug: 'service',
		heading: 'Supply & Service',
		description:
			'How the parts reach you: your packaging, planned lead times and technical ' +
			'support for the alloy you are specifying.',
		items: SERVICE_ITEMS,
	},
];

/** 全部 9 个条目（扁平），路由与落地页共用这一份清单。 */
export const ABOUT_US_ITEMS: AboutUsItem[] = ABOUT_US_GROUPS.flatMap((g) => g.items);

/** 列标题查表（面包屑中间层用）。 */
export const ABOUT_US_GROUP_LABELS: Record<string, string> = Object.fromEntries(
	ABOUT_US_GROUPS.map((g) => [g.slug, g.heading]),
);

/** 条目详情页的路径 —— 路由模板与内链共用，避免两处各写一份。 */
export const aboutUsPath = (item: AboutUsItem): string => `/about-us/${item.group}/${item.slug}/`;

/** About us 落地页（/about-us/）的数据。 */
export const ABOUT_US_LANDING = {
	seo: {
		title: 'About us',
		description:
			'Titanium fastener manufacturing: in-house forming and machining, per-lot ' +
			'certificates and spectrometer verification, planned lead times and technical support.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'About us' },
		],
		eyebrow: 'About us',
		heading: 'Engineering-Grade Titanium Fasteners, Made to Your Drawing',
		lead:
			'We manufacture titanium fasteners for industrial buyers who need the grade, ' +
			'the certificate and the delivery date to be right — not just the part.',
	},
	intro:
		'Boze Metal works with buyers in chemical processing, marine, energy and ' +
		'industrial equipment, where titanium is specified for its corrosion behaviour ' +
		'and its strength-to-weight ratio. The three columns below set out how the parts ' +
		'are made, what evidence comes with them, and how they are delivered.',
};
