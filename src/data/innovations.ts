/**
 * Innovations — data for `/product-solutions/innovations/`.
 *
 * THEME (2026-11-25): the page is no longer a generic "innovation" showcase.
 * It is the titanium-material story: grade selection → forming/machining route
 * → surface (anti-galling) engineering → verification → lot documentation.
 *
 * CONTENT RULES
 * ------------
 * 1. Every technical value comes from `data/products/**` (materials, finishes,
 *    standards) or from existing site facts (M1.6–M36, EN 10204 3.1, PMI/XRF).
 * 2. No invented test data, no friction/torque coefficients, no company history
 *    claims, no third-party brand names.
 * 3. Every image path must exist under `public/images/`.
 * 4. Internal links may only point at real routes (see @data/product-solutions
 *    PATHS / @data/grade-paths).
 */

export interface BreadcrumbItem {
	label: string;
	href?: string;
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
		title: 'Titanium Fastening Innovation',
		description:
			'Titanium fastening innovation at grade level: CP Grade 2, Grade 5 Ti-6Al-4V, Grade 9 and Grade 23 ELI, forming and CNC routes per geometry, anti-galling surface finishes, PMI/XRF verification and EN 10204 3.1 lot documentation.',
	},

	hero: {
		breadcrumb: [
			{
				label: 'Home',
				href: '/',
			},
			{ label: 'Product Solutions', href: '/product-solutions/' },
			{ label: 'Innovations' },
		] as BreadcrumbItem[],
		eyebrow: 'Product Solutions',
		heading: 'Titanium Fastening Innovation Starts With the Material',
		lead: 'Grade, forming route, surface and documentation are decided together, because on titanium each one changes how the joint behaves.',
		image: '/images/public-images/product-solutions-hero-titanium-fastener-production.webp',
		imageAlt:
			'Titanium fasteners in production, formed and machined from titanium bar stock.',
		imageWidth: 1600,
		imageHeight: 1200,
		primaryCta: { label: 'Request a Quote', href: '/contact/' },
		secondaryCta: { label: 'See Grade 2 Fasteners', href: '/products/grade-2-fasteners/' },
	},

	intro: [
		'A titanium fastener is not a steel fastener with a different colour. The grade sets the strength and the temperature ceiling, the forming route sets the thread and the fatigue behaviour, and the surface decides whether two titanium threads bond to each other under load. We work on all four together, because changing one without the others is how a joint fails in service.',
		'The material arrives as certified titanium bar or billet, and it leaves as a finished, labelled part with its own production record. Everything we change — cold heading, CNC machining, anodising, passivation, PVD or DLC — is agreed against your drawing and your service condition before the lot is scheduled.',
	],

	grades: {
		heading: 'The Titanium Grades We Form, Machine and Supply',
		lead: 'Published values for the grades we work with. The grade is agreed against the service condition before the material is drawn.',
	},

	innovations: {
		heading: 'Five Decisions That Define a Titanium Fastener',
		items: [
			{
				image: '/images/public-images/industries-corrosion-marine-grade2-titanium-fasteners.webp',
				alt: 'Grade 2 commercially pure titanium fasteners for corrosive and marine environments.',
				imageWidth: 1600,
				imageHeight: 1200,
				caption:
					'Grade 2 commercially pure titanium — 275 MPa proof, 345 MPa tensile, usable to 300 °C. Chosen where corrosion resistance decides the grade, not strength.',
			},
			{
				image: '/images/public-images/industries-aerospace-grade5-titanium-fasteners.webp',
				alt: 'Grade 5 Ti-6Al-4V titanium fasteners for aerospace structures.',
				imageWidth: 1600,
				imageHeight: 1200,
				caption:
					'Grade 5 Ti-6Al-4V — 828 MPa proof strength, 895 MPa tensile, 4.43 g/cm³. AMS 4928 bar stock where aerospace traceability is required.',
			},
			{
				image: '/images/public-images/industries-cleanroom-grade23-titanium-parts.webp',
				alt: 'Grade 23 ELI titanium parts for cleanroom and medical use.',
				imageWidth: 1600,
				imageHeight: 1200,
				caption:
					'Grade 23 ELI — 790 MPa proof strength with the extra ductility of the ELI chemistry, specified for cleanroom and medical implant tooling.',
			},
			{
				image: '/images/public-images/product-solutions-surface-engineering-anodised-titanium-fasteners.webp',
				alt: 'Anodised titanium fasteners with a black anodic oxide finish.',
				imageWidth: 1600,
				imageHeight: 1200,
				caption:
					'AMS 2488 Type II and III anodising, AMS 2700 / ASTM F86 passivation, PVD and DLC. On titanium the finish is specified for galling, wear and identification — not for rust protection.',
			},
			{
				image: '/images/public-images/services-quality-titanium-inspection.webp',
				alt: 'Inspection of titanium fasteners on the shop floor.',
				imageWidth: 1600,
				imageHeight: 1200,
				caption:
					'PMI and XRF verification on incoming titanium, with inspection results written up against the heat number and released as an EN 10204 3.1 certificate per lot.',
			},
		] as InnovationItem[],
	},

	yourInnovation: {
		heading: 'Your Part, Our Engineering',
		paragraphs: [
			'Bring us a drawing, a joint condition or a problem you could not solve with a catalogue fastener. We start from the material: commercially pure Grade 2 for corrosive service, Grade 5 for strength with low weight, Grade 9 where the joint runs above 300 °C, Grade 23 ELI for cleanroom and medical work.',
			'From there the route is chosen per geometry. Where the shape allows it, the part is cold headed and the thread rolled from certified wire. Where the tolerance, the thread form or the material does not allow cold forming, it is machined from ASTM B348 bar stock on CNC, and quoted as a machined part rather than as a catalogue item.',
			'In both cases the lot leaves with the same documentation: the certificate, the inspection record and the packaging that keeps grades and lots apart in your warehouse.',
		],
	},

	offers: {
		heading: 'What We Do With Your Titanium Fastener',
		items: [
			{
				icon: '/images/innovations/14-engineering-icon.svg',
				alt: 'Engineering icon',
				title: 'Grade Selection',
				description:
					'Grade 2, Grade 5, Grade 9 and Grade 23 ELI, selected against the service condition and quoted with the published values for that grade.',
			},
			{
				icon: '/images/innovations/15-design-icon.svg',
				alt: 'Design icon',
				title: 'Route per Geometry',
				description:
					'Cold heading with rolled threads where the shape allows it, CNC machining where the tolerance or the material does not.',
			},
			{
				icon: '/images/innovations/16-inspection-of-a-screw.svg',
				alt: 'Inspection of a screw',
				title: 'Anti-Galling Finishes',
				description:
					'AMS 2488 anodising, AMS 2700 / ASTM F86 passivation, PVD or DLC, chosen for the joint rather than for appearance.',
			},
			{
				icon: '/images/innovations/17-check-icon.svg',
				alt: 'Check Icon',
				title: 'Material Verification',
				description:
					'PMI and XRF on incoming titanium, so the material behind the certificate is the material in the part.',
			},
			{
				icon: '/images/innovations/18-global-logistic-icon.svg',
				alt: 'Global logistic icon',
				title: 'Lot Traceability',
				description:
					'One production record per lot, carried through forming, heat treatment, machining and finishing under the heat number.',
			},
			{
				icon: '/images/innovations/19-partnership-icon.svg',
				alt: 'Partnership icon',
				title: 'Secure Partnership',
				description:
					'Drawings are handled under NDA where the project requires it, and the same documentation follows every repeat order.',
			},
		] as OfferItem[],
	},

	nextStep: {
		heading: 'Send Us the Joint and We Will Answer With a Route',
		lead: 'Send the drawing, the grade you need and the service condition. We reply with the forming or machining route, the finish and the documentation the lot will carry.',
		buttonLabel: 'Request a Quote',
		buttonHref: '/contact/',
		image: '/images/public-images/product-solutions-oem-custom-titanium-part-drawn.webp',
		imageAlt: 'A titanium part machined to a customer drawing.',
		imageWidth: 1500,
		imageHeight: 1000,
	},
};
