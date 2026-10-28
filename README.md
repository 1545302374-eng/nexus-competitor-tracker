# NEXUS · 竞品维度追踪台（静态原型）

亚马逊竞品维度追踪分析系统的前端静态原型。深色科技风，纯静态：无构建、无框架、无外链、无后端。

数据为 **DEMO DATA**（合成样本，快照 2026-04-18 09:30），用于验证信息架构与交互，不代表真实抓数结果。

---

## 1. 目录结构

```
index.html                     入口（11 个路由的 hash 路由壳）
assets/css/theme.css           全站样式（含 3 档响应式 + @media print）
assets/js/data.js              全站口径与 18 个竞品产品池
assets/js/core.js              核心：CX.register / UI 原子 / 图表 / 路由 / 配置抽屉
assets/js/live-reload.js       热更新客户端（file:// 下自动跳过）
assets/js/agents/00-overview.js   00 决策总览
assets/js/agents/01-market.js     01 市场分析 + 1.1 产品池
assets/js/agents/02-params.js     02 参数项分析
assets/js/agents/03-voc.js        03 用户画像 / VOC
assets/js/agents/04-profit.js     04 利润模型（滑块实时重算）
assets/js/agents/05-compliance.js 05 安全合规
assets/js/agents/06-opportunity.js 06 市场机会
assets/js/agents/07-listing.js    07 Listing 框架（可切对标 ASIN）
assets/js/agents/08-promotion.js  08 推广策略（SIF 广告架构推测）
assets/js/agents/08f-flow.js      08F 流量波动专项（4/8 周切换）
assets/js/agents/09-report.js     R 决策报告（含 R-09 需求覆盖矩阵）
scripts/dev-server.js          零依赖静态服务 + SSE 热更新
scripts/smoke-test.js          渲染冒烟测试（11 模块 / DOM 配对 / NaN / undefined）
scripts/qa-audit.js            交互钩子 / CSS 变量 / 跳转目标审计
scripts/build-sections.workflow.js  scripts/review-sections.workflow.js
scripts/brief-*.md             四个板块的任务书（可复用）
scripts/div-audit.js  scripts/depth-audit.js  早期缺陷定位脚本
docs/requirements/             三份需求原文（竞品维度分析需求 / SIF 推测方式 / 流量波动）
.qa/                           验收证据：各断点截图、report.pdf、溢出探针
start-preview.cmd              Windows 一键启动预览（双击即可）
```

---

## 2. 如何预览

### 方式 A：直接打开（最快，无热更新）
双击 `index.html`。`file://` 下全部功能可用，仅热更新自动禁用。

### 方式 B：本地服务 + 热更新（推荐）
需要 Node.js（任意 18+ 版本）。

```bash
node scripts/dev-server.js
```

打开 <http://127.0.0.1:8770/>。改 `assets/js/agents/*.js`、`assets/css/theme.css`、`index.html` 保存后，页面约 150ms 自动刷新。

Windows 也可直接双击 `start-preview.cmd`。端口被占用时可用 `set PORT=8780 && node scripts/dev-server.js`。

---

## 3. 路由

| 地址 | 板块 |
|---|---|
| `/#/overview` | 00 决策总览（十板块矩阵 + Agent 编排） |
| `/#/market` | 01 市场分析（7 表单逐项 + 产品池） |
| `/#/params` | 02 参数项分析 |
| `/#/voc` | 03 用户画像 / VOC |
| `/#/profit` | 04 利润模型 |
| `/#/compliance` | 05 安全合规 |
| `/#/opportunity` | 06 市场机会 |
| `/#/listing` | 07 Listing 框架 |
| `/#/promotion` | 08 推广策略 |
| `/#/flow` | 08F 流量波动专项 |
| `/#/report` | R 决策报告（R-09 覆盖矩阵） |

---

## 4. 关键业务口径

- 输入：1–5 个 ASIN + 选品想法；07/08/08F 使用独立的对标 ASIN（可手填或从输入里勾选）
- 无推广毛利 **不扣优惠券**；08 的券后价仅用于观测竞品动作，**不参与 01 / 06 结论**
- 广告推测粒度：ASIN 级 → 广告活动 → 广告组 → 每组可能的关键词与匹配方式
- 全站一致数值：均价 $39.99、毛利 34.3%、退货 12.8%、CPC $1.28、机会分 78、产品池 18/30
- 08/08F 的 SIF 样本仅覆盖 `B0C9K2M4P1`；切到其它对标 ASIN 时页面会显式声明「口径演示」

---

## 5. 自检命令

```bash
node scripts/smoke-test.js   # 11 个模块渲染 / div 配对 / NaN / undefined
node scripts/qa-audit.js     # 事件钩子 id / CSS 变量 / data-go 目标 / 重复 id
node --check assets/js/core.js   # 单文件语法检查
```

两个脚本均以 `RESULT: PASS / FAIL` 结尾，可直接接入 CI。

---

## 6. 已知限制

1. **无后端、无实时抓数**：数据写在前端常量里，接入 SellerSprite / SIF / 1688 需要另做接口层
2. **390px 下图表横向滚动**：`.chart` 保持 520px 最小宽 + 横向滚动，未做移动端简图
3. **打印**：`@media print` 已转白底、隐藏导航、避免面板跨页断裂；但 Chromium 不支持 CSS 页码，页码需在打印对话框勾选「页眉页脚」
4. **PDF 证据**：`.qa/report.pdf` 为 12 页 Letter 输出，未做像素级视觉复核
5. **覆盖矩阵**：R-09 的 32 条为「页面存在具名面板且可回溯」，不等于「已接真实数据源」

---

## 7. 需求覆盖

`/#/report` 页的 **R-09 需求覆盖矩阵**逐条列出 32 项（A 输入与结论 4 / B 01–06 核心 8 / C 07–08 与补充说明 10 / D SIF 判据 4 / E 流量波动 6），每条标注落地模块与具名面板。

---

## 8. 版本

- 原型版本 v0.9 · 快照 2026-04-18 09:30
- 环境：Windows + Node 18+；浏览器需支持 `:has()`（Chrome/Edge 105+）
