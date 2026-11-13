# PAGE-TYPES — 页面类型注册表

> **用途**：新页面开工前先查本表，确认是否已有同类型原型。
> 已知类型 = 只写 data 文件 + 复用既有组件，**禁止重新设计结构**。
> 本表只列**现存**文件；新增条目前必须确认路径真实存在。

---

## 0. 使用方式

```bash
# 1. 查表 → 找到 pageType 对应的原型页、组件、data 形状
# 2. 只做两件事：写 data、套组件
# 3. npm run build && npm run measure -- /<route>/ --target qa/targets/<page>.json
```

| 步骤 | 成本 | 说明 |
| --- | ---: | --- |
| 查本页 | 0 | 确定 pageType 与原型 |
| 写 data | ~2K token | 纯数据，无结构决策 |
| 套组件 | 0 | 组件已存在，直接引用 |
| build + measure | ~40K token | 一次构建、一次验收 |
| **同类型第 2 页起** | **~45K token** | 参考站结构已从原型抽象完毕 |

> 前提：参考站结构差异已被原型页吸收。新页面若结构与原型不同 → **不是同类型**，先测参考站再决定是否新增 pageType。

---

## 1. 已注册类型（8 种）

### 1.1 `home` — 首页

| 项 | 值 |
| --- | --- |
| 本地路由 | `/` |
| 参考 URL | `https://www.bossard.com/global-en/` |
| 区块数 | 7（Hero / Services / ProductSol / News / Pillars / Benefits / Sustainability） |
| 组件 | `src/components/sections/home/` ×7 |
| data | `src/data/home.ts` |
| target | `qa/targets/home.json` |
| 状态 | 已交付。区块 6 高度改过（`lg:gap-y-386` → `lg:gap-y-222`），**未复测** |

### 1.2 `eshop` — 产品总览列表页

| 项 | 值 |
| --- | --- |
| 本地路由 | `/global-en/eshop/` |
| 参考 URL | `https://www.bossard.com/global-en/eshop/` |
| 区块数 | 16（5+5+6+…，按分组排列） |
| 组件 | `src/components/sections/eshop/EshopGroupSection.astro` |
| data | `src/data/eshop.ts` |
| target | `qa/targets/eshop.json` |
| 状态 | 已交付 |

### 1.3 `category` — 品类页（分类 + 产品网格）

| 项 | 值 |
| --- | --- |
| 本地路由 | `/global-en/eshop/products/fastening-technology/standard-fastening-elements/c/01.100/` |
| 参考 URL | 同形态：`/global-en/eshop/products/fastening-technology/<slug>/c/<code>/` |
| 区块数 | 24（6 子类卡横滑轨 + 18 产品卡） |
| 组件 | `src/components/sections/category/` ×3（CategoryCardRail / ProductCard / ProductGrid） |
| data | `src/data/category.ts` |
| target | `qa/targets/category.json` |
| 状态 | 已交付，24/24 区块 dy=0 dh=0，P0=0 P1=0 |
| 备注 | 产品卡片高度随描述换行变化（`h` 360 / 388），属正常 |

**同页型追加（2026-11-11 交付）**：3 个一级分类页，是本页型的**物理复制**（骨架逐行相同，各自内联标题/面包屑/子分类卡/产品数），未新建组件、未新建 data 层：

| 本地路由 | 标题 | 子分类卡 | 产品总数 | 素材 |
| --- | --- | ---: | ---: | --- |
| `/global-en/eshop/c/01/` | Fastening Technology | 5 | 1408 | `/images/eshop/01~05-*.webp` |
| `/global-en/eshop/c/02/` | Specific Fastening Technologies | 7 | 1078 | `/images/eshop/06~12-*.webp` |
| `/global-en/eshop/c/03/` | Functional Elements | 4 | 2004 | `/images/eshop/13~16-*.webp` |

- 组件改动仅两个**可选** prop：`CategoryCardRail.cards`、`ProductGrid.productCount`（默认值 = `src/data/category.ts` 的模板数据 → 模板页 `c/01.100/` 零影响，仍 6 卡 / 709 / 18 命中）。
- 子分类计数 = 参考站实测值；产品总数 = 子项计数之和（01=1408、03=2004 与参考站实测逐位吻合）。
- **URL 为复制期临时态**：禁止加跳转（见 `.clinerules` §5 硬禁区）；真实 URL 规划时三个页面文件整体迁移。

### 1.4 `product-detail` — 产品详情页

| 项 | 值 |
| --- | --- |
| 本地路由 | `/global-en/eshop/screws-and-bolts-with-internal-drive/hex-socket-head-cap-screws-fully-threaded/p/272/` |
| 参考 URL | 同形态：`.../p/<code>/` |
| 区块数 | 7（空容器 / Variants / 5×BN 卡片） |
| 组件 | `src/components/sections/product-272/` ×4（ProductHero / VariantsTable / CadSection / AlternativeProducts） |
| data | `src/data/product-272.ts` |
| target | `qa/targets/product-272.json` |
| 状态 | 已交付，7 区块 dy≤2 dh≤2，P0=0 P1=0 |
| 坑 | 参考站 `opacity-1` = 完全不透明；Tailwind v4 的 `opacity-1` = 1%。用 `opacity-100` |

### 1.5 `category-overview` — 品类总览页

| 项 | 值 |
| --- | --- |
| 本地路由 | `/global-en/product-solutions/product-categories-and-brands/` |
| 参考 URL | `https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/` |
| 区块数 | 2（Discover Our Product Categories / Buy Fastening Elements） |
| 组件 | `src/components/sections/product-categories-and-brands/` ×3（PageHero / CategoryTiles / ServiceCards） |
| data | `src/data/product-categories-and-brands.ts` |
| target | `qa/targets/product-categories-and-brands.json` |
| 状态 | 已实现，**首次 measure 未跑**（见 HANDOFF §2） |

### 1.6 `category-detail` — 品类子页（12 页共享）

| 项 | 值 |
| --- | --- |
| 本地路由 | `/global-en/product-solutions/product-categories-and-brands/<slug>/`（**动态路由 `[slug].astro`**） |
| 参考 URL | `https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/<slug>/` |
| 区块数 | 3（视频文章 / 品牌网格 / 服务卡片） |
| 组件 | `src/components/sections/category-detail/` ×3（PageHero, VideoBlock, RichText）＋复用 pcab 的 CategoryTiles、ServiceCards |
| data | `src/data/category-detail/<slug>.ts`（**脚本生成**）+ `types.ts` + `index.ts` |
| target | `qa/targets/category-detail-<slug>.json`（recipe 生成） |
| 状态 | **全 12 页已跑通管线**（ref + 素材 + target + data + build + measure）。**P0=0 P1=0：4 页**（direct-assembly-screws、securing-and-anti-loosening-elements、rivet-technology、threaded-inserts）；**P0=0 P1>0：2 页**（clinching-technology P1=3、fluid-management P1=2）；**P0>0：6 页**（缺参考站里本数据模型无法表达的 `<article>`，见 §2.1 变体表） |

```bash
npm run recipe -- https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/<slug>/ category-detail-<slug>
node scripts/gen-category-detail.mjs <slug>
npm run build && npm run measure -- /global-en/product-solutions/product-categories-and-brands/<slug>/ --target qa/targets/category-detail-<slug>.json
```

> **不要手抄 data**：15 个品牌卡、4 段富文本、面包屑、按钮全部由 `gen-category-detail.mjs` 从参考 HTML 抽取。
> 抽不准时看 `qa/report/<slug>/08-dom-tree.txt`（参考站真实 DOM 嵌套）再改脚本，不要改 data。
> **结构变体（视频块可选）**：并非每个品类子页都有 "Find the Right …" 视频文章块
> （securing-and-anti-loosening-elements 就没有）。`gen-category-detail.mjs` 抽出的 `video`
> 四个字段全空时，模板不渲染 `VideoBlock`（`page.video.thumbnail && (<VideoBlock/>）`），
> 否则会多出一个 855px 空 `<article>` + 一张 `src=""` 坏图，并让 probe 的 `main article`
> 列表与 target 整体错位一格。


### 1.7 `services` — 服务总览页

| 项 | 值 |
| --- | --- |
| 本地路由 | `/global-en/services/` |
| 参考 URL | `https://www.bossard.com/global-en/services/` |
| 区块数 | 3（teaser-tile 网格 ×2 / 权益网格）+ 尾部富文本与蓝图图 |
| 组件 | `src/components/sections/services/` ×2（ServiceGrid, BenefitsGrid） |
| data | `src/data/services.ts` |
| target | `qa/targets/services.json`（recipe 生成） |
| 状态 | 已交付，3 区块 dy −104（恒定偏移，已扣除）dh=0，**P0=0 P1=0** |

| 区块 | 参考 y/h | 结构 |
| --- | --- | --- |
| 1 Inventory and C-Parts Management | 604/865 | `container-fluid-wide py-24` + `ul:grid-cols-18`：宽卡 `ul:col-span-11` 812×753（aspect-5/4）+ 窄卡 `ul:col-span-7` 505×673（aspect-3/4，`md:my-40`） |
| 2 Fastening Composites | 1469/865 | 同上，**顺序相反**（窄卡在前、宽卡在后） |
| 3 Explore Your Benefits | 2383/742 | `container-fluid my-48` + H2 44px + `md:grid-cols-2` 网格，5 张卡（图标 202×202，文本列 `pl-24`） |

```bash
npm run recipe -- https://www.bossard.com/global-en/services/ services
npm run build && npm run measure -- /global-en/services/ --target qa/targets/services.json
```

### 1.8 `industries` — 行业总览页

| 项 | 值 |
| --- | --- |
| 本地路由 | `/global-en/industries/` |
| 参考 URL | `https://www.bossard.com/global-en/industries/` |
| 区块数 | 5（4×两卡行业网格 + Data Centers callout）+ 尾部联系表单段 |
| 组件 | `src/components/sections/industries/` ×3（IndustryCards / DataCentersCallout / IndustryContact） |
| data | `src/data/industries.ts`（**脚本生成**：`npm run gen:industries`） |
| target | `qa/targets/industries.json`（recipe 生成） |
| 状态 | 已交付，5 区块 dy −104（恒定偏移，已扣除）dh=0，**P0=0 P1=0** |

| 区块 | 参考 y/h | 结构 |
| --- | --- | --- |
| 1 Aerospace | 604/865 | `container-fluid-wide py-24` + `ul:grid-cols-18`：窄卡 `ul:col-span-7` 505×673（aspect-3/4，`md:my-40`）+ 宽卡 `ul:col-span-11` 812×753（aspect-5/4） |
| 2 Electric Vehicles | 1469/865 | 同上，**顺序相反**（宽卡在前） |
| 3 Medical and Life Science | 2335/865 | 同上，窄卡在前 |
| 4 Robotics | 3200/865 | 同上，宽卡在前 |
| 5 Data Centers | 4065/913 | `py-56 lg:py-72 bg-white` + 4:3 主图 + 右侧文字卡（`border-blue-light` + shadow）+ outline CTA |

```bash
npm run recipe -- https://www.bossard.com/global-en/industries/ industries
npm run gen:industries          # 参考 HTML → src/data/industries.ts
npm run build && npm run measure -- /global-en/industries/ --target qa/targets/industries.json
```

> **不要手抄 data**：8 张行业卡 + callout + 55 国下拉 + 表单全部由 `gen-industries.mjs` 从参考 HTML 抽取。
> 表单 consent 句式在参考站里链接位于 `<p>` 文本流之外（句子留了一个 "the ." 空位），脚本据此切分。

---

## 2. `category-detail` 的 12 个 slug

参考站实测自 `qa/ref/product-categories-and-brands.html`（共 12 个，唯一）：

| # | slug |
| ---: | --- |
| 1 | `direct-assembly-screws` |
| 2 | `securing-and-anti-loosening-elements` |
| 3 | `clinching-technology` |
| 4 | `rivet-technology` |
| 5 | `threaded-inserts` |
| 6 | `clip-fasteners` |
| 7 | `welding-technology` |
| 8 | `embedding-and-surface-bonding-fasteners` |
| 9 | `electrical-products` |
| 10 | `access-solutions` |
| 11 | `fluid-management` |
| 12 | `sealing-technology` |

> 这 12 页**共用同一套模板与组件**，但**参考站的 `<main>` 结构并不相同** —— 实测有 7 种变体，见下表。
> 12 页 = 12 次**页面生产**，不是 12 次网站逆向。

### 2.1 结构变体实测（2026-11-09，12 页全量 measure 之后）

现有数据模型只有 7 种块：hero / intro / video / richText / brands / note / services。
参考站另外还有 4 类 `<article>` 本模型**表达不了**，这是 6 个页面 P0>0 的唯一原因。

| 变体 | 参考站 `<main>` 结构 | 页面 | 本地缺什么 |
| --- | --- | --- | --- |
| A | video + brands + services | direct-assembly-screws、rivet-technology、threaded-inserts | 无（P0=0 P1=0） |
| A′ | richText + brands + services（**无视频块**） | securing-and-anti-loosening-elements | 无（P0=0 P1=0） |
| A″ | **richText 在 video 之前** + brands + services | clinching-technology（P0=0 **P1=3**） | 模板把 richText 固定放在 video 之后；参考站长列表是分栏，本站单列（差 ≈341px） |
| B | **商品卡网格 article** + brands + services | clip-fasteners（P0=3）、welding-technology（P0=3） | 缺 "Hose Clamps" / "Stud Welding" / "Ultrasonic Welding" 三类商品卡网格 |
| C | video + brands + **文本/媒体 article** + services | access-solutions（P0=2）、electrical-products（P0=2） | 缺 "Smart Access Control…" / "Fastening Elements for Electrical Engineering" |
| D | video + **资源/下载列表 article** + services | fluid-management（P0=0 P1=2）、sealing-technology（P0=2） | 缺 "White Papers" / "Technical Resources for Sealing Technology" |
| E | video + **图标卡 article** + **手风琴 article** + services（**无品牌网格**） | embedding-and-surface-bonding-fasteners（P0=3） | 缺 "Advantages of bigHead®"（5 张图标卡）与 "Design and Installation"（手风琴） |

> **下一步（单独立项）**：① data 增加 `order` 字段（块的有序列表），模板按顺序渲染；
> ② 新增 3 个区块组件：`ProductGrid`（商品卡网格）/ `FeatureCards`（图标卡）/ `LinkList`（资源列表），
> 手风琴富文本并入 `RichText` 的新 kind；
> ③ `gen-category-detail.mjs` 把"其它 `<article>`"按形态归类进这 3 个新字段。
>
> 参考站真实 DOM 嵌套用 `node scripts/ref-dom-tree.mjs qa/ref/category-detail-<slug>.html` 看（输出到控制台，
> 不要整读 400KB+ 的 `qa/ref/*.html`）。

---

## 3. 通用禁则

- **公共组件零改动**：页头 / 页脚 / 导航 / `global.css` / `src/config/site.ts` 不属于页面任务范围。差异记 `qa/DEVIATIONS.md`，单独立项。
- **data 与结构分离**：文案改动只动 data，样式改动只动组件。
- **组件不硬编码内容**：只接受 data 传入。
- **target 禁止手写**：一律 `scripts/gen-target.mjs` 生成。
- **公共组件差异**：页脚实测高 609 vs 参考 517（+68px），全站已知，记 `qa/DEVIATIONS.md`，不夹带进页面任务。

---

## 4. 新类型登记模板

新增 pageType 时在本表追加一节，并同时补齐：组件目录、data 文件、target 文件、`docs/visual-qa.md` 记录、`HANDOFF.md` §1 已完成清单。

### 1.8 services-sub — 服务子页（CMS-block 家族）

**路由**：`/global-en/services/<family>/<slug>/`（family = smart-factory | engineering）

**适用**：参考站把整页拆成一串 CMS 区块（视频、图标卡、横向卡片轨、benefits 网格、logo 轨、图文交替行、FAQ、CTA 面板、相关主题）。区块顺序与标签必须与参考站一致。

**构成**：
- 数据 `src/data/services-sub/<slug>.ts` —— 由 `scripts/gen-services-sub.mjs` 从 `qa/ref/<page>.html` 生成，每块带 `kind` 判别字段；文本块额外带 `tag`（参考站原始元素标签）。
- 渲染器 `src/components/sections/services-sub/ServiceBlocks.astro` —— `RENDERERS` 表按 `kind` 返回 HTML 字符串，模板用 `<Fragment set:html={...}>` 注入（Astro 模板不能放裸 HTML）。
- 路由 `src/pages/global-en/services/[family]/[slug].astro` —— `getStaticPaths()` 用 `props: { page }` 传数据。

**已交付 4 页**：smart-factory/inventory-management、smart-factory/smart-assembly、engineering/fastening-composites、engineering/engineering-services。

**坑**：验收脚本 `measure-page.mjs` 的选择器是 `main article, main > section` 并按**索引**逐行比对 —— 参考站用 `<article>` 包文本块，本地若渲染成 `<div>` 该行整行 MISSING 且后续行索引错位。故 `parseRichText()` 必须保留参考站原始标签，渲染器按 `b.tag` 输出同标签元素。


### 1.9 industries-aerospace（行业子页：hero 带图 + 3 teaser + 新闻 + 视频 + 支持卡 + 联系手风琴 + 2 个链接网格）
**路由**：`/global-en/industries/aerospace/`
**参考站**：https://www.bossard.com/global-en/industries/aerospace/ （Bossard Aerospace）

**9 个区块**（实测 1440×1000）：

| # | 区块 | y | h | 标题 | 组件 |
| --- | --- | ---: | ---: | --- | --- |
| hero | Welcome to Bossard Aerospace | — | — | h1 64px + 图 634×507 (5:4) | `industries-aerospace/Hero.astro` |
| 1 | Aerospace Fastening Solutions | 829 | 865 | H2 32px | 复用 `industries/IndustryCards.astro` |
| 2 | Supplier Network | 1694 | 865 | H2 32px | 同上 |
| 3 | Working at Bossard Aerospace | 2560 | 865 | H2 32px | 同上 |
| 4 | News Overview | 3473 | 774 | H2 44px | `industries-aerospace/NewsOverview.astro` |
| 5 | Your Trusted C-Parts Management Partner | 4295 | 903 | H2 44px | `industries-aerospace/CpartsVideo.astro` |
| 6 | How We Support You in Aerospace Manufacturing | 5238 | 512 | H2 44px | `industries-aerospace/SupportCards.astro` |
| 7 | Bossard Aerospace Contacts | 5866 | 610 | H2 44px | `industries-aerospace/ContactsAccordion.astro` |
| 8 | Product Solutions | 6533 | 344 | H2 24px | `industries-aerospace/LinkCardGrid.astro` |
| 9 | About Bossard Aerospace | 6877 | 344 | H2 24px | 同上 |

**产出**：
- **data** `src/data/industries-aerospace.ts` ← 生成器 `scripts/gen-industries-aerospace.mjs`（`npm run gen:industries-aerospace`）
  输入 `qa/ref/industries-aerospace.html` + `public/images/industries-aerospace/_manifest.json`
- **组件** `src/components/sections/industries-aerospace/`：`Hero` / `NewsOverview` / `CpartsVideo` / `SupportCards` / `ContactsAccordion` / `LinkCardGrid` / `RichTextSlot`
- **页面** `src/pages/global-en/industries/aerospace.astro`（与 `industries.astro` 同级目录并存）

**三条坑**（本页特有，写生成器/组件时必看）：
1. **参考站是 Astro 站点**：同一份 `.html` 里既有 island 的 JSON payload 也有渲染后 HTML。通用 DOM 解析会同时吃到两段，且 `<br>` 会在栈式解析里丢失 → 本页生成器对「联系手风琴」走 raw HTML 切片 + 正则，其余区块走 `html-tree.mjs`。
2. **空 rich-text 槽位**：参考站有 3 个 `<div class="container-fluid"><p class="text-p pb-12 text-gray lg:pb-20 max-w-rich-text"></p></div>`（CMS 字段为空但仍占 20px）。少一个，后面所有区块就上移 20–60px → `RichTextSlot.astro`。
3. **support 卡实测 220px**：参考站 class 写的是 `h-[210px]`，但浏览器里盒子高 220px（图标 y、标题 y、区块底边三处独立测量一致）→ 本地按 220px 复刻。

**验收**：`npm run measure -- /global-en/industries/aerospace/ --target qa/targets/industries-aerospace.json` → P0=0 / P1=0

