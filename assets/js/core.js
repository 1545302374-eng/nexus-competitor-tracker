/* ============================================================
   NEXUS core — state, router, UI primitives, SVG charts
   ============================================================ */
(function(){
  const CX = window.CX = window.CX || {};
  CX.modules = CX.modules || {};
  CX.data = CX.data || {};

  const MODULES = [
    {id:'market',     code:'01', name:'市场分析',   hint:'大盘 · 7 表单 · 产品池', optional:true},
    {id:'params',     code:'02', name:'参数项分析', hint:'热销参数 · 组合 · 缺口', optional:true},
    {id:'voc',        code:'03', name:'用户画像',   hint:'VOC 场景 · 痛点 · 未满足', optional:true},
    {id:'profit',     code:'04', name:'利润模型',   hint:'1688 · 头程 · 尾程 · 退货', optional:true},
    {id:'compliance', code:'05', name:'安全合规',   hint:'敏感词 · 专利 · 认证', optional:true},
    {id:'opportunity',code:'06', name:'市场机会',   hint:'可行性 · 切入策略', optional:true},
    {id:'listing',    code:'07', name:'Listing 框架', hint:'标题 · 五点 · A+ · 变体', optional:true},
    {id:'promotion',  code:'08', name:'推广策略',   hint:'90 天节奏 · 广告架构推测', optional:true},
    {id:'flow',       code:'08F',name:'流量波动专项', hint:'自然排名 · 主推词 · 投放力度', optional:true},
    {id:'report',     code:'R',  name:'决策报告',   hint:'汇总 10 个板块 · 可导出', optional:false}
  ];
  CX.MODULES = MODULES;
  const META = CX.data.meta || {};


  /* 演示数据窗口：接后端后由 coverage 接口替换 */
  const DEMO_START='2026-01-25';
  const DEMO_END='2026-04-18';
  function isIsoDate(s){ return /^\d{4}-\d{2}-\d{2}$/.test(String(s||'')); }
  function addDays(iso,n){
    var d=new Date(String(iso)+'T00:00:00Z');
    d.setUTCDate(d.getUTCDate()+n);
    return d.toISOString().slice(0,10);
  }
  function daysBetween(start,end){
    var a=new Date(String(start)+'T00:00:00Z').getTime();
    var b=new Date(String(end)+'T00:00:00Z').getTime();
    return Math.round((b-a)/86400000);
  }
  function weeksOf(start,end){ return Math.max(1, Math.round((daysBetween(start,end)+1)/7)); }
  function presetWindow(preset){
    var start=DEMO_START, end=DEMO_END;
    if(preset==='last4') start=addDays(end,-27);
    else if(preset==='last8') start=addDays(end,-55);
    else if(preset==='lifecycle') start=DEMO_START;
    return {preset:preset||'last12',start:start,end:end,weeks:weeksOf(start,end),availableStart:DEMO_START,availableEnd:DEMO_END};
  }
  function normalizeWindow(raw){
    if(!raw) return presetWindow('last12');
    if(raw.preset==='last4'||raw.preset==='last8'||raw.preset==='last12'||raw.preset==='lifecycle') return presetWindow(raw.preset);
    var start=isIsoDate(raw.start)?raw.start:DEMO_START;
    var end=isIsoDate(raw.end)?raw.end:DEMO_END;
    return {preset:raw.preset||'custom',start:start,end:end,weeks:weeksOf(start,end),availableStart:DEMO_START,availableEnd:DEMO_END};
  }
  function windowLabel(w){
    var x=normalizeWindow(w||(CX.state&&CX.state.analysisWindow));
    var n=x.weeks||weeksOf(x.start,x.end);
    return x.start+' → '+x.end+' · '+n+' 周';
  }
  function windowShort(w){
    var x=normalizeWindow(w||(CX.state&&CX.state.analysisWindow));
    var n=x.weeks||weeksOf(x.start,x.end);
    return x.start.slice(5)+' → '+x.end.slice(5)+' · '+n+' 周';
  }
  function windowError(w){
    if(!w||!isIsoDate(w.start)||!isIsoDate(w.end)) return {msg:'请选择开始和结束日期',target:'#winStart'};
    if(w.end<w.start) return {msg:'结束日期不能早于开始日期',target:'#winEnd'};
    if(daysBetween(w.start,w.end)+1<7) return {msg:'分析窗口至少 7 天',target:'#winStart'};
    if(w.start<DEMO_START||w.end>DEMO_END) return {msg:'当前演示数据覆盖 '+DEMO_START+' 至 '+DEMO_END+'，请在该范围内选择',target:w.start<DEMO_START?'#winStart':'#winEnd'};
    return null;
  }
  const saved = (()=>{ try{ return JSON.parse(localStorage.getItem('nexus.config.v1')||'null'); }catch(e){ return null; } })();
  CX.state = {
    asins: (function(){
      var arr=(saved && Array.isArray(saved.asins) && saved.asins.length) ? saved.asins : (META.asins||[]).map(a=>a.asin);
      arr=arr.map(a=>String(a).toUpperCase()).filter(a=>/^B0[A-Z0-9]{8}$/.test(a)).slice(0,5);
      return arr.length?arr:(META.asins||[]).map(a=>a.asin);
    })(),
    benchmark: (saved && /^B0[A-Z0-9]{8}$/.test(String(saved.benchmark||'').toUpperCase())) ? String(saved.benchmark).toUpperCase() : (META.benchmark || 'B0C9K2M4P1'),
    ideal: (saved && saved.ideal) ? saved.ideal : (META.ideal || ''),
    modules: Object.assign(
      MODULES.reduce((o,m)=>{o[m.id]=true;return o;},{}),
      (saved && saved.modules) || {}
    ),
    analysisWindow: normalizeWindow(saved && saved.analysisWindow),
    flowRange: (saved && (saved.flowRange===4||saved.flowRange===8)) ? saved.flowRange : 8,
    listingBench: (saved && /^B0[A-Z0-9]{8}$/.test(String(saved.benchmark||'').toUpperCase())) ? String(saved.benchmark).toUpperCase() : (META.benchmark || 'B0C9K2M4P1'),
    profit: (saved && saved.profit) || {price:39.99, returnRate:12.8, source:0, coupon:10},
    included: (saved && saved.included) || {},
    fto: (saved && saved.fto) || [],
    locked: !!(saved && saved.locked),
    mode: (saved && saved.mode) || 'full',
    projectId: (saved && saved.projectId) || null,
    projectName: (saved && saved.projectName) || '',
    lastRun: (saved && saved.lastRun) || null,
    analysis: (saved && saved.analysis) || {status:'idle',step:0,total:0,steps:[],startedAt:null,finishedAt:null,projectId:null},
    current: 'overview',
    running: false
  };

  const $ = (s,r)=> (r||document).querySelector(s);
  const $$ = (s,r)=> Array.from((r||document).querySelectorAll(s));

  CX.$ = $; CX.$$ = $$;
  CX.windowInfo=function(){ return normalizeWindow(CX.state.analysisWindow); };
  CX.windowLabel=function(w){ return windowLabel(w); };
  CX.windowShort=function(w){ return windowShort(w); };
  CX.windowWeeks=function(){ return normalizeWindow(CX.state.analysisWindow).weeks; };
  CX.windowError=function(w){ return windowError(w); };
  CX.presetWindow=function(p){ return presetWindow(p); };
  CX.windowCoverageNote=function(){
    var w=normalizeWindow(CX.state.analysisWindow);
    if(w.preset==='lifecycle') return '演示数据从 '+DEMO_START+' 开始；真实上架日期接入后按上架日返回。';
    if(w.start===DEMO_START && w.end===DEMO_END) return '';
    return '当前演示数据固定为 '+DEMO_START+' 至 '+DEMO_END+'；真实接口接入后按所选窗口返回。';
  };

  /* ---------------- format ---------------- */
  const fmt = {
    num(v,d){ if(v===null||v===undefined||isNaN(v)) return '—'; const n=Number(v); return n.toLocaleString('en-US',{minimumFractionDigits:d||0,maximumFractionDigits:d===undefined?0:d}); },
    dec(v,d){ if(v===null||v===undefined||isNaN(v)) return '—'; return Number(v).toFixed(d===undefined?1:d); },
    pct(v,d){ if(v===null||v===undefined||isNaN(v)) return '—'; return Number(v).toFixed(d===undefined?1:d)+'%'; },
    signed(v,d,suffix){ const n=Number(v); const sign=n>0?'+':''; return sign+n.toFixed(d===undefined?1:d)+(suffix||''); },
    money(v,d){ if(v===null||v===undefined||isNaN(v)) return '—'; return '$'+Number(v).toFixed(d===undefined?2:d); },
    compact(v){ if(v===null||v===undefined||isNaN(v)) return '—'; const n=Number(v); if(Math.abs(n)>=1e8) return (n/1e8).toFixed(2)+'亿'; if(Math.abs(n)>=1e6) return (n/1e6).toFixed(2)+'M'; if(Math.abs(n)>=1e4) return (n/1e3).toFixed(1)+'K'; return fmt.num(n); },
    k(v){ return Math.abs(v)>=1000 ? (v/1000).toFixed(1)+'K' : String(v); },
    esc(s){ return String(s===undefined?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  };
  CX.fmt = fmt;

  /* ---------------- ui primitives ---------------- */
  function kpi(o){
    const delta = o.delta;
    let cls = o.deltaDir || '';
    if(!cls && delta !== undefined && delta !== null && delta !== '' && delta !== '—'){
      cls = String(delta).trim().charAt(0)==='-' ? 'down' : (String(delta).trim().charAt(0)==='+' ? 'up' : 'flat');
    }
    return '<div class="kpi">'
      + '<div class="kpi-top"><span class="kpi-label">'+fmt.esc(o.label)+'</span>'+(o.icon?'<span class="kpi-ico">'+o.icon+'</span>':'')+'</div>'
      + '<div class="kpi-value">'+o.value+(o.unit?'<span class="unit">'+o.unit+'</span>':'')+'</div>'
      + '<div class="kpi-foot"><span>'+(o.foot||'')+'</span>'+(delta!==undefined&&delta!==null?'<span class="delta '+cls+'">'+delta+'</span>':'')+'</div>'
      + (o.spark?'<div class="spark">'+spark(o.spark,o.color||'#38e1ff')+'</div>':'')
      + '</div>';
  }
  function panel(o){
    const bd = o.body===undefined?'':o.body;
    return '<section class="panel '+(o.cls||'')+'">'
      + '<div class="panel-hd"><div><div class="panel-title">'+(o.idx?'<span class="idx">'+o.idx+'</span>':'')+o.title+'</div>'+(o.sub?'<div class="panel-sub">'+o.sub+'</div>':'')+'</div>'+(o.tools?'<div class="panel-tools">'+o.tools+'</div>':'')+'</div>'
      + '<div class="panel-bd'+(o.flush?' flush':'')+(o.tight?' tight':'')+'">'+bd+'</div>'
      + (o.foot?'<div class="panel-foot">'+o.foot+'</div>':'')
      + '</section>';
  }
  function sectionHead(n,title,desc){
    return '<div class="sec-head"><span class="sec-num">'+n+'</span><span class="sec-title">'+title+'</span>'+(desc?'<span class="sec-desc">'+desc+'</span>':'')+'<span class="sec-line"></span></div>';
  }
  function badge(text,type){ return '<span class="badge badge-'+(type||'neutral')+'">'+text+'</span>'; }
  function chip(text,type){ return '<span class="chip '+(type?'chip-'+type:'')+'">'+text+'</span>'; }
  function tag(text,type){ return '<span class="tag '+(type||'')+'">'+text+'</span>'; }
  function meter(v,cls){ return '<div class="meter '+(cls||'')+'"><i style="width:'+Math.max(0,Math.min(100,v))+'%"></i></div>'; }
  function deltaTag(v,suffix){
    const n=Number(v); const cls=n>0?'up':n<0?'down':'flat';
    return '<span class="delta '+cls+'">'+(n>0?'+':'')+fmt.dec(n,1)+(suffix||'')+'</span>';
  }
  CX.ui = {kpi,panel,sectionHead,badge,chip,tag,meter,deltaTag};

  /* ---------------- svg helpers ---------------- */
  let uidn = 0;
  const uid = ()=> 'nx'+(++uidn);
  const R = v=> Math.round(v*10)/10;
  function niceMax(v){
    if(!isFinite(v) || v<=0) return 1;
    const exp = Math.floor(Math.log10(v));
    const f = v/Math.pow(10,exp);
    const nf = f<=1?1:f<=1.5?1.5:f<=2?2:f<=2.5?2.5:f<=3?3:f<=4?4:f<=5?5:f<=6?6:f<=8?8:10;
    return nf*Math.pow(10,exp);
  }
  function smooth(points){
    if(points.length<2) return '';
    let d='M'+R(points[0][0])+','+R(points[0][1]);
    for(let i=0;i<points.length-1;i++){
      const p0=points[i-1]||points[i], p1=points[i], p2=points[i+1], p3=points[i+2]||p2;
      const c1x=p1[0]+(p2[0]-p0[0])/6, c1y=p1[1]+(p2[1]-p0[1])/6;
      const c2x=p2[0]-(p3[0]-p1[0])/6, c2y=p2[1]-(p3[1]-p1[1])/6;
      d+=' C'+R(c1x)+','+R(c1y)+' '+R(c2x)+','+R(c2y)+' '+R(p2[0])+','+R(p2[1]);
    }
    return d;
  }
  function spark(vals,color,opt){
    opt=opt||{};
    const w=opt.w||100,h=opt.h||30,pad=2;
    const min=Math.min.apply(null,vals), max=Math.max.apply(null,vals);
    const span=(max-min)||1;
    const pts=vals.map((v,i)=>[pad+(w-pad*2)*(vals.length===1?0.5:i/(vals.length-1)), h-pad-(h-pad*2)*((v-min)/span)]);
    const path=smooth(pts);
    const gid=uid();
    return '<svg viewBox="0 0 '+w+' '+h+'" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true">'
      + '<defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+color+'" stop-opacity=".28"/><stop offset="1" stop-color="'+color+'" stop-opacity="0"/></linearGradient></defs>'
      + '<path d="'+path+' L'+R(pts[pts.length-1][0])+','+h+' L'+R(pts[0][0])+','+h+' Z" fill="url(#'+gid+')"/>'
      + '<path d="'+path+'" fill="none" stroke="'+color+'" stroke-width="1.4" stroke-linecap="round"/>'
      + '</svg>';
  }

  function axisGrid(cfg){
    const W=920,H=cfg.height||240,P=cfg.pad||{l:46,r:16,t:18,b:28};
    const yMin=cfg.yMin===undefined?0:cfg.yMin;
    const yMax=cfg.yMax===undefined?niceMax(Math.max.apply(null,cfg.allValues.concat([1]))):cfg.yMax;
    const plotW=W-P.l-P.r, plotH=H-P.t-P.b;
    const y=v=> P.t+plotH*(1-(v-yMin)/((yMax-yMin)||1));
    const x=i=> P.l+plotW*(cfg.labels.length===1?0.5:i/(cfg.labels.length-1));
    const ticks=cfg.yTicks||4;
    let g='';
    for(let i=0;i<=ticks;i++){
      const v=yMin+(yMax-yMin)*i/ticks, yy=y(v);
      g+='<line class="'+(i===0?'axis':'gridline')+'" x1="'+P.l+'" y1="'+R(yy)+'" x2="'+(W-P.r)+'" y2="'+R(yy)+'"/>';
      if(cfg.showY!==false) g+='<text x="'+(P.l-7)+'" y="'+(R(yy)+3)+'" text-anchor="end">'+cfg.yFmt(v)+'</text>';
    }
    return {W,H,P,plotW,plotH,y,x,g,yMin,yMax};
  }

  function line(cfg){
    const all=[]; cfg.series.forEach(s=>s.values.forEach(v=>{ if(v!==null&&!isNaN(v)) all.push(v); }));
    const ax=axisGrid({labels:cfg.labels,height:cfg.height||240,yMax:cfg.yMax,yMin:cfg.yMin,yFmt:cfg.yFmt||((v)=>fmt.compact(v)),allValues:all,pad:cfg.pad,yTicks:cfg.yTicks});
    const {W,H,P,plotW,plotH,y,x}=ax;
    let defs='', body=ax.g;
    const step=cfg.xStep||Math.ceil(cfg.labels.length/12);
    cfg.labels.forEach((l,i)=>{ if(i%step===0||i===cfg.labels.length-1) body+='<text x="'+R(x(i))+'" y="'+(H-8)+'" text-anchor="middle">'+fmt.esc(l)+'</text>'; });
    (cfg.refLines||[]).forEach(r=>{
      const yy=y(r.y);
      body+='<line class="refline" x1="'+P.l+'" y1="'+R(yy)+'" x2="'+(W-P.r)+'" y2="'+R(yy)+'" '+(r.color?'stroke="'+r.color+'"':'')+' stroke-opacity=".7"/>';
      if(r.label) body+='<text x="'+(W-P.r)+'" y="'+(R(yy)-4)+'" text-anchor="end" class="val-label" fill="'+(r.color||'#ffc857')+'">'+fmt.esc(r.label)+'</text>';
    });
    cfg.series.forEach((s,si)=>{
      const pts=[]; s.values.forEach((v,i)=>{ if(v!==null&&!isNaN(v)) pts.push([x(i),y(v),i,v]); });
      if(!pts.length) return;
      const path=smooth(pts);
      const color=s.color||'#38e1ff';
      if(s.area!==false){
        const gid=uid();
        defs+='<linearGradient id="'+gid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+color+'" stop-opacity=".22"/><stop offset="1" stop-color="'+color+'" stop-opacity="0"/></linearGradient>';
        body+='<path d="'+path+' L'+R(pts[pts.length-1][0])+','+(H-P.b)+' L'+R(pts[0][0])+','+(H-P.b)+' Z" fill="url(#'+gid+')"/>';
      }
      body+='<path d="'+path+'" fill="none" stroke="'+color+'" stroke-width="'+(s.width||2)+'" stroke-linecap="round" '+(s.dash?'stroke-dasharray="4 4"':'')+'/>';
      pts.forEach(p=>{
        body+='<circle cx="'+R(p[0])+'" cy="'+R(p[1])+'" r="'+(s.dot===false?0:2.6)+'" fill="#06101c" stroke="'+color+'" stroke-width="1.5"><title>'+fmt.esc((s.name||'')+' '+cfg.labels[p[2]]+': '+(cfg.tipFmt?cfg.tipFmt(p[3]):p[3]))+'</title></circle>';
      });
    });
    let legend='';
    if(cfg.legend!==false){
      legend='<div class="chart-legend">'+cfg.series.map(s=>'<span class="legend-item"><i class="legend-line" style="background:'+(s.color||'#38e1ff')+'"></i>'+fmt.esc(s.name)+'</span>').join('')+'</div>';
    }
    return '<div class="chart"><svg viewBox="0 0 '+W+' '+H+'" role="img"><defs>'+defs+'</defs>'+body+'</svg>'+legend+'</div>';
  }

  function bars(cfg){
    const all=[]; cfg.series.forEach(s=>s.values.forEach(v=>{if(v!==null&&!isNaN(v))all.push(v);}));
    const stacked=cfg.stacked!==false;
    let maxVal=0;
    if(stacked){ cfg.labels.forEach((_,i)=>{ let t=0; cfg.series.forEach(s=>t+=(s.values[i]||0)); maxVal=Math.max(maxVal,t); }); }
    else maxVal=Math.max.apply(null,all.concat([1]));
    const ax=axisGrid({labels:cfg.labels,height:cfg.height||240,yMax:cfg.yMax||niceMax(maxVal),yFmt:cfg.yFmt||((v)=>fmt.compact(v)),allValues:all,pad:cfg.pad,yTicks:cfg.yTicks});
    const {W,H,P,plotW,y}=ax;
    const n=cfg.labels.length, band=plotW/n, bw=Math.min(cfg.barWidth||30,band*(stacked?0.52:0.66));
    let body=ax.g;
    const step=cfg.xStep||Math.ceil(n/12);
    cfg.labels.forEach((l,i)=>{ if(i%step===0||i===n-1) body+='<text x="'+R(P.l+band*(i+0.5))+'" y="'+(H-8)+'" text-anchor="middle">'+fmt.esc(l)+'</text>'; });
    cfg.labels.forEach((l,i)=>{
      const cx=P.l+band*(i+0.5);
      if(stacked){
        let acc=0;
        cfg.series.forEach(s=>{
          const v=s.values[i]||0; if(v<=0) return;
          const y0=y(acc), y1=y(acc+v);
          body+='<rect x="'+R(cx-bw/2)+'" y="'+R(y1)+'" width="'+R(bw)+'" height="'+R(Math.max(0,y0-y1))+'" rx="1.5" fill="'+(s.color||'#38e1ff')+'" opacity="'+(s.opacity||0.88)+'"><title>'+fmt.esc(l+' · '+s.name+': '+(cfg.tipFmt?cfg.tipFmt(v):v))+'</title></rect>';
          acc+=v;
        });
        if(cfg.totalLabels){
          body+='<text x="'+R(cx)+'" y="'+R(y(acc)-4)+'" text-anchor="middle" class="val-label">'+cfg.totalFmt(acc)+'</text>';
        }
      }else{
        const sw=bw/cfg.series.length;
        cfg.series.forEach((s,si)=>{
          const v=s.values[i]||0;
          const yy=y(v);
          body+='<rect x="'+R(cx-bw/2+sw*si)+'" y="'+R(yy)+'" width="'+R(Math.max(1,sw-2))+'" height="'+R(Math.max(0,y(0)-yy))+'" rx="1.5" fill="'+(s.color||'#38e1ff')+'" opacity=".88"><title>'+fmt.esc(l+' · '+s.name+': '+v)+'</title></rect>';
        });
      }
    });
    const legend='<div class="chart-legend">'+cfg.series.map(s=>'<span class="legend-item"><i class="legend-dot" style="background:'+(s.color||'#38e1ff')+'"></i>'+fmt.esc(s.name)+'</span>').join('')+'</div>';
    return '<div class="chart"><svg viewBox="0 0 '+W+' '+H+'" role="img">'+body+'</svg>'+(cfg.legend===false?'':legend)+'</div>';
  }

  function comboBars(cfg){
    const allBars=[]; cfg.labels.forEach((_,i)=>{ let t=0; cfg.bars.forEach(s=>t+=(s.values[i]||0)); allBars.push(t); });
    const maxBar=cfg.yMax||niceMax(Math.max.apply(null,allBars.concat([1])));
    const ax=axisGrid({labels:cfg.labels,height:cfg.height||260,yMax:maxBar,yFmt:cfg.yFmt||((v)=>fmt.compact(v)),allValues:allBars,pad:{l:48,r:44,t:18,b:30},yTicks:cfg.yTicks||4});
    const {W,H,P,plotW,y,x}=ax;
    const n=cfg.labels.length, band=plotW/n, bw=Math.min(38,band*0.5);
    let body=ax.g;
    cfg.labels.forEach((l,i)=>{ body+='<text x="'+R(P.l+band*(i+0.5))+'" y="'+(H-9)+'" text-anchor="middle">'+fmt.esc(l)+'</text>'; });
    cfg.labels.forEach((l,i)=>{
      const cx=P.l+band*(i+0.5); let acc=0;
      cfg.bars.forEach(s=>{
        const v=s.values[i]||0; if(v<=0)return;
        const y0=y(acc), y1=y(acc+v);
        body+='<rect x="'+R(cx-bw/2)+'" y="'+R(y1)+'" width="'+R(bw)+'" height="'+R(Math.max(0,y0-y1))+'" rx="1" fill="'+(s.color||'#38e1ff')+'" opacity=".82"><title>'+fmt.esc(l+' · '+s.name+': '+v)+'</title></rect>';
        acc+=v;
      });
    });
    const yR=cfg.yRightMax? (v)=> P.t+(H-P.t-P.b)*(1-v/cfg.yRightMax) : null;
    (cfg.lines||[]).forEach(l=>{
      const yy=l.right&&yR?yR:(v=>y(v));
      const pts=l.values.map((v,i)=>[x(i),yy(v)]);
      body+='<path d="'+smooth(pts)+'" fill="none" stroke="'+(l.color||'#ffc857')+'" stroke-width="2" '+(l.dash?'stroke-dasharray="4 4"':'')+'/>';
      pts.forEach((p,i)=>{
        if(i%2===0||i===pts.length-1) body+='<circle cx="'+R(p[0])+'" cy="'+R(p[1])+'" r="2.6" fill="#07111d" stroke="'+(l.color||'#ffc857')+'" stroke-width="1.4"><title>'+fmt.esc(l.name+' '+cfg.labels[i]+': '+l.values[i])+'</title></circle>';
      });
    });
    if(cfg.yRightMax){
      [0,.5,1].forEach(t=>{
        const v=cfg.yRightMax*t, yy=yR(v);
        body+='<text x="'+(W-P.r+6)+'" y="'+R(yy+3)+'" text-anchor="start" class="val-label" fill="'+(cfg.rightColor||'#ffc857')+'">'+Math.round(v)+'%</text>';
      });
    }
    const legend='<div class="chart-legend">'+cfg.bars.map(s=>'<span class="legend-item"><i class="legend-dot" style="background:'+s.color+'"></i>'+fmt.esc(s.name)+'</span>').join('')+(cfg.lines||[]).map(l=>'<span class="legend-item"><i class="legend-line" style="background:'+l.color+'"></i>'+fmt.esc(l.name)+'</span>').join('')+'</div>';
    return '<div class="chart"><svg viewBox="0 0 '+W+' '+H+'" role="img">'+body+'</svg>'+legend+'</div>';
  }

  function radar(cfg){
    const size=cfg.size||340, cx=size/2, cy=size/2+4, r=size*0.34;
    const n=cfg.axes.length, max=cfg.max||100;
    const pt=(i,v)=>{ const a=-Math.PI/2 + i*2*Math.PI/n; const rr=r*(v/max); return [cx+rr*Math.cos(a), cy+rr*Math.sin(a)]; };
    let body='';
    [0.25,0.5,0.75,1].forEach(t=>{
      const pts=cfg.axes.map((_,i)=>pt(i,max*t).map(R).join(',')).join(' ');
      body+='<polygon points="'+pts+'" fill="none" stroke="rgba(102,178,224,'+(t===1?'.18':'.09')+')" stroke-width="1"/>';
    });
    cfg.axes.forEach((a,i)=>{
      const p=pt(i,max);
      body+='<line x1="'+cx+'" y1="'+cy+'" x2="'+R(p[0])+'" y2="'+R(p[1])+'" stroke="rgba(102,178,224,.11)"/>';
      const lp=pt(i,max*1.16);
      const anchor=Math.abs(lp[0]-cx)<8?'middle':(lp[0]>cx?'start':'end');
      body+='<text x="'+R(lp[0])+'" y="'+R(lp[1]+3)+'" text-anchor="'+anchor+'" fill="#8fa8bd" font-size="9">'+fmt.esc(a.label)+'</text>';
    });
    cfg.series.forEach(s=>{
      const pts=s.values.map((v,i)=>pt(i,v));
      body+='<polygon points="'+pts.map(p=>p.map(R).join(',')).join(' ')+'" fill="'+(s.fill||'rgba(56,225,255,.12)')+'" stroke="'+(s.color||'#38e1ff')+'" stroke-width="1.6" stroke-linejoin="round"/>';
      pts.forEach((p,i)=>{ body+='<circle cx="'+R(p[0])+'" cy="'+R(p[1])+'" r="2.3" fill="#07111d" stroke="'+(s.color||'#38e1ff')+'" stroke-width="1.4"><title>'+fmt.esc(cfg.axes[i].label+': '+s.values[i])+'</title></circle>'; });
    });
    return '<div class="chart"><svg viewBox="0 0 '+size+' '+size+'" style="max-width:'+size+'px;margin:0 auto" role="img">'+body+'</svg>'
      + (cfg.legend===false?'':'<div class="chart-legend" style="justify-content:center">'+cfg.series.map(s=>'<span class="legend-item"><i class="legend-dot" style="background:'+(s.color||'#38e1ff')+'"></i>'+fmt.esc(s.name)+'</span>').join('')+'</div>')
      + '</div>';
  }

  function donut(cfg){
    const size=cfg.size||170, r=cfg.r||56, c=size/2, thick=cfg.thick||14;
    const total=cfg.segments.reduce((s,x)=>s+x.value,0)||1;
    const C=2*Math.PI*r;
    let off=0, body='';
    cfg.segments.forEach(s=>{
      const len=C*s.value/total;
      body+='<circle cx="'+c+'" cy="'+c+'" r="'+r+'" fill="none" stroke="'+(s.color||'#38e1ff')+'" stroke-width="'+thick+'" stroke-dasharray="'+R(Math.max(0,len-2))+' '+R(C-len+2)+'" stroke-dashoffset="'+R(-off)+'" transform="rotate(-90 '+c+' '+c+')" opacity=".95"><title>'+fmt.esc(s.name+': '+s.value+' ('+fmt.dec(s.value/total*100,1)+'%)')+'</title></circle>';
      off+=len;
    });
    const center=cfg.center||{};
    const svg='<svg viewBox="0 0 '+size+' '+size+'" width="'+size+'" height="'+size+'" role="img">'+body
      +'<text x="'+c+'" y="'+(c-2)+'" text-anchor="middle" fill="#e6f3ff" font-family="Bahnschrift, sans-serif" font-size="22">'+fmt.esc(center.value===undefined?'':center.value)+'</text>'
      +'<text x="'+c+'" y="'+(c+14)+'" text-anchor="middle" fill="#7890a8" font-size="8" letter-spacing="1">'+fmt.esc(center.label||'')+'</text></svg>';
    const legend='<div style="display:flex;flex-direction:column;gap:6px;font-size:9px;color:#b6c9dc;min-width:110px">'+cfg.segments.map(s=>'<div style="display:flex;align-items:center;gap:6px"><i style="width:6px;height:6px;border-radius:1px;background:'+s.color+';flex:none"></i><span style="flex:1">'+fmt.esc(s.name)+'</span><b style="font-family:Bahnschrift,sans-serif;color:#fff;font-weight:500">'+fmt.dec(s.value/total*100,1)+'%</b></div>').join('')+'</div>';
    return '<div style="display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap">'+svg+legend+'</div>';
  }

  function gauge(cfg){
    const score=cfg.score, max=cfg.max||100, color=cfg.color||'#2ee6a8', W=240,H=136,cx=120,cy=112,r=82;
    const a0=Math.PI, a1=Math.PI+Math.PI*(score/max);
    const p1=[cx+r*Math.cos(a0),cy+r*Math.sin(a0)], p2=[cx+r*Math.cos(a1),cy+r*Math.sin(a1)];
    const large=(a1-a0)>Math.PI?1:0;
    let ticks='';
    for(let i=0;i<=10;i++){
      const a=Math.PI+Math.PI*i/10;
      const x1=cx+(r+7)*Math.cos(a), y1=cy+(r+7)*Math.sin(a);
      const x2=cx+(r+11)*Math.cos(a), y2=cy+(r+11)*Math.sin(a);
      ticks+='<line x1="'+R(x1)+'" y1="'+R(y1)+'" x2="'+R(x2)+'" y2="'+R(y2)+'" stroke="rgba(102,178,224,'+(i%5===0?'.4':'.18')+')" stroke-width="1"/>';
    }
    return '<div class="gauge-wrap"><svg viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" style="max-width:100%" role="img">'
      +'<path d="M '+(cx-r)+' '+cy+' A '+r+' '+r+' 0 0 1 '+(cx+r)+' '+cy+'" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="7" stroke-linecap="round"/>'
      +'<path d="M '+R(p1[0])+' '+R(p1[1])+' A '+r+' '+r+' 0 '+large+' 1 '+R(p2[0])+' '+R(p2[1])+'" fill="none" stroke="'+color+'" stroke-width="7" stroke-linecap="round" style="filter:drop-shadow(0 0 6px '+color+'66)"/>'
      +ticks
      +'<text x="'+cx+'" y="'+(cy-16)+'" text-anchor="middle" fill="#e6f3ff" font-family="Bahnschrift, sans-serif" font-size="34">'+score+'</text>'
      +'<text x="'+cx+'" y="'+(cy+4)+'" text-anchor="middle" fill="#7890a8" font-size="8" letter-spacing="1.4">'+fmt.esc(cfg.label||'SCORE')+' / '+max+'</text>'
      +'</svg></div>';
  }

  function hbar(items){
    return '<div class="score-list">'+items.map(it=>{
      const max=it.max||Math.max.apply(null,items.map(x=>x.value))||1;
      return '<div class="score-row" style="grid-template-columns:'+(it.labelW||90)+'px minmax(0,1fr) 40px">'
        +'<span class="lbl" title="'+fmt.esc(it.label)+'">'+fmt.esc(it.label)+'</span>'
        +'<span class="track '+(it.cls||'')+'"><i style="width:'+Math.max(2,Math.min(100,it.value/max*100))+'%"></i></span>'
        +'<span class="val">'+(it.fmt?it.fmt(it.value):it.value)+'</span></div>';
    }).join('')+'</div>';
  }

  function scatter(cfg){
    const W=920,H=cfg.height||330,P={l:52,r:22,t:18,b:36};
    const xs=cfg.points.map(p=>p.x), ys=cfg.points.map(p=>p.y);
    const xMin=cfg.xMin!==undefined?cfg.xMin:Math.min.apply(null,xs)*.94;
    const xMax=cfg.xMax!==undefined?cfg.xMax:Math.max.apply(null,xs)*1.06;
    const yMin=cfg.yMin!==undefined?cfg.yMin:0;
    const yMax=cfg.yMax!==undefined?cfg.yMax:niceMax(Math.max.apply(null,ys)*1.1);
    const x=v=>P.l+(W-P.l-P.r)*((v-xMin)/((xMax-xMin)||1));
    const y=v=>P.t+(H-P.t-P.b)*(1-(v-yMin)/((yMax-yMin)||1));
    let body='';
    for(let i=0;i<=4;i++){
      const v=yMin+(yMax-yMin)*i/4, yy=y(v);
      body+='<line class="'+(i===0?'axis':'gridline')+'" x1="'+P.l+'" y1="'+R(yy)+'" x2="'+(W-P.r)+'" y2="'+R(yy)+'"/>';
      body+='<text x="'+(P.l-6)+'" y="'+(R(yy)+3)+'" text-anchor="end">'+(cfg.yFmt?cfg.yFmt(v):fmt.compact(v))+'</text>';
    }
    for(let i=0;i<=4;i++){
      const v=xMin+(xMax-xMin)*i/4, xx=x(v);
      body+='<line class="gridline" x1="'+R(xx)+'" y1="'+P.t+'" x2="'+R(xx)+'" y2="'+(H-P.b)+'"/>';
      body+='<text x="'+R(xx)+'" y="'+(H-12)+'" text-anchor="middle">'+(cfg.xFmt?cfg.xFmt(v):fmt.compact(v))+'</text>';
    }
    if(cfg.quadrant){
      const q=cfg.quadrant;
      const qx=x(q.x), qy=y(q.y);
      body+='<line x1="'+R(qx)+'" y1="'+P.t+'" x2="'+R(qx)+'" y2="'+(H-P.b)+'" stroke="rgba(56,225,255,.2)" stroke-dasharray="4 5"/>';
      body+='<line x1="'+P.l+'" y1="'+R(qy)+'" x2="'+(W-P.r)+'" y2="'+R(qy)+'" stroke="rgba(56,225,255,.2)" stroke-dasharray="4 5"/>';
      (q.labels||[]).forEach(l=>{ body+='<text x="'+R(l.x)+'" y="'+R(l.y)+'" fill="rgba(120,144,168,.55)" font-size="9" letter-spacing="1">'+fmt.esc(l.text)+'</text>'; });
    }
    cfg.points.forEach(p=>{
      const rr=p.r||5;
      body+='<circle cx="'+R(x(p.x))+'" cy="'+R(y(p.y))+'" r="'+rr+'" fill="'+(p.color||'#38e1ff')+'" fill-opacity=".22" stroke="'+(p.color||'#38e1ff')+'" stroke-width="1.3"><title>'+fmt.esc(p.label+' · x:'+p.x+' y:'+p.y)+'</title></circle>';
      if(p.showLabel) body+='<text x="'+R(x(p.x)+rr+4)+'" y="'+R(y(p.y)+3)+'" fill="#b6c9dc" font-size="8">'+fmt.esc(p.short||p.label)+'</text>';
    });
    body+='<text x="'+(W/2)+'" y="'+(H-1)+'" text-anchor="middle" fill="#7890a8" font-size="8">'+fmt.esc(cfg.xLabel||'')+'</text>';
    body+='<text x="12" y="'+(H/2)+'" text-anchor="middle" fill="#7890a8" font-size="8" transform="rotate(-90 12 '+(H/2)+')">'+fmt.esc(cfg.yLabel||'')+'</text>';
    return '<div class="chart"><svg viewBox="0 0 '+W+' '+H+'" role="img">'+body+'</svg>'
      +(cfg.legend?'<div class="chart-legend">'+cfg.legend.map(l=>'<span class="legend-item"><i class="legend-dot" style="background:'+l.color+'"></i>'+fmt.esc(l.name)+'</span>').join('')+'</div>':'')+'</div>';
  }

  function waterfall(cfg){
    const W=920,H=cfg.height||270,P={l:50,r:18,t:26,b:38};
    const items=cfg.items;
    let cum=0; const blocks=items.map(it=>{
      if(it.type==='total'||it.type==='start'){
        const start=it.type==='start'?0:0; const end=it.value; cum=it.value;
        return {start:0,end:it.value,raw:it.value,color:it.color||'#38e1ff',label:it.label,type:it.type};
      }
      const start=cum; const end=cum+it.value; cum=end;
      return {start:Math.min(start,end),end:Math.max(start,end),raw:it.value,color:it.color||(it.value<0?'#ff6b8a':'#2ee6a8'),label:it.label,type:'step'};
    });
    const max=Math.max.apply(null,blocks.map(b=>Math.max(b.start,b.end)).concat([1]));
    const min=Math.min.apply(null,blocks.map(b=>Math.min(b.start,b.end)).concat([0]));
    const yMax=niceMax(max), yMin=min<0?-niceMax(Math.abs(min)):0;
    const y=v=>P.t+(H-P.t-P.b)*(1-(v-yMin)/((yMax-yMin)||1));
    const n=items.length, band=(W-P.l-P.r)/n, bw=Math.min(66,band*.58);
    let body='';
    for(let i=0;i<=4;i++){
      const v=yMin+(yMax-yMin)*i/4, yy=y(v);
      body+='<line class="'+(i===0?'axis':'gridline')+'" x1="'+P.l+'" y1="'+R(yy)+'" x2="'+(W-P.r)+'" y2="'+R(yy)+'"/>';
      body+='<text x="'+(P.l-6)+'" y="'+(R(yy)+3)+'" text-anchor="end">'+fmt.esc(cfg.yFmt?cfg.yFmt(v):('$'+v.toFixed(0)))+'</text>';
    }
    blocks.forEach((b,i)=>{
      const cx=P.l+band*(i+0.5);
      const top=y(b.end), bottom=y(b.start), h=Math.max(1,bottom-top);
      const fill=b.type==='total'?'#38e1ff':(b.type==='start'?'#4f8cff':(b.raw<0?'#ff6b8a':'#2ee6a8'));
      body+='<rect x="'+R(cx-bw/2)+'" y="'+R(top)+'" width="'+R(bw)+'" height="'+R(h)+'" rx="2" fill="'+fill+'" opacity=".8"><title>'+fmt.esc(b.label+': '+(b.raw>0&&b.type==='step'?'+':'')+b.raw)+'</title></rect>';
      body+='<text x="'+R(cx)+'" y="'+R(top-5)+'" text-anchor="middle" fill="'+(b.raw<0?'#ff9aae':'#b6c9dc')+'" font-size="8.5" font-family="Bahnschrift,sans-serif">'+(b.raw>0&&b.type==='step'?'+':'')+fmt.dec(b.raw,2)+'</text>';
      if(i<n-1){
        const yEnd=y(b.end);
        body+='<line x1="'+R(cx+bw/2)+'" y1="'+R(yEnd)+'" x2="'+R(P.l+band*(i+1.5)-bw/2)+'" y2="'+R(yEnd)+'" stroke="rgba(102,178,224,.25)" stroke-dasharray="2 3"/>';
      }
      body+='<text x="'+R(cx)+'" y="'+(H-14)+'" text-anchor="middle" fill="#7890a8" font-size="8">'+fmt.esc(b.label)+'</text>';
    });
    return '<div class="chart"><svg viewBox="0 0 '+W+' '+H+'" role="img">'+body+'</svg><div class="chart-note"><span>'+fmt.esc(cfg.xNote||'')+'</span><span>'+fmt.esc(cfg.yNote||'')+'</span></div></div>';
  }

  function heat(cfg){
    const palette=cfg.palette||'cyan';
    const cols=cfg.cols, rows=cfg.rows;
    const style='grid-template-columns:'+(cfg.rowWidth||116)+'px repeat('+cols.length+',minmax('+(cfg.min||42)+'px,1fr))';
    let html='<div class="hm"><div class="hm-grid" style="'+style+'">';
    html+='<div class="hm-corner">'+(cfg.corner||'')+'</div>';
    cols.forEach(c=>{ html+='<div class="hm-col">'+fmt.esc(c.label)+(c.sub?'<small>'+fmt.esc(c.sub)+'</small>':'')+'</div>'; });
    rows.forEach((row,ri)=>{
      html+='<div class="hm-row-h">'+fmt.esc(row.label)+(row.sub?' <small style="color:#526b83;font-family:var(--mono);font-size:7px;margin-left:4px">'+fmt.esc(row.sub)+'</small>':'')+'</div>';
      cols.forEach((c,ci)=>{
        const raw=(row.values||[])[ci];
        if(raw===null||raw===undefined){ html+='<div class="hm-cell" style="color:#3f586f">—</div>'; return; }
        const v=Number(raw);
        const t=Math.max(0,Math.min(1,(v-(cfg.minValue||0))/(((cfg.maxValue!==undefined?cfg.maxValue:100)-(cfg.minValue||0))||1)));
        let color;
        if(palette==='mint') color='rgba(46,230,168,'+(0.04+0.36*t)+')';
        else if(palette==='risk') color='rgba(255,107,138,'+(0.04+0.4*t)+')';
        else if(palette==='violet') color='rgba(167,139,250,'+(0.04+0.36*t)+')';
        else if(palette==='mixed') color=v>=0?'rgba(46,230,168,'+(0.04+0.38*t)+')':'rgba(255,107,138,'+(0.04+0.38*(1-t))+')';
        else color='rgba(56,225,255,'+(0.035+0.32*t)+')';
        const txt=cfg.fmt?cfg.fmt(v):v;
        const title=(row.label||'')+' · '+(c.label||'')+'：'+(cfg.tipFmt?cfg.tipFmt(v):txt);
        html+='<div class="hm-cell" style="background:'+color+';color:rgba(230,243,255,'+(0.62+0.38*t)+')" title="'+fmt.esc(title)+'">'+txt+'</div>';
      });
    });
    html+='</div>'+(cfg.legend===false?'':'<div class="hm-legend">低 <span class="hm-scale">'+[0.08,.2,.34,.48,.62].map(a=>'<i style="background:rgba('+(palette==='risk'?'255,107,138':palette==='mint'?'46,230,168':palette==='violet'?'167,139,250':'56,225,255')+','+a+')"></i>').join('')+'</span> 高</div>')+'</div>';
    return html;
  }

  function legend(items){
    return '<div class="legend-box">'+items.map(i=>'<span><i style="background:'+i.color+'"></i>'+fmt.esc(i.name)+'</span>').join('')+'</div>';
  }

  CX.charts = {line,bars,comboBars,radar,donut,gauge,hbar,scatter,waterfall,heat,spark,legend};
  CX.spark = spark;

  /* ---------------- drawer / toast ---------------- */
  let beforeClose=null, lastFocus=null;
  function openDrawer(o){
    if(typeof beforeClose==='function' && beforeClose()===false) return false;
    lastFocus=document.activeElement;
    beforeClose=null;
    const d=$('#drawer');
    if(typeof d.removeAttribute==='function') d.removeAttribute('inert');
    $('#drawerEyebrow').textContent=o.eyebrow||'DETAIL';
    $('#drawerTitle').textContent=o.title||'详情';
    $('#drawerBody').innerHTML=o.body||'';
    d.classList.add('open'); d.setAttribute('aria-hidden','false'); d.setAttribute('aria-modal','true');
    d.setAttribute('aria-label',o.title||'详情面板');
    $('#drawerScrim').classList.add('open');
    document.body.style.overflow='hidden';
    if(o.after) o.after($('#drawerBody'));
    return true;
  }
  function closeDrawer(force){
    if(!force && typeof beforeClose==='function'){
      let ok=true;
      try{ ok=beforeClose(); }catch(e){ ok=true; }
      if(ok===false) return false;
    }
    beforeClose=null;
    if(CX._histTimer){ clearInterval(CX._histTimer); CX._histTimer=null; }
    const d=$('#drawer');
    d.classList.remove('open'); d.setAttribute('aria-hidden','true'); d.setAttribute('inert','');
    $('#drawerScrim').classList.remove('open');
    document.body.style.overflow='';
    var target=(lastFocus && lastFocus!==document.body && (!document.contains || document.contains(lastFocus)))?lastFocus:$('#view');
    if(target && typeof target.focus==='function'){ try{ target.focus(); }catch(e){} }
    lastFocus=null;
    return true;
  }
  CX.openDrawer=openDrawer; CX.closeDrawer=closeDrawer;
  CX.setDrawerGuard=function(fn){ beforeClose=fn; };

  function toast(msg,type){
    const w=$('#toastWrap');
    const el=document.createElement('div');
    el.className='toast '+(type||'');
    el.innerHTML=msg;
    w.appendChild(el);
    setTimeout(()=>{ el.classList.add('out'); setTimeout(()=>el.remove(),260); },2600);
  }
  CX.toast=toast;

  function copy(text,onFail){
    const done=()=>toast('已复制到剪贴板','ok');
    const fail=()=>{
      toast('复制失败：浏览器拒绝了剪贴板权限'+(onFail?' · 已选中文本，按 Ctrl+C':''),'warn');
      if(onFail){ try{ onFail(); }catch(e){} }
    };
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done).catch(()=>fallback()); }
    else fallback();
    function fallback(){
      const ta=document.createElement('textarea'); ta.value=text;
      ta.style.cssText='position:fixed;left:-9999px;top:0';
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0,text.length);
      let ok=false;
      try{ ok=document.execCommand('copy'); }catch(e){ ok=false; }
      ta.remove();
      if(ok) done(); else fail();
    }
  }
  CX.copy=copy;

  /* ---------------- persistence / export / report state ---------------- */
  function saveConfig(){
    try{
      localStorage.setItem('nexus.config.v1', JSON.stringify({
        asins:CX.state.asins,
        benchmark:CX.state.benchmark,
        ideal:CX.state.ideal,
        modules:CX.state.modules,
        profit:CX.state.profit,
        mode:CX.state.mode,
        projectId:CX.state.projectId,
        projectName:CX.state.projectName,
        included:CX.state.included,
        fto:CX.state.fto,
        locked:CX.state.locked,
        lastRun:CX.state.lastRun,
        analysis:CX.state.analysis,
        analysisWindow:CX.state.analysisWindow,
        flowRange:CX.state.flowRange
      }));
      CX.state.savedAt=new Date().toISOString();
    }catch(e){}
    if(typeof projectTouch==='function') projectTouch();
  }
  CX.saveConfig=saveConfig;

  function exportCSV(name, rows){
    const esc=v=>{ const s=String(v===null||v===undefined?'':v); return /[",\n\r]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; };
    const csv='\ufeff'+rows.map(r=>r.map(esc).join(',')).join('\r\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=name; a.style.display='none';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>{ try{ URL.revokeObjectURL(url); }catch(e){} },1500);
    toast('已导出 '+name,'ok');
  }
  CX.exportCSV=exportCSV;

  function exportText(name, text, mime){
    const blob=new Blob([text],{type:mime||'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=name; a.style.display='none';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>{ try{ URL.revokeObjectURL(url); }catch(e){} },1500);
    toast('已生成 '+name,'ok');
  }
  CX.exportText=exportText;

  function addToReport(id,label){
    CX.state.included[id]=true;
    saveConfig();
    const n=Object.keys(CX.state.included).length;
    toast((label||id)+' 已加入报告 · 当前共 '+n+' 个板块','ok');
    document.querySelectorAll('[data-report="'+id+'"]').forEach(b=>{
      b.classList.add('added'); b.textContent='已加入报告'; b.disabled=true;
    });
  }
  CX.addToReport=addToReport;
  CX.reportCount=()=>Object.keys(CX.state.included||{}).length;

  /* ---------------- project history ---------------- */
  const HIST_KEY='nexus.projects.v1';
  function histList(){ try{ return JSON.parse(localStorage.getItem(HIST_KEY)||'[]'); }catch(e){ return []; } }
  function histSave(list){
    try{
      var curId=CX.state&&CX.state.projectId;
      if(curId){
        var idx=list.findIndex(function(p){ return p.id===curId; });
        if(idx>=30){ var cur=list[idx]; list=list.slice(0,29); list.push(cur); }
      }
      localStorage.setItem(HIST_KEY, JSON.stringify(list.slice(0,30)));
    }catch(e){}
  }
  function idleAnalysis(){
    return {status:'idle',step:0,total:0,steps:[],startedAt:null,finishedAt:null,projectId:null};
  }
  function normalizeAnalysis(rec,id){
    var a=Object.assign(idleAnalysis(),rec||{});
    a.steps=Array.isArray(a.steps)?a.steps.slice():[];
    if(a.status==='running') a.status='interrupted';
    a.projectId=id||a.projectId||null;
    return a;
  }
  function analysisForCurrent(){
    var a=CX.state.analysis||{};
    if(a.projectId && a.projectId!==CX.state.projectId) return idleAnalysis();
    return Object.assign({},a);
  }
  function stampOf(iso){ const d=new Date(iso); const p=n=>String(n).padStart(2,'0'); return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes()); }
  function projData(){
    const pr=CX.profit?CX.profit.calc():null;
    return {
      asins:CX.state.asins.slice(),
      benchmark:CX.state.benchmark,
      ideal:CX.state.ideal,
      modules:Object.assign({},CX.state.modules),
      profit:Object.assign({},CX.state.profit),
      included:Object.assign({},CX.state.included),
      fto:Array.isArray(CX.state.fto)?CX.state.fto.slice():[],
      locked:!!CX.state.locked,
      analysisWindow:normalizeWindow(CX.state.analysisWindow),
      flowRange:CX.state.flowRange,
      mode:CX.state.mode,
      analysis:analysisForCurrent(),
      margin:pr?Number(pr.margin.toFixed(1)):null,
      score:(CX.opportunity&&CX.opportunity.score)?CX.opportunity.score():null
    };
  }
  function projectCreate(name){
    const list=histList();
    const rec=Object.assign({id:'P'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:name||'未命名项目',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},projData());
    list.unshift(rec); histSave(list);
    CX.state.projectId=rec.id; CX.state.projectName=rec.name;
    return rec;
  }
  function projectUpdate(name){
    if(!CX.state.projectId) return projectCreate(name);
    const list=histList();
    const i=list.findIndex(function(p){ return p.id===CX.state.projectId; });
    if(i<0) return projectCreate(name);
    const rec=Object.assign({},list[i],projData(),{name:name||list[i].name,updatedAt:new Date().toISOString()});
    list[i]=rec; histSave(list);
    CX.state.projectName=rec.name;
    return rec;
  }
  function projectRename(id,name){
    const list=histList();
    const it=list.find(function(p){ return p.id===id; });
    if(!it) return;
    it.name=name; it.updatedAt=new Date().toISOString();
    histSave(list);
    if(CX.state.projectId===id) CX.state.projectName=name;
  }
  function projectDelete(id){
    histSave(histList().filter(function(p){ return p.id!==id; }));
    if(CX.state.projectId===id){
      var a=CX.state.analysis;
      if(a && a.status==='running') a.cancelled=true;
      CX.state.running=false;
      CX.state.analysis=idleAnalysis();
      CX.state.projectId=null; CX.state.projectName='未命名项目'; CX.state.analysisWindow=presetWindow('last12'); CX.state.flowRange=8;
      saveConfig();
    }
  }
  function projectLoad(it){
    var prev=CX.state.analysis||{};
    var wasRunning=prev.status==='running';
    if(wasRunning){
      prev.cancelled=true;
      prev.status='idle'; prev.step=0; prev.total=0; prev.steps=[]; prev.finishedAt=null;
      CX.state.running=false;
      saveConfig();
    }
    CX.state.asins=(it.asins||[]).slice();
    var asins=(it.asins||[]).map(function(a){ return String(a).toUpperCase(); }).filter(function(a){ return /^B0[A-Z0-9]{8}$/.test(a); }).slice(0,5);
    CX.state.asins=asins.length?asins:(META.asins||[]).map(function(a){ return a.asin; });
    var benchOk=it.benchmark&&/^B0[A-Z0-9]{8}$/.test(String(it.benchmark).toUpperCase());
    CX.state.benchmark=benchOk?String(it.benchmark).toUpperCase():'';
    CX.state.listingBench=CX.state.benchmark;
    CX.state.modules=Object.assign({},it.modules);
    CX.state.profit=Object.assign({price:39.99,returnRate:12.8,source:0,coupon:10},it.profit||{});
    CX.state.included=Object.assign({},it.included||{});
    CX.state.fto=Array.isArray(it.fto)?it.fto.slice():[];
    CX.state.locked=!!it.locked;
    CX.state.analysisWindow=normalizeWindow(it.analysisWindow);
    CX.state.flowRange=it.flowRange===4?4:8;
    CX.state.mode=it.mode||'custom';
    CX.state.projectId=it.id;
    CX.state.projectName=it.name;
    CX.state.analysis=normalizeAnalysis(it.analysis,it.id);
    CX.state.running=false;
    CX.state.lastRun=CX.state.analysis.status==='done'?CX.state.analysis.finishedAt:null;
    saveConfig(); CX.refreshTopbar(); closeDrawer(); CX.rerender();
    toast('已载入项目：'+fmt.esc(it.name)+(wasRunning?'（已停止原分析）':''),'ok');
  }
  function projectTouch(){
    if(!CX.state.projectId) return;
    const list=histList();
    const i=list.findIndex(function(p){ return p.id===CX.state.projectId; });
    if(i<0) return;
    list[i]=Object.assign({},list[i],projData(),{updatedAt:new Date().toISOString()});
    histSave(list);
  }
  function modeName(m){ return m==='exec'?'执行层':m==='core'?'分析层':m==='full'?'全流程':'自定义'; }
  function openHistory(){
    if(CX._histTimer){ clearInterval(CX._histTimer); CX._histTimer=null; }
    const list=histList();
    const body='<div class="config-section"><div class="config-label"><b>当前项目</b><em id="histNow">'+fmt.esc(CX.state.projectName||'未命名项目')+'</em></div>'
      +'<div class="mini-note">这里可以载入、改名、删除；新建项目用下面按钮。</div></div>'
      +'<div class="config-section"><div class="config-label"><b>历史项目</b><em id="histCount">'+list.length+' 个</em></div>'
      +'<div style="display:flex;gap:6px;margin-bottom:8px"><input class="input" id="histSearch" placeholder="搜索项目名 / ASIN / 对标" style="flex:1;height:28px">'
      +'<select class="select" id="histMode" style="width:96px;height:28px"><option value="all">全部范围</option><option value="full">全流程</option><option value="exec">执行层</option><option value="core">分析层</option><option value="custom">自定义</option></select></div>'
      +'<div id="histList"></div></div>'
      +'<button class="btn btn-sm" id="histNew" style="width:100%">+ 新建项目</button>'
      +'<div class="mini-note" style="text-align:center">会打开新建项目；创建后才写入历史，不会动当前项目。</div>';
    openDrawer({eyebrow:'PROJECTS',title:'历史项目',body:body,after:function(bd){
      var state={q:'',m:'all',edit:null};
      function rows(){
        var arr=histList().filter(function(it){
          if(state.m!=='all' && (it.mode||'custom')!==state.m) return false;
          if(!state.q) return true;
          var hay=[it.name,it.benchmark,(it.asins||[]).join(' ')].join(' ').toLowerCase();
          return hay.indexOf(state.q.toLowerCase())>=0;
        });
        if(!arr.length) return '<div class="mini-note">没有匹配的项目。</div>';
        return arr.map(function(it){
          var cur=it.id===CX.state.projectId;
          var nm=state.edit===it.id
            ? '<span style="display:flex;gap:4px;flex:1"><input class="input" id="renameIn" maxlength="40" value="'+fmt.esc(it.name)+'" style="height:24px;flex:1"><button class="btn btn-sm" data-save-ren="'+it.id+'">保存</button></span>'
            : '<span class="hist-name" style="font-size:12px;color:var(--txt)">'+fmt.esc(it.name)+'</span>'+(cur?' <span class="chip chip-cyan" style="font-size:8px">当前</span>':'');
          var a=it.analysis||{};
          var prog = a.status==='running'
            ? '<div class="meter" style="margin-top:5px"><i style="width:'+Math.round((a.step||0)/(a.total||1)*100)+'%"></i></div><div class="mini-note">分析中 '+(a.step||0)+' / '+(a.total||0)+'</div>'
            : a.status==='done'
              ? '<div class="mini-note c-mint">分析完成 · '+stampOf(a.finishedAt||it.updatedAt)+'</div>'
              : a.status==='interrupted'
                ? '<div class="mini-note c-amber">上次中断 · 可重新开始</div>'
                : '<div class="mini-note">未分析</div>';
          return '<div class="hist-row" data-row="'+it.id+'" style="display:flex;align-items:flex-start;gap:6px;padding:9px 0;border-bottom:1px solid var(--line)">'
            +'<div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:5px">'+nm+'</div>'
            +'<div class="mini-note" style="margin-top:2px">'+stampOf(it.updatedAt||it.at||it.createdAt)+' · '+modeName(it.mode||'custom')+' · 窗口 '+(it.analysisWindow?CX.windowShort(it.analysisWindow):'12 周（默认）')+' · '+(it.asins||[]).length+' ASIN · '+fmt.esc(it.benchmark||'')+' · 毛利 '+(it.margin==null?'—':it.margin+'%')+'</div>'
            +prog+'</div>'
            +'<button class="btn btn-sm" data-hist-load="'+it.id+'">载入</button>'
            +'<button class="btn btn-sm" data-hist-ren="'+it.id+'">改名</button>'
            +'<button class="btn btn-sm" data-hist-del="'+it.id+'" style="color:var(--rose)">删除</button></div>';
        }).join('');
      }
      function draw(){
        var listEl=bd.querySelector('#histList'); if(!listEl) return;
        listEl.innerHTML=rows();
        var cnt=bd.querySelector('#histCount'); if(cnt) cnt.textContent=histList().length+' 个';
        var r=bd.querySelector('#renameIn');
        if(r){ r.focus(); r.select(); r.addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); saveRename(); } }); }
      }
      function saveRename(){
        var inp=bd.querySelector('#renameIn'); if(!inp) return;
        var id=state.edit; var nm=inp.value.trim();
        if(!id){ state.edit=null; draw(); return; }
        if(!nm){ toast('项目名不能为空','warn'); inp.focus(); return; }
        if(nm.length>40){ toast('项目名最多 40 字','warn'); inp.focus(); return; }
        var dup=histList().some(function(p){ return p.id!==id && String(p.name||'').trim().toLowerCase()===nm.toLowerCase(); });
        if(dup){ toast('已有同名项目，换一个名字','warn'); inp.focus(); return; }
        projectRename(id,nm);
        var now=bd.querySelector('#histNow'); if(now && CX.state.projectId===id) now.textContent=nm;
        if(CX.state.projectId===id) CX.refreshTopbar();
        toast('已改名','ok');
        state.edit=null; draw();
      }
      bd.querySelector('#histSearch').addEventListener('input',function(e){ state.q=e.target.value.trim(); draw(); });
      bd.querySelector('#histMode').addEventListener('change',function(e){ state.m=e.target.value; draw(); });
      bd.querySelector('#histNew').addEventListener('click',function(){ closeDrawer(); buildConfig(); });
      bd.querySelector('#histList').addEventListener('click',function(e){
        var b=e.target.closest('button'); if(!b) return;
        if(b.dataset.histLoad){ var it=histList().find(function(x){return x.id===b.dataset.histLoad;}); if(it) projectLoad(it); }
        else if(b.dataset.histRen){ state.edit=b.dataset.histRen; draw(); }
        else if(b.dataset.histDel){ if(confirm('删除这个项目？删除后不可恢复。')){ projectDelete(b.dataset.histDel); CX.refreshTopbar(); draw(); toast('已删除','ok'); } }
        else if(b.dataset.saveRen){ saveRename(); }
      });
      draw();
      var lastKey='';
      var timer=setInterval(function(){
        var d=document.getElementById('drawer');
        if(!d||!d.classList.contains('open')||!bd.querySelector('#histList')){ if(CX._histTimer===timer) CX._histTimer=null; clearInterval(timer); return; }
        var a=CX.state.analysis||{};
        var key=(a.status||'')+':'+(a.step||0)+':'+(CX.state.projectId||'')+':'+histList().length;
        if(key===lastKey) return;
        lastKey=key;
        if(!state.edit) draw();
      },900);
      CX._histTimer=timer;
    }});
  }
  CX.projects={list:histList,create:projectCreate,update:projectUpdate,rename:projectRename,delete:projectDelete,load:projectLoad,current:function(){ return CX.state.projectId; }};
  CX.openHistory=openHistory;

  /* ---------------- config drawer ---------------- */
  const EXEC_IDS=['listing','promotion','flow'];
  const CORE_IDS=['market','params','voc','profit','compliance','opportunity'];

  function configSection(id,title,hint,body,step){
    return '<section class="config-section" id="cfg-'+id+'" tabindex="-1">'
      +'<div class="config-label">'+(step?'<span class="cfg-step">'+step+'</span>':'')+'<b>'+title+'</b>'+(hint?'<em>'+hint+'</em>':'')+'</div>'
      +body+'</section>';
  }
  function moduleChecks(){
    return MODULES.map(function(m){
      var fixed=m.id==='report';
      var on=true;
      return '<label class="config-mod'+(on?' on':'')+'" data-mod="'+m.id+'"'+(fixed?' style="opacity:.72"':'')+'>'
        +'<input type="checkbox" class="mod-check" value="'+m.id+'" '+(on?'checked':'')+(fixed?' disabled':'')+'>'
        +'<span class="cm-box"></span>'
        +'<span class="cm-txt"><b>'+m.code+' · '+m.name+'</b><small>'+(fixed?'汇总全部结果 · 可导出':m.hint)+'</small></span>'
        +(fixed?'<span class="chip chip-cyan">必选</span>':'<span class="chip chip-dim">可选</span>')
        +'</label>';
    }).join('');
  }
  function focusConfig(key){
    var sec=$('#cfg-'+key); if(!sec) return;
    if(key==='ideal' && sec.hidden){ toast('执行层模式不需要选品想法，切回全流程或分析层再填','warn'); key='scope'; sec=$('#cfg-scope'); if(!sec) return; }
    sec.classList.add('flash');
    setTimeout(function(){ sec.classList.remove('flash'); },1500);
    try{ sec.scrollIntoView({block:'center',behavior:'smooth'}); }catch(e){}
    var target=key==='asins'?$('#asinInput'):key==='ideal'?$('#idealInput'):key==='name'?$('#projName'):key==='bench'?($('#benchCustom')||sec):sec;
    if(target && (target.disabled || (target.closest && target.closest('[hidden]')) || !target.offsetParent)) target=sec;
    setTimeout(function(){ try{ if(target&&target.focus) target.focus({preventScroll:true}); }catch(e){} },90);
  }

  function buildConfig(focusKey){
    var st=CX.state;
    var draft={mode:'full', window:presetWindow('last12')};
    var asinChips='';
    var benchAsins='';
    var custom=true;
    var newBanner='<div class="config-banner" id="newBanner"><b class="cfg-ico" aria-hidden="true">＋</b><span id="projState"></span></div>';
    var nameRow='<div class="name-row"><input class="input" id="projName" maxlength="40" autocomplete="off" aria-label="项目名称" aria-describedby="errName projState" placeholder="例如：大码亨利 · 首轮分析" value=""></div>'
      +'<div class="field-err" id="errName" role="alert"></div>'
      +'<div class="mini-note" style="display:flex;justify-content:space-between;gap:8px"><span>项目名只用于历史列表和顶栏</span><span id="nameCount">0 / 40</span></div>';
    var modeBtns=['full','exec','core'].map(function(m){
      var label=m==='full'?'全流程':m==='exec'?'只做执行层':'只做分析层';
      var sub=m==='full'?'01–06 + 07 / 08 / 08F':m==='exec'?'07 / 08 / 08F · 需要对标':'01–06 · 不需要对标';
      return '<button type="button" class="mode-btn'+(draft.mode===m?' on':'')+'" data-mode="'+m+'"><b>'+label+'</b><small>'+sub+'</small></button>';
    }).join('');
    var winBtns=[['last4','近 4 周'],['last8','近 8 周'],['last12','近 12 周'],['lifecycle','上架至今'],['custom','自定义']].map(function(p){
      return '<button type="button" class="window-btn'+(draft.window.preset===p[0]?' on':'')+'" data-window="'+p[0]+'">'+p[1]+'</button>';
    }).join('');
    var winBody='<div class="window-grid" id="windowGrid">'+winBtns+'</div>'
      +'<div class="date-range" id="windowCustom" hidden><label>开始 <input type="date" class="input" id="winStart" min="'+DEMO_START+'" max="'+DEMO_END+'" value="'+draft.window.start+'"></label><span>至</span><label>结束 <input type="date" class="input" id="winEnd" min="'+DEMO_START+'" max="'+DEMO_END+'" value="'+draft.window.end+'"></label></div>'
      +'<div class="field-err" id="errWindow" role="alert"></div>'
      +'<div class="window-summary" id="windowSummary"></div>'
      +'<div class="mini-note">当前演示数据覆盖 '+DEMO_START+' 至 '+DEMO_END+'；接入数据接口后按所选窗口返回真实历史。</div>';
    var html='<form id="configForm" novalidate>'
      +newBanner
      +configSection('name','项目名称','必填 · 40 字以内',nameRow,'01')
      +configSection('scope','分析范围','三选一，下面还能改',
        '<div class="mode-grid" id="modeGrid">'+modeBtns+'</div>'
        +'<div class="mini-note" id="modeSummary"></div>'
        +'<div class="mini-note" id="modeIdeaNote" hidden>只做执行层不需要选品想法，切回全流程或分析层再填。</div>'
        +'<div class="mini-note">切换范围会重设下面的板块勾选；手动改勾选后，范围记为自定义。</div>','02')
      +configSection('window','分析窗口','本次分析共用的时间范围',winBody,'03')
      +configSection('asins','输入 ASIN','1–5 个 · 本次分析对象',
        '<div class="asin-chips" id="asinChips">'+asinChips+'</div>'
        +'<div class="asin-empty" id="asinEmpty">还没有 ASIN，先添加 1–5 个。</div>'
        +'<div class="asin-add"><input class="input" id="asinInput" maxlength="120" autocomplete="off" aria-label="输入 ASIN" placeholder="粘贴 ASIN，可一次贴多个"><button type="button" class="btn btn-sm" id="asinAdd">添加</button></div>'
        +'<div class="field-err" id="errAsin" role="alert"></div>'
        +'<div class="mini-note"><span id="asinCount">0 / 5</span> · 这批 ASIN 是本次分析对象；07 / 08 / 08F 的对标从这里选。</div>','04')
      +configSection('ideal','选品想法','可选 · 会进入机会判断',
        '<textarea class="textarea" id="idealInput" maxlength="500" rows="3" aria-label="选品想法" placeholder="例如：3XL–5XL 真码、加长下摆、200g 精梳棉…"></textarea>'
        +'<div class="mini-note"><span id="idealCount">0 / 500</span> · 这段描述会进入 06 的切入策略，不参与市场数据计算。</div>','05')
      +configSection('modules','分析板块','至少 1 个 · R 固定包含',
        '<div class="config-mods" id="modGrid">'+moduleChecks()+'</div>'
        +'<div class="field-err" id="errModules" role="alert"></div>'
        +'<div class="mini-note">关掉的板块不会出现在导航、报告和后台分析里。R 决策报告固定包含，不能关。</div>','06')
      +configSection('bench','对标 ASIN','07 / 08 / 08F 用',
        '<div id="benchWrap"><div class="bench-list">'+benchAsins
          +'<label class="bench-opt"><input type="radio" name="bench" value="__custom" '+(custom?'checked':'')+'><span>手动指定</span><input class="input" id="benchCustom" maxlength="10" aria-label="手动指定对标 ASIN" style="height:24px;width:120px;margin-left:4px" value="" placeholder="B0XXXXXXXX" '+(custom?'':'disabled')+'></label>'
        +'</div><div class="field-err" id="errBench" role="alert"></div>'
        +'<div class="mini-note">07 / 08 / 08F 都按这个 ASIN 展开；先从输入 ASIN 选，或手动填 B0…，保存前必须有有效对标。</div></div>'
        +'<div class="mini-note" id="benchOff" hidden>当前没有勾选 07 / 08 / 08F，不需要对标 ASIN。</div>','07')
      +'<div class="config-summary" id="cfgSummary" role="status" aria-live="polite"></div>'
      +'<div class="config-actions">'
        +'<div class="config-action-note" id="actionHint">创建项目只保存；创建并分析会立即开始，进度在「历史项目」里看。</div>'
        +'<button type="submit" class="btn" id="cfgSave">创建项目</button>'
        +'<button type="button" class="btn btn-primary" id="cfgRun">创建并分析</button>'
        +'<button type="button" class="btn btn-ghost" id="cfgCancel">取消</button>'
      +'</div>'
      +'</form>';
    if(!openDrawer({eyebrow:'NEW PROJECT',title:'新建项目',body:html,after:function(){ bindConfig(draft,focusKey); }})) return;
    if(focusKey){
      setTimeout(function(){ focusConfig(focusKey); },90);
    }else{
      setTimeout(function(){ var n=$('#projName'); if(n){ n.focus(); } },80);
    }
  }

  function bindConfig(draft,focusKey){
    var body=$('#drawerBody');
    var chips=$('#asinChips');
    var form=$('#configForm');
    var dirty=false, saving=false, firstError=null;

    function val(sel){ var el=$(sel); return el?el.value:''; }
    function asinValues(){ return $$('.asin-chip',chips).map(function(c){ return c.dataset.asin; }); }
    function checkedMods(){
      var out={};
      $$('.mod-check',form).forEach(function(c){ out[c.value]=c.checked; });
      MODULES.forEach(function(m){ if(m.id==='report') out[m.id]=true; });
      return out;
    }
    function markDirty(){ dirty=true; }
    function updateNameCount(){ var el=$('#nameCount'); if(el){ el.textContent=(val('#projName')||'').length+' / 40'; } }
    function updateIdealCount(){ var el=$('#idealCount'); if(el){ el.textContent=(val('#idealInput')||'').length+' / 500'; } }
    function windowDraft(){
      return {preset:draft.window.preset,start:draft.window.start,end:draft.window.end};
    }
    function updateWindowUI(){
      var w=windowDraft();
      $$('.window-btn',form).forEach(function(b){ b.classList.toggle('on',b.dataset.window===w.preset); });
      var custom=$('#windowCustom'); if(custom) custom.hidden=w.preset!=='custom';
      var si=$('#winStart'), ei=$('#winEnd');
      if(si && w.start) si.value=w.start;
      if(ei && w.end) ei.value=w.end;
      var sum=$('#windowSummary');
      if(sum){
        var err=(w.preset==='custom' && (!w.start||!w.end))?{msg:'请选择开始和结束日期'}:(w.preset==='custom'?windowError(w):null);
        if(err) sum.innerHTML='<span class="c-amber">'+fmt.esc(err.msg)+'</span>';
        else sum.innerHTML='分析窗口：<b>'+windowLabel(w)+'</b>'+(w.preset==='lifecycle'?' · 演示可观测范围':'');
      }
      updateSummary();
    }
    function setWindow(preset){
      if(preset==='custom') draft.window={preset:'custom',start:val('#winStart')||DEMO_START,end:val('#winEnd')||DEMO_END};
      else draft.window=presetWindow(preset);
      clearErr('Window',$('#winStart')); clearErr('Window',$('#winEnd'));
      updateWindowUI(); markDirty();
    }
    function updateAsinMeta(){
      var n=$$('.asin-chip',chips).length;
      var cnt=$('#asinCount'); if(cnt) cnt.textContent=n+' / 5';
      var empty=$('#asinEmpty'); if(empty) empty.hidden=n>0;
      var add=$('#asinAdd'); if(add) add.disabled=n>=5;
      var inp=$('#asinInput'); if(inp) inp.placeholder=n>=5?'已达 5 个上限，先删一个':'粘贴 ASIN，可一次贴多个';
    }
    function showErr(id,msg,el){
      var box=$('#err'+id);
      if(box){ box.textContent=msg; box.classList.add('show'); }
      if(el){ el.classList.add('invalid'); el.setAttribute('aria-invalid','true'); if(!firstError) firstError=el; }
    }
    function clearErr(id,el){
      var box=$('#err'+id);
      if(box){ box.textContent=''; box.classList.remove('show'); }
      if(el){ el.classList.remove('invalid'); el.removeAttribute('aria-invalid'); }
    }
    function clearAll(){
      ['Name','Asin','Modules','Bench','Window'].forEach(function(k){ clearErr(k); });
      $$('.invalid',form).forEach(function(el){ el.classList.remove('invalid'); el.removeAttribute('aria-invalid'); });
      firstError=null;
    }
    function setChecks(map){
      $$('.mod-check',form).forEach(function(c){
        if(c.value==='report') return;
        c.checked=!!map[c.value];
        var lab=c.closest('.config-mod'); if(lab) lab.classList.toggle('on',c.checked);
      });
    }
    function updateSummary(){
      var map=checkedMods();
      var sel=MODULES.filter(function(m){ return m.id!=='report'&&map[m.id]; });
      var codes={market:'01',params:'02',voc:'03',profit:'04',compliance:'05',opportunity:'06',listing:'07',promotion:'08',flow:'08F'};
      var label=draft.mode==='custom'?'自定义':modeName(draft.mode);
      var el=$('#modeSummary');
      if(el){
        if(!sel.length){ el.innerHTML='范围：<b>'+label+'</b> · 还没选板块，至少选 1 个'; }
        else{ el.innerHTML='范围：<b>'+label+'</b> · 已选 '+sel.length+' 个板块 · '+sel.map(function(m){ return codes[m.id]; }).join(' / '); }
        el.classList.toggle('c-amber',!sel.length);
      }
      var sum=$('#cfgSummary');
      if(sum){
        var benchOn=EXEC_IDS.some(function(id){ return !!map[id]; });
        var bench='';
        if(benchOn){
          var picked=$('input[name=bench]:checked',body);
          bench=picked?(picked.value==='__custom'?(val('#benchCustom')||'').trim().toUpperCase():picked.value):'';
        }
        var asinTxt=asinValues().length?asinValues().length+' 个 ASIN':'待添加 ASIN';
        var w=draft.window;
        var winTxt=(w.preset==='custom'&&windowError(w))?'窗口待选':'窗口 '+windowShort(w);
        sum.innerHTML='将创建：<b>'+label+'</b> · '+winTxt+' · '+sel.length+' 个板块 · '+asinTxt+(benchOn?(bench?' · 对标 '+fmt.esc(bench):' · 对标待填'):'');
      }
    }
    function updateProjState(){
      var el=$('#projState'); if(!el) return;
      el.textContent=CX.state.projectId
        ? '当前项目「'+(CX.state.projectName||'未命名项目')+'」不会被修改；创建后才会写入历史项目。'
        : '创建后才会写入历史项目。';
      var save=$('#cfgSave');
      if(save) save.textContent='创建项目';
    }
    function updatePreview(){ updateSummary(); }
    function refreshBenchOptions(){
      var wrap=$('.bench-list',body); if(!wrap) return;
      var checked=$('input[name=bench]:checked',body);
      var current=checked?checked.value:'';
      var mas=asinValues();
      Array.prototype.slice.call(wrap.querySelectorAll('.bench-opt'),0,-1).forEach(function(el){ el.remove(); });
      var frag=document.createDocumentFragment();
      mas.forEach(function(a){
        var l=document.createElement('label'); l.className='bench-opt';
        l.innerHTML='<input type="radio" name="bench" value="'+a+'" '+(current===a?'checked':'')+'><span>输入 ASIN</span><b>'+a+'</b>';
        frag.appendChild(l);
      });
      wrap.insertBefore(frag,wrap.firstChild);
      var customRadio=$('input[name=bench][value="__custom"]',wrap);
      if(current && current!=='__custom' && mas.indexOf(current)<0){
        var first=mas[0];
        if(first){ var r=wrap.querySelector('input[name=bench][value="'+first+'"]'); if(r) r.checked=true; }
        else if(customRadio){ customRadio.checked=true; }
      }else if(!checked && customRadio && !customRadio.checked){
        if(mas[0]){ var r0=wrap.querySelector('input[name=bench][value="'+mas[0]+'"]'); if(r0) r0.checked=true; }
        else{ customRadio.checked=true; }
      }
      var now=$('input[name=bench]:checked',wrap);
      var customInp=$('#benchCustom');
      if(customInp && customRadio) customInp.disabled=!(now && now.value==='__custom');
    }
    function updateBenchVisibility(){
      var map=checkedMods();
      var on=EXEC_IDS.some(function(id){ return map[id]; });
      var wrap=$('#benchWrap'), off=$('#benchOff'), sec=$('#cfg-bench');
      if(wrap) wrap.hidden=!on;
      if(off) off.hidden=on;
      if(!on) clearErr('Bench',$('#benchCustom'));
      if(sec) sec.classList.toggle('is-off',!on);
      if(on && !$('input[name=bench]:checked',body)) refreshBenchOptions();
      var customInp=$('#benchCustom');
      var customRadio=$('input[name=bench][value="__custom"]',body);
      if(customInp && customRadio) customInp.disabled=!(customRadio.checked);
      updateIdeaVisibility();
    }
    function updateIdeaVisibility(){
      var map=checkedMods();
      var on=CORE_IDS.some(function(id){ return map[id]; });
      var sec=$('#cfg-ideal'); if(sec) sec.hidden=!on;
      var note=$('#modeIdeaNote');
      if(note){
        note.hidden=on;
        if(!on){
          var execOn=EXEC_IDS.some(function(id){ return map[id]; });
          note.textContent=execOn?'只做执行层不需要选品想法，切回全流程或分析层再填。':'当前没有分析板块；勾选 01–06 后再填选品想法。';
        }
      }
    }
    function applyMode(mode){
      var map={};
      MODULES.forEach(function(m){
        map[m.id]=mode==='exec'?EXEC_IDS.indexOf(m.id)>=0:mode==='core'?EXEC_IDS.indexOf(m.id)<0:true;
      });
      setChecks(map);
      draft.mode=mode;
      $$('.mode-btn',body).forEach(function(b){ b.classList.toggle('on',b.dataset.mode===mode); });
      clearErr('Modules');
      updateSummary(); updateBenchVisibility(); updatePreview(); markDirty();
    }
    function addAsins(){
      var input=$('#asinInput'); if(!input) return;
      var raw=input.value.trim();
      if(!raw){ showErr('Asin','先粘贴一个 ASIN',input); input.focus(); return; }
      var parts=raw.split(/[\s,，;；]+/).filter(Boolean);
      var current=asinValues();
      var added=0, bad=[], dup=[], overflow=0;
      for(var i=0;i<parts.length;i++){
        var v=parts[i].toUpperCase();
        if(current.indexOf(v)>=0){ if(dup.indexOf(v)<0) dup.push(v); continue; }
        if(!/^B0[A-Z0-9]{8}$/.test(v)){ if(bad.indexOf(v)<0) bad.push(v); continue; }
        if(current.length>=5){ overflow++; continue; }
        var sp=document.createElement('span'); sp.className='asin-chip'; sp.dataset.asin=v; sp.title=v;
        sp.innerHTML=v+'<button type="button" class="asin-del" aria-label="移除 '+v+'">×</button>';
        chips.appendChild(sp); current.push(v); added++;
      }
      var allOk=!bad.length&&!dup.length&&!overflow;
      if(added){
        if(allOk) input.value='';
        refreshBenchOptions(); updateAsinMeta(); updateBenchVisibility(); updatePreview(); markDirty();
      }
      if(bad.length) showErr('Asin','格式不对：'+bad.slice(0,3).join('、')+(bad.length>3?' 等':''),input);
      else if(overflow) showErr('Asin','最多 5 个 ASIN，'+overflow+' 个未加入',input);
      else if(dup.length) showErr('Asin','已在列表里：'+dup.slice(0,3).join('、'),input);
      else if(!added) showErr('Asin','最多 5 个 ASIN，先删一个',input);
      else clearErr('Asin',input);
      input.focus();
    }
    function haltAnalysis(){
      var a=CX.state.analysis;
      if(!a || a.status!=='running') return;
      a.cancelled=true; a.status='idle'; a.step=0; a.total=0; a.steps=[]; a.finishedAt=null;
      CX.state.running=false;
      saveConfig();
      if(CX.paintAnalysis) CX.paintAnalysis();
    }
    function save(run){
      if(saving) return false;
      clearAll();
      var pname=(val('#projName')||'').trim();
      var asins=asinValues();
      var mods=checkedMods();
      var execOn=EXEC_IDS.some(function(id){ return !!mods[id]; });
      var selected=$('input[name=bench]:checked',body);
      var bench=selected?selected.value:'';
      if(bench==='__custom') bench=(val('#benchCustom')||'').trim().toUpperCase();
      var benchOk=/^B0[A-Z0-9]{8}$/.test(bench);
      if(!pname){ showErr('Name','项目名称不能为空',$('#projName')); }
      else if(pname.length>40){ showErr('Name','项目名称最多 40 字',$('#projName')); }
      else{
        var dup=histList().some(function(p){ return String(p.name||'').trim().toLowerCase()===pname.toLowerCase(); });
        if(dup) showErr('Name','已有同名项目，换个名字，或先在历史项目里改名/删除。',$('#projName'));
      }
      if(!asins.length){ showErr('Asin','至少保留 1 个 ASIN',$('#asinInput')); }
      else{
        var bad=asins.filter(function(a){ return !/^B0[A-Z0-9]{8}$/.test(a); });
        if(bad.length) showErr('Asin','格式不对：'+bad.join('、'),$('#asinInput'));
      }
      var enabled=MODULES.filter(function(m){ return m.id!=='report'&&mods[m.id]; });
      if(!enabled.length) showErr('Modules','至少选 1 个分析板块',$('#cfg-modules'));
      if(execOn && !benchOk){
        var cr=$('input[name=bench][value="__custom"]',body); if(cr) cr.checked=true;
        var ci=$('#benchCustom'); if(ci) ci.disabled=false;
        showErr('Bench','07 / 08 / 08F 需要有效的对标 ASIN（B0 + 8 位字母数字）。',ci||$('#cfg-bench'));
      }
      if(draft.window.preset==='custom') draft.window={preset:'custom',start:val('#winStart'),end:val('#winEnd')};
      var winErr=windowError(draft.window);
      if(winErr) showErr('Window',winErr.msg,$(winErr.target)||$('#cfg-window'));
      if(firstError){
        try{ firstError.focus(); firstError.scrollIntoView({block:'center',behavior:'smooth'}); }catch(e){}
        return false;
      }
      var a=CX.state.analysis||{};
      if(a.status==='running'){
        var ok=confirm('分析正在进行（'+(a.step||0)+' / '+(a.total||0)+'）。创建新项目会停止当前分析；之后可以在总览重新开始。继续？');
        if(!ok) return false;
        haltAnalysis();
      }
      var idealNext=(val('#idealInput')||'').trim();
      var prev={
        projectId:CX.state.projectId, projectName:CX.state.projectName, analysis:CX.state.analysis,
        benchmark:CX.state.benchmark, listingBench:CX.state.listingBench,
        asins:CX.state.asins.slice(), modules:Object.assign({},CX.state.modules),
        ideal:CX.state.ideal, mode:CX.state.mode, analysisWindow:normalizeWindow(CX.state.analysisWindow),
        included:Object.assign({},CX.state.included), fto:(CX.state.fto||[]).slice(),
        locked:!!CX.state.locked, profit:Object.assign({},CX.state.profit),
        flowRange:CX.state.flowRange, lastRun:CX.state.lastRun, running:CX.state.running
      };
      var created=null;
      saving=true;
      try{
        CX.state.asins=asins.slice();
        CX.state.modules=mods;
        CX.state.ideal=idealNext;
        CX.state.mode=draft.mode;
        CX.state.analysisWindow=normalizeWindow(draft.window);
        CX.state.benchmark=benchOk?bench:'';
        CX.state.listingBench=CX.state.benchmark;
        CX.state.included={};
        CX.state.fto=[];
        CX.state.locked=false;
        CX.state.profit={price:39.99,returnRate:12.8,source:0,coupon:10};
        CX.state.flowRange=CX.state.analysisWindow.weeks<=4?4:8;
        CX.state.projectId=null;
        CX.state.analysis=idleAnalysis();
        CX.state.lastRun=null;
        CX.state.running=false;
        CX.state.projectName=pname;
        created=projectCreate(pname);
        if(CX.state.analysis) CX.state.analysis.projectId=CX.state.projectId;
        saveConfig();
      }catch(err){
        if(created) histSave(histList().filter(function(p){ return p.id!==created.id; }));
        CX.state.projectId=prev.projectId;
        CX.state.projectName=prev.projectName;
        CX.state.analysis=prev.analysis;
        CX.state.benchmark=prev.benchmark;
        CX.state.listingBench=prev.listingBench;
        CX.state.asins=prev.asins;
        CX.state.modules=prev.modules;
        CX.state.mode=prev.mode;
        CX.state.analysisWindow=prev.analysisWindow;
        CX.state.included=prev.included;
        CX.state.fto=prev.fto;
        CX.state.locked=prev.locked;
        CX.state.profit=prev.profit;
        CX.state.flowRange=prev.flowRange;
        CX.state.lastRun=prev.lastRun;
        CX.state.running=prev.running;
        saving=false;
        toast('保存失败：'+fmt.esc(err&&err.message?err.message:'未知错误'),'warn');
        return false;
      }
      saving=false;
      CX.setDrawerGuard(null);
      closeDrawer(true);
      CX.refreshTopbar();
      toast('已新建项目「'+fmt.esc(pname)+'」'+(run?' · 开始分析 '+enabled.length+' 个板块':' · '+enabled.length+' 个板块'),'ok');
      if(run){
        if(CX.state.current!=='overview') CX.go('overview'); else CX.rerender();
        setTimeout(function(){ CX.runAgents(); },120);
      }else{
        if(!CX.isEnabled(CX.state.current)) CX.go('overview'); else CX.rerender();
      }
      return true;
    }

    body.onclick=function(e){
      var del=e.target.closest('.asin-del');
      if(del){
        e.preventDefault();
        if($$('.asin-chip',chips).length<=1){ showErr('Asin','至少保留 1 个 ASIN',$('#asinInput')); return; }
        var chip=del.closest('.asin-chip'); if(chip) chip.remove();
        clearErr('Asin',$('#asinInput'));
        refreshBenchOptions(); updateAsinMeta(); updateBenchVisibility(); updatePreview(); markDirty();
        return;
      }
      var mb=e.target.closest('.mode-btn');
      var wb=e.target.closest('.window-btn');
      if(wb){ e.preventDefault(); setWindow(wb.dataset.window); return; }
      if(mb){ e.preventDefault(); applyMode(mb.dataset.mode); return; }
      if(e.target.closest('#cfgCancel')){ e.preventDefault(); CX.setDrawerGuard(null); closeDrawer(true); return; }
      if(e.target.closest('#cfgRun')){ e.preventDefault(); save(true); return; }
    };
    body.onchange=function(e){
      if(e.target.classList.contains('mod-check')){
        var lab=e.target.closest('.config-mod'); if(lab) lab.classList.toggle('on',e.target.checked);
        draft.mode='custom';
        $$('.mode-btn',body).forEach(function(b){ b.classList.remove('on'); });
        clearErr('Modules');
        updateSummary(); updateBenchVisibility(); updatePreview(); markDirty();
        return;
      }
      if(e.target.name==='bench'){
        var custom=e.target.value==='__custom';
        var ci=$('#benchCustom'); if(ci){ ci.disabled=!custom; if(custom){ try{ ci.focus(); }catch(err){} } }
        clearErr('Bench',ci);
        updatePreview(); markDirty();
        return;
      }
    };
    body.oninput=function(e){
      var t=e.target;
      if(t.id==='projName'){ updateNameCount(); clearErr('Name',t); updatePreview(); markDirty(); }
      else if(t.id==='idealInput'){ updateIdealCount(); updatePreview(); markDirty(); }
      else if(t.id==='benchCustom'){ clearErr('Bench',t); updatePreview(); markDirty(); }
      else if(t.id==='winStart'||t.id==='winEnd'){
        draft.window={preset:'custom',start:val('#winStart'),end:val('#winEnd')};
        $$('.window-btn',body).forEach(function(b){ b.classList.remove('on'); });
        clearErr('Window',$('#winStart')); clearErr('Window',$('#winEnd')); updateWindowUI(); markDirty();
      }
      else if(t.id==='asinInput'){ clearErr('Asin',t); }
    };
    body.onkeydown=function(e){
      if(e.target.id==='asinInput' && e.key==='Enter'){ e.preventDefault(); addAsins(); }
    };
    form.addEventListener('submit',function(e){ e.preventDefault(); save(false); });
    var addBtn=$('#asinAdd'); if(addBtn) addBtn.addEventListener('click',addAsins);

    updateNameCount(); updateIdealCount(); updateAsinMeta(); updateWindowUI(); updateProjState(); updatePreview();
    CX.setDrawerGuard(function(){
      if(!dirty) return true;
      return confirm('有未保存的修改，关闭后会丢失。确定关闭？');
    });
  }
  CX.openConfig=function(key){ buildConfig(key); };

  /* ---------------- nav / routing ---------------- */
  function isEnabled(id){
    if(id==='overview'||id==='report') return true;
    if(id==='flow') return CX.state.modules.flow!==false;
    return CX.state.modules[id]!==false;
  }
  CX.isEnabled=isEnabled;

  function updateNav(){
    $$('.nav-item').forEach(a=>{
      const id=a.dataset.route;
      const on=isEnabled(id);
      a.hidden=!on;
      a.classList.toggle('active',on&&id===CX.state.current);
      a.classList.remove('disabled');
      const l=a.querySelector('.nav-lock'); if(l) l.remove();
    });
    $$('.nav-label').forEach(label=>{
      let el=label.nextElementSibling, any=false;
      while(el && !el.classList.contains('nav-label')){
        if(el.classList.contains('nav-item') && !el.hidden) any=true;
        el=el.nextElementSibling;
      }
      label.hidden=!any;
    });
  }
  function refreshTopbar(){
    const el=$('#topAsinCount'); if(el) el.textContent=CX.state.asins.length;
    const pc=$('#projChip');
    if(pc){
      const nm=CX.state.projectName||'未命名项目';
      const an=CX.state.analysis||{};
      const suf=an.status==='running'?' · '+an.step+'/'+an.total:(an.status==='done'?' · 已完成':'');
      const full=nm+suf;
      pc.textContent=full.length>18?full.slice(0,18)+'…':full;
      pc.title='当前项目：'+nm+suf+'（点击打开历史项目）';
      if(!pc.dataset.bound){ pc.dataset.bound='1'; pc.addEventListener('click',openHistory); }
    }
    updateNav();
  }
  CX.refreshTopbar=refreshTopbar;

  function route(){
    const raw=(location.hash||'').replace(/^#\/?/,'').split('?')[0];
    const id=raw||'overview';
    if($('#drawer').classList.contains('open')){
      if(closeDrawer()===false){
        if(location.hash!=='#/'+CX.state.current) history.replaceState(null,'','#/'+CX.state.current);
        return;
      }
    }
    const def=CX.modules[id];
    const view=$('#view');
    CX.state.current=id;
    updateNav();
    $('#crumb').textContent=def?def.title:'页面不存在';
    document.title=(def?def.title:'NEXUS')+' · NEXUS 竞品维度追踪台';
    if(!def){
      view.innerHTML='<div class="empty-state"><b>404 / 页面不存在</b>请从左侧导航重新进入。</div>';
      return;
    }
    if(!isEnabled(id)){
      toast('该板块不在当前分析范围，已回总览','warn');
      if(location.hash!=='#/overview') location.hash='#/overview';
      return;
    }
    view.innerHTML=def.render();
    view.classList.remove('page-in'); void view.offsetWidth; view.classList.add('page-in');
    if(def.after) def.after(view);
    if(CX.paintAnalysis) CX.paintAnalysis();
    window.scrollTo({top:0,behavior:'instant'});
    $$('.nav-item').forEach(a=>a.classList.toggle('active',a.dataset.route===id));
    if(window.innerWidth<=980) closeSidebar();
  }
  /* ---------------- module registry ---------------- */
  CX.register = function(id, def){
    if(!id || !def || typeof def.render !== 'function'){
      console.error('[NEXUS] CX.register 参数非法:', id);
      return;
    }
    CX.modules[id] = def;
    return def;
  };

  CX.route=route;
  function rerender(){ route(); }
  CX.rerender=rerender;
  function go(id){ if(location.hash==='#/'+id) route(); else location.hash='#/'+id; }
  CX.go=go;

  function openSidebar(){ $('#sidebar').classList.add('open'); $('#scrim').classList.add('open'); }
  function closeSidebar(){ $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('open'); }

  /* ---------------- agents run ---------------- */
  function analysisSteps(){
    return CX.MODULES.filter(function(m){ return m.id!=='overview'&&m.id!=='report'&&CX.isEnabled(m.id); })
      .map(function(m){ return {id:m.id,label:m.code+' · '+m.name}; });
  }
  function paintAnalysis(){
    var a=CX.state.analysis||{status:'idle',step:0,total:0,steps:[]};
    var pct=a.total?Math.round(a.step/a.total*100):0;
    var bar=$('#agentProgress'); if(bar) bar.style.width=pct+'%';
    var txt=$('#analysisText');
    if(txt){
      if(a.status==='running') txt.textContent='分析中 '+a.step+' / '+a.total+' · 可以离开此页，进度在「历史项目」';
      else if(a.status==='done') txt.textContent='分析完成 · '+new Date(a.finishedAt).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
      else if(a.status==='interrupted') txt.textContent='上次分析中断了，可以重新开始';
      else txt.textContent='未开始';
    }
    var btn=$('#runAgentsBtn');
    if(btn){ btn.disabled=(a.status==='running'); btn.textContent=(a.status==='running'?'分析中…':'重新编排'); }
    if(a.steps&&a.steps.length){
      a.steps.forEach(function(s,idx){
        var r=document.querySelector('.agent-row[data-agent="'+s.id+'"]'); if(!r) return;
        var st=r.querySelector('.agent-state');
        r.classList.remove('done','idle','running');
        if(idx<a.step){ r.classList.add('done'); if(st) st.textContent='DONE'; }
        else if(idx===a.step&&a.status==='running'){ r.classList.add('running'); if(st) st.textContent='RUNNING'; }
        else { r.classList.add('idle'); if(st) st.textContent='QUEUED'; }
      });
    }
    refreshTopbar();
  }
  function runAgents(resume){
    if(CX.state.running) return;
    var a=CX.state.analysis||{};
    if(!resume || !a.steps || !a.steps.length){
      var steps=analysisSteps();
      if(!steps.length){ toast('没有启用的分析板块','warn'); return; }
      a=CX.state.analysis={status:'running',steps:steps,total:steps.length,step:0,startedAt:new Date().toISOString(),finishedAt:null,projectId:CX.state.projectId};
    }else{
      a.status='running'; a.cancelled=false; a.finishedAt=null; if(a.step>=a.total) a.step=0;
    }
    CX.state.running=true;
    saveConfig(); paintAnalysis();
    function tick(){
      if(a.cancelled){ CX.state.running=false; return; }
      if(a.step>=a.total){
        a.status='done'; a.finishedAt=new Date().toISOString();
        CX.state.running=false; CX.state.lastRun=a.finishedAt;
        saveConfig(); paintAnalysis();
        toast('分析完成：'+a.total+' 个板块','ok');
        return;
      }
      a.step++;
      saveConfig(); paintAnalysis();
      setTimeout(tick,420+Math.random()*360);
    }
    setTimeout(tick,420+Math.random()*360);
  }
  CX.runAgents=runAgents;
  CX.paintAnalysis=paintAnalysis;

  /* ---------------- boot ---------------- */
  CX.boot=function(){
    $('#menuBtn').addEventListener('click',()=>{ const s=$('#sidebar'); if(s.classList.contains('open')) closeSidebar(); else openSidebar(); });
    $('#scrim').addEventListener('click',closeSidebar);
    $('#configBtn').addEventListener('click',()=>buildConfig());
    $('#historyBtn').addEventListener('click',openHistory);
    $('#reportBtn').addEventListener('click',()=>go('report'));
    $('#drawerClose').addEventListener('click',function(){ closeDrawer(); });
    $('#drawerScrim').addEventListener('click',function(){ closeDrawer(); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeDrawer(); closeSidebar(); }});
    document.addEventListener('keydown',function(e){
      if(e.key!=='Tab') return;
      var d=$('#drawer'); if(!d.classList.contains('open')) return;
      var items=$$('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])',d).filter(function(el){ return el.offsetParent!==null; });
      if(!items.length) return;
      var first=items[0], last=items[items.length-1];
      if(!d.contains(document.activeElement)){ e.preventDefault(); first.focus(); return; }
      if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    });
    window.addEventListener('hashchange',route);
    document.addEventListener('click',e=>{
      const cf=e.target.closest('[data-config]'); if(cf){ e.preventDefault(); CX.openConfig(cf.dataset.config); return; }
      const c=e.target.closest('[data-copy]'); if(c){ e.preventDefault(); copy(c.dataset.copy); }
      const g=e.target.closest('[data-go]'); if(g){ e.preventDefault(); go(g.dataset.go); }
      const t=e.target.closest('[data-toast]'); if(t){ e.preventDefault(); toast(t.dataset.toast); }
      const r=e.target.closest('[data-report]'); if(r){ e.preventDefault(); addToReport(r.dataset.report, r.dataset.label||r.textContent.trim()); }
    });
    refreshTopbar();
    if(!location.hash) history.replaceState(null,'','#/overview');
    route();
    var a0=CX.state.analysis;
    if(a0&&a0.status==='running'){
      CX.state.running=false;
      setTimeout(function(){ CX.runAgents(true); },600);
    }
  };
})();
