# HANDOFF — 会话交接（唯一入口）

> 给新会话的 AI：**只读本文件**（≈2K token），其余按 §5 索引按需读**单个**文件，禁止通读。
> 开工前先输出 §6 的 6 行契约；红线见 `.clinerules/.clinerules.md` §5、§6。

## 0. 现状

| 项 | 值 |
| --- | --- |
| 项目 | `C:\Users\Administrator\Desktop\Titanium-Fasteners`（Astro 5 + Tailwind 4） |
| 目标 | https://fastener.bozemetal.com（bozemetal.com 紧固件产品线），品牌 Titanium Fasteners |
| 字体 | Archivo (SIL OFL) —— 参考站 DIN 为商业授权，禁用 |
| 参考站 | https://www.bossard.com/us-en/（**布局原型**，非内容来源） |
| 阶段 | Phase A = 1:1 照抄参考站（文案逐字原文，图片/图标/Logo 下载后本地化落盘）；Phase B = 上线前按 `qa/DEVIATIONS.md` 批量替换自有内容 |

**复刻 ≠ 继承 ≠ 改版**：视觉 100% 来自参考站实测值；Phase A 内容同样照抄；信息架构照抄参考站的**解决方案导向**结构，不得改写为产品目录；姊妹项目（cnc.bozemetal.com）仅提供技术栈与构建脚本，其 slate/teal 主题禁用；Phase A 期间禁止任何主观优化，待替换项随页面验收逐条记入 `qa/DEVIATIONS.md`。

## 1. 已完成（勿重做）

基座 `package.json`/`astro.config.mjs`/`tsconfig.json`/`scripts/astro-build.mjs` ｜ 令牌 `src/styles/global.css`（@theme = Bossard 实测值，**事实源**）｜ 配置 `src/config/site.ts` ｜ UI `src/components/ui/` ×8（Container, Button, Figure, SectionHeading, Card, RichText, Accordion, MediaCalloutPair）｜ 布局 `src/components/layout/` ×8（SiteHeader, PrimaryNav, MegaMenu, HeaderUtility, SiteFooter, BackToTop, CookieConsent, Logo）｜ 首页 `src/pages/index.astro` + `src/components/sections/home/` ×7 + `src/data/home.ts` ｜ **Phase B 产品系统**（2026-11-11 重建；替代并删除了 Phase A 的产品页副本）：真相源 `data/products/*.csv`（categories / **families 产品表（8 列：family_id,name,category,standards,materials,finishes,description,image —— **第 8 列 = 客户原图名**，落盘名 `<SKU>-<原名>`；type/seo 派生）** + **management 管理表（10 列：family_id,status,moq,packaging,lead_time,price_from,price_to,price_currency,price_unit —— 状态与商务数据与产品表分开，商务字段当前为空、族页不渲染占位假价）**** / materials / finishes / standards / param-schema / dimension-library / sku-codes + `_template/` + `dimensions/<family_id>.csv`）→ 生成器 `scripts/gen-products.mjs`（闸门 E001–E031 + `category-view.ts` 视图产物 + `assets.ts` 素材登记簿）→ `src/data/products/**`（生成物，禁手改）｜ **SKU 规范：族级 `TI-<family_id 大写>`**（唯一/稳定/可念；标准与材质是属性不是码）｜ **素材绑定：文件名 `<SKU>-<原名>.<ext>`**，扫描 `public/` 自动绑定，孤儿素材 E030 阻塞构建、缺图 W001 不阻塞；规则只在 `scripts/lib/assets.mjs` 一份（生成器与 CLI 共用）｜ **2026-11-11 client-confirmed：族级 SKU / 素材按 SKU 前缀 / 只留 8 列 CSV 录入格式 / 产品表与管理表分表（families = 产品核心信息，第 8 列 = image 原图名；management = 状态与商务数据）—— 已定稿，勿再改口径、勿引入第二种录入格式**｜ 页面：`src/pages/global-en/eshop.astro`（总览）+ `src/pages/global-en/eshop/c/[category].astro`（分类）+ `src/pages/global-en/eshop/p/[family].astro`（族），**全站统一形态 `/global-en/eshop/`**（禁止任何跳转/重定向）｜ 复用 `sections/category/` ×3（CategoryCardRail / ProductCard / ProductGrid）—— 版式不动，只把数据源从手写 `src/data/category.ts` 换成生成产物；ProductGrid 的左侧筛选栏改为**真能用**（`<details>` 折叠 + 多选 + URL 同步 + 无 JS 渐进增强）｜ 族页复用 `sections/product-family/` ×3（FamilyHero / FamilySpecTable / FamilyInquiry）｜ CLI `scripts/products.mjs`（`npm run products -- list\|cat-add\|cat-rm\|fam-add\|fam-set\|fam-rm\|spec-add\|spec-rm\|export\|bulk-import\|assets\|validate`，每次写完自动跑闸门）+ 共享库 `scripts/lib/csv.mjs` / `scripts/lib/assets.mjs`｜ **批量录入唯一格式：8 列 CSV 模板**（`name\|category\|standards\|sizes\|materials\|finishes\|description\|image`；第 8 列 = 客户原图名，原图丢进 `public/images/products/_inbox/`，导入按 `<SKU>-<原名>` 自动改名认领 —— 客户不需要知道 SKU；type/family_id/SKU/图路径/工程尺寸全派生，`sizes` 迷你语法 `M4x6`/`M4x7x4`/`5x10x1`，尺寸从 `dimension-library.csv` 查）｜ 手册 `docs/PRODUCT-MANUAL.md`｜ 验收器 `scripts/measure-page.mjs`（CDP 驱动 Chrome，零依赖）｜ 复刻流水线 `scripts/ref-report.mjs`（probe JSON → 分片报告）、`scripts/ref-dom-tree.mjs`（参考 HTML → <main> DOM 大纲）、`scripts/gen-category-detail.mjs`（参考 HTML → 品类子页 data + 索引）、`docs/PAGE-TYPES.md`（6 种页面类型注册表 + 12 个品类子页 slug 清单）｜ 品类子页类型 `src/pages/global-en/product-solutions/product-categories-and-brands/[slug].astro` + `src/data/category-detail/`（types + index + 每页一份）+ `src/components/sections/category-detail/` ×3（PageHero, VideoBlock, RichText；品牌网格/服务卡片复用 pcab 组件）；已交付 direct-assembly-screws（3 区块 dy 3/0/−1，dh −3/0/4，P0=0 P1=0）｜ SOP `docs/RECIPE.md`（阶段 0–5 + 类名映射速查 + 禁则）｜ 台账 `docs/visual-qa.md`、`qa/DEVIATIONS.md`、`qa/targets/<page>.json`｜ 服务总览页 `src/pages/global-en/services/index.astro` + `src/data/services.ts` + `sections/services/` ×2（ServiceGrid, BenefitsGrid；3 区块 dy −104（恒定）dh=0，P0=0 P1=0）

## 2. 下一步（按序，P0=0 才进下一个）

1. **复测首页**确认区块 6 = 1169 —— `npm run measure:home`（区块 6 已把 `lg:gap-y-386` 改为 `lg:gap-y-222`，已构建未复测）
2. **移动端**抽屉 `MobileNav.astro` + 390px 验收 —— `npm run measure -- / --viewport 390x844`
3. **产品分类总览页**（参考实测已备好）：`qa/ref/product-categories-and-brands.json` + `qa/targets/product-categories-and-brands.json` → 写 `src/data/product-categories-and-brands.ts` + `src/components/sections/product-categories-and-brands/` + `src/pages/global-en/product-solutions/product-categories-and-brands.astro`（结构：Hero + 「Discover Our Product Categories」y=993 h=1444 + 「Buy Fastening Elements」y=2485 h=446）
4. **12 个品类子页**（`category-detail` 类型）—— 模板已就绪，剩 11 页：`npm run recipe -- https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/<slug>/ category-detail-<slug>` → `node scripts/gen-category-detail.mjs <slug>` → `npm run build` → `npm run measure -- /global-en/product-solutions/product-categories-and-brands/<slug>/ --target qa/targets/category-detail-<slug>.json`。slug 清单见 `docs/PAGE-TYPES.md` §2；**已交付 1/12**（direct-assembly-screws，P0=0 P1=0）
5. **服务页**（✅ 总览页已交付：`/global-en/services/`，P0=0 P1=0）→ 子页（Smart Factory / Engineering / Benefits 详情页）与**行业页 / 知识文章页 / 联系页**（后三者尚无实测 = 证据缺口）
6. **等客户交付真实产品数据与素材**（当前只有 2 个占位族、34+6 行规格）：清单按 `data/products/_template/product-import.csv` 填 → `npm run products -- bulk-import <file.csv> --dry` 先看 → 真跑 → 原图丢进 `public/images/products/_inbox/`，模板第 8 列写它的文件名 → 导入自动改名成 `<SKU>-<原名>`（CAD/PDF 同理，`<SKU>` = `TI-<family_id 大写>`）→ `npm run products -- assets` 复核 → `npm run products -- fam-set <id> --status=published` → build。归属表与参数系统见 **`docs/PRODUCT-MANUAL.md`**
7. **给 preflight 补 Phase B 分支**：`npm run preflight -- eshop` 目前 **FAIL 3/7** —— `dom`/`copy`/`assets` 三项查的是 **Phase A 参考站产物**（`qa/report/<slug>/08-dom-tree*.txt`、`02-texts.txt`、`05-links.txt`、`public/images/<slug>/_manifest.json`），而 Phase B 不再使用参考站几何（`.clinerules` §0.2）。要么给 preflight 加 Phase B 分支（自有基线 = 结构完整性 + 数据闸门 + 链接可达），要么产品区改用 `npm run products -- validate` 当闸门。**本次未改** —— 改 preflight 会波及全部 Phase A 页面，超出本次 OUT
8. **清 astro check 的 16 条 Phase A 类型债**（本次未动，不在产品范围）：`industries.astro`(5) / `industries/aerospace.astro`(3) / `product-solutions/index.astro`(2) / `product-solutions/special-parts-and-custom-fasteners.astro`(3) / `services/index.astro`(2) / `industries/IndustryContact.astro`(1) —— 全部是 `ts(2322)` 字面量收窄（`span: string` → `"wide"|"narrow"`、`ratio: string` / `kind: string` → 联合类型）。修法：在对应 data 层给这些字段加 `as const` 或显式联合类型

每页标准流程（实测参考站 → 写 target → 实现 → measure 到 P0=0）见 `docs/RECIPE.md`。

## 3. 实测速查

- **设计令牌**：事实源 = `src/styles/global.css` 的 `@theme`。易错点：`--spacing: 1px`（非默认 4px）；断点 360/600/840/1024/1280/1440；`--text-*` 变量不响应式，须 `@utility` + `@variant lg`。
- **首页 7 区块规格 / 6 个页面模板 / 图片比例 / 首页逐区块验收表** → `docs/visual-qa.md`（参考站实测存档节）
- **验收基线** `qa/targets/<page>.json`（`gen-target.mjs` 生成，禁止手写）｜**参考站原始实测** `qa/ref/*.json`

## 4. 陷阱清单（踩过的坑）

| 坑 | 表现 | 解法 |
| --- | --- | --- |
| `--spacing` 默认 4px | 所有间距大 4 倍 | `@theme` 设 `--spacing: 1px` |
| `--text-*` 变量不响应式 | 1024px 字号不换挡 | 用 `@utility` + `@variant lg` |
| Tailwind 默认断点 | `md:` 768px 触发 | 覆盖 6 个断点 |
| `w-screen` 含滚动条宽 | 横向溢出 8px | 负 margin 出血 |
| flex 容器内 `aspect-ratio` | 图塌陷为 0px | `Figure` 设 `flex: none` |
| 文件名含点号 `hero-2.006.svg` | 404 破图 | 改名 `hero-ratio-2-006.svg` |
| 嵌套 `<main>` | header 被拉进文档流 | BaseLayout 不包 `<main>` |
| Windows 小写盘符构建 | 零 CSS 却报成功 | 必须 `npm run build`（走 astro-build.mjs） |
| PowerShell `$1` 被 shell 吞 | 文件内容损坏 | 不用 `$1` 做替换 |
| `read_files` 读 UTF-16 日志 | 乱码占 token | `Out-File -Encoding utf8` 再针对性 grep |
| 成品素材被"再设计"一遍 | 用户给图我却重做矢量资产 | 契约 OPS 只写 转码·裁切·缩放·指向引用（§5.2） |
| 完工后继续跑 measure/截图 | 令牌空转、越界改文件 | DONE 一成立即收据停手；验证 ≤2 条（§5.3/§5.4） |
| 改稿整篇重发 / 内部推理泄漏进正文 | 同一交付物在一条消息出现两遍，token 翻倍且无法交付 | 一轮只发一个交付物；只动被点名段落；发送前自检（§6） |
| 索引/文档指向不存在的文件 | 每个新会话照着索引去找、读、搜，全部空转 | 索引只列现存文件；写入前先确认路径存在 |
| 每轮必读文件过长 | 开工即烧 ~9.5K token | HANDOFF 只留状态/下一步/陷阱/索引，细节移出并按需读 |
| `qa/` 里留了备份 `.astro` | `astro check` 把它们一起扫，11 条假错误 | Phase A 的 `qa/backup-home-sections/` 已删；`qa/` 下不放 `.astro` |
| `astro.config.mjs` 是纯 JS | 写 TS 注解 → 配置加载失败 → build 全崩 | 要类型就用 JSDoc：`/** @type {string[]} */` |
| CLI 写操作「先写盘再校验」 | 一次被拒绝的命令把半成品族留在真相源里 | 先全量校验、再落盘（`scripts/products.mjs` fam-add 已按此实现） |
| 页面输出 noindex 却进了 sitemap | 索引信号自相矛盾 | `routes.json` 增加 `draftOverview`，`astro.config.mjs` 同步过滤（sitemap 与 robots 必须一致） |
| 编辑器工具改大文件时插错位置 | 把常量块插进对象字面量中间 → 语法错 → 事后难定位 | 改生成器/文档用 Node 行级手术（按标记 splice），不用大块 old_text 替换 |
| 编辑器工具的 diff 残留 | 表格行多出 `| | ` 行首、代码块被插进 Markdown 表格 | 改完立刻回读文件；表格类文档宁可整篇重写 |
| `public/` 是站点根 | 素材 URL 写成 `/public/images/...` → 全部 404 | 对外 URL 去掉 `public/` 前缀（`scripts/lib/assets.mjs` 已处理） |
| 素材路径记在 CSV 里 | 图与产品可能对不上，且改图要改 CSV | 路径由 SKU 约定推导，扫描 `public/` 生成 `assets.ts`（记的会错，算的不会） |

## 5. 索引（按需读，禁止通读）

| 需要 | 读 |
| --- | --- |
| 复刻定义 / 姊妹项目边界 | 本文件 §0 |
| **单页复刻怎么开工** | **`docs/RECIPE.md`**（阶段 0–5 + 6 步命令 + 映射速查） |
| 完整设计令牌 | `src/styles/global.css`（`@theme`） |
| 首页 7 区块 / 页面模板 / 图片比例 | `docs/visual-qa.md` |
| 验收台账 / DOM 契约 | `docs/visual-qa.md` |
| 偏差台账（含 Phase B 待替换） | `qa/DEVIATIONS.md` |
| 页面类型注册表 / 品类子页 slug 清单（开工前必查：同类型页只写 data，不重做结构） | `docs/PAGE-TYPES.md` |
| 参考站快照 → 可读报告（避免读原始 JSON/HTML） | `node scripts/ref-report.mjs qa/ref/<page>.json` → `qa/report/<page>/*.txt` |
| 参考站 DOM 嵌套（确认真实父子关系） | `node scripts/ref-dom-tree.mjs qa/ref/<page>.html` → DOM 大纲 |
| 品类子页 data 生成（12 页共用模板） | `node scripts/gen-category-detail.mjs <slug>` → `src/data/category-detail/<slug>.ts` + 索引 |
| 验收基线 | `qa/targets/<page>.json`（脚本生成） |
| **加一个产品 / 产品数据归属 / 参数系统** | **`docs/PRODUCT-MANUAL.md`**（归属表 + CLI + 8 列导入模板 + SKU 与素材约定 + 闸门错误码） |
| 产品数据结构与字段字典 | `docs/PRODUCT-DATA.md` |
| 产品数据 CLI | `npm run products -- help` → `scripts/products.mjs` |
| 产品数据闸门 | `npm run products -- validate`（= `npm run gen:products`） |
| 批量导入模板与 id 对照表 | `data/products/_template/README.md`（模板：`data/products/_template/product-import.csv`） |
| 素材盘点（缺图 / 孤儿素材） | `npm run products -- assets` |
| 参考站原始实测 | `qa/ref/*.json` |

> 索引纪律：本表只列**现存**文件；新增条目前必须确认路径真实存在。

## 6. 开工契约（照抄 `.clinerules/.clinerules.md` §5.1）

```
GOAL: <原子目标，一句话>
IN:   <输入素材/路径>
OPS:  <允许的操作白名单>
OUT:  <产出文件清单>
DONE: <可机器判定的完成信号>
```

红线：验证类命令 ≤2 条；工具调用 ≤8 次（超限请示）；DONE 成立即出收据停手；临时文件收据前删净，合约外残留 = 0。

## 7. 命令速查

```bash
npm run build                  # 生产构建（必须用这个，走 astro-build.mjs）
npm run preview                # :4321
npm run check                  # astro check
npm run measure:home           # 首页对比验收
npm run measure -- /<route>/ --target qa/targets/<page>.json
npm run recipe -- <ref-url> [page]   # 一条命令：探针 + 原始 HTML + 素材 + target
```

## 8. 近期日志

- **2026-11-06** p/272 交付并复测 P0=0 P1=0（区块 2 = 912/1537，参考 912/1534）；修复 3 处：① 面包屑 `opacity-1` 在 Tailwind v4 等于 1%（computed 0.01）→ 改 `opacity-100` ② 属性名缺失 → data 层改 `{label,value}`，标签落值左侧 244px 列 ③ Variants 表头改带边框 `<details>` 手风琴 + 浅蓝提示面板 + 放大镜/下拉箭头。**遗留**：分类页 `src/pages/products/bolts.astro` 用了同样的 `opacity-1`，其面包屑同样不可见（一行修复，未改）。
- **2026-11-06** product-categories-and-brands 重跑 recipe 三段全过，**新旧 target 逐字段一致**（参考站无漂移）：区块1 y=993 h=1444、区块2 y=2485 h=446、body 3493px、footer 517px、h-overflow 0；素材 manifest 19 条 ↔ 落盘 19 个文件全命中、孤儿 0；**manifest 末条 `23-https-bat-bing-com-action-0-*.webp` 是 Bing 追踪像素、0 字节，勿引用**；原临时日志已按新规则清理（结论已收敛进本条 + `qa/targets/product-categories-and-brands.json`，不再落盘原始日志）。
- **2026-11-06** 导航两项修正：页头**不再滚动收起**（偏离参考站，已记 `qa/DEVIATIONS.md`）；`<main>` 由 `pt-195` 改为 `pt-48 md:pt-91`，实测间距首页 40px / eshop+详情页 12px / 分类页 36px。
- **2026-11-06** 共享 `SiteFooter` 高 609 vs 参考 517（+68px 正文高度，非页面区块问题，公共组件差异）。
- **2026-11-05** 项目切换到 Phase A（1:1 照抄）；旧的「内容自有」首页实现备份到 `qa/backup-home-sections/`。



- **2026-11-09** 品类子页类型（`category-detail`）落地并交付第 1/12 页：模板 `src/pages/global-en/product-solutions/product-categories-and-brands/[slug].astro` + `src/components/sections/category-detail/`×3 + `src/data/category-detail/`（types/index/每页一份），direct-assembly-screws 实测 **P0=0 P1=0**（3 区块 dy 3/0/−1、dh −3/0/4）。关键管线：`scripts/gen-category-detail.mjs` 直接从参考 HTML 生成 data（不再手抄 15 个品牌卡），`scripts/ref-report.mjs` + `scripts/ref-dom-tree.mjs` 把 probe JSON/HTML 投影成可读报告（避免读原始 480KB HTML）。新增工具类 `text-h6-s` / `text-list-l` 到 `src/styles/global.css`。
### 2026-11-09 process rule (product-categories-and-brands)
本页复刻耗时 >1h / 26M token，根因与硬规则：解析参考快照只用 node 脚本落盘再读（禁用 PowerShell 内联正则/引号转义）；单文件写入 >150 行改用脚本一次性生成（编辑器会截断）；每个原子任务 <=8 次工具调用、<=2 次 build+measure；参考 JSON 的字段一次性全量导出成 txt 再读，禁止逐条 grep 试探。
- **2026-11-09** 规则层新增 §7“Page Recreation — Execution Budget”（.clinerules/.clinerules.md 第 112–186 行，8 小节：Reference Reading / Context Control / Atomic Execution / File Generation / Visual Verification / Stop Conditions / Page-Type Reuse / Cost Accounting）；§1–§6 原文逐字未变（head SHA 0367f99d… 前后一致）。本条为 §3「规则变更形态只记 HANDOFF 一行」留痕。
- **2026-11-09** `securing-and-anti-loosening-elements` 重跑 recipe 三段全过（1440x1000）：probe → `qa/ref/securing-and-anti-loosening-elements.json`（96.1KB）+ `.html`（429.3KB；2 sections / 12 figures / 21 images / 11 sprites / 2 grids / 162 texts / 46 links）；assets 19 源候选 → 落盘 `public/images/securing-and-anti-loosening-elements/` 15 个文件（14 图 + `_manifest.json`，148.7KB），**manifest 末条 `19-https-bat-bing-com-action-0-*.webp` 是 Bing 追踪像素、勿引用**；target → `qa/targets/securing-and-anti-loosening-elements.json`（body 3888px、footer 517px、h-overflow 0、区块1 y=1801 h=976 head 44px、区块2 y=2910 h=418 head 21.008px）。本次仅跑管线，未建页面；临时日志已清理。
- **2026-11-09** 品类子页第 2/12 页交付：securing-and-anti-loosening-elements（复用模板，零新增组件）。管线 `npm run recipe -- <url> category-detail-<slug>` → `node scripts/gen-category-detail.mjs <slug>` → build+measure，实测 **P0=0 P1=0**（2 区块 dy 0/0，dh 0/+4；body 3880 vs 参考 3888；无坏图）。**关键修复**：参考站本页没有视频文章块，首版无条件渲染 VideoBlock → 多出 855px 空 article（+1 张 src="" 坏图），导致 probe 区块表整体错位一格；模板改 `page.video.thumbnail && (<VideoBlock/>)` 条件渲染（有视频页行为不变）。已知偏差（−176px 恒定偏移、hero 第 12 个 figure 未渲染）记 `qa/DEVIATIONS.md`，验收记录见 `docs/visual-qa.md`。


- **2026-11-09** 品类子页剩余 10 页**全量跑通管线**（recipe → gen → build → measure，批量串行）。结果：**P0=0 P1=0 共 4 页**（direct-assembly-screws / securing-and-anti-loosening-elements / rivet-technology / threaded-inserts）；**P0=0 P1>0 共 2 页**（clinching-technology P1=3：参考站富文本在视频块之前、模板放在之后，差 ≈341px；fluid-management P1=2：缺 "White Papers" 块）；**P0>0 共 6 页**（access-solutions / electrical-products / sealing-technology / clip-fasteners / welding-technology / embedding-and-surface-bonding-fasteners）——根因统一：**参考站这 12 页不是同一个结构**，现有 data 模型（hero/intro/video/richText/brands/note/services）表达不了参考站另外 4 类 `<article>`（商品卡网格 / 文本媒体块 / 资源列表 / 图标卡+手风琴）。变体表与下一步方案见 `docs/PAGE-TYPES.md` §2.1，验收记录见 `docs/visual-qa.md`。本轮代码改动：① `scripts/gen-category-detail.mjs` 网格判定改为"section 必须含 `<a>`"（修掉 embedding 的 `a.attrs` 崩溃 + 图标卡网格误判）；② `[slug].astro` 品牌网格为空时不输出空 article、video 块按 `page.video.thumbnail` 条件渲染。

- **2026-11-09** `special-parts-and-custom-fasteners`（Bossard「特殊零件与定制紧固件」页）跑 recipe 三段全过（1440x1000）：probe → `qa/ref/special-parts-and-custom-fasteners.json`（210.5KB）+ `.html`（573.8KB；10 sections / 68 figures / 72 images / 13 sprites / 2 grids / 205 texts / 38 links；body 6089px、h-overflow 0、footer 517px）；assets 75 源候选 → 落盘 `public/images/special-parts-and-custom-fasteners/` 44 个文件（43 图 + `_manifest.json`，manifest 43 条全命中、孤儿 0），**其中 `75-https-bat-bing-com-action-0-ti-*.webp` 是 Bing 追踪像素、0 字节，勿引用**（真实图 42 张）；target → `qa/targets/special-parts-and-custom-fasteners.json`（10 区块，其中 5 区块无标题 → y=0 h=0；有标题的 5 区块：y=892 h=561、y=2121 h=386、y=2819 h=386、y=3433 h=273、y=5336 h=144 head 21.008px）。本次仅跑管线、未建页面；临时日志与 probe 临时 profile 已清理。



- **2026-11-09** 修复导航下拉菜单渲染出的杂字符 ): }（多余闭合符）：src/components/layout/MegaMenu.astro 末尾多出的右括号/右花括号被 Astro 当作纯文本输出，已删除；生成器 scripts/write-megamenu.mjs 同步删除多余行（防回归）。验证：模板括号平衡 curly=0/paren=0，npm run build 输出 Complete!。
- **2026-11-09** `product-solutions`（Bossard「产品解决方案」总览页）跑 recipe 三段全过（1440x1000）：probe → `qa/ref/product-solutions.json`（65.6KB）+ `.html`（372.5KB；3 sections / 5 figures / 14 images / 12 sprites / 2 grids / 120 texts / 39 links；body 3806px、h-overflow 0、footer 517px、header 0px static）；assets 12 源候选 → 落盘 `public/images/product-solutions/` 9 个文件（8 图 + `_manifest.json`，manifest 8 条全命中），**其中 `12-https-bat-bing-com-action-0-ti-*.webp` 是 Bing 追踪像素、勿引用**（真实图 7 张，含 2 张 Bossard logo SVG）；target → `qa/targets/product-solutions.json`（3 区块：「Product Categories and Brands」y=604 h=865 head 32px、「Coatings」y=1469 h=865 head 32px、「Buy Fasteners Online」y=2335 h=911 head 44px）。本次仅跑管线、未建页面；临时日志已清理。
- **2026-11-09** 规则层新增 §6「禁止在对话里回显大段代码」三条硬规则（.clinerules/.clinerules.md 第 112-117 行：No Large Code Echo / Code-Creation Channel / Batch-Run Reporting）；§1-§5、§7 原文未动，插入点在 §6 末尾、§7 标题之前。动机：上一轮在聊天里回显大段源码导致平台输出 token 触顶中断。本条为 §3「规则变更形态只记 HANDOFF 一行」留痕。
- **2026-11-09** 新增检索硬闸门：scripts/lib/safe-read.mjs + scripts/safe-grep.mjs（npm run grep）—— 拒绝扫描 qa/ref/*.html、qa/ref/*.json 走字段投影、行截断 200 字符、命中封顶 20；.clinerules §1 已加 HARD GATE 条目。
- **2026-11-09** product-solutions 页交付（P0=0/P1=0，dy/dh 全 0）：新增 src/data/product-solutions.ts + src/components/sections/product-solutions/{SolutionCards,EshopCallout}.astro + src/pages/global-en/product-solutions/index.astro；新增规则 §8 勘察预算与收敛；docs/visual-qa.md + qa/cost-log.jsonl 已记录。

- **2026-11-09** 【fastener-coatings】交付：/global-en/product-solutions/components-specific-solutions/fastener-coatings/（P0=0/P1=0，dy/dh 全 0，body 4257 vs 4261）。新增 data + PageHero/CoatingTypes/CorrosionCallout/WhitePapers 四个组件 + 路由页；该页面引入了面包屑中间项为 <button> 的新特征。
- **2026-11-10** 【innovations】交付：/global-en/product-solutions/innovations/（P0=0/P1=2，dh 全 0，body 3534 vs 3530，h-overflow 0）。新增 src/data/innovations.ts + src/components/sections/innovations/{PageHero,InnovationsCarousel,OfferGrid,NextStepCta}.astro + src/pages/global-en/product-solutions/innovations.astro。两个 P1 均已归因、均非版式缺陷：block1（闭合态 overlay dialog 内的 0×0 `<article>`）吃到 `measure-page.mjs` 的平滑滚动残留 +87px；block2 dy −161 = 全站顶部留白差 −104（qa/DEVIATIONS.md 第 12 行，用户已确认）+ 字体替换首段少 1 行 −32 + 区块间距 −25。验收记录见 docs/visual-qa.md。
- **2026-11-10** `services`（Bossard「服务总览」页）跑 recipe 三段全过（1440x1000）：probe → `qa/ref/services.json`（79.4KB）+ `.html`（389.7KB；3 sections / 10 figures / 147 texts / 43 links；body 4853px、h-overflow 0、header 0px static、footer 517px）；assets 13 源候选 → 落盘 `public/images/services/` 13 个资源文件 + `_manifest.json`（manifest 13 条全命中、孤儿 0；真实图 12 张 = 5 webp + 5 图标 svg + 2 bossard logo svg）；target → `qa/targets/services.json`（3 区块：「1 Inventory and C-Parts Management」y=604 h=865 head 32px、「2 Fastening Composites」y=1469 h=865 head 32px、「3 Explore Your Benefits」y=2383 h=742 head 44px）。**`17-https-bat-bing-com-action-0-*.webp` 是 Bing 追踪像素、0 字节，勿引用**。本次仅跑管线、未建页面；下一步：写 `src/data/services.ts` + `src/components/sections/services/` + `src/pages/global-en/services.astro`，再 build+measure 到 P0=0。

- **2026-11-10** 【服务子页】交付 9 页：benefits 家族 5 页（`/global-en/services/benefits/<slug>/`，生成器 `scripts/gen-services-detail.mjs` → `src/data/services-detail/benefits-*.ts` + `sections/services-detail/{ServiceHero,ServiceStep,TcoCallout}.astro`）与 CMS-block 家族 4 页（`/global-en/services/<family>/<slug>/`，生成器 `scripts/gen-services-sub.mjs` → `src/data/services-sub/*.ts` ×4 + `sections/services-sub/ServiceBlocks.astro` + 路由 `[family]/[slug].astro`）。build 通过（33+ 页）。measure 四页 h-overflow=0，P0 3/6/6/3（多数为参考站零高度基线行 MISSING 与区块内行高差，见 docs/visual-qa.md「服务子页」节）。已修根因：生成器 `parseRichText()` 现保留参考站原始标签（`tag` 字段），渲染器按 `b.tag` 输出 `article`/`div`，使 measure 的 `main article, main > section` 索引逐行对齐。遗留：4 页 YouTube video 海报图未落盘（外网不可达，远程 URL 存于 `posterSrc`）。页型已登记 docs/PAGE-TYPES.md §1.8。
- **2026-11-10** 【industries】交付 `/global-en/industries/`（P0=0 P1=0，5 区块 dy −104 恒定偏移已扣除、dh 全 0，body 6888，h-overflow 0）。新增 `src/data/industries.ts`（**脚本生成** `scripts/gen-industries.mjs`，`npm run gen:industries`）+ `src/components/sections/industries/{IndustryCards,DataCentersCallout,IndustryContact}.astro` + `src/pages/global-en/industries.astro`。页型已登记 docs/PAGE-TYPES.md §1.8。**本轮同时完成「根治」改造**：新增 `scripts/lib/session-budget.mjs`（会话预算账本）+ `scripts/preflight.mjs`（开工闸门，五项充分性机械化，❌ 退出码 2）+ `npm run gen:industries` / `npm run budget` 两个 npm 脚本；`.clinerules/.clinerules.md` 由 ~200 行散文瘦身到 ~90 行「可执行闸门清单」（每条硬约束对应一个命令，不再靠模型自律）。开工前跑 `npm run preflight -- <slug>`，❌ 即禁止写入。
- **2026-11-10** `industries`（Bossard「行业」总览页）跑 recipe 三段全过（1440x1000）：probe → `qa/ref/industries.json`（98.0KB）+ `.html`（429.3KB；5 sections / 10 figures / 19 images / 12 sprites / 4 grids / 159 texts / 44 links / 23 buttons；body 6808px、h-overflow 0、header 0px static、footer 517px）；assets 17 源候选 → 落盘 `public/images/industries/` 13 个资源文件 + `_manifest.json`（manifest 13 条全命中、孤儿 0；真实资源 12 个 = 10 webp + 2 bossard logo svg）；target → `qa/targets/industries.json`（5 区块：「1 Aerospace」y=604 h=865 head 32px、「2 Electric Vehicles」y=1469 h=865、「3 Medical and Life Science」y=2335 h=865、「4 Robotics」y=3200 h=865、「5 Data Centers」y=4065 h=913 head 44px）。**`17-https-bat-bing-com-action-0-*.webp` 是 Bing 追踪像素、0 字节，勿引用**。附加产物 `qa/report/industries/`（00–08 分片报告 + 247 行 DOM 大纲）。本次仅跑管线、未建页面；下一步：写 `src/data/industries.ts` + `src/components/sections/industries/` + `src/pages/global-en/industries.astro`（该页型尚未登记 `docs/PAGE-TYPES.md` §1）。

- **2026-11-10** `industries-aerospace`（Bossard Aerospace 行业子页）跑 recipe 三段全过（1440x1000）：probe → `qa/ref/industries-aerospace.json`（157.7KB）+ `.html`（557.7KB；9 sections / 25 figures / 35 images / 14 sprites / 7 grids / 237 texts / 74 links；body 7802px、h-overflow 0、footer 517px）｜ assets 29 条 → `public/images/industries-aerospace/` 28 个文件（10 webp + 18 svg）+ `_manifest.json`（manifest 28 条，缺 0；唯一失败是 YouTube `maxresdefault.jpg` 外网不可达）｜ target → `qa/targets/industries-aerospace.json`（9 区块：Aerospace Fastening Solutions y=829 h=865 head 32px … About Bossard Aerospace y=6877 h=344 head 24px）｜ **本页特有三条坑**：① 参考站是 Astro 站点，同一 html 内含 island JSON payload 与渲染后 HTML，且 `<br>` 在栈式解析里会丢失 → 联系手风琴改走 raw HTML 切片 + 正则，其余区块仍用 `html-tree.mjs`；② 参考站有 3 个**空 rich-text 槽位**（CMS 字段为空但仍占 20px），少一个后续区块就上移 20–60px → `RichTextSlot.astro`；③ support 卡参考站声明 `h-[210px]`，但浏览器实测盒子高 **220px**（图标 y / 标题 y / 区块底边三处独立测量一致）｜ 生成器 `scripts/gen-industries-aerospace.mjs`（`npm run gen:industries-aerospace`）→ `src/data/industries-aerospace.ts` + `src/components/sections/industries-aerospace/`（7 个组件）+ `src/pages/global-en/industries/aerospace.astro` ｜ build 一次 + measure 一次 → **P0=0 P1=0**（9/9 区块 dh=0，仅 News Overview dh=-5px 在容差内）｜ 顺带修复 `scripts/dl-assets.mjs`：原串行 fetch **无超时** → 改为有限并发(8) + 超时(12s) + 重试，修掉「CDN 挂起 → manifest 永不落盘 → 整段静默失败」｜ 记录 → `docs/PAGE-TYPES.md` §1.9

- **2026-11-11** 【一级分类页】交付 3 页：`/global-en/eshop/c/01/`（Fastening Technology，5 子分类，总 1408）、`/global-en/eshop/c/02/`（Specific Fastening Technologies，7 子分类，总 1078）、`/global-en/eshop/c/03/`（Functional Elements，4 子分类，总 2004）。做法 = 分类模板 `c/01.100.astro` 的**物理复制三份**（骨架逐行相同，各自内联标题/面包屑/子分类卡/产品总数），不新建组件、不新建 data 层；组件仅加两个**可选** prop（`CategoryCardRail.cards`、`ProductGrid.productCount`，默认值 = 模板数据 → 模板页 `c/01.100/` 零影响，仍 6 卡 / 709 / 18 命中）；零新增素材（卡轨图复用 `/images/eshop/*@480.webp`）。子分类计数 = 参考站实测值，产品总数 = 子项之和（01=1408、03=2004 与参考站实测逐位吻合）。**基线：当前 URL 是「1:1 复制参考站」的临时态，下一阶段整体重规划真实 URL —— 禁止任何跳转/重定向（已写入 `.clinerules` §5 硬禁区）；三个页面文件在 URL 重规划时整体迁移。**

- **2026-11-11** 【Phase B 数据层 + 分类树 + 筛选 + 可订购性】交付：data/products/categories.csv（5 分类）+ amilies.csv 新增 category/moq/packaging/lead_time/price_from/price_to/price_currency/price_unit 列；生成器 scripts/gen-products.mjs 加 E024–E028 闸门 + 分类素材检查 + search-index.ts（筛选索引，含显示标签，客户端不 import 数据层）；src/pages/products/index.astro 改为分类入口 + 筛选岛；新分类页 src/pages/products/category/[category].astro；新筛选岛 src/components/islands/ProductFilter.tsx（client:load，URL 同步用 replaceState，同维度并集/跨维度交集，线程精确多选 + 长度 min/max）；FamilyHero.astro 加「Ordering information」区块（四项全空则整块隐藏，JSON-LD 不写 offers）。**路由决策**：分类页用 /products/category/<id>/（多一层静态段）—— 因族路由已占 /products/<family_id>/，同层同段数两个动态参数 Astro 无法区分；族 URL 契约不变。sitemap 用 outes.json 的 draftCategories 与页面 noindex 保持一致（已实测 draft/published 两条路径）。gate 0 errors，build Complete。