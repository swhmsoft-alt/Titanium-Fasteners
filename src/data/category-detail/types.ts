/**
 * 品类子页的共享类型 —— 由 scripts/gen-category-detail.mjs 维护。
 * 12 个品类子页共用同一套结构，只有数据不同。
 */
export interface Crumb {
	label: string;
	href?: string;
}

export interface HeroButton {
	label: string;
	href?: string;
	kind: 'link' | 'dialog';
	variant: 'primary' | 'secondary';
}

export interface BrandTile {
	href: string;
	image: string;
	alt: string;
	label: string;
	title: string;
	description: string;
}

export interface ServiceCard {
	href: string;
	image: string;
	alt: string;
	label: string;
	title: string;
	description: string;
}

export type RichBlock =
	| { kind: 'heading'; text: string }
	| { kind: 'paragraph'; text: string }
	| { kind: 'list'; items: { lead: string; text: string }[] };

export interface CategoryDetailPage {
	slug: string;
	seo: { title: string; description: string };
	hero: {
		breadcrumb: Crumb[];
		eyebrow: string;
		heading: string;
		lead: string;
		image: string;
		imageAlt: string;
		imageWidth: number;
		imageHeight: number;
		buttons: HeroButton[];
	};
	intro: string;
	video: { heading: string; thumbnail: string; thumbnailAlt: string; caption: string };
	richText: RichBlock[];
	brands: { heading: string; tiles: BrandTile[] };
	note: { text: string; linkLabel: string; linkHref: string; linkSuffix: string } | null;
	services: { cards: ServiceCard[] };
}
