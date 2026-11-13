/**
 * scripts/probe-ref-scroll.mjs — 查明参考站在**打开下拉面板时**的滚动条处理。
 *
 * 现象：面板宽 1440（= 视口宽），而本地只有 1409（= 视口宽 − 31px 经典滚动条）。
 * 假设：参考站打开菜单时给 body/html 加了 overflow:hidden（锁滚动），
 *       滚动条消失 → clientWidth 回到 1440。
 *
 * 用法：node scripts/probe-ref-scroll.mjs [url]
 */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const URL = process.argv[2] ?? 'https://www.bossard.com/global-en/';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9335;

const chrome = spawn(
	CHROME,
	[
		'--headless=new',
		`--remote-debugging-port=${PORT}`,
		'--window-size=1440,1000',
		'--user-data-dir=qa/.chrome-scroll',
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
await send(
	'Emulation.setDeviceMetricsOverride',
	{ width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false },
	sessionId,
);
await send('Page.navigate', { url: URL }, sessionId);
await sleep(7000);

async function evaluate(expression) {
	const r = await send(
		'Runtime.evaluate',
		{ expression, returnByValue: true, awaitPromise: true },
		sessionId,
	);
	return r.result?.result?.value;
}

const SNAP = `(() => ({
  innerWidth: window.innerWidth,
  clientWidth: document.documentElement.clientWidth,
  bodyClientWidth: document.body.clientWidth,
  htmlOverflowY: getComputedStyle(document.documentElement).overflowY,
  bodyOverflowY: getComputedStyle(document.body).overflowY,
  bodyClass: document.body.className,
  htmlClass: document.documentElement.className,
  scrollHeight: document.documentElement.scrollHeight,
}))()`;

const before = await evaluate(SNAP);

// 点击第一个顶级按钮打开面板
await evaluate(`(() => {
  const b = Array.from(document.querySelectorAll('header button, header a'))
    .find((el) => (el.textContent || '').trim() === 'Product Solutions');
  if (b) { b.click(); return true; }
  return false;
})()`);
await sleep(1200);
const after = await evaluate(SNAP);

const panel = await evaluate(`(() => {
  const el = document.querySelector('div.fixed.w-full.overflow-y-auto');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { w: Math.round(r.width), x: Math.round(r.x), cls: el.className.slice(0, 80) };
})()`);

const out = { before, after, panel };
writeFileSync('qa/ref-scroll.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));

ws.close();
chrome.kill();
