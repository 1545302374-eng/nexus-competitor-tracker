/* ============================================================
   AGENT-00 · 决策总览
   ============================================================ */
(function(){
  const CX=window.CX;
  const D=CX.data, M=D.meta, S=M.stats;
  const {kpi,panel,chip,badge,tag}=CX.ui;
  const C=CX.charts;
  const F=CX.fmt;
  const PROF=()=>CX.profit.calc();
  const OSCORE=()=>CX.opportunity.score();
  const ACTIVE=()=>CX.MODULES.filter(m=>m.id!=='report'&&m.id!=='overview'&&CX.isEnabled(m.id)).length;

  const scores=[
    {k:'market',label:'市场分析',v:82,base:70},
    {k:'params',label:'参数项',v:76,base:65},
    {k:'voc',label:'用户画像',v:80,base:68},
    {k:'profit',label:'利润模型',v:71,base:66},
    {k:'compliance',label:'安全合规',v:74,base:80},
    {k:'opportunity',label:'市场机会',v:78,base:60},
    {k:'listing',label:'Listing',v:68,base:72},
    {k:'promotion',label:'推广策略',v:73,base:69}
  ];
  const modules=[
    {id:'market',code:'01',name:'市场分析',metric:'18',unit:'竞品',desc:'7 表单 · 产品池 · 结论',state:'DONE'},
    {id:'params',code:'02',name:'参数项分析',metric:'7',unit:'/ 9 命中',desc:'12 参数 · 3 个差异缺口',state:'DONE'},
    {id:'voc',code:'03',name:'用户画像',metric:'12,480',unit:'评论',desc:'3 人群 · 6 项未满足',state:'DONE'},
    {id:'profit',code:'04',name:'利润模型',metric:'34.3',unit:'% 毛利',desc:'4 供应方案 · 保本广告费',state:'DONE'},
    {id:'compliance',code:'05',name:'安全合规',metric:'32',unit:'/ 100',desc:'7 敏感词 · 2 专利预警',state:'DONE'},
    {id:'opportunity',code:'06',name:'市场机会',metric:'78',unit:'/ 100',desc:'可以做（有条件）· 90 天路径',state:'DONE'},
    {id:'listing',code:'07',name:'Listing 框架',metric:'30',unit:'SKU',desc:'标题 · 五点 · A+ · 变体',state:'DONE'},
    {id:'promotion',code:'08',name:'推广策略',metric:'5',unit:'活动',desc:'90 天节奏 · 11 广告组',state:'DONE'},
    {id:'flow',code:'08F',name:'流量波动专项',metric:'7',unit:'主推词',desc:'4/8 周切换 · 进阶判定矩阵',state:'DONE'},
    {id:'report',code:'R',name:'决策报告',metric:'10',unit:'板块',desc:'可实施性结论 · 打印导出',state:'READY'}
  ];

  function ring(score){
    const circ=2*Math.PI*42;
    return '<div class="score-ring"><svg viewBox="0 0 100 100">'
      +'<circle class="ring-bg" cx="50" cy="50" r="42"/>'
      +'<circle class="ring-fg" cx="50" cy="50" r="42" stroke-dasharray="'+CX.fmt.dec(circ*score/100,1)+' '+CX.fmt.dec(circ,1)+'"/>'
      +'</svg><div class="ring-txt"><b>'+score+'</b><span>OPPORTUNITY</span></div></div>';
  }

  function agentRows(){
    const rows=D.agents.filter(a=>CX.isEnabled(a.id));
    return rows.map(a=>{
      return '<div class="agent-row done" data-agent="'+a.id+'">'
        +'<div class="agent-ico">'+a.code.replace('AGENT-','')+'</div>'
        +'<div class="agent-main"><div class="agent-name">'+a.name+'</div><div class="agent-meta">'+agentOut(a)+' · '+a.time+'</div><div class="agent-bar"><i></i></div></div>'
        +'<div class="agent-state">DONE</div></div>';
    }).join('');
  }


  function agentOut(a){
    if(a.id==='profit') return '4 供应方案 · '+F.dec(PROF().margin,1)+'% 毛利';
    if(a.id==='opportunity') return '可以做（有条件）· '+F.dec(OSCORE(),1)+' 分';
    if(a.id==='compliance') return '7 敏感词 · 2 专利预警';
    return a.output;
  }
  function render(){
  function modCards(){
    return '<div class="mod-grid">'+modules.filter(m=>m.id!=='report'&&CX.isEnabled(m.id)).map(m=>{
      const inner='<div class="mod-top"><span class="mod-code">MODULE '+m.code+'</span><span class="mod-status">'+m.state+'</span></div>'
        +'<div class="mod-title">'+m.name+'</div>'
        +'<div class="mod-metric">'+(m.id==='profit'?F.dec(PROF().margin,1):m.metric)+'<small>'+m.unit+'</small></div>'
        +'<div class="mod-desc">'+m.desc+'</div>';
      return '<a class="mod-card" href="#/'+m.id+'">'+inner+'</a>';
    }).join('')+'</div>';
  }
    const coreOn=['market','params','voc','profit','compliance','opportunity'].filter(CX.isEnabled);
  function execOnly(){
    const mods=CX.MODULES.filter(m=>m.id!=='report'&&CX.isEnabled(m.id));
    return '<div class="page">'
      +'<div class="page-head"><div class="page-head-l"><div class="eyebrow">EXECUTION ONLY / 执行层</div><h1>执行层分析<span class="en">LISTING · PROMOTION · FLOW</span></h1>'
      +'<div class="page-sub">'+M.categoryCn+' · '+M.marketplace+' · 对标 '+CX.state.benchmark+' · 输入 '+CX.state.asins.length+' 个 ASIN</div></div>'
      +'<div class="head-actions"><span class="chip chip-cyan">执行层模式</span><span class="chip chip-dim">01–06 未启用</span></div></div>'

      +'<section class="panel" style="margin-bottom:14px"><div class="panel-hd"><div><div class="panel-title">本次运行范围</div><div class="panel-sub">只做 Listing、推广与流量波动，不产出机会分、利润与合规结论</div></div><div class="panel-tools">'+chip(mods.length+' 个板块','cyan')+'</div></div>'
        +'<div class="panel-bd">'+modCards()+'</div>'
        +'<div class="panel-foot"><span>需要完整结论时，新建一个全流程项目。</span><span class="spacer"></span><span class="c-cyan">EXECUTION ONLY</span></div></section>'

      +'<div class="grid g2">'
        +panel({idx:'E-01',title:'对标与输入',sub:'执行层只用这些参数',body:'<div class="mini-list">'
          +'<div class="mini-item"><span>对标 ASIN</span><b class="mono c-cyan">'+CX.state.benchmark+'</b></div>'
          +'<div class="mini-item"><span>输入 ASIN</span><b class="mono">'+CX.state.asins.join(' / ')+'</b></div>'
          +'</div>'})
        +panel({idx:'E-02',title:'建议下一步',sub:'按当前范围',body:'<div class="bullet-list">'
          +'<div class="bullet">先看 07 的标题与五点模板，再决定是否补 01–06 的市场证据。</div>'
          +'<div class="bullet">推广与流量结论都基于对标 ASIN，换对标会同步 08 与 08F。</div>'
          +'<div class="bullet">需要给老板看完整报告时，切回全流程重跑。</div>'
          +'</div>'})
      +'</div></div>';
  }
    if(!coreOn.length) return execOnly();
    const enabled=ACTIVE();
    return '<div class="page">'
      +'<div class="page-head"><div class="page-head-l"><div class="eyebrow">DECISION OVERVIEW / 决策总览</div><h1>竞品维度追踪台<span class="en">COMPETITOR DIMENSION TRACKER</span></h1>'
      +'<div class="page-sub">'+M.categoryCn+' · '+M.marketplace+' · 快照 '+M.snapshot+' · 窗口 '+CX.windowShort()+' · 输入 '+CX.state.asins.length+' 个 ASIN / '+ACTIVE()+' 个板块</div></div>'
      +'<div class="head-actions"><span class="chip chip-dim">IDEA / '+CX.fmt.esc(M.ideal.slice(0,18))+'…</span><span class="chip chip-cyan">CONFIDENCE 92%</span><span class="chip chip-mint">REQ 32 项 · 见 R-09</span><span class="head-stat"><b>'+enabled+'</b><small>ACTIVE MODULES</small></span></div></div>'

      +'<section class="panel verdict" style="margin-bottom:14px">'
        +'<div class="verdict-left">'+ring(OSCORE())+'<div class="verdict-grade">可实施<small>CONDITIONAL GO</small></div></div>'
        +'<div class="verdict-main"><h2>结论：<em>可以做</em> · 先用 600 套试单，跑通尺码和广告再放量</h2>'
          +'<div class="reason">美国站大盘在涨，3XL–5XL 真码供给少，头部 Listing 很少写加长下摆和无感标签。三件装卖 $'+F.dec(PROF().s.price,2)+'，无推广毛利 '+F.dec(PROF().margin,1)+'%，保本 CPC $'+F.dec(PROF().beCpc,2)+'，当前 $1.28，还有空间。</div>'
          +'<div class="reason-list">'+tag('大盘 +18.4%','good')+tag('3XL–5XL 供给缺口','hot')+tag('毛利 '+F.dec(PROF().margin,1)+'%','good')+tag('合规无硬阻断','violet')+tag('需规避 2 项专利','bad')+'</div></div>'
        +'<div class="verdict-side">'
          +'<div class="vs-row"><span>综合风险</span><b class="c-amber">中低 / 32</b></div>'
          +'<div class="vs-row"><span>证据置信度</span><b>92%</b></div>'
          +'<div class="vs-row"><span>建议首单</span><b>600 套</b></div>'
          +'<div class="vs-row"><span>目标毛利率</span><b>'+F.dec(PROF().margin,1)+'%</b></div>'
          +'<div class="vs-row"><span>回本周期</span><b>≈ 3.2 月</b></div>'
          +'<a class="link small" data-go="opportunity" style="margin-top:2px">查看机会裁决 →</a>'
        +'</div></section>'

      +'<div class="kpi-grid" style="margin-bottom:14px">'
        +kpi({label:'市场机会分',value:F.dec(OSCORE(),1),unit:'/100',delta:(OSCORE()-66>=0?'+':'')+F.dec(OSCORE()-66,1),foot:'品类基准 66',spark:[54,58,61,60,66,69,73,OSCORE()],color:'#38e1ff'})
        +kpi({label:'无推广毛利率',value:F.dec(PROF().margin,1),unit:'%',delta:(PROF().margin-28.6>=0?'+':'')+F.dec(PROF().margin-28.6,1)+'pp',foot:'$'+F.dec(PROF().gross,2)+' / 套',spark:[29,30,31,30,32,33,34,PROF().margin],color:'#2ee6a8'})
        +kpi({label:'有效产品池',value:'18',unit:'/30',delta:'+4',foot:'高相似 8 个',spark:[8,11,12,14,14,16,17,18],color:'#4f8cff'})
        +kpi({label:'当周主推词',value:'7',unit:'个',delta:'+2',foot:'SP 5 · SB 2',spark:[3,4,3,5,5,6,6,7],color:'#a78bfa'})
        +kpi({label:'合规风险分',value:'<span style="color:var(--amber)">32</span>',unit:'/100',delta:'-4',foot:'2 项专利预警',spark:[48,45,43,40,38,36,34,32],color:'#ffc857'})
      +'</div>'

      +'<div class="grid g21" style="margin-bottom:14px;align-items:start">'
        +panel({idx:'00',title:'八维评分雷达',sub:'归一化 0–100 · 实线为本项目，虚线为品类基准',body:
          '<div class="grid g2" style="gap:6px;align-items:center">'
          +C.radar({axes:scores.map(s=>({label:s.label})),series:[
            {name:'本项目',values:scores.map(s=>s.v),color:'#38e1ff',fill:'rgba(56,225,255,.10)'},
            {name:'品类基准',values:scores.map(s=>s.base),color:'#a78bfa',fill:'rgba(167,139,250,.05)'}
          ],size:330})
          +'<div>'+C.hbar(scores.map(s=>({label:s.label,value:s.v,cls:s.v>=78?'mint':s.v<70?'amber':'',labelW:72})))
          +'<div class="mini-note">评分 = 数据完整度 × 指标表现 × 置信系数；70 以下进入「需补证」区。</div></div>'
          +'</div>',foot:'<span>最高：市场分析 82</span><span class="spacer"></span><span>最低：Listing 68</span>'})
        +'<section class="panel agent-panel"><div class="panel-hd"><div><div class="panel-title">Agent 编排</div><div class="panel-sub">'+ACTIVE()+' 个板块各自跑，结果汇总到同一份报告</div></div><div class="panel-tools"><span class="chip chip-mint">'+ACTIVE()+' 个板块</span></div></div>'
          +'<div class="panel-bd"><div class="agent-list">'+agentRows()+'</div>'
          +'<div class="agent-foot"><div class="agent-progress"><span>PIPELINE</span><div class="mini-pulse"><i id="agentProgress" style="width:'+(CX.state.analysis&&CX.state.analysis.total?Math.round(CX.state.analysis.step/CX.state.analysis.total*100):0)+'%"></i></div></div><button class="btn btn-sm" id="runAgentsBtn"'+((CX.state.analysis&&CX.state.analysis.status==='running')?' disabled':'')+'>'+((CX.state.analysis&&CX.state.analysis.status==='running')?'分析中…':'重新编排')+'</button></div></div>'
          +'<div class="panel-foot"><span class="dot live"></span> <span id="analysisText">'+(CX.state.analysis&&CX.state.analysis.status==='running'?('分析中 '+CX.state.analysis.step+' / '+CX.state.analysis.total+' · 可以离开此页，进度在「历史项目」'):CX.state.lastRun?('最后编排 '+new Date(CX.state.lastRun).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})):'未开始')+'</span></div></section>'
      +'</div>'

      +'<section class="panel" style="margin-bottom:14px"><div class="panel-hd"><div><div class="panel-title">板块矩阵</div><div class="panel-sub">当前范围只显示已启用板块；点击进入单板块明细</div></div><div class="panel-tools">'+chip(ACTIVE()+' MODULES','cyan')+'</div></div>'
        +'<div class="panel-bd">'+modCards()+'</div></section>'

      +'<div class="grid g12" style="margin-bottom:14px">'
        +panel({idx:'D-01',title:'结论摘要',sub:'每条都能回到对应板块',body:(function(){
          const items=[
            {n:'01',t:'市场',txt:'大盘 GMV <b>$8.74M / 月</b>，同比 <b>+18.4%</b>；均价上移 +3.1%，但 CR5 下降 2.8pp，说明头部并未锁死货架。',tags:['3 个价格带空位','新品占比 14.2%']},
            {n:'02',t:'产品',txt:'12 项参数中命中 <b>7 项</b>；3XL–5XL 真码、加长下摆、无感标签构成 <b>3 个差异化缺口</b>，头部覆盖率不足 25%。',tags:['200g 精梳棉','加长 3cm']},
            {n:'03',t:'利润',txt:'采购 ¥'+(PROF().src.costCny)+' / 套、头程 $'+F.dec(PROF().src.head,2)+'、FBA $'+F.dec(PROF().src.fba,2)+'、退货 '+F.dec(PROF().s.returnRate,1)+'% 后，<b>无推广毛利 '+F.dec(PROF().margin,1)+'%</b>；保本广告费 $'+F.dec(PROF().gross,2)+'，可承受 CPC $'+F.dec(PROF().beCpc,2)+'。',tags:['无券口径','不含广告']},
            {n:'04',t:'执行',txt:'对标 90 天内以 <b>15% 券 + 高竞价精确词</b>启动，第 5 周切至 SBV；主推词自然排名在投放后 <b>2 周</b>开始进阶。',tags:['5 活动','11 广告组']}
          ];
          return '<div class="insight-list">'+items.map(i=>'<div class="insight"><span class="insight-n">'+i.n+'</span><div><b>'+i.t+' · </b>'+i.txt+'<div class="reason-list" style="margin-top:5px">'+i.tags.map(t=>tag(t)).join('')+'</div></div></div>').join('')+'</div>';
        })(),foot:'<span class="source">SELLERSPRITE</span><span class="source">SIF</span><span class="source">1688</span><span class="source">VOC 12,480</span>'})
        +panel({idx:'D-02',title:'风险与前置条件',sub:'继续或暂停的条件',body:
          '<div class="mini-list">'
          +'<div class="mini-item"><span class="dot rose"></span><span>尺码退货率 > 13%</span><b class="c-rose">高</b></div>'
          +'<div class="mini-item"><span class="dot amber"></span><span>同质化价格战</span><b class="c-amber">中</b></div>'
          +'<div class="mini-item"><span class="dot amber"></span><span>2 项外观专利预警</span><b class="c-amber">中</b></div>'
          +'<div class="mini-item"><span class="dot cyan"></span><span>CPC 同比 +11.3%</span><b class="c-cyan">可控</b></div>'
          +'</div>'
          +'<div class="divider"></div>'
          +'<div class="bullet-list">'
          +'<div class="bullet">首单 <b>600 套</b>，先测 3 色 × 3 码，30 天动销 <b>≥ 45%</b></div>'
          +'<div class="bullet">上架前完成 <b>专利规避设计</b> 与尺码实测视频</div>'
          +'<div class="bullet">广告预算 <b>$45/日</b> 启动，ACOS 上限 <b>38%</b></div>'
          +'</div>'
          +'<div class="callout callout-warn" style="margin-top:11px">若 30 天退货率 > 15% 或自然排名未进前 24，暂停补货并回到 03 / 07 板块复盘。</div>',foot:'<span>决策门 · 2026-05-18</span><span class="spacer"></span><span class="c-amber">需人工复核 2 项</span>'})
      +'</div>'

      +'<section class="panel"><div class="panel-hd"><div><div class="panel-title">分析输入与数据口径</div><div class="panel-sub">输入 1–5 个 ASIN + 选品想法；模块 07–08 使用独立对标 ASIN</div></div><div class="panel-tools"><span class="chip chip-cyan">SNAPSHOT 2026-04-18</span></div></div><div class="panel-bd"><div class="grid g3">'
        +'<div><div class="field-label" style="margin-bottom:5px">INPUT ASINS</div>'+CX.state.asins.map(a=>'<div class="copy-row" style="margin-bottom:4px"><span class="mono">'+a+'</span><span class="chip chip-dim">'+(a==='B0D2H8YQ7K'?'MAIN':'SEED')+'</span></div>').join('')+'</div>'
        +'<div><div class="field-label" style="margin-bottom:5px">IDEAL PRODUCT</div><div class="callout" style="min-height:92px">'+CX.fmt.esc(CX.state.ideal)+'</div></div>'
        +'<div><div class="field-label" style="margin-bottom:5px">BENCHMARK / METHOD</div><div class="mini-list"><div class="mini-item"><span>对标 ASIN</span><b class="mono c-cyan">'+CX.state.benchmark+'</b></div><div class="mini-item"><span>数据窗口</span><b>'+CX.windowShort()+'</b></div><div class="mini-item"><span>价格口径</span><b>无券毛利 / 券后观测</b></div><div class="mini-item"><span>推测粒度</span><b>ASIN → 广告组</b></div></div></div>'
        +'</div></div></section>'
      +'</div>';
  }

  CX.register('overview',{title:'决策总览',render:render,after:function(view){
    const btn=view.querySelector('#runAgentsBtn');
    if(btn) btn.addEventListener('click',()=>CX.runAgents(false));
  }});
})();
