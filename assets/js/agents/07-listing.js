/* ============================================================
   AGENT-07 · Listing 框架拆解
   对标 ASIN → 变体矩阵 / 标题 / 五点 / A+ / 埋词缺口
   ============================================================ */
(function(){
  const CX=window.CX, F=CX.fmt, C=CX.charts, U=CX.ui, D=CX.data;

  const DEFAULT_BENCH='B0C9K2M4P1';
  const SNAPSHOT=D.meta.snapshot;
  const WINDOW_TEXT=()=>CX.windowLabel();
  const POOL_SIZE=D.meta.stats.poolSize;
  const PRICE_AVG='$39.99';
  const PRICE_BAND='$37.99–$39.99';
  const GROSS_MARGIN='34.3%';
  const RETURN_RATE='12.8%';
  const CPC='$1.28';
  const OPPORTUNITY=78;
  const TARGET_COUNT=12;
  const SIZES=['1XL','2XL','3XL','4XL','5XL','6XL'];

  /* 输入池：1–5 个投喂 ASIN 中的 3 个，可作为对标来源 */
  const INPUT_POOL=[
    {asin:'B0D2H8YQ7K', role:'主推'},
    {asin:'B0D4K1M2P9', role:'同系列'},
    {asin:'B0D5N7R3T6', role:'测款'}
  ];

  /* 12 个埋词目标词：月搜索量与 01 搜索词表单同源口径 */
  const KEYWORDS=[
    {w:'big and tall henley', vol:68400},
    {w:'plus size henley shirts', vol:41200},
    {w:"men's henley shirts 3 pack", vol:27900},
    {w:'henley shirts for men short sleeve', vol:33600},
    {w:'big and tall shirts for men', vol:52100},
    {w:'cotton henley shirts men', vol:18700},
    {w:'tagless henley', vol:6400},
    {w:'longline henley', vol:4900},
    {w:'henley big and tall 5xl', vol:9800},
    {w:'comfy henley shirts men', vol:12300},
    {w:'henley t shirts men', vol:21500},
    {w:'heavyweight cotton henley', vol:5700}
  ];

  const POS_LABEL={title:'标题', b1:'五点 1', b2:'五点 2', b3:'五点 3', b4:'五点 4', b5:'五点 5', back:'后台搜索词', aplus:'A+ 文案'};

  /* 缺失词的可执行补位建议 */
  const SUGGEST=[
    {pos:'标题前段', line:'Big & Tall Henley Shirts'},
    {pos:'标题尾部 + 五点 1', line:'Plus Size Henley Shirts for Men 3 Pack'},
    {pos:'标题中部', line:"Men's Henley Shirts 3 Pack"},
    {pos:'标题中后段', line:'Henley Shirts for Men Short Sleeve'},
    {pos:'五点 2', line:'Big & Tall Shirts for Men'},
    {pos:'标题中段', line:'Cotton Henley Shirts Men'},
    {pos:'五点 4 + A+ 材质特写', line:'Tagless Henley'},
    {pos:'五点 1 + A+ 尺寸指南', line:'Longline Henley - 2 in Longer Body'},
    {pos:'五点 3 + 后台搜索词', line:'Henley Big and Tall 5XL'},
    {pos:'五点 1', line:'Comfy Henley Shirts Men'},
    {pos:'标题尾部', line:'Henley T Shirts Men'},
    {pos:'五点 2', line:'Heavyweight Cotton Henley'}
  ];

  const TOKEN_CLS={brand:'c1', core:'c2', attr:'c3', scene:'c4', spec:'c5'};
  const TOKEN_LABEL={brand:'品牌词', core:'核心词', attr:'属性词', scene:'场景词', spec:'规格词'};
  const TOKEN_COLOR={brand:'cyan', core:'mint', attr:'violet', scene:'amber', spec:'muted-2'};

  /* ---------------- 对标对象差异数据 ---------------- */
  const BENCHMARKS={
    'B0C9K2M4P1':{
      asin:'B0C9K2M4P1',
      brand:'HENLEY&CO',
      role:'对标头部',
      title:"Men's Big & Tall Henley Shirts Short Sleeve 3 Pack Cotton Casual Button Down T-Shirts",
      price:36.99, rating:4.4, reviews:2130, sales:3120, bsr:842, health:68,
      verdict:'HENLEY&CO 用 30 个 SKU 铺满码段 + 标题前 80 字节埋满核心词吃走大码流量；五点只负责降低退货，A+ 才是补词与说服的第二现场。',
      verdictTags:[['30 SKU 铺量','hot'],['埋词 9/12','good'],['主推押 3XL–5XL','violet'],['五点只降退货',''],['缺 plus size / longline 词','bad']],
      tokens:[
        {t:"Men's", k:'core'},
        {t:'Big & Tall', k:'core'},
        {t:'Henley Shirts', k:'core'},
        {t:'Short Sleeve', k:'attr'},
        {t:'3 Pack', k:'spec'},
        {t:'Cotton', k:'attr'},
        {t:'Casual', k:'scene'},
        {t:'Button Down', k:'attr'},
        {t:'T-Shirts', k:'core'}
      ],
      structureNote:'结构判断：9 个片段里 4 个核心词、3 个属性词、1 个场景词、1 个规格词，品牌词 0 字节 —— 头部把整条标题的预算都压给搜索词，品牌身份交给 A+ 横幅补。',
      lengthInfo:{score:82, frontNote:'前 80 字节覆盖 4 个核心词里的 3 个，密度足够', dupNote:'无重复词；3 Pack 与 Cotton 都落在 60 字节以内'},
      hits:{0:'title', 2:'title', 3:'title', 4:'b2', 5:'title', 6:'b4', 9:'b1', 10:'title', 11:'b2'},
      variants:{
        heroNote:'Black / Navy 的 3XL–5XL（5 个）',
        outNote:'Grey Heather 5XL–6XL、Olive 1XL / 6XL、Burgundy 1XL–2XL 共 8 个断码',
        note:'主推 5 个全部落在 3XL–5XL，正是 big and tall / 5XL 类词的意图码段；6XL 只在 Black / Burgundy 保留，Grey / Olive / Navy 先断码以集中库存。',
        colors:[
          {name:'Black', states:'LLHHHL', weight:[82,90,100,96,88,42]},
          {name:'Navy', states:'LLHHLO', weight:[74,84,96,78,60,0]},
          {name:'Grey Heather', states:'LLLOOO', weight:[46,58,68,52,0,0]},
          {name:'Olive', states:'OLLLLO', weight:[0,34,42,36,26,0]},
          {name:'Burgundy', states:'OOLLLL', weight:[0,0,24,28,20,14]}
        ]
      },
      bullets:[
        {no:'1', tag:'痛点开场', text:'Sick of henley shirts that gap at the placket or ride up when you sit? These are the comfy henley shirts men keep in rotation - 2 in longer in the body with a 3 button placket that stays closed.', mark:'comfy henley shirts men', pos:'五点 1', hits:[9], feats:['痛点开场','含数字','场景代入']},
        {no:'2', tag:'功能证据', text:'240 GSM heavyweight cotton henley built for big and tall shirts for men - 95% combed cotton, 5% spandex, pre-shrunk and machine washable, holds shape after 30 washes.', mark:'big and tall shirts for men', pos:'五点 2', hits:[4,11], feats:['功能证据','含数字','洗护说明']},
        {no:'3', tag:'参数场景', text:'Size reference in image 6: model is 6 ft 3 in and wears 2XL, the 5XL fits a 58 in chest and a 38 in sleeve. Wear it under a jacket for work or solo on weekends.', mark:'5XL fits a 58 in chest', pos:'五点 3', hits:[], feats:['参数场景','尺寸参照']},
        {no:'4', tag:'信任背书', text:'40,000+ five star reviews across the series. Tagless henley with a soft printed neck label and flatlock seams - nothing scratches, machine wash cold.', mark:'Tagless henley', pos:'五点 4', hits:[6], feats:['信任背书','洗护说明']},
        {no:'5', tag:'行动召唤', text:'Build your 3 pack - one in Black, one in Navy, one in Grey Heather. Add to cart today, 30 day free returns.', mark:'Build your 3 pack', pos:'五点 5', hits:[], feats:['行动召唤','组合建议']}
      ],
      bulletNote:'五点是「痛点 → 证据 → 尺码 → 信任 → 下单」的标准链，数字密度高（240 GSM / 2 in / 30 次水洗）；但没有一条埋 longline henley —— 加长下摆只靠 A+ 讲，等于把差异化词让给对手。',
      gapNote:'plus size 与 longline 正好是我们产品定义里已经具备的能力，属于零成本可拿的排名位。',
      aplus:{
        modules:[
          {n:1, name:'品牌横幅', type:'Brand Story Hero', style:'摄影', note:'3 秒建立品牌身份，补标题缺失的品牌词'},
          {n:2, name:'图文卖点 x3', type:'Standard Image & Text', style:'信息图', note:'240 GSM / 1XL–6XL / 无感标 三个卖点前置'},
          {n:3, name:'场景四宫格', type:'Standard Four Image & Text', style:'摄影', note:'通勤 / 周末 / 办公 / 出行'},
          {n:4, name:'尺寸指南', type:'Size Chart', style:'信息图', note:'平铺尺寸 + 模特对照，直接压退货'},
          {n:5, name:'对比表', type:'Comparison Chart', style:'信息图', note:'与本品牌 3 个系列对比，锁死选择'},
          {n:6, name:'材质特写', type:'Image & Light Text Overlay', style:'摄影', note:'织纹微距 + 30 次水洗对比'},
          {n:7, name:'护理承诺', type:'Q&A / Text', style:'插画', note:'洗护三步 + 30 天退货'}
        ],
        split:[{name:'摄影', v:58}, {name:'信息图', v:30}, {name:'插画', v:12}],
        elements:['真人模特 6 ft 3 in / 2XL', '尺码平铺标签', '六色色卡', '材质微距', '洗后对比', '对比表 4 列', '图标组 x3'],
        why:[
          {h:'第 1–2 屏解决信任', d:'标题没有品牌词，A+ 用横幅 + 三张图文把品牌与材质证据补回来，第一屏之后才谈场景。'},
          {h:'第 4 屏放尺寸指南', d:'12.8% 退货率里尺码问题占 41%，尺寸图放在场景之后、对比之前，正好落在用户产生「合不合身」疑问的那一屏。'},
          {h:'对比表压到最后', d:'先建立自家产品价值，再用对比表收口，避免用户在没被打动前就开始比价。'},
          {h:'护理承诺收尾', d:'缩水与掉色是 VOC 高频差评点，用洗护三步做最后一击，降低退货与差评概率。'}
        ],
        copyNote:'可抄的只有顺序，不是素材：品牌横幅 → 图文卖点 → 场景 → 尺寸指南 → 对比表 → 材质 → 护理。'
      },
      templates:{
        title:"HENLEY&CO Men's Big & Tall Henley Shirts Plus Size Longline Short Sleeve 3 Pack Heavyweight Cotton Tagless Casual Button Down T-Shirts",
        bullets:"1 痛点开场：big and tall henley 坐下就开口？衣长加 2 in，3 扣门襟不外翻。\n2 功能证据：240 GSM heavyweight cotton henley，95% 精梳棉 + 5% 氨纶，机洗 30 次不变形。\n3 参数场景：模特 6 ft 3 in 穿 2XL，5XL 适配 58 in 胸围 / 38 in 袖长；通勤内搭、周末单穿。\n4 信任背书：tagless henley 印标 + 平锁缝，全系 40,000+ 五星，30 天免运费退货。\n5 行动召唤：选你的 3 pack 组合（Black / Navy / Grey Heather），今天加入购物车。"
      }
    },

    'B0D2H8YQ7K':{
      asin:'B0D2H8YQ7K',
      brand:'UEEKO',
      role:'主推 ASIN',
      title:"UEEKO Men's Big & Tall Henley Shirts 3 Pack",
      price:39.99, rating:4.3, reviews:612, sales:2340, bsr:1284, health:74,
      verdict:'UEEKO 主推链接用品牌词开头 + 18 SKU 少而精，埋词 10/12 高于对标；代价是标题只有 40 字符，属性词与场景词全空。',
      verdictTags:[['品牌词前置','violet'],['18 SKU 精简',''],['埋词 10/12','good'],['主推 4 个','hot'],['标题未用满 200 字节','bad']],
      tokens:[
        {t:'UEEKO', k:'brand'},
        {t:"Men's", k:'core'},
        {t:'Big & Tall', k:'core'},
        {t:'Henley Shirts', k:'core'},
        {t:'3 Pack', k:'spec'}
      ],
      structureNote:'结构判断：品牌词 7 字节前置，核心词齐全，但没有 short sleeve / cotton 这类属性词，也没有 casual 场景词 —— 标题只解决了「是什么」，没解决「什么材质、什么场合」。',
      lengthInfo:{score:64, frontNote:'前 40 字节就出现品牌 + 核心词，品牌识别最强', dupNote:'未用满 200 字节预算，属性词与场景词缺位'},
      hits:{0:'title', 1:'b3', 2:'title', 3:'title', 5:'title', 6:'b4', 8:'b3', 9:'b2', 10:'b1', 11:'b2'},
      variants:{
        heroNote:'Black / Navy 的 1XL–2XL（4 个）',
        outNote:'Black 6XL、Grey Heather 1XL / 6XL 共 3 个断码',
        note:'主推押在 1XL–2XL 而不是大码末端，说明这条链接在抢大码泛流量而非最深的 5XL 需求；6XL 只在 Navy 保留。',
        colors:[
          {name:'Black', states:'HHLLLO', weight:[88,92,74,60,38,0]},
          {name:'Navy', states:'HHLLLL', weight:[80,86,70,54,32,18]},
          {name:'Grey Heather', states:'OLLLLO', weight:[0,42,50,44,28,0]}
        ]
      },
      bullets:[
        {no:'1', tag:'痛点开场', text:'Hate shopping for shirts? These henley t shirts men size 1XL to 5XL ship as a 3 pack, so one order covers the whole week.', mark:'henley t shirts men', pos:'五点 1', hits:[10], feats:['痛点开场','含数字','组合建议']},
        {no:'2', tag:'功能证据', text:'Comfy henley shirts men keep reaching for: 220 GSM heavyweight cotton henley, 95% combed cotton, 5% spandex, machine wash cold, holds shape after 30 washes.', mark:'Comfy henley shirts men', pos:'五点 2', hits:[9,11], feats:['功能证据','含数字','洗护说明']},
        {no:'3', tag:'参数场景', text:'Plus size henley shirts sizing in image 6 - model 6 ft 2 in wears 2XL, the henley big and tall 5xl fits a 56 in chest.', mark:'henley big and tall 5xl', pos:'五点 3', hits:[1,8], feats:['参数场景','尺寸参照']},
        {no:'4', tag:'信任背书', text:'4.3 stars from 612 reviews, tagless henley neck label and flatlock seams - 30 day free returns.', mark:'tagless henley', pos:'五点 4', hits:[6], feats:['信任背书']},
        {no:'5', tag:'行动召唤', text:'Order the 3 pack today - Black, Navy and Grey Heather - and add a second pack for the office drawer.', mark:'Order the 3 pack', pos:'五点 5', hits:[], feats:['行动召唤','组合建议']}
      ],
      bulletNote:'差异化全压在第五点之外：尺码参照给到 5XL 胸围，是全站最具体的参数证据；但五点通篇没有 longline / 加长下摆，与 06 板块的差异化建议没有打通。',
      gapNote:'longline 与 big and tall shirts 泛词，是主推链接仅有的两块空白。',
      aplus:{
        modules:[
          {n:1, name:'品牌横幅', type:'Brand Story Hero', style:'摄影', note:'用横幅把品牌词再刷一次'},
          {n:2, name:'场景双图', type:'Standard Image & Text', style:'摄影', note:'1XL–5XL 真实身材对照'},
          {n:3, name:'尺寸指南', type:'Size Chart', style:'信息图', note:'平铺尺寸 + 5XL 胸围数据'},
          {n:4, name:'对比表', type:'Comparison Chart', style:'信息图', note:'与本系列 3 个链接互相对比'},
          {n:5, name:'材质特写', type:'Image & Light Text Overlay', style:'摄影', note:'220 GSM 织纹微距'},
          {n:6, name:'护理承诺', type:'Q&A / Text', style:'插画', note:'洗护三步 + 30 天退货'}
        ],
        split:[{name:'摄影', v:62}, {name:'信息图', v:28}, {name:'插画', v:10}],
        elements:['模特 6 ft 2 in / 2XL', '尺码平铺标签', '色卡 3 色', '材质微距', '对比表 3 列', '图标组 x2'],
        why:[
          {h:'摄影占比最高', d:'自有品牌需要靠真人场景建立信任，信息披露量可以少，代入感必须足。'},
          {h:'尺寸指南放第 3 屏', d:'比对标更早给出 5XL 胸围数字，把尺码疑问在场景之后立刻清掉。'},
          {h:'对比表只比自家系列', d:'不点名竞品，避免把流量导向头部链接，只解决「买哪一档」。'}
        ],
        copyNote:'可抄：尺寸指南前置到第 3 屏；不可抄：只有 6 个模块，材质与洗护讲得太薄。'
      },
      templates:{
        title:"UEEKO Men's Big & Tall Henley Shirts Plus Size Longline Short Sleeve 3 Pack Cotton Tagless Casual Button Down T-Shirts",
        bullets:"1 痛点开场：henley 坐下就开口？衣长加 2 in，3 扣门襟不外翻。\n2 功能证据：比 220 GSM 更厚的 240 GSM heavyweight cotton henley，95% 精梳棉 + 5% 氨纶，机洗 30 次不变形。\n3 参数场景：模特 6 ft 3 in 穿 2XL，5XL 适配 58 in 胸围；通勤内搭、周末单穿。\n4 信任背书：tagless henley 印标 + 平锁缝，30 天免运费退货。\n5 行动召唤：选你的 3 pack 组合，今天加入购物车。"
      }
    },

    'B0D4K1M2P9':{
      asin:'B0D4K1M2P9',
      brand:'UEEKO',
      role:'同系列',
      title:'UEEKO Big & Tall Henley Short Sleeve 3 Pack',
      price:39.99, rating:4.2, reviews:388, sales:1180, bsr:2160, health:61,
      verdict:'同系列链接用 12 SKU 试水，埋词 8/12；标题缺 Men 人群词与 plus size 词，A+ 只有 5 个模块，转化主要靠主推链接带量。',
      verdictTags:[['12 SKU 试水',''],['埋词 8/12','bad'],['主推 3 个','hot'],['A+ 仅 5 模块','bad']],
      tokens:[
        {t:'UEEKO', k:'brand'},
        {t:'Big & Tall', k:'core'},
        {t:'Henley', k:'core'},
        {t:'Short Sleeve', k:'attr'},
        {t:'3 Pack', k:'spec'}
      ],
      structureNote:'结构判断：5 个片段就能拼完，品牌 + 核心 + 1 个属性 + 1 个规格；缺人群词 Men、缺 cotton 属性、缺场景词，标题信息量明显低于主推链接。',
      lengthInfo:{score:57, frontNote:'前 40 字节含品牌 + 核心词，但没有人群词承接搜索意图', dupNote:'缺 cotton / casual 两个高权重属性与场景词'},
      hits:{0:'title', 2:'title', 3:'title', 5:'b1', 6:'b4', 8:'b3', 9:'b2', 11:'b2'},
      variants:{
        heroNote:'Black 的 1XL–3XL（3 个）',
        outNote:'Black 6XL、Navy 5XL–6XL 共 3 个断码',
        note:'2 色 12 码，主推压在 Black 的小码段，5XL–6XL 已断码 —— 对「真码」人群是明显缺口。',
        colors:[
          {name:'Black', states:'HHHLLO', weight:[86,94,80,66,44,0]},
          {name:'Navy', states:'LLLLOO', weight:[52,58,50,38,0,0]}
        ]
      },
      bullets:[
        {no:'1', tag:'痛点开场', text:'Cotton henley shirts men can wear tucked or loose - 200 GSM cotton, 3 button placket, pre-shrunk so it does not shrink past the elbow.', mark:'Cotton henley shirts men', pos:'五点 1', hits:[5], feats:['痛点开场','含数字','洗护说明']},
        {no:'2', tag:'功能证据', text:'Comfy henley shirts men trust after 30 washes: heavyweight cotton henley, tagless printed neck label, machine washable.', mark:'heavyweight cotton henley', pos:'五点 2', hits:[9,11], feats:['功能证据','含数字','洗护说明']},
        {no:'3', tag:'参数场景', text:'Size chart in image 5 - henley big and tall 5xl runs true to size, model 6 ft 1 in wears 2XL.', mark:'henley big and tall 5xl', pos:'五点 3', hits:[8], feats:['参数场景','尺寸参照']},
        {no:'4', tag:'信任背书', text:'Tagless henley neck label, flatlock seams and 4.2 stars from 388 reviews - 30 day free returns.', mark:'Tagless henley', pos:'五点 4', hits:[6], feats:['信任背书']},
        {no:'5', tag:'行动召唤', text:'Add the 3 pack to cart and rotate Black and Navy all week.', mark:'Add the 3 pack', pos:'五点 5', hits:[], feats:['行动召唤','组合建议']}
      ],
      bulletNote:'五点顺序与主推链接完全一致，缺少针对本链接卖点（12 SKU / 2 色）的差异化叙述，读起来像复制粘贴。',
      gapNote:'plus size 与 henley t shirts men 直接影响大码人群的搜索命中，优先级最高。',
      aplus:{
        modules:[
          {n:1, name:'图文卖点 x2', type:'Standard Image & Text', style:'信息图', note:'没有品牌横幅，直接进卖点'},
          {n:2, name:'场景四宫格', type:'Standard Four Image & Text', style:'摄影', note:'通勤 / 周末两组场景'},
          {n:3, name:'尺寸指南', type:'Size Chart', style:'信息图', note:'平铺尺寸 + 模特对照'},
          {n:4, name:'对比表', type:'Comparison Chart', style:'信息图', note:'与本系列 2 个链接对比'},
          {n:5, name:'护理承诺', type:'Q&A / Text', style:'插画', note:'洗护三步'}
        ],
        split:[{name:'信息图', v:52}, {name:'摄影', v:34}, {name:'插画', v:14}],
        elements:['模特 6 ft 1 in / 2XL', '尺码平铺标签', '色卡 2 色', '对比表 3 列'],
        why:[
          {h:'打开即卖点', d:'没有品牌资产，干脆省掉横幅，把第一屏让给材质与尺码，是理性的取舍。'},
          {h:'尺寸指南第 3 屏偏晚', d:'12 SKU 里已有 3 个断码，用户更早会关心码段，尺寸图应该再往前挪一屏。'},
          {h:'对比表仍有价值', d:'放在尺寸之后，用「12 码 vs 18 码」解释为什么便宜不了，减少跨链接比价。'}
        ],
        copyNote:'可抄：图文卖点前置；不可抄：尺寸指南放第 3 屏，退货压力会前移到评论区。'
      },
      templates:{
        title:"UEEKO Men's Big & Tall Henley Shirts Plus Size Cotton Short Sleeve Casual 3 Pack Button Down T-Shirts",
        bullets:"1 痛点开场：cotton henley shirts men 洗两次就缩？预缩处理，机洗后衣长不变。\n2 功能证据：200 GSM 精梳棉，3 扣门襟，heavyweight cotton henley 手感，洗 30 次不起球。\n3 参数场景：尺码表见第 5 图，henley big and tall 5xl 正码，模特 6 ft 1 in 穿 2XL。\n4 信任背书：tagless henley 印标 + 平锁缝，4.2 星来自 388 条评论，30 天退货。\n5 行动召唤：3 pack 到手，Black / Navy 轮换一周，今天加入购物车。"
      }
    }
  };

  /* ---------------- 计算与片段 ---------------- */
  function benchData(){
    return BENCHMARKS[CX.state.listingBench]||null;
  }

  function hitCount(B){
    return Object.keys(B.hits).length;
  }

  function variantStats(V){
    let hero=0, out=0, total=0;
    V.colors.forEach(c=>{
      for(let i=0;i<SIZES.length;i++){
        total++;
        const st=c.states.charAt(i);
        if(st==='H') hero++;
        if(st==='O') out++;
      }
    });
    return {total:total, hero:hero, out:out, live:total-out};
  }

  function volSum(){
    return KEYWORDS.reduce((s,k)=>s+k.vol, 0);
  }

  function coveredVol(B){
    let s=0;
    KEYWORDS.forEach((k,i)=>{ if(B.hits[i]) s+=k.vol; });
    return s;
  }

  function anatomyLegend(){
    return '<div class="anatomy-legend">'+['brand','core','attr','scene','spec'].map(k=>
      '<span><i style="display:inline-block;width:7px;height:7px;border-radius:2px;margin-right:4px;background:var(--'+TOKEN_COLOR[k]+')"></i>'+TOKEN_LABEL[k]+'</span>'
    ).join('')+'</div>';
  }

  function keywordRows(B){
    const maxVol=KEYWORDS[0].vol;
    return KEYWORDS.map((k,i)=>{
      const pos=B.hits[i];
      const hit=!!pos;
      const w=Math.round(k.vol/maxVol*100);
      return '<tr>'
        +'<td class="main-cell mono">'+F.esc(k.w)+'</td>'
        +'<td class="num">'+F.num(k.vol)+'</td>'
        +'<td>'+(hit?U.badge('命中','ok'):U.badge('缺失','risk'))+'</td>'
        +'<td>'+(hit?POS_LABEL[pos]:'—')+'</td>'
        +'<td><div class="meter-cell">'+U.meter(w, hit?'mint':'rose')+'<span>'+w+'</span></div></td>'
        +'</tr>';
    }).join('');
  }

  /* ---------------- 模块区块 ---------------- */
  function selectorPanel(B){
    const cur=CX.state.listingBench;
    const brand=B?B.brand:'待反解';
    const right=B
      ? '<div class="field-label" style="margin-bottom:6px">当前对标读数</div>'
        +'<table class="stat-table">'
        +'<tr><td>对标 ASIN</td><td class="c-cyan">'+B.asin+'</td></tr>'
        +'<tr><td>品牌 / 角色</td><td>'+F.esc(B.brand)+' · '+F.esc(B.role)+'</td></tr>'
        +'<tr><td>售价 / 评分</td><td>'+F.money(B.price)+' / '+F.dec(B.rating,1)+'</td></tr>'
        +'<tr><td>月销 / BSR</td><td>'+F.num(B.sales)+' / #'+F.num(B.bsr)+'</td></tr>'
        +'<tr><td>变体 / 主推</td><td>'+variantStats(B.variants).total+' / '+variantStats(B.variants).hero+'</td></tr>'
        +'<tr><td>埋词覆盖</td><td class="c-mint">'+hitCount(B)+' / '+TARGET_COUNT+'</td></tr>'
        +'</table>'
        +'<div class="mini-note">价格只做观测：我方价格带 '+PRICE_BAND+'（均价 '+PRICE_AVG+'），不参与 01 / 06 结论。</div>'
      : '<div class="empty-state"><b>该 ASIN 未反解</b>请从输入池或已反解列表中选择。</div>';

    return U.panel({
      idx:'07-A',
      title:'对标 ASIN 选择器',
      sub:'补充说明①：只勾 07–08 时，对标竞品可手动粘贴，或从输入池 3 个 ASIN 勾选；默认 '+DEFAULT_BENCH,
      tools:U.chip('当前 '+cur,'cyan')+U.chip(brand,'dim'),
      body:'<div class="grid g21" style="align-items:start">'
        +'<div>'
          +'<div class="field-label">01 · 手动粘贴 ASIN</div>'
          +'<div class="filterbar" style="margin:7px 0 0">'
            +'<div class="search"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m15 15 5 5" stroke="currentColor" stroke-width="1.6"/></svg>'
            +'<input class="input" id="benchInput" maxlength="10" placeholder="'+DEFAULT_BENCH+'"></div>'
            +'<button type="button" class="btn btn-sm btn-primary" id="benchApply">应用对标</button>'
            +'<span class="chip chip-dim">默认 '+DEFAULT_BENCH+'</span>'
          +'</div>'
          +'<div class="field-label" style="margin-top:14px">02 · 从输入池勾选（3 个 ASIN）</div>'
          +'<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:7px">'
            +INPUT_POOL.map(a=>'<button type="button" class="chip '+(a.asin===cur?'chip-cyan':'chip-dim')+'" data-bench="'+a.asin+'" style="cursor:pointer;padding:4px 9px;font-size:9.5px">'
              +(a.asin===cur?'ACTIVE · ':'')+a.asin+' · '+a.role+'</button>').join('')
          +'</div>'
          +'<div class="callout" style="margin-top:12px"><b>补充说明①：</b>07–08 不需要 01 的完整输入也能跑；对标对象以本选择器为准，默认 '+DEFAULT_BENCH+'（HENLEY&CO）。切换后变体矩阵、标题分段、五点、A+ 序列与埋词缺口全部联动重算。</div>'
          +'<div class="mini-note">已反解对象：'+Object.keys(BENCHMARKS).join(' / ')+'；B0D5N7R3T6 仅作为输入池样本，未做 Listing 反解。</div>'
        +'</div>'
        +'<div>'+right+'</div>'
      +'</div>',
      foot:'<span>对标来源：手动粘贴 / 输入池勾选 / 默认头部</span><span class="spacer"></span><span class="c-cyan">快照 '+SNAPSHOT+'</span>'
    });
  }

  function emptyPanel(){
    return '<div class="section-gap"></div>'
      +U.panel({
        idx:'07-Z',
        title:'该 ASIN 暂无拆解数据',
        sub:'当前对标 '+CX.state.listingBench+' · 仅 3 个对象完成 Listing 反解',
        body:'<div class="empty-state"><b>没有找到 Listing 反解数据</b>可直接粘贴 ASIN，但需要先对该 ASIN 跑一次反解；演示数据仅覆盖下方 3 个对象。</div>'
          +'<div style="display:flex;gap:7px;margin-top:11px;flex-wrap:wrap">'
          +Object.keys(BENCHMARKS).map(a=>'<button type="button" class="btn btn-sm" data-bench="'+a+'">切到 '+a+'</button>').join('')
          +'</div>',
        foot:'<span>'+TARGET_COUNT+' 词埋词口径不变</span><span class="spacer"></span><span>'+WINDOW_TEXT()+'</span>'
      });
  }

  function verdictPanel(B){
    const vs=variantStats(B.variants);
    return '<section class="panel vsplit" style="display:grid;grid-template-columns:minmax(0,1fr) 290px;overflow:hidden;margin-bottom:14px">'
      +'<div class="verdict-main">'
        +'<div class="eyebrow" style="margin-bottom:8px">CONCLUSION / '+B.asin+'</div>'
        +'<h2 style="font-size:17px">'+F.esc(B.verdict)+'</h2>'
        +'<div class="reason">变体盘 '+vs.total+' 个 SKU 解决「有没有我的码」，标题前 80 字节解决「搜得到」，五点用数字与尺码参照解决「敢不敢买」；三者缺一，A+ 再好看也换不来转化。</div>'
        +'<div class="reason-list">'+B.verdictTags.map(t=>U.tag(t[0],t[1])).join('')+'</div>'
      +'</div>'
      +'<div class="verdict-side">'
        +'<div class="vs-row"><span>数据快照</span><b>'+SNAPSHOT+'</b></div>'
        +'<div class="vs-row"><span>流量窗口</span><b>'+CX.windowShort()+'</b></div>'
        +(CX.windowCoverageNote()?'<div class="mini-note">'+F.esc(CX.windowCoverageNote())+'</div>':'')
        +'<div class="vs-row"><span>无推广毛利</span><b>'+GROSS_MARGIN+'</b></div>'
        +'<div class="vs-row"><span>退货率 / CPC</span><b>'+RETURN_RATE+' / '+CPC+'</b></div>'
        +'<div class="vs-row"><span>机会分</span><b>'+OPPORTUNITY+' / 100</b></div>'
        +'<a class="link small" data-go="promotion">看 08 推广节奏 →</a>'
      +'</div></section>';
  }

  function kpiRow(B){
    const vs=variantStats(B.variants);
    const hit=hitCount(B);
    const vol=volSum();
    return '<div class="kpi-grid">'
      +U.kpi({label:'对标 SKU 数', value:String(vs.total), unit:'SKU', delta:B.variants.colors.length+' 色 x 6 码', foot:'产品池 '+POOL_SIZE+' 个竞品里的变体盘'})
      +U.kpi({label:'主推 SKU', value:String(vs.hero), unit:'个', delta:'在售 '+vs.live+' 个', foot:'断码 '+vs.out+' 个 · 主推占在售 '+F.pct(vs.hero/vs.live*100,0)})
      +U.kpi({label:'埋词覆盖', value:String(hit), unit:'/ '+TARGET_COUNT, delta:hit>=10?'达标':'缺 '+(TARGET_COUNT-hit)+' 词', foot:TARGET_COUNT+' 词合计 '+F.dec(vol/1000,1)+'K / 月'})
      +U.kpi({label:'标题字符', value:String(B.title.length), unit:'/ 200', delta:B.title.length<120?'未用满':'接近上限', foot:'五点 '+B.bullets.length+' 条 · A+ '+B.aplus.modules.length+' 模块'})
      +U.kpi({label:'Listing 健康分', value:String(B.health), unit:'/100', delta:B.health>=75?'达标':'待优化', foot:'埋词 40 + 变体 20 + 五点 25 + A+ 15'})
      +'</div>';
  }

  function variantBody(B){
    const V=B.variants;
    const vs=variantStats(V);
    let grid='<div class="variant-matrix" style="grid-template-columns:96px repeat('+SIZES.length+',minmax(40px,1fr))">';
    grid+='<div class="hm-corner">色 / 码</div>';
    SIZES.forEach(s=>{ grid+='<div class="hm-col">'+s+'</div>'; });
    V.colors.forEach(c=>{
      grid+='<div class="hm-row-h">'+F.esc(c.name)+'</div>';
      for(let i=0;i<SIZES.length;i++){
        const st=c.states.charAt(i);
        const w=c.weight[i]||0;
        const tip=F.esc(c.name+' / '+SIZES[i]);
        if(st==='O'){
          grid+='<div class="vm-cell out" title="'+tip+'：断码">断码</div>';
        } else if(st==='H'){
          grid+='<div class="vm-cell hero" title="'+tip+'：主推 · 出单权重 '+w+'">主推</div>';
        } else {
          grid+='<div class="vm-cell live" style="background:color-mix(in srgb,var(--mint) '+Math.round(8+w*0.34)+'%,transparent)" title="'+tip+'：在售 · 出单权重 '+w+'">'+w+'%</div>';
        }
      }
    });
    grid+='</div>';

    return '<div class="grid g21" style="align-items:start">'
      +'<div>'+grid
        +'<div class="reason-list" style="margin-top:11px">'
          +U.tag('主推 '+vs.hero+' 个','hot')
          +U.tag('在售 '+vs.live+' 个（含主推）','good')
          +U.tag('断码 '+vs.out+' 个','bad')
        +'</div>'
        +'<div class="hm-legend" style="justify-content:flex-start;margin-top:9px">'
          +'<span>断码</span><span class="hm-scale"><i style="background:var(--rose);opacity:.16"></i><i style="background:var(--rose);opacity:.3"></i></span>'
          +'<span style="margin-left:8px">在售（浅→深 = 出单权重）</span><span class="hm-scale"><i style="background:var(--mint);opacity:.14"></i><i style="background:var(--mint);opacity:.26"></i><i style="background:var(--mint);opacity:.38"></i></span>'
          +'<span>主推</span></div>'
        +'<div class="mini-note">'+F.esc(V.note)+'</div>'
      +'</div>'
      +'<div>'
        +'<div class="field-label" style="margin-bottom:6px">主推结构读数</div>'
        +'<table class="stat-table">'
          +'<tr><td>SKU 总数</td><td>'+vs.total+'</td></tr>'
          +'<tr><td>颜色 x 尺码</td><td>'+V.colors.length+' x '+SIZES.length+'</td></tr>'
          +'<tr><td>主推集中</td><td class="c-amber">'+F.esc(V.heroNote)+'</td></tr>'
          +'<tr><td>断码分布</td><td class="c-rose">'+F.esc(V.outNote)+'</td></tr>'
        +'</table>'
        +'<div class="callout callout-warn" style="margin-top:11px"><b>误判风险：</b>主推码段如果不在搜索意图的码段上（例如把 1XL 当主推），等于用变体盘给泛流量让路，大码词进来后仍会跳出。</div>'
        +'<div class="mini-note">三态口径：主推 = 站内主图 / 广告与 A+ 指向的码段；在售 = 有货且有变体图；断码 = 缺货或未开卖。</div>'
      +'</div>'
    +'</div>';
  }

  function titleBody(B){
    const chars=B.title.length;
    const words=B.title.split(/\s+/).length;
    const hasBrand=B.tokens.some(t=>t.k==='brand');
    return '<div class="grid g12" style="align-items:start">'
      +'<div>'
        +'<div class="field-label" style="margin-bottom:6px">标题原文 · '+chars+' 字符 / '+words+' 词</div>'
        +'<div class="title-anatomy">'+B.tokens.map(t=>'<span class="tok '+TOKEN_CLS[t.k]+'" title="'+TOKEN_LABEL[t.k]+'">'+F.esc(t.t)+'</span>').join('')+'</div>'
        +anatomyLegend()
        +'<div class="callout" style="margin-top:11px">'+F.esc(B.structureNote)+'</div>'
      +'</div>'
      +'<div>'
        +'<div class="field-label" style="margin-bottom:6px">长度与可读性评分</div>'
        +'<div class="score-row" style="grid-template-columns:64px minmax(0,1fr) 40px"><span class="lbl">可读性</span><span class="track '+(B.lengthInfo.score>=80?'mint':'amber')+'"><i style="width:'+B.lengthInfo.score+'%"></i></span><span class="val">'+B.lengthInfo.score+'</span></div>'
        +'<table class="stat-table" style="margin-top:9px">'
          +'<tr><td>字符 / 上限</td><td>'+chars+' / 200</td></tr>'
          +'<tr><td>词数</td><td>'+words+'</td></tr>'
          +'<tr><td>品牌词</td><td>'+(hasBrand?'有':'0 字节')+'</td></tr>'
          +'<tr><td>前 80 字节</td><td>'+(chars>=80?'已占满':'仅 '+chars+' 字节')+'</td></tr>'
        +'</table>'
        +'<div class="mini-note">'+F.esc(B.lengthInfo.frontNote)+'</div>'
        +'<div class="mini-note">'+F.esc(B.lengthInfo.dupNote)+'</div>'
      +'</div>'
    +'</div>'
    +'<div class="divider"></div>'
    +'<div class="field-label" style="margin-bottom:7px">埋词命中表 · '+TARGET_COUNT+' 个目标词</div>'
    +'<div class="table-wrap"><table class="tbl" style="min-width:640px"><thead><tr><th>目标词</th><th class="num">月搜索量</th><th>命中</th><th>出现位置</th><th>搜索权重</th></tr></thead><tbody>'
    +keywordRows(B)
    +'</tbody></table></div>'
    +'<div class="tbl-foot" style="border:0"><span>命中 <b>'+hitCount(B)+'</b> / '+TARGET_COUNT+'</span><span>位置口径：标题 / 五点 1–5 / A+ 文案 / 后台搜索词</span><span class="c-cyan">SellerSprite 搜索词</span></div>';
  }

  function bulletBody(B){
    const feats=['含数字','尺寸参照','洗护说明','组合建议'];
    const counts=feats.map(f=>({f:f, n:B.bullets.filter(b=>b.feats.indexOf(f)>=0).length}));

    const cards=B.bullets.map(b=>{
      const escText=F.esc(b.text);
      const escMark=F.esc(b.mark);
      const text=escText.indexOf(escMark)>=0?escText.replace(escMark, '<mark>'+escMark+'</mark>'):escText;
      return '<div class="bullet-card">'
        +'<div class="bullet-hd"><span class="bullet-no">'+b.no+'</span><span class="tl-title">'+F.esc(b.tag)+'</span>'
        +'<span class="mini-note" style="margin:0 0 0 auto">'+F.esc(b.pos)+'</span></div>'
        +'<div class="bullet-text">'+text+'</div>'
        +'<div class="reason-list" style="margin-top:7px">'
          +(b.hits.length?b.hits.map(i=>U.tag('埋词 · '+KEYWORDS[i].w,'good')).join(''):U.tag('无新增埋词','bad'))
          +b.feats.map(f=>U.tag(f)).join('')
        +'</div></div>';
    }).join('');

    const flow='<div class="timeline">'+B.bullets.map(b=>'<div class="tl-item active">'
      +'<span class="tl-dot"></span>'
      +'<div class="tl-head"><span class="tl-title">'+F.esc(b.tag)+'</span><span class="tl-week">POINT '+b.no+'</span></div>'
      +'<div class="tl-body">'+F.esc(b.pos)+' · '+b.feats.join(' / ')+'</div>'
      +'</div>').join('')+'</div>';

    const meters='<div class="score-list" style="margin-top:4px">'+counts.map(c=>
      '<div class="score-row" style="grid-template-columns:66px minmax(0,1fr) 34px"><span class="lbl">'+c.f+'</span>'
      +'<span class="track mint"><i style="width:'+Math.round(c.n/B.bullets.length*100)+'%"></i></span>'
      +'<span class="val">'+c.n+'/'+B.bullets.length+'</span></div>'
    ).join('')+'</div>';

    return '<div class="grid g12" style="align-items:start">'
      +'<div>'+cards+'</div>'
      +'<div>'
        +'<div class="field-label" style="margin-bottom:6px">结构标签序列</div>'
        +flow
        +'<div class="divider"></div>'
        +'<div class="field-label" style="margin-bottom:6px">内容特点</div>'
        +meters
        +'<div class="callout callout-warn" style="margin-top:11px">'+F.esc(B.bulletNote)+'</div>'
      +'</div>'
    +'</div>';
  }

  function aplusBody(B){
    const A=B.aplus;
    const seq='<div class="timeline">'+A.modules.map(m=>'<div class="tl-item active">'
      +'<span class="tl-dot"></span>'
      +'<div class="tl-head"><span class="tl-title">'+F.esc(m.name)+'</span><span class="tl-week">A+ '+(m.n<10?'0':'')+m.n+'</span></div>'
      +'<div class="tl-body">'+F.esc(m.type)+' · '+F.esc(m.style)+' · '+F.esc(m.note)+'</div>'
      +'</div>').join('')+'</div>';

    const ratio='<div class="ratio-bar">'+A.split.map((s,i)=>
      '<i style="width:'+s.v+'%;background:var(--'+(i===0?'cyan':i===1?'violet':'amber')+')"></i>').join('')+'</div>'
      +'<div class="ratio-legend">'+A.split.map((s,i)=>
        '<span><em style="background:var(--'+(i===0?'cyan':i===1?'violet':'amber')+')"></em>'+F.esc(s.name)+' '+s.v+'%</span>').join('')+'</div>';

    const elements='<div class="reason-list" style="margin-top:11px">'+A.elements.map(e=>U.tag(e)).join('')+'</div>';

    const why='<div class="insight-list">'+A.why.map((w,i)=>
      '<div class="insight"><span class="insight-n">0'+(i+1)+'</span><div><b>'+F.esc(w.h)+'：</b>'+F.esc(w.d)+'</div></div>'
    ).join('')+'</div>';

    return '<div class="grid g12" style="align-items:start">'
      +'<div>'
        +'<div class="field-label" style="margin-bottom:6px">模块序列 · 顺序即说服逻辑</div>'
        +seq
      +'</div>'
      +'<div>'
        +'<div class="field-label" style="margin-bottom:6px">风格占比 · 版面高度</div>'
        +ratio
        +'<div class="field-label" style="margin-top:14px;margin-bottom:4px">元素清单</div>'
        +elements
        +'<div class="mini-note">共 '+A.modules.length+' 个模块；摄影用于建立真实感，信息图用于消解参数疑问，插画只承担护理与承诺。</div>'
      +'</div>'
    +'</div>'
    +'<div class="divider"></div>'
    +'<div class="field-label" style="margin-bottom:7px">为什么这样排</div>'
    +why
    +'<div class="callout callout-ok" style="margin-top:11px"><b>判断依据：</b>'+F.esc(A.copyNote)+'</div>';
  }

  function coverageBody(B){
    const hit=hitCount(B);
    const pct=Math.round(hit/TARGET_COUNT*100);
    const total=volSum();
    const covered=coveredVol(B);
    const volPct=Math.round(covered/total*100);
    const missing=[];
    KEYWORDS.forEach((k,i)=>{ if(!B.hits[i]) missing.push({k:k, i:i}); });
    const topMissing=missing.slice().sort((a,b)=>b.k.vol-a.k.vol)[0];

    const bars=C.hbar(KEYWORDS.map((k,i)=>({
      label:k.w, value:k.vol, max:KEYWORDS[0].vol, labelW:168,
      cls:B.hits[i]?'mint':'rose', fmt:v=>F.num(v)
    })));

    const missRows=missing.map(m=>'<tr>'
      +'<td class="main-cell mono">'+F.esc(m.k.w)+'</td>'
      +'<td class="num">'+F.num(m.k.vol)+'</td>'
      +'<td>'+F.esc(SUGGEST[m.i].pos)+'</td>'
      +'<td class="mono c-cyan">'+F.esc(SUGGEST[m.i].line)+'</td>'
      +'</tr>').join('');

    return '<div class="grid g2" style="align-items:start">'
      +'<div>'
        +'<div class="kpi-inline">'
          +'<div><b>'+hit+' / '+TARGET_COUNT+'</b><span>埋词覆盖率</span></div>'
          +'<div><b>'+pct+'%</b><span>词数覆盖</span></div>'
          +'<div><b>'+volPct+'%</b><span>搜索量覆盖</span></div>'
          +'<div><b>'+missing.length+'</b><span>缺口词</span></div>'
        +'</div>'
        +'<div class="progress-lg" style="margin-top:10px"><i style="width:'+pct+'%"></i></div>'
        +'<div class="mini-note">'+TARGET_COUNT+' 词合计 '+F.num(total)+' / 月；已覆盖 '+F.num(covered)+'（'+volPct+'%），缺口 '+F.num(total-covered)+' / 月搜索量。</div>'
        +'<div class="callout callout-risk" style="margin-top:11px"><b>缺口即机会：</b>缺口里搜索量最高的是 <b>'+F.esc(topMissing.k.w)+'</b>（'+F.num(topMissing.k.vol)+' / 月），建议补进 '+F.esc(SUGGEST[topMissing.i].pos)+'。'+F.esc(B.gapNote)+'</div>'
      +'</div>'
      +'<div>'+bars+'</div>'
    +'</div>'
    +'<div class="divider"></div>'
    +'<div class="field-label" style="margin-bottom:7px">缺失词补位建议 · '+missing.length+' 个</div>'
    +'<div class="table-wrap"><table class="tbl" style="min-width:560px"><thead><tr><th>缺失词</th><th class="num">月搜索量</th><th>建议位置</th><th>可复用句式</th></tr></thead><tbody>'
    +missRows
    +'</tbody></table></div>'
    +'<div class="divider"></div>'
    +'<div class="field-label" style="margin-bottom:7px">可直接复用 · 标题模板</div>'
    +'<div class="copy-row"><div style="flex:1;min-width:0"><div class="mono" style="font-size:8px;color:var(--muted-2);letter-spacing:.5px">TITLE TEMPLATE · '+B.title.length+' → '+B.templates.title.length+' 字符</div>'
      +'<div style="font-size:10px;color:var(--txt-2);line-height:1.7">'+F.esc(B.templates.title)+'</div></div>'
      +'<button type="button" class="btn btn-sm" data-copy="'+F.esc(B.templates.title)+'">复制</button></div>'
    +'<div class="field-label" style="margin-top:12px;margin-bottom:7px">可直接复用 · 五点模板</div>'
    +'<div class="copy-row" style="align-items:flex-start"><div style="flex:1;min-width:0"><div class="mono" style="font-size:8px;color:var(--muted-2);letter-spacing:.5px">BULLET TEMPLATE · 5 条</div>'
      +'<div style="font-size:10px;color:var(--txt-2);line-height:1.85;white-space:pre-line">'+F.esc(B.templates.bullets)+'</div></div>'
      +'<button type="button" class="btn btn-sm" data-copy="'+F.esc(B.templates.bullets)+'">复制</button></div>';
  }

  /* ---------------- 页面 ---------------- */
  function render(){
    const B=benchData();
    const cur=CX.state.listingBench;
    const head='<div class="page-head">'
      +'<div class="page-head-l"><div class="eyebrow">MODULE 07 / LISTING TEARDOWN</div>'
      +'<h1>Listing 框架<span class="en">LISTING TEARDOWN</span></h1>'
      +'<div class="page-sub">对标 '+cur+'：先看流量从哪来，再看退货怎么降，最后给一套能直接套用的标题和五点。</div></div>'
      +'<div class="head-actions"><span class="chip chip-cyan">'+cur+'</span>'
      +'<span class="chip chip-dim">'+(B?F.esc(B.brand):'待反解')+'</span>'
      +'<button type="button" class="btn btn-ghost" data-report="listing" data-label="Listing 拆解">加入报告</button></div></div>';

    if(!B){
      return '<div class="page">'+head+selectorPanel(null)+emptyPanel()+'</div>';
    }

    const vs=variantStats(B.variants);
    const hit=hitCount(B);

    return '<div class="page">'
      +head
      +verdictPanel(B)
      +'<div class="section-gap"></div>'
      +kpiRow(B)
      +'<div class="section-gap"></div>'
      +selectorPanel(B)
      +'<div class="section-gap"></div>'
      +U.panel({
        idx:'07-B',
        title:'变体主推数量',
        sub:vs.total+' SKU 结构 = '+B.variants.colors.length+' 色 x 6 码 · 在售 / 主推 / 断码三态热力矩阵',
        tools:U.chip('主推 '+vs.hero,'mint')+U.chip('断码 '+vs.out,'rose'),
        body:variantBody(B),
        foot:'<span>变体盘是「有没有我的码」的第一道转化门槛</span><span class="spacer"></span><span>快照 '+SNAPSHOT+'</span>'
      })
      +'<div class="section-gap"></div>'
      +U.panel({
        idx:'07-C',
        title:'标题拆解',
        sub:'原文 → 分段结构 → 埋词命中 → 长度与可读性',
        tools:U.chip(B.title.length+' 字符','cyan')+U.chip(hit+'/'+TARGET_COUNT+' 命中','mint'),
        body:titleBody(B),
        foot:'<span>词表口径：SellerSprite 搜索词 · US</span><span class="spacer"></span><span>'+WINDOW_TEXT()+'</span>'
      })
      +'<div class="section-gap"></div>'
      +U.panel({
        idx:'07-D',
        title:'五点拆解',
        sub:'逐条结构标签 + 埋词命中 + 内容特点',
        tools:U.chip(B.bullets.length+' 条','cyan'),
        body:bulletBody(B),
        foot:'<span>结构口径：痛点开场 / 功能证据 / 参数场景 / 信任背书 / 行动召唤</span><span class="spacer"></span><span class="c-amber">五点负责降低退货，不负责拉流量</span>'
      })
      +'<div class="section-gap"></div>'
      +U.panel({
        idx:'07-E',
        title:'A+ 拆解',
        sub:'模块顺序 / 风格占比 / 元素清单 / 为什么这样排',
        tools:U.chip(B.aplus.modules.length+' 模块','violet'),
        body:aplusBody(B),
        foot:'<span>风格占比按版面高度估算</span><span class="spacer"></span><span class="c-violet">A+ 是补词与说服的第二现场</span>'
      })
      +'<div class="section-gap"></div>'
      +U.panel({
        idx:'07-F',
        title:'埋词覆盖率与缺口',
        sub:'整体覆盖率 / 缺失词建议 / 可直接复用的标题与五点模板',
        tools:U.chip(hit+'/'+TARGET_COUNT,'mint')+U.chip('模板 2 份','cyan'),
        body:coverageBody(B),
        foot:'<span>缺口词优先级：搜索量 x 与产品定义的匹配度</span><span class="spacer"></span><span>'+SNAPSHOT+'</span>'
      })
      +'</div>';
  }

  /* ---------------- 交互：切换对标 ASIN ---------------- */
  function after(view){
    const input=view.querySelector('#benchInput');
    const applyBtn=view.querySelector('#benchApply');

    function apply(raw){
      const v=String(raw||'').trim().toUpperCase();
      if(!/^B0[A-Z0-9]{8}$/.test(v)){
        CX.toast('ASIN 格式应为 B0 + 8 位字母数字','warn');
        return;
      }
      if(v===CX.state.listingBench){
        CX.toast('当前已在看 '+v,'warn');
        return;
      }
      CX.state.listingBench=v;
      CX.state.benchmark=v;
      CX.saveConfig();
      CX.rerender();
      CX.toast(BENCHMARKS[v]?'已切换对标 '+v+'，08 / 08F 同步':'已切换对标 '+v+'，该 ASIN 暂无反解数据，08 / 08F 将显示口径演示','ok');
    }

    if(applyBtn) applyBtn.addEventListener('click',()=>apply(input?input.value:''));
    if(input) input.addEventListener('keydown',e=>{
      if(e.key==='Enter'){ e.preventDefault(); apply(input.value); }
    });
    Array.prototype.forEach.call(view.querySelectorAll('[data-bench]'),el=>{
      el.addEventListener('click',()=>apply(el.getAttribute('data-bench')));
    });
  }

  CX.register('listing',{title:'Listing 框架',render:render,after:after});
})();
