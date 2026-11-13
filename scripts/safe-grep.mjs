#!/usr/bin/env node
/**
 * scripts/safe-grep.mjs — 受控检索 CLI（唯一允许的代码检索入口）。
 *
 * WHY
 * ---
 * 本项目最大的 token 事故源：`qa/ref/*.html` 是 372KB–1MB 的**单行**文件，
 * 任何未做长度保护的 grep 命中都会把整份 HTML 灌进上下文（一次 10–20 万
 * token，三次即千万级）。本脚本把"安全"做成机制而不是纪律：
 *
 *   · qa/ref/*.html  → 直接拒绝，并打印替代命令
 *   · qa/ref/*.json  → 字段投影（只吐白名单字段，不吐原始行）
 *   · 其他目录        → 行级检索，单行截断 + 命中数封顶
 *
 * 用法
 * ---
 *   node scripts/safe-grep.mjs <pattern> [--path <p>] [--max-hits N] [--max-len N]
 *                              [--fields a,b] [--exts mjs,ts]
 *
 *   npm run grep -- <pattern> --path qa/ref/product-solutions.json
 *   npm run grep -- "Product Solutions" --path src --max-hits 20
 */
import { statSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import {
	assertScannable,
	grepFiles,
	projectRefJson,
	isProtectedPath,
	capLine,
	DEFAULT_MAX_HITS,
	DEFAULT_MAX_LEN,
	toPosix,
} from './lib/safe-read.mjs';

const ROOT = resolve(process.cwd());

const argv = process.argv.slice(2);
const positional = argv.filter((a) => !a.startsWith('--'));
const pattern = positional[0];
if (!pattern) {
	console.error(
		'usage: node scripts/safe-grep.mjs <pattern> [--path <p>] [--max-hits N] [--max-len N] [--fields a,b]',
	);
	process.exit(1);
}

const flag = (n, d) => {
	const i = argv.indexOf(n);
	return i >= 0 ? argv[i + 1] : d;
};

const paths = String(flag('--path', '.'))
	.split(',')
	.map((s) => s.trim())
	.filter(Boolean);
const maxHits = Number(flag('--max-hits', DEFAULT_MAX_HITS));
const maxLen = Number(flag('--max-len', DEFAULT_MAX_LEN));
const fields = String(flag('--fields', ''))
	.split(',')
	.map((s) => s.trim())
	.filter(Boolean);
const exts = String(flag('--exts', ''))
	.split(',')
	.map((s) => s.trim().replace(/^\./, ''))
	.filter(Boolean);

const rel = (p) => {
	const r = relative(ROOT, resolve(p));
	return toPosix(r === '' ? '.' : r);
};

let printed = 0;

for (const p of paths) {
	const abs = resolve(p);
	let st;
	try {
		st = statSync(abs);
	} catch {
		console.error(`[safe-grep] 路径不存在: ${p}`);
		continue;
	}

	/* 单文件：JSON 走投影，其他类型走截断行 */
	if (st.isFile()) {
		if (isProtectedPath(abs)) {
			if (!abs.toLowerCase().endsWith('.json')) {
				try {
					assertScannable(abs);
				} catch (e) {
					console.error(e.message);
					process.exitCode = 1;
					continue;
				}
			}
			if (abs.toLowerCase().endsWith('.json')) {
				console.log(`# PROJECT ${rel(abs)}`);
				for (const line of projectRefJson(abs, { pattern, fields, maxHits, maxLen })) {
					console.log(line);
					printed++;
				}
				continue;
			}
		}
		console.log(`# FILE ${rel(abs)}`);
		for (const h of grepFiles({
			roots: [abs],
			pattern,
			maxHits,
			maxLen,
			exts: null,
		})) {
			console.log(`${h.file}:${h.line}  ${h.text}`);
			printed++;
		}
		continue;
	}

	/* 目录：常规行级检索 */
	try {
		assertScannable(abs);
	} catch (e) {
		console.error(e.message);
		process.exitCode = 1;
		continue;
	}

	console.log(`# GREP ${rel(abs)}  pattern=${capLine(pattern, 60)}`);
	const hits = grepFiles({
		roots: [abs],
		pattern,
		maxHits,
		maxLen,
		exts: exts.length ? exts : null,
	});
	for (const h of hits) {
		console.log(`${h.file}:${h.line}  ${h.text}`);
		printed++;
	}
	if (hits.length >= maxHits) {
		console.log(`# ... hit cap ${maxHits} reached; rest NOT scanned (use a more precise pattern)`);
	}
}

console.log(`# total lines: ${printed}`);
