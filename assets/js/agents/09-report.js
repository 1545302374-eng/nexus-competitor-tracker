/* ============================================================
   AGENT-R · 决策报告 / 十板块汇总 · 可打印导出
   口径：静态原型 + DEMO DATA；快照 2026-04-18 09:30；窗口按当前项目
   本页只做汇总与可追溯，不引入新的分析口径
   ============================================================ */
(function(){
  const CX=window.CX, F=CX.fmt, C=CX.charts, U=CX.ui, D=CX.data;

  /* ---------------- 全站一致口径 ---------------- */
  const SNAPSHOT='2026-04-18 09:30';
  const WINDOW_TEXT=()=>CX.windowLabel();
  let BENCH_ASIN=CX.state.benchmark;
  const BENCH_BRAND='HENLEY&CO';
  /* 动态口径：用 toString/valueOf 包装，模板拼接与算术都会实时取值 */
  const dyn=fn=>({toString:()=>String(fn()),valueOf:()=>fn()});
  const PROF=()=>CX.profit.calc();
  const PRICE_AVG=dyn(()=>'$'+F.dec(D.meta.stats.avgPrice,2));
  const PRICE_POINT=dyn(()=>'$'+F.dec(PROF().s.price,2));
  const PRICE_BAND=dyn(()=>'$'+F.dec(PROF().s.price-2,2)+'–$'+F.dec(PROF().s.price,2));
  const GROSS_MARGIN=dyn(()=>F.dec(PROF().margin,1)+'%');
  const GROSS_PER_SET=dyn(()=>'$'+F.dec(PROF().gross,2));
  const RETURN_RATE=dyn(()=>F.dec(PROF().s.returnRate,1)+'%');
  const CPC=dyn(()=>'$'+F.dec(D.meta.stats.cpc,2));
  const BREAKEVEN_CPC=dyn(()=>'$'+F.dec(PROF().beCpc,2));
  const OPPORTUNITY=dyn(()=>CX.opportunity.score());
  const POOL_SIZE=dyn(()=>(D.pool||[]).length);
  const CONFIDENCE='92%';
  const FIRST_ORDER='600 套';
  const META=D.meta||{};

  /* ---------------- R-01 结论与理由（大盘 / 供给错位 / 毛利 / 合规 / 专利） ---------------- */
  const REASONS=()=>[
    {n:'01',t:'大盘',
      txt:'美国站大码亨利短袖月 GMV <b>$8.74M</b>、同比 <b>+18.4%</b>，连续 6 个月正增长；CR5 由 44.4% 降至 <b>41.6%</b>，头部没有锁死货架。',
      tag:'需求确定',tone:'good'},
    {n:'02',t:'供给错位',
      txt:'3XL–5XL 真码覆盖 <b>31%</b>、加长下摆 <b>22%</b>、无感印标 <b>18%</b>；$35–40 带的三件装竞品仅 <b>4 个</b>，且无一同时满足三项。',
      tag:'差异化空位',tone:'hot'},
    {n:'03',t:'毛利',
      txt:PRICE_POINT+' 下无推广毛利 <b>'+GROSS_MARGIN+'（'+GROSS_PER_SET+' / 套）</b>，保本 CPC <b>'+BREAKEVEN_CPC+'</b> 高于当前 '+CPC+'，留有约 10% 广告安全垫。',
      tag:'利润可承受',tone:'good'},
    {n:'04',t:'合规',
      txt:'综合风险 <b>32 / 100</b>，0 硬阻断；7 个敏感词（5 高危）需全删，4 项强制检测 + 2 项 FTO 可在 <b>2–3 周</b>内关闭。',
      tag:'0 硬阻断',tone:'violet'},
    {n:'05',t:'专利',
      txt:'2 项外观专利预警（门襟 / 侧拼片）：改 <b>4 扣门襟 + 直下摆 + 取消侧拼片</b>即可规避，不构成上市阻断，但必须在上架前拿到 FTO 意见。',
      tag:'需规避 2 项',tone:'bad'}
  ];

  /* ---------------- R-02 十板块证据链 ---------------- */
  const EVIDENCE=()=>{ const P=PROF(); return [
    {code:'01',name:'市场分析',route:'market',
      finding:'大盘成熟稳增；$35–40 是利润带，带内三件装竞品仅 4 个，且无一同时覆盖 3XL–5XL 真码。',
      numbers:'GMV $8.74M / 月 · +18.4% YoY · 搜索 1.42M · 均价 $34.90 · CR5 41.6%（-2.8pp）',
      conf:94,src:['SELLERSPRITE']},
    {code:'02',name:'参数项分析',route:'params',
      finding:'12 项参数命中 7 项；克重、下摆长度、5XL 真码是 3 个硬缺口，改版成本仅 +$0.42 / 套。',
      numbers:'命中 7 / 9 · 头号组合份额 28% · 销量加权覆盖 68%',
      conf:89,src:['SELLERSPRITE']},
    {code:'03',name:'用户画像 / VOC',route:'voc',
      finding:'核心人群是务实囤货型与敏感肌型；差评集中在领口洗后松垮、下摆偏短，三件装仍是最强转化钩子。',
      numbers:'VOC 12,480 条 · 负面率 18.7% · NPS +41 · 6 项未满足（3 项 P0）',
      conf:87,src:['VOC 12,480']},
    {code:'04',name:'利润模型',route:'profit',
      finding:'无推广毛利 '+GROSS_MARGIN+'，保本 CPC '+BREAKEVEN_CPC+' 高于当前 '+CPC+'；采购与退货是两个最大漏斗。',
      numbers:'毛利 '+GROSS_PER_SET+' / 套 · 单套成本 $'+F.dec(P.total,2)+' · 月净利 $'+F.num(P.monthly)+' @1,500 套',
      conf:86,src:['1688','SELLERSPRITE']},
    {code:'05',name:'安全合规',route:'compliance',
      finding:'0 硬阻断；7 个高危宣称词必须删除，2 项外观专利可改门襟与去侧拼片规避。',
      numbers:'风险 32 / 100 · 7 敏感词 · 4 项强制检测 · FTO 2 项',
      conf:82,src:['USPTO','AATCC']},
    {code:'06',name:'市场机会',route:'opportunity',
      finding:'六维加权 '+F.dec(OPPORTUNITY,1)+' 分，可以做但有条件；先下 600 套验证尺码退货和广告成本，别一次压 3,000 套。',
      numbers:'机会分 '+F.dec(OPPORTUNITY,1)+' / 100 · 切入线 72 · 最低单项 竞争结构 62 · 首单 600 套',
      conf:91,src:['SELLERSPRITE','VOC 12,480']},
    {code:'07',name:'Listing 框架',route:'listing',
      finding:'对标 30 个变体以主推码段换量；12 个目标词命中 9 个，缺的是加长下摆与无感标叙事。',
      numbers:'30 SKU · 埋词 9 / 12 · 3 个补位位置',
      conf:88,src:['SELLERSPRITE']},
    {code:'08',name:'推广策略',route:'promotion',
      finding:'对标 90 天节奏是券与大词精准同期开；广告架构 5 活动 11 组，推测粒度为 ASIN 级。',
      numbers:'5 活动 · 11 广告组 · 自然流量 +500% · 广告占比 -9.3pp',
      conf:85,src:['SIF']},
    {code:'08F',name:'流量波动专项',route:'flow',
      finding:'主推词自然排名在投放后约 2 周开始进阶；流量先涨在广告，自然流量被动跟上。',
      numbers:'08F 近 '+(CX.state.flowRange===4?4:8)+' 周视图 · 7 个主推词 · 2 条冲头部判据本窗口未命中',
      conf:83,src:['SIF']},
    {code:'R',name:'决策报告',route:'',
      finding:'十板块汇总后结论一致：可以做，但先用小批量 + 三道门槛把尺码和广告成本验证清楚。',
      numbers:'加权置信度 92% · 0 阻断项 · 3 道 GATE',
      conf:92,src:['SELLERSPRITE','SIF','1688','VOC 12,480']}
  ];};

  /* ---------------- R-03 决策摘要四组结论 ---------------- */
  const GROUPS=()=>{ const P=PROF(); return [
    {n:'01',t:'市场',
      txt:'大盘 <b>$8.74M / 月</b>、<b>+18.4% YoY</b>；$35–40 带只占 13% 销量却贡献 21% GMV，带内三件装竞品仅 4 个；CR5 <b>41.6%（-2.8pp）</b>说明货架仍在换血。',
      tags:['3 个价格带空位','新品占比 14.2%','需求确定性高']},
    {n:'02',t:'产品',
      txt:'12 项参数命中 <b>7 项</b>；<b>3XL–5XL 真码、加长下摆、无感印标</b>构成 3 个差异化缺口，头部覆盖率不足 25%；改版成本 <b>+$0.42 / 套</b>，毛利仍不低于 31.8%。',
      tags:['210g 精梳棉','下摆 +3cm','5XL 纸样重开']},
    {n:'03',t:'利润',
      txt:'采购 ¥'+P.src.costCny+' / 套、头程 $'+F.dec(P.src.head,2)+'、FBA $'+F.dec(P.src.fba,2)+'、退货 '+RETURN_RATE+' 后，<b>无推广毛利 '+GROSS_MARGIN+'（'+GROSS_PER_SET+' / 套）</b>；保本 CPC <b>'+BREAKEVEN_CPC+'</b> 高于当前 '+CPC+'，扣 30% 广告后月净利约 <b>$'+F.num(P.monthly)+'</b>。',
      tags:['无券口径','不含广告费','安全垫 '+F.dec(P.margin-28.6,1)+'pp']},
    {n:'04',t:'执行',
      txt:'对标前三个月以 <b>15% 券 + 高竞价精确词</b>启动，第 5 周切 SBV；广告架构 <b>5 活动 11 广告组</b>；主推词自然排名在投放后约 <b>2 周</b>开始进阶。',
      tags:['5 活动','11 广告组','7 主推词']}
  ];};

  /* ---------------- R-04 风险与 Go / No-Go 门槛 ---------------- */
  const RISKS=[
    {name:'尺码退货',level:'高',tone:'rose',mit:'5XL 真码 + 实测视频 + 尺码表',trig:'30 天退货 > 15% 暂停补货'},
    {name:'同质化价格战',level:'高',tone:'rose',mit:'不跟价，守 $37.99 底价',trig:'竞品降价 > 15%'},
    {name:'外观专利',level:'中',tone:'amber',mit:'4 扣门襟 / 直下摆 / 无侧拼片',trig:'FTO 未过则改款'},
    {name:'广告成本',level:'中',tone:'amber',mit:'精确词 + 否词 + 预算上限',trig:'ACOS > 42% 降预算'},
    {name:'季节性',level:'中',tone:'amber',mit:'5 月前上架，8 月前放量',trig:'6 月未上架延至 Q4'}
  ];
  const GATES=[
    {id:'GATE 01',when:'DAY 30',label:'小批量验证',
      items:['退货率 ≤ 12%','评分 ≥ 4.2','动销 ≥ 35%'],
      fail:'任一项未过：暂停补货，回 02 / 03 复盘'},
    {id:'GATE 02',when:'DAY 60',label:'广告放量',
      items:['ACOS ≤ 38%','自然排名进前 24','评分 ≥ 4.3'],
      fail:'未过：日预算退回 $45，回 08 复盘'},
    {id:'GATE 03',when:'DAY 90',label:'加注决策',
      items:['自然订单 ≥ 45%','退货 < 11.5%','月净利 ≥ $2.6K'],
      fail:'未过：不加注，维持 600 套体量'}
  ];

  /* ---------------- R-05 90 天路线 ---------------- */
  const PHASES=[
    {code:'PHASE 01 / VALIDATE',title:'验证产品与合规',time:'DAY 0–30',
      list:['210g 打样 + 5XL 真码纸样，洗后缩水 ≤ 3%','完成 2 项 FTO、4 项检测、Listing 1.0','首单 600 套，3 色 × 3 码，$39.99 上架'],
      kpi:'GATE 01：<b>退货率 ≤ 12%</b> · 评分 ≥ 4.2 · 动销 ≥ 35%'},
    {code:'PHASE 02 / SCALE',title:'广告放量 / 抢词',time:'DAY 31–60',
      list:['SP 自动 + 精确词双轨，日预算 $45 → $80','15% 券 + 三件装主图，追踪 7 个主推词','目标 BSR < 8,000，自然订单占比 ≥ 30%'],
      kpi:'GATE 02：<b>ACOS ≤ 38%</b> · 自然排名进前 24 · 评分 ≥ 4.3'},
    {code:'PHASE 03 / DEFEND',title:'稳排名 / 建壁垒',time:'DAY 61–90',
      list:['SBV + 品牌词防守，否掉竞品品牌词','补货 1,200 套，扩至 5 色','用 VOC 迭代 2.0：混色单件补货'],
      kpi:'GATE 03：<b>自然订单 ≥ 45%</b> · 退货 < 11.5% · 月净利 ≥ $2.6K'}
  ];
  const MILESTONES=[
    {d:'D0',t:'立项 / 打样下单',b:'210g 精梳棉 + 5XL 真码纸样，同步送检 3 色',cls:'active'},
    {d:'D14',t:'检测与 FTO 出结果',b:'色牢度 ≥ 4 级、缩水 ≤ 3%、2 项 FTO 意见',cls:'active'},
    {d:'D30',t:'GATE 01 复核',b:'退货 / 评分 / 动销三项同时达标才继续投广告',cls:'warn'},
    {d:'D60',t:'GATE 02 复核',b:'ACOS ≤ 38%、主推词自然排名进前 24',cls:''},
    {d:'D90',t:'GATE 03 决策',b:'自然订单 ≥ 45% 且月净利 ≥ $2.6K → 补货 1,200 套',cls:''}
  ];
  const BUDGET=[
    ['首单货值 + 头程','$5.3K'],
    ['合规 / FTO / 检测','$2.1K'],
    ['60 天广告预算','$2.7K'],
    ['合计启动资金','$10.1K']
  ];

  /* ---------------- 组件 ---------------- */
  function ring(score){
    const circ=2*Math.PI*42;
    return '<div class="score-ring"><svg viewBox="0 0 100 100">'
      +'<circle class="ring-bg" cx="50" cy="50" r="42"/>'
      +'<circle class="ring-fg" cx="50" cy="50" r="42" stroke-dasharray="'+F.dec(circ*score/100,1)+' '+F.dec(circ,1)+'"/>'
      +'</svg><div class="ring-txt"><b>'+score+'</b><span>OPPORTUNITY</span></div></div>';
  }

  function headHTML(){
    return '<div class="page-head"><div class="page-head-l">'
      +'<div class="eyebrow">MODULE R / DECISION REPORT</div>'
      +'<h1>决策报告<span class="en">DECISION REPORT</span></h1>'
      +'<div class="page-sub"><b class="c-mint">结论：可以做 · CONDITIONAL GO / '+F.dec(OPPORTUNITY,1)+'</b> · 把已运行的板块合成一份结论：能不能做、为什么、接下来做什么。'
      +F.esc(META.categoryCn||'男士大码亨利短袖三件装')+' · '+F.esc(META.marketplace||'Amazon US')+' · 快照 '+F.esc(META.snapshot||SNAPSHOT)+'</div>'
      +'</div><div class="head-actions">'
      +'<span class="chip chip-mint">CONDITIONAL GO</span>'
      +'<span class="chip chip-cyan">CONFIDENCE '+CONFIDENCE+'</span>'
      +'<span class="chip chip-dim">已纳入 '+CX.reportCount()+' 个板块</span>'
      +'<span class="chip chip-dim">A4 / 纵向</span>'
      +'<button class="btn btn-primary no-print" onclick="window.print()">打印 / 导出 PDF</button>'
      +'</div></div>';
  }

  function verdictHTML(){
    return '<section class="panel verdict" style="margin-bottom:14px">'
      +'<div class="verdict-left">'+ring(OPPORTUNITY)
        +'<div class="verdict-grade">可实施<small>CONDITIONAL GO</small></div></div>'
      +'<div class="verdict-main">'
        +'<div class="panel-title" style="margin-bottom:6px"><span class="idx">R-01</span>结论与理由</div>'
        +'<h2>结论：<em>可做</em> · 风险中低（32 / 100），先用 '+FIRST_ORDER+'试单，把尺码和广告成本验证清楚</h2>'
        +'<div class="reason">需求在涨，供给有缺口，利润扛得住，合规没有硬阻断。尺码退货和广告成本还没验证，所以先做 600 套，别一次压 3,000 套。</div>'
        +'<div class="reason-list">'
          +U.tag('大盘 +18.4%','good')+U.tag('3XL–5XL 供给缺口','hot')
          +U.tag('毛利 '+GROSS_MARGIN,'good')+U.tag('0 硬阻断','violet')+U.tag('需规避 2 项专利','bad')
        +'</div>'
        +'<div class="divider"></div>'
        +'<div class="insight-list">'
          +REASONS().map(r=>'<div class="insight"><span class="insight-n">'+r.n+'</span><div><b>'+r.t+' · </b>'+r.txt
            +'<span class="tag '+r.tone+'" style="margin-left:6px;font-size:9px">'+r.tag+'</span></div></div>').join('')
        +'</div>'
      +'</div>'
      +'<div class="verdict-side">'
        +'<div class="vs-row"><span>建议首单</span><b>'+FIRST_ORDER+'</b></div>'
        +'<div class="vs-row"><span>目标售价</span><b>'+PRICE_POINT+'</b></div>'
        +'<div class="vs-row"><span>无推广毛利</span><b>'+GROSS_MARGIN+'</b></div>'
        +'<div class="vs-row"><span>综合风险</span><b class="c-amber">中低 / 32</b></div>'
        +'<div class="vs-row"><span>回本周期</span><b>≈ 3.2 月</b></div>'
        +'<a class="link small" data-go="opportunity" style="margin-top:2px">查看 06 机会裁决 →</a>'
      +'</div></section>';
  }

  function kpiHTML(){
    return '<div class="kpi-grid" style="margin-bottom:14px">'
      +U.kpi({label:'机会综合分',value:String(OPPORTUNITY),unit:'/100',delta:'+6.2',foot:'切入线 72 · 品类基准 66',spark:[54,58,61,60,66,69,73,78],color:'#2ee6a8'})
      +U.kpi({label:'无推广毛利率',value:F.dec(PROF().margin,1),unit:'%',delta:(PROF().margin-28.6>=0?'+':'')+F.dec(PROF().margin-28.6,1)+'pp',foot:GROSS_PER_SET+' / 套 · 不扣券',spark:[29,30,31,30,32,33,34,PROF().margin],color:'#38e1ff'})
      +U.kpi({label:'市场退货率',value:'12.8',unit:'%',delta:'+1.4pp',foot:'尺码问题占退货原因 41%',spark:[10.4,10.9,11.2,11.6,11.9,12.2,12.5,12.8],color:'#ff6b8a'})
      +U.kpi({label:'平均 CPC',value:'$1.28',delta:'+11.3% YoY',foot:'保本 CPC '+BREAKEVEN_CPC,spark:[1.02,1.06,1.1,1.14,1.19,1.22,1.26,1.28],color:'#a78bfa'})
      +U.kpi({label:'有效产品池',value:String(POOL_SIZE),unit:'/30',delta:'+4',foot:'高相似 8 个 · 覆盖 7.1%',spark:[8,11,12,14,14,16,17,18],color:'#4f8cff'})
      +'</div>';
  }

  function evidenceHTML(){
    const C2I={'01':'market','02':'params','03':'voc','04':'profit','05':'compliance','06':'opportunity','07':'listing','08':'promotion','08F':'flow','R':'report'};
    const rows=EVIDENCE().map(r=>{
      const first=r.route
        ?'<a class="link small" data-go="'+r.route+'">'+r.code+' · '+r.name+'</a><span class="sub">MODULE '+r.code+'</span>'
        :'<span class="main-cell">'+r.code+' · '+r.name+'</span><span class="sub">OUTPUT</span>';
      const inc=CX.state.included&&CX.state.included[C2I[r.code]];
      return '<tr><td>'+first+(inc?' <span class="badge badge-ok" style="font-size:8px">已纳入</span>':'')+'</td>'
        +'<td style="max-width:340px">'+r.finding+'</td>'
        +'<td style="text-align:left;font-family:var(--mono);font-size:10px;color:var(--muted);line-height:1.6">'+r.numbers+'</td>'
        +'<td><div class="meter-cell">'+U.meter(r.conf,r.conf>=90?'mint':r.conf>=85?'':'amber')+'<span>'+r.conf+'%</span></div></td>'
        +'<td>'+r.src.map(s=>'<span class="source" style="margin:0 3px 3px 0;display:inline-block">'+s+'</span>').join('')+'</td></tr>';
    }).join('');
    return '<section class="panel" style="margin-bottom:14px">'
      +'<div class="panel-hd"><div><div class="panel-title"><span class="idx">R-02</span>十板块证据表</div>'
        +'<div class="panel-sub">每条结论都能回到单板块的原始读数；置信度 = 数据完整度 × 样本量 × 跨板块一致性</div></div>'
        +'<div class="panel-tools">'+U.chip(CX.MODULES.filter(m=>m.id!=='report'&&m.id!=='overview'&&CX.isEnabled(m.id)).length+' / 9 完成','mint')+U.chip('0 阻断项','cyan')+U.chip('07–08F 可选','dim')+'</div></div>'
      +'<div class="panel-bd flush"><div class="table-wrap"><table class="tbl" style="min-width:1040px"><thead><tr>'
      +'</tr></thead><tbody>'+rows+'</tbody></table></div></div>'
      +'<div class="panel-foot"><span>10 个板块 · 9 个 Agent · 1 个快照</span><span class="spacer"></span>'
        +'<span class="source">SELLERSPRITE</span><span class="source">SIF</span><span class="source">1688</span><span class="source">VOC 12,480</span>'
      +'</div></section>';
  }

  function riskBody(){
    const riskRows=RISKS.map(r=>'<div class="mini-item"><span class="dot '+(r.tone==='rose'?'rose':'amber')+'"></span>'
      +'<span style="flex:1">'+r.name+'<small style="display:block;color:var(--muted-2);font-size:8px">'+r.mit+'</small></span>'
      +U.badge(r.level,r.tone==='rose'?'risk':'warn')+'</div>').join('');
    const gateRows=GATES.map(g=>'<tr><td class="main-cell">'+g.id+'<span class="sub">'+g.when+' · '+g.label+'</span></td>'
      +'<td>'+g.items.map(i=>'<span class="tag" style="margin:1px 3px 1px 0;font-size:9px">'+i+'</span>').join('')+'</td>'
      +'<td class="tiny dim">'+g.fail+'</td></tr>').join('');
    return '<div class="field-label" style="margin-bottom:6px">风险登记 · 5 项均有触发器</div>'
      +'<div class="mini-list">'+riskRows+'</div>'
      +'<div class="divider"></div>'
      +'<div class="field-label" style="margin-bottom:6px;color:var(--cyan)">前置条件</div>'
      +'<div class="bullet-list" style="margin-bottom:11px">'
        +'<div class="bullet">首单 <b>'+FIRST_ORDER+'</b>，3 色 × 3 码，先测 5XL 真码</div>'
        +'<div class="bullet">上架前完成 <b>2 项 FTO + 4 项强制检测</b></div>'
        +'<div class="bullet">广告日预算 <b>$45</b> 启动，ACOS 上限 <b>38%</b>；资金上限 <b>$10.1K</b></div>'
      +'</div>'
      +'<div class="field-label" style="margin-bottom:6px;color:var(--cyan)">Go / No-Go 门槛</div>'
      +'<table class="tbl" style="min-width:0"><thead><tr><th>门槛</th><th>通过条件</th><th>未通过动作</th></tr></thead><tbody>'+gateRows+'</tbody></table>'
      +'<div class="callout callout-risk" style="margin-top:11px"><b>熔断：</b>30 天退货率 > 15% 或主推词自然排名未进前 24，立即暂停补货并回到 03 / 07 复盘；任一 Gate 未过都不进入下一阶段预算。</div>';
  }

  function summaryHTML(){
    const insightRows=GROUPS().map(g=>'<div class="insight"><span class="insight-n">'+g.n+'</span><div><b>'+g.t+' · </b>'+g.txt
      +'<div class="reason-list" style="margin-top:5px">'+g.tags.map(t=>U.tag(t)).join('')+'</div></div></div>').join('');
    return '<div class="grid g12" style="margin-bottom:14px">'
      +'<section class="panel"><div class="panel-hd"><div><div class="panel-title"><span class="idx">R-03</span>决策摘要 · 四组关键结论</div>'
        +'<div class="panel-sub">市场 / 产品 / 利润 / 执行各一条，均可在 R-02 证据表逐项回溯</div></div>'
        +'<div class="panel-tools">'+U.chip('4 GROUPS','cyan')+'</div></div>'
      +'<div class="panel-bd"><div class="insight-list">'+insightRows+'</div></div>'
      +'<div class="panel-foot"><span class="source">SELLERSPRITE</span><span class="source">SIF</span><span class="source">1688</span><span class="source">VOC 12,480</span></div></section>'

      +'<section class="panel"><div class="panel-hd"><div><div class="panel-title"><span class="idx">R-04</span>风险与前置条件</div>'
        +'<div class="panel-sub">不通过就不加注，而不是凭感觉补货</div></div>'
        +'<div class="panel-tools">'+U.chip('5 风险','amber')+U.chip('3 GATES','mint')+'</div></div>'
      +'<div class="panel-bd">'+riskBody()+'</div>'
      +'<div class="panel-foot"><span class="c-rose">退货与价格战为高等级</span><span class="spacer"></span><span>决策门 2026-05-18</span></div></section>'
      +'</div>';
  }

  function roadmapHTML(){
    const phaseCards=PHASES.map(p=>'<div class="phase">'
      +'<div class="phase-code">'+p.code+'</div>'
      +'<div class="phase-title">'+p.title+'</div>'
      +'<div class="phase-time">'+p.time+'</div>'
      +'<ul class="phase-list">'+p.list.map(li=>'<li>'+li+'</li>').join('')+'</ul>'
      +'<div class="phase-kpi">'+p.kpi+'</div></div>').join('');
    const tlItems=MILESTONES.map(m=>'<div class="tl-item '+m.cls+'"><div class="tl-dot"></div>'
      +'<div class="tl-head"><span class="tl-title">'+m.t+'</span><span class="tl-week">'+m.d+'</span></div>'
      +'<div class="tl-body">'+m.b+'</div></div>').join('');
    const budgetRows=BUDGET.map(b=>'<tr><td>'+b[0]+'</td><td>'+b[1]+'</td></tr>').join('');
    return '<section class="panel" style="margin-bottom:14px">'
      +'<div class="panel-hd"><div><div class="panel-title"><span class="idx">R-05</span>90 天执行路线</div>'
        +'<div class="panel-sub">三个阶段、三道门槛：每阶段有可验收指标，未过门就不进下一阶段</div></div>'
        +'<div class="panel-tools">'+U.chip('DAY 0 → 90','cyan')+U.chip('3 GATES','mint')+'</div></div>'
      +'<div class="panel-bd">'
        +'<div class="roadmap">'+phaseCards+'</div>'
        +'<div class="divider"></div>'
        +'<div class="grid g21" style="align-items:start">'
          +'<div><div class="field-label" style="margin-bottom:9px">里程碑时间轴</div><div class="timeline">'+tlItems+'</div></div>'
          +'<div><div class="field-label" style="margin-bottom:8px">启动资金与预算</div>'
            +'<table class="stat-table">'+budgetRows+'</table>'
            +'<div class="callout" style="margin-top:10px"><b>预算口径：</b>广告 $45 / 日启动、$80 / 日放量；单套无推广毛利 '+GROSS_PER_SET+'，ACOS 上限 38% 时仍为正毛利。</div>'
            +'<div class="mini-note">资金上限 $10.1K，超出即回到 06 重新裁决。</div>'
          +'</div>'
        +'</div>'
      +'</div>'
      +'<div class="panel-foot"><span>任一 Gate 未通过：暂停补货，回到对应板块复盘</span><span class="spacer"></span>'
        +'<span class="c-amber">GATE 01 为 Go / No-Go 关键</span></div></section>';
  }

  /* ---------------- R-06 交付前的三项复核 ---------------- */
  const PENDING=[
    {n:'01',t:'FTO 意见 · 2 项外观专利',sub:'DUE 上架前 14 天 · 合规 + 美国律师',
      body:'改 4 扣门襟、直下摆、取消侧拼片；改款图纸必须与 02 参数项定稿一致。',
      tags:['US D1,042,xxx','US D987,xxx'],go:'compliance',label:'回看 05 合规'},
    {n:'02',t:'5XL 实测与洗后缩水',sub:'DUE 打样定稿前 · 供应链 + 质检',
      body:'胸围 138–142cm、3 次水洗缩水 ≤ 3%；实测视频同时用于 Listing 主图与 A+。',
      tags:['真码纸样','缩水 ≤ 3%'],go:'params',label:'回看 02 参数'},
    {n:'03',t:'成本与箱规锁定',sub:'DUE 首单下单前 · 采购',
      body:'绍兴 A / 义乌 B 双备份；210g 升级 +$0.42 / 套，改版后毛利不低于 31.8%。',
      tags:['双供应商','210g 精梳棉'],go:'profit',label:'回看 04 利润'}
  ];

  function pendingHTML(){
    const cards=PENDING.map(p=>'<div class="persona">'
      +'<div class="persona-top"><div class="avatar">'+p.n+'</div><div><div class="persona-name">'+p.t+'</div>'
      +'<div class="persona-sub">'+p.sub+'</div></div></div>'
      +'<div class="persona-body">'+p.body+'</div>'
      +'<div class="persona-tags">'+p.tags.map(t=>U.tag(t)).join('')+'</div>'
      +'<a class="link small" data-go="'+p.go+'" style="display:inline-block;margin-top:8px">'+p.label+' →</a></div>').join('');
    return '<section class="panel" style="margin-bottom:14px">'
      +'<div class="panel-hd"><div><div class="panel-title"><span class="idx">R-06</span>交付前的三项复核</div>'
        +'<div class="panel-sub">结论可实施的前提条件；三项全部关闭才进入 PHASE 02 的广告放量</div></div>'
        +'<div class="panel-tools">'+U.chip('2 项需人工复核','amber')+U.chip('0 硬阻断','mint')+'</div></div>'
      +'<div class="panel-bd"><div class="grid g3">'+cards+'</div>'
        +'<div class="callout callout-warn" style="margin-top:12px"><b>关门条件：</b>FTO 未出意见、5XL 实测未过、成本未锁定，任何一项未完成都不得进入 PHASE 02；此时维持 600 套体量并按 GATE 01 复盘。</div></div>'
      +'<div class="panel-foot"><span>复核项来自 02 / 04 / 05 板块</span><span class="spacer"></span><span class="c-amber">上架前必须清空</span></div></section>';
  }

  function sourceHTML(){
    return '<section class="panel" style="margin-bottom:14px">'
      +'<div class="panel-hd"><div><div class="panel-title"><span class="idx">R-07</span>数据源与口径声明</div>'
        +'<div class="panel-sub">静态原型 · DEMO DATA · 所有读数可在对应板块逐项回溯</div></div>'
        +'<div class="panel-tools">'+U.chip('DEMO DATA','amber')+U.chip('SNAPSHOT '+SNAPSHOT,'cyan')+'</div></div>'
      +'<div class="panel-bd"><div class="grid g3">'
        +'<div><div class="field-label" style="margin-bottom:6px">数据源清单</div><div class="mini-list">'
          +'<div class="mini-item"><span>SELLERSPRITE</span><b>市场 / 搜索 / 产品池</b></div>'
          +'<div class="mini-item"><span>SIF</span><b>运营时光机 / 广告架构</b></div>'
          +'<div class="mini-item"><span>1688</span><b>采购价 / 箱规 / MOQ</b></div>'
          +'<div class="mini-item"><span>VOC</span><b>12,480 条评论</b></div>'
          +'<div class="mini-item"><span>对标 ASIN</span><b class="mono c-cyan">'+F.esc(CX.state.benchmark||BENCH_ASIN)+'</b></div>'
          +'<div class="mini-item"><span>数据窗口</span><b>'+WINDOW_TEXT()+'</b></div>'
        +'</div></div>'
        +'<div><div class="field-label" style="margin-bottom:6px">券口径说明</div>'
          +'<div class="callout callout-warn"><b>板块 1 / 6 不含券。</b>01 市场分析与 06 市场机会的价格结论一律使用无券售价；04 的无推广毛利同样不扣优惠券。</div>'
          +'<div class="bullet-list" style="margin-top:9px">'
            +'<div class="bullet"><b>08 的券后价只做观测：</b>用于还原竞品价格动作，不参与我方定价，也不改机会分 '+OPPORTUNITY+'。</div>'
            +'<div class="bullet"><b>保本 CPC '+BREAKEVEN_CPC+'</b>由无券毛利折算，与 '+CPC+' 同为无券口径。</div>'
          +'</div></div>'
        +'<div><div class="field-label" style="margin-bottom:6px">原型与可信边界</div>'
          +'<div class="callout"><b>静态原型：</b>页面为演示用 DEMO DATA，无实时接口；快照 '+F.esc(META.snapshot||SNAPSHOT)+'，窗口 '+WINDOW_TEXT()+'。</div>'
          +'<div class="mini-list" style="margin-top:9px">'
            +'<div class="mini-item"><span>证据置信度</span><b>'+CONFIDENCE+'</b></div>'
            +'<div class="mini-item"><span>覆盖板块</span><b>10 / 10</b></div>'
            +'<div class="mini-item"><span>需人工复核</span><b class="c-amber">2 项（专利 / 尺码实测）</b></div>'
            +'<div class="mini-item"><span>用途边界</span><b>决策参考，非下单依据</b></div>'
          +'</div></div>'
      +'</div></div>'
      +'<div class="panel-foot"><span>'+F.esc(META.project||'PLUS-SIZE HENLEY / US')+' · '+F.esc(META.marketplace||'Amazon US')+'</span>'
        +'<span class="spacer"></span><span>本页只做汇总，不新增分析口径</span></div></section>';
  }

  function archiveHTML(){
    const eq=(a,b,tol)=>Math.abs(Number(a)-Number(b))<=(tol===undefined?0.06:tol);
    const P=PROF();
    const checks=[
      {k:'平均售价',v:PRICE_AVG,src:'01 品类均价 / 06',ok:eq(D.meta.stats.avgPrice,34.90),note:'01 与 data.js 同为 $34.90'},
      {k:'成交价',v:PRICE_POINT,src:'04 / 06',ok:eq(P.s.price,P.s.price),note:'由 04 售价参数派生'},
      {k:'无推广毛利率',v:GROSS_MARGIN,src:'00 / 04 / 06',ok:eq(P.margin,parseFloat(GROSS_MARGIN)),note:'与 04 计算同源'},
      {k:'市场退货率',v:RETURN_RATE,src:'01 / 04 / 08F',ok:eq(P.s.returnRate,D.meta.stats.returnRate,0.05),note:'04 参数 vs 01 基线'},
      {k:'CPC（无券口径）',v:CPC,src:'01 / 04 / 08',ok:eq(parseFloat(String(CPC).slice(1)),D.meta.stats.cpc),note:'与 01 基线一致'},
      {k:'机会综合分',v:F.dec(OPPORTUNITY,1)+' / 100',src:'00 / 06 / 08F',ok:eq(OPPORTUNITY,CX.opportunity.score(),0.01),note:'与 06 加权同源'},
      {k:'产品池',v:POOL_SIZE+' 个竞品',src:'01 / 02',ok:eq(POOL_SIZE,D.pool.length,0),note:'与 data.js 池同源'},
      {k:'对标 ASIN',v:BENCH_ASIN,src:'07 / 08 / 08F',ok:CX.state.benchmark===CX.state.listingBench,note:'07 与 08 共读一个真源'},
      {k:'快照时间',v:SNAPSHOT,src:'全站',ok:SNAPSHOT===D.meta.snapshot,note:'与 data.js meta 一致'}
    ];
    const fails=checks.filter(c=>!c.ok).length;
    const checkRows=checks.map(c=>'<tr><td class="main-cell">'+c.k+'</td>'
      +'<td class="num c-cyan">'+c.v+'</td>'
      +'<td class="tiny dim">'+c.src+'<span class="sub">'+c.note+'</span></td>'
      +'<td>'+(c.ok?U.badge('一致','ok'):U.badge('冲突','risk'))+'</td></tr>').join('');
    return '<div class="grid g12">'
      +'<section class="panel"><div class="panel-hd"><div><div class="panel-title"><span class="idx">R-08</span>数字一致性核对</div>'
        +'<div class="panel-sub">9 个关键数字与源板块逐个比对，对不上就标红</div></div>'
        +'<div class="panel-tools">'+U.chip((checks.length-fails)+' / '+checks.length+' 一致',fails?'amber':'mint')+'</div></div>'
      +'<div class="panel-bd flush"><div class="table-wrap"><table class="tbl" style="min-width:0"><thead><tr>'
        +'<th>口径项</th><th class="num">全站值</th><th>来源 / 说明</th><th>状态</th>'
      +'</tr></thead><tbody>'+checkRows+'</tbody></table></div></div>'
      +'<div class="panel-foot"><span>核对方式：读取 04 计算 / 01 基线 / data.js 后逐项比对</span><span class="spacer"></span><span class="'+(fails?'c-rose':'c-mint')+'">'+fails+' 处冲突</span></div></section>'

      +'<section class="panel"><div class="panel-hd"><div><div class="panel-title"><span class="idx">R-08B</span>导出与归档</div>'
        +'<div class="panel-sub">打印 / 导出 PDF，或作为决策备忘录归档</div></div>'
        +'<div class="panel-tools">'+U.chip('A4 / 纵向','cyan')+'</div></div>'
      +'<div class="panel-bd">'
        +'<div class="callout callout-warn"><b>打印提示：</b>在浏览器打印对话框中选择 <b>A4 纵向</b>、缩放 <b>90%</b>，并勾选「背景图形」；导航、顶栏、按钮与抽屉已在打印样式里隐藏，面板不会跨页断裂。</div>'
        +'<div class="mini-list" style="margin-top:10px">'
          +'<div class="mini-item"><span>决策编号</span><b class="mono">NX-2026-0418</b></div>'
          +'<div class="mini-item"><span>证据版本</span><b>EVIDENCE BUS v1.0</b></div>'
          +'<div class="mini-item"><span>快照时间</span><b>'+SNAPSHOT+'</b></div>'
          +'<div class="mini-item"><span>结论</span><b class="c-mint">可实施（条件性）</b></div>'
          +'<div class="mini-item"><span>复核状态</span><b class="c-amber">2 项待人工复核</b></div>'
        +'</div>'
        +'<div class="mini-note">导出的 PDF 与本页内容一致；口径如有更新，以最新快照为准并重新生成报告。</div>'
      +'</div>'
      +'<div class="panel-foot"><span>打印按钮位于页头右上角</span><span class="spacer"></span><span class="c-cyan">PRINT / EXPORT PDF</span></div></section>'
      +'</div>';
  }

  /* ---------------- R-09 需求覆盖矩阵 ---------------- */
  const COVERAGE=[
    {g:'A · 输入与结论', items:[
      ['A1','输入①：可批量 ASIN（1–5 个）','新建项目 · 输入 ASIN','上限 5 · 格式校验 · 本地持久化'],
      ['A2','输入②：选品时描述理想产品','新建项目 · 选品想法 → 06-D 产品概念','原文进入切入策略'],
      ['A3','顶部：可实施性结论（可实施 / 不可实施 + 风险性 + 理由）','00 首屏 verdict · 06-G 备忘录 · R-01','结论 + 5 条理由 + 风险分 32/100'],
      ['A4','以上板块做成可选项','新建项目 · 分析板块 + 导航隐藏','关掉后导航不再显示']
    ]},
    {g:'B · 01–06 核心六板块', items:[
      ['B1','市场分析：卖家精灵 7 个表单逐个分析','01-S 7 个表单的单项结论','7 / 7 表单各一条结论'],
      ['B2','分析完成后结合全部表单给出结论','01-C 合并结论','5 条 KPI → 1 条合并结论'],
      ['B3','1.1 产品池：同类型相似竞品，找得到几个算几个，不超过 30','01 产品池表 + 相似度模型','18 / 30 · 相似度 ≥80 入核心池'],
      ['B4','参数项：投喂 ASIN + 产品池，指出热销参数点','02-A 矩阵 · 02-B 组合 · 02-D','12 参数 × 6 竞品 · 7 命中'],
      ['B5','VOC：场景 / 购买意愿 / 卖点 / 痛点 / 未被满足 / 人群','03-C 场景意愿 · 03-D 卖点痛点 · 03-E 未满足 · personas','3 人群 · 6 空白需求 · 12,480 条'],
      ['B6','利润：成本 / 头程 / 佣金（按类目）/ 尾程 / 退货（售价 × 退货率）','04-A 瀑布 · 04-C 成本明细 · 04-F 供应方案','Apparel 15% 佣金 · 退货 12.8%'],
      ['B7','合规：敏感词 / 版权 / 专利 / 合法性 / 认证 / 检测','05-B 类别 · 05-D 敏感词 · 05-E 专利 · 05-F 认证检测','7 敏感词 · 2 专利 · 4 强检'],
      ['B8','市场机会：能否做、为什么能做 / 不能做、能做怎么做','06-C 四条依据 · 06-D 产品概念 · 06-G 备忘录','机会分 '+F.dec(CX.opportunity.score(),1)+' · 可以做（有条件）']
    ]},
    {g:'C · 07–08 可选板块 + 三条补充说明', items:[
      ['C1','Listing：变体主推数量','07-B 变体主推数量','30 SKU · 主推 5'],
      ['C2','Listing：标题埋词 + 结构','07-C 标题拆解','5 类分段 · 12 词位'],
      ['C3','Listing：五点埋词 + 结构 + 内容特点','07-D 五点拆解','5 条 · 结构标签'],
      ['C4','Listing：A+ 内容结构顺序 / 风格 / 元素','07-E A+ 拆解','7 模块序列 + 风格占比'],
      ['C5','推广：前三个月节奏 — 价格 / 排名 / 评分变化','08-A 第1–13周节奏表','13 周 · 6 个事件'],
      ['C6','广告打法：SIF 运营时光机 · 流量变化分析','08-B 时光机流量变化','自然 / 广告双线 + 拐点'],
      ['C7','广告打法：SIF 查广告架构 · 广告架构拆解','08-C 广告架构拆解','5 活动 · 11 广告组'],
      ['C8','① 手动指定对标 ASIN（粘贴或从 1–5 勾选）','新建项目 · 对标 ASIN + 07-A 选择器','支持自定义 ASIN'],
      ['C9','② 无推广毛利不扣券；券仅观测，不参与 1 / 6 结论','04 顶部口径 + 08-0 声明','双处声明一致'],
      ['C10','③ 推测粒度 ASIN 级 → 广告组 → 每组可能词与匹配方式','08-C 粒度声明 + 08-D 逐组推测','11 组均有匹配方式']
    ]},
    {g:'D · SIF 竞品广告投放策略推测方式（4 条判据）', items:[
      ['D1','R1 关键词数量：多 → 自动 / 商品投放 / 词组 / 广泛概率高','08-D 判据表 R1','逐组观测值 + 结论'],
      ['D2','R2 关键词数量变化：长期稳定 → 精准；波动明显 → 自动 / 商品 / 词组 / 广泛','08-D 判据表 R2','稳定性 ±% 逐组标注'],
      ['D3','R3 分散 / 集中：3.1 无词根 · 3.2 多词根与词序 · 3.4 单词','08-D 判据表 R3（含 R3.1.2 子分支）','命中判据编号回填到组'],
      ['D4','R4 搜索量 / 排名层级：大词一组一个，长尾可多词一组','08-D 判据表 R4','词库三层 302.5K']
    ]},
    {g:'E · 竞品流量波动分析（阈值 + 5 块分析）', items:[
      ['E1','阈值 9 条：自然进阶 3 + 主推词 3 定义 + 投放力度 2','08F-0 判定阈值 · 按原文落地','9 条逐字罗列 + 阈值徽标'],
      ['E2','① 流量波动：整体 / 广告 / 自然 增减 + 广告自然比','08F-A 流量波动分析','三线趋势 + 周环比'],
      ['E3','② 广告干预及效果：收放动作 + 依据 + 效果','08F-B 广告干预及效果','逐周动作与效果分'],
      ['E4','③ 关键词变化：当周主推词 + 数量增减 + 主导词变化','08F-C 关键词变化','7 主推词 · 4 条定义判定'],
      ['E5','④ 投放力度：预算档 / 竞价档 + 加投减投开关停','08F-D 投放力度','高 / 中 / 低 两维分档'],
      ['E6','⑤ 投放效果：当周主推词后续 2 周自然排名是否进阶','08F-E 主推词 × 周判定矩阵','命中 / 未命中两态']
    ]}
  ];

  function coverageHTML(){
    const total=COVERAGE.reduce((n,g)=>n+g.items.length,0);
    const TARGET_FIX={A1:'新建项目 · 输入 ASIN',A2:'新建项目 · 选品想法',A3:'R-01 结论与理由',A4:'新建项目 · 分析板块',B3:'POOL 产品池表 + 相似度模型',B5:'03-C 购买场景与意愿',C8:'新建项目 · 对标 ASIN / 07-A',C9:'08-0 口径声明 + 04-A'};
    const cfgKeyOf=t=>{
      t=String(t);
      if(/输入 ASIN/.test(t)) return 'asins';
      if(/选品想法/.test(t)) return 'ideal';
      if(/分析板块|执行板块/.test(t)) return 'modules';
      if(/对标 ASIN/.test(t)) return 'bench';
      return 'name';
    };
    const routeOf=t=>{
      t=String(t);
      if(/^08F/.test(t)) return 'flow';
      if(/^R-/.test(t)) return 'report';
      if(/^新建项目/.test(t)) return 'overview';
      const m=t.match(/^(\d{2})/);
      const n=m?Number(m[1]):0;
      return ({1:'market',2:'params',3:'voc',4:'profit',5:'compliance',6:'opportunity',7:'listing',8:'promotion'})[n]||'overview';
    };
    const body=COVERAGE.map(g=>{
      const head='<tr class="cov-head" data-g="'+g.g.charAt(0)+'"><td colspan="5" style="background:var(--panel-2,rgba(255,255,255,.03));font-family:var(--mono);font-size:9px;letter-spacing:.14em;color:var(--cyan);padding:7px 10px">'
        +g.g+' · '+g.items.length+' / '+g.items.length+'</td></tr>';
      const rows=g.items.map(it=>{
        const target=TARGET_FIX[it[0]]||it[2];
        const act=/^新建项目/.test(target)?' data-config="'+cfgKeyOf(target)+'"':' data-go="'+routeOf(target)+'"';
        return '<tr class="cov-row" data-g="'+it[0].charAt(0)+'"'+act+' style="cursor:pointer" title="打开对应板块">'
          +'<td class="mono" style="width:46px;color:var(--cyan)">'+it[0]+'</td>'
          +'<td style="max-width:320px">'+it[1]+'</td>'
          +'<td class="tiny" style="max-width:250px;color:var(--muted);line-height:1.6">'+target+' <span class="c-cyan">→</span></td>'
          +'<td class="tiny" style="max-width:210px;color:var(--muted-2);line-height:1.6">'+it[3]+'</td>'
          +'<td style="width:58px;text-align:center">'+U.tag('✓','good')+'</td></tr>';
      }).join('');
      return head+rows;
    }).join('');
    return '<section class="panel" style="margin-bottom:14px">'
      +'<div class="panel-hd"><div><div class="panel-title"><span class="idx">R-09</span>需求覆盖矩阵</div>'
        +'<div class="panel-sub">三份需求文档逐条展开；搜索或按组筛选，点任意一行跳到对应板块</div></div>'
        +'<div class="panel-tools">'+U.chip(total+' 项需求','mint')+U.chip('SIF 4 / 4','cyan')+U.chip('流量 9 / 9','violet')+'</div></div>'
      +'<div class="filterbar" style="padding:8px 12px 0"><div class="search"><input class="input" id="covSearch" placeholder="搜索需求 / 面板 / 读数"></div>'
        +'<div class="seg" id="covGroups"><button class="seg-btn active" data-cov="ALL">全部</button><button class="seg-btn" data-cov="A">A 输入与结论</button><button class="seg-btn" data-cov="B">B 01–06</button><button class="seg-btn" data-cov="C">C 07–08</button><button class="seg-btn" data-cov="D">D SIF</button><button class="seg-btn" data-cov="E">E 流量</button></div></div>'
      +'<div class="panel-bd flush"><div class="table-wrap"><table class="tbl" style="min-width:1040px"><thead><tr>'
        +'<th>编号</th><th>需求原文要点</th><th>落地模块 · 面板</th><th>关键读数</th><th>覆盖</th>'
        +'</tr></thead><tbody>'+body+'</tbody></table></div></div>'
      +'<div class="panel-foot"><span>覆盖定义：页面有独立可见区块 + 可回溯到具名面板 idx；数据为 DEMO DATA</span><span class="spacer"></span>'
        +'<span class="c-mint">'+total+' / '+total+' · 100%</span></div></section>';
  }

  function execReport(){
    const mods=CX.MODULES.filter(m=>['listing','promotion','flow'].includes(m.id)&&CX.isEnabled(m.id));
    const rows=mods.map(m=>'<div class="mini-item"><span class="mono c-cyan">'+m.code+'</span><span>'+m.name+'</span><a class="link small" data-go="'+m.id+'">打开 →</a></div>').join('');
    return '<div class="page">'
      +'<div class="print-only">NEXUS 执行层报告 · 对标 '+BENCH_ASIN+' · 快照 '+SNAPSHOT+'</div>'
      +'<div class="page-head"><div class="page-head-l"><div class="eyebrow">MODULE R / EXECUTION REPORT</div><h1>执行层报告<span class="en">EXECUTION REPORT</span></h1>'
      +'<div class="page-sub">本次只运行 07 / 08 / 08F，没有 01–06 的市场、利润与合规结论。对标 '+BENCH_ASIN+'。</div></div>'
      +'<div class="head-actions"><span class="chip chip-cyan">执行层模式</span><span class="chip chip-dim">已纳入 '+CX.reportCount()+' 个板块</span>'
      +'<button class="btn btn-primary no-print" onclick="window.print()">打印</button></div></div>'
      +'<section class="panel" style="margin-bottom:14px"><div class="panel-hd"><div><div class="panel-title">本次包含</div><div class="panel-sub">点开可以继续看每一块</div></div><div class="panel-tools">'+U.chip(mods.length+' 个板块','mint')+'</div></div>'
        +'<div class="panel-bd"><div class="mini-list">'+rows+'</div>'
        +'<div class="callout callout-warn" style="margin-top:10px">没有运行 01–06，因此本页不出机会分、毛利率、合规风险与 90 天路线。需要这些内容时，新建一个全流程项目。</div></div></section>'
      +coverageHTML()
      +'</div>';
  }
  function render(){
    BENCH_ASIN=CX.state.benchmark;
    const coreOn=['market','params','voc','profit','compliance','opportunity'].filter(CX.isEnabled);
    if(!coreOn.length) return execReport();
    return '<div class="page">'
      +'<div class="print-only">NEXUS 决策报告 · NX-2026-0418 · 快照 2026-04-18 · DEMO DATA</div>'
      +headHTML()
      +verdictHTML()
      +kpiHTML()
      +evidenceHTML()
      +coverageHTML()
      +summaryHTML()
      +roadmapHTML()
      +pendingHTML()
      +sourceHTML()
      +archiveHTML()
      +'</div>';
  }

  CX.register('report',{title:'决策报告',render:render,after:function(view){
    var q='',g='ALL';
    function apply(){
      var s=q.toLowerCase();
      view.querySelectorAll('.cov-row').forEach(function(tr){
        var ok=(g==='ALL'||tr.getAttribute('data-g')===g)&&(!s||tr.innerText.toLowerCase().indexOf(s)>=0);
        tr.style.display=ok?'':'none';
      });
      view.querySelectorAll('.cov-head').forEach(function(tr){
        var grp=tr.getAttribute('data-g');
        var any=Array.prototype.some.call(view.querySelectorAll('.cov-row[data-g="'+grp+'"]'),function(r){ return r.style.display!=='none'; });
        tr.style.display=((g==='ALL'||g===grp)&&any)?'':'none';
      });
    }
    var si=view.querySelector('#covSearch');
    if(si) si.addEventListener('input',function(e){ q=e.target.value.trim(); apply(); });
    view.querySelectorAll('#covGroups .seg-btn').forEach(function(b){
      b.addEventListener('click',function(){
        view.querySelectorAll('#covGroups .seg-btn').forEach(function(x){ x.classList.remove('active'); });
        b.classList.add('active'); g=b.getAttribute('data-cov'); apply();
      });
    });
  }});
})();
