原位重构Fastener Coatings页面（Hub + Money 双意图架构）
以下为您定制的 Cline 专属原位重构开发文档。该文档完全契合您现有的 Astro 站点架构、全站导航与页脚内链，并严格执行了不改动现有 URL、彻底清除碳钢/不锈钢残余文案以及严禁编造实测扭矩/摩擦系数值的业务红线。
您可以直接复制以下完整文档投喂给 Cline：

Cline 开发任务指令：原位重构 Fastener Coatings 页面（Hub + Money 双意图架构）


1. 任务目标与路径锁定（最高优先级）

• 目标文件：定位现有路由 /product-solutions/components-specific-solutions/fastener-coatings/ 对应的 Astro 页面文件（通常位于 src/pages/product-solutions/components-specific-solutions/fastener-coatings/index.astro 或同级 .astro 文件）。
• 绝对路径红线：严格保持当前页面 URL 路径不变，禁止新建页面、禁止修改路由名称、禁止编造任何未在现有导航中出现的内部链接。
• 核心改造方向：
	1. 清除错位文案：彻底删除页面中现有的所有 steel（钢）和 stainless steel（不锈钢）描述，以及底部 4 个虚假的 White Paper 卡片。
	2. 锁定钛材工厂定位：将页面重塑为面向全球分销商与 OEM 采购商的 钛合金紧固件表面处理能力中心（Hub）与定制询盘转化入口（Money）。
	3. 参数合规红线：仅展示国际标准号（ASTM / AMS / DIN / ISO）、膜层厚度、螺纹公差控制及出厂检测协议；严禁生成或编造任何具体的实测扭矩系数（K-factor）、摩擦系数（CoF）或防咬死测试数值。

2. 页面 SEO / GEO 元数据更新（<head> 配置）

请更新该页面的 Meta Title、Description 及 JSON-LD 结构化数据：
• Title: Titanium Fastener Coatings & Surface Finishes: Plain, Passivated, Anodizing & PVD | BOZE CNC-Ti
• Meta Description: Factory-direct surface finishing for Grade 2, Grade 5 (Ti-6Al-4V) & Grade 23 titanium fasteners (M1–M36). Explore Plain, ASTM B600 Passivated, AMS 2488 Anodizing, and PVD coatings with EN 10204 3.1 MTC. Request a quote.
• Schema Markup (JSON-LD): 注入 Service（描述钛紧固件表面处理加工服务与执行标准）和 FAQPage（对应下文模块 D 的问答）。

3. 页面模块化架构（自上而下组装）

请保留页面原有的全局 Header、Breadcrumb（Home > Product Solutions > ... > Fastener Coatings）和 Footer，在主内容区 <main> 中按顺序重构以下 5 个高密度工业模块（注意控制模块间距，避免出现大面积无效留白）：

模块 A：HeroSection（首屏价值主张 + 双意图分流）

• Eyebrow 标签：TITANIUM FASTENER SURFACE ENGINEERING
• H1 主标题：Titanium Fastener Coatings & Surface Finishes
• 副标题：Prevent thread galling, control mating tolerances (M1–M36), and meet aerospace or medical compliance with factory-controlled Plain, Passivated, Anodized, and PVD finishes.
• 双行动按钮组（CTA）：
	• 主按钮（Money 意图）：Request Surface Finish Quote -> 平滑滚动至 #rfq-quote-section
	• 次按钮（Hub 意图）：Compare Finish Specifications -> 平滑滚动至 #finish-comparison-matrix
• 工厂能力与合规背书条（Trust Bar）：
	• Standards: ASTM B600 / AMS 2488 | Size Range: M1 – M36 (DIN & ISO) | Traceability: EN 10204 3.1 MTC | Verification: 100% PMI / XRF
• 视觉图片规范：保留原有首屏图片位或替换为展示钛合金紧固件多种表面处理实物（本色、阳极氧化蓝/金、PVD 黑色）与工程师协作检测场景的横幅图（保持 ://bozemetal.com 现有域名规范，勿引入失效外链）。

模块 B：CoreFinishHub（四大核心表面状态详解 - 承担 Hub 意图）

明白。要在开发文档中明确加入图文混排的 UI 模块规范，并消除小图文模块下方可能出现的过多空白，确保每一张图片都有明确的布局位置、宽高比例与视觉语义。
以下为您整理了两部分内容：
1. 可直接追加/替换进上一版 Cline 开发文档的「模块 B：图文混排 UI 规范」；
2. 专为这 4 种钛合金紧固件表面处理定制的 AI 绘图英文提示词（融合了工业级钛金属实物质感与工程师质检/协作场景）。

第一部分：追加至 Cline 开发文档的 UI 模块规范

请将以下模块规范替换原开发文档中的 模块 B，直接发给 Cline 执行：
markdown
### 模块 B：`CoreFinishHub`（图文双栏卡片网格 - 承担 Hub 意图与视觉验证）

* **布局与防留白规范**：采用 2 列桌面端响应式网格（`grid-cols-1 lg:grid-cols-2 gap-6`），严禁底部留白；图片容器统一固定为 `aspect-[16/10]` 并使用 `object-cover w-full h-full` 填充，确保视觉高度对齐。所有图片需引用本地 `/images/fastener-coatings/` 目录下的 `.webp` 文件并配置工业级 `alt` 属性。
* **4 张核心卡片映射概览**：
  1. **Plain (As-Machined)**：路径 `titanium-plain-finish-inspection.webp` | 参数：Natural TiO₂ (`0 μm`) | CTA: `Select Plain for RFQ`
  2. **Passivated (ASTM B600 / A967)**：路径 `titanium-passivated-cleanroom-finish.webp` | 参数：`ASTM B600/A967` (`< 0.5 μm`) | CTA: `Select Passivated for RFQ`
  3. **Anodizing (Type II / Type III)**：路径 `titanium-anodized-type2-type3-bolts.webp` | 参数：`AMS 2488` (`< 2 μm`) | CTA: `Select Anodizing for RFQ`
  4. **PVD Coating (DLC / TiN / CrN)**：路径 `titanium-pvd-dlc-tin-coating.webp` | 参数：Vacuum PVD (`1–3 μm`) | CTA: `Select PVD for RFQ`
Use code with caution.

第二部分：4 种表面处理的 AI 绘图英文提示词（工业实物 + 工程师协作检测场景）

提示词统一设定为 --ar 16:10 比例，将精密钛紧固件置于前景，背景自然融入质检与工程协作场景：
1. Plain（本色 / 机加工原色） — 对应 titanium-plain-finish-inspection.webp：Prompt: Commercial industrial photography of precision CNC-machined Grade 5 titanium hex flange bolts and socket cap screws in raw plain metallic silver-grey finish, neatly arranged on an anodized aluminum inspection fixture in the foreground. Crisp machined thread details and natural satin titanium luster. In the softly blurred background, a mechanical quality engineer in a clean navy factory uniform is inspecting titanium fasteners with a digital micrometer alongside an OEM technical buyer reviewing engineering blueprints. Bright modern CNC manufacturing facility lighting, shallow depth of field, photorealistic, high detail, 8k resolution --ar 16:10
2. Passivated（酸洗钝化） — 对应 titanium-passivated-cleanroom-finish.webp：Prompt: Industrial B2B photography of ultra-clean passivated Grade 23 titanium medical and semiconductor screws arranged in a stainless steel mesh cleanroom tray in the foreground, showing a uniform, spotless matte-satin titanium oxide surface free of contamination. In the background, two engineers wearing white lab coats and nitrile gloves are collaborating over a quality inspection checklist and PMI XRF material analyzer in a modern quality control laboratory. Cool, crisp clinical lighting, sharp focus on foreground titanium threads, shallow depth of field, photorealistic --ar 16:10
3. Anodizing（阳极氧化 Type II & Type III） — 对应 titanium-anodized-type2-type3-bolts.webp：Prompt: Studio-grade industrial photography of precision titanium fasteners showcasing AMS 2488 Type II dark charcoal-grey anti-galling bolts alongside Type III vibrant blue, gold, and purple anodized titanium socket screws on a dark slate inspection table. Sharp metallic interference luster on every thread. In the softly out-of-focus background, a manufacturing specialist is presenting color-coded titanium fastener samples to a technical procurement manager in a modern engineering meeting room. Balanced studio and industrial lighting, crisp detail, photorealistic --ar 16:10
4. PVD Coating（PVD 物理气相沉积镀膜） — 对应 titanium-pvd-dlc-tin-coating.webp：Prompt: High-precision industrial photography of PVD-coated titanium fasteners in the foreground, featuring ultra-hard matte-satin DLC black and metallic TiN gold titanium bolts and precision studs on a precision granite surface plate. Fine thread geometry clearly visible with zero coating buildup. In the softly blurred background, a coating process engineer and a quality inspector are examining a batch of PVD titanium components under bright inspection lamps next to vacuum coating equipment. Clean modern industrial aesthetic, shallow depth of field, 8k photorealistic --ar 16:10

图片生成与上线操作建议

• 生成策略：建议按顺序逐张生成，确认螺纹细节、人物手部与仪器形态自然无畸变后，保存为 .webp 并存入 public/images/fastener-coatings/ 目录。
• 视觉一致性：4 组提示词均采用「前景实物微距 + 中后景工程质检虚化」构图，确保上线后风格高度统一，向海外买家传递源头工厂与严谨质检的专业信赖感。
需要我帮您把完整整合后的 Cline 开发文档（包含上述图文模块与之前的架构、FAQ、RFQ 表单）合并输出为一个可直接复制的 Markdown 代码块，方便您一键粘贴给 Cline 吗？


模块 C：EngineeringComparisonMatrix（交互式工程选型矩阵）

• 交互筛选按钮（纯原生轻量 JS 实现）：
	• All Finishes | Anti-Galling Priority | Zero Tolerance Change | Medical & Cleanroom | Color Coding & Aesthetics
• 数据表格列结构（移动端支持 overflow-x-auto 横向滚动，首列 sticky left-0 固定）：
	1. Finish Option（Plain / Passivated / Anodizing Type II / Anodizing Type III / PVD Coating）
	2. Governing Standard（In-House Spec / ASTM B600 / AMS 2488 / ISO / PVD Spec）
	3. Typical Thickness（0 μm / < 0.5 μm / 1–2 μm / < 1 μm / 1–3 μm）
	4. Thread Tolerance Impact（None / Negligible / Minimal / Negligible / Pre-plating allowance check）
	5. Primary Engineering Purpose（Cost & Lead Time / Purity & Corrosion / Anti-Galling / Color ID / Extreme Wear & Aesthetics）
	6. Action（按钮 Select Finish -> 点击后自动勾选下方询盘表单中的对应工艺，并平滑滚动至 #rfq-quote-section）

模块 D：EngineeringFAQ（B2B 采购与工程决策问答 - 强化 SEO/GEO 长尾词）

使用原生 <details> 与 <summary> 标签构建手风琴折叠面板，解答海外采购商的核心疑问（严格遵守不提供实测摩擦/扭矩数值的红线）：
1. How do I choose between Passivated and Plain finish for industrial titanium fasteners?（解释表面游离铁去除与耐蚀一致性差异）
2. What is the difference between AMS 2488 Type II and Type III Titanium Anodizing?（解释功能型防咬死深灰膜与外观/医疗色标干涉膜的区别）
3. Do PVD or Anodized coatings require undersized thread machining?（说明微米级厚度对 M1–M36 DIN/ISO 螺纹公差的影响及工厂预留补偿机制）
4. What material certifications and inspection reports are provided with coated titanium fasteners?（突出工厂级交付护城河：随货提供 EN 10204 3.1 MTC、出厂 100% PMI / XRF 材质光谱验证报告，以及面向分销商的 OEM 中性/定制标签包装）。

模块 E：FactoryRFQSection（表面处理定制询盘表单 - 承担 Money 意图）

• 布局设计：左侧为工厂交付与保密承诺栏，右侧为高转化询盘表单（复用站点现有的表单提交机制，如 Formspree 或现有联系组件）。
• 左侧信任锚点：
	• NDA & IP Protection：明确声明在接收客户定制图纸（STEP / DXF / PDF）前可签署保密协议（NDA）。
	• Full Traceability：所有批次均附带 EN 10204 3.1 材质证明与 PMI/XRF 牌号核验。
	• Distributor & OEM Ready：支持分销商白牌包装、定制贴标及框架协议分批交付（Blanket Orders）。
• 右侧表单字段：
	• Required Surface Finish（多选复选框：Plain | Passivated (ASTM B600) | Anodizing Type II (AMS 2488) | Anodizing Type III (Color) | PVD (DLC / TiN) | Other / Per Drawing）
	• Titanium Material Grade（下拉单选：Grade 2 (Commercially Pure) | Grade 5 (Ti-6Al-4V) | Grade 7 | Grade 23 (Ti-6Al-4V ELI) | Other）
	• Standard & Size Range（输入框，Placeholder：e.g., DIN 912 / ISO 4762, M6x20, Qty: 2,000 pcs）
	• Company Email（必填，业务邮箱）
	• Project Notes / Drawing Reference（文本框）
	• 提交按钮：Submit Technical RFQ（附带提示：Direct engineering review within 24 hours. NDA available upon request.）

4. 底部关联内链与自检

表单下方集成 4 列相关资源链接（材质等级、质检溯源、NDA 协议及规格配置工具），并要求 Cline 确保 URL 路径稳定、旧版钢/不锈钢文案及虚假扭矩数据已彻底清空。
您可以在 Cline 完成代码生成后，让我帮您做一轮代码与文案合规审查；或者如果您需要为该页面的 4 种核心表面处理配图，我也可以为您生成一套符合工业实物与工程师检测场景的 AI 绘图英文提示词。
