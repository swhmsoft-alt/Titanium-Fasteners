/**
 * Innovations — 1:1 data for `/product-solutions/innovations/`.
 *
 * MEASURED on the reference (1440×1000, 2026-11-10):
 *   hero      figure x=745 y=267 643×514 (5:4) | contact card x=920 w=362
 *   carousel  5 cards, 316 wide, h=305/305/276/276/305, y=1277
 *   article   y=2187 h=512 H2 44px "What We Offer You"
 *             grid y=2260, 3 cols × 428.33, row pitch 220, card h=210
 *   cta       "Contact Us" button y=2892 x=70 140×49
 *
 * Every string, link and image below was read off the reference DOM.
 */

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

export interface ContactForm {
	title: string;
	countries: string[];
	fields: string[];
	messageLabel: string;
	consent: string;
	consentHref: string;
	submit: string;
}

export interface InnovationItem {
	image: string;
	alt: string;
	imageWidth: number;
	imageHeight: number;
	caption: string;
}

export interface OfferItem {
	icon: string;
	alt: string;
	title: string;
	description: string;
}

export const INNOVATIONS = {
	seo: {
		title: 'Innovations',
		description:
			'Explore new and innovative fastening technologies at Bossard — from high-strength aluminum and titanium fasteners to invisible fastening connections. Or bring your own idea and let us make it a success.',
	},

	hero: {
		breadcrumb: [
			{
				label: 'Bossard Group - Fasteners, Engineering, Logistics',
				href: '/',
			},
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Innovations' },
		] as BreadcrumbItem[],
		eyebrow: 'Product Solutions',
		heading: 'Innovative Fasteners: The Future of Fastening Technology',
		lead: 'Explore new and innovative fastening technologies at Bossard. Or are you an inventor yourself? Contact us to make your idea come to life!',
		image: '/images/innovations/01-a-futuristic-drone-soaring-above-a-cityscape-sym.webp',
		imageAlt:
			'A futuristic drone soaring above a cityscape, symbolizing the advancement of drone delivery technology.',
		imageWidth: 634,
		imageHeight: 507,
	},

	form: {
		title: 'Contact Us',
		countries: [
			'Select',
			'Other country',
			'Albania',
			'Argentina',
			'Australia',
			'Austria',
			'Belarus',
			'Belgium',
			'Bosnia and Herzegovina',
			'Brazil',
			'Bulgaria',
			'Canada',
			'China',
			'Croatia',
			'Czech Republic',
			'Denmark',
			'Egypt',
			'Estonia',
			'Finland',
			'France',
			'Germany',
			'Greece',
			'Hungary',
			'Iceland',
			'India',
			'Ireland',
			'Israel',
			'Italy',
			'Latvia',
			'Lithuania',
			'Malaysia',
			'Mexico',
			'Moldova',
			'Netherlands',
			'North Macedonia',
			'Norway',
			'Poland',
			'Portugal',
			'Republic of Korea',
			'Romania',
			'Serbia',
			'Singapore',
			'Slovakia',
			'Slovenia',
			'South Africa',
			'Spain',
			'Sweden',
			'Switzerland',
			'Taiwan',
			'Thailand',
			'Turkey',
			'Ukraine',
			'United Kingdom',
			'United States',
			'Vietnam',
		],
		fields: ['First Name', 'Last Name', 'E-Mail', 'Company'],
		messageLabel: 'Your Message',
		consent: 'By submitting this form I consent to the',
		consentHref: '/legal/privacy-policy/',
		submit: 'Submit',
	} as ContactForm,

	intro: [
		'At Bossard, we continuously develop innovative fasteners and new processing techniques. Our focus is always on functionality and safety over the product lifetime, maximum productivity in production, and sustainability across the entire value chain.',
		'For these innovative fasteners, our R&D Fastening Technology works closely with established brand partners, start-ups, and our internal engineering departments around the world. The functionality and manufacturability of these innovations have already been verified – they are now available for validation as part of joint pilot projects.',
	],

	innovations: {
		heading: 'Our Fastening Innovations',
		items: [
			{
				image: '/images/innovations/02-a-high-strength-eska-aluminum-fastener-on-a-whit.webp',
				alt: 'A high-strength ESKA aluminum fastener on a white background.',
				imageWidth: 300,
				imageHeight: 169,
				caption:
					'ESKA® HA-Schraubengarnituren are lightweight, high-strength aluminum fasteners for preloadable aluminum structures.',
			},
			{
				image: '/images/innovations/03-close-up-of-a-jextar-titan-high-strength-titaniu.webp',
				alt: 'Close-up of a Jextar® Titan high-strength titanium fastener',
				imageWidth: 300,
				imageHeight: 169,
				caption:
					'Jextar® Titan high-strength fasteners are designed for extreme temperatures and aggressive environments.',
			},
			{
				image: '/images/innovations/04-pem-ghost-fasteners-for-invisible-connections.webp',
				alt: 'PEM® Ghost fasteners for invisible connections',
				imageWidth: 300,
				imageHeight: 169,
				caption:
					'PEM® Ghost is a fastening connection that is invisible, secure, yet easy to release for authorized personnel.',
			},
			{
				image: '/images/innovations/05-ecosyn-sef-stainless-steel-contact-fitting-faste.webp',
				alt: 'ecosyn SEF stainless steel contact fitting fastener',
				imageWidth: 300,
				imageHeight: 169,
				caption: 'The ecosyn® SEF inox is a 3-in-1 contact fitting made from stainless steel.',
			},
			{
				image: '/images/innovations/06-two-pem-castsert-press-in-threaded-inserts-on-wh.webp',
				alt: 'Two PEM CastSert press-in threaded inserts on white background',
				imageWidth: 300,
				imageHeight: 169,
				caption:
					'PEM® CastSerts are stainless steel press-in threaded inserts for strong threads in soft metals and die-cast alloys.',
			},
		] as InnovationItem[],
	},

	yourInnovation: {
		heading: 'Your Innovation in Fastening Technology',
		paragraphs: [
			'Do you have an innovative fastening idea? We’ve got the know-how to make it a success! Whether you are in the early stages with just an idea, in the process of refining your prototype, or you’re ready to go to market with your invention: Bossard is your partner of choice to make it happen.',
			'Why? We strive to find solutions to global fastening challenges every day and we know how to navigate the innovation process. In our years of experience, we have successfully implemented innovations in-house and with brand partners and external institutions. We know the nuts and bolts of the business.',
			'Together, we can make your idea come to life.',
		],
	},

	offers: {
		heading: 'What We Offer You',
		items: [
			{
				icon: '/images/innovations/14-engineering-icon.svg',
				alt: 'Engineering icon',
				title: 'Expert Know-How',
				description:
					'Benefit from 190 years of experience and our expertise in materials, technologies, coatings, and more.',
			},
			{
				icon: '/images/innovations/15-design-icon.svg',
				alt: 'Design icon',
				title: 'Development Support',
				description:
					'Our online calculators, CAD portal, and services for prototypes and small series assist you in development.',
			},
			{
				icon: '/images/innovations/16-inspection-of-a-screw.svg',
				alt: 'Inspection of a screw',
				title: 'Concept Testing',
				description:
					'With our technical test labs, you can make sure your products meet necessary requirements.',
			},
			{
				icon: '/images/innovations/17-check-icon.svg',
				alt: 'Check Icon',
				title: 'Market Check',
				description:
					'You’ve got an idea but are unsure about its market potential? We can help you assess it.',
			},
			{
				icon: '/images/innovations/18-global-logistic-icon.svg',
				alt: 'Global logistic icon',
				title: 'Global Network',
				description: 'Benefit from our strong global sourcing and distribution network.',
			},
			{
				icon: '/images/innovations/19-partnership-icon.svg',
				alt: 'Partnership icon',
				title: 'Secure Partnership',
				description:
					'Your idea is safe with us. We value transparency as well as fair and reliable partnerships',
			},
		] as OfferItem[],
	},

	nextStep: {
		heading: 'Ready to go the Next Step with Your Innovation?',
		buttonLabel: 'Contact Us',
		dialogImage: '/images/innovations/20-two-people-discussing-design-of-a-fastener.webp',
		dialogImageAlt: 'Two people discussing design of a fastener.',
		dialogImageWidth: 740,
		dialogImageHeight: 317,
	},
};
