/**
 * Fastener Coatings — the JSON-LD graph for this page.
 *
 * Service describes the titanium surface-finishing work we perform and the
 * standards we work to; FAQPage reuses the very same answers the <details>
 * elements render; BreadcrumbList mirrors the visible breadcrumb. Every
 * value is taken from the page data, so the structured data can never point
 * at a route or a standard that is not on the page.
 */
import { FINISHES } from './finishes';
import { FAQ } from './faq';

const CANONICAL_PATH = '/product-solutions/components-specific-solutions/fastener-coatings/';

export function buildCoatingsJsonLd(site: { url: string; name: string; legalName: string }) {
	const pageUrl = new URL(CANONICAL_PATH, site.url).href;

	return [
		{
			'@context': 'https://schema.org',
			'@type': 'Service',
			'@id': `${pageUrl}#service`,
			name: 'Titanium Fastener Coatings and Surface Finishes',
			serviceType: 'Titanium fastener surface finishing',
			description:
				'Factory-direct surface finishing for titanium fasteners: plain as-machined, ' +
				'chemical passivation to ASTM F86 and AMS 2700, anodic oxide to AMS 2488 ' +
				'Type II and Type III, and vacuum-deposited PVD and DLC coatings.',
			provider: {
				'@type': 'Organization',
				'@id': `${site.url}#organization`,
				name: site.name,
				legalName: site.legalName,
				url: site.url,
			},
			areaServed: 'Worldwide',
			url: pageUrl,
			hasOfferCatalog: {
				'@type': 'OfferCatalog',
				name: 'Titanium fastener surface states',
				itemListElement: FINISHES.map((finish) => ({
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Service',
						name: finish.name,
						description: finish.summary,
					},
				})),
			},
		},
		{
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			'@id': `${pageUrl}#faq`,
			mainEntity: FAQ.map((item) => ({
				'@type': 'Question',
				name: item.question,
				acceptedAnswer: { '@type': 'Answer', text: item.answer },
			})),
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Product Solutions',
					item: `${site.url}/product-solutions/`,
				},
				{ '@type': 'ListItem', position: 3, name: 'Fastener Coatings', item: pageUrl },
			],
		},
	];
}
