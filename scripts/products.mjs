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

/* 产品表 —— 编辑人员填的核心信息，第 8 列 = 图片原名（导入时自动加 SKU 前缀）。 */
const FAM_HEADER = [
	'family_id',
	'name',
	'category',
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

/** 族类型 ← standards 的第一个 id —— families.csv 不存 type，与生成器同一条规则。 */
const typeOf = (f) => {
	const first = (f.standards ?? '').split('|')[0].trim();
	return readTable('standards.csv').rows.find((r) => r.id === first)?.type ?? '';
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
		/* 族类型由 standards 的第一个 id 派生 —— families.csv 不存 type。 */
		const type = typeOf({ standards: flags.standards ?? '' });
		if (!type) {
			die(
				`缺少 --standards=<标准 id>（族类型由第一个标准派生）。已知标准：${readTable('standards.csv').rows.map((r) => r.id).join(', ')}`,
			);
		}
		const rec = { family_id: id, image: '' };
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
	 *   type       ← standards 第一个 id 在 standards.csv 里的 type
	 *   family_id  ← name 的 kebab 化（撞号自动加 -2/-3）
	 *   SKU        ← TI-<family_id 大写>（与生成器同一套规则）
	 *   工程尺寸   ← 尺寸库 data/products/dimension-library.csv 按 (标准+关键参数) 查
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
		const path = resolve(process.cwd(), file);
		if (!existsSync(path)) die(`文件不存在：${path}`);
		const table = readCsv(path);
		if (!table) die(`无法解析 CSV：${path}`);
		const extra = table.header.filter((h) => !TEMPLATE_COLS.includes(h));
		if (extra.length) die(`模板只接受 ${TEMPLATE_COLS.length} 列：${TEMPLATE_COLS.join(', ')}`);
		const lack = TEMPLATE_COLS.filter((h) => !table.header.includes(h));
		if (lack.length) die(`模板缺列：${lack.join(', ')}`);

		const stdType = new Map(readTable('standards.csv').rows.map((r) => [r.id, r.type]));
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
		const slug = (s) =>
			s
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-+|-+$/g, '');

		const errors = [];
		const planned = [];

		table.rows.forEach((r, i) => {
			const line = i + 2;
			const rowErrs = [];
			const name = (r.name ?? '').trim();
			if (!name) rowErrs.push('name 为空');
			else if (takenNames.has(name.toLowerCase())) {
				rowErrs.push(`产品名 "${name}" 与已有产品 "${takenNames.get(name.toLowerCase())}" 重复`);
			}
			const category = (r.category ?? '').trim();
			if (!catIds.has(category)) rowErrs.push(`未知分类 "${category}"`);
			const standards = (r.standards ?? '')
				.split('|')
				.map((s) => s.trim())
				.filter(Boolean);
			if (!standards.length) rowErrs.push('standards 为空');
			const unknownStd = standards.filter((s) => !stdType.has(s));
			if (unknownStd.length) rowErrs.push(`未知标准 "${unknownStd.join(', ')}"`);
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

			const type = stdType.get(standards[0]);
			const allParams = paramsOf(type).map((p) => p.param);
			const keys = keyParams(type);
			const sizeTokens = (r.sizes ?? '')
				.split('|')
				.map((s) => s.trim())
				.filter(Boolean);
			if (!sizeTokens.length) {
				errors.push(`第 ${line} 行：sizes 为空 —— 产品至少要一个规格`);
				return;
			}

			const dims = [];
			for (const token of sizeTokens) {
				const parts = token.split('x').map((s) => s.trim());
				const given = {};
				if (type === 'screw' || type === 'bolt') {
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
						l.standard === standards[0] &&
						keys.every((k) => sameVal(l[k] ?? '', given[k] ?? '')),
				);
				if (hits.length === 0) {
					rowErrs.push(
						`尺寸库缺 "${standards[0]} ${keys.map((k) => given[k]).join('x')}" —— 在 data/products/dimension-library.csv 补一行`,
					);
					continue;
				}
				if (hits.length > 1) {
					rowErrs.push(`尺寸库中 "${standards[0]} ${keys.map((k) => given[k]).join('x')}" 有多条匹配`);
					continue;
				}
				const row = { standard: standards[0] };
				let broken = false;
				for (const p of allParams) {
					const v = given[p] ?? hits[0][p] ?? '';
					if (v === '') {
						rowErrs.push(`规格 "${token}" 缺参数 "${p}"（尺寸库也没有）`);
						broken = true;
						break;
					}
					row[p] = v;
				}
				if (!broken) dims.push(row);
			}

			if (rowErrs.length) {
				errors.push(`第 ${line} 行：${rowErrs.join('；')}`);
				return;
			}

			let id = slug(name);
			if (!id) {
				errors.push(`第 ${line} 行：产品名 "${name}" 推不出 family_id（需字母或数字）`);
				return;
			}
			const base = id;
			let n = 2;
			while (takenIds.has(id)) id = `${base}-${n++}`;
			takenIds.add(id);
			takenNames.set(name.toLowerCase(), id);

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
		for (const w of claimWarns) console.warn(`! ${w}`);

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

		const famRows = [...famData.rows];
		for (const p of planned) famRows.push(p.famRow);
		writeCsv(join(DATA, 'families.csv'), FAM_HEADER, famRows);
		/* 新族的管理记录：默认 draft —— 上架与否由管理表说了算。 */
		const mgtRows = [...mgtData.rows];
		for (const p of planned) mgtRows.push({ family_id: p.famRow.family_id, status: 'draft' });
		writeCsv(join(DATA, 'management.csv'), MGT_HEADER, mgtRows);
		for (const p of planned) writeCsv(dimPath(p.famRow.family_id), p.cols, p.dims);
		saveAndGate(`已导入 ${planned.length} 个产品：${planned.map((p) => p.famRow.family_id).join(', ')}`);
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
