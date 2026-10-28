/* ============================================================
   AGENT-03 · 用户画像 / VOC
   ============================================================ */
(function(){
  const CX=window.CX, F=CX.fmt, C=CX.charts, U=CX.ui;
  const personas=[
    {init:'R',cls:'',name:'务实囤货型',sub:'35–52 岁 · 2XL–4XL · 男性',share:42,body:'把亨利衫当「日常制服」，一次买三件替换旧 T。价格敏感，但愿意为纯棉、耐洗、不勒肚多付 $5。',tags:['通勤','居家','三件装','耐洗'],quote:'“I just want shirts that survive 20 washes and don’t choke me.”'},
    {init:'S',cls:'v',name:'敏感肌 / 多汗型',sub:'28–45 岁 · 1X–3XL · 男性',share:33,body:'关注面料触感、透气与标签刺痒。会仔细读 1–3 星评论，愿意为「无感标签 + 200g 精梳棉」支付溢价。',tags:['敏感肌','无感标','透气','健身往返'],quote:'“Tagless is a game changer. No more neck itch after gym.”'},
    {init:'G',cls:'a',name:'家庭代购型',sub:'30–45 岁 · 女性 · 礼物决策者',share:25,body:'为父亲 / 丈夫购买，最怕尺码不准。依赖尺码表、真实买家图和「true to size」评论，重视退换便利。',tags:['送礼','真码','尺码表','售后'],quote:'“Bought for my dad — true to size for once. Please sell single shirts.”'}
  ];
  const scenarios=[
    {label:'日常通勤',value:28,cls:'mint'},
    {label:'居家 / 周末',value:24,cls:''},
    {label:'户外钓鱼 / 露营',value:18,cls:''},
    {label:'健身往返',value:13,cls:''},
    {label:'家庭聚会',value:9,cls:''},
    {label:'旅行',value:8,cls:''}
  ];
  const intents=[
    {label:'替换旧 T 恤',value:42,color:'#38e1ff'},
    {label:'多件装省心',value:28,color:'#2ee6a8'},
    {label:'遮肚显瘦',value:18,color:'#a78bfa'},
    {label:'送礼',value:12,color:'#ffc857'}
  ];
  const selling=[
    {label:'弹力不勒肚',value:31,cls:'mint'},
    {label:'纯棉透气',value:24,cls:'mint'},
    {label:'领口不变形',value:18,cls:''},
    {label:'三件装性价比',value:15,cls:''},
    {label:'大码长度够',value:12,cls:''}
  ];
  const pains=[
    {label:'领口洗后松垮',value:27,cls:'rose'},
    {label:'下摆太短 / 卷边',value:21,cls:'rose'},
    {label:'闷热 / 起球',value:18,cls:'amber'},
    {label:'尺码偏小',value:14,cls:'amber'},
    {label:'颜色与图不符',value:11,cls:'amber'},
    {label:'物流 / 包装',value:9,cls:''}
  ];
  const needs=[
    {name:'4XL / 5XL 真码不缩水',demand:92,fit:34,tone:'high',note:'5XL 实际胸围比尺码表少 6–10cm'},
    {name:'加长下摆 ≥ 77cm',demand:88,fit:28,tone:'high',note:'高个子用户弯腰露腰，差评高频'},
    {name:'洗后领口不变形',demand:94,fit:41,tone:'high',note:'3 次水洗后领口波浪边'},
    {name:'200g+ 抗起球',demand:86,fit:37,tone:'mid',note:'薄款透、腋下起球'},
    {name:'无感标签 / 不刺痒',demand:81,fit:22,tone:'mid',note:'颈后标签是敏感肌第一痛点'},
    {name:'混色单件补货',demand:72,fit:19,tone:'low',note:'三件装用坏一件后无法补'}
  ];
  const quotes=[
    {text:'I’m 6’4” 300lbs. The 3XL fits, but the hem is too short and after two washes the collar lost its shape. Wanted to love it.',who:'2★ · B0C9K2M4P1 · verified purchase',tone:'rose'},
    {text:'Finally a henley that doesn’t feel like a tent. Tagless, soft, and the sleeves don’t ride up. Bought a second pack.',who:'5★ · B0D1F6H8J2 · verified purchase',tone:'mint'},
    {text:'Bought for my dad — true to size for once. Wish I could buy one extra shirt instead of another 3-pack.',who:'4★ · B0C4V7B9N1 · verified purchase',tone:'cyan'}
  ];
  const cloud=[
    {w:'soft',n:512,s:23,c:'hot'},{w:'true to size',n:428,s:20,c:'hot'},{w:'collar',n:391,s:19,c:'warm'},
    {w:'hem',n:367,s:18,c:'warm'},{w:'breathable',n:356,s:18,c:'hot'},{w:'shrunk',n:289,s:16,c:'warm'},
    {w:'pilling',n:241,s:15,c:'warm'},{w:'tagless',n:214,s:14,c:'cool'},{w:'washed',n:207,s:14,c:'cool'},
    {w:'long enough',n:198,s:13,c:'cool'},{w:'big belly',n:176,s:13,c:'warm'},{w:'gift',n:133,s:12,c:'cool'},
    {w:'stretch',n:121,s:12,c:'hot'},{w:'3 pack',n:116,s:12,c:'hot'},{w:'shoulders',n:98,s:11,c:'cool'},
    {w:'fabric',n:93,s:11,c:'cool'},{w:'summer',n:88,s:11,c:'cool'},{w:'loose',n:77,s:10,c:'cool'}
  ];

  function kpis(){
    return '<div class="kpi-grid">'
      +U.kpi({label:'VOC 样本',value:'12,480',unit:'条',delta:'+1,840',foot:'18 SKU / 24 个月',spark:[820,910,1040,1180,1360,1540],color:'#38e1ff'})
      +U.kpi({label:'负面评论率',value:'18.7',unit:'%',delta:'-2.3pp',foot:'1–2 星占比',spark:[24,23,22,21,20,19.2,18.7],color:'#ff6b8a'})
      +U.kpi({label:'NPS',value:'+41',unit:'',delta:'+5',foot:'推荐 58 / 贬损 17',spark:[31,33,35,37,38,39,40,41],color:'#2ee6a8'})
      +U.kpi({label:'高价值场景',value:'4',unit:'个',delta:'已识别',deltaDir:'flat',foot:'通勤 / 居家 / 户外 / 送礼',spark:[2,2,3,3,3,4,4,4],color:'#a78bfa'})
      +U.kpi({label:'可产品化空白',value:'6',unit:'项',delta:'3 项 P0',foot:'真码 / 下摆 / 领口',spark:[1,2,3,3,4,5,5,6],color:'#ffc857'})
      +'</div>';
  }

  function render(){
    const purchaseBar='<div class="ratio-bar" style="height:10px">'+intents.map(i=>'<i style="width:'+i.value+'%;background:'+i.color+'"></i>').join('')+'</div>'
      +'<div class="ratio-legend">'+intents.map(i=>'<span><em style="background:'+i.color+'"></em>'+i.label+' <b style="font-family:var(--num);color:var(--txt)">'+i.value+'%</b></span>').join('')+'</div>';
    return '<div class="page">'
      +'<div class="page-head"><div class="page-head-l"><div class="eyebrow">MODULE 03 / VOICE OF CUSTOMER</div><h1>用户画像分析<span class="en">VOC & PERSONA INTELLIGENCE</span></h1>'
      +'<div class="page-sub">把 12,480 条评论按场景、购买意愿、卖点、痛点、未满足需求和人群分类。</div></div>'
      +'<div class="head-actions"><span class="chip chip-cyan">VOC CODING</span><span class="chip chip-dim">双人一致性 0.87</span><button class="btn btn-ghost" data-report="voc" data-label="VOC 结论">加入报告</button></div></div>'
      +kpis()

      +'<div class="section-gap"></div>'
      +'<div class="grid g13" style="margin-bottom:14px">'
        +U.panel({idx:'03-A',title:'情绪极性',sub:'按评论星级与语义双标签',body:
          C.donut({segments:[{name:'正向',value:58,color:'#2ee6a8'},{name:'中性',value:23,color:'#38e1ff'},{name:'负面',value:19,color:'#ff6b8a'}],center:{value:'12,480',label:'REVIEWS'},size:174,r:56})
          +'<div class="divider"></div>'
          +'<div class="stat-table"><table class="stat-table"><tr><td>5★ 好评</td><td>48.2%</td></tr><tr><td>4★</td><td>23.6%</td></tr><tr><td>3★</td><td>9.5%</td></tr><tr><td>2★</td><td>8.2%</td></tr><tr><td>1★</td><td>10.5%</td></tr></table></div>',foot:'<span>负面语义占比 19%</span><span class="spacer"></span><span class="c-rose">18.7% 为 1–2 星</span>'})
        +U.panel({idx:'03-B',title:'评论动能与内容质量',sub:'月新增评论连续 6 月上行 · 负面率缓慢下降',body:
          C.line({labels:['2025-11','2025-12','2026-01','2026-02','2026-03','2026-04'],series:[{name:'月新增评论',values:[820,910,1040,1180,1360,1540],color:'#38e1ff'}],height:212,yFmt:v=>F.k(v),refLines:[{y:1142,label:'6 月均值 1,142'}]})
          +'<div class="grid g4" style="margin-top:9px">'
          +'<div><div class="field-label">30 天新增</div><div class="num" style="font-size:18px;color:#fff">1,540</div><div class="tiny c-mint">+13.2% MoM</div></div>'
          +'<div><div class="field-label">平均字数</div><div class="num" style="font-size:18px;color:#fff">42</div><div class="tiny dim">高于品类 31</div></div>'
          +'<div><div class="field-label">带图评论</div><div class="num" style="font-size:18px;color:#fff">31%</div><div class="tiny dim">8 张以上高价值</div></div>'
          +'<div><div class="field-label">负面率</div><div class="num" style="font-size:18px;color:var(--rose)">18.7%</div><div class="tiny c-mint">-2.3pp</div></div>'
          +'</div>',foot:'<span>样本：18 个 SKU · 剔除疑似刷评 412 条</span><span class="spacer"></span><span>评论中位长度 42 words</span>'})
      +'</div>'

      +'<div class="grid g3" style="margin-bottom:14px">'
        +personas.map(p=>'<div class="persona"><div class="persona-top"><div class="avatar '+p.cls+'">'+p.init+'</div><div><div class="persona-name">'+p.name+'</div><div class="persona-sub">'+p.sub+'</div></div><div class="persona-share">'+p.share+'<small>%</small></div></div>'
          +'<div class="persona-body">'+p.body+'</div><div class="persona-tags">'+p.tags.map(t=>U.tag(t)).join('')+'</div>'
          +'<div class="quote" style="margin-top:9px;padding:8px 10px;font-size:9px">'+p.quote+'</div></div>').join('')
      +'</div>'

      +'<div class="grid g2" style="margin-bottom:14px">'
        +U.panel({idx:'03-C',title:'购买场景与意愿',sub:'场景决定主图 / 文案，意愿决定价格锚点',body:
          '<div class="field-label" style="margin-bottom:6px">购买场景分布</div>'
          +C.hbar(scenarios.map(s=>({label:s.label,value:s.value,cls:s.cls,labelW:108,fmt:v=>v+'%'})))
          +'<div class="divider"></div>'
          +'<div class="field-label" style="margin-bottom:7px">购买意愿构成</div>'+purchaseBar
          +'<div class="callout" style="margin-top:11px"><b>场景切入点：</b>「通勤 + 居家」占 52%，主图应拍「坐办公室 / 沙发」的松弛感，而不是健身房。</div>',foot:'<span>场景标签来自评论 + 搜索词共现</span>'})
        +U.panel({idx:'03-D',title:'卖点 vs 痛点',sub:'卖点看竞品怎么说，痛点看用户怎么骂',body:
          '<div class="grid g2" style="gap:14px">'
          +'<div><div class="field-label" style="margin-bottom:6px;color:var(--mint)">购买驱动力</div>'+C.hbar(selling.map(s=>({label:s.label,value:s.value,cls:s.cls,labelW:82,fmt:v=>v+'%'})))+'</div>'
          +'<div><div class="field-label" style="margin-bottom:6px;color:var(--rose)">差评触发点</div>'+C.hbar(pains.map(s=>({label:s.label,value:s.value,cls:s.cls,labelW:82,fmt:v=>v+'%'})))+'</div>'
          +'</div>'
          +'<div class="callout callout-risk" style="margin-top:11px"><b>错位：</b>竞品都在讲「纯棉 / 三件装」，但用户最痛的「领口松 + 下摆短」只有 2 个 Listing 正面回应。</div>',foot:'<span>卖点覆盖率：18 SKU 标题 + 五点</span>'})
      +'</div>'

      +'<div class="grid g12" style="margin-bottom:14px">'
        +U.panel({idx:'03-E',title:'未被满足的需求 · 产品化机会',sub:'需求强度 vs 现有供给满足度',body:
          '<div class="grid g2" style="gap:8px">'+needs.map(n=>'<div class="persona" style="padding:10px 11px"><div style="display:flex;align-items:center;gap:6px;margin-bottom:5px"><span style="font-size:10px;color:var(--txt);font-weight:500;flex:1">'+n.name+'</span>'+U.badge(n.tone==='high'?'P0':n.tone==='mid'?'P1':'P2',n.tone==='high'?'risk':n.tone==='mid'?'warn':'neutral')+'</div>'
            +'<div class="score-row" style="grid-template-columns:48px 1fr 30px;font-size:8.5px"><span class="lbl">需求</span><span class="track amber"><i style="width:'+n.demand+'%"></i></span><span class="val">'+n.demand+'</span></div>'
            +'<div class="score-row" style="grid-template-columns:48px 1fr 30px;font-size:8.5px;margin-top:4px"><span class="lbl">满足</span><span class="track rose"><i style="width:'+n.fit+'%"></i></span><span class="val">'+n.fit+'</span></div>'
            +'<div class="mini-note" style="margin-top:4px">'+n.note+'</div></div>').join('')+'</div>',foot:'<span class="c-mint">其中 3 项可直接进 02 参数 / 07 Listing</span>'})
        +U.panel({idx:'03-F',title:'用户原声与关键词云',sub:'高频词决定埋词优先级',body:
          '<div style="display:flex;flex-direction:column;gap:7px">'+quotes.map(q=>'<div class="quote" style="border-left-color:'+(q.tone==='rose'?'rgba(255,107,138,.5)':q.tone==='mint'?'rgba(46,230,168,.5)':'rgba(56,225,255,.4)')+';padding:8px 10px;font-size:9px">'+q.text+'<span class="who">'+q.who+'</span></div>').join('')+'</div>'
          +'<div class="divider"></div><div class="kw-cloud">'+cloud.map(k=>'<span class="kw '+k.c+'" style="font-size:'+k.s+'px" title="出现 '+k.n+' 次">'+k.w+'</span>').join('')+'</div>',foot:'<span>字号 = 词频 · 颜色 = 情绪倾向</span><span class="spacer"></span><span>用于 07 埋词</span>'})
      +'</div>'

      +'<div class="callout"><b>VOC 合并结论：</b>核心人群不是「健身型大码」，而是「务实囤货 + 敏感肌」两类日常穿着者。他们愿意为真码、下摆长度、无感标签支付 $3–$5 溢价，但对「运动速干 / 有机棉」叙事不敏感。产品与 Listing 应围绕 <b>「不勒肚、够长、洗不垮」</b> 三件事重复表达。</div>'
      +'</div>';
  }

  CX.register('voc',{title:'用户画像 / VOC',render:render});
})();
