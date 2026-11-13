/**
 * scripts/download-reference-assets.mjs — 把参考站首页资产下载到本地。
 *
 * Phase A（1:1 照抄）用：参考站的图片、图标、Logo 是本站的**唯一素材来源**。
 * 但**禁止热链** Contentful CDN（`*.ctfassets.net`）—— 直链会因
 * Referer / CORS / 链接失效随机破图。因此统一「下载 → 落盘 → 引本地路径」。
 *
 * 输入：docs/reference/homepage-source.json（由 extract-reference.mjs 生成）
 * 产物：public/images/*  +  docs/reference/homepage-assets.json（映射表）
 *
 * 用法：node scripts/download-reference-assets.mjs
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'docs/reference/homepage-source.json';
const OUT_DIR = 'public/images';
const MAP = 'docs/reference/homepage-assets.json';

const source = JSON.parse(readFileSync(SRC, 'utf8'));
mkdirSync(OUT_DIR, { recursive: true });

const EXT_BY_TYPE = {
	'image/webp': 'webp',
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/svg+xml': 'svg',
	'image/gif': 'gif',
	'image/avif': 'avif',
};

const slug = (s) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 70);

const assets = [];
let failed = 0;

for (const [i, im] of source.images.entries()) {
	// src 属性里的 `&` 在 HTML 中被转义为 `&amp;`，直接请求会得到 HTTP 400。
	const raw = im.src.replace(/&amp;/g, '&');
	const url = raw.startsWith('//') ? `https:${raw}` : raw;
	const base = url.split('/').pop().split('?')[0];
	const stem = slug(base.replace(/\.[a-z]+$/i, ''));
	const provisional = join(OUT_DIR, `${String(i + 1).padStart(2, '0')}-${stem}`);

	let buf;
	let type = '';
	try {
		const res = await fetch(url, {
			headers: {
				'referer': 'https://www.bossard.com/',
				'user-agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
					'(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
			},
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		type = (res.headers.get('content-type') ?? '').split(';')[0].trim();
		buf = Buffer.from(await res.arrayBuffer());
	} catch (err) {
		failed++;
		console.error(`FAIL ${i + 1} ${url} :: ${err.message}`);
		continue;
	}

	const ext = EXT_BY_TYPE[type] ?? (base.match(/\.([a-z]+)$/i)?.[1]?.toLowerCase() ?? 'bin');
	const file = `${provisional}.${ext}`;
	writeFileSync(file, buf);

	assets.push({
		index: i + 1,
		alt: im.alt,
		referenceUrl: url,
		localPath: `/images/${file.replace(/\\/g, '/').split('/').pop()}`,
		bytes: buf.length,
		contentType: type,
		referencePixels: im.width && im.height ? `${im.width}×${im.height}` : null,
	});

	console.log(
		`${String(i + 1).padStart(2)} ${String(buf.length).padStart(7)}B ${type.padEnd(14)} ` +
			`→ ${file}`,
	);
}

writeFileSync(MAP, JSON.stringify({ source: source.url, fetchedAt: source.fetchedAt, assets }, null, 2));
console.log(`\nOK ${assets.length} / ${source.images.length}  (failed ${failed})`);
console.log(`map → ${MAP}${existsSync(OUT_DIR) ? '' : ' [no dir]'}`);
