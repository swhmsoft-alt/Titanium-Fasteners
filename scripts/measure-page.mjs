/**
 * scripts/measure-page.mjs — headless measurement of a built page.
 *
 * Reproduces the reference site's measurement procedure locally so the
 * numbers can be compared against the measured reference targets recorded
 * in docs/reference/. One command, one table, no browser in the loop.
 *
 * Usage:
 *   node scripts/measure-page.mjs <route> [--target <file>] [--viewport 1440x1000]
 *
 *   <route>      e.g. "/"  or  "/products/bolts/"
 *   --target     JSON file with the reference targets for this page type.
 *                Omit to measure only (no comparison table).
 *   --viewport   "WxH" (default 1440x1000). Use 390x844 for mobile.
 *
 * ZERO DEPENDENCIES: it drives the locally installed Google Chrome over
 * the DevTools Protocol (CDP) using Node's built-in WebSocket (Node >= 22).
 */

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const route = args.find((a) => !a.startsWith('--') && !a.startsWith('http')) ?? '/';
const targetFlag = args.indexOf('--target');
const targetFile = targetFlag >= 0 ? args[targetFlag + 1] : null;
const vpFlag = args.indexOf('--viewport');
const urlFlag = args.indexOf('--url');
const [vw, vh] = (vpFlag >= 0 ? args[vpFlag + 1] : '1440x1000')
	.split('x')
	.map(Number);
/** Base URL — override with --url to measure the REFERENCE site itself. */
const BASE = (
	urlFlag >= 0 ? args[urlFlag + 1] : (process.env.BASE_URL ?? 'http://localhost:4321')
).replace(/\/+$/, '');
// The DevTools port is not fixed: Chrome picks a free one and we read it back
// from the profile's DevToolsActivePort file (see readDevToolsPort below).

const CHROME_PATHS = [
	'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'/usr/bin/google-chrome',
];

function findChrome() {
	for (const p of CHROME_PATHS) if (existsSync(p)) return p;
	throw new Error('Google Chrome not found.');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, attempts = 30) {
	for (let i = 0; i < attempts; i++) {
		try {
			const res = await fetch(url);
			if (res.ok) return await res.json();
		} catch {
			/* retry */
		}
		await sleep(300);
	}
	throw new Error(`CDP endpoint not reachable: ${url}`);
}

/**
 * Runs inside the page. Captures every dimension the visual QA compares:
 * section geometry, heading scale, image ratios, card sizes, button metrics,
 * grid columns and overflow.
 */
const MEASURE_EXPRESSION = `(() => {
  const px = (n) => Math.round(n);
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { w: px(r.width), h: px(r.height), x: px(r.left), y: px(r.top + window.scrollY) };
  };

  const sections = Array.from(document.querySelectorAll('main article, main > section')).map((s) => {
    const h = s.querySelector('h1,h2,h3');
    const cs = h ? getComputedStyle(h) : null;
    const r = s.getBoundingClientRect();
    return {
      y: px(r.top + window.scrollY),
      h: px(r.height),
      w: px(r.width),
      headTag: h ? h.tagName : null,
      headSize: cs ? cs.fontSize : null,
      headColor: cs ? cs.color : null,
      headWeight: cs ? cs.fontWeight : null,
      bg: getComputedStyle(s).backgroundColor,
    };
  });

  const broken = Array.from(document.querySelectorAll('img'))
    .filter((i) => i.complete && i.naturalWidth === 0)
    .map((i) => i.getAttribute('src'));

  const collapsed = Array.from(document.querySelectorAll('main figure'))
    .filter((f) => f.getBoundingClientRect().height === 0).length;

  const images = Array.from(document.querySelectorAll('main figure')).map((f) => {
    const b = box(f);
    return {
      ratio: f.getAttribute('data-ratio'),
      rendered: b.h ? +(b.w / b.h).toFixed(3) : null,
      w: b.w, h: b.h,
    };
  });

  const buttons = Array.from(
    document.querySelectorAll('main a[class*="rounded-pill"], main button[class*="rounded-pill"]'),
  )
    .slice(0, 12)
    .map((b) => {
      const cs = getComputedStyle(b);
      const bb = box(b);
      return {
        text: b.textContent.trim().slice(0, 26),
        w: bb.w, h: bb.h,
        bg: cs.backgroundColor, color: cs.color,
        radius: cs.borderRadius, fontSize: cs.fontSize,
      };
    });

  const grids = Array.from(document.querySelectorAll('main [class*="grid-cols"]'))
    .slice(0, 12)
    .map((g) => {
      const cs = getComputedStyle(g);
      const bb = box(g);
      return { cols: cs.gridTemplateColumns, gap: cs.gap, w: bb.w };
    });

  const header = document.querySelector('header');
  const headerBox = header ? box(header) : null;
  const hs = header ? getComputedStyle(header) : null;

  return {
    sections, broken, collapsed, images, buttons, grids,
    header: headerBox ? {
      ...headerBox,
      pos: hs.position,
      z: hs.zIndex,
      bg: hs.backgroundColor,
    } : null,
    mainCount: document.querySelectorAll('main').length,
    overflow: {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    },
    bodyHeight: document.body.scrollHeight,
  };
})()`;

/* Port 0 = "pick any free port"; the chosen one is read back from Chrome's
   DevToolsActivePort file. A hard-coded port silently attaches to a stale
   Chrome left over from an interrupted run, which hangs instead of failing. */
const profile = mkdtempSync(join(tmpdir(), 'tf-chrome-'));
const chrome = spawn(
	findChrome(),
	[
		'--headless=new',
		'--remote-debugging-port=0',
		`--user-data-dir=${profile}`,
		`--window-size=${vw},${vh}`,
		'--no-first-run',
		'--no-default-browser-check',
		'--disable-gpu',
		'about:blank',
	],
	{ stdio: 'ignore' },
);

/** Read the DevTools port Chrome picked for us. */
async function readDevToolsPort() {
	const file = join(profile, 'DevToolsActivePort');
	for (let i = 0; i < 100; i++) {
		if (existsSync(file)) {
			const port = Number(readFileSync(file, 'utf8').split('\n')[0].trim());
			if (port > 0) return port;
		}
		await sleep(100);
	}
	throw new Error('Chrome did not report a DevTools port.');
}

let ws;
let nextId = 1;
const pending = new Map();

try {
	const PORT = await readDevToolsPort();
	const version = await fetchJson(`http://127.0.0.1:${PORT}/json/version`);
	ws = new WebSocket(version.webSocketDebuggerUrl);

	await new Promise((resolve, reject) => {
		ws.addEventListener('open', resolve, { once: true });
		ws.addEventListener('error', reject, { once: true });
	});

	ws.addEventListener('message', (event) => {
		const msg = JSON.parse(event.data);
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
	// Never serve a cached document: the preview server keeps long-lived
	// assets around and would otherwise report the PREVIOUS build's geometry.
	await send('Network.enable', {}, sessionId);
	await send('Network.setCacheDisabled', { cacheDisabled: true }, sessionId);
	await send(
		'Emulation.setDeviceMetricsOverride',
		{ width: vw, height: vh, deviceScaleFactor: 1, mobile: vw < 768 },
		sessionId,
	);

	await send('Page.navigate', { url: `${BASE}${route}` }, sessionId);
	await sleep(2200);

	// ── Image loading ──────────────────────────────────────────────────────
	// The reference marks its images `loading="lazy"`, so in a headless run
	// they never enter the viewport and their boxes measure 0×0 — a state no
	// visitor ever sees. Force every image to load so both sides of the
	// comparison are measured in the same, real state.
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
	await sleep(2500);
	await send(
		'Runtime.evaluate',
		{
			expression:
				'window.scrollTo({top:document.body.scrollHeight,left:0,behavior:"instant"}); true',
		},
		sessionId,
	);
	await sleep(1200);
	await send(
		'Runtime.evaluate',
		{ expression: 'window.scrollTo({top:0,left:0,behavior:"instant"}); true' },
		sessionId,
	);
	await sleep(600);
	/* The document uses scroll-behavior: smooth, so the reset above animates
	   and can still be in flight when the measurement runs. Force it and
	   verify: a leftover scroll offset shifts every hidden element
	   (display:none has no box, so its y collapses to the scroll offset). */
	await send(
		'Runtime.evaluate',
		{
			expression:
				'document.documentElement.style.scrollBehavior="auto";' +
				'window.scrollTo(0,0);' +
				'document.documentElement.style.scrollBehavior="";' +
				'window.scrollY',
		},
		sessionId,
	);

	const { result } = await send(
		'Runtime.evaluate',
		{ returnByValue: true, expression: MEASURE_EXPRESSION },
		sessionId,
	);

	const data = result.value;

	console.log(`=== ${route}  @ ${vw}x${vh} ===`);
	console.log(`body height ${data.bodyHeight}   main landmarks ${data.mainCount}`);

	const hdr = data.header;
	console.log(
		`header: y=${hdr?.y} h=${hdr?.h} pos=${hdr?.pos} z=${hdr?.z}` +
			(hdr?.h === 91 && hdr?.pos === 'fixed' ? '  [ok]' : '  [MISMATCH]'),
	);

	if (data.broken.length)
		console.log(`BROKEN IMAGES (${data.broken.length}): ${data.broken.join(', ')}`);
	if (data.collapsed) console.log(`COLLAPSED FIGURES: ${data.collapsed}`);
	const ovf = data.overflow.scrollWidth - data.overflow.clientWidth;
	console.log(`h-overflow: ${ovf}${ovf ? '  [MISMATCH]' : '  [ok]'}`);

	if (!targetFile) {
		console.log('\nsections:');
		for (const [i, s] of data.sections.entries()) {
			console.log(
				`  ${i}  y=${String(s.y).padStart(5)} h=${String(s.h).padStart(5)}  ` +
					`${s.headTag} ${s.headSize} ${s.headColor}`,
			);
		}
		console.log('\nimages:');
		for (const im of data.images) {
			const bad =
				im.rendered && im.ratio && Math.abs(im.rendered - Number(im.ratio)) > 0.02;
			console.log(
				`  ratio=${im.ratio} rendered=${im.rendered}  ${im.w}x${im.h}` +
					(bad ? '  [RATIO MISMATCH]' : ''),
			);
		}
		console.log('\nbuttons:');
		for (const b of data.buttons) {
			console.log(
				`  "${b.text}" ${b.w}x${b.h} r=${b.radius} ${b.fontSize} ${b.bg}`,
			);
		}
		console.log('\ngrids:');
		for (const g of data.grids) {
			console.log(`  cols=${g.cols} gap=${g.gap} w=${g.w}`);
		}
	} else {
		const targets = JSON.parse(readFileSync(targetFile, 'utf8'));
		const rows = targets.sections ?? [];
		console.log('\nblock              local y/h      ref y/h       dy     dh   heading');
		let p0 = 0;
		let p1 = 0;

		/* Constant vertical offset.
		 *
		 * The reference and the local build differ by a fixed amount at the
		 * top of the page (the reference reserves a large blank strip above
		 * its first block; the local build offsets <main> to clear the fixed
		 * header instead). That offset is NOT a layout error — it shifts
		 * every block by the same amount. Detect it automatically: when all
		 * blocks share one dy (spread ≤ 8px), subtract it and judge the
		 * residual instead. `dh` always stays the primary judgement column.
		 */
		const dys = [];
		for (const [i, ref] of rows.entries()) {
			const s = data.sections[i];
			/* Hidden blocks (display:none - the lightbox bodies) have no box:
			   their measured y collapses to the scroll offset, so they must
			   not take part in the constant offset detection. */
			if (!s || (ref.y === 0 && ref.h === 0)) continue;
			dys.push(s.y - ref.y);
		}
		let dyOffset = 0;
		if (dys.length) {
			const sorted = [...dys].sort((a, b) => a - b);
			const mid = sorted[Math.floor(sorted.length / 2)];
			const spread = sorted[sorted.length - 1] - sorted[0];
			if (spread <= 8 && mid !== 0) dyOffset = mid;
		}

		for (const [i, ref] of rows.entries()) {
			const s = data.sections[i];
			if (!s) {
				console.log(`${String(ref.block).padEnd(18)} MISSING`);
				p0++;
				continue;
			}
			const dyRaw = s.y - ref.y;
			const dy = dyRaw - dyOffset;
			const dh = s.h - ref.h;
			const headOk =
				!ref.headSize || !s.headSize || s.headSize === ref.headSize;
			const severe = Math.abs(dh) > 40 || !headOk;
			const minor = Math.abs(dh) > 8 || Math.abs(dy) > 40;
			if (severe) p0++;
			else if (minor) p1++;
			console.log(
				`${String(ref.block).padEnd(18)} ${String(s.y).padStart(5)}/${String(s.h).padEnd(5)}` +
					`  ${String(ref.y).padStart(5)}/${String(ref.h).padEnd(5)}` +
					`  ${String(dy).padStart(5)} ${String(dh).padStart(6)}  ` +
					`${s.headTag} ${s.headSize}${headOk ? '' : ' [SIZE MISMATCH]'}` +
					`${severe ? '  <<' : minor ? '  <' : ''}`,
			);
		}
		if (dyOffset) console.log(`\nconstant dy offset ${dyOffset}px subtracted (see target notes)`);
		console.log(`\nP0 (severe): ${p0}   P1 (minor): ${p1}`);
	}

	ws.close();
} finally {
	chrome.kill();
	try {
		rmSync(profile, { recursive: true, force: true });
	} catch {
		/* ignore */
	}
}
