/**
 * scripts/probe-nav-panels.mjs — 实测参考站 5 个顶级下拉面板（结构化）。
 *
 * 目的：Phase A 要「逐字照抄」导航，就必须先把参考站 5 个顶级面板的
 * **列 → 分组标题 → 链接（文本 + href）** 结构与几何实测出来，
 * 而不是靠肉眼读截图或手写推测。
 *
 * 做法：CDP 打开 https://www.bossard.com/global-en/ → 真实 hover（必要时 click）
 * 每个顶级项 → 在页面内用 computed style + getBoundingClientRect 导出：
 *   · 候选面板列表（用于校验选中的确实是下拉面板，而非 header 容器）
 *   · 面板几何（x/y/w/h/背景/阴影）
 *   · 栅格列 → 列内分组标题 → 链接（文本、href、字号、字重、颜色）
 *   · 面板内图片（feature card 配图）
 *   · 面板 outerHTML（落盘供结构复核）
 *
 * 产物：
 *   qa/ref/nav-panels.json        ← 结构化实测结果（数据源）
 *   qa/ref/nav-panel-<slug>.html  ← 每个面板的 outerHTML
 *   qa/ref/nav-<slug>.png         ← 每个面板的截图
 *
 * 用法：node scripts/probe-nav-panels.mjs [url]
 */
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL = process.argv[2] ?? 'https://www.bossard.com/global-en/';
const PORT = 9337;
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const TOP_LABELS = [
	'Product Solutions',
	'Services',
	'Industries',
	'Knowledge Hub',
	'About us',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, attempts = 80) {
	for (let i = 0; i < attempts; i++) {
		try {
			const res = await fetch(url);
			if (res.ok) return await res.json();
		} catch {
			/* retry */
		}
		await sleep(300);
	}
	throw new Error('CDP not reachable: ' + url);
}

/** Locate the five top-level triggers (reference renders them as <button>). */
const FIND_TRIGGERS = `(() => {
  const norm = (s) => (s || '').replace(/\\s+/g, ' ').trim();
  const want = ${JSON.stringify(TOP_LABELS)};
  const out = [];
  for (const el of document.querySelectorAll('button, a')) {
    const t = norm(el.textContent);
    if (!want.includes(t)) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.top < 60 || r.top > 220) continue;
    out.push({
      label: t,
      tag: el.tagName.toLowerCase(),
      href: el.getAttribute('href'),
      cx: Math.round(r.left + r.width / 2),
      cy: Math.round(r.top + r.height / 2),
      fs: getComputedStyle(el).fontSize,
      fw: getComputedStyle(el).fontWeight,
    });
  }
  return out;
})()`;


/**
 * Structured dump of the currently visible dropdown panel.
 * Runs entirely in the page so all values are computed, not guessed.
 */
const DUMP = `(() => {
  const norm = (s) => (typeof s === 'string' ? s : (s && s.baseVal !== undefined ? s.baseVal : (s == null ? '' : String(s)))).replace(/\\s+/g, ' ').trim();
  const cs = (el) => getComputedStyle(el);
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const c = cs(el);
    return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none' && c.opacity !== '0';
  };
  const want = ${JSON.stringify(TOP_LABELS)};
  let trigger = null;
  for (const el of document.querySelectorAll('button, a')) {
    if (want.includes(norm(el.textContent)) && visible(el)) { trigger = el; break; }
  }

  // ── candidate panels: fixed/absolute, full width, link-rich ─────────────
  const cands = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue;
    const c = cs(el);
    if (c.position !== 'fixed' && c.position !== 'absolute') continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1000) continue;
    const links = el.querySelectorAll('a').length;
    if (links < 5) continue;
    cands.push({
      tag: el.tagName.toLowerCase(),
      cls: norm(el.className).slice(0, 140),
      pos: c.position,
      z: c.zIndex,
      bg: c.backgroundColor,
      shadow: c.boxShadow.slice(0, 70),
      links,
      holdsTrigger: trigger ? el.contains(trigger) : false,
      ...box(el),
    });
  }
  cands.sort((a, b) => b.links - a.links);

  // The dropdown panel is NOT an ancestor of its own trigger (the header
  // wrapper is). Prefer the richest non-ancestor candidate.
  const panel = cands.find((c) => !c.holdsTrigger) || null;
  if (!panel) return { ok: false, reason: 'no-panel', cands: cands.slice(0, 8) };

  let panelEl = null;
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue;
    const c = cs(el);
    if (c.position !== 'fixed' && c.position !== 'absolute') continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1000) continue;
    if (el.querySelectorAll('a').length < 5) continue;
    if (trigger && el.contains(trigger)) continue;
    panelEl = el;
    break;
  }
  if (!panelEl) return { ok: false, reason: 'no-panel-el', cands: cands.slice(0, 8) };

  // ── locate the column grid inside the panel ─────────────────────────────
  let grid = null;
  let gridTracks = 0;
  let gridLinks = 0;
  for (const el of panelEl.querySelectorAll('*')) {
    if (!visible(el)) continue;
    const c = cs(el);
    if (c.display !== 'grid' && c.display !== 'inline-grid') continue;
    const tracks = c.gridTemplateColumns.split(' ').filter(Boolean).length;
    const links = el.querySelectorAll('a').length;
    if (tracks >= 2 && links > gridLinks) { grid = el; gridTracks = tracks; gridLinks = links; }
  }

  const columnEls = grid
    ? Array.from(grid.children).filter((el) => visible(el) && el.getBoundingClientRect().width > 0)
    : [];

  const collect = (root) => {
    const nodes = [];
    const walk = (el, depth) => {
      for (const ch of el.children) {
        const tag = ch.tagName.toLowerCase();
        if (['script','style','noscript','svg','path','use','defs','symbol'].includes(tag)) continue;
        if (!visible(ch)) continue;
        const c = cs(ch);
        const txt = norm(ch.textContent);
        const isLink = tag === 'a';
        const isH = /^h[1-6]$/.test(tag);
        const isBoldLeaf = !isLink && !isH && ch.children.length === 0 &&
          parseInt(c.fontWeight, 10) >= 700 && txt.length > 0 && txt.length <= 90;
        if (isLink || isH || isBoldLeaf) {
          nodes.push({
            depth,
            kind: isLink ? 'link' : (isH ? 'h' : 'bold'),
            text: txt.slice(0, 140),
            href: isLink ? ch.getAttribute('href') : null,
            target: isLink ? ch.getAttribute('target') : null,
            fs: c.fontSize,
            fw: c.fontWeight,
            color: c.color,
            lh: c.lineHeight,
            mt: c.marginTop,
            mb: c.marginBottom,
            cls: norm(ch.className).slice(0, 120),
            ...box(ch),
          });
        }
        if (!isLink) walk(ch, depth + 1);
      }
    };
    walk(root, 0);
    return nodes;
  };

  const columns = columnEls.map((col, i) => {
    const nodes = collect(col);
    const groups = [];
    let cur = null;
    for (const n of nodes) {
      if (n.kind === 'link') {
        if (!cur) { cur = { heading: null, headingStyle: null, items: [] }; groups.push(cur); }
        cur.items.push(n);
      } else {
        cur = { heading: n.text, headingStyle: { fs: n.fs, fw: n.fw, color: n.color }, items: [] };
        groups.push(cur);
      }
    }
    return { index: i, ...box(col), groups };
  });

  const images = Array.from(panelEl.querySelectorAll('img')).filter((el) => visible(el)).map((el) => ({
    src: el.getAttribute('src'),
    alt: el.getAttribute('alt'),
    ...box(el),
  }));

  const allNodes = collect(panelEl);

  // ── "Go to X" lead link — sibling of the column grid ──────────────────
  const goToEl = panelEl.querySelector('a[data-analytics-navi-item-type="go-to-link"]');
  const goTo = goToEl
    ? (() => {
        const c = cs(goToEl);
        const svg = goToEl.querySelector('svg');
        return {
          text: norm(goToEl.textContent),
          href: goToEl.getAttribute('href'),
          fs: c.fontSize,
          fw: c.fontWeight,
          color: c.color,
          mt: c.marginTop,
          cls: norm(goToEl.className).slice(0, 120),
          svg: svg ? { w: Math.round(svg.getBoundingClientRect().width), h: Math.round(svg.getBoundingClientRect().height), cls: norm(svg.className).slice(0, 80) } : null,
          ...box(goToEl),
        };
      })()
    : null;

  // ── the fixed header bar the panel hangs below ────────────────────────
  let headerBox = null;
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue;
    const c = cs(el);
    if (c.position !== 'fixed') continue;
    if (trigger && el.contains(trigger)) {
      headerBox = { cls: norm(el.className).slice(0, 120), ...box(el) };
      break;
    }
  }

  // ── grid / column / list metrics ─────────────────────────────────────
  const gridStyle = grid
    ? { cols: cs(grid).gridTemplateColumns, gap: cs(grid).gap, cls: norm(grid.className).slice(0, 120) }
    : null;
  const containerEl = grid ? grid.parentElement : null;
  const containerStyle = containerEl
    ? {
        cls: norm(containerEl.className).slice(0, 140),
        display: cs(containerEl).display,
        flexDirection: cs(containerEl).flexDirection,
        padding: cs(containerEl).padding,
        ...box(containerEl),
      }
    : null;
  const colStyle = columnEls[0]
    ? { gap: cs(columnEls[0]).gap, cls: norm(columnEls[0].className).slice(0, 120), ...box(columnEls[0]) }
    : null;
  const l3List = panelEl.querySelector('ul.mt-24');
  const l3ListStyle = l3List ? { mt: cs(l3List).marginTop, cls: norm(l3List.className).slice(0, 80) } : null;
  const l3Item = panelEl.querySelector('li.mt-16');
  const l3ItemStyle = l3Item
    ? { mt: cs(l3Item).marginTop, fs: cs(l3Item).fontSize, color: cs(l3Item).color, cls: norm(l3Item.className).slice(0, 90) }
    : null;

  return {
    ok: true,
    goTo,
    headerBox,
    gridStyle,
    containerStyle,
    colStyle,
    l3ListStyle,
    l3ItemStyle,
    panel: {
      tag: panelEl.tagName.toLowerCase(),
      cls: norm(panelEl.className).slice(0, 140),
      pos: cs(panelEl).position,
      bg: cs(panelEl).backgroundColor,
      shadow: cs(panelEl).boxShadow.slice(0, 70),
      ...box(panelEl),
    },
    grid: grid ? { tracks: gridTracks, links: gridLinks, cls: norm(grid.className).slice(0, 140) } : null,
    columns,
    images,
    looseLinks: allNodes.filter((n) => n.kind === 'link').length,
    cands: cands.slice(0, 8),
    html: panelEl.outerHTML.slice(0, 400000),
  };
})()`;



const profile = mkdtempSync(join(tmpdir(), 'tf-nav2-'));
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
		'--lang=en-US',
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
	await sleep(9000);

	const evalInPage = async (expression) => {
		const { result, exceptionDetails } = await send(
			'Runtime.evaluate',
			{ returnByValue: true, awaitPromise: true, expression },
			sessionId,
		);
		if (exceptionDetails) {
			throw new Error(exceptionDetails.text + ' ' + (exceptionDetails.exception?.description ?? ''));
		}
		return result.value;
	};

	const triggers = await evalInPage(FIND_TRIGGERS);
	console.log('triggers:', JSON.stringify(triggers));
	if (!triggers || triggers.length === 0) throw new Error('no top-level triggers found');

	const results = {};
	let prevFingerprint = '';
	for (const label of TOP_LABELS) {
		const t = triggers.find((x) => x.label === label);
		if (!t) {
			results[label] = { ok: false, reason: 'trigger-not-found' };
			continue;
		}
		// Park the pointer ABOVE the panel (y=60 is above the panel top y=195)
		// and away from every trigger, so the open menu actually closes.
		await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 6, y: 60, buttons: 0 }, sessionId);
		await sleep(500);
		await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }, sessionId);
		await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }, sessionId);
		await sleep(500);

		// The reference opens the mega menu on CLICK of the top-level button.
		await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: t.cx, y: t.cy, buttons: 0 }, sessionId);
		await sleep(200);
		await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: t.cx, y: t.cy, button: 'left', clickCount: 1 }, sessionId);
		await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: t.cx, y: t.cy, button: 'left', clickCount: 1 }, sessionId);
		await sleep(1500);

		let data = await evalInPage(DUMP);
		// Fingerprint = the panel's own first link. If it matches the previous
		// label's panel, the menu did not switch → close and click again.
		const fp = data?.ok ? (data.columns[0]?.groups[0]?.items[0]?.href ?? '') : '';
		if (!data?.ok || (prevFingerprint && fp === prevFingerprint)) {
			await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 6, y: 60, buttons: 0 }, sessionId);
			await sleep(400);
			await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: t.cx, y: t.cy, button: 'left', clickCount: 1 }, sessionId);
			await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: t.cx, y: t.cy, button: 'left', clickCount: 1 }, sessionId);
			await sleep(1800);
			data = await evalInPage(DUMP);
		}

		if (data?.ok) {
			const slug = label.toLowerCase().replace(/\s+/g, '-');
			writeFileSync(`qa/ref/nav-panel-${slug}.html`, data.html);
			delete data.html;
			const shot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
			writeFileSync(`qa/ref/nav-${slug}.png`, Buffer.from(shot.data, 'base64'));
			const fp2 = data.columns[0]?.groups[0]?.items[0]?.href ?? '';
			prevFingerprint = fp2;
			console.log(
				`captured ${label}: panel ${data.panel.w}x${data.panel.h} @y${data.panel.y} | cols ${data.columns.length} | links ${data.looseLinks} | fp=${fp2}`,
			);
		} else {
			console.log(`FAILED ${label}:`, JSON.stringify(data).slice(0, 300));
		}
		results[label] = data;
		await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 6, y: 60, buttons: 0 }, sessionId);
		await sleep(600);
	}

	results.__meta = { url: URL, viewport: '1440x1000', capturedAt: new Date().toISOString() };
	writeFileSync('qa/ref/nav-panels.json', JSON.stringify(results, null, 2));
	console.log('written qa/ref/nav-panels.json');
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
