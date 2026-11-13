# RECIPE — 1:1 复刻 SOP（可复制 · 可复用）

> **核心原则**：参考站只测一次，本项目只建一次底座，之后每页 = 写数据 + 写组件 + 跑验收。
>
> **目标**：把单页复刻成本从 ~15M token / 1h+ 压到 **~2M token / 25–35 min**。
>
> 本文件是**执行手册**，不是历史记录。执行前只读本文件 + §2 列出的 4 个项目文件。
> 结论落盘到 `qa/`，不靠对话记忆。

---

## 阶段 0 · 一次性底座（已建好，所有页复用）

| 文件 | 作用 | 状态 |
| --- | --- | --- |
| `scripts/probe-ref.mjs` | **一次** CDP 调用把参考页拆成结构化 JSON + 原始 HTML | ✅ |
| `scripts/lib/probe-expression.mjs` | 探针在页面内执行的表达式（与 `measure-page.mjs` 同构） | ✅ |
| `scripts/dl-assets.mjs` | 从 probe JSON 批量下载图片到 `public/images/<page>/` | ✅ |
| `scripts/gen-target.mjs` | probe JSON → `qa/targets/<page>.json`（零手抄） | ✅ |
| `scripts/measure-page.mjs` | 本地构建 → 逐区块对比 target，输出 P0/P1 | ✅ |
| 本文件 | 流程 + 类名映射速查 + 禁则 | ✅ |

**产出后，每个新页面的边际成本 = 3 个文件 + 3 条命令。**

### 探针输出字段（`qa/ref/<page>.json`）

| 字段 | 内容 |
| --- | --- |
| `sections[]` | 区块几何 `x/y/w/h` + 自身标题 `headText` + 标题 `fontSize/color/weight` + 背景色 |
| `figures[]` | 图片框几何 + `ratio/aspect` + `src/srcset/sizes/alt/natural` + `objectFit` |
| `images[]` | **全页** `<img>`（含不在 `figure` 内的：logo、卡片图）+ `inFigure` 标记 |
| `sprites[]` | `<svg><use href="…#icon">` 雪碧图引用清单 |
| `grids[]` | `grid-template-columns` / `gap` / 宽度 |
| `texts[]` | 每个标题/段落/列表项的 `fs/lh/fw/color/mt/mb` + 坐标 |
| `links[]` | 每个 `<a>` 的 `href` / 文本 / class |
| `buttons[]` | 胶囊按钮的尺寸/圆角/配色 |
| `header` / `footer` / `bodyHeight` / `overflow` | 框架几何与横向溢出 |

---

## 阶段 1 · 测量参考站（每页 1 次调用）

### 🚀 一条命令（推荐）

```bash
npm run recipe -- <参考页URL> [page名]
```

`page名` 省略时自动取 URL 最后一段（`…/global-en/eshop/` → `eshop`）。这一条命令等于下面的 ①②③ 三步，
跑完自动打印「还剩哪些步骤」的清单：

```
npm run recipe -- https://www.bossard.com/global-en/eshop/ eshop
```

可选开关：

| 开关 | 作用 |
| --- | --- |
| `--viewport 390x844` | 换视口测移动端 |
| `--out-dir public/images/<page>` | 换素材落盘目录 |
| `--skip-assets` | 跳过素材下载（只想要结构数据时用，快 10 倍） |

### 或者分三步跑

```bash
node scripts/probe-ref.mjs <参考页URL> --out qa/ref/<page>.json
# 默认同时落盘 qa/ref/<page>.html（--no-html 可关）
```

**纪律**
- **一次调用取回全部字段**，不要分 5 次问浏览器。
- **原始 HTML 必须落盘**：查文案 / DOM 层级 / class 名 / 图标引用全部离线可查，之后不再开浏览器。
- 只测验收视口（1440×1000）；移动端等桌面通过后再单独测一次。
- 脚本用 `fs.writeFileSync(..., 'utf8')` 写文件，**不要用 PowerShell `>` 重定向**（那是 UTF-16，日志要转码才能读）。

```bash
node scripts/dl-assets.mjs qa/ref/<page>.json --out-dir public/images/<page>
node scripts/gen-target.mjs qa/ref/<page>.json --out qa/targets/<page>.json
```

- `dl-assets` 从 `figures[]` + 非 figure 的 `images[]` 下载，`srcset` 取**最大**候选，**断点续传**（已存在且非空则跳过），产出 `_manifest.json`（参考 URL → 本地路径）。
- 扩展名取 CDN 的 **`fm=` 参数**（路径里的 `.CGI` 之类不是格式，会存成不可渲染的破图）。
- `gen-target` 的 `pageType` 默认取 probe 文件名，**不用手写**。

---

## 阶段 2 · 读本项目底座（每页 0 次）

只读这 4 个文件，**项目生命周期内每个读一次即可**，读完记进 `HANDOFF.md`：

| 文件 | 目的 |
| --- | --- |
| `src/styles/global.css` | token / spacing / 断点 / `@utility` 清单 |
| `src/config/site.ts` | SITE / LOGO / NAVIGATION / FOOTER_COLUMNS |
| `src/components/layout/SiteHeader.astro` + `SiteFooter.astro` | 公共框架（**只读，绝不改**） |
| `HANDOFF.md` | 已完成清单 + 实测值速查 |

> 不读：整个 `src/`、整个 `docs/`、`astro.config.mjs` 全文、参考站无关页面。

---

## 阶段 3 · 写页面（每页 3 个文件）

```
src/data/<page>.ts                        ← 只放数据：标题/链接/图片/文案
src/components/sections/<page>/<Block>.astro  ← 一个区块一个组件
src/pages/<route>.astro                   ← 组装：BaseLayout + 公共框架 + <main>
```

**纪律**
- **数据与结构分离**：文案改动只动 `data/`，样式改动只动组件。Phase B 换自有内容时只碰 data。
- 区块组件只接受 `data` 传入，不硬编码内容。
- **公共组件零改动**：页头/页脚/导航是全站模板。页面差异用本页自己的 `<main>` 内解决。
  公共组件确实与参考站不符 → 记成独立任务单独排期，**不在本页夹带**。

---

## 阶段 4 · 构建 + 验收（每页 2 条命令）

```bash
npm run build                                   # 必须走 astro-build.mjs，不走 astro build
npm run measure -- /<route>/ --target qa/targets/<page>.json
```

**判定（固定，不讨价还价）**

| 项 | 阈值 |
| --- | --- |
| `P0 (severe)` | **必须 = 0** |
| 横向溢出 `h-overflow` | **必须 = 0** |
| 破图 `BROKEN IMAGES` | **必须 = 0** |
| 折叠 figure `COLLAPSED FIGURES` | **必须 = 0** |
| 区块高度差 `dh` | 判定列，\|dh\| ≤ 8px 通过 |
| 区块位置差 `dy` | 允许**恒定偏移**（公共 header 造成），`measure-page.mjs` 自动识别并扣除 |

- **不过 → 回到阶段 3 改「数值」，不重构结构**；连续 2 轮不过就停手上报。

---

## 阶段 5 · 归档（每页 1 分钟）

- `qa/ref/<page>.json` — 参考实测快照
- `qa/ref/<page>.html` — 参考原始 HTML
- `qa/targets/<page>.json` — 验收基线（**脚本生成，禁止手写**）
- `HANDOFF.md` 加一行：路由 / 实测值 / P0 状态 / 已知偏差
- 偏差写进 `qa/DEVIATIONS.md`，**不偷偷留成「差不多就行」**

---

## §5 参考站 class → 本站映射速查（实测，直接抄）

| 参考站 | 本站等价 |
| --- | --- |
| `container-fluid` | `container-fluid`（global.css 已定义，断点内 padding 40→70） |
| `container-fluid-wide` | `container-fluid-wide` |
| `text-h1 / h2 / h3 / h4 / h5` | 同名（`@utility`，`lg` 变体已就位） |
| `text-p-sm` | **`text-p-sm lg:text-p-s`** — 参考站 `text-p-sm` 是 1rem→≥1024px 变 1.125rem；本站 `text-p-sm` 固定 1rem |
| `text-p-sm-s` | `text-p-sm`（参考站 1rem 静态，无 lg 变体） |
| `text-p-s / text-p-l / text-p` | 同名 |
| `text-h5-s` / `text-h5-l` | 同名（global.css 已补，1.125rem/110% 与 1.313rem/120%） |
| `scrollbar` | 同名（global.css 已补：6px 滚动条，横向滑轨的高度会受它影响） |
| `text-label / text-lead / text-card / text-button` | 同名 |
| `aspect-3/2` | `aspect-3/2`（Tailwind 原生）或 `Figure` 的 `ratio` prop |
| `pb-32 lg:pb-48`、`gap-20`、`mt-8` | 直接用（本站 `--spacing: 1px`，数值即像素） |
| `grid-cols-2 md:3 lg:4 wd:gap-24 ul:grid-cols-5` | 同名（`wd`=1280 / `ul`=1440 已定义） |
| `text-blue-dark3 / gray / gray-medium / gray-vlight` | 同名 token（`--color-*`） |
| `rounded-pill` | `rounded-pill` |
| sprite `<use href="…#icon">` | `<use href="/images/sprite.svg#icon">` |
| 卡片图 `fit=contain` | 本地化 webp + `object-cover`（容器已是 3/2，无裁切差） |

### 设计系统速查（`src/styles/global.css` 实测值）

```
--spacing: 1px                     ← 间距基准是 1px，不是 Tailwind 默认 4px
断点: 360 / 600 / 840 / 1024 / 1280 / 1440
容器: max-width 1440, padding 16→40→64→70
字号: text-h1 42→64  h2 38→56  h3 30→44  h4 25→32
      lead 21→24  p 18→20  label 18→20  button 18  card 21/700
色: blue #007ac3 / blue-primary #0070ba / blue-dark #001827 / blue-dark2 #00314e
    blue-dark3 #004975 / blue-light #cce4f3 / gray-vlight #f3f3f3
    gray #333 / gray-medium #666 / accent-rose #aa465c
按钮: 高 49px, 圆角 28px, padding 13px 24px 14px, 字号 18px
```

---

## §6 反浪费清单（踩过的坑 → 规则）

| 坑 | 规则 |
| --- | --- |
| 参考页反复测 | **一次 probe 出全部字段**，缺字段就补跑 probe，不手工问浏览器 |
| Windows `>` 重定向是 UTF-16，读日志要转码 | 脚本输出**直接写 UTF-8 文件**；别用 `>` |
| 探查范围外组件（导航面板/页脚/配置全文） | 只读阶段 2 的 4 个文件 |
| 目标 JSON 手抄 → 写两遍 | `gen-target.mjs` 自动生成，**只准改一次** |
| 工具失败后原地重试 | 失败即换路径，最多 1 次重试 |
| 上下文被压缩后重读已有信息 | 结论落盘到 `qa/targets/` + `HANDOFF.md`，靠文件交接 |
| 页面任务夹带公共组件改动 | 公共组件改动 = 独立任务，独立排期 |
| CDN 图片扩展名取自路径（`.CGI`） | `dl-assets.mjs` 从 `fm=` 取格式，破图归零 |
| 区块标签全叫同一个标题 | `gen-target.mjs` 用区块**自身**标题命名 |

---

## §7 单页 6 步（照抄即可）

```bash
① npm run recipe -- <ref-url> [page]        # = 探针 + 素材 + target，一条命令
② 读 global.css / site.ts / SiteHeader+SiteFooter / HANDOFF（各 1 遍）
③ 写 data/<page>.ts + components/sections/<page>/<Block>.astro + pages/<route>.astro
④ npm run build && npm run measure -- /<route>/ --target qa/targets/<page>.json
```

6 步，**无浏览器往返、无手抄、无公共组件夹带**。页脚差异单独记为 `qa/DEVIATIONS.md` 一行。

---

## 预算基线

| 阶段 | token | 时间 |
| --- | ---: | ---: |
| 一次性投资（阶段 0） | 30K | 5 min |
| 测量（阶段 1） | 15K | 3 min |
| 读项目底座（阶段 2） | 30K | 2 min |
| 写页面（阶段 3） | 100K | 15 min |
| 构建 + 验收（阶段 4） | 40K | 5 min |
| 归档（阶段 5） | 10K | 3 min |
| **合计（后续每页）** | **~195K** | **~33 min** |

> 第 2 个页面起边际成本降到 ~195K；到第 5 个页面，探针的类名映射表覆盖 90% 情况，实际 ~120K。
> **参考 HTML 落盘是最关键的一步**——把「每次都开浏览器查文案」变成「grep 一下本地文件」。
