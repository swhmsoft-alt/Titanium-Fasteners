# 色板还原机制（Color Token Rollback）

本文件说明 `src/styles/global.css` 中 `@theme` 色板的**测量来源**、**快照体系**与
**一键还原流程**。

---

## 1. 色板来源（全部为实测值，非猜测）

采样站点：`https://www.bossard.com/global-en/`（2026-11-20，Chrome DevTools）。

| 方法 | 说明 |
| --- | --- |
| DOM 计算样式 | 沿 DOM 祖先链用 `getComputedStyle` 读取背景 / 文字 / 边框色 |
| 编译产物 CSS | `fetch` 站点主样式表，提取 `.border-/bg-/text-/fill-blue*` 工具类 |
| 图片像素采样 | `fetch` 原图 → `createImageBitmap` → `canvas.getImageData` 按点取色 |
| 渐变合成 | 按 `c′ = c × (1 − 0.3 × (1 − x/W))` 还原左压暗后的实际屏幕色 |

### 关键测量结果

- Hero 背景原图主色：`#47a8e0`
- Hero 左侧压暗层：`linear-gradient(90deg, rgba(0,0,0,0.3), rgba(0,0,0,0))`
  → 屏幕实际色从 `#32769d`（最左）渐变到 `#47a7df`（最右）
- Hero 标题 / 正文 / 箭头：`#ffffff`
- 搜索框边框：`#99cae7`
- "Contact" 按钮文字与边框：`#004975`
- 品牌蓝阶：`#007ac3` / `#4da2d5` / `#004975` / `#00314e` / `#001827` / `#cce4f3`
- 暖色点缀：`#f59c00`

> **合规提示**：仅复用色值。参考站的 Logo SVG 与 DIN 字体受版权/许可保护，
> 本站自有 Logo 与 Archivo 字体（OFL）替代，不得直接搬运参考站资产。

---

## 2. 快照文件

| 文件 | 作用 |
| --- | --- |
| `scripts/lib/color-tokens.baseline.json` | **当前生效基线**，与 `global.css` 应保持一致 |
| `scripts/lib/color-tokens.pre-hero-2026-11-20.json` | **回滚点**：hero 取色落地前的色板（`blue-70` 为旧的估算值 `#a9cfe8`，且无新增 token） |

---

## 3. 命令

```bash
# 对比 CSS 与基线（CI 友好：有差异退出码 1）
npm run tokens:verify

# 用基线覆盖 CSS 中的色板声明
npm run tokens:restore

# 预演一次还原，不写文件
npm run tokens:restore -- --dry-run

# 回滚到 hero 取色之前的状态
npm run tokens:restore -- --from scripts/lib/color-tokens.pre-hero-2026-11-20.json

# 把当前 CSS 色板另存为新快照
npm run tokens:snapshot -- --out scripts/lib/color-tokens.my-snapshot.json
```

脚本行为约束（`scripts/color-tokens.mjs`）：

- 只识别 `--color-*` 声明行，**不触碰** `@theme` 的排版 / 间距 / 断点等其它段落；
- 覆盖已有声明时保留原缩进；
- 删除多余 token 时会一并清掉其紧邻上方的注释块，避免留下孤儿注释；
- **只有内容含 `MEASURED` / `ESTIMATED` 的紧邻注释块才允许被改写或删除**，
  结构性说明块（如 "Colour" 清单）永远不动；
- 所有索引在原始行数组上一次性算好，不在遍历中修改数组长度；
- 写入前有**双护栏**：非 token 行若会被删除则直接报错退出；落地后的 token 数量
  必须与快照一致，否则拒绝写入。

---

## 4. 手工还原（脚本不可用时的兜底）

```bash
# 1) 查看历史
git --no-pager log --oneline -- src/styles/global.css

# 2) 恢复到某个提交
git checkout <commit> -- src/styles/global.css

# 3) 或直接从 JSON 快照手工替换 --color-* 的值
```

---

## 5. 变更后必做

```bash
npm run tokens:verify     # 色板与基线一致
npm run build             # 构建无 ERROR
```
