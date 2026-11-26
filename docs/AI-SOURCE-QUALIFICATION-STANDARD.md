# AI 搜索选源资格检查标准（可执行版）

> 来源：《工业 B2B 商业页面 AI 搜索选源资格检查标准》（仓库根目录同名 .md）
> 执行体：`scripts/check-ai-source.mjs` ｜ 报告：`qa/ai-source-report.json` ｜ 命令：`npm run check:ai-source`
> 本文件只写「怎么判、怎么改」，不重复标准原文。

---

## 1. 为什么要有这道闸门

AI 搜索（ChatGPT / Perplexity / Google AI Overviews）选源时抓的是**片段**，不是整页。
一个页面能不能被选中，取决于两件事：

1. **能不能被读到** —— canonical 指错、noindex、h1 缺失，搜索引擎和 AI 抓取器就拿不到正确版本。
2. **读到之后敢不敢引** —— 正文里有别的公司的品牌、有咨询腔套话、没有可核查的标准与牌号，
   AI 引用时要么不引，要么引错。

这两件事都不是「文案好不好看」的问题，是**资格问题**。所以闸门只设两个硬门槛，
其余五个维度用分数排序修复优先级。

---

## 2. 六维权重与硬门槛

| # | 维度 | 权重 | 性质 | 判定内容 |
|---|---|---|---|---|
| ① | 索引资格 | 20 | **硬门槛** | canonical 指向自身 URL；未被 noindex 排除；唯一 h1；html lang 已声明；title / description 非空 |
| ② | 查询相关性 | 20 | 评分 | h1 非泛化词且含业务实体；h2 ≥ 3；采购意图词 ≥ 3；title 20–75 字符；description 60–160 字符 |
| ③ | 事实与证据 | 20 | **硬门槛** | 无参考站品牌残留；含可核查标准 / 牌号锚点（DIN、ISO、ASTM、AMS、EN 10204、Grade 2/5/23、Ti-6Al-4V、M1.6–M36） |
| ④ | 信息完整性 | 15 | 评分 | 规格锚点 ≥ 2；含交易信息（交期 / 库存 / 包装）；含 FAQ 或规格表；无 AI 咨询腔套话 |
| ⑤ | 来源可信度 | 15 | 评分 | Organization 结构化数据或 about 入口；制造方身份声明；联系入口存在 |
| ⑥ | 商业转化 | 10 | 评分 | 询盘入口（表单或 /contact/）；询盘动作文案 |

**硬门槛 = ① + ③。** 任一硬门槛项失败 → 该页 `hardFail = true` → 脚本 exit 1，部署被阻断。
理由：canonical 错了是「读到的是别页」，品牌残留是「引到的是别家」——这两种错误
用其它维度的高分换不回来。

**为什么 title / description 长度不设硬门槛：** 长度是收录与呈现问题，不是资格问题。
放进 ② 做评分，让它参与优先级排序，而不是一票否决。

**为什么 AI 咨询腔（Seamless / Cutting-edge / Unlock / Elevate / Comprehensive…）不设硬门槛：**
这些是内容质量问题，不是事实错误。它会让 AI 觉得「这段话没有信息量」，
但不会让一个牌号变成假的。放 ④ 扣分。

---

## 3. 分数档位与处置

| 分数 | 档位 | 处置 |
|---|---|---|
| 80–100 | 良好 | 不动 |
| 60–79 | 优先修复 | 按扣分最多的维度排期 |
| < 60 | 基础质量问题 | 该页不具备选源资格，先修基础项 |

---

## 4. 词表口径（改标准前先改这里）

三个词表都集中在 `scripts/check-ai-source.mjs` 顶部：

- `REFERENCE_BRANDS` —— 参考站品牌与第三方平台名。命中即硬门槛失败。
  **大小写不敏感**，且扫描范围是 `body + 整页 HTML`，因此图片文件名与 alt 文案里的
  品牌残留同样会被抓到（例如 `04-bossard-smart-tool.webp`）。
- `AI_FLUFF` —— AI 咨询腔套话。命中扣 ④ 的分，不阻断。
- `SPEC_ANCHORS` —— 可核查的技术锚点。命中才算「有事实依据」。

新增词条时注意：**`REFERENCE_BRANDS` 加词会让页面立刻红**，加之前先确认
目标词确实不该出现在任何客户可见文案里。

---

## 5. 使用方式

```bash
npm run build                     # 闸门读 dist/，必须先构建
npm run check:ai-source           # 全站扫描，硬门槛失败 exit 1
npm run check:ai-source -- --pages /products/grade-5-fasteners/   # 只看指定页
npm run check:ai-source -- --quiet                                # 只输出失败项
```

报告结构：

```
{
  generatedAt, origin, standard, hardGates, thresholds,
  pages: [ { path, total, scores{1..6}, hardFail, gateFailures[], noindex, words } ]
}
```

CI 已接入（`.github/workflows/deploy-ftp.yml`）：`Gate — AI source qualification`
在 build 之后、deploy 之前执行，失败即阻断发布。

---

## 6. 修复手册（按症状找动作）

| 闸门报的问题 | 典型成因 | 修哪里 |
|---|---|---|
| `1:canonical 指向自身 URL` | 模板对已含前缀的 path 再次拼前缀；或用 trailing-slash pathname 末段反推 slug | `src/pages/services/[family]/[slug].astro`、`src/pages/services/benefits/[slug].astro` |
| `3:无参考站品牌残留` | 数据层照抄参考站文案、图片文件名带品牌、alt 文案带产品名 | `src/data/services-sub/**`、`src/data/services-detail/**`、`public/images/**` |
| `3:含可核查标准/牌号锚点` | 页面全是泛化描述，没有 DIN/ISO/ASTM/牌号 | 页面数据层的 hero + benefits 文案 |
| `4:无 AI 咨询腔套话` | 参考站原句里的 Seamless / Cutting-edge / Unlock | 页面数据层正文，逐句替换成制造事实 |
| `2:title 长度` / `description 长度` | SEO 文案超长或过短 | 页面 `seo` 字段 |

**原则：修事实，不修分数。** 不要为了让某一项变绿而往页面里塞关键词；
闸门只认「可核查的标准与牌号」和「没有别人的品牌」，不认堆砌。

---

## 7. 本轮边界（2026-11-26）

- 不改 `src/styles/global.css`、`BaseLayout.astro`、`SiteHeader.astro`、`SiteFooter.astro`。
- 不改路由结构，不改 `data/products/*.csv`。
- 不批量重写全站 title / description（只修硬门槛失败页）。
- 删除 `public/images/` 里已无引用且文件名带参考站品牌的素材时，同步更新引用方。
