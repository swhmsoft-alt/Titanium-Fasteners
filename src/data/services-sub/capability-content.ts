/**
 * capability-content.ts — 9 个服务能力页的**正式内容**（非生成物，可手改）。
 *
 * WHY
 * ---
 * capabilities.ts 里的 9 个页面此前只有 PLACEHOLDER_BODY 占位说明。本文件提供
 * 每一页的完整内容：正文段落、1 张实拍图（4:3 锁定）、3 条加粗要点、事实表、
 * FAQ 与相关出口。组装逻辑在 capabilities.ts 的 buildPage() 里完成。
 *
 * CONTENT RULES（硬约束）
 * ----------------------
 * 1. 事实只允许来自三处既有来源，不臆造：
 *      · src/data/about-us.ts（工厂背书 9 条）
 *      · src/data/services.ts（能力模块 facts）
 *      · data/products/{standards,materials,finishes}.csv（生成产物）
 * 2. 不出现摩擦系数、扭矩系数、咬死实测值、未经确认的公差数值与交期承诺。
 * 3. 规格口径 M1.6–M36（M1–M1.5 按定制）；响应时效 12 business hours。
 * 4. 内链只允许落到 src/pages/** 真实路由（见 @data/product-solutions 的 PATHS）。
 * 5. 每张图必须是 public/images/ 下真实存在的文件，且每条图文带只放 1 张。
 */

/** 图文带要点 —— 加粗技术词 + 单行补充。 */
export interface CapabilityHighlight {
	label: string;
	text: string;
}

/** 事实表一行 —— label / value。 */
export interface CapabilityFact {
	label: string;
	value: string;
}

/** 页面配图（唯一一张，4:3 容器内 object-cover）。 */
export interface CapabilityImage {
	src: string;
	alt: string;
	width: number;
	height: number;
}

/** FAQ 一问一答。 */
export interface CapabilityFaq {
	question: string;
	answer: string;
}

/** 相关出口 —— 真实路由。 */
export interface CapabilityRelated {
	label: string;
	title: string;
	description: string;
	href: string;
}

/** 一个能力页的正文素材。 */
export interface CapabilityContent {
	/** 正文段落，2–4 段。 */
	body: string[];
	/** 图文带标题。 */
	bandHeading: string;
	/** 图文带导语，≤ 40 词。 */
	bandLead: string;
	/** 3 条要点。 */
	highlights: CapabilityHighlight[];
	/** 事实表（4–6 行）。 */
	facts: CapabilityFact[];
	/** 唯一配图。 */
	image: CapabilityImage;
	/** FAQ（2–4 条）。 */
	faq: CapabilityFaq[];
	/** 相关出口（3 条）。 */
	related: CapabilityRelated[];
}

export const CAPABILITY_CONTENT: Record<string, CapabilityContent> = {
	/* ── ① Manufacturing Capabilities ───────────────────────────────── */
	'production-per-international-standards': {
		body: [
			'Our catalogue fasteners are produced to international standards — DIN, ISO, ASTM and ASME — and every lot is released against the specification that named it. The grade, the standard and the finish are decided before the material is drawn, so the part that reaches you is the part that was ordered.',
			'Production is organised by grade and by process rather than by product family. Wire is drawn to the diameter the part needs, formed on cold headers, then machined where the tolerance requires it. Heat treatment and pickling are performed as specified per lot.',
			'Where a drawing exists instead of a catalogue number, the same discipline applies: the route is chosen per geometry and per material, and a sample or small batch is approved as a first article before series production is released against it.',
		],
		bandHeading: 'The route is chosen per geometry, not per catalogue',
		bandLead:
			'A standard fastener and a drawing-defined part take different routes through the workshop. Both end in the same place: a documented lot with its own certificate.',
		highlights: [
			{ label: 'Cold heading', text: 'wire drawn to diameter, formed and thread rolled in our own workshop' },
			{ label: 'Machining', text: 'CNC turning and milling applied only where the tolerance asks for it' },
			{ label: 'Finishing', text: 'heat treatment, pickling and passivation executed per lot as specified' },
		],
		facts: [
			{ label: 'Standards', value: 'DIN, ISO, ASTM and ASME, selected against the part' },
			{ label: 'Material level', value: 'ASTM B348 bar stock / billet' },
			{ label: 'Finished part level', value: 'ASTM F467 / F468' },
			{ label: 'Size range', value: 'M1.6–M36 as the standing range; M1–M1.5 made to order' },
			{ label: 'Grades', value: 'Grade 2, Grade 5 and Grade 9; Grade 23 on request' },
			{ label: 'Records', value: 'One production record per lot, released against the specification' },
		],
		image: {
			src: '/images/services/10-factory-layout-with-labeled-zones-workers-and-a-.webp',
			alt: 'Factory floor plan with labelled production zones, workers and material routes.',
			width: 1300,
			height: 731,
		},
		faq: [
			{
				question: 'Which standards do you produce to?',
				answer:
					'DIN, ISO, ASTM and ASME. The standard is chosen with you against the part you need, and it is named on the lot documentation so it can be checked against your own specification on arrival.',
			},
			{
				question: 'Do you produce special thread forms?',
				answer:
					'Where a drawing defines the thread, the form, the pitch or the length, we quote it as a machined part rather than as a catalogue item. Special thread forms, reduced shanks, thin walls and long studs are all normal work.',
			},
			{
				question: 'How are production records kept?',
				answer:
					'Per lot. The heat number is carried through forming, heat treatment, machining and finishing, and the inspection result is written up against the same lot reference before packing.',
			},
		],
		related: [
			{
				label: 'Compliance',
				title: 'EN 10204 3.1 MTC & Traceability',
				description: 'The certificate that ties a lot back to the heat it was cut from.',
				href: '/services/compliance-packaging/en-10204-31-mtc-traceability/',
			},
			{
				label: 'Manufacturing',
				title: 'CNC Machining to Customer Drawings',
				description: 'Parts defined by a drawing, machined and released per lot.',
				href: '/services/manufacturing-capabilities/cnc-machining-to-customer-drawings/',
			},
			{
				label: 'Catalogue',
				title: 'Titanium Fastener Catalogue',
				description: 'Standards, grades and finishes across M1.6–M36.',
				href: '/products/',
			},
		],
	},
	'cnc-machining-to-customer-drawings': {
		body: [
			'Not every fastener is a catalogue item. Where a part is defined by a drawing, we machine it: turned, milled and threaded from bar stock or from a billet cut to the drawing, with the process route chosen per geometry and per material.',
			'What we can state is our own envelope — the tolerance classes and thread forms our machines hold, and the special pitches and thread geometries we can cut and roll. The figures are confirmed against the drawing in front of us, not taken from a generic table.',
			'Illustrations of machined parts on this site are standard geometric samples made for photography. Customer drawings, customer parts and customer identities are not published. Where a drawing is needed to quote, it is covered by a confidentiality agreement signed before the file is opened.',
		],
		bandHeading: 'From drawing to released lot',
		bandLead:
			'A machined part is released the same way a catalogue part is: against a drawing, against a heat number and against an inspection record that belongs to the lot in your delivery.',
		highlights: [
			{ label: 'DFM review', text: 'feasibility feedback before an order is placed' },
			{ label: 'First article', text: 'sample or small batch approved before series release' },
			{ label: 'Special features', text: 'special thread forms, reduced shanks, thin walls, long studs' },
		],
		facts: [
			{ label: 'Drawing formats', value: 'STEP, IGES, DXF or PDF with tolerances marked' },
			{ label: 'Machines', value: 'CNC turning and milling, in our own workshop' },
			{ label: 'Material', value: 'Grade 2, Grade 5 and Grade 23 (ELI)' },
			{ label: 'Documentation', value: 'Inspection report per lot, material certificate on request' },
			{ label: 'Confidentiality', value: 'NDA signed before the drawing is opened' },
			{ label: 'Lead time', value: 'Samples fast; series production scheduled against the agreed plan' },
		],
		image: {
			src: '/images/special-parts-and-custom-fasteners/09-a-metal-special-part-base-plate-created-by-cnc-m.webp',
			alt: 'Metal base plate with milled features, produced by CNC machining to a drawing.',
			width: 928,
			height: 522,
		},
		faq: [
			{
				question: 'What do you need from us to start?',
				answer:
					'A drawing with the tolerances marked, in STEP, IGES, DXF or PDF, plus the material grade and the batch size you have in mind. Our engineering team replies with a quotation and feasibility feedback within 12 business hours.',
			},
			{
				question: 'Can you quote from a sketch or a description?',
				answer:
					'We can take a first look at an outline, but a quotation is confirmed against the drawing itself. Once the file is released under a signed NDA, the process route and the feasibility are checked against that geometry.',
			},
			{
				question: 'Do you keep my drawing confidential?',
				answer:
					'Yes. A confidentiality agreement is signed before the file is opened, and the drawing is handled under the same segregation rules as the material.',
			},
		],
		related: [
			{
				label: 'Manufacturing',
				title: 'Cold Heading & Hot Forging',
				description: 'The forming routes for parts that are not machined from stock.',
				href: '/services/manufacturing-capabilities/cold-heading-hot-forging/',
			},
			{
				label: 'Compliance',
				title: 'NDA & IP Policy',
				description: 'How your drawing and your part are protected.',
				href: '/knowledge-hub/ip-protection/nda-ip-protection-policy/',
			},
			{
				label: 'Order',
				title: 'Fast Prototyping & Low MOQ',
				description: 'Samples and development runs before series production.',
				href: '/services/order-fulfillment/fast-prototyping-low-moq/',
			},
		],
	},
	'cold-heading-hot-forging': {
		body: [
			'Fasteners are not all made the same way. A cold heading route takes drawn wire and forms it under pressure in a die, which suits the small, high-volume geometries that standard fasteners are built from. A hot forging route takes the part to a temperature where the material flows into the die, which is how larger sections and heavier geometries are produced.',
			'The route is selected per part, not per catalogue. Where the geometry can be formed, it is formed; where it cannot, the part is machined. Heat treatment and pickling follow as specified per lot, so the mechanical properties the material is meant to deliver are actually delivered.',
			'Titanium needs its own discipline on the machine: the correct die geometry, the correct speed and a controlled surface. Those decisions are made against the grade and against the drawing in front of us, and they are part of the route we quote.',
		],
		bandHeading: 'Choosing the route before the material is drawn',
		bandLead:
			'Forming and forging decide what a part can hold and how it behaves in the joint. We pick the route per geometry and per grade, then confirm it against the drawing.',
		highlights: [
			{ label: 'Cold heading', text: 'wire drawn to diameter, formed under pressure in our own dies' },
			{ label: 'Hot forging', text: 'for larger sections the die cannot cold form' },
			{ label: 'Thread rolling', text: 'threads rolled to the form and pitch the drawing calls for' },
		],
		facts: [
			{ label: 'Routes', value: 'Cold forming, hot forging, thread rolling, CNC finishing' },
			{ label: 'Route selection', value: 'By geometry, batch size and material grade' },
			{ label: 'Batch', value: 'From sample quantities through to series production' },
			{ label: 'Approval', value: 'First article approved before series release' },
			{ label: 'Documentation', value: 'Inspection report per lot, certificate on request' },
		],
		image: {
			src: '/images/special-parts-and-custom-fasteners/22-example-of-a-metal-punched-and-bent-part-a-clamp.webp',
			alt: 'Punched and bent clamp bracket, an example of a formed metal part.',
			width: 928,
			height: 522,
		},
		faq: [
			{
				question: 'How do you decide between cold heading and forging?',
				answer:
					'By the geometry and the batch. A geometry that can be formed cold in a die is formed cold; a larger section or a heavier shape needs the material to flow at temperature, so it is forged. The decision is made against your drawing before the quote is confirmed.',
			},
			{
				question: 'Can the thread be rolled rather than cut?',
				answer:
					'Rolling is our normal route where the geometry allows it. Where the drawing calls for a thread form, pitch or length that cannot be rolled, the part is machined and the reason is stated in the quotation.',
			},
			{
				question: 'What does titanium change in the process?',
				answer:
					'Die geometry, forming speed and surface control. These are decided per grade rather than carried over from steel practice, and they are part of the route we quote and the lot we document.',
			},
		],
		related: [
			{
				label: 'Manufacturing',
				title: 'CNC Machining to Customer Drawings',
				description: 'The route taken when the geometry cannot be formed.',
				href: '/services/manufacturing-capabilities/cnc-machining-to-customer-drawings/',
			},
			{
				label: 'Manufacturing',
				title: 'Production per International Standards',
				description: 'Catalogue fasteners made to DIN, ISO and ASTM.',
				href: '/services/manufacturing-capabilities/production-per-international-standards/',
			},
			{
				label: 'Catalogue',
				title: 'Titanium Fastener Catalogue',
				description: 'The families these routes serve.',
				href: '/products/',
			},
		],
	},
	'surface-finishing-color-coding': {
		body: [
			'Titanium arrives with a natural oxide film that already resists corrosion, so plating is not a requirement. What the surface does need is a decision: whether the part is left plain, passivated for cleanliness, anodised for colour identification, or coated for a specific function in the joint.',
			'Passivation is a chemical cleaning performed to ASTM F86 and AMS 2700. It leaves no coating and it removes free-iron contamination that can be introduced during machining. Anodising to AMS 2488 Type II or Type III produces a controlled anodic oxide — functional or coloured — and it is the finish used where parts have to be told apart by grade, by batch or by function.',
			'For wear and galling behaviour in titanium-to-titanium joints, hard coatings such as PVD or DLC are available on request. Which finish a part receives is decided against the joint and against the environment, not against a price list.',
		],
		bandHeading: 'The finish is chosen for the joint, not for the colour',
		bandLead:
			'Plain, passivated, anodised or coated: the surface treatment is decided against the environment and against how the part has to be identified.',
		highlights: [
			{ label: 'Plain', text: 'mill finish, natural oxide, no coating and no plating' },
			{ label: 'Passivation', text: 'chemical cleaning to ASTM F86 / AMS 2700, no coating left behind' },
			{ label: 'Anodising', text: 'AMS 2488 Type II / Type III, for functional and colour identification' },
		],
		facts: [
			{ label: 'Plain', value: 'Mill finish, natural oxide — titanium needs no plating for corrosion protection' },
			{ label: 'Passivated', value: 'ASTM F86 / AMS 2700, no coating' },
			{ label: 'Anodised', value: 'AMS 2488 Type II / Type III — functional and colour finish' },
			{ label: 'PVD', value: 'Physical vapour deposition coating, on request' },
			{ label: 'DLC', value: 'Diamond-like carbon coating, on request' },
			{ label: 'Identification', value: 'Colour coding for grade, batch or function on request' },
		],
		image: {
			src: '/images/special-parts-and-custom-fasteners/47-selection-of-functional-coatings.webp',
			alt: 'Selection of functional coatings applied to sample fasteners in different colours.',
			width: 1300,
			height: 731,
		},
		faq: [
			{
				question: 'Does titanium need plating for corrosion protection?',
				answer:
					'No. Titanium forms a natural oxide film that gives it its corrosion resistance, so plain mill finish is a legitimate finish rather than an unfinished state. Plating is applied where it serves a function, not as default protection.',
			},
			{
				question: 'What is the difference between passivation and anodising?',
				answer:
					'Passivation is a chemical cleaning to ASTM F86 / AMS 2700 that leaves no coating behind. Anodising to AMS 2488 Type II or Type III builds a controlled anodic oxide layer, which is what gives a colour code or a functional surface.',
			},
			{
				question: 'Can parts be colour coded for identification?',
				answer:
					'Yes, through anodising to AMS 2488. Colour coding is used to tell grades, batches or functions apart on the shop floor and in the warehouse. State the scheme with the order and it is applied to the lot.',
			},
		],
		related: [
			{
				label: 'Manufacturing',
				title: 'Cold Heading & Hot Forging',
				description: 'The forming routes that come before the finish decision.',
				href: '/services/manufacturing-capabilities/cold-heading-hot-forging/',
			},
			{
				label: 'Compliance',
				title: '100% PMI / XRF Grade Verification',
				description: 'Grade screening before the surface is finished.',
				href: '/services/compliance-packaging/pmi-xrf-grade-verification/',
			},
			{
				label: 'Knowledge',
				title: 'Titanium Grade Supply Matrix',
				description: 'Grades, properties and the finishes each grade takes.',
				href: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
			},
		],
	},

	'en-10204-31-mtc-traceability': {
		body: [
			'An EN 10204 3.1 certificate states the chemical composition and mechanical properties of the actual heat the material was taken from, and carries the heat number that links the certificate to the lot in your delivery. Every shipment is accompanied by the certificate for the lot it contains.',
			'What we can show you on this site is a blank certificate and an internally sampled example — the field structure of the document, filled in with data that is either our own test material or has been fully de-identified. No customer name, part number, drawing reference or customer heat number appears anywhere in it. The certificates we issue for a real order are prepared the same way, with your own references removed from anything we publish.',
			'The certificate is a record of the material only. It does not describe the part geometry, the tolerance class or the surface condition, and it is not a substitute for inspection of the finished fastener.',
		],
		bandHeading: 'One heat number, one certificate, one lot',
		bandLead:
			'The heat number runs through the lot: from the mill document, through forming and finishing, to the certificate that travels with your delivery.',
		highlights: [
			{ label: 'Heat traceability', text: 'the certificate names the heat the material came from' },
			{ label: 'Lot-linked', text: 'the certificate in the box is the one for the lot in the box' },
			{ label: 'No customer data', text: 'published examples are blank or de-identified' },
		],
		facts: [
			{ label: 'Certificate', value: 'EN 10204 3.1' },
			{ label: 'Content', value: 'Chemical composition and mechanical properties of the heat' },
			{ label: 'Reference', value: 'Heat number linking the certificate to the lot' },
			{ label: 'Delivery', value: 'Certificate supplied with the shipment it belongs to' },
			{ label: 'Scope', value: 'Material only — not geometry, tolerance or surface condition' },
			{ label: 'Published samples', value: 'Blank or fully de-identified documents' },
		],
		image: {
			src: '/images/services/04-people-around-a-table-discussing-a-technical-dra.webp',
			alt: 'Four people around a table reviewing technical drawings and documentation together.',
			width: 834,
			height: 667,
		},
		faq: [
			{
				question: 'What does an EN 10204 3.1 certificate state?',
				answer:
					'The chemical composition and the mechanical properties of the actual heat the material was taken from, together with the heat number that ties the document to the lot. It is a record of the material, not of the finished geometry.',
			},
			{
				question: 'Does the certificate cover the tolerance class?',
				answer:
					'No. A 3.1 certificate describes the material only. Dimensional conformity, thread fit and surface condition are covered by the inspection record written up for the lot, which is a separate document.',
			},
			{
				question: 'Will my details appear on the certificate?',
				answer:
					'The certificate we issue for your order carries the lot and heat references needed for traceability. Anything we publish on this site is either a blank form or a fully de-identified sample — no customer name, part number or drawing reference appears in it.',
			},
		],
		related: [
			{
				label: 'Compliance',
				title: '100% PMI / XRF Grade Verification',
				description: 'The spectrometer screening filed against the same lot.',
				href: '/services/compliance-packaging/pmi-xrf-grade-verification/',
			},
			{
				label: 'Compliance',
				title: 'Distributor Labeling & Packaging',
				description: 'Packing, labelling and the documents that ship with the lot.',
				href: '/services/compliance-packaging/distributor-labeling-packaging/',
			},
			{
				label: 'Knowledge',
				title: 'Inspection & Test Reports',
				description: 'What the inspection record covers for a delivered lot.',
				href: '/about-us/quality/inspection-and-test-reports/',
			},
		],
	},

	'pmi-xrf-grade-verification': {
		body: [
			'Every part is re-checked by spectrometer before it leaves the workshop. The reading is compared against the grade named on the certificate for the lot, so the grade that arrives is the grade that was ordered.',
			'Mixed material is prevented physically, not only on paper. Grades are segregated in storage and in process, tools and baskets are colour-coded by grade, and a changeover between grades requires a documented clean and identification check before the next lot starts.',
			'Where the standard calls for it, the certificate is issued against the spectrometer result rather than against the mill document alone. The protocol describes our own process and the documents we issue; it contains no customer drawings and no customer part data.',
		],
		bandHeading: 'The grade is verified on the part, not only on paper',
		bandLead:
			'A spectrometer reading on the finished part is the last check before packing. It is compared against the grade named for that lot.',
		highlights: [
			{ label: '100% screening', text: 'every part is read by spectrometer before dispatch' },
			{ label: 'Physical segregation', text: 'grades kept apart in storage, in process and in colour-coded baskets' },
			{ label: 'Documented changeover', text: 'clean and identification check before the next lot starts' },
		],
		facts: [
			{ label: 'Method', value: 'Spectrometer screening of the finished part' },
			{ label: 'Coverage', value: 'Every part before dispatch, not a sample' },
			{ label: 'Reference', value: 'The grade named on the certificate for that lot' },
			{ label: 'Segregation', value: 'Grades separated in storage and in process' },
			{ label: 'Records', value: 'Result filed against the lot reference' },
			{ label: 'Certificates', value: 'Issued against the spectrometer result where the standard requires it' },
		],
		image: {
			src: '/images/special-parts-and-custom-fasteners/44-a-screw-standing-on-its-head-showcasing-a-drille.webp',
			alt: 'Titanium screw standing on its head, close-up showing the machined head and thread.',
			width: 1300,
			height: 731,
		},
		faq: [
			{
				question: 'Is PMI screening done on samples or on every part?',
				answer:
					'On every part. The spectrometer reading is taken on the finished fastener before it is packed, and the result is filed against the lot reference. A sampled check would not be enough to claim that the lot is single-grade.',
			},
			{
				question: 'How is mixed material prevented?',
				answer:
					'Physically, not only on paper. Grades are segregated in storage and in process, tools and baskets are colour-coded by grade, and a changeover between grades needs a documented clean and identification check before the next lot starts.',
			},
			{
				question: 'Which grades do you verify?',
				answer:
					'The grades we supply: Grade 2 commercially pure titanium, Grade 5 Ti-6Al-4V, Grade 9 and Grade 23 ELI. The verification protocol describes our own process and the documents we issue, and it contains no customer drawings or part data.',
			},
		],
		related: [
			{
				label: 'Compliance',
				title: 'EN 10204 3.1 MTC & Traceability',
				description: 'The certificate the screening result is filed against.',
				href: '/services/compliance-packaging/en-10204-31-mtc-traceability/',
			},
			{
				label: 'Manufacturing',
				title: 'Production per International Standards',
				description: 'The standards these parts are released against.',
				href: '/services/manufacturing-capabilities/production-per-international-standards/',
			},
			{
				label: 'Knowledge',
				title: 'PMI & XRF Verification',
				description: 'The published verification protocol.',
				href: '/about-us/quality/pmi-and-xrf-verification/',
			},
		],
	},

	'distributor-labeling-packaging': {
		body: [
			'Distributor programmes need the goods to arrive under the customer’s own name, in the customer’s own carton, ready to put straight onto the shelf. We run that as a standing service: your label, your barcodes, your carton marks, applied lot after lot against one written instruction — not improvised at the packing bench.',
			'The instruction is executed under the confidentiality agreement that covers your drawings, and it is handled under the same segregation rules as the drawing itself. Your label artwork and packing data are never applied to another customer’s lot, and a labelling change only happens when you authorise it in writing.',
			'For shipments that cross an ocean or a rough route, we add the shock and moisture protection the route needs and confirm the protection level before production starts. The packing is made to the agreed standard rather than adapted after the lot is packed.',
			'Nothing about this service changes the lot itself: the parts are produced, screened and documented as usual, and the packing list and certificate set still travel with the delivery. The packing specification itself — what is marked on the pack and which label data we need — is published separately, so you can read the parameters before you commit a programme.',
		],
		bandHeading: 'Your programme, executed the same way on every release',
		bandLead:
			'One written labelling instruction, applied under NDA, packed to the protection the route needs — and the lot documentation unchanged.',
		highlights: [
			{ label: 'Your labelling', text: 'customer label, barcodes and carton marks under NDA' },
			{ label: 'Written instruction', text: 'one approved labelling instruction, no bench improvisation' },
			{ label: 'Export protection', text: 'shock and moisture protection agreed in writing before production' },
		],
		facts: [
			{ label: 'Labelling', value: 'Your label, barcodes and carton marks, applied to every lot in the programme' },
			{ label: 'Confidentiality', value: 'Executed under a signed NDA, under the same segregation rules as your drawings' },
			{ label: 'Change control', value: 'A labelling change is made only on your written authorisation' },
			{ label: 'Export protection', value: 'Shock and moisture protection for the shipping route' },
			{ label: 'Specification', value: 'Confirmed in writing before production starts' },
			{ label: 'Documents', value: 'Packing list and the certificate set for the lot' },
		],
		image: {
			src: '/images/special-parts-and-custom-fasteners/56-a-large-blue-plastic-box-containing-different-mo.webp',
			alt: 'Large blue plastic box holding assorted moulded components ready for packing.',
			width: 928,
			height: 522,
		},
		faq: [
			{
				question: 'Can you apply our own label and barcodes?',
				answer:
					'Yes, as part of a distributor programme covered by a confidentiality agreement. The labelling instruction is handled under the same segregation rules as the drawing, and the instruction is confirmed in writing before production.',
			},
			{
				question: 'How do you handle a change to our labelling?',
				answer:
					'The current instruction stays in force until you authorise a new one in writing. We do not amend a live labelling instruction on our own initiative, and a change is not applied to stock that has already been packed and documented.',
			},
			{
				question: 'Do you supply export packing?',
				answer:
					'Export packing with shock and moisture protection is available for distributor programmes and for sea freight. The protection specification is agreed before production, so the pack is made to the standard rather than adapted afterwards.',
			},
			{
				question: 'Where can we read the packing specification itself?',
				answer:
					'The packing parameters are published separately as the Neutral and OEM packaging specification — what is marked on the standard pack, what an OEM pack needs, and the protection level for each pack state. You can review that before you commit a programme.',
			},
		],
		related: [
			{
				label: 'Specification',
				title: 'Neutral & OEM Packaging Specifications',
				description: 'The packing parameters behind this service, published separately.',
				href: '/knowledge-hub/packaging/neutral-oem-packaging-specs/',
			},
			{
				label: 'Order',
				title: 'Blanket Orders & Scheduled Delivery',
				description: 'Repeated releases packed and shipped to one schedule.',
				href: '/services/order-fulfillment/blanket-orders-scheduled-delivery/',
			},
			{
				label: 'Compliance',
				title: 'EN 10204 3.1 MTC & Traceability',
				description: 'The certificate set that ships with each lot.',
				href: '/services/compliance-packaging/en-10204-31-mtc-traceability/',
			},
		],
	},

	'blanket-orders-scheduled-delivery': {
		body: [
			'A blanket order is a framework agreement: the parts, the grade, the finish and the price are fixed for a period, and deliveries are called off against a schedule you set. It removes the repeat negotiation and the repeat purchase order without fixing the quantity in advance.',
			'Behind each call-off is a normal production run. The lot is produced, inspected and documented on its own, and the certificate and inspection record travel with the delivery that contains it. A blanket order changes how the order is placed, not how the lot is made.',
			'Staged deliveries are the practical part of it. Where a programme consumes material in phases, the schedule is written so that each release lands when your line needs it, and the shipping documents are prepared per release against the same agreement.',
		],
		bandHeading: 'One agreement, a call-off schedule, staged deliveries',
		bandLead:
			'The agreement fixes the part and the conditions. The schedule decides when each lot is produced, and every release is documented like any other delivery.',
		highlights: [
			{ label: 'Framework', text: 'part, grade, finish and price agreed for a period' },
			{ label: 'Call-off', text: 'quantities released against the agreed schedule' },
			{ label: 'Staged delivery', text: 'shipments timed to your production plan' },
		],
		facts: [
			{ label: 'Agreement', value: 'Framework agreement with scheduled call-offs' },
			{ label: 'Fixed', value: 'Part, grade, finish, certification and price' },
			{ label: 'Scheduled', value: 'Call-off quantities and release dates set in advance' },
			{ label: 'Lotting', value: 'Each call-off produced, inspected and documented separately' },
			{ label: 'Documents', value: 'Certificate and inspection record per delivery' },
			{ label: 'Terms', value: 'EXW, FOB, CIF and DAP available on request' },
		],
		image: {
			src: '/images/special-parts-and-custom-fasteners/54-an-accessory-kit-with-20-components-in-a-light-p.webp',
			alt: 'Accessory kit with twenty components laid out in a light plastic tray.',
			width: 928,
			height: 522,
		},
		faq: [
			{
				question: 'Do we have to commit to a total quantity?',
				answer:
					'No. The agreement fixes the part, the grade, the finish and the commercial conditions for a period. The quantities are called off as you need them, which is what makes a blanket order useful for a programme with a variable build rate.',
			},
			{
				question: 'Can deliveries be staged?',
				answer:
					'Yes, and that is the normal arrangement for a production programme. Releases are scheduled against the consumption plan, and each release is shipped with the documentation for the lot it contains.',
			},
			{
				question: 'Is a blanket order the same as a series order?',
				answer:
					'Same product, different paperwork. Each call-off is produced, inspected and released as an individual lot with its own records. The blanket order only removes the repeated order negotiation.',
			},
		],
		related: [
			{
				label: 'Order',
				title: 'Fast Prototyping & Low MOQ',
				description: 'Samples and development runs before a programme starts.',
				href: '/services/order-fulfillment/fast-prototyping-low-moq/',
			},
			{
				label: 'Compliance',
				title: 'Distributor Labeling & Packaging',
				description: 'Labelling and export packing for repeated releases.',
				href: '/services/compliance-packaging/distributor-labeling-packaging/',
			},
			{
				label: 'Compliance',
				title: 'EN 10204 3.1 MTC & Traceability',
				description: 'The certificate that travels with every call-off.',
				href: '/services/compliance-packaging/en-10204-31-mtc-traceability/',
			},
		],
	},

	'fast-prototyping-low-moq': {
		body: [
			'Development often needs parts before it needs production. We run samples and small development batches from the drawings and geometries you send, with low minimum order quantities on both catalogue items and parts made to your own drawings.',
			'The sequence is the same as for series production, just smaller: feasibility review, quotation, sample or development batch, first-article approval, then release of the series order against the approved sample. Nothing changes hands without the same lot documentation.',
			'Where a development programme is still moving, we can quote on a first look at an outline and confirm against the drawing once it is released. The file itself is handled under a confidentiality agreement signed before it is opened.',
		],
		bandHeading: 'A sample that already behaves like the production part',
		bandLead:
			'Samples are made in the same material, on the same machines, with the same documentation. What changes is the quantity, not the standard.',
		highlights: [
			{ label: 'Low MOQ', text: 'catalogue items and drawing-defined parts alike' },
			{ label: 'Fast turnaround', text: 'samples and development runs without a production commitment' },
			{ label: 'First article', text: 'the approved sample becomes the reference for the series' },
		],
		facts: [
			{ label: 'Quantities', value: 'Samples and development batches from one piece upward' },
			{ label: 'Scope', value: 'Catalogue fasteners and drawing-defined special parts' },
			{ label: 'Approval', value: 'First article approved before series release' },
			{ label: 'Documentation', value: 'Same lot documentation as a series delivery' },
			{ label: 'Confidentiality', value: 'NDA signed before the drawing is opened' },
			{ label: 'Response', value: 'Quotation and feasibility feedback within 12 business hours' },
		],
		image: {
			src: '/images/special-parts-and-custom-fasteners/41-two-sets-of-screws-and-washers-one-with-a-black-.webp',
			alt: 'Two sets of titanium screws and washers side by side, one set with a black finish.',
			width: 1300,
			height: 731,
		},
		faq: [
			{
				question: 'What is the minimum order quantity?',
				answer:
					'Low by design, for both catalogue fasteners and parts made to a drawing. Tell us the quantity in your enquiry and we will state what we can schedule, including the sample or development batch that precedes it.',
			},
			{
				question: 'Can I get a sample before placing a series order?',
				answer:
					'Yes, and it is the recommended route for a new part. The sample is produced in the same material and on the same machines as the series, documented in the same way, and becomes the approved first article for the production run.',
			},
			{
				question: 'How fast can a development batch be delivered?',
				answer:
					'Development batches are scheduled ahead of series production. The date is confirmed with the quotation once the drawing has been reviewed, and it depends on the material, the geometry and the process route selected.',
			},
		],
		related: [
			{
				label: 'Manufacturing',
				title: 'CNC Machining to Customer Drawings',
				description: 'The route taken for parts defined by a drawing.',
				href: '/services/manufacturing-capabilities/cnc-machining-to-customer-drawings/',
			},
			{
				label: 'Order',
				title: 'Blanket Orders & Scheduled Delivery',
				description: 'Repeat volumes released against one agreed schedule.',
				href: '/services/order-fulfillment/blanket-orders-scheduled-delivery/',
			},
			{
				label: 'Catalogue',
				title: 'Titanium Fastener Catalogue',
				description: 'The catalogue range available at low quantities.',
				href: '/products/',
			},
		],
	},
};


