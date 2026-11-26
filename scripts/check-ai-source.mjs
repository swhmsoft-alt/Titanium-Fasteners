#!/usr/bin/env node
/**
 * scripts/check-ai-source.mjs — AI 搜索选源资格闸门（工业 B2B 商业页面）。
 *
 * WHY
 * ---
 * 《工业 B2B 商业页面 AI 搜索选源资格检查标准.md》定义了六个维度
 * （索引资格 / 查询相关性 / 事实与证据 / 信息完整性 / 来源可信度 / 商业转化），
 * 其中两项是**硬性门槛**：索引资格、事实与证据。
 *
 * 这道闸门只做「能被代码判定」的那部分：它读 dist 下的产物 HTML，对每一页断言
 * 可机械取证的事实，给出六维评分，并列出仍需人工判断的证据缺口。
 * 它不是排名预测器，也不是 Google 官方标准 —— 只是把「发布前检查」从
 * 口头记忆变成一条可重复执行的命令。
 *
 * 六维与本仓实现方式
 * ------------------
 *   ① 索引资格  20 分  硬门槛：canonical 指向自身、无 noindex、title/description 合法、唯一 h1
 *   ② 查询相关性 20 分         h1 含业务实体、非泛化词、h2 覆盖、出现采购意图词
 *   ③ 事实与证据 20 分  硬门槛：无参考站品牌残留、无 AI 套话话术、含可核查标准/牌号锚点
 *   ④ 信息完整性 15 分         规格锚点 + 交易信息（交期/库存/包装）+ FAQ/表格
 *   ⑤ 来源可信度 15 分         Organization 结构化数据或 about 入口 + 制造方身份 + 联系入口
 *   ⑥ 商业转化 10 分         询盘入口（/contact/ 或表单）+ 询盘动作文案
 *
 * USAGE
 * -----
 *   node scripts/check-ai-source.mjs                # 全站扫描
 *   node scripts/check-ai-source.mjs --pages /products/grade-5-fasteners/ /services/
 *   node scripts/check-ai-source.mjs --quiet
 *
 * Requires `dist/` to exist (run `npm run build` first).
 * Exit codes: 0 = 无硬门槛失败；1 = 存在硬门槛失败（索引资格 / 事实与证据）；2 = 环境错误。
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const argv = process.argv.slice(2);
const quiet = argv.includes('--quiet');
const reportPath = 'qa/ai-source-report.json';

/* ── 0. 环境 ─────────────────────────────────────────────────────────────── */

if (!exists(DIST)) {
	console.error('[check-ai-source] dist/ not found — run `npm run build` first.');
	process.exit(2);
}

/** 站点规范域名：从 src/config/site.ts 解析，避免硬编码第二处真相源。 */
function siteOrigin() {
	try {
		const src = readFileSync('src/config/site.ts', 'utf8');
		const m = src.match(/url:\s*'([^']+)'/);
		if (m) return m[1].replace(/\/$/, '');
	} catch {
		/* fall through */
	}
	return 'https://fastener.bozemetal.com';
}

const ORIGIN = siteOrigin();

/* ── 1. 词表（事实红线 / 套话 / 证据锚点） ───────────────────────────────── */

/**
 * 品牌 / 第三方残留：出现在面向客户的正文、图片 alt 或图片路径里即为事实污染
 * （硬门槛失败）。全部小写 —— 匹配时统一转小写，规避大小写写法差异。
 *
 * 'elam' = 参考站自有数字化平台名；'bossard' = 参考公司名（也会出现在
 * 图片文件名里，例如 04-bossard-smart-tool.webp）。
 */
const REFERENCE_BRANDS = [
	'bossard',
	'spax',
	'eska',
	'castsert',
	'jextar',
	'pem ghost',
	'elam',
	'assembly technology expert',
];

/**
 * AI 咨询腔套话：与 LAYOUT_RULES「零废话」冲突。
 *
 * 注意：这些词属于**内容质量**问题（维度④），不是**事实错误**（维度③）——
 * 「cutting-edge」不会让一个价格或牌号变成假信息。因此它们不参与硬门槛判定，
 * 只扣质量分。
 */
const AI_FLUFF = [
	'cutting-edge',
	'cutting edge',
	'one-stop',
	'one stop',
	'comprehensive services',
	'comprehensive solutions',
	'tailored solutions',
	'unlock ',
	'unlocks ',
	'elevate ',
	'empowering your',
	'world-class',
	'state-of-the-art',
	'seamless ',
];

/** 可核查的技术锚点：DIN / ISO / ASTM / AMS / EN 10204 / 钛牌号 / 规格区间。 */
const SPEC_ANCHORS = [
	'DIN',
	'ISO ',
	'ASTM',
	'AMS ',
	'EN 10204',
	'Grade 2',
	'Grade 5',
	'Grade 23',
	'Ti-6Al-4V',
	'CP Grade',
	'M1.6',
	'M36',
];

/** 采购意图词：买家会在页面上找的判断依据。 */
const INTENT_WORDS = [
	'quote',
	'RFQ',
	'inquiry',
	'inquiry',
	'stock',
	'lead time',
	'MOQ',
	'batch',
	'delivery',
	'packaging',
	'certification',
	'traceability',
	'EN 10204',
	'MTC',
	'PMI',
	'XRF',
	'NDA',
];

/** 交易信息：交期 / 库存 / 最小起订 / 包装 / 付款。 */
const TRANSACTION_WORDS = [
	'lead time',
	'stock',
	'MOQ',
	'minimum order',
	'delivery',
	'packaging',
	'shipment',
	'payment terms',
	'in-stock',
];

/** 制造方身份声明（来源可信度的关键事实）。 */
const MANUFACTURER_WORDS = [
	'manufacturer',
	'manufacturing',
	'factory',
	'in-house',
	'in house',
	'we produce',
	'production line',
	'machining',
];

/** 泛化 h1（查询相关性的反面证据）。 */
const GENERIC_H1 = [
	'Welcome to',
	'Our products',
	'Products and services',
	'Home page',
	'Solutions',
	'Services',
	'Company',
	'About us',
];

/** 询盘动作文案（商业转化的正面证据）。 */
const QUERY_ACTIONS = [
	'Request a Quote',
	'Request a quote',
	'Upload BOM',
	'Send inquiry',
	'Send us an inquiry',
	'Quote request',
	'Get a quote',
	'Submit inquiry',
	'Contact us',
	'Send your',
];

/* ── 2. 极简 HTML 取证 ──────────────────────────────────────────────────── */

function exists(p) {
	try {
		return statSync(p).isDirectory() || statSync(p).isFile();
	} catch {
		return false;
	}
}

function listHtml(dir, out = []) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		const st = statSync(full);
		if (st.isDirectory()) listHtml(full, out);
		else if (entry.endsWith('.html')) out.push(full);
	}
	return out;
}

function textOf(html) {
	return html
		.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/\s+/g, ' ')
		.trim();
}

function metaContent(html, name) {
	const re = new RegExp(
		`<meta[^>]+name=["']${name}["'][^>]*content=["']([^"']*)["']`,
		'i'
	);
	const alt = new RegExp(
		`<meta[^>]+content=["']([^"']*)["'][^>]*name=["']${name}["']`,
		'i'
	);
	const m = html.match(re) || html.match(alt);
	return m ? m[1].trim() : '';
}

function linkHref(html, rel) {
	const re = new RegExp(`<link[^>]+rel=["']${rel}["'][^>]*href=["']([^"']*)["']`, 'i');
	const alt = new RegExp(`<link[^>]+href=["']([^"']*)["'][^>]*rel=["']${rel}["']`, 'i');
	const m = html.match(re) || html.match(alt);
	return m ? m[1].trim() : '';
}

/** 解码 HTML 实体 —— 长度统计必须按解码后的可见字符算，否则 &amp; 会被算成 5 个字符。 */
function decodeEntities(s) {
	return s
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
		.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function titleOf(html) {
	const m = html.match(/<title>([\s\S]*?)<\/title>/i);
	return m ? decodeEntities(m[1].replace(/\s+/g, ' ').trim()) : '';
}

function h1sOf(html) {
	const out = [];
	const re = /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi;
	let m;
	while ((m = re.exec(html))) out.push(textOf(m[1]));
	return out;
}

function h2sOf(html) {
	const out = [];
	const re = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
	let m;
	while ((m = re.exec(html))) out.push(textOf(m[1]));
	return out;
}

function pathnameOf(file) {
	const rel = relative(DIST, file).split(sep).join('/');
	if (rel === 'index.html') return '/';
	if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
	return '/' + rel;
}

/* ── 3. 单页评分 ────────────────────────────────────────────────────────── */

function auditPage(file) {
	const html = readFileSync(file, 'utf8');
	const path = pathnameOf(file);
	const body = textOf(html);
	const robots = metaContent(html, 'robots');
	const isNoindex = /noindex/i.test(robots);
	const canonical = linkHref(html, 'canonical');
	const title = titleOf(html);
	const description = decodeEntities(metaContent(html, 'description'));
	const h1s = h1sOf(html);
	const h2s = h2sOf(html);
	const lang = (html.match(/<html[^>]+lang=["']([^"']+)["']/i) || [, ''])[1];

	const checks = [];
	/**
	 * @param gate true = 硬门槛项（① 索引资格 / ③ 事实与证据）。硬门槛失败时
	 *              总分无意义 —— 闸门直接 exit 1，不允许用其它维度的高分掩盖。
	 */
	const add = (dimension, ok, label, evidence, gate = false) =>
		checks.push({ dimension, ok: !!ok, label, evidence: evidence ?? '', gate });

	/* 匹配一律大小写不敏感：文案里的写法大小写不统一（Cutting-edge / cutting-edge）。 */
	const haystack = `${body} ${html}`.toLowerCase();
	const hit = (list) => list.filter((w) => haystack.includes(w.toLowerCase()));

	/* ① 索引资格（硬门槛）—— 只管「能不能被索引、被读到哪一页」 */
	const canonicalOk = !!canonical && canonical.replace(/\/$/, '') === `${ORIGIN}${path}`.replace(/\/$/, '');
	add(1, canonicalOk, 'canonical 指向自身 URL', canonical || '(缺失)', true);
	add(1, !isNoindex, '未被 noindex 排除', robots || '(无 robots meta)', true);
	add(1, h1s.length === 1, '唯一 h1', h1s.length ? h1s.join(' | ') : '(无 h1)', true);
	add(1, !!lang, 'html lang 已声明', lang || '(缺失)', true);
	add(1, title.length > 0, 'title 非空', title || '(缺失)', true);
	add(1, description.length > 0, 'description 非空', description || '(缺失)', true);

	/* ② 查询相关性 —— 长度问题归这里，不归硬门槛 */
	const h1 = h1s[0] ?? '';
	const generic = GENERIC_H1.find((g) => h1.toLowerCase().startsWith(g.toLowerCase()));
	add(2, h1.length > 0 && !generic, 'h1 非泛化词', generic ? `泛化: ${generic}` : h1);
	add(
		2,
		/titanium|fastener|bolt|screw|stud|nut|washer/i.test(h1),
		'h1 含业务实体',
		h1
	);
	add(2, h2s.length >= 3, 'h2 覆盖关键模块', `${h2s.length} 个 h2`);
	const intents = hit(INTENT_WORDS);
	add(2, intents.length >= 3, '出现采购意图词', intents.slice(0, 6).join(', ') || '(无)');
	add(
		2,
		title.length >= 20 && title.length <= 75,
		'title 长度 20–75 字符',
		`${title.length} 字符`
	);
	add(
		2,
		description.length >= 60 && description.length <= 160,
		'description 长度 60–160 字符',
		`${description.length} 字符`
	);

	/* ③ 事实与证据（硬门槛） */
	const brands = hit(REFERENCE_BRANDS);
	add(3, brands.length === 0, '无参考站品牌残留', brands.join(', ') || '0 命中', true);
	const specs = hit(SPEC_ANCHORS);
	add(3, specs.length >= 1, '含可核查标准/牌号锚点', specs.slice(0, 6).join(', ') || '(无)', true);

	/* ④ 信息完整性 */
	add(4, specs.length >= 2, '规格锚点覆盖 ≥2', specs.slice(0, 6).join(', ') || '(无)');
	const tx = hit(TRANSACTION_WORDS);
	add(4, tx.length >= 2, '含交易信息（交期/库存/包装）', tx.join(', ') || '(无)');
	/*
	 * 「含 FAQ 或规格表」必须看真实标记：
	 *   - <table> 只能在 html 里找 —— body 是去标签后的纯文本，永远匹配不到；
	 *   - FAQ 标题大小写不固定（"Frequently asked questions"），用 /i。
	 */
	const hasTable = /<table\b/i.test(html);
	const hasFaq = /frequently\s+asked|\bFAQ\b/i.test(body);
	const hasFaqOrTable = hasTable || hasFaq;
	add(4, hasFaqOrTable, '含 FAQ 或规格表', hasFaqOrTable ? (hasTable ? '有规格表' : '有 FAQ') : '无');
	const fluff = hit(AI_FLUFF);
	add(4, fluff.length === 0, '无 AI 咨询腔套话', fluff.join(', ') || '0 命中');

	/* ⑤ 来源可信度 */
	const hasOrgLd = /"@type"\s*:\s*"Organization"/.test(html);
	const hasAbout = /href=["'][^"']*\/about-us\//.test(html);
	add(5, hasOrgLd || hasAbout, 'Organization 结构化数据或 about 入口', `orgLd=${hasOrgLd} about=${hasAbout}`);
	const mfg = hit(MANUFACTURER_WORDS);
	add(5, mfg.length >= 1, '制造方身份声明', mfg.slice(0, 4).join(', ') || '(无)');
	add(5, /href=["'][^"']*\/contact\//.test(html), '联系入口存在', '/contact/ 链接');

	/* ⑥ 商业转化 */
	const hasForm = /<form\b/i.test(html);
	add(6, hasForm || /href=["'][^"']*\/contact\//.test(html), '询盘入口（表单或 /contact/）', hasForm ? '表单' : 'contact 链接');
	const actions = hit(QUERY_ACTIONS);
	add(6, actions.length >= 1, '询盘动作文案', actions.slice(0, 4).join(', ') || '(无)');

	/* 评分 */
	const weights = { 1: 20, 2: 20, 3: 20, 4: 15, 5: 15, 6: 10 };
	const scores = {};
	for (const d of [1, 2, 3, 4, 5, 6]) {
		const items = checks.filter((c) => c.dimension === d);
		const got = items.filter((c) => c.ok).length;
		scores[d] = Math.round((weights[d] * got) / Math.max(items.length, 1));
	}
	const total = Object.values(scores).reduce((a, b) => a + b, 0);
	const gateFails = checks.filter((c) => c.gate && !c.ok);
	const hardFail = gateFails.length > 0;

	return {
		path,
		file: relative('.', file).split(sep).join('/'),
		noindex: isNoindex,
		scores,
		total,
		hardFail,
		gateFailures: gateFails.map((c) => `${c.dimension}:${c.label}`),
		checks,
		bodyWords: body.split(/\s+/).filter(Boolean).length,
		haystack,
	};
}

/* ── 4. 扫描 ────────────────────────────────────────────────────────────── */

const pageArgIdx = argv.indexOf('--pages');
const onlyPages =
	pageArgIdx >= 0
		? argv.slice(pageArgIdx + 1).filter((a) => !a.startsWith('--'))
		: null;

let files = listHtml(join(DIST));
files = files.filter((f) => {
	const p = pathnameOf(f);
	if (p === '/404.html') return false;
	return true;
});

if (onlyPages && onlyPages.length) {
	const wanted = new Set(onlyPages.map((p) => p.replace(/\/$/, '') || '/'));
	files = files.filter((f) => wanted.has(pathnameOf(f).replace(/\/$/, '') || '/'));
}

const audits = files.map(auditPage);

/* noindex 页（redirect stub 等）不参与评分汇总，只做记录。 */
const indexable = audits.filter((a) => !a.noindex);
const failing = indexable.filter((a) => a.hardFail);
const byTotal = [...indexable].sort((a, b) => a.total - b.total);

/* ── 5. 报告 ────────────────────────────────────────────────────────────── */

const report = {
	generatedAt: new Date().toISOString(),
	origin: ORIGIN,
	standard: '工业 B2B 商业页面 AI 搜索选源资格检查标准（六维 / 100 分）',
	hardGates: ['索引资格', '事实与证据'],
	thresholds: { good: 80, prioritise: 60 },
	pages: audits.map((a) => ({
		path: a.path,
		total: a.total,
		scores: a.scores,
		hardFail: a.hardFail,
		gateFailures: a.gateFailures,
		noindex: a.noindex,
		words: a.bodyWords,
		/* 未通过的检查项（含维度与证据），供审计表直接引用 */
		failed: a.checks
			.filter((c) => !c.ok)
			.map((c) => ({
				dimension: c.dimension,
				label: c.label,
				evidence: c.evidence,
				gate: c.gate,
			})),
	})),
};
try {
	writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
} catch {
	/* 报告落盘失败不阻断判定 */
}

if (!quiet) {
	console.log(`[check-ai-source] 扫描 ${audits.length} 页（可索引 ${indexable.length}），报告：${reportPath}`);
	console.log('');
	for (const a of byTotal) {
		const flag = a.hardFail ? 'HARD-FAIL' : a.total >= 80 ? 'ok       ' : a.total >= 60 ? 'priority' : 'low      ';
		console.log(
			`${flag} ${String(a.total).padStart(3)}  ` +
				`[${a.scores[1]}/${a.scores[2]}/${a.scores[3]}/${a.scores[4]}/${a.scores[5]}/${a.scores[6]}]  ${a.path}` +
				(a.gateFailures.length ? `  ← ${a.gateFailures.join(', ')}` : '')
		);
	}
	console.log('');
	const below = indexable.filter((a) => a.total < 80).length;
	console.log(`[check-ai-source] 硬门槛失败 ${failing.length} 页；总分 <80 的 ${below} 页。`);
}

if (failing.length) {
	console.error(`[check-ai-source] 硬门槛失败（索引资格 / 事实与证据）${failing.length} 页：`);
	for (const a of failing) console.error(`  - ${a.path}: ${a.gateFailures.join(', ')}`);
	process.exitCode = 1;
}
