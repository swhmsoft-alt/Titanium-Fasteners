/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: npm run gen:industries-aerospace
 *
 * Source: qa/ref/industries-aerospace.html  (Bossard Aerospace, Welcome to Bossard Aerospace)
 */

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

export interface TeaserCard {
	href: string;
	image: string;
	alt: string;
	imageWidth: number;
	imageHeight: number;
	span: 'wide' | 'narrow';
	title: string;
	description: string;
}

export interface NewsItem {
	href: string;
	image: string;
	alt: string;
	date: string;
	title: string;
	body: string;
}

export interface SupportCard {
	icon: string;
	iconAlt: string;
	title: string;
	description: string;
}

export interface ContactLink {
	label: string;
	value: string;
	href: string;
}

export interface ContactEntry {
	company: string;
	address: string[];
	phone: ContactLink | null;
	email: ContactLink | null;
}

export interface ContactCountry {
	country: string;
	entries: ContactEntry[];
}

export interface LinkCard {
	icon: string;
	iconAlt: string;
	heading: string;
	links: { label: string; href: string }[];
}

export const AEROSPACE = {
	seo: {
		title: 'Bossard Aerospace: Fasteners for Aerospace | Bossard Group',
		description: "With over 55 years of experience, Bossard Aerospace is committed to collaborating with customers to find the most suitable fastening solutions. Our goal is to enhance your supply chain, reduce costs, and meet your specific aerospace needs.",
	},
	hero: {
		breadcrumb: [
			{ label: "Bossard Group - Fasteners, Engineering, Logistics", href: "/global-en/" },
			{ label: "Industries", href: "/global-en/industries/" },
			{ label: "Aerospace" },
		] as BreadcrumbItem[],
		eyebrow: "Bossard Aerospace",
	heading: "Welcome to Bossard Aerospace",
	lead: "With over 55 years of experience, Bossard Aerospace is committed to collaborating with customers to find the most suitable fastening solutions. Our goal is to enhance your supply chain, reduce costs, and meet your specific aerospace needs.",
		image: {
			src: "/images/industries-aerospace/01-airplane-with-bossard-aerospace-logo-in-the-sky-.webp",
			alt: "Airplane with Bossard Aerospace logo in the sky with logo overlay",
			width: 634,
			height: 507,
		},
	},
	teasers: [
		[
			{
				href: "/global-en/industries/aerospace/aerospace-fastening-solutions/",
				image: "/images/industries-aerospace/02-airplane-and-parts-illustration-with-gradient-ov.webp",
				alt: "airplane and parts illustration with gradient overlay",
				imageWidth: 834,
				imageHeight: 667,
				span: "wide",
				title: "Aerospace Fastening Solutions",
				description: "From metrics and imperial standard parts, to built-to-print part according to your requirements.",
			},
			{
				href: "/global-en/industries/aerospace/aerospace-engineering-and-services/",
				image: "/images/industries-aerospace/03-two-men-reviewing-cad-engineering-drawings-and-3.webp",
				alt: "Two men reviewing CAD engineering drawings and 3D models on dual computer monitors in a modern office workspace.",
				imageWidth: 530,
				imageHeight: 707,
				span: "narrow",
				title: "Engineering & Services",
				description: "We offer a wide range of engineering services to support your projects, from the design phase to component optimization.",
			},
		],
		[
			{
				href: "/global-en/industries/aerospace/supplier-network-aerospace/",
				image: "/images/industries-aerospace/04-aerial-view-and-top-view-cargo-plane-flying-abov.webp",
				alt: "Aerial view and top view cargo plane flying above ship port in the export and import business and Smart logistics international goods. Shipping cargo to harbor by crane stock photo",
				imageWidth: 530,
				imageHeight: 707,
				span: "narrow",
				title: "Supplier Network",
				description: "Partner with Bossard Aerospace for exceptional C-parts distribution.",
			},
			{
				href: "/global-en/industries/aerospace/about-bossard-aerospace/",
				image: "/images/industries-aerospace/05-aircraft-wing-and-enging-landed-with-gradient.webp",
				alt: "Aircraft wing and enging landed with gradient",
				imageWidth: 834,
				imageHeight: 667,
				span: "wide",
				title: "About Bossard Aerospace",
				description: "From the legacy of Boysen, Interfast, and Aero Negoce International (ANI), our journey has been shaped by decades of distribution knowhow, technical expertise, and service excellence.",
			},
		],
		[
			{
				href: "/global-en/industries/aerospace/working-at-bossard-aerospace/",
				image: "/images/industries-aerospace/06-team-picture-of-bossard-aerospace-in-front-of-th.webp",
				alt: "Team picture of Bossard Aerospace in front of the warehouse building",
				imageWidth: 834,
				imageHeight: 667,
				span: "wide",
				title: "Working at Bossard Aerospace",
				description: "Want to join a team of passionate people in an exciting industry? Find out more about career opportunities at Bossard Aerospace.",
			},
			{
				href: "/global-en/industries/aerospace/about-bossard-aerospace/contacts-and-locations/",
				image: "/images/industries-aerospace/07-a-close-up-of-an-airplane-engine-situated-in-a-h.webp",
				alt: "A close-up of an airplane engine situated in a hangar with blue walls, highlighting its mechanical features.",
				imageWidth: 530,
				imageHeight: 707,
				span: "narrow",
				title: "Contacts and Locations",
				description: "From Europe to America and Asia, we have teams around the world to support you locally. Find out more.",
			},
		],
	],
	news: {
		heading: "News Overview",
		items: [
			{
				href: "/global-en/industries/aerospace/about-bossard-aerospace/aerospace-news/beyond-the-catalog-why-aerospace-fastener-design-review-drives-weight-safety-and-schedule/",
				image: "/images/industries-aerospace/08-3-people-reviewing-design-and-fasteners-with-bos.webp",
				alt: "3 people reviewing design and fasteners with Bossard Aerospace wall background",
				date: "October 2026",
				title: "Beyond the Catalog: Why Aerospace Fastener Design Review Matters",
				body: "How weight reduction, surface treatment, and installation optimization protect performance across the aircraft lifecycle.",
			},
			{
				href: "/global-en/industries/aerospace/about-bossard-aerospace/aerospace-news/aero-negoce-international-is-moving-to-a-new-site-in-beziers/",
				image: "/images/industries-aerospace/09-aero-negoce-international-logo.webp",
				alt: "Aero Negoce International Logo",
				date: "September 2026",
				title: "Aero Negoce International is moving to a new site in Béziers",
				body: "Aero Negoce International, a Bossard company, is preparing to relocate its operations to a new site in Béziers. A modern, larger site to support the continued development of our operations.",
			},
			{
				href: "/global-en/industries/aerospace/about-bossard-aerospace/aerospace-news/2026-automotive-and-aerospace-nearshoring-summit-chihuahua-mexico/",
				image: "/images/industries-aerospace/10-aerospace-summit-chihuhua-2026-logo.webp",
				alt: "Aerospace Summit Chihuhua 2026 logo",
				date: "August 2026",
				title: "2026 Automotive & Aerospace Nearshoring Summit Chihuahua, Mexico",
				body: "Bossard Aerospace to Showcase Fastening and Smart Factory Solutions at the 2026 Automotive & Aerospace Nearshoring Summit",
			},
			{
				href: "/global-en/industries/aerospace/about-bossard-aerospace/aerospace-news/aerospace-and-defense-meeting-sevilla-2026/",
				image: "/images/industries-aerospace/11-aerospace-and-defense-meeting-sevilla-logo.webp",
				alt: "Aerospace and Defense Meeting Sevilla Logo",
				date: "May 2026",
				title: "Aerospace and Defense Meeting Sevilla 2026",
				body: "Bossard Aerospace to exhibit at Aerospace & Defense Meetings Sevilla 2026",
			},
			{
				href: "/global-en/industries/aerospace/about-bossard-aerospace/aerospace-news/mro-america-orlando-2026/",
				image: "/images/industries-aerospace/12-mro-americas-logo.webp",
				alt: "MRO Americas logo",
				date: "April 2026",
				title: "Meet Bossard Aerospace in MRO America in Orlando",
				body: "The global aviation maintenance community will soon gather in Orlando for one of the industry’s key events—and Bossard Aerospace will be there.",
			},
			{
				href: "/global-en/industries/aerospace/about-bossard-aerospace/aerospace-news/aix-hamburg-2026/",
				image: "/images/industries-aerospace/13-aircraft-interiors-expo-logo.webp",
				alt: "Aircraft Interiors Expo logo",
				date: "April 2026",
				title: "Join Bossard Aerospace at AIX Hamburg 2026",
				body: "Bossard Aerospace will be exhibiting at the Aircraft Interiors Expo (AIX) 2026 in Hamburg – the leading event for cabin innovation and passenger experience.",
			},
		],
	},
	video: {
		heading: "Your Trusted C-Parts Management Partner",
		poster: "https://img.youtube.com/vi/rXLP9ov3gvE/maxresdefault.jpg",
		posterAlt: "Aerospace | Your Trusted C-Parts Management Partner in Aerospace",
	},
	support: {
		heading: "How We Support You in Aerospace Manufacturing",
		cards: [
			{
				icon: "/images/industries-aerospace/14-fasteners-icon.svg",
				iconAlt: "Fasteners icon",
				title: "Wide Range of High-Availability Products",
				description: "With 40,000+ active SKUs in imperial and metric standards, we ensure high availability to meet your needs.",
			},
			{
				icon: "/images/industries-aerospace/15-design-icon.svg",
				iconAlt: "Design icon",
				title: "Tailored Engineering Solutions",
				description: "Our fastening and assembly experts are ready to tackle any engineering challenges you face.",
			},
			{
				icon: "/images/industries-aerospace/16-increasing-product-quality-icon.svg",
				iconAlt: "Increasing product quality icon",
				title: "Increase Your Product Quality",
				description: "From standard to custom parts, we partner with top suppliers and a certified lab to ensure top quality.",
			},
			{
				icon: "/images/industries-aerospace/17-maximizing-flexibility-in-production-icon.svg",
				iconAlt: "Maximizing flexibility in production icon",
				title: "Boost Flexibility in Your Production",
				description: "We automate workflows and use real-time data to reduce downtime, ensuring materials are always available.",
			},
			{
				icon: "/images/industries-aerospace/18-supply-chain-management-icon.svg",
				iconAlt: "Supply chain management icon",
				title: "Simplify and Automate your Supply Chain",
				description: "IoT and data-driven solutions keep materials available, reducing manual effort in your supply chain.",
			},
			{
				icon: "/images/industries-aerospace/19-transparency-in-process-icon.svg",
				iconAlt: "Transparency in process icon",
				title: "Enhance Transparency",
				description: "Real-time inventory insights help you reduce bottlenecks and optimize material flow for smooth production.",
			},
		],
	},
	contacts: {
		heading: "Bossard Aerospace Contacts",
		countries: [
			{
				country: "Germany",
				entries: [
					{
						company: "Bossard Aerospace Germany GmbH Munich Main Office",
						address: ["Kapellenstr. 9", "85622 Feldkirchen", "Germany"],
						phone: { label: "Phone:", value: "+49 (0) 89 427421-0", href: "tel:+49894274210" },
						email: { label: "E-Mail:", value: "info.aero-de@bossard.com", href: "mailto:info.aero-de@bossard.com" },
					},
					{
						company: "Hamburg Office",
						address: ["Suederstrasse 288", "20537 Hamburg", "Germany"],
						phone: { label: "Phone:", value: "+49 (0) 40 2190712-10", href: "tel:+49402190712" },
						email: { label: "E-Mail:", value: "info.aero-de@bossard.com", href: "mailto:info.aero-de@bossard.com" },
					},
				],
			},
			{
				country: "Switzerland",
				entries: [
					{
						company: "Bossard Aerospace Switzerland AG",
						address: ["Steinhauserstrasse 70", "CH-6301 Zug"],
						phone: { label: "Phone:", value: "+41 41 749 64 16", href: "tel:+41417496416" },
						email: { label: "E-Mail:", value: "info@bossard-aerospace.ch", href: "mailto:info@bossard-aerospace.ch" },
					},
				],
			},
			{
				country: "France",
				entries: [
					{
						company: "Aero Negoce International France",
						address: ["ZAC de Mercorent", "33 Rue Alphonse Beau de Rochas", "34500 Béziers", "France"],
						phone: { label: "Phone:", value: "+ 33 4 67 35 33 33", href: "tel:+33467353333" },
						email: { label: "E-Mail:", value: "contact@aeronegoce.com", href: "mailto:contact@aeronegoce.com" },
					},
				],
			},
			{
				country: "USA",
				entries: [
					{
						company: "Bossard Aerospace U.S. Inc.",
						address: ["3050 W. Story Road", "Irving, TX 75038, USA"],
						phone: { label: "Phone:", value: "+1 469 629 0660", href: "tel:+14696290660" },
						email: { label: "E-Mail:", value: "info.aero-us@bossard.com", href: "mailto:info.aero-us@bossard.com" },
					},
				],
			},
			{
				country: "Malaysia",
				entries: [
					{
						company: "Aero Negoce International Malaysia",
						address: ["Unit 2A - Level 6", "Jalan Stesen Sentral 5", "50470 Kuala Lumpur", "Malaysia", "Phone : +60 (0)327 146 180", "E-Mail : contact@aeronegoce.com"],
						phone: { label: "Phone:", value: "+60 (0)327 146 180", href: "tel:+6327146180" },
						email: { label: "E-Mail:", value: "contact@aeronegoce.com", href: "mailto:contact@aeronegoce.com" },
					},
				],
			},
		],
	},
	linkGrids: [
		{
			cards: [
				{
					icon: "/images/industries-aerospace/20-products-solutions-standard-icon.svg",
					iconAlt: "Products solutions - standard icon",
					heading: "Product Solutions",
					links: [
						{ label: "Metric and Imperial Fasteners", href: "/global-en/industries/aerospace/aerospace-fastening-solutions/metric-and-imperial-fasteners-for-aerospace/" },
						{ label: "Built-to-Print Parts", href: "/global-en/industries/aerospace/aerospace-fastening-solutions/built-to-print-parts/" },
						{ label: "Innovative Solutions for Interior", href: "/global-en/product-solutions/product-categories-and-brands/welding-technology/mm-welding/" },
					],
				},
				{
					icon: "/images/industries-aerospace/21-engineering-icon.svg",
					iconAlt: "Engineering icon",
					heading: "Engineering & Services",
					links: [
						{ label: "Engineering and Services", href: "/global-en/industries/aerospace/aerospace-engineering-and-services/" },
						{ label: "Built-to-Print Parts", href: "/global-en/industries/aerospace/aerospace-fastening-solutions/built-to-print-parts/" },
					],
				},
				{
					icon: "/images/industries-aerospace/22-suppliers-icon.webp",
					iconAlt: "Suppliers icon",
					heading: "Supplier Base",
					links: [
						{ label: "Supplier Network", href: "/global-en/industries/aerospace/supplier-network-aerospace/" },
						{ label: "Terms and Conditions", href: "/global-en/industries/aerospace/about-bossard-aerospace/legal-and-certificates/" },
					],
				},
			],
		},
		{
			cards: [
				{
					icon: "/images/industries-aerospace/23-aerospace-icon.svg",
					iconAlt: "Aerospace icon",
					heading: "About Bossard Aerospace",
					links: [
						{ label: "Who We Are", href: "/global-en/industries/aerospace/about-bossard-aerospace/" },
						{ label: "History", href: "/global-en/industries/aerospace/about-bossard-aerospace/bossard-aerospace-history/" },
						{ label: "Career", href: "/global-en/industries/aerospace/working-at-bossard-aerospace/" },
					],
				},
				{
					icon: "/images/industries-aerospace/24-contact-icon.svg",
					iconAlt: "Contact icon",
					heading: "News and Contacts",
					links: [
						{ label: "Aerospace News", href: "/global-en/industries/aerospace/about-bossard-aerospace/aerospace-news/" },
						{ label: "Contacts and Locations", href: "/global-en/industries/aerospace/about-bossard-aerospace/contacts-and-locations/" },
						{ label: "Follow Us on LinkedIn", href: "https://www.linkedin.com/company/bossard-aerospace" },
					],
				},
				{
					icon: "/images/industries-aerospace/25-download-icon.svg",
					iconAlt: "Download icon",
					heading: "Legal and Downloads",
					links: [
						{ label: "Terms and Conditions and Certificates", href: "/global-en/industries/aerospace/about-bossard-aerospace/legal-and-certificates/" },
						{ label: "Imprint", href: "/global-en/industries/aerospace/about-bossard-aerospace/imprint-bossard-aerospace/" },
					],
				},
			],
		},
	],
};
