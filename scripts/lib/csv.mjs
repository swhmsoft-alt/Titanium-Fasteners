/**
 * scripts/lib/csv.mjs — CSV 读写（gen-products.mjs 与 products.mjs 共用）。
 *
 * 为什么共用一份：真相源是 CSV，CSV 的读法就必须只有一种。解析与转义规则
 * 一旦两处各写一份就会漂移，而漂移的后果很隐蔽 —— Excel 打开看着对，
 * 生成器读出来是乱码，错误要等到闸门才炸。
 *
 * 约定：
 *   · 逗号分隔；含逗号/引号/换行的字段用双引号包裹，字段内双引号写成两个；
 *   · 行尾 \n（不写 \r —— Windows 上 Excel 会二次转换，导致 diff 噪声）；
 *   · 读取时首行是表头；行内缺失的列补空串，多余的列丢弃。
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

/** 文本 → 二维数组。 */
export function parseCsv(text) {
	const rows = [];
	let row = [];
	let field = '';
	let quoted = false;
	const src = text.replace(/^\uFEFF/, '');
	for (let i = 0; i < src.length; i++) {
		const c = src[i];
		if (quoted) {
			if (c === '"') {
				if (src[i + 1] === '"') {
					field += '"';
					i++;
				} else quoted = false;
			} else field += c;
		} else if (c === '"') quoted = true;
		else if (c === ',') {
			row.push(field);
			field = '';
		} else if (c === '\n') {
			row.push(field);
			rows.push(row);
			row = [];
			field = '';
		} else if (c !== '\r') field += c;
	}
	if (field !== '' || row.length > 0) {
		row.push(field);
		rows.push(row);
	}
	return rows.filter((r) => !(r.length === 1 && r[0].trim() === ''));
}

/**
 * 读 CSV → { header, rows }。
 * rows 是以表头为键的记录数组（值已 trim）。
 * 文件不存在 → null（调用方自行决定是「空表」还是「错误」）。
 */
export function readCsv(path) {
	if (!existsSync(path)) return null;
	const rows = parseCsv(readFileSync(path, 'utf8'));
	if (rows.length === 0) return { header: [], rows: [] };
	const header = rows[0].map((h) => h.trim());
	const out = [];
	for (let i = 1; i < rows.length; i++) {
		const rec = {};
		header.forEach((h, j) => {
			rec[h] = (rows[i][j] ?? '').trim();
		});
		out.push(rec);
	}
	return { header, rows: out };
}

/** 单字段转义。 */
export function csvEscape(value) {
	const s = value === undefined || value === null ? '' : String(value);
	if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
	return s;
}

/**
 * 写 CSV。records 的键顺序由 header 决定 —— 多余的键会被丢弃，
 * 缺少的键写成空串（不静默丢数据）。
 */
export function writeCsv(path, header, records) {
	const lines = [header.join(',')];
	for (const rec of records) {
		lines.push(header.map((h) => csvEscape(rec[h] ?? '')).join(','));
	}
	writeFileSync(path, lines.join('\n') + '\n', 'utf8');
}
