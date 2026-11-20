/**
 * Product Solutions — the single data source for `/product-solutions/`.
 *
 * The page is assembled from four solution bands (standard supply, custom
 * manufacturing, surface engineering, compliance) plus a hero and a
 * two-channel close. The hero is deliberately compact — one lead paragraph,
 * three credential tags and two CTA channels — so the first screen stays
 * level against the 4:3 figure column.
 */
import { PATHS } from './routes';
import { STANDARD_SUPPLY } from './standard-supply';
import { CUSTOM_MANUFACTURING } from './custom-manufacturing';
import { SURFACE_ENGINEERING } from './surface-engineering';
import { COMPLIANCE } from './compliance';
import { AUDIENCE } from './audience';
import { CROSS_REFERENCE, GRADES } from './routes';
import type { BreadcrumbItem } from './types';

export * from './types';
export { CROSS_REFERENCE, GRADES, PATHS } from './routes';

export const PRODUCT_SOLUTIONS = {
seo: {
title:
'Titanium Fastener Supply Solutions — Standards, Custom Parts & Anti-Galling Finishes',
description:
'Titanium fastening supply from a source factory: standard parts to DIN, ISO and ASTM, custom CNC-machined parts to your drawing under NDA, and titanium surface engineering for anti-galling, wear and assembly identification.',
},
hero: {
breadcrumb: [
{ label: 'Home', href: PATHS.home },
{ label: 'Product Solutions' },
] as BreadcrumbItem[],
eyebrow: 'Titanium Fastener Supply Solutions',
heading: 'Titanium Fastener Supply Solutions for Distributors and OEM Buyers',
/** 主描述 —— 严格控制在 40 词以内，避免首屏文字列被拉高。 */
lead:
'Boze Metal is a source titanium fastener factory serving distributors and OEM engineering teams. We supply DIN, ISO, and ASTM standard parts from stock and machine print-to-part components under NDA—backed by anti-galling finishes and full lot traceability.',
/** 3 枚紧凑厂方资质标签 —— 替代原先冗长的第二段文字。 */
credentials: [
'DIN / ISO / ASTM · M1.6–M36',
'EN 10204 3.1 MTC & 100% XRF',
'In-House CNC & QA Verified',
],
/**
 * Legacy slot: the long second paragraph has been dropped from the hero.
 * The page still forwards this key, so it stays in the contract only.
 */
statement: undefined,
/** 一行极简厂方声明 — E-E-A-T 实体信任，不占片面。 */
factoryNote:
'Every process, tolerance and compliance parameter on this page is ' +
'approved directly by the Boze Metal workshop production and quality team.',
facts: [
{ label: 'Thread range', value: 'M1.6–M36, M1–M1.5 made to order' },
{ label: 'Grades', value: 'Grade 2, Grade 5, Grade 23 (ELI)' },
{ label: 'Standards', value: 'DIN, ISO, ASTM F467 / F468' },
{ label: 'Certificate', value: 'EN 10204 3.1 per heat number' },
],
primaryCta: { label: 'Explore Standard Catalogue', href: PATHS.products },
secondaryCta: { label: 'Submit Drawing (NDA)', href: PATHS.contact },
image: {
src: '/images/public-images/product-solutions-hero-titanium-fastener-production.webp',
alt: 'Titanium hex socket head cap screws to DIN 912, Grade 5 and Grade 2, arranged on a stainless steel inspection bench.',
},
},
standardSupply: STANDARD_SUPPLY,
customManufacturing: CUSTOM_MANUFACTURING,
surfaceEngineering: SURFACE_ENGINEERING,
compliance: COMPLIANCE,
audience: AUDIENCE,
/** 牌号对照表 —— 名义公布值（来自 @data/products）。 */
grades: GRADES,
/** DIN ↔ ISO 交叉对照表（来自 @data/products）。 */
crossReference: CROSS_REFERENCE,
secondaryLinks: [
{ label: 'Product catalogue', href: PATHS.products },
{ label: 'Titanium grade supply matrix', href: PATHS.gradeMatrix },
{ label: 'Steel-to-titanium weight estimator', href: PATHS.estimator },
{ label: 'Factory & production', href: PATHS.aboutFactory },
{ label: 'Quality & compliance', href: PATHS.aboutQuality },
{ label: 'Supply & service', href: PATHS.aboutService },
{ label: 'All services', href: PATHS.services },
{ label: 'NDA & IP policy', href: PATHS.nda },
],
} as const;