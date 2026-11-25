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

import { categoryPath, MATERIALS } from '@data/products';
import { ABOUT_US_GROUPS, aboutUsPath } from '@data/about-us';
import { KNOWLEDGE_HUB_GROUPS } from '@data/knowledge-hub';
import { gradeLandingPath } from '@data/grade-paths';

/**
 * 「按执行标准直达」的落地页 —— 每个标准体系一个**专属页面**（矩阵表 + 牌号 + FAQ + 询盘），
 * 不再把菜单项指向 `/products/?standard=…` 筛选深链。
 *
 * 路由固定（产品区 URL 形态不可变，页面文件路径即 URL）：
 *   DIN   → /products/din-titanium-fasteners/
 *   ISO   → /products/iso-titanium-fasteners/
 *   ASTM  → /products/astm-asme-titanium-fasteners/
 *
 * 页面文件在 src/pages/products/ 下，与产品分类页同属产品域。
 */

/**
 * 牌号号数 → 牌号 id（'ti-gr23' → '23'）。
 * 菜单用「Grade 2 / Grade 5 / Grade 23」这种口语写法，id 变了菜单不能哑掉。
 */
const MATERIAL_ID_BY_GRADE: Record<string, string> = {};
for (const m of MATERIALS) {
	const match = /^ti-gr(\d+)$/.exec(m.id);
	if (match) MATERIAL_ID_BY_GRADE[match[1]] = m.id;
}

/**
 * 某牌号的落地链接。
 *
 * 优先级：
 *   ① 该牌号有**专属落地页**（Grade 2 / Grade 5）→ 指向该页
 *      （页内有物性表、标准对照、全部产品族与 RFQ 表单，比裸筛选结果信息完整）
 *   ② 否则 → 产品目录的 `?material=` 筛选深链
 *      （族上架后该牌号自动进入筛选可选项，链接即刻生效）
 *
 * 映射表见 @data/grade-paths（依赖树叶子模块，无循环引用风险）。
 */
const materialHref = (grade: string): string => {
	const id = MATERIAL_ID_BY_GRADE[grade];
	if (!id) return '/products/';
	return gradeLandingPath(id) ?? `/products/?material=${id}`;
};

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
	fallbackEmail: 'info@bozemetal.com',
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
	alt: 'BOZE CNC-Ti 博泽精工',
	/** Static asset paths, served from `public/brand/`. */
	assets: {
		/** Wordmark — for light surfaces (white header). */
		mono: '/brand/logo-claim.webp',
		/** 2× copy of `mono` — served to retina displays via `srcset`. */
		mono2x: '/brand/logo-claim@2x.webp',
		/** Wordmark — for dark surfaces (white knockout, orange accent kept). */
		reverse: '/brand/logo-claim-reverse.webp',
		/** 2× copy of `reverse`. */
		reverse2x: '/brand/logo-claim-reverse@2x.webp',
		/** Wordmark — below the 768px breakpoint. */
		compact: '/brand/logo-compact.webp',
		/** 2× copy of `compact`. */
		compact2x: '/brand/logo-compact@2x.webp',
		/** Full lockup — same artwork as the claim variant. */
		lockup: '/brand/logo-claim.webp',
		/** 2× copy of `lockup`. */
		lockup2x: '/brand/logo-claim@2x.webp',
	},
	claim: {
		/** Intrinsic size of the source asset, in px. */
		width: 140,
		height: 45,
		/** width / height of the SOURCE asset. */
		ratio: 3.111,
		/**
		 * Rendered box on desktop (≥768px) — 1:1 with the source asset.
		 *
		 * The source is only 140×45 px, so the desktop render is pinned to
		 * exactly that size. Anything larger upscales the bitmap and reads
		 * soft on retina screens.
		 */
		displayWidth: 140,
		displayHeight: 45,
	},
	compact: {
		/** Same artwork as the claim variant. */
		width: 140,
		height: 45,
		ratio: 3.111,
		/**
		 * Mobile render — a proportional DOWNSCALE of the 140×45 source.
		 * The mobile header box is min-h-[48px], so a 105×34 mark fits with
		 * room to spare while staying sharp (downscaling never softens).
		 */
		displayWidth: 105,
		displayHeight: 34,
	},
	lockup: {
		/** Same artwork as the claim variant. */
		width: 140,
		height: 45,
		/** width / height of the SOURCE asset. */
		ratio: 3.111,
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
		/** Clear band around the mark, in rendered px. */
		pxAtClaim: 14,
		pxAtCompact: 10,
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
	/** Target, verbatim from the reference (including its `/` prefix). */
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

/**
 * About us 面板的三列导航 —— 由 @data/about-us 派生，保证「菜单里的链接」
 * 与「实际存在的页面」永远一致（同一个 slug 既生成详情页，也生成菜单项）。
 */
const ABOUT_US_NAV_CHILDREN: NavColumn[] = ABOUT_US_GROUPS.map((group) => ({
	groups: [
		{
			heading: group.heading,
			headingHref: `/about-us/${group.slug}/`,
			items: group.items.map((item) => ({
				name: item.name,
				href: aboutUsPath(item),
			})),
		},
	],
}));

/**
 * Knowledge Hub 面板的三列 —— 由 @data/knowledge-hub 派生。
 *
 * 保密合规校准后的三列结构：
 *   ① Sourcing & Spec Tools             —— 规格捕获器（销售工件）
 *   ② Compliance & Quality Docs        —— 只有我们能出具的资产
 *   ③ IP Protection & Manufacturing Specs —— 保密承诺与工厂工艺边界
 *
 * 链接纪律：每一条都指向真实存在的页面（由 @data/knowledge-hub 维护），
 * 菜单里不再出现从未建页的 /knowledge-hub/inspiration|resources/** 死链。
 */
const KNOWLEDGE_HUB_NAV_CHILDREN: NavColumn[] = KNOWLEDGE_HUB_GROUPS.map((group) => ({
	groups: [
		{
			heading: group.menuHeading ?? group.heading,
			headingHref: group.headingHref,
			items: group.items.map((item) => ({
				name: item.menuLabel ?? item.name,
				href: item.href,
			})),
		},
	],
}));

export const NAVIGATION: NavItem[] = [
	{
		name: 'Product Solutions',
		href: '/product-solutions/',
		lead: {
			name: 'Go to Product Solutions',
			href: '/product-solutions/',
		},
		children: [
			{
				groups: [
					{
						heading: 'By International Standards',
						headingHref: '/products/',
						items: [
							{ name: 'DIN Standards', href: '/products/din-titanium-fasteners/' },
							{ name: 'ISO Standards', href: '/products/iso-titanium-fasteners/' },
							{ name: 'ASTM / ASME Specs', href: '/products/astm-asme-titanium-fasteners/' },
						],
					},
				],
			},
			{
				groups: [
					{
						heading: 'Standard Titanium Fasteners',
						headingHref: '/products/',
						items: [
							{ name: 'Screws', href: categoryPath('screws') },
							{ name: 'Bolts', href: categoryPath('bolts') },
							{ name: 'Nuts', href: categoryPath('nuts') },
							{ name: 'Washers', href: categoryPath('washers') },
							{ name: 'Threaded Rods & Studs', href: '/products/bolts/?type=stud' },
						],
					},
				],
			},
			{
				groups: [
					{
						heading: 'Custom & Material Grades',
						headingHref: '/product-solutions/special-parts-and-custom-fasteners/',
						items: [
							{
								name: 'Custom CNC & Machining to Print',
								href: '/product-solutions/special-parts-and-custom-fasteners/',
							},
							{ name: 'Grade 2 (Pure Titanium)', href: materialHref('2') },
							{ name: 'Grade 5 (Ti-6Al-4V)', href: materialHref('5') },
							{ name: 'Grade 7 & Grade 23 (ELI)', href: materialHref('23') },
						],
					},
				],
			},
		],
	},
	{
		name: 'Services',
		href: '/services/',
		lead: {
			name: 'View All Manufacturing Services',
			href: '/services/',
		},
		children: [
			/*
			 * SERVICES PANEL — 供给侧三大护城河。
			 *
			 * 原面板是参考公司的「智能物流 + 工程咨询」（Smart Factory / Engineering /
			 * Benefits / Success Stories），与我们的工厂资产定位不符，且「Design
			 * Optimization & Validation」「Total Cost of Ownership」踩了做实测/设计
			 * 验证的红线。三列整体替换为制造能力 / 材料合规与包装 / 订单与交付。
			 *
			 * 三列标题指向已存在的 /services/（本仓没有族索引页，不能造死链）。
			 * 九条子项各对应一个本轮新建的占位详情页，内容下一轮补齐。
			 */
			{
				groups: [
					{
						heading: 'Manufacturing',
						headingHref: '/services/',
						items: [
							{
								name: 'Standard Fastener Production',
								href: '/services/manufacturing-capabilities/production-per-international-standards/',
							},
							{
								name: 'Custom CNC to Print',
								href: '/services/manufacturing-capabilities/cnc-machining-to-customer-drawings/',
							},
							{
								name: 'Cold Heading & Hot Forging',
								href: '/services/manufacturing-capabilities/cold-heading-hot-forging/',
							},
							{
								name: 'Surface Finishing & Anodizing',
								href: '/services/manufacturing-capabilities/surface-finishing-color-coding/',
							},
						],
					},
				],
			},
			{
				groups: [
					{
						heading: 'Quality & Packaging',
						headingHref: '/services/',
						items: [
							{
								name: 'EN 10204 3.1 MTC & Traceability',
								href: '/services/compliance-packaging/en-10204-31-mtc-traceability/',
							},
							{
								name: '100% PMI / XRF Grade Verification',
								href: '/services/compliance-packaging/pmi-xrf-grade-verification/',
							},
							{
								name: 'Distributor Labeling & Packaging',
								href: '/services/compliance-packaging/distributor-labeling-packaging/',
							},
						],
					},
				],
			},
			{
				groups: [
					{
						heading: 'Order & Fulfillment',
						headingHref: '/services/',
						items: [
							{
								name: 'Blanket Orders & Scheduled Delivery',
								href: '/services/order-fulfillment/blanket-orders-scheduled-delivery/',
							},
							{
								name: 'Fast Prototyping & Low MOQ',
								href: '/services/order-fulfillment/fast-prototyping-low-moq/',
							},
						],
					},
				],
			},
		],
	},
	{
		name: 'Industries',
		href: '/industries/',
		lead: {
			name: 'Go to Industries',
			href: '/industries/',
		},
		/*
		 * INDUSTRIES — 行业场景清单（2026-11-19 用户指定版）。
		 *
		 * 结构 = 3 列 × 1 组，每组只有条目（无组标题），共 10 个行业场景：
		 *   ① Aerospace & UAV / Medical Devices / Electric Vehicles
		 *   ② Chemical & Corrosion / Semiconductor & Vacuum / Desalination
		 *   ③ Marine & Offshore / Industrial Robotics / Rail & Rolling Stock /
		 *     Data Centers
		 *
		 * 链接：用户指定的新 slug（/industries/<slug>/）。
		 * 已知状态 —— 这些行业落地页**尚未建页**，本轮仅替换菜单文本与 URL，
		 * 页面与内链下一轮统一调整。
		 */
		children: [
			{
				groups: [
					{
						items: [
							{ name: 'Aerospace & UAV', href: '/industries/aerospace-uav/' },
							{ name: 'Medical Devices', href: '/industries/medical-devices/' },
							{ name: 'Electric Vehicles', href: '/industries/electric-vehicles/' },
						],
					},
				],
			},
			{
				groups: [
					{
						items: [
							{ name: 'Chemical & Corrosion', href: '/industries/chemical-corrosion/' },
							{ name: 'Semiconductor & Vacuum', href: '/industries/semiconductor-vacuum/' },
							{ name: 'Desalination', href: '/industries/desalination/' },
						],
					},
				],
			},
			{
				groups: [
					{
						items: [
							{ name: 'Marine & Offshore', href: '/industries/marine-offshore/' },
							{ name: 'Industrial Robotics', href: '/industries/industrial-robotics/' },
							{ name: 'Rail & Rolling Stock', href: '/industries/rail-rolling-stock/' },
							{ name: 'Data Centers', href: '/industries/data-centers/' },
						],
					},
				],
			},
		],
	},
	{
		name: 'Knowledge Hub',
		href: '/knowledge-hub/',
		lead: {
			name: 'Explore All Tools & Specs',
			href: '/knowledge-hub/',
		},
		children: KNOWLEDGE_HUB_NAV_CHILDREN,
	},
	{
		name: 'About us',
		href: '/about-us/',
		lead: {
			name: 'Go to About us',
			href: '/about-us/',
		},
		children: ABOUT_US_NAV_CHILDREN,
	},
] as const;

/* ───────────────────────────────────────────────────────────────────────────
   FOOTER — 本项目自己的页脚结构（2026-11-17 重构）。

   与参考站的关系：参考站（bossard）的五栏与法务行原样照抄会留下一批从未建页的
   死链（/knowledge-hub/resources/**、/about-us/careers/**、/legal/**），而且
   「Boze Metal」栏里只有一个「地址待提供」的占位符 —— 页脚既不能导航也不能转化。

   现在的四个职能与落位：
     ① 主导航延伸   → Products & Solutions / Services / Industries 三栏
     ② 次级页面补充 → Knowledge & Company 一栏（Knowledge Hub 工具 + About us 三组）
     ③ 重点业务强调 → Services 栏的 Custom CNC 高亮条目 + 联系栏的 Request a Quote CTA
     ④ 快速获取联系 → 独立的 Contact & RFQ 栏（公司名 / 地址 / 邮箱 / WhatsApp / 按钮）

   链接纪律（不可放宽）：每一条 href 都必须指向**已建页**的真实路由；
   页脚不保留任何指向未建页的占位链接，法律行整体移除（待法务页建成后再加回）。
   ─────────────────────────────────────────────────────────────────────────── */

export interface FooterItem {
	/** 链接文字。 */
	name: string;
	/** 目标 —— 必须是项目里真实存在的路由。 */
	href: string;
	/** 在标签前渲染参考站的右箭头图标。 */
	arrow?: boolean;
	/** 新标签页打开（外链）。 */
	external?: boolean;
	/** 用重点业务的强调样式渲染（核心转化业务）。 */
	highlight?: boolean;
}

export interface FooterColumn {
	/** 栏标题。 */
	heading: string;
	items: FooterItem[];
}

/**
 * 页脚四栏链接 —— 每一条都指向项目中**已建页**的真实路由。
 *
 * 与主导航（NAVIGATION）保持同源口径：
 *   · Products 栏 = Product Solutions 的四个子页 + Product Catalogue 总入口
 *   · Services 栏 = 供给侧三大护城河的 6 个代表能力页（CNC / 锻造 / 标准 / MTC / PMI / 订单）
 *   · Industries 栏 = 导航中已出现的行业落地页（aerospace / robotics / medical /
 *     semiconductors）+ 总览页
 *   · Knowledge & Company 栏 = 主导航没放下的次级高频入口（Knowledge Hub 三个工具页
 *     + About us 三组分组页）
 *
 * 不堆积原则：每栏 ≤ 8 条、锚文本缩写化（单行不折行）。
 */
export const FOOTER_COLUMNS: FooterColumn[] = [
	{
		heading: 'Products',
		items: [
			{ name: 'Product Solutions', href: '/product-solutions/' },
			{
				name: 'Custom Fasteners',
				href: '/product-solutions/special-parts-and-custom-fasteners/',
			},
			{
				name: 'Product Categories',
				href: '/product-solutions/product-categories-and-brands/',
			},
			{
				name: 'Fastener Coatings',
				href: '/product-solutions/components-specific-solutions/fastener-coatings/',
			},
			{ name: 'Innovations', href: '/product-solutions/innovations/' },
			{ name: 'All Products', href: '/products/', arrow: true },
		],
	},
	{
		heading: 'Services',
		items: [
			{
				name: 'CNC Machining',
				href: '/services/manufacturing-capabilities/cnc-machining-to-customer-drawings/',
				highlight: true,
			},
			{
				name: 'Cold & Hot Forging',
				href: '/services/manufacturing-capabilities/cold-heading-hot-forging/',
			},
			{
				name: 'Intl. Standards',
				href: '/services/manufacturing-capabilities/production-per-international-standards/',
			},
			{
				name: 'EN 10204 3.1 MTC',
				href: '/services/compliance-packaging/en-10204-31-mtc-traceability/',
			},
			{
				name: 'PMI / XRF Checks',
				href: '/services/compliance-packaging/pmi-xrf-grade-verification/',
			},
			{
				name: 'Blanket Orders',
				href: '/services/order-fulfillment/blanket-orders-scheduled-delivery/',
			},
			{ name: 'All Services', href: '/services/', arrow: true },
		],
	},
	{
		heading: 'Industries',
		items: [
			{ name: 'Aerospace & UAV', href: '/industries/aerospace-uav/' },
			{ name: 'Industrial Robotics', href: '/industries/industrial-robotics/' },
			{ name: 'Medical Devices', href: '/industries/medical-devices/' },
			{ name: 'Semiconductors', href: '/industries/semiconductor-vacuum/' },
			{ name: 'All Industries', href: '/industries/', arrow: true },
		],
	},
	{
		heading: 'Knowledge',
		items: [
			{
				name: 'Weight Estimator',
				href: '/knowledge-hub/tools/steel-to-titanium-weight-estimator/',
			},
			{
				name: 'Grade Supply Matrix',
				href: '/knowledge-hub/materials/titanium-grade-supply-matrix/',
			},
			{
				name: 'NDA & IP Policy',
				href: '/knowledge-hub/ip-protection/nda-ip-protection-policy/',
			},
			{ name: 'Factory', href: '/about-us/factory/' },
			{ name: 'Quality & Compliance', href: '/about-us/quality/' },
			{ name: 'Supply & Service', href: '/about-us/service/' },
			{ name: 'Knowledge Hub', href: '/knowledge-hub/', arrow: true },
			{ name: 'About us', href: '/about-us/', arrow: true },
		],
	},
];

/**
 * 页脚联系栏 —— 独立的一栏，承担「快速获取联系」与「重点业务强调」。
 *
 * 内容由客户于 2026-11-17 提供（工厂地址 + 邮箱 + WhatsApp）。
 * 电话行未提供（号码为 WhatsApp），因此只渲染 WhatsApp，不臆造座机号。
 */
export const FOOTER_CONTACT = {
	/** 公司主体名（与 SITE.legalName 同源）。 */
	company: 'Boze Metal',
	/**
	 * 极简地址行（页脚唯一可见的地址文案）—— 只到城市/省份一级。
	 * 极简风格：完整街道地址不占版面，改由「Get Directions」在地图中呈现。
	 */
	addressShort: 'Baoji, Shaanxi, China',
	/**
	 * 完整工厂地址（机器可读）：地图链接的搜索词 + 无障碍文本 + 未来接 JSON-LD 用。
	 * 注意：地图链接按**完整地址文本**搜索，不写死坐标——该地址尚未在 OSM/地图服务商
	 * 完成地理编码，写死坐标会在站内展示错误位置标记。
	 */
	addressFull:
		'C4 Workshop, North Area of High Tech Auto Parts, Business Incubation Base, FengHuang 10th Road, High Tech Development Zone, Baoji City, Shaanxi Province, P.R. China 721013',
	/** 「Get Directions」链接文案。 */
	mapsLabel: 'Get Directions',
	/**
	 * 地图搜索链接（外链，新窗口）。
	 * 用 Google Maps 的 api=1 搜索接口，query 为完整地址 —— 地图页会直接显示并定位
	 * 该完整地址。若需面向中国大陆访客，可换成高德 URI
	 * （https://uri.amap.com/search?keyword=<地址>），仅改本行即可。
	 */
	mapsUrl:
		'https://www.google.com/maps/search/?api=1&query=' +
		encodeURIComponent(
			'C4 Workshop, North Area of High Tech Auto Parts, Business Incubation Base, FengHuang 10th Road, High Tech Development Zone, Baoji City, Shaanxi Province, P.R. China 721013',
		),
	/**
	 * 地图嵌入地址（页内弹层用，懒加载）。
	 * `output=embed` 端点无需 API key；q 用完整地址，地图端实时解析定位。
	 */
	mapsEmbedUrl:
		'https://maps.google.com/maps?q=' +
		encodeURIComponent(
			'C4 Workshop, North Area of High Tech Auto Parts, Business Incubation Base, FengHuang 10th Road, High Tech Development Zone, Baoji City, Shaanxi Province, P.R. China 721013',
		) +
		'&output=embed',
	/** 业务邮箱。 */
	email: 'info@bozemetal.com',
	/** WhatsApp 联系号（含国际区号）。 */
	whatsapp: '+86-186-2391-9905',
	/** WhatsApp 深链（号码去掉 + 与连字符）。 */
	whatsappHref: 'https://wa.me/8618623919905',
	/** 主 CTA —— 直达本地询盘表单页。 */
	cta: { name: 'Request a Quote', href: '/contact/' },
	/** 次级入口 —— 直接打开邮件客户端。 */
	mailCta: { name: 'Email our engineering desk', href: 'mailto:info@bozemetal.com' },
} as const;

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
