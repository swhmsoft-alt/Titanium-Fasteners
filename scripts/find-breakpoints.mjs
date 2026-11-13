/**
 * scripts/find-breakpoints.mjs — 取参考站的自定义断点（wd / ul 等）真值。
 *
 * 参考站使用 Tailwind 语义化变体前缀，其中 `wd:` 与 `ul:` 不在标准命名里。
 * 参考站首页实测显示二者在 1440px 视口下**已经生效**（hero 图高 680px、
 * 浮层 max-width 680px、收益区 details padding-top 106px），
 * 因此必须取到它们的 min-width 真值，否则照抄类名会渲染成不同尺寸。
 *
 * 产物：docs/reference/breakpoints.json
 */

import { writeFileSync } from 'node:fs';

const PAGE = 'https://www.bossard.com/global-en/';
const UA =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
	'(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

const html = await (await fetch(PAGE, { headers: { 'user-agent': UA } })).text();

/* Collect stylesheet URLs: <link rel=stylesheet> and url(...) imports. */
const urls = new Set();
for (const m of html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)) {
	const href = /href=["']([^"']+)["']/i.exec(m[0])?.[1];
	if (href) urls.add(new URL(href, PAGE).href);
}
for (const m of html.matchAll(/@import\s+url\(["']?([^"')]+)["']?\)/gi)) {
	urls.add(new URL(m[1], PAGE).href);
}
for (const m of html.matchAll(/<script[^>]+src=["']([^"']+\.m?js[^"']*)["']/gi)) {
	urls.add(new URL(m[1], PAGE).href);
}

/* Search every CSS/JS chunk for @media blocks that mention wd: / ul: rules. */
const hits = [];
const allMinWidths = new Set();

const scanCss = (text, source) => {
	for (const m of text.matchAll(/@media[^{]*\{/g)) {
		const cond = m[0].replace(/@media\s*/, '').replace(/\s*\{$/, '').trim();
		const min = /min-width:\s*([\d.]+px)/.exec(cond)?.[1];
		if (min) allMinWidths.add(min);
	}
	// A variant prefix is compiled to `.wd\:max-w-\[680px\]` inside a media block.
	const variantMedia = new Map();
	for (const m of text.matchAll(/@media([^{]+)\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g)) {
		const cond = m[1].trim();
		const body = m[2];
		const prefixes = [...body.matchAll(/\\\.(wd|ul|xxl|xxl2):/g)].map((x) => x[1]);
		for (const p of new Set(prefixes)) {
			if (!variantMedia.has(p)) variantMedia.set(p, new Set());
			variantMedia.get(p).add(cond);
		}
	}
	for (const [prefix, conds] of variantMedia) {
		for (const c of conds) {
			const min = /min-width:\s*([\d.]+px)/.exec(c)?.[1] ?? null;
			hits.push({ prefix, condition: c, minWidth: min, source });
		}
	}
};

for (const url of urls) {
	try {
		const res = await fetch(url, { headers: { 'user-agent': UA, referer: PAGE } });
		if (!res.ok) continue;
		const ct = res.headers.get('content-type') ?? '';
		if (!/text|javascript|json/.test(ct)) continue;
		const text = await res.text();
		if (/ctfassets|font/.test(url) && !/\.css/.test(url)) continue;
		scanCss(text, url);
	} catch {
		/* ignore */
	}
}

const out = {
	page: PAGE,
	stylesheetCount: urls.size,
	allMinWidths: [...allMinWidths].sort(
		(a, b) => parseFloat(a) - parseFloat(b),
	),
	variants: [...new Set(hits.map((h) => h.prefix))],
	hits,
};
writeFileSync('docs/reference/breakpoints.json', JSON.stringify(out, null, 2));
console.log(
	`stylesheets=${urls.size} minWidths=${out.allMinWidths.join(',')} variants=${out.variants.join(',')}`,
);
