/**
 * scripts/inspect-reference.mjs — 实测参考站首页 DOM 结构并采集基线截图。
 *
 * Phase A（1:1 照抄）用：照抄的前提是**看得见**参考站的真实结构与像素，
 * 而不是靠推测。��脚本用 CDP 打开参考站，导出 main 的层级结构
 * （标签 / 几何 / 标题 / 图片 / 链接），并采集整页截图作为验收基线。
 *
 * 产物：
 *   docs/reference/homepage-dom.json   结构实测
 *   qa/ref/home-1440.png               桌面基线截图
 *   qa/ref/home-390.png                移动基线截图
 *
 * 用法：node scripts/inspect-reference.mjs [url]
 */

import { spawn } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const LOCAL = process.argv.includes('--local');
const URL = LOCAL
	? 'http://localhost:4321/'
	: (process.argv[2] ?? 'https://www.bossard.com/global-en/');
const DOM_OUT = LOCAL
	? 'docs/reference/homepage-dom.local.json'
	: 'docs/reference/homepage-dom.json';
const PORT = 9334;
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, attempts = 40) {
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

const OUTLINE = `(() => {
  const px = (n) => Math.round(n);
  const norm = (s) => (s || '').replace(/\\s+/g, ' ').trim();
  const main = document.querySelector('main');
  if (!main) return { error: 'no <main>', bodyH: document.body.scrollHeight };

  const describe = (el, depth) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const node = {
      tag: el.tagName.toLowerCase(),
      cls: norm(el.className).slice(0, 260),
      y: px(r.top + window.scrollY),
      x: px(r.left),
      w: px(r.width),
      h: px(r.height),
      bg: cs.backgroundColor,
      pt: cs.paddingTop, pb: cs.paddingBottom, mt: cs.marginTop, mb: cs.marginBottom,
      display: cs.display,
    };
    if (cs.display === 'grid' || cs.display === 'flex') {
      node.cols = cs.gridTemplateColumns;
      node.gap = cs.gap;
      node.justify = cs.justifyContent;
      node.align = cs.alignItems;
    }
    const h = el.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4');
    if (h) node.head = { tag: h.tagName, size: getComputedStyle(h).fontSize, color: getComputedStyle(h).color, text: norm(h.textContent).slice(0, 140) };
    const im = el.querySelector(':scope > img, :scope > picture img, :scope > a > img');
    if (im) {
      const ir = im.getBoundingClientRect();
      node.img = { src: im.getAttribute('src'), alt: im.alt, w: px(ir.width), h: px(ir.height), x: px(ir.left), y: px(ir.top + window.scrollY), ratio: ir.height ? +(ir.width / ir.height).toFixed(3) : null };
    }
    if (depth > 0) {
      const kids = Array.from(el.children).filter((c) => !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(c.tagName));
      if (kids.length) node.kids = kids.map((c) => describe(c, depth - 1));
    }
    return node;
  };

  const grids = Array.from(main.querySelectorAll('div')).filter((d) => {
    const cs = getComputedStyle(d);
    return cs.display === 'grid' && Array.from(d.children).length > 0;
  }).slice(0, 12).map((g) => {
    const cs = getComputedStyle(g);
    return {
      cls: norm(g.className).slice(0, 220),
      cols: cs.gridTemplateColumns,
      rows: cs.gridTemplateRows,
      gap: cs.gap,
      kids: Array.from(g.children).map((k) => {
        const kr = k.getBoundingClientRect();
        const im = k.querySelector('img');
        const ir = im ? im.getBoundingClientRect() : null;
        const hd = k.querySelector('h1,h2,h3,h4');
        return {
          tag: k.tagName.toLowerCase(),
          cls: norm(k.className).slice(0, 180),
          y: px(kr.top + window.scrollY),
          x: px(kr.left),
          w: px(kr.width),
          h: px(kr.height),
          head: hd ? hd.tagName + ' ' + getComputedStyle(hd).fontSize + ' ' + norm(hd.textContent).slice(0, 90) : null,
          img: im ? { src: im.getAttribute('src'), alt: im.alt, w: px(ir.width), h: px(ir.height), ratio: ir.height ? +(ir.width / ir.height).toFixed(3) : null } : null,
          text: norm(k.textContent).slice(0, 150),
        };
      }),
    };
  });

  const media = (() => {
    const out = [];
    for (const ss of document.styleSheets) {
      try { for (const r of ss.cssRules) if (r.conditionText) out.push(r.conditionText); } catch { /* cross-origin */ }
    }
    return [...new Set(out)].filter((m) => /min-width|max-width/.test(m)).slice(0, 60);
  })();

  return {
    bodyH: document.body.scrollHeight,
    docW: document.documentElement.scrollWidth,
    mainKids: Array.from(main.children).map((el) => describe(el, 6)),
    grids,
    media,
  };
})()`;

const profile = mkdtempSync(join(tmpdir(), 'tf-ref-'));
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

	const shots = LOCAL
		? [
				{ w: 1440, h: 1000, file: 'qa/local/home-1440.png' },
				{ w: 390, h: 844, file: 'qa/local/home-390.png' },
			]
		: [
				{ w: 1440, h: 1000, file: 'qa/ref/home-1440.png' },
				{ w: 390, h: 844, file: 'qa/ref/home-390.png' },
			];

	for (const s of shots) {
		await send(
			'Emulation.setDeviceMetricsOverride',
			{ width: s.w, height: s.h, deviceScaleFactor: 1, mobile: s.w < 768 },
			sessionId,
		);
		await send('Page.navigate', { url: URL }, sessionId);
		await sleep(4500);
		// Trigger lazy loading. The reference keeps `loading="lazy"`, and in a
		// headless run those images never enter the viewport, so their boxes
		// measure 0×0 — a state no real visitor ever sees. Force them to load
		// so the measurement reflects what the page actually looks like.
		await send(
			'Runtime.evaluate',
			{
				expression: `(() => {
					window.scrollTo(0, document.body.scrollHeight);
					for (const im of document.querySelectorAll('img[loading="lazy"]')) {
						im.loading = 'eager';
						const s = im.getAttribute('src');
						if (s) im.setAttribute('src', s);
					}
					return true;
				})()`,
			},
			sessionId,
		);
		await sleep(4000);
		await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0); true' }, sessionId);
		await sleep(800);

		if (s.w === 1440) {
			const { result } = await send(
				'Runtime.evaluate',
				{ returnByValue: true, expression: OUTLINE },
				sessionId,
			);
			writeFileSync(
				DOM_OUT,
				JSON.stringify({ url: URL, viewport: `${s.w}x${s.h}`, ...result.value }, null, 2),
			);
			console.log(`DOM → ${DOM_OUT}`);
		}

		const shot = await send(
			'Page.captureScreenshot',
			{ format: 'png', captureBeyondViewport: true, fromSurface: true },
			sessionId,
		);
		writeFileSync(s.file, Buffer.from(shot.data, 'base64'));
		console.log(`shot → ${s.file}`);
	}
} finally {
	ws?.close();
	chrome.kill();
	try {
		rmSync(profile, { recursive: true, force: true });
	} catch {
		/* ignore */
	}
}
console.log(existsSync('qa/ref/home-1440.png') ? 'done' : 'no shots');
