/**
 * Industries — data entry point for `@data/industries`.
 *
 * The former `src/data/industries.ts` held the reference site's generic
 * industry tiles, a data-centre callout and a contact form. Those sections
 * were removed from the page, so the module was replaced by this folder:
 *
 *   · `hub.ts` — the content of the rebuilt `/industries/` page.
 *
 * The CMS-style industry grid (IndustryCard) and the reference-site
 * aerospace page that consumed it were retired together with the old
 * industry sub-pages; the ten application pages carry their own data
 * modules under src/data/industries-*.ts.
 */
export * from './hub';
