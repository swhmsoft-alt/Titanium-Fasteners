/**
 * scripts/verify-nav-panels.mjs — 实测**本地**站的 5 个下拉面板并与参考站对比。
 *
 * 与 scripts/probe-nav-panels.mjs 用同一套度量口径，因此两者输出可直接 diff。
 *
 * 用法：
 *   npm run preview            # 另开一个终端
 *   node scripts/verify-nav-panels.mjs [url]
 *
 * 产物：qa/local/nav-panels-local.json
 */
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const URL = process.argv[2] ?? 'http://localhost:4321/';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9334;

const chrome = spawn(
	CHROME,
	[
		'--headless=new',
		`--remote-debugging-port=${PORT}`,
		'--window-size=1440,1000',
		// 必须与参考站探测脚本一致：隐藏滚动条，否则面板宽度会差 15px。
		'--hide-scrollbars',
		'--user-data-dir=qa/.chrome-verify',
		'--no-first-run',
		'--disable-gpu',
	],
	{ stdio: 'ignore' },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function wsUrl() {
	for (let i = 0; i < 40; i++) {
		try {
			const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
			if (r.ok) return (await r.json()).webSocketDebuggerUrl;
		} catch {
			/* not up yet */
		}
		await sleep(300);
	}
	throw new Error('Chrome did not start');
}

const ws = new WebSocket(await wsUrl());
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
	const m = JSON.parse(e.data);
	if (m.id && pending.has(m.id)) {
		pending.get(m.id)(m);
		pending.delete(m.id);
	}
};
const send = (method, params = {}, sessionId) =>
	new Promise((res) => {
		const mid = ++id;
		pending.set(mid, res);
		ws.send(JSON.stringify({ id: mid, method, params, sessionId }));
	});

const { result: target } = await send('Target.createTarget', { url: 'about:blank' });
const { result: sess } = await send('Target.attachToTarget', {
	targetId: target.targetId,
	flatten: true,
});
const sessionId = sess.sessionId;
await send('Page.enable', {}, sessionId);
await send('Runtime.enable', {}, sessionId);

// 与参考站探测脚本使用同一套视口模拟，否则滚动条宽度会让面板宽度差 31px。
await send(
	'Emulation.setDeviceMetricsOverride',
	{ width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false },
	sessionId,
);

await send('Page.navigate', { url: URL }, sessionId);
await sleep(3500);

/** 在页面里运行一段表达式，返回 JSON 值。 */
async function evaluate(expression) {
	const r = await send(
		'Runtime.evaluate',
		{ expression, returnByValue: true, awaitPromise: true },
		sessionId,
	);
	if (r.result?.exceptionDetails) {
		throw new Error(JSON.stringify(r.result.exceptionDetails));
	}
	return r.result?.result?.value;
}

/** 打开某个顶级面板并度量它。 */
const MEASURE = (label) => `(() => {
  const norm = (s) => (typeof s === 'string' ? s : (s && s.baseVal !== undefined ? s.baseVal : (s == null ? '' : String(s)))).replace(/\\s+/g, ' ').trim();
  const box = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; };
  const cs = (el) => getComputedStyle(el);
  const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && cs(el).visibility !== 'hidden'; };

  const trigger = document.querySelector('[data-nav-trigger="' + ${JSON.stringify(label)} + '"]');
  if (!trigger) return { ok: false, reason: 'trigger not found' };
  trigger.click();
  return new Promise((resolve) => setTimeout(() => {
    const panel = document.querySelector('#mega-menu');
    const section = document.querySelector('[data-mega-panel="' + ${JSON.stringify(label)} + '"]');
    if (!panel || !section || !visible(panel)) { resolve({ ok: false, reason: 'panel not visible' }); return; }
    const pc = cs(panel);
    const grid = section.querySelector('ul');
    const cols = grid ? Array.from(grid.children).map((li) => ({ x: Math.round(li.getBoundingClientRect().x), w: Math.round(li.getBoundingClientRect().width) })) : [];
    const lead = section.querySelector('a.mt-48');
    const heading = section.querySelector('a.text-p-s');
    const child = section.querySelector('li.text-lead-l a');
    const pick = (el) => { if (!el) return null; const c = cs(el); return { text: norm(el.textContent), fs: c.fontSize, fw: c.fontWeight, color: c.color, ...box(el) }; };
    const links = Array.from(section.querySelectorAll('a')).map((a) => {
      const c = cs(a);
      const r = a.getBoundingClientRect();
      return { text: norm(a.textContent), fs: c.fontSize, fw: c.fontWeight, color: c.color, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    });
    const colEls = grid ? Array.from(grid.children) : [];
    const colHeights = colEls.map((li) => Math.round(li.getBoundingClientRect().height));
    const wrapper = section.querySelector('div.flex.flex-col-reverse');
    const kids = (el) => Array.from(el.childNodes).map((n) => n.nodeType === 3
      ? { text: norm(n.textContent), type: 'text' }
      : { tag: n.tagName, cls: norm(n.className), display: cs(n).display, ...box(n) });
    resolve({
      ok: true,
      panel: { cls: norm(panel.className), bg: pc.backgroundColor, shadow: pc.boxShadow, overflowY: pc.overflowY, ...box(panel) },
      panelKids: kids(panel),
      sectionBox: box(section),
      sectionKids: kids(section),
      wrapperKids: wrapper ? kids(wrapper) : null,
      wrapper: wrapper ? { cls: norm(wrapper.className), pad: cs(wrapper).padding, dir: cs(wrapper).flexDirection, ...box(wrapper) } : null,
      gridBox: grid ? box(grid) : null,
      gridStyle: grid ? { cols: cs(grid).gridTemplateColumns, gap: cs(grid).gap, cls: norm(grid.className) } : null,
      columns: cols,
      colHeights,
      links,
      lead: pick(lead),
      heading: pick(heading),
      child: pick(child),
      linkCount: section.querySelectorAll('a').length,
    });
  }, 350));
})()`;

const results = {};
for (const label of [
	'Product Solutions',
	'Services',
	'Industries',
	'Knowledge Hub',
	'About us',
]) {
	results[label] = await evaluate(MEASURE(label));
	await sleep(250);
}

mkdirSync('qa/local', { recursive: true });
writeFileSync('qa/local/nav-panels-local.json', JSON.stringify(results, null, 2));

// ── 与参考站对比 ───────────────────────────────────────────────────────────
const ref = JSON.parse(readFileSync('qa/ref/nav-panels.json', 'utf8'));
const rows = [];
for (const label of Object.keys(results)) {
	const l = results[label];
	const r = ref[label];
	if (!l.ok || !r?.ok) {
		rows.push(`${label}: local=${l.ok ? 'ok' : l.reason} ref=${r?.ok ? 'ok' : r?.reason}`);
		continue;
	}
	const refItem = r.columns?.[0]?.groups?.[0]?.items?.[0];
	rows.push(`${label}`);
	rows.push(
		`   panel  local ${l.panel.w}x${l.panel.h}@y${l.panel.y}   ref ${r.panel.w}x${r.panel.h}@y${r.panel.y}`,
	);
	rows.push(
		`   grid   local ${l.grid?.cols} gap ${l.grid?.gap}   ref ${r.grid?.cols} gap ${r.grid?.gap}`,
	);
	rows.push(
		`   cols   local ${l.columns.map((c) => `${c.x}/${c.w}`).join(' ')}   ref ${(r.columns ?? []).map((c) => `${c.x}/${c.w}`).join(' ')}`,
	);
	rows.push(
		`   lead   local ${l.lead ? `${l.lead.fs}/${l.lead.fw} ${l.lead.color}` : 'MISSING'}   ref ${r.goTo ? `${r.goTo.fs}/${r.goTo.fw} ${r.goTo.color}` : '-'}`,
	);
	rows.push(
		`   head   local ${l.heading ? `${l.heading.fs}/${l.heading.fw} ${l.heading.color}` : 'MISSING'}   ref ${refItem ? `${refItem.fs}/${refItem.fw}` : '-'}`,
	);
	rows.push(
		`   child  local ${l.child ? `${l.child.fs}/${l.child.fw} ${l.child.color}` : 'MISSING'}   ref ${refItem ? `${refItem.fs}/${refItem.fw} ${refItem.color}` : '-'}`,
	);
	rows.push(`   links  local ${l.linkCount}`);
}
console.log(rows.join('\n'));

ws.close();
chrome.kill();
