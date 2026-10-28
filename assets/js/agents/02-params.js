/* ============================================================
   AGENT-02 · 参数项分析
   ============================================================ */
(function(){
  const CX=window.CX, F=CX.fmt, C=CX.charts, U=CX.ui;
  const cols=[
    {label:'我品',sub:'B0D2'},
    {label:'HENLEY&CO',sub:'对标'},
    {label:'KING SIZE',sub:'低价'},
    {label:'MAVERICK',sub:'高评分'},
    {label:'KAMAKURA',sub:'棉麻'},
    {label:'NORTHCREST',sub:'大码'}
  ];
  const rows=[
    {label:'3 件装',sub:'PACK',values:[100,100,0,100,100,0]},
    {label:'3 扣亨利领',sub:'NECK',values:[100,100,100,95,100,100]},
    {label:'宽松直筒',sub:'FIT',values:[85,70,90,30,80,95]},
    {label:'3XL–5XL 真码',sub:'SIZE',values:[88,95,80,60,70,95]},
    {label:'200g+ 克重',sub:'GSM',values:[45,95,40,85,55,75]},
    {label:'加长下摆',sub:'HEM',values:[80,35,20,25,45,70]},
    {label:'无感印标',sub:'TAG',values:[90,40,10,30,20,60]},
    {label:'落肩短袖',sub:'SLEEVE',values:[75,40,60,20,55,70]},
    {label:'黑 / 藏青 / 灰',sub:'COLOR',values:[100,100,80,90,85,100]},
    {label:'无胸袋',sub:'POCKET',values:[100,100,40,80,100,100]},
    {label:'双针锁边',sub:'STITCH',values:[80,90,50,75,65,85]},
    {label:'精梳棉 ≥95%',sub:'FABRIC',values:[60,100,30,90,40,80]}
  ];
  const combos=[
    {name:'3 件装 · 精梳棉 · 3 扣 · 宽松 · 真码',share:28,avg:'2,840',fit:'覆盖',tone:'good'},
    {name:'3 件装 · 棉氨纶 · 落肩 · 加长下摆',share:19,avg:'2,180',fit:'部分',tone:'hot'},
    {name:'3 件装 · 棉麻 · 宽松 · 无感标',share:14,avg:'1,620',fit:'部分',tone:'hot'},
    {name:'2 件装 · 精梳棉 · 常规版型',share:12,avg:'1,240',fit:'缺失',tone:'bad'},
    {name:'单件 · $19.99 · 3 扣 · 基础色',share:18,avg:'1,080',fit:'不做',tone:'bad'},
    {name:'4 件装 · 基础色 · 常规',share:9,avg:'760',fit:'缺失',tone:'bad'}
  ];
  const gaps=[
    {p:'克重',own:'180g',bench:'200–220g',gap:'-20 ~ -40g',stat:'缺口',tone:'warn',act:'升级 210g 精梳棉'},
    {p:'下摆长度',own:'74cm',bench:'77–78cm',gap:'-3 ~ -4cm',stat:'缺口',tone:'warn',act:'加长 3cm / 弧形'},
    {p:'5XL 真码',own:'胸围 132cm',bench:'138–142cm',gap:'-6 ~ -10cm',stat:'缺口',tone:'warn',act:'重做 5XL 纸样'},
    {p:'包装件数',own:'3 件装',bench:'3 件装',gap:'0',stat:'命中',tone:'ok',act:'保持'},
    {p:'领型',own:'3 扣亨利',bench:'3 扣亨利',gap:'0',stat:'命中',tone:'ok',act:'保持'},
    {p:'面料',own:'棉 95 / 氨纶 5',bench:'100% 精梳棉',gap:'混纺差异',stat:'部分',tone:'info',act:'精梳棉 / 弹力双版本'},
    {p:'标签',own:'无感印标',bench:'仅 18% 覆盖',gap:'领先',stat:'超配',tone:'ok',act:'标题 + 五点放大'},
    {p:'颜色',own:'黑 / 藏青 / 灰',bench:'黑 / 藏青 / 灰',gap:'0',stat:'命中',tone:'ok',act:'保持'},
    {p:'袖型',own:'常规短袖',bench:'落肩短袖',gap:'差 1 档',stat:'部分',tone:'info',act:'落肩 1.5cm 微调'},
    {p:'胸袋',own:'无',bench:'无',gap:'0',stat:'命中',tone:'ok',act:'不增加'},
    {p:'版型',own:'宽松直筒',bench:'宽松直筒',gap:'0',stat:'命中',tone:'ok',act:'保持'},
    {p:'4 件装',own:'无',bench:'占比 9%',gap:'缺失',stat:'机会',tone:'info',act:'Q3 再评估'}
  ];
  const points=[
    {name:'3 件装',cover:55,lift:22,type:'必备',note:'多件装是当前最强转化钩子'},
    {name:'3XL–5XL 真码',cover:31,lift:15,type:'机会',note:'真码供给不足，退货率可降 2pp'},
    {name:'加长下摆',cover:22,lift:18,type:'机会',note:'差评中「偏短」占 21%'},
    {name:'无感印标',cover:18,lift:11,type:'差异',note:'低成本高感知，适合标题埋词'},
    {name:'200g+ 克重',cover:42,lift:9,type:'必备',note:'薄款差评率高，升级成本可控'},
    {name:'棉麻混纺',cover:25,lift:6,type:'差异',note:'夏季场景，但受众较窄'},
    {name:'4 件装',cover:12,lift:3,type:'观察',note:'客单价高但库存压力大'},
    {name:'胸袋',cover:38,lift:-4,type:'回避',note:'与「无感 / 简洁」定位冲突'},
    {name:'运动速干',cover:14,lift:-2,type:'回避',note:'偏离日常通勤主场景'}
  ];
  const colorMap={必备:'#38e1ff',机会:'#2ee6a8',差异:'#a78bfa',观察:'#ffc857',回避:'#ff6b8a'};

  function kpis(){
    return '<div class="kpi-grid">'
      +U.kpi({label:'热销参数命中',value:'7',unit:'/ 9',delta:'+1',foot:'核心参数门槛',spark:[4,5,5,6,6,7,7,7],color:'#2ee6a8'})
      +U.kpi({label:'差异化缺口',value:'3',unit:'项',delta:'已定位',deltaDir:'flat',foot:'克重 / 下摆 / 5XL',spark:[6,5,5,4,4,3,3,3],color:'#ffc857'})
      +U.kpi({label:'销量加权覆盖',value:'68',unit:'%',delta:'+5.4pp',foot:'产品池 18 竞品',spark:[55,57,58,61,63,65,67,68],color:'#38e1ff'})
      +U.kpi({label:'头号组合份额',value:'28',unit:'%',delta:'+3.2pp',foot:'3 件装 + 精梳棉',spark:[21,22,24,24,25,26,27,28],color:'#a78bfa'})
      +U.kpi({label:'改版成本增量',value:'+$0.42',unit:'/套',delta:'可控',deltaDir:'flat',foot:'毛利仍 ≥ 31.8%',spark:[0.3,0.34,0.36,0.38,0.4,0.41,0.42,0.42],color:'#4f8cff'})
      +'</div>';
  }

  function render(){
    return '<div class="page">'
      +'<div class="page-head"><div class="page-head-l"><div class="eyebrow">MODULE 02 / PARAMETER MATRIX</div><h1>参数项分析<span class="en">PARAMETER INTELLIGENCE</span></h1>'
      +'<div class="page-sub">用输入 ASIN 和产品池做样本，看 12 个参数在 6 个竞品上的表现，按销量加权。</div></div>'
      +'<div class="head-actions"><span class="chip chip-cyan">12 PARAMS</span><span class="chip chip-dim">18 竞品样本</span><button class="btn btn-ghost" data-report="params" data-label="参数矩阵">加入报告</button></div></div>'
      +kpis()

      +'<div class="section-gap"></div>'
      +'<div class="grid g31" style="margin-bottom:14px">'
        +U.panel({idx:'02-A',title:'参数 × 竞品适配矩阵',sub:'数值 = 销量加权适配度（0–100），非市场占有率',flush:true,body:
          '<div style="padding:14px 16px 4px">'+C.heat({rows:rows,cols:cols,rowWidth:118,minValue:0,maxValue:100,palette:'cyan',corner:'PARAM / ASIN',tipFmt:v=>v+' / 100'})+'</div>'
          +'<div class="panel-foot" style="margin-top:8px"><span>深色 = 适配度高</span><span class="spacer"></span><span class="c-cyan">我品在 4 项上低于代表竞品</span></div>',foot:'<span>样本：输入 3 ASIN + 核心池 8</span><span class="spacer"></span><span>权重：月销 × 评分 × 变体覆盖</span>'})
        +U.panel({idx:'02-B',title:'热销参数组合',sub:'按组合销量份额排序',body:
          '<div style="display:flex;flex-direction:column;gap:11px">'
          +combos.map((c,i)=>'<div><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span class="mono c-cyan tiny">0'+(i+1)+'</span><span style="font-size:9.5px;color:var(--txt-2);line-height:1.45;flex:1">'+c.name+'</span><span class="chip '+(c.tone==='good'?'chip-mint':c.tone==='bad'?'chip-rose':'chip-amber')+'" style="font-size:7.5px">'+c.fit+'</span></div>'
            +'<div style="display:flex;align-items:center;gap:7px">'+U.meter(c.share,c.tone==='good'?'mint':c.tone==='bad'?'rose':'amber')+'<span class="num" style="font-size:10px;color:var(--muted)">'+c.share+'%</span><span class="tiny dim">均月销 '+c.avg+'</span></div></div>').join('')
          +'</div>'
          +'<div class="callout callout-ok" style="margin-top:13px">我品已覆盖 <b>#1 / #2 / #3</b> 组合骨架，缺的是「200g+ / 加长下摆 / 5XL 真码」三个硬参数。</div>',foot:'<span>组合份额基于 18 竞品月销加权</span>'})
      +'</div>'

      +'<div class="grid g12" style="margin-bottom:14px">'
        +U.panel({idx:'02-C',title:'参数机会地图',sub:'横轴：竞品覆盖率 · 纵轴：销量提升 lift · 气泡：证据强度',body:
          C.scatter({height:330,points:points.map(p=>({x:p.cover,y:p.lift,r:Math.max(4,Math.abs(p.lift)/3+3),label:p.name,short:p.name,showLabel:['3 件装','3XL–5XL 真码','加长下摆','无感印标','胸袋'].indexOf(p.name)>=0,color:colorMap[p.type]})),xMin:0,xMax:70,yMin:-6,yMax:26,xLabel:'竞品覆盖率 %',yLabel:'销量 lift %',quadrant:{x:40,y:8,labels:[{x:320,y:150,text:'DIFFERENTIATION / 差异化机会'},{x:610,y:150,text:'RED OCEAN / 红海'},{x:70,y:52,text:'VALIDATE'},{x:70,y:305,text:'AVOID'}]},legend:Object.keys(colorMap).map(k=>({name:k,color:colorMap[k]}))}),
          foot:'<span>右上：高覆盖高提升 → 必须做到</span><span class="spacer"></span><span>左上：低覆盖高提升 → 差异化</span>'})
        +U.panel({idx:'02-D',title:'被验证的 7 个参数点',sub:'按「销量 lift」排序',body:
          '<div class="mini-list">'+points.filter(p=>p.lift>0).sort((a,b)=>b.lift-a.lift).map(p=>'<div class="mini-item"><span class="dot" style="background:'+colorMap[p.type]+';box-shadow:0 0 6px '+colorMap[p.type]+'"></span><span style="flex:1"><b style="display:inline;font-size:9.5px;color:var(--txt)">'+p.name+'</b><small style="display:block;color:var(--muted-2);font-size:8px">'+p.note+'</small></span><span class="chip '+(p.type==='机会'?'chip-mint':p.type==='差异'?'chip-violet':'chip-cyan')+'" style="font-size:7px">'+p.type+'</span><b>+'+p.lift+'%</b></div>').join('')+'</div>'
          +'<div class="callout" style="margin-top:11px"><b>判断：</b>「3 件装 + 3 扣 + 宽松」是入场券；「加长下摆 + 真码 + 无感标」才是溢价理由。</div>',foot:'<span>样本 12,480 条 TOP 评论 + 18 SKU 参数</span>'})
      +'</div>'

      +'<section class="panel" style="margin-bottom:14px"><div class="panel-hd"><div><div class="panel-title"><span class="idx">02-E</span>我品参数 vs 热销基准</div><div class="panel-sub">按「热销组合加权基准」逐项对比，输出可执行的改版动作</div></div><div class="panel-tools">'+U.chip('3 个缺口','amber')+U.chip('5 项命中','mint')+'</div></div>'
        +'<div class="table-wrap"><table class="tbl" style="min-width:760px"><thead><tr><th>参数</th><th>我品当前</th><th>热销基准</th><th>差距</th><th>判定</th><th>建议动作</th></tr></thead><tbody>'
        +gaps.map(g=>'<tr><td class="main-cell">'+g.p+'</td><td>'+g.own+'</td><td>'+g.bench+'</td><td class="num" style="color:'+(g.tone==='warn'?'var(--amber)':g.tone==='ok'?'var(--mint)':'var(--muted)')+'">'+g.gap+'</td><td>'+U.badge(g.stat,g.tone)+'</td><td>'+g.act+'</td></tr>').join('')
        +'</tbody></table></div><div class="panel-foot"><span>改版优先级：克重 → 5XL 纸样 → 下摆长度 → 无感标</span><span class="spacer"></span><span>预计成本增量 +$0.42 / 套</span></div></section>'

      +'<div class="grid g3" style="margin-bottom:14px">'
        +U.panel({idx:'MUST',title:'必修 · 入场券',sub:'不做会被直接比下去',body:'<div class="bullet-list"><div class="bullet"><b>210g 精梳棉</b>：解决薄透 / 起球，成本 +$0.18</div><div class="bullet"><b>5XL 真码</b>：胸围 +8cm，纸样重开 +$0.16</div><div class="bullet"><b>下摆 +3cm</b>：覆盖「偏短」差评场景</div></div><div class="callout callout-ok" style="margin-top:10px">三项落地后退货率预计 <b>-2.1pp</b>，评分目标 4.4+。</div>',foot:'<span class="c-mint">优先级 P0</span>'})
        +U.panel({idx:'EDGE',title:'差异化 · 溢价理由',sub:'只放大一个记忆点',body:'<div class="bullet-list"><div class="bullet"><b>无感印标</b>：标题埋 “tagless”，低竞争高转化</div><div class="bullet"><b>加长下摆</b>：主图对比 3cm，视觉可感知</div><div class="bullet"><b>三色套装</b>：黑 / 藏青 / 灰，减少 SKU 决策</div></div><div class="callout" style="margin-top:10px">差异化点必须同时出现在 <b>标题 / 主图 / 五点第 1 条</b>。</div>',foot:'<span class="c-violet">优先级 P1</span>'})
        +U.panel({idx:'STOP',title:'不做 · 主动放弃',sub:'避开低效投入',body:'<div class="bullet-list"><div class="bullet"><b>胸袋款</b>：与简洁定位冲突，lift -4%</div><div class="bullet"><b>$19.99 单件</b>：退货 + 广告双杀</div><div class="bullet"><b>4 件装</b>：库存压力 > 客单收益</div><div class="bullet"><b>有机棉宣称</b>：认证与合规风险</div></div>',foot:'<span class="c-rose">优先级 STOP</span>'})
      +'</div>'
      +'</div>';
  }

  CX.register('params',{title:'参数项分析',render:render});
})();
