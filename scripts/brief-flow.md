# 任务书 B3 · 08F 流量波动专项

## 环境事实（必读）
- 你没有可用的 shell：bash 与 PowerShell 都无法执行。不要尝试运行 `node` 或任何命令。
- 你的工具只有 read / write / edit。
- 项目根：`C:/Users/teesm/Desktop/PI 竞品维度分析`
- 需求目录：`C:/Users/teesm/Desktop/竞品维度追踪分析`

## 必读顺序
1. `C:/Users/teesm/Desktop/PI 竞品维度分析/index.html`
2. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/core.js`（只读，API 来源）
3. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/agents/06-opportunity.js`（写法范式）
4. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/agents/01-market.js`（图表范式）
5. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/css/theme.css`（只读，class 与 `:root` 变量）
6. `C:/Users/teesm/Desktop/竞品维度追踪分析/竞品流量波动分析.txt`（**必读全文，判定阈值必须一字不差落地**）

## 输出文件（只准写这一个）
`C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/agents/08f-flow.js`
ROUTE_ID = `flow`　TITLE = `流量波动专项`

## 硬约束
- **C1** 只创建/覆写上面这一个文件。绝不修改 `index.html`、`core.js`、`data.js`、`theme.css` 或任何其它板块文件。
- **C2** 骨架：顶层 IIFE，内部 `const CX=window.CX, F=CX.fmt, C=CX.charts, U=CX.ui, D=CX.data;`，`function render(){...}`，结尾 `CX.register('flow',{title:'流量波动专项',render:render});`
- **C3** 只用 core.js 已有 API，不新增图表类型；需要新图形时用手写内联 SVG 或 CSS grid 三态色阶。
- **C4** 不写 `style` 标签、不新增全局 class；微调行内 `style`，颜色只用 `:root` 已定义变量。
- **C5** 严禁改 data.js；数据写成本文件常量。全站口径一致：对标 ASIN `B0C9K2M4P1`、退货率 12.8%、CPC 1.28、机会分 78、快照 2026-04-18 09:30、窗口 2026-01-25 → 2026-04-18（12 周）。
- **C6** 写完 read 通读自查：字符串闭合、括号配对、IIFE 完整、无 undefined 变量、代码内无全角引号。
- **C7** 目标 450–850 行。

## 判定逻辑（必须与需求文档完全一致）
- 自然排名进阶（3 条）：进 x 天增加 ≥3 天；平均排名从 >24 进入 ≤24；平均排名从 >5 进入 ≤5。
- 主推词定义（4 条）：SP 进 x 天增加 ≥3 天；SB 获得 x 天增加 ≥3 天；SP 平均排名从 >24 进入 ≤24；SP 平均排名从 >5 进入 ≤5。
- 投放力度：预算档 = 广告流量进 x 天（≥5 高 / 3–4 中 / 1–2 低）；竞价档 = 平均排名（1–12 高 / 13–24 中 / 25–48 低）。
- 输出时每条判定都要显示「命中的是哪一条阈值」，不能只给结论。

## 必须实现的 UI 区块
1. **周期切换**：近 4 周 / 近 8 周（写 `CX.state.flowRange`，默认 8），切换后所有图表与判定联动。
2. **流量波动分析**：整体流量、广告流量、自然流量三条线增减 + 广告:自然比例变化；先给趋势，再给周环比表。
3. **广告干预及效果**：按周推断运营收放动作（加投 / 减投 / 关停 / 新开），给推断依据与效果评分。
4. **关键词变化**：当周主推词（按四条定义）、主推词数量增减、主导流量词对比上周增减。
5. **投放力度**：预算档与竞价档，标出加投、减投、新开、关停的词。
6. **投放效果**：当周主推词在后续 2 周是否带来自然排名进阶，做成「主推词 × 周」判定矩阵，命中/未命中两态。

## 视觉与图表
深色科技风：等宽 eyebrow（`MODULE 08F / TRAFFIC VOLATILITY`）、KPI 卡、`table-wrap`、panel idx、callout、tag/chip。多线趋势用 `C.line`，判定矩阵用 CSS grid 三态色阶，词表用 `table-wrap`。

## 交付回报
文件绝对路径、总行数、面板清单（panel idx 与标题）、read 自检结论。不要贴大段代码。
