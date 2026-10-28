const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
function el(){const e={classList:{add(){},remove(){},toggle(){},contains(){return false}},dataset:{},style:{},children:[],innerHTML:'',textContent:'',value:'',addEventListener(){},appendChild(c){e.children.push(c);return c},remove(){},setAttribute(){},getAttribute(){return null},querySelector(){return el()},querySelectorAll(){return []},closest(){return null},focus(){},getBoundingClientRect(){return{top:0,left:0,width:0,height:0}}};return e}
global.window=global;
global.document={readyState:'complete',body:el(),documentElement:el(),querySelector(){return el()},querySelectorAll(){return[]},getElementById(){return el()},createElement(){return el()},addEventListener(){}};
global.localStorage={_d:{},getItem(k){return this._d[k]||null},setItem(k,v){this._d[k]=String(v)}};
global.location={hash:'',href:'http://x/'};
global.history={replaceState(){},pushState(){}};
global.requestAnimationFrame=f=>setTimeout(f,0);
['assets/js/data.js','assets/js/core.js','assets/js/agents/04-profit.js'].forEach(rel=>{
  const full=path.join(ROOT,rel); vm.runInThisContext(fs.readFileSync(full,'utf8'),{filename:full});
});
const html=CX.modules.profit.render();
const re=/<div\b[^>]*>|<\/div\s*>/g;
let m, depth=0, neg=null;
while((m=re.exec(html))){
  if(m[0].charAt(1)==='/') depth--; else depth++;
  if(depth<0 && !neg){ neg=m.index; break; }
}
console.log('final depth:',depth);
if(neg!==null){
  console.log('first negative at char',neg);
  console.log('---- context ----');
  console.log(html.slice(Math.max(0,neg-600), neg+200));
}else{
  console.log('no negative depth; extra closer is unbalanced at top level');
  console.log(html.slice(-600));
}
