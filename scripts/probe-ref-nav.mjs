/**
 * scripts/probe-ref-nav.mjs — 实测参考站顶部导航 5 个顶级项的下拉面板结构。
 *
 * Phase A（1:1 照抄）用：照抄的前提是**看得见**参考站真实渲染出来的面板。
 * 用 CDP 打开参考站 → 真实鼠标 hover 顶级项 → 导出可见面板的 DOM 结构
 * （分组标题 / 链接文本 / href / 字号 / 字重 / 颜色）并截图作为验收基线。
 *
 * 产物：qa/ref-meganav.json + qa/ref/mega-<name>.png
 * 用法：node scripts/probe-ref-nav.mjs [url]
 */
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL = process.argv[2] ?? 'https://www.bossard.com/global-en/';
const PORT = 9336;
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, attempts = 60) {
	for (let i = 0; i < attempts; i++) {
		try {
			const res = await fetch(url);
			if (res.ok) return await res.json();
		} catch {
			/* retry */
		}
		await sleep(300);
	}
	throw new Error(`CDP not reachable: ${url}`);
}

const DUMP = `(() => {
  const norm = (s) => (s || '').replace(/\\s+/g, ' ').trim();
  const cs = (el) => getComputedStyle(el);
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && cs(el).visibility !== 'hidden' && cs(el).display !== 'none';
  };
  const all = Array.from(document.querySelectorAll('body *')).filter((el) => {
    if (!visible(el)) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 400 || r.height < 120) return false;
    return el.querySelectorAll('a').length >= 5;
  });
  let panel = null;
  for (const el of all) {
    if (!panel) { panel = el; continue; }
    if (el.querySelectorAll('a').length > panel.querySelectorAll('a').length) panel = el;
  }
  if (!panel) return { error: 'no visible panel found' };
  const r = panel.getBoundingClientRect();
  const out = { panel: { tag: panel.tagName.toLowerCase(), cls: norm(panel.className).slice(0, 200), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), bg: cs(panel).backgroundColor, position: cs(panel).position }, tree: [] };
  const walk = (el, depth) => {
    for (const child of el.children) {
      const tag = child.tagName.toLowerCase();
      if (['script','style','noscript','svg','path'].includes(tag)) continue;
      const c = cs(child);
      const cr = child.getBoundingClientRect();
      const isHeading = /^h[1-6]$/.test(tag) || (parseInt(c.fontWeight, 10) >= 700 && norm(child.textContent).length > 0 && child.children.length === 0);
      const isLink = tag === 'a';
      if ((isHeading || isLink) && visible(child)) {
        out.tree.push({ d: depth, tag, text: norm(child.textContent).slice(0, 90), href: isLink ? child.getAttribute('href') : null, fs: c.fontSize, fw: c.fontWeight, color: c.color, x: Math.round(cr.left), y: Math.round(cr.top), w: Math.round(cr.width), h: Math.round(cr.height), cls: norm(child.className).slice(0, 90) });
      }
      walk(child, depth + 1);
    }
  };
  walk(panel, 0);
  return out;
})()`;

const BUTTONS = `(() => {
  const norm = (s) => (s || '').replace(/\\s+/g, ' ').trim();
  const want = ['Product Solutions','Services','Industries','Knowledge Hub','About us'];
  const out = [];
  for (const el of document.querySelectorAll('button, a')) {
    const t = norm(el.textContent);
    if (want.includes(t)) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.top < 200 && r.top >= 0) out.push({ label: t, x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) });
    }
  }
  return out;
})()`;

const profile = mkdtempSync(join(tmpdir(), 'tf-nav-'));
const chrome = spawn(
	CHROME,
	[
		'--headless=new',
		`--remote-debugging-port=${PORT}`,
		`--user-data-dir=${profile}`,
		'--window-size=1440,1000',
		'--no-first-run',
		'--no-default-browser-check',
		'--disable-gpu',
		'--hide-scrollbars',
		'about:blank',
	],
	{ stdio: 'ignore' },
);

mkdirSync('qa/ref', { recursive: true });

let ws;
let nextId = 1;
const pending = new Map();

try {
	const version = await fetchJson(`http://127.0.0.1:${PORT}/json/version`);
	ws = new WebSocket(version.webSocketDebuggerUrl);
	await new Promise((resolve, reject) => {
		ws.addEventListener('open', resolve, { once: true });
		ws.addEventListener('error', reject, { once: true });
	});
	ws.addEventListener('message', (e) => {
		const msg = JSON.parse(e.data);
		if (msg.id && pending.has(msg.id)) {
			const { resolve, reject } = pending.get(msg.id);
			pending.delete(msg.id);
			msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
		}
	});
	const send = (method, params = {}, sessionId) =>
		new Promise((resolve, reject) => {
			const id = nextId++;
			pending.set(id, { resolve, reject });
			ws.send(JSON.stringify({ id, method, params, sessionId }));
		});

	const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
	const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
	await send('Page.enable', {}, sessionId);
	await send('Runtime.enable', {}, sessionId);
	await send(
		'Emulation.setDeviceMetricsOverride',
		{ width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false },
		sessionId,
	);
	await send('Page.navigate', { url: URL }, sessionId);
	await sleep(6000);

	const { result: btnRes } = await send(
		'Runtime.evaluate',
		{ returnByValue: true, expression: BUTTONS },
		sessionId,
	);
	const buttons = btnRes.value ?? [];
	console.log('buttons:', JSON.stringify(buttons));

	const results = {};
	for (const b of buttons) {
		await send(
			'Input.dispatchMouseEvent',
			{ type: 'mouseMoved', x: 720, y: 600, buttons: 0 },
			sessionId,
		);
		await sleep(250);
		await send(
			'Input.dispatchMouseEvent',
			{ type: 'mouseMoved', x: b.x, y: b.y, buttons: 0 },
			sessionId,
		);
		await sleep(600);
		await send(
			'Input.dispatchMouseEvent',
			{ type: 'mousePressed', x: b.x, y: b.y, button: 'left', clickCount: 1 },
			sessionId,
		);
		await send(
			'Input.dispatchMouseEvent',
			{ type: 'mouseReleased', x: b.x, y: b.y, button: 'left', clickCount: 1 },
			sessionId,
		);
		await sleep(1600);
		const { result } = await send(
			'Runtime.evaluate',
			{ returnByValue: true, expression: DUMP },
			sessionId,
		);
		results[b.label] = result.value;
		const shot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
		const file = `qa/ref/mega-${b.label.toLowerCase().replace(/\s+/g, '-')}.png`;
		writeFileSync(file, Buffer.from(shot.data, 'base64'));
		console.log('captured:', b.label, '| nodes:', result.value?.tree?.length ?? 0, '|', file);
	}

	writeFileSync('qa/ref-meganav.json', JSON.stringify(results, null, 2));
	console.log('written qa/ref-meganav.json');
} catch (e) {
	console.error('ERROR', e.message);
	process.exitCode = 1;
} finally {
	try {
		chrome.kill();
	} catch {
		/* ignore */
	}
}

