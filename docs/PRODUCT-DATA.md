# PRODUCT-DATA — Phase B 产品数据层

> **一句话**：产品不是「上传」的，是「参数化派生」的。
> 你维护的是 **产品族 + 规格矩阵（CSV）**，SKU、素材映射与页面由构建期派生。

---

## 1. 为什么不是 Airtable / Keystatic

| 方案 | 裁决 | 理由 |
| --- | --- | --- |
| Airtable / 在线表格 + build 时 fetch | **否决** | 破坏构建可复现性（同一 commit 在不同时间产出不同 HTML）；CI 需长期密钥；有限速；外部状态漂移即污染产物 |
| Keystatic / Decap 作产品主库 | **否决** | 几百行尺寸矩阵在表单里编辑是灾难；与既有 `src/data/*.ts` 形成双真相源 |
| **Excel/CSV 入库 + 生成器 → 类型化 TS** | **采纳** | 完全复用仓库既有 `scripts/gen-*.mjs` → `src/data/*.ts` 模式；构建 hermetic；数据 diff 可评审；零新运行时依赖 |

> Keystatic / Decap **不是不能用**，而是**不该承载产品参数**。若将来要编辑新闻/技术文章，可单独引入作散文后台 —— 但绝不承载规格矩阵。

---

## 2. 目录结构

```
data/products/                          ← 人工维护区（Excel 友好，Git 可 diff）
├─ families.csv                         ← 产品族（页面的 SEO 主体）
├─ materials.csv                        ← 材质牌号字典
├─ finishes.csv                         ← 表面处理字典
├─ standards.csv                        ← 执行标准字典（DIN/ISO 编号 + type）
├─ param-schema.csv                     ← 参数字典：type → 该类型的尺寸表列结构
├─ dimension-library.csv                 ← 工程尺寸库（导入时按标准+关键参数查表补全）
├─ sku-codes.csv                        ← 类型/材质/表面的短码字典
├─ _template/                           ← 批量导入模板 + 说明（唯一录入格式）
└─ dimensions/
   └─ <family_id>.csv                   ← 规格矩阵（族 × standard → 螺纹 × 长度 × 尺寸）

src/data/products/                      ← 生成产物（禁止手改）
├─ types.ts                             ← 类型契约（唯一结构来源，手写但稳定）
├─ families.ts  materials.ts  finishes.ts  standards.ts  param-schema.ts
├─ assets.ts                            ← 素材登记簿（图/CAD/PDF ↔ SKU 的映射）
├─ dimensions/<family_id>.ts
└─ index.ts                             ← 汇总入口 + skuRows() 派生函数

public/images/products/<SKU>-01.webp    ← 产品图（文件名 = SKU + 序号）
public/download/cad/<SKU>-01.step       ← CAD
public/download/spec/<SKU>-01.pdf       ← 规格书
```

**读写方向固定**：`data/products/*.csv` →（`npm run gen:products`）→ `src/data/products/*.ts` → 页面 import。
页面**只**从 `@data/products` import，**永远不**直接读 CSV。

---

## 3. 一次完整的数据变更流程

```bash
# 1. 用 Excel 编辑 data/products/ 下的 CSV（不要改 src/data/products/）
# 2. 生成 + 校验（0 error 才算通过）
npm run gen:products

# 3. 页面层照常构建验收
npm run build
```

`npm run gen:products` 输出格式：

```
=== gen:products ===
families   2
materials  4
...
skus       2 (one per family)
written    13 files -> src/data/products/

WARNINGS (1):
  W001  family "hex-nut"（SKU TI-HEX-NUT）还没有主图 —— 期望 public/images/products/TI-HEX-NUT-01.webp

0 errors — gate passed.
```

- **error** → 退出码 1，产物**已写出但不可信**，禁止继续 build。
- **warning** → 退出码 0，仅提示素材待补。

---

## 4. 各表字段

### families.csv — 产品表（编辑人员填的核心信息）

**只有 9 列。** 其余全是派生的 —— 少存一列就少一处真相。

| 列 | 说明 |
| --- | --- |
| `family_id` | kebab-case 唯一 id，同时是 URL 片段 |
| `name` | 展示名 |
| `category` | 所属分类 id，对应 categories.csv（**必填**，两层树的顶层） |
| `type` | 产品类型（screw / bolt / nut / washer / stud …），决定矩阵列结构 |
| `standards` | 标准 id，多个用 `\|` 分隔 → **多规格交叉的入口**；**可以留空** |
| `materials` | 材质 id，`\|` 分隔 |
| `finishes` | 表面处理 id，`\|` 分隔 |
| `description` | 页面描述 |
| `image` | **第 9 列**：客户原图名（如 `BN-272-01.jpg`）。落盘名 = `<SKU>-<原图名>` |

**派生（不落 CSV）**：`sku`（← family_id）·
`image`/`cad`/`pdf`（← 素材扫描）· `seo_title`（← name + 标准名）· `seo_description`（← description）。

> **为什么 `type` 落 CSV 而不是由标准派生** —— 标准只是规格矩阵的一个维度，不是产品类型
> 的来源。派生会锁死三件事：无标准产品（`standards` 留空）无法定类型、挂多个标准时类型
> 取决于书写顺序、同一族换标准要连带改列结构。显式存 `type` 后，
> 「无标准 / 多标准 / 自动登记的新标准」都不再是特例。

> **产品表与管理表分开** —— `families.csv` 只放产品本身；状态与商务数据在
> `management.csv`（见下）。改状态不会碰到产品字段，反之亦然。
>
> **没有 `cad` / `pdf` 列** —— 素材路径由 SKU 约定推导
> （`public/images/products/<SKU>-<原名>.<ext>`），扫描 `public/` 生成 `assets.ts`。
> 「哪个图对应哪个产品」是算出来的，不是 CSV 里记的 —— 记的会错，算的不会。
>
> **SKU = `TI-` + family_id 大写**（如 `TI-HEX-SOCKET-HEAD-CAP-SCREW`）。
> 一个族一个 SKU；族下的 (规格 × 材质 × 表面) 是这个 SKU 的可订购组合。
> 详见 `docs/PRODUCT-MANUAL.md` §6.5。

### management.csv — 管理表（状态与商务数据）

按 `family_id` 与产品表关联，一个族一行。

| 列 | 说明 |
| --- | --- |
| `family_id` | 关联产品表 |
| `status` | `draft`（不进 sitemap/导航，页面 noindex）\| `published` |
| `moq` | 最小起订量 |
| `packaging` | 包装方式 |
| `lead_time` | 交期 |
| `price_from` / `price_to` | 起步价 / 最高价（数值，空 = 未提供） |
| `price_currency` / `price_unit` | 币种 / 价格单位 |

> 商务字段当前为空 —— 客户尚未交付真实数据，页面不渲染 Ordering information 区块
> （展示占位假价比不展示更糟）。数据到位后填这张表 + 在 `FamilyHero.astro` 恢复区块。

> **商务字段当前不在表里**（`moq` / `packaging` / `lead_time` / `price_from` / `price_to` /
> `price_currency` / `price_unit`）。客户尚未交付真实商务数据 —— **展示占位假价比不展示更糟**，
> 所以族页当前不渲染「Ordering information」区块。数据到位后：加回 7 列 + 恢复该区块即可。

### categories.csv — 产品分类（两层树顶层）

| 列 | 说明 |
| --- | --- |
| `id` | kebab-case 唯一 id，同时是 URL 片段 |
| `name` | 展示名 |
| `description` | 分类页描述（同时用作 meta description） |
| `image` | `public/` 下分类图路径 |
| `order` | 展示顺序 |

**路由形态**：`/products/<id>/`（族页是 `/products/<category_id>/<family_id>/`）

> **为什么族页带分类层？** 分类页与族页前缀相同，但**段数不同** ——
> 分类页 2 段（`/products/screws/`），族页 3 段（`/products/screws/hex-nut/`）。
> 段数不同，Astro 才能区分两份 `getStaticPaths` 而不互相覆盖。
> 仓库禁止跳转/重定向，所以这个形态一旦定下就是契约（产品区专用纪律；
> 非产品区如行业旧 URL 的退役跳转见 docs/redirects-industries.md）。
>
> **分类 id 不能与族 id 同名** —— 否则 `/products/<id>/` 会同时是分类页与
> 族页，Astro 静默产生重复路由。数据闸门 **E036** 在生成阶段直接拦下。

### materials.csv / finishes.csv / standards.csv — 字典

字典是**单行即完整**的结构（不是矩阵），所以字典本身不需要拆行 —— 材质多时用 `materials.csv` 增行即可。

`standards.csv` 一行同时带 `din` 与 `iso` 两列，这是**多规格交叉**的表达方式：一族挂 `din-912` 一个 id 就能在页面上同时显示 DIN 912 与 ISO 4762。
`iso` 列可写多个等价号（`ISO 7380-1 | ISO 7380`），导入时按 DIN/ISO 两种写法都能归一到同一行。

`standards.csv` 的 `type` 列是**参考信息**（这个标准通常对应哪种产品），不再决定产品类型 ——
产品类型由 `families.csv` 的 `type` 列显式给出。

新增一列 `auto`：`1` = 由批量导入**自动登记、待人工核对**的标准。清单里出现字典里没有的
标准号时，导入不会报错，而是自动登记一行并标 `auto=1`；核对后补齐标准号/标题并改成 `0`。
没有工程尺寸来源的族，其规格行只填关键参数（螺纹 × 长度），闸门记 W002 而不是 E019 ——
先按基础规格上架，尺寸等抽取器补齐。

### param-schema.csv — 参数字典

| 列 | 说明 |
| --- | --- |
| `type` | 产品类型（screw / bolt / nut / washer …） |
| `param` | 参数机器名（thread / length / d1 / k / b …） |
| `label` | 表头显示名 |
| `unit` | `mm` / `-` |
| `required` | `1` 必填 / `0` 可选 |
| `key` | `1` = 参与唯一键 |
| `order` | 列顺序 |

**不同类型的参数集不同**：螺母没有 `length`，垫圈没有 `thread`。这是类型系统的意义 —— 表头不是硬编码的。

### dimensions/<family_id>.csv — 规格矩阵

列 = `standard` + 该族 type 在 param-schema 中定义的全部参数（按 `order`）。
`standard` 列的值必须是该族 `standards` 列表中之一。

### dimension-library.csv — 工程尺寸库

列 = `standard` + 全部工程参数（`thread length d1 d2 s k b t m h`）。
批量导入时按 (标准 + 该类型的 key 参数) 查表补全用户没填的尺寸。库里缺 → 导入报错并指出缺哪一行。

> **这是工程数据 —— 填错会直接导致买家下错件。尺寸一律走抽取器，不手填。**
>
> **当前来源**：Bossard 公开发布的产品变体索引（Algolia `prd-products-en`，只读公共检索端点）
> 携带的成品工程属性 —— 头径 `d2`、对边 `s`、头高 `k`、头厚 `t`、对角 `e`、全长 `L`；
> 螺纹外径 `d1` 取 ISO 粗牙 `d1 max` 公共列；全螺纹件的 `b`（螺纹长）= 全长 `L`。
> 取的是**标准公称值**，不是对方的文案 / 图片 / 品牌资产。
>
> 抽取器：`node scripts/gen-bossard-dimensions.mjs --apply`（可重跑，**幂等**）。
> 选哪个 BN 有讲究（同一标准下有多个产品形态、尺寸表不同）—— 详见
> `docs/BOSSARD-TITANIUM-DECISION.md` §5.1。
>
> ⚠️ **同一张表里不允许混两套列语义**：既有 din-912 / din-934 行的 `b`/`t`/`m` 来自 ISO 表的
> 「部分螺纹 b」「t 上限」「1.0d 厚」；新标准用「全螺纹 b=L」「t 下限」「0.8d 厚」。
> 故 `--apply` **只新增、不覆盖**。要统一必须拿到 ISO 标准正本后一次性重写，不可拼凑。


### sku-codes.csv — 短码字典

`kind,id,code` 三列。给类型/材质/表面配一个短码（如 `screw,SHS`），用于可读性强的编号场景。

---

## 5. 校验闸门（E/W 编号表）

| 码 | 级别 | 含义 |
| --- | --- | --- |
| E000 | error | 缺少数据文件 |
| E001 | error | 缺少必需列 |
| E002 | error | id 重复 |
| E003 | error | param-schema 的 type 没有 key 参数 |
| E010 | error | family 的 type 不在 param-schema 中 |
| E011 | error | status 非法 |
| E012–E014 | error | 引用了未知 standard / material / finish |
| E015 | error | family 缺少维度矩阵文件 |
| E016 | error | 矩阵含未知列 |
| E017 | error | 矩阵缺 standard 列 |
| E018 | error | 行的 standard 不在 family 的 standards 列表 |
| E019 | error | 行缺必填参数（该标准在尺寸库里有这一档 → 数据漏填） |
| E020 | error | mm 参数的值不是数值 |
| E021 | error | 重复的规格组合 |
| E022 | error | 矩阵无数据行 |
| E023 | error | family 引用了不存在的行业页 |
| E024 | error | family 引用了未知 category |
| E025 | error | family 未指定 category |
| E026 | error | price_from / price_to 不是数值 |
| E027 | error | 填了价格但缺 price_currency |
| E028 | error | price_from 大于 price_to |
| E029 | error | SKU 重复 |
| E030 | error | 孤儿素材：文件名前缀不匹配任何 SKU |
| E031 | error | 素材文件名不合约定（应为 `<SKU>-<两位序号>.<ext>`） |
| E034 | error | 产品在 management.csv 里没有管理记录 |
| E035 | error | management.csv 里有孤儿管理记录（产品表里没有这个族） |
| W001 | warn | 族还没有主图（image 列留空或文件不存在） |
| W002 | warn | 规格行缺工程尺寸（该标准在尺寸库里没有这一档）—— 先按基础规格上架 |

---

## 6. SKU 与素材映射

### SKU

```
SKU = TI-<family_id 大写>
family_id = hex-socket-head-cap-screw  →  SKU = TI-HEX-SOCKET-HEAD-CAP-SCREW
```

- **唯一** —— family_id 唯一即 SKU 唯一，E029 兜底。
- **稳定** —— SKU 不含名称，产品改名不影响 SKU。
- **可念** —— 电话报号无歧义。
- **不冗余** —— 标准/材质/表面是 SKU 的**属性**，不塞进码里（塞进去改个标准就换号了）。

一个族 = 一个 SKU。族下的 (规格 × 材质 × 表面) 是这个 SKU 的可订购组合：
**报号报 SKU，询盘说组合。**

### 素材映射

```
public/images/products/<SKU>-01.webp
public/download/cad/<SKU>-01.step
public/download/spec/<SKU>-01.pdf
```

- 扫描规则只在 `scripts/lib/assets.mjs` 一份，生成器与 CLI 共用 —— 两边不会漂移。
- 序号 = 展示顺序（`01` 是主图）。
- 孤儿素材（E030）与命名不合规（E031）**阻塞构建**；缺图（W001）不阻塞。

---

## 7. 页面粒度（已决）

**页面数 ≠ 产品数。** 按 SKU 建页在静态 SSG 下不可行（5 万页 → 构建以小时计、HTML 以 GB 计、sitemap 不可用）。

实际策略：**族页 + 分类页 + 总览页**，量级 60–200 页，单页含几百行表格。Google 对此更友好（少而富 > 多而薄）。

> **URL 必须现在定死。** 产品区禁止任何跳转/重定向，若批量生成后再改 URL = 全站死链且无处可退。

当前形态：

| 页面 | 路由 |
| --- | --- |
| 产品总览 | `/products/` |
| 分类页 | `/products/<category_id>/` |
| 族详情页 | `/products/<category_id>/<family_id>/` |

---

## 8. 询盘与结构化数据（Phase B 转化目标）

- **JSON-LD**：`BaseLayout.astro` 已内置 `jsonLd` prop（注入 `application/ld+json`），Phase B 接 `Product` / `Offer` / `BreadcrumbList`。
- **询盘**：族页有 `InquiryForm` 岛（`client:load`），规格上下文由 URL query 带入，产品上下文构建期注入。

---

## 9. Phase B 已决事项（client-confirmed 2026-11）

| 事项 | 决策 | 落点 |
| --- | --- | --- |
| 询盘承接渠道 | **自建 webhook**（复用 cnc.bozemetal.com 的询盘接口约定） | `src/config/site.ts` → `INQUIRY.endpoint`；端点为空时自动降级 mailto |
| 产品区 URL | **`/products/`** 统一前缀（`/` 总览 · `/<category_id>/` 分类 · `/<category_id>/<family_id>/` 族） | 生成器 `PRODUCT_ROUTE_BASE` + `familyPath(category, id)` / `categoryPath(id)`，集中一处 |
| 矩阵数据来源 | **测试数据**，客户暂不提供正式数据 | `data/products/*.csv` 当前为占位样本 |
| SKU 粒度 | **族级**（一个族一个号），规格是它的可订购组合 | `TI-<family_id 大写>` |
| 素材绑定 | **文件名以 SKU 开头**，扫描绑定；客户原图由导入按 `<SKU>-<原名>` 改名认领 | `scripts/lib/assets.mjs` |
| 录入格式 | **只留 8 列 CSV 模板一种**（第 8 列 = 客户原图名） | `npm run products -- bulk-import` |

> **2026-11-11 客户确认**：下面三条已定稿 —— **SKU 粒度（族级）/ 素材绑定（SKU 前缀）/ 录入格式（只留 8 列 CSV）**。
> 不要再改口径，也不要引入第二种录入格式。
> 图片的落地规则：客户把原图丢进 `public/images/products/_inbox/`，模板第 8 列写它的文件名，
> 导入时自动改名成 `<SKU>-<原名>` —— **客户不需要知道 SKU，也不需要自己改名**。
> 若日后客户改主意要「每规格独立料号」，那是 `skuOf()` 一处改动 + 图片需一规格一张（成本变化需重新确认）。

### 询盘岛的技术决策

- **用 `client:load` 而非 `client:visible`**。原因：`client:visible` 只在滚入视口时 hydrate，
  用户点规格表里的询盘按钮时浏览器跳到 `#inquiry`，岛可能尚未接管 → 表单以原生方式
  GET 提交 → 页面刷新 → **询盘内容丢失**。这是实测到的真实缺陷，不是理论风险。
- **规格上下文来源**：规格表每行的询盘链接带 `#inquiry?sku=…&standard=…&thread=…&length=…`，
  岛在渲染与提交时现读 `window.location.hash`。同页 hash 跳转不触发 React 重渲染，
  所以不缓存该值。
- **产品上下文来源**：构建期由 `@data/products` 注入 props，**不抓 DOM**。无 JS 时表单
  仍显示正确的产品信息。
- **蜜罐**：隐藏字段 `website`，被填写则静默丢弃提交。
