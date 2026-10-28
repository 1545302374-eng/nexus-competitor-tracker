# 任务书 B1 · 07 Listing 框架

## 环境事实（必读）
- 你没有可用的 shell：bash 与 PowerShell 都无法执行。不要尝试运行 `node`、`node --check` 或任何命令，也不要报告「命令执行失败」。
- 你的工具只有 read / write / edit。
- 项目根：`C:/Users/teesm/Desktop/PI 竞品维度分析`
- 需求文件：`C:/Users/teesm/Desktop/竞品维度追踪分析/竞品维度分析需求.txt`

## 必读顺序
1. `C:/Users/teesm/Desktop/PI 竞品维度分析/index.html` —— 导航与 hash 路由
2. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/core.js` —— 只读：`CX.register` / `CX.ui` / `CX.charts` / `CX.fmt` / `CX.state` / `CX.go` / `CX.openDrawer` / `CX.toast`
3. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/agents/06-opportunity.js` —— 只读：本项目模块写法范式
4. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/agents/01-market.js` —— 只读：图表与表格范式
5. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/css/theme.css` —— 只读：只复用已有 class 与 `:root` 变量
6. `C:/Users/teesm/Desktop/竞品维度追踪分析/竞品维度分析需求.txt` —— 必读全文（重点第 7 节 + 补充说明①）

## 输出文件（只准写这一个）
`C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/agents/07-listing.js`
ROUTE_ID = `listing`　TITLE = `Listing 框架`

## 硬约束
- **C1** 只创建/覆写上面这一个文件。绝不修改 `index.html`、`core.js`、`data.js`、`theme.css` 或任何其它板块文件（父级统一接线）。
- **C2** 骨架：顶层一个 IIFE，内部 `const CX=window.CX, F=CX.fmt, C=CX.charts, U=CX.ui, D=CX.data;`，定义 `function render(){ return <HTML 字符串>; }`，结尾 `CX.register('listing',{title:'Listing 框架',render:render});`
- **C3** 只用 core.js 已存在的 API，不新增图表类型；需要新图形时手写内联 SVG 字符串或 CSS grid 色阶。
- **C4** 不写 `style` 标签、不新增全局 class；微调一律行内 `style`，颜色只用 theme.css `:root` 已定义变量（如 `style="color:var(--cyan)"`，变量名以 `:root` 实际定义为准）。
- **C5** 严禁修改 data.js；本板块数据写成本文件内常量。展示数值必须与全站一致：均价 39.99、价格带 37.99–39.99、对标 ASIN `B0C9K2M4P1`（HENLEY&CO）、无推广毛利 34.3%、退货率 12.8%、CPC 1.28、机会分 78、快照 2026-04-18 09:30、窗口 2026-01-25 → 2026-04-18（12 周）、产品池 18 个竞品。
- **C6** 写完必须 read 通读自己产出的完整文件，逐段确认：字符串拼接闭合、括号配对、IIFE 首尾完整、无 undefined 变量、代码内无中文全角引号。发现问题立刻 edit 修正。
- **C7** 目标 400–800 行。

## 必须实现的 UI 区块
1. **对标 ASIN 选择器**（补充说明①）：手动粘贴 ASIN 输入框 + 从输入池 3 个 ASIN（`B0D2H8YQ7K` / `B0D4K1M2P9` / `B0D5N7R3T6`）勾选 + 默认对标 `B0C9K2M4P1`；当前对标存 `CX.state.listingBench`，切换时页面内容联动（为 2–3 个对标对象准备差异化数据并条件渲染）。
2. **变体主推数量**：30 SKU 结构（颜色 × 尺码矩阵），在售 / 主推 / 断码三态，CSS grid 色阶热力矩阵，明确标出主推 6 个。
3. **标题拆解**：原文 → 分段结构（品牌词 / 核心词 / 属性词 / 场景词 / 规格词）→ 埋词命中表（词、月搜索量、是否命中、出现位置）→ 长度与可读性评分。
4. **五点拆解**：逐条 → 结构标签（痛点开场 / 功能证据 / 参数场景 / 信任背书 / 行动召唤）→ 埋词命中 → 内容特点（含数字、尺寸参照、洗护说明）。
5. **A+ 拆解**：模块序列（品牌横幅 / 对比表 / 尺寸指南 / 场景四宫格 / 图文卖点等，标注顺序）+ 风格（摄影 / 插画 / 信息图占比）+ 元素清单 + 「为什么这样排」的判断依据。
6. **埋词覆盖率与缺口**：整体覆盖率（示例 9/12）、缺失词建议、可直接复用的「标题模板 + 五点模板」（带 `data-copy` 复制按钮，core.js 已全局处理 `[data-copy]`）。

## 视觉与图表
深色科技风：等宽 eyebrow（`MODULE 07 / LISTING TEARDOWN`）、KPI 卡、`table-wrap` 表格、panel idx 编号、callout、tag/chip 徽标。首屏必须回答「所以呢」：一句 h1 结论 + 3–5 个证据 tag。埋词命中用 `U.meter` 或 `C.hbar`；变体矩阵用 CSS grid 色阶；A+ 序列用编号时间轴。

## 交付回报（输出到对话）
文件绝对路径、总行数、面板清单（每个 panel 的 idx 与标题）、read 自检结论（具体确认了哪几点）。不要贴大段代码。
