# 任务书 B2 · 08 推广策略

## 环境事实（必读）
- 你没有可用的 shell：bash 与 PowerShell 都无法执行。不要尝试运行 `node`、`node --check` 或任何命令。
- 你的工具只有 read / write / edit。
- 项目根：`C:/Users/teesm/Desktop/PI 竞品维度分析`
- 需求目录：`C:/Users/teesm/Desktop/竞品维度追踪分析`

## 必读顺序
1. `C:/Users/teesm/Desktop/PI 竞品维度分析/index.html`
2. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/core.js`（只读，API 来源）
3. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/agents/06-opportunity.js`（写法范式）
4. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/agents/01-market.js`（图表范式）
5. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/css/theme.css`（只读，class 与 `:root` 变量）
6. `C:/Users/teesm/Desktop/竞品维度追踪分析/竞品维度分析需求.txt`（第 8 节 + 补充说明②③）
7. `C:/Users/teesm/Desktop/竞品维度追踪分析/SIF竞品广告投放策略推测方式.txt`（**核心判定依据，必读全文**）

## 输出文件（只准写这一个）
`C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/agents/08-promotion.js`
ROUTE_ID = `promotion`　TITLE = `推广策略`

## 硬约束
- **C1** 只创建/覆写上面这一个文件。绝不修改 `index.html`、`core.js`、`data.js`、`theme.css` 或任何其它板块文件。
- **C2** 骨架：顶层 IIFE，内部 `const CX=window.CX, F=CX.fmt, C=CX.charts, U=CX.ui, D=CX.data;`，`function render(){...}`，结尾 `CX.register('promotion',{title:'推广策略',render:render});`
- **C3** 只用 core.js 已有 API，不新增图表类型；需要新图形时手写内联 SVG 或 CSS grid。
- **C4** 不写 `style` 标签、不新增全局 class；微调行内 `style`，颜色只用 `:root` 已定义变量。
- **C5** 严禁改 data.js；数据写成本文件常量。全站口径一致：均价 39.99、价格带 37.99–39.99、对标 ASIN `B0C9K2M4P1`、无推广毛利 34.3%、退货率 12.8%、CPC 1.28、机会分 78、快照 2026-04-18 09:30、窗口 2026-01-25 → 2026-04-18（12 周）。
- **C6** 写完 read 通读自查：字符串闭合、括号配对、IIFE 完整、无 undefined 变量、代码内无全角引号。
- **C7** 目标 450–900 行。

## 必须实现的 UI 区块
1. **顶部口径声明**（补充说明②）：如实分析竞品用券情况，并明确标注「此板块的价格与券只用于观测竞品动作，不参与板块 1/6 的任何结论」。
2. **前三个月推广节奏**：W1–W13 按周的价格策略、BSR 排名变化、评分与评论数变化、券与 Deal 动作；用 `C.line` / `C.comboBars` + 事件标注时间轴。
3. **SIF 运营时光机 · 流量变化**：自然流量 vs 广告流量曲线、周环比、关键拐点与对应动作。
4. **SIF 查广告架构 · 广告架构拆解**：5 个活动 / 11 个广告组结构树（活动 → 广告组 → 推测关键词与匹配方式），ASIN 级粒度，不承诺广告组以下的不可知信息（补充说明③）。
5. **匹配方式推测引擎**：把 SIF 文档 4 条判据做成「判据 → 观测值 → 结论」判定表（关键词数量、数量稳定性、词根分散/集中、搜索量层级），每个广告组给出：关键词数、词根、推测匹配方式（自动-紧密 / 自动-宽泛 / 商品投放 / 精准 / 词组 / 广泛）、置信度、命中的判据编号。
6. **可复用投放结论**：竞品词库分层（大词 / 词根词 / 长尾）、预算与竞价档位、我方对标攻击位建议。

## 视觉与图表
深色科技风：等宽 eyebrow（`MODULE 08 / PROMOTION & AD STRUCTURE`）、KPI 卡、`table-wrap`、panel idx、callout、tag/chip。首屏一句 h1 结论 + 3–5 个证据 tag。双线流量用 `C.line` 或 `C.comboBars`；广告架构用嵌套卡片 + 表格；判据命中用徽标。

## 交付回报
文件绝对路径、总行数、面板清单（panel idx 与标题）、read 自检结论。不要贴大段代码。
