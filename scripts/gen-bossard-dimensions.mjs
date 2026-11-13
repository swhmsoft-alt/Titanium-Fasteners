#!/usr/bin/env node
/**
 * scripts/gen-bossard-dimensions.mjs — 从 Bossard 公开检索索引抽取工程尺寸
 *
 * IN:   Bossard 公开发布的产品索引 prd-products-en（Algolia，只读公共检索端点）
 * OUT:  --out <file> 写候选行；--apply 直接合并进 data/products/dimension-library.csv
 *
 * 为什么用这个源
 * --------------
 *   · ISO/DIN 标准全文受版权保护，公开站点一律 403/404；仓库内也没有标准文本。
 *   · Bossard 是欧洲紧固件分销商，其**产品变体索引**公开携带成品工程属性：
 *       ISO 4762 : d1=螺纹 · d2=头径 · k=头高 · s=对边 · t min=头厚 · L=全长
 *       ISO 10642: d1=螺纹 · d2 max=头径 · k max=头高 · s=对边 · t=头厚 · L=全长
 *       ISO 4017 : d1=螺纹 · e=对角 · k=头高 · s=对边   · L=全长
 *       ISO 7089 : d1=内径 · d2=外径 · s=厚度
 *     这些就是各标准的公称工程值。取的是标准公称值，不是对方的文案 / 图片 / 品牌资产。
 *
 * 与本站 param-schema 的对应
 * --------------------------
 *   本站 screw/bolt 列：thread · length · d1 · d2 · s · k · b · t
 *     d1 → 螺纹外径（ISO 粗牙 d1 max 公共列；Bossard 的 d1 是螺纹号，故按号取值）
 *     d2 → Bossard d2 / d2 max（头径）；ISO 4017 无 d2 字段，取 e（对角）
 *     s  → Bossard s（对边 / 内六角）；"DIN/s17" 形式取尾部数字
 *     k  → Bossard k / k max（头高）
 *     b  → 全螺纹件 = 全长 L（部分螺纹件索引另给 b 字段）
 *     t  → Bossard t（无 min 后缀）或 t min.（头厚**下限**）
 *   本站 washer 列：d1 · d2 · h —— 与 bulk-import 的迷你语法「外径x内径x厚度」一致，
 *     故 d1=外径、Bossard 的 d2；d2=内径、Bossard 的 d1；h=厚度、Bossard 的 s。
 *
 * 列语义的一条硬规矩
 * ------------------
 *   现有 din-912 / din-934 行的 b / t / m 列来自 ISO 表的**部分螺纹 b**、**t 上限**、
 *   **1.0d 厚**，与本脚本的「全螺纹 b=L」「t 下限」「0.8d 厚」不同源。
 *   同一张表里混两套语义会让规格表读起来互相矛盾 —— 故 --apply **只新增**，
 *   不覆盖既有行；新增标准（din-7991 / din-933 / din-125）的列语义内部自洽。
 *
 * 用法
 * ---
 *   node scripts/gen-bossard-dimensions.mjs --out data/tmp.csv      # 只导出候选行
 *   node scripts/gen-bossard-dimensions.mjs --apply                 # 抓取并合并入库
 *   node scripts/gen-bossard-dimensions.mjs --out x.csv din-125     # 只看一个标准
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const OUT = outIdx >= 0 ? args[outIdx + 1] : null;
const APPLY = args.includes('--apply');
const only = args.find((a) => a.startsWith('din-')) ?? null;
const lines = [];
const say = (s) => {
	lines.push(s);
	if (!OUT && !APPLY) console.log(s);
};
const APP = 'ZFVNE5HJ22';
const KEY = '834d9865bc0f7a588ef23e42fe4ea5f8';
const INDEX = 'prd-products-en';

/**
 * 本站 family_id → Bossard baseProductCode（取该标准下的代表 BN）。
 *
 * BN 的选择很关键 —— 同一标准下 Bossard 有多个产品形态，尺寸表不同：
 *   · BN 54  = DIN 933 / ISO 4017 **规格型**外六角（s 为数值）—— 用它
 *   · BN 624 = DIN 933 同标准的另一形态（s 写成 "DIN/s17"，是对边**上限**标注）—— 不用
 *   · BN 115 = DIN 934 的 **0.8d 薄型**螺母（m=3.2），与本站已有的规格型（m=4）不是同一产品 —— 不用
 *   · BN 272 = DIN 912 / ISO 4762 规格型内六角 —— 与本站现有 din-912 行同源，可作交叉校验
 */
const TARGETS = [
	{ std: 'din-912', codes: ['272'], type: 'screw' },
	{ std: 'din-7991', codes: ['616'], type: 'screw' },
	{ std: 'din-933', codes: ['54'], type: 'bolt' },
	{ std: 'din-125', codes: ['671'], type: 'washer' },
	/* 本波新增（Wave 1）—— 代表 BN 的选择依据见 docs/TIER-A-BATCH-SPEC.md §1b */
	{ std: 'din-7380', codes: ['19'], type: 'screw' },   // ISO 7380-1 盘头内六角（b="-" → 全牙）
	{ std: 'din-7984', codes: ['16'], type: 'screw' },   // DIN 7984 低头内六角（b="-"）
	{ std: 'din-6912', codes: ['15'], type: 'screw' },   // DIN 6912 带导向凸台低头内六角（b="-"）
	{ std: 'din-931', codes: ['57'], type: 'bolt' },     // DIN 931 半牙外六角（**有真 b**）
	{ std: 'din-6921', codes: ['2112'], type: 'bolt' },  // DIN 6921 六角法兰螺栓（b="-"）
];

const num = (raw) => String(raw ?? '').replace(',', '.');

/* Bossard 对边有时写成 "DIN/s17" —— 取 s 后面的数字。 */
function acrossFlats(raw) {
	const s = String(raw ?? '');
	const m = s.match(/s(\d+(?:[.,]\d+)?)\s*$/);
	return m ? num(m[1]) : num(s);
}

/**
 * 同一 (螺纹, 长度) 下 Bossard 同时挂着 DIN 与 ISO 两套变体
 * （如 BN 57 = DIN 931 | ISO 4014：s=DIN/s17 与 ISO/s16、e=18.9 与 17.77）。
 * 本站标准库以 DIN 为准 → 同规格取 DIN 侧。
 */
function variantRank(r) {
	const s = String(r.s ?? '');
	if (s.startsWith('DIN/')) return 2;
	if (s.startsWith('ISO/')) return 0;
	return 1;
}

/**
 * ISO 粗牙螺纹的外径上偏差 d1 max（mm）—— 螺纹号 → 螺纹外径。
 *
 * 来源：ISO 261 / ISO 965 粗牙螺纹公称直径 + 紧固件标准表通用 d1 max 列
 * （与 ISO 4762 / 10642 / 4017 三张表的 d1 max 列同值）。
 * 这是**紧固件标准表的公共列**，不是某一家专有值。
 */
const D1_MAX = {
	M2: 2.5, 'M2.5': 3.1, M3: 3.4, 'M3.5': 3.8, M4: 4.3, M5: 5.3, M6: 6.4,
	M8: 8.4, M10: 10.3, M12: 12.4, M14: 14.4, M16: 16.4, M18: 18.4,
	M20: 20.4, M22: 22.4, M24: 24.4, M27: 27.4, M30: 30.4, M33: 33.4,
	M36: 36.4, M39: 39.4, M42: 42.4, M48: 48.4,
};

async function query(text, page = 0) {
	const params = `query=${encodeURIComponent(text)}&hitsPerPage=100&page=${page}`;
	const body = { requests: [{ indexName: INDEX, params }] };
	const r = await fetch(`https://${APP.toLowerCase()}-dsn.algolia.net/1/indexes/*/queries`, {
		method: 'POST',
		headers: {
			'X-Algolia-Application-Id': APP,
			'X-Algolia-API-Key': KEY,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
	if (!r.ok) throw new Error(`Algolia HTTP ${r.status} (${text})`);
	const j = await r.json();
	const res = j.results?.[0];
	if (!res) throw new Error(`Algolia 无结果 (${text}) :: ${JSON.stringify(j).slice(0, 200)}`);
	return res;
}

/** 抓某个 baseProductCode 的全部变体，按线程归并尺寸（长度维度单独枚举）。 */
async function variantsOf(code) {
	const out = [];
	let pages = 0;
	for (let p = 0; p < 40; p++) {
		const res = await query(`BN ${code}`, p);
		pages = res.nbPages ?? 0;
		for (const h of res.hits) {
			if (h.baseProductCode !== code) continue;
			const f = h.variantFeatures ?? {};
			const g = (k) => (f[k] ?? [])[0] ?? '';
			out.push({
				/* 线程名：Bossard 用欧式小数逗号（M2,5）—— 统一成点号，
				 * 否则 CSV 里会多出一列，且 D1_MAX 查不到该螺纹。 */
				thread: g('d%3Csub%3E1%3C%2Fsub%3E').replace(/,/g, '.'),
				d1: g('d%3Csub%3E1%3C%2Fsub%3E').replace(/,/g, '.'),
				d2: g('d%3Csub%3E2%3C%2Fsub%3E'),
				d2max: g('d%3Csub%3E2%3C%2Fsub%3E+max.'),
				k: g('k'),
				kmax: g('k+max.'),
				s: g('s'),
				t: g('t'),
				tmin: g('t+min.'),
				e: g('e'),
				emin: g('e+min.'),
				mmax: g('m+max.'),
				forT: g('for+thread'),
				L: g('L'),
				/* 部分螺纹件的螺纹长 b —— DIN 931 半牙必带此键；
				 * 全牙件该键写 "-"（占位），非 DIN 变体也写 "-"。 */
				b: g('b'),
			});
		}
		if (p + 1 >= pages) break;
	}
	console.error(`  [${code}] pages=${pages} variants=${out.length}`);
	return out;
}

const missing = [];
say('# standard,thread,length,d1,d2,s,k,b,t,m,h   (来源: Bossard 公开产品索引)');
for (const t of TARGETS) {
	if (only && t.std !== only) continue;
	const rows = [];
	for (const code of t.codes) rows.push(...(await variantsOf(code)));
	if (!rows.length) {
		say(`# ${t.std}: NO HITS`);
		continue;
	}
	// 按 (线程, 长度) 去重 —— 同一规格可能有多条 EAN/表面记录；
	// 同规格还可能是 DIN/ISO 两套变体（s、e 不同）→ 取 DIN 侧。
	const picked = new Map();
	for (const r of rows) {
		const key = `${r.thread}|${r.L}`;
		const prev = picked.get(key);
		if (prev && variantRank(r) <= variantRank(prev)) continue;
		picked.set(key, r);
	}
	const out = [];
	for (const r of picked.values()) {
		if (t.type === 'washer') {
			// washer 列：d1=外径 · d2=内径 · h=厚度
			// （与 bulk-import 的 washer 迷你语法「外径x内径x厚度」一致：
			//   given.d1 = 外径、given.d2 = 内径、given.h = 厚度，三者都是查表键）
			// Bossard 的 d1 = 内径、d2 = 外径 —— 位置与本站相反，故对调。
			// for+thread 用欧式小数逗号（M1,6）→ 去逗号，否则 CSV 多出一列。
			out.push([t.std, String(r.forT ?? '').replace(/,/g, '.'), '', num(r.d2), num(r.d1), '', '', '', '', '', num(r.s)].join(','));
		} else {
			// screw / bolt 列：d1=螺纹外径 · d2=头径 · s=对边 · k=头高 · b=螺纹长 · t=头厚下限
			const d1 = D1_MAX[r.thread] ?? '';
			if (!d1) {
				missing.push(`${t.std} ${r.thread} 线程外径未定义 —— 需补 D1_MAX`);
				continue;
			}
			// 螺纹长 b：Bossard 对全牙件写 b="-"（占位）→ 视作无 b，按全牙处理（b = 全长 L）；
			// 部分螺纹件（DIN 931 半牙、DIN 6912/7984/7380/6921 的长规格）写真值 → 直接用。
			// 注意 b="-" 是**逐行**属性，不是逐标准属性 —— 同一标准内长短规格混用。
			const b = r.b && r.b !== '-' ? r.b : r.L;
			// ISO 4017 外六角：Bossard 给 e=对角 / s=对边，本站 d2=头径取 e
			const d2 = num(r.d2 || r.d2max || r.e);
			// t = 头厚下限：Bossard 的 t 字段（无 min 后缀，如 ISO 10642）或 t min. 字段（如 ISO 4762）
			const tv = num(r.t || r.tmin);
			out.push([
				t.std,
				r.thread,
				r.L,
				d1,
				d2,
				acrossFlats(r.s),
				num(r.k || r.kmax),
				num(b),
				tv,
				'',
				'',
			].join(','));
		}
	}
	say(`# --- ${t.std} (${rows.length} variants) ---`);
	for (const line of out) say(line);
}
if (missing.length) {
	say('#');
	say('# 未覆盖项（需人工补）：');
	for (const m of missing) say(`#   ${m}`);
}

if (OUT) {
	writeFileSync(OUT, lines.join('\n') + '\n', 'utf8');
	console.error(`written ${OUT} (${lines.length} lines)`);
}

/* ── --apply：合并进 dimension-library.csv ───────────────────────────── */
if (APPLY) {
	const LIB = 'data/products/dimension-library.csv';
	/* 只并入新标准 —— 既有 din-912 / din-934 行的列语义不同源，不动。 */
	const NEW_STDS = new Set([
		'din-7991',
		'din-933',
		'din-125',
		'din-7380',
		'din-7984',
		'din-6912',
		'din-931',
		'din-6921',
	]);
	/* 本波新增的标准按抽取结果整体重建 → 先剔除，保证脚本幂等。 */
	const REBUILD_STDS = new Set(['din-7380', 'din-7984', 'din-6912', 'din-931', 'din-6921']);

	const cur = readFileSync(LIB, 'utf8')
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter(Boolean);
	const header = cur[0];
	const curRows = cur.slice(1);
	/* din-125 按新语义（d1=外径）整体重建 → 先剔除，保证脚本幂等。 */
	const keptRows = curRows.filter((l) => {
		const std = l.split(',')[0];
		return !REBUILD_STDS.has(std) && !l.startsWith('din-125,');
	});
	const curKey = new Set(
		keptRows.map((l) => {
			const c = l.split(',');
			return `${c[0]}|${c[1]}|${c[2]}`;
		}),
	);

	/** 数值格式：7.0 → 7；8.5 → 8.5；空 → 空 */
	const fmt = (v) => {
		if (v === '' || v === undefined) return '';
		const n = Number(v);
		if (!Number.isFinite(n)) return v;
		return Number.isInteger(n) ? String(n) : String(Number(n.toFixed(2)));
	};

	const added = [];
	let skipped = 0;
	for (const l of lines) {
		if (!l.trim() || l.startsWith('#')) continue;
		const c = l.split(',');
		if (!NEW_STDS.has(c[0])) continue;
		const key = `${c[0]}|${c[1]}|${c[2]}`;
		if (curKey.has(key)) {
			skipped++;
			continue;
		}
		curKey.add(key);
		added.push(c.map(fmt).join(','));
	}

	const threadOrder = (t) => {
		const m = String(t).match(/^M(\d+(?:\.\d+)?)$/);
		return m ? Number(m[1]) : 999;
	};
	added.sort((a, b) => {
		if (a[0] !== b[0]) return a[0].localeCompare(b[0]);
		const ta = threadOrder(a[1]);
		const tb = threadOrder(b[1]);
		if (ta !== tb) return ta - tb;
		return (Number(a[2]) || 0) - (Number(b[2]) || 0);
	});

	writeFileSync(LIB, [header, ...keptRows, ...added].join('\n') + '\n', 'utf8');
	const dist = added.reduce((m, l) => {
		const s = l.split(',')[0];
		m[s] = (m[s] ?? 0) + 1;
		return m;
	}, {});
	console.error(
		`[apply] 保留 ${keptRows.length} 行；新增 ${added.length} 行 ` +
			`(${Object.entries(dist).map(([k, n]) => `${k}:${n}`).join(' ')})；跳过 ${skipped} 条；` +
			`库合计 ${keptRows.length + added.length} 行`,
	);
}
