/**
 * scripts/lib/safe-read.mjs — 受控读取层：硬拦截巨型单行文件的原始行外泄。
 *
 * WHY
 * ---
 * 大体积**单行**文件（HTML / 压缩 JSON）任何不做长度保护的检索
 * （grep / search_codebase）命中其中一行，都会把整份文件灌进上下文：
 * 一次 ≈ 10–20 万 token，三次即千万级。这是本项目最大的 token 事故源，
 * 因此必须在工具层堵死，而不是靠"记得别这么干"。
 *
 * 本模块提供四件事：
 *   1. assertScannable()   命中保护名单 → 抛错并给出替代命令
 *   2. capLine()/capHits() 单行长度 / 命中数 双封顶
 *   3. grepFiles()         遍历时排除保护目录，只回 file:line + 截断行
 *   4. projectRefJson()    大 JSON → 字段投影（绝不吐原始行）
 *
 * CLI 封装见 scripts/safe-grep.mjs。
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const PROTECTED_DIRS = [
	'node_modules',
	'.git',
	'dist',
	'build',
	'.astro',
	'.vercel',
	'.netlify',
];

export const DEFAULT_MAX_HITS = 20;
export const DEFAULT_MAX_LEN = 200;

/** 参考站 probe JSON 里允许被投影出来的条目字段。 */
const ITEM_KEYS = [
	'tag',
	'text',
	'href',
	'src',
	'alt',
	'cls',
	'headText',
	'headTag',
	'fs',
	'lh',
	'fw',
	'color',
	'bg',
	'radius',
	'fontSize',
	'x',
	'y',
	'w',
	'h',
	'gap',
	'cols',
	'ratio',
	'aspect',
	'objectFit',
];

export const toPosix = (p) => String(p).replace(/\\/g, '/').replace(/^\.\//, '');

export function isProtectedPath(p) {
	const n = toPosix(p).toLowerCase();
	return PROTECTED_DIRS.some(
		(d) => n === d || n.startsWith(d + '/') || n.includes('/' + d + '/'),
	);
}

/**
 * 断言该路径可以直接扫描原始内容。
 * project=true 时放行 qa/ref/*.json（走字段投影），其余保护路径一律拒绝。
 */
export function assertScannable(p, { project = false } = {}) {
	if (!isProtectedPath(p)) return true;
	const n = toPosix(p).toLowerCase();
	if (project && n.endsWith('.json')) return true;
	const err = new Error(
		`[safe-read] REFUSED to scan protected path: ${toPosix(p)}\n` +
			'  Large single-line files (HTML / minified JSON) blow up the context:\n' +
			'  one raw line = 100k+ tokens.\n' +
			'  Use one of these instead:\n' +
			'    npm run grep -- <pattern> --path <file.json> --fields a,b   (field projection)\n' +
			'    npm run grep -- <pattern> --path <dir> --max-hits 10',
	);
	err.code = 'EPROTECTED';
	throw err;
}

export function capLine(line, max = DEFAULT_MAX_LEN) {
	const s = String(line).replace(/\s+/g, ' ').trim();
	return s.length > max ? `${s.slice(0, max)}…[+${s.length - max}]` : s;
}

export function capHits(hits, max = DEFAULT_MAX_HITS) {
	return hits.length > max ? hits.slice(0, max) : hits;
}

/** 递归收集文件，跳过保护目录。 */
export function walkFiles(root, { exts = null, skip = PROTECTED_DIRS } = {}) {
	const out = [];
	const skipSet = new Set(skip.map((d) => d.toLowerCase()));
	const walk = (dir) => {
		let entries;
		try {
			entries = readdirSync(dir, { withFileTypes: true });
		} catch {
			return;
		}
		for (const e of entries) {
			const full = join(dir, e.name);
			if (e.isDirectory()) {
				if (skipSet.has(e.name.toLowerCase())) continue;
				walk(full);
			} else if (e.isFile()) {
				if (exts && !exts.includes(e.name.split('.').pop().toLowerCase())) continue;
				out.push(full);
			}
		}
	};
	walk(root);
	return out;
}

/** 在受控目录里做行级检索：命中行一律截断，命中数封顶。 */
export function grepFiles({
	roots,
	pattern,
	maxHits = DEFAULT_MAX_HITS,
	maxLen = DEFAULT_MAX_LEN,
	exts = null,
}) {
	const re = new RegExp(pattern, 'i');
	const hits = [];
	for (const root of roots) {
		assertScannable(root);
		const files = walkFiles(root, { exts });
		for (const f of files) {
			if (isProtectedPath(f)) continue;
			let content;
			try {
				content = readFileSync(f, 'utf8');
			} catch {
				continue;
			}
			const lines = content.split(/\r?\n/);
			for (let i = 0; i < lines.length; i++) {
				if (!re.test(lines[i])) continue;
				hits.push({ file: toPosix(f), line: i + 1, text: capLine(lines[i], maxLen) });
				if (hits.length >= maxHits) return capHits(hits, maxHits);
			}
		}
	}
	return capHits(hits, maxHits);
}

/**
 * 把 probe JSON（qa/ref/*.json）投影成「字段集」文本行。
 * 只输出白名单字段，绝不输出原始 JSON —— 单行 JSON 同样能撑爆上下文。
 */
export function projectRefJson(
	file,
	{
		pattern = null,
		fields = null,
		maxHits = DEFAULT_MAX_HITS,
		maxLen = DEFAULT_MAX_LEN,
	} = {},
) {
	const json = JSON.parse(readFileSync(file, 'utf8'));
	const re = pattern ? new RegExp(pattern, 'i') : null;
	const out = [];
	const keys = fields && fields.length ? fields : Object.keys(json);

	const push = (s) => {
		if (re && !re.test(s)) return;
		out.push(capLine(s, maxLen));
	};

	for (const key of keys) {
		const val = json[key];
		if (val === undefined || val === null) continue;
		if (Array.isArray(val)) {
			val.forEach((item, i) => {
				if (item && typeof item === 'object') {
					const parts = ITEM_KEYS.filter((k) => item[k] !== undefined).map(
						(k) => `${k}=${item[k]}`,
					);
					push(`${key}[${i}] ${parts.join(' ')}`);
				} else {
					push(`${key}[${i}] ${item}`);
				}
			});
		} else if (typeof val === 'object') {
			const parts = Object.entries(val).map(([k, v]) =>
				`${k}=${typeof v === 'object' ? JSON.stringify(v).slice(0, 120) : v}`,
			);
			push(`${key} ${parts.join(' ')}`);
		} else {
			push(`${key} ${val}`);
		}
	}
	return capHits(out, maxHits);
}
