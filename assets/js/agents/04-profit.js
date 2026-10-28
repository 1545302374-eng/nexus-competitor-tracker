/* ============================================================
   AGENT-04 · 利润模型
   ============================================================ */
(function(){
  const CX=window.CX, F=CX.fmt, C=CX.charts, U=CX.ui;
  const SOURCES=[
    {id:0,name:'绍兴柯桥 · 180g 棉氨',city:'绍兴',costCny:48,costUsd:6.72,head:2.10,fba:5.12,weight:'0.62kg',moq:100,carton:'60 套 / 箱',note:'当前供应，弹力好、克重偏低'},
    {id:1,name:'义乌 · 180g 精梳棉',city:'义乌',costCny:40,costUsd:5.60,head:1.85,fba:5.12,weight:'0.58kg',moq:200,carton:'80 套 / 箱',note:'最低成本，需接受 200 套起订'},
    {id:2,name:'广州 · 220g 厚磅',city:'广州',costCny:56,costUsd:7.84,head:2.38,fba:5.48,weight:'0.70kg',moq:50,carton:'50 套 / 箱',note:'抗起球最佳，成本最高'},
    {id:3,name:'泉州 · 棉麻混纺',city:'泉州',costCny:52,costUsd:7.28,head:2.22,fba:5.35,weight:'0.66kg',moq:100,carton:'60 套 / 箱',note:'夏季差异材质，受众较窄'}
  ];
  const rate=7.14, commissionRate=0.15, packaging=0.55, other=0.65, monthlyUnits=1500;

  function st(){ return {price:Number(CX.state.profit.price)||39.99, returnRate:Number(CX.state.profit.returnRate)||12.8, coupon:Number(CX.state.profit.coupon)||0, source:Number(CX.state.profit.source)||0}; }
  function calc(over){
    const s=Object.assign(st(),over||{});
    const src=SOURCES[s.source]||SOURCES[0];
    const costAdd=over&&over.costAdd?Number(over.costAdd):0;
    const cost=src.costUsd+costAdd;
    const ret=s.returnRate/100, commission=s.price*commissionRate, returns=s.price*ret;
    const total=cost+src.head+commission+src.fba+returns+packaging+other;
    const gross=s.price-total, margin=gross/s.price*100;
    const couponPrice=s.price*(1-s.coupon/100);
    const promoTotal=cost+src.head+couponPrice*commissionRate+src.fba+couponPrice*ret+packaging+other;
    const promoGross=couponPrice-promoTotal, promoMargin=promoGross/couponPrice*100;
    const adSpend=s.price*0.30, net=gross-adSpend;
    return {s,src,cost,costAdd,total,gross,margin,couponPrice,promoTotal,promoGross,promoMargin,returns,commission,adSpend,net,monthly:net*monthlyUnits,beCpc:gross*0.103,beRoas:s.price/gross,netMargin:net/s.price*100};
  }
  const BASE=calc({price:39.99,returnRate:12.8,source:0,coupon:10});
  CX.profit={calc:calc,sources:SOURCES,base:BASE};

  function kpiHTML(){
    const r=calc();
    return '<div class="kpi-grid">'
      +U.kpi({label:'无推广毛利 / 套',value:'$'+F.dec(r.gross,2),delta:(r.gross-BASE.gross>=0?'+':'')+F.dec((r.gross-BASE.gross)/BASE.gross*100,1)+'%',foot:'不扣优惠券',spark:[12.1,12.4,12.8,13.0,13.2,13.4,13.6,r.gross],color:'#2ee6a8'})
      +U.kpi({label:'无推广毛利率',value:F.dec(r.margin,1),unit:'%',delta:(r.margin-28.6>=0?'+':'')+F.dec(r.margin-28.6,1)+'pp',foot:'品类中位 28.6%',spark:[29,30,31,30,32,33,34,r.margin],color:'#38e1ff'})
      +U.kpi({label:'单套总成本',value:'$'+F.dec(r.total,2),unit:'',delta:F.dec(r.total/r.s.price*100,1)+'% 售价',deltaDir:'flat',foot:'采购 + 头程 + 尾程',spark:[25,25.4,25.8,26,26.1,26.2,26.2,r.total],color:'#ffc857'})
      +U.kpi({label:'保本广告费 / 套',value:'$'+F.dec(r.gross,2),delta:'CPC $'+F.dec(r.beCpc,2),foot:'CVR 10.3% 口径',spark:[12.1,12.4,12.8,13.0,13.2,13.4,13.6,13.73],color:'#a78bfa'})
      +U.kpi({label:'月净利 @1,500 套',value:'$'+F.num(r.monthly),delta:(r.net>=0?'+':'')+F.dec(r.net,2)+' /套',foot:'扣 30% 广告后',spark:[900,1200,1500,1800,2100,2300,2500,2595],color:'#4f8cff'})
      +'</div>';
  }

  function waterfallHTML(){
    const r=calc();
    const items=[
      {label:'售价',value:r.s.price,type:'start',color:'#4f8cff'},
      {label:'采购',value:-r.cost,type:'step'},
      {label:'头程',value:-r.src.head,type:'step'},
      {label:'佣金 15%',value:-r.commission,type:'step'},
      {label:'尾程 FBA',value:-r.src.fba,type:'step'},
      {label:'退货',value:-r.returns,type:'step'},
      {label:'包装质检',value:-packaging,type:'step'},
      {label:'其他',value:-other,type:'step'},
      {label:'毛利',value:r.gross,type:'total',color:'#2ee6a8'}
    ];
    return C.waterfall({items:items,height:300,yFmt:v=>'$'+F.dec(v,0),xNote:'退货费用 = 售价 × ' + F.dec(r.s.returnRate,1) + '%',yNote:'单位：USD / 套 · 不含广告'});
  }

  function costTableHTML(){
    const r=calc();
    const rows=[
      ['采购成本',r.cost,'1688 报价 ¥'+(r.src.costCny)+(r.costAdd?' +升级':'')+' / 7.14'],
      ['头程物流',r.src.head,'海运 0.62kg · 美西仓'],
      ['平台佣金 15%',r.commission,'Apparel 类目 · 按售价'],
      ['尾程 FBA',r.src.fba,'大号标准件 · 0.62kg'],
      ['退货费用',r.returns,'售价 × '+F.dec(r.s.returnRate,1)+'%'],
      ['包装 / 质检',packaging,'OPP 袋 + 尺寸复核'],
      ['其他',other,'汇损 / 贴标 / 仓储']
    ];
    return '<div class="table-wrap"><table class="tbl" style="min-width:0"><thead><tr><th>成本项</th><th class="num">USD / 套</th><th class="num">占售价</th><th>口径</th></tr></thead><tbody>'
      +rows.map(x=>'<tr><td class="main-cell">'+x[0]+'</td><td class="num">$'+F.dec(x[1],2)+'</td><td class="num">'+F.dec(x[1]/r.s.price*100,1)+'%</td><td class="tiny dim">'+x[2]+'</td></tr>').join('')
      +'<tr style="background:rgba(46,230,168,.04)"><td class="main-cell c-mint">合计成本</td><td class="num c-mint">$'+F.dec(r.total,2)+'</td><td class="num c-mint">'+F.dec(r.total/r.s.price*100,1)+'%</td><td class="tiny c-mint">毛利 $'+F.dec(r.gross,2)+'</td></tr>'
      +'</tbody></table></div>';
  }

  function scenarioHTML(){
    const cases=[
      {name:'当前方案',tag:'BASE',tone:'cyan',r:calc(),note:'$39.99 · 退货 12.8% · 180g'},
      {name:'优化方案',tag:'TARGET',tone:'mint',r:calc({costAdd:0.42,returnRate:10.7}),note:'210g + 真码 + 加长下摆'},
      {name:'风险情景',tag:'RISK',tone:'rose',r:calc({price:34.99,returnRate:16.0,coupon:15}),note:'降价 + 退货恶化'}
    ];
    return '<div class="grid g3">'+cases.map(c=>'<div class="phase" style="border-color:'+(c.tone==='mint'?'rgba(46,230,168,.25)':c.tone==='rose'?'rgba(255,107,138,.25)':'var(--line)')+'"><div style="display:flex;align-items:center;justify-content:space-between"><span class="phase-code" style="color:'+(c.tone==='mint'?'var(--mint)':c.tone==='rose'?'var(--rose)':'var(--cyan)')+'">'+c.tag+'</span>'+U.badge(c.tone==='mint'?'推荐':c.tone==='rose'?'压力测试':'基准',c.tone==='mint'?'ok':c.tone==='rose'?'risk':'info')+'</div>'
      +'<div class="phase-title">'+c.name+'</div><div class="phase-time">'+c.note+'</div>'
      +'<div style="display:flex;align-items:flex-end;gap:5px;margin-top:9px"><span class="num" style="font-size:26px;line-height:1;color:'+(c.tone==='mint'?'var(--mint)':c.tone==='rose'?'var(--rose)':'#fff')+'">'+F.dec(c.r.margin,1)+'%</span><span class="tiny dim">毛利率</span></div>'
      +'<div class="stat-table" style="margin-top:7px"><table class="stat-table"><tr><td>毛利 / 套</td><td>$'+F.dec(c.r.gross,2)+'</td></tr><tr><td>券后毛利</td><td>$'+F.dec(c.r.promoGross,2)+'</td></tr><tr><td>扣广告净利</td><td style="color:'+(c.r.net>=0?'var(--mint)':'var(--rose)')+'">$'+F.dec(c.r.net,2)+'</td></tr></table></div></div>').join('')+'</div>';
  }

  function sensitivityHTML(){
    const prices=[34.99,36.99,38.99,39.99,41.99,43.99];
    const rets=[8,10,12.8,15,18];
    const rows=rets.map(r=>({label:F.dec(r,1)+'%',sub:'退货率',values:prices.map(p=>{ const x=calc({price:p,returnRate:r,costAdd:0}); return Number(x.margin.toFixed(1)); })}));
    return C.heat({rows:rows,cols:prices.map(p=>({label:'$'+F.dec(p,2),sub:'售价'})),rowWidth:76,minValue:10,maxValue:42,palette:'mint',corner:'退货 / 售价',fmt:v=>F.dec(v,1)+'%',tipFmt:v=>'毛利率 '+F.dec(v,1)+'%'});
  }

  /* 04-C foot 与 04-E chart-note 的滑块联动文案：render 与 sync() 共用一份 calc() 口径 */
  function costFootHTML(){
    const r=calc();
    return '<span>合计成本占售价 '+F.dec(r.total/r.s.price*100,1)+'%</span><span class="spacer"></span><span class="c-mint">毛利 $'+F.dec(r.gross,2)+'</span>';
  }

  function sensNoteHTML(){
    const r=calc();
    return '绿度越高毛利越安全；当前 $'+F.dec(r.s.price,2)+' / '+F.dec(r.s.returnRate,1)+'% 位于 '+F.dec(r.margin,1)+'%';
  }

  function sourceTableHTML(){
    const current=Number(CX.state.profit.source)||0;
    return '<div class="table-wrap"><table class="tbl" style="min-width:720px"><thead><tr><th>供应方案</th><th class="num">1688 价</th><th class="num">折 USD</th><th class="num">头程</th><th>箱规 / MOQ</th><th>特点</th><th></th></tr></thead><tbody>'
      +SOURCES.map(s=>'<tr class="'+(s.id===current?'self':'')+'"><td class="main-cell">'+s.name+'<span class="sub">'+s.city+' · '+s.weight+'</span></td><td class="num">¥'+s.costCny+'</td><td class="num">$'+F.dec(s.costUsd,2)+'</td><td class="num">$'+F.dec(s.head,2)+'</td><td>'+s.carton+'<span class="sub">MOQ '+s.moq+' 套</span></td><td class="tiny dim">'+s.note+'</td><td>'+(s.id===current?U.badge('当前','ok'):'<button class="btn btn-sm" data-src="'+s.id+'">选用</button>')+'</td></tr>').join('')
      +'</tbody></table></div>';
  }

  function insightsHTML(){
    const r=calc();
    return '<div class="insight-list">'
      +'<div class="insight"><span class="insight-n">01</span><div>采购 + 尾程 + 退货合计占售价 <b>'+F.dec((r.cost+r.src.fba+r.returns)/r.s.price*100,1)+'%</b>，是利润的三个最大漏斗；采购谈判优先级高于广告优化。</div></div>'
      +'<div class="insight"><span class="insight-n">02</span><div>无推广毛利 <b>$'+F.dec(r.gross,2)+'</b> 即保本广告费；按 CVR 10.3% 折算，保本 CPC <b>$'+F.dec(r.beCpc,2)+'</b>，当前 CPC $1.28 仍有 10% 安全垫。</div></div>'
      +'<div class="insight"><span class="insight-n">03</span><div>扣 30% 广告后单套净利 <b>$'+F.dec(r.net,2)+'</b>（'+F.dec(r.netMargin,1)+'%）；月销 1,500 套时净利约 <b>$'+F.num(r.monthly)+'</b>，广告是利润开关。</div></div>'
      +'<div class="insight"><span class="insight-n">04</span><div>若退货率升至 16% 且降至 $34.99，毛利率跌至 <b>'+F.dec(calc({price:34.99,returnRate:16}).margin,1)+'%</b>，接近盈亏线；不要用降价换排名。</div></div>'
      +'</div>';
  }

  function render(){
    const s=st();
    return '<div class="page">'
      +'<div class="page-head"><div class="page-head-l"><div class="eyebrow">MODULE 04 / UNIT ECONOMICS</div><h1>利润模型<span class="en">PROFIT & COST INTELLIGENCE</span></h1>'
      +'<div class="page-sub">算清采购、头程、佣金、尾程和退货五项成本。这里的毛利不扣优惠券，券后价只在 08 做竞品观察。</div></div>'
      +'<div class="head-actions"><span class="chip chip-cyan">LIVE MODEL</span><span class="chip chip-dim">FX 7.14</span><button class="btn btn-ghost" data-report="profit" data-label="利润模型">加入报告</button></div></div>'
      +'<div id="pfKpis">'+kpiHTML()+'</div>'

      +'<div class="section-gap"></div>'
      +'<div class="grid g31" style="margin-bottom:14px">'
        +U.panel({idx:'04-A',title:'单套利润瀑布',sub:'从售价到无推广毛利 · 拖拽右侧参数实时重算',body:'<div id="waterfallBox">'+waterfallHTML()+'</div>',foot:'<span>退货费用 = 售价 × 退货率</span><span class="spacer"></span><span>不含广告费 / 不含券</span>'})
        +U.panel({idx:'04-B',title:'模型参数',sub:'改变价格、退货率或供应方案',body:
          '<div class="field" style="margin-bottom:14px"><div class="field-label">售价 / PRICE</div><div class="range-row"><input type="range" class="range" id="pfPrice" min="34.99" max="44.99" step="1" value="'+s.price+'"><span class="range-val" id="pfPriceVal">$'+F.dec(s.price,2)+'</span></div><div class="mini-note">券后价在 08 板块单独观测，不进入 01 / 06。</div></div>'
          +'<div class="field" style="margin-bottom:14px"><div class="field-label">退货率 / RETURN RATE</div><div class="range-row"><input type="range" class="range" id="pfReturn" min="6" max="20" step="0.1" value="'+s.returnRate+'"><span class="range-val" id="pfReturnVal">'+F.dec(s.returnRate,1)+'%</span></div><div class="mini-note">市场分析退货率基线 12.8%。</div></div>'
          +'<div class="field" style="margin-bottom:14px"><div class="field-label">优惠券 / COUPON（仅观测）</div><div class="range-row"><input type="range" class="range" id="pfCoupon" min="0" max="20" step="1" value="'+s.coupon+'"><span class="range-val" id="pfCouponVal">'+s.coupon+'%</span></div><div class="mini-note">无推广毛利不使用券后价；此处仅计算「券后毛利」对照。</div></div>'
          +'<div class="field" style="margin-bottom:12px"><div class="field-label">1688 供应方案 / SOURCE</div><select class="select" id="pfSource">'+SOURCES.map(x=>'<option value="'+x.id+'" '+(x.id===s.source?'selected':'')+'>'+x.name+' · ¥'+x.costCny+'</option>').join('')+'</select></div>'
          +'<div style="display:flex;gap:7px"><button class="btn btn-sm" id="pfReset">重置参数</button><span class="spacer"></span><span class="chip chip-mint" id="pfLive"><span class="dot live"></span> LIVE</span></div>'
          +'<div class="callout" style="margin-top:11px" id="pfCouponNote">券后毛利 $'+F.dec(calc().promoGross,2)+' / '+F.dec(calc().promoMargin,1)+'%，仅用于观测竞品价格动作。</div>'
        ,foot:'<span>模型 v2.1 · 单位经济</span>'})
      +'</div>'

      +'<div class="grid g12" style="margin-bottom:14px">'
        +U.panel({idx:'04-C',title:'成本结构明细',sub:'每套 3 件装 · 标准空运/海运组合',flush:true,body:'<div id="costTableBox">'+costTableHTML()+'</div>',foot:'<span id="costFoot" style="display:contents">'+costFootHTML()+'</span>'})
        +U.panel({idx:'04-D',title:'三情景对照',sub:'当前 / 优化 / 风险压力测试',body:'<div id="scenarioBox">'+scenarioHTML()+'</div>',foot:'<span class="c-mint">优化方案目标毛利 35%+</span><span class="spacer"></span><span>风险情景仅压测</span>'})
      +'</div>'

      +'<section class="panel" style="margin-bottom:14px"><div class="panel-hd"><div><div class="panel-title"><span class="idx">04-E</span>毛利率敏感性 · 售价 × 退货率</div><div class="panel-sub">保持采购与费用不变，观察价格与退货的双变量冲击</div></div><div class="panel-tools">'+U.chip('无券口径','dim')+U.chip('毛利率 %','mint')+'</div></div><div class="panel-bd"><div id="sensBox">'+sensitivityHTML()+'</div>'
        +'<div class="chart-note"><span>横轴：售价</span><span>纵轴：退货率</span><span id="sensNote">'+sensNoteHTML()+'</span></div></div></section>'

      +'<div class="grid g12" style="margin-bottom:14px">'
        +U.panel({idx:'04-F',title:'1688 供应方案对比',sub:'尺寸 / 箱规 / MOQ 均纳入头程与仓储测算',flush:true,body:'<div id="sourceTableBox">'+sourceTableHTML()+'</div>',foot:'<span>汇率 7.14 · 不含税</span><span class="spacer"></span><span>建议：先锁定方案 A，210g 升级版打样</span>'})
        +U.panel({idx:'04-G',title:'利润结论',sub:'定价与广告的边界条件',body:'<div id="profitInsights">'+insightsHTML()+'</div><div class="callout callout-warn" style="margin-top:11px"><b>口径提醒：</b>06 市场机会使用无券毛利；08 竞品推广策略中的券后价只用于还原竞品动作，不参与本项目定价。</div>',foot:'<span id="pfPriceFoot">建议定价 $'+F.dec(calc().s.price,2)+'</span><span class="spacer"></span><span class="c-mint" id="pfMarginFoot">毛利安全垫 '+F.dec(calc().margin-28.6,1)+'pp</span>'})
      +'</div>'
      +'</div>';
  }

  CX.register('profit',{title:'利润模型',render:render,after:function(view){
    let saveTimer=null;
    function persist(){ clearTimeout(saveTimer); saveTimer=setTimeout(()=>CX.saveConfig(),260); }
    function sync(){
      const r=calc();
      const k=view.querySelector('#pfKpis'); if(k) k.innerHTML=kpiHTML();
      const w=view.querySelector('#waterfallBox'); if(w) w.innerHTML=waterfallHTML();
      const c=view.querySelector('#costTableBox'); if(c) c.innerHTML=costTableHTML();
      const s=view.querySelector('#scenarioBox'); if(s) s.innerHTML=scenarioHTML();
      const sens=view.querySelector('#sensBox'); if(sens) sens.innerHTML=sensitivityHTML();
      const src=view.querySelector('#sourceTableBox'); if(src) src.innerHTML=sourceTableHTML();
      const ins=view.querySelector('#profitInsights'); if(ins) ins.innerHTML=insightsHTML();
      const note=view.querySelector('#pfCouponNote'); if(note) note.innerHTML='券后毛利 $'+F.dec(r.promoGross,2)+' / '+F.dec(r.promoMargin,1)+'%，仅用于观测竞品价格动作。';
      const cf=view.querySelector('#costFoot'); if(cf) cf.innerHTML=costFootHTML();
      const sn=view.querySelector('#sensNote'); if(sn) sn.textContent=sensNoteHTML();
      view.querySelector('#pfPriceVal').textContent='$'+F.dec(r.s.price,2);
      view.querySelector('#pfReturnVal').textContent=F.dec(r.s.returnRate,1)+'%';
      view.querySelector('#pfCouponVal').textContent=r.s.coupon+'%';
      const pf=view.querySelector('#pfPriceFoot'); if(pf) pf.textContent='建议定价 $'+F.dec(r.s.price,2);
      const mf=view.querySelector('#pfMarginFoot'); if(mf) mf.textContent='毛利安全垫 '+F.dec(r.margin-28.6,1)+'pp';
      persist();
    }
    view.querySelector('#pfPrice').addEventListener('input',e=>{ CX.state.profit.price=Number(e.target.value); sync(); });
    view.querySelector('#pfReturn').addEventListener('input',e=>{ CX.state.profit.returnRate=Number(e.target.value); sync(); });
    view.querySelector('#pfCoupon').addEventListener('input',e=>{ CX.state.profit.coupon=Number(e.target.value); sync(); });
    view.querySelector('#pfSource').addEventListener('change',e=>{ CX.state.profit.source=Number(e.target.value); sync(); });
    view.querySelector('#pfReset').addEventListener('click',()=>{ CX.state.profit={price:39.99,returnRate:12.8,source:0,coupon:10}; CX.saveConfig(); CX.rerender(); });
    view.querySelector('#sourceTableBox').addEventListener('click',e=>{
      const b=e.target.closest('[data-src]');
      if(!b) return;
      CX.state.profit.source=Number(b.dataset.src);
      view.querySelector('#pfSource').value=String(b.dataset.src);
      sync(); CX.toast('已切换供应方案：'+SOURCES[Number(b.dataset.src)].name,'ok');
    });
  }});
})();
