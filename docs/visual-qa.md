# Visual QA log

Every entry records one measured page: the reference URL, the local route, the
measure command and the block-level comparison against `qa/targets/<page>.json`.

## product-272 — product detail page (BN 272)

- Reference: `https://www.bossard.com/global-en/eshop/screws-and-bolts-with-internal-drive/hex-socket-head-cap-screws-fully-threaded/p/272/` (probed 2026-11, 1440×1000)
- Local: `http://localhost:4321/global-en/eshop/screws-and-bolts-with-internal-drive/hex-socket-head-cap-screws-fully-threaded/p/272/`
- Command: `npm run measure -- /global-en/eshop/screws-and-bolts-with-internal-drive/hex-socket-head-cap-screws-fully-threaded/p/272/ --target qa/targets/product-272.json`
- Result: **P0 (severe) 0 · P1 (minor) 0**

| block | local y/h | ref y/h | dy | dh |
| --- | --- | --- | --- | --- |
| 1 empty container | 0/0 | 0/0 | 0 | 0 |
| 2 Variants | 912/1536 | 912/1534 | 0 | +2 |
| 3 BN 20238 | 2556/381 | 2554/381 | +2 | 0 |
| 4 BN 3 | 2556/352 | 2554/353 | +2 | -1 |
| 5 BN 5264 | 2556/352 | 2554/353 | +2 | -1 |
| 6 BN 20240 | 2556/381 | 2554/381 | +2 | 0 |
| 7 BN 4 | 2556/352 | 2554/353 | +2 | -1 |

Chrome/CDP facts: `header y=95 h=91 pos=fixed z=200 [ok]`, `h-overflow 0 [ok]`,
`main landmarks 1`, body height 3700 (reference 3632).

### DOM contract learned from this page

The acceptance probe samples `main article, main > section`, so the reference's
DOM shape is part of the contract:

- The hero is **not** a `main > section` — it is a plain `div`, and the 195px
  top strip lives on that div (the reference's `<main>` has no top padding).
- The reference's first `main > section` is an **empty** `container-fluid`
  (y=0, h=0). The local page reproduces it as
  `<section class="container-fluid"></section>`; the reference's `h-svh` class
  has no measurable effect, so it is left out to keep the box at h=0.
- The "Variants" block **contains** the CAD accordion (`<details
  id="cad-accordion">`) — the reference nests it inside the variants section,
  which is why that section is 1534px tall.
- Each "Alternative products" card is an `<article>` holding one `<a>`; the
  heading lives in an `<h3>` inside it, and the rail uses `items-start` so the
  cards keep their own heights (381px when the material wraps to two lines,
  353px otherwise).

### Known remaining delta

The shared `SiteFooter` renders 609px tall against the reference's 517px
(pre-existing shared component, outside this page's block set), which accounts
for the remaining +68px of body height.

### Fixes after the first review

| finding | root cause | fix |
| --- | --- | --- |
| Breadcrumb invisible | The reference's `opacity-1` means "fully opaque", but in Tailwind v4 a bare `opacity-1` is **1%** — the nav rendered at `opacity: 0.01` | `opacity-100` in `ProductHero.astro` |
| Attribute names missing | The reference ships its features as a name → value map (`Headform`, `Drive`, `Thread`, `Material`, `Surface`, `Property class`); only the values had been copied | `src/data/product-272.ts` now stores `{ label, value }`; the label sits in the 244px column left of the value so the values stay on the reference's x=868 anchor |
| `Article No.` / `d1` / `L` headers | The block was a plain heading with bare inputs; the reference renders an **open accordion** (`<details>` + blue-light border + 24px padding) whose header cells carry a magnifier (Article No.) and chevrons (d1, L), with the note on a soft-blue panel | `VariantsTable.astro` rebuilt to the reference's markup; the CAD accordion stays nested inside the block |

The reference's "Standard" row (`DIN 912 (Standard withdrawn) ISO 4762 ~UNI 5931
~ČSN 021143`) lives in its separate product-features table, not in the hero —
adding it to the hero would push the action buttons away from their measured
y=781 anchor, so it is not rendered there.

Re-measured after the fixes: **P0 (severe) 0 · P1 (minor) 0**, block 2 = 912/1537
(ref 912/1534), cards 2557 with 381/352/352/381/352, body height 3701.

Note: the category page (`src/pages/global-en/eshop/products/.../c/01.100.astro`)
carries the same `opacity-1` breadcrumb class and therefore the same invisible
breadcrumb — a one-word fix in that file, left untouched here (out of scope).
---

## Reference measurements archive

Moved out of `HANDOFF.md` on 2026-11-06 to keep the per-session read small.
Everything here is measured from the reference site — **do not re-measure**.

### Key measured conclusions (14)

| # | Conclusion | Impact |
| ---: | --- | --- |
| 1 | The reference site and this project both run **Astro + Tailwind v4** | utility classes map 1:1 |
| 2 | Reference `--spacing` is **1px**, not the default 4px | every gap inflates 4× if missed |
| 3 | Breakpoints are **360/600/840/1024/1280/1440**, not Tailwind defaults | `md:` fires at the wrong width |
| 4 | Type-scale switch point is **1024px** | when every font size jumps |
| 5 | H2 and H3 sizes are **used interchangeably** (visual 44px H2 = `text-h3`) | utility classes must be explicit |
| 6 | Container max-width **1440px**, padding 16→40→64→**70px** | content column 1300px |
| 7 | Two-column grid column width **634px**, gap **32px** | card grid baseline |
| 8 | Home has **7 blocks**, `<main>` height **5777px** | home construction plan |
| 9 | Home block 3 uses **absolutely positioned overlays** (511px / 821px) | easiest block to get wrong |
| 10 | Home blocks 6/7 are **full-bleed** (1905px) | layout difference |
| 11 | Detail-page hero is **two columns of 650px**, height 520px | detail construction plan |
| 12 | Service-page stat cards **280×376px**, 4 background colours | service construction plan |
| 13 | The reference font **DIN is commercially licensed** | replaced with Archivo (OFL) |
| 14 | The reference spec table uses a div grid, not `<table>` | this project uses a semantic table |

### Design tokens (quick copy — source of truth is `src/styles/global.css` `@theme`)

```
--spacing: 1px          ← 参考站间距基准是 1px，不是 Tailwind 默认 4px
断点: 360 / 600 / 840 / 1024 / 1280 / 1440  ← 覆盖 Tailwind 默认
容器: max-width 1440, padding 16→40→64→70
字号(text-h1): 42→64px  text-h2: 38→56  text-h3: 30→44  text-h4: 25→32
     text-lead: 21→24  text-p: 18→20  text-card: 21/700
     换挡断点 1024px，用 @utility + @variant lg（--text-* 变量不响应式！）
色: blue #007ac3 / blue-primary #0070ba / blue-dark #001827 / blue-dark2 #00314e
     blue-dark3 #004975 / blue-light #cce4f3 / gray-vlight #f3f3f3
     gray #666 / gray-medium #555 / accent-rose #aa465c
按钮: 高 49px, 圆角 28px, padding 13px 24px 14px, 字号 18px
```

### Reference page templates (6)

| Template | Route | Main height | Core structure |
| --- | --- | ---: | --- |
| Home | `/` | 5777 | 7 blocks, see below |
| ProductDetail | `/products/[cat]/[prod]/` | 2453 | Hero 2 cols 650/gap32/h520 → CTA → rich text 782 → specs → 3 accordions (88px) → download (H2 24px) → related (634×202) |
| Service | `/services/[svc]/` | 6969 | Hero → light-blue panel 731 → 2×2 cards (221/202) → 4 stat cards (280×376) → 5 bars (210) → 6 benefits → logo wall (#f3f3f3) → cases → related topics |
| Category | `/products/[cat]/` | — | thumb 1:1 (202) / card 634×202 / 2 cols gap32 |
| Industry | `/industries/[ind]/` | — | not yet measured (evidence gap #2) |
| Article | `/knowledge/blog/[slug]/` | — | not yet measured (evidence gap #3) |

### Image ratios (`Figure` ratio values)

`2.006` (Hero) `1.334` (sustainability key image 942×706) `1.25` `1.079` (812×753) `1.08` `0.75` `1`
A ratio must be declared, otherwise the layout shifts once the image loads.

### Home — 7 blocks

```
1 Hero         h792  H2 64px  img 2.006  title floats over image, white gradient mask
2 Services     h946  H3 44px  L img 812×753@+128 + overlay@+650 / R img 505×673@+168 + overlay@+571  gap 32
3 ProductSol   h873  H2 32px  L img 505×673@+88 + overlay@+452 / R img 812×753@+48 + overlay@+569  gap 32
4 News         h524  H3 44px  2×2 cards 634×202  img 1.0  title 21px
5 Pillars      h344  H2 24px  3 cols, each 48×48 icon + title + copy
6 Benefits     h1169 H3 44px  pure-black heading  2 cols × 3 rows  164×164 icons absolutely positioned above the item  row pitch 456
7 Sustainability h1013 H3 44px  full-bleed  L img 942×706 + R text + two buttons
```

> ⚠️ The real structure of blocks 2/3 is **image + text overlay sitting below the image**,
> side by side — **not** a card grid. The overlay width equals the image width (48px padding inside).

### Home — block-level acceptance (last measurement, 1440×1000)

| block | local y/h | ref y/h | dy | dh | heading |
| --- | --- | --- | ---: | ---: | --- |
| 1 Hero | 91/792 | 195/792 | -104 | 0 | H2 64px |
| 2 Services | 931/946 | 987/946 | -56 | 0 | H3 44px |
| 3 ProductSol | 1925/873 | 1933/873 | -8 | 0 | H2 32px |
| 4 News | 2846/532 | 2854/524 | -8 | 8 | H3 44px |
| 5 Pillars | 3426/344 | 3426/344 | 0 | 0 | H2 24px |
| 6 Benefits | 3818/? | 3770/1169 | 48 | ? | H3 44px |
| 7 Sustainability | ?/1013 | 4938/1013 | ? | 0 | H3 44px |

The constant −104px offset in `dy` is **normal**: the reference has a 195px top strip
before the first block, while this site uses `<main class="pt-91">` to clear the fixed
header. **`dh` is the column that decides.**

Block 6 was fixed by changing `lg:gap-y-386` → `lg:gap-y-222` (reference icon row pitch
456px = icon 164 + copy 70 + gap 222); **built but not yet re-measured** — run
`npm run measure:home` and confirm block 6 = 1169.

### Navigation deltas applied 2026-11-06

1. The header no longer collapses on scroll (`SiteHeader.astro` dropped the
   `translateY(-60px)` script) — it stays fixed and fully visible. This deviates from
   the reference and is recorded in `qa/DEVIATIONS.md`.
2. The gap under the navigation was tightened: every page's `<main>` went from
   `pt-195` to `pt-48 md:pt-91` (clearing the fixed header only); the home Hero went
   from `pt-56 lg:pt-72` to `pt-24 lg:pt-40`. Measured gaps: home nav→hero 40px,
   eshop/detail 12px, category 36px.


## Product Categories and Brands — 2026-11-09

Reference `https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/`
(1440×1000). Local build measured against `qa/targets/product-categories-and-brands.json`:

| block | local y/h | ref y/h | dy | dh | heading |
| --- | --- | --- | --- | --- | --- |
| 1 Discover Our Product Categories | 889/1444 | 993/1444 | 0 | 0 | H2 44px |
| 2 Buy Fastening Elements | 2381/450 | 2485/446 | 0 | 4 | H2 21.008px |

**P0 (severe): 0 — P1 (minor): 0.** h-overflow 0px, no broken images, no collapsed figures.
The constant −104px `dy` offset is the usual one (reference reserves a 195px top strip,
this site clears the fixed header with `pt-48 md:pt-91`); `dh` is the deciding column.

Notes for future pages:
- The reference's `text-h5` on this page computes to 21.008px/120% — that is this site's
  `text-h5-l` (`1.313rem/120%`), not `text-h5` (`1.313rem/140%`). Both the tile `h3`
  and the service-card `h2` use `text-h5-l`.
- The reference's `text-p-sm` grows to 1.125rem at ≥1024px, so the service-card body copy
  needs `text-p-sm lg:text-p-s`.
- `dh = 4` on block 2 comes from the card paragraph line-box rounding (446 vs 450);
  within the ≤8px tolerance.


## Category Detail — direct-assembly-screws — 2026-11-09

Reference `https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/direct-assembly-screws/`
(1440×1000). Local build measured against
`qa/targets/category-detail-direct-assembly-screws.json`:

| block | local y/h | ref y/h | dy | dh | heading |
| --- | --- | --- | --- | --- | --- |
| 1 Find the Right Screw for Your Application | 860/929 | 1002/932 | 3 | −3 | H2 44px |
| 2 Our Direct Assembly Screws Brands | 2442/1912 | 2587/1912 | 0 | 0 | H2 44px |
| 3 Buy Direct Assembly Screws | 4486/422 | 4632/418 | −1 | 4 | H2 21.008px |

**P0 (severe): 0 — P1 (minor): 0.** h-overflow 0px, body 5633px vs 参考 5610px。

This is the **first page of the `category-detail` type** — it proves the 12 品类子页
can be produced from one template + one data file. 管线：

```bash
npm run recipe -- <ref-url> category-detail-<slug>   # 探针 + 原始 HTML + 素材 + target
node scripts/gen-category-detail.mjs <slug>           # 参考 HTML → src/data/category-detail/<slug>.ts
npm run build && npm run measure -- /…/<slug>/ --target qa/targets/category-detail-<slug>.json
```

Notes for the remaining 11 pages:
- The reference's `text-h5` computes to 21.008px/120% → use this site's `text-h5-l`
  (same mapping already applied on the pcab page).
- `text-h6-s` (面包屑 ol) and `text-list-l` (富文本 ul) were missing locally and have
  been added to `src/styles/global.css` (16px/160%, 20px/180%).
- The 参考站 "Contact Us" 按钮打开一个 dialog；本站改为直达 `/global-en/about-us/contact/`
  （记录于 `qa/DEVIATIONS.md`）。
- 视频缩略图是 YouTube 外链（`img.youtube.com`），参考站本身即如此，未本地化。


## Category Detail — securing-and-anti-loosening-elements — 2026-11-09

Reference `https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/securing-and-anti-loosening-elements/`
(1440×1000). Local build measured against
`qa/targets/category-detail-securing-and-anti-loosening-elements.json`:

| block | local y/h | ref y/h | dy | dh | heading |
| --- | --- | --- | --- | --- | --- |
| 1 Our Securing and Anti-Loosening Brands | 1625/976 | 1801/976 | 0 | 0 | H2 44px |
| 2 Buy Securing Elements | 2734/422 | 2910/418 | 0 | 4 | H2 21.008px |

**P0 (severe): 0 — P1 (minor): 0.** h-overflow 0px, body 3880px vs 参考 3888px，无坏图。
`measure-page.mjs` 自动扣除恒定偏移 −176px（记录于 `qa/DEVIATIONS.md`）。

### 关键差异：参考站本页没有视频文章块

`direct-assembly-screws` 的参考站首块是 `<article>` 视频块；本页参考站 **没有** 该块，
`gen-category-detail.mjs` 抽出的 `video` 四个字段全为空。首版仍无条件渲染 `VideoBlock`，
于是多出一个 855px 的空 `<article>`（并带一张 `src=""` 的坏图），probe 的 `main article`
列表与 target 整体错位一格（dy −909 / dh −121，区块 2 标题字号也不匹配）。

修法：`src/pages/global-en/product-solutions/product-categories-and-brands/[slug].astro`
改为 `page.video.thumbnail && (<VideoBlock …/>)` —— 有视频的页面行为不变，无视频的页面
不再输出空 article。改后首块 dy/dh = 0/0、0/+4。

### DOM contract（参考站本页，1440px）

- hero：`<header class="container-fluid mb-64 mt-40 flex flex-col wd:flex-row …">`，
  左列 = 面包屑 / eyebrow / h1 / lead / 按钮组，右列 = 5:4 主图（634×507，渲染 643×514 @x=745）。
- 正文富文本是**裸 `<div class="container-fluid">`**，标题 `text-h3`（44px #004975），
  **不是** `<article>` —— 参考站本页在品牌网格之前没有任何 `main article`。
- 品牌网格 = `<article class="container-fluid my-48">`（H2 44px #00314E），2 列 × 4 行。
- 服务卡片 = `<article class="container-fluid pb-48 pt-32 lg:pb-56 lg:pt-40">`，
  卡片标题 `text-h5`（21.008px #000）。



## product-solutions — solution hub (2026-11-09)

- Reference: `https://www.bossard.com/global-en/product-solutions/` (probed 2026-11-09, 1440×1000)
- Local: `http://localhost:4321/global-en/product-solutions/`
- Command: `npm run measure -- /global-en/product-solutions/ --target qa/targets/product-solutions.json`
- Result: **P0 (severe) 0 — P1 (minor) 0**, h-overflow 0px, body 3866px vs ref 3806px (+60px)

| block | local y/h | ref y/h | dy | dh | heading |
| --- | --- | --- | --- | --- | --- |
| 1 Product Categories and Brands | 500/865 | 604/865 | 0 | 0 | H2 32px |
| 2 Coatings | 1365/865 | 1469/865 | 0 | 0 | H2 32px |
| 3 Buy Fasteners Online | 2231/911 | 2335/911 | 0 | 0 | H2 44px |

`measure-page.mjs` subtracted the constant dy offset (-104px). Block heights
match the reference exactly (865 / 865 / 911).

### DOM contract learned from this page

- **hero is text-only** — no image (unlike `product-categories-and-brands`):
  `<header class="container-fluid mb-64 mt-40 flex flex-col wd:flex-row …">`
  holding breadcrumb / eyebrow (`text-label`) / `h1.text-h1` / `text-lead`.
- **solution grid** = `<article class="container-fluid-wide py-24">` wrapping a
  `ul:grid-cols-18` grid (gap 32): wide tile = `ul:col-span-11` + `aspect-5/4`,
  narrow tile = `ul:col-span-7` + `aspect-3/4` with `md:my-40`. The caption
  block is absolutely positioned (`bottom-24 lg:bottom-32`): `h2` 32px white,
  lead 24px white shown only at `wd:` and above, then an `arrow-right-bold` glyph.
- **eShop block** = `<article class="py-56 lg:py-72 bg-gray-vlight">`; a 4:3
  image with a white card overlapping it (`ul:mt-[25%] ul:w-[580px]`), label
  `text-p` 20px, `h2.text-h3` 44px, lead 24px, pill button 124×49.
- The reference's tile `h2` uses `text-h4 … lg:text-h4-l`; this site's
  `text-h4` is already 32px at ≥1024px, so the measured head size matches.

## fastener-coatings — 细分方案页 (2026-11-09)

- Reference: `https://www.bossard.com/global-en/product-solutions/components-specific-solutions/fastener-coatings/` (probed 2026-11-09, 1440×1000)
- Local: `http://localhost:4321/global-en/product-solutions/components-specific-solutions/fastener-coatings/`
- Command: `npm run measure -- /global-en/product-solutions/components-specific-solutions/fastener-coatings/ --target qa/targets/fastener-coatings.json`
- Result: **P0 (severe) 0 — P1 (minor) 0**, h-overflow 0px, body 4257px vs ref 4261px (−4px)

| block | local y/h | ref y/h | dy | dh | heading |
| --- | --- | --- | --- | --- | --- |
| 1 Different Types of Fastener Coatings | 1029/938 | 1197/938 | 0 | 0 | H2 44px |
| 2 Corrosion Protection Coatings | 1967/961 | 2135/961 | 0 | 0 | H2 44px |
| 3 Learn More About Fastener Coatings | 2976/508 | 3144/508 | 0 | 0 | H2 44px |

`measure-page.mjs` subtracted the constant dy offset (-168px). Block heights
match the reference exactly (938 / 961 / 508).

### DOM contract learned from this page

- hero **有图**：`<header class="container-fluid mb-64 mt-40 …">` 左列 =
  breadcrumb / eyebrow / `h1.text-h1` / lead，右列 = 5:4 主图（634×507，渲染
  643×514 @x=745）。
- 面包屑**中间项是 `<button>` "…"**（父级折叠），不是 `<a>` —— 与
  `product-categories-and-brands` 的三段式面包屑不同。
- 正文导语是 **4 个裸 `<div class="container-fluid">`**（3 段有字 + 1 段空），
  首段文字包在 `<strong>` 里。
- 方案网格 = `<article class="container-fluid-wide py-24">`，先 H2
  `text-h2 pb-16 lg:pb-24 text-h3 text-blue-dark2`（44px #00314E），再
  `ul:grid-cols-18` 网格（gap 32）；宽卡 `ul:col-span-11` + `aspect-5/4`，
  窄卡 `ul:col-span-7` + `aspect-3/4` + `md:my-40`。卡片标题是 **`<h3>`**。
- 腐蚀保护块 = `<article class="py-56 lg:py-72 bg-white">`；4:3 图 + 白卡
  叠压（`ul:mt-[25%] ul:w-[580px]`），白卡额外带
  `border-[1px] border-blue-light shadow-[0_0_20px_0_rgba(0,0,0,0.05)]`。
- 白皮书网格 = `<article class="container-fluid my-48">` + H2 44px，
  2 列 × 2 行，图标 202×202，标题 `text-h5`（21px/140%），描述 `text-p-sm`。

## Category Detail — 剩余 10 页批量跑（2026-11-09）

管线（每页 3 步，10 页串行批跑）：
`npm run recipe -- <ref-url> category-detail-<slug>` → `node scripts/gen-category-detail.mjs <slug>`
→ `npm run build` → `npm run measure -- /…/<slug>/ --target qa/targets/category-detail-<slug>.json`。

本轮改了 `scripts/gen-category-detail.mjs` 的网格判定：卡片网格必须"每个 section 里都有 `<a>`"
才算品牌网格 / 服务卡片网格。这样 (a) 不再对无链接的图标卡网格抛 `a.attrs` 崩溃
（embedding 页原来直接崩在 line 172），(b) 不再把图标卡网格误判成品牌网格。
模板侧同步加了"品牌网格为空则不输出空 article"的守卫（`[slug].astro`）。

| page | P0 | P1 | 结论 |
| --- | ---: | ---: | --- |
| rivet-technology | 0 | 0 | ✅ 交付（3 区块 dy 3/0/−1，dh −3/0/4） |
| threaded-inserts | 0 | 0 | ✅ 交付（3 区块 dy 3/0/−1，dh −3/0/4） |
| clinching-technology | 0 | 3 | ⚠ 参考站把富文本放在视频块**之前**，模板放在之后 → 首块 dy −448、其余 −107（恒定偏移 −107） |
| fluid-management | 0 | 2 | ⚠ 缺 "White Papers" 资源列表块，dy −189/−393 |
| access-solutions | 2 | 0 | ❌ 缺 "Smart Access Control for Your High-Value Assets" 块（ref h=1046） |
| electrical-products | 2 | 0 | ❌ 缺 "Fastening Elements for Electrical Engineering" 块（ref h=1036） |
| sealing-technology | 2 | 2 | ❌ 缺 "Technical Resources for Sealing Technology" 块（ref h=286） |
| clip-fasteners | 3 | 0 | ❌ 缺 "Hose Clamps" 商品卡网格块（ref h=410） |
| welding-technology | 3 | 1 | ❌ 缺 "Stud Welding"（544）+ "Ultrasonic Welding"（516）两个商品卡网格块 |
| embedding-and-surface-bonding-fasteners | 3 | 1 | ❌ 缺 "Advantages of bigHead®" 图标卡块（512）+ "Design and Installation" 手风琴块（273），且本页无品牌网格 |

六类差异的归因与下一步方案见 `docs/PAGE-TYPES.md` §2.1（结构变体实测表）。


## innovations — 创新方案页 (2026-11-10)

- Reference: `https://www.bossard.com/global-en/product-solutions/innovations/` (probed 2026-11-10, 1440×1000)
- Local: `http://localhost:4321/global-en/product-solutions/innovations/`
- Command: `npm run measure -- /global-en/product-solutions/innovations/ --target qa/targets/innovations.json`
- Result: **P0 (severe) 0 — P1 (minor) 2**, h-overflow 0px, body 3534px vs ref 3530px (+4px)

| block | local y/h | ref y/h | dy | dh | heading |
| --- | --- | --- | --- | --- | --- |
| 1 block 1（hero 轮播 overlay dialog 内的 `<article>`，闭合态 0×0） | 87/0 | 0/0 | +87 | 0 | — |
| 2 What We Offer You | 2026/512 | 2187/512 | −161 | 0 | H2 44px |

**两个 P1 的归因（均非版式缺陷）**

- block 1 的 `dy=+87` 是量测工具的滚动残留：`measure-page.mjs` 为触发懒加载先滚到底、再 `window.scrollTo(0,0)`，而全站 `html { scroll-behavior: smooth }` 让回滚变成动画，600ms 后仍残 87px。其它页面的区块全部同偏移，工具会把常量 dy 一次性扣除；本页首区块是 `display:none` 的 dialog 内 `<article>`（0×0、无文档位置），吃不到扣除 → dy 直接暴露滚动残留。
- block 2 的 `dy=−161` = 全站顶部留白差 −104px（参考站首块前 195px 顶部留白 vs 本站 `pt-48 md:pt-91`，见 `qa/DEVIATIONS.md` 第 12 行，用户已确认「导航留白在合理区间」）− 32px（字体替换：参考站首段导语排 4 行、Archivo 排 3 行）− 25px（参考站 carousel 段与「Your Innovation in Fastening Technology」标题之间多出的 32px 区块间距差）。
- 区块高度 **dh=0**（512 = 512），卡片行高按参考站实测行距 220px 复刻（`h-[220px]`），标题 21px/120%、描述 18px。

### DOM contract learned from this page

- hero = `<header class="container-fluid mb-64 mt-40 … wd:flex-row wd:items-center wd:gap-32">`，左列 breadcrumb(3 段) / eyebrow / `h1.text-h1` / lead；右列 5:4 主图（634×507 → 643×514 @x=745，带 `sm:mt-24`）。
- hero 右列**绝对定位**的「Contact Us」表单卡（`md:absolute md:right-0 md:w-[360px]`）：国家 select + First Name / Last Name / E-Mail / Company + textarea + 隐私勾选 + Submit。
- 5 张创新件横滑轮播（`snap-x` + `lg:max-w-[316px]`，卡宽 316、图 16:9），点击开**全屏 overlay dialog**；dialog 内是 `<article class="container-fluid h-svh">`（闭合态 0×0 → 被量测记为 0 高度区块）。
- 「What We Offer You」= `<article class="container-fluid mb-48 mt-32 lg:mb-56 lg:mt-40">` + H2 44px #00314E + `md:grid-cols-3` 图标卡网格（6 张；卡内图 `absolute top-16` 48×48；标题 21px/120%；描述 18px、高度 0、hover 展开）。
- 结尾 CTA = 「Ready to go the Next Step with Your Innovation?」+「Contact Us」按钮（140×49）+ 右侧抽屉 dialog（728px，图 21:9）。
- 参考站 hero 面包屑第 3 项是 `<span>`（当前页，不可点），前两项是 `<a>`。

## services — 服务总览页 (2026-11-10)

- Reference: `https://www.bossard.com/global-en/services/` (probed 2026-11-10, 1440×1000)
- Local: `http://localhost:4321/global-en/services/`
- Command: `npm run measure -- /global-en/services/ --target qa/targets/services.json`
- Result: **P0 (severe) 0 — P1 (minor) 0**, h-overflow 0px, body 4838px vs ref 4853px (−15px)

| block | local y/h | ref y/h | dy | dh | heading |
| --- | --- | --- | --- | --- | --- |
| 1 Inventory and C-Parts Management | 500/865 | 604/865 | −104 | 0 | H2 32px |
| 2 Fastening Composites | 1365/865 | 1469/865 | −104 | 0 | H2 32px |
| 3 Explore Your Benefits | 2279/742 | 2383/742 | −104 | 0 | H2 44px |

- 三个区块共享同一常量偏移 −104px（= 全站顶部留白差，见 `qa/DEVIATIONS.md` 第 12 行），验收器自动扣除；**区块高度全部 dh=0**。
- body 4838 vs 4853 的 −15px 来自全站页脚高度差（609 vs 参考 517，+68px 已知偏差方向相反）。

### DOM contract learned from this page

- hero = `<header class="container-fluid mb-64 mt-40 … wd:flex-row wd:items-center wd:gap-32">`，面包屑仅 2 段（第 2 段为当前页 `<span aria-current="page">`）/ eyebrow `text-label` 20px #666 / `h1.text-h1` 64px #004975 / lead 24px/38.4（2 行）。
- 两个 teaser-tile `<article class="container-fluid-wide py-24">`（各 865px）：内部 `ul:grid-cols-18` 网格，**宽卡 `ul:col-span-11`（812×753，aspect-5/4）+ 窄卡 `ul:col-span-7`（505×673，aspect-3/4，`md:my-40`）**；第 2 块的顺序与第 1 块**相反**（窄卡在前 x=38、宽卡在后 x=575）。
- 卡片 = `<a class="relative rounded-2xl bg-[linear-gradient(0deg,rgba(0,0,0,0.3),rgba(0,0,0,0))]">` + `<figure class="relative -z-1 h-full rounded-2xl w-full">` + `<img class="aspect-5/4 w-full h-full object-cover rounded-2xl">` + 绝对定位 overlay `container-fluid absolute bottom-24 px-32 lg:bottom-32 lg:px-48`（H2 `text-h4 lg:text-h4-l` 32px 白 + lead `text-lead hidden wd:block` + `arrow-right-bold` 箭头）。
- 「Explore Your Benefits」= `<article class="container-fluid my-48">` + H2 44px #00314E + `md:grid-cols-2 lg:gap-32` 网格（5 张卡，2 列 3 行；行高 202px 由图标 202×202 决定；文本列 `pl-16 lg:pl-24`，x=296 w=401）。
- 尾部富文本 = 3 个 `container-fluid` 块（空 `<p>` + H2 `text-h3 max-w-rich-text` 782px + 段落）+ `container-fluid-wide` 内 16:9 蓝图图（1349×759，`cursor-pointer w-full`）。


---

## 服务子页（9 页）— 2026-11-10

### 交付范围
- **Benefits 家族（5 页）** `/global-en/services/benefits/<slug>/`：`scripts/gen-services-detail.mjs` → `src/data/services-detail/benefits-*.ts` + `src/components/sections/services-detail/{ServiceHero,ServiceStep,TcoCallout}.astro` + 路由 `src/pages/global-en/services/benefits/[slug].astro`。用户已确认 `cost-saving-rationalization` 视觉可接受。
- **CMS-block 家族（4 页）** `/global-en/services/<family>/<slug>/`：`scripts/gen-services-sub.mjs` → `src/data/services-sub/*.ts`（4 份）+ 渲染器 `src/components/sections/services-sub/ServiceBlocks.astro`（按 `kind` 分派 HTML 字符串渲染器）+ 路由 `src/pages/global-en/services/[family]/[slug].astro`。

### 实测（1440×1000，measure vs `qa/targets/services-*.json`）
| 路由 | P0 | P1 | h-overflow | body(本地/参考) |
| --- | --- | --- | --- | --- |
| smart-factory/inventory-management | 3 | 4 | 0 | 7852 / 8258 |
| smart-factory/smart-assembly | 6 | 5 | 0 | — / 9370 |
| engineering/fastening-composites | 6 | 5 | 0 | — / 8857 |
| engineering/engineering-services | 3 | 5 | 0 | 7049 / — |

四页 h-overflow 全为 0，区块 y/h 与参考同量级（多数 dh 在 ±20px 内），无版式溢出。

### 已归因的已知偏差（按 80% 目标接受，不再追）
1. **零高度参考行**：`qa/targets/services-engineering-fastening-composites.json` 第 9–11 行是参考站自身的 `container-fluid h-svh` 空容器（y=0 h=0，标题为 "block 9/10/11"）。参考站本身无内容，本地也不渲染 → **基线噪声，非本地缺陷**。
2. **measure 选择器 = `main article, main > section`**（按索引逐行比对）。参考站把文本块放在 `<article>` 内，本地同位置若渲染成 `<div>`，该行整行 MISSING 且后续行索引错位。**已修**：`scripts/gen-services-sub.mjs` 的 `parseRichText()` 现将参考站原始标签写入数据（`tag` 字段）；`ServiceBlocks.astro` 的 richText 渲染器按 `b.tag` 输出同标签元素，使本地与参考元素层级一一对应。
3. **video 海报图缺失**：`/images/services-<slug>/video-poster.jpg` 未落盘（YouTube `maxresdefault.jpg` 外网不可达；远程 URL 已记录在数据的 `posterSrc` 字段）。视频容器为固定 16:9 版位，高度不受影响，仅图片区缺图。
4. 其余 P1 为区块内行高/图集高度差（logoRail +83px、cardRail +132px、relatedTopics −351px、iconCards −20/−61px），属参考站栅格细节差异。

### 复现方式
```
node scripts/gen-services-detail.mjs <slug>          # benefits 家族
node scripts/gen-services-sub.mjs <page> [...]       # CMS-block 家族（page = qa/ref/<page>）
npm run build
npm run measure -- /global-en/services/<family>/<slug>/ --target qa/targets/services-<page>.json
```

---

## `industries` — /global-en/industries/（2026-11-10）

参考：https://www.bossard.com/global-en/industries/

| 区块 | 参考 y/h | 本地 y/h | dy | dh | heading |
| --- | --- | --- | ---: | ---: | --- |
| 1 Aerospace | 604/865 | 500/865 | −104 | 0 | H2 32px |
| 2 Electric Vehicles | 1469/865 | 1365/865 | −104 | 0 | H2 32px |
| 3 Medical and Life Science | 2335/865 | 2231/865 | −104 | 0 | H2 32px |
| 4 Robotics | 3200/865 | 3096/865 | −104 | 0 | H2 32px |
| 5 Data Centers | 4065/913 | 3961/906 | −104 | −7 | H2 44px |

**P0=0 P1=0** · body 6888 · h-overflow 0 · header y=1036 h=91 fixed z=200 [ok]

- **dy −104 = 全站恒定顶部偏移**（参考站预留 195px 顶部条，本地 91px），`measure-page.mjs` 检测到 4 区块 dy 一致后自动扣除，已记入 `qa/DEVIATIONS.md`。
- **block5 dh −7**：Data Centers 文字卡比参考站矮 7px。参考站该卡带 `border-[1px] border-blue-light` + `shadow`，本地同为 1px 边框，差值来自站点字体度量（非结构缺陷）。
- 行业卡宽/窄顺序按参考站逐块还原：块1 窄→宽、块2 宽→窄、块3 窄→宽、块4 宽→窄。

### 复现方式
```
npm run gen:industries        # 参考 HTML → src/data/industries.ts
npm run build
npm run measure -- /global-en/industries/ --target qa/targets/industries.json
```

---

## `industries-aerospace` — /global-en/industries/aerospace/（2026-11-10）

参考：https://www.bossard.com/global-en/industries/aerospace/ （Bossard Aerospace）

| # | 区块 | 参考 y/h | 本地 y/h | dh | heading |
| --- | --- | --- | --- | ---: | --- |
| 1 | Aerospace Fastening Solutions | 829/865 | 829/865 | 0 | H2 32px |
| 2 | Supplier Network | 1694/865 | 1694/865 | 0 | H2 32px |
| 3 | Working at Bossard Aerospace | 2560/865 | 2560/865 | 0 | H2 32px |
| 4 | News Overview | 3473/774 | 3473/769 | −5 | H2 44px |
| 5 | Your Trusted C-Parts Management Partner | 4295/903 | 4295/903 | 0 | H2 44px |
| 6 | How We Support You in Aerospace Manufacturing | 5238/512 | 5238/512 | 0 | H2 44px |
| 7 | Bossard Aerospace Contacts | 5866/610 | 5866/610 | 0 | H2 44px |
| 8 | Product Solutions | 6533/344 | 6533/344 | 0 | H2 24px |
| 9 | About Bossard Aerospace | 6877/344 | 6877/344 | 0 | H2 24px |

**P0=0 P1=0** · body 7857 · h-overflow 0 · header fixed z=200 [ok] · 9/9 区块 dh=0

- **dy**：全站恒定顶部偏移（参考站 195px 顶部留白 vs 本站 91px），`measure-page.mjs` 自动识别并扣除（−104 / −109）。
- **block4 dh −5**：新闻网格第三行摘要文字少 5px（字体度量差），在容差内。
- **支撑卡 220px**：参考站 class 声明 `h-[210px]`，浏览器实测盒子 220px（图标 y / 标题 y / 区块底边三处一致）→ 本地按 220px 复刻。
- **3 个空 rich-text 槽位**：参考站在支持卡与联系手风琴之间、页面末尾各有一个空 `<p>`（20px），必须补齐，否则后续区块整体上移。
- **视频封面**：YouTube 图床不可达，保留远程 URL（见 `qa/DEVIATIONS.md`），16:9 占位框保证 dh=0。

### 复现方式
```
npm run gen:industries-aerospace   # 参考 HTML → src/data/industries-aerospace.ts
npm run build
npm run measure -- /global-en/industries/aerospace/ --target qa/targets/industries-aerospace.json
```
