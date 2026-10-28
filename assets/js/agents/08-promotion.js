/* ============================================================
   AGENT-08 · 推广策略 / SIF 运营时光机 + 查广告架构
   口径：竞品价格与券只做动作观测，不参与 01 / 06 的任何结论
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
  const WEEK_SPAN=()=>'分析窗口：'+CX.windowLabel()+'。演示数据包含前 12 周历史 + 第13周预测。';
  const PRICE_AVG='$39.99';
  const PRICE_BAND='$37.99–$39.99';
  const GROSS_MARGIN='34.3%';
  const RETURN_RATE='12.8%';
  const CPC='$1.28';
  const BREAKEVEN_CPC='$1.41';
  const OPPORTUNITY=78;
  const TOTAL_BUDGET=118;

  /* ---------------- 周度推广节奏 W1–W13 ---------------- */
  /* coupon = 站内优惠券力度（%）；deal = Deal 动作；fc = 快照之后的预测周 */
  const WEEKS=[
    {w:'第1周', date:'01-25 → 01-31', price:39.99, coupon:0, deal:'—', bsr:4860, rating:4.2, reviews:1362, nOrders:96, aOrders:84, nSess:4100, aSess:3620, ad:'自动 + 商品投放开跑，大词未上'},
    {w:'第2周', date:'02-01 → 02-07', price:39.99, coupon:5, deal:'—', bsr:3920, rating:4.2, reviews:1425, nOrders:130, aOrders:118, nSess:5150, aSess:4760, ad:'自动组加价 15%，词组未开'},
    {w:'第3周', date:'02-08 → 02-14', price:39.99, coupon:15, deal:'Prime 专享', bsr:2640, rating:4.3, reviews:1498, nOrders:168, aOrders:172, nSess:6480, aSess:6900, ad:'3 个大词精准同期开'},
    {w:'第4周', date:'02-15 → 02-21', price:39.99, coupon:15, deal:'—', bsr:1980, rating:4.3, reviews:1560, nOrders:205, aOrders:238, nSess:7900, aSess:9050, ad:'词组组上线，自动组降预算'},
    {w:'第5周', date:'02-22 → 02-28', price:39.99, coupon:15, deal:'7-Day Deal', bsr:1520, rating:4.3, reviews:1631, nOrders:240, aOrders:296, nSess:9350, aSess:11520, ad:'大词竞价 +20%，CPC 冲到 $1.62'},
    {w:'第6周', date:'03-01 → 03-07', price:39.99, coupon:10, deal:'—', bsr:1180, rating:4.3, reviews:1690, nOrders:268, aOrders:312, nSess:10600, aSess:12350, ad:'长尾组开，自动组加否词'},
    {w:'第7周', date:'03-08 → 03-14', price:39.99, coupon:0, deal:'券到期，无 Deal', bsr:1340, rating:4.3, reviews:1742, nOrders:258, aOrders:246, nSess:10050, aSess:10600, ad:'广泛组上线，大词维持'},
    {w:'第8周', date:'03-15 → 03-21', price:38.99, coupon:0, deal:'—', bsr:1050, rating:4.4, reviews:1798, nOrders:302, aOrders:296, nSess:12400, aSess:12150, ad:'标价下调 $1，词组扩词'},
    {w:'第9周', date:'03-22 → 03-28', price:38.99, coupon:5, deal:'—', bsr:980, rating:4.4, reviews:1855, nOrders:336, aOrders:322, nSess:14650, aSess:14000, ad:'大词组维持，长尾扩量'},
    {w:'第10周', date:'03-29 → 04-04', price:37.99, coupon:0, deal:'—', bsr:900, rating:4.4, reviews:1946, nOrders:372, aOrders:348, nSess:17200, aSess:16050, ad:'标价再降 $1，商品投放加价'},
    {w:'第11周', date:'04-05 → 04-11', price:37.99, coupon:5, deal:'Lightning Deal', bsr:860, rating:4.4, reviews:2040, nOrders:398, aOrders:356, nSess:20300, aSess:18050, ad:'广泛组收词，否掉他牌词'},
    {w:'第12周', date:'04-12 → 04-18', price:36.99, coupon:0, deal:'—', bsr:842, rating:4.4, reviews:2130, nOrders:412, aOrders:356, nSess:24600, aSess:20900, ad:'广告诉求转向词组，占比降到 46%'},
    {w:'第13周', date:'04-19 → 04-25', price:36.99, coupon:0, deal:'预测 12% 券测试', bsr:820, rating:4.4, reviews:2196, nOrders:424, aOrders:348, nSess:26200, aSess:21600, fc:true, ad:'预测：维持架构，测试 12% 券'}
  ];

  const chartWeek=w=>String(w.w).replace(/^第/,'').replace(/周$/,'')+'周';

  const netPrice=w=>Math.round(w.price*(1-w.coupon/100)*100)/100;
  const sesTotal=w=>w.nSess+w.aSess;
  const sesPct=w=>w.aSess/sesTotal(w)*100;
  const minNet=Math.min.apply(null, WEEKS.map(netPrice));

  /* ---------------- 关键拐点与对应动作 ---------------- */
  const TURNS=[
    {w:'第3周', when:'02-08 → 02-14', cls:'active', sig:'广告流量首次超过自然流量（6,900 vs 6,480），广告占比 51.6%', act:'15% 券 + 3 个大词精准同期开', judge:'券带动下单，精准广告带来曝光，两边一起把自然流量推高。'},
    {w:'第5周', when:'02-22 → 02-28', cls:'warn', sig:'广告占比到峰值 55.2%，CPC 涨到 $1.62', act:'7-Day Deal + 大词竞价 +20%', judge:'冲排名时广告费高于保本 CPC $1.41，这段买的是位置，利润会被压低。'},
    {w:'第7周', when:'03-08 → 03-14', cls:'warn', sig:'自然流量下降 5.2%，广告占比回落，BSR 退回 1,340', act:'15% 券到期停 + 广泛组上线', judge:'券停后流量回落，说明券带来的是对价格敏感的访客，停券后留不住。'},
    {w:'第8周', when:'03-15 → 03-21', cls:'active', sig:'自然流量重新超过广告（12,400 vs 12,150），占比 49.5%', act:'标价下调 $1 到 $38.99 + 词组扩词', judge:'降价后排名没有明显回退，比单发券更稳。'},
    {w:'第10周', when:'03-29 → 04-04', cls:'active', sig:'自然流量 17,200，广告占比降到 48.3%', act:'标价再降 $1 到 $37.99 + 长尾扩量', judge:'广告占比下降，自然流量开始接上。'},
    {w:'第12周', when:'04-12 → 04-18', cls:'active', sig:'自然占比 54.1%，广告占比 45.9%，BSR 842', act:'标价 $36.99、无券，广告诉求转向词组', judge:'排名稳定后，广告只负责守位置，主要拉新靠自然流量。'}
  ];

  /* ---------------- SIF 查广告架构：5 活动 / 11 广告组 ---------------- */
  const CAMPAIGNS=[
    {code:'C1', name:'SP-AUTO 自动发现', type:'SP · 自动', budget:15, role:'拓词 / 打底流量', evidence:'词数 186–412，词根分散且混入他牌词',
     groups:[
       {id:'AG-01', name:'自动-紧密匹配', kw:186, stab:'稳定 ±8%', roots:'henley / big tall / shirts', match:'自动-紧密', conf:88, hits:['R1','R3.1.1'], note:'词根收敛在 henley 与 big tall，无他牌词，相关性高'},
       {id:'AG-02', name:'自动-宽泛匹配', kw:412, stab:'波动 ±34%', roots:'无明显词根', match:'自动-宽泛', conf:72, hits:['R1','R2','R3.1.2'], note:'词很分散，含单字与他牌词（king size / carhartt）'}
     ]},
    {code:'C2', name:'SP-ASIN 商品投放', type:'SP · 商品投放', budget:18, role:'抢竞品详情页', evidence:'品牌词与型号碎片集中在 ASIN 展开词',
     groups:[
       {id:'AG-03', name:'竞品 ASIN 定投', kw:268, stab:'波动 ±26%', roots:'品牌词为主（king size / maverick）', match:'商品投放', conf:78, hits:['R1','R3.1.2'], note:'SIF 文档注明：商品投放跑出来的词也可能相关性很高，不绝对'},
       {id:'AG-04', name:'类目 / 品类投放', kw:154, stab:'波动 ±31%', roots:'men shirt / big tall 类目词', match:'商品投放', conf:66, hits:['R1','R2','R3.1.2'], note:'单字泛词 + 类目词混合，无固定词根'}
     ]},
    {code:'C3', name:'SP-EXACT 大词精准', type:'SP · 手动精准', budget:45, role:'抢大词首位 / 主推力', evidence:'3 组各自只有 1–2 个词，12 周数量 0 变化',
     groups:[
       {id:'AG-05', name:'big and tall henley', kw:1, stab:'0 变化', roots:'big and tall henley', match:'精准（单词）', conf:96, hits:['R2','R3.3.1','R3.4'], note:'一个词 + 独立广告活动，就是 SIF 文档里接近 100% 的单词精准情形'},
       {id:'AG-06', name:'plus size henley shirts', kw:1, stab:'0 变化', roots:'plus size henley shirts', match:'精准（单词）', conf:94, hits:['R2','R3.3.1','R3.4'], note:'竞品投了这个词，但标题和五点里没有写这个词'},
       {id:'AG-07', name:'henley shirts 3 pack', kw:2, stab:'0 变化', roots:'henley shirts 3 pack', match:'精准（2 词）', conf:90, hits:['R2','R3.3.2.1','R3.4'], note:'词根之外无任何延展，关键词数量几乎无波动'}
     ]},
    {code:'C4', name:'SP-PHRASE 词根词组', type:'SP · 手动词组', budget:22, role:'承接词根延展流量', evidence:'4 个词根组词序固定，只在首尾插词',
     groups:[
       {id:'AG-08', name:'词根 henley shirts', kw:46, stab:'稳定 ±6%', roots:'henley shirts', match:'词组', conf:84, hits:['R1','R2','R3.2.2.1','R3.4'], note:'big and tall henley shirts / henley shirts for men，词根顺序不变'},
       {id:'AG-09', name:'词根 big tall', kw:38, stab:'稳定 ±9%', roots:'big tall', match:'词组', conf:80, hits:['R1','R2','R3.2.2.1','R3.4'], note:'big tall henley / big tall shirts for men，仅首尾延展'}
     ]},
    {code:'C5', name:'SP-LONGTAIL 长尾 / 广泛', type:'SP · 手动 + 广泛', budget:18, role:'卡差异化长尾', evidence:'9 词长尾组稳定，74 词广泛组波动 38%',
     groups:[
       {id:'AG-10', name:'长尾精准组', kw:9, stab:'稳定 ±4%', roots:'longline / tagless / 5xl / heavyweight', match:'精准（多词根）', conf:86, hits:['R2','R3.2.1','R3.4'], note:'每个词根组内除词根外无延展 → 多个投放词的精准匹配'},
       {id:'AG-11', name:'广泛扩展组', kw:74, stab:'波动 ±38%', roots:'henley / cotton', match:'广泛', conf:74, hits:['R1','R2','R3.2.2.2'], note:'插词在前中后任意位置：cotton henley short sleeve men / henley men big size'}
     ]}
  ];

  /* ---------------- SIF 推测判据 R1–R4 ---------------- */
  const RULES=[
    {id:'R1', name:'关键词数量', obs:'单组词数跨度 1–412；词数 >30 的 7 个组（AG-01 / 02 / 03 / 04 / 08 / 09 / 11）全部落在自动 / 商品投放 / 词组 / 广泛',
     concl:'词数多 → 自动、商品投放、词组或广泛的概率更高（不绝对）', groups:'AG-02 / 03 / 04 / 08 / 09 / 11'},
    {id:'R2', name:'关键词数量的变化', obs:'AG-05 / 06 / 07 共 3 组 12 周词数 0 变化，AG-10 仅 ±4%；AG-02 / 04 / 11 波动超过 30%',
     concl:'长期稳定且词基本相同 → 精准；波动明显 → 自动 / 商品投放 / 词组 / 广泛', groups:'正向 AG-05 / 06 / 07 / 10 · 反向 AG-02 / 04 / 11'},
    {id:'R3', name:'词根的分散 / 集中', obs:'无词根 2 组（AG-02 / 03）；单词根且词序固定 5 组（AG-05–09）；多词根无延展 1 组（AG-10）；词序不固定 1 组（AG-11）',
     concl:'分散 → 自动 / 商品投放；词根组内无延展 → 多个精准词；词序固定只首尾插词 → 词组；词序不固定 → 广泛', groups:'AG-01 / 02 / 03 / 08 / 09 / 10 / 11'},
    {id:'R4', name:'关键词搜索量层级', obs:'词组 / 广泛挂的都是 20K–68K 大词；3 个大词各自独立成组；长尾层 5 个词合计 39.1K / 月却只给了一个 9 词组',
     concl:'词组与广泛多为大词；大词一组一个大词，长尾可以多词一组', groups:'AG-05 / 06 / 07 / 08 / 09 / 10'}
  ];

  /* ---------------- 词库分层（与 07 埋词表同源） ---------------- */
  const LAYERS=[
    {code:'LAYER 01 / 大词', name:'大词', count:3, sum:161700, match:'精准 · 1 词 1 组', bid:'$1.35–$1.60', share:45,
     words:[['big and tall henley',68400,true],['big and tall shirts for men',52100,true],['plus size henley shirts',41200,false]],
     note:'竞品 3 个词全部单独成组，但其中 plus size henley shirts 买了词没埋词。'},
    {code:'LAYER 02 / 词根词', name:'词根词', count:4, sum:101700, match:'词组 · 词根延展', bid:'$1.05–$1.25', share:30,
     words:[["men's henley shirts 3 pack",27900,true],['henley shirts for men short sleeve',33600,true],['henley t shirts men',21500,true],['cotton henley shirts men',18700,true]],
     note:'4 个词根词全覆盖，但词组组只有 46 / 38 个词，承接力度明显低于大词精准组。'},
    {code:'LAYER 03 / 长尾', name:'长尾', count:5, sum:39100, match:'精准 · 多词一组', bid:'$0.75–$0.95', share:25,
     words:[['comfy henley shirts men',12300,true],['henley big and tall 5xl',9800,false],['tagless henley',6400,true],['heavyweight cotton henley',5700,true],['longline henley',4900,false]],
     note:'5 个长尾词只给了 9 个投放位的组与最低预算；longline / 5xl 两个词标题和五点里也没写。'}
  ];

  /* ---------------- 我方预算与竞价档位（对齐 06 GATE 02） ---------------- */
  const MY_BUDGET=[
    {name:'SP-AUTO 自动', daily:8, bid:'$0.85–$1.05', acos:'45%', stop:'ACOS > 55% 且 7 天无新词即停'},
    {name:'SP-PHRASE 词根', daily:12, bid:'$1.05–$1.25', acos:'40%', stop:'词根组 CTR < 0.3% 收词'},
    {name:'SP-EXACT 大词（2 组）', daily:18, bid:'$1.30–$1.50', acos:'38%', stop:'CPC > '+BREAKEVEN_CPC+' 保本线即降竞价'},
    {name:'SP-LONGTAIL 长尾', daily:7, bid:'$0.75–$0.95', acos:'42%', stop:'7 天 0 转化即收词'}
  ];

  /* ---------------- 我方对标攻击位 ---------------- */
  const ATTACKS=[
    {t:'正面抢 plus size henley shirts', tag:'大搜索词正面位', d:'41,200 / 月的大搜索词，竞品 AG-06 用单词精准广告，但标题和五点都没有写这个词。相关性分会低，ACOS 只能靠提高竞价维持。我方标题和五点 2 同时写进这个词，再用词组组接住，$1.35 起竞价就能压住它的质量分。'},
    {t:'卡 3 个「投了却没写」的词', tag:'相关性优势', d:'plus size henley shirts / longline henley / henley big and tall 5xl 合计 55,900 / 月，竞品在投这些词，但标题和五点没有写。我方三处同时写进词，点击进来更相关。'},
    {t:'长尾组加词加预算', tag:'低成本试投', d:'竞品 AG-10 只有 9 个词、$18 / 日、$0.75–$0.95 最低档；tagless / longline / heavyweight 的 CPC 只有 $0.62–$0.88。我方按 5 个长尾词根扩到 12 个投放词，$0.95 起竞价，单周成本控制在 $49 左右。'},
    {t:'错峰打大词，避开券期', tag:'节奏错峰', d:'第2–6周竞品连续用券（最高 15%），同时把大词竞价加 20%，CPC 涨到 $1.62，高于保本 '+BREAKEVEN_CPC+'。第7周券停后，大词 CPC 回落到 $1.18。我方可以把大词预算放在第7–9周，同样的钱买到更多曝光。'}
  ];

  /* ---------------- 派生读数 ---------------- */
  const peakSes=WEEKS.reduce((a,b)=>sesPct(b)>sesPct(a)?b:a);
  const cur=WEEKS[WEEKS.length-2];
  const bsrGain=WEEKS[0].bsr-WEEKS[11].bsr;
  const revGain=WEEKS[11].reviews-WEEKS[0].reviews;

  function matchBadge(m){
    if(/自动/.test(m)) return U.badge(m,'info');
    if(/商品/.test(m)) return U.badge(m,'violet');
    if(/精准/.test(m)) return U.badge(m,'ok');
    if(/词组/.test(m)) return U.badge(m,'warn');
    return U.badge(m,'risk');
  }

  function wow(arr,i){
    if(i===0) return null;
    return (arr[i]/arr[i-1]-1)*100;
  }

  /* ---------------- 页头 + 结论 ---------------- */
  function benchNote(){
    if(BENCH_ASIN===PROFILED) return '';
    return '<div class="callout" style="margin-top:10px">当前对标 <b>'+F.esc(BENCH_ASIN)+'</b> 尚无 SIF 拆解样本，以下内容为 <b>'+PROFILED+'</b> 的口径演示</div>';
  }

  function head(){
    return '<div class="page-head"><div class="page-head-l">'
      +'<div class="eyebrow">MODULE 08 / PROMOTION &amp; AD STRUCTURE</div>'
      +'<h1>推广策略<span class="en">PROMOTION &amp; AD STRUCTURE</span></h1>'
      +'<div class="page-sub">对标 '+BENCH_ASIN+'（'+F.esc(BENCH_BRAND)+'）：把券、价格、广告和流量放在一起看，再拆广告活动和广告组。分析窗口 '+CX.windowShort()+'；表格和图表沿用完整 13 周演示样本。</div>'
        +benchNote()+'</div>'
      +'<div class="head-actions"><span class="chip chip-cyan">'+BENCH_ASIN+'</span><span class="chip chip-dim">'+F.esc(BENCH_BRAND)+'</span>'
      +'<button type="button" class="btn btn-ghost" data-report="promotion" data-label="推广策略拆解">加入报告</button></div></div>';
  }

  function verdictPanel(){
    return '<section class="panel vsplit" style="display:grid;grid-template-columns:minmax(0,1fr) 290px;overflow:hidden;margin-bottom:14px">'
      +'<div class="verdict-main">'
        +'<div class="eyebrow" style="margin-bottom:8px">CONCLUSION / '+BENCH_ASIN+'</div>'
        +'<h2 style="font-size:17px">第3周同时上了 15% 券和 3 个大搜索词的精准广告，4 周内 BSR 排名从第 4,860 名升到第 1,520 名，之后又分三次降价到第 842 名。停券后第一周流量下降 5.2%。从结果看，降价和精准词广告对排名的帮助更明显。</h2>'
        +'<div class="mini-note" style="margin-bottom:8px">读法：第3周就是 02-08 至 02-14。BSR 是亚马逊畅销排名，数字越小越靠前。大词指搜索量大的词。</div>'
        +'<div class="reason">可以照着做的节奏：</div>'
        +'<div class="reason-list">'+U.tag('15% 券只用在第3–5周','hot')+U.tag('3 个大搜索词各建 1 组','good')+U.tag('停券后 1 周自然流量 -5.2%','bad')+U.tag('广告占比 55.2% → 45.9%','violet')+U.tag('11 组里 6 组用精准或词组','')+'</div>'
      +'</div>'
      +'<div class="verdict-side">'
        +'<div class="vs-row"><span>数据快照</span><b>'+SNAPSHOT+'</b></div>'
        +'<div class="vs-row"><span>流量窗口</span><b>'+CX.windowShort()+'</b></div>'
        +(CX.windowCoverageNote()?'<div class="mini-note">'+F.esc(CX.windowCoverageNote())+'</div>':'')
        +'<div class="vs-row"><span>能看到的层级</span><b>商品（ASIN）</b></div>'
        +'<div class="vs-row"><span>CPC / 保本</span><b>'+CPC+' / '+BREAKEVEN_CPC+'</b></div>'
        +'<div class="vs-row"><span>机会分（06 口径）</span><b>'+OPPORTUNITY+' / 100</b></div>'
        +'<a class="link small" data-go="listing">回看 07 Listing 拆解 →</a>'
      +'</div></section>';
  }

  /* ---------------- 08-0 口径声明 ---------------- */
  function scopePanel(){
    return U.panel({
      idx:'08-0',
      title:'先说明：券和价格只用来观察竞品',
      sub:'无推广毛利不扣券；这里记录竞品怎么用券，不用来改我方定价',
      tools:U.chip('只看竞品','amber')+U.chip(CX.windowWeeks()+' 周窗口','cyan'),
      body:'<div class="callout callout-warn"><b>记住这一点：</b>这里的价格和券只用来观察竞品，不影响 01 和 06 的结论。</div>'
        +'<div class="grid g21" style="align-items:start;margin-top:12px">'
          +'<div class="bullet-list">'
            +'<div class="bullet"><b>这一节看竞品怎么做，不用来改我方定价：</b>记录 '+BENCH_ASIN+' 在第1–13周的标价、券力度和 Deal 动作。我方定价仍按无推广毛利 '+GROSS_MARGIN+'（不扣券）、价格带 '+PRICE_BAND+'（均价 '+PRICE_AVG+'）。</div>'
            +'<div class="bullet"><b>券后价不进入 01 和 06 的结论：</b>券后价只出现在「价格策略」这一列，不进入 01 市场分析的价格带结论，也不影响 06 的机会分 '+OPPORTUNITY+'。</div>'
            +'<div class="bullet"><b>几个名词：</b>券是站内优惠券（Coupon）；Deal 是 7 天促销、限时秒杀或 Prime 专享折扣；CPC 是单次点击成本；ACOS 是广告花费占销售额的比例；退货率 '+RETURN_RATE+'。BSR 是亚马逊畅销排名，数字越小越靠前。</div>'
            +'<div class="bullet"><b>能看到什么：</b>广告架构只能看到 ASIN 这一层：活动、广告组、可能投放的词和匹配方式。广告组以下的竞价调整、分时折扣、预算流动看不到。</div>'
          +'</div>'
          +'<div>'
            +'<div class="field-label" style="margin-bottom:6px">本板块观测参数</div>'
            +'<table class="stat-table">'
              +'<tr><td>对标 ASIN / 品牌</td><td>'+BENCH_ASIN+'</td></tr>'
              +'<tr><td>观测窗口</td><td>'+WINDOW_TEXT()+'</td></tr>'
              +'<tr><td>竞品标价轨迹</td><td>$39.99 → $36.99</td></tr>'
              +'<tr><td>券后最低价</td><td class="c-amber">'+F.money(minNet)+'（15% 券）</td></tr>'
              +'<tr><td>我方价格带（观测基准）</td><td>'+PRICE_BAND+'</td></tr>'
            +'</table>'
            +'<div class="mini-note">'+WEEK_SPAN()+'</div>'
          +'</div>'
        +'</div>',
      foot:'<span>数据说明：无推广毛利不扣券</span><span class="spacer"></span><span class="c-amber">券后价不作为我方定价依据</span>'
    });
  }

  /* ---------------- KPI ---------------- */
  function kpiRow(){
    return '<div class="kpi-grid">'
      +U.kpi({label:'广告活动 / 广告组', value:'5', unit:'/ 11 组', foot:'SIF 查广告架构 · 能到商品（ASIN）层'})
      +U.kpi({label:'广告流量占比', value:F.dec(sesPct(cur),1), unit:'%', delta:F.signed(sesPct(cur)-sesPct(peakSes),1,'pp'), foot:'峰值 '+F.dec(sesPct(peakSes),1)+'% · '+peakSes.w, spark:WEEKS.map(sesPct), color:'#4f8cff'})
      +U.kpi({label:'券后最低价', value:F.money(minNet), delta:F.signed((minNet/WEEKS[0].price-1)*100,1,'%'), foot:'标价 '+F.money(WEEKS[0].price)+' · 第3–5周用 15% 券'})
      +U.kpi({label:'BSR 位次提升', value:F.num(WEEKS[11].bsr), delta:'-'+F.num(bsrGain), deltaDir:'up', foot:'第1周 '+F.num(WEEKS[0].bsr)+' → 第12周 '+F.num(WEEKS[11].bsr), spark:WEEKS.map(w=>-w.bsr), color:'#a78bfa'})
      +U.kpi({label:'评分 / 评论数', value:F.dec(WEEKS[11].rating,1), unit:'/5', delta:'+'+F.num(revGain)+' 评', foot:F.num(WEEKS[0].reviews)+' → '+F.num(WEEKS[11].reviews)+' 条'})
      +'</div>';
  }

  /* ---------------- 08-A 前三个月推广节奏 ---------------- */
  function rhythmCharts(){
    const combo=C.comboBars({
      labels:WEEKS.map(chartWeek), height:262,
      bars:[{name:'自然订单', values:WEEKS.map(w=>w.nOrders), color:'#2ee6a8'},{name:'广告订单', values:WEEKS.map(w=>w.aOrders), color:'#4f8cff'}],
      lines:[{name:'券力度 %（右轴）', values:WEEKS.map(w=>w.coupon), color:'#ffc857', right:true}],
      yRightMax:20, rightColor:'#ffc857', yFmt:v=>F.compact(v)
    });
    const bsr=C.line({
      labels:WEEKS.map(chartWeek), height:262, xStep:1,
      series:[{name:'BSR 排名（越低越好）', values:WEEKS.map(w=>w.bsr), color:'#a78bfa'}],
      yFmt:v=>'#'+F.compact(Math.round(v)), tipFmt:v=>'#'+F.num(v),
      refLines:[{y:1000, label:'目标 BSR 1,000', color:'#ffc857'}]
    });
    return '<div class="grid g12" style="align-items:start">'
      +'<div><div class="field-label" style="margin-bottom:6px">订单结构 × 券力度 · 第1–13周</div>'+combo
        +'<div class="chart-note"><span>柱 = 周订单（自然 / 广告）</span><span>横轴是第几周 · 黄线 = 券力度 %（右轴）</span></div></div>'
      +'<div><div class="field-label" style="margin-bottom:6px">BSR 排名变化 · 越低越好</div>'+bsr
        +'<div class="chart-note"><span>第1周 4,860 → 第12周 842</span><span>第13周为预测</span></div></div>'
      +'</div>';
  }

  function rhythmTable(){
    return '<div class="table-wrap tall"><table class="tbl" style="min-width:880px"><thead><tr>'
      +'<th>周次</th><th>窗口</th><th class="num">标价 / 券后</th><th>券</th><th>Deal</th><th>广告动作</th><th class="num">BSR</th><th class="num">评分</th><th class="num">评论</th>'
      +'</tr></thead><tbody>'
      +WEEKS.map(w=>{
        return '<tr'+(w.fc?' style="opacity:.72"':'')+'>'
          +'<td class="main-cell mono">'+w.w+(w.fc?' '+U.badge('预测','violet'):'')+'</td>'
          +'<td class="mono tiny">'+w.date+'</td>'
          +'<td class="num">'+F.money(w.price)+'<span class="sub">券后 '+F.money(netPrice(w))+'</span></td>'
          +'<td>'+(w.coupon?U.chip(w.coupon+'%','amber'):U.chip('无券','dim'))+'</td>'
          +'<td class="tiny">'+F.esc(w.deal)+'</td>'
          +'<td class="tiny">'+F.esc(w.ad)+'</td>'
          +'<td class="num">#'+F.num(w.bsr)+'</td>'
          +'<td class="num">'+F.dec(w.rating,1)+'</td>'
          +'<td class="num">'+F.num(w.reviews)+'</td>'
          +'</tr>';
      }).join('')
      +'</tbody></table></div>';
  }

  function rhythmTimeline(){
    return '<div class="timeline">'+TURNS.map(t=>'<div class="tl-item '+t.cls+'">'
      +'<span class="tl-dot"></span>'
      +'<div class="tl-head"><span class="tl-title">'+F.esc(t.sig)+'</span><span class="tl-week">'+t.w+' · '+t.when+'</span></div>'
      +'<div class="tl-body"><b>对应动作：</b>'+F.esc(t.act)+'<br>'+F.esc(t.judge)+'</div>'
      +'</div>').join('')+'</div>';
  }

  function rhythmPanel(){
    const revLine='<div class="kpi-inline" style="margin-top:2px">'
      +'<div><b>'+F.dec(WEEKS[0].rating,1)+' → '+F.dec(WEEKS[11].rating,1)+'</b><span>评分</span></div>'
      +'<div><b>'+F.num(WEEKS[0].reviews)+' → '+F.num(WEEKS[11].reviews)+'</b><span>评论数</span></div>'
      +'<div><b>+'+F.num(revGain)+'</b><span>12 周新增</span></div>'
      +'<div><b>'+(revGain/12).toFixed(1)+' 条/周</b><span>评论动能</span></div>'
      +'</div>';
    return U.panel({
      idx:'08-A',
      title:'前三个月推广节奏（第1–13周）',
      sub:'价格、券、Deal、广告动作、BSR、评分与评论，按周对齐',
      tools:U.chip('第1–13周','cyan')+U.chip('12 周记录 + 第13周预测','dim'),
      body:rhythmCharts()
        +'<div class="divider"></div>'
        +'<div class="field-label" style="margin-bottom:7px">周度节奏表 · 价格策略 = 标价 + 券 + Deal 三层</div>'
        +rhythmTable()
        +'<div class="divider"></div>'
        +'<div class="grid g12" style="align-items:start">'
          +'<div><div class="field-label" style="margin-bottom:7px">关键拐点与对应动作</div>'+rhythmTimeline()+'</div>'
          +'<div><div class="field-label" style="margin-bottom:7px">评分与评论数变化</div>'
            +revLine
            +'<div class="callout" style="margin-top:11px"><b>节奏读法：</b>评分在第3周和第8周各涨 0.1。第3周靠券和精准广告带来更多好评，第8周靠降价和扩充词组把差评比例压低。评论每周增加 52–94 条，没有突然刷评的尖峰。</div>'
            +'<div class="mini-note">券与价格只用于观测竞品动作，不参与 01 / 06 结论；评分与评论变化用于判断它的节奏是否靠产品力承接。</div>'
          +'</div>'
        +'</div>',
      foot:'<span>'+WEEK_SPAN()+'</span><span class="spacer"></span><span class="c-amber">13 周内标价三次下调：$39.99 → $38.99 → $37.99 → $36.99</span>'
    });
  }

  /* ---------------- 08-B SIF 运营时光机 · 流量变化 ---------------- */
  function flowChart(){
    return C.line({
      labels:WEEKS.map(chartWeek), height:300, xStep:1,
      series:[
        {name:'自然流量（访问次数）', values:WEEKS.map(w=>w.nSess), color:'#2ee6a8'},
        {name:'广告流量（访问次数）', values:WEEKS.map(w=>w.aSess), color:'#4f8cff', area:false}
      ],
      yFmt:v=>F.compact(Math.round(v)), tipFmt:v=>F.num(v),
      refLines:[{y:20000, label:'2 万访问门槛', color:'#38e1ff'}]
    });
  }

  function flowPanel(){
    const wowList='<div class="mini-list">'+WEEKS.map((w,i)=>{
      const nw=wow(WEEKS.map(x=>x.nSess),i);
      return '<div class="mini-item"><span class="mono">'+w.w+'</span><span style="flex:1">'+F.num(w.nSess)+' / '+F.num(w.aSess)+'</span>'
        +(nw===null?'<b>—</b>':'<b>'+U.deltaTag(nw,'%')+'</b>')+'</div>';
    }).join('')+'</div>';

    const shareList='<div class="score-list">'+WEEKS.map(w=>{
      const p=sesPct(w);
      return '<div class="score-row" style="grid-template-columns:28px minmax(0,1fr) 42px"><span class="lbl mono">'+w.w+'</span>'
        +'<span class="track '+(p>=52?'amber':p<=47?'mint':'')+'"><i style="width:'+p+'%"></i></span>'
        +'<span class="val">'+F.dec(p,1)+'%</span></div>';
    }).join('')+'</div>';

    return U.panel({
      idx:'08-B',
      title:'SIF 运营时光机 · 流量变化',
      sub:'自然流量和广告流量两条线，加上广告占比、每周变化和关键拐点',
      tools:U.chip('第1–12周记录','cyan')+U.chip('广告占比 45.9%','mint')+U.chip('广告流量 +477%','dim'),
      body:'<div class="grid g21" style="align-items:start">'
        +'<div>'
          +'<div class="field-label" style="margin-bottom:6px">自然流量 vs 广告流量 · 访问次数</div>'
          +flowChart()
          +'<div class="chart-note"><span>数据源：SIF 运营时光机 · '+WINDOW_TEXT()+'</span><span>横轴是第几周 · 第13周为预测</span></div>'
          +'<div class="divider"></div>'
          +'<div class="field-label" style="margin-bottom:7px">拐点 → 现象 → 动作 → 结论</div>'
          +'<div class="table-wrap"><table class="tbl" style="min-width:660px"><thead><tr><th>周次</th><th>现象</th><th>对应动作</th><th>结论</th></tr></thead><tbody>'
          +TURNS.map(t=>'<tr><td class="main-cell mono">'+t.w+'<span class="sub">'+t.when+'</span></td><td>'+F.esc(t.sig)+'</td><td class="tiny">'+F.esc(t.act)+'</td><td class="tiny">'+F.esc(t.judge)+'</td></tr>').join('')
          +'</tbody></table></div>'
          +'<div class="callout callout-ok" style="margin-top:11px"><b>时光机结论：</b>自然流量从 4,100 涨到 24,600（+500%），广告流量从 3,620 涨到 20,900（+477%）。广告占比在第5周达到峰值 55.2%，之后逐步下降。第3周同时上了 15% 券和 3 个大搜索词的精准广告，第8周起又连续降价，流量曲线在这两段明显变陡。</div>'
        +'</div>'
        +'<div>'
          +'<div class="field-label" style="margin-bottom:6px">广告流量占比（周）</div>'
          +shareList
          +'<div class="mini-note">第5周峰值 55.2% → 第12周 45.9%，降了 9.3 个百分点。广告占比下降时，自然流量还在涨，说明广告带来的曝光开始转成自然流量。</div>'
          +'<div class="divider"></div>'
          +'<div class="field-label" style="margin-bottom:6px">自然流量和上一周比</div>'
          +wowList
          +'<div class="mini-note">右侧数字是自然流量和上一周比的变化；<b class="c-rose">第7周的 -5.2%</b> 是 12 周里唯一的负值，正好对应 15% 券到期的同一周。</div>'
        +'</div>'
      +'</div>',
      foot:'<span>总流量 = 自然流量 + 广告流量；两条线都按访问次数统计</span><span class="spacer"></span><span class="c-mint">自然流量 +500% · 广告占比 −9.3pp</span>'
    });
  }

  /* ---------------- 08-C SIF 查广告架构 · 架构拆解 ---------------- */
  function archTree(){
    return '<div class="tree">'+CAMPAIGNS.map(cp=>'<div class="tree-node open">'
      +'<div class="tree-row">'
        +'<span class="tree-caret">▸</span>'
        +'<span class="tree-name" title="'+F.esc(cp.code+' '+cp.name+' · '+cp.role)+'"><b class="mono c-cyan">'+cp.code+'</b> '+F.esc(cp.name)+'<span class="mini-note" style="margin:0 0 0 6px">'+F.esc(cp.role)+'</span></span>'
        +'<span class="tree-type">'+F.esc(cp.type)+'</span>'
        +'<span class="tree-meta">$'+cp.budget+' / 日 · '+cp.groups.length+' 组</span>'
      +'</div>'
      +'<div class="tree-children">'
        +cp.groups.map(g=>'<div class="adgroup">'
          +'<span class="ag-name" title="'+F.esc(g.note)+'"><b class="mono">'+g.id+'</b> '+F.esc(g.name)+'</span>'
          +'<span class="ag-kw">'+F.num(g.kw)+' 词</span>'
          +matchBadge(g.match)
          +'<span class="conf">'+g.conf+'<span class="meter '+(g.conf>=85?'mint':g.conf>=75?'':'amber')+'"><i style="width:'+g.conf+'%"></i></span></span>'
        +'</div>').join('')
      +'</div></div>').join('')+'</div>'
      +'<div class="tree-legend">'
        +'<span>'+U.badge('自动','info')+' 自动匹配</span>'
        +'<span>'+U.badge('商品投放','violet')+' 商品 / ASIN 投放</span>'
        +'<span>'+U.badge('精准','ok')+' 精准匹配</span>'
        +'<span>'+U.badge('词组','warn')+' 词组匹配</span>'
        +'<span>'+U.badge('广泛','risk')+' 广泛匹配</span>'
      +'</div>';
  }

  function archTable(){
    return '<div class="table-wrap"><table class="tbl" style="min-width:720px"><thead><tr>'
      +'<th>活动</th><th>类型</th><th class="num">组数</th><th class="num">推测日预算</th><th class="num">预算占比</th><th>主要职能</th><th>观测证据</th>'
      +'</tr></thead><tbody>'
      +CAMPAIGNS.map(cp=>'<tr>'
        +'<td class="main-cell mono">'+cp.code+'<span class="sub">'+F.esc(cp.name)+'</span></td>'
        +'<td class="tiny">'+F.esc(cp.type)+'</td>'
        +'<td class="num">'+cp.groups.length+'</td>'
        +'<td class="num">$'+cp.budget+'</td>'
        +'<td class="num">'+F.dec(cp.budget/TOTAL_BUDGET*100,1)+'%</td>'
        +'<td class="tiny">'+F.esc(cp.role)+'</td>'
        +'<td class="tiny">'+F.esc(cp.evidence)+'</td>'
        +'</tr>').join('')
      +'<tr><td class="main-cell">合计</td><td class="tiny">5 个活动</td><td class="num">11</td><td class="num">$'+TOTAL_BUDGET+'</td><td class="num">100%</td><td class="tiny">自动 / 商品投放 / 精准 / 词组 / 长尾</td><td class="tiny">ASIN 级推算，非后台真实预算</td></tr>'
      +'</tbody></table></div>';
  }

  function archPanel(){
    const totalKw=CAMPAIGNS.reduce((s,cp)=>s+cp.groups.reduce((t,g)=>t+g.kw,0),0);
    return U.panel({
      idx:'08-C',
      title:'SIF 查广告架构 · 广告架构拆解',
      sub:'5 个活动 / 11 个广告组：活动 → 广告组 → 推测关键词与匹配方式',
      tools:U.chip('5 活动','cyan')+U.chip('11 广告组','mint')+U.chip('ASIN 级粒度','amber'),
      body:'<div class="grid g21" style="align-items:start">'
        +'<div>'
          +'<div class="field-label" style="margin-bottom:7px">结构树 · 活动 → 广告组 → 词与匹配方式</div>'
          +archTree()
        +'</div>'
        +'<div>'
          +'<div class="field-label" style="margin-bottom:6px">结构读数</div>'
          +'<div class="kpi-inline">'
            +'<div><b>5</b><span>广告活动</span></div>'
            +'<div><b>11</b><span>广告组</span></div>'
            +'<div><b>$'+TOTAL_BUDGET+'</b><span>推测日预算</span></div>'
            +'<div><b>'+F.num(totalKw)+'</b><span>可见关键词</span></div>'
          +'</div>'
          +'<table class="stat-table" style="margin-top:9px">'
            +'<tr><td>单组最小词数</td><td>1（AG-05 / 06）</td></tr>'
            +'<tr><td>单组最大词数</td><td>412（AG-02）</td></tr>'
            +'<tr><td>稳定组（0 变化）</td><td>3 / 11</td></tr>'
            +'<tr><td>大词预算占比</td><td class="c-cyan">38.1%（C3）</td></tr>'
            +'<tr><td>长尾预算占比</td><td class="c-amber">15.3%（C5）</td></tr>'
          +'</table>'
          +'<div class="callout callout-warn" style="margin-top:11px"><b>能看到什么：</b>只能确认到 ASIN 这一层：活动、广告组、可能投放的词和匹配方式。广告组以下的竞价调整、分时折扣、预算在组间流动看不到，这里不做推断。</div>'
          +'<div class="mini-note">结构判断：C3 用 3 个大搜索词各自独立成组，占 38% 预算；C5 只给长尾 15%。这种分配适合从长尾侧切进去。</div>'
        +'</div>'
      +'</div>'
      +'<div class="divider"></div>'
      +'<div class="field-label" style="margin-bottom:7px">活动级汇总 · 预算与职能</div>'
      +archTable(),
      foot:'<span>数据源：SIF 查广告架构 · 广告架构拆解</span><span class="spacer"></span><span>快照 '+SNAPSHOT+'</span>'
    });
  }

  /* ---------------- 08-D 匹配方式推测引擎 ---------------- */
  function ruleTable(){
    return '<div class="table-wrap"><table class="tbl" style="min-width:760px"><thead><tr>'
      +'<th>规则</th><th>看到的数值</th><th>怎么判断</th><th>命中的组</th>'
      +'</tr></thead><tbody>'
      +RULES.map(r=>'<tr>'
        +'<td class="main-cell mono">'+r.id+'<span class="sub">'+F.esc(r.name)+'</span></td>'
        +'<td class="tiny">'+F.esc(r.obs)+'</td>'
        +'<td class="tiny">'+F.esc(r.concl)+'</td>'
        +'<td class="mono tiny c-cyan">'+F.esc(r.groups)+'</td>'
        +'</tr>').join('')
      +'</tbody></table></div>';
  }

  function groupRows(){
    const rows=[];
    CAMPAIGNS.forEach(cp=>{
      cp.groups.forEach(g=>{
        rows.push('<tr>'
          +'<td class="main-cell mono">'+g.id+'<span class="sub">'+F.esc(g.name)+'</span></td>'
          +'<td class="num">'+F.num(g.kw)+'</td>'
          +'<td class="tiny">'+F.esc(g.stab)+'</td>'
          +'<td class="tiny mono">'+F.esc(g.roots)+'</td>'
          +'<td>'+matchBadge(g.match)+'</td>'
          +'<td><div class="meter-cell">'+U.meter(g.conf, g.conf>=85?'mint':g.conf>=75?'':'amber')+'<span>'+g.conf+'</span></div></td>'
          +'<td>'+g.hits.map(h=>U.badge(h,'violet')).join(' ')+'</td>'
          +'<td class="tiny">'+F.esc(g.note)+'</td>'
          +'</tr>');
      });
    });
    return rows.join('');
  }

  function enginePanel(){
    return U.panel({
      idx:'08-D',
      title:'猜它怎么投：匹配方式',
      sub:'用 4 条规则看每个广告组更像哪种匹配方式',
      tools:U.chip('4 条规则','cyan')+U.chip('11 组全部判断','mint'),
      body:'<div class="insight-list">'
        +'<div class="insight"><span class="insight-n">01</span><div><b>先看词多不多、数量稳不稳：</b>词多且数量波动，可能是自动、商品投放、词组或广泛；词少且长期不变，更像精准。11 组里有 4 组可以先判断。</div></div>'
        +'<div class="insight"><span class="insight-n">02</span><div><b>再看词根是否集中：</b>没有共同词根、混着单字和其他品牌词，更像自动宽泛或商品投放；能收敛到 1–2 个词根，再看是词组还是精准。</div></div>'
        +'<div class="insight"><span class="insight-n">03</span><div><b>词根组里看延展方式：</b>除词根外没有延展词，更像多个精准词；只在首尾插词、词序固定，更像词组；前后中间都能插、词序不固定，更像广泛。</div></div>'
        +'<div class="insight"><span class="insight-n">04</span><div><b>最后看搜索量：</b>词组和广泛多挂 20K–68K 的大词；大词通常一组一个，长尾才会多个词一组。三条都对上，可信度才高。</div></div>'
      +'</div>'
      +'<div class="divider"></div>'
      +'<div class="field-label" style="margin-bottom:7px">判定表 · 规则 → 看到的数值 → 结论</div>'
      +ruleTable()
      +'<div class="divider"></div>'
      +'<div class="field-label" style="margin-bottom:7px">逐组看：关键词数 / 词根 / 更像哪种匹配 / 可信度 / 命中的规则</div>'
      +'<div class="table-wrap tall"><table class="tbl" style="min-width:900px"><thead><tr>'
        +'<th>广告组</th><th class="num">关键词数</th><th>数量稳定性</th><th>词根</th><th>更像哪种匹配</th><th>可信度</th><th>命中的规则</th><th>判定依据</th>'
      +'</tr></thead><tbody>'+groupRows()+'</tbody></table></div>'
      +'<div class="callout callout-warn" style="margin-top:11px"><b>这些是推断结果：</b>SIF 文档也写明「不绝对」。商品投放跑出来的词相关性也可能很高，自动紧密和词组在词根上会重叠。可信度低于 80 的 4 组（AG-02 / 03 / 04 / 11）只作为可能性排序，不进入我方词库决策。</div>'
      +'<div class="mini-note">可信度怎么算：看规则命中数和命中强度，再用搜索量层级交叉验证。分数越高，越可能是这种匹配方式。</div>',
      foot:'<span>规则来源：SIF 竞品广告投放策略推测方式 第 1–4 条</span><span class="spacer"></span><span class="c-violet">11 / 11 组已判断 · 7 组可信度 ≥80</span>'
    });
  }

  /* ---------------- 08-E 可复用投放结论 ---------------- */
  function layerCards(){
    return '<div class="roadmap">'+LAYERS.map(l=>'<div class="phase">'
      +'<div class="phase-code">'+F.esc(l.code)+'</div>'
      +'<div class="phase-title">'+F.esc(l.name)+' · '+l.count+' 个词 / '+F.dec(l.sum/1000,1)+'K 月搜索</div>'
      +'<div class="phase-time">'+F.esc(l.match)+' · 竞价 '+F.esc(l.bid)+' · 预算占比 '+l.share+'%</div>'
      +'<ul class="phase-list">'+l.words.map(x=>'<li>'+F.esc(x[0])+' · '+F.num(x[1])+' / 月 '+(x[2]?U.badge('竞品已覆盖','ok'):U.badge('竞品未埋','risk'))+'</li>').join('')+'</ul>'
      +'<div class="phase-kpi">'+F.esc(l.note)+'</div>'
      +'</div>').join('')+'</div>';
  }

  function budgetTable(){
    const sum=MY_BUDGET.reduce((s,b)=>s+b.daily,0);
    return '<div class="table-wrap"><table class="tbl" style="min-width:640px"><thead><tr>'
      +'<th>我方活动</th><th class="num">日预算</th><th>出价档位</th><th class="num">目标 ACOS</th><th>止损线</th>'
      +'</tr></thead><tbody>'
      +MY_BUDGET.map(b=>'<tr>'
        +'<td class="main-cell">'+F.esc(b.name)+'</td>'
        +'<td class="num">$'+b.daily+'</td>'
        +'<td class="mono tiny c-cyan">'+F.esc(b.bid)+'</td>'
        +'<td class="num">'+F.esc(b.acos)+'</td>'
        +'<td class="tiny">'+F.esc(b.stop)+'</td>'
        +'</tr>').join('')
      +'<tr><td class="main-cell">合计（启动期）</td><td class="num">$'+sum+'</td><td class="mono tiny">平均 CPC 上限 '+BREAKEVEN_CPC+'</td><td class="num">≤ 38%</td><td class="tiny">无推广毛利 '+GROSS_MARGIN+' 为天花板</td></tr>'
      +'</tbody></table></div>';
  }

  function reusePanel(){
    return U.panel({
      idx:'08-E',
      title:'可复用投放结论',
      sub:'竞品词库分层 / 我方预算与出价档位 / 对标攻击位',
      tools:U.chip('3 层词库','cyan')+U.chip('$45 / 日 启动','mint')+U.chip('4 个攻击位','amber'),
      body:'<div class="field-label" style="margin-bottom:7px">词库分层 · 12 个词 / 302.5K 月搜索（与 07 埋词表同源）</div>'
        +layerCards()
        +'<div class="divider"></div>'
        +'<div class="grid g21" style="align-items:start">'
          +'<div>'
            +'<div class="field-label" style="margin-bottom:7px">我方预算与出价档位 · 对齐 06 GATE 02（$45 → $80 / 日）</div>'
            +budgetTable()
            +'<div class="callout callout-ok" style="margin-top:11px"><b>预算逻辑：</b>大词单组每天不超过 $10，长尾组用剩余预算滚动测试。CPC 一旦超过保本 '+BREAKEVEN_CPC+' 就降竞价，不加预算。竞品在第5周把大词 CPC 加到 $1.62，已经高于保本线，启动期不跟这个动作。</div>'
            +'<div class="mini-note">放量条件与 06 GATE 02 一致：ACOS ≤ 38%、自然排名进前 24、评分 ≥ 4.3 后，日预算从 $45 提到 $80。</div>'
          +'</div>'
          +'<div>'
            +'<div class="field-label" style="margin-bottom:7px">我方对标攻击位</div>'
            +'<div class="insight-list">'+ATTACKS.map((a,i)=>'<div class="insight"><span class="insight-n">0'+(i+1)+'</span><div><b>'+F.esc(a.t)+'（'+F.esc(a.tag)+'）：</b>'+F.esc(a.d)+'</div></div>').join('')+'</div>'
            +'<div class="callout callout-risk" style="margin-top:11px"><b>不打的位置：</b>AG-05 的 big and tall henley 是它单独建活动、只投一个词的精准位，可信度高。正面抢会把 CPC 抬到保本线以上；这一格从词组侧接延展流量，不做一对一的正面竞争。</div>'
          +'</div>'
        +'</div>',
      foot:'<span>券与价格只用来观察竞品，不参与 01 / 06 结论</span><span class="spacer"></span><span class="c-mint">可以学：节奏、分层、预算和出价；不要照搬：券力度</span>'
    });
  }

  /* ---------------- 页面 ---------------- */
  function render(){
    BENCH_ASIN=(CX.state&&CX.state.benchmark)||PROFILED;
    return '<div class="page">'
      +head()
      +verdictPanel()
      +'<div class="section-gap"></div>'
      +scopePanel()
      +'<div class="section-gap"></div>'
      +kpiRow()
      +'<div class="section-gap"></div>'
      +rhythmPanel()
      +'<div class="section-gap"></div>'
      +flowPanel()
      +'<div class="section-gap"></div>'
      +archPanel()
      +'<div class="section-gap"></div>'
      +enginePanel()
      +'<div class="section-gap"></div>'
      +reusePanel()
      +'</div>';
  }

  CX.register('promotion',{title:'推广策略',render:render,after:function(view){
    /* 架构树默认状态保持数据里的 open，仅给行加折叠开关 */
    view.querySelectorAll('.tree-row').forEach(row=>{
      row.addEventListener('click',()=>{
        const node=row.closest('.tree-node'); if(node) node.classList.toggle('open');
      });
    });
  }});
})();
