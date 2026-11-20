# BOZE TITANIUM FASTENER — CLINE & LLM STRICT EXECUTION RULES

You are working on the official B2B website for **Boze Metal (BOZE Titanium Fastener)**, built with **Astro**. You MUST strictly obey all rules below in every task. Violating any rule is considered a critical failure.

---

## 1. ARCHITECTURE & LINK SAFETY (ZERO HALLUCINATION)
1. **Never Fabricate URLs or Paths**:
   - You are strictly forbidden from inventing, guessing, or modifying internal route paths (`href`), component paths, or image paths (`src`) without first verifying their existence in the codebase.
   - Never expose raw route strings (e.g., `/products/`, `/contact/`) inside customer-facing body copy; always use natural B2B anchor text.
2. **Protect Global Architecture**:
   - Never modify `src/styles/global.css`, `BaseLayout.astro`, `SiteHeader.astro`, `SiteFooter.astro`, or global navigation files unless explicitly instructed to fix a global bug.
   - All page-level visual adjustments must be scoped to local section components.
3. **Mode Discipline**:
   - If the user instructs you to execute directly in **Act Mode** on specified files, DO NOT perform broad repository exploration or lengthy planning—read only the target files, apply edits, and run `npm run build` to verify.

---

## 2. B2B INDUSTRIAL UI & IMAGE-TEXT LAYOUT RULES (ANTI-UGLINESS)
Because LLMs cannot visually see rendered pixels while coding, you MUST enforce these strict geometric and word-count budgets to prevent stretched images, giant white gaps, and text walls:

1. **Lock Image Aspect Ratios (No Stretched/Skinny Images)**:
   - Every image container in a split Hero or Feature section MUST enforce a fixed landscape aspect ratio (`aspect-[4/3]` or `aspect-[16/10]`) with `w-full h-full object-cover` and `items-center` vertical alignment on desktop.
   - NEVER allow an image container's height to stretch dynamically with adjacent text paragraphs.
2. **Strict Single-Image Rule per Split Band (No Vertical Image Stacking)**:
   - In any two-column image-text band, render **ONLY ONE primary image** in the media column.
   - NEVER stack two images vertically to "fill height" next to long text. If the text column is taller than a `4:3` image, **cut the text**, never add a second image.
3. **Hard Copywriting Word-Count Budgets (Prevent Text Walls)**:
   - **Hero Section**: 1 concise lead paragraph (**strictly ≤ 40 words**, max 3–4 lines) + up to 3 compact spec badges + 2 CTA buttons.
   - **Image-Text Feature Band**: 1 concise lead paragraph (**strictly ≤ 40 words**) + **3 single-line bold-lead bullet points** (≤ 12 words per bullet) + CTA button(s).
   - **Never output raw prompt scaffolding**: Never print meta-phrases like *"This page covers..."*, *"This section outlines..."*, or raw *"Who / How / Why"* labels as customer-facing headings.
4. **Where Images Belong vs. Where Grids/Tables Belong**:
   - **Use Large `4:3` Photos ONLY for Physical Proof**: Hero product/workshop showcase, CNC machining / custom parts, surface finishes (anodizing / PVD / DLC), and quality inspection equipment (XRF/PMI).
   - **NEVER Use Large Photos for Abstract Lists**: Standard grade matrices, DIN/ISO cross-references, certification lists, and multi-step workflows MUST use compact full-width multi-column grids (`grid-cols-3` or `grid-cols-4`) or clean specification tables.
   - **Sub-Cards Placement**: Never nest multi-column sub-cards inside a narrow 50% text column. Place sub-cards in a full-width (`100%`) horizontal row below the split image-text block.

---

## 3. DOMAIN POSITIONING & CONTENT RED LINES (TITANIUM B2B)
1. **Source Factory Identity (Zero Trader/Distributor Clichés)**:
   - Our identity is a **verifiable titanium fastener manufacturing factory + an efficient digital front door** (the Bossard of pure titanium fasteners).
   - NEVER use multi-vendor broker language (e.g., *"matching you with our global network of suppliers"*). Never leave residual reference-site brand names (e.g., `Bossard`, `SPAX`).
2. **Dual-Channel Conversion Priority**:
   - **Primary Channel (Distributors)**: Need fast spec lookup (`DIN / ISO / ASTM F467 & F468`, `M1.6–M36`, `CP Grade 2`, `Grade 5 Ti-6Al-4V`), stock availability, anti-mixing lot packaging, and bulk RFQ.
   - **Secondary Channel (OEM Engineers & Buyers)**: Need verifiable compliance (`EN 10204 3.1 MTC`, `100% PMI/XRF`), NDA-protected print-to-part CNC machining, and titanium-specific anti-galling finishes (`AMS 2700 / ASTM F86` passivation, `AMS 2488 Type II/III` anodizing, DLC/dry-film).
3. **Zero Fluff & Zero Fabricated Test Data**:
   - **No Generic Titanium Trivia**: Never write elementary educational filler (*"What is titanium?"*, *"Why titanium resists rust"*).
   - **No Fabricated Lab Metrics**: Never invent unverified torque K-factors, friction coefficients, or galling test numbers.
4. **Natural E-E-A-T & Transparency**:
   - Ground technical claims in real shop-floor execution, heat-number traceability, and direct QA verification without using robotic SEO template headings.
