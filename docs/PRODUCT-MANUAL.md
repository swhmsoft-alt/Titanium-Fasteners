# PRODUCT-MANUAL — 产品管理手册

> 这份手册回答三个问题：**产品数据放在哪**、**谁写哪一部分**、**怎么加一个产品**。
> 命令与字段名以 `scripts/products.mjs` 为准；数据格式细节以 `docs/PRODUCT-DATA.md` 为准。

---

## 0. 一句话模型

```
data/products/*.csv          ← 真相源（人工维护 / Excel 可编辑）
      │  scripts/gen-products.mjs（数据闸门，0 error 才算通过）
      ▼
src/data/products/*.ts       ← 生成产物（禁止手改）
      │  页面只从 @data/products import
      ▼
/global-en/eshop/…           ← 总览 / 分类页 / 族页
```

**改产品 = 改 CSV → 跑 `npm run gen:products` → build。** 直接改 `src/data/products/**` 会在下次生成时被覆盖。

---

## 1. 归属表：谁负责哪一部分

| 内容 | 归属 | 落在哪 | 怎么进 |
| --- | --- | --- | --- |
| 产品族清单（名称、分类、标准、材质、描述） | **AI 录入** | `data/products/families.csv`（8 列） | `npm run products -- fam-add / fam-set` |
| 规格矩阵（螺纹 × 长度 × 尺寸） | **AI 录入** | `data/products/dimensions/<family_id>.csv` | `fam-add --spec=` / `spec-add` |
| 分类（ Screws / Nuts / …） | **AI 录入** | `data/products/categories.csv` | `cat-add / cat-rm` |
| 材质牌号 / 表面处理 / 标准 / 参数定义 | **AI 录入** | `data/products/{materials,finishes,standards,param-schema}.csv` | 手改（很少变） |
| **产品照片** | **你提供** | `public/images/products/<SKU>-01.webp` | 按 SKU 命名放入（见 §4） |
| **CAD 文件** | **你提供** | `public/download/cad/<SKU>-01.step` | 按 SKU 命名放入 |
| **规格书 PDF** | **你提供** | `public/download/spec/<SKU>-01.pdf` | 按 SKU 命名放入 |
| 分类配图 | **你提供** | `public/images/category/<id>.webp` | 放入该路径 |
| **批量产品清单** | **你提供** | `data/products/_template/product-import.csv` | `npm run products -- bulk-import` |
| **工程尺寸库** | **AI 维护** | `data/products/dimension-library.csv` | 导入时自动查表补全 |
| 页面 / 组件 / 样式 | **AI 维护** | `src/**` | 不手改生成物 |

> 素材缺失只会产生 **W001 警告**（不是错误），构建照常通过；页面上的图会是空图位。
> 也就是说：**先把数据录全，图片后补，站点不会因此挂掉。**
>
> 反过来：**素材放错位置是硬错误**（E030/E031）—— 文件名前缀必须等于某个 SKU，
> 否则就是没人认领的孤儿文件。这条能挡住「图配错产品」这种最贵的错。

---

## 2. URL 形态（已定死，不可改）

| 页面 | 路由 | 数据来源 |
| --- | --- | --- |
| 产品总览 | `/global-en/eshop/` | 全部族 + 左侧筛选栏 |
| 分类页 | `/global-en/eshop/c/<category_id>/` | 该分类下的族 + 左侧筛选栏 |
| 族详情页 | `/global-en/eshop/p/<family_id>/` | 规格矩阵表 + 询盘岛 |

- 分类 id 来自 `categories.csv`（如 `screws` / `nuts`）。
- 族 id 来自 `families.csv` 的 `family_id`（小写连字符，如 `hex-socket-head-cap-screw`）。
- **仓库禁止任何跳转/重定向** —— 改路径就是直接改，不留 301。

---

## 3. 参数系统：每种产品的规格表列

规格表的列不是拍脑袋定的，而是由 `param-schema.csv` 按 `type` 决定 —— 新增一种产品类型 = 在 `param-schema.csv` 加几行，规格表的列自动跟着变。

| type | 规格表列（`standard` 之后） |
| --- | --- |
| `screw` | thread, length, d1, d2, s, k, b, t |
| `bolt` | thread, length, d1, d2, s, k, b |
| `nut` | thread, s, m, h |
| `washer` | d1, d2, h |

每列的含义（label / 单位）在 `param-schema.csv` 里：

| 列 | 含义 | 单位 |
| --- | --- | --- |
| `standard` | 该行执行的标准（外键 → `standards.csv` 的 id） | — |
| `thread` | 螺纹规格（M4 / M5 / M6 …） | — |
| `length` | 长度（螺钉/螺栓） | mm |
| `d1` | 外径 / 头部外径 | mm |
| `d2` | 头部直径 / 对边宽 | mm |
| `s` | 对边宽（扳手尺寸） | mm |
| `k` | 头部高度 | mm |
| `b` | 螺纹长度 | mm |
| `t` | 螺纹螺距 | mm |
| `m` | 螺母厚度 | mm |
| `h` | 垫片厚度 / 螺母高度 | mm |

---

## 4. 加一个产品：三步

### 第 1 步：确认分类存在

```bash
npm run products -- list
```

没有这个分类就先加：

```bash
npm run products -- cat-add washers "Washers" --desc="Plain washers, spring washers and tab washers." --image=/images/category/03-washers.webp --order=4
```

### 第 2 步：加族 + 规格矩阵（一条命令）

```bash
npm run products -- fam-add plain-washer \
  --name="Plain Washers" \
  --category=washers \
  --standards=din-125 \
  --materials=ti-gr5|ti-gr2 \
  --finishes=plain \
  --description="Titanium plain washers to DIN 125, supplied in grade 2 and grade 5." \
  --status=draft \
  --spec="din-125,,5.0,10.0,1.0" \
  --spec="din-125,,6.0,12.0,1.6"
```

要点：

- `--spec` 的**值顺序 = 规格表列顺序**（`standard` 在最前，其余按上表）。
- `--spec` 可以重复多次，一次给全规格。
- `--spec` 至少要给一行 —— 空矩阵会被数据闸门判为 **E022**，所以 CLI 直接拒绝，**不会有半成品族留在 CSV 里**。
- 多值字段用 `|` 分隔（`--materials=ti-gr5|ti-gr2`）。
- `--status=draft` 是默认值。`draft` 的族**不进 sitemap、页面输出 noindex**；确认内容无误后再改 `published`。

命令结束时会自动跑数据闸门；**闸门没过，命令以非 0 退出**。

### 第 3 步：放素材 + 发布

```bash
# 素材放在这些路径（你提供）—— 文件名必须以 SKU 开头
public/images/products/TI-PLAIN-WASHER-01.webp
public/download/cad/TI-PLAIN-WASHER-01.step
public/download/spec/TI-PLAIN-WASHER-01.pdf

# 盘点：谁缺图、谁没人认领
npm run products -- assets

# 确认无误后转正式发布
npm run products -- fam-set plain-washer --status=published
npm run build
```

---

## 5. 日常命令表

```bash
npm run products -- list                       # 目录视图：分类、族、状态、规格行数
npm run products -- cat-add <id> <name>        # 新增分类
npm run products -- cat-rm  <id>               # 删除分类（仍被族引用时拒绝）
npm run products -- fam-add <family_id>        # 新增族（必须带 --spec）
npm run products -- fam-set <family_id> --字段=值   # 改族字段
npm run products -- fam-rm  <family_id>        # 删除族（连同其规格矩阵）
npm run products -- spec-add <family_id> --std= --thread= --length=   # 追加规格行
npm run products -- spec-rm  <family_id> --std= --thread= --length=   # 删除规格行
npm run products -- export <family_id>         # 导出为 Markdown（只读视图）
npm run products -- bulk-import <file.csv>     # 从 8 列模板批量导入产品
npm run products -- assets                     # 素材盘点：缺图 / 孤儿素材
npm run products -- validate                   # 只跑数据闸门
```

`fam-set` 可改的字段（按目标表分流 —— 两张表各管各的）：

- **产品表** `families.csv`：`name category standards materials finishes description image`
- **管理表** `management.csv`：`status moq packaging lead_time price_from price_to price_currency price_unit`

（`type` 由 `standards` 的第一个 id 派生，`family_id` 不可改 —— 它是 URL 与规格矩阵的键。
`image` 填客户原图名，落盘名 = `<SKU>-<原图名>`；`cad` / `pdf` 不在表里 —— 素材路径由 SKU 约定自动推导，见 §6.5。）

---

## 6. 批量导入：8 列模板（唯一的录入格式）

**为什么只留一种格式**：录入格式每多一种，就要多一套解析、一套校验、一套文档；
而格式一多，大家就会挑最顺手的那个用 —— 于是真相源分裂。
所以现在只留 CSV 模板一种；Markdown `export` 降级为**只读视图**（给人看、存档，不许回灌）。

```bash
# 先看会变成什么（不写盘）
npm run products -- bulk-import data/products/_template/product-import.csv --dry

# 真导入
npm run products -- bulk-import data/products/_template/product-import.csv
```

模板列（8 列，一行一个产品）：

| 列 | 说明 |
| --- | --- |
| `name` | 产品名称 —— 决定 family_id 与 SKU |
| `category` | 分类 id |
| `standards` | 标准 id（`\|` 分隔），**第一个决定产品类型** |
| `sizes` | 规格清单（`\|` 分隔），迷你语法 |
| `materials` | 材质 id（`\|` 分隔） |
| `finishes` | 表面处理 id（`\|` 分隔） |
| `description` | 描述 |
| `image` | **客户自己的图片文件名**（如 `BN-272-01.jpg`），多张用 `\|` 分隔 |

`sizes` 迷你语法：

| 类型 | 写法 | 例 |
| --- | --- | --- |
| 螺钉 / 螺栓 | `螺纹x长度` | `M4x6` |
| 螺母 | `螺纹x对边x厚度` | `M4x7x4` |
| 垫片 | `外径x内径x厚度` | `5x10x1` |

**工程尺寸不用你填** —— d1/d2/s/k/b/t/m/h 由 `data/products/dimension-library.csv`
按 (标准 + 关键参数) 查出。库里没有就报错并指出缺哪一行。

导入是**全有或全无**：任何一行有问题就一行都不写，错误带**行号**。
写完自动跑数据闸门。新产品默认 `draft`（不进 sitemap、不进导航）。

完整说明与 id 对照表：`data/products/_template/README.md`。

---

## 6.5 SKU 规范与素材绑定

> **2026-11-11 客户确认** —— 本节口径已定稿，不要再改。

### SKU

```
SKU = TI-<family_id 大写>
family_id = hex-socket-head-cap-screw  →  SKU = TI-HEX-SOCKET-HEAD-CAP-SCREW
```

- **唯一** —— family_id 唯一即 SKU 唯一，闸门 E029 兜底。
- **稳定** —— SKU 不含名称，产品改名不影响 SKU，报价单/ERP 里的老号继续有效。
- **可念** —— 电话报号无歧义。
- **不冗余** —— 标准/材质/表面是 SKU 的**属性**（显示在页面上），不塞进码里；
  塞进去的话，改个标准就换号了，那就不是稳定的 SKU。

一个族 = 一个 SKU。族下的 (规格 × 材质 × 表面) 是这个 SKU 的可订购组合：
**报号报 SKU，询盘说组合。**

### 素材绑定

```
public/images/products/<SKU>-<原名>.<ext>
public/download/cad/<SKU>-<原名>.step
public/download/spec/<SKU>-<原名>.pdf
```

- `<原名>` = 客户自己的文件名（如 `BN-272-01.jpg`）；尾部两位序号 = 展示顺序（`01` 是主图）。
- 归属判定 = **最长 SKU 前缀**（后面紧跟 `-`）：`TI-HEX-NUT-BN-272-01.jpg` 归属 `TI-HEX-NUT`。
- 扫描规则只在 `scripts/lib/assets.mjs` 一份，生成器与 CLI 共用 —— 两边不会漂移。
- 前缀匹配不到任何 SKU = **孤儿素材**（E030，阻塞构建）。
- 文件名不合约定 = E031（阻塞构建）。
- 族没有主图 = W001（**不阻塞**，图可以后补）。

**客户不需要知道 SKU**：原图丢进 `public/images/products/_inbox/`，模板第 8 列写它的
文件名，导入时按 `<SKU>-<原名>` 自动改名认领。改名排在**全部校验之后** —— 任何一行
有问题，图片也一个都不动。`_inbox/` 整个目录不参与扫描。

图与产品的对应关系是**算出来的**，不是记出来的 —— 这才是这套约定存在的意义。

```bash
npm run products -- assets     # 谁缺图、谁没人认领
```

---

## 7. 数据闸门错误码

`npm run gen:products`（CLI 的每次写操作都会自动跑）：

| 码 | 含义 | 怎么处理 |
| --- | --- | --- |
| E015 | 族缺规格矩阵文件 | 用 `spec-add` 补，或 `fam-add` 时带 `--spec` |
| E016 | 矩阵含未知列 | 列必须来自 `param-schema.csv` 中该 type 的参数 |
| E017 | 矩阵缺 `standard` 列 | 第一列固定是 `standard` |
| E022 | 矩阵文件存在但没有数据行 | 至少给一行 `--spec` |
| E024 | 族引用了不存在的分类 | 先 `cat-add`，或改 `fam-set --category=` |
| E025 | 分类不存在 | 同上 |
| E029 | SKU 重复 | family_id 撞了 —— 改其中一个的 family_id |
| E030 | 孤儿素材（文件名前缀不匹配任何 SKU） | 改文件名为 `<SKU>-<原名>.<ext>`，或删掉 |
| E031 | 素材文件名不合约定 | 同上 |
| W001 | 族还没有主图 | 你把 `<SKU>-01.webp` 放进 `public/images/products/`，**不阻塞构建** |

---

## 8. 左侧筛选栏

分类页与总览页的左侧筛选栏是**真能用的**，维度由数据自动派生：

| 维度 | 取值来源 |
| --- | --- |
| Standard | 族的 `standards` |
| Type | 族的 `type` |
| Thread | 规格矩阵的 `thread` 列去重 |
| Material | 族的 `materials` |
| Surface | 族的 `finishes` |
| Length (mm) | 规格矩阵的 `length` 列去重 |

- 多选、组内「或」、组间「且」。
- 筛选状态同步到 URL（`?standard=din-912&material=ti-gr5`），可分享、可回退。
- 无 JS 时左侧仍是可展开的完整选项列表，右侧列表完整可见 —— 渐进增强，不是 JS 依赖。

---

## 9. 发布前检查清单

```bash
npm run products -- validate     # 1. 数据闸门：0 errors
npm run build                    # 2. 构建：Complete!
```

- [ ] 新族 `status=published`（否则不进 sitemap）
- [ ] 族有主图：`public/images/products/<SKU>-01.webp`（否则 W001 警告 + 空图位）
- [ ] `npm run products -- assets` 无孤儿素材
- [ ] 规格矩阵行数合理（族页的规格表就是这个矩阵）
- [ ] `description` / `seo_description` 是**自己的话**，不是供应商的营销文案
