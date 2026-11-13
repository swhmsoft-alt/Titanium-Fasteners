/**
 * scripts/probe-ref.mjs — ONE-SHOT reference-site probe.
 *
 * PURPOSE
 * -------
 * The single biggest source of waste in a 1:1 recreation is going BACK to
 * the reference browser over and over to collect fields one at a time. This
 * script opens the reference page ONCE and dumps EVERYTHING a recreation
 * needs into a single UTF-8 JSON file:
 *
 *   sections  — block geometry + heading metrics
 *   figures   — image boxes, ratios, src/srcset/sizes/alt
 *   grids     — grid-template-columns / gap / width
 *   texts     — every heading/paragraph/list/link with type metrics
 *   links     — every anchor href + label
 *   buttons   — pill buttons with metrics
 *   header/footer/body metrics
 *
 * Usage
 * -----
 *   node scripts/probe-ref.mjs <url> [--out qa/ref/<page>.json]
 *                                 [--viewport 1440x1000]
 *                                 [--html qa/ref/<page>.html]   [--no-html]
 *
 * ZERO dependencies: it drives the locally installed Google Chrome over the
 * DevTools Protocol using Node's built-in WebSocket (Node >= 22).
 *
 * The output is written with fs.writeFileSync(..., 'utf8') — never through a
 * shell redirect, because PowerShell's `>` writes UTF-16 and the log then has
 * to be transcoded before it can be read (a real, measured waste).
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { PROBE_EXPRESSION } from './lib/probe-expression.mjs';

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith('--'));
if (!url) {
	console.error(
		'usage: node scripts/probe-ref.mjs <url> [--out f] [--viewport WxH] [--html f] [--no-html]',
	);
	process.exit(1);
}
const flag = (name, fallback) => {
	const i = args.indexOf(name);
	return i >= 0 ? args[i + 1] : fallback;
};
const OUT = flag('--out', 'qa/ref/page.json');
/* The raw HTML of the reference page is the single most valuable artefact of
   the whole pipeline: it makes copy, DOM structure, class names and sprite
   references searchable offline, so the browser never has to be re-opened.
   Default: same folder/basename as --out, .html extension. */
const HTML_OUT = args.includes('--no-html')
	? null
	: flag('--html', OUT.replace(/\.json$/i, '.html'));
const [vw, vh] = (flag('--viewport', '1440x1000')).split('x').map(Number);

const CHROME_PATHS = [
	'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'/usr/bin/google-chromium',
	'/usr/bin/google-chrome',
];
const findChrome = () => {
	for (const p of CHROME_PATHS) if (existsSync(p)) return p;
	throw new Error('Google Chrome not found.');
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url_, attempts = 30) {
	for (let i = 0; i < attempts; i++) {
		try {
			const res = await fetch(url_);
			if (res.ok) return await res.json();
		} catch {
			/* retry */
		}
		await sleep(300);
	}
	throw new Error(`CDP endpoint not reachable: ${url_}`);
}

/* Port 0 = "pick any free port". The chosen port is read back from the
   DevToolsActivePort file Chrome writes into the profile directory.
   A hard-coded port breaks the moment a stale Chrome still holds it — which
   is exactly what happens when a run is interrupted — and the probe then
   hangs instead of failing fast. */
const profile = mkdtempSync(join(tmpdir(), 'tf-probe-'));
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
	await send('Network.enable', {}, sessionId);
	await send('Network.setCacheDisabled', { cacheDisabled: true }, sessionId);
	await send(
		'Emulation.setDeviceMetricsOverride',
		{ width: vw, height: vh, deviceScaleFactor: 1, mobile: vw < 768 },
		sessionId,
	);

	await send('Page.navigate', { url }, sessionId);
	await sleep(2600);

	/* Force lazy images to load so their boxes are measurable, then return to
	   the top so every y coordinate is a document coordinate. */
	await send(
		'Runtime.evaluate',
		{
			expression: `(() => {
        for (const im of document.querySelectorAll('img[loading="lazy"]')) {
          im.loading = 'eager';
          const s = im.getAttribute('src'); if (s) im.setAttribute('src', s);
        }
        return true;
      })()`,
		},
		sessionId,
	);
	await sleep(2200);
	await send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight); true' }, sessionId);
	await sleep(1200);
	await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0); true' }, sessionId);
	await sleep(700);

	const { result } = await send(
		'Runtime.evaluate',
		{ returnByValue: true, expression: PROBE_EXPRESSION },
		sessionId,
	);
	const data = result.value;

	if (HTML_OUT) {
		const { result: html } = await send(
			'Runtime.evaluate',
			{ returnByValue: true, expression: 'document.documentElement.outerHTML' },
			sessionId,
		);
		mkdirSync(dirname(HTML_OUT), { recursive: true });
		writeFileSync(HTML_OUT, html.value, 'utf8');
	}

	mkdirSync(dirname(OUT), { recursive: true });
	writeFileSync(OUT, JSON.stringify(data, null, '\t'), 'utf8');

	console.log(`probed ${data.url}`);
	console.log(`  title      ${data.title}`);
	console.log(`  body       ${data.bodyHeight}px   overflow ${data.overflow.scrollWidth - data.overflow.clientWidth}px`);
	console.log(`  sections   ${data.sections.length}`);
	console.log(`  figures    ${data.figures.length}`);
	console.log(`  images     ${data.images.length}`);
	console.log(`  sprites    ${data.sprites.length}`);
	console.log(`  grids      ${data.grids.length}`);
	console.log(`  texts      ${data.texts.length}`);
	console.log(`  links      ${data.links.length}`);
	console.log(`  -> ${OUT}`);
	if (HTML_OUT) console.log(`  -> ${HTML_OUT}`);

	ws.close();
} finally {
	chrome.kill();
	try {
		rmSync(profile, { recursive: true, force: true });
	} catch {
		/* ignore */
	}
}

