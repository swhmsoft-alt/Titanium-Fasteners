# Tier A 批次 · 勘察结论与实施规格

依据：`data/products/bossard-selection.csv`（status=list 的 Tier A 17 条）、`docs/BOSSARD-TITANIUM-DECISION.md` §2.1/§4.2
Bossard 源：Bossard 公开发布的产品索引 `prd-products-en`（Algolia，只读公共检索端点）

---

## 0. 范围

| 项 | 值 |
| --- | --- |
| Tier A 条目 | A1–A17（17 条，全部 `status=list`） |
| Tier B | **本批不做**（verify 5 条待 V1–V5；excluded 4 条永久排除） |
| 已 published 需扩展 | A7（`hex-head-bolts-fully-threaded`，加 din-931） |
| 新增族 | A3 A4 A5 A6 A8 A9 A10 A12 A13 A14 A15 A17 = 12 族 |

---

## 1. BN ↔ 标准 错配修正（选型 CSV 的 `bossard_bn` 列）

| 条目 | 选型 CSV 所列 BN | Bossard 实际 `standard1` | 处置 |
| --- | --- | --- | --- |
| A5 | **BN 38** | `DIN 906` Hex socket pipe plugs（管塞，非 14579） | **剔除 BN 38**；14579 改用 BN 4852/4853 |
| A7 | BN 56/57 等混列 | BN 56=`DIN 933` 全牙、BN 57=`DIN 931` 半牙 | 按标准分流：933→`54,624,20234,21200,31103`；931→`55,57,21201,20236` |
| A3 | BN 6971/33021 | 防拆/花形防盗钉 | **剔除**（非 7380 常规件） |
| A3 | BN 2098/11252/30104 | `ISO 7380-2` 带领圈 | **剔除**（A3 只做 7380-1） |
| A6 | BN 5687/20038 | `ISO 14583` 花形盘头 | 与 A5 重复，**从 A6 剔除** |
| A12 | BN 630/631/1207 等 | 待核 | 需按 `DIN 439` 复核后保留 |

**代表 BN（每标准一个「规格型」BN，字段全、无 `max.` 后缀优先）**

| 标准 | 代表 BN | `standard1` | 关键字段 |
| --- | --- | --- | --- |
| din-7380 | 19 | ISO 7380-1 | b, d1, d2+max., s, L, t+min., k+max. |
| din-7984 | 16 / 2844 | DIN 7984 | b, d1, d2, k, s, t, L |
| din-6912 | 15 / 1350 / 20737 / 33001 | DIN 6912 | b, d1, d2, k, s, t, L, l_s+min. |
| din-14579 | **4852 / 4853** | ISO 14579 | d1, d2+max., L, t+min., k+max., **A~**（花形槽号） |
| din-7985 | 660 | DIN 7985 A | d1, d2+max., L, **m~**, t+min., t+max., k+max., Phillips |
| din-931 | 55 / 57 / 21201 / 20236 | DIN 931 | **b**, d1, e, k, s, L |
| din-933 | 54 / 624 / 20234 / 21200 / 31103 | DIN 933 | d1, e, k, s, L（无 b → 全牙 b=L） |
| din-961 | 65 / 40072 | DIN 961 | d1, e, k, s, L（细牙） |
| din-960 | 66 | DIN 960 | **b**, d1, e, k, s, L（细牙半牙） |
| din-6921 | 2112 | DIN 6921 | b, d1, d2+max., s, L, k+max. |
| din-913 | 617 | ISO 4026 | d1, s, L, t+min.（**无 d2/k/b**） |
| din-915 | 619 / 26 | ISO 4028 | d1, d2+max., s, L, z, t+min. |
| din-439 | 123 | DIN 439 B | d1, s, e+min., m+max.（**无 h**） |
| din-935 | 157 | DIN 935 | d1, s, e+min., m+max., h+max., n+min. |
| din-6923 | 14476 | DIN 6923 | d1, d2+max., s, h+max.（**无 m**） |
| din-1587 | 635 | DIN 1587 | d1, s, h, e+min., t~（**无 m**） |
| din-9021 | 1356 | DIN 9021 | d1, d2, s, for+thread |
| din-433 | 726 | DIN 433 | d1, d2, s, for+thread |
| din-7349 | 733 / 13289 | DIN 7349 | d1, d2, s, for+thread |

---

### 1b. 实测字段复核（2026-11-12，`filters=baseProductCode:<n>` 端点，逐变体 dump）

| 标准 | BN | n | standard1 | 实测 variantFeatures 键 | 备注 |
| --- | --- | --- | --- | --- | --- |
| din-7380 | 19 | 109 | ISO 7380-1 | b, d1, d2+max., s, L, t+min., k+max. | b="-" → 全牙 b=L |
| din-7984 | 16 | 100 | DIN 7984 | b, d1, d2, k, s, t, L | b="-" |
| din-6912 | 15 | 97 | DIN 6912 | b, d1, d2, k, s, t, L, l_s+min. | l_s 不入列 |
| din-14579 | 4852 | 74 | ISO 14579 | d1, d2+max., L, t+min., k+max., **A~**, Hexalobular+socket | A~ 是**数值**（1,75）不是槽号；槽号在 "Hexalobular+socket"（X6） |
| din-7985 | 660 | 106 | DIN 7985 A \| ~ISO 7045 | d1, d2+max., L, **m~**, t+min., t+max., k+max., Phillips | m~=1,8 是槽宽 |
| din-931 | 57 | 280 | DIN 931 \| ISO 4014 | **b**, d1, e, k, s, L | 半牙有真 b |
| din-961 | 65 | 48 | DIN 961 \| ISO 8676 | d1(**M8x1**), e, k, s, L | 无 b → 全牙 b=L |
| din-960 | 66 | 70 | DIN 960 \| ISO 8765 | **b**, d1(**M8x1**), e, k, s, L | 半牙有真 b |
| din-6921 | 2112 | 31 | DIN 6921 \| EN 1665 | b, d1, d2+max., s, L, k+max. | b="-" |
| din-913 | 617 | 127 | ISO 4026 \| DIN 913 | d1, s, L, t+min. | **无 d2/k/b** |
| din-915 | 619 | 41 | ISO 4028 \| DIN 915 | d1, d2+max., s, L, z, t+min. | z 是柱端长 |
| din-439 | 123 | 24 | DIN 439 B \| ~ISO 4035 | d1, s, e+min., **m+max.** | **无 h** |
| din-935 | 157 | 18 | DIN 935 | d1, s, e+min., m+max., h+max., n+min. | 有 m 和 h |
| din-6923 | 14476 | 7 | DIN 6923 \| EN 1661 | d1, d2+max., s, **h+max.** | **无 m**；h 是螺母高 |
| din-1587 | 635 | 11 | DIN 1587 | d1, s, **h**, e+min., t~ | **无 m**；h 是盖高 |
| din-9021 | 1356 | 13 | DIN 9021 \| ~ISO 7093 | d1, d2, s, for+thread | d1=内径 d2=外径 s=厚 |
| din-433 | 726 | 17 | DIN 433 | d1, d2, s, for+thread | 同上 |
| din-7349 | 733 | 12 | DIN 7349 | d1, d2, s, for+thread | 同上 |
| din-934 | 108 | 3 | DIN 934 | d1, s, e+min., m+max. | **0,8d 薄型** → 不可作 din-934 代表 |

### 1c. 三个 schema 结论的修正（实测推翻原假设）

1. **A5 不需要新 type**：ISO 14579 的 `A~` 是**数值 mm**（M2→1,75），不是槽号字符串。
   → 沿用 `screw` type，`s` 列由 `A~` 填（花形槽跨角）；槽号 X6 属驱动形式，非尺寸列，不入表。
2. **A6 也不需要新 type**：`m~`=1,8 是槽宽（数值 mm），`s` 无值。
   → 需要 `crosshead-screw` type（无 `s`，多 `m` 槽宽）。
3. **A10 需要 `set-screw` type**：无头件确实无 d2/k/b。
4. **A12/A14/A15 的 nut 拆分**：din-439 有 m 无 h；din-6923/din-1587 有 h 无 m。
   → 三个新 type：`thin-nut`(m)、`flange-nut`(h+d2)、`dome-nut`(h+t)。
   既有 `nut` type（m+h 齐全）留给 din-934/din-935。

---

## 2. param-schema 缺口 → 必须新增 type

现有 4 type（`screw`/`bolt`/`nut`/`washer`）装不下下列几何。`type` 由 `standards[0].type` 派生，故须同步改 `standards.csv` 的 type 列。

| 新 type | 参数（顺序=列顺序） | 适用族 | 依据 |
| --- | --- | --- | --- |
| `lobular-screw` | thread, length, d1, d2, s, k, t, **A** | A5 | ISO 14579/14580/14581/14583 花形槽 → 槽号 A，无对边 s |
| `crosshead-screw` | thread, length, d1, d2, k, t, **m** | A6 | DIN 7985 A / ISO 7045 十字槽 → 无对边 s，槽宽 m |
| `set-screw` | thread, length, d1, s, t（+ d2, z 可选） | A10 | ISO 4026/4028 无头 → 无 d2/k/b |
| `rod` | thread, length, d1 | — | Tier B 才用（B1 牙条），本批不建 |

`nut` type 需拆：现有 `nut` = thread, s, m, h 全部 required=1，而
- din-439 只有 `m+max.` 无 `h`
- din-6923 只有 `h+max.` 无 `m`
- din-1587 只有 `h` 无 `m`
→ 处置：`nut` 的 `h` 降为 `required=0`（m 保持必填），`m` 由 `m+max.` 或 `h+max.`/`h` 择一填。**不可为同一 type 混两套列语义**（与既有 din-934 行的 1.0d 厚口径冲突）。

---

## 3. 尺寸抽取：`gen-bossard-dimensions.mjs` 的扩展

- `TARGETS` 增 20 条（标准 × 代表 BN），每条声明 `type` 与列映射。
- **细牙 d1 缺口**：现有 `D1_MAX` 只有粗牙表；A8（din-961/960）螺纹号形如 `M8x1` → 查表未定义 → 该行缺 `d1` 必填参数。须补细牙 d1 max 表（ISO 965 细牙系列公称 + 上偏差），与粗牙表同源同口径。
- **列语义映射（按 Bossard 字段 → 本站列）**
  - `screw`/`bolt`：`d1`←D1_MAX[thread]、`d2`←`d2` 或 `d2+max.` 或 `e`、`s`←`s`、`k`←`k` 或 `k+max.`、`b`←`b`（全牙件= L）、`t`←`t` 或 `t+min.`
  - `nut`：`s`←`s`、`m`←`m+max.`（din-439）、`h`←`h+max.`（din-6923）或 `h`（din-1587）；`e+min.` 不入列
  - `washer`：`d1`←Bossard `d2`（外径）、`d2`←Bossard `d1`（内径）、`h`←Bossard `s`（厚度）；键= `for+thread`
  - `set-screw`：`s`←`s`、`t`←`t+min.`、`d2`←`d2+max.`、`z`←`z`
  - `lobular-screw`：`A`←`A~`（花形槽号，**字符串非数值** → unit 用 `-`）
- `--apply` 仍只增不覆盖既有 400 行（din-912/934/7991/933/125 口径不动）。

---

## 4. 录入路径

- `bulk-import` 的迷你语法硬编码 4 type（`scripts/products.mjs:527-546`），**新 type 不支持** → 新 type 族走 `fam-add --spec` / `spec-add`（两者读 param-schema 动态列，通用）。
- `bulk-import` 只按 `standards[0]` 查尺寸库 → 多标准族（A4 / A7 / A8 / A17）须按标准分批，或改用 `spec-add --std=`。
- `family_id` 命名：沿用选型 CSV 的 `family_id`（A2 `countersunk-head-cap-screw` 与已发布的 `countersunk-head-cap-screws` 不一致 → **以已发布 id 为准**，A2 视为已上架，不重复建）。

---

## 5. 验收基线（Phase B 自有基线，不用 qa/targets）

1. `npm run gen:products` → **0 error**
2. `npm run build` → 通过
3. 每族 `dimensions/<family_id>.csv` 行数 > 0，且列集合 == 其 type 在 param-schema 的参数集（E016/E019 天然把关）
4. 每族页矩阵渲染出该 type 的全部列（`FamilySpecTable` 按 `PARAM_SCHEMA` 驱动，type-generic，无需改页面）
5. 无跳转/重定向（不改已发布 id、不新增 redirect）
6. 新族先 `draft`，核对后 `fam-set --status=published`
