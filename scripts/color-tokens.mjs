/**
 * scripts/color-tokens.mjs — 色板还原机制（verify / restore / snapshot）
 *
 * 用法：
 *   npm run tokens:verify
 *   npm run tokens:restore
 *   npm run tokens:restore -- --from scripts/lib/color-tokens.pre-hero-2026-11-20.json
 *   npm run tokens:restore -- --dry-run
 *   npm run tokens:snapshot -- --out scripts/lib/color-tokens.my-snapshot.json
 *
 * 作用：把 `src/styles/global.css` 的 @theme 色板与 JSON 快照双向对齐。
 *   - verify   ：对比当前 CSS 与基线快照，列出差异（有差异退出码 1）
 *   - restore  ：用快照覆盖 CSS 中的色板声明（可回滚到任意历史快照）
 *   - snapshot ：把当前 CSS 色板导出为新的 JSON 快照
 *
 * 安全约束（务必保持）：
 *   1. 只识别 `--color-*` 声明行，绝不触碰 @theme 的排版 / 间距 / 断点等段落；
 *   2. 只有紧邻 token 且内容含 MEASURED / ESTIMATED 的注释块才允许被改写或删除，
 *      结构性说明块（如 "Colour" 清单）永远不动；
 *   3. 所有索引在原始行数组上一次性算好，不在遍历中修改数组长度，
 *      避免 splice 造成的索引错位。
 */
import { readFileSync, writeFileSync } from 'node:fs';

const CSS = 'src/styles/global.css';
const BASELINE = 'scripts/lib/color-tokens.baseline.json';

const argv = process.argv.slice(2);
const cmd = argv[0] ?? 'verify';
const opt = (name, fallback = null) => {
	const i = argv.indexOf(`--${name}`);
	return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const dryRun = argv.includes('--dry-run');

const loadSnapshot = (path) => {
	const raw = JSON.parse(readFileSync(path, 'utf8'));
	if (!Array.isArray(raw.tokens)) throw new Error(`${path}: missing tokens[]`);
	return raw.tokens.map((t) => ({
		name: t.name,
		value: t.value,
		note: t.note ?? '',
		tag: t.tag ?? 'MEASURED',
	}));
};

const TOKEN_RE = /^(\s*)(--color-[a-z0-9-]+):\s*([^;]+);/i;
const NOTE_RE = /\b(MEASURED|ESTIMATED)\b/;

const readCss = () => readFileSync(CSS, 'utf8');

function parseTokens(css) {
	const lines = css.split('\n');
	const found = [];
	lines.forEach((line, i) => {
		const m = line.match(TOKEN_RE);
		if (m) found.push({ name: m[2], value: m[3].trim(), lineIndex: i, indent: m[1] });
	});
	return { lines, found };
}

/*
 * 找出位于 token 行正上方的完整注释块（连续行，起点是注释起始符，终点是注释结束符）。
 * 若 token 正上方不是注释块，返回 null。
 */
function commentBlockAbove(lines, tokenIdx) {
	let i = tokenIdx - 1;
	if (i < 0) return null;
	if (!lines[i].trim().endsWith('*/')) return null;
	let start = i;
	while (start >= 0 && !lines[start].trim().startsWith('/*')) {
		// 注释块必须连续：中途遇到非注释行即视为没有块
		if (lines[start].trim() === '') return null;
		start--;
	}
	if (start < 0) return null;
	return { start, end: i, text: lines.slice(start, i + 1).join('\n') };
}

/* ── restore ─────────────────────────────────────────────────────────── */
function restore(snapshotPath) {
	const snapshot = loadSnapshot(snapshotPath);
	const css = readCss();
	const { lines, found } = parseTokens(css);

	const snapshotNames = new Set(snapshot.map((t) => t.name));
	const edits = new Map(); // lineIndex -> new content
	const drops = new Set(); // lineIndex -> 删除
	const commentInterior = new Set(); // 允许被删除的注释块内部行
	const currentByName = new Map(found.map((f) => [f.name, f]));

	let updated = 0;
	for (const tok of snapshot) {
		const cur = currentByName.get(tok.name);
		if (!cur) continue;
		updated++;
		edits.set(cur.lineIndex, `${cur.indent}${tok.name}: ${tok.value};`);

		// 注释同步：仅当紧邻注释块含 MEASURED / ESTIMATED 时才改写
		const block = commentBlockAbove(lines, cur.lineIndex);
		if (block && NOTE_RE.test(block.text)) {
			const tag = tok.tag === 'ESTIMATED' ? 'ESTIMATED' : 'MEASURED';
			const note = tok.note ? ` — ${tok.note}` : '';
			edits.set(block.start, `\t/* ${tag}${note} */`);
			for (let x = block.start + 1; x <= block.end; x++) {
				drops.add(x);
				commentInterior.add(x);
			}
		}
	}

	// 删除快照中不存在的 token（连同其紧邻的 MEASURED/ESTIMATED 注释块）
	let removed = 0;
	for (const cur of found) {
		if (snapshotNames.has(cur.name)) continue;
		removed++;
		drops.add(cur.lineIndex);
		const block = commentBlockAbove(lines, cur.lineIndex);
		if (block && NOTE_RE.test(block.text)) {
			for (let x = block.start; x <= block.end; x++) {
				drops.add(x);
				commentInterior.add(x);
			}
		}
	}

	// 插入尚不存在的 token：紧跟最后一个 --color-* 声明
	const missing = snapshot.filter((t) => !currentByName.has(t.name));
	let insertAfter = -1;
	if (missing.length) {
		for (const f of found) insertAfter = Math.max(insertAfter, f.lineIndex);
		if (insertAfter < 0) throw new Error('no --color-* token found in ' + CSS);
	}

	// 组装结果
	const result = [];
	for (let i = 0; i < lines.length; i++) {
		if (drops.has(i)) continue;
		if (i === insertAfter && missing.length) {
			for (const t of missing) {
				const tag = t.tag === 'ESTIMATED' ? 'ESTIMATED' : 'MEASURED';
				result.push(`\t/* ${tag}${t.note ? ` — ${t.note}` : ''} */`);
				result.push(`\t${t.name}: ${t.value};`);
			}
		}
		result.push(edits.has(i) ? edits.get(i) : lines[i]);
	}
	if (missing.length && insertAfter === lines.length - 1) {
		for (const t of missing) {
			const tag = t.tag === 'ESTIMATED' ? 'ESTIMATED' : 'MEASURED';
			result.push(`\t/* ${tag}${t.note ? ` — ${t.note}` : ''} */`);
			result.push(`\t${t.name}: ${t.value};`);
		}
	}

	/* ── 安全护栏 ──────────────────────────────────────────────────────── */
	const dropIdx = [...drops].sort((a, b) => a - b);
	const droppedText = dropIdx.map((i) => lines[i]);
	const illegal = dropIdx.filter((i) => {
		const l = lines[i];
		const t = l.trim();
		if (t === '') return false;
		if (TOKEN_RE.test(l)) return false;
		if (commentInterior.has(i)) return false;
		if (t.startsWith('/*') && t.endsWith('*/')) return false;
		return true;
	}).map((i) => lines[i]);
	if (illegal.length) {
		throw new Error('refusing to write: non-token lines would be dropped → ' + illegal.join(' | '));
	}
	const colorCount = result.filter((l) => TOKEN_RE.test(l)).length;
	if (colorCount !== snapshot.length) {
		throw new Error(`refusing to write: token count ${colorCount} != snapshot ${snapshot.length}`);
	}

	const next = result.join('\n');
	if (next === css) {
		console.log('tokens:restore — already in sync with ' + snapshotPath);
		return 0;
	}
	if (dryRun) {
		const changed = snapshot.filter((t) => {
			const cur = currentByName.get(t.name);
			return cur && cur.value.toLowerCase() !== t.value.toLowerCase();
		});
		const removedNames = droppedText
			.map((l) => l.match(/^--color-[a-z0-9-]+:/i))
			.filter(Boolean)
			.map((m) => m[0].replace(/:$/, ''));
		console.log('tokens:restore --dry-run — would write ' + CSS);
		console.log('  overwritten: ' + (changed.map((t) => t.name).join(', ') || '(none)'));
		console.log('  added      : ' + (missing.map((t) => t.name).join(', ') || '(none)'));
		console.log('  removed    : ' + (removedNames.join(', ') || '(none)'));
		return 0;
	}
	writeFileSync(CSS, next, 'utf8');
	console.log(`tokens:restore — ${CSS} restored from ${snapshotPath}`);
	console.log(`  updated: ${updated}  added: ${missing.length}  removed: ${removed}`);
	return 0;
}

/* ── verify ──────────────────────────────────────────────────────────── */
function verify(snapshotPath) {
	const snapshot = loadSnapshot(snapshotPath);
	const { found } = parseTokens(readCss());
	const current = new Map(found.map((f) => [f.name, f.value]));
	const diffs = [];
	for (const t of snapshot) {
		if (!current.has(t.name)) diffs.push(`- missing  ${t.name} (expected ${t.value})`);
		else if (current.get(t.name).toLowerCase() !== t.value.toLowerCase())
			diffs.push(`- differs  ${t.name}: css=${current.get(t.name)} snapshot=${t.value}`);
	}
	for (const [name, value] of current) {
		if (!snapshot.find((t) => t.name === name)) diffs.push(`- extra    ${name}: ${value} (not in snapshot)`);
	}
	if (!diffs.length) {
		console.log(`tokens:verify — OK, ${snapshot.length} colour tokens match ${snapshotPath}`);
		return 0;
	}
	console.log(`tokens:verify — ${diffs.length} difference(s) vs ${snapshotPath}`);
	diffs.forEach((d) => console.log('  ' + d));
	console.log('  fix with: npm run tokens:restore');
	return 1;
}

/* ── snapshot ────────────────────────────────────────────────────────── */
function snapshot(outPath) {
	const { found } = parseTokens(readCss());
	const payload = {
		_comment:
			'Snapshot of the @theme colour palette in src/styles/global.css. Restore with: npm run tokens:restore -- --from ' +
			outPath,
		tokens: found.map((f) => ({ name: f.name, value: f.value, note: '', tag: 'MEASURED' })),
	};
	if (dryRun) {
		console.log('tokens:snapshot --dry-run — would write ' + outPath);
		return 0;
	}
	writeFileSync(outPath, JSON.stringify(payload, null, '\t') + '\n', 'utf8');
	console.log(`tokens:snapshot — wrote ${outPath} (${found.length} tokens)`);
	return 0;
}

/* ── 入口 ────────────────────────────────────────────────────────────── */
try {
	if (cmd === 'verify') process.exit(verify(opt('from', BASELINE)));
	else if (cmd === 'restore') process.exit(restore(opt('from', BASELINE)));
	else if (cmd === 'snapshot')
		process.exit(snapshot(opt('out', 'scripts/lib/color-tokens.snapshot.json')));
	else {
		console.error(
			'usage: node scripts/color-tokens.mjs <verify|restore|snapshot> [--from <json>] [--out <json>] [--dry-run]',
		);
		process.exit(1);
	}
} catch (err) {
	console.error('color-tokens: ' + (err && err.message ? err.message : String(err)));
	process.exit(1);
}
