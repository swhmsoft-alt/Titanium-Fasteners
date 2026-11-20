#!/usr/bin/env node
/**
 * scripts/products.mjs — 产品数据管理 CLI（产品数据的**唯一写入口**）。
 *
 * IN:   data/products/*.csv              真相源
 * OUT:  data/products/*.csv              经本 CLI 写入
 * GATE: 每次写完自动跑 scripts/gen-products.mjs（0 errors 才算成功）
 *
 * 为什么需要 CLI
 * --------------
 * 产品矩阵的编辑有三条硬约束：列顺序不能错（规格表的列 = 参数定义）、
 * 新族必须同时有 dimensions/<family_id>.csv、每次改完必须过数据闸门。
 * 手改 CSV 会漏掉其中任何一条，而漏掉的后果是在构建时才炸。
 * CLI 把这三条变成一次命令的必然结果。
 *
 * 命令
 * ----
 *   list                       列出分类与族（含状态、规格行数）
 *   cat-add  <id> <name>       新增分类      [--desc= --image= --order=]
 *   cat-rm   <id>              删除分类（仍有族时拒绝）
 *   fam-add  <family_id>       新增产品族    [--name= --standards= --category=
 *                                                 --materials= --finishes= --desc=
 *                                                 --status=]（type 由 standards 派生）
 *   fam-set  <family_id>       改族字段      [--<字段>=值 ...]
 *   fam-rm   <family_id>       删除产品族（含其规格矩阵）
 *   spec-add <family_id>       追加规格行    [--std= --thread= --length= --d1= ...]
 *   spec-rm  <family_id>       删除规格行    [--std= --thread= --length=]
 *   export   <family_id>       导出为 Markdown（只读视图，不是录入格式）
 *   bulk-import <file.csv>     从 8 列模板批量导入产品（唯一的批量录入格式）
 *   assets                    素材盘点：谁缺图、谁没人认领
 *   validate                   只跑数据闸门
 *
 * 多值字段（standards / materials / finishes / applications / seo_keywords）
 * 用 `|` 分隔 —— 与 CSV 内的写法一致，不引入第二种分隔符。
 */
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { readCsv, writeCsv } from './lib/csv.mjs';
import { scanAssets } from './lib/assets.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const DATA = join(ROOT, 'data/products');
const DIM_DIR = join(DATA, 'dimensions');

/* 产品表 —— 编辑人员填的核心信息，第 8 列 = 图片原名（导入时自动加 SKU 前缀）。
   type 列 = 产品类型（screw / bolt / nut / washer / stud …）—— 显式存储，
   不再由 standards[0] 派生：产品可以没有标准，也可以挂多个标准而类型不变。 */
const FAM_HEADER = [
	'family_id',
	'name',
	'category',
	'type',
	'standards',
	'materials',
	'finishes',
	'description',
	'image',
];
/* 管理表 —— 状态与商务数据，与产品表分开管。 */
const MGT_HEADER = [
	'family_id',
	'status',
	'moq',
	'packaging',
	'lead_time',
	'price_from',
	'price_to',
	'price_currency',
	'price_unit',
];
const CAT_HEADER = ['id', 'name', 'description', 'image', 'order'];
/* 标准字典 —— auto=1 表示"自动登记、待人工核对"（来自批量导入，未登记过的标准）。 */
const STD_HEADER = ['id', 'label', 'din', 'iso', 'title', 'type', 'notes', 'auto'];
/** 产品表可改字段（flags 里可改的字段）。 */
const FAM_FIELDS = FAM_HEADER.filter((h) => h !== 'family_id');
/** 管理表可改字段 —— status 在这里，不在产品表。 */
const MGT_FIELDS = MGT_HEADER.filter((h) => h !== 'family_id');
/** 多值字段 —— 用 | 分隔。 */
const LIST_FIELDS = ['standards', 'materials', 'finishes'];

/* ── 参数 ─────────────────────────────────────────────────────────────── */

const argv = process.argv.slice(2);
const cmd = argv[0];
const positionals = [];
const flags = {};
for (const a of argv.slice(1)) {
	const m = /^--([^=]+)(?:=([\s\S]*))?$/.exec(a);
	if (m) {
		const k = m[1];
		const v = m[2] === undefined ? true : m[2];
		/* 重复的 flag 收成数组 —— fam-add 的 --spec 就是这么传多行的。 */
		if (flags[k] === undefined) flags[k] = v;
		else if (Array.isArray(flags[k])) flags[k].push(v);
		else flags[k] = [flags[k], v];
	} else positionals.push(a);
}

/* ── 小工具 ───────────────────────────────────────────────────────────── */

const die = (msg) => {
	console.error(`✗ ${msg}`);
	process.exit(1);
};
const ok = (msg) => console.log(`✓ ${msg}`);

/** flag 值 → 数组（重复 flag 会收成数组）。 */
const toArray = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

const readTable = (name) => readCsv(join(DATA, name)) ?? { header: [], rows: [] };
const famTable = () => readTable('families.csv');
const mgtTable = () => readTable('management.csv');
const catTable = () => readTable('categories.csv');
const paramTable = () => readTable('param-schema.csv');

const dimPath = (familyId) => join(DIM_DIR, `${familyId}.csv`);

/** SKU 规范：TI- + family_id 大写。与 scripts/gen-products.mjs 是同一套规则。 */
const skuOf = (familyId) => `TI-${familyId.toUpperCase()}`;

/** 族类型 ← families.csv 的 type 列；老数据没有该列时回退到 standards[0] 派生。 */
const typeOf = (f) => {
	const explicit = (f.type ?? '').trim();
	if (explicit) return explicit;
	const first = (f.standards ?? '').split('|')[0].trim();
	return readTable('standards.csv').rows.find((r) => r.id === first)?.type ?? '';
};

/** 分类 → 产品类型 —— 标准缺失时的兜底（无标准产品也要能定类型）。 */
const CATEGORY_TYPE = new Map([
	['screws', 'screw'],
	['bolts', 'bolt'],
	['nuts', 'nut'],
	['washers', 'washer'],
	['pins', 'pin'],
	['securing', 'nut'],
]);

/** 标准号归一化：'iso-4017' / 'DIN 933' → standards.csv 的规范 id。 */
const normStd = (s) => s.replace(/[^a-z0-9]/gi, '').toUpperCase();
const resolveStandard = (token, stdRows) => {
	const t = normStd(token);
	for (const r of stdRows) {
		if (normStd(r.id) === t) return r.id;
		for (const cell of [r.din, r.iso]) {
			for (const one of (cell ?? '').split('|')) {
				if (one.trim() && normStd(one) === t) return r.id;
			}
		}
	}
	return '';
};

/** 未登记的标准 → 自动登记为待核对的标准行（auto=1），不阻断导入。 */
const autoStandardId = (token) => token.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
const autoStandardLabel = (token) => {
	const t = token.trim();
	const m = /^([a-z]+)-?(.*)$/i.exec(t);
	if (!m) return t.toUpperCase();
	const prefix = m[1].toUpperCase();
	const rest = m[2].replace(/[-.]/g, ' ').trim().toUpperCase();
	return rest ? `${prefix} ${rest}` : prefix;
};
const readDims = (familyId) => readCsv(dimPath(familyId)) ?? { header: [], rows: [] };

/** 某个 type 的参数顺序 → 规格矩阵的列。 */
const dimColumns = (type) => {
	const params = paramTable()
		.rows.filter((r) => r.type === type)
		.sort((a, b) => Number(a.order) - Number(b.order))
		.map((r) => r.param);
	return ['standard', ...params];
};

/** 跑数据闸门。返回退出码。 */
function gate() {
	const r = spawnSync(process.execPath, [join(ROOT, 'scripts/gen-products.mjs')], {
		stdio: 'inherit',
		cwd: ROOT,
	});
	return r.status ?? 1;
}

function saveAndGate(what) {
	const code = gate();
	if (code !== 0) {
		console.error(`✗ 数据闸门未通过 —— ${what} 已写入 CSV，但生成产物未更新。`);
		process.exit(code);
	}
	ok(`${what} · 数据闸门通过`);
}

/* ── 命令 ─────────────────────────────────────────────────────────────── */

const commands = {
	/** list —— 目录视图。 */
	list() {
		const cats = catTable().rows;
		const fams = famTable().rows;
		console.log('\n分类（' + cats.length + '）');
		for (const c of cats) {
			const n = fams.filter((f) => f.category === c.id).length;
			console.log(`  ${c.id.padEnd(12)} ${c.name.padEnd(14)} ${n} 族`);
		}
		console.log('\n产品族（' + fams.length + '）');
		const mgt = new Map(mgtTable().rows.map((r) => [r.family_id, r]));
		for (const f of fams) {
			const dims = readDims(f.family_id).rows.length;
			console.log(
				`  ${f.family_id.padEnd(30)} ${typeOf(f).padEnd(8)} ${String(mgt.get(f.family_id)?.status ?? '—').padEnd(10)} ${dims} 规格行  ${f.name}`,
			);
		}
		console.log('');
	},

	/** cat-add —— 新增分类。 */
	'cat-add'() {
		const [id, name] = positionals;
		if (!id || !name) die('用法：cat-add <id> <name> [--desc= --image= --order=]');
		const t = catTable();
		if (t.rows.some((r) => r.id === id)) die(`分类 "${id}" 已存在`);
		t.rows.push({
			id,
			name,
			description: flags.desc ?? '',
			image: flags.image ?? '',
			order: flags.order ?? String(t.rows.length + 1),
		});
		t.rows.sort((a, b) => Number(a.order) - Number(b.order));
		writeCsv(join(DATA, 'categories.csv'), CAT_HEADER, t.rows);
		saveAndGate(`分类 ${id} 已新增`);
	},

	/** cat-rm —— 删除分类。 */
	'cat-rm'() {
		const [id] = positionals;
		if (!id) die('用法：cat-rm <id>');
		const t = catTable();
		const used = famTable().rows.filter((f) => f.category === id);
		if (used.length) {
			die(
				`分类 "${id}" 仍被 ${used.length} 个族引用：${used.map((f) => f.family_id).join(', ')}\n` +
					'  先 fam-rm 这些族，或用 fam-set --category=<其他> 改归属。',
			);
		}
		const next = t.rows.filter((r) => r.id !== id);
		if (next.length === t.rows.length) die(`分类 "${id}" 不存在`);
		writeCsv(join(DATA, 'categories.csv'), CAT_HEADER, next);
		saveAndGate(`分类 ${id} 已删除`);
	},

	/** fam-add —— 新增产品族（同时建出空的规格矩阵）。 */
	'fam-add'() {
		const [id] = positionals;
		if (!id) die('用法：fam-add <family_id> [--name= --standards= --category= ...]');
		if (!/^[a-z0-9-]+$/.test(id)) die(`family_id 只能用小写字母/数字/连字符：${id}`);
		const t = famTable();
		if (t.rows.some((r) => r.family_id === id)) die(`族 "${id}" 已存在`);
		/* 族类型：--type 优先；否则按第一个标准派生；再否则按分类默认。
		   于是无标准产品也能建族（--type=bolt --category=bolts）。 */
		const category = flags.category ?? '';
		const type =
			(flags.type ?? '').trim() ||
			typeOf({ standards: flags.standards ?? '' }) ||
			CATEGORY_TYPE.get(category) ||
			'';
		if (!type) {
			die(
				`缺少 --type=<产品类型>（或 --standards=<标准 id> / --category=<分类> 之一可推导）。\n` +
					`  已知类型：${[...new Set(paramTable().rows.map((r) => r.type))].join(', ')}`,
			);
		}
		const rec = { family_id: id, image: '', type };
		for (const f of FAM_FIELDS) {
			if (flags[f] !== undefined) rec[f] = flags[f];
		}
		rec.name = rec.name ?? id;
		rec.category = rec.category ?? '';

		/* ── 先全部校验，再落盘 ──────────────────────────────────────────
		   顺序很重要：校验必须发生在任何 writeCsv 之前，否则一次被拒绝的
		   fam-add 会把半成品族留在 CSV 里（那正是这个命令要防的事）。 */
		const cols = dimColumns(type);
		const specs = toArray(flags.spec);
		if (!specs.length) {
			die(
				`族 "${id}" 至少要带一行规格，否则数据闸门会报 E022（矩阵为空）。\n` +
					`  用法：--spec="${cols.join(',')}"（可重复多个 --spec）`,
			);
		}
		const rows = specs.map((spec, i) => {
			const cells = String(spec).split(',').map((c) => c.trim());
			if (cells.length !== cols.length) {
				die(`第 ${i + 1} 行规格有 ${cells.length} 个值，应为 ${cols.length} 个：${cols.join(',')}`);
			}
			const o = {};
			cols.forEach((c, j) => (o[c] = cells[j]));
			return o;
		});

		t.rows.push(rec);
		writeCsv(join(DATA, 'families.csv'), FAM_HEADER, t.rows);
		const mt = mgtTable();
		if (mt.rows.some((r) => r.family_id === id)) die(`管理记录 "${id}" 已存在`);
		const mrec = { family_id: id, status: flags.status ?? 'draft' };
		for (const f of MGT_FIELDS) {
			if (flags[f] !== undefined) mrec[f] = flags[f];
		}
		mt.rows.push(mrec);
		writeCsv(join(DATA, 'management.csv'), MGT_HEADER, mt.rows);
		if (!existsSync(DIM_DIR)) mkdirSync(DIM_DIR, { recursive: true });
		writeCsv(dimPath(id), cols, rows);
		saveAndGate(`族 ${id} 已新增（${rows.length} 行规格：${cols.join(', ')}）`);
	},

	/** fam-set —— 改族字段。 */
	'fam-set'() {
		const [id] = positionals;
		if (!id) die('用法：fam-set <family_id> [--<字段>=值 ...]');
		const t = famTable();
		const rec = t.rows.find((r) => r.family_id === id);
		if (!rec) die(`族 "${id}" 不存在`);
		const mt = mgtTable();
		const mrec = mt.rows.find((r) => r.family_id === id);
		let changed = 0;
		let mChanged = 0;
		for (const [k, v] of Object.entries(flags)) {
			/* 字段落在哪张表就写哪张表 —— 产品字段与管理字段各归各位。 */
			if (MGT_FIELDS.includes(k)) {
				if (!mrec) die(`管理记录 "${id}" 不存在`);
				if (Array.isArray(v)) die(`字段 "${k}" 不接受重复参数`);
				if (mrec[k] !== v) mChanged++;
				mrec[k] = v;
				continue;
			}
			if (!FAM_FIELDS.includes(k)) {
				die(`族没有字段 "${k}"。产品表可用：${FAM_FIELDS.join(', ')}；管理表可用：${MGT_FIELDS.join(', ')}`);
			}
			if (Array.isArray(v)) die(`字段 "${k}" 不接受重复参数`);
			if (rec[k] !== v) changed++;
			rec[k] = v;
		}
		if (!changed && !mChanged) die('没有指定任何要改的字段');
		if (changed) writeCsv(join(DATA, 'families.csv'), FAM_HEADER, t.rows);
		if (mChanged) writeCsv(join(DATA, 'management.csv'), MGT_HEADER, mt.rows);
		saveAndGate(`族 ${id} 已更新（产品字段 ${changed} 个，管理字段 ${mChanged} 个）`);
	},

	/** fam-rm —— 删除族及其规格矩阵（连同素材文件 —— 留着就是孤儿素材，闸门会直接失败）。 */
	'fam-rm'() {
		const [id] = positionals;
		if (!id) die('用法：fam-rm <family_id>');
		const t = famTable();
		const next = t.rows.filter((r) => r.family_id !== id);
		if (next.length === t.rows.length) die(`族 "${id}" 不存在`);
		writeCsv(join(DATA, 'families.csv'), FAM_HEADER, next);
		writeCsv(join(DATA, 'management.csv'), MGT_HEADER, mgtTable().rows.filter((r) => r.family_id !== id));
		if (existsSync(dimPath(id))) rmSync(dimPath(id));
		/* 素材：SKU 前缀的文件属于这个族 —— 不删就成了孤儿素材（E030）。 */
		const sku = skuOf(id);
		const removed = [];
		for (const dir of ['public/images/products', 'public/download/cad', 'public/download/spec']) {
			const abs = join(ROOT, dir);
			if (!existsSync(abs)) continue;
			for (const name of readdirSync(abs)) {
				if (!name.startsWith(sku + '-')) continue;
				rmSync(join(abs, name));
				removed.push(`${dir}/${name}`);
			}
		}
		saveAndGate(
			`族 ${id} 已删除${removed.length ? `（连同 ${removed.length} 个素材文件：${removed.join(', ')}）` : ''}`,
		);
	},

	/** spec-add —— 追加一行规格。 */
	'spec-add'() {
		const [id] = positionals;
		if (!id) die('用法：spec-add <family_id> [--std= --thread= --length= ...]');
		const fam = famTable().rows.find((r) => r.family_id === id);
		if (!fam) die(`族 "${id}" 不存在`);
		const cols = dimColumns(fam.type);
		const t = readDims(id);
		if (!t.header.length) t.header = cols;
		const row = {};
		for (const c of cols) {
			const flagName = c === 'standard' ? 'std' : c;
			const v = flags[flagName];
			if (v === undefined) {
				if (c === 'standard') die('缺少 --std=<standard id>');
				continue;
			}
			row[c] = v;
		}
		t.rows.push(row);
		writeCsv(dimPath(id), t.header, t.rows);
		saveAndGate(`族 ${id} 已追加规格行（现有 ${t.rows.length} 行）`);
	},

	/** spec-rm —— 按 standard/thread/length 定位删行。 */
	'spec-rm'() {
		const [id] = positionals;
		if (!id) die('用法：spec-rm <family_id> [--std= --thread= --length=]');
		const t = readDims(id);
		const match = (r) =>
			(flags.std === undefined || r.standard === flags.std) &&
			(flags.thread === undefined || r.thread === flags.thread) &&
			(flags.length === undefined || r.length === flags.length);
		const next = t.rows.filter((r) => !match(r));
		const removed = t.rows.length - next.length;
		if (!removed) die('没有匹配到规格行 —— 检查 --std/--thread/--length');
		writeCsv(dimPath(id), t.header, next);
		saveAndGate(`族 ${id} 已删除 ${removed} 行规格（现有 ${next.length} 行）`);
	},

	/** export —— 导出为 Markdown。 */
	export() {
		const [id] = positionals;
		if (!id) die('用法：export <family_id> [--out=file.md]');
		const fam = famTable().rows.find((r) => r.family_id === id);
		if (!fam) die(`族 "${id}" 不存在`);
		const dims = readDims(id);
		const front = Object.entries(fam)
			.filter(([, v]) => v !== '' && v !== undefined)
			.map(([k, v]) => `${k}: ${v}`)
			.join('\n');
		const head = `| ${dims.header.join(' | ')} |`;
		const sep = `| ${dims.header.map(() => '---').join(' | ')} |`;
		const body = dims.rows.map((r) => `| ${dims.header.map((h) => r[h] ?? '').join(' | ')} |`);
		const md = `---\n${front}\n---\n\n${[head, sep, ...body].join('\n')}\n`;
		const out = flags.out ?? join(ROOT, `qa/product-${id}.md`);
		writeFileSync(out, md, 'utf8');
		ok(`已导出 ${out}`);
	},

	/** bulk-import —— 从 8 列模板批量导入产品（唯一支持的批量录入格式）。
	 *
	 * 模板列（固定 8 列，多一列少一列都报错 —— 列错位是这类录入最贵的错）：
	 *   name | category | standards | sizes | materials | finishes | description | image
	 *
	 * 一切没写的东西都是**派生**的：
	 *   type       ← 模板 type 列；留空则按 standards[0] 的 type，再退到分类默认
	 *   family_id  ← name 的 kebab 化（撞号自动加 -2/-3）
	 *   SKU        ← TI-<family_id 大写>（与生成器同一套规则）
	 *   工程尺寸   ← 尺寸库 data/products/dimension-library.csv 按 (标准+关键参数) 查
	 *
	 * type 是**可选第 9 列**：给了就用（产品类型不再由标准号决定）；
	 * 不给则按 standards[0] 的 type 推导，再退到 category 的默认类型 ——
	 * 于是"无标准产品"也能上架。
	 *
	 * 图片：第 8 列写**客户原文件名**（如 BN-272-01.jpg，多张用 | 分隔）。
	 * 原图放 public/images/products/_inbox/（或 products/ 根目录），导入时按
	 * <SKU>-<原名> 改名认领 —— 客户不需要知道 SKU，也不需要自己改名。
	 * 改名排在**全部校验通过之后**：任何一行有问题，图片也一个都不动。
	 *
	 * sizes 迷你语法（按类型）：
	 *   螺钉/螺栓  M4x6     → 螺纹 M4，长度 6
	 *   螺母       M4x7x4   → 螺纹 M4，对边 7，厚度 4
	 *   垫片       5x10x1   → 外径 5，内径 10，厚度 1
	 *
	 * 先全量校验、再落盘：任何一行有问题就一行都不写，并报出行号。
	 */
	'bulk-import'() {
		const [file] = positionals;
		if (!file) die('用法：bulk-import <file.csv> [--dry]');

		const TEMPLATE_COLS = [
			'name',
			'category',
			'standards',
			'sizes',
			'materials',
			'finishes',
			'description',
			'image',
		];
		/* 可选列：type（产品类型）、family_id（upsert 目标族）。
		   family_id 有值 → 更新那个既有族（保留 family_id / URL / 发布状态）；
		   留空 → 新建族。 */
		const OPTIONAL_COLS = ['type', 'family_id'];
		const path = resolve(process.cwd(), file);
		if (!existsSync(path)) die(`文件不存在：${path}`);
		const table = readCsv(path);
		if (!table) die(`无法解析 CSV：${path}`);
		const extra = table.header.filter((h) => !TEMPLATE_COLS.includes(h) && !OPTIONAL_COLS.includes(h));
		if (extra.length) die(`模板只接受 ${TEMPLATE_COLS.length}+${OPTIONAL_COLS.length} 列：${[...TEMPLATE_COLS, ...OPTIONAL_COLS].join(', ')}`);
		const lack = TEMPLATE_COLS.filter((h) => !table.header.includes(h));
		if (lack.length) die(`模板缺列：${lack.join(', ')}`);

		const stdRows = readTable('standards.csv').rows;
		const stdType = new Map(stdRows.map((r) => [r.id, r.type]));
		const catIds = new Set(catTable().rows.map((r) => r.id));
		const matIds = new Set(readTable('materials.csv').rows.map((r) => r.id));
		const finIds = new Set(readTable('finishes.csv').rows.map((r) => r.id));
		const lib = readTable('dimension-library.csv').rows;
		const allSchema = paramTable().rows;
		const paramsOf = (type) =>
			allSchema.filter((p) => p.type === type).sort((a, b) => Number(a.order) - Number(b.order));
		const keyParams = (type) =>
			allSchema.filter((p) => p.type === type && p.key === '1').map((p) => p.param);

		/* 数值比较：'7.0' 与 '7' 视为相等（尺寸库里的对边常写成 7.0）。 */
		const sameVal = (a, b) => {
			const x = Number(a);
			const y = Number(b);
			if (Number.isFinite(x) && Number.isFinite(y)) return x === y;
			return String(a).trim() === String(b).trim();
		};

		const famData = famTable(); const mgtData = mgtTable();
		const takenIds = new Set(famData.rows.map((r) => r.family_id));
		const takenNames = new Map(famData.rows.map((r) => [r.name.trim().toLowerCase(), r.family_id]));
		/* 名字 → family_id。开头的 "Titanium " 去掉 —— 全站就是钛件紧固件，
		   族 id 里再带一遍既是废话，也让 URL 长度白涨一截。 */
		const slug = (s) =>
			s
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-+|-+$/g, '')
				.replace(/^titanium-/, '');

		const errors = [];
		/* 逐行容错：某一行有问题 → 跳过该行并报出来，其余行照常导入。
		   批量清单里一行脏数据不该拖垮整批（"只新建、不 upsert"仍然成立）。 */
		const skips = [];
		const planned = [];
		/* 导入期间自动登记的标准（未登记过的）—— 落盘时并入 standards.csv。 */
		const autoStandards = new Map();
		/* 警告：缺工程尺寸这类"可上架但不完整"的问题 —— 放行但要报。 */
		const warnings = [];
		const rowWarn = (msg) => warnings.push(msg);

		table.rows.forEach((r, i) => {
			const line = i + 2;
			const rowErrs = [];
			const name = (r.name ?? '').trim();
			/* upsert 目标：模板第 10 列 family_id。给了就更新那个既有族
			   （保留 family_id / URL / 发布状态），没给才按名字建新族。 */
			const targetId = (r.family_id ?? '').trim();
			let upsertInto = null;
			if (targetId) {
				upsertInto = famData.rows.find((f) => f.family_id === targetId) ?? null;
				if (!upsertInto) {
					rowErrs.push(`family_id "${targetId}" 不存在（upsert 只能更新既有族，不能借此新建）`);
				}
			}
			if (!name) rowErrs.push('name 为空');
			else if (!upsertInto && takenNames.has(name.toLowerCase())) {
				/* 重名 = 已存在的族 → 这一行不导入。必须 return：
				   否则它会继续往下走，被 slug 加 -2 后缀建成"第二个同名族"，
				   报"已跳过"却照样写盘，留下重复产品页。
				   （指定了 family_id 的行走 upsert，不受此限制。） */
				skips.push(
					`产品名 "${name}" 与已有产品 "${takenNames.get(name.toLowerCase())}" 重复 —— 该行不导入`,
				);
				return;
			}
			const category = (r.category ?? '').trim();
			if (!catIds.has(category)) rowErrs.push(`未知分类 "${category}"`);
			/* 标准号归一化：'iso-4017' / 'DIN 933' 一律落到 standards.csv 的规范 id；
			   未登记过的 → 自动登记为 auto=1 的标准行（待人工核对），不阻断导入。 */
			const rawStandards = (r.standards ?? '')
				.split('|')
				.map((s) => s.trim())
				.filter(Boolean);
			const standards = [];
			for (const token of rawStandards) {
				const canon = resolveStandard(token, stdRows);
				if (canon) {
					if (!standards.includes(canon)) standards.push(canon);
					continue;
				}
				const autoId = autoStandardId(token);
				if (!autoStandards.has(autoId)) {
					autoStandards.set(autoId, {
						id: autoId,
						label: autoStandardLabel(token),
						din: /^din-/i.test(token) ? autoStandardLabel(token) : '',
						iso: /^iso-/i.test(token) ? autoStandardLabel(token) : '',
						title: '',
						type: '',
						notes: '自动登记（来自批量导入）—— 待人工核对标准号与标题',
						auto: '1',
					});
					stdRows.push(autoStandards.get(autoId));
					stdType.set(autoId, '');
				}
				if (!standards.includes(autoId)) standards.push(autoId);
			}
			/* type：模板显式列 → standards[0] 的 type → 分类默认。
			   标准为空（无标准产品）时走分类默认，type 永远有值。 */
			const explicitType = (r.type ?? '').trim();
			const derivedType = standards.length ? stdType.get(standards[0]) ?? '' : '';
			const type = explicitType || derivedType || CATEGORY_TYPE.get(category) || '';
			if (!type) rowErrs.push('无法确定产品类型：type 列留空、标准未登记、分类也没有默认类型');
			else if (!paramsOf(type).length) rowErrs.push(`未知产品类型 "${type}"（不在 param-schema.csv）`);
			/* upsert 不能改类型 —— 规格矩阵的列由 type 决定，改类型等于换一张表。 */
			if (upsertInto) {
				const existType = typeOf(upsertInto);
				if (type && existType && type !== existType) {
					rowErrs.push(
						`family_id "${targetId}" 已是 "${existType}" 类型，与本行 "${type}" 不一致（改类型会改规格矩阵的列结构，须另行 fam-set）`,
					);
				}
			}
			const materials = (r.materials ?? '')
				.split('|')
				.map((s) => s.trim())
				.filter(Boolean);
			const badMat = materials.filter((m) => !matIds.has(m));
			if (badMat.length) rowErrs.push(`未知材质 "${badMat.join(', ')}"`);
			const finishes = (r.finishes ?? '')
				.split('|')
				.map((s) => s.trim())
				.filter(Boolean);
			const badFin = finishes.filter((f) => !finIds.has(f));
			if (badFin.length) rowErrs.push(`未知表面 "${badFin.join(', ')}"`);
			if (!materials.length) rowErrs.push('materials 为空');
			if (!finishes.length) rowErrs.push('finishes 为空');

			/* 第 8 列：客户原文件名（多张用 | 分隔）。只认文件名，不认路径。 */
			const images = [
				...new Set((r.image ?? '').split('|').map((s) => s.trim()).filter(Boolean)),
			];
			for (const img of images) {
				if (/[/\\]/.test(img)) rowErrs.push(`image "${img}" 只能是文件名，不能带路径`);
				else if (!/^[^.]+\.(png|jpg|jpeg|webp|avif|gif|svg)$/i.test(img))
					rowErrs.push(`image "${img}" 不是图片文件（png/jpg/jpeg/webp/avif/gif/svg）`);
			}

			if (rowErrs.length) {
				errors.push(`第 ${line} 行：${rowErrs.join('；')}`);
				return;
			}

			const allParams = paramsOf(type).map((p) => p.param);
			const keys = keyParams(type);
			const sizeTokens = (r.sizes ?? '')
				.split('|')
				.map((s) => s.trim())
				.filter(Boolean);
			if (!sizeTokens.length) {
				skips.push(`第 ${line} 行：sizes 为空 —— 产品至少要一个规格`);
				return;
			}

			const dims = [];
			for (const token of sizeTokens) {
				const parts = token.split('x').map((s) => s.trim());
				const given = {};
				if (type === 'screw' || type === 'bolt' || type === 'stud') {
					if (parts.length !== 2) {
						rowErrs.push(`规格 "${token}" 不是 螺纹x长度（如 M4x6）`);
						continue;
					}
					given.thread = parts[0];
					given.length = parts[1];
				} else if (type === 'nut') {
					if (parts.length !== 3) {
						rowErrs.push(`规格 "${token}" 不是 螺纹x对边x厚度（如 M4x7x4）`);
						continue;
					}
					given.thread = parts[0];
					given.s = parts[1];
					given.m = parts[2];
				} else if (type === 'washer') {
					if (parts.length !== 3) {
						rowErrs.push(`规格 "${token}" 不是 外径x内径x厚度（如 5x10x1）`);
						continue;
					}
					given.d1 = parts[0];
					given.d2 = parts[1];
					given.h = parts[2];
				} else {
					rowErrs.push(`type "${type}" 暂不支持迷你规格语法`);
					continue;
				}

				const hits = lib.filter(
					(l) =>
						l.standard === (standards[0] ?? '') &&
						keys.every((k) => sameVal(l[k] ?? '', given[k] ?? '')),
				);
				if (hits.length > 1) {
					rowErrs.push(`尺寸库中 "${standards[0]} ${keys.map((k) => given[k]).join('x')}" 有多条匹配`);
					continue;
				}
				/* 尺寸库命中 → 补全工程尺寸；未命中 → 只写"基础规格行"
				   （螺纹 × 长度），工程尺寸留空等抽取器/客户补 —— 不阻断上架。 */
				const row = { standard: standards[0] ?? '' };
				let broken = false;
				for (const p of allParams) {
					const v = given[p] ?? hits[0]?.[p] ?? '';
					if (v === '') {
						if (p.key === '1') {
							rowErrs.push(`规格 "${token}" 缺关键参数 "${p}"`);
							broken = true;
							break;
						}
						row[p] = '';
						continue;
					}
					row[p] = v;
				}
				if (!broken && !hits.length) {
					rowWarn(`第 ${line} 行：规格 "${token}" 在尺寸库里没有工程尺寸 —— 先按基础规格上架`);
				}
				if (!broken) dims.push(row);
			}

			if (rowErrs.length) {
				errors.push(`第 ${line} 行：${rowErrs.join('；')}`);
				return;
			}

			/* upsert：族 id 由模板指定（保住 URL 与发布状态）；
			   新建：名字 kebab 化，撞号加 -2（保留"同标准近似重复"的铺货空间）。 */
			let id;
			if (upsertInto) {
				id = targetId;
			} else {
				id = slug(name);
				if (!id) {
					skips.push(`第 ${line} 行：产品名 "${name}" 推不出 family_id（需字母或数字）`);
					return;
				}
				const base = id;
				let n = 2;
				while (takenIds.has(id)) id = `${base}-${n++}`;
				takenIds.add(id);
				takenNames.set(name.toLowerCase(), id);
			}

			planned.push({
				famRow: {
					family_id: id,
					name,
					type,
					category,
					standards: standards.join('|'),
					materials: materials.join('|'),
					finishes: finishes.join('|'),
					description: (r.description ?? '').trim(),
					image: images.join('|'),
				},
				cols: ['standard', ...allParams],
				dims,
				images,
				line,
				upsert: upsertInto,
				/* upsert 时的既有值 —— 并集用（不丢已有材质/表面/标准）。 */
				prev: upsertInto
					? {
							standards: (upsertInto.standards ?? '').split('|').filter(Boolean),
							materials: (upsertInto.materials ?? '').split('|').filter(Boolean),
							finishes: (upsertInto.finishes ?? '').split('|').filter(Boolean),
							image: (upsertInto.image ?? '').trim(),
							rows: readDims(targetId).rows,
						}
					: null,
			});
		});

		/* ── 认领计划：客户原图 → <SKU>-<原名> ──────────────────────────────
		 * 只做计划，不动文件 —— 改名是写操作，必须排在全部校验之后。
		 */
		const IMG_DIR = join(ROOT, 'public/images/products');
		const INBOX = join(IMG_DIR, '_inbox');
		const claims = [];
		const claimWarns = [];
		for (const p of planned) {
			const sku = skuOf(p.famRow.family_id);
			for (const orig of p.images) {
				const dst = join(IMG_DIR, `${sku}-${orig}`);
				const src = [join(INBOX, orig), join(IMG_DIR, orig)].find((f) => existsSync(f));
				if (!src) {
					if (existsSync(dst)) {
						claims.push({ orig, dst, sku, line: p.line, act: 'skip' });
					} else {
						claimWarns.push(
							`第 ${p.line} 行：找不到图片 "${orig}" —— 放到 public/images/products/_inbox/ 后重跑即可认领（本次先不带图导入）`,
						);
					}
					continue;
				}
				if (existsSync(dst)) {
					errors.push(`第 ${p.line} 行：目标文件已存在 ${sku}-${orig} —— 改名会覆盖，拒绝`);
					continue;
				}
				claims.push({ orig, dst, src, sku, line: p.line, act: 'rename' });
			}
		}

		if (errors.length) {
			console.error(`✗ 导入中止 —— ${errors.length} 处问题（未写入任何文件，图片也未改名）：`);
			for (const e of errors) console.error(`  ${e}`);
			process.exit(1);
		}
		if (!planned.length) die('没有可导入的行');
		if (skips.length) {
			console.warn(`! 跳过 ${skips.length} 行（其余行照常导入）：`);
			for (const s of skips) console.warn(`  ${s}`);
		}
		for (const w of claimWarns) console.warn(`! ${w}`);
		for (const w of warnings) console.warn(`! ${w}`);
		if (autoStandards.size) {
			console.log(`! ${autoStandards.size} 个未登记标准将自动登记进 standards.csv（auto=1，待人工核对）：${[...autoStandards.keys()].join(', ')}`);
		}

		if (flags.dry) {
			console.log(`--dry：以下 ${planned.length} 个产品会被写入 ——`);
			for (const p of planned) {
				console.log(
					`  ${p.famRow.family_id.padEnd(34)} ${p.famRow.type.padEnd(7)} ${String(p.dims.length).padEnd(4)} 规格   ${p.famRow.name}`,
				);
			}
			if (claims.length) {
				console.log(`--dry：以下 ${claims.length} 张图会被认领改名 ——`);
				for (const c of claims) {
					console.log(
						c.act === 'skip'
							? `  已认领  ${c.orig.padEnd(26)} → ${c.sku}-${c.orig}（跳过）`
							: `  ${c.orig.padEnd(26)} → ${c.sku}-${c.orig}`,
					);
				}
			}
			return;
		}

		/* ── 执行认领（改名 / 同源复制）───────────────────────────────────── */
		const consumed = new Map();
		const renamed = [];
		for (const c of claims) {
			if (c.act === 'skip') continue;
			if (!existsSync(c.src)) {
				/* 同一张原图被多个产品引用 —— 后者从先认领的那份复制。 */
				const from = consumed.get(c.orig);
				if (from && existsSync(from)) {
					copyFileSync(from, c.dst);
					renamed.push({ ...c, act: 'copy' });
					continue;
				}
				claimWarns.push(`第 ${c.line} 行：图片 "${c.orig}" 在认领前消失，跳过`);
				continue;
			}
			renameSync(c.src, c.dst);
			consumed.set(c.orig, c.dst);
			renamed.push(c);
		}

		/* ── 落盘：新建 = 追加；upsert = 原地更新（保 family_id / URL / 发布状态） ── */
		const famRows = [...famData.rows];
		const mgtRows = [...mgtData.rows];
		const staleImages = [];
		for (const p of planned) {
			if (!p.upsert) {
				famRows.push(p.famRow);
				mgtRows.push({ family_id: p.famRow.family_id, status: 'draft' });
				writeCsv(dimPath(p.famRow.family_id), p.cols, p.dims);
				continue;
			}
			/* upsert：多值字段取并集（不丢既有材质/表面/标准），
			   单值字段（名称/描述/图片）以客户清单为准。 */
			const union = (a, b) => [...new Set([...a, ...b])];
			const idx = famRows.findIndex((f) => f.family_id === p.famRow.family_id);
			const old = famRows[idx];
			/* 既有的规格行用到的标准也要留在 standards 里（闸门 E018 要求行标准 ∈ 族标准）。 */
			const oldRowStds = p.prev.rows.map((r) => r.standard ?? '').filter(Boolean);
			const allStds = union(
				union(old.standards.split('|').filter(Boolean), p.prev.standards),
				union(p.famRow.standards.split('|').filter(Boolean), oldRowStds),
			);
			famRows[idx] = {
				...old,
				name: p.famRow.name,
				category: p.famRow.category,
				type: p.famRow.type,
				standards: allStds.join('|'),
				materials: union(p.prev.materials, p.famRow.materials.split('|').filter(Boolean)).join('|'),
				finishes: union(p.prev.finishes, p.famRow.finishes.split('|').filter(Boolean)).join('|'),
				description: p.famRow.description,
				image: p.famRow.image,
			};
			/* 规格矩阵：同键（标准 + 关键参数）覆盖，新键追加；既有行保留。
			   客户/尺寸库没给值的字段留空 → 保留既有值，不被抹掉。 */
			const keyOf = (r) => [r.standard ?? '', ...p.cols.filter((c) => c !== 'standard' && (paramsOf(p.famRow.type).find((q) => q.param === c)?.key === '1'))].map((c) => String(r[c] ?? '').trim()).join('|');
			const merged = p.prev.rows.map((r) => ({ ...r }));
			for (const nr of p.dims) {
				const k = keyOf(nr);
				const hit = merged.find((r) => keyOf(r) === k);
				if (!hit) {
					merged.push({ ...nr });
					continue;
				}
				for (const c of p.cols) {
					if (c === 'standard') continue;
					const v = nr[c];
					if (v !== '' && v !== undefined) hit[c] = v;
				}
			}
			writeCsv(dimPath(p.famRow.family_id), p.cols, merged);
			/* 旧主图（占位图）被客户图取代 → 删掉旧文件，
			   否则它会按序号排在客户图前面，继续当主图。 */
			if (p.prev.image && p.prev.image !== p.famRow.image) {
				const stale = join(IMG_DIR, `${skuOf(p.famRow.family_id)}-${p.prev.image}`);
				if (existsSync(stale)) staleImages.push(stale);
			}
		}
		writeCsv(join(DATA, 'families.csv'), FAM_HEADER, famRows);
		/* 自动登记的标准并入标准字典 —— 落盘后即可被页面与闸门识别（待人工核对）。 */
		if (autoStandards.size) {
			const stdData = readTable('standards.csv');
			const rows = [...stdData.rows];
			for (const rec of autoStandards.values()) {
				rec.type = planned.find((p) => p.famRow.standards.split('|').includes(rec.id))?.famRow.type ?? '';
				rows.push(rec);
			}
			writeCsv(join(DATA, 'standards.csv'), STD_HEADER, rows);
		}
		/* 新族的管理记录：默认 draft —— 上架与否由管理表说了算。
		   upsert 的族不动管理表（保留既有发布状态）。 */
		writeCsv(join(DATA, 'management.csv'), MGT_HEADER, mgtRows);
		/* 被客户图取代的旧占位图 → 删除（否则它会按序号排在客户图前面当主图）。 */
		for (const f of staleImages) {
			rmSync(f);
			console.log(`  清理旧占位图 ${f.replace(ROOT + '\\', '')}`);
		}
		const newOnes = planned.filter((p) => !p.upsert).map((p) => p.famRow.family_id);
		const updOnes = planned.filter((p) => p.upsert).map((p) => p.famRow.family_id);
		saveAndGate(
			`已导入 ${planned.length} 个产品（新建 ${newOnes.length}${newOnes.length ? '：' + newOnes.join(', ') : ''}` +
				`；更新 ${updOnes.length}${updOnes.length ? '：' + updOnes.join(', ') : ''}）`,
		);
		if (renamed.length) {
			console.log(`✓ 认领 ${renamed.length} 张图 ——`);
			for (const c of renamed) {
				console.log(`  ${c.orig} → ${c.sku}-${c.orig}${c.act === 'copy' ? '（同源复制）' : ''}`);
			}
		}
	},

	/** assets —— 素材盘点：谁缺图、谁没人认领。 */
	assets() {
		const fams = famTable().rows;
		const skus = new Map(fams.map((f) => [skuOf(f.family_id), f.family_id]));
		const { entries, problems } = scanAssets(ROOT, skus);
		const byFamily = new Map();
		for (const e of entries) {
			if (!byFamily.has(e.family_id)) byFamily.set(e.family_id, []);
			byFamily.get(e.family_id).push(e);
		}
		console.log('');
		console.log(`产品素材（${fams.length} 个产品）`);
		for (const f of fams) {
			const sku = skuOf(f.family_id);
			const mine = byFamily.get(f.family_id) ?? [];
			const images = mine.filter((e) => e.role === 'image');
			const tags = [
				images.length > 1 ? `+${images.length - 1} 张图` : '',
				mine.some((e) => e.role === 'cad') ? 'CAD' : '',
				mine.some((e) => e.role === 'pdf') ? 'PDF' : '',
			]
				.filter(Boolean)
				.join(' · ');
			const where = images.length
				? `${images[0].url}（原名 ${images[0].original}）`
				: `缺主图 —— 模板第 8 列写原图名并放进 public/images/products/_inbox/，导入时自动改名认领（期望 ${sku}-<原名>.<ext>）`;
			console.log(
				`  ${images.length ? '✓' : '✗'} ${sku.padEnd(34)} ${where}${tags ? '   [' + tags + ']' : ''}`,
			);
		}
		if (problems.length) {
			console.log('');
			console.log(`问题素材（${problems.length}）`);
			for (const p of problems) console.log(`  ${p.code}  ${p.file}  ${p.message}`);
		}
		console.log('');
	},

	/** validate —— 只跑闸门。 */
	validate() {
		process.exit(gate());
	},
};

/* ── 分发 ─────────────────────────────────────────────────────────────── */

if (!cmd || cmd === 'help' || cmd === '--help') {
	console.log(
		[
			'',
			'products — 产品数据管理 CLI',
			'',
			'  list                       列出分类与族',
			'  cat-add  <id> <name>       新增分类',
			'  cat-rm   <id>              删除分类',
			'  fam-add  <family_id>       新增产品族',
			'  fam-set  <family_id>       改族字段',
			'  fam-rm   <family_id>       删除产品族',
			'  spec-add <family_id>       追加规格行',
			'  spec-rm  <family_id>       删除规格行',
			'  export   <family_id>       导出为 Markdown（只读视图）',
			'  bulk-import <file.csv>     从 8 列模板批量导入产品',
			'  assets                    素材盘点：缺图 / 孤儿素材',
			'  validate                   只跑数据闸门',
			'',
			'用法：npm run products -- <命令> [参数]',
			'',
		].join('\n'),
	);
	process.exit(0);
}

if (!commands[cmd]) die(`未知命令 "${cmd}" —— npm run products -- help 看用法`);
commands[cmd]();
