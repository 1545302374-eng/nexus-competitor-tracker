/* ============================================================
   NEXUS dataset — demo case: US plus-size henley 3-pack
   All figures are synthetic demo data for the static prototype.
   ============================================================ */
(function(){
  const CX = window.CX = window.CX || {};
  CX.data = CX.data || {};

  CX.data.meta = {
    brand:'UEEKO',
    project:'PLUS-SIZE HENLEY / US',
    categoryCn:'男士大码亨利短袖三件装',
    category:"Men’s Big & Tall Henley Short Sleeve 3-Pack",
    marketplace:'Amazon US',
    snapshot:'2026-04-18 09:30',
    window:'2026-01-25 → 2026-04-18 · 12 周',
    ideal:'3XL–5XL 真码、加长下摆、200g 精梳棉、三件装、无感标签，$37–$40 价格带。',
    asins:[
      {asin:'B0D2H8YQ7K', role:'主推', title:'UEEKO Men’s Big & Tall Henley Shirts 3 Pack', price:39.99, rating:4.3, reviews:612, bsr:1284, sales:2340, variants:18, ads:6, sim:100, size:'L–5XL', pack:'3-pack', material:'棉 95 / 氨纶 5', fit:'宽松'},
      {asin:'B0D4K1M2P9', role:'同系列', title:'UEEKO Big & Tall Henley Short Sleeve 3 Pack', price:39.99, rating:4.2, reviews:388, bsr:2160, sales:1180, variants:12, ads:4, sim:96, size:'1X–4X', pack:'3-pack', material:'棉 95 / 氨纶 5', fit:'宽松'},
      {asin:'B0D5N7R3T6', role:'测款', title:'UEEKO Plus Size Henley Shirts for Men 3 Pack', price:37.99, rating:4.1, reviews:205, bsr:4420, sales:720, variants:9, ads:3, sim:94, size:'2XL–5XL', pack:'3-pack', material:'棉 100', fit:'常规'}
    ],
    benchmark:'B0C9K2M4P1',
    benchmarkBrand:'HENLEY&CO',
    benchmarkTitle:"Men's Big & Tall Henley Shirts Short Sleeve 3 Pack Cotton Casual Button Down T-Shirts",
    stats:{
      marketGmv:8.74, marketGmvUnit:'M', growth:18.4, avgPrice:34.90,
      searches:1.42, searchUnit:'M', returnRate:12.8, cpc:1.28, cpcGrowth:11.3,
      cr5:41.6, newShare:14.2, poolSize:18, poolCoverage:7.1
    }
  };

  CX.data.pool = [
    {asin:'B0D2H8YQ7K', brand:'UEEKO', title:'Men’s Big & Tall Henley Shirts 3 Pack', price:39.99, rating:4.3, reviews:612, bsr:1284, sales:2340, variants:18, ads:6, sim:100, size:'L–5XL', pack:'3-pack', material:'棉 95 / 氨纶 5', fit:'宽松', tag:'主推 ASIN', launch:'2025-11', adShare:38, self:true},
    {asin:'B0C9K2M4P1', brand:'HENLEY&CO', title:"Men's Big & Tall Henley Shirts Short Sleeve 3 Pack Cotton", price:36.99, rating:4.4, reviews:2130, bsr:842, sales:3120, variants:30, ads:8, sim:94, size:'1X–5X', pack:'3-pack', material:'100% 精梳棉', fit:'常规', tag:'对标头部', launch:'2024-08', adShare:46, benchmark:true},
    {asin:'B0B7T5R9L3', brand:'KING SIZE', title:'Big & Tall Henley Shirts for Men Short Sleeve', price:19.99, rating:4.1, reviews:4890, bsr:1560, sales:2850, variants:22, ads:5, sim:86, size:'2XL–6XL', pack:'单件', material:'棉 90 / 涤 10', fit:'宽松', tag:'低价单件', launch:'2023-06', adShare:22},
    {asin:'B0D1F6H8J2', brand:'MAVERICK', title:'Men’s Henley Shirts Big & Tall 3 Pack Soft Cotton', price:42.99, rating:4.5, reviews:980, bsr:2100, sales:1600, variants:24, ads:5, sim:88, size:'1X–4X', pack:'3-pack', material:'棉 92 / 氨纶 8', fit:'修身', tag:'高评分', launch:'2025-02', adShare:31},
    {asin:'B0D8P3Q6R7', brand:'TRUE NATION', title:'Plus Size Henley Shirts for Men 2 Pack', price:22.99, rating:4.2, reviews:340, bsr:4320, sales:820, variants:14, ads:3, sim:84, size:'2XL–5XL', pack:'2-pack', material:'100% 棉', fit:'常规', tag:'新锐', launch:'2025-09', adShare:27},
    {asin:'B0C4V7B9N1', brand:'HARBOR BAY', title:'Big and Tall Henley Shirt Men 3 Pack Casual', price:29.99, rating:4.0, reviews:1870, bsr:2900, sales:1320, variants:19, ads:4, sim:83, size:'L–4XL', pack:'3-pack', material:'棉涤混纺', fit:'常规', tag:'价格竞争', launch:'2024-03', adShare:35},
    {asin:'B0D5W2E8T4', brand:'NORTHCREST', title:'Men’s Big & Tall Henley Longline 2 Pack', price:27.99, rating:4.3, reviews:760, bsr:3670, sales:960, variants:16, ads:2, sim:81, size:'1X–5XL', pack:'2-pack', material:'棉 95 / 氨纶 5', fit:'宽松', tag:'大码专营', launch:'2025-05', adShare:18},
    {asin:'B0B2S8D4F6', brand:'KAMAKURA', title:'Big & Tall Cotton Linen Henley Shirts 3 Pack', price:31.50, rating:4.4, reviews:1540, bsr:3120, sales:1100, variants:20, ads:4, sim:80, size:'L–5XL', pack:'3-pack', material:'棉麻混纺', fit:'宽松', tag:'材质差异', launch:'2024-01', adShare:29},
    {asin:'B0D9G1H5J8', brand:'GLOBAL VISION', title:'Men’s Big and Tall Henley Shirts 4 Pack', price:44.99, rating:4.1, reviews:220, bsr:6800, sales:540, variants:26, ads:2, sim:72, size:'1X–5XL', pack:'4-pack', material:'棉 90 / 涤 10', fit:'常规', tag:'多件装', launch:'2025-10', adShare:16},
    {asin:'B0C6N2M8K4', brand:'ATLAS', title:'Big & Tall Henley Shirts Men Pocket Short Sleeve', price:25.99, rating:3.9, reviews:2980, bsr:5200, sales:700, variants:15, ads:3, sim:70, size:'2XL–5XL', pack:'单件', material:'100% 棉', fit:'宽松', tag:'口袋款', launch:'2023-11', adShare:21},
    {asin:'B0D3R7T1V9', brand:'SUMMIT', title:'Men’s Henley Shirts Big & Tall Slim Fit 2 Pack', price:32.99, rating:4.6, reviews:460, bsr:7200, sales:480, variants:12, ads:2, sim:61, size:'1X–4X', pack:'2-pack', material:'棉 95 / 氨纶 5', fit:'修身', tag:'高评分', launch:'2025-07', adShare:14},
    {asin:'B0D7L4P2W5', brand:'RIVERSTONE', title:'Big and Tall Henley Shirts for Men Short Sleeve', price:21.99, rating:4.0, reviews:1120, bsr:8900, sales:410, variants:10, ads:1, sim:58, size:'L–4XL', pack:'单件', material:'100% 棉', fit:'常规', tag:'低价', launch:'2024-06', adShare:12},
    {asin:'B0C1J9K3L7', brand:'VINTAGE FIT', title:'Men’s Big & Tall Vintage Henley Shirt 3 Pack', price:33.99, rating:4.2, reviews:640, bsr:9400, sales:360, variants:18, ads:2, sim:60, size:'1X–4X', pack:'3-pack', material:'100% 棉', fit:'复古', tag:'复古款', launch:'2024-02', adShare:11},
    {asin:'B0D6Q8S4U2', brand:'OAKLINE', title:'Big & Tall Henley Shirts 3 Pack New Season', price:35.99, rating:4.0, reviews:180, bsr:11200, sales:280, variants:12, ads:1, sim:55, size:'2XL–5XL', pack:'3-pack', material:'棉 90 / 涤 10', fit:'常规', tag:'新品', launch:'2026-01', adShare:9},
    {asin:'B0B9M5N7P3', brand:'PEAK PERFORMANCE', title:'Men’s Big & Tall Performance Henley Shirt', price:28.99, rating:4.3, reviews:870, bsr:12600, sales:250, variants:14, ads:2, sim:52, size:'L–4XL', pack:'单件', material:'速干混纺', fit:'运动', tag:'运动场景', launch:'2023-09', adShare:13},
    {asin:'B0D0A2B4C6', brand:'SOLACE', title:'Organic Cotton Big & Tall Henley Shirt', price:38.99, rating:4.5, reviews:90, bsr:14800, sales:190, variants:8, ads:0, sim:49, size:'1X–4XL', pack:'单件', material:'有机棉', fit:'常规', tag:'环保溢价', launch:'2025-12', adShare:4},
    {asin:'B0C8E6F2G4', brand:'URBAN THREAD', title:'Men’s Big and Tall Henley Short Sleeve Slim', price:24.99, rating:3.8, reviews:1560, bsr:17100, sales:170, variants:11, ads:1, sim:45, size:'L–4XL', pack:'单件', material:'100% 棉', fit:'修身', tag:'低评分', launch:'2022-08', adShare:8},
    {asin:'B0D4H6J8K1', brand:'COASTAL', title:'Big & Tall Linen Blend Henley Shirt Men', price:34.99, rating:4.1, reviews:310, bsr:19500, sales:140, variants:9, ads:0, sim:43, size:'2XL–5XL', pack:'单件', material:'亚麻混纺', fit:'宽松', tag:'亚麻差异', launch:'2025-04', adShare:3}
  ];

  CX.data.agents = [
    {id:'market', code:'AGENT-01', name:'市场分析 Agent', task:'7 表单逐项拆解 + 18 竞品产品池', time:'18.4s', tokens:'42.1K', output:'7 / 7 表单 · 18 竞品', score:82},
    {id:'params', code:'AGENT-02', name:'参数项分析 Agent', task:'参数矩阵 + 热销组合 + 缺口识别', time:'11.2s', tokens:'26.8K', output:'12 参数 · 7 命中', score:76},
    {id:'voc', code:'AGENT-03', name:'用户画像 Agent', task:'12,480 条评论编码 · 场景与痛点聚类', time:'22.7s', tokens:'58.3K', output:'3 人群 · 6 空白需求', score:80},
    {id:'profit', code:'AGENT-04', name:'利润模型 Agent', task:'1688 报价 + 头程 + FBA + 退货模型', time:'9.6s', tokens:'18.2K', output:'4 供应方案 · 34.3% 毛利', score:71},
    {id:'compliance', code:'AGENT-05', name:'安全合规 Agent', task:'敏感词 · 版权 · 专利 · 认证检索', time:'14.1s', tokens:'31.5K', output:'14 敏感词 · 2 专利预警', score:74},
    {id:'opportunity', code:'AGENT-06', name:'机会裁决 Agent', task:'六维证据合成 + 切入路径生成', time:'8.8s', tokens:'21.4K', output:'条件性可实施 · 78 分', score:78},
    {id:'listing', code:'AGENT-07', name:'Listing 拆解 Agent', task:'标题 · 五点 · A+ · 变体结构反解', time:'13.5s', tokens:'34.7K', output:'30 SKU · 9/12 埋词', score:68},
    {id:'promotion', code:'AGENT-08', name:'推广策略 Agent', task:'90 天节奏 + SIF 广告架构推测', time:'27.3s', tokens:'66.9K', output:'5 活动 · 11 广告组', score:73},
    {id:'flow', code:'AGENT-08F', name:'流量波动 Agent', task:'8 周流量 · 主推词 · 投放力度 · 滞后效果', time:'16.9s', tokens:'38.6K', output:'8 周 · 7 主推词', score:77}
  ];

  CX.data.market = {
    kpis:[
      {label:'月市场 GMV', value:'$8.74', unit:'M', delta:'+18.4% YoY', foot:'大盘连续 4 季正增长'},
      {label:'月搜索量', value:'1.42', unit:'M', delta:'+12.6%', foot:'90 天搜索趋势'},
      {label:'平均售价', value:'$34.90', unit:'', delta:'+3.1%', foot:'价格带缓慢上移'},
      {label:'头部集中度 CR5', value:'41.6', unit:'%', delta:'-2.8pp', foot:'集中度下降，仍可切入'},
      {label:'平均退货率', value:'12.8', unit:'%', delta:'+1.4pp', foot:'大码尺码为主要原因'}
    ],
    conclusion:'美国站男士大码亨利短袖处于「需求增长 + 供给同质」的窗口期：大盘 GMV 同比 +18.4%，3XL–5XL 真码供给仅占头部 SKU 的 21%，且头部 Listing 的加长下摆、无感标签卖点覆盖不足。建议以三件装 $37.99–$39.99 切入，不做 $19.99 单件红海。'
  };
})();
