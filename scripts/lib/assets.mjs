/**
 * scripts/lib/assets.mjs —— 素材扫描（生成器与 CLI 共用同一套规则）。
 *
 * 为什么单独抽出来
 * --------------
 * 「文件名 = <SKU>-<原名>.<ext>」这条约定如果写两遍，迟早会漂移：
 * 生成器认为合规的文件，CLI 报告成孤儿素材，用户两边都信 —— 那这套约定就废了。
 * 所以规则只有这一份实现，两边都从这里取。
 *
 * 约定
 * ----
 *   public/images/products/<SKU>-<原名>.<ext>   产品图（原名 = 客户自己的文件名）
 *   public/download/cad/<SKU>-<原名>.step        CAD
 *   public/download/spec/<SKU>-<原名>.pdf        规格书
 *
 * 举例：客户原图 BN-272-01.jpg → 落盘为 TI-HEXAGON-FULL-NUTS-BN-272-01.jpg
 *
 * 归属判定 = 最长 SKU 前缀（后面必须紧跟 '-'）：
 *   TI-HEX-NUT-01.webp          → SKU = TI-HEX-NUT
 *   TI-HEX-NUT-BN-272-01.jpg   → SKU = TI-HEX-NUT
 * 前缀不匹配任何 SKU → 孤儿素材（E030）；前缀对但命名不合规 → E031。
 *
 * 投递区 public/images/products/_inbox/ 整个目录跳过 ——
 * 客户原图放那儿，没人认领也不会被判成孤儿。
 */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/** 素材目录 → 素材角色。 */
export const ASSET_SOURCES = [
	{ dir: 'public/images/products', role: 'image' },
	{ dir: 'public/download/cad', role: 'cad' },
	{ dir: 'public/download/spec', role: 'pdf' },
];

/** 客户原图的投递区（扫描时整个目录跳过）。 */
export const INBOX_DIR = 'public/images/products/_inbox';

/** 展示顺序：原名尾部两位序号（-01 / -02），没有则 99（排最后）。 */
const SEQ_TAIL_RE = /-(\d{2})$/;
const SEQ_ONLY_RE = /^(\d{2})$/;

/**
 * 文件名归属哪个 SKU —— 最长前缀优先。
 * @param {string} name 文件名
 * @param {Iterable<string>} codes 已知 SKU
 * @returns {string|null}
 */
export function matchSku(name, codes) {
	const sorted = [...codes].sort((a, b) => b.length - a.length);
	for (const code of sorted) {
		if (name.startsWith(code + '-')) return code;
	}
	return null;
}

/**
 * 解析素材文件名：<SKU>-<原名>.<ext>。
 * @returns {{code:string, seq:number, original:string}|null}
 */
export function parseAssetName(name, codes) {
	const code = matchSku(name, codes);
	if (!code) return null;
	const original = name.slice(code.length + 1);
	const m = /^([^.]*)\.([A-Za-z0-9]+)$/.exec(original);
	if (!m) return null;
	const base = m[1];
	let seq = 99;
	const only = SEQ_ONLY_RE.exec(base);
	const tail = SEQ_TAIL_RE.exec(base);
	if (only) seq = Number(only[1]);
	else if (tail) seq = Number(tail[1]);
	return { code, seq, original };
}

/**
 * 扫描素材目录。
 *
 * @param {string} root 仓库根目录
 * @param {Set<string>|Map<string,string>} skus 已知 SKU（Map 时值为归属的 family_id）
 * @returns {{entries: object[], problems: {file: string, code: string, message: string}[]}}
 */
export function scanAssets(root, skus) {
	const known = skus instanceof Map ? skus : new Map([...skus].map((s) => [s, '']));
	const entries = [];
	const problems = [];

	for (const src of ASSET_SOURCES) {
		const abs = join(root, src.dir);
		if (!existsSync(abs)) continue;
		for (const dirent of readdirSync(abs, { withFileTypes: true })) {
			/* 目录（_inbox 投递区）不是素材 —— 整个跳过。 */
			if (dirent.isDirectory()) continue;
			const name = dirent.name;
			/* .gitkeep / .DS_Store / README 等不是素材，跳过（不报错）。 */
			if (name.startsWith('.') || name.startsWith('_') || name.toLowerCase() === 'readme.md') continue;
			const rel = `${src.dir}/${name}`;
			const code = matchSku(name, known.keys());
			if (!code) {
				problems.push({
					file: rel,
					code: 'E030',
					message:
						'文件名不以任何 SKU 开头 —— 孤儿素材（没人认领）。' +
						'若是客户原图：放进 public/images/products/_inbox/ 并在模板第 8 列引用，或改名为 <SKU>-<原名>.<ext>',
				});
				continue;
			}
			const parsed = parseAssetName(name, known.keys());
			if (!parsed) {
				problems.push({
					file: rel,
					code: 'E031',
					message: '文件名不合约定 —— 应为 <SKU>-<原名>.<ext>（原名自带两位序号则按序号排序）',
				});
				continue;
			}
			entries.push({
				code: parsed.code,
				seq: parsed.seq,
				original: parsed.original,
				role: src.role,
				/* public/ 是站点根 —— 对外 URL 不带这一段。 */
				url: `/${rel.replace(/^public\//, '')}`,
				family_id: known.get(code),
			});
		}
	}

	entries.sort((a, b) => a.code.localeCompare(b.code) || a.seq - b.seq);
	return { entries, problems };
}
