/* ============================================================
   AGENT-05 · 安全合规检测
   ============================================================ */
(function(){
  const CX=window.CX, F=CX.fmt, C=CX.charts, U=CX.ui;
  const risks=[
    {id:'R01',cat:'敏感词',item:'medical / therapeutic / pain relief',type:'医疗功效宣称',sev:'高',status:'禁止',evidence:'FTC Health Claims · 无临床证据',action:'全文删除，改为 “comfortable everyday fit”'},
    {id:'R02',cat:'敏感词',item:'antibacterial / antimicrobial',type:'抗菌宣称',sev:'高',status:'禁止',evidence:'需 EPA 农药注册，服装不适用',action:'删除；改用 “breathable cotton”'},
    {id:'R03',cat:'敏感词',item:'hypoallergenic',type:'低敏宣称',sev:'中',status:'需补证',evidence:'FTC 要求可靠科学依据',action:'无测试则改为 “skin-friendly”'},
    {id:'R04',cat:'敏感词',item:'organic / GOTS',type:'有机认证',sev:'高',status:'需补证',evidence:'需 GOTS / USDA 证书链',action:'未认证不得使用；先做常规棉'},
    {id:'R05',cat:'敏感词',item:'Made in USA',type:'原产地',sev:'高',status:'禁止',evidence:'FTC 原产地规则 · 全部或几乎全部美国制造',action:'标注 “Imported” 或实际产地'},
    {id:'R06',cat:'敏感词',item:'FDA approved',type:'医疗背书',sev:'高',status:'禁止',evidence:'服装不属于 FDA 医疗器械',action:'删除'},
    {id:'R07',cat:'敏感词',item:'best / #1 / guaranteed',type:'绝对化用语',sev:'中',status:'需整改',evidence:' substantiation 缺失',action:'改为 “designed for” / “easy returns”'},
    {id:'R08',cat:'专利',item:'US D1,042,xxx · elongated placket',type:'外观专利',sev:'中',status:'需 FTO',evidence:'3 扣门襟 + 弧形下摆组合权利要求',action:'改 4 扣门襟 / 直下摆，做 FTO 意见'},
    {id:'R09',cat:'专利',item:'US D987,xxx · plus-size knit shirt',type:'外观专利',sev:'低',status:'需 FTO',evidence:'侧拼片 + 落肩轮廓',action:'取消侧拼片，改 set-in 袖'},
    {id:'R10',cat:'版权',item:'迷彩 / 卡通 / 球队图案',type:'版权与商标',sev:'低',status:'可接受',evidence:'纯色款不涉及',action:'仅做纯色，避免图案'},
    {id:'R11',cat:'版权',item:'HENLEY&CO / KING SIZE 品牌词',type:'商标',sev:'高',status:'禁止',evidence:'竞品注册商标',action:'广告否词；Listing 不出现'},
    {id:'R12',cat:'认证',item:'FTC 纤维成分标签',type:'强制标签',sev:'中',status:'需整改',evidence:'16 CFR Part 303',action:'水洗标：95% Cotton / 5% Spandex'},
    {id:'R13',cat:'认证',item:'原产地标签',type:'强制标签',sev:'中',status:'需整改',evidence:'19 CFR 134',action:'领标 + 外箱标注 Made in China'},
    {id:'R14',cat:'认证',item:'California Prop 65',type:'化学警示',sev:'中',status:'需补证',evidence:'涂料 / 染料可能含铅、邻苯',action:'检测后决定是否加警示'},
    {id:'R15',cat:'检测',item:'AATCC 61 色牢度',type:'水洗色牢度',sev:'中',status:'需补证',evidence:'深色三件装易掉色',action:'送检 3 色，目标 ≥ 4 级'},
    {id:'R16',cat:'检测',item:'AATCC 135 缩水率',type:'尺寸稳定性',sev:'高',status:'需补证',evidence:'纯棉洗后缩水是退货主因',action:'3 次水洗，目标 ≤ 3%'},
    {id:'R17',cat:'检测',item:'ASTM D4970 起球',type:'抗起球',sev:'中',status:'需补证',evidence:'180g 薄款易起球',action:'升级 210g，目标 ≥ 4 级'},
    {id:'R18',cat:'检测',item:'甲醛 / 偶氮 / pH',type:'化学安全',sev:'中',status:'需补证',evidence:'贴身穿着，直接接触皮肤',action:'按 GB 18401 B 类 + 客人标准'},
    {id:'R19',cat:'合规',item:'儿童 CPSIA',type:'适用性',sev:'低',status:'可接受',evidence:'成人服装不适用',action:'保留不适用声明'},
    {id:'R20',cat:'合规',item:'尺码表与实物一致性',type:'FTC  deceptive practice',sev:'中',status:'需整改',evidence:'5XL 实测胸围 -8cm',action:'重做纸样 + 实测视频'}
  ];
  const CNT={}, HIGH=risks.filter(r=>r.cat==='敏感词'&&r.sev==='高').length;
  risks.forEach(r=>CNT[r.cat]=(CNT[r.cat]||0)+1);
  const cats=[
    {cat:'敏感词',n:CNT['敏感词'],sub:HIGH+' 高危',tone:'rose'},
    {cat:'专利',n:CNT['专利'],sub:'均需 FTO',tone:'amber'},
    {cat:'认证',n:CNT['认证'],sub:'2 必办',tone:'cyan'},
    {cat:'检测',n:CNT['检测'],sub:'4 必检',tone:'violet'},
    {cat:'版权',n:CNT['版权'],sub:'低风险',tone:'mint'},
    {cat:'合规',n:CNT['合规'],sub:'2 条件',tone:'cyan'}
  ];
  const words=[
    {g:'医疗功效',tone:'rose',items:['medical','therapeutic','pain relief','antibacterial','FDA approved']},
    {g:'认证类',tone:'amber',items:['organic','GOTS','hypoallergenic','Made in USA']},
    {g:'绝对化',tone:'amber',items:['best','#1','guaranteed','perfect fit']},
    {g:'品牌词',tone:'violet',items:['HENLEY&CO','KING SIZE','MAVERICK']}
  ];
  const patents=[
    {no:'US D1,042,xxx',title:'Henley shirt with elongated placket',risk:'中',scope:'3 扣门襟 + 弧形下摆的组合外观',avoid:'4 扣门襟、直下摆、错位双针',due:'上市前 14 天'},
    {no:'US D987,xxx',title:'Plus-size knit shirt',risk:'低–中',scope:'侧拼片 + 落肩轮廓',avoid:'取消侧拼片，改 set-in 袖',due:'打样阶段'}
  ];
  const checks=[
    {t:'FTC 纤维成分标签（16 CFR 303）',req:'强制',done:true},
    {t:'原产地标签（19 CFR 134）',req:'强制',done:true},
    {t:'AATCC 61 色牢度报告',req:'强制',done:false},
    {t:'AATCC 135 缩水率报告',req:'强制',done:false},
    {t:'ASTM D4970 起球测试',req:'建议',done:false},
    {t:'甲醛 / 偶氮 / pH 检测',req:'强制',done:false},
    {t:'California Prop 65 评估',req:'条件',done:false},
    {t:'GOTS 证书（仅有机宣称）',req:'条件',done:false}
  ];
  let active='全部';
  let sev='全部';

  function kpis(){
    return '<div class="kpi-grid">'
      +U.kpi({label:'综合合规风险',value:'32',unit:'/100',delta:'-4',foot:'中低 · 可管理',spark:[48,45,43,40,38,36,34,32],color:'#ffc857'})
      +U.kpi({label:'敏感词清单',value:String(CNT['敏感词']),unit:'条',delta:HIGH+' 高危',foot:'需全文替换',spark:[20,19,18,17,16,15,CNT['敏感词'],CNT['敏感词']],color:'#ff6b8a'})
      +U.kpi({label:'专利预警',value:'2',unit:'项',delta:'需 FTO',foot:'外观设计专利',spark:[1,1,1,2,2,2,2,2],color:'#a78bfa'})
      +U.kpi({label:'强制认证',value:String(CNT['认证']),unit:'项',delta:'2 已办',foot:'标签 / 原产地 / Prop 65',spark:[0,1,1,2,2,3,3,CNT['认证']],color:'#38e1ff'})
      +U.kpi({label:'检测项目',value:String(CNT['检测']),unit:'项',delta:'4 必检',foot:'周期 2–3 周',spark:[1,2,3,3,4,5,CNT['检测'],CNT['检测']],color:'#2ee6a8'})
      +'</div>';
  }

  function riskRows(){
    return risks.map(r=>{
      const sevTone=r.sev==='高'?'risk':r.sev==='中'?'warn':'neutral';
      const stTone=r.status==='禁止'?'risk':r.status==='可接受'?'ok':r.status==='需 FTO'?'violet':'warn';
      return '<tr data-risk="'+r.id+'" data-cat="'+r.cat+'" data-sev="'+r.sev+'" data-text="'+F.esc(r.item+' '+r.type+' '+r.action)+'">'
        +'<td>'+U.chip(r.cat,r.cat==='敏感词'?'rose':r.cat==='专利'?'violet':r.cat==='检测'?'cyan':'dim')+'</td>'
        +'<td><span class="main-cell">'+F.esc(r.item)+'</span><span class="sub">'+F.esc(r.type)+'</span></td>'
        +'<td>'+U.badge(r.sev,sevTone)+'</td><td>'+U.badge(r.status,stTone)+'</td>'
        +'<td style="max-width:200px"><span class="tiny dim">'+F.esc(r.evidence)+'</span></td>'
        +'<td style="max-width:230px"><span class="tiny">'+F.esc(r.action)+'</span></td></tr>';
    }).join('');
  }

  function drawer(r){
    return '<div class="drawer-section"><h3>RISK / '+r.id+'</h3><div style="font-size:13px;color:#fff;line-height:1.5">'+F.esc(r.item)+'</div><div class="reason-list" style="margin-top:7px">'+U.chip(r.cat,'cyan')+U.badge(r.sev,r.sev==='高'?'risk':r.sev==='中'?'warn':'neutral')+U.badge(r.status,r.status==='禁止'?'risk':r.status==='可接受'?'ok':'warn')+'</div></div>'
      +'<div class="drawer-section"><h3>RISK TYPE</h3><div class="drawer-note">'+F.esc(r.type)+'</div></div>'
      +'<div class="drawer-section"><h3>EVIDENCE</h3><div class="drawer-note">'+F.esc(r.evidence)+'</div></div>'
      +'<div class="drawer-section"><h3>REQUIRED ACTION</h3><div class="callout callout-warn">'+F.esc(r.action)+'</div></div>'
      +'<div class="drawer-section"><h3>OWNER / DUE</h3><div class="mini-list"><div class="mini-item"><span>责任人</span><b>合规 + 运营</b></div><div class="mini-item"><span>截止</span><b>上架前 14 天</b></div><div class="mini-item"><span>证据存档</span><b>NEXUS / COMPLIANCE</b></div></div></div>'
      +'<div style="display:flex;gap:7px"><button class="btn btn-sm" data-dispose="'+r.id+'">标记已处置</button><button class="btn btn-sm" data-copy="'+F.esc(r.item)+'">复制风险项</button></div>';
  }

  function render(){
    const done=checks.filter(c=>c.done).length;
    return '<div class="page">'
      +'<div class="page-head"><div class="page-head-l"><div class="eyebrow">MODULE 05 / COMPLIANCE SCAN</div><h1>安全合规检测<span class="en">COMPLIANCE & IP SCAN</span></h1>'
      +'<div class="page-sub">检查敏感词、版权、专利、认证和检测项。先找硬阻断，再给规避或补证的做法。</div></div>'
      +'<div class="head-actions"><span class="chip chip-amber">2 项 FTO</span><span class="chip chip-dim">SCAN 2026-04-18</span><button class="btn btn-ghost" id="riskExport">导出清单</button></div></div>'
      +kpis()

      +'<div class="section-gap"></div>'
      +'<div class="grid g13" style="margin-bottom:14px">'
        +U.panel({idx:'05-A',title:'风险总览',sub:'0–100 · 越低越安全',body:
          C.gauge({score:32,label:'COMPLIANCE RISK',color:'#ffc857'})
          +'<div class="center-block" style="margin-top:-4px"><span class="badge badge-warn">中低风险 · 可管理</span><div class="mini-note" style="max-width:190px;text-align:center">无硬阻断；需完成 2 项 FTO、删除 7 个高危词、补齐 4 项检测。</div></div>'
          +'<div class="divider"></div><div class="stat-table"><table class="stat-table"><tr><td>硬阻断项</td><td class="c-mint">0</td></tr><tr><td>需整改</td><td>9</td></tr><tr><td>需补证</td><td>7</td></tr><tr><td>可接受</td><td>4</td></tr></table></div>',foot:'<span>扫描范围：Listing / 广告 / 包装 / 专利库</span>'})
        +U.panel({idx:'05-B',title:'风险类别 · 点击筛选',sub:'六类风险分布；数字为命中项',body:
          '<div class="grid g3" style="gap:8px">'+cats.map(c=>'<button class="mod-card" data-cat-filter="'+c.cat+'" style="text-align:left;cursor:pointer;border:1px solid var(--line)"><div class="mod-top"><span class="mod-code">'+c.cat.toUpperCase()+'</span><span class="dot '+(c.tone==='rose'?'rose':c.tone==='amber'?'amber':'cyan')+'"></span></div><div class="mod-metric">'+c.n+'<small>项</small></div><div class="mod-desc">'+c.sub+'</div></button>').join('')+'</div>'
          +'<div class="callout callout-ok" style="margin-top:11px"><b>结论：</b>品类本身无强制准入牌照；风险集中在「宣称用语」与「外观专利规避」，均可在上架前关闭。</div>',foot:'<span>点击类别筛选风险登记表</span><span class="spacer"></span><span class="c-mint">0 硬阻断</span>'})
      +'</div>'

      +'<div class="grid g21" style="margin-bottom:14px">'
        +'<section class="panel"><div class="panel-hd"><div><div class="panel-title"><span class="idx">05-C</span>风险登记表</div><div class="panel-sub">20 项命中 · 按严重度与处置状态排序</div></div><div class="panel-tools"><span class="chip chip-cyan" id="riskCount">20</span></div></div>'
          +'<div class="panel-bd" style="padding-bottom:9px"><div class="filterbar"><div class="seg" id="riskCats"><button class="seg-btn active" data-cat="全部">全部</button><button class="seg-btn" data-cat="敏感词">敏感词</button><button class="seg-btn" data-cat="专利">专利</button><button class="seg-btn" data-cat="认证">认证</button><button class="seg-btn" data-cat="检测">检测</button><button class="seg-btn" data-cat="版权">版权</button><button class="seg-btn" data-cat="合规">合规</button></div><div class="spacer"></div><select class="select" id="riskSev" style="width:92px"><option value="全部">全部等级</option><option value="高">高</option><option value="中">中</option><option value="低">低</option></select><div class="search"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m15 15 5 5" stroke="currentColor" stroke-width="1.6"/></svg><input class="input" id="riskSearch" placeholder="搜索风险项" style="width:128px"></div></div></div>'
          +'<div class="table-wrap tall"><table class="tbl" style="min-width:760px"><thead><tr><th>类别</th><th>风险项 / 类型</th><th>等级</th><th>处置</th><th>证据</th><th>动作</th></tr></thead><tbody id="riskBody">'+riskRows()+'</tbody></table></div>'
          +'<div class="tbl-foot"><span>点击任意行查看证据与处置建议</span><span class="spacer"></span><span class="c-amber">7 项高优先级</span></div></section>'

        +'<div style="display:flex;flex-direction:column;gap:14px">'
          +U.panel({idx:'05-D',title:'敏感词黑名单',sub:'上架前全文扫描标题 / 五点 / A+ / 广告',body:
            words.map(w=>'<div style="margin-bottom:10px"><div class="field-label" style="margin-bottom:5px;color:'+(w.tone==='rose'?'var(--rose)':w.tone==='amber'?'var(--amber)':'var(--violet)')+'">'+w.g+'</div><div style="display:flex;flex-wrap:wrap;gap:4px">'+w.items.map(i=>'<span class="tag '+(w.tone==='rose'?'bad':w.tone==='amber'?'hot':'violet')+'" style="text-decoration:line-through;text-decoration-color:rgba(255,107,138,.6)">'+i+'</span>').join('')+'</div></div>').join('')
            +'<div class="callout callout-risk"><b>扫描结果：</b>当前草稿命中 3 个高危词（organic / antibacterial / best），必须在 07 Listing 定稿前替换。</div>',foot:'<span>'+CNT['敏感词']+' 条 · '+HIGH+' 高危</span>'})
          +U.panel({idx:'05-E',title:'专利预警',sub:'外观设计 · 需 FTO 意见',body:
            patents.map(p=>'<div class="persona" style="padding:10px;margin-bottom:7px"><div style="display:flex;align-items:center;gap:6px"><span class="mono tiny c-violet">'+p.no+'</span><span class="spacer"></span>'+U.badge(p.risk+'风险',p.risk==='中'?'warn':'info')+'</div><div style="font-size:10px;color:var(--txt);margin-top:4px">'+p.title+'</div><div class="mini-note">权利要求：'+p.scope+'</div><div class="mini-note" style="color:var(--mint)">规避：'+p.avoid+'</div><div class="mini-note">截止：'+p.due+'</div></div>').join('')
            +'<button class="btn btn-sm" style="width:100%" id="ftoCreate">创建 FTO 任务</button>'
            +(CX.state.fto&&CX.state.fto.length?'<div class="mini-list" style="margin-top:8px">'+CX.state.fto.map(t=>'<div class="mini-item"><span class="mono tiny c-violet">'+t.id+'</span><span class="tiny">'+F.esc(t.risk)+'</span><b class="c-amber">待办</b></div>').join('')+'</div>':''),
          foot:'<span class="c-amber">'+(2+(CX.state.fto?CX.state.fto.length:0))+' 项待处理</span>'})
        +'</div>'
      +'</div>'

      +'<div class="grid g2" style="margin-bottom:14px">'
        +U.panel({idx:'05-F',title:'认证与检测清单',sub:'上架前必须关闭的合规动作',body:
          '<div id="checkList">'+checks.map((c,i)=>'<label class="config-mod '+(c.done?'on':'')+'" style="margin-bottom:5px;cursor:pointer"><input type="checkbox" class="comp-check" '+(c.done?'checked':'')+' data-i="'+i+'"><span class="cm-box"></span><span class="cm-txt"><b>'+c.t+'</b><small>'+c.req+'</small></span><span class="chip '+(c.done?'chip-mint':'chip-dim')+'">'+(c.done?'已办':'待办')+'</span></label>').join('')+'</div>'
          +'<div class="mini-note" id="checkCount">已完成 '+done+' / '+checks.length+' · 2–3 周可全部关闭</div>',foot:'<span>检测预算 ≈ $850</span><span class="spacer"></span><span>FTO ≈ $1,200</span>'})
        +U.panel({idx:'05-G',title:'合规执行路径',sub:'从打样到上架的 4 个关卡',body:
          '<div class="timeline">'
          +'<div class="tl-item active"><div class="tl-dot"></div><div class="tl-head"><span class="tl-title">打样定稿</span><span class="tl-week">T-21D</span></div><div class="tl-body">锁定 4 扣门襟 / 直下摆 / 无侧拼片，完成规避设计。</div></div>'
          +'<div class="tl-item active"><div class="tl-dot"></div><div class="tl-head"><span class="tl-title">FTO + 商标检索</span><span class="tl-week">T-18D</span></div><div class="tl-body">美国律师出具 FTO 意见；广告否词加入 HENLEY&CO 等品牌词。</div></div>'
          +'<div class="tl-item"><div class="tl-dot"></div><div class="tl-head"><span class="tl-title">检测送样</span><span class="tl-week">T-16D</span></div><div class="tl-body">色牢度、缩水率、起球、甲醛/偶氮；同步制作纤维与产地标签。</div></div>'
          +'<div class="tl-item warn"><div class="tl-dot"></div><div class="tl-head"><span class="tl-title">Listing 终审</span><span class="tl-week">T-3D</span></div><div class="tl-body">全文扫敏感词；确认 5XL 实测数据与尺码表一致；Prop 65 结论。</div></div>'
          +'</div><div class="callout callout-warn" style="margin-top:11px">任何一项未关闭，不进入 08 推广放量阶段。</div>',foot:'<span>合规关键路径 21 天</span>'})
      +'</div>'

      +'<div class="callout callout-ok"><b>合规合并结论：</b>品类无强制准入牌照，综合风险 32/100，属于<b>可管理的中低风险</b>。必须在打样阶段完成 2 项外观专利规避（门襟 / 侧拼片），在 Listing 定稿前删除 7 个高危宣称词，并补齐 4 项强制检测。全部动作预算约 <b>$2,050</b>、周期 <b>2–3 周</b>，不构成上市硬阻断。</div>'
      +'</div>';
  }

  CX.register('compliance',{title:'安全合规',render:render,after:function(view){
    function filter(){
      const q=(view.querySelector('#riskSearch').value||'').toLowerCase();
      let n=0;
      view.querySelectorAll('#riskBody tr').forEach(r=>{
        const okCat=active==='全部'||r.dataset.cat===active;
        const okSev=sev==='全部'||r.dataset.sev===sev;
        const okQ=!q||r.dataset.text.toLowerCase().indexOf(q)>=0;
        const show=okCat&&okSev&&okQ; r.style.display=show?'':'none'; if(show)n++;
      });
      view.querySelector('#riskCount').textContent=n;
    }
    view.querySelectorAll('#riskCats .seg-btn').forEach(b=>b.addEventListener('click',()=>{
      view.querySelectorAll('#riskCats .seg-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); active=b.dataset.cat; filter();
    }));
    view.querySelector('#riskSev').addEventListener('change',e=>{ sev=e.target.value; filter(); });
    view.querySelector('#riskSearch').addEventListener('input',filter);

    view.querySelectorAll('[data-cat-filter]').forEach(b=>b.addEventListener('click',()=>{
      active=b.dataset.catFilter;
      const target=view.querySelector('#riskCats .seg-btn[data-cat="'+active+'"]'); if(target) target.click();
      const panel=view.querySelector('#riskBody'); if(panel) panel.closest('.panel').scrollIntoView({behavior:'smooth',block:'start'});
    }));

    view.querySelectorAll('#riskBody tr').forEach(tr=>tr.addEventListener('click',()=>{
      const r=risks.find(x=>x.id===tr.dataset.risk);
      CX.openDrawer({eyebrow:'COMPLIANCE RISK / '+r.id,title:r.cat+'风险',body:drawer(r),after:function(bd){
        const d=bd.querySelector('[data-dispose]');
        if(d) d.addEventListener('click',()=>{
          r.status='已处置';
          CX.closeDrawer();
          CX.rerender();
          CX.toast(r.id+' 已标记为已处置','ok');
        });
      }});
    }));

    view.querySelector('#checkList').addEventListener('change',e=>{
      if(!e.target.classList.contains('comp-check')) return;
      const i=Number(e.target.dataset.i); checks[i].done=e.target.checked;
      const label=e.target.closest('.config-mod'); label.classList.toggle('on',e.target.checked);
      const chip=label.querySelector('.chip'); chip.textContent=e.target.checked?'已办':'待办'; chip.className='chip '+(e.target.checked?'chip-mint':'chip-dim');
      const done=checks.filter(c=>c.done).length;
      view.querySelector('#checkCount').textContent='已完成 '+done+' / '+checks.length+' · 2–3 周可全部关闭';
      CX.toast(e.target.checked?'已标记完成：'+checks[i].t:'已取消完成标记','ok');
    });


    const fto=view.querySelector('#ftoCreate');
    if(fto) fto.addEventListener('click',()=>{
      const n=(CX.state.fto||[]).length+1;
      const id='FTO-'+String(n).padStart(2,'0');
      CX.state.fto=(CX.state.fto||[]).concat([{id:id,risk:patents.map(p=>p.no).join(' / '),at:new Date().toISOString()}]);
      CX.saveConfig(); CX.rerender();
      CX.toast('FTO 任务已创建：'+id,'ok');
    });
    const exp=view.querySelector('#riskExport');
    if(exp) exp.addEventListener('click',()=>{
      const rows=[['编号','类别','风险项','类型','等级','状态','证据','处置动作']];
      risks.forEach(r=>rows.push([r.id,r.cat,r.item,r.type,r.sev,r.status,r.evidence,r.action]));
      CX.exportCSV('nexus-compliance-checklist.csv',rows);
    });
  }});
})();
