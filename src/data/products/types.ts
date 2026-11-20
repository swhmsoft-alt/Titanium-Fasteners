/**
 * src/data/products/types.ts — 产品数据层类型契约。
 *
 * 这份文件是 Phase B 数据层的**唯一结构来源**。scripts/gen-products.mjs 生成的
 * *.ts 全部实现这里的接口；页面只 import 生成产物，不直接碰 data/products/*.csv。
 *
 * 术语
 * ----
 * family   产品族（如「内六角圆柱头螺钉」）—— 页面的 SEO 主体，一族一页。
 * matrix   规格矩阵 —— 一族在一个 standard 下的 (螺纹 × 长度 × 尺寸) 全表。
 * sku      可订购件 —— family × material × finish × 规格行，笛卡尔积派生，不落盘。
 *
 * 单位约定：长度/直径/高度一律 mm，强度一律 MPa，密度 g/cm³，温度 °C。
 */

/**
 * 一行规格矩阵记录。`key` 是该行在 (standard + key 参数) 下的唯一标识。
 *
 * 参数是**扁平**的（`row.d1`、`row.thread`），键集合由该族的 PARAM_SCHEMA 决定。
 * 不同类型的参数集不同 —— 螺母没有 length，垫圈没有 thread —— 所以除
 * standard / key 外一律走索引签名，缺失参数即不存在该键。
 */
export interface DimensionRow {
	/** 该行所属执行标准 id，对应 STANDARDS[].id。 */
	standard: string;
	/** 唯一规格键，如 "din-912-M6-20"。 */
	key: string;
	/** 参数名 → 值，如 d1 / thread / length。 */
	[param: string]: string;
}

/** 参数定义（来自 param-schema.csv），描述一个产品族的尺寸表列结构。 */
export interface ParamDef {
	/** 产品类型标识，如 screw / bolt / nut / washer。 */
	type: string;
	/** 参数机器名，如 d1 / k / b。 */
	param: string;
	/** 表头显示名，如 "Ø d1"。 */
	label: string;
	/** 单位；"-" 表示无量纲。 */
	unit: string;
	/** "1" = 必填，"0" = 可选。 */
	required: '0' | '1';
	/** "1" = 参与唯一键。 */
	key: '0' | '1';
	/** 列顺序。 */
	order: string;
}

/** 执行标准。一行同时携带 DIN 与 ISO 两套编号，用于交叉对照。 */
export interface Standard {
	id: string;
	/** 展示名，如 "DIN 912"。 */
	label: string;
	/** DIN 编号，空串表示无对应。 */
	din: string;
	/** ISO 编号，空串表示无对应。 */
	iso: string;
	/** 标准标题。 */
	title: string;
	/** 该标准对应的产品类型（screw / bolt / nut / washer / stud）—— 导入模板据此推导 type。 */
	type: string;
	notes?: string;
	/**
	 * "1" = 由批量导入自动登记的标准，**待人工核对**标准号与标题。
	 *
	 * 自动登记让"清单里有、字典里没有"的标准不阻断上架；核对后应把
	 * 标准号、标题补齐并把 auto 改成 0。
	 */
	auto?: string;
}

/** 材质牌号。 */
export interface Material {
	id: string;
	name: string;
	density_g_cm3: string;
	/** 耐蚀等级 1–5。 */
	corrosion_1_5: string;
	proof_strength_mpa: string;
	tensile_mpa: string;
	max_temp_c: string;
	notes?: string;
}

/** 表面处理。 */
export interface Finish {
	id: string;
	name: string;
	spec: string;
	notes?: string;
}

/** 产品分类 —— 两层分类树的顶层（族之下没有第三层）。 */
export interface Category {
	/** kebab-case 唯一 id，同时是 URL 片段。 */
	id: string;
	name: string;
	description: string;
	/** public/ 下的分类图路径。 */
	image: string;
	/** 展示顺序。 */
	order: string;
}

/**
 * 筛选索引 —— 客户端筛选（②B）的数据契约。
 *
 * 只含**筛选维度**，不含规格矩阵：族数 × 维度值，体积与族数线性而非与 SKU 数线性。
 * 矩阵留在族页静态渲染 —— 客户端不需要它。
 *
 * 维度值**自带显示标签**（standards[].label / materials[].name）——
 * 客户端不 import 数据层，也就不会把整包 MATERIALS/STANDARDS 打进 JS bundle。
 */
export interface SearchIndexFacetValue {
	/** 维度值 id，对应 MATERIALS/STANDARDS/FINISHES 的 id。 */
	id: string;
	/** 显示名。 */
	label: string;
}

/** 索引里的一族 —— 客户端筛选的最小单位。 */
export interface SearchIndexFamily {
	family_id: string;
	name: string;
	/** 族级 SKU（如 TI-HEX-SOCKET-HEAD-CAP-SCREW）—— 卡片上直接显示，便于报号。 */
	sku: string;
	/** 所属分类 id。 */
	category: string;
	description: string;
	/** public/ 下的主图路径。 */
	image: string;
	/** 族页 URL。 */
	url: string;
	standards: SearchIndexFacetValue[];
	materials: SearchIndexFacetValue[];
	finishes: SearchIndexFacetValue[];
	/** 螺纹规格（精确值，如 "M6"）。无此维度的族为空数组。 */
	threads: string[];
	/** 长度 mm。无此维度的族为空数组。 */
	lengths: number[];
	/** 规格行数。 */
	size_count: number;
	/** draft = 不进 sitemap；published = 对外可见。页面据此决定是否 noindex。 */
	status: 'draft' | 'published';
}

/** 筛选索引整体。 */
export interface SearchIndex {
	/** 全部分类（供分类维度用）。 */
	categories: { id: string; name: string }[];
	families: SearchIndexFamily[];
}

/* ─────────────────────────────────────────────────────────────────────────
 * 视图类型 —— 与 src/components/sections/category/ 的既有契约同形。
 *
 * 复用已验收的品类页组件（CategoryCardRail / ProductGrid / ProductCard），
 * 只换数据来源：这些形状是组件的入参契约，生成器必须产出完全同形的对象，
 * 否则组件就得改 —— 那就等于重写版式。
 * ───────────────────────────────────────────────────────────────────────── */

/** 分类卡（品类页顶部横向滑轨的一卡）。 */
export interface CategoryCardView {
	title: string;
	/** 该分类下的族数（参考站这里是 "353 Products"）。 */
	products: number;
	href: string;
	image: string;
	alt: string;
}

/**
 * 产品卡（品类页右侧命中列表的一卡）。
 *
 * 2026-11-14 客户决策：**卡片只渲染「产品名 + Standard」两项** ——
 * 描述与材质属于详情页信息，列在卡片上会让一屏 15 张卡变成文字墙。
 * 因此 ProductCard.astro 只用 title + standards + image/alt/href。
 *
 * sku / description / material 仍保留在视图里：族页与询盘表单要取这些值，
 * 视图是数据超集，卡片只是不再渲染它们。
 */
export interface ProductCardView {
	/** 族级 SKU（TI-<FAMILY_ID>）—— 卡片不再渲染，族页/询盘使用。 */
	sku: string;
	/** 标准标签（"DIN 912"）—— 卡片上单独一行展示。 */
	standards: string[];
	/** 族名，卡片主标题。 */
	title: string;
	href: string;
	image: string;
	alt: string;
	/** 族描述 —— 卡片不再渲染，详情页使用。 */
	description: string;
	/** 材质 / 表面 —— 卡片不再渲染，详情页使用。 */
	material: string;
	/** draft = 不进 sitemap；published = 对外可见。 */
	status: 'draft' | 'published';
	/** 筛选用维度值（group id → 该族在该维度的全部取值）。 */
	filters: Record<string, string[]>;
}

/** 左侧筛选栏的一组（参考站是折叠手风琴）。 */
export interface FilterGroupView {
	/** 维度 id（同时是 URL 参数名）。 */
	id: string;
	label: string;
	/** 该维度的可选值。 */
	options: { id: string; label: string }[];
}

/** 一个分类页的全部视图数据。 */
export interface CategoryView {
	id: string;
	heading: string;
	description: string;
	image: string;
	breadcrumb: { label: string; href: string }[];
	/** 该分类下的族数。 */
	productCount: number;
	/** 该分类下展示的族卡（有 published 时只列 published）。 */
	products: ProductCardView[];
	/** 该分类下是否有 published 族 —— 没有则整页 noindex。 */
	hasPublished: boolean;
}

/**
 * 素材条目 —— 由 public/ 下的文件扫描而来（scripts/gen-products.mjs）。
 *
 * 文件名约定：`<SKU>-<原名>.<ext>`。前缀必须匹配某个 SKU，
 * 否则就是没人认领的孤儿素材（闸门 E030）。
 */
export interface AssetEntry {
	/** 文件名里的 SKU 段。 */
	code: string;
	/** 两位序号 = 展示顺序（01 是主图）。 */
	seq: number;
	role: 'image' | 'cad' | 'pdf';
	/** public/ 下的路径，带前导斜杠。 */
	url: string;
	/** 该素材归属的产品族。 */
	family_id: string;
	/** 客户原文件名（SKU 之后的那一段）—— 追溯「这张图从哪来」。 */
	original?: string;
}

/** 产品族 —— 页面的 SEO 主体。 */
export interface Family {
	/** kebab-case 唯一 id，同时是 URL 片段。 */
	family_id: string;
	name: string;
	/**
	 * 产品类型，决定矩阵的列结构。
	 *
	 * **显式** —— 来自 families.csv 的 type 列（screw / bolt / nut / washer / stud …）。
	 * 不再由 standards[0] 派生：产品可以没有标准，也可以挂多个标准而类型不变 ——
	 * 标准只是规格矩阵的一个维度，不是产品类型的来源。
	 */
	type: string;
	/** 所属分类 id，对应 CATEGORIES[].id。 */
	category: string;
	/** 关联标准 id，" | " 分隔；多个即多规格交叉。 */
	standards: string;
	/** 可选材质 id，" | " 分隔。 */
	materials: string;
	/** 可选表面处理 id，" | " 分隔。 */
	finishes: string;
	description: string;
	/** public/ 下的主图路径 —— 由素材登记簿按 <SKU>-<原名>.<ext> 约定推导，不是 CSV 字段。 */
	image: string;
	/** public/ 下的 CAD 路径，同上。可空。 */
	cad: string;
	/** public/ 下的规格书 PDF 路径，同上。可空。 */
	pdf: string;
	/**
	 * SKU —— 产品的唯一管理凭据。
	 *
	 * 规范：SKU = `TI-` + family_id 大写（如 `TI-HEX-SOCKET-HEAD-CAP-SCREW`）。
	 * · 唯一：family_id 唯一即 SKU 唯一，闸门 E029 兜底
	 * · 稳定：不含名称，产品改名不影响 SKU
	 * · 素材绑定：图片/CAD/PDF 的文件名以 SKU 开头，映射零歧义
	 */
	sku: string;
	/** SEO title —— **派生**（name + 标准名），不落 CSV。 */
	seo_title: string;
	/** SEO description —— **派生**（description），不落 CSV。 */
	seo_description: string;
	/**
	 * 管理字段 —— 来自 management.csv（与产品表分开管理）。
	 * 客户尚未交付真实商务数据时为空串，页面据此不渲染 Ordering information 区块。
	 */
	/** 最小起订量，如 "100 pcs"。 */
	moq: string;
	/** 包装方式，如 "box of 100 pcs"。 */
	packaging: string;
	/** 交期，如 "15 working days"。 */
	lead_time: string;
	/** 起步价（数字字符串，空 = 未提供）。 */
	price_from: string;
	/** 最高价（数字字符串，空 = 未提供）。 */
	price_to: string;
	/** 币种，如 "EUR"。 */
	price_currency: string;
	/** 价格单位，如 "pcs"。 */
	price_unit: string;
	/** draft = 不进 sitemap、不进导航；published = 对外可见。 */
	status: 'draft' | 'published';
}

/**
 * 派生 SKU（不落盘，由 skuRows() 计算）。
 *
 * KEY SEMANTICS —— 重要：`key` 是**族内规格标识**（standard + key 参数），
 * 不是全局唯一的 SKU 号。同一族下不同材质/表面处理的 SKU **共用同一个 key**，
 * 这与参考站的编号体系一致：`BN 272` 是一个族级编号，覆盖该族全部
 * (尺寸 × 材质 × 表面) 变体。
 *
 * 询价单/报价单要定位唯一可订购件时，用三元组：
 *   (family_id, key, material, finish)
 * 若要一个唯一的产品编号，用族级 SKU（Family.sku）。
 */
export interface SkuRow {
	family_id: string;
	/** 族级 SKU（如 TI-HEX-SOCKET-HEAD-CAP-SCREW）—— 报号用这个。 */
	sku: string;
	material: string;
	finish: string;
	standard: string;
	/** 螺纹规格，如 "M6"。该类型无螺纹维度时为空串。 */
	thread: string;
	/** 长度 mm，如 "20"。该类型无长度维度时为空串（螺母/垫圈）。 */
	length: string;
	/** 族内规格标识。不同材质/表面共用同一 key（见上方说明）。 */
	key: string;
	/** 该 SKU 的全部参数值（继承自矩阵行，扁平）。 */
	values: Record<string, string>;
}
