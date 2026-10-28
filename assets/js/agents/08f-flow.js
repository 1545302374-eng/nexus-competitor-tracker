/* ============================================================
   AGENT-08F · 流量波动专项 / TRAFFIC VOLATILITY
   判定阈值一字不差落地《竞品流量波动分析》一 / 二 / 三：
     一、自然排名进阶 3 条（T1–T3）
     二、主推词 4 条（M1–M4）
     三、投放力度 2 档（预算档 / 竞价档）
   口径：对标 B0C9K2M4P1，快照 2026-04-18 09:30，窗口 2026-01-25 → 2026-04-18（12 周）
   ============================================================ */
(function(){
  const CX=window.CX, F=CX.fmt, C=CX.charts, U=CX.ui, D=CX.data;

  /* ---------------- 全站一致口径 ---------------- */
  /* PROFILED = 已做过 SIF 拆解样本的 ASIN；对标切到其他 ASIN 时只做口径演示声明 */
  const PROFILED='B0C9K2M4P1';
  /* 对标 ASIN 在 render() 里重读 CX.state.benchmark，保证会话内切换立即生效 */
  let BENCH_ASIN=(CX.state&&CX.state.benchmark)||PROFILED;
  const BENCH_BRAND='HENLEY&CO';
  const SNAPSHOT='2026-04-18 09:30';
  const WINDOW_TEXT=()=>CX.windowLabel();
  const RETURN_RATE='12.8%';
  const CPC='$1.28';
  const OPPORTUNITY=78;
  const META=D.meta||{};
  const snapshotText=META.snapshot||SNAPSHOT;

  /* ---------------- 周维度流量（Session，与 08 推广策略同源同一组数） ---------------- */
  const WEEKS=[
    {w:'第1周', date:'01-25 → 01-31', aSess:3620,  nSess:4100},
    {w:'第2周', date:'02-01 → 02-07', aSess:4760,  nSess:5150},
    {w:'第3周', date:'02-08 → 02-14', aSess:6900,  nSess:6480},
    {w:'第4周', date:'02-15 → 02-21', aSess:9050,  nSess:7900},
    {w:'第5周', date:'02-22 → 02-28', aSess:11520, nSess:9350},
    {w:'第6周', date:'03-01 → 03-07', aSess:12350, nSess:10600},
    {w:'第7周', date:'03-08 → 03-14', aSess:10600, nSess:10050},
    {w:'第8周', date:'03-15 → 03-21', aSess:12150, nSess:12400},
    {w:'第9周', date:'03-22 → 03-28', aSess:14000, nSess:14650},
    {w:'第10周',date:'03-29 → 04-04', aSess:16050, nSess:17200},
    {w:'第11周',date:'04-05 → 04-11', aSess:18050, nSess:20300},
    {w:'第12周',date:'04-12 → 04-18', aSess:20900, nSess:24600}
  ];

  const chartWeek=w=>String(w.w).replace(/^第/,'').replace(/周$/,'')+'周';

  /* ---------------- 关键词周维度数据 ----------------
     spDays    SP(常规) 进 x 天：进搜索结果前 6 页的天数（0–7）
     spRank    SP(常规) 平均排名：越低越靠前
     natDays   自然搜索进 x 天
     natRank   自然搜索平均排名
     窗口内 SB 未建（08 广告架构 C1–C5 全部为 SP），故「广告流量」= SP 流量：
     预算档的「广告流量进 x 天」即 spDays，竞价档的「广告流量平均排名」即 spRank。 */
  const KEYWORDS=[
    {id:'KW-01', kw:'big and tall henley', vol:68400, layer:'大词', group:'AG-05 单词精准 · C3',
     spDays:[0,0,2,5,6,6,4,5,6,7,7,6],   spRank:[38,35,29,21,17,14,19,12,10,8,7,9],
     natDays:[0,0,0,0,4,5,3,5,6,6,7,7],  natRank:[34.4,32.1,29.8,26.2,23.4,20.8,22.6,17.4,14.2,12.6,11.5,10.8]},
    {id:'KW-02', kw:'big and tall shirts for men', vol:52100, layer:'大词', group:'AG-09 词组延展 · C4',
     spDays:[0,0,0,2,4,5,4,4,5,5,4,4],   spRank:[44,41,38,33,27,22,24,20,18,16,19,21],
     natDays:[0,0,0,0,1,2,4,6,7,7,7,7],  natRank:[41,38.2,35,31.4,27.6,22.4,19.8,17.4,13.2,12.6,11.8,11.2]},
    {id:'KW-03', kw:'plus size henley shirts', vol:41200, layer:'大词', group:'AG-06 买了没埋 · C3',
     spDays:[0,0,0,1,2,2,1,2,3,3,2,0],   spRank:[46,45,44,42,38,35,37,33,31,30,32,36],
     natDays:[0,0,0,0,0,0,0,0,1,1,1,0],  natRank:[46.2,45.8,45.1,44.6,43.9,43.2,43.8,42.6,41.2,40.4,41.1,42.8]},
    {id:'KW-04', kw:"men's henley shirts 3 pack", vol:27900, layer:'词根词', group:'AG-07 精准 2 词 · C3',
     spDays:[0,0,1,3,6,5,3,4,5,5,5,6],   spRank:[41,37,31,24,13,16,21,15,12,11,10,8],
     natDays:[0,0,0,1,2,4,6,7,7,7,7,7],  natRank:[40.8,38.2,34.6,24.2,17.8,13.6,16.2,12.4,11.6,10.4,9.8,9.2]},
    {id:'KW-05', kw:'henley shirts for men short sleeve', vol:33600, layer:'词根词', group:'AG-08 词组 · C4',
     spDays:[0,0,0,2,5,5,5,6,7,7,7,7],   spRank:[40,38,36,28,22,18,17,14,11,9,8,7],
     natDays:[0,0,0,0,2,3,5,7,7,7,7,7],  natRank:[41.6,39.4,36.8,30.2,24.6,21.2,19.4,15.8,12.2,10.6,9.8,9.4]},
    {id:'KW-06', kw:'cotton henley shirts men', vol:18700, layer:'词根词', group:'AG-11 广泛 · C5',
     spDays:[0,0,0,0,2,3,3,4,4,5,5,4],   spRank:[43,42,41,39,34,30,29,26,25,23,22,25],
     natDays:[0,0,0,0,0,1,1,2,3,3,4,4],  natRank:[44.8,43.9,43.2,42.6,41.8,40.9,41.4,39.8,38.6,37.9,36.4,36.9]},
    {id:'KW-07', kw:'tagless henley', vol:6400, layer:'长尾', group:'AG-10 多词精准 · C5',
     spDays:[0,0,0,0,0,0,3,3,4,4,4,5],   spRank:[45,44,44,43,42,40,31,28,26,25,24,22],
     natDays:[0,0,0,0,0,0,1,2,3,4,5,6],  natRank:[46.4,45.6,45.2,44.8,44.1,43.6,39.4,35.8,31.2,28.6,25.4,22.8]},
    {id:'KW-08', kw:'longline henley', vol:4900, layer:'长尾', group:'AG-10 未埋词 · C5',
     spDays:[0,0,0,0,1,1,2,2,3,3,6,6],   spRank:[47,46,46,45,44,43,42,40,39,37,36,35],
     natDays:[0,0,0,0,0,0,0,1,1,2,3,6],  natRank:[47.2,46.8,46.4,46,45.6,45.2,44.8,42.4,41,39.2,36.8,29.4]}
  ];

  /* ---------------- 派生读数 ---------------- */
  const IDX=WEEKS.map((_,i)=>i);
  const ADS=WEEKS.map(w=>w.aSess);
  const NAT=WEEKS.map(w=>w.nSess);
  const TOT=WEEKS.map(w=>w.aSess+w.nSess);
  const SHARE=WEEKS.map((w,i)=>w.aSess/TOT[i]*100);
  const RATIO=WEEKS.map(w=>w.aSess/w.nSess);
  const wow=(arr,i)=> i<=0 ? null : (arr[i]/arr[i-1]-1)*100;

  /* ---------------- 一、自然排名进阶 3 条 ---------------- */
  const NAT_RULES=[
    {id:'T1', name:'自然搜索出现天数增加 ≥3 天',
     note:'进 0 天→进 3 天、进 2 天→进 6 天',
     hit:(k,i)=> k.natDays[i]-k.natDays[i-1] >= 3},
    {id:'T2', name:'平均排名 >24 → ≤24',
     note:'自然搜索平均排名从 24 之后进入 24 以内',
     hit:(k,i)=> k.natRank[i-1] > 24 && k.natRank[i] <= 24},
    {id:'T3', name:'平均排名 >5 → ≤5',
     note:'自然搜索平均排名从 5 之后进入 5 以内',
     hit:(k,i)=> k.natRank[i-1] > 5 && k.natRank[i] <= 5}
  ];

  /* ---------------- 二、主推词 4 条 ----------------
     M2 的载体「SB 获得 x 天」在窗口内恒为 0：08 广告架构 C1–C5 共 5 个活动全部是 SP，
     竞品未建 SB。该判据仍然按原文实现（增量 ≥3 天），只是在本窗口 0 次命中，留作复核。 */
  const SB_DAYS=WEEKS.map(()=>0);
  const PUSH_RULES=[
    {id:'M1', name:'广告出现天数增加 ≥3 天',
     hit:(k,i)=> k.spDays[i]-k.spDays[i-1] >= 3},
    {id:'M2', name:'SB 获得 x 天增加 ≥3 天',
     hit:(k,i)=> SB_DAYS[i]-SB_DAYS[i-1] >= 3},
    {id:'M3', name:'SP 平均排名 >24 → ≤24',
     hit:(k,i)=> k.spRank[i-1] > 24 && k.spRank[i] <= 24},
    {id:'M4', name:'SP 平均排名 >5 → ≤5',
     hit:(k,i)=> k.spRank[i-1] > 5 && k.spRank[i] <= 5}
  ];

  /* ---------------- 三、投放力度 2 档 ---------------- */
  const TIER_NAME={high:'高',mid:'中',low:'低',off:'未投'};
  const TIER_BADGE={high:'ok',mid:'info',low:'warn',off:'neutral'};
  const TIER_ORDER={off:0,low:1,mid:2,high:3};
  function budgetTier(days){ return days>=5 ? 'high' : days>=3 ? 'mid' : days>=1 ? 'low' : 'off'; }
  function bidTier(rank){ return rank<=12 ? 'high' : rank<=24 ? 'mid' : rank<=48 ? 'low' : 'off'; }
  function tierBadge(t){ return U.badge(TIER_NAME[t],TIER_BADGE[t]); }
  function tierTrack(t){
    const v=t==='high'?100:t==='mid'?66:t==='low'?33:0;
    return '<div class="meter-cell">'+U.meter(v,t==='high'?'mint':t==='mid'?'':t==='low'?'amber':'rose')+'<span>'+TIER_NAME[t]+'</span></div>';
  }

  /* 明确变化（写清楚加大 / 减小 / 新开 / 关停） */
  function budgetAction(prev,cur){
    if(prev===0 && cur>0) return '新开';
    if(prev>0 && cur===0) return '关停';
    const a=TIER_ORDER[budgetTier(prev)], b=TIER_ORDER[budgetTier(cur)];
    return b>a ? '加投' : b<a ? '减投' : '维持';
  }
  function bidAction(prevRank,curRank,prevDays,curDays){
    if(curDays===0) return '—';
    if(prevDays===0) return '新开';
    const a=TIER_ORDER[bidTier(prevRank)], b=TIER_ORDER[bidTier(curRank)];
    return b>a ? '升档' : b<a ? '降档' : '维持';
  }
  const ACTION_TAG={'新开':'hot','加投':'good','减投':'bad','关停':'bad','升档':'good','降档':'bad','维持':'','—':''};
  const ACTION_TEXT={'建仓':'开始建广告','新开':'开始投','加投':'广告加量','减投':'广告减量','关停':'停止投','升档':'排名更靠前','降档':'排名更靠后','维持':'不变','—':'—'};
  const actionText=a=>ACTION_TEXT[a]||a;
  const kwName=id=>{ const k=KEYWORDS.filter(x=>x.id===id)[0]; return k?k.kw:id; };

  /* ---------------- 区间视图 ---------------- */
  function rangeN(){ return Number(CX.state.flowRange)===4 ? 4 : 8; }
  function rangeIdx(){ return IDX.slice(WEEKS.length-rangeN()); }

  /* ---------------- 判定执行 ---------------- */
  function natHits(k,i){ return i>0 ? NAT_RULES.filter(r=>r.hit(k,i)) : []; }
  function pushHits(k,i){ return i>0 ? PUSH_RULES.filter(r=>r.hit(k,i)) : []; }
  function pushesAt(i){
    const out=[];
    KEYWORDS.forEach(k=>{ const h=pushHits(k,i); if(h.length) out.push({k:k,hits:h}); });
    return out;
  }
  function pushCount(i){ return pushesAt(i).length; }
  function dominant(i){ return KEYWORDS.filter(k=>k.spDays[i]>=5); }
  function resultAt(k,i){
    if(!pushHits(k,i).length) return {state:'na'};
    const next=[i+1,i+2].filter(x=>x<WEEKS.length);
    if(!next.length) return {state:'pending'};
    const found=[];
    next.forEach(x=>{ const h=natHits(k,x); if(h.length) found.push({w:x,hits:h}); });
    if(found.length) return {state:'hit',found:found,partial:next.length<2};
    return {state:'miss',partial:next.length<2};
  }
  function eventList(){
    const out=[];
    rangeIdx().forEach(i=>{
      pushesAt(i).forEach(p=>{ out.push({w:i,k:p.k,hits:p.hits,res:resultAt(p.k,i)}); });
    });
    return out;
  }
  function gradedList(){ return eventList().filter(e=>e.res.state==='hit'||e.res.state==='miss'); }
  function hitRate(){ const g=gradedList(); if(!g.length) return null; return g.filter(e=>e.res.state==='hit').length/g.length*100; }

  /* 干预效果分：只看当周流量结果（广告 / 自然 / 占比）+ 当周主推词数，公式写在 08F-B 脚注 */
  function effectScore(i){
    if(i<=0) return null;
    const adW=wow(ADS,i), natW=wow(NAT,i), shareD=SHARE[i]-SHARE[i-1];
    const s=45 + Math.min(20, adW*0.7) + Math.min(20, natW*0.8) - Math.max(0,shareD)*1.5 + Math.min(6, pushCount(i)*3);
    return Math.max(0, Math.min(100, Math.round(s)));
  }
  function scoreCls(s){ return s>=75 ? 'mint' : s>=55 ? '' : 'amber'; }

  /* ---------------- 周度干预推断 ---------------- */
  const ACTIONS=[
    {act:'建仓', basis:'自动 + 商品投放开跑，3 个大词未上；高预算词 0 个，广告流量为窗口基线'},
    {act:'加投', basis:'自动组加价 15%，词组组未开；广告流量抬升，但 SP 进 x 天仍 ≤2，未过预算中档'},
    {act:'新开', basis:'15% 券 + 3 个大词精准同期开：KW-01 与 KW-04 首次进 x 天，新开词 2 个'},
    {act:'加投', basis:'大词精准组放量：KW-01 进 x 天 2→5（+3）、KW-04 1→3；高预算词 0→1'},
    {act:'加投', basis:'词组组上线 + 大词竞价 +20%（CPC 冲到 $1.62）：KW-05 进 x 天 2→5、KW-04 3→6；高预算词 1→3'},
    {act:'加投', basis:'自动组加否词 + 长尾组开：KW-02 进 x 天 4→5 转高预算，广告占比开始回落'},
    {act:'减投', basis:'15% 券到期、无 Deal：KW-01 6→4、KW-04 5→3 掉出高预算，高预算词 4→1'},
    {act:'加投', basis:'标价下调 $1 到 $38.99 + 词组扩词：KW-01 进 x 天 4→5 回到高预算'},
    {act:'加投', basis:'长尾扩量 + 商品投放加价：KW-04 4→5、KW-03 2→3、KW-08 2→3 三词同时加投'},
    {act:'加投', basis:'标价再降 $1 到 $37.99：KW-02 4→5、KW-06 4→5 进高预算；高预算词 3→5'},
    {act:'减投', basis:'广泛组收词 + 否掉他牌词：KW-02 5→4、KW-03 3→2 降档；同时 KW-08 3→6 单独放量'},
    {act:'减投', basis:'标价 $36.99、无券，广告诉求转向词组：KW-07 5→4 降档、KW-03 2→0 关停；广告占比降到 45.9%'}
  ];
  const ACTION_CLS={'建仓':'','加投':'good','减投':'bad','关停':'bad','新开':'hot','维持':''};

  /* ---------------- 8F-0 口径与阈值 ---------------- */
  function ruleRow(id, text, right){
    return '<div class="mini-item"><span class="mono c-cyan" style="width:38px;flex:none">'+id+'</span>'
      +'<span style="flex:1">'+text+'</span><b>'+right+'</b></div>';
  }
  function natRuleCount(id){
    const rule=NAT_RULES.filter(r=>r.id===id)[0];
    let c=0;
    rangeIdx().forEach(i=>{ KEYWORDS.forEach(k=>{ if(i>0 && rule.hit(k,i)) c++; }); });
    return c+' 次';
  }
  function pushRuleCount(id){
    const rule=PUSH_RULES.filter(r=>r.id===id)[0];
    let c=0;
    rangeIdx().forEach(i=>{ KEYWORDS.forEach(k=>{ if(i>0 && rule.hit(k,i)) c++; }); });
    return c+' 次';
  }
  /* 12 周窗口内两条「冲头部」判据的距离：自然平均排名 / SP 平均排名 的最好值 */
  const BEST_NAT_RANK=Math.min.apply(null, KEYWORDS.map(k=>Math.min.apply(null,k.natRank)));
  const BEST_SP_RANK=Math.min.apply(null, KEYWORDS.map(k=>Math.min.apply(null,k.spRank)));
  function pRules(){
    const last=WEEKS.length-1;
    const bh=KEYWORDS.filter(k=>budgetTier(k.spDays[last])==='high').length;
    const brh=KEYWORDS.filter(k=>bidTier(k.spRank[last])==='high').length;
    return U.panel({
      idx:'08F-0',
      title:'判断规则：什么算排名进步，什么算主推',
      sub:'把文档里的规则翻成大白话。右边数字是近 '+rangeN()+' 周命中的次数。',
      tools:U.chip('3 + 4 + 2 条','cyan')+U.chip('只看竞品动作','amber'),
      body:'<div class="grid g3" style="align-items:start">'
        +'<div><div class="field-label" style="margin-bottom:7px">一 · 自然排名进步（3 条）</div><div class="mini-list">'
          +ruleRow('T1','自然搜索出现天数增加 ≥3 天（0→3、2→6）',natRuleCount('T1'))
          +ruleRow('T2','平均排名从 24 名以后进入前 24',natRuleCount('T2'))
          +ruleRow('T3','平均排名从 5 名以后进入前 5',natRuleCount('T3'))
        +'</div><div class="mini-note">用自然搜索的出现天数和平均排名，判断这个词有没有真的往前排。</div></div>'
        +'<div><div class="field-label" style="margin-bottom:7px">二 · 什么算主推（4 条）</div><div class="mini-list">'
          +ruleRow('M1','广告出现天数增加 ≥3 天',pushRuleCount('M1'))
          +ruleRow('M2','品牌广告出现天数增加 ≥3 天',pushRuleCount('M2'))
          +ruleRow('M3','广告平均排名从 24 名以后进入前 24',pushRuleCount('M3'))
          +ruleRow('M4','广告平均排名从 5 名以后进入前 5',pushRuleCount('M4'))
        +'</div><div class="mini-note">命中任意一条，就算这个词当周被主推。四条满足一条即可，不要求全中。</div></div>'
        +'<div><div class="field-label" style="margin-bottom:7px">三 · 广告投得重不重（2 项）</div><div class="mini-list">'
          +ruleRow('广告天数','≥5 天为高，3–4 天为中，1–2 天为低','高 '+bh)
          +ruleRow('平均排名','1–12 名为高，13–24 名为中，25–48 名为低','高 '+brh)
        +'</div><div class="mini-note">广告天数看这个词一周被投了几天，平均排名看广告位有多靠前。两项分开看，可能一个升一个降。</div></div>'
      +'</div>'
      +'<div class="divider"></div>'
      +'<div class="grid g21" style="align-items:start">'
        +'<div><div class="callout"><b>怎么判断：</b>广告流量只统计 SP 商品广告；品牌广告 SB 在这个窗口没有投放，所以 M2 一次都没命中。广告天数、平均排名和动作标签都是根据公开数据推断，不是后台报表。</div>'
          +'<div class="mini-note">T3 / M4 在这个窗口没有命中，因为竞品自然平均排名最好 '+F.dec(BEST_NAT_RANK,1)+'、广告平均排名最好 '+F.dec(BEST_SP_RANK,1)+'，都还没进前 5。两条规则先保留，后面窗口可以继续复核。</div></div>'
        +'<div>'
          +'<div class="field-label" style="margin-bottom:6px">本板块观测参数</div>'
          +'<table class="stat-table">'
            +'<tr><td>对标 ASIN / 品牌</td><td>'+BENCH_ASIN+'</td></tr>'
            +'<tr><td>数据快照</td><td>'+F.esc(snapshotText)+'</td></tr>'
            +'<tr><td>观测窗口</td><td>'+CX.windowShort()+'</td></tr>'
            +'<tr><td>跟踪关键词</td><td>'+KEYWORDS.length+' 个（大词 3 / 词根词 3 / 长尾 2）</td></tr>'
            +'<tr><td>CPC / 退货率</td><td>'+CPC+' / '+RETURN_RATE+'</td></tr>'
            +'<tr><td>机会分（06 口径）</td><td class="c-cyan">'+OPPORTUNITY+' / 100</td></tr>'
          +'</table>'
          +'<div class="mini-note">'+WINDOW_TEXT()+'。所有图为周维度，第12周是快照所在周，不含预测周。</div>'
        +'</div>'
      +'</div>',
      foot:'<span>阈值来源：《竞品流量波动分析》一 / 二 / 三</span><span class="spacer"></span><span class="c-amber">T3 · M4 · M2 本窗口 0 次命中</span>'
    });
  }

  /* ---------------- 8F-A 流量波动分析 ---------------- */
  function pFlow(){
    const r=rangeIdx(), first=r[0], last=r[r.length-1];
    const peakShare=SHARE.indexOf(Math.max.apply(null,SHARE));
    const peakRatio=RATIO.indexOf(Math.max.apply(null,RATIO));
    const chart=C.line({
      labels:r.map(i=>chartWeek(WEEKS[i])), height:300, xStep:1,
      series:[
        {name:'整体流量', values:r.map(i=>TOT[i]), color:'#38e1ff', area:false},
        {name:'广告流量', values:r.map(i=>ADS[i]), color:'#4f8cff', area:false},
        {name:'自然流量', values:r.map(i=>NAT[i]), color:'#2ee6a8'}
      ],
      yFmt:v=>F.k(Math.round(v)), tipFmt:v=>F.num(v),
      refLines:[{y:20000, label:'2 万访问门槛', color:'#38e1ff'}]
    });
    const shareList='<div class="score-list">'+r.map(i=>{
      const p=SHARE[i];
      return '<div class="score-row" style="grid-template-columns:44px minmax(0,1fr) 46px">'
        +'<span class="lbl mono">'+WEEKS[i].w+'</span>'
        +'<span class="track '+(p>=52?'amber':p<=47?'mint':'')+'"><i style="width:'+p+'%"></i></span>'
        +'<span class="val">'+F.dec(p,1)+'%</span></div>';
    }).join('')+'</div>';
    const rows=r.map(i=>{
      const adW=wow(ADS,i), natW=wow(NAT,i), totW=wow(TOT,i);
      return '<tr>'
        +'<td class="main-cell mono">'+WEEKS[i].w+'<span class="sub">'+WEEKS[i].date+'</span></td>'
        +'<td class="num">'+F.num(TOT[i])+'</td>'
        +'<td class="num">'+F.num(ADS[i])+'</td>'
        +'<td class="num">'+F.num(NAT[i])+'</td>'
        +'<td class="num">'+F.dec(RATIO[i],2)+' : 1</td>'
        +'<td class="num">'+F.dec(SHARE[i],1)+'%</td>'
        +'<td class="num">'+(adW===null?'—':U.deltaTag(adW,'%'))+'</td>'
        +'<td class="num">'+(natW===null?'—':U.deltaTag(natW,'%'))+'</td>'
        +'<td class="num">'+(totW===null?'—':U.deltaTag(totW,'%'))+'</td>'
      +'</tr>';
    }).join('');
    return U.panel({
      idx:'08F-A',
      title:'流量波动分析',
      sub:'整体、广告、自然三条线怎么变，加上广告和自然的比例；先看趋势，再看每周和上一周比的变化',
      tools:U.chip('近 '+rangeN()+' 周','cyan')+U.chip('广告:自然 '+F.dec(RATIO[last],2),'violet'),
      body:'<div class="grid g21" style="align-items:start">'
        +'<div>'
          +'<div class="field-label" style="margin-bottom:6px">整体 / 广告 / 自然流量趋势 · 访问次数</div>'
          +chart
          +'<div class="chart-note"><span>数据源：SIF 运营时光机 · '+WINDOW_TEXT()+'</span><span>横轴是第几周 · 三线同轴，整体 = 广告 + 自然</span></div>'
        +'</div>'
        +'<div>'
          +'<div class="field-label" style="margin-bottom:6px">广告流量占比（周）</div>'
          +shareList
          +'<div class="mini-note">占比最高是 '+WEEKS[peakShare].w+' 的 '+F.dec(SHARE[peakShare],1)+'%，'+WEEKS[last].w+' 降到 '+F.dec(SHARE[last],1)+'%，降了 '+F.dec(SHARE[peakShare]-SHARE[last],1)+' 个百分点。广告占比下降时，自然流量在增加。</div>'
          +'<div class="divider"></div>'
          +'<div class="field-label" style="margin-bottom:6px">广告 : 自然</div>'
          +'<div class="kpi-inline">'
            +'<div><b>'+F.dec(RATIO[first],2)+' : 1</b><span>'+WEEKS[first].w+'</span></div>'
            +'<div><b>'+F.dec(RATIO[last],2)+' : 1</b><span>'+WEEKS[last].w+'</span></div>'
            +'<div><b>'+F.signed(RATIO[last]-RATIO[first],2)+'</b><span>区间变化</span></div>'
          +'</div>'
          +'<div class="mini-note">区间从 '+F.dec(RATIO[first],2)+' : 1 走到 '+F.dec(RATIO[last],2)+' : 1；最高 '+F.dec(RATIO[peakRatio],2)+' : 1（'+WEEKS[peakRatio].w+'，广告流量反超自然 '+F.dec((RATIO[peakRatio]-1)*100,1)+'%）。</div>'
        +'</div>'
      +'</div>'
      +'<div class="divider"></div>'
      +'<div class="field-label" style="margin-bottom:7px">每周变化表 · 整体、广告、自然各自比上一周多了还是少了</div>'
      +'<div class="table-wrap"><table class="tbl" style="min-width:820px"><thead><tr>'
        +'<th>周次</th><th class="num">整体</th><th class="num">广告</th><th class="num">自然</th><th class="num">广告:自然</th><th class="num">广告占比</th>'
        +'<th class="num">广告比上周</th><th class="num">自然比上周</th><th class="num">整体比上周</th>'
      +'</tr></thead><tbody>'+rows+'</tbody></table></div>',
      foot:'<span>表内百分比都和上一周比；第一行对比区间外上一周</span><span class="spacer"></span><span class="c-mint">自然流量 '+F.signed((NAT[last]/NAT[first]-1)*100,1,'%')+' · 广告占比 '+F.signed(SHARE[last]-SHARE[first],1,'pp')+'</span>'
    });
  }

  /* ---------------- 8F-B 广告干预及效果 ---------------- */
  function pIntervention(){
    const r=rangeIdx();
    const rows=r.map(i=>{
      const a=ACTIONS[i];
      const adW=wow(ADS,i), natW=wow(NAT,i);
      const shareD=i>0 ? SHARE[i]-SHARE[i-1] : null;
      const score=effectScore(i);
      return '<tr>'
        +'<td class="main-cell mono">'+WEEKS[i].w+'<span class="sub">'+WEEKS[i].date+'</span></td>'
        +'<td>'+U.tag(actionText(a.act),ACTION_CLS[a.act]||'')+'</td>'
        +'<td class="tiny">'+F.esc(a.basis.replace(/SP 进 x 天/g,'广告天数').replace(/进 x 天/g,'广告天数').replace(/高预算词/g,'广告天数≥5 的词').replace(/预算中档/g,'广告天数中档').replace(/高预算/g,'广告天数≥5').replace(/KW-0[1-8]/g,function(id){return kwName(id)}))+'</td>'
        +'<td class="num">'+(adW===null?'—':U.deltaTag(adW,'%'))+'</td>'
        +'<td class="num">'+(natW===null?'—':U.deltaTag(natW,'%'))+'</td>'
        +'<td class="num">'+(shareD===null?'—':U.deltaTag(shareD,'pp'))+'</td>'
        +'<td>'+(score===null?'<span class="mono dim">—</span>':'<div class="meter-cell">'+U.meter(score,scoreCls(score))+'<span>'+score+'</span></div>')+'</td>'
      +'</tr>';
    }).join('');
    const scores=r.map(i=>effectScore(i)).filter(s=>s!==null);
    const avg=scores.length ? scores.reduce((x,y)=>x+y,0)/scores.length : 0;
    const upWeeks=r.filter(i=>i>0 && KEYWORDS.some(k=>budgetAction(k.spDays[i-1],k.spDays[i])==='加投'||budgetAction(k.spDays[i-1],k.spDays[i])==='新开'));
    const downWeeks=r.filter(i=>i>0 && KEYWORDS.some(k=>budgetAction(k.spDays[i-1],k.spDays[i])==='减投'||budgetAction(k.spDays[i-1],k.spDays[i])==='关停'));
    return U.panel({
      idx:'08F-B',
      title:'广告动作和效果',
      sub:'根据 08F-A 的流量变化，推测每周广告是加量还是减量，并给出当周流量效果分',
      tools:U.chip('广告加量 / 开始投 '+upWeeks.length+' 周','mint')+U.chip('广告减量 / 停止投 '+downWeeks.length+' 周','rose'),
      body:'<div class="kpi-inline" style="margin-bottom:12px">'
        +'<div><b>'+upWeeks.length+' 周</b><span>广告加量或开始投</span></div>'
        +'<div><b>'+downWeeks.length+' 周</b><span>广告减量或停止投</span></div>'
        +'<div><b>'+F.dec(avg,0)+'</b><span>平均效果分</span></div>'
        +'<div><b>'+WEEKS[r[r.length-1]].w+'</b><span>效果分 '+effectScore(r[r.length-1])+'</span></div>'
      +'</div>'
      +'<div class="table-wrap tall"><table class="tbl" style="min-width:900px"><thead><tr>'
        +'<th>周次</th><th>推测动作</th><th>推测依据</th><th class="num">广告比上周</th><th class="num">自然比上周</th><th class="num">占比变化</th><th>流量效果分</th>'
      +'</tr></thead><tbody>'+rows+'</tbody></table></div>'
      +'<div class="callout callout-ok" style="margin-top:11px"><b>广告节奏：</b>当前数据里，广告加量集中在第2–6周和第8–10周，第7周中断。第7周正好是 15% 券到期，广告天数达到 5 天以上的词从 4 个降到 1 个，广告流量也转成下降。竞品把券和广告一起用，券停后广告也跟着收，预算跟着活动节点走，没有按排名目标持续投。</div>'
      +'<div class="mini-note">流量效果分把广告流量、自然流量、广告占比和当周主推词数放在一起算，范围 0–100。第7周停券后流量下降，只有 '+effectScore(6)+' 分；'+WEEKS[WEEKS.length-1].w+' 广告在收，自然流量仍在涨，反而有 '+effectScore(WEEKS.length-1)+' 分。分数只看当周结果，不评价动作意图。</div>',
      foot:'<span>广告天数或平均排名发生变化，就算一次动作</span><span class="spacer"></span><span class="c-amber">第7周是 12 周里广告减量最集中的一周</span>'
    });
  }

  /* ---------------- 8F-C 关键词变化 ---------------- */
  function thresholdTags(k,i,hits){
    return hits.map(h=>{
      let detail;
      if(h.id==='M1') detail='广告天数 '+k.spDays[i-1]+'→'+k.spDays[i]+'（+'+F.dec(k.spDays[i]-k.spDays[i-1],0)+' ≥ 3）';
      else if(h.id==='M2') detail='品牌广告天数 +0（&lt; 3）';
      else if(h.id==='M3') detail='广告平均排名 '+F.dec(k.spRank[i-1],1)+'→'+F.dec(k.spRank[i],1)+'（&gt;24 → ≤24）';
      else detail='广告平均排名 '+F.dec(k.spRank[i-1],1)+'→'+F.dec(k.spRank[i],1)+'（&gt;5 → ≤5）';
      return U.tag(h.id+' · '+detail, h.id==='M1'||h.id==='M3' ? 'hot' : 'good');
    }).join(' ');
  }
  function pKeyword(){
    const r=rangeIdx(), last=r[r.length-1];
    const bars=C.bars({
      labels:r.map(i=>chartWeek(WEEKS[i])), height:250, stacked:false, barWidth:15, yTicks:5,
      series:[
        {name:'当周主推词数（M1–M4）', values:r.map(i=>pushCount(i)), color:'#ffc857'},
        {name:'主要流量词数（广告天数 ≥5）', values:r.map(i=>dominant(i).length), color:'#38e1ff'}
      ],
      yFmt:v=>F.num(Math.round(v)), tipFmt:v=>v+' 个'
    });
    const evs=eventList();
    const bestPushIdx=r.reduce((a,b)=>pushCount(b)>pushCount(a)?b:a, r[0]);
    const bestDomIdx=r.reduce((a,b)=>dominant(b).length>dominant(a).length?b:a, r[0]);
    let drop={i:r[0],d:0};
    r.forEach(i=>{ if(i===0) return; const d=dominant(i).length-dominant(i-1).length; if(d<drop.d) drop={i:i,d:d}; });
    const evRows=evs.length ? evs.map(e=>
      '<tr>'
      +'<td class="main-cell mono">'+WEEKS[e.w].w+'<span class="sub">'+WEEKS[e.w].date+'</span></td>'
      +'<td class="main-cell">'+F.esc(e.k.kw)+'<span class="sub">'+F.esc(e.k.layer)+'</span></td>'
      +'<td>'+thresholdTags(e.k,e.w,e.hits)+'</td>'
      +'<td class="num">'+e.k.spDays[e.w-1]+' → '+e.k.spDays[e.w]+'</td>'
      +'<td class="num">'+F.dec(e.k.spRank[e.w-1],1)+' → '+F.dec(e.k.spRank[e.w],1)+'</td>'
      +'</tr>').join('') : '<tr><td colspan="5" class="muted">本区间没有词命中主推规则</td></tr>';
    const domList='<div class="mini-list">'+r.map(i=>{
      if(i===0) return '';
      const now=dominant(i), prev=dominant(i-1), d=now.length-prev.length;
      return '<div class="mini-item"><span class="mono">'+WEEKS[i].w+'</span>'
        +'<span style="flex:1" title="'+F.esc(now.map(k=>k.kw).join(' / '))+'">'+(now.length?now.map(k=>k.kw).join(' / '):'—')+'</span>'
        +'<b>'+(d>0?'+'+d:d)+'</b></div>';
    }).join('')+'</div>';
    return U.panel({
      idx:'08F-C',
      title:'关键词变化',
      sub:'看每周哪些词被重点推、主要流量词是多了还是少了',
      tools:U.chip('被重点推 '+evs.length+' 次','amber')+U.chip(WEEKS[last].w+' 重点推 '+pushCount(last)+' 词','cyan'),
      body:'<div class="grid g12" style="align-items:start">'
        +'<div>'
          +'<div class="field-label" style="margin-bottom:6px">主推词数 vs 主要流量词数 · 逐周</div>'
          +bars
          +'<div class="chart-note"><span>黄柱 = 命中 M1–M4 的词数</span><span>横轴是第几周 · 蓝柱 = 广告天数 ≥5 的词数</span></div>'
          +'<div class="mini-note">两条柱子的差，是被重点推但流量没接住的词。主推词最多的是 '+WEEKS[bestPushIdx].w+'（'+pushCount(bestPushIdx)+' 个），主要流量词最多的是 '+WEEKS[bestDomIdx].w+'（'+dominant(bestDomIdx).length+' 个）。主推是动作，主要流量词是结果。</div>'
        +'</div>'
        +'<div>'
          +'<div class="field-label" style="margin-bottom:6px">主要流量词数量 · 对比上周</div>'
          +domList
          +'<div class="mini-note">'+WEEKS[last].w+' 主要流量词 '+dominant(last).length+' 个：'+dominant(last).map(k=>k.kw).join(' / ')+'。</div>'
          +'<div class="divider"></div>'
          +'<div class="callout callout-warn"><b>当周（'+WEEKS[last].w+'）主推词 '+pushCount(last)+' 个：</b>四条规则都没有命中。广告在最后两周转为守位，广告天数和平均排名都不再跨档，所以自然排名没有新的推力。</div>'
        +'</div>'
      +'</div>'
      +'<div class="divider"></div>'
      +'<div class="field-label" style="margin-bottom:7px">本区间主推词明细 · 每条都写明命中的规则</div>'
      +'<div class="table-wrap tall"><table class="tbl" style="min-width:860px"><thead><tr>'
        +'<th>周次</th><th>主推词</th><th>命中规则</th><th class="num">广告天数</th><th class="num">广告平均排名</th>'
      +'</tr></thead><tbody>'+evRows+'</tbody></table></div>',
      foot:'<span>主推词：M1–M4 任意一条命中即可</span><span class="spacer"></span><span class="c-amber">'+(drop.d<0 ? WEEKS[drop.i].w+' 主要流量词 '+(dominant(drop.i).length-drop.d)+' → '+dominant(drop.i).length+'，区间内回落最多' : '区间内主要流量词没有回落')+'</span>'
    });
  }

  /* ---------------- 8F-D 投放力度 ---------------- */
  function pStrength(){
    const r=rangeIdx(), last=WEEKS.length-1;
    const snap=KEYWORDS.map(k=>{
      const ba=budgetAction(k.spDays[last-1],k.spDays[last]);
      const bd=bidAction(k.spRank[last-1],k.spRank[last],k.spDays[last-1],k.spDays[last]);
      const stopped=k.spDays[last]===0;
      const acts=[];
      if(ba!=='维持') acts.push(U.tag(actionText(ba),ACTION_TAG[ba]||''));
      if(bd!=='维持' && bd!=='—') acts.push(U.tag(actionText(bd),ACTION_TAG[bd]||''));
      return '<tr>'
        +'<td class="main-cell">'+F.esc(k.kw)+'<span class="sub">'+F.esc(k.layer)+' · '+F.num(k.vol)+' / 月</span></td>'
        +'<td class="num">'+k.spDays[last]+' 天</td>'
        +'<td>'+tierTrack(stopped?'off':budgetTier(k.spDays[last]))+'</td>'
        +'<td class="num">'+F.dec(k.spRank[last],1)+'</td>'
        +'<td>'+tierTrack(stopped?'off':bidTier(k.spRank[last]))+'</td>'
        +'<td>'+(acts.length?acts.join(' '):'<span class="muted">不变</span>')+'</td>'
      +'</tr>';
    }).join('');
    const groups=r.map(i=>{
      if(i===0) return null;
      const items=[];
      KEYWORDS.forEach(k=>{
        const ba=budgetAction(k.spDays[i-1],k.spDays[i]);
        const bd=bidAction(k.spRank[i-1],k.spRank[i],k.spDays[i-1],k.spDays[i]);
        if(ba==='维持' && bd==='维持') return;
        if(ba!=='维持') items.push('<span class="tag '+(ACTION_TAG[ba]||'')+'" title="'+k.id+'">'+F.esc(k.kw)+'：广告天数 '+k.spDays[i-1]+'→'+k.spDays[i]+' 天</span>');
        if(bd!=='维持' && bd!=='—') items.push('<span class="tag '+(ACTION_TAG[bd]||'')+'" title="'+k.id+'">'+F.esc(k.kw)+'：平均排名 '+k.spRank[i-1]+'→'+k.spRank[i]+'（'+actionText(bd)+'）</span>');
      });
      return items.length ? {w:i,items:items} : null;
    }).filter(Boolean);
    const rowsHtml=groups.length ? groups.map(g=>
      '<tr><td class="main-cell mono" style="white-space:nowrap">'+WEEKS[g.w].w+'<span class="sub">'+WEEKS[g.w].date+'</span></td>'
      +'<td><div style="display:flex;flex-wrap:wrap;gap:4px">'+g.items.join('')+'</div></td></tr>').join('')
      : '<tr><td colspan="2" class="muted">本区间没有广告天数或排名变化</td></tr>';
    const counts={'新开':0,'加投':0,'减投':0,'关停':0,'升档':0,'降档':0};
    r.forEach(i=>{
      if(i===0) return;
      KEYWORDS.forEach(k=>{
        const ba=budgetAction(k.spDays[i-1],k.spDays[i]);
        const bd=bidAction(k.spRank[i-1],k.spRank[i],k.spDays[i-1],k.spDays[i]);
        if(counts[ba]!==undefined) counts[ba]++;
        if(counts[bd]!==undefined) counts[bd]++;
      });
    });
    return U.panel({
      idx:'08F-D',
      title:'投放力度：广告天数与平均排名',
      sub:'把每个词每周的广告出现天数和广告平均排名放在一起看，标出开始投、加量、减量、停投和排名变化',
      tools:U.chip(WEEKS[last].w+' 快照','cyan')+U.chip('开始投 '+counts['新开']+' · 广告加量 '+counts['加投'],'mint'),
      body:'<div class="callout" style="margin-bottom:10px"><b>先看懂三个词：</b>「广告天数」是这个词一周内有几天出现在搜索结果广告位；「平均排名」是广告位里的平均名次，数字越小越靠前。表格左侧是完整关键词。</div>'
        +'<div class="field-label" style="margin-bottom:7px">当周（'+WEEKS[last].w+'）的词级数据 · 与 '+WEEKS[last-1].w+' 对比</div>'
        +'<div class="table-wrap"><table class="tbl" style="min-width:880px"><thead><tr>'
          +'<th>关键词</th><th class="num">广告天数</th><th>广告天数档（≥5 高 / 3–4 中 / 1–2 低）</th><th class="num">平均排名</th><th>排名档（1–12 高 / 13–24 中 / 25–48 低）</th><th>本周动作</th>'
        +'</tr></thead><tbody>'+snap+'</tbody></table></div>'
        +'<div class="divider"></div>'
        +'<div class="grid g21" style="align-items:start">'
          +'<div>'
            +'<div class="field-label" style="margin-bottom:7px">每周变化（逐周）· 哪些词加量、减量、开始投、停止投</div>'
            +'<div class="table-wrap tall"><table class="tbl" style="min-width:640px"><thead><tr><th>周次</th><th>本周变化</th></tr></thead><tbody>'+rowsHtml+'</tbody></table></div>'
          +'</div>'
          +'<div>'
            +'<div class="field-label" style="margin-bottom:6px">区间动作计数</div>'
            +'<div class="kpi-inline">'
              +'<div><b>'+counts['新开']+'</b><span>开始投</span></div>'
              +'<div><b>'+counts['加投']+'</b><span>广告加量</span></div>'
              +'<div><b>'+counts['减投']+'</b><span>广告减量</span></div>'
              +'<div><b>'+counts['关停']+'</b><span>停止投</span></div>'
              +'<div><b>'+counts['升档']+'</b><span>排名更靠前</span></div>'
              +'<div><b>'+counts['降档']+'</b><span>排名更靠后</span></div>'
            +'</div>'
            +'<div class="callout callout-warn" style="margin-top:11px"><b>力度解读：</b>当前数据里，竞品经常调整广告出现天数，但广告平均排名一直保持在中高档，没有明显后退。第12周它把 plus size henley shirts 的广告天数从 2 天降到 0 天，直接停投。这个词投了广告，标题和五点里却没有写，所以停得很快。</div>'
            +'<div class="mini-note">广告天数和平均排名要分开看。比如 tagless henley 在第12周广告天数从 4 天加到 5 天，平均排名从 24 升到 22，意思是多买了一天曝光，位置也更靠前。</div>'
          +'</div>'
        +'</div>',
      foot:'<span>广告天数看曝光天数，平均排名看广告位次；两项都是根据公开数据推断，不是后台真实预算与竞价</span><span class="spacer"></span><span class="c-mint">广告加量 '+counts['加投']+' · 广告减量 '+counts['减投']+' · 开始投 '+counts['新开']+' · 停止投 '+counts['关停']+'</span>'
    });
  }

  /* ---------------- 8F-E 投放效果 ---------------- */
  function matrixCell(k,i){
    const res=resultAt(k,i);
    if(res.state==='na') return '<div class="hm-cell" style="color:var(--muted-2)" title="'+F.esc(k.kw+' '+WEEKS[i].w+'：四条主推规则均未命中，不进入投放效果判定')+'">—</div>';
    if(res.state==='pending') return '<div class="hm-cell" style="color:var(--muted-2)" title="'+F.esc(k.kw+' '+WEEKS[i].w+'：后两周已到快照之外，无法判定')+'">待验</div>';
    if(res.state==='hit'){
      const f=res.found[0];
      const tag=f.hits.map(h=>h.id).join('/');
      return '<div class="hm-cell" style="background:rgba(46,230,168,.16);border-color:rgba(46,230,168,.34);color:var(--mint)" title="'
        +F.esc(k.kw+' '+WEEKS[i].w+' 主推 → '+WEEKS[f.w].w+' 自然排名进阶命中 '+f.hits.map(h=>h.id+'（'+h.name+'）').join('、'))
        +'">✓ '+tag+'</div>';
    }
    return '<div class="hm-cell" style="background:rgba(255,107,138,.1);border-color:rgba(255,107,138,.26);color:var(--rose)" title="'
      +F.esc(k.kw+' '+WEEKS[i].w+' 主推 → 后两周（'+[i+1,i+2].filter(x=>x<WEEKS.length).map(x=>WEEKS[x].w).join(' / ')+'）未命中 T1–T3')
      +'">×</div>';
  }
  function pEffect(){
    const r=rangeIdx();
    const cols=r.map(i=>'<div class="hm-col">'+WEEKS[i].w+'<small>'+WEEKS[i].date.split(' → ')[0]+'</small></div>').join('');
    const rows=KEYWORDS.map(k=>{
      const head='<div class="hm-row-h" data-kw="'+k.id+'" style="cursor:pointer;white-space:normal;line-height:1.3">'+F.esc(k.kw)
        +'<small style="color:var(--muted-2);font-family:var(--mono);font-size:7px;margin-left:4px">'+F.esc(k.layer)+'</small></div>';
      return head+r.map(i=>matrixCell(k,i)).join('');
    }).join('');
    const evs=eventList();
    const stat=KEYWORDS.map(k=>{
      const own=evs.filter(e=>e.k.id===k.id);
      const hit=own.filter(e=>e.res.state==='hit').length;
      const miss=own.filter(e=>e.res.state==='miss').length;
      const pend=own.filter(e=>e.res.state==='pending').length;
      const rate=(hit+miss)?Math.round(hit/(hit+miss)*100):null;
      return '<tr>'
        +'<td class="main-cell">'+F.esc(k.kw)+'<span class="sub">'+F.esc(k.layer)+'</span></td>'
        +'<td class="num">'+own.length+'</td>'
        +'<td class="num c-mint">'+hit+'</td>'
        +'<td class="num c-rose">'+miss+'</td>'
        +'<td class="num">'+pend+'</td>'
        +'<td class="num">'+(rate===null?'—':rate+'%')+'</td>'
      +'</tr>';
    }).join('');
    const hr=hitRate();
    const hits=evs.filter(e=>e.res.state==='hit');
    const misses=evs.filter(e=>e.res.state==='miss');
    const hitHigh=hits.filter(e=>budgetTier(e.k.spDays[e.w])==='high').length;
    const hitLine=hits.length ? hits.map(e=>e.k.kw+' '+WEEKS[e.w].w+'→'+WEEKS[e.res.found[0].w].w+'（'+e.res.found[0].hits.map(h=>h.id).join('/')+'）').join('、') : '本区间无命中';
    const missLine=misses.length ? misses.map(e=>e.k.kw+' '+WEEKS[e.w].w).join('、') : '本区间无未命中';
    return U.panel({
      idx:'08F-E',
      title:'主推后，自然排名有没有进步',
      sub:'当周被重点推的词，看后面两周自然搜索排名有没有往前挪',
      tools:U.chip('主推 '+evs.length+' 次','amber')+(hr===null?U.chip('暂无可判定','dim'):U.chip('命中率 '+F.dec(hr,1)+'%','mint')),
      body:'<div class="hm"><div class="hm-grid" style="grid-template-columns:150px repeat('+r.length+',minmax(44px,1fr))">'
        +'<div class="hm-corner">词 \\ 周</div>'+cols+rows
      +'</div>'
      +'<div class="hm-legend">三态色阶 <span class="hm-scale">'
        +'<i style="background:rgba(46,230,168,.55)"></i>'
        +'<i style="background:rgba(255,107,138,.45)"></i>'
        +'<i style="background:rgba(120,144,168,.18)"></i>'
      +'</span> 命中 / 未命中 / 非主推</div></div>'
      +'<div class="mini-note">行是词，列是周。✓ 后面是命中的规则编号（T1 自然搜索天数 ≥3、T2 排名进入前 24、T3 排名进入前 5）；× 表示当周被主推，但后两周自然排名没有进步；— 表示当周四条主推规则都没命中；待验表示后两周已经超出快照范围。鼠标停上去可以看具体读数。</div>'
      +'<div class="divider"></div>'
      +'<div class="grid g12" style="align-items:start">'
        +'<div>'
          +'<div class="field-label" style="margin-bottom:7px">逐词命中率 · 主推次数 / 命中 / 未命中 / 待验</div>'
          +'<div class="table-wrap"><table class="tbl" style="min-width:520px"><thead><tr>'
            +'<th>关键词</th><th class="num">主推</th><th class="num">命中</th><th class="num">未命中</th><th class="num">待验</th><th class="num">命中率</th>'
          +'</tr></thead><tbody>'+stat+'</tbody></table></div>'
          +'<div class="mini-note">点击矩阵左侧词名，可以打开这个词 12 周的广告天数、广告平均排名、自然搜索天数和自然平均排名。</div>'
        +'</div>'
        +'<div>'
          +'<div class="field-label" style="margin-bottom:6px">效果读数</div>'
          +'<div class="kpi-inline">'
            +'<div><b>'+evs.length+'</b><span>被重点推的次数</span></div>'
            +'<div><b>'+gradedList().filter(e=>e.res.state==='hit').length+'</b><span>自然排名进步</span></div>'
            +'<div><b>'+(hr===null?'—':F.dec(hr,1)+'%')+'</b><span>命中率</span></div>'
          +'</div>'
          +'<div class="callout callout-ok" style="margin-top:11px"><b>命中：</b>'+hitLine+'。'+hits.length+' 次命中里，有 '+hitHigh+' 次当周广告天数达到 5 天以上。广告投得够多，自然排名才更容易接住。</div>'
          +'<div class="callout callout-risk" style="margin-top:9px"><b>未命中：</b>'+missLine+'。这些词当周确实被推了，但后 1–2 周自然搜索天数和自然平均排名都没有变化。广告买到曝光，不代表自然排名会跟着涨。</div>'
        +'</div>'
      +'</div>',
      foot:'<span>判定窗口：当周主推，看后 1–2 周自然排名有没有进步（T1–T3）</span><span class="spacer"></span><span class="c-mint">命中率 '+(hr===null?'—':F.dec(hr,1)+'%')+'</span>'
    });
  }

  /* ---------------- 8F-F 复用结论 ---------------- */
  function pClose(){
    const hr=hitRate();
    const last=WEEKS.length-1;
    const hits=eventList().filter(e=>e.res.state==='hit');
    const hitHigh=hits.filter(e=>budgetTier(e.k.spDays[e.w])==='high').length;
    const items=[
      ['学它的组合节奏，不学单点动作','券、大词精准和降价，在第3周、第8周、第10周都一起出现。只加预算或只发券，下一周流量就容易掉回去。'],
      ['主推时，广告天数要够','在这个窗口 '+hits.length+' 次「主推后自然排名进步」的事件里，有 '+hitHigh+' 次当周广告天数达到 5 天以上。只投 3–4 天的中档，更容易只买到广告位。'],
      ['把排名买靠前，比多买几天更有效','tagless henley 在第7周只靠 3 天广告起量，后两周自然排名没有进步；同一个词在第11周把广告平均排名从 25 提到 24，才把自然排名推进前 24。'],
      ['避开它的券期','第2–6周它连续用券，CPC 涨到 $1.62（高于保本 $1.41）；第7周券停后，大词 CPC 回落到 $1.18。我方大词预算可以放到第7–9周，同样的钱买更多曝光。']
    ];
    return U.panel({
      idx:'08F-F',
      title:'可以直接照着做的 4 件事',
      sub:'从当前数据里，整理出 4 条能直接放进投放表的做法',
      tools:U.chip('4 条','cyan')+U.chip('衔接 08 投放表','mint'),
      body:'<div class="insight-list">'+items.map((x,i)=>
        '<div class="insight"><span class="insight-n">0'+(i+1)+'</span><div><b>'+F.esc(x[0])+'：</b>'+F.esc(x[1])+'</div></div>'
      ).join('')+'</div>'
      +'<div class="divider"></div>'
      +'<div class="grid g21" style="align-items:start">'
        +'<div>'
          +'<div class="callout callout-warn"><b>观测边界（和 08 一样）：</b>本板块只看竞品动作。活动、广告组、可能的词和匹配方式可以推断；广告组以下的竞价调整、分时折扣、预算流动看不到。「广告天数」是根据公开数据推断的周内天数，不是后台报表原值。动作标签也来自广告天数或平均排名的变化，不是运营日志。</div>'
          +'<div class="mini-note">数据范围：对标 '+BENCH_ASIN+'，快照 '+F.esc(snapshotText)+'，窗口 '+WINDOW_TEXT()+'，CPC '+CPC+'，退货率 '+RETURN_RATE+'，机会分 '+OPPORTUNITY+' / 100。</div>'
        +'</div>'
        +'<div>'
          +'<div class="field-label" style="margin-bottom:6px">本窗口的结果</div>'
          +'<table class="stat-table">'
            +'<tr><td>被重点推 / 命中率</td><td>'+(hr===null?'—':F.dec(hr,1)+'%')+'</td></tr>'
            +'<tr><td>'+WEEKS[last].w+' 广告天数 ≥5 的词</td><td>'+dominant(last).length+' 个</td></tr>'
            +'<tr><td>'+WEEKS[last].w+' 广告 : 自然</td><td>'+F.dec(RATIO[last],2)+' : 1</td></tr>'
            +'<tr><td>广告动作（开始投 / 加量）</td><td class="c-mint">见 08F-D</td></tr>'
          +'</table>'
          +'<button type="button" class="btn btn-primary btn-sm" style="width:100%;margin-top:9px" data-go="promotion">回到 08 推广策略排投放表 →</button>'
        +'</div>'
      +'</div>',
      foot:'<span>08F 只解释「流量为什么动」，不重复 08 的广告架构推测</span><span class="spacer"></span><span class="c-amber">券与价格仅作竞品动作观测</span>'
    });
  }

  /* ---------------- 页头 + 结论 ---------------- */
  function benchNote(){
    if(BENCH_ASIN===PROFILED) return '';
    return '<div class="callout" style="margin-top:10px">当前对标 <b>'+F.esc(BENCH_ASIN)+'</b> 尚无 SIF 拆解样本，以下内容为 <b>'+PROFILED+'</b> 的口径演示</div>';
  }

  function head(){
    const n=rangeN();
    return '<div class="page-head"><div class="page-head-l">'
      +'<div class="eyebrow">MODULE 08F / TRAFFIC VOLATILITY</div>'
      +'<h1>流量波动专项<span class="en">TRAFFIC VOLATILITY</span></h1>'
      +'<div class="page-sub">对标 '+BENCH_ASIN+'（'+F.esc(BENCH_BRAND)+'）：每周看广告投了多少、自然排名有没有进步。分析窗口 '+CX.windowShort()+'。广告天数是这个词一周内有几天出现在广告位；平均排名越小越靠前。</div>'
        +benchNote()+'</div>'
      +'<div class="head-actions">'
        +'<span class="chip chip-cyan">'+BENCH_ASIN+'</span>'
        +'<span class="chip chip-dim">'+CX.windowWeeks()+' 周窗口</span>'
        +'<div class="seg" id="flowRange">'
          +'<button type="button" class="seg-btn'+(n===4?' active':'')+'" data-range="4">近 4 周</button>'
          +'<button type="button" class="seg-btn'+(n===8?' active':'')+'" data-range="8">近 8 周</button>'
        +'</div>'
        +'<button type="button" class="btn btn-ghost" data-report="flow" data-label="流量波动专项">加入报告</button>'
      +'</div></div>';
  }
  function pVerdict(){
    const r=rangeIdx(), first=r[0], last=r[r.length-1];
    const hr=hitRate();
    const evs=eventList();
    const rowHtml=(label,val)=>'<div class="vs-row"><span>'+label+'</span><b>'+val+'</b></div>';
    return '<section class="panel vsplit" style="display:grid;grid-template-columns:minmax(0,1fr) 300px;overflow:hidden;margin-bottom:14px">'
      +'<div class="verdict-main">'
        +'<div class="eyebrow" style="margin-bottom:8px">CONCLUSION / '+BENCH_ASIN+' · 近 '+rangeN()+' 周</div>'
        +'<h2 style="font-size:17px">竞品用广告推排名：第3周开始投 3 个大搜索词的精准广告，第5周把 CPC 推到 $1.62，第8周和第10周两次降价并扩词，整体流量从 '+F.num(TOT[first])+' 涨到 '+F.num(TOT[last])+'。第7周停券后，自然流量下降 5.2%，整体流量也跟着下滑。广告能带来曝光，停投后能不能留住流量，要看产品和价格。</h2>'
        +'<div class="reason">这里只看三件事：广告流量和自然流量各自怎么变；每周广告投得多还是少；被重点推的词，后两周自然排名有没有进步。</div>'
        +'<div class="reason-list">'
          +U.tag('广告:自然 '+F.dec(RATIO[last],2)+' : 1','violet')
          +U.tag('广告占比 '+F.pct(SHARE[last],1),'good')
          +U.tag('被重点推 '+evs.length+' 次','hot')
          +U.tag(hr===null?'命中率 —':'命中率 '+F.dec(hr,1)+'%','good')
          +U.tag('广告天数 ≥5 的词 '+dominant(last).length+' 个','')
        +'</div>'
      +'</div>'
      +'<div class="verdict-side">'
        +rowHtml('数据快照',snapshotText)
        +rowHtml('观测窗口',CX.windowShort())
        +(CX.windowCoverageNote()?'<div class="mini-note">'+F.esc(CX.windowCoverageNote())+'</div>':'')
        +rowHtml('当前周期','近 '+rangeN()+' 周（'+WEEKS[first].w+'–'+WEEKS[last].w+'）')
        +rowHtml('CPC / 退货率',CPC+' / '+RETURN_RATE)
        +rowHtml('机会分（06 口径）',OPPORTUNITY+' / 100')
        +'<a class="link small" data-go="promotion">回看 08 广告架构 →</a>'
      +'</div></section>';
  }

  /* ---------------- 词级明细抽屉 ---------------- */
  function kwDrawer(k){
    const rows=WEEKS.map((w,i)=>{
      const push=pushHits(k,i), adv=natHits(k,i);
      const stopped=k.spDays[i]===0;
      return '<tr>'
        +'<td class="main-cell mono">'+w.w+'<span class="sub">'+w.date+'</span></td>'
        +'<td class="num">'+k.spDays[i]+'</td>'
        +'<td class="num">'+F.dec(k.spRank[i],1)+'</td>'
        +'<td>'+tierBadge(stopped?'off':budgetTier(k.spDays[i]))+'</td>'
        +'<td>'+tierBadge(stopped?'off':bidTier(k.spRank[i]))+'</td>'
        +'<td class="num">'+k.natDays[i]+'</td>'
        +'<td class="num">'+F.dec(k.natRank[i],1)+'</td>'
        +'<td class="tiny">'+(push.length?push.map(h=>U.badge(h.id,'warn')).join(' '):'—')+'</td>'
        +'<td class="tiny">'+(adv.length?adv.map(h=>U.badge(h.id,'ok')).join(' '):'—')+'</td>'
      +'</tr>';
    }).join('');
    return '<div class="drawer-section"><h3>KEYWORD</h3>'
      +'<div style="display:flex;gap:5px;flex-wrap:wrap">'+U.tag(k.layer)+U.tag(F.num(k.vol)+' / 月')+U.tag(k.group)+'</div>'
      +'<div class="drawer-note" style="margin-top:8px">广告天数 = 该周进入搜索结果前 6 页的天数（0–7）；平均排名是该周平均值。SB 是品牌广告，本窗口没有投放，所以 SB 天数恒为 0。</div>'
      +'<div class="drawer-section"><h3>12 周明细</h3><div class="table-wrap"><table class="tbl" style="min-width:0"><thead><tr>'
        +'<th>周</th><th class="num">广告天数</th><th class="num">广告排名</th><th>广告天数档</th><th>排名档</th><th class="num">自然天数</th><th class="num">自然排名</th><th>主推</th><th>进阶</th>'
      +'</tr></thead><tbody>'+rows+'</tbody></table></div></div>';
  }

  /* ---------------- 页面 ---------------- */
  function render(){
    BENCH_ASIN=(CX.state&&CX.state.benchmark)||PROFILED;
    return '<div class="page">'
      +head()
      +pVerdict()
      +'<div class="section-gap"></div>'
      +pRules()
      +'<div class="section-gap"></div>'
      +kpiRow()
      +'<div class="section-gap"></div>'
      +pFlow()
      +'<div class="section-gap"></div>'
      +pIntervention()
      +'<div class="section-gap"></div>'
      +pKeyword()
      +'<div class="section-gap"></div>'
      +pStrength()
      +'<div class="section-gap"></div>'
      +pEffect()
      +'<div class="section-gap"></div>'
      +pClose()
      +'</div>';
  }

  function kpiRow(){
    const r=rangeIdx(), first=r[0], last=r[r.length-1];
    const evs=eventList();
    const graded=gradedList();
    const hits=graded.filter(e=>e.res.state==='hit').length;
    const peak=SHARE.indexOf(Math.max.apply(null,SHARE));
    const peakRatioIdx=RATIO.indexOf(Math.max.apply(null,RATIO));
    return '<div class="kpi-grid">'
      +U.kpi({label:'整体流量（'+WEEKS[last].w+'）', value:F.num(TOT[last]), unit:' 次访问',
        delta:F.signed(wow(TOT,last),1,'%'), foot:WEEKS[first].w+' '+F.num(TOT[first])+' → '+WEEKS[last].w+' '+F.num(TOT[last]),
        spark:r.map(i=>TOT[i]), color:'#38e1ff'})
      +U.kpi({label:'广告 : 自然', value:F.dec(RATIO[last],2), unit:' : 1',
        delta:F.signed(RATIO[last]-RATIO[first],2), foot:WEEKS[first].w+' '+F.dec(RATIO[first],2)+' : 1 · '+WEEKS[peakRatioIdx].w+' 峰值 '+F.dec(RATIO[peakRatioIdx],2),
        spark:r.map(i=>RATIO[i]), color:'#a78bfa'})
      +U.kpi({label:'广告流量占比', value:F.dec(SHARE[last],1), unit:'%',
        delta:F.signed(SHARE[last]-SHARE[first],1,'pp'), foot:'峰值 '+F.dec(SHARE[peak],1)+'%（'+WEEKS[peak].w+'）',
        spark:r.map(i=>SHARE[i]), color:'#4f8cff'})
      +U.kpi({label:'区间主推事件', value:String(evs.length), unit:'次',
        foot:'命中 '+hits+' / 可判定 '+graded.length+'（词 × 周）',
        spark:r.map(i=>pushCount(i)), color:'#ffc857'})
      +U.kpi({label:'广告天数≥5 的词', value:String(dominant(last).length), unit:'个',
        delta:F.signed(dominant(last).length-dominant(first).length,0), foot:WEEKS[first].w+' '+dominant(first).length+' → '+WEEKS[last].w+' '+dominant(last).length,
        spark:r.map(i=>dominant(i).length), color:'#2ee6a8'})
    +'</div>';
  }

  /* ---------------- 交互 ---------------- */
  function after(view){
    view.querySelectorAll('[data-range]').forEach(b=>{
      b.addEventListener('click',()=>{
        const n=Number(b.dataset.range);
        if(CX.state.flowRange===n) return;
        CX.state.flowRange=n;
        CX.saveConfig();
        CX.rerender();
      });
    });
    view.querySelectorAll('[data-kw]').forEach(el=>{
      el.addEventListener('click',()=>{
        const k=KEYWORDS.filter(x=>x.id===el.dataset.kw)[0];
        if(k) CX.openDrawer({eyebrow:'KEYWORD / '+k.id, title:k.kw, body:kwDrawer(k)});
      });
    });
  }

  CX.register('flow',{title:'流量波动专项',render:render,after:after});
})();
