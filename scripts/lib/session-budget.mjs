/**
 * scripts/lib/session-budget.mjs — the single source of truth for session spend.
 *
 * WHY this exists
 * ---------------
 * `.clinerules` was prose: "read a file at most twice", "at most 8 tool calls".
 * Prose is a request; the agent can ignore it, and after a context compaction
 * it is the first thing to disappear. This module turns those requests into
 * state that other scripts can READ and ENFORCE.
 *
 * The ledger lives in `qa/.session/budget.json`. Scripts that consume a
 * reference file record the read here, so `npm run preflight` can refuse to
 * start a page when the exploration budget was already blown.
 *
 * CLI: `node scripts/lib/session-budget.mjs status` → prints the ledger.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../..');
const LEDGER_DIR = resolve(ROOT, 'qa/.session');
const LEDGER = resolve(LEDGER_DIR, 'budget.json');

/** Hard limits. Exceeding any of them is a `violation`, not a suggestion. */
export const LIMITS = {
	/** Reads of one single path per session. */
	readsPerPath: 2,
	/** Tool calls in one atomic task. */
	toolCalls: 8,
	/** Exploration-type calls (reads, searches, probes) in one atomic task. */
	explorationCalls: 6,
	/** Generator runs consuming the same file — re-running a generator is normal. */
	toolReadsPerPath: 20,
	/** Scratch files that may remain in `qa/` when a task is closed. */
	scratchFiles: 0,
};

const EMPTY = {
	session: null,
	startedAt: null,
	reads: {},
	toolReads: {},
	toolCalls: 0,
	explorationCalls: 0,
	writes: [],
	notes: [],
};

/** Normalise a path so `.\a\b` and `a/b` count as the same read. */
function key(path) {
	return String(path).replace(/\\/g, '/').replace(/^\.\//, '');
}

function load() {
	if (!existsSync(LEDGER)) return { ...EMPTY };
	try {
		const parsed = JSON.parse(readFileSync(LEDGER, 'utf8'));
		return {
			...EMPTY,
			...parsed,
			reads: { ...(parsed.reads ?? {}) },
			toolReads: { ...(parsed.toolReads ?? {}) },
		};
	} catch {
		return { ...EMPTY };
	}
}

function save(state) {
	mkdirSync(LEDGER_DIR, { recursive: true });
	writeFileSync(LEDGER, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

/** Start a fresh session — clears the read counters. */
export function reset(session = null) {
	const state = { ...EMPTY, session, startedAt: new Date().toISOString() };
	save(state);
	return state;
}

/**
 * Record one read of `path`.
 *
 * `kind` distinguishes the two very different reasons a file gets read:
 *   'exploration' — the agent re-reading a file by hand. Wasteful; capped hard.
 *   'tool'        — a deterministic generator consuming the same file. Legitimate
 *                   to repeat (re-running a generator after a fix); capped loosely.
 */
export function recordRead(path, kind = 'exploration') {
	const state = load();
	const k = key(path);
	const bucket = kind === 'tool' ? state.toolReads : state.reads;
	bucket[k] = (bucket[k] ?? 0) + 1;
	save(state);
	return bucket[k];
}

/** Record one tool call. `kind` 'exploration' also bumps the exploration counter. */
export function recordTool(kind = 'tool') {
	const state = load();
	state.toolCalls += 1;
	if (kind === 'exploration') state.explorationCalls += 1;
	save(state);
	return state.toolCalls;
}

/** Record a file this task created or modified. */
export function recordWrite(path) {
	const state = load();
	const k = key(path);
	if (!state.writes.includes(k)) state.writes.push(k);
	save(state);
	return k;
}

/** Attach a free-text note to the ledger (used for phase transitions). */
export function note(text) {
	const state = load();
	state.notes.push(text);
	save(state);
	return text;
}

/**
 * Scratch files: anything named `_*.mjs` / `_*.txt` / `_*.json` / `_*.log`
 * left behind in `qa/` or `scripts/`. A task is not finished until these are 0.
 */
export function scratchFiles() {
	const out = [];
	for (const dir of ['qa', 'scripts']) {
		const abs = resolve(ROOT, dir);
		if (!existsSync(abs)) continue;
		for (const f of readdirSync(abs)) {
			if (/^_/.test(f) && /\.(mjs|txt|json|log|err)$/.test(f)) out.push(`${dir}/${f}`);
		}
	}
	return out.sort();
}

/** Every rule breach currently on record. Empty array = all good. */
export function violations() {
	const state = load();
	const out = [];

	for (const [path, count] of Object.entries(state.reads)) {
		if (count > LIMITS.readsPerPath) {
			out.push({ rule: `readsPerPath (max ${LIMITS.readsPerPath})`, detail: `${path} read ${count}x` });
		}
	}
	for (const [path, count] of Object.entries(state.toolReads)) {
		if (count > LIMITS.toolReadsPerPath) {
			out.push({
				rule: `toolReadsPerPath (max ${LIMITS.toolReadsPerPath})`,
				detail: `${path} consumed ${count}x by generators`,
			});
		}
	}
	if (state.toolCalls > LIMITS.toolCalls) {
		out.push({ rule: `toolCalls (max ${LIMITS.toolCalls})`, detail: `${state.toolCalls} tool calls` });
	}
	if (state.explorationCalls > LIMITS.explorationCalls) {
		out.push({
			rule: `explorationCalls (max ${LIMITS.explorationCalls})`,
			detail: `${state.explorationCalls} exploration calls`,
		});
	}
	for (const f of scratchFiles()) {
		out.push({ rule: `scratchFiles (max ${LIMITS.scratchFiles})`, detail: `${f} still present` });
	}
	return out;
}

/** Everything the CLI prints. */
export function snapshot() {
	const state = load();
	return {
		limits: LIMITS,
		session: state.session,
		startedAt: state.startedAt,
		toolCalls: state.toolCalls,
		explorationCalls: state.explorationCalls,
		reads: state.reads,
		toolReads: state.toolReads,
		writes: state.writes,
		notes: state.notes,
		scratch: scratchFiles(),
		violations: violations(),
	};
}

/* ── CLI ─────────────────────────────────────────────────────────────── */
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split(/[\\/]/).pop())) {
	if (process.argv.includes('--reset')) {
		const s = reset(process.argv[2] ?? null);
		console.log(`session budget reset (${s.startedAt})`);
		process.exit(0);
	}
	const snap = snapshot();
	console.log('=== session budget ===');
	console.log(`session   ${snap.session ?? '(none)'}  started ${snap.startedAt ?? '-'}`);
	console.log(`toolCalls ${snap.toolCalls} / ${snap.limits.toolCalls}`);
	console.log(`explore   ${snap.explorationCalls} / ${snap.limits.explorationCalls}`);
	const hot = Object.entries(snap.reads).filter(([, n]) => n > 1);
	console.log(`reads     ${Object.keys(snap.reads).length} paths, over-limit: ${hot.length}`);
	for (const [p, n] of hot) console.log(`   ${n}x ${p}`);
	const toolHot = Object.entries(snap.toolReads).filter(([, n]) => n > 1);
	console.log(`genreads  ${Object.keys(snap.toolReads).length} paths`);
	for (const [p, n] of toolHot) console.log(`   ${n}x ${p}`);
	console.log(`scratch   ${snap.scratch.length ? snap.scratch.join(', ') : '(none)'}`);
	if (snap.violations.length) {
		console.log('\nVIOLATIONS:');
		for (const v of snap.violations) console.log(`  ✗ ${v.rule} — ${v.detail}`);
		process.exitCode = 1;
	} else {
		console.log('\nno violations');
	}
}
