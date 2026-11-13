# DEVIATIONS — 复刻偏差台账

> **规则**：任何「不完全等于参考站」的已知差异必须记在此文件，**不许偷偷留成「差不多就行」**。
> 每条一行：路由 / 差异 / 原因 / 状态。
>
> 判定原则：**只有公共组件（页头/页脚/导航）相关的差异允许记在这里**；页面级差异应在本页解决。

| 路由 | 差异 | 原因 | 状态 |
| --- | --- | --- | --- |
| `/global-en/eshop/` | 参考站 footer 高 517px，本站 `SiteFooter.astro` 为本站自建版式，高度不同 | 公共组件差异，页面内不可解决 | 已记录，独立排期 |
| `/global-en/eshop/` | 参考站 `dy` 恒定偏移（首块前 195px 顶部留白 vs 本站 `pt-48 md:pt-91` 避让 fixed header） | 参考站顶部留白 vs 本站 fixed header 补偿，`measure-page.mjs` 自动识别并扣除 | 已在 target notes 说明 |
| 全站 | 导航下方留白：参考站首块前留 195px（页头 91px + 约 104px 空带），本站改为 `pt-48 md:pt-91`，只避让 fixed header；首页 Hero 区块自身 `pt-72` → `pt-24 lg:pt-40`，导航与首屏内容间距约 40–91px | 用户明确要求「导航留白在合理区间」，参考站的 104px 空带过大 | 已记录，主动偏离参考站 |
| 全站 | 导航滚动行为：参考站滚动时收起页头（`translateY(-60px)`），本站删除该脚本，页头 fixed 且始终完整可见 | 用户明确要求「滑动时导航始终固定」 | 已记录，主动偏离参考站 |
| `/products/bolts/` | body 高 3981px vs 参考站 3995px（差 14px，页脚位置差 14px） | 参考站 `container-fluid` 底部有 `pb-64 lg:pb-72` 留白，本站容器未加；补上会使 body 变为 4053px（偏离更大），故保持 | 已记录，区块级 dy/dh 全部为 0 |
| `/products/bolts/` | 左侧筛选栏只渲染了 20 个折叠分组标题，参考站另有 3 个（`d₁` / `L` / `s`） | 参考站这三个分组的标题本身带下标/上标标记，直文本化会失真 | 折叠状态下不影响任何区块几何（dy/dh 全 0） |
| `/global-en/product-solutions/product-categories-and-brands/<slug>/` | 参考站 hero 的 "Contact Us" 按钮打开一个 contact dialog（弹层 + 背景遮罩） | 本站不做弹层，改为直达 `/global-en/about-us/contact/`；按钮外观与位置按参考站实测（140×49，透明底蓝字） | 已记录，主动简化；不影响任何区块几何（dy/dh 全 0） |
| `/global-en/product-solutions/product-categories-and-brands/<slug>/` | 参考站面包屑第 2 级是一个 "…" 折叠按钮（点击展开完整路径） | 本站按静态文本渲染 "…"，不实现折叠交互 | 已记录，主动简化；面包屑行高一致（16px/25.6px） |
| `/global-en/product-solutions/product-categories-and-brands/securing-and-anti-loosening-elements/` | 首块前的 hero 区比参考站少 176px（本站首块 y=1625 vs 参考 1801），`measure-page.mjs` 自动扣除该恒定偏移 | 参考站 `<main>` 顶部留白 + hero 自身 `mt-40` 合计比本站 `pt-48 md:pt-91` 多；本页参考站没有视频文章块（direct-assembly-screws 有），少一块也把偏移从 ~0 拉到 −176px | 已记录，区块级 dy/dh = 0/0 与 0/+4 |
| `/global-en/product-solutions/product-categories-and-brands/securing-and-anti-loosening-elements/` | 参考站 DOM 内还有第 12 个 `<figure>`（hero 21:9 横幅图 "Two people discussing design of a fastener"，740×317，本地素材 `01-two-people-discussing-design-of-a-fastener.webp`），本站未渲染 | probe 在 1440px 下只测到 11 个有几何的 figure（这张既无 y/h 也未进 figures 表），疑似该断点下不占布局盒；本站不渲染则 body 3880px 与参考站 3888px 相差 8px，若按 643 宽渲染会再增约 276px | 已记录，素材保留待复核 |
| `/global-en/industries/aerospace/` | 视频封面用参考站远程 URL（`https://img.youtube.com/vi/rXLP9ov3gvE/maxresdefault.jpg`），未本地化 | YouTube 图床外网不可达（`dl-assets` 3 次超时），与 `services` 页同一已知偏差 | 已记录；16:9 占位框保证区块高度不受影响（dh=0） |
| `/global-en/eshop/c/01/` `/c/02/` `/c/03/` | 一级分类页沿用分类模板的**唯一版本**：筛选组（20 组）与产品命中列表（18 张）不按分类逐页抽取 —— 参考站 02 页无 Thread 分组、03 页多 Application area / d₁ / L，各页命中产品也不同 | 用户明确要求「必须使用现在的唯一模板，替换子分类即可」 | 已记录，主动简化；区块几何与模板页完全一致 |
| `/global-en/eshop/` | 三个分组标题链接仍指向 `/global-en/eshop/products/<slug>/c/0X/`（该页尚未建 → 404） | URL 为复制期临时态，保持照抄参考站；真实 URL 规划时统一重写，不在此阶段固化 | 已记录，待 URL 重规划 |



