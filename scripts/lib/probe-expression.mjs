/**
 * scripts/lib/probe-expression.mjs — the in-page probe.
 *
 * Runs ONCE inside the reference page and returns EVERY field a 1:1
 * recreation needs. Split into its own module so the expression can be
 * re-used by other tooling without dragging the CDP plumbing along.
 *
 * IMPORTANT — the `sections` selector is deliberately identical to the one
 * in scripts/measure-page.mjs ('main article, main > section'), so a target
 * file generated from this probe is directly comparable with the local
 * measurement.
 */
export const PROBE_EXPRESSION = `(() => {
  const px = (n) => Math.round(n);
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { x: px(r.left), y: px(r.top + window.scrollY), w: px(r.width), h: px(r.height) };
  };
  const cs = (el, ...props) => {
    const s = getComputedStyle(el);
    const o = {};
    for (const p of props) o[p] = s[p];
    return o;
  };
  const cls = (el) => (el && el.className && typeof el.className === 'string')
    ? el.className.trim().slice(0, 160) : '';

  const sections = Array.from(document.querySelectorAll('main article, main > section')).map((s) => {
    const h = s.querySelector('h1,h2,h3,h4');
    const b = box(s);
    return {
      ...b,
      headTag: h ? h.tagName : null,
      headText: h ? (h.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 90) : null,
      headSize: h ? getComputedStyle(h).fontSize : null,
      headColor: h ? getComputedStyle(h).color : null,
      headWeight: h ? getComputedStyle(h).fontWeight : null,
      bg: getComputedStyle(s).backgroundColor,
      cls: cls(s),
    };
  });

  const figures = Array.from(document.querySelectorAll('main figure')).map((f) => {
    const img = f.querySelector('img');
    const b = box(f);
    return {
      ...b,
      ratio: f.getAttribute('data-ratio'),
      aspect: getComputedStyle(f).aspectRatio,
      cls: cls(f),
      src: img ? img.getAttribute('src') : null,
      srcset: img ? img.getAttribute('srcset') : null,
      sizes: img ? img.getAttribute('sizes') : null,
      alt: img ? img.getAttribute('alt') : null,
      loading: img ? img.getAttribute('loading') : null,
      fetchpriority: img ? img.getAttribute('fetchpriority') : null,
      natural: img ? [img.naturalWidth, img.naturalHeight] : null,
      objectFit: img ? getComputedStyle(img).objectFit : null,
    };
  });

  /* Every <img> on the page, not only the ones inside <figure> — logos, card
     images and sprite-backed icons all need localising. */
  const images = Array.from(document.querySelectorAll('img')).map((im) => {
    const b = box(im);
    return {
      ...b,
      src: im.getAttribute('src'),
      srcset: im.getAttribute('srcset'),
      sizes: im.getAttribute('sizes'),
      alt: im.getAttribute('alt'),
      loading: im.getAttribute('loading'),
      natural: [im.naturalWidth, im.naturalHeight],
      objectFit: getComputedStyle(im).objectFit,
      inFigure: !!im.closest('figure'),
      cls: cls(im),
    };
  });

  /* <svg><use href="…#icon"> sprite references. */
  const spriteUses = Array.from(document.querySelectorAll('use'))
    .map((u) => u.getAttribute('href') || u.getAttribute('xlink:href'))
    .filter(Boolean);

  const grids = Array.from(document.querySelectorAll('main [class*="grid-cols"]')).map((g) => {
    const b = box(g);
    const s = cs(g, 'gridTemplateColumns', 'gap', 'rowGap', 'columnGap');
    return { ...b, cols: s.gridTemplateColumns, gap: s.gap, rowGap: s.rowGap, columnGap: s.columnGap, cls: cls(g) };
  });

  const SEL = 'h1,h2,h3,h4,h5,p,li,a,span,figcaption';
  const texts = Array.from(document.querySelectorAll('main ' + SEL)).slice(0, 600).map((e) => {
    const t = (e.textContent || '').trim();
    if (!t || t.length > 160) return null;
    const s = cs(e, 'fontSize', 'lineHeight', 'fontWeight', 'color', 'marginTop', 'marginBottom');
    const b = box(e);
    return {
      tag: e.tagName, text: t.slice(0, 160),
      fs: s.fontSize, lh: s.lineHeight, fw: s.fontWeight, color: s.color,
      mt: s.marginTop, mb: s.marginBottom,
      x: b.x, y: b.y, w: b.w, h: b.h, cls: cls(e),
    };
  }).filter(Boolean);

  const links = Array.from(document.querySelectorAll('a[href]')).slice(0, 800).map((a) => ({
    href: a.getAttribute('href'),
    text: (a.innerText || a.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 80),
    cls: cls(a),
  }));

  const buttons = Array.from(document.querySelectorAll('button, a[class*="rounded-pill"]')).slice(0, 60).map((b) => {
    const s = cs(b, 'backgroundColor', 'color', 'borderRadius', 'fontSize');
    const bb = box(b);
    return { text: (b.innerText || '').trim().replace(/\\s+/g, ' ').slice(0, 40), ...bb,
      bg: s.backgroundColor, color: s.color, radius: s.borderRadius, fontSize: s.fontSize, cls: cls(b) };
  });

  const head = (e) => {
    if (!e) return null;
    const s = cs(e, 'position', 'zIndex', 'backgroundColor', 'paddingTop', 'paddingBottom');
    const b = box(e);
    return { ...b, pos: s.position, z: s.zIndex, bg: s.backgroundColor, pt: s.paddingTop, pb: s.paddingBottom, cls: cls(e) };
  };

  return {
    url: location.href,
    title: document.title,
    description: (document.querySelector('meta[name=description]') || {}).content || null,
    canonical: (document.querySelector('link[rel=canonical]') || {}).href || null,
    viewport: { width: innerWidth, height: innerHeight },
    bodyHeight: document.body.scrollHeight,
    overflow: {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    },
    header: head(document.querySelector('header')),
    footer: head(document.querySelector('footer')),
    /* <main> 的几何：参考站的页头/页脚不在 <main> 内，但探针的 texts 选择器
     * 仍会捞到导航文案。用 main 的范围把正文与导航切开，供 ref-report 使用。 */
    main: head(document.querySelector('main')),
    sprites: Array.from(new Set(spriteUses)),
    sections, figures, images, grids, texts, links, buttons,
  };
})()`;
