/**
 * scripts/extract-footer.mjs — 抓取参考站页脚（footer）内容。
 *
 * Phase A（1:1 照抄）：页脚的栏目、链接、法律行、社交与声明全部逐字取自参考站。
 * 产物：docs/reference/footer-source.json + docs/reference/footer-copy.md
 *
 * 用法：node scripts/extract-footer.mjs [url]
 */

import { writeFileSync } from 'node:fs';

const URL = process.argv[2] ?? 'https://www.bossard.com/global-en/';
const UA =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
	'(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

const html = await (await fetch(URL, { headers: { 'user-agent': UA } })).text();

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

/* Everything after </main>: the trailing container + the site footer. */
const mEnd = html.indexOf('</main>');
let fHtml = mEnd >= 0 ? html.slice(mEnd) : html.slice(-80000);

/* The trailing paragraph that sits between the last block and the footer. */
const trailing = [];
{
	const tail = fHtml.slice(0, 20000);
	for (const m of tail.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
		const t = strip(m[1]);
		if (t) trailing.push(t);
	}
	if (trailing.length > 3) trailing.length = 3;
}

/* Headings inside the footer — the reference groups its links under titles. */
const headings = [];
for (const m of fHtml.matchAll(/<(h2|h3|h4|h5)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
	const t = strip(m[2]);
	if (t) headings.push({ tag: m[1].toLowerCase(), text: t });
}

/* Links with their href, in DOM order. */
const links = [];
for (const m of fHtml.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
	const href = /href="([^"]*)"/i.exec(m[1])?.[1] ?? null;
	const text = strip(m[2]);
	if (!text) continue;
	links.push({ text, href, external: !!href && /^https?:\/\//.test(href) && !href.includes('bossard.com') });
}

/* Plain paragraphs — legal lines, copyright, disclaimers. */
const paragraphs = [];
for (const m of fHtml.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
	const t = strip(m[1]);
	if (t) paragraphs.push(t);
}

/* Full visible text of the footer, in reading order. */
const text = strip(fHtml);

const out = { url: URL, fetchedAt: new Date().toISOString(), headings, links, paragraphs, trailing, text };
writeFileSync('docs/reference/footer-source.json', JSON.stringify(out, null, 2));

const md = [];
md.push('# 参考站页脚内容（自动提取）');
md.push('');
md.push(`- 来源：\`${URL}\``);
md.push(`- 抓取时间：${out.fetchedAt}`);
md.push('');
md.push('## 主区尾部段落（footer 之前）');
md.push('');
for (const t of trailing) md.push(`- ${t}`);
md.push('');
md.push('## 标题（栏目）');
md.push('');
for (const h of headings) md.push(`- **${h.tag}** ${h.text}`);
md.push('');
md.push('## 链接（DOM 顺序）');
md.push('');
for (const l of links) md.push(`- ${l.text} → \`${l.href}\`${l.external ? ' _(external)_' : ''}`);
md.push('');
md.push('## 段落（法律行 / 声明）');
md.push('');
for (const p of paragraphs) md.push(`- ${p}`);
md.push('');
md.push('## 页脚全文（连续文本）');
md.push('');
md.push('```');
md.push(text);
md.push('```');
writeFileSync('docs/reference/footer-copy.md', md.join('\n'));

console.log(
	`headings=${headings.length} links=${links.length} paragraphs=${paragraphs.length} textLen=${text.length}`,
);
