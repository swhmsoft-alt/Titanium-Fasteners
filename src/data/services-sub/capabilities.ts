/**
 * capabilities.ts — 供给侧三大护城河的 9 个占位详情页数据。
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * Services 大菜单已从参考站（智能物流 / 工程咨询）换成我们自己的供给侧能力：
 *   ① Manufacturing Capabilities   ② Compliance & Packaging   ③ Order & Fulfillment
 * 这 9 个条目各自需要一个真实可达的落地页。路由与页面骨架先建好，
 * 正文内容由 ./capability-content.ts 提供（正式内容，可手改）。
 *
 * SHAPE
 * -----
 * 与既有 services-sub 数据保持一致（见 smart-factory-inventory-management.ts）：
 *   slug / path / seo / hero / blocks
 *   hero 只渲染 breadcrumb、eyebrow、heading、lead 四项（ServiceHero.astro），
 *   因此 hero **不挂图片**——避免把参考站的人像照挂到我们自己的页面上。
 *   blocks 由 capability-content.ts 组装成六段：正文 → 图文带 → 事实表 →
 *   FAQ → 相关出口 → 询盘 CTA。
 *
 * BRANDING
 * --------
 * 面包屑与文案使用自有品牌（Titanium Fasteners / Boze Metal），不出现参考公司名称，
 * 也不出现「设计验证 / 实测 / TCO」等踩红线的表述。
 */

import type { SubBlock } from './smart-factory-inventory-management';
import { CAPABILITY_CONTENT } from './capability-content';

export interface CapabilityBreadcrumb {
	label: string;
	href?: string;
}

export interface CapabilityHero {
	breadcrumb: CapabilityBreadcrumb[];
	eyebrow: string;
	heading: string;
	lead: string;
}

export interface CapabilityPage {
	slug: string;
	/** 不含前导斜杠，也不含 'services/' 前缀 —— 路由模板会拼成 /services/<path>/ */
	path: string;
	seo: { title: string; description: string };
	hero: CapabilityHero;
	blocks: SubBlock[];
}

/** 族（列）标题 —— 同时用于面包屑中间层与菜单分组标题。 */
const FAMILY_LABELS: Record<string, string> = {
	'manufacturing-capabilities': 'Manufacturing Capabilities',
	'compliance-packaging': 'Compliance & Packaging',
	'order-fulfillment': 'Order & Fulfillment',
};

interface CapabilitySeed {
	family: string;
	slug: string;
	eyebrow: string;
	heading: string;
	lead: string;
	description: string;
}

const SEEDS: CapabilitySeed[] = [
	/* ── ① Manufacturing Capabilities ───────────────────────────────── */
	{
		family: 'manufacturing-capabilities',
		slug: 'production-per-international-standards',
		eyebrow: 'Manufacturing Capabilities',
		heading: 'Production per International Standards',
		lead:
			'Volume production of standard fasteners built to DIN, ISO and ASTM specifications, ' +
			'with a documented route for every lot we ship.',
		description:
			'Batch production to DIN, ISO and ASTM specifications with per-lot production records.',
	},
	{
		family: 'manufacturing-capabilities',
		slug: 'cnc-machining-to-customer-drawings',
		eyebrow: 'Manufacturing Capabilities',
		heading: 'Titanium CNC Machining to Customer Drawings',
		lead:
			'Custom-machined and special-thread fasteners produced to your drawings, ' +
			'from sample quantities through to series production.',
		description:
			'Custom-machined parts and special threads made to customer drawings, from samples to series.',
	},
	{
		family: 'manufacturing-capabilities',
		slug: 'cold-heading-hot-forging',
		eyebrow: 'Manufacturing Capabilities',
		heading: 'Cold Heading & Hot Forging',
		lead:
			'Cold heading and hot forging routes selected per part geometry, giving each part ' +
			'the mechanical properties its material is meant to deliver.',
		description:
			'Cold heading and hot forging process routes matched to part geometry and material.',
	},
	{
		family: 'manufacturing-capabilities',
		slug: 'surface-finishing-color-coding',
		eyebrow: 'Manufacturing Capabilities',
		heading: 'Surface Finishing & Color Coding',
		lead:
			'Pickling, passivation and industrial anodised colour coding applied so grades ' +
			'stay distinguishable on the shop floor and in transit.',
		description:
			'Pickling, passivation and industrial anodised colour coding for grade identification.',
	},
	/* ── ② Compliance & Packaging ───────────────────────────────────── */
	{
		family: 'compliance-packaging',
		slug: 'en-10204-31-mtc-traceability',
		eyebrow: 'Compliance & Packaging',
		heading: 'EN 10204 3.1 MTC & Traceability',
		lead:
			'EN 10204 3.1 material certificates tied to the heat number of every lot, ' +
			'so the material can be traced back to the mill.',
		description:
			'EN 10204 3.1 material certificates with heat-number traceability back to the mill.',
	},
	{
		family: 'compliance-packaging',
		slug: 'pmi-xrf-grade-verification',
		eyebrow: 'Compliance & Packaging',
		heading: '100% PMI / XRF Grade Verification',
		lead:
			'Every part is screened by spectrometer before dispatch, so the grade named on ' +
			'the certificate is the grade that arrives.',
		description:
			'100% spectrometer grade screening of every part before dispatch, with no mixed-grade shipments.',
	},
	{
		family: 'compliance-packaging',
		slug: 'distributor-labeling-packaging',
		eyebrow: 'Compliance & Packaging',
		heading: 'Distributor Labeling & Packaging',
		lead:
			'A standing packaging service for distributor programmes: your label, your barcodes and ' +
			'your carton marks applied to every lot under NDA, with export protection for the route.',
		description:
			'A standing distributor packaging service — customer labelling under NDA, written ' +
			'labelling instructions and export protection confirmed before production.',
	},
	/* ── ③ Order & Fulfillment ──────────────────────────────────────── */
	{
		family: 'order-fulfillment',
		slug: 'blanket-orders-scheduled-delivery',
		eyebrow: 'Order & Fulfillment',
		heading: 'Blanket Orders & Scheduled Delivery',
		lead:
			'Framework agreements with scheduled call-offs and staged deliveries, so one agreed ' +
			'schedule covers your production plan.',
		description:
			'Blanket orders with scheduled call-offs and staged deliveries against one agreed schedule.',
	},
	{
		family: 'order-fulfillment',
		slug: 'fast-prototyping-low-moq',
		eyebrow: 'Order & Fulfillment',
		heading: 'Fast Prototyping & Low MOQ',
		lead:
			'Fast-turn samples and development runs, with low minimum order quantities for both ' +
			'catalogue items and bespoke parts.',
		description:
			'Fast-turn samples and development runs with low minimum order quantities.',
	},
];

/** 把一条种子数据展开成完整的页面对象。 */
function buildPage(seed: CapabilitySeed): CapabilityPage {
	const familyLabel = FAMILY_LABELS[seed.family];
	const label = seed.heading;
	return {
		slug: seed.slug,
		path: `${seed.family}/${seed.slug}`,
		seo: {
			/*
			 * 不要在这里拼 '| Titanium Fasteners' —— BaseLayout 已经用 SITE.name
			 * 统一追加一次，重复拼会让 title 变成
			 * '... | Titanium Fasteners | Titanium Fasteners'（超长且重复）。
			 */
			title: label,
			description: seed.description,
		},
		hero: {
			breadcrumb: [
				{ label: 'Home', href: '/' },
				{ label: 'Services', href: '/services/' },
				{ label: familyLabel },
				{ label },
			],
			eyebrow: seed.eyebrow,
			heading: label,
			lead: seed.lead,
		},
		blocks: buildBlocks(seed),
	};
}

/**
 * 把一页的正文素材组装成六个 block：
 *   正文 → 图文带（唯一一张 4:3 图）→ 事实表 → FAQ → 相关出口 → 询盘 CTA。
 * 顺序刻意为「先讲事实、再给出口」，符合 B2B 采购的阅读动线。
 */
function buildBlocks(seed: CapabilitySeed): SubBlock[] {
	const content = CAPABILITY_CONTENT[seed.slug];
	if (!content) {
		throw new Error(`capability-content.ts 缺少 slug "${seed.slug}" 的正文素材`);
	}
	return [
		{
			kind: 'richText',
			tag: 'div',
			heading: null,
			body: content.body.map((text) => ({
				text,
				strong: null,
				strongAt: null,
			})),
		},
		{
			kind: 'capabilityBand',
			heading: content.bandHeading,
			lead: content.bandLead,
			highlights: content.highlights,
			image: content.image,
		},
		{
			kind: 'specTable',
			heading: 'At a glance',
			rows: content.facts,
		},
		{
			kind: 'faq',
			heading: 'Frequently asked questions',
			items: content.faq,
		},
		{
			kind: 'relatedTopics',
			heading: 'Related services and information',
			items: content.related,
		},
		{
			kind: 'capabilityCta',
			heading: 'Request a quotation',
			description:
				'Send us the standard, the grade, the size range and the quantity. ' +
				'Our engineering team replies with a quotation and the material certificates within 12 business hours.',
			cta: { label: 'Send your inquiry', href: '/contact/' },
		},
	];
}

/**
 * 9 个占位详情页 —— 路由与菜单共用这一份清单。
 * family/slug 与 /services/<family>/<slug>/ 一一对应。
 */
export const CAPABILITY_PAGES: { family: string; slug: string; page: CapabilityPage }[] =
	SEEDS.map((seed) => ({
		family: seed.family,
		slug: seed.slug,
		page: buildPage(seed),
	}));
