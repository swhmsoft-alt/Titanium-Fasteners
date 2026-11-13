/**
 * scripts/probe.mjs — 定点探查：参考站局部 DOM + 本地溢出元素。
 *
 * 用法：
 *   node scripts/probe.mjs ref    → 参考站 News 卡 / 收益 details 的 outerHTML
 *   node scripts/probe.mjs local  → 本地溢出视口的元素清单
 *
 * 产物：docs/reference/probe-reference.html / qa/probe-local.json
 */

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const MODE = process.argv[2] ?? 'ref';

/* ───────────────────────────────────────────────────────────────────────────
   'reflocal' mode: the reference's images are `loading="lazy"` and, in a
   headless run, never enter the viewport — their boxes measure 0×0, so the
   reference renders in a state no real visitor ever sees (cards collapse to
   their text height). We therefore re-point the reference's <img> elements at
   the SAME files we already downloaded, then measure. The result is the
   reference's true, image-loaded geometry.
   ─────────────────────────────────────────────────────────────────────────── */
const LOCAL_ASSETS = JSON.parse(
	readFileSync('docs/reference/homepage-assets.json', 'utf8'),
).assets;
const normKey = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
const byKey = new Map();
for (const a of LOCAL_ASSETS) {
	const file = a.referenceUrl.split('/').pop().split('?')[0];
	byKey.set(normKey(file.replace(/\.[a-z]+$/i, '')), a.localPath);
}
byKey.set(normKey('sprite'), '/images/sprite.svg');

const REPLACE_EXPR = `(() => {
	const map = ${JSON.stringify(Object.fromEntries(byKey))};
	const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
	let n = 0;
	for (const im of document.querySelectorAll('img')) {
		const src = im.getAttribute('src') || '';
		const key = norm((src.split('/').pop() || '').split('?')[0].replace(/\\.[a-z]+$/i, ''));
		if (map[key]) { im.setAttribute('src', map[key]); im.loading = 'eager'; n++; }
	}
	return n;
})()`;

const PORT = 9335;
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

const REF_EXPR = `(() => {
  const norm = (s) => (s || '').replace(/\\s+/g, ' ').trim();
  const out = {};
  const main = document.querySelector('main');
  const articles = Array.from(main.querySelectorAll('article'));

  // News block = the article whose heading is "News".
  const news = articles.find((a) => norm(a.querySelector('h2')?.textContent) === 'News');
  if (news) {
    out.news = news.outerHTML;
    out.newsCards = Array.from(news.querySelectorAll('section')).map((s) => {
      const r = s.getBoundingClientRect();
      const imgs = Array.from(s.querySelectorAll('img')).map((im) => {
        const ir = im.getBoundingClientRect();
        const cs = getComputedStyle(im);
        return { src: im.getAttribute('src'), cls: norm(im.className), w: Math.round(ir.width), h: Math.round(ir.height), display: cs.display, pos: cs.position, complete: im.complete, naturalWidth: im.naturalWidth, currentSrc: (im.currentSrc || '').slice(-60) };
      });
      return { cls: norm(s.className), w: Math.round(r.width), h: Math.round(r.height), imgs, html: s.outerHTML };
    });
  }

  // Benefits block = the article with the light-blue background.
  const ben = articles.find((a) => getComputedStyle(a).backgroundColor === 'rgb(204, 228, 243)');
  if (ben) {
    const d = ben.querySelector('details');
    out.benefitsDetails = d ? d.outerHTML : null;
  }

  // Hero article and the first service card overlay (both need exact markup).
  if (articles[0]) out.hero = articles[0].outerHTML;
  const svc = articles.find((a) => norm(a.querySelector('h2')?.textContent).startsWith('Our Fastening'));
  if (svc) {
    const a = svc.querySelector('a');
    out.serviceCard = a ? a.outerHTML : null;
  }

  // Block geometry of every article (the block-level comparison table).
  out.articles = articles.map((a) => {
    const r = a.getBoundingClientRect();
    const h = a.querySelector('h1,h2,h3,h4');
    return {
      y: Math.round(r.top + window.scrollY),
      h: Math.round(r.height),
      w: Math.round(r.width),
      head: h ? h.tagName + ' ' + getComputedStyle(h).fontSize : null,
      title: norm(h?.textContent).slice(0, 60),
      cls: norm(a.className).slice(0, 120),
    };
  });
  const det = document.querySelector('details');
  if (det) {
    const dr = det.getBoundingClientRect();
    out.detailsRect = { y: Math.round(dr.top + window.scrollY), w: Math.round(dr.width), h: Math.round(dr.height) };
  }

  // Site footer — the reference may not use a <footer> element, so capture
  // the last containers of <body> as well.
  const bodyKids = Array.from(document.body.children);
  out.bodyTail = bodyKids.slice(-3).map((el) => {
    const er = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      cls: norm(el.className).slice(0, 160),
      y: Math.round(er.top + window.scrollY),
      h: Math.round(er.height),
      text: norm(el.textContent).slice(0, 3000),
      html: el.outerHTML.slice(0, 24000),
    };
  });
  const f = document.querySelector('footer');
  if (f) {
    const fr = f.getBoundingClientRect();
    out.footerRect = { y: Math.round(fr.top + window.scrollY), w: Math.round(fr.width), h: Math.round(fr.height) };
    out.footer = f.outerHTML;
    // Computed styles for the footer's key blocks (one shot, desktop viewport).
    const pick = (sel) => {
      const el = f.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        sel,
        tag: el.tagName.toLowerCase(),
        fs: cs.fontSize,
        fw: cs.fontWeight,
        lh: cs.lineHeight,
        color: cs.color,
        bg: cs.backgroundColor,
        pt: cs.paddingTop,
        pb: cs.paddingBottom,
        mt: cs.marginTop,
        gap: cs.gap,
        display: cs.display,
        cols: cs.gridTemplateColumns,
        borderTop: cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor,
      };
    };
    out.footerStyles = [
      'footer',
      '.container-fluid',
      'footer .container-fluid > div',
      'footer a[href="/global-en/"] svg',
      'footer nav',
      'footer nav > ul',
      'footer nav > ul > li',
      'footer nav > ul > li > span',
      'footer nav ul ul',
      'footer nav ul ul li',
      'footer nav ul ul li a',
      'footer nav ul ul li a svg',
      'footer nav ul ul li p',
      'footer section',
      'footer section ul',
      'footer section ul li',
      'footer section ul li a',
      'footer section span',
    ].map(pick);
  }
    out.footerHeadings = Array.from(f.querySelectorAll('h2,h3,h4,h5,h6')).map((h) => ({
      tag: h.tagName,
      text: norm(h.textContent).slice(0, 80),
      size: getComputedStyle(h).fontSize,
      cls: norm(h.className).slice(0, 80),
    }));
    out.footerLinks = Array.from(f.querySelectorAll('a')).map((a) => ({
      text: norm(a.textContent).slice(0, 70),
      href: a.getAttribute('href'),
    }));
    out.footerText = norm(f.textContent).slice(0, 4000);
  }
  return out;
})()`;

const LOCAL_EXPR = `(() => {
  const vw = document.documentElement.clientWidth;
  const norm = (s) => (s || '').replace(/\\s+/g, ' ').trim();
  const bad = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right > vw + 1 || r.left < -1) {
      bad.push({
        tag: el.tagName.toLowerCase(),
        cls: norm(el.className).slice(0, 120),
        left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width),
        text: norm(el.textContent).slice(0, 60),
      });
    }
  }
  return { vw, scrollWidth: document.documentElement.scrollWidth, count: bad.length, worst: bad.slice(0, 25) };
})()`;

const profile = mkdtempSync(join(tmpdir(), 'tf-probe-'));
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

	const url =
		MODE === 'local'
			? 'http://localhost:4321/'
			: 'https://www.bossard.com/global-en/';
	const expr = MODE === 'local' ? LOCAL_EXPR : REF_EXPR;

	await send('Page.navigate', { url }, sessionId);
	await sleep(4500);
	if (MODE === 'reflocal') {
		const r = await send(
			'Runtime.evaluate',
			{ returnByValue: true, expression: REPLACE_EXPR },
			sessionId,
		);
		console.log(`replaced images: ${r.result.value}`);
		await sleep(2500);
	}
	await send(
		'Runtime.evaluate',
		{
			expression:
				'window.scrollTo(0, document.body.scrollHeight); true',
		},
		sessionId,
	);
	await sleep(1500);
	// Force lazy images to load: the reference keeps `loading="lazy"`, and in a
	// headless run the deferred images never enter the viewport, so their boxes
	// measure 0×0. Real visitors do see them — so we load them explicitly.
	await send(
		'Runtime.evaluate',
		{
			expression: `(() => {
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
	await sleep(3500);
	await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0); true' }, sessionId);
	await sleep(800);

	const { result } = await send(
		'Runtime.evaluate',
		{ returnByValue: true, expression: expr },
		sessionId,
	);

	if (MODE === 'local') {
		writeFileSync('qa/probe-local.json', JSON.stringify(result.value, null, 2));
		console.log(`local overflow count=${result.value.count} scrollWidth=${result.value.scrollWidth}`);
	} else {
		writeFileSync('docs/reference/probe-reference.html', result.value.news ?? '(no news)');
		writeFileSync(
			'docs/reference/probe-hero.html', result.value.hero ?? '(no hero)',
		);
		writeFileSync(
			'docs/reference/probe-service.html', result.value.serviceCard ?? '(no service)',
		);
		writeFileSync(
			'docs/reference/probe-benefits.html', result.value.benefitsDetails ?? '(no details)',
		);
		writeFileSync(
			'docs/reference/probe-footer.html', result.value.footer ?? '(no footer)',
		);
		writeFileSync(
			'docs/reference/probe-footer.json',
			JSON.stringify(
				{
					footerRect: result.value.footerRect,
					footerHeadings: result.value.footerHeadings,
					footerLinks: result.value.footerLinks,
					footerText: result.value.footerText,
					bodyTail: result.value.bodyTail,
				},
				null,
				2,
			),
		);
		writeFileSync(
			'docs/reference/probe-reference.json',
			JSON.stringify(
				{
					newsCards: result.value.newsCards,
					benefitsDetails: result.value.benefitsDetails,
					articles: result.value.articles,
					detailsRect: result.value.detailsRect,
				},
				null,
				2,
			),
		);
		console.log(`ref news=${result.value.news?.length ?? 0} cards=${result.value.newsCards?.length ?? 0}`);
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
