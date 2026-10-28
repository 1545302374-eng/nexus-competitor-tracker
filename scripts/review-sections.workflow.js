/* Workflow B: 履约审查 + 按需修复（前台 in-process；子 agent 无 shell） */
const ROOT = 'C:/Users/teesm/Desktop/PI 竞品维度分析';

const files = [
  `${ROOT}/assets/js/agents/07-listing.js`,
  `${ROOT}/assets/js/agents/08-promotion.js`,
  `${ROOT}/assets/js/agents/08f-flow.js`,
  `${ROOT}/assets/js/agents/09-report.js`
];

const reviewTask = [
  '你是独立履约审查员，只读不改文件。环境提醒：你没有可用的 shell（bash/PowerShell 都不能执行），不要尝试运行命令，只用 read 工具。',
  '被审文件（4 个）：',
  ...files,
  '同时可读：' + ROOT + '/assets/js/core.js、' + ROOT + '/index.html、' + ROOT + '/assets/js/agents/06-opportunity.js（作为范式基准）。',
  '审查清单（逐条判定 PASS / FAIL，并给 文件:行 级证据）：',
  'R1 4 个文件都存在且非空、行数 >= 350，形如完整 IIFE（读文件首尾确认闭合）。',
  'R2 结构完整：每个文件都有 const CX=window.CX 取用、function render()、结尾 CX.register(...)；无截断、无重复定义、无语法级可疑拼接（逐段抽查 render 内引号与括号配对）。',
  'R3 CX.register 的 route id 分别为 listing / promotion / flow / report，title 分别为 Listing 框架 / 推广策略 / 流量波动专项 / 决策报告。',
  'R4 只用了 core.js 已有 API（CX.register / CX.ui.* / CX.charts.* / CX.fmt.* / CX.openDrawer / CX.toast / CX.go / CX.state.* / CX.data.*）。核对 core.js 实际导出清单，出现不存在的 API 或自造图表类型即 FAIL 并列出准确行号。',
  'R5 未出现 style 标签、未出现 http(s):// 外链资源、未出现 document.write、未出现 <script。',
  'R6 未越权修改：用 Select-String 等价方式（read + 抽查）确认 index.html 未新增实现代码、core.js 只有 MODULES 增补、data.js 未被写入板块业务数据。',
  'R7 口径一致性：4 个文件中抽查 34.3 / 12.8 / 1.28 / B0C9K2M4P1 / 78 / 2026-04-18，确认与全站一致且无自相矛盾数字。',
  'R8 需求落地：07 必须含对标 ASIN 手动输入或勾选入口；08 必须含券口径声明 + SIF 匹配方式判定表（至少 5 个广告组给出推测匹配方式）；08F 必须含 4/8 周切换 + 「主推词 → 后续 2 周自然排名进阶」矩阵；R 必须含可实施性结论卡与 window.print()。',
  'R9 白屏风险：找出 render 中会导致运行期报错的写法（未定义变量、chart 参数缺字段、事件绑定指向不存在的元素 id）。',
  '输出格式（严格遵守）：',
  '第一行只写 VERDICT: PASS 或 VERDICT: FIX',
  '随后为缺陷列表，每条格式：[文件:行] 严重度(阻断/高/中/低) 问题 → 精确修改要求',
  '最后一行写「统计：R1..R9 通过 n/9」。不要贴大段代码。'
].join('\n');

const review = await runs.run('review', { agent: 'reviewer', task: reviewTask, cwd: ROOT });

let fix = null;
if (/VERDICT:\s*FIX/i.test(String(review.output || ''))) {
  emit('审查未通过，派发修复');
  fix = await runs.run('fix', {
    agent: 'worker',
    cwd: ROOT,
    task: [
      '你是修复工程师，环境提醒：你没有可用的 shell，不要运行命令，只用 read / edit / write。',
      '只修下列文件中被指出的缺陷，禁止重写整页，禁止改动 ' + ROOT + '/index.html、core.js、data.js、theme.css。',
      '修完必须 read 重新复核改动段落，确认引号括号闭合、无未定义变量。',
      '审查报告如下：',
      String(review.output || '')
    ].join('\n')
  });
}

return {
  verdict: /VERDICT:\s*PASS/i.test(String(review.output || '')) ? 'PASS' : 'FIX',
  review: String(review.output || ''),
  fixed: fix ? String(fix.output || '') : null
};
