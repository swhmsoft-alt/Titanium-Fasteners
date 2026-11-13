/**
 * src/config/site.ts — single source of truth for site-level constants.
 *
 * Brand identity was decided by the client: the site name is
 * "Titanium Fasteners", deployed at https://fastener.bozemetal.com.
 *
 * The LOGO is intentionally NOT finalised. Per the client, the logo and
 * related brand assets will be designed AFTER the site is built, derived
 * from the site's overall colour tone. Until then, `Logo.astro` renders a
 * typographic placeholder with the exact geometry measured on the reference
 * site, so no layout work has to be redone when the real asset lands.
 *
 * DESIGN BOUNDARY (.clinerules/.clinerules.md §5):
 * Visual language comes exclusively from the reference site. The sibling
 * project (cnc.bozemetal.com) is an engineering-infrastructure reference
 * ONLY — its palette, type scale, copy and components must not be reused here.
 */

import { CATEGORIES, categoryPath } from '@data/products';

/**
 * 产品分类导航 —— 由 data/products/categories.csv 生成。
 * 分类 id → /global-en/eshop/c/<id>/（路由常量见 scripts/gen-products.mjs）。
 * 新增分类只改 CSV，不改这里。
 */
const PRODUCT_CATEGORY_NAV = CATEGORIES.map((c) => ({ name: c.name, href: categoryPath(c.id) }));

export const SITE = {
	/** Client-confirmed brand name. Used in the header, footer, page titles and JSON-LD. */
	name: 'Titanium Fasteners',
	/**
	 * Legal/operator name. PLACEHOLDER — 待客户提供注册主体全称后替换；
	 * Phase A 复制期沿用了参考站的公司名，此处已改回自有品牌。
	 */
	legalName: 'Boze Metal',
	/** Deployment target — SEO and canonical URLs only, not a design signal. */
	url: 'https://fastener.bozemetal.com',
	/** Short descriptor used in meta descriptions and the footer strapline. */
	tagline: 'Fasteners, Engineering, Logistics',
	description:
		'Titanium fasteners manufacturing — bolts, screws, studs, nuts, washers and custom titanium fastening solutions, supported by engineering services and supply-chain programs.',
	/** Theme colour for the web manifest + browser UI. Matches the favicon plate. */
	themeColor: '#1E2225',
	/** Language of the shipped site. */
	locale: 'en',
} as const;

/**
 * 询盘（RFQ）承接配置 —— B2B 唯一转化出口。
 *
 * CHANNEL DECISION (Phase B, client-confirmed): 自建 webhook。
 * 站点已有同类承接能力（cnc.bozemetal.com 的询盘接口），Phase B 沿用同一套
 * 后端约定，本仓库只负责「静态骨架 + 智能询盘岛」的前端侧。
 *
 * `endpoint` 用 PUBLIC_ 前缀 → 构建期内联进静态 HTML。Astro 静态站没有
 * 服务端，表单必须由浏览器直接 POST 到 webhook，所以端点是**公开**信息，
 * 不是密钥。真正的防滥用与鉴权在 webhook 侧（IP 限流 + 蜜罐 + 校验）。
 *
 * 若 endpoint 为空串，询盘岛会自动降级为 mailto: 提交（见 InquiryForm.tsx），
 * 这样「先上线页面、后接后端」不会产生死按钮。
 */
export const INQUIRY = {
	/** 询盘 webhook 端点。留空则降级为 mailto:。 */
	endpoint: 'https://fastener.bozemetal.com/api/inquiry',
	/** 降级 mailto 的收件邮箱。 */
	fallbackEmail: 'sales@bozemetal.com',
	/** 表单默认带出的业务上下文，会随提交一起发给 webhook。 */
	source: 'product-page',
	/** 蜜罐字段名 —— 真人看不见，机器人会填。留空则不发该字段。 */
	trapField: 'website',
} as const;

/**
 * Brand assets and logo geometry.
 *
 * The final BOZE brand artwork was supplied as vector source and ships as
 * static SVG under `public/brand/`.
 *
 * Measured on the reference site (2026-11, viewport 1440×1000):
 *
 *   Claim logo   — RENDERED 190×55px on desktop (≥768px)
 *   Compact logo — RENDERED 120×19px (the reference asset was a wide strip)
 *
 * The header logo box is `min-h-[48px] md:min-h-[55px]`.
 *
 * The BOZE wordmark artwork is 796×216 (ratio 3.685) on a transparent
 * background and is rendered with `object-fit: contain`, so it is never
 * distorted — the 190×55 box letterboxes it by ~3px top/bottom.
 *
 * COLOUR (2026-11 白底重构 / white-background edition)
 *   The header is opaque white (#fff), so the whole brand system was rebuilt
 *   for a WHITE background: flat 2D solid fills only — no gradients, no
 *   drop-shadow filters, no highlights.
 *
 *     主文字  深石墨碳黑  #1E2225   mono 字标 / B 实体 / O 外廓 / Z / E
 *     次级    工业机械灰  #5A6065   分隔线 + "TITANIUM FASTENERS" 副标
 *     点缀    冷钛蓝      #003366   仅 O 的内六角槽内壁（选配，可整组删除）
 *
 *   `mono` is the default on every light surface; `reverse` (pure white) is
 *   reserved for dark surfaces (hero, footer, dark bands). Every cut-out in
 *   the artwork is TRUE TRANSPARENT, so the assets drop straight onto dark
 *   plates, kraft cartons or steel stamps without conversion.
 */
export const LOGO = {
	/** Alt text for the logo image. */
	alt: 'BOZE — Titanium Fasteners',
	/** Static asset paths, served from `public/brand/`. */
	assets: {
		/** Wordmark — for light surfaces (white header). */
		mono: '/brand/logo-claim.webp',
		/** Wordmark — for dark surfaces. */
		reverse: '/brand/logo-claim.webp',
		/** Wordmark at 2× — below the 768px breakpoint. */
		compact: '/brand/logo-compact.webp',
		/** Full lockup: mark + rule + "TITANIUM FASTENERS". */
		lockup: '/brand/logo-lockup.webp',
	},
	claim: {
		/** Intrinsic size of the source asset, in px. */
		width: 798,
		height: 210,
		/** width / height of the SOURCE asset. */
		ratio: 3.8,
		/** Rendered box on desktop (≥768px), as measured. */
		displayWidth: 190,
		displayHeight: 55,
	},
	compact: {
		/** Same wordmark artwork, at 2× the compact render. */
		width: 152,
		height: 40,
		ratio: 3.8,
		/**
		 * The reference's compact logo was a 300×47 strip (wordmark + tagline)
		 * rendered at 120×19. This brand's compact asset is a wordmark only,
		 * so the box is trimmed to the artwork's own width — reserving 120px
		 * would leave 50px of empty space and push the header utility cluster
		 * away from the visible mark.
		 */
		displayWidth: 76,
		displayHeight: 19,
	},
	lockup: {
		/** Intrinsic size of the lockup asset, in px. */
		width: 1024,
		height: 352,
		/** width / height of the SOURCE asset. */
		ratio: 2.909,
	},
	/**
	 * Clear space (留白安全区) — the brand rule.
	 *
	 * The "E" of BOZE is 160 units wide in the source artwork (20.1% of the
	 * 796-unit canvas). No other element may enter that band around the mark.
	 *
	 *   units       — 160 source units
	 *   pxAtClaim   — 38.2px at the 190px desktop render
	 *   pxAtCompact — 15.3px at the 76px mobile render
	 *
	 * The white navbar satisfies it on the left through the container
	 * padding (70px at ≥1280). The 32px gap to the nav row is the measured
	 * reference value and is deliberately left untouched.
	 */
	clearSpace: {
		units: 160,
		pxAtClaim: 38.2,
		pxAtCompact: 15.3,
	},
} as const;

/**
 * Top-level navigation structure.
 *
 * SHAPE (照抄 reference DOM, 1:1):
 *   NavItem      顶级项。参考站用 <button> 触发面板；此处的 href 是面板底部
 *                「Go to X」链接的落地页（参考站的按钮本身没有 href）。
 *   NavItem.lead 面板底部的「Go to X」链接（参考站 `flex-col-reverse` 把它
 *                放在三列网格之下）。
 *   NavColumn    面板的一列 —— 参考站 `grid grid-cols-3 gap-48` 的一个 <li>。
 *   NavGroup     一组 = 参考站列内的一个 <div>：一个 L2 标题链接 + 其下 L3 子项。
 *   NavChild     L3 子项链接。
 *
 * MEASURED on the reference site (1440×1000, 2026-11) via CDP:
 *   qa/ref/nav-panels.json   — 5 个面板的几何 + 每条链接的计算样式
 *   qa/ref/nav-structure.json— 从落盘 HTML 按 data-analytics-navi-item-*
 *                              还原的权威层级（列 → 组 → 条目）
 *
 * 本块由 `scripts/gen-nav-data.mjs` 从 qa/ref/nav-structure.json 生成，
 * 不要手改 —— 重新运行该脚本即可从实测数据重建。
 */
export interface NavChild {
	/** Link label, verbatim from the reference (entity-decoded). */
	name: string;
	/** Target, verbatim from the reference (including its `/global-en/` prefix). */
	href: string;
	/** Opens in a new tab (reference behaviour for external links). */
	external?: boolean;
}

/** A heading link plus its links — one block inside a mega-menu column. */
export interface NavGroup {
	/**
	 * The L2 group title. In the reference this is itself a LINK
	 * (`<a class="text-p-s font-bold">`), not a plain heading.
	 */
	heading?: string;
	/** Target of the heading link, verbatim from the reference. */
	headingHref?: string;
	/** The heading opens in a new tab (reference behaviour). */
	headingExternal?: boolean;
	/** The L3 child links under this heading. */
	items: NavChild[];
}

/** One column of the mega menu. */
export interface NavColumn {
	groups: NavGroup[];
}

/** The panel's bottom "Go to X" lead link. */
export interface NavLeadLink {
	/** Label, verbatim from the reference (e.g. "Go to Services"). */
	name: string;
	/** Target, verbatim from the reference. */
	href: string;
}

export interface NavItem {
	name: string;
	href: string;
	/** The panel's bottom "Go to X" link. */
	lead?: NavLeadLink;
	/** Mega-menu columns. When absent the item renders as a plain link. */
	children?: NavColumn[];
}

export const NAVIGATION: NavItem[] = [
	{
		name: 'Product Solutions',
		href: '/global-en/product-solutions/',
		lead: {
			name: 'Go to Product Solutions',
			href: '/global-en/product-solutions/',
		},
		children: [
			{
				groups: [
					{
						heading: 'eShop',
						headingHref: '/global-en/eshop/',
						items: [
						],
					},
					{
						heading: 'Fastening Technology',
						headingHref: '/global-en/eshop/',
						items: [],
					},
				],
			},
			{
				groups: [
					{
						heading: 'Product Categories',
						headingHref: '/global-en/eshop/',
						items: PRODUCT_CATEGORY_NAV,
					},
				],
			},
			{
				groups: [
					{
						heading: 'Product Categories and Brands',
						headingHref: '/global-en/product-solutions/product-categories-and-brands/',
						items: [
						],
					},
					{
						heading: 'Special Parts & Custom Fasteners',
						headingHref: '/global-en/product-solutions/special-parts-and-custom-fasteners/',
						items: [
						],
					},
					{
						heading: 'Components and Other Specific Solutions',
						headingHref: '/global-en/product-solutions/components-specific-solutions/',
						items: [
						],
					},
					{
						heading: 'Innovations',
						headingHref: '/global-en/product-solutions/innovations/',
						items: [
						],
					},
				],
			},
		],
	},
	{
		name: 'Services',
		href: '/global-en/services/',
		lead: {
			name: 'Go to Services',
			href: '/global-en/services/',
		},
		children: [
			{
				groups: [
					{
						heading: 'Smart Factory',
						headingHref: '/global-en/services/smart-factory/',
						items: [
							{ name: 'Inventory & C-Parts Management', href: '/global-en/services/smart-factory/inventory-management/' },
							{ name: 'Smart Factory Assembly', href: '/global-en/services/smart-factory/smart-assembly/' },
						],
					},
					{
						heading: 'Engineering',
						headingHref: '/global-en/services/engineering/',
						items: [
							{ name: 'Engineering Services', href: '/global-en/services/engineering/engineering-services/' },
							{ name: 'Composites', href: '/global-en/services/engineering/fastening-composites/' },
						],
					},
				],
			},
			{
				groups: [
					{
						heading: 'Benefits',
						headingHref: '/global-en/services/benefits/',
						items: [
							{ name: 'Reduced Time to Market', href: '/global-en/services/benefits/reduced-time-to-market/' },
							{ name: 'Leaner Processes & Automation', href: '/global-en/services/benefits/leaner-processes-and-automation/' },
							{ name: 'Cost Saving Rationalization', href: '/global-en/services/benefits/cost-saving-rationalization/' },
							{ name: 'Higher Quality & Safety', href: '/global-en/services/benefits/higher-quality-and-safety/' },
							{ name: 'Design Optimization & Validation', href: '/global-en/services/benefits/design-optimization-and-validation/' },
							{ name: 'Total Cost of Ownership (TCO)', href: '/global-en/services/benefits/tco-in-fastening/' },
						],
					},
				],
			},
			{
				groups: [
					{
						heading: 'Success Stories',
						headingHref: '/global-en/knowledge-hub/inspiration/success-stories/',
						items: [
						],
					},
				],
			},
		],
	},
	{
		name: 'Industries',
		href: '/global-en/industries/',
		lead: {
			name: 'Go to Industries',
			href: '/global-en/industries/',
		},
		children: [
			{
				groups: [
					{
						heading: 'Aerospace',
						headingHref: '/global-en/industries/aerospace/',
						items: [
						],
					},
					{
						heading: 'Data Centers',
						headingHref: '/global-en/industries/data-centers/',
						items: [
						],
					},
					{
						heading: 'Electrical & Electronics',
						headingHref: '/global-en/industries/electrical-engineering/',
						items: [
						],
					},
				],
			},
			{
				groups: [
					{
						heading: 'Electric Vehicles',
						headingHref: '/global-en/industries/electric-vehicles/',
						items: [
						],
					},
					{
						heading: 'Heating, Ventilation, & Air Conditioning',
						headingHref: '/global-en/industries/hvac/',
						items: [
						],
					},
					{
						heading: 'Medical & Life Science',
						headingHref: '/global-en/industries/medical/',
						items: [
						],
					},
				],
			},
			{
				groups: [
					{
						heading: 'Railway Technology',
						headingHref: '/global-en/industries/railway/',
						items: [
						],
					},
					{
						heading: 'Robotics',
						headingHref: '/global-en/industries/robotics/',
						items: [
						],
					},
					{
						heading: 'Semiconductor',
						headingHref: '/global-en/industries/semiconductors/',
						items: [
						],
					},
				],
			},
		],
	},
	{
		name: 'Knowledge Hub',
		href: '/global-en/knowledge-hub/',
		lead: {
			name: 'Go to Knowledge Hub',
			href: '/global-en/knowledge-hub/',
		},
		children: [
			{
				groups: [
					{
						heading: 'Inspiration',
						headingHref: '/global-en/knowledge-hub/inspiration/',
						items: [
							{ name: 'Blog', href: '/global-en/knowledge-hub/inspiration/blog/' },
							{ name: 'Success Stories', href: '/global-en/knowledge-hub/inspiration/success-stories/' },
						],
					},
				],
			},
			{
				groups: [
					{
						heading: 'Resources',
						headingHref: '/global-en/knowledge-hub/resources/',
						items: [
							{ name: 'Download Center', href: '/global-en/knowledge-hub/resources/download-center/' },
							{ name: 'Calculators & Converters', href: '/global-en/knowledge-hub/resources/online-calculators-and-converters/' },
							{ name: 'White Papers', href: '/global-en/knowledge-hub/resources/download-center/white-papers/' },
							{ name: 'CAD Online Portal', href: '/global-en/knowledge-hub/resources/cad-online-portal/' },
							{ name: 'Technical Information', href: '/global-en/knowledge-hub/resources/technical-information/' },
							{ name: 'Notes on Use / Hazard Symbols', href: '/global-en/knowledge-hub/resources/notes-on-use/' },
						],
					},
				],
			},
			{
				groups: [
					{
						heading: 'eShop Help Center',
						headingHref: '/global-en/knowledge-hub/eshop-information/',
						items: [
						],
					},
				],
			},
		],
	},
	{
		name: 'About us',
		href: '/global-en/about-us/',
		lead: {
			name: 'Go to About us',
			href: '/global-en/about-us/',
		},
		children: [
			{
				groups: [
					{
						heading: 'Careers',
						headingHref: '/global-en/about-us/careers/',
						items: [
							{ name: 'Open Positions', href: '/global-en/about-us/careers/open-positions/' },
						],
					},
				],
			},
			{
				groups: [
					{
						heading: 'Who we are',
						headingHref: '/global-en/about-us/who-we-are/',
						items: [
							{ name: 'Company Profile', href: '/global-en/about-us/who-we-are/company-profile/' },
							{ name: 'Our Story', href: '/global-en/about-us/who-we-are/our-story/' },
							{ name: 'Our Values & Guiding Principles', href: '/global-en/about-us/who-we-are/values-and-guiding-principles/' },
						],
					},
				],
			},
			{
				groups: [
					{
						heading: 'News & Media',
						headingHref: '/global-en/about-us/news-and-media/',
						items: [
						],
					},
					{
						heading: 'Investor Portal',
						headingHref: '/global-en/about-us/news-and-media/',
						items: [
						],
					},
					{
						heading: 'Event Calendar',
						headingHref: '/global-en/about-us/event-calendar/',
						items: [
						],
					},
					{
						heading: 'Sustainability / ESG',
						headingHref: '/global-en/about-us/sustainability/',
						items: [
						],
					},
					{
						heading: 'Supplier Portal',
						headingHref: '/global-en/about-us/supplier-portal/',
						items: [
						],
					},
				],
			},
		],
	},
] as const;

/* ───────────────────────────────────────────────────────────────────────────
   FOOTER — copied verbatim from the reference site's footer.

   Measured source: docs/reference/probe-footer.json + probe-footer.html
   (reference site https://www.bossard.com/global-en/, 1440×1000, 2026-11).
   Phase A rule: 照抄 — the reference's five columns, their link labels, their
   order, the arrow-marked "jump" links, the company address block and the
   legal row are reproduced exactly. Nothing here is invented.
   ─────────────────────────────────────────────────────────────────────────── */

export interface FooterItem {
	/** Link label, verbatim from the reference. */
	name: string;
	/** Target, verbatim from the reference (including its `/global-en/` prefix). */
	href: string;
	/** Renders the reference's right-arrow icon before the label. */
	arrow?: boolean;
	/** Opens in a new tab with rel="noreferrer noopener" (reference behaviour). */
	external?: boolean;
}

export interface FooterColumn {
	/** Column heading, verbatim from the reference. */
	heading: string;
	items: FooterItem[];
	/** Company address block — the reference renders it inside the last column. */
	address?: string[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
	{
		heading: 'Products & Services',
		items: [
			{ name: 'Product Solutions', href: '/global-en/product-solutions/' },
			{
				name: 'Smart Factory Logistics',
				href: '/global-en/services/smart-factory/inventory-management/',
			},
			{
				name: 'Smart Factory Assembly',
				href: '/global-en/services/smart-factory/smart-assembly/',
			},
			{
				name: 'Assembly Technology Expert',
				href: '/global-en/services/engineering/engineering-services/',
			},
			{ name: 'eShop', href: '/global-en/eshop/', arrow: true },
		],
	},
	{
		heading: 'Knowledge Hub',
		items: [
			{
				name: 'Download Center',
				href: '/global-en/knowledge-hub/resources/download-center/',
			},
			{
				name: 'Calculators & Converters',
				href: '/global-en/knowledge-hub/resources/online-calculators-and-converters/',
			},
			{
				name: 'CAD Online Portal',
				href: '/global-en/knowledge-hub/resources/cad-online-portal/',
			},
			{
				name: 'White Papers',
				href: '/global-en/knowledge-hub/resources/download-center/white-papers/',
			},
			{
				name: 'Technical Information',
				href: '/global-en/knowledge-hub/resources/technical-information/',
			},
			{ name: 'Knowledge Hub', href: '/global-en/knowledge-hub/', arrow: true },
		],
	},
	{
		heading: 'Direct Access',
		items: [
			{ name: 'Industries', href: '/global-en/industries/' },
			{ name: 'Blog', href: '/global-en/knowledge-hub/inspiration/blog/' },
			{ name: 'eShop Help Center', href: '/global-en/knowledge-hub/eshop-information/' },
			{ name: 'Contact', href: '/global-en/about-us/contact/', arrow: true },
		],
	},
	{
		heading: 'About Us',
		items: [
			{ name: 'Careers', href: '/global-en/about-us/careers/' },
			{ name: 'Open Positions', href: '/global-en/about-us/careers/open-positions/' },
			{
				name: 'Investor Portal',
				href: '/global-en/about-us/news-and-media/',
			},
			{ name: 'News & Media', href: '/global-en/about-us/news-and-media/' },
			{ name: 'Sustainability / ESG', href: '/global-en/about-us/sustainability/' },
			{ name: 'About us', href: '/global-en/about-us/', arrow: true },
		],
	},
	{
		heading: 'Boze Metal',
		items: [],
		/*
		 * 注册地址 —— PLACEHOLDER。
		 * Phase A 复制期沿用了参考公司的注册地址（Zug, Switzerland）。那不是我们的
		 * 地址，不能留 —— 客户给出后替换这三行即可（只有这一处需要改）。
		 */
		address: ['Boze Metal', 'Registered address to be supplied'],
	},
];

/** Legal row, verbatim from the reference (left of the copyright line). */
export const FOOTER_LEGAL_LINKS: FooterItem[] = [
	{ name: 'Privacy Policy', href: '/global-en/privacy-policy/' },
	{ name: 'Imprint', href: '/global-en/imprint/' },
	{ name: 'Accessibility', href: '/global-en/accessibility-statement/' },
];

/** Label shown left of the social icons. */
export const COMMUNITY_LABEL = 'Join our Community';

/**
 * 社交链接 —— PLACEHOLDER。
 * Phase A 复制期指向参考公司的官方账号；那会把访客带到别家公司的主页。
 * 这里先指向自有品牌命名空间，客户拿到真实账号后改这两行。
 */
export const SOCIAL_LINKS = {
	linkedin: 'https://www.linkedin.com/company/boze-metal/',
	youtube: 'https://www.youtube.com/@bozemetal',
} as const;
