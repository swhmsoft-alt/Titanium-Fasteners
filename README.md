# README — 参考站逆向重建系统

> **项目**：紧固件企业官网 `fastener.bozemetal.com`（bozemetal.com 体系），品牌 Titanium Fasteners
> **方法**：以国际同行参考站为**唯一原型**，做有证据的视觉与结构复刻
> **状态**：Phase 0–3 ✅ ｜ Phase 4（分类页 ✅ 详情页 ✅ 总览页/服务页/行业页/文章页 ⬜）｜ Phase 5（逐页验收 ✅ 移动端与全站回归 ⬜）
> **每轮开工先读 `HANDOFF.md`**（唯一入口，约 2K token）；本文只作项目总览

## 复刻 ≠ 继承 ≠ 改版

以参考站为唯一原型，把它的设计语言与信息架构**完整、逐项、有证据地**还原到一个新站点。

| 维度 | 本项目做法 |
| --- | --- |
| 视觉（色彩/排版/间距/圆角/栅格/动效/图片比例/组件形态） | **严格复刻参考站实测值**；`src/styles/global.css` 的令牌**就是**参考站的设计系统 |
| 内容（文案/产品数据/图片/图标/Logo） | **Phase A 直接取用参考站**：文案逐字原文，图片/图标/Logo 下载后本地化落盘 |
| 信息架构（导航树/分类命名/页面语义） | 照抄参考站的**解决方案导向**结构，**不得**改写为产品目录 |
| 技术栈/构建/目录约定 | 沿用姊妹项目 `AstroFlow-master-jt`（纯工程基建复用） |

**两阶段**：Phase A 复刻（1:1 照抄，验收＝与参考站逐屏一致，不一致处记 P0）→ Phase B 上线前批量替换自有内容（依据 `qa/DEVIATIONS.md` 的「Phase B 待替换」列）。
Phase A 期间**禁止任何主观优化** —— "这样更好"的念头只记台账，不许动手。

**姊妹项目边界**：`cnc.bozemetal.com` 同属 bozemetal.com 体系但设计语言不同。技术栈/构建/SEO 基建 ✅ 可用；**色彩**（姊妹 slate/teal `#1e40af`/`#14b8a6`/`#0f172a`）、**排版比例尺与字体栈**（Inter）、**文案**、**Logo/favicon/OG 图**、**组件实现代码** ❌ 禁用 —— 本项目用参考站蓝灰体系（`#007ac3`/`#004975`/`#001827`/`#cce4f3`）+ Archivo。
**验收口径**：任何元素若"看起来像 bozemetal.com"，即判定为**偏离复刻目标**。

## 快速开始

```bash
npm install
npm run dev        # 开发服务器
npm run build      # 生产构建（务必用这个，不要直接 astro build）
npm run preview    # 预览产物 :4321
```

⚠️ **Windows 构建陷阱**：小写盘符路径会产出**零 CSS 却报告成功**的产物；`npm run build` 已路由到 `scripts/astro-build.mjs` 规范化路径大小写。

## 目录结构

```
src/styles/global.css      ★ 设计令牌（@theme，事实源）     docs/RECIPE.md      ★ 单页复刻 SOP
src/config/site.ts         ★ 站点配置                      qa/DEVIATIONS.md   ★ 偏差台账
src/components/{ui,layout,sections}/  UI 与区块           qa/targets/*.json  验收基线（机器生成）
src/data/  页面数据层      src/pages/  路由                  qa/ref/*.json      参考站实测
.clinerules/.clinerules.md ★ 强制规则                      docs/visual-qa.md  ★ 验收台账
scripts/  探针·素材·基线·验收流水线                        HANDOFF.md         ★ 每轮开工必读
```

★ = 开工前必读。按需读**单个**文件，禁止通读；索引见 `HANDOFF.md` §5。

## 执行顺序

```
Phase 0 基座 ✅ ｜ Phase 1 逆向分析 ✅ ｜ Phase 2 设计系统与组件库 ✅ ｜ Phase 3 首页 ✅（7 区块，待复测）
Phase 4 分类页 ✅ 详情页(p/272) ✅ 总览页 ⬜ 服务页 ⬜ 行业页 ⬜ 文章页 ⬜
Phase 5 移动端 ⬜ 服务/行业/文章页 ⬜ 全站回归 ⬜
```

**一次只推进一个 Phase。** 每页完成后更新 `docs/visual-qa.md` 与 `qa/DEVIATIONS.md`；单页标准流程（实测参考站 → 写 target → 实现 → measure 到 P0=0）见 `docs/RECIPE.md`。

## 证据等级

- **`VERIFIED`** —— 来自浏览器实测（DOM / 计算样式 / 编译后 CSS）
- **`ESTIMATED`** —— 合理推断但未实测，**必须显式标注**；**不得直接作为实现依据**，须先补做实测

待关闭的证据缺口见 `HANDOFF.md`；参考站已实测的 14 条关键结论见 `docs/visual-qa.md`「参考站实测存档」。

## 合规边界

| 资产 | Phase A 做法 |
| --- | --- |
| 字体 | **Archivo**（SIL OFL 1.1）；**不**使用 DIN（FF DINPaneuropean，商业授权字体文件，不在参考站网页资产中） |
| Logo / 产品图 / 工业摄影 / 图标 / 文案 | 直接取用参考站，下载后本地化落盘 `public/images/`，保持原比例 |
| 参考站资源 | 允许下载并本地化落盘；**禁止热链**（`*.ctfassets.net` 直链会因 Referer / CORS / 失效随机破图） |

Phase A 复刻的是**布局、交互模式、信息架构、设计方法与内容本身**；Phase B 才批量替换为自有品牌与自有内容。

## 视觉验收环境（固定）

桌面 1440×1000 DPR 1 ｜ 移动 390×844 DPR 3。流程与判定标准见 `docs/visual-qa.md`。
**没有截图证据，不得声称视觉完成。**
