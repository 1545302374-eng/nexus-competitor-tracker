/* ============================================================
   AGENT-01 · 市场分析 + 1.1 产品池
   ============================================================ */
(function(){
  const CX=window.CX, D=CX.data, M=D.meta, F=CX.fmt, C=CX.charts, U=CX.ui;
  const pool=D.pool;
  const monthLabels=['2025-11','2025-12','2026-01','2026-02','2026-03','2026-04'];

  const forms=[
    {
      id:'size',tab:'市场概况',title:'市场规模与增长',sub:'卖家精灵 · 市场分析 / 市场概况',
      chart:()=>C.line({labels:monthLabels,series:[{name:'月 GMV',values:[6.82,7.04,7.38,7.86,8.21,8.74],color:'#38e1ff'}],height:245,yFmt:v=>'$'+v.toFixed(1)+'M',tipFmt:v=>'$'+v.toFixed(2)+'M',refLines:[{y:7.68,label:'6 月均值 $7.68M'}]}),
      kpis:[{v:'$8.74M',l:'最新月 GMV'},{v:'+18.4%',l:'同比增速'},{v:'+28.1%',l:'6 月累计'}],
      insights:['大盘连续 <b>6 个月正增长</b>，4 月 GMV 创 12 个月新高，需求端没有明显降温信号。','增长主要由 <b>客单价上移</b>（+3.1%）和 <b>大码人群渗透</b>（+9.6%）共同驱动。','当前品类处于「成熟 + 稳增」阶段，适合以差异化供给进入，而非靠低价换量。'],
      verdict:'市场容量足够支撑单品月销 2,000–3,000 套，增长确定性高。'
    },
    {
      id:'search',tab:'搜索趋势',title:'搜索需求趋势',sub:'卖家精灵 · 市场分析 / 搜索趋势',
      chart:()=>C.line({labels:monthLabels,series:[{name:'月搜索量',values:[1.12,1.18,1.25,1.31,1.36,1.42],color:'#a78bfa'}],height:245,yFmt:v=>v.toFixed(2)+'M',tipFmt:v=>v.toFixed(2)+'M',refLines:[{y:1.28,label:'品类基线 1.28M'}]}),
      kpis:[{v:'1.42M',l:'月搜索量'},{v:'+12.6%',l:'同比'},{v:'0.42',l:'搜索/销量比'}],
      insights:['搜索量增速 <b>低于 GMV 增速</b>，说明增长更多来自转化率与客单价，而非单纯流量扩张。','大码相关长尾词搜索增速 <b>+19.2%</b>，高于品类均值，需求正在细分化。','4 月进入春季换装窗口，搜索峰值通常出现在 <b>5 月第 2 周</b>。'],
      verdict:'流量红利减弱，但精准大码词仍在扩张；应把预算压在长尾意图词上。'
    },
    {
      id:'price',tab:'价格分布',title:'价格带与销量结构',sub:'卖家精灵 · 市场分析 / 价格分布',
      chart:()=>C.bars({labels:['$15-20','$20-25','$25-30','$30-35','$35-40','$40-50'],series:[{name:'销量占比',values:[18,24,21,16,13,8],color:'#4f8cff'}],height:245,yFmt:v=>v+'%',tipFmt:v=>v+'%',barWidth:34,totalFmt:v=>v+'%'}),
      kpis:[{v:'$34.90',l:'品类均价'},{v:'$22.4',l:'销量重心'},{v:'13%',l:'$35-40 份额'}],
      insights:['$20–25 是销量最大的红海带（24%），但该带平均评分仅 <b>4.0</b>、退货率 <b>16.2%</b>，利润被退货吞噬。','$35–40 价格带仅占 13% 销量，却贡献 <b>21% GMV</b>，是「少而肥」的利润带。','三件装在该价格带的竞品仅 <b>4 个</b>，且无一同时覆盖 3XL–5XL 真码。'],
      verdict:'建议定价 $37.99–$39.99，避开 $19.99–$24.99 单件价格战。'
    },
    {
      id:'rating',tab:'评分评论',title:'评分结构与评论动能',sub:'卖家精灵 · 市场分析 / 评分与评论',
      chart:()=>C.donut({segments:[{name:'4.5+ 高口碑',value:22,color:'#2ee6a8'},{name:'4.2–4.5',value:31,color:'#38e1ff'},{name:'4.0–4.2',value:28,color:'#ffc857'},{name:'< 4.0',value:19,color:'#ff6b8a'}],center:{value:'4.21',label:'AVG RATING'},size:180,r:58}),
      kpis:[{v:'4.21',l:'平均评分'},{v:'+14.2%',l:'30 天评论增速'},{v:'22%',l:'4.5+ 占比'}],
      insights:['头部 4.5+ 高口碑 SKU 仅占 <b>22%</b>，且平均上架时间 > 24 个月，说明「高评分」仍是稀缺资产。','30 天新增评论 <b>8,420 条</b>，其中 1–3 星负面评论集中在 <b>领口变形 / 下摆偏短</b>。','新进入者若能在 90 天内把评分做到 <b>4.4+</b>，即可进入搜索结果第二页的信任门槛。'],
      verdict:'评分壁垒可被「版型 + 洗后不变形」的产品力击穿，存在 6–9 个月窗口。'
    },
    {
      id:'seller',tab:'卖家 / 品牌',title:'卖家类型与品牌集中度',sub:'卖家精灵 · 市场分析 / 卖家类型与品牌集中度',
      chart:()=>C.donut({segments:[{name:'3P FBA',value:68,color:'#38e1ff'},{name:'3P FBM',value:18,color:'#a78bfa'},{name:'Amazon 自营',value:14,color:'#ffc857'}],center:{value:'68%',label:'3P FBA SHARE'},size:180,r:58}),
      kpis:[{v:'41.6%',l:'CR5'},{v:'-2.8pp',l:'CR5 同比'},{v:'68%',l:'3P FBA 占比'}],
      insights:['3P FBA 占 <b>68%</b>，说明品类以第三方精铺/品牌卖家为主，供应链与广告能力决定胜负。','CR5 从 44.4% 降至 <b>41.6%</b>，头部集中度松动，新品牌有货架机会。','TOP1 品牌 HENLEY&CO 月销 3,120 套，仅占大盘 <b>1.25%</b>，未形成垄断。'],
      verdict:'竞争格局分散，存在以「大码专营 + 三件装」切入的品牌空位。'
    },
    {
      id:'launch',tab:'上架时间',title:'新品存活与上架结构',sub:'卖家精灵 · 市场分析 / 上架时间',
      chart:()=>C.bars({labels:['< 6 个月','6–12 个月','1–2 年','> 2 年'],series:[{name:'SKU 占比',values:[14.2,21.0,28.0,36.8],color:'#2ee6a8'}],height:245,yFmt:v=>v+'%',tipFmt:v=>v+'%',barWidth:44,totalFmt:v=>v+'%'}),
      kpis:[{v:'35.2%',l:'< 12 月新品'},{v:'18.6%',l:'新品成功率'},{v:'7.4',l:'月均新品数'}],
      insights:['过去 12 个月上架的新品占 <b>35.2%</b>，高于服装大类均值 27%，说明货架仍在换血。','新品 12 个月存活率 <b>18.6%</b>，失败原因中「尺码退货」占 41%、「同质化无差异」占 33%。','近 90 天新上架的 4 个 SKU 中，2 个已进入 BSR 前 5,000，切入窗口仍然开放。'],
      verdict:'新品窗口存在，但必须用「真码 + 加长」降低退货，否则 6 个月内会被淘汰。'
    },
    {
      id:'query',tab:'搜索词',title:'搜索词结构与意图分布',sub:'卖家精灵 · 市场分析 / 搜索词',
      chart:()=>C.hbar([{label:'henley shirts big tall',value:22,labelW:170},{label:'big and tall henley',value:18,labelW:170},{label:'men’s henley 3 pack',value:14,labelW:170},{label:'plus size henley',value:11,labelW:170},{label:'cotton henley men',value:9,labelW:170},{label:'henley t shirts men',value:7,labelW:170},{label:'longline henley',value:6,labelW:170},{label:'tagless henley',value:5,labelW:170},{label:'其他长尾',value:8,labelW:170}].map(i=>({...i,cls:i.value>=14?'mint':'',fmt:v=>v+'%'}))),
      kpis:[{v:'51%',l:'大码意图词'},{v:'+27%',l:'三件装词增速'},{v:'$1.28',l:'平均 CPC'}],
      insights:['大码意图词（big & tall / plus size）合计占搜索 <b>51%</b>，是主战场；泛词 henley t shirts 仅 7%。','三件装相关词搜索增速 <b>+27%</b>，但供给仅 <b>6 个</b> SKU，供需剪刀差明显。','「tagless henley」搜索量小但转化率 <b>4.8%</b>，是低成本差异化词。'],
      verdict:'关键词策略应以大码精确词为骨架，三件装 + 无感标签为差异化钩子。'
    }
  ];

  const formSummary=[
    ['01','市场概况','$8.74M / +18.4%','连续 6 月增长，容量充足','positive'],
    ['02','搜索趋势','1.42M / +12.6%','流量增速放缓，长尾扩张','neutral'],
    ['03','价格分布','$20–25 占 24%','红海低价带，$35–40 利润更优','warning'],
    ['04','评分评论','4.21 / 4.5+ 仅 22%','高评分稀缺，产品力可破局','positive'],
    ['05','卖家 / 品牌','CR5 41.6% / -2.8pp','集中度下降，货架未锁死','positive'],
    ['06','上架时间','新品占比 35.2%','换血活跃，窗口仍开放','positive'],
    ['07','搜索词','大码词 51% / 三件装 +27%','意图明确，供需剪刀差','positive']
  ];

  function kpiRow(){
    return '<div class="kpi-grid">'+D.market.kpis.map(k=>U.kpi({label:k.label,value:k.value,unit:k.unit,delta:k.delta,foot:k.foot,spark:k.label.indexOf('GMV')>=0?[6.82,7.04,7.38,7.86,8.21,8.74]:null,color:'#38e1ff'})).join('')+'</div>';
  }

  function formBody(idx){
    const f=forms[idx];
    return '<div class="grid g21" style="align-items:start">'
      +'<div><div class="field-label" style="margin-bottom:6px">'+F.esc(f.title)+' · '+F.esc(f.sub)+'</div>'+f.chart()
      +'<div class="chart-note"><span>数据源：SellerSprite / '+F.esc(M.marketplace)+'</span><span>窗口 2025-11 → 2026-04</span></div></div>'
      +'<div><div class="kpi-inline" style="margin-bottom:12px">'+f.kpis.map(k=>'<div><b>'+k.v+'</b><span>'+k.l+'</span></div>').join('')+'</div>'
      +'<div class="divider"></div>'
      +'<div class="insight-list">'+f.insights.map((x,i)=>'<div class="insight"><span class="insight-n">0'+(i+1)+'</span><div>'+x+'</div></div>').join('')+'</div>'
      +'<div class="callout callout-ok" style="margin-top:11px"><b>单项结论：</b>'+f.verdict+'</div></div></div>';
  }

  function tabs(){
    return '<div class="tabs">'+forms.map((f,i)=>'<button class="tab'+(i===0?' active':'')+'" data-form="'+i+'">'+f.tab+'<span class="cnt">0'+(i+1)+'</span></button>').join('')+'</div>';
  }

  function poolRows(){
    return pool.map(p=>{
      const rc=p.self?' self':p.benchmark?' bench':'';
      return '<tr class="'+rc+'" data-asin="'+p.asin+'" data-drawer="1" data-sim="'+p.sim+'" data-price="'+p.price+'" data-ads="'+p.ads+'" data-tag="'+F.esc(p.tag)+'">'
        +'<td><span class="main-cell">'+p.brand+'</span><span class="sub asin">'+p.asin+'</span></td>'
        +'<td><span style="display:block;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+F.esc(p.title)+'</span><span class="sub">'+p.size+' · '+p.pack+' · '+F.esc(p.material)+'</span></td>'
        +'<td class="num">'+F.money(p.price)+'</td>'
        +'<td><span class="'+(p.rating>=4.4?'c-mint':p.rating>=4.1?'':'c-rose')+'">'+F.dec(p.rating,1)+'</span><span class="sub">'+F.num(p.reviews)+' 评</span></td>'
        +'<td class="num">#'+F.num(p.bsr)+'</td>'
        +'<td class="num">'+F.num(p.sales)+'</td>'
        +'<td class="num">'+p.ads+'</td>'
        +'<td><div class="meter-cell">'+U.meter(p.sim,p.sim>=80?'mint':p.sim>=65?'':'amber')+'<span>'+p.sim+'</span></div></td>'
        +'<td><span class="tag '+(p.self?'good':p.benchmark?'violet':p.sim>=80?'hot':'')+'" style="font-size:9px">'+F.esc(p.tag)+'</span></td></tr>';
    }).join('');
  }

  function poolDrawer(p){
    const rev=p.price*p.sales;
    return '<div class="drawer-section"><h3>PRODUCT</h3><div style="font-size:11px;color:var(--txt-2);line-height:1.7">'+F.esc(p.title)+'</div>'
      +'<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:7px">'+U.tag(p.tag,p.tag.indexOf('低')>=0?'bad':p.tag.indexOf('高')>=0?'good':'hot')+U.tag(p.size)+U.tag(p.pack)+U.tag(p.fit)+'</div></div>'
      +'<div class="drawer-section"><h3>MARKET POSITION</h3><div class="kpi-inline" style="gap:12px">'
      +'<div><b>'+F.money(p.price)+'</b><span>PRICE</span></div><div><b>'+F.dec(p.rating,1)+'</b><span>RATING</span></div><div><b>'+F.num(p.reviews)+'</b><span>REVIEWS</span></div>'
      +'<div><b>#'+F.num(p.bsr)+'</b><span>BSR</span></div><div><b>'+F.num(p.sales)+'</b><span>月销</span></div><div><b>$'+F.compact(rev)+'</b><span>月 GMV</span></div></div></div>'
      +'<div class="drawer-section"><h3>PARAMETERS</h3><table class="tbl" style="min-width:0"><tbody>'
      +'<tr><td class="muted">品牌</td><td>'+p.brand+'</td></tr>'
      +'<tr><td class="muted">ASIN</td><td class="mono c-cyan">'+p.asin+'</td></tr>'
      +'<tr><td class="muted">尺码覆盖</td><td>'+p.size+'</td></tr>'
      +'<tr><td class="muted">包装</td><td>'+p.pack+'</td></tr>'
      +'<tr><td class="muted">面料</td><td>'+p.material+'</td></tr>'
      +'<tr><td class="muted">版型</td><td>'+p.fit+'</td></tr>'
      +'<tr><td class="muted">变体数</td><td>'+p.variants+'</td></tr>'
      +'<tr><td class="muted">广告位捕获</td><td>'+p.ads+' / 8 · 广告流量占比 '+p.adShare+'%</td></tr>'
      +'<tr><td class="muted">上架时间</td><td>'+p.launch+'</td></tr>'
      +'</tbody></table></div>'
      +'<div class="drawer-section"><h3>SIMILARITY MODEL</h3>'
      +'<div class="score-row" style="grid-template-columns:64px 1fr 40px"><span class="lbl">相似度</span><span class="track mint"><i style="width:'+p.sim+'%"></i></span><span class="val">'+p.sim+'</span></div>'
      +'<div class="drawer-note" style="margin-top:8px">相似度 = 版型 35% + 面料 20% + 尺码带 20% + 包装 15% + 价格带 10%。≥80 纳入核心产品池。</div></div>'
      +'<div style="display:flex;gap:7px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" data-bench="'+p.asin+'">设为 07 / 08 对标 ASIN</button><button class="btn btn-sm" data-copy="'+p.asin+'">复制 ASIN</button><a class="btn btn-sm" href="#/promotion" data-go="promotion">看推广拆解</a></div>';
  }

  function render(){
    return '<div class="page">'
      +'<div class="page-head"><div class="page-head-l"><div class="eyebrow">MODULE 01 / MARKET ANALYSIS</div><h1>市场分析<span class="en">MARKET INTELLIGENCE</span></h1>'
      +'<div class="page-sub">看卖家精灵 7 个表单，挑出 18 个同类竞品放进产品池，最后给一条合并结论。产品池上限 30 个。</div></div>'
      +'<div class="head-actions"><span class="chip chip-cyan">SELLERSPRITE</span><span class="chip chip-dim">US · 2026-04</span><button class="btn btn-ghost" data-report="market" data-label="市场分析">加入报告</button></div></div>'
      +kpiRow()

      +'<div class="section-gap"></div>'
      +'<section class="panel" style="margin-bottom:14px"><div class="panel-hd"><div><div class="panel-title"><span class="idx">01</span>市场分析 · 表单逐项拆解</div><div class="panel-sub">每个表单先给出单项结论，再进入 1.1 产品池与合并裁决</div></div><div class="panel-tools">'+U.chip('7 / 7 已分析','mint')+U.chip('CONFIDENCE 94%','cyan')+'</div></div>'
        +'<div class="panel-bd">'+tabs()+'<div id="formBody">'+formBody(0)+'</div></div>'
        +'<div class="panel-foot"><span class="dot live"></span> SellerSprite 市场分析导出 · 2026-04-18 09:30</div></section>'

      +'<div class="grid g12" style="margin-bottom:14px">'
        +U.panel({idx:'01-S',title:'7 个表单的单项结论',sub:'用于追溯合并结论的证据链',flush:true,body:'<div class="table-wrap"><table class="tbl" style="min-width:560px"><thead><tr><th>#</th><th>表单</th><th>关键读数</th><th>单项判断</th></tr></thead><tbody>'
          +formSummary.map(r=>'<tr><td class="mono muted">'+r[0]+'</td><td class="main-cell">'+r[1]+'</td><td class="num">'+r[2]+'</td><td>'+U.badge(r[3],r[4])+'</td></tr>').join('')
          +'</tbody></table></div>',foot:'<span>7 个表单 · 全部完成</span><span class="spacer"></span><span class="c-mint">无阻断项</span>'})
        +U.panel({idx:'01-C',title:'合并结论',sub:'市场容量 × 竞争结构 × 进入窗口',body:
          '<div class="verdict-main" style="padding:0"><h2 style="font-size:15px">市场值得进入，但必须避开 <em style="color:var(--amber)">$20–25 低价带</em></h2>'
          +'<div class="reason" style="margin-top:8px;font-size:10.5px">'+D.market.conclusion+'</div></div>'
          +'<div class="divider"></div>'
          +'<div class="stat-table"><table class="stat-table">'
          +'<tr><td>可服务市场（3XL–5XL 三件装）</td><td>$1.14M / 月</td></tr>'
          +'<tr><td>目标价格带竞争 SKU</td><td>4 个</td></tr>'
          +'<tr><td>供给缺口评分</td><td class="c-mint">82 / 100</td></tr>'
          +'<tr><td>建议进入方式</td><td>小批量测款 → 广告放大</td></tr></table></div>'
          +'<a class="btn btn-primary btn-sm" style="margin-top:11px" data-go="params">进入参数项分析 →</a>'})
      +'</div>'

      +'<div class="section-head" style="display:flex;align-items:center;gap:11px;margin:4px 0 12px"><span class="sec-num">1.1</span><span class="sec-title">产品池 · 同类型相似竞品</span><span class="sec-desc">找得到几个算几个，最多 30 个；按相似度排序</span><span class="sec-line"></span></div>'

      +'<section class="panel"><div class="panel-hd"><div><div class="panel-title"><span class="idx">POOL</span>18 个相似竞品</div><div class="panel-sub">相似度 ≥80 纳入核心池 · 覆盖三件装 / 单件 / 多件装 / 材质差异</div></div><div class="panel-tools">'+U.chip('18 / 30','cyan')+U.chip('8 高相似','mint')+'</div></div>'
        +'<div class="panel-bd" style="padding-bottom:10px"><div class="filterbar">'
        +'<div class="seg" id="poolFilters"><button class="seg-btn active" data-filter="all">全部 <span style="color:var(--muted-2)">18</span></button><button class="seg-btn" data-filter="high">高相似 <span style="color:var(--muted-2)">8</span></button><button class="seg-btn" data-filter="price">$30–45</button><button class="seg-btn" data-filter="ads">广告活跃</button><button class="seg-btn" data-filter="plus">大码专营</button></div>'
        +'<div class="spacer"></div><div class="search"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m15 15 5 5" stroke="currentColor" stroke-width="1.6"/></svg><input class="input" id="poolSearch" placeholder="搜索品牌 / ASIN / 参数"></div>'
        +'<button class="btn btn-sm" id="poolExport">导出</button></div></div>'
        +'<div class="table-wrap mid"><table class="tbl" id="poolTable" style="min-width:1000px"><thead><tr><th>品牌 / ASIN</th><th>标题 / 关键参数</th><th class="num">价格</th><th>评分 / 评论</th><th class="num">BSR</th><th class="num">月销</th><th class="num">广告位</th><th>相似度</th><th>标签</th></tr></thead><tbody>'+poolRows()+'</tbody></table></div>'
        +'<div class="tbl-foot"><span>显示 <b id="poolCount">18</b> / 18 · 上限 30</span><span>点击任意行查看参数与广告位详情</span><span class="c-cyan">SIMILARITY MODEL v2</span></div></section>'
      +'</div>';
  }

  CX.register('market',{title:'市场分析',render:render,after:function(view){
    view.querySelectorAll('.tab[data-form]').forEach(t=>{
      t.addEventListener('click',()=>{
        view.querySelectorAll('.tab[data-form]').forEach(x=>x.classList.remove('active'));
        t.classList.add('active');
        view.querySelector('#formBody').innerHTML=formBody(Number(t.dataset.form));
      });
    });

    const rows=Array.from(view.querySelectorAll('#poolTable tbody tr'));
    let activeFilter='all';
    function apply(){
      const q=(view.querySelector('#poolSearch').value||'').trim().toLowerCase();
      let n=0;
      rows.forEach(r=>{
        const p=pool.find(x=>x.asin===r.dataset.asin);
        let ok=true;
        if(activeFilter==='high') ok=Number(r.dataset.sim)>=80;
        if(activeFilter==='price') ok=Number(r.dataset.price)>=30&&Number(r.dataset.price)<=45;
        if(activeFilter==='ads') ok=Number(r.dataset.ads)>=4;
        if(activeFilter==='plus') ok=/大码专营|主推|对标/.test(r.dataset.tag);
        if(q) ok=ok && (p.asin+' '+p.brand+' '+p.title+' '+p.material+' '+p.size).toLowerCase().indexOf(q)>=0;
        r.style.display=ok?'':'none'; if(ok)n++;
      });
      view.querySelector('#poolCount').textContent=n;
    }
    view.querySelectorAll('#poolFilters .seg-btn').forEach(b=>{
      b.addEventListener('click',()=>{
        view.querySelectorAll('#poolFilters .seg-btn').forEach(x=>x.classList.remove('active'));
        b.classList.add('active'); activeFilter=b.dataset.filter; apply();
      });
    });
    view.querySelector('#poolSearch').addEventListener('input',apply);

    rows.forEach(r=>{
      r.addEventListener('click',()=>{
        const p=pool.find(x=>x.asin===r.dataset.asin);
        CX.openDrawer({eyebrow:'PRODUCT POOL / '+p.asin,title:p.brand,body:poolDrawer(p),after:function(bd){
          const b=bd.querySelector('[data-bench]');
          if(b) b.addEventListener('click',()=>{
            CX.state.benchmark=p.asin;
            CX.state.listingBench=p.asin;
            CX.saveConfig();
            CX.refreshTopbar();
            CX.toast('已切换对标 ASIN '+p.asin,'ok');
            const cur=CX.state.current;
            if(cur==='listing'||cur==='promotion'||cur==='flow') CX.rerender();
            CX.closeDrawer();
          });
        }});
      });
    });
    const exp=view.querySelector('#poolExport');
    if(exp) exp.addEventListener('click',()=>{
      const rows=[['ASIN','品牌','标题 / 参数','价格','评分','评论','BSR','月销','广告位','相似度','标签']];
      view.querySelectorAll('#poolTable tbody tr').forEach(tr=>{
        if(tr.style.display==='none') return;
        rows.push(Array.from(tr.children).map(td=>td.innerText.replace(/\s+/g,' ').trim()));
      });
      CX.exportCSV('nexus-product-pool.csv',rows);
    });
  }});
})();
