/**
 * scripts/extract-reference.mjs — 抓取参考站首页的资产与文案，导出为照抄输入。
 *
 * Phase A（1:1 照抄）专用：参考站的文案与图片是本站的**唯一内容来源**，
 * 本脚本把它们的 DOM 顺序、原始 URL 落成 JSON，供台账登记与本地化下载。
 *
 * 产物：
 *   docs/reference/homepage-source.json  机器用（图片 URL / 完整文本流）
 *   docs/reference/homepage-copy.md      人读（按区块的紧凑文案清单）
 *
 * 用法：node scripts/extract-reference.mjs [url]
 */

import { writeFileSync } from 'node:fs';

const URL = process.argv[2] ?? 'https://www.bossard.com/global-en/';

const res = await fetch(URL, {
	headers: {
		'user-agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
			'(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
		'accept-language': 'en',
	},
});
const html = await res.text();

const strip = (s) =>
	s
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#x27;|&#39;/g, "'")
		.replace(/&rsquo;/g, '’')
		.replace(/&lsquo;/g, '‘')
		.replace(/&ndash;/g, '–')
		.replace(/&mdash;/g, '—')
		.replace(/&hellip;/g, '…')
		.replace(/&[a-z]+;|&#\d+;/gi, ' ')
		.replace(/\s+/g, ' ')
		.trim();

/* ── 只取 <main> 内的内容 ───────────────────────────────────────────── */
const mainStart = html.search(/<main\b/i);
const mainEnd = mainStart >= 0 ? html.indexOf('</main>', mainStart) : -1;
const main = mainStart >= 0 ? html.slice(mainStart, mainEnd > 0 ? mainEnd : html.length) : html;

/* ── 1. 图片 ────────────────────────────────────────────────────────── */
const images = [];
for (const m of main.matchAll(/<img\b[^>]*>/gi)) {
	const tag = m[0];
	const src = /src="([^"]+)"/i.exec(tag)?.[1];
	if (!src) continue;
	images.push({
		src,
		alt: /alt="([^"]*)"/i.exec(tag)?.[1] ?? '',
		width: /width="(\d+)"/i.exec(tag)?.[1] ?? null,
		height: /height="(\d+)"/i.exec(tag)?.[1] ?? null,
		ctf: /ctfassets\.net/.test(src),
	});
}

/* ── 2. 内联 SVG（Logo / 图标） ─────────────────────────────────────── */
const svgs = [];
for (const m of main.matchAll(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi)) {
	const s = m[0];
	svgs.push({
		class: /class="([^"]*)"/i.exec(s)?.[1] ?? '',
		viewBox: /viewBox="([^"]*)"/i.exec(s)?.[1] ?? '',
		len: s.length,
		paths: (s.match(/<path\b/g) ?? []).length,
	});
}

/* ── 3. 文案流（DOM 顺序） ─────────────────────────────────────────── */
const flow = [];
for (const m of main.matchAll(/<(h1|h2|h3|h4|a|p|li|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
	const text = strip(m[3] ?? '');
	if (!text || text.length > 400) continue;
	flow.push({
		tag: m[1].toLowerCase(),
		text,
		href: /href="([^"]*)"/i.exec(m[2] ?? '')?.[1] ?? null,
	});
}

/* ── 4. 落盘 ────────────────────────────────────────────────────────── */
const out = {
	url: URL,
	fetchedAt: new Date().toISOString(),
	htmlLength: html.length,
	imageCount: images.length,
	images,
	svgCount: svgs.length,
	svgs,
	flow,
};
writeFileSync('docs/reference/homepage-source.json', JSON.stringify(out, null, 2));

/* 紧凑文案清单：标题 + 有实义的文本节点 */
const md = [];
md.push(`# 参考站首页文案清单（自动提取）`);
md.push('');
md.push(`- 来源：\`${URL}\``);
md.push(`- 抓取时间：${out.fetchedAt}`);
md.push(`- 图片：${images.length} 张（其中 Contentful ${images.filter((i) => i.ctf).length} 张）`);
md.push(`- 内联 SVG：${svgs.length} 个`);
md.push('');
md.push('## 文本流（DOM 顺序）');
md.push('');
for (const f of flow) {
	const href = f.href ? ` → \`${f.href}\`` : '';
	md.push(`- **${f.tag}** ${f.text}${href}`);
}
md.push('');
md.push('## 图片清单');
md.push('');
md.push('| # | alt | 原始 URL | 参考站像素 |');
md.push('| ---: | --- | --- | --- |');
images.forEach((im, i) => {
	md.push(
		`| ${i + 1} | ${im.alt || '—'} | \`${im.src}\` | ${im.width ?? '?'}×${im.height ?? '?'} |`,
	);
});
writeFileSync('docs/reference/homepage-copy.md', md.join('\n'));

console.log(
	`images=${images.length} (ctf=${images.filter((i) => i.ctf).length}) ` +
		`svgs=${svgs.length} flow=${flow.length} html=${html.length}`,
);
