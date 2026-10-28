/* ============================================================
   AGENT-06 · 市场机会 / 裁决
   ============================================================ */
(function(){
  const CX=window.CX, F=CX.fmt, C=CX.charts, U=CX.ui, D=CX.data;
  const scoreParts=[
    {name:'需求强度',v:86,w:25,note:'大盘 +18.4%；大码意图词 +19.2%'},
    {name:'竞争结构',v:62,w:15,note:'CR5 41.6%，但同质化 SKU 仍多'},
    {name:'利润空间',v:71,w:20,note:'无推广毛利 34.3%，保本 CPC $1.41'},
    {name:'差异化',v:82,w:20,note:'真码 / 下摆 / 无感标 3 个缺口'},
    {name:'合规可控',v:74,w:10,note:'0 硬阻断，2 项 FTO 可规避'},
    {name:'供应链',v:80,w:10,note:'4 套 1688 方案，MOQ 50–200'}
  ];
  /* 利润维度跟随 04 的实时模型；其余维度为常量证据 */
  function parts(){
    const m=(CX.profit&&CX.profit.calc)?CX.profit.calc().margin:34.3;
    return scoreParts.map(p=>p.name==='利润空间'
      ? Object.assign({},p,{v:Math.max(0,Math.min(100,Math.round(p.v*m/34.3))),note:'无推广毛利 '+CX.fmt.dec(m,1)+'%，保本 CPC $'+(CX.profit?CX.fmt.dec(CX.profit.calc().beCpc,2):'1.41')})
      : p);
  }
  function scoreOf(){ return Math.round(parts().reduce((n,p)=>n+p.v*p.w,0)/100*10)/10; }
  CX.opportunity={score:scoreOf,parts:parts};
  const sizeScore={'B0D2H8YQ7K':88,'B0C9K2M4P1':95,'B0B7T5R9L3':92,'B0D1F6H8J2':70,'B0D8P3Q6R7':84,'B0C4V7B9N1':62,'B0D5W2E8T4':88,'B0B2S8D4F6':72,'B0D9G1H5J8':80,'B0C6N2M8K4':70,'B0D3R7T1V9':60,'B0D7L4P2W5':58,'B0C1J9K3L7':62,'B0D6Q8S4U2':75,'B0B9M5N7P3':55,'B0D0A2B4C6':50,'B0C8E6F2G4':52,'B0D4H6J8K1':70};
  const points=D.pool.map(p=>({
    x:p.price,y:sizeScore[p.asin]||55,r:Math.max(3,Math.min(10,p.sales/340)),
    label:p.brand,short:p.brand,showLabel:!!(p.self||p.benchmark),color:p.self?'#38e1ff':p.benchmark?'#a78bfa':(p.sim>=80?'#2ee6a8':'#526b83')
  }));
  points.push({x:39.99,y:97,r:6,label:'建议切入区',short:'切入区',showLabel:true,color:'#ffc857'});

  function ring(score){
    const circ=2*Math.PI*42;
    return '<div class="score-ring"><svg viewBox="0 0 100 100"><circle class="ring-bg" cx="50" cy="50" r="42"/><circle class="ring-fg" cx="50" cy="50" r="42" stroke="#2ee6a8" stroke-dasharray="'+F.dec(circ*score/100,1)+' '+F.dec(circ,1)+'"/></svg><div class="ring-txt"><b>'+score+'</b><span>OPPORTUNITY</span></div></div>';
  }

  function render(){
    return '<div class="page">'
      +'<div class="page-head"><div class="page-head-l"><div class="eyebrow">MODULE 06 / GO-NO-GO DECISION</div><h1>市场机会<span class="en">OPPORTUNITY VERDICT</span></h1>'
      +'<div class="page-sub">结合 01–05 回答三件事：能不能做、为什么、先做什么。</div></div>'
      +'<div class="head-actions"><span class="chip chip-mint">CONDITIONAL GO</span><span class="chip chip-dim">评分模型</span>'+(CX.state.locked?'<span class="chip chip-amber">LOCKED</span>':'')+'<button class="btn btn-ghost" id="memoBtn">生成备忘录</button></div></div>'

      +'<section class="panel verdict" style="margin-bottom:14px">'
        +'<div class="verdict-left">'+ring(scoreOf())+'<div class="verdict-grade" style="font-size:30px">GO<small>CONDITIONAL</small></div></div>'
        +'<div class="verdict-main"><h2>结论：<em>值得做</em>，先用 600 套试单，30 天后按三个条件决定是否加注</h2>'
          +'<div class="reason">需求在涨，供给有缺口，利润扛得住，合规没有硬阻断。尺码退货和广告成本还不确定，先用一单验证，别一次压 3,000 套。</div>'
          +'<div class="reason-list">'+U.tag('大盘 +18.4%','good')+U.tag('真码缺口','hot')+U.tag('毛利 '+F.dec(CX.profit.calc().margin,1)+'%','good')+U.tag('0 硬阻断','violet')+'</div></div>'
        +'<div class="verdict-side">'
          +'<div class="vs-row"><span>首单数量</span><b>600 套</b></div>'
          +'<div class="vs-row"><span>目标售价</span><b>$'+F.dec(CX.profit.calc().s.price,2)+'</b></div>'
          +'<div class="vs-row"><span>启动资金</span><b>≈ $10.1K</b></div>'
          +'<div class="vs-row"><span>回本周期</span><b>3.2 月</b></div>'
          +'<a class="link small" data-go="profit" style="margin-top:2px">复核单位经济 →</a>'
        +'</div></section>'

      +'<div class="kpi-grid" style="margin-bottom:14px">'
        +U.kpi({label:'机会综合分',value:String(scoreOf()),unit:'/100',delta:(scoreOf()-66>=0?'+':'')+F.dec(scoreOf()-66,1),foot:'品类基准 66 · 切入线 72',spark:[54,58,61,60,66,69,73,scoreOf()],color:'#2ee6a8'})
        +U.kpi({label:'目标月销',value:'1,500',unit:'套',delta:'12 个月',foot:'占细分市场 6.4%',spark:[200,380,560,760,960,1160,1340,1500],color:'#38e1ff'})
        +U.kpi({label:'首单备货',value:'600',unit:'套',delta:'3 色 × 3 码',foot:'30 天售罄率目标 45%',spark:[300,400,450,500,550,580,600,600],color:'#a78bfa'})
        +U.kpi({label:'启动资金',value:'$10.1',unit:'K',delta:'含检测/FTO',foot:'备货 + 广告 + 合规',spark:[8.2,8.6,9,9.3,9.6,9.8,10,10.1],color:'#ffc857'})
        +U.kpi({label:'预计回本',value:'3.2',unit:'月',delta:'基准情景',foot:'月净利 ≈ $2.6K',spark:[6,5.6,5,4.4,4,3.7,3.4,3.2],color:'#4f8cff'})
      +'</div>'

      +'<div class="grid g21" style="margin-bottom:14px">'
        +U.panel({idx:'06-A',title:'机会分拆解',sub:'加权总分 '+F.dec(scoreOf(),1)+' / 100 · 证据来自 01–05',body:
          '<div class="score-list" style="gap:11px">'+parts().map(s=>'<div><div class="score-row" style="grid-template-columns:76px minmax(0,1fr) 30px 32px"><span class="lbl">'+s.name+'</span><span class="track '+(s.v>=80?'mint':s.v<65?'amber':'')+'"><i style="width:'+s.v+'%"></i></span><span class="val">'+s.v+'</span><span class="tiny dim" style="text-align:right">'+s.w+'%</span></div><div class="mini-note" style="padding-left:85px;margin-top:1px">'+s.note+'</div></div>').join('')+'</div>'
          +'<div class="callout callout-ok" style="margin-top:11px"><b>通过线：</b>加权分 ≥72 且无单项 ≤50。当前最低项为竞争结构 62，仍高于一票否决线。</div>',foot:'<span>权重：需求 25 / 利润 20 / 差异 20 / 竞争 15 / 合规 10 / 供应链 10</span>'})
        +U.panel({idx:'06-B',title:'价格 × 大码覆盖定位图',sub:'气泡 = 月销；右上角为「高价 + 大码」空位',body:
          C.scatter({height:330,points:points,xMin:17,xMax:47,yMin:30,yMax:102,xFmt:v=>'$'+F.dec(v,0),yFmt:v=>v,xLabel:'售价 USD',yLabel:'大码覆盖指数',legend:[{name:'我品',color:'#38e1ff'},{name:'对标头部',color:'#a78bfa'},{name:'高相似',color:'#2ee6a8'},{name:'其他',color:'#526b83'},{name:'建议切入',color:'#ffc857'}]})
          +'<div class="callout" style="margin-top:9px"><b>空位：</b>$38–$43 × 大码覆盖 ≥90 的区域仅有 HENLEY&CO，且其加长下摆 / 无感标覆盖不足。</div>',foot:'<span>覆盖指数 = 尺码带 × 版型 × 下摆长度</span>'})
      +'</div>'

      +'<div class="grid g12" style="margin-bottom:14px">'
        +U.panel({idx:'06-C',title:'四条依据',sub:'逐条对应前序板块',body:
          '<div class="insight-list">'
          +'<div class="insight"><span class="insight-n">01</span><div><b>需求确定：</b>大盘 GMV +18.4%，大码意图词搜索 +19.2%，且 4 月仍在加速。</div></div>'
          +'<div class="insight"><span class="insight-n">02</span><div><b>供给错位：</b>3XL–5XL 真码覆盖率仅 31%，加长下摆 22%，无感标签 18%。</div></div>'
          +'<div class="insight"><span class="insight-n">03</span><div><b>利润可用：</b>无推广毛利 34.3%，保本 CPC $1.41 > 当前 $1.28，有 10% 安全垫。</div></div>'
          +'<div class="insight"><span class="insight-n">04</span><div><b>合规可控：</b>0 硬阻断，2 项外观专利可通过改门襟 / 去侧拼片规避。</div></div>'
          +'</div>'
          +'<div class="divider"></div><div class="field-label" style="margin-bottom:6px;color:var(--rose)">NO-GO 的反证</div>'
          +'<div class="bullet-list">'
          +'<div class="bullet">同质化：18 个竞品中 8 个相似度 ≥80，价格战随时发生。</div>'
          +'<div class="bullet">退货：12.8% 基线，尺码问题占退货原因 41%。</div>'
          +'<div class="bullet">广告：CPC 同比 +11.3%，新链接冷启动至少 $45/日。</div>'
          +'</div>',foot:'<span class="c-mint">GO 条件成立</span><span class="spacer"></span><span class="c-rose">需用首单验证</span>'})
        +U.panel({idx:'06-D',title:'建议产品概念',sub:'CONCEPT v1.0 · 首批只做 3 色 × 3 码',body:
          '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">'
          +'<div style="width:118px;flex:none"><svg viewBox="0 0 120 122" style="width:100%"><defs><linearGradient id="shirt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#123149"/><stop offset="1" stop-color="#081521"/></linearGradient></defs>'
          +'<path d="M42 10 28 16 10 36l10 12 10-8v64c0 4 3 6 7 6h36c4 0 7-2 7-6V40l10 8 10-12-18-20-14-6c-3 8-9 12-16 12s-13-4-16-12z" fill="url(#shirt)" stroke="#38e1ff" stroke-opacity=".55"/>'
          +'<path d="M49 20h22M60 21v18" stroke="#38e1ff" stroke-opacity=".5"/><circle cx="60" cy="38" r="1.8" fill="#38e1ff"/><circle cx="60" cy="46" r="1.8" fill="#38e1ff"/><circle cx="60" cy="54" r="1.8" fill="#38e1ff"/>'
          +'<path d="M30 92h60" stroke="#38e1ff" stroke-opacity=".25" stroke-dasharray="3 3"/><text x="60" y="113" text-anchor="middle" fill="#526b83" font-family="monospace" font-size="7">210G / 3-PACK</text></svg></div>'
          +'<div style="flex:1;min-width:170px"><div style="font-size:13px;font-weight:600;letter-spacing:.3px">UEEKO Big &amp; Tall 210g Henley</div><div class="mini-note">3-Pack · Tagless · Longline Hem</div>'
          +'<div style="display:flex;gap:4px;margin-top:8px"><span class="swatch" style="background:#111" title="Black"></span><span class="swatch" style="background:#15243b" title="Navy"></span><span class="swatch" style="background:#737b82" title="Grey"></span><span class="tiny dim" style="margin-left:3px">Black / Navy / Grey</span></div>'
          +'<div class="reason-list" style="margin-top:8px">'+U.tag('3XL–5XL 真码')+U.tag('下摆 77cm')+U.tag('无感印标')+U.tag('$39.99')+'</div></div></div>'
          +'<table class="stat-table" style="margin-top:12px"><tr><td>首批 SKU</td><td>9（3 色 × 3 码）</td></tr><tr><td>首单数量</td><td>600 套</td></tr><tr><td>供应商</td><td>绍兴 A / 义乌 B 双备份</td></tr><tr><td>目标毛利率</td><td class="c-mint">34.3% → 35.4%</td></tr></table>'
          +'<button class="btn btn-primary btn-sm" style="width:100%;margin-top:9px" data-go="listing">进入 Listing 拆解 →</button>',foot:'<span>CONCEPT LOCKED</span><span class="spacer"></span><span>3 色 × 3 码</span>'})
      +'</div>'

      +'<section class="panel" style="margin-bottom:14px"><div class="panel-hd"><div><div class="panel-title"><span class="idx">06-E</span>90 天切入路径</div><div class="panel-sub">把「可实施」拆成三个阶段与可验收 KPI</div></div><div class="panel-tools">'+U.chip('DAY 0 → 90','cyan')+U.chip('3 GATES','mint')+'</div></div><div class="panel-bd"><div class="roadmap">'
        +'<div class="phase"><div class="phase-code">PHASE 01 / VALIDATE</div><div class="phase-title">验证产品与合规</div><div class="phase-time">DAY 0–30</div><ul class="phase-list"><li>210g 打样 + 5XL 真码纸样，洗后缩水 ≤3%</li><li>完成 2 项 FTO、4 项检测、Listing 1.0</li><li>首单 600 套，3 色 × 3 码，$39.99 上架</li></ul><div class="phase-kpi">GATE 01：<b>退货率 ≤ 12%</b> · 评分 ≥ 4.2 · 动销 ≥ 35%</div></div>'
        +'<div class="phase"><div class="phase-code">PHASE 02 / SCALE</div><div class="phase-title">广告放量 / 抢词</div><div class="phase-time">DAY 31–60</div><ul class="phase-list"><li>SP 自动 + 精确词双轨，日预算 $45 → $80</li><li>10% 券 + 三件装主图；追踪 7 个主推词</li><li>目标 BSR < 8,000，自然订单占比 ≥ 30%</li></ul><div class="phase-kpi">GATE 02：<b>ACOS ≤ 38%</b> · 自然排名进前 24 · 评分 ≥ 4.3</div></div>'
        +'<div class="phase"><div class="phase-code">PHASE 03 / DEFEND</div><div class="phase-title">稳排名 / 建壁垒</div><div class="phase-time">DAY 61–90</div><ul class="phase-list"><li>SBV + 品牌词防守；否掉竞品品牌词</li><li>补货 1,200 套，扩至 5 色</li><li>用 VOC 迭代 2.0：混色单件补货</li></ul><div class="phase-kpi">GATE 03：<b>自然订单 ≥ 45%</b> · 退货 < 11.5% · 月净利 ≥ $2.6K</div></div>'
        +'</div></div><div class="panel-foot"><span>任何 Gate 未通过：暂停补货，回到对应板块复盘</span><span class="spacer"></span><span class="c-amber">GATE 01 为 Go / No-Go 关键</span></div></section>'

      +'<div class="grid g12">'
        +U.panel({idx:'06-F',title:'风险与缓解',sub:'风险不是「知道」，而是「有触发器 + 有动作」',flush:true,body:
          '<div class="table-wrap"><table class="tbl" style="min-width:600px"><thead><tr><th>风险</th><th>等级</th><th>缓解动作</th><th>触发器</th></tr></thead><tbody>'
          +'<tr><td class="main-cell">尺码退货</td><td>'+U.badge('高','risk')+'</td><td>5XL 真码 + 实测视频 + 尺码表</td><td>退货 > 15% 暂停补货</td></tr>'
          +'<tr><td class="main-cell">同质化价格战</td><td>'+U.badge('高','risk')+'</td><td>不跟价，守 $37.99 底价</td><td>竞品降价 > 15%</td></tr>'
          +'<tr><td class="main-cell">外观专利</td><td>'+U.badge('中','warn')+'</td><td>4 扣 / 直下摆 / 无侧拼片</td><td>FTO 未过则改款</td></tr>'
          +'<tr><td class="main-cell">广告成本</td><td>'+U.badge('中','warn')+'</td><td>精确词 + 否词 + 预算上限</td><td>ACOS > 42% 降预算</td></tr>'
          +'<tr><td class="main-cell">季节性</td><td>'+U.badge('中','warn')+'</td><td>5 月前上架，8 月前放量</td><td>6 月未上架则延至 Q4</td></tr>'
          +'</tbody></table></div>',foot:'<span>5 项风险 · 均有触发器</span>'})
        +U.panel({idx:'06-G',title:'最终裁决备忘录',sub:'给老板 / 投资人的 30 秒版本',body:
          '<div class="callout callout-ok"><b>建议：</b>批准 600 套试单，预算上限 <b>$10.1K</b>，30 天后按 Gate 01 决策是否加注。</div>'
          +'<div class="stat-table" style="margin-top:8px"><table class="stat-table"><tr><td>首单货值 + 头程</td><td>$5.3K</td></tr><tr><td>合规 / FTO / 检测</td><td>$2.1K</td></tr><tr><td>60 天广告预算</td><td>$2.7K</td></tr><tr><td>合计启动资金</td><td class="c-cyan">$10.1K</td></tr></table></div>'
          +'<div class="callout callout-warn" style="margin-top:10px"><b>不批准的情形：</b>若无法接受 600 套试单、或要求 90 天内回本，则建议不做。</div>'
          +'<div style="display:flex;gap:7px;margin-top:10px"><button class="btn btn-primary btn-sm" data-go="report">查看完整报告</button><button class="btn btn-sm" id="lockBtn">'+(CX.state.locked?'已锁定裁决':'锁定裁决')+'</button></div>',foot:'<span>DECISION ID / NX-2026-0418</span>'})
      +'</div>'
      +'</div>';
  }

  CX.register('opportunity',{title:'市场机会',render:render,after:function(view){
    const memo=view.querySelector('#memoBtn');
    if(memo) memo.addEventListener('click',function(){
      const p=CX.profit.calc();
      const md=[
        '# NEXUS 裁决备忘录','',
        '- 生成时间：'+new Date().toLocaleString('zh-CN'),
        '- 对标 ASIN：'+CX.state.benchmark,
        '- 输入 ASIN：'+CX.state.asins.join(' / '),
        '- 选品想法：'+(CX.state.ideal||'—'),
        '- 机会综合分：'+F.dec(CX.opportunity.score(),1)+' / 100',
        '- 无推广毛利率：'+F.dec(p.margin,1)+'%（$'+F.dec(p.gross,2)+' / 套）',
        '- 保本 CPC：$'+F.dec(p.beCpc,2)+'，当前 $'+F.dec(CX.data.meta.stats.cpc,2),
        '- 合规：风险 32 / 100 · 0 硬阻断 · 2 项 FTO',
        '- 裁决状态：'+(CX.state.locked?'已锁定':'未锁定'),'',
        '## 六维拆解'
      ].concat(CX.opportunity.parts().map(function(x){ return '- '+x.name+'：'+x.v+' / 100（权重 '+x.w+'%）— '+x.note; })).concat([
        '','## 结论','可以做，但先下 600 套验证尺码退货和广告成本，再决定放量。'
      ]).join('\n');
      CX.exportText('nexus-memo-'+new Date().toISOString().slice(0,10)+'.md', md, 'text/markdown;charset=utf-8');
    });
    const lock=view.querySelector('#lockBtn');
    if(lock) lock.addEventListener('click',function(){
      CX.state.locked=!CX.state.locked; CX.saveConfig(); CX.rerender();
      CX.toast(CX.state.locked?'裁决已锁定':'已解除锁定','ok');
    });
  }});
})();
