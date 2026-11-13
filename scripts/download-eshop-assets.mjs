/**
 * scripts/download-eshop-assets.mjs
 *
 * Downloads the 16 eShop product-category images from the reference site and
 * localises them into `public/images/eshop/`.
 *
 * Reference source pattern (measured on the reference site, 2026-11):
 *   https://www.bossard.com/eshopmedia/mediasrv%2Fproducts%2F<MEDIA_ID>
 *     ?q=75&fm=webp&fit=contain&p=center&w=<W>&h=<H>
 *
 * The reference ships a `srcset` with widths 165 / 206 / 234 / 240 / 250 / 266.
 * We localise the two widths that matter for the 1440px acceptance viewport:
 * 240×160 (1×) and 480×320 (2×, retina).
 *
 * Usage: node scripts/download-eshop-assets.mjs
 */
import { mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = join(process.cwd(), 'public', 'images', 'eshop');

/** media id → local file stem. Copied 1:1 from the reference DOM. */
const ASSETS = {
	'01_100_CGI': '01-standard-fastening-elements',
	'01_200_CGI': '02-direct-assembly-screws',
	'01_300_CGI': '03-securing-and-anti-loosening-elements',
	'01_400_CGI': '04-clamping-and-positioning-elements',
	'01_500_CGI': '05-anchorage-systems',
	'02_300_CGI': '06-clinching-technology',
	'02_5000_CGI': '07-rivet-technology',
	'02_100_CGI': '08-threaded-inserts',
	'02_600_CGI': '09-clip-fasteners',
	'02_400_CGI': '10-welding-technology',
	'02_550_CGI': '11-ultrasonic-welding',
	'02_200_CGI': '12-embedding-and-surface-bonding-fasteners',
	'03_100_CGI': '13-electrical-products',
	'03_200_CGI': '14-access-solutions',
	'03_300_CGI': '15-fluid-management',
	'03_400_CGI': '16-sealing-technology',
};

/**
 * [width, height] variant, mirroring the reference's srcset width at the
 * 1440px acceptance viewport.
 *
 * NOTE: the media server ignores `w`/`h` and always returns the 480×320
 * master, so a single variant is downloaded (2× the 240px CSS box, i.e.
 * retina-ready) instead of duplicating the same bytes under two names.
 */
const VARIANTS = [[480, 320]];

mkdirSync(OUT_DIR, { recursive: true });

const log = [];

for (const [mediaId, stem] of Object.entries(ASSETS)) {
	for (const [w, h] of VARIANTS) {
		const file = join(OUT_DIR, `${stem}@${w}.webp`);
		if (existsSync(file) && statSync(file).size > 0) {
			log.push(`skip  ${mediaId} ${w}x${h}`);
			continue;
		}
		const url =
			`https://www.bossard.com/eshopmedia/mediasrv%2Fproducts%2F${mediaId}` +
			`?q=75&fm=webp&fit=contain&p=center&w=${w}&h=${h}`;
		try {
			const res = await fetch(url, {
				headers: { 'user-agent': 'Mozilla/5.0 (reference-asset-localiser)' },
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const buf = Buffer.from(await res.arrayBuffer());
			writeFileSync(file, buf);
			log.push(`ok    ${mediaId} ${w}x${h} → ${buf.length} bytes`);
		} catch (err) {
			log.push(`FAIL  ${mediaId} ${w}x${h} → ${err.message}`);
		}
	}
}

console.log(log.join('\n'));
