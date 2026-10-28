/* Workflow A: 4 个缺失板块并行实现（前台 in-process 运行；子 agent 无 shell） */
const ROOT = 'C:/Users/teesm/Desktop/PI 竞品维度分析';
const REQ  = 'C:/Users/teesm/Desktop/竞品维度追踪分析';

const common = [
  `【项目】${ROOT} —— 亚马逊竞品维度追踪分析台「NEXUS 竞域」静态前端原型（深色科技风、纯静态、无构建、无框架、无外链）。`,
  '【环境事实 · 必读】你没有可用的 shell：bash 与 PowerShell 都无法执行。不要尝试运行 node、node --check 或任何命令，也不要报告「命令执行失败」。你的工具只有 read / write / edit。',
  '【必读，按顺序】',
  `1) ${ROOT}/index.html —— 导航与 hash 路由结构`,
  `2) ${ROOT}/assets/js/core.js —— 只读：CX.register / CX.ui / CX.charts / CX.fmt / CX.state / CX.go / CX.openDrawer / CX.toast`,
  `3) ${ROOT}/assets/js/agents/06-opportunity.js —— 只读：本项目模块写法范式`,
  `4) ${ROOT}/assets/js/agents/01-market.js —— 只读：图表与表格范式`,
  `5) ${ROOT}/assets/css/theme.css —— 只读：只复用已有 class 与 :root 变量，变量名以实际定义为准`,
  `6) ${REQ}/竞品维度分析需求.txt —— 必读全文`,
  '【共享契约 · 违规即作废】',
  'C1 只创建/覆写你被分配的那一个文件。绝不修改 index.html、core.js、data.js、theme.css 或任何其它板块文件（父级统一接线）。',
  'C2 文件骨架：顶层一个 IIFE，内部 const CX=window.CX, F=CX.fmt, C=CX.charts, U=CX.ui, D=CX.data; 定义 function render(){ return <HTML 字符串>; } 结尾 CX.register(<ROUTE_ID>,{title:<TITLE>,render:render});',
  'C3 只用 core.js 已存在的 API，不新增图表类型；需要新图形时手写内联 SVG 字符串或 CSS grid 色阶。',
  'C4 不写 style 标签、不新增全局 class；必须的微调一律行内 style，颜色只用 theme.css :root 已定义的变量（行内写 style="color:var(--xxx)" 形式）。',
  'C5 严禁修改 data.js：本板块数据全部写成本文件内常量。展示数值必须与全站口径一致：均价 39.99 美元、价格带 37.99-39.99、对标 ASIN B0C9K2M4P1（HENLEY&CO）、无推广毛利 34.3%、退货率 12.8%、CPC 1.28、机会分 78、快照 2026-04-18 09:30、窗口 2026-01-25 到 2026-04-18（12 周）、产品池 18 个竞品。',
  'C6 写完后必须用 read 通读你自己写出的完整文件，逐段确认：字符串拼接闭合、括号配对、IIFE 首尾完整、无 undefined 变量、无中文全角引号混入代码。发现问题立即用 edit 修正。',
  'C7 单文件行数目标 400-800 行；不足说明分析深度不够，过多说明冗余。',
  'C8 最终输出必须包含：文件绝对路径、总行数、面板清单（每个 panel 的 idx 与标题）、read 自检结论（具体确认了哪几点）。不要贴大段代码。',
  '【视觉】深色科技风：等宽 eyebrow（例 MODULE 07 / LISTING TEARDOWN）、KPI 卡、table-wrap 表格、panel idx 编号、callout、tag/chip 徽标。首屏必须回答「所以呢」：一句 h1 结论 + 3-5 个证据 tag。信息密度高但层级清晰。'
].join('\n');

const listing = [
  `【你的文件】${ROOT}/assets/js/agents/07-listing.js ｜ ROUTE_ID = listing ｜ TITLE = Listing 框架`,
  `【需求来源】${REQ}/竞品维度分析需求.txt 第 7 节 + 补充说明①`,
  '【必须实现的 UI 区块】',
  '1) 对标 ASIN 选择器（补充说明①）：手动粘贴 ASIN 输入框 + 从输入池 3 个 ASIN（B0D2H8YQ7K / B0D4K1M2P9 / B0D5N7R3T6）勾选 + 默认对标 B0C9K2M4P1；当前对标存 CX.state.listingBench，切换时页面内容联动（为 2-3 个对标对象准备差异化数据并条件渲染）。',
  '2) 变体主推数量：30 SKU 结构（颜色 x 尺码矩阵），在售 / 主推 / 断码三态，用 CSS grid 色阶热力矩阵，明确标出主推 6 个。',
  '3) 标题拆解：原文 → 分段结构（品牌词 / 核心词 / 属性词 / 场景词 / 规格词）→ 埋词命中表（词、月搜索量、是否命中、出现位置）→ 长度与可读性评分。',
  '4) 五点拆解：逐条 → 结构标签（痛点开场 / 功能证据 / 参数场景 / 信任背书 / 行动召唤）→ 埋词命中 → 内容特点（是否含数字、尺寸参照、洗护说明）。',
  '5) A+ 拆解：模块序列（品牌横幅 / 对比表 / 尺寸指南 / 场景四宫格 / 图文卖点等，标注顺序）+ 风格（摄影 / 插画 / 信息图占比）+ 元素清单 + 「为什么这样排」的判断依据。',
  '6) 埋词覆盖率与缺口：整体覆盖率（示例 9/12）、缺失词建议、可直接复用的「标题模板 + 五点模板」（带 data-copy 复制按钮，core.js 已全局处理 [data-copy]）。',
  '【图表】埋词命中用 U.meter 或 C.hbar；变体矩阵用 CSS grid 色阶；A+ 序列用编号时间轴（内联 HTML）。'
].join('\n');

const promotion = [
  `【你的文件】${ROOT}/assets/js/agents/08-promotion.js ｜ ROUTE_ID = promotion ｜ TITLE = 推广策略`,
  `【需求来源】${REQ}/竞品维度分析需求.txt 第 8 节 + 补充说明②③，以及 ${REQ}/SIF竞品广告投放策略推测方式.txt（必读全文，是核心判定依据）`,
  '【必须实现的 UI 区块】',
  '1) 顶部口径声明（补充说明②）：如实分析竞品用券情况，并明确标注「此板块的价格与券只用于观测竞品动作，不参与板块 1/6 的任何结论」。',
  '2) 前三个月推广节奏：W1-W13 按周的价格策略、BSR 排名变化、评分与评论数变化、券与 Deal 动作，用 C.line / C.comboBars + 事件标注的时间轴。',
  '3) SIF 运营时光机 - 流量变化：自然流量 vs 广告流量曲线、周环比、关键拐点与对应动作。',
  '4) SIF 查广告架构 - 广告架构拆解：5 个活动 / 11 个广告组的结构树（活动 → 广告组 → 推测关键词与匹配方式），ASIN 级粒度，不承诺广告组以下的不可知信息（补充说明③）。',
  '5) 匹配方式推测引擎：把 SIF 文档 4 条判据做成「判据 → 观测值 → 结论」判定表（关键词数量、数量稳定性、词根分散/集中、搜索量层级），每个广告组给出：关键词数、词根、推测匹配方式（自动-紧密 / 自动-宽泛 / 商品投放 / 精准 / 词组 / 广泛）、置信度、命中的判据编号。',
  '6) 可复用的投放结论：竞品词库分层（大词 / 词根词 / 长尾）、预算与竞价档位、我方对标攻击位建议。',
  '【图表】双线流量用 C.line 或 C.comboBars；广告架构用嵌套卡片 + table-wrap；判据命中用徽标。'
].join('\n');

const flow = [
  `【你的文件】${ROOT}/assets/js/agents/08f-flow.js ｜ ROUTE_ID = flow ｜ TITLE = 流量波动专项`,
  `【需求来源】${REQ}/竞品流量波动分析.txt（必读全文，判定阈值必须一字不差落地）`,
  '【必须实现的 UI 区块】',
  '1) 周期切换：近 4 周 / 近 8 周（写 CX.state.flowRange，默认 8），切换后所有图表与判定联动。',
  '2) 流量波动分析：整体流量、广告流量、自然流量三条线增减 + 广告:自然比例变化，先给趋势再给周环比表。',
  '3) 广告干预及效果：按周推断运营收放动作（加投 / 减投 / 关停 / 新开），给推断依据与效果评分。',
  '4) 关键词变化：当周主推词按文档四条定义判定（SP 进 x 天增加 3 天以上、SB 获得 x 天增加 3 天以上、SP 平均排名 24 之后进入 24 以内、SP 平均排名 5 之后进入 5 以内），并给主推词数量增减、主导流量词对比上周增减。',
  '5) 投放力度：预算档（进 x 天 >=5 高 / 3-4 中 / 1-2 低）与竞价档（平均排名 1-12 高 / 13-24 中 / 25-48 低），标出加投、减投、新开、关停的词。',
  '6) 投放效果：当周主推词在后续 2 周是否带来自然排名进阶（按文档三种进阶判定），做成 主推词 x 周 的判定矩阵，命中 / 未命中两态。',
  '【图表】多线趋势用 C.line，判定矩阵用 CSS grid 三态色阶，词表用 table-wrap。'
].join('\n');

const report = [
  `【你的文件】${ROOT}/assets/js/agents/09-report.js ｜ ROUTE_ID = report ｜ TITLE = 决策报告`,
  `【需求来源】${REQ}/竞品维度分析需求.txt 顶部「可实施性结论」要求 + 01-08F 全部板块结论`,
  '【必须实现的 UI 区块】',
  '1) 顶部可实施性结论卡：结论（可实施 / 不可实施 + 风险性）+ 理由 3-5 条（大盘、供给错位、毛利、合规、专利）+ 建议首单与售价。',
  '2) 十板块证据表：01 市场 / 02 参数 / 03 VOC / 04 利润 / 05 合规 / 06 机会 / 07 Listing / 08 推广 / 08F 流量 / R 报告，每行给关键结论、关键数字、置信度、可回溯来源（SELLERSPRITE / SIF / 1688 / VOC 12,480）。',
  '3) 决策摘要四组结论（市场 / 产品 / 利润 / 执行）+ 风险与前置条件（Go-No-Go 门槛）。',
  '4) 90 天执行路线：里程碑时间轴 + 每阶段门槛指标。',
  '5) 数据源与口径声明：静态原型、DEMO DATA、快照时间、券口径说明（板块 1/6 不含券）。',
  '6) 导出：一个「打印 / 导出 PDF」按钮，用内联 onclick 调 window.print()（注意 C4：不要注入 script 标签，用属性写法 onclick="window.print()"），并加打印友好提示。',
  '【约束】只做汇总与可追溯，不引入新分析口径；数值必须与其它板块一致。'
].join('\n');

const tasks = [
  { key: 'listing',   agent: 'worker', task: common + '\n\n' + listing },
  { key: 'promotion', agent: 'worker', task: common + '\n\n' + promotion },
  { key: 'flow',      agent: 'worker', task: common + '\n\n' + flow },
  { key: 'report',    agent: 'worker', task: common + '\n\n' + report }
];

emit('并行生成 4 个板块：07 Listing / 08 推广 / 08F 流量波动 / R 决策报告');

const built = await runs.all(tasks.map(t => ({ key: t.key, agent: t.agent, task: t.task, cwd: ROOT })));

return {
  sections: built.map((b, i) => ({ key: tasks[i].key, ok: b.ok, runId: b.runId })),
  reports: built.map((b, i) => ({ key: tasks[i].key, output: String(b.output || '').slice(0, 400) }))
};
