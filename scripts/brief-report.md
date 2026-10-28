# 任务书 B4 · R 决策报告

## 环境事实（必读）
- 你没有可用的 shell：bash 与 PowerShell 都无法执行。不要尝试运行 `node` 或任何命令。
- 你的工具只有 read / write / edit。
- 项目根：`C:/Users/teesm/Desktop/PI 竞品维度分析`
- 需求目录：`C:/Users/teesm/Desktop/竞品维度追踪分析`

## 必读顺序
1. `C:/Users/teesm/Desktop/PI 竞品维度分析/index.html`
2. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/core.js`（只读，API 来源）
3. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/agents/00-overview.js` 与 `06-opportunity.js`（写法范式）
4. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/data.js`（全站口径与产品池，只读）
5. `C:/Users/teesm/Desktop/PI 竞品维度分析/assets/css/theme.css`（只读，class 与 `:root` 变量）
6. `C:/Users/teesm/Desktop/竞品维度追踪分析/竞品维度分析需求.txt`（特别是顶部「可实施性结论」要求）

## 输出文件（只准写这一个）
`C:/Users/teesm/Desktop/PI 竞品维度分析/assets/js/agents/09-report.js`
ROUTE_ID = `report`　TITLE = `决策报告`

## 硬约束
- **C1** 只创建/覆写上面这一个文件。绝不修改 `index.html`、`core.js`、`data.js`、`theme.css` 或任何其它板块文件。
- **C2** 骨架：顶层 IIFE，内部 `const CX=window.CX, F=CX.fmt, C=CX.charts, U=CX.ui, D=CX.data;`，`function render(){...}`，结尾 `CX.register('report',{title:'决策报告',render:render});`
- **C3** 只用 core.js 已有 API，不新增图表类型。
- **C4** 不写 `style` 标签、不新增全局 class；微调行内 `style`，颜色只用 `:root` 已定义变量。
- **C5** 严禁改 data.js；数据写成本文件常量。全站口径一致：均价 39.99、无推广毛利 34.3%、退货率 12.8%、CPC 1.28、机会分 78、产品池 18、对标 `B0C9K2M4P1`、快照 2026-04-18 09:30。
- **C6** 写完 read 通读自查：字符串闭合、括号配对、IIFE 完整、无 undefined 变量、代码内无全角引号。
- **C7** 目标 400–750 行。

## 必须实现的 UI 区块
1. **顶部可实施性结论卡**：结论（可实施 / 不可实施 + 风险性）+ 理由 3–5 条（大盘、供给错位、毛利、合规、专利）+ 建议首单 600 套与售价 $39.99。
2. **十板块证据表**：01 市场 / 02 参数 / 03 VOC / 04 利润 / 05 合规 / 06 机会 / 07 Listing / 08 推广 / 08F 流量 / R 报告；每行给关键结论、关键数字、置信度、可回溯来源（SELLERSPRITE / SIF / 1688 / VOC 12,480）。
3. **决策摘要四组结论**（市场 / 产品 / 利润 / 执行）+ **风险与前置条件**（Go-No-Go 门槛）。
4. **90 天执行路线**：里程碑时间轴 + 每阶段门槛指标。
5. **数据源与口径声明**：静态原型、DEMO DATA、快照时间、券口径说明（板块 1/6 不含券）。
6. **导出**：一个「打印 / 导出 PDF」按钮，用属性写法 `onclick="window.print()"`（不要注入 script 标签），并加打印友好提示。

## 视觉
与总览页同风格：等宽 eyebrow（`MODULE R / DECISION REPORT`）、KPI 卡、`table-wrap`、panel idx、callout、tag/chip。首屏一句 h1 结论 + 结论 tag 组。

## 交付回报
文件绝对路径、总行数、面板清单（panel idx 与标题）、read 自检结论。不要贴大段代码。
