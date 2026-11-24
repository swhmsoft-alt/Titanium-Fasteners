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

## 图片清理 + 本地→GitHub→cPanel 自动部署打通（2026-11-24）

- **Current Status**：前端未调用的图片已按「渲染产物引用」判据清理完毕（`public/images` 保留 **573** 张、删除 **431** 张）；`npm run build` **100 页 0 ERROR**；`npm run check:links` **187 known / 0 new**；`dist` 内 573 个图片引用 **0 缺失（零 404）**。部署链 `本地 → GitHub(main) → GitHub Actions → FTPS → fastener.bozemetal.com` 已跑通：CI 日志 `737 file(s) transferred` + 3 个关键文件服务器端 SIZE 校验通过，线上抽查 `titanium-screws-category-hero.webp`、`industries-data-centers/01-…webp`、`index.html`、`knowledge-hub/` 均 **200**，已删旧图 `25-bossard.svg`、`data-centers/42-…webp`、`social/facebook-logo.webp` 均 **404**。
  - **判据（务必沿用）**：删图只看 **dist 渲染后的 HTML 引用**，不看 `src` 里的字符串。源码中存在但页面不引用的图（如 `industries-sub/data-centers.ts`、`electric-vehicles.ts` 两个零 import 的死数据模块）不算“被调用”。这两个死数据文件已删除。
  - **数据源修正**：`data/products/categories.csv` 的 `pins` 行改指自有素材 `products/TI-DOUBLE-END-STUD-BOLTS-BZ-110-bolts-titanium.webp`；`src/data/services-sub/*.ts` 的 hero 与 video poster 改指各服务目录内**实际存在**的图（原来的 `video-poster.jpg` 已被清理）。
- **Next Step**：
  1. 服务器侧建议（可选，能让部署更快更稳）：让主机为 `fastener.bozemetal.com` 安装独立 SSL 证书（当前是 `*.rs4-va.serverhostgroup.com` 共享证书，TLS 主机名校验必然失败）；修复 `FTP_USERNAME` 账号的 home 目录（当前返回 `421 Home directory not available`）；放宽 pure-ftpd 的单会话传输限制。
  2. 若要清理线上旧文件：服务器已允许删除，上传脚本对 550 会先 DELE 再 STOR；线上冗余文件需 `SYNC_DELETE=true` 才清理（默认不动服务器上仓库没有的文件，避免误删 `.well-known` 等）。
  3. 本机 `git push` 到 `github.com` 的 git-https 端点当前不通（TCP 22 挂起、git-https 反复被中断），本次改用 **GitHub REST API 推送**（blob → tree → commit → ref），commit sha 与本地一致。
- **Known Pitfalls**：
  - `timeout-minutes` 写在 **workflow 顶层会被 GitHub 拒绝**（`Invalid workflow file: Unexpected value 'timeout-minutes'`），job 根本不创建，run 直接 failure 且 `jobs=0`。只能在 job 层。
  - basic-ftp 的 `client.uploadFrom()` **不接受 Buffer**（只收 stream），传 Buffer 会报 `source.once is not a function`。用 `Readable.from([buf])` 或 `createReadStream()`。
  - basic-ftp 的 `useTLS(options, command)` 参数顺序是 **options 在前**。
  - cPanel 子账号登录串是 `user@domain` 这种带 `@` 的形式。
  - 部署日志在 GitHub 上需登录才可见；本项目让 workflow 把日志写到 **`deploy-diagnostics` 分支**（`deploy-log.txt` 与 `deploy-logs/<sha>.txt`）与 **commit status**，用 `git fetch` / 公开 API 即可读取。
  - FTP 控制连接每传数十个文件就被服务器 FIN 关闭；`scripts/deploy-ftp-ci.mjs` 现在会每 25 个文件或 60 秒重连一次（重连后必须重发 `PBSZ 0` / `PROT P` / `TYPE I`，否则数据通道失去保护），并在重连前等待 4 秒让服务器回收被动端口。



- **目标**：移除 `/global-en/` 与 `/eshop/` 两层路径，产品区统一为 `/products/<category>/<family>/`。
- **真相源**：`scripts/gen-products.mjs`（`PRODUCT_ROUTE_BASE = '/products/'`，`familyRoute(category, id)` / `categoryRoute(id)`）。
- **页面移动**：15 个页面从 `src/pages/global-en/**` 移到 `src/pages/**`；新路由 `products/[category]/index.astro` + `products/[category]/[family].astro`。
- **新增闸门**：**E036** —— family_id 与 category_id 同名时拦下（Astro 路由冲突），位于 families 循环后。
- **生成物**：`src/data/products/**` 全部由 `npm run gen:products` 重生，未手改。
- **清扫**：67 个文件 / 750 处 `/global-en/` 前缀。保留：26 处 `https://www.bossard.com/global-en/...` 外链出处 + 3 处参考站路径注释。
- **残留死链**（本轮未处理，待单独立项）：128 条数字分类锚链（现为 `/products/01.300.500/` 形式）、`/knowledge-hub/eshop-information/`、`/global-en/eshop/p/1392/`。
- **验收**：`gen:products` 0 errors；`npm run build` 58 页 Complete!；sitemap 58 URL；dist 内 `/global-en/` + `/eshop/` 命中 0；canonical / og:url / JSON-LD 面包屑 4 层正确。

## 全站口径统一 + `/about-us/contact/` 死链清理（2026-11-17）

- **问题**：① 规格区间两套口径 —— `src/data/contact.ts` 写 **M1–M36**（含 M1），`src/data/about-us.ts` 写 **M1.6–M36**（M1–M1.5 按定制）；② 响应时效两套口径 —— `contact.ts` / `/contact/` 页写 **12 business hours**，`about-us.ts` Facts、`InquiryForm.tsx` 回执、`AboutUsCta.astro`、`FamilyInquiry.astro` 写 **one business day**；③ `/about-us/contact/` 从未建页，但**页脚 `Direct Access` 的 Contact**、`category-detail/PageHero.astro` 的 CTA、11 个 `src/data/category-detail/*.ts` 的 note 联系链接共 13 处全部指向它 → 死链。
- **统一口径（最终，全站唯一定稿）**：**规格区间 M1.6–M36**（M1–M1.5 按定制，与定位稿 §15 #5「M1.6–M36 主线 + M1–M1.5 单列定制」一致）；**响应时效 12 business hours**（与 `/contact/` 页 NDA 流程、SEO 描述同源）。**`contact.ts` 由 M1–M36 降为 M1.6–M36**，避免对外宣称含 M1 标准件。
- **改法（零新路由、零结构改动）**：① `src/data/about-us.ts` 两处 Facts（Size range 明确写「M1–M1.5 made to order」；Response 改 12 business hours）；② `src/components/islands/InquiryForm.tsx` 回执文案改 12 business hours；③ `AboutUsCta.astro` / `FamilyInquiry.astro` 段落文案改 12 business hours；④ `src/data/contact.ts` 注释 + 4 处 M1–M36 → M1.6–M36；⑤ `src/pages/contact.astro` JSON-LD `Organization.description` 的 M1–M36 → M1.6–M36；⑥ 13 处 `/about-us/contact/` → **`/contact/`**（已存在路由 `src/pages/contact.astro`），含 `src/config/site.ts` FOOTER `Direct Access` 的 Contact。
- **验收**：`npm run build` **85 页 Complete! 0 ERROR**；`src/` 内 `one business day` / `M1–M36` / `/about-us/contact/` 均 0 命中；`dist/` 页脚 Contact href = `/contact/`。
- **遗留（未处理，待单独立项）**：`/about-us/careers/`、`/about-us/news-and-media/`、`/about-us/sustainability/`、`/about-us/who-we-are/` 仍是死链（FOOTER + `src/data/home.ts`）；主导航无 Contact 入口。


## /contact/ 第二版：NDA 优先 RFQ + 原生表单（2026-11-17）
- **Current Status**：`/contact/` 已完成第二版改造，build Complete!（85 页 0 error），浏览器实测通过。
  - **路由唯一**：页面文件迁移为 `src/pages/contact.astro`（产物仍是 `/contact/`）；旧 `src/pages/contact/index.astro` 与旧 React 岛 `src/components/islands/ContactInquiryForm.tsx` 已移出 `src/`，归档于 `docs/legacy/`。**src/pages/contact/ 目录已移除，不存在与 contact.astro 并存的冲突路由。**
  - **原生表单**：`src/components/sections/contact/ContactInquiryForm.astro` —— 单选胶囊（原生 radio + peer-checked 样式）、提交→回执卡原地切换、参考号 RFQ-2026-XXXX、mailto 预填（参考号+意图+简述）、再提交一次复位、空值校验、蜜罐静默丢弃。**无 React、无 hydration。**
  - **降级策略**：endpoint 为空 → 不发网络请求，直接出回执卡 + mailto 预填；endpoint 存在但 POST 失败/CORS → catch 静默降级，回执提示改为「以邮件为准」，不抛未捕获错误。
  - **文案口径**：**M1.6–M36 / 12 business hours**（全站统一口径，已于「全站口径统一 + 死链清理」一节结清；M1–M1.5 按定制）。
  - **邮箱**：`INQUIRY.fallbackEmail` 已由 sales@ 改为 **info@bozemetal.com**（影响全站询盘表单 + 页脚 + AboutUsCta）；`docs/MUTUAL-NDA-TEMPLATE.md` 同步。
- **Next Step**：本节遗留已结清（口径统一 + `/about-us/contact/` 死链清零）；仅剩「主导航是否加 Contact 入口」待用户决策。
- **Known Pitfalls**：（1）`npm run build` 的输出需用 `Tee-Object -FilePath "$env:TEMP\xxx.log"` 落盘后读，终端直连捕获会丢行；（2）本地 `astro preview` 访问生产 webhook 会触发 CORS 预检失败（预期行为，已验证降级路径正常）；（3）删除/移动文件在部分模式下会被拦截，可改用 move 到 `docs/legacy/` 归档。

- **2026-11-17** 【第一版】/contact/ 页：欧美 B2B 双轨对接中心（2026-11-17）

- **目标**：给欧美买家一个「工程 + 商务」双轨并行的落地页 —— 左侧极简无涉密破冰表单（React 岛），右侧邮件直达 + 四条合规承诺，底部四步对接流程。
- **新增文件（7）**：`src/data/contact.ts`（唯一文案真相源：SEO / hero / 3 个意图胶囊 / 4 条定心丸 / 4 步流程 / 表单与邮件文案）；`src/components/islands/ContactInquiryForm.tsx`；`src/components/sections/contact/{ContactEmailChannel,ContactValueProps,ContactProcessTimeline}.astro`；`src/pages/contact/index.astro`；`docs/MUTUAL-NDA-TEMPLATE.md`（12 条 Mutual NDA 英文条款模板 + 发送须知）。
- **表单设计**：**只强制 1 个字段（企业邮箱）**，不問姓名/公司/国家/电话 —— 破冰阶段多要一个字段就多一重对抗感。意图用 3 个单选胶囊代替下拉（免打字）。`client:load`（**不是** `client:visible`）：/contact/ 是转化终点，访客可能落地即提交，等滚动 hydrate 会丢询盘。
- **承接渠道**：复用 `INQUIRY.endpoint` / `INQUIRY.fallbackEmail` / `INQUIRY.trapField`，**未新建后端端点**；payload 形状与产品页询盘保持一致（`product` / `contact` / `requirement`）并新增 `intent` / `intentLabel`，后端无需分支。endpoint 为空降级 mailto。
- **回执**：提交成功后左栏**原地**切换为回执卡，显示 `REF-<年>-<3位>` 参考号 + 「回复此邮件索取 NDA」CTA；失败则回落到 `sales@bozemetal.com` 并给出可点链接。
- **文案口径**：响应时效统一 **one business day**（与 `about-us.ts` Facts、`InquiryForm.tsx` 回执一致）；规格统一 **M1.6–M36**（M1–M1.5 按定制）；合规按**材料层 B348 / 成品层 F467-F468 / 文件层 EN 10204 3.1** 三层写，不并列混用。
- **零死链**：4 条内链全部落到**已存在**路由（`/knowledge-hub/ip-protection/nda-ip-protection-policy/`、`/services/compliance-packaging/en-10204-31-mtc-traceability/`、`/services/compliance-packaging/distributor-labeling-packaging/`）；邮箱卡不再写未经确认的「25 MB」数字。
- **未改动**：`src/styles/global.css`、Layout / Header / Footer / MegaMenu / NAVIGATION / FOOTER / `src/config/site.ts` **一律未动** —— `/contact/` 本轮**不进主导航与页脚**。
- **验收**：build Complete! 0 error；`dist/contact/index.html` 存在（119 KB）；canonical `https://fastener.bozemetal.com/contact/`；JSON-LD 单个 `<script>` 承载 `@graph`（Organization + ContactPage，`@id` 互引）；浏览器实测：胶囊切换生效、提交后回执卡 `REF-2026-394` 原地替换表单、mailto subject = `NDA & RFQ Inquiry - Titanium Fasteners`、4 条内链全部命中。
- **已知存量问题（非本次引入）**：dev server（4321）上**所有** React 岛报 `Uncaught TypeError: jsxDEV is not a function`（既有 `WeightEstimator` 岛同样报错），production build 无此问题。**勿据此判断本次改动有误。**
- **遗留（未处理，待单独立项）**：① 主导航无 Contact 入口（`PrimaryNav.astro` 现为 5 项 + 联系图标，如要加需单独立项，属布局改动）；② 页脚 `Direct Access` 的 Contact 死链**已于「全站口径统一 + 死链清理」结清**（改指 `/contact/`）。

## About us 面板：三列工厂背书菜单 + 9 个详情页（2026-11-17）

- **问题**：原 `NAVIGATION['About us']` 面板是参考站（Careers / Who we are / News & Media / Investor Portal / Event Calendar / Sustainability / Supplier Portal）的照抄 —— 对一个钛紧固件外贸站没有说服力，且 10 条链接指向从未建页的路径（死链）。
- **改法**：整块换成**三列工厂背书菜单**：① Factory & Production ② Quality & Compliance ③ Supply & Service，每列 3 个条目 = 9 个子项，全部落到真实可达的详情页 `/about-us/<group>/<slug>/`。
- **唯一数据源**：`src/data/about-us.ts` —— `ABOUT_US_GROUPS`（3 组）/ `ABOUT_US_ITEMS`（9 条扁平）/ `aboutUsPath(item)`（路由与内链共用一个路径函数）/ `ABOUT_US_LANDING`。菜单由 `ABOUT_US_GROUPS.map()` 派生（`src/config/site.ts` 新增常量 `ABOUT_US_NAV_CHILDREN`），**加一条数据 = 自动多一个菜单项 + 一个详情页**，两侧永不脱节。
- **新增页面（13 页）**：`src/pages/about-us/index.astro`（落地页）、`src/pages/about-us/[group]/index.astro`（3 张分组页）、`src/pages/about-us/[group]/[slug].astro`（9 张详情页）；`getStaticPaths` 分别由 `ABOUT_US_GROUPS` / `ABOUT_US_ITEMS` 驱动。
- **新增组件（4 个）**：`src/components/sections/about-us/` 下 `AboutUsHero.astro`（面包屑 + eyebrow + h1 + lead，几何照 `services-detail/ServiceHero`）、`AboutUsItemGrid.astro`（条目卡网格）、`AboutUsFacts.astro`（详情页「At a glance」事实表）、`AboutUsCta.astro`（页尾 CTA，按钮复用 `@components/ui/Button.astro`，链接走 `INQUIRY.fallbackEmail` 的 mailto，不依赖未建页路由）。
- **口径纪律**：只用自有品牌（Titanium Fasteners / Boze Metal），不出现参考公司名称；不写无物证的形容词。交期按定位稿 §15 #4 三档口径（不承诺全牌号现货 48h）；合规按 §7 三层口径（材料层 B348 / 成品层 F467-F468 / 文件层 EN 10204 3.1）。
- **验收**：build 80 页 Complete!（67 → 80，+13）；sitemap 13 条 about-us URL；dist 首页 mega 面板 9 条子项链接全部命中、旧词 `Careers` / `Who we are` / `News & Media` / `Investor Portal` / `Event Calendar` / `Supplier Portal` 在面板内 0 命中；详情页 canonical / `aria-current` / 「At a glance」各 1；`astro check` 16 条错误全为存量 Phase A 类型债，`about-us` 相关 0 报错。
- **遗留（未处理，待单独立项）**：`src/config/site.ts` FOOTER 块与 `src/data/home.ts` 仍引用 `/about-us/careers/`、`/about-us/news-and-media/`、`/about-us/sustainability/`、`/about-us/who-we-are/` 等旧路径 —— 其中 `/about-us/contact/` 已于「全站口径统一 + 死链清理」结清，其余路径仍待单独立项。

## Knowledge Hub 第四栏：买家工具与采购决策路径（2026-11-17）

- **问题**：`NAVIGATION` → Knowledge Hub 第四列是照抄参考站的「eShop Help Center / 网上商店帮助中心」，本站无商城，且该列 `headingHref` 指向从未建页的 `/knowledge-hub/eshop-information/`（HANDOFF §URL 层残留死链之一），items 为空 → 整列只剩一个死链标题。
- **改法**：第四栏整体替换为 1 组，heading = `Tools for Sourcing & Specification`（→ `/products/`），items = ① Spec Configurator & RFQ Builder（`/products/`）② Sample 3.1 MTC & Compliance Docs（`/services/compliance-packaging/en-10204-31-mtc-traceability/`）③ DIN / ISO / ASTM Standard Cross-Reference（`/products/?standard=<真实可勾选项>`）④ Fastening Technology Guides（`/product-solutions/`）。**唯一改动文件 `src/config/site.ts`**（MegaMenu / Layout / Header / Footer / 全局 CSS 全未动）。
- **链接纪律**：不捏造路由、不造死链 —— ② 落到已有占位页，④ 落到已有技术总览；③ 新增常量 `CROSS_REFERENCE_STANDARD_IDS`（与 DIN/ISO 集合同源 = `FILTER_GROUPS` 的 standard 维度真实可勾选项 ∪ `STANDARDS` 的 din/iso 非空项），`?standard=` 必然命中，族上架后集合自动扩大、菜单不必改。
- **验收**：build 67 页 Complete! 0 error；dist 内 Knowledge Hub 面板新 5 词（heading + 4 items）全 HIT、旧词 `eShop Help Center` / `eshop-information` 全 MISS、全 dist 残留文件 0；4 条 href 落点文件（products / services MTC / product-solutions）均存在；`astro check` 16 条错误全为存量 Phase A 类型债，`src/config/site.ts` 0 报错。
- **遗留**：Knowledge Hub 第①栏 Inspiration、第②栏 Resources 的 8 条链接仍指向未建页的 `/knowledge-hub/**`（`inspiration/`、`resources/` 目录本仓不存在），与第四栏本轮一并待单独立项。**（该遗留已于下方「Knowledge Hub 三列替换」一节结清）**

## Knowledge Hub 三列替换：Sourcing / Compliance / IP Protection（2026-11-17）

- **问题**：Knowledge Hub 面板仍是 Inspiration / Resources / Tools for Sourcing 三列，其中前两列 8 条链接全部指向从未建页的 `/knowledge-hub/inspiration|resources/**`；且「案例 / 白皮书 / eShop」类目与本站保密定位冲突。
- **改法（整块替换）**：三列 = ① **Sourcing & Spec Tools**（`/products/`）② **Compliance & Quality Docs**（3.1 证书页）③ **IP Protection & Manufacturing Specs**（NDA 政策页），每列 3 条 = 9 条，全部落到真实存在的页面；原第①③列的 Inspiration / Resources / Tools for Sourcing 条目**整体移除**（其中前两条工具内容并入新①列）。
- **唯一数据源**：新建 `src/data/knowledge-hub.ts` —— `KNOWLEDGE_HUB_GROUPS`（3 组 × 3 条）/ `KNOWLEDGE_HUB_LANDING` / 三个新页正文（`WEIGHT_ESTIMATOR_PAGE` / `GRADE_SUPPLY_MATRIX_PAGE` / `NDA_IP_POLICY_PAGE`）/ `crossReferenceHref()`。菜单由 `KNOWLEDGE_HUB_GROUPS.map()` 派生（`src/config/site.ts` 新增常量 `KNOWLEDGE_HUB_NAV_CHILDREN`），**改一条数据 = 菜单 + 落地页同时变**。`CROSS_REFERENCE_STANDARD_IDS` 从 `site.ts` 迁到数据层（值不变，仍取自 `FILTER_GROUPS` standard 维度真实可勾选项）。
- **新增页面（4 页）**：`src/pages/knowledge-hub/index.astro`（落地页，同时接活面板 lead `Go to Knowledge Hub`）、`.../tools/steel-to-titanium-weight-estimator/`、`.../materials/titanium-grade-supply-matrix/`、`.../ip-protection/nda-ip-protection-policy/`。
- **新增组件（4 个）**：`src/components/sections/knowledge-hub/` 下 `KnowledgeHubHero` / `KnowledgeHubFacts`（薄包装 about-us 同名件，几何零漂移）、`KnowledgeHubItemGrid`（卡片网格）；岛 `src/components/islands/WeightEstimator.tsx`（`client:load`，**仅**体积×公开密度，界面常驻「按公开密度估算 / 不推扭矩预紧力摩擦」声明）。
- **占位页正文校准**：`src/data/services-sub/capabilities.ts` 新增 `PAGE_BODIES`（键 = seed.slug），覆盖 `en-10204-31-mtc-traceability`（脱敏 3.1 样板）、`pmi-xrf-grade-verification`（100% 光谱复检 + 防混料）、`distributor-labeling-packaging`（素面中性防潮包装 + NDA 贴标）、`cnc-machining-to-customer-drawings`（工厂自身公差/牙距边界 + 标准几何试件）。
- **合规红线**：全站无客户图纸/客户件/客户名/案例；Grade 7 不在 `materials.csv` → 矩阵页**不造数值**，只写「Confirmed per order」；减重估算器不出现扭矩/预紧力/摩擦实测值。
- **验收**：`gen:products` 0 errors；`npm run build` **Complete! 0 error**；dist 内 9 个落点页面**全部生成**；首页面板 12 个新词（3 列标题 + 9 条目）**全部 HIT**；面板内 `/knowledge-hub/inspiration|resources|eshop-information/` **0 命中**；`astro check` **16 errors = 基线，零新增**（全为 industries/product-solutions/services 存量类型债）。
- **遗留（未处理，待单独立项）**：① ~~`FOOTER_COLUMNS` 的 Knowledge Hub 列 6 条 `/knowledge-hub/resources/**` 死链~~（**已于 2026-11-17 页脚重构中解决**，见下节）② `src/data/home.ts`（Blog / White Papers / Success Stories）、`src/data/fastener-coatings.ts`（3 条 White Papers）、`src/data/industries-sub/*.ts`（6 条 success-stories）仍指向被移除的 `/knowledge-hub/inspiration|resources/**` ③ Gr7 族数据 ④ T2 扭矩/预紧力工具（数据层下一轮）。

## Footer 五栏重构（2026-11-17）

- **问题**：页脚是参考站（bossard）的照抄版本 —— 5 栏链接里 11 条从未建页的死链（`/knowledge-hub/resources/**`、`/about-us/careers/**`、`/about-us/sustainability/`、`/knowledge-hub/eshop-information/`、`/knowledge-hub/inspiration/blog/`…），「Boze Metal」栏只放着「Registered address to be supplied」占位符，且**完全没有地址 / 邮箱 / 电话 / 询盘 CTA**，页脚既不能导航也不能转化。
- **改法（四栏链接 + 一栏联系）**：
  - ① **Products & Solutions** —— Product Solutions 四个子页 + 四个已发布品类（Screws/Bolts/Nuts/Washers）+ eShop 总入口
  - ② **Services** —— 供给侧三大护城河的 9 个能力页（与 Services 面板一一对应），首条 **CNC Machining to Customer Drawings 标记 `highlight: true`**（白字加粗，视觉上突出核心转化业务）
  - ③ **Industries** —— aerospace / robotics / medical / semiconductors + 总览
  - ④ **Knowledge & Company** —— Knowledge Hub 三个工具页（Weight Estimator / Grade Supply Matrix / NDA-IP）+ About us 三组分组页
  - ⑤ **Contact & RFQ（独立栏）** —— 公司名 / 四行工厂地址 / `info@bozemetal.com` / WhatsApp `+86-186-2391-9905` / **主 CTA「Request a Quote」→ `/contact/`** / 次级 mailto CTA
- **数据层**：`src/config/site.ts` 重写 `FOOTER_COLUMNS`（`FooterItem` 新增 `highlight?: boolean`；`FooterColumn` 删掉 `address` 字段），新增 `FOOTER_CONTACT`（公司/地址/邮箱/WhatsApp/CTA 全部集中在这一处）。**删除 `FOOTER_LEGAL_LINKS`** —— 法务页尚未建页，留着就是死链；待 `/legal/privacy-policy/`、`/legal/imprint/` 真正建好后再加回。
- **视图层**：`src/components/layout/SiteFooter.astro` 改为 `lg:grid-cols-12` 布局（四栏链接占 `col-span-8` 内部 `md:grid-cols-4`，联系栏占 `col-span-4`），法务行整体删除。**未改全局 CSS 变量、未改表单逻辑、未新增任何路由。**
- **验收**：`npm run gen:products` 0 errors（gate passed）；`npm run build` **85 页 Complete! 0 error**；dist 内 **34 个页脚链接目标全部真实生成**（逐条 Test-Path 校验）；`dist/index.html` 页脚段已含 `Contact & RFQ` / `Request a Quote` / `info@bozemetal.com` / `wa.me/8618623919905` / Baoji 地址四行。
- **仍遗留**：首页 `src/data/home.ts` 的卡片区仍有 2 条死链（`/knowledge-hub/inspiration/blog/`、`/about-us/careers/`）—— **不属于页脚范围**，需单独立项处理。

## 页脚精简 + eShop 废止 + 极简地址地图（2026-11-17）

- **页脚收敛**：`FOOTER_COLUMNS` 由 33 条降为 **26 条**（Products 6 / Services 7 / Industries 5 / Knowledge 8，每栏 ≤8）；锚文本全部缩写化并加 `whitespace-nowrap`（`Product Categories` / `Intl. Standards` / `PMI / XRF Checks` / `Industrial Robotics` / `Factory`）；栏标题缩短为 `Products` / `Services` / `Industries` / `Knowledge`。栅格改为 `1 → sm 2 → lg 2 → xl 4`（原 `md:grid-cols-4` 栏宽仅 ~148px 必溢出）；链接字号由 `text-p` 降为 `1rem`。Contact & RFQ 保持独立栏，社交 + 版权合并为一行。
- **eShop 废止**：29 个源文件的可见文案改为 `Product Catalogue` / `View Products` / `Browse Fasteners Online`；图片 `public/images/01-eshop-herobanner-products.webp` → `01-hero-banner-products.webp`。`dist` 内 `eShop` 命中 **0**。**遗留**：`src/components/sections/product-solutions/EshopCallout.astro` 文件名仍含旧词（内容已改）。
- **极简地址 + 地图**：页脚地址行改为 `Baoji, Shaanxi, China · Get Directions ↗`，完整详细地址移入新建组件 `src/components/ui/MapEmbed.astro`（原生 `<dialog>` + **懒挂载** iframe：打开时才把 `data-src` 赋给 `src`，85 个静态页不产生地图请求）。弹层内显示完整地址文本 + Google Maps 嵌入 + 「Open full address in Maps」兜底外链。完整地址同时以 `.sr-only` 保留给读屏与搜索引擎（NAP 不丢）。
- **为何不写死坐标**：该工厂地址在 OSM / Nominatim / Overpass **均无地理编码结果**（已实测多组中英文检索均为空），写死经纬度会在站内展示错误位置标记 —— 改为由地图端按完整地址文本实时解析定位（实测已正确落到宝鸡）。
- **验收**：`npm run build` **Complete! 0 ERROR**；浏览器实测（1440 / 390）：地址行**单行不折行**、页脚零横向溢出、弹层居中且不溢出视口、Esc / 关闭按钮 / 遮罩点击三条关闭路径均生效、地图 iframe 打开后正确加载并定位。
- **未改动**：`src/styles/global.css`、Layout / Header / MegaMenu / NAVIGATION、表单逻辑、任何路由。

## Mega Menu 悬停自动收起（2026-11-16）

- **根因**：`SiteHeader.astro` 的 `open()` 内置 `locked = true`，导致后续 `mouseleave` 关闭逻辑被短路，悬停展开后永不收起。
- **修法**：删除 `locked`，改为「导航栏区 + 面板区」双区域指针追踪（`pointerInHeader` / `pointerInMenu`）；**只有两者同时为 false** 才在 `CLOSE_DELAY = 180ms` 后收起，且定时器回调时重新校验（防止从触发器移向面板时闪烁）。
- **几何前提（勿改）**：header 高 91px（`top-0`），面板 `fixed top-91`，两者垂直相邻，中间无空隙，故指针下移不会掉入未追踪区。
- **补充**：`<header>` 加 `data-mega-header` 标记；trigger 加 `aria-controls="mega-panel-<index>"`，面板加同名 `id`；Esc 关闭并把焦点还给触发器；`documentElement.mouseleave` 与 `window.blur` 立即关闭；点击面板外部关闭。
- **键盘/指针仲裁**：`keyboardNav` 仅在按 Tab 时置真、发生真实 `mousemove` 时置假 —— 避免「鼠标点击残留的 focus」永久阻止自动收起。
- **验收**：build 58 页 Complete!；dist 内 `aria-controls` / `id` 各 5 个、`data-mega-header` 2 处；真实鼠标实测 —— 悬停展开 ✓、移入面板不闪烁 ✓、同时离开两区后自动收起 ✓、焦点移入面板保持展开 ✓、焦点移出关闭 ✓、Esc 关闭并还原焦点 ✓。

## Services 大菜单换成供给侧三大护城河（2026-11-17）

- **问题**：Services 面板三列全是参考公司的「智能物流 + 工程咨询」（Smart Factory / Engineering / Benefits / Success Stories），与我们的工厂资产定位不符，且「Design Optimization & Validation」「TCO」踩了做实测/设计验证的红线。
- **改法**：`src/config/site.ts` 的 `NAVIGATION` → `Services.children` 三列整体替换为：①Manufacturing Capabilities（4 条）②Compliance & Packaging（3 条）③Order & Fulfillment（2 条）。`lead` 仍是 `Go to Services → /services/`；三列 `headingHref` 均指向已存在的 `/services/`（本仓无族索引页，**不造死链**）。
- **占位页**：`src/data/services-sub/capabilities.ts`（新建，**非生成物，可手改**）导出 9 个页面对象 + `CAPABILITY_PAGES`（family/slug/page）。形状对齐既有 services-sub：`slug`/`path`/`seo`/`hero{breadcrumb,eyebrow,heading,lead}`/`blocks[]`；**hero 不挂图片**（ServiceHero 只渲染那 4 个字段），blocks 只有一条 richText 占位说明。
- **路由**：`src/pages/services/[family]/[slug].astro` 的 `getStaticPaths()` 并入 `CAPABILITY_PAGES`（原 4 页保留，页脚仍指向它们）；`Props.page` 放宽为 `SubPage | CapabilityPage`。
- **九条路由**：前缀 `/services/<manufacturing-capabilities|compliance-packaging|order-fulfillment>/<slug>/`。
- **验收**：build Complete! 无 error；dist 内 9 个新 `index.html` 全生成；`dist/index.html` 的 `data-mega-panel="Services"` 段内 12 条新标签全在、8 个旧词（Smart Factory / Engineering Services / Composites / Benefits / Design Optimization / TCO / Success Stories / Inventory & C-Parts）全清；浏览器实测菜单三列渲染正确、占位页面包屑四级正确。`astro check` 唯一 error 在未触碰的 `industries/IndustryContact.astro`（存量）。
- **下一轮**：①9 个占位页正式内容 + 配图 ②`/services/` 落地页正文仍是 Bossard 的 Smart Factory / Composites / TCO 词 ③页脚 `Products & Services` 列仍指向旧 Bossard 服务页 ④菜单子项是否加灰色副标题（需改 `NavChild` + `MegaMenu.astro`，属布局改动）。

## 1. 已完成（勿重做）

基座 `package.json`/`astro.config.mjs`/`tsconfig.json`/`scripts/astro-build.mjs` ｜ 令牌 `src/styles/global.css`（@theme = Bossard 实测值，**事实源**）｜ 配置 `src/config/site.ts` ｜ UI `src/components/ui/` ×8（Container, Button, Figure, SectionHeading, Card, RichText, Accordion, MediaCalloutPair）｜ 布局 `src/components/layout/` ×8（SiteHeader, PrimaryNav, MegaMenu, HeaderUtility, SiteFooter, BackToTop, CookieConsent, Logo）｜ 首页 `src/pages/index.astro` + `src/components/sections/home/` ×7 + `src/data/home.ts` ｜ **Phase B 产品系统**（2026-11-11 重建；替代并删除了 Phase A 的产品页副本）：真相源 `data/products/*.csv`（categories / **families 产品表（8 列：family_id,name,category,standards,materials,finishes,description,image —— **第 8 列 = 客户原图名**，落盘名 `<SKU>-<原名>`；type/seo 派生）** + **management 管理表（10 列：family_id,status,moq,packaging,lead_time,price_from,price_to,price_currency,price_unit —— 状态与商务数据与产品表分开，商务字段当前为空、族页不渲染占位假价）**** / materials / finishes / standards / param-schema / dimension-library / sku-codes + `_template/` + `dimensions/<family_id>.csv`）→ 生成器 `scripts/gen-products.mjs`（闸门 E001–E031 + `category-view.ts` 视图产物 + `assets.ts` 素材登记簿）→ `src/data/products/**`（生成物，禁手改）｜ **SKU 规范：族级 `TI-<family_id 大写>`**（唯一/稳定/可念；标准与材质是属性不是码）｜ **素材绑定：文件名 `<SKU>-<原名>.<ext>`**，扫描 `public/` 自动绑定，孤儿素材 E030 阻塞构建、缺图 W001 不阻塞；规则只在 `scripts/lib/assets.mjs` 一份（生成器与 CLI 共用）｜ **2026-11-11 client-confirmed：族级 SKU / 素材按 SKU 前缀 / 只留 8 列 CSV 录入格式 / 产品表与管理表分表（families = 产品核心信息，第 8 列 = image 原图名；management = 状态与商务数据）—— 已定稿，勿再改口径、勿引入第二种录入格式**｜ 页面：`src/pages/global-en/eshop.astro`（总览）+ `src/pages/global-en/eshop/c/[category].astro`（分类）+ `src/pages/global-en/eshop/p/[family].astro`（族），**全站统一形态 `/global-en/eshop/`**（禁止任何跳转/重定向）｜ 复用 `sections/category/` ×3（CategoryCardRail / ProductCard / ProductGrid）—— 版式不动，只把数据源从手写 `src/data/category.ts` 换成生成产物；ProductGrid 的左侧筛选栏改为**真能用**（`<details>` 折叠 + 多选 + URL 同步 + 无 JS 渐进增强）｜ 族页复用 `sections/product-family/` ×3（FamilyHero / FamilySpecTable / FamilyInquiry）｜ CLI `scripts/products.mjs`（`npm run products -- list\|cat-add\|cat-rm\|fam-add\|fam-set\|fam-rm\|spec-add\|spec-rm\|export\|bulk-import\|assets\|validate`，每次写完自动跑闸门）+ 共享库 `scripts/lib/csv.mjs` / `scripts/lib/assets.mjs`｜ **批量录入唯一格式：8 列 CSV 模板**（`name\|category\|standards\|sizes\|materials\|finishes\|description\|image`；第 8 列 = 客户原图名，原图丢进 `public/images/products/_inbox/`，导入按 `<SKU>-<原名>` 自动改名认领 —— 客户不需要知道 SKU；type/family_id/SKU/图路径/工程尺寸全派生，`sizes` 迷你语法 `M4x6`/`M4x7x4`/`5x10x1`，尺寸从 `dimension-library.csv` 查）｜ 手册 `docs/PRODUCT-MANUAL.md`｜ 验收器 `scripts/measure-page.mjs`（CDP 驱动 Chrome，零依赖）｜ 复刻流水线 `scripts/ref-report.mjs`（probe JSON → 分片报告）、`scripts/ref-dom-tree.mjs`（参考 HTML → <main> DOM 大纲）、`scripts/gen-category-detail.mjs`（参考 HTML → 品类子页 data + 索引）、`docs/PAGE-TYPES.md`（6 种页面类型注册表 + 12 个品类子页 slug 清单）｜ 品类子页类型 `src/pages/global-en/product-solutions/product-categories-and-brands/[slug].astro` + `src/data/category-detail/`（types + index + 每页一份）+ `src/components/sections/category-detail/` ×3（PageHero, VideoBlock, RichText；品牌网格/服务卡片复用 pcab 组件）；已交付 direct-assembly-screws（3 区块 dy 3/0/−1，dh −3/0/4，P0=0 P1=0）｜ SOP `docs/RECIPE.md`（阶段 0–5 + 类名映射速查 + 禁则）｜ 台账 `docs/visual-qa.md`、`qa/DEVIATIONS.md`、`qa/targets/<page>.json`｜ 服务总览页 `src/pages/global-en/services/index.astro` + `src/data/services.ts` + `sections/services/` ×2（ServiceGrid, BenefitsGrid；3 区块 dy −104（恒定）dh=0，P0=0 P1=0）

## 2. 下一步（按序，P0=0 才进下一个）

0. **产品导航数据层补齐**（2026-11-17 导航重构后的下一轮，详见 §8 日志同日条目）：① ASTM / ASME 规格族（`astm-f468` / `asme-b18.2.1` 目前无产品族 → 该链接现显示全部产品）② Grade 7 / Grade 23 牌号产品族（`ti-gr23` 无族）③ Threaded Rods（螺纹杆）族 —— `data/products/families.csv` 补行 → `npm run gen:products` → `npm run build`；**导航侧无需改动**（DIN/ISO 集合由 `FILTER_GROUPS` 构建期自动汇总，牌号链接按 `ti-gr<号数>` 派生）
1. **复测首页**确认区块 6 = 1169 —— `npm run measure:home`（区块 6 已把 `lg:gap-y-386` 改为 `lg:gap-y-222`，已构建未复测）
2. **移动端**抽屉 `MobileNav.astro` + 390px 验收 —— `npm run measure -- / --viewport 390x844`
3. **产品分类总览页**（参考实测已备好）：`qa/ref/product-categories-and-brands.json` + `qa/targets/product-categories-and-brands.json` → 写 `src/data/product-categories-and-brands.ts` + `src/components/sections/product-categories-and-brands/` + `src/pages/global-en/product-solutions/product-categories-and-brands.astro`（结构：Hero + 「Discover Our Product Categories」y=993 h=1444 + 「Buy Fastening Elements」y=2485 h=446）
4. **12 个品类子页**（`category-detail` 类型）—— 模板已就绪，剩 11 页：`npm run recipe -- https://www.bossard.com/global-en/product-solutions/product-categories-and-brands/<slug>/ category-detail-<slug>` → `node scripts/gen-category-detail.mjs <slug>` → `npm run build` → `npm run measure -- /global-en/product-solutions/product-categories-and-brands/<slug>/ --target qa/targets/category-detail-<slug>.json`。slug 清单见 `docs/PAGE-TYPES.md` §2；**已交付 1/12**（direct-assembly-screws，P0=0 P1=0）
5. **服务页**（✅ 总览页已交付：`/global-en/services/`，P0=0 P1=0）→ 子页（Smart Factory / Engineering / Benefits 详情页）与**行业页 / 知识文章页 / 联系页**（后三者尚无实测 = 证据缺口）
6. **客户 16 行钛件清单导入**（进行中，事实与阻塞见 **§9**）：素材已到位（`public/images/BZ-*.webp` 16 张）、清单已到位（`data/products/_template/product-import.csv` 已替换为 16 行版）→ 归属表与参数系统见 **`docs/PRODUCT-MANUAL.md`**
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
| **裸 `<img>` 无 `object-fit`** | 客户原图比例杂乱（960×1100 竖 / 1200×896 横 / 1536×1536 方）被强行拉伸 → 螺栓压扁 | 产品/分类/族页图一律走 `src/components/ui/ProductFigure.astro`（白底 + `object-contain` + 圆角边框），**禁止再写裸 `<img class="aspect-*">`** |
| 卡片标题 `line-clamp-2` | 「…Screws Fu…」吞掉 Full/Partial Thread（区分产品的关键信息） | 卡片标题 `line-clamp-3` + `min-h-[3.75em]` 预留三行；Standard 用 `mt-auto` 贴底对齐 |

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

- **2026-11-20** 【三个国际标准落地页 → `/products/` 子目录 + mega menu 直达】DIN / ISO / ASTM-ASME 三个标准落地页原位于 `src/pages/standards/`，与产品体系割裂且 mega menu 只能指向泛化的 `/products/?standard=` 筛选深链。**做法**：① **物理迁移**（非重定向，遵循本仓库 no-redirect 政策）—— `src/pages/standards/{din,iso,astm-asme}-titanium-fasteners.astro` → `src/pages/products/{din,iso,astm-asme}-titanium-fasteners.astro`，各自 `canonicalPath` 与路由注释同步改为 `/products/<slug>/`；② `src/config/site.ts` mega menu「By International Standards」列三条链接由 `/products/?standard=…` 深链改为**各自专属落地页** `/products/din-titanium-fasteners/` / `/products/iso-titanium-fasteners/` / `/products/astm-asme-titanium-fasteners/`；③ 删除已无引用的标准筛选 URL 辅助函数与多余 import。**未动**：BaseLayout / Header / Footer / MegaMenu / 全局 CSS / 主导航 / 产品数据源（`data/products/*.csv` 未触碰）。**冲突校验**：新路径与既有 `/products/[category]/` 动态路由不冲突（`iso-titanium-fasteners` 等非 category id），Astro 静态路由优先。**顺带修复**：`src/components/sections/standards/StandardsRfqForm.astro` 7 条 `ts(2339)` DOM 类型债（`document.querySelector` 返回 `Element` → 改为 `querySelector<HTMLInputElement>` / `querySelector<HTMLInputElement>('#rfq-specs')`），使随迁址页面同发的表单组件类型干净；`StandardsMatrixTable.astro` 的 `ts(2570) tableId` 提示为 **define:vars 误报**（dist 实测已内联 `const tableId = "iso-standards"`，且 `id="iso-standards"` 元素在位，运行时正常）。**验收**：`npm run build` **Complete! 0 error**；dist 内 `products/{din,iso,astm-asme}-titanium-fasteners/index.html` **3 个全部生成**，`dist/standards/` **不存在**；`dist/index.html` mega menu 三条 href 各命中 1 次；`dist/products/iso-titanium-fasteners/index.html` canonical = `https://fastener.bozemetal.com/products/iso-titanium-fasteners/`；sitemap 含 3 条新 URL 且无旧 `/standards/` URL；全 dist HTML 扫描 `/standards/` 残留 **0 命中**；源码扫描无陈旧 `/standards/` 引用（仅 `STANDARDS/` 字典名注释）；`npm run check` **6 errors = 存量 Phase A 类型债基线，零新增**（`docs/legacy` / `home.ts` / `industries/aerospace` / `services/index.astro`）。**遗留**：旧 URL 无 301，须在服务器侧配置跳转或接受历史链接失效；`/legal/privacy-policy/` 内链缺失为存量问题（非本次引入）。

- **2026-11-19** 【9 个服务能力占位页 → 正式内容】`/services/` 下 9 个能力页（manufacturing-capabilities ×4 / compliance-packaging ×3 / order-fulfillment ×2）此前只有 `PLACEHOLDER_BODY` 占位说明。**做法**：① 新建 `src/data/services-sub/capability-content.ts`（手写正式内容，非生成物）—— 每页 = 正文 2–4 段 + 1 张 4:3 配图 + 图文带（标题 / ≤40 词导语 / 3 条加粗要点）+ 事实表 5–6 行 + FAQ 3 条 + 相关出口 3 条；② `src/data/services-sub/capabilities.ts` 引入 `CAPABILITY_CONTENT`，新增 `buildBlocks()` 按「正文 → 图文带 → 事实表 → FAQ → 相关出口 → 询盘 CTA」六段组装，缺 slug 直接 throw（防止静默占位）；③ `src/components/sections/services-sub/ServiceBlocks.astro` 新增 3 个渲染器 `capabilityBand`（**每条图文带恰好 1 张图**，`aspect-4/3` + `object-cover` 锁定，绝不纵向堆图）/ `specTable`（`<dl>` 全宽标签-值表，抽象规格不用大图）/ `capabilityCta`（纯文字深色 CTA 带，无图），并给既有 `faq` 渲染器补上可选 `heading`。**BaseLayout / Header / Footer / 全局 CSS / 导航 / 路由 / SEO schema 全部未动**，9 条 slug 与 family 未变，CTA 仍指向既有 `/contact/`。**修正**：`capabilityCta` 底色由 `bg-blue-70`（#a9cfe8 浅蓝，白字对比度不足）改 `bg-blue-dark`（#001827）；`specTable` 标题色由 `text-blue-dark2` 归一为 `text-blue-dark3`。**验收**：`npm run build` Complete! 0 error；9 页 dist 实测 h2 = 5（图文带 / At a glance / FAQ / Related / Request a quotation）、h3 = 6、正文图 **恰好 1 张**、`<details>` = 3、`/contact/` 出口在位；页内 56 条内链逐条核对 → 仅全局 `CookieConsent.astro` 的 `/legal/privacy-policy/` 缺失（存量、全站共有、非本次引入）；`astro check` 6 条错误全部为历史 Phase A 类型债（`industries` / `home.ts` / `services/index.astro` / `docs/legacy`），本次 3 个文件 0 报错；浏览器实测 1440px 与 390px 两档排版（图文带 4:3 不拉伸、CTA 深色带白字可读）。**遗留**：CTA 文案「quotation + material certificates within 12 business hours」沿用全站已定稿口径（§全站口径统一 2026-11-17），但**承诺交期与证书范围仍需业务负责人签字确认**。

- **2026-11-17** 【Industries mega menu 校准】把 `NAVIGATION` → `Industries.children` 从参考站照抄的 9 个泛行业标题（Data Centers / HVAC / Railway / Electric Vehicles / Electrical & Electronics 等）改为 **3 列 × 1 组**结构，组标题即主题（附主打牌号）、组内 items 为具体行业场景：① **Corrosion & Marine Environments — Grade 2 / Grade 7**（Chemical Processing & Chlor-Alkali / Desalination & Marine Engineering / Electroplating & Anodizing Equipment）② **High-Strength Lightweight — Grade 5**（Aerospace & UAV Systems / Industrial Robotics & Automation）③ **Cleanroom & Specialty — Grade 5 / Grade 23 ELI**（Medical Device Manufacturing / Semiconductor & Vacuum Equipment）。**唯一改动文件 `src/config/site.ts`**（MegaMenu / Layout / Header / Footer / 全局 CSS 未动）。**链接纪律**：已有落地页走原页（aerospace / robotics / medical / semiconductors），尚无落地页的 3 个化工/海水淡化/电镀场景落到真实牌号筛选深链 `/products/?material=ti-gr2`（牌号 id 由 `MATERIALS` 正则派生，缺失即降级 `/products/`，不捏造路由）；被摘除的 5 个行业页 `/industries/<slug>/` 本身保留、仍可直达，只是不再进导航。**验收**：build 67 页 Complete! 0 error；dist 内 mega-panel-Industries 段新标题 10/10 命中、旧词（Data Centers / Railway / Heating, Ventilation / Electric Vehicles / Electrical & Electronics）全 0；11 条 href 落点文件逐条核对均存在；`ti-gr2`/`ti-gr23` 确认为 products 页真实可勾选项。**遗留**：Grade 7 在材料字典中暂无 id（仅 ti-gr2/5/9/23），文案提及但无独立筛选入口。

- **2026-11-17** 【Product Solutions mega menu 重构】把 `NAVIGATION[0].children` 从「eShop / Fastening Technology / Product Categories / Product Categories and Brands / Innovations」改为**三列新架构**：① **By International Standards** —— DIN Standards / ISO Standards / ASTM / ASME Specs；② **Standard Titanium Fasteners** —— Screws / Bolts / Nuts / Washers / Threaded Rods & Studs；③ **Custom & Material Grades** —— Custom CNC & Machining to Print / Grade 2 / Grade 5 / Grade 7 & Grade 23。**唯一改动文件 `src/config/site.ts`**（`MegaMenu.astro`、CSS、Layout、Header、Footer 全未动）。**关键设计**：DIN/ISO 集合**不硬编码** —— 取 `FILTER_GROUPS`（生成产物）的 standard 维度可勾选项 ∩ `STANDARDS`（din 列非空 = DIN；iso 列非空 = 有 ISO 对应号），故 `?standard=` 参数必然命中真实勾选项；牌号链接由 `MATERIALS` 的 `ti-gr<号数>` 正则派生，族上架后自动生效。**同时删除**已无引用的 `PRODUCT_CATEGORY_NAV`（`CATEGORIES` import 一并移除，保留 `categoryPath`）。**已知非阻断缺口**（下轮数据层补）：`astm-f468`/`asme-b18.2.1`/`ti-gr23` 无对应族 → 点击后显示全部产品。**验收**：build 58 页 Complete! 0 error；dist 内新标题各 1 次、旧标题 `Fastening Technology`/`Product Categories and Brands`/`Innovations` 归零、mega-panel-0 内 `eShop` 命中 0；12 条链接 href 逐条核对且落点文件均存在；`astro check` 16 条错误均为历史 Phase A 类型债，`config/site.ts` 0 报错。

- **2026-11-06** p/272 交付并复测 P0=0 P1=0（区块 2 = 912/1537，参考 912/1534）；修复 3 处：① 面包屑 `opacity-1` 在 Tailwind v4 等于 1%（computed 0.01）→ 改 `opacity-100` ② 属性名缺失 → data 层改 `{label,value}`，标签落值左侧 244px 列 ③ Variants 表头改带边框 `<details>` 手风琴 + 浅蓝提示面板 + 放大镜/下拉箭头。**遗留**：分类页 `src/pages/products/bolts.astro` 用了同样的 `opacity-1`，其面包屑同样不可见（一行修复，未改）。
- **2026-11-06** product-categories-and-brands 重跑 recipe 三段全过，**新旧 target 逐字段一致**（参考站无漂移）：区块1 y=993 h=1444、区块2 y=2485 h=446、body 3493px、footer 517px、h-overflow 0；素材 manifest 19 条 ↔ 落盘 19 个文件全命中、孤儿 0；**manifest 末条 `23-https-bat-bing-com-action-0-*.webp` 是 Bing 追踪像素、0 字节，勿引用**；原临时日志已按新规则清理（结论已收敛进本条 + `qa/targets/product-categories-and-brands.json`，不再落盘原始日志）。
- **2026-11-06** 导航两项修正：页头**不再滚动收起**（偏离参考站，已记 `qa/DEVIATIONS.md`）；`<main>` 由 `pt-195` 改为 `pt-48 md:pt-91`，实测间距首页 40px / eshop+详情页 12px / 分类页 36px。
- **2026-11-06** 共享 `SiteFooter` 高 609 vs 参考 517（+68px 正文高度，非页面区块问题，公共组件差异）。

## 9. 已完成：客户 15 个公制产品族导入（2026-11-14 交付上线）

**结果**：5 族就地更新 + 10 族新建，**全部 published**，15 张客户图认领，`preflight` PASS 7/7（errors=0），`build` Complete!（58 页，15 个族页全部生成）。

**已落地**：
- `scripts/products.mjs` —— `bulk-import` 支持**可选第 10 列 `family_id`** 做 upsert：保留原 `family_id`/URL/发布状态；标准、材质、表面取**并集**；规格保留既有行、客户端非空值覆盖同键值。
- `data/products/_template/product-import.csv` —— 加入 `type` + `family_id` 两列（8 → 10 列），5 个既有族完成映射，screw/bolt/stud 类型标注。
- `data/products/_template/product-import.imperial-deferred.csv` —— **英制整行暂存**（ASME B18.2.1 重型六角），未做单位换算；配图 `BZ-111-bolts-titanium.webp` 留在 `public/images/products/_inbox/`（投递区不参与扫描，不会误判 E030）。
- `scripts/gen-products.mjs` —— **修 `family_id` 数字开头导致生成物语法错误**：`12-point-flange-bolts` 会生成非法标识符 `12_POINT_FLANGE_BOLTS_DIMENSIONS`。新增 `constNameOf()`，数字开头补前缀 `_` → `_12_POINT_FLANGE_BOLTS_DIMENSIONS`。
- 10 个新族全部 `published`；`12-point-flange-bolts` 另摘掉英制标准 `asme-b18.2.1`，只挂 `din-34800`。

**口径决策（勿回退）**：
- `type` 与首个标准 type **无需一致** → 允许同标准（如 din-912）的 screw / bolt 独立族并存，重复铺货由客户确认后接受。
- 混合行（公制＋英制）里的**英制规格直接移除**，不做换算；整行英制清单暂存待专门 schema。
- 缺可靠工程尺寸源的行**保留 W002 降级**，禁止伪造尺寸（当前 140 warnings 全为此类）。

**陷阱**：family_id 可能以数字开头 → 生成器常量名会非法；PowerShell 终端在长输出时 PSReadLine 会崩溃（`System.ArgumentOutOfRangeException`），改用「命令重定向到文件 + 单独 read」绕开。

<details>
<summary>9.1–9.3 历史勘察记录（已失效，保留备查）</summary>

### 9.1 已确认的机制（省下重复勘察）

- `standards.csv` 是 **DIN-id 唯一真相源**，`iso` 列存 ISO 等价号 → 清单里 `iso-*` 一律**规范化成 din id**：
  `iso-4017→din-933`、`iso-4014→din-931`、`iso-4162→din-6921`、`iso-4762→din-912`、`iso-10642→din-7991`、`iso-7380→din-7380`。
  `standards.csv` 已含 din-931 / din-6921 / din-7380 三行（type=bolt/bolt/screw），无需新增标准行。
- `finishes.csv` **无** `anod` / `pvd`（现有 anod-black / anod-blue / plain / passivated …）→ 清单里 `anod|pvd` 会报未知表面。两条路：① 新增 `anod`+`pvd` 两行 finishes + sku-codes（AN/PV）② `anod→anod-black`、`pvd` 另行处理。**待用户拍板**。
- `bulk-import`（`scripts/products.mjs`）：**只新建、不 upsert**；家族名重复 → 硬失败（清单第 7 行 "Hex Head Bolts Fully Threaded" 与现有族同名）。
  尺寸查表键：螺/栓 = thread+length，螺母 = thread，垫圈 = d1+d2+h；迷你语法：栓/螺钉 `M4x10`、螺母 `M5x8x5`(s=8,m=5)、垫圈 `9x4.3x0.8`(外径x内径x厚)。
  **模板值覆盖库值**，库只补空缺（如螺母 h）。每族落 `data/products/dimensions/<family_id>.csv`，行 standard = `standards[0]`。
- `dimension-library.csv` 现有覆盖：`din-912`/`din-934`/`din-7991`/`din-933`/`din-125`（~400 行）。**缺** `din-931`/`din-6921`/`din-7380` 及 `din-912 M3x8`。
- `scripts/gen-bossard-dimensions.mjs` TARGETS 已含所需标准（BN：din-931=57、din-6921=2112、din-7380=19、din-912=272、din-7991=616、din-933=54、din-125=671）；`--apply` **幂等**（`REBUILD_STDS` 重建 din-7380/7984/6912/931/6921 + din-125，其余按 std|thread|length 去重追加），网络可达。**工程尺寸只能由抽取器写入，禁止手填。**
- 图片：`public/images/BZ-201-screws-titanium.jpg.webp` 双后缀（清单写 `.webp`）→ 需改名；`public/images/products/` 已有 `TI-HEX-NUT-01.webp`、`TI-HEX-SOCKET-HEAD-CAP-SCREW-01.webp` 占位图；`families.image` 存**客户原名**，落盘名 `<SKU>-<原名>`。

### 9.2 与现有 5 族的重叠（**就地更新，不新建重复页**）

现有 published 族：`hex-socket-head-cap-screw`(din-912) / `hex-nut`(din-934) / `countersunk-head-cap-screws`(din-7991) / `hex-head-bolts-fully-threaded`(din-933) / `plain-washers`(din-125)。
清单第 2/3/4/5/7 行即这 5 个产品（描述几乎逐字相同，尺寸一致或为子集）→ **保留 family_id/URL，用 `fam-set` 改材质/表面/描述/图 + `spec-add/spec-rm` 调尺寸**；第 7 行同名必须走这条路，不能走 bulk-import。
螺母尺寸**无冲突**（2026-11-13 复核）：`dimension-library.csv` 的 `din-934,M5,,,,8.0,,,,5,4.7` → s=8.0 / m=5 / h=4.7，与客户 `M5x8x5` 完全一致；M6 同理（s=10 / m=6 / h=5.2）。此前误记「库 m=4」已作废。

### 9.3 阻塞项（需决策，别硬做）

- 清单第 14–17 行暂无合法落点：`iso-7380-2`/`custom`（Torx 法兰，标准未注册、Torx 驱动不在内六角标准内）、`din-938`（未注册；din-939 已注册但无尺寸源）、`asme-b18.2.1`/`astm-f468`（未注册）、`din-34800`（未注册）+ 第 16/17 行英制长度与 `param-schema` 的 mm 单位冲突。
- 新行内部近似重复：第 6 vs 11（均 din-912 螺栓）、第 8 vs 7（均 din-933）→ 需产品口径确认是否合并。
- 铁律：缺 Bossard 尺寸源的行**不得手填尺寸**，只能挂起等抽取器覆盖或客户确认。

### 9.4 历史下一步（已全部完成，勿重做）

1. `npm run budget -- --reset` → `npm run preflight -- <slug>`（本任务 slug 用 `product-import`）
2. 定 finishes 口径（新增 `anod`+`pvd` vs 映射 `anod→anod-black`）
3. 模板标准化：standards 规范化 + finishes 改名 + 删/挂起 14–17 行 → **先 `--dry` 跑到 0 error**
4. `node scripts/gen-bossard-dimensions.mjs --apply` 补 din-931/din-6921/din-7380（及 din-912 M3）→ 重跑 dry
5. 5 个现有族就地更新（fam-set + spec-rm/spec-add）＋ 挂 BZ 图
6. 新族走 `bulk-import` → 改名 `BZ-201-*.jpg.webp` → 素材入 `public/images/products/_inbox/` → `npm run products -- assets` → `fam-set --status=published` → `npm run build`
7. 收据前删净 tmp/`_` 残留

</details>

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

- **2026-11-11** 【Phase B 数据层 + 分类树 + 筛选 + 可订购性】交付：data/products/categories.csv（5 分类）+ amilies.csv 新增 category/moq/packaging/lead_time/price_from/price_to/price_currency/price_unit 列；生成器 scripts/gen-products.mjs 加 E024–E028 闸门 + 分类素材检查 + search-index.ts（筛选索引，含显示标签，客户端不 import 数据层）；src/pages/products/index.astro 改为分类入口 + 筛选岛；新分类页 src/pages/products/category/[category].astro；新筛选岛 src/components/islands/ProductFilter.tsx（client:load，URL 同步用 replaceState，同维度并集/跨维度交集，线程精确多选 + 长度 min/max）；FamilyHero.astro 加「Ordering information」区块（四项全空则整块隐藏，JSON-LD 不写 offers）。**路由决策**：分类页用 /products/category/<id>/（多一层静态段）—— 因族路由已占 /products/<family_id>/，同层同段数两个动态参数 Astro 无法区分；族 URL 契约不变。sitemap 用 
outes.json 的 draftCategories 与页面 noindex 保持一致（已实测 draft/published 两条路径）。gate 0 errors，build Complete。

- **2026-11-13** 【清理】删除 1:1 复刻资产与「工程复核」阻塞闸门：删 `qa/ref/`（108 文件 33MB）、`qa/report/`（91）、`qa/targets/`（41）、`qa/DEVIATIONS.md`、全部复刻日志；删 `docs/{RECIPE,PAGE-TYPES,visual-qa,TIER-A-BATCH-SPEC}.md`；删 24 个复刻脚本（probe/ref/dl-assets/gen-target/measure-page/recipe/gen-industries* 等）+ `scripts/lib/{html-slice,html-tree,probe-expression}.mjs`；删调试页 `src/pages/{token-probe,logo-probe}.astro`。**安全网**：删除前 commit `f09efdc` 已把 `qa/ref` + `qa/report` 存入 git 历史，需恢复时 `git restore --source=f09efdc -- qa/ref qa/report`。
  **闸门改写**：`preflight.mjs` 五项由「参考站几何」改为「真相源就绪 · 生成产物新鲜 · 素材本地路径 · 数据闸门」；`gen-products.mjs` 新增落盘 `qa/.session/products-gate.json`（errors/warnings/families/truthMtime）供 preflight 机器校验；动态路由识别改用字面量 `[family].astro`/`[category].astro`/`[slug].astro`；`package.json` 移除 8 个失效 script；`.gitignore` 改为只放行 `qa/.session/` + `qa/cost-log.jsonl`。
  **约束解除**：`docs/PRODUCT-DATA.md`「绝不允许凭记忆填值」→「尺寸一律走抽取器，不手填」；`docs/BOSSARD-TITANIUM-DECISION.md` §5.1 同改、§4.6 标题「对外报价前必须完成」→「不阻塞上架；成交前由技术侧按单确认」；选型报告 附录 D 与 §8.3 标题同样解除。**[待核] 标记保留**（是 A/B/C 报告的可信度溯源，不是闸门）。
  **顺带修复**：5 个 Phase A 下载失败遗留的 manifest 死条目（指向不存在的图片，全部无页面引用）已从 `public/images/**/_manifest.json` 移除 → 素材缺失归零。
  **验收**：`npm run gen:products` 0 errors（6 个 W001 缺客户主图，不阻塞）；`npm run build` 48 页 Complete! 0 error；`npm run preflight -- hex-socket-head-cap-screw` **PASS 7/7** 退出码 0。
- **2026-11-14** 【产品卡视觉电商级 + 卡片信息收敛】客户反馈「产品图片未约束、视觉太差」+「卡片只展示产品名称和Standard即可」。**根因不是配色而是缺 `object-fit`**：客户原图比例杂乱（960x1100 竖 / 1200x896 横 / 1536x1536 方 / 960x960），原 `<img class="aspect-3/2 bg-gray-vlight">` 无 `object-fit` → 螺栓被强行拉扁；且白底产品照压在灰底 #f3f3f3 上 = 廉价感。**做法**：① 新建 `src/components/ui/ProductFigure.astro`（受约束媒体框：容器比例由调用方定 + `object-contain` 完整放入不裁切 + 白底 + `rounded-card` 细边框 + `p-24` 留白 + 缺图走占位 SVG 而非破图），ProductCard / CategoryCardRail / FamilyHero 三处统一接入（族页主图原用 `Figure` 的 `object-cover`，960x1100 竖图会被切掉上下两端，已换掉并移除该 import）；② ProductCard 信息收敛为 **产品名 + Standard 两行**（删描述行、材质行、SKU 粗体行）——视图层 `sku/description/material` 字段保留（族页与询盘表单要用），只在卡片不渲染，`ProductCardView` 注释同步说明；③ 电商级对齐：标题 `line-clamp-3` + `min-h-[3.75em]` 预留三行（`line-clamp-2` 会把「...Screws Full Thread」截成「...Screws Fu...」，Full/Partial Thread 是区分产品的关键信息，不可丢），Standard 用 `mt-auto` 贴底 + 卡片 `h-full` 等高。**验收**：`npm run gen:products` 0 errors / `npm run build` Complete；1440px 实测 15 张卡图区统一 306x306、图盒 256x256、`object-fit: contain`（源图 960x1100 / 960x960 / 1200x896 / 1536x1536 全部未变形未裁切），同排卡片高度齐平（405/405/405），分类卡 4 张齐平 272，族页主图 522x522，横向溢出 0，标题无截断。**未动**：全局 CSS / Layout / Header / Footer / 导航 / `data/products/*.csv` / 生成器（`src/data/products/types.ts` 是手写结构事实源，非生成物，可改注释）。

- **2026-11-18** 【`/product-solutions/` 主干页重构】把参考站照抄的"产品解决方案"总览页重写为 **BOZE 钛紧固件专属供应方案页**。**红线**：① 严格区隔 `/products/`（按标准号列 SKU）——本页只讲供应方案与工程路径；② 清除贸易商话术（原页 `we match you with the right manufacturer from our worldwide supplier portfolio` / "1 million fastening elements" / "Bossard homepage" 面包屑全部删除，dist 内 `Bossard|worldwide supplier|brand partner|supplier network` 命中 0）；③ 主体口径 = 源头工厂（自有车间 + 三大工厂资产：DIN/ISO/ASTM F467·F468 M1.6–M36 标准件 / NDA 下按图 CNC+冷镦+滚丝 / EN 10204 3.1 + 100% PMI·XRF + 防混料独立包装）；④ C 维度明确"钛不为防锈，为防咬死/耐磨/装配识别"（AMS 2700·ASTM F86 钝化 / AMS 2488 Type II·III 阳极氧化 / PVD·DLC / 固体干膜）；⑤ 零扭矩系数·摩擦系数·防咬死实测数字。
  **结构**：Hero（文案+产品图+定位声明+4 条 standing facts）→ 板块一 标准供应（Gr2/Gr5/Gr23/DIN·ISO·ASTM）→ 牌号对照表 + DIN↔ISO 交叉表 → 板块二 NDA 按图定制 → 板块三 表面工程 → 板块四 合规溯源 → Who/How/Why 深色带 → 双通道 CTA（分销商 / OEM）→ 次级出口。表格数值与深链全部由 `@data/products`（MATERIALS / STANDARDS / FILTER_GROUPS）派生 —— 牌号不在筛选集内时降级到 grade matrix 页，`?standard=`/`?material=` 必然命中真实勾选项。
  **改动文件**：`src/pages/product-solutions/index.astro`（重写）；新建 `src/data/product-solutions/`（`index.ts` 聚合 + `types.ts` + `routes.ts` + `standard-supply.ts` + `custom-manufacturing.ts` + `surface-engineering.ts` + `compliance.ts` + `transparency.ts` + `audience.ts`）；新建 `src/components/sections/product-solutions/`（`SolutionHero` / `SolutionBand` / `SpecTables` / `TransparencyBand` / `AudienceCta`）；删除 `src/data/product-solutions.ts`（单文件版）+ `SolutionCards.astro` + `ProductCallout.astro`；`data/products/finishes.csv` 修正钛用标准（passivated ASTM A967→ASTM F86·AMS 2700，anod ASTM B348→AMS 2488 Type II/III）并重跑 `gen:products`。**BaseLayout / Header / Footer / 全局 CSS / MegaMenu / 导航全部未动**（页面局部组件自建，`<style>` 只用于图栏等高）。
  **验收**：`npm run gen:products` 0 errors；`npm run build` **85 页 Complete! 0 error**；`astro check` 15 errors **全部为存量 Phase A 类型债**（industries / home.ts / services / special-parts），本次新增文件 **0 报错**；dist 内 `/product-solutions/` 页内 48 条 href 逐条 Test-Path → **除全局 CookieConsent 的 `/legal/privacy-policy/`（存量、全站 85 页共有）外全部命中**，本页自身 0 死链；23 张图片引用逐条 Test-Path 全部存在；`check-links.mjs` 的 199 条存量死链与本页无关。
  **遗留（未处理，待单独立项）**：① 4 个 `/product-solutions/` 子页（`innovations` / `product-categories-and-brands` + 12 品类页 / `special-parts-and-custom-fasteners` / `components-specific-solutions/fastener-coatings`）仍是参考站口径且含 Bossard 词与死链（如 `fastener-coatings/functional-coatings/`、`tribological-dry-coatings/`、4 条 `/knowledge-hub/resources/download-center/white-papers/**`）；② `src/data/{special-parts,fastener-coatings,innovations,product-categories-and-brands}.ts` 贸易商话术；③ `src/data/home.ts` 仍指向被移除的 `/knowledge-hub/**`；④ 本页图片多为通用件/工厂场景实拍，待客户提供真钛表面处理与咬死场景实拍后替换。

- **2026-11-18** 【`/product-solutions/special-parts-and-custom-fasteners/` 定制紧固件页重塑】把参考站照抄版（`Bossard homepage` 面包屑 / `we match you with the appropriate manufacturer from our worldwide supplier portfolio` 贸易商话术 / 6 图标卡 / 3 组折叠面板 / 2 组图片滑轨 / `action="#"` 死表单 / 外链 ctfassets PDF）重写为**与 `/product-solutions/` 主干页同构的 BOZE 钛按图定制页**。**红线**：① 身份 = 源头钛工厂，只讲钛（Grade 2 / Grade 5 / Grade 23 ELI），钢·黄铜·铝等泛金属表述全部删除；② 表面处理口径与主干页同源 —— 为**防咬死 / 耐磨 / 装配识别**（AMS 2700·ASTM F86 钝化 / AMS 2488 Type II·III 阳极氧化 / PVD·DLC·干膜），**绝不写成防锈**；③ 零扭矩系数 / 摩擦系数 / 咬死实测数字 / 未确认公差数值；④ 图片 alt 只描述几何与工艺，不宣称未经确认的材质（并把文件名含 `stainless-steel` 的两张图换掉，改为 `13-a-white-lateral-guidance-part` 与 `10-a-black-turned-part`）。
  **结构**：Hero（面包屑 + eyebrow + H1 + 29 词导语 + 3 枚资质标签 + 双 CTA + 4:3 单图 + 4 条 standing facts）→ 能力一 按图定制（NDA 前置 / DFM / 样件→量产）→ 能力二 钛专属表面工程 → **成型路线矩阵表**（路线 × 批量 × 适用场景 × 钛要点，纯表格不配大图）→ 能力三 装配件与套件 → **实物画廊**（4 张 4:3）→ 双通道 CTA（OEM 工程与采购 / 分销商）→ **询盘区（复用 `/contact/` 原生 `ContactInquiryForm`，`source="special-parts-page"`，替换原死表单）** → 次级出口。
  **改动文件**：`src/pages/product-solutions/special-parts-and-custom-fasteners.astro`（重写 + JSON-LD CollectionPage+Organization+BreadcrumbList）；新建 `src/data/special-parts/`（`index.ts` 聚合 + `types.ts` + `routes.ts` + `manufacturing.ts` + `surface-engineering.ts` + `assemblies.ts` + `process-matrix.ts` + `gallery.ts` + `audience.ts`，`routes.ts` 复用 `@data/product-solutions` 的 `PATHS` 保证零死链）；新建 `src/components/sections/special-parts/`（`SpecialHero` / `CapabilityBand` / `ProcessTable` / `PartsGallery` / `SpecialAudienceCta` / `SpecialInquiryCta`）；**删除** `src/data/special-parts.ts`（生成式单文件，其 `scripts/gen-special-parts.mjs` 已不存在）+ 旧 8 组件（`PageHero`/`BenefitsGrid`/`IntroBlocks`/`AccordionGroup`/`ImageRail`/`FinishNote`/`ContactCta`/`Brochure`，全站仅本页引用）；删除 5 张品牌/追踪图片（`14-…bossard-sp` / `68-thumbnail-bossard-…` / `69-70-bossard.svg` / `75-…bing`）并同步清理 `public/images/special-parts-and-custom-fasteners/_manifest.json` 的 5 条孤儿条目。**BaseLayout / Header / Footer / MegaMenu / 全局 CSS / `src/config/site.ts` / `src/data/products/**` / `data/products/*.csv` 全部未动**（本次会话全局文件 mtime 均早于开工时间，零改动）。
  **验收**：`npm run build` **85 页 Complete! 0 error**；`astro check` 由基线 **15 → 12 errors**，本页原 3 条 `ts(2322)`（`special-parts-and-custom-fasteners.astro` 字面量收窄债）**清零**，`check.log` 内 `special-parts` 命中 0；dist 本页 `Bossard` / `worldwide supplier|supplier portfolio|supplier network|brand partner` / `ctfassets` / `torque|friction coefficient` **命中均为 0**，`\bsteel\b|\bbrass\b|\baluminium\b` 命中 2 处且均为全站共用的 `/knowledge-hub/tools/steel-to-titanium-weight-estimator/` 链接（非本页正文）；页内 58 条 href 逐条 Test-Path → 仅全局 CookieConsent 的 `/legal/privacy-policy/` 缺失（存量、全站 85 页共有、非本页引入），本页自身 **0 死链**；20 张图片引用逐条存在，缺失 0；几何实测 = 3 个 band 各 **恰好 1 张** `data-ratio="1.334"` 4:3 图（无纵向堆图）、画廊 4 张 4:3、Hero 1 张 4:3、CTA 2 张 3:2；4 段导语词数 29/23/29/25 **全部 ≤40 词**；h1 唯一、h2 顺序 = Hero → Cap01 → Cap02 → 矩阵 → Cap03 → 画廊 → 双通道 CTA → 询盘 → 相关出口。
  **遗留（未处理，待单独立项）**：① `innovations` / `product-categories-and-brands` + 12 品类页 / `components-specific-solutions/fastener-coatings` 四个子页仍是参考站口径且含 Bossard 词与死链；② `src/data/{fastener-coatings,innovations,product-categories-and-brands}.ts` 贸易商话术；③ 本页图片仍为通用件实拍（车削/冲压弯折/组装），待客户提供真钛表面处理与咬死场景实拍后替换；④ `/about-us/factory/cnc-machining-and-special-parts/` 页本身仍是旧版内容，可与本页互链加强。

- **2026-11-18** 【`/product-solutions/` 移除中部 Who/How/Why 深色带 + 动线重排】上一页把 Google 式"自检三问"做成了横亘页面中部的整屏深蓝色块，严重打断 B2B 买家的「客户痛点 → 解决方案 → 规格选型」商业动线。**做法**：① **彻底删除** `src/components/sections/product-solutions/TransparencyBand.astro` + `src/data/product-solutions/transparency.ts`，并同步清理 `src/data/product-solutions/index.ts`（去 `TRANSPARENCY` import + `transparency` 字段）与 `types.ts`（去 `TransparencyItem` 接口）；② **Who/Why/How 回归首屏导语**：`src/data/product-solutions/index.ts` 的 `hero.lead` 改写为商业口径 —— Who＝源头钛紧固件工厂本身；Why＝分销商缺规格 / OEM 怕咬死与泄密；How＝标准供应 + NDA 按图加工 + 钛专属表面处理 + EN 10204 3.1 交付；`hero.heading` 改为「Titanium Fastener Supply Solutions for Distributors and OEM Buyers」；③ **E-E-A-T 实体信任落到一行极简纯文本**：新增 `hero.factoryNote`（"Every process, tolerance and compliance parameter on this page is approved directly by the Boze Metal workshop production and quality team."），由 `SolutionHero.astro` 在 facts 下方以**无卡片、无边框**的纯文本行渲染（不新增任何板块）；④ **动线重排**：牌号/DIN-ISO 对照表（`SpecTables`）由「板块一之后」移到**四大方案之后、双通道 CTA 之前**，最终顺序 = Hero 定位 → 解决方案一 标准供应 → 解决方案二 NDA 按图定制 → 解决方案三 表面工程 → 解决方案四 合规溯源 → 牌号与标准对照表 → 双通道 CTA（分销商/OEM）→ 次级出口。
  **改动文件**：`src/pages/product-solutions/index.astro`（去 import + 去组件 + 重排 + 注释同步）；`src/data/product-solutions/index.ts`（去 TRANSPARENCY + hero 改写 + factoryNote）；`src/data/product-solutions/types.ts`（去 TransparencyItem）；`src/components/sections/product-solutions/SolutionHero.astro`（新增 `factoryNote` prop + 纯文本行）；**删除** `src/components/sections/product-solutions/TransparencyBand.astro` + `src/data/product-solutions/transparency.ts`。**BaseLayout / Header / Footer / 全局 CSS / MegaMenu / 导航 / 任何真实链接路径全部未动**（未新增或修改任何 href）。
  **验收**：`npm run build` **85 页 Complete! 0 error**（构建日志 `error|Cannot find|failed` 命中 0）；dist 内 `/product-solutions/` 页 `bg-blue-dark` 命中 0、`transparency-heading` 命中 0；`Who we are, why buyers come to us` 与厂方声明文本均命中；h1/h2 顺序实测 = Hero → Solution 01/02/03 → Supply Assurance → Which grade, and which standard → Two ways in → Related information（规格表确认位于合规板块之后、CTA 之前）；页内 46 条内链（去 query/fragment）逐条 Test-Path → 仅全局 CookieConsent 的 `/legal/privacy-policy/` 命中缺失（存量、全站 85 页共有、非本页引入）；`npm run gen:products` 未涉及（无 CSV 改动）。

- **2026-11-19** 【牌号落地页：Grade 2 / Grade 5 两个新路由】用户直接指定两个页面：`/products/grade-2-fasteners/`（Titanium Grade 2 Fasteners）与 `/products/grade-5-fasteners/`（Titanium Grade 5 Fasteners）。
  **Current Status**：两页已交付，build **90 页 Complete! 0 error**，两页均进 `dist/sitemap-0.xml`。
  **最终实现路径（唯一真相源）**：**复用既有的 `src/data/grade-hub.ts` + `src/components/sections/grades/`**，不新建平行实现。中途曾并行造过 `src/data/grade-pages.ts` + `src/components/sections/grade/GradeLanding.astro`，因与既有 `grade-hub.ts` 重复造成双份真相源，**已全部删除**（`src/components/sections/grade/` 目录整体移除）。
  **新增文件**：`src/pages/products/grade-2-fasteners.astro`；`src/pages/products/grade-5-fasteners.astro`。
  **改动文件**：`src/data/grade-hub.ts`（slug/heading 改为 `grade-2-fasteners` / `Titanium Grade 2 Fasteners` 与 `grade-5-fasteners` / `Titanium Grade 5 Fasteners`；补齐 Grade 5 条目缺失的 `band` 字段 —— 含 4:3 图 `TI-TORX-FLANGE-HEAD-BOLTS-BZ-109-bolts-titanium.webp`、导语、3 条要点、CTA `/products/?material=ti-gr5`）；`src/pages/products/index.astro`（新增「By titanium grade」入口段，避免两页成为孤岛）；`src/components/sections/grades/GradeProductTable.astro`（修 `id={`${tableId}-heading`}` 缺右花括号导致的解析错误）。
  **删除文件**：`src/data/grade-pages.ts`；`src/components/sections/grade/GradeLanding.astro`；`src/components/sections/grade/`（目录）。
  **数据纪律**：页面上**每一个数值都来自 `@data/products` 生成层** —— 密度/屈服/抗拉/耐温/耐蚀等级取 `MATERIALS`（→ `data/products/materials.csv`），产品表行由 `ALL_PRODUCTS`（仅 `status=published`）按 `filters.material` 派生，表面处理显示名取 `FINISHES`，标准取 `STANDARDS`；落地页文案不手写任何强度数字，杜绝文案与规格表打架。`?material=ti-gr2|ti-gr5` 是 `FILTER_GROUPS` 中真实存在的 material 勾选项，筛选深链必然命中。
  **实测**：Grade 2 页 = 11 个族（`data-search` 行数 11）、275/345 MPa；Grade 5 页 = 15 个族（`data-search` 行数 15）、828/895 MPa；两页 canonical / og:url 齐备，JSON-LD = CollectionPage + ItemList（11 / 15 项）+ BreadcrumbList（Home > Products > 牌号）+ FAQPage（5 条）；产品表链接逐条指向已存在的 `/products/<category>/<family>/`，**0 死链**；`/products/` 页「By titanium grade」入口两条链接各 1 处；两页均在 `dist/sitemap-0.xml`。
  **Next Step**：① 若需把主导航「Grade 2 / Grade 5」两条从 `?material=` 深链改为指向新落地页，改 `src/config/site.ts` 的 `materialHref`（本轮**未动**，因属全局导航，需单独确认）；② 其余孤儿导航项（Threaded Rods & Studs / Grade 7 & 23 / ASTM-ASME / ASME B18.2.1）仍未处理。
- **2026-11-19** 【Grade 2 / Grade 5 导航深链 → 专属落地页（上一条 Next Step ① 已完成）】用户选定方案 A：改 Grade 2/5 两处路由，CookieConsent 隐私政策死链只登记不动。
  **Current Status**：build **90 页 Complete! 0 error**；全站 Grade 2/5 导航入口已指向专属落地页。
  **新增文件**：`src/data/grade-paths.ts` —— **牌号落地页路径映射的唯一真相源**。刻意做成**不 import 任何东西的叶子模块**：牌号落地页数据在 `src/data/grade-hub.ts`，而它反向 import `@data/standards-hub`（FAQ 类型）；若把映射放进 grade-hub，再让 standards-hub / product-solutions / config 引用，就会形成 `grade-hub → standards-hub → grade-hub` 循环依赖。故另起叶子模块，依赖树最底层，任意层可安全引用。
  **改动文件**（全部只改 href 生成逻辑，**未动任何页面 / 布局 / 全局 CSS / 路由结构**）：
  - `src/config/site.ts`（`materialHref()`：有落地页 → 落地页，否则原 `?material=` 深链；注释同步）
  - `src/data/product-solutions/routes.ts`（第二份 `materialHref()`：落地页 → 真实筛选项 → 牌号矩阵页，三级降级）
  - `src/data/home.ts`（第三份本地副本 `materialHref()`，同上）
  - `src/data/standards-hub.ts`（两条硬编码 `?material=ti-gr5` 改走 `gradeLandingPath('ti-gr5')`）
  - `src/data/industries/hub.ts`（仅注释同步：链接规则描述）
  **Grade 7 / Grade 23 完全不变**：两者无落地页，`ti-gr23` 仍走 `?material=ti-gr23`（90 页实测仍各 1 处），`ti-gr9` 仍降级到牌号矩阵页。
  **刻意保留的两处 `?material=`**：① `src/data/grade-hub.ts` 第 222 / 298 行 —— Grade 2 / Grade 5 落地页**自身**的 band 次要 CTA，方向是「落地页 → 目录筛选结果」，与本次要改的「导航 → 落地页」方向相反，保留；② 全站 90 页的 `ti-gr23` 导航项。dist 精确匹配实测：`material=ti-gr2` 仅 1 处（Grade 2 落地页自身 CTA）、`material=ti-gr5` 仅 1 处（Grade 5 落地页自身 CTA），其余 0 处。
  **实测**：build 90 页 0 error；指向 `/products/grade-2-fasteners/` 的链接 462 条、指向 `/products/grade-5-fasteners/` 的链接 195 条（导航、Industries、Product Solutions、知识库、Footer 等全部命中）；dist 内两个落地页目录均在，`dist/sitemap-0.xml` 均含两页；全站 90 页内链逐条 Test-Path → **牌号相关死链 0 条**，`?material=` 链接指向不存在页 **0 条**。
  **遗留（本轮授权范围外，仅登记不修改）**：`src/components/layout/CookieConsent.astro` 的 `/legal/privacy-policy/` 是全站唯一法律类死链 —— 该路径**既无对应页面，也无任何第三方分析/统计脚本接入**（CookieConsent 文案里提到的 analytics 与站点实际状态不符）。同时 CookieConsent 文案措辞与「当前无第三方分析」的事实不一致。**需业务/法务决策**：是补建隐私政策页，还是删掉该链接并改写 CookieConsent 文案。本轮按用户指示**不改动**。
  **Known Pitfalls（本轮新增）**：⑦ `findstr /c:"material=ti-gr2"` 会把 `material=ti-gr23` 一并命中（前缀子串），导致「残留 92 处」的**误判** —— 统计筛选参数必须用 `material=ti-gr2(?![a-z0-9])` 之类的精确边界，或直接写 `.mjs` 探针用正则断言；⑧ 终端崩溃后 `node xxx.mjs` 也可能因 PSReadLine 崩溃而看不到输出 —— 用 `Start-Process node -ArgumentList 'xxx.mjs' -WindowStyle Hidden -Wait` 触发，脚本自身把结果写盘再读。
  **Known Pitfalls**：① 本机终端输出捕获不可靠 —— `npm run build` 必须 `> build.log 2>&1` 重定向后再读文件，直接读终端会得到空结果；② 日志为 UTF-16，需 `-Encoding Unicode` 读取后再正则过滤，否则全是乱码；③ **PowerShell 交互终端会因 PSReadLine 渲染崩溃（`ArgumentOutOfRangeException`）导致长命令无法执行 —— 把长逻辑写成 `.mjs` 脚本文件再用 `node xxx.mjs` 调用**，日志同样落盘再读；④ **Astro 组件内 `id={`${tableId}-heading`}` 这类「内联模板字符串属性」会被编译器误解析成 `$$addAttribute` 少一个参数，报 `Expected ")" but found "class"` —— 定位方法：`@astrojs/compiler` 单独 transform 该文件后交给 esbuild，可拿到精确行列**；⑤ `text-p-s` 是 `src/styles/global.css` 里的 `@utility`（不是 Tailwind 原生类），可直接用；⑥ `astro build` 只能通过 `scripts/astro-build.mjs` 启动（Windows 路径大小写问题，见 `astro.config.mjs` 注释），不可换成裸 `astro build`。
- **2026-11-20** 【最后三个细分行业应用页：marine-offshore / rail-rolling-stock / data-centers】三页统一走 `ApplicationPage.astro` 模板（与 aerospace-uav / medical-devices / electric-vehicles / chemical-corrosion / semiconductor-vacuum / desalination / industrial-robotics 同构）。
  **Current Status**：build **98 页 Complete! 0 ERROR**；`astro check` 6 errors = **存量基线**（`docs/legacy/contact-index.v1.astro`、`src/data/home.ts`、`src/pages/industries/aerospace.astro`、`src/pages/services/index.astro`），**本次三个新文件 0 命中**。三条路由 dist 均已生成且各含 1 段 JSON-LD、4 个 FAQ `<details>`。
  **新增文件**：`src/data/industries-marine-offshore.ts`、`src/data/industries-rail-rolling-stock.ts`、`src/data/industries-data-centers.ts`（均为 `AppPageData`）+ `src/pages/industries/{marine-offshore,rail-rolling-stock,data-centers}.astro`（各 3–8 行，仅 import + 一行 `<ApplicationPage page={...} />`）。
  **改动文件（唯一一处）**：`src/pages/industries/[slug].astro` 的 `getStaticPaths` 内 `LOADERS` 映射 —— 删除 `'data-centers': () => import('@data/industries-sub/data-centers')`。原因：`/industries/data-centers/` 原先由 CMS 家族（参考站抓取产物，仍带参考品牌口吻）承载，与新静态页**同 slug 路由冲突**；改为静态页接管后 loader 必须移除该条，**否则 Astro 报重复路由**。`src/data/industries-sub/data-centers.ts` 文件本身保留（AUTO-GENERATED 产物，不手改），只是不再被 loader 引用。`/industries/railway/`（CMS 家族）与 `/industries/rail-rolling-stock/`（新应用页）**两条路由并存、互不覆盖**。
  **数据溯源**：产品卡与链接全部来自生成目录（`ALL_PRODUCTS` / `FAMILIES` / `MATERIALS`），牌号链接走 `materialHref('ti-gr2'|'ti-gr5')`；grade 数值（828 MPa 抗拉/屈服、腐蚀 4/5）取自 `src/data/products/materials.ts`；Grade 7 无 published row，文案统一写「Confirmed per order」。图片全部来自本地已落盘资源（`industries-railway/*`、`industries-data-centers/*`、`category-detail-rivet-technology/*`、`category-detail-sealing-technology/*`、`category-detail-fluid-management/*`、`category-detail-securing-and-anti-loosening-elements/*`），已逐个 Test-Path 确认存在，**无船舶/数据中心实景图时用匹配五金件图并明确 alt 描述，不暗示为实景照片**。
  **已知遗留（非本次引入，勿误判为新问题）**：`scripts/check-links.mjs` 报 190 条死链，其中 98 页共有的 `/legal/privacy-policy/`（CookieConsent，2026-11-19 已登记待法务决策）与参考站抓取遗留的 `/industries/aerospace/about-bossard-aerospace/**`、`/products/02.*` 数字锚链均为存量；**本次三个新页未新增任何死链**（其页面内唯一"死链"是 `/legal/privacy-policy/`，来自全局 CookieConsent，非本轮引入）。
  **Known Pitfalls（本轮新增）**：⑨ `editor` 工具的 `insert_line` 是**按行号插入**，不是按锚点插入 —— 若目标文件已有更多行，插入会落在文件中部导致语法错乱（本轮 `industries-data-centers.ts` 即因此报 `Expected "}" but found ";"`）。**正确做法：先 `write_file` 建完整文件，或用 `old_text`/`new_text` 做整块替换**；单次 `new_text` 超过 6000 字符会被拒绝，需分块。⑩ `qa/` 下 `_*` 前缀文件属临时探针（`.gitignore` 已忽略 `qa/*`），**交付前必须删除**；`build.log` 亦为临时产物（已 gitignore）。
- **2026-11-20** 【隐私政策页补建 + 行业页 sprite 死链修复（上一轮登记的法务待决策项落地）】
  **Current Status**：build **99 页 Complete! 0 ERROR / 0 WARNING**（基线 98 页 +1 隐私政策页）；`scripts/check-links.mjs` 死链 **190 → 187（-3，无新增类别）**；三个目标链接全部 RESOLVED —— `/legal/privacy-policy/`、`/privacy-policy/`、`/_astro/sprite.CNhkymMS.svg`；dist 内 `/_astro/sprite` 命中 **0**、属性级 `href="/privacy-policy/"` 命中 **0**；`dist/images/sprite.svg` 存在且含 `id="minus"` / `id="close"`。
  **新增文件**：`src/data/legal.ts`（`PRIVACY_POLICY` —— 唯一文案真相源，**手写非生成物**）、`src/components/sections/legal/LegalBody.astro`（事实表 + 处理目的 + 分节正文，零新增全局样式）、`src/pages/legal/privacy-policy.astro`（面包屑 + Hero + LegalBody + CTA）。
  **改动文件（2 个）**：① `src/data/innovations.ts` —— 表单同意行 `/privacy-policy/` → `/legal/privacy-policy/`；② `src/components/sections/industries-sub/MediaAccordion.astro` —— 渲染期 `replaceAll('/_astro/sprite.CNhkymMS.svg', '/images/sprite.svg')`，**只改路径、保留 `#minus`/`#close` 片段**。
  **路由唯一**：只建 `/legal/privacy-policy/` 一条，**不做重定向、不做双路由**。`src/data/industries-sub/**` 生成物**未手改**（sprite 修复放在渲染层，因上游生成器已不在本仓、无法重生成）。
  **政策文案口径（已逐条对代码核对，非模板套话）**：站内**无任何第三方统计/广告脚本**；同意偏好只写浏览器 `localStorage`（键 `tf-cookie-consent`）、不设 cookie、不发服务端；唯一第三方嵌入 = 页脚 Google Maps iframe，**点击后才加载**；询盘 POST 到自有端点 `fastener.bozemetal.com/api/inquiry`，未接后端时降级 `mailto:`；无账号体系、无支付、不保存用户上传的图纸文件（要求先签 NDA）。
  **Next Step（本轮唯一未闭环项 = 需法务/业务确认）**：① `facts` 中 `Last updated: 20 November 2026` 的显示日期；② 保留期限目前是**定性描述**（"as long as it takes to answer…"、"logs are rotated on a short cycle"）无数值，是否需写具体月数；③ 处理者清单目前为**类别级**（hosting provider / shipping carrier / customs broker），是否需具名公司；④ 欧盟/英国投诉权已写，但未指定 DPO 与属地监管机关；⑤ `CookieConsent.astro` 组件自身文案仍提 analytics，与政策页「无第三方分析」表述需对齐 —— **本轮未改**（属全局组件改动，需单独授权）。
  **Known Pitfalls（本轮新增）**：⑪ `scripts/check-links.mjs` **存在死链时以 exit code 1 退出** —— 用 `execFileSync` 会直接抛错、拿不到 stdout，必须改 `spawnSync` 读 `res.stdout`（stdout 仍是完整 JSON）。⑫ 校验 legacy 路由是否残留时，正则 `/(^|[^/])\/privacy-policy\//` 会**误报** `/legal/privacy-policy/`（后者含前者）—— 应按属性级精确匹配 `href="/privacy-policy/"`。⑬ PowerShell `>` 重定向写出的日志是 **UTF-16LE**，直接 `readFileSync(...,'utf8')` 全是乱码，须先判 `raw[0]===0xff && raw[1]===0xfe` 再按 `utf16le` 解码。⑭ 终端输出捕获失败时，把校验逻辑写进 `.mjs` 脚本并让它**把结果写盘**再读，比在命令行里拼长表达式可靠。

