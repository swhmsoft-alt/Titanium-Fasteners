/**
 * scripts/probe-ref-gray.mjs — 实测参考站 gray 系列的**计算色**。
 *
 * 背景：参考站编译后的 CSS 里 `.text-gray-medium` → rgb(102 102 102)，
 * `.text-gray` → rgb(51 51 51)；而本项目的令牌写的是
 * `--color-gray-medium: #555555` / `--color-gray: #666666` —— 名字与值错位。
 *
 * 本脚本在参考站真实页面上按类名取元素的 getComputedStyle().color，
 * 得到**渲染值**（权威），而不是靠读 CSS 猜测。
 */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9333;

const chrome = spawn(
	CHROME,
	[
		'--headless=new',
		`--remote-debugging-port=${PORT}`,
		'--window-size=1440,1000',
		'--user-data-dir=qa/.chrome-gray',
		'--no-first-run',
		'--disable-gpu',
	],
	{ stdio: 'ignore' },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cdp() {
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

const wsUrl = await cdp();
const ws = new WebSocket(wsUrl);
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

const { result: target } = await send('Target.createTarget', {
	url: 'https://www.bossard.com/global-en/',
});
const { result: sess } = await send('Target.attachToTarget', {
	targetId: target.targetId,
	flatten: true,
});
const sessionId = sess.sessionId;

await send('Page.enable', {}, sessionId);
await send('Runtime.enable', {}, sessionId);
await sleep(6000);

const EVAL = `(() => {
  const out = {};
  const probe = (cls) => {
    const el = document.querySelector('.' + cls);
    if (!el) return null;
    const c = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      color: c.color,
      fontSize: c.fontSize,
      fontWeight: c.fontWeight,
      lineHeight: c.lineHeight,
      sample: (el.textContent || '').replace(/\\s+/g,' ').trim().slice(0, 40),
      w: Math.round(r.width), h: Math.round(r.height),
    };
  };
  for (const cls of ['text-gray-medium','text-gray','text-gray-dark','text-gray-light','text-black','text-blue','text-blue-dark3','text-lead-l','text-p-s','text-label']) {
    out[cls] = probe(cls);
  }
  // Inherited colour: what does the document body resolve to?
  out['__body'] = { color: getComputedStyle(document.body).color, fontSize: getComputedStyle(document.body).fontSize };
  out['__html'] = { color: getComputedStyle(document.documentElement).color };
  // A rich-text paragraph (reference uses .text-p .text-gray) — its real colour.
  const p = document.querySelector('p.text-p.text-gray');
  if (p) out['__richTextP'] = { color: getComputedStyle(p).color, cls: p.className, sample: p.textContent.replace(/\\s+/g,' ').trim().slice(0,50) };
  return out;
})()`;

const r = await send(
	'Runtime.evaluate',
	{ expression: EVAL, returnByValue: true },
	sessionId,
);

writeFileSync('qa/ref-gray.json', JSON.stringify(r.result?.result?.value ?? r, null, 2));
console.log(JSON.stringify(r.result?.result?.value ?? r, null, 2));

ws.close();
chrome.kill();
