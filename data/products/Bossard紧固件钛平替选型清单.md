# Bossard 紧固件目录 · 钛材（Gr2 / Gr5·TC4）替代选型清单

> **文档性质**：工程选型清单（Engineering Selection Matrix）
> **数据源**：Bossard Group 全球电商目录 `https://www.bossard.com/global-en/eshop/`（实抓，非推断）
> **抓取日期**：2026-11-12
> **适用范围**：`01.100 Standard Fastening Elements`（标准紧固件）与 `01.300 Securing and Anti-Loosening Elements`（防松紧固件）两大分支
> **输出语言**：简体中文；标准号、牌号、类目路径保留原文

---

## 0. 结论摘要

| 判定 | 数量 | 说明 |
|---|---|---|
| 可平替（Gr5 / TC4 主推） | 13 类 | 承力件，等强于 8.8 级，显著优于 A2-70 |
| 可平替（Gr2 优先） | 5 类 | 耐蚀/非承力件，如垫圈、螺母、牙条、盖形螺母 |
| 谨慎评估 | 3 类 | 依赖弹性或保持扭矩的防松件（DIN 980、DIN 6796、DIN 6798） |
| 直接排除 | 8 类 | 楔形锁紧垫、开口弹簧垫、尼龙嵌件螺母、焊接件、铜/塑料/易切削钢件、HV 结构螺栓 |

**一句话逻辑**：Bossard 上述类目中，同一产品族普遍并存 A2/A4 不锈钢 SKU，说明其几何形态、螺纹工艺与装配工况本身与耐蚀材料兼容；钛只是沿同一条材料升级路径再走一步。这是"可平替"最强的目录级证据，比单看产品名称可靠。

---

## 1. 目录结构核对与实测样本

Bossard 目录为三级编码体系，本次只取规则指定的两大分支：

- `01 Fastening Technology` → `01.100 Standard Fastening Elements`（Screws / Nuts / Washers / Pins / Standoffs / Accessories）
- `01.300 Securing and Anti-Loosening Elements`（Securing Washers / Securing Screws / Locking Nuts / Retaining Rings）

实测 SKU 数（判断品类厚度用，非全站总数）：

| 类目编码 | 类目名称 | 实测 SKU |
|---|---|---|
| 01.100.100.10 | Screws and Bolts with Internal Drive（内六角驱动螺钉） | 173 |
| 01.100.100.20 | Screws and Bolts with External Drive（外六角驱动螺栓） | 68 |
| 01.100.100.30 | Threaded Rods and Threaded Studs（牙条与螺柱） | 23 |
| 01.100.100.40 | Set Screws（紧定螺钉） | 32 |
| 01.100.200.10 | Hex Nuts（六角螺母） | 90 |
| 01.100.300.10 | Washers Flat without Chamfer（平垫圈） | 84 |
| 01.300.100.10 | Spring Washers（弹簧垫圈） | 29 |
| 01.300.100.20 | Split Spring Lock Washers（开口弹簧锁紧垫圈） | 26 |
| 01.300.100.30 | Serrated / Toothed Lock Washers（齿形锁紧垫圈） | 20 |
| 01.300.100.40 | Ribbed Lock Washers / Contact Washers（带肋/接触垫圈） | 25 |
| 01.300.100.50 | Wedge Lock Washers（楔形锁紧垫圈） | 10 |
| 01.300.500.10 | Securing Screws with Internal Drive（防松螺钉·内驱） | 14 |
| 01.300.600.10 | Metallic Locking Nut（金属锁紧螺母） | 33 |
| 01.300.600.30 | Locking Nuts with Polyamide Insert（尼龙嵌件锁紧螺母） | 25 |
| **合计** | 14 个关键类目 | **约 652** |

### 标准时效提示

产品详情页显示 **DIN 912 已撤销（Standard withdrawn），现行以 ISO 4762 为准**；Bossard 同时标注 ~UNI 5931、~ČSN 021143。做外贸报价单与图纸标注时按 **ISO 4762** 引用，不要再用 DIN 912 作主标准。

---

## 2. 筛选规则映射（规则 → 工程判决）

| 规则条款 | 工程判决依据 |
|---|---|
| 优先保留 Standard / Securing 两大分支 | 仅在这两个分支内取数，`02 Specific Fastening Technologies`（铆接、锁铆、螺纹嵌件、焊接）与 `03 Functional Elements` 不纳入 |
| 高度匹配：A2/A4 不锈钢、中低强度碳钢 8.8/10.9、部分铝合金 | Gr5（Rm≥931 / Re≥827 MPa）可等强覆盖 8.8（800/640）与 A2-70（700/450）；Gr2（483/345）覆盖纯耐蚀位 |
| 谨慎评估：12.9 级 | Rm 1220 / Re 1100 超出 Gr5 上限，须升 1–2 级规格或明确降预紧 |
| 直接排除：黄铜/铜、塑料/聚酰胺、焊接件、易切削钢 | 功能本体为导电/导热/装饰/绝缘/易切削，或现场工艺不可行，钛替代无工程收益 |
| 重点标准件类型 | 内六角圆柱头、外六角、盘头/沉头内六角、紧定、六角与防松螺母、平垫与弹簧垫，全部覆盖见第 3 节 |

---

## 3. 选型主表（21 个品类）

> 建议替代牌号取值原则：**承力 → Gr5 / TC4；纯耐蚀、非承力、隔离件 → Gr2**。Gr2 不可用于承力主结构。

### 3.1 螺钉类｜内六角驱动（`01.100.100.10`）

| Bossard 分类路径 | 产品名称与标准号 | 原网站主流材质/等级 | 推荐替代钛牌号 | 替代核心卖点与应用场景 | 平替工程注意事项 |
|---|---|---|---|---|---|
| 01.100.100.10 内六角螺钉 | 内六角圆柱头螺钉 **ISO 4762**（原 DIN 912，全牙/半牙）<br>BN 3 全牙镀蓝锌、BN 2 半牙黑、BN 4 半牙镀蓝锌、BN 272 全牙黑；同族并存 A2/A4 | 碳钢 **8.8**（详情页实测）；同族含 10.9 / 12.9；A2-70、A4-70/80 | **Gr5 / TC4** 为主；Gr2 仅限非承力装饰位 | 减重约 42%（4.51 vs 7.85 g/cm³）；耐氯离子点蚀；非铁磁；与 CFRP 电偶相容。用于自行车/摩托/赛车、航空内饰、医疗设备、海工与泳池设备 | 钛无 ISO 898 等级体系，须按 ASTM F593 或企标交付；Gr5 屈服 827 MPa < 10.9 的 940 MPa，**10.9/12.9 工况必须升一级规格或降预紧**；Ti-Ti 咬死严重，需 MoS₂/干膜润滑，实测扭矩系数 K 常在 0.18–0.25 |
| 01.100.100.10 内六角螺钉 | 内六角低圆柱头 **DIN 7984**；带导向孔低圆柱头 **DIN 6912**（A2 BN 1350 / A4 BN 1206） | 碳钢 8.8 / 10.9；A2/A4 | **Gr5** | 头部高度受限空间；Gr5 高强度可补偿薄头带来的承压面减小。用于机床夹具、模具、液压阀块、半导体设备 | 头下承压面积小，须校核被连接件压溃；头下过渡圆角是疲劳源，建议滚压 + 喷丸 |
| 01.100.100.10 内六角螺钉 | 内六角平圆头 **ISO 7380-1** / 带台肩 **ISO 7380-2**（A2 BN 8699、A4 BN 6971、A2 带台肩 BN 33021） | 碳钢 8.8 / 10.9；A2/A4 | **Gr5**（承力）；**Gr2**（外观/轻载） | 圆滑头部无外露棱角，适合医疗床、康复器械、消费电子外观件；本色耐蚀可省去电镀工序 | 内六角槽深相对头部高度偏浅，钛的槽壁易滑牙，须控制槽深与批头配合；钛冷镦成形性差，小批量建议车削或温镦 |
| 01.100.100.10 内六角螺钉 | 内六角沉头螺钉 **ISO 10642**（原 DIN 7991），A2 BN 20/21、A4 BN 616 | 碳钢 8.8 / 10.9；A2/A4 | **Gr5** | 沉头齐平装配，用于气动蒙皮、CFRP 夹层结构、无人机机架；与碳纤维无电偶腐蚀是相对铝合金的硬优势 | 90° 沉头与孔座配合公差要求高；钛承压面易压溃铝/复材孔座，须加隔离垫或加大沉孔；沉头过渡处应力集中，不建议用于高周疲劳关键位 |
| 01.100.100.10 内六角螺钉 | 六角花形（Torx）圆柱头/沉头/盘头 **ISO 14579 / 14581 / 14583**（A2 BN 2107、A4 BN 38 等） | 碳钢 8.8；A2/A4 | **Gr5 / Gr2** | 六角花形传扭能力高于内六角，减少批头磨损与槽口损伤，适配自动化装配线；用于机器人关节、医疗工具、精密仪器 | 花形槽在钛上加工成本高于内六角；槽根应力集中，禁止用小一号批头强行装配；建议 Gr5 配 DLC 批头 |
| 01.100.100.10 内六角螺钉 | 内六角紧定螺钉 **ISO 4026 / 4027 / 4028 / 4029**（原 DIN 913–916；A2 BN 617/618/619/621，A4 BN 4723/4721/33032） | 碳钢（45H / 33H 级，表面硬化）；A2/A4 | **Gr5**，且必须做表面硬化 | 无磁、耐蚀、轻量，替代不锈钢紧定用于光学平台、半导体真空腔、医疗滑轨 | 尖端硬度是功能核心，Ti 基体硬度仅约 30–36 HRC，直接使用会打滑/压溃；须局部渗氮（NTH）或改用钢制紧定 + 钛本体；与钢轴配合仍会咬合 |

### 3.2 螺钉类｜外六角驱动（`01.100.100.20`）

| Bossard 分类路径 | 产品名称与标准号 | 原网站主流材质/等级 | 推荐替代钛牌号 | 替代核心卖点与应用场景 | 平替工程注意事项 |
|---|---|---|---|---|---|
| 01.100.100.20 外六角螺钉 | 六角头螺栓 **ISO 4014**（原 DIN 931）/ 全牙 **ISO 4017**（原 DIN 933）<br>BN 54/56 全牙、BN 55/57 半牙（黑 / 镀蓝锌） | 碳钢 **8.8** 为主（含热镀锌、锌铝涂层）；该族几乎无 A2/A4 | **Gr5** | 结构件减重 + 免维护防腐，用于海上平台栏杆、化工管廊、污水处理、沿海钢结构 | Bossard 该族以 8.8 为主，因此替代目标就是 8.8：Gr5 可达标；但长螺栓因弹性模量仅约 110 GPa，**预紧须按伸长量或转角法**，不能用钢制扭矩表；与钢螺母混用需润滑并核算电偶 |
| 01.100.100.20 外六角螺钉 | 六角法兰螺栓 **DIN 6921 / EN 1665**（A2 BN 2112；碳钢 BN 41200 / 2846） | 碳钢 8.8 / 10.9；A2 | **Gr5** | 法兰面自带承压面，可省掉垫圈、减少一个电偶界面，适合幕墙、轨道交通、工程机械 | 法兰面平面度与承压面积决定防松与防压溃效果；与铝件直接接触时仍须绝缘垫 |

### 3.3 螺母类（`01.100.200.10` + `01.300.600.10`）

| Bossard 分类路径 | 产品名称与标准号 | 原网站主流材质/等级 | 推荐替代钛牌号 | 替代核心卖点与应用场景 | 平替工程注意事项 |
|---|---|---|---|---|---|
| 01.100.200.10 六角螺母 | 六角螺母 **ISO 4032**（原 DIN 934）<br>碳钢 BN 108/109；A2 BN 5713；A4 BN 2586 | 碳钢 8 / 10；A2-70、A4-70/80 | **Gr5**（承力）；**Gr2**（非承力） | 全钛连接彻底消除螺栓-螺母电偶，用于海水、化工法兰、泳池、船用索具 | Ti-Ti 螺纹副是全表咬死风险最高的组合，必须干膜润滑；钛螺纹剪切强度低于钢，螺母高度建议加至 1.2–1.5d，或采用"钛螺栓 + 钢螺母"混合方案 |
| 01.100.200.10 六角螺母 | 六角薄螺母 **DIN 439 B / ISO 4035**；A2 BN 630、A4 BN 631 | 碳钢 04 / 8；A2/A4 | **Gr2** | 轻量副螺母 / 锁紧螺母，减重敏感场合 | 薄螺母承载能力低，只能作锁紧副，不可作主承力件 |
| 01.100.200.10 六角螺母 | 六角法兰螺母 **DIN 6923 / EN 1661**；A2 BN 14476 | 碳钢 8；A2 | **Gr5** | 承压面大，适合幕墙、轨道、复材夹层 | 法兰面与铝/复材之间需加绝缘隔离，否则电偶腐蚀转移到被连接件 |
| 01.100.200.10 六角螺母 | 盖形螺母 **DIN 1587**；A2 BN 635、A4 BN 1721 | 碳钢 8；A2/A4 | **Gr2**（首选）；Gr5 | 端部封闭 + 装饰，用于游艇五金、建筑外露节点、医疗扶手，可省去塑料帽 | 钛冷镦成形盖形困难，多为车削，成本偏高；内腔易积水，海洋环境建议加密封 |
| 01.300.600.10 金属锁紧螺母 | 全金属锁紧螺母 **DIN 980 / ISO 7042**；碳钢 BN 169；A2 BN 5242；另含 J.Lanfranco 全金属系列 | 碳钢 8 / 10；A2/A4 | **Gr5（谨慎）** | 无塑料嵌件，耐温显著高于尼龙型，用于排气、涡轮、航空、窑炉周边 | 全金属锁紧靠收口/椭圆变形产生保持扭矩，钛的回弹大、屈服窗口窄，**有效防松扭矩不稳定**，须专用压扁/攻丝工艺 + 批次防松扭矩验证，不可照搬钢件工艺参数 |
| 01.300.600.10 金属锁紧螺母 | 开槽/城堡螺母 **DIN 935**；A4 BN 636 | 碳钢 8；A4 | **Gr5** | 机械正锁（开口销），振动/旋转场合可靠，用于赛车、航空、传动轴 | 开槽与销孔加工在钛上成本高；销孔削弱截面，须校核净截面强度 |

### 3.4 垫圈类（`01.100.300.10` + `01.300.100.xx`）

| Bossard 分类路径 | 产品名称与标准号 | 原网站主流材质/等级 | 推荐替代钛牌号 | 替代核心卖点与应用场景 | 平替工程注意事项 |
|---|---|---|---|---|---|
| 01.100.300.10 平垫圈（无倒角） | 平垫圈 **DIN 125 A / ISO 7089**；A2 BN 670、A4 BN 671、碳钢 BN 713/715（ISO 7089 版 A2 BN 20730 / A4 BN 20731） | 碳钢 100HV / 200HV；A2/A4；同族含黄铜、铜、铝 | **Gr2**（首选）；Gr5（高承压） | 作为电偶隔离界面、耐海水、减重；用于铝结构、复材、海工、化工 | 厚度与承压面积须重算（钛刚度高但接触应力集中）；Ti 垫圈与 Ti 螺栓头同样会咬死；要"隔离铝"时钛垫圈反而无效，须用绝缘垫 |
| 01.100.300.10 平垫圈（无倒角） | 大外径平垫圈 **ISO 7093-1 / DIN 9021**；A2 BN 1356、A4 BN 1684 | 碳钢 100HV；A2/A4 | **Gr2** | 大承压面保护软质基材与复材夹层 | 大直径薄垫在钛上易翘曲，需控制平面度 |
| 01.300.100.30 齿形/齿状锁紧垫圈 | 外齿 **DIN 6797 A**（A2 BN 2842）、内外齿 **DIN 6798 A/J**（A2 BN 675/676、A4 BN 4880/4881） | 弹簧钢（表面硬化）；A2/A4 | **Gr5 + 表面硬化**；否则不推荐 | 齿面咬合防松、耐蚀，用于电气柜、轨交、风电 | 齿尖需 ≥350–400 HV 才能嵌入对面，Ti 基体达不到，须渗氮（NTH）或齿部局部强化，否则齿被压平、防松失效 |
| 01.300.100.10 弹簧垫圈 | 锥形弹簧垫圈 **DIN 6796**；A2 BN 2312 | 弹簧钢 42CrMo4；A2 | **Gr5（谨慎）** | 高预紧法兰连接、模具、有限空间的弹性补偿 | 钛弹性区间窄、易塑性变形，压缩量须按钛的弹性极限重新校核，不能照抄钢制压缩量 |

### 3.5 长材与预涂防松（`01.100.100.30` + `01.300.500.10`）

| Bossard 分类路径 | 产品名称与标准号 | 原网站主流材质/等级 | 推荐替代钛牌号 | 替代核心卖点与应用场景 | 平替工程注意事项 |
|---|---|---|---|---|---|
| 01.100.100.30 牙条与螺柱 | 米制牙条 **DIN 975**（1m / 2m / 3m）；碳钢 BN 413/419、**A2 BN 662**、**A4 BN 663**、铝 BN 601 | 碳钢 4.8 / 8.8；A2/A4；铝 | **Gr2**（耐蚀优先）；**Gr5**（承力拉杆） | 化工平台栏杆、电解槽、海水养殖、无磁支撑结构 | 弹性模量仅钢的一半，**长杆挠度与振动放大**，须按跨度校核；全长螺纹咬死风险高，装配前涂干膜润滑；车螺纹效率低，成本按长度线性上涨 |
| 01.100.100.30 牙条与螺柱 | 双头螺柱 / 螺纹销 **DIN 976-1 B**（碳钢 BN 425） | 碳钢 8.8；A2 | **Gr5** | 泵体、阀体、法兰双头连接 | 过盈/胶接配合时钛与钢的膨胀差（8.5 vs 11.5×10⁻⁶/K）会造成温度循环预紧漂移 |
| 01.300.500.10 防松螺钉（内驱） | 内六角圆柱头预涂防松 **ISO 4762 + TufLok 预涂层**；A2/A4 BN 2108、碳钢 BN 8706 | 碳钢 8.8 / 10.9；A2/A4 | **Gr5 + 预涂层** | 用预涂防松替代现场点胶，洁净装配、可重复拆卸，适合医疗与电子 | 涂层附着依赖钛表面处理（阳极氧化后附着差），须做预涂附着力与拆卸次数验证；预涂为一次性，重复使用失效 |

---

## 4. 直接排除清单（同目录内）

| Bossard 分类路径 | 产品类型（示例 BN / 标准） | 原材质 | 排除理由（工程侧） |
|---|---|---|---|
| 02.500 焊接技术 / 02.550 超声波焊接 | 焊接螺柱、焊接螺母 | 碳钢、不锈钢 | 钛焊接需惰性气体/真空保护，现场焊接不可行；热影响区易吸氧生成 α 脆性层。规则亦明确排除 |
| 01.300.100.50 楔形锁紧垫圈 | NORD-LOCK® NL / NLss（BN 65212、20141 1.4404、65201 1.4547） | 整体淬硬钢 ≥400HV；不锈钢表面硬化 | 楔形角与凸轮齿依赖高硬度-高摩擦配对，钛会压溃、咬合、一次性失效，无法保证重复拆装精度 |
| 01.300.100.20 开口弹簧锁紧垫圈 | DIN 127 B（A2 BN 672、A4 BN 673、弹簧钢 BN 761） | 弹簧钢、A2/A4 | 防松机理完全依赖弹性开口张力；钛弹性模量低、易塑性变形，装一次即失效。且该结构在振动工况本已被工程界淘汰 |
| 01.300.600.30 尼龙嵌件锁紧螺母 | DIN 985 / DIN 982（A2 BN 637、A4 BN 1722） | 碳钢 + PA66 嵌件 | 功能核心是聚酰胺嵌件（耐温约 120°C、会老化吸湿），与钛本体无关；要钛化必须改为 DIN 980 全金属结构 |
| 01.100.200.10 → 隔离柱（Standoffs） | 六角隔离柱 BN 3318 / 3319 / 3320 / 7375 | 易切削钢、黄铜、PA66、黄铜镀镍 | 原材质同时命中"黄铜/铜、塑料、易切削钢"三条排除；钛无易切削牌号。若客户要无磁轻量，只能做 Gr5 车削定制件，不属标准件平替 |
| 01.100.100.90 其他螺钉 | 黄铜/铜类螺钉螺母（BN 502/503、504/505、31209/31210 书螺丝） | 黄铜、铜 | 导电、导热、装饰电镀是其功能本体，钛无法替代；且成本无任何优势 |
| 01.100.100.20 外六角 | 钢结构高强螺栓 **EN 14399-1 / -4 HV**（FRIEDBERG BN 14001/14000、Peiner BN 97） | 碳钢 10.9 HV 成套 | 规范对材料、扭矩系数、成套供货有强制约束；钛无法稳定满足 HV 10.9 的延性与预紧一致性，属"规范不可替代"而非"性能不足" |
| 01.100.100.10 内六角 | 12.9 级内六角（同族高强度变体） | 合金钢 12.9 | **谨慎而非排除**：Rm 1220 / Re 1100 超出 Gr5（931/827），等强度须升 1–2 级规格，或明确降级使用并重算夹紧力 |

---

## 5. 强度等效标尺（报价与技术沟通的硬依据）

| 材料 / 等级 | Rm (MPa) | Re / Rp0.2 (MPa) | 密度 (g/cm³) | 弹性模量 (GPa) | 与钢/不锈钢等级的对应关系 |
|---|---|---|---|---|---|
| 工业纯钛 **Gr2**（ASTM F593，≤3/4″） | ≥483 | ≥345 | 4.51 | ~105 | 约相当于 4.6–5.6 级；**低于 A2-70**，只能做耐蚀/非承力件 |
| 钛合金 **Gr5 / TC4**（ASTM F593） | ≥931 | ≥827 | 4.51 | 110–117 | **可平替 8.8**（800/640）；**不等强于 10.9**（1040/940），更远低于 12.9 |
| 碳钢 8.8 | 800 | 640 | 7.85 | 200–210 | — |
| 碳钢 10.9 | 1040 | 940 | 7.85 | 200–210 | Gr5 需升规格或降预紧 |
| 碳钢 12.9 | 1220 | 1100 | 7.85 | 200–210 | 钛基本不可等强替代 |
| 不锈钢 A2-70 / A4-80 | 700 / 800 | 450 / 600 | 8.0–8.2 | 190–200 | Gr5 强度更高，Gr2 更低 |

**减重收益**：相对碳钢约 **42.5%**，相对不锈钢约 **43–45%**。

---

## 6. 平替工程红线（六条必须写进工艺卡）

1. **没有"8.8 级钛螺栓"这种说法**。ISO 898-1 不覆盖钛，交付须按 ASTM F593（螺栓）/ F467（螺母）或企业标准，并附批次力学与硬度报告——这是对欧美客户最容易被质疑、也最容易建立专业信任的一点。
2. **咬死（galling）是头号失效模式**，Ti-Ti 螺纹副尤甚。必须配 MoS₂ 干膜、阳极氧化或 PVD，并按实测扭矩系数（常 0.18–0.25）而非钢制扭矩表装配。
3. **钛是阴极**：与铝、镁偶合会急剧加速对方腐蚀，与碳钢在海水中会加速钢侧腐蚀；隔离垫/绝缘套是设计件，不是选配件。
4. **禁酸洗、禁电镀**：氢致脆性风险；表面处理走阳极氧化（Type II/III）或 PVD。
5. **富氧/高压氧环境禁用**：钛在富氧、液氧条件下可燃，这是航空与医疗气体管路的硬红线。
6. **温度上限**：Gr5 长期约 ≤315°C、Gr2 约 ≤300°C，超温后蠕变导致预紧松弛；低温（-196°C）反而是钛相对碳钢的优势场景。

---

## 7. 开发优先级建议（面向钛 CNC / 紧固件外贸站）

| 优先级 | 品类 | 依据 |
|---|---|---|
| **P0** | Gr5 内六角圆柱头 ISO 4762（M3–M8）、Gr5 沉头 ISO 10642、Gr2 平垫 DIN 125 A / ISO 7089、Gr5 法兰螺母 DIN 6923 | 同时覆盖自行车/摩托改装、医疗设备、海工、复材装配四个客群；Bossard 原站均为 8.8 或 A2/A4 大宗件，替换逻辑一句话讲得清 |
| **P1** | Gr2 牙条 DIN 975（化工/海工长尺件，客单价高）、Gr2 盖形螺母 DIN 1587（游艇五金，外观溢价）、Gr5 六角花形 ISO 14581（自动化装配卖点） | 差异化内容价值高，竞争密度低 |
| **不碰** | 开口弹簧垫圈 DIN 127、楔形锁紧垫 NORD-LOCK、EN 14399 HV 结构螺栓、12.9 等强替代 | 做进去只带来售后与索赔 |

---

## 附录 A｜本次抓取的类目路径（可直接复用为站内选型页导航）

```
01  Fastening Technology
├── 01.100  Standard Fastening Elements
│   ├── 01.100.100  Screws
│   │   ├── 01.100.100.10  Screws and Bolts with Internal Drive
│   │   ├── 01.100.100.20  Screws and Bolts with External Drive
│   │   ├── 01.100.100.30  Threaded Rods and Threaded Studs
│   │   ├── 01.100.100.40  Set Screws
│   │   └── 01.100.100.70  Standoffs
│   ├── 01.100.200  Nuts
│   │   └── 01.100.200.10  Hex Nuts
│   └── 01.100.300  Washers
│       └── 01.100.300.10  Washers Flat without Chamfer
└── 01.300  Securing and Anti-Loosening Elements
    ├── 01.300.100  Securing and Anti-Loosening Washers
    │   ├── 01.300.100.10  Spring Washers
    │   ├── 01.300.100.20  Split Spring Lock Washers
    │   ├── 01.300.100.30  Serrated / Toothed Lock Washers
    │   ├── 01.300.100.40  Ribbed Lock Washers / Contact Washers
    │   └── 01.300.100.50  Wedge Lock Washers
    ├── 01.300.500  Securing and Anti-Loosening Screws
    │   └── 01.300.500.10  ... with Internal Drive
    └── 01.300.600  Locking Nuts
        ├── 01.300.600.10  Metallic Locking Nut
        └── 01.300.600.30  Locking Nuts with Polyamide Insert
```

## 附录 B｜数据来源 URL（关键页）

| 用途 | URL |
|---|---|
| 电商总目录 | https://www.bossard.com/global-en/eshop/ |
| 内六角驱动螺钉（173 SKU） | https://www.bossard.com/global-en/eshop/products/fastening-technology/standard-fastening-elements/screws/screws-and-bolts-with-internal-drive/c/01.100.100.10/ |
| 外六角驱动螺栓（68 SKU） | https://www.bossard.com/global-en/eshop/products/fastening-technology/standard-fastening-elements/screws/screws-and-bolts-with-external-drive/c/01.100.100.20/ |
| 紧定螺钉（32 SKU） | https://www.bossard.com/global-en/eshop/products/fastening-technology/standard-fastening-elements/screws/set-screws/c/01.100.100.40/ |
| 牙条与螺柱（23 SKU） | https://www.bossard.com/global-en/eshop/products/fastening-technology/standard-fastening-elements/screws/threaded-rods-and-threaded-studs/c/01.100.100.30/ |
| 六角螺母（90 SKU） | https://www.bossard.com/global-en/eshop/products/fastening-technology/standard-fastening-elements/nuts/hex-nuts/c/01.100.200.10/ |
| 平垫圈（84 SKU） | https://www.bossard.com/global-en/eshop/products/fastening-technology/standard-fastening-elements/washers/washers-flat-without-chamfer/c/01.100.300.10/ |
| 弹簧垫圈（29 SKU） | https://www.bossard.com/global-en/eshop/products/fastening-technology/securing-and-anti-loosening-elements/securing-and-anti-loosening-washers/spring-washers/c/01.300.100.10/ |
| 开口弹簧锁紧垫圈（26 SKU） | https://www.bossard.com/global-en/eshop/products/fastening-technology/securing-and-anti-loosening-elements/securing-and-anti-loosening-washers/split-spring-lock-washers/c/01.300.100.20/ |
| 齿形锁紧垫圈（20 SKU） | https://www.bossard.com/global-en/eshop/products/fastening-technology/securing-and-anti-loosening-elements/securing-and-anti-loosening-washers/serrated-lock-washers-toothed-lock-washers/c/01.300.100.30/ |
| 带肋/接触垫圈（25 SKU） | https://www.bossard.com/global-en/eshop/products/fastening-technology/securing-and-anti-loosening-elements/securing-and-anti-loosening-washers/ribbed-lock-washers-contact-washers/c/01.300.100.40/ |
| 楔形锁紧垫圈（10 SKU） | https://www.bossard.com/global-en/eshop/products/fastening-technology/securing-and-anti-loosening-elements/securing-and-anti-loosening-washers/wedge-lock-washers/c/01.300.100.50/ |
| 金属锁紧螺母（33 SKU） | https://www.bossard.com/global-en/eshop/products/fastening-technology/securing-and-anti-loosening-elements/locking-nuts/metallic-locking-nut/c/01.300.600.10/ |
| 尼龙嵌件锁紧螺母（25 SKU） | https://www.bossard.com/global-en/eshop/products/fastening-technology/securing-and-anti-loosening-elements/locking-nuts/locking-nuts-with-polyamide-insert/c/01.300.600.30/ |
| 防松螺钉·内驱（14 SKU） | https://www.bossard.com/global-en/eshop/products/fastening-technology/securing-and-anti-loosening-elements/securing-and-anti-loosening-screws/securing-and-anti-loosening-screws-with-internal-drive/c/01.300.500.10/ |
| 产品详情（等级实测 BN 3） | https://www.bossard.com/global-en/eshop/screws-and-bolts-with-internal-drive/hex-socket-head-cap-screws-fully-threaded/p/3/ |

> 说明：Bossard 全球店目录为 JS 渲染 + Algolia 检索，产品列表存在虚拟化，单次读页只能取到可视区条目。本清单采用"点击 Show More + 逐屏滚动 + 反复读文本按 BN 累积去重"的方式取全量，故附录中 SKU 数为实测值而非页面宣称值，个别类目可能略低于站点总数。

> （注：部分内容由豆包 AI 生成）