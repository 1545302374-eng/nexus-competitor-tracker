const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
function el(){const e={classList:{add(){},remove(){},toggle(){},contains(){return false}},dataset:{},style:{},children:[],innerHTML:'',textContent:'',value:'',addEventListener(){},appendChild(c){return c},remove(){},setAttribute(){},getAttribute(){return null},querySelector(){return el()},querySelectorAll(){return []},closest(){return null},focus(){},getBoundingClientRect(){return{top:0,left:0,width:0,height:0}}};return e}
global.window=global;
global.document={readyState:'complete',body:el(),documentElement:el(),querySelector(){return el()},querySelectorAll(){return[]},getElementById(){return el()},createElement(){return el()},addEventListener(){}};
global.localStorage={_d:{},getItem(k){return this._d[k]||null},setItem(k,v){this._d[k]=String(v)}};
global.location={hash:'',href:'http://x/'};
global.history={replaceState(){},pushState(){}};
['assets/js/data.js','assets/js/core.js','assets/js/agents/04-profit.js'].forEach(rel=>{const f=path.join(ROOT,rel);vm.runInThisContext(fs.readFileSync(f,'utf8'),{filename:f});});
const html=CX.modules.profit.render();
const re=/<div\b[^>]*>|<\/div\s*>/g;
let m,depth=0,last=0,out=[];
const marks=[[/<div class="page"/g,'PAGE'],[ /<div class="page-head"/g,'HEAD'],[/<div class="grid /g,'GRID'],[ /<section class="panel"/g,'SECTION'],[ /<\/section>/g,'/SECTION'],[/<div class="section-gap"/g,'GAP']];
const marks2=[...html.matchAll(/<div class="(page|page-head|grid [^"]*|section-gap)"|<section class="panel"|<\/section>/g)];
let di=0;
for(const mk of marks2){
  // advance depth walker to mk.index
  re.lastIndex=di;
  while((m=re.exec(html))&&m.index<mk.index){ depth+= (m[0].charAt(1)==='/'?-1:1); di=re.lastIndex; }
  console.log(String(mk.index).padStart(6)+'  depth='+String(depth).padStart(3)+'  '+mk[0].slice(0,42));
}
re.lastIndex=di;
while((m=re.exec(html))){ depth+=(m[0].charAt(1)==='/'?-1:1); }
console.log('FINAL depth='+depth);
