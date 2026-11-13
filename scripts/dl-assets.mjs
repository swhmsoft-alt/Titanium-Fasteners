/**
 * scripts/dl-assets.mjs — localise the reference page's images.
 *
 * Reads a probe JSON (scripts/probe-ref.mjs output), downloads every image
 * referenced by `figures[]` into `public/images/<page>/` and writes a
 * manifest mapping reference URL → local path.
 *
 * Usage:
 *   node scripts/dl-assets.mjs qa/ref/eshop.json --out-dir public/images/eshop
 *
 * Rules
 * -----
 * - Resumable: a file that already exists and is non-empty is skipped.
 * - Bounded concurrency (default 8). The reference CDN is slow and sometimes
 *   never answers; a serial loop with no timeout blocks on the first hanging
 *   request and the manifest at the end of the file is never written.
 * - Every fetch has a hard timeout and is retried a few times.
 * - Picks the LARGEST candidate from `srcset` (retina-ready) but keeps the
 *   reference's own `src` as the manifest key, so the page code can keep
 *   using one path per image.
 * - Writes a UTF-8 manifest next to the output directory.
 * - Never hot-links the reference CDN: every asset is downloaded.
 */
import { mkdirSync, writeFileSync, existsSync, statSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const args = process.argv.slice(2);
const probeFile = args.find((a) => !a.startsWith('--'));
if (!probeFile) {
	console.error('usage: node scripts/dl-assets.mjs <probe.json> [--out-dir public/images/<page>]');
	process.exit(1);
}
const flag = (name, fallback) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : fallback;
};
const OUT_DIR = flag('--out-dir', 'public/images/page');
const MANIFEST = flag('--manifest', `${OUT_DIR}/_manifest.json`);
const TIMEOUT_MS = Number(flag('--timeout', '15000'));
const RETRIES = Number(flag('--retries', '2'));
const CONCURRENCY = Math.max(1, Number(flag('--concurrency', '8')));

const probe = JSON.parse(readFileSync(probeFile, 'utf8'));
mkdirSync(OUT_DIR, { recursive: true });

const slug = (s) =>
	String(s || '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 48) || 'image';

/**
 * Extension of a reference image URL.
 *
 * The reference CDN does NOT put the format in the path — it ends in a
 * meaningless segment ("…/mediasrv%2Fproducts%2F01_100_CGI") and carries the
 * real format in the `fm=` query parameter. Deriving the extension from the
 * path alone therefore produces files named "*.CGI", which no browser will
 * ever render. Prefer `fm=`, fall back to the path, then to webp.
 */
const extOf = (url) => {
	const fm = /[?&]fm=([a-z0-9]+)/i.exec(url);
	if (fm) return '.' + fm[1].toLowerCase();
	const path = url.split('?')[0];
	const e = extname(path);
	if (e && e.length <= 6 && /^\.[a-z0-9]+$/i.test(e)) return e.toLowerCase();
	return '.webp';
};

/** Pick the highest-resolution candidate the reference offers. */
const bestCandidate = (fig) => {
	if (fig.srcset) {
		const list = fig.srcset
			.split(',')
			.map((s) => s.trim().split(/\s+/))
			.filter((p) => p.length === 2)
			.map(([u, d]) => ({ u, w: parseInt(d, 10) || 0 }))
			.sort((a, b) => b.w - a.w);
		if (list.length) return { url: list[0].u, width: list[0].w };
	}
	return { url: fig.src, width: (fig.natural && fig.natural[0]) || 0 };
};

/* One source list for every image on the page: the <figure> boxes first (they
   carry the layout-critical ratios), then every remaining <img> (logos, card
   art, icons). The same URL may appear in both lists — it is downloaded once
   and the manifest maps every occurrence to the same local file. */
const sources = [
	...(probe.figures ?? []),
	...(probe.images ?? []).filter((im) => !im.inFigure),
];

/* Group by absolute URL: the first occurrence decides the local file name,
   every later occurrence reuses it (and therefore its manifest entry). */
const groups = new Map();
for (const [i, fig] of sources.entries()) {
	if (!fig.src) continue;
	const abs = new URL(fig.src, probe.url).href;
	const existing = groups.get(abs);
	if (existing) {
		existing.srcs.push(fig.src);
		continue;
	}
	const cand = bestCandidate(fig);
	const target = new URL(cand.url, probe.url).href;
	const name = `${String(i + 1).padStart(2, '0')}-${slug(fig.alt || cand.url)}${extOf(target)}`;
	groups.set(abs, {
		abs,
		srcs: [fig.src],
		target,
		file: join(OUT_DIR, name),
		localPath: `/${OUT_DIR.replace(/\\/g, '/').replace(/^\//, '')}/${name}`,
		ok: false,
	});
}

const manifest = {};
let downloaded = 0;
let skipped = 0;
let failed = 0;

const fetchOne = async (g) => {
	for (let attempt = 0; attempt <= RETRIES; attempt++) {
		try {
			const res = await fetch(g.target, {
				headers: { 'user-agent': 'Mozilla/5.0 (reference-asset-localiser)' },
				signal: AbortSignal.timeout(TIMEOUT_MS),
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const buf = Buffer.from(await res.arrayBuffer());
			writeFileSync(g.file, buf);
			return true;
		} catch (err) {
			if (attempt === RETRIES) console.error(`FAIL ${g.abs} -> ${err.message}`);
		}
	}
	return false;
};

const todo = [];
for (const g of groups.values()) {
	if (existsSync(g.file) && statSync(g.file).size > 0) {
		skipped++;
		g.ok = true;
	} else {
		todo.push(g);
	}
}

let cursor = 0;
const worker = async () => {
	while (cursor < todo.length) {
		const g = todo[cursor++];
		if (await fetchOne(g)) {
			downloaded++;
			g.ok = true;
		} else {
			failed++;
		}
	}
};
await Promise.all(
	Array.from({ length: Math.min(CONCURRENCY, Math.max(todo.length, 1)) }, worker),
);

for (const g of groups.values()) {
	if (!g.ok) continue;
	for (const s of g.srcs) manifest[s] = g.localPath;
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, '\t'), 'utf8');
console.log(
	`sources ${sources.length}  unique ${groups.size}  ` +
		`downloaded ${downloaded}  skipped ${skipped}  failed ${failed}`,
);
console.log(`  -> ${OUT_DIR}`);
console.log(`  -> ${MANIFEST}`);
