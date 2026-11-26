/**
 * src/data/legal.ts — /legal/privacy-policy/ 的唯一文案真相源。
 *
 * WHY A DATA MODULE
 * -----------------
 * 隐私政策是全站唯一的法务文案：CookieConsent（98 页）与 innovations 页
 * 都指向它。改一句话 = 改一个文件，不散落在 .astro 里。
 *
 * 本文件只写**可核实的事实**，不写无法兑现的承诺：
 *   · 站点不加载任何第三方统计 / 广告脚本（已全量核对 src：无 gtag、
 *     GTM、Meta Pixel、Hotjar、Clarity）；
 *   · 同意偏好只写进浏览器 localStorage（键 tf-cookie-consent），
 *     不写 cookie、不写服务端；
 *   · 唯一的第三方嵌入是页脚的 Google Maps iframe，且为**点击后才加载**
 *     （懒加载），未点击时不会向 Google 发起请求；
 *   · 询盘表单把内容 POST 到本站自有端点 fastener.bozemetal.com/api/inquiry，
 *     未接后端时降级为 mailto:；
 *   · 附件（可选）走 fastener.bozemetal.com/api/submit-inquiry.php：文件存到
 *     Web 根目录之外的 private 目录，文字字段转发回同一承接端点；
 *   · 不设账号体系，不做支付。
 *
 * 红线：不写未发生的统计数字、不写虚构的 DPO 姓名 / 监管机关地址，
 * 不用「我们绝对安全」这类不可核实的措辞。
 *
 * 手写文件（非生成产物），可自由编辑。
 */

/** 「数据控制者」一栏的键值对。 */
export interface LegalFact {
	label: string;
	value: string;
}

/** 政策正文的一个小节。 */
export interface LegalSection {
	heading: string;
	/** 段落文本。 */
	paragraphs: string[];
}

/** 政策正文里的列表项（每项一行，不超过一句）。 */
export interface LegalListItem {
	label: string;
	text: string;
}

export const PRIVACY_POLICY = {
	seo: {
		title: 'Privacy Policy',
		description:
			'How Boze Metal handles personal data submitted through this website — what the inquiry forms collect, what stays in your browser, and how to reach us.',
	},
	hero: {
		breadcrumb: [
			{ label: 'Home', href: '/' },
			{ label: 'Privacy Policy' },
		] as { label: string; href?: string }[],
		eyebrow: 'Legal',
		heading: 'Privacy Policy',
		lead: 'What this website collects, where it goes, and what we do not do with it. Written for buyers and distributors who need to know before they submit an inquiry.',
	},
	facts: [
		{ label: 'Controller', value: 'Boze Metal — Baoji, Shaanxi, P.R. China' },
		{ label: 'Contact', value: 'info@bozemetal.com' },
		{ label: 'Site', value: 'fastener.bozemetal.com' },
		{ label: 'Last updated', value: '26 November 2026' },
	] as LegalFact[],
	/** 处理个人数据的目的 —— 与询盘流程一一对应。 */
	purposes: [
		{
			label: 'Answering inquiries',
			text: 'We use the contact details you submit to reply to your request and prepare a quotation.',
		},
		{
			label: 'Supply and certification',
			text: 'For an accepted order we use your shipping and company details for the order, packing list and material certificate.',
		},
		{
			label: 'Site operation',
			text: 'Server request logs are kept to keep the site available and to investigate abuse.',
		},
	] as LegalListItem[],

sections: [
		{
			heading: 'Who is responsible for your data',
			paragraphs: [
				'Boze Metal, located in Baoji, Shaanxi, P.R. China, operates this website and is the controller for the personal data described here. For anything relating to your data, write to info@bozemetal.com and the inquiry is handled by our engineering desk rather than an automated responder.',
			],
		},
		{
			heading: 'What the inquiry forms collect',
			paragraphs: [
				'When you submit an inquiry form on this site, the fields you fill in are sent to our own inquiry endpoint at fastener.bozemetal.com so that the relevant engineer can answer you. The standard fields are your name, e-mail address, company, country and the specification or message you write. That is the extent of what we ask for.',
				'The inquiry form also offers an optional attachment field. A file you choose there is uploaded to our own server, stored in a directory outside the public web folder so it cannot be fetched by a web address, and is not forwarded to any third party. We keep the original file name only inside our inquiry record so the engineering desk can identify it.',
				'Please do not include confidential drawings, personal data about third parties or anything your organisation has not cleared for disclosure. If a drawing is needed, ask us for the mutual NDA first — we will not open a file before it is in place.',
				'This website has no user accounts, no login and no payment processing, so we hold no credentials, no card data and no password hashes.',
			],
		},
		{
			heading: 'What we do with it',
			paragraphs: ['The data you submit is used for a defined purpose only:'],
		},
		{
			heading: 'Cookies, local storage and third parties',
			paragraphs: [
				'The consent banner you see at the bottom of the page stores your choice in your own browser under the local storage key tf-cookie-consent. It sets no cookie of its own and sends nothing to a server, and the banner does not load any third-party script.',
				'This site ships no analytics, advertising or session-tracking script from any third party. No data is sold, rented or shared with advertising networks.',
				'The one third-party element on this site is the Google Maps frame in the footer. It is not loaded when the page opens — it loads only after you open the map, and it is bound to that single interaction. If you never open it, no request reaches Google.',
			],
		},
		{
			heading: 'How long we keep it',
			paragraphs: [
				'Inquiry data is kept for as long as it takes to answer the request and support the resulting business relationship, and for the period required to meet tax and customs record-keeping obligations. Enquiry messages that do not lead to an order are deleted once the quotation decision is closed.',
				'An attachment you send with an inquiry is kept on the same basis as the inquiry itself: for the quotation and production conversation it supports, and for the record-keeping period that follows. If the enquiry does not lead to an order, the attachment is deleted with the message.',
				'Server request logs are rotated on a short cycle and are not linked to the contact details you give us.',
			],
		},
		{
			heading: 'Who else sees it',
			paragraphs: [
				'Data is shared only where the order or the request requires it: the shipping carrier and the customs broker for an accepted order, and our hosting provider for the technical delivery of the site. We do not sell personal data and we do not disclose it to third parties for their own purposes.',
			],
		},
		{
			heading: 'Your rights',
			paragraphs: [
				'You can ask us for a copy of the personal data we hold about you, ask us to correct it, or ask us to delete it where we are not obliged to keep it. Because we route enquiries through a shared engineering inbox, include enough detail for us to identify your request — for example the company name and the specification you asked about.',
				'Requests are answered in writing. If you are in the EU or the UK, you also have the right to complain to your local supervisory authority.',
			],
		},
		{
			heading: 'Changes to this policy',
			paragraphs: [
				'When the handling of data on this site changes, this page is updated and the date at the top changes with it. Material changes affecting how we use inquiry data are also communicated to distributors with an active supply programme.',
			],
		},
	] as LegalSection[],
} as const;
