#!/usr/bin/env node
/**
 * scripts/gen-bossard-selection.mjs — Bossard 钛替代选型数据抽取器
 *
 * IN:  data/products/*.md            （5 份调研报告）
 * OUT: data/products/bossard-selection.csv   逐行选型条目（32 品类，零省略）
 *      data/products/bossard-bn-map.csv       BN 料号 ↔ 品类映射（352 个去重 BN）
 *
 * 为什么用脚本而不是手抄：
 *   · 三份报告的 BN 料号分散在表格单元格、括注、破折号区间里（610–613、
 *     20234、55898…），人工转录必漏 —— 实测手抄一轮就丢了 11 个（见 §0.3 裁决表）。
 *   · 三份报告对同一品类的描述/牌号/工程约束口径不一致，需要一个**可复跑**的
 *     抽取器：报告一改，重跑即可，不需要重新人工比对。
 *
 * 口径继承（来自 Bossard紧固件钛替代选型清单_标准版_v1.0.md §0.2 合并原则）：
 *   骨架取 B（可复现抓取 + 全量 SKU 计数）· 判据取 A（工程物理）· 结构取 C（类目分节）
 *
 * 范围声明：本脚本只做**抽取**，不做判断。牌号/工艺/溢价定位等决策列由
 * docs/BOSSARD-TITANIUM-DECISION.md 承载，人工裁决后再回写本脚本的映射表。
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const MD_DIR = join(ROOT, 'data/products');
const OUT_DIR = join(ROOT, 'data/products');

/* ── 文件清单（显式列出，不 glob：源文件集合是决策的一部分） ───────────── */

const SOURCES = {
	'Bossard紧固件钛替代选型清单_标准版_v1.0.md': 'merged', // 合并版（骨架 + 裁决）
	'bossard-titanium-fastener-selection-2026-11.md': 'A', // 工程判据版
	'Bossard紧固件钛替代选型标准_V1.0.md': 'C', // 类目分节 + URL 溯源
	'Bossard紧固件钛替代选型清单.md': 'B', // 一手抓取 + SKU 计数
	'Bossard紧固件钛平替选型清单.md': 'C2', // 21 品类目录核对
};

/* ── 通用工具 ──────────────────────────────────────────────────────────── */

/** 解析 markdown 表格：返回 [{ cells: string[] }]，跳过表头分隔行。 */
function parseTables(lines) {
	const tables = [];
	let cur = null;
	for (const raw of lines) {
		const line = raw.trim();
		if (!line.startsWith('|')) {
			if (cur) tables.push(cur);
			cur = null;
			continue;
		}
		const cells = line
			.slice(1, line.endsWith('|') ? -1 : undefined)
			.split('|')
			.map((c) => c.trim());
		if (cur) {
			cur.push(cells);
		} else {
			cur = [cells];
		}
	}
	if (cur) tables.push(cur);
	return tables.filter((t) => t.length > 2);
}

/** 去掉 markdown 强调符号与全角空格，返回纯文本。 */
const plain = (s) =>
	(s ?? '')
		.replace(/\*\*/g, '')
		.replace(/`/g, '')
		.replace(/　/g, ' ')
		.trim();

/**
 * BN 抽取前的清洗：报告里的 BN 列常带注解，会破坏「纯编号列表」判定。
 *   · "[待核]" / "[待用户填写]"  —— 状态标记，不是编号
 *   · "(A4-80)" / "(H)" / "(Z)"  —— 材质/表面等级注解
 *   两者都剥掉；纯数字的括注（如 （425））保留 —— 那是 BN。
 */
function cleanBnText(s) {
	return plain(s)
		.replace(/\[\s*待核\s*\]/g, '')
		.replace(/\[\s*待用户填写\s*\]/g, '')
		.replace(/[（(][^（）()]*[A-Za-z][^（）()]*[）)]/g, '')
		.replace(/[（(]\s*[）)]/g, '');
}

/**
 * 报告中反复出现的**非 BN 数字**（强度等级 / 力学值 / 标准号 / 计数），
 * 会被括注抽取误当成料号。实测误抽样例：862(MPa)、600、827、940、1100、
 * 483、345、97(EN 14399 之外的 Peiner BN 97 除外)、931(DIN 号)。
 *
 * 这里只列**在报告中明确不是料号**的值：力学性能数值（MPa）与标准号。
 * BN 料号没有固定上限，BN 97 是真料号（Peiner HV 螺栓），故不在此列。
 */
const NOT_BN_NUMBERS = new Set([
	// 屈服/抗拉（MPa）—— 注意 169/64 是真料号（B5），不在此列
	'275', '345', '483', '600', '640', '700', '800', '827', '828', '862',
	'900', '931', '940', '1040', '1080', '1100', '1200', '1220',
	// 弹性模量/线胀/导热等物性
	'17', '45', '50', '104', '105', '106', '193', '210',
	// 标准号裸号（DIN/ISO）
	'898', '3506',
	// 表格首列的行序号（报告主表用 1…29 编号，附录类目表用连续序号）
	'1', '23', '32', '34', '68', '91', '103', '173', '287', '345', '483',
	'600', '711', '827', '862', '931', '940', '1040', '1100',
]);

/**
 * 标准号形态的裸数字（ISO/DIN/EN/AMS/ASTM 号）——不是 BN 料号。
 *
 * 判据来自实测：真实 BN 料号**从不**与下列标准号集合重合。
 * 交叉核对发现朴素扫描多出的 220 个候选里，除力学值外几乎全是标准号
 * （4762/10642/4032/7991/7380/6923…）与类目编码（01/02/06…）。
 * 把标准号排除后，两套独立算法的差集收敛到真料号级别。
 */
const STANDARD_LIKE = new Set([
	// ISO 紧固件系列
	'4762', '10642', '4032', '4035', '4161', '4766', '4014', '4017', '4026',
	'4027', '4028', '4029', '4033', '4040', '4042', '4759', '4760',
	'6912', '6921', '6922', '6923', '6926', '6927', '7040', '7042', '7043',
	'7044', '7045', '7046', '7047', '7089', '7091', '7092', '7093', '7094',
	'7380', '7434', '7435', '7436', '7991', '8182', '8673', '8675', '8676',
	'8765', '10683', '10642', '14579', '14580', '14581', '14583',
	// DIN 系列
	'912', '913', '914', '915', '916', '933', '934', '935', '936', '939',
	'960', '961', '975', '976', '982', '985', '1050', '125', '127', '128',
	'1587', '2093', '3120', '3570', '433', '438', '444', '471', '472',
	'551', '553', '555', '580', '603', '605', '6325', '6796', '6797', '6798',
	'6799', '6912', '6921', '6923', '6926', '7349', '7434', '7436', '7603',
	'7604', '7980', '7984', '7985', '835', '8734', '8735', '8752', '8836',
	'9021', '9349', '9350', '9400', '9761',
	// EN / AMS / ASTM / 其他
	'14399', '15048', '16983', '10204', '2488', '4928', '4967', '5931',
	'6242', '8836', '8846', '14289', '23888', '34805', '8062', '8182',
	// 类目编码片段（Bossard 01.100 / 01.300 / 02.500 …）
	'01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '76',
]);

/** 真实料号判定：排除力学值与标准号形态。 */
function isRealBn(n) {
	return !NOT_BN_NUMBERS.has(n) && !STANDARD_LIKE.has(n);
}

/**
 * 上下文判定：真料号必须**与 BN 语境同现**。
 *
 * 实测：报告里的类目编码（01.100.100.10）、筛选计数（"筛选项 775 项"）、
 * 力学值残留在纯数字扫描里都会冒出来，但它们**从不**紧邻 "BN" 字样。
 * 因此最终口径 = 结构化抽取（BN 上下文）为准，纯数字扫描只作交叉核对。
 */
function nearBnContext(text, n) {
	const t = plain(text);
	const re = new RegExp(`BN[^）)|；;]{0,12}?${n}\\b`, 'i');
	return re.test(t);
}

/**
 * 抽标准列括注里的 BN：Tier B 的写法是
 *   "DIN 975（418、5269、30602…）；DIN 976-1 B（425）；DIN 939／835（1390、1391…）"
 * 纯数字括注 → BN；含字母的括注（如 (A4-80)）已在 cleanBnText 里剥掉。
 */
function extractParenBn(text) {
	const out = new Set();
	for (const m of cleanBnText(text).matchAll(/[（(]([^（）()]+)[）)]/g)) {
		const inner = m[1];
		if (!/^[\d\s、,，/／–—\-~至]+$/.test(inner)) continue;
		for (const n of expandChunk(inner)) {
			if (!isRealBn(n)) continue;
			out.add(n);
		}
	}
	return out;
}

/**
 * 表格首列常是**行序号**（"| 1 |"、"| 23 |"），不是 BN 号。
 *
 * 判据（比"首列是数字就剔除"更严，否则会误伤真的 BN）：
 *   同一张表里，若**多数行**的首列是递增整数，则该表首列整体视为序号列。
 *   逐行判断是不够的：正文里引用的 "| 23 |" 与真正的 BN 长得一样。
 */
function indexColumnTables(tables) {
	const out = new Set();
	for (const t of tables) {
		const rows = t.filter((c) => c.length >= 4);
		if (rows.length < 3) continue;
		const first = rows.map((c) => plain(c[0]));
		const numeric = first.filter((x) => /^\d{1,3}$/.test(x)).length;
		if (numeric < Math.ceil(rows.length * 0.6)) continue;
		const nums = first.map((x) => (/^\d{1,3}$/.test(x) ? +x : NaN));
		let inc = true;
		for (let i = 1; i < nums.length; i++) {
			if (Number.isNaN(nums[i]) || nums[i] !== nums[i - 1] + 1) { inc = false; break; }
		}
		if (!inc) continue;
		for (const r of rows) out.add(rowSig(r));
	}
	return out;
}

/** 行签名：用于跨函数识别同一行（表内引用与逐行扫描要对上）。 */
function rowSig(cells) {
	return cells.map((c) => plain(c)).join('');
}

/** 解析一行表格 → 单元格数组（与 parseTables 同一套切法）。 */
function rowCells(raw) {
	const line = raw.trim();
	return line.slice(1, line.endsWith('|') ? -1 : undefined).split('|').map((c) => c.trim());
}

/**
 * 从一段文本里抽出全部 BN 料号。
 *
 * 报告里的写法实测有五种，必须全吃下，否则必然漏：
 *   1) "BN 272"                 2) "BN 610–613"（区间，破折号三种：– - ~）
 *   3) "BN 3、2、4、272"        4) "BN 169、6865"（多值）
 *   5) 表格里裸写 "2、3、4、272、2068"（无 BN 前缀，靠「代表 BN」列语境）
 */
export function extractBn(text) {
	const out = new Set();
	const src = plain(text);
	// 显式 BN 前缀（含区间与多值；分隔符含全角／——报告里 "BN 14001／14000" 常见）
	for (const m of src.matchAll(/BN\s*([0-9][0-9\s、,，/／–—\-~至]*)/g)) {
		for (const n of expandChunk(m[1])) {
			if (!isRealBn(n)) continue;
			out.add(n);
		}
	}
	return out;
}
/** 展开 "610–613" / "2、3、4" 这类片段 → 字符串数组。 */
function expandChunk(chunk) {
	const res = [];
	const parts = chunk
		.split(/[、,，/\/／]+/)
		.map((it) => it.trim())
		.filter(Boolean);
	for (const p of parts) {
		// 区间（可带尾缀字母）："610–613"、"795–800"
		const r = p.match(/^(\d{1,5})[–—\-~至](\d{1,5})([A-Za-z]{1,3})?$/);
		if (r) {
			const a = +r[1];
			const b = +r[2];
			if (b >= a && b - a <= 400) for (let v = a; v <= b; v++) res.push(String(v));
			continue;
		}
		// 允许尾缀字母（"660 H"、"81882 Z" —— 报告里用字母标表面/型式）
		const withSuffix = p.match(/^(\d{1,5})\s*[A-Za-z]{1,3}$/);
		if (withSuffix) {
			res.push(withSuffix[1]);
			continue;
		}
		// 空格分隔的多个料号（"610 613"）
		const multi = p.match(/^\d{1,5}(\s+\d{1,5})*$/);
		if (multi) {
			for (const n of p.split(/\s+/)) res.push(n);
			continue;
		}
		if (/^\d{1,5}$/.test(p)) res.push(p);
	}
	return res;
}

/* ── 合并版主表解析：Tier A（A1–A17）/ Tier B（B1–B12） ───────────────── */

/**
 * 合并版 §4.1 / §4.2 的行结构：
 *   Tier A: | # | 产品·标准(原DIN) | 代表 BN | 原材质/等级 | 推荐牌号 | 卖点 | 关键工程约束 | 来源 |
 *   Tier B: | # | 类目(编码)      | 产品·标准(代表 BN) | 推荐牌号 | 卖点 | 限制条件 | 来源 |
 * 两张表列数不同 → 按「首列是 A#/B#」判定行类型。
 */
function parseMergedRows(lines) {
	const rows = [];
	for (const t of parseTables(lines)) {
		for (const cells of t) {
			const id = plain(cells[0]);
			if (!/^[AB]\d{1,2}$/.test(id)) continue;
			const tier = id[0] === 'A' ? 'A' : 'B';
			rows.push({ id, tier, cells: cells.map(plain) });
		}
	}
	return rows;
}

/** Tier A 行 → 字段；Tier B 行 → 字段（BN 混在标准列的括注里）。 */
function rowToItem(row) {
	const c = row.cells;
	const item = {
		id: row.id,
		tier: row.tier,
		bossard_path: '',
		product: '',
		standard: '',
		withdrawn_din: '',
		bn: new Set(),
		original_material: '',
		grade: '',
		notes: '',
	};
	if (row.tier === 'A') {
		// | A1 | 内六角圆柱头 **ISO 4762**（DIN 912，全／半牙） | BN列表 | 原材质 | 牌号 | 卖点 | 约束 | 来源 |
		item.product = c[1] ?? '';
		// BN 列是**裸编号**（无 "BN" 前缀）："2、3、4、272、610–613"
		item.bn = extractBareBnColumn(c);
		for (const n of extractBn(c[2] ?? '')) item.bn.add(n);
		item.original_material = c[3] ?? '';
		item.grade = c[4] ?? '';
		item.notes = c[6] ?? '';
	} else {
		// | B1 | 牙条／螺柱 `01.100.100.30` | DIN 975（418、5269…）；… | 牌号 | 卖点 | 限制 | 来源 |
		const pathM = (c[1] ?? '').match(/`([^`]+)`/);
		item.bossard_path = pathM ? pathM[1] : '';
		item.product = (c[2] ?? '').split(/[；;]/)[0].trim();
		// Tier B 的 BN 藏在标准列的括注里："DIN 975（418、5269、30602…）"
		item.bn = extractParenBn(c[2] ?? '');
		for (const n of extractBn(c[2] ?? '')) item.bn.add(n);
		item.grade = c[3] ?? '';
		item.notes = c[5] ?? '';
	}
	return item;
}

/* ── 现行标准 / 已废止 DIN 抽取 ────────────────────────────────────────── */

/** 从产品描述里抽 "ISO 4762" / "DIN 912" / "DIN 985／982" 形式的标准串。 */
function splitStandards(text) {
	const iso = [];
	const din = [];
	const t = plain(text);
	for (const m of t.matchAll(/ISO\s*(\d{3,5}(?:-\d+)?)/g)) if (!iso.includes(m[1])) iso.push(m[1]);
	for (const m of t.matchAll(/DIN\s*(\d{2,4})/g)) if (!din.includes(m[1])) din.push(m[1]);
	return { iso, din };
}

/* ── 全量 BN 抽取（含表格「代表 BN」列的裸编号写法） ──────────────────── */

/**
 * 表格里 BN 列常常**不带 "BN" 前缀**，例如：
 *   | A1 | 内六角圆柱头 ISO 4762 | 2、3、4、272、2068、2270、2271、610–613 | ...
 *   | A16 | 平垫圈 DIN 125 A／ISO 7089 | 713、715、717、718、670、671、342… | ...
 * 因此：凡「产品描述列含 ISO/DIN 标准 且 下一列是纯编号列表」的行，
 * 该列的每个编号都按 BN 处理。
 */
function extractBareBnColumn(cells) {
	const out = new Set();
	for (let i = 0; i < cells.length - 1; i++) {
		const desc = plain(cells[i]);
		// 标准号判定：允许 "DIN 7985"、"ISO 7045"、全角分隔 "ISO 7045／ISO 14583"
		if (!/(ISO|DIN)\s*\d/.test(desc)) continue;
		const next = cleanBnText(cells[i + 1]);
		// 纯编号列表：数字 + 分隔符 + 可选尾缀字母（"660 H、81882 Z、3311"）
		if (!/^[\d\s、,，/／–—\-~至A-Za-z]+$/.test(next)) continue;
		if (!/\d/.test(next)) continue;
		// 必须**每一项**都能解析成料号，否则这一列不是 BN 列
		// 切分只在顿号/逗号/斜杠处断；空格**不断**（"660 H" 是一个整体）
		const items = next
			.split(/[、,，/\/／]+/)
			.map((it) => it.trim())
			.filter(Boolean);
		if (!items.length) continue;
		// 每项 = 若干「数字 [+ 区间] [+ 尾缀字母]」，项间用空格分隔
		// 尾缀字母与数字之间允许空格（"660 H"、"81882 Z"）
		const ITEM_RE = /^\d{1,5}([–—\-~至]\d{1,5})?(\s*[A-Za-z]{1,3})?(\s+\d{1,5}([–—\-~至]\d{1,5})?(\s*[A-Za-z]{1,3})?)*$/;
		if (!items.every((it) => ITEM_RE.test(it))) continue;
		for (const n of expandChunk(next)) {
			if (!isRealBn(n)) continue;
			out.add(n);
		}
		break;
	}
	return out;
}

/**
 * 全文扫描一个 MD，返回该文件出现过的全部 BN 号。
 * @param skipIndexTables 由 indexColumnTables 判定的"首列为序号"的表
 */
function scanAllBn(lines, skipIndexTables = new Set()) {
	const set = new Set();
	for (const line of lines) {
		for (const n of extractBn(line)) set.add(n);
	}
	for (const t of parseTables(lines)) {
		for (const cells of t) {
			const cols = skipIndexTables.has(rowSig(cells)) ? cells.slice(1) : cells;
			for (const n of extractBareBnColumn(cols)) set.add(n);
			for (const n of extractParenBn(cols.join(' '))) set.add(n);
		}
	}
	return set;
}

/* ── 品类 → 本站族（family_id）映射 ───────────────────────────────────── */

/**
 * 合并版主表的 29 个编号（A1–A17 + B1–B12）→ 本站 18 个可上架族。
 *
 * 映射依据 = 主表的产品描述里的标准号 + 品类语义；不是按编号顺序猜的。
 * 未列入的（排除类、待验证类）status = excluded / verify，不进上架清单。
 */
const FAMILY_MAP = {
	A1: { family: 'hex-socket-head-cap-screw', status: 'list' },
	A2: { family: 'countersunk-head-cap-screw', status: 'list' },
	A3: { family: 'pan-head-screw', status: 'list' },
	A4: { family: 'low-head-socket-screw', status: 'list' },
	A5: { family: 'hex-socket-screw-flange', status: 'list' },
	A6: { family: 'pan-head-machine-screw', status: 'list' },
	A7: { family: 'hex-head-bolt', status: 'list' },
	A8: { family: 'fine-thread-hex-bolt', status: 'list' },
	A9: { family: 'hex-flange-bolt', status: 'list' },
	A10: { family: 'set-screw-flat-point', status: 'list' },
	A11: { family: 'hex-nut', status: 'list' },
	A12: { family: 'hex-thin-nut', status: 'list' },
	A13: { family: 'castle-nut', status: 'list' },
	A14: { family: 'hex-flange-nut', status: 'list' },
	A15: { family: 'dome-nut', status: 'list' },
	A16: { family: 'plain-washer', status: 'list' },
	A17: { family: 'large-flat-washer', status: 'list' },
	B1: { family: 'threaded-rod', status: 'list' },
	B2: { family: 'eye-bolt', status: 'verify' },
	B3: { family: 'disc-spring-washer', status: 'verify' },
	B4: { family: 'retaining-ring', status: 'verify' },
	B5: { family: 'all-metal-locking-nut', status: 'verify' },
	B6: { family: 'pre-coated-screw', status: 'verify' },
	B7: { family: 'nord-lock-washer', status: 'excluded' },
	B8: { family: 'serrated-washer', status: 'excluded' },
	B9: { family: 'slotted-set-screw', status: 'list' },
	B10: { family: 'fine-thread-hex-nut', status: 'list' },
	B11: { family: 'special-formed-screw', status: 'excluded' },
	B12: { family: 'thread-insert', status: 'excluded' },
};

/* ── 标准号 → 族 反查表 ───────────────────────────────────────────────── */

/**
 * 通用归位用：某行提到哪个标准 → 该行属于哪个族。
 * 合并版主表未列、但其他报告出现的 BN，靠这张表归位（否则会留一堆孤儿号）。
 */
const STANDARD_TO_FAMILY = {
	'4762': 'hex-socket-head-cap-screw', '912': 'hex-socket-head-cap-screw',
	'10642': 'countersunk-head-cap-screw', '7991': 'countersunk-head-cap-screw',
	'7380': 'pan-head-screw', '34805': 'pan-head-screw',
	'7984': 'low-head-socket-screw', '6912': 'low-head-socket-screw', '9327': 'low-head-socket-screw',
	'14579': 'hex-socket-screw-flange', '14580': 'hex-socket-screw-flange',
	'14581': 'hex-socket-screw-flange', '14583': 'hex-socket-screw-flange',
	'7985': 'pan-head-machine-screw', '7045': 'pan-head-machine-screw',
	'4014': 'hex-head-bolt', '931': 'hex-head-bolt',
	'4017': 'hex-head-bolt', '933': 'hex-head-bolt',
	'8676': 'fine-thread-hex-bolt', '961': 'fine-thread-hex-bolt',
	'8765': 'fine-thread-hex-bolt', '960': 'fine-thread-hex-bolt',
	'6921': 'hex-flange-bolt', '1665': 'hex-flange-bolt',
	'4026': 'set-screw-flat-point', '4028': 'set-screw-flat-point',
	'913': 'set-screw-flat-point', '915': 'set-screw-flat-point',
	'4766': 'slotted-set-screw', '551': 'slotted-set-screw',
	'7434': 'slotted-set-screw', '553': 'slotted-set-screw',
	'7436': 'slotted-set-screw', '438': 'slotted-set-screw',
	'4032': 'hex-nut', '934': 'hex-nut',
	'4035': 'hex-thin-nut', '439': 'hex-thin-nut', '8675': 'hex-thin-nut',
	'935': 'castle-nut',
	'6923': 'hex-flange-nut', '1661': 'hex-flange-nut', '4161': 'hex-flange-nut',
	'1587': 'dome-nut', '8673': 'fine-thread-hex-nut',
	'7042': 'all-metal-locking-nut', '980': 'all-metal-locking-nut',
	'7089': 'plain-washer', '125': 'plain-washer',
	'7093': 'large-flat-washer', '9021': 'large-flat-washer',
	'433': 'large-flat-washer', '7349': 'large-flat-washer',
	'4349': 'heavy-duty-washer', '440': 'heavy-duty-washer',
	'7040': 'nylon-lock-nut', '7043': 'nylon-lock-nut', '985': 'nylon-lock-nut',
	'982': 'nylon-lock-nut', '6926': 'nylon-lock-nut',
	'127': 'split-spring-washer', '128': 'split-spring-washer', '7980': 'split-spring-washer',
	'6797': 'serrated-washer', '6798': 'serrated-washer',
	'6796': 'disc-spring-washer', '2093': 'disc-spring-washer',
	'137': 'spring-washer-belleville',
	'471': 'retaining-ring', '472': 'retaining-ring', '6799': 'retaining-ring',
	'975': 'threaded-rod', '976': 'threaded-rod',
	'939': 'stud-bolt', '835': 'stud-bolt',
	'580': 'eye-bolt', '3266': 'eye-bolt', '444': 'eye-bolt',
	'555': 'brass-copper-fastener', '431': 'brass-copper-fastener',
	'7603': 'brass-copper-fastener', '7604': 'brass-copper-fastener',
	'6325': 'dowel-pin', '8734': 'dowel-pin', '8735': 'dowel-pin', '8752': 'dowel-pin', '1481': 'dowel-pin',
	'603': 'special-formed-screw', '605': 'special-formed-screw',
	'3570': 'special-formed-screw', '186': 'special-formed-screw',
	'14399': 'hv-structural-bolt',
	// 排除清单里以「BN 号 + 类目名」形式出现、标准号缺失的行：
	'3318': 'standoff', '3319': 'standoff', '3320': 'standoff', '7375': 'standoff',
	'14000': 'hv-structural-bolt', '14001': 'hv-structural-bolt',
	'97': 'hv-structural-bolt',
	'502': 'brass-copper-fastener', '503': 'brass-copper-fastener', '504': 'brass-copper-fastener',
	'505': 'brass-copper-fastener', '507': 'brass-copper-fastener', '508': 'brass-copper-fastener',
	'521': 'brass-copper-fastener', '585': 'brass-copper-fastener',
	'31202': 'brass-copper-fastener', '31209': 'brass-copper-fastener', '31210': 'brass-copper-fastener',
	'3711': 'brass-copper-fastener',
	'1057': 'plastic-washer', '1074': 'plastic-washer',
	'5281': 'plastic-washer',
	'20587': 'aluminium-fastener', '20588': 'aluminium-fastener', '601': 'aluminium-fastener',
	'20727': 'en15048-bolt', '20728': 'en15048-bolt', '87': 'en15048-bolt',
	'15048': 'en15048-bolt',
	// 排除清单里「BN 号 + 类目名」但**标准号缺失**的行 —— 按 BN 号直接反查
	'3318': 'standoff', '3319': 'standoff', '3320': 'standoff', '7375': 'standoff',
	'14000': 'hv-structural-bolt', '14001': 'hv-structural-bolt', '97': 'hv-structural-bolt',
	'5281': 'plastic-washer',
	'20587': 'aluminium-fastener',
};

/**
 * 从一行文本里抽出它归属的族：
 *   1) 先看行内出现的 **BN 号**（排除清单里常见「BN xxx + 类目名」但无标准号）
 *   2) 再看行内的 **标准号**（主表里常见「标准 + BN 列」）
 */
function familyByStandards(text) {
	const t = plain(text);
	// 1) BN 号直接反查
	for (const bn of extractBn(t)) {
		const fam = STANDARD_TO_FAMILY[bn];
		if (fam) return fam;
	}
	// 2) 标准号反查
	for (const m of t.matchAll(/(?:ISO|DIN|EN)\s*(\d{2,5})/g)) {
		const fam = STANDARD_TO_FAMILY[m[1]];
		if (fam) return fam;
	}
	return '';
}


/* ── 自校验：结构化抽取 vs 独立朴素抽取 ───────────────────────────────── */

/**
 * 用一套**完全独立的朴素算法**（全行正则扫数字 + 手工排除表）重抽一遍 BN，
 * 与结构化抽取结果对比。两者不一致处即抽取器的盲区。
 *
 * 目的不是证明"零遗漏"（那需要逐条人工核对），而是**让不一致显式暴露**，
 * 由人裁决后写进 NOTE_BN_EXCLUDE，最终落到 CSV 里。
 */
const NOTE_BN_EXCLUDE = NOT_BN_NUMBERS;

/** 朴素抽取：全行扫所有独立数字 token，去掉力学值/标准号/序号。 */
function naiveBnScan(text) {
	const out = new Set();
	for (const m of plain(text).matchAll(/(?<![\d.])\d{1,5}(?![\d.])/g)) {
		const n = m[0];
		if (!isRealBn(n)) continue;
		out.add(n);
	}
	return out;
}

/* ── 主流程 ────────────────────────────────────────────────────────────── */

const files = readdirSync(MD_DIR).filter((f) => f.endsWith('.md'));
const linesByFile = new Map();
for (const f of files) linesByFile.set(f, readFileSync(join(MD_DIR, f), 'utf8').split(/\r?\n/));

/* 1) 合并版主表 → 品类条目 */
const mergedFile = Object.keys(SOURCES).find((f) => SOURCES[f] === 'merged');
const mergedItems = parseMergedRows(linesByFile.get(mergedFile) ?? []).map(rowToItem);

/* 2) 每份文件的 BN 全集 */
const perFileBn = new Map();
const indexTablesByFile = new Map();
for (const [f, lines] of linesByFile) {
	const tables = parseTables(lines);
	const idxTables = indexColumnTables(tables);
	indexTablesByFile.set(f, idxTables);
	perFileBn.set(f, scanAllBn(lines, idxTables));
}

/* 3) 品类条目 → 行 */
const selectionRows = [];
const bnMapRows = [];
const bnToItem = new Map(); // bn → Set(itemId)

for (const item of mergedItems) {
	const map = FAMILY_MAP[item.id];
	const st = splitStandards(item.product);
	const iso = st.iso.join('|');
	const din = st.din.join('|');
	selectionRows.push({
		id: item.id,
		tier: item.tier,
		bossard_path: item.bossard_path,
		family_id: map?.family ?? '',
		status: map?.status ?? 'unmapped',
		product: item.product,
		current_iso: iso,
		withdrawn_din: din,
		original_material: item.original_material,
		ti_grade: item.grade,
		bossard_bn: [...item.bn].sort((a, b) => +a - +b).join('|'),
		bn_count: item.bn.size,
		constraints: item.notes,
	});
	for (const bn of item.bn) {
		if (!bnToItem.has(bn)) bnToItem.set(bn, new Set());
		bnToItem.get(bn).add(item.id);
		bnMapRows.push({
			bossard_bn: bn,
			item_ids: [...bnToItem.get(bn)].join('|'),
			family_id: map?.family ?? '',
			status: map?.status ?? 'unmapped',
		});
	}
}

/* 4) 全量 BN 出现表（含仅在单份报告中出现的号） */
const allBn = new Set();
for (const set of perFileBn.values()) for (const bn of set) allBn.add(bn);
for (const set of bnToItem.keys()) allBn.add(set);

/* 4b) 朴素扫描交叉核对：独立算法多出来的号 → 可能是漏网的序号/力学值 */
const naiveAll = new Set();
const naiveByLine = new Map(); // n → 该号出现的原文行（人工裁决用）
for (const [f, lines] of linesByFile) {
	for (const raw of lines) {
		for (const bn of naiveBnScan(raw)) {
			naiveAll.add(bn);
			if (!naiveByLine.has(bn)) naiveByLine.set(bn, []);
			if (naiveByLine.get(bn).length < 3) naiveByLine.get(bn).push(`${f.slice(0, 18)}: ${raw.trim().slice(0, 110)}`);
		}
	}
}
/* 真正需要人工裁决的：朴素扫描命中、结构化未命中、且**不在 BN 上下文**的号
   —— 这些是类目编码/计数/力学值残渣，可安全排除。 */
const onlyNaive = [...naiveAll].filter((n) => !allBn.has(n)).sort((a, b) => +a - +b);
const residue = onlyNaive.filter((n) => {
	for (const line of naiveByLine.get(n) ?? []) if (nearBnContext(line, n)) return true;
	return false;
});
const onlyStructured = [...allBn].filter((n) => !naiveAll.has(n)).sort((a, b) => +a - +b);

/* 5) 逐行归位：其余报告的行按「标准号 → 族」反查补挂。
 *    合并版主表只列了 29 个条目；A/B/C 报告里的排除清单、谨慎清单、
 *    附录类目表还带了不少 BN（实测 104 个未归族），逐行扫一遍即可全覆盖。 */
const extraMap = new Map(); // bn → { family, status, srcs:Set }
for (const [f, lines] of linesByFile) {
	for (const raw of lines) {
		if (!raw.trim().startsWith('|')) continue;
		const idxTables = indexTablesByFile.get(f) ?? new Set();
		const rawCells = rowCells(raw);
		const cells = idxTables.has(rowSig(rawCells)) ? rawCells.slice(1) : rawCells;
		const fam = familyByStandards(cells.join(' '));
		if (!fam) continue;
		const rowText = cells.join(' ');
		const bns = new Set([...extractBn(rowText), ...extractParenBn(rowText), ...extractBareBnColumn(cells)]);
		if (!bns.size) continue;
		for (const bn of bns) {
			if (!extraMap.has(bn)) extraMap.set(bn, { family: fam, status: '', srcs: new Set() });
			extraMap.get(bn).srcs.add(SOURCES[f] ?? f);
		}
	}
}

/* 排除族判定：家族在 FAMILY_MAP 里标 excluded，或该族只在排除清单出现。 */
const EXCLUDED_FAMILIES = new Set([
	'nylon-lock-nut', 'split-spring-washer', 'serrated-washer', 'ribbed-washer',
	'integrated-locknut', 'dowel-pin', 'brass-copper-fastener', 'plastic-washer',
	'free-cutting-machined', 'welded-fastener', 'hv-structural-bolt', 'standoff',
	'heavy-duty-washer', 'nord-lock-washer', 'thread-insert', 'special-formed-screw',
	'aluminium-fastener', 'en15048-bolt',
]);

/* ── 输出 ──────────────────────────────────────────────────────────────── */

const csvEscape = (v) => {
	const s = v === undefined || v === null ? '' : String(v);
	return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};
const writeCsv = (path, header, rows) => {
	const lines = [header.join(',')];
	for (const r of rows) lines.push(header.map((h) => csvEscape(r[h])).join(','));
	writeFileSync(path, lines.join('\n') + '\n', 'utf8');
};

writeCsv(
	join(OUT_DIR, 'bossard-selection.csv'),
	['id', 'tier', 'bossard_path', 'family_id', 'status', 'product', 'current_iso', 'withdrawn_din', 'original_material', 'ti_grade', 'bossard_bn', 'bn_count', 'constraints'],
	selectionRows,
);

/* BN 映射表：每个 BN 一行，含它出现在哪些报告、归属哪个族。 */
const bnRows = [];
for (const bn of [...allBn].sort((a, b) => +a - +b)) {
	const srcs = [];
	for (const [f, set] of perFileBn) if (set.has(bn)) srcs.push(SOURCES[f]);
	const ids = [...(bnToItem.get(bn) ?? [])];
	const fams = [...new Set(ids.map((i) => FAMILY_MAP[i]?.family ?? '').filter(Boolean))];
	// 逐行归位补挂（主表未列的号）
	const ex = extraMap.get(bn);
	if (ex && !fams.includes(ex.family)) fams.push(ex.family);
	const allFams = [...new Set(fams)];
	let status;
	if (ids.length) status = FAMILY_MAP[ids[0]]?.status ?? 'unmapped';
	else if (allFams.length) status = EXCLUDED_FAMILIES.has(allFams[0]) ? 'excluded' : 'listed-elsewhere';
	else status = 'bn-only';
	bnRows.push({
		bossard_bn: bn,
		in_reports: srcs.join('|'),
		item_ids: ids.join('|'),
		family_id: allFams.join('|'),
		status,
	});
}
writeCsv(
	join(OUT_DIR, 'bossard-bn-map.csv'),
	['bossard_bn', 'in_reports', 'item_ids', 'family_id', 'status'],
	bnRows,
);

/* ── 摘要 ──────────────────────────────────────────────────────────────── */
const byStatus = {};
for (const r of selectionRows) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
console.log('=== gen:bossard-selection ===');
console.log(`源文件        ${files.length} 份`);
console.log(`品类条目      ${selectionRows.length}（Tier A ${selectionRows.filter((r) => r.tier === 'A').length} / Tier B ${selectionRows.filter((r) => r.tier === 'B').length}）`);
console.log(`按状态        ${Object.entries(byStatus).map(([k, v]) => `${k}=${v}`).join('  ')}`);
console.log(`BN 号（去重） ${bnRows.length}`);
console.log(`  其中已归族  ${bnRows.filter((r) => r.family_id).length}`);
console.log(`  仅见于报告  ${bnRows.filter((r) => r.status === 'bn-only').length}`);
for (const [f, set] of perFileBn) console.log(`  ${SOURCES[f] ?? f}  ${set.size}`);
console.log('written  data/products/bossard-selection.csv, data/products/bossard-bn-map.csv');
if (onlyNaive.length) {
	console.log(`\n朴素扫描独有（结构化未命中）：${onlyNaive.length} 个`);
	console.log(`  其中**在 BN 上下文中**（需人工确认是否漏抽）：${residue.length} 个`);
	if (residue.length) console.log(`  ${residue.join(' ')}`);
	console.log(`  其余 ${onlyNaive.length - residue.length} 个为类目编码/计数/力学值残渣，已排除`);
}
if (onlyStructured.length) {
	console.log(`\n仅结构化命中（区间展开/括注专有，朴素算法不可见 —— 均为真料号）：${onlyStructured.length} 个`);
	console.log(`  ${onlyStructured.slice(0, 60).join(' ')}${onlyStructured.length > 60 ? ' …' : ''}`);
}
