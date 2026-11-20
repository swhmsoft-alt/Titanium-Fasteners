# 产品批量导入模板

这里是**唯一**的批量录入格式。一份 CSV 一行一个产品，列固定 8 列。

```
npm run products -- bulk-import data/products/_template/product-import.csv --dry   # 先看会变成什么
npm run products -- bulk-import data/products/_template/product-import.csv         # 真导入
```

`--dry` 只打印计划，不写盘。**先 dry 再真跑** —— 批量录入最贵的错是「写进去才发现错了」。

---

## 8 列（+ 可选第 9 列 `type`）

| 列 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | 产品名称。它决定 family_id 与 SKU，所以**改名 = 换号**。 |
| `category` | 是 | 分类 id，见下面的对照表。 |
| `standards` | 否 | 执行标准 id，多个用 `\|` 分隔。DIN 号 / ISO 号都能写（如 `iso-4017`），导入时自动归一到 `standards.csv` 的规范 id。**字典里没有的标准会自动登记并标 `auto=1`（待人工核对），不阻断导入。** 留空 = 无标准产品。 |
| `sizes` | 是 | 规格清单，多个用 `\|` 分隔，见下面的迷你语法。 |
| `materials` | 是 | 材质 id，多个用 `\|` 分隔。 |
| `finishes` | 是 | 表面处理 id，多个用 `\|` 分隔。 |
| `description` | 否 | 一段话，会进产品页与 meta description。 |
| `image` | 否 | **客户自己的图片文件名**（如 `BN-272-01.jpg`），多张用 `\|` 分隔 —— 见下面的「图片怎么接进来」。 |
| `type` | 否 | **可选第 9 列**：产品类型（screw / bolt / nut / washer / stud …）。留空则按 `standards` 第一个 id 推导，再退到分类默认。**只有当产品类型与标准对不上时才需要写。** |

多值字段一律用 `|` 分隔 —— 与 CSV 内部写法一致，不引入第二种分隔符。

---

## sizes 迷你语法

按产品类型解析（类型由 `type` 列 / `standards` / 分类依次决定）：

| 类型 | 写法 | 含义 | 例 |
| --- | --- | --- | --- |
| 螺钉 / 螺栓 / 双头螺柱 | `螺纹x长度` | M4 螺纹，长 6mm | `M4x6` |
| 螺母 | `螺纹x对边x厚度` | M4 螺纹，对边 7，厚 4 | `M4x7x4` |
| 垫片 | `外径x内径x厚度` | 外径 5，内径 10，厚 1 | `5x10x1` |

**工程尺寸不用你填** —— d1/d2/s/k/b/t/m/h 全部从 `data/products/dimension-library.csv`
按 (标准 + 关键参数) 查出来。**库里没有这一条也不阻断**：该规格按"螺纹 × 长度"先上架，
并在导入结果里提示哪一行缺工程尺寸（工程尺寸只能由抽取器补齐，不要手填）。

---

## 没写的列去哪了 —— 全部派生

| 字段 | 怎么来的 |
| --- | --- |
| `family_id` | `name` 的 kebab 化（撞号自动加 `-2` / `-3`） |
| SKU | `TI-` + family_id 大写，如 `TI-HEX-SOCKET-HEAD-CAP-SCREW` |
| 图 / CAD / PDF | 图由第 8 列认领改名；CAD / PDF 按 `<SKU>-<原名>.<ext>` 放盘 |
| alt / SEO / status | 派生（status 默认 `draft`，确认无误再改 `published`） |

### 图片怎么接进来（你不用管 SKU）

客户只要做两件事：

1. 把原图放进 `public/images/products/_inbox/` —— 文件名随意，如 `BN-272-01.jpg`
2. 第 8 列写那个文件名

导入时系统按 `<SKU>-<原名>` **自动改名认领**：

```
_inbox/BN-272-01.jpg  →  public/images/products/TI-HEXAGON-FULL-NUTS-BN-272-01.jpg
```

改名排在**全部校验通过之后** —— 任何一行有问题，图片也一个都不动。
多张图用 `|` 分隔；原名尾部带两位序号（`-01` / `-02`）即展示顺序。

认领后的落盘名必须以某个 SKU 开头，否则是**孤儿素材**，数据闸门报错（E030）。
`_inbox/` 整个目录不参与扫描 —— 还没认领的原图静静躺在那儿。
放完跑 `npm run products -- assets` 看谁缺图、谁没人认领。

---

## id 对照表

### 分类 `data/products/categories.csv`

| id | 名称 |
| --- | --- |
| `screws` | Screws |
| `bolts` | Bolts |
| `nuts` | Nuts |
| `washers` | Washers |
| `pins` | Pins |

### 标准 `data/products/standards.csv`

| id | 名称 | 类型 |
| --- | --- | --- |
| `din-912` | DIN 912 (ISO 4762) | screw |
| `din-933` | DIN 933 (ISO 4017) | bolt |
| `din-934` | DIN 934 (ISO 4032) | nut |
| `din-125` | DIN 125 (ISO 7089) | washer |

### 材质 `data/products/materials.csv`

| id | 名称 |
| --- | --- |
| `ti-gr5` | Titanium Grade 5 (Ti-6Al-4V) |
| `ti-gr2` | Titanium Grade 2 (CP-Ti) |
| `ti-gr9` | Titanium Grade 9 (Ti-3Al-2.5V) |
| `ti-gr23` | Titanium Grade 23 (Ti-6Al-4V ELI) |

### 表面 `data/products/finishes.csv`

| id | 名称 |
| --- | --- |
| `plain` | Plain / untreated |
| `anod-black` | Anodised black |
| `anod-blue` | Anodised blue |
| `passivated` | Passivated |
| `pickling-oiled` | Pickled and oiled |

---

## 导入后

1. 导入自动跑数据闸门（`scripts/gen-products.mjs`）。有 error 就**没写进任何文件**。
2. 新产品是 `draft` —— 不进 sitemap、不进导航。核对无误后：
   `npm run products -- fam-set <family_id> --status=published`
3. 图放好后 `npm run products -- assets` 复核。
