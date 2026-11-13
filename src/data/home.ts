/**
 * src/data/home.ts — homepage content.
 *
 * PHASE A (1:1 COPY). Every string, image and link below is copied verbatim
 * from the reference site `https://www.bossard.com/global-en/`.
 * Nothing here is written by us, nothing is paraphrased.
 *
 * Each entry is registered in `docs/copy-ledger.md` (IDs H-0xx …).
 * In Phase B (before launch) the content is replaced with our own — that
 * replacement is driven by the ledger and touches THIS FILE ONLY:
 * components and styles stay untouched.
 *
 * Images are the reference site's originals, downloaded and localised to
 * `public/images/` (never hot-linked from the CDN).
 * Geometry: `docs/reference/homepage-outline.txt` (measured, 1440×1000).
 */

export interface HomeLink {
	label: string;
	href: string;
}

/* ── Block 1 · Hero ──────────────────────────────────────────────────────
   Reference: 792px tall, H2 at 64px, image ratio 2.006.               */
export const HERO = {
	/** 参考站隐藏 H1（sr-only），逐字照抄。 */
	heading: 'Bossard Group - Fasteners, Engineering, Logistics',
	/** 图片上的主标题（参考站为 H2，64px）。 */
	title: 'Discover Our Fastening Solutions in Our eShop',
	/** 副文案。参考站在 1440 视口下由 .hidden wd:block 控制 → 不渲染。 */
	sub: "We offer you a selection of more than 200'000 different standard and branded parts directly from stock – online available here.",
	href: '/eshop/',
	image: {
		src: '/images/01-eshop-herobanner-products.webp',
		alt: 'Various fastening elements on a blue background, illustrating their variety.',
		ratio: 2.006 as const,
	},
} satisfies {
	heading: string;
	title: string;
	sub: string;
	href: string;
	image: { src: string; alt: string; ratio: number };
};

/* ── Block 2 · Services (2×2 card grid) ─────────────────────────────────
   Reference: 946px, H2 44px, card H3 32px, image ratio 1.25,
   card heights 221/221/202/202 (unequal rows — reproduced by the grid). */
export const SERVICES = {
	heading: 'Our Fastening and Logistics Services',
	cards: [
		{
			heading: 'Engineering Services',
			body: 'Rooted in Swiss precision, we push the boundaries of productivity and quality in your products.',
			href: '/services/engineering/engineering-services/',
			image: {
				src: '/images/02-ate-keyvisual-with-gradient.webp',
				alt: 'Two colleagues in an industrial trial looking office.',
				ratio: 1.079 as const,
			},
			/** 参考站 lg:col-span-5 → 渲染 821×761 */
			span: 'lg:col-span-5',
			/** 参考站该卡无垂直偏移 */
			offset: '',
		},
		{
			heading: 'Smart Assembly',
			body: 'Accelerate your manufacturing digitalization with our Smart Factory Assembly solution.',
			href: '/services/smart-factory/smart-assembly/',
			image: {
				src: '/images/03-u6a1703-red-with-gradient.webp',
				alt: 'Smart Factory Assembly Guy with Tablet in his hands looking at the Dashboard with realt-time data',
				ratio: 0.75 as const,
			},
			/** 参考站 lg:col-span-3 → 渲染 511×681 */
			span: 'lg:col-span-3',
			/** 参考站 md:my-40 → 垂直下沉 40px */
			offset: 'md:my-40',
		},
	],
} satisfies {
	heading: string;
	cards: {
		heading: string;
		body: string;
		href: string;
		image: { src: string; alt: string; ratio: number };
		span: string;
		offset: string;
	}[];
};

/* ── Block 3 · Product solutions (two side-by-side callouts) ──────────
   Reference: 873px, TWO H2 headings at 32px (text-h4), NO background
   image — each callout carries its OWN image:
     left  callout — 505×673px image (ratio 0.752)
     right callout — 812×753px image (ratio 1.078)
   The callouts sit side by side with a 32px gap and a 117px vertical
   stagger (the right one is lower).                                */
export const PRODUCT_SOLUTIONS = {
	overlays: [
		{
			heading: 'Product Solutions',
			body: 'Find the right fastening solution – from standard parts to premium brands, special coatings or custom fasteners.',
			href: '/product-solutions/',
			image: {
				src: '/images/04-bn-219-ecosyn-grip-pan-head-screw-with-serrated-flange-with-gradient.webp',
				alt: 'Woman in business attire holding a screw in her hand',
				ratio: 0.75 as const,
			},
			/** 参考站 lg:col-span-3 → 渲染 511×681 */
			span: 'lg:col-span-3',
			/** 参考站 md:my-40 → 垂直下沉 40px */
			offset: 'md:my-40',
		},
		{
			heading: 'Inventory and C-Parts Management',
			body: 'Build a resilient supply chain with our smart inventory management services.',
			href: '/services/smart-factory/inventory-management/',
			image: {
				src: '/images/05-sfl-key-visual.webp',
				alt: 'Two people walk through the shop floor, the woman holding a tablet in her hand, the man pointing to a mobile trolley equipped with SmartLabel Cloud bins.',
				ratio: 1.079 as const,
			},
			/** 参考站 lg:col-span-5 → 渲染 821×761 */
			span: 'lg:col-span-5',
			offset: '',
		},
	],
} satisfies {
	overlays: {
		heading: string;
		body: string;
		href: string;
		image: { src: string; alt: string; ratio: number };
		span: string;
		offset: string;
	}[];
};

/* ── Block 4 · News (2×2, cards 634×202, H3 21px) ────────────────────────
   Reference: 524px.                                                        */
export const NEWS = {
	heading: 'News',
	items: [
		{
			date: '14 October 2026',
			title: 'Publication of Sales Results, 3rd Quarter 2026',
			body: 'Find more information on our investor relations site.',
			href: 'https://ir.bossard.com/news/sales-for-the-third-quarter-2026/67d8c104-b6f5-448a-ad9a-abe0791d9eb1',
			image: {
				src: '/images/06-bossard-nederland-6.webp',
				alt: 'Bossard Netherlands Office',
				ratio: 1 as const,
			},
		},
		{
			date: '24 August 2026',
			title: 'Our Team Is Competing in Their First Major Race Aboard the New Yacht',
			body: 'Swiss skipper Oliver Heer and his team races across the Atlantic Ocean. Bossard is prominently visible on sail and hull of the yacht "Embrace The Challenge". Follow the race on the live ticker!',
			href: '/about-us/news-and-media/press-releases/oliver-heer-the-ocean-race-atlantic/',
			image: {
				src: '/images/07-oliver-heer-ocean-race-atlantic.webp',
				alt: "Oliver Heer's racing yacht sailing on the sea.",
				ratio: 1 as const,
			},
		},
		{
			date: '21 July 2026',
			title: 'Semi Annual Report 2026',
			body: 'Find more information on our investor relations site.',
			href: 'https://ir.bossard.com/news/semi-annual-report-2026/1a1922f0-a978-4343-b6d0-f8768d60fb2b',
			image: {
				src: '/images/08-bossard-malaysia-1.webp',
				alt: 'Bossard Malaysia',
				ratio: 1 as const,
			},
		},
		{
			date: '',
			title: 'All Press Releases',
			body: 'Stay up-to-date with official announcements, updates, and statements from Bossard.',
			href: '/about-us/news-and-media/press-releases/',
			image: {
				src: '/images/09-news-and-media-image.webp',
				alt: 'A man reads a newspaper while another man next to him reads on his cell phone',
				ratio: 1 as const,
			},
		},
	],
	cta: { label: 'Read More', href: '/about-us/news-and-media/press-releases/' },
} satisfies {
	heading: string;
	items: {
		date: string;
		title: string;
		body: string;
		href: string;
		image: { src: string; alt: string; ratio: number };
	}[];
	cta: HomeLink;
};

/* ── Block 5 · Three pillars (H2 at 24px — smaller than other blocks) ────
   Reference: 344px, three headings all at 24px. Each pillar carries a
   48×48px ICON (not a photo) to the left of its heading. */
export const PILLARS = {
	items: [
		{
			heading: 'Our Secrets',
			icon: { src: '/images/10-your-benefit.svg', alt: 'Your benefit icon' },
			links: [
				{ label: 'Bossard Blog', href: '/knowledge-hub/inspiration/blog/' },
				{ label: 'White Papers', href: '/knowledge-hub/inspiration/white-papers/' },
			],
		},
		{
			heading: 'Our Expertise',
			icon: {
				src: '/images/11-assembly-technology-expert-standard-icon.svg',
				alt: 'ASSEMBLY TECHNOLOGY EXPERT - Standard Icon',
			},
			links: [
				{ label: 'Success Stories', href: '/knowledge-hub/inspiration/success-stories/' },
				{ label: 'Supplier Portal', href: '/supplier-portal/' },
			],
		},
		{
			heading: 'Who We Are',
			icon: { src: '/images/12-bossard-values.svg', alt: 'Bossard values icon' },
			links: [
				{ label: 'Who we are', href: '/about-us/who-we-are/' },
				{ label: 'Sustainability / ESG', href: '/about-us/sustainability/' },
				{ label: 'Careers', href: '/about-us/careers/' },
			],
		},
	],
} satisfies {
	items: {
		heading: string;
		icon: { src: string; alt: string };
		links: HomeLink[];
	}[];
};

/* ── Block 6 · Benefits (full-bleed, #cce4f3, headings BLACK) ──────────
   Reference: 1169px, 1905px wide (bleeds past the 1440px viewport),
   H2 44px in pure black rgb(0,0,0), 6 items in 2 columns × 3 rows,
   item headings 24px.                                                     */
export const BENEFITS = {
	heading: "What's in It for You?",
	items: [
		{
			title: 'Reduced Time to Market',
			body: 'Our customers’ products are brought to market faster – a crucial competitive advantage in a global environment.',
			icon: { src: '/images/13-time-to-market.svg', alt: 'Time to market icon' },
		},
		{
			title: 'Leaner Processes and Automation',
			body: 'We boost effectiveness and improve efficiency by optimizing your processes.',
			icon: { src: '/images/14-lean-process.svg', alt: 'Lean process icon' },
		},
		{
			title: 'Cost-Saving Rationalization',
			body: 'Saving time, money, and resources, being able to better calculate total costs – above all, achieving higher margins.',
			icon: { src: '/images/15-better-throughput.svg', alt: 'Throughput icon' },
		},
		{
			title: 'Higher Quality and Safety',
			body: 'Absolute reliability in terms of product, process and production safety. Less waste and fewer complaints.',
			icon: { src: '/images/16-high-quality.svg', alt: 'Quality icon' },
		},
		{
			title: 'Design Optimization',
			body: 'With us you can successfully forge new paths and go where no competitor has gone before.',
			icon: { src: '/images/17-innovation.svg', alt: 'Innovation icon' },
		},
		{
			title: 'PLUS: Reduce your TCO',
			body: 'Everything we do is designed to reduce your total cost of ownership (TCO). Explore the secret of 15-85.',
			icon: { src: '/images/18-maximum-reliability.svg', alt: 'Maximum reliability icon' },
		},
	],
	cta: { label: 'Discover Your Benefits', href: '/services/benefits/' },
} satisfies {
	heading: string;
	items: { title: string; body: string; icon: { src: string; alt: string } }[];
	cta: HomeLink;
};

/* ── Block 7 · Sustainability CTA (full-bleed, white) ───────────────────
   Reference: 1013px, 1905px wide, H2 44px.                              */
export const SUSTAINABILITY = {
	/** 参考站在图上浮层里的小标签（16px） */
	label: 'Sustainability at Bossard',
	heading: 'Enabling Sustainable Assembly Operations Worldwide',
	body: 'Discover how Bossard contributes to efficient, eco-friendly assembly operations that support global sustainability goals.',
	image: {
		src: '/images/19-sustain-esg-keyvisual-rz.webp',
		alt: 'A group of people standing in a green space that has the shape of a footprint',
		ratio: 1.333 as const,
	},
	cta: { label: 'Read More', href: '/about-us/sustainability/' },
} satisfies {
	label: string;
	heading: string;
	body: string;
	image: { src: string; alt: string; ratio: number };
	cta: HomeLink;
};
