/**
 * scripts/lib/html-slice.mjs - raw HTML slicing helpers.
 *
 * WHY raw slicing instead of the DOM tree
 * -------------------------------------
 * The reference site is an Astro app: the saved HTML contains BOTH the island
 * JSON payload and the rendered markup. Element nesting produced by a naive
 * stack parser does not reliably match the source (the <dialog> body article
 * and the accordion gallery do not land where the source puts them), so every
 * extraction that has to be 1:1 with the reference is done on RAW SLICES.
 *
 * All helpers below work on plain strings and are depth aware.
 */
import { decodeEntities } from './html-tree.mjs';

/** Strip tags and decode entities -> plain text. */
export function text(html) {
	if (!html) return '';
	return decodeEntities(
		html
			.replace(/<[^>]*>/g, ' ')
			.replace(/&nbsp;/g, ' ')
			.replace(/\s+/g, ' ')
			.trim(),
	);
}

/** Read one attribute out of an opening tag string. */
export function attr(tag, name) {
	const m = new RegExp(`\\b${name}="([^"]*)"`).exec(tag ?? '');
	return m ? decodeEntities(m[1]) : '';
}

/** First opening tag of `tag` in `html`. */
export function openTag(html, tag) {
	const m = new RegExp(`<${tag}\\b[^>]*>`).exec(html ?? '');
	return m ? m[0] : '';
}

/** Inner HTML of the first `tag`, honouring nesting of the same tag. */
export function inner(html, tag) {
	const m = new RegExp(`<${tag}\\b[^>]*>`).exec(html ?? '');
	if (!m) return '';
	return balanced(html, m.index + m[0].length, tag);
}

/**
 * Inner HTML of the first `tag` whose class attribute contains `clsNeedle`.
 */
export function innerByClass(html, tag, clsNeedle) {
	for (const b of blocks(html, tag)) {
		if (attr(b.open, 'class').includes(clsNeedle)) return b.inner;
	}
	return '';
}

/** Text of the first `tag` whose class attribute contains `clsNeedle`. */
export function textByClass(html, tag, clsNeedle) {
	for (const b of blocks(html, tag)) {
		if (attr(b.open, 'class').includes(clsNeedle)) return text(b.inner);
	}
	return '';
}

/**
 * Every `tag` element with its opening tag and inner HTML.
 * Nested elements of the same tag are returned as separate entries.
 */
export function blocks(html, tag) {
	const out = [];
	const re = new RegExp(`<${tag}\\b[^>]*>`, 'g');
	let m;
	while ((m = re.exec(html ?? ''))) {
		const innerHtml = balanced(html, m.index + m[0].length, tag);
		out.push({
			open: m[0],
			inner: innerHtml ?? '',
			start: m.index,
			end: m.index + m[0].length + (innerHtml ?? '').length,
		});
	}
	return out;
}

/**
 * Top level `tag` slices: elements of that tag that are not nested inside
 * another element of the same tag.
 */
export function topSlices(html, tag) {
	const out = [];
	const re = new RegExp(`<${tag}\\b|</${tag}>`, 'g');
	let m;
	let depth = 0;
	let start = -1;
	while ((m = re.exec(html ?? ''))) {
		if (m[0].startsWith('</')) {
			depth--;
			if (depth === 0 && start >= 0) {
				out.push(html.slice(start, m.index + m[0].length));
				start = -1;
			}
		} else {
			if (depth === 0) start = m.index;
			depth++;
		}
	}
	return out;
}

/** Inner HTML starting at `from`, ending at the matching close tag. */
export function balanced(html, from, tag) {
	const open = new RegExp(`<${tag}\\b`, 'g');
	const close = new RegExp(`</${tag}>`, 'g');
	let depth = 1;
	let i = from;
	while (i < html.length) {
		open.lastIndex = i;
		close.lastIndex = i;
		const o = open.exec(html);
		const c = close.exec(html);
		if (!c) return '';
		if (o && o.index < c.index) {
			depth++;
			i = o.index + 1;
			continue;
		}
		depth--;
		if (depth === 0) return html.slice(from, c.index);
		i = c.index + 1;
	}
	return '';
}

/**
 * Content of the <main> element (the element itself is excluded so that
 * top level scans see its children as top level elements).
 */
export function mainRegion(html) {
	const start = html.indexOf('<main');
	if (start < 0) return html;
	const openEnd = html.indexOf('>', start);
	const end = html.indexOf('</main>', start);
	const from = openEnd < 0 ? start : openEnd + 1;
	return end < 0 ? html.slice(from) : html.slice(from, end);
}

/** Elements that never have a closing tag. */
const VOID_TAGS = new Set([
	'br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'use', 'path',
	'stop', 'rect', 'circle', 'polygon', 'area', 'col', 'embed', 'track', 'wbr',
]);

/**
 * Every top level element of a fragment, in document order.
 * The reference main holds <header>, <article> AND <div> blocks, so the block
 * order has to come from the document, not from a per tag query.
 */
export function topElements(html) {
	const out = [];
	/* Attribute values may contain ">" (the Astro island props are JSON), so
	   the attribute part has to be matched with quoted strings first. */
	const re =
		/<([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)\/?>|<\/([a-zA-Z][a-zA-Z0-9-]*)>/g;
	const stack = [];
	let m;
	while ((m = re.exec(html))) {
		if (m[3]) {
			/* close tag: unwind the stack to the matching open tag */
			const close = m[3].toLowerCase();
			let i = -1;
			for (let k = stack.length - 1; k >= 0; k--) {
				if (stack[k].name === close) {
					i = k;
					break;
				}
			}
			if (i < 0) continue;
			const popped = stack.splice(i);
			if (!stack.length) {
				const { name, start, openLen } = popped[0];
				if (name === 'astro-island') {
					/* An Astro island is a wrapper, not a block: flatten it so
					   its children come out on top level. The island stays on
					   the stack while it is open, so the nesting inside it
					   (e.g. the lightbox <article> inside a <dialog>) is kept. */
					const inner = html.slice(start + openLen, m.index);
					out.push(...topElements(inner));
				} else {
					out.push({ tag: name, html: html.slice(start, m.index + m[0].length) });
				}
			}
			continue;
		}
		const name = m[1].toLowerCase();
		if (m[0].endsWith('/>') || VOID_TAGS.has(name)) continue;
		stack.push({ name, start: m.index, openLen: m[0].length });
	}
	return out;
}

/** Drop <script>/<style> bodies: their content must not be parsed as markup. */
export function stripScripts(html) {
	return html
		.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
		.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
}

/** Read width/height/alt/src of an img opening tag. */
export function imgInfo(open) {
	return {
		src: attr(open, 'src'),
		alt: attr(open, 'alt'),
		width: Number(attr(open, 'width') || 0),
		height: Number(attr(open, 'height') || 0),
	};
}
