/* NEXUS QA：交互钩子 / CSS 变量 / 跳转目标 / id 唯一性 审计（无浏览器） */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

/* ---------- DOM 桩 ---------- */
function el() {
  const e = {
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    dataset: {}, style: {}, children: [], innerHTML: '', textContent: '', value: '',
    addEventListener() {}, removeEventListener() {},
    appendChild(c) { e.children.push(c); return c; },
    remove() {}, setAttribute() {}, getAttribute() { return null; },
    querySelector() { return el(); }, querySelectorAll() { return []; },
    closest() { return null; }, focus() {},
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; }
  };
  return e;
}

global.window = global;
global.document = {
  readyState: 'complete', body: el(), documentElement: el(),
  querySelector() { return el(); }, querySelectorAll() { return []; },
  getElementById() { return el(); }, createElement() { return el(); },
  addEventListener() {}
};
global.localStorage = { _d: {}, getItem(k) { return this._d[k] || null; }, setItem(k, v) { this._d[k] = String(v); } };
global.location = { hash: '', href: 'http://x/' };
global.history = { replaceState() {}, pushState() {} };
global.requestAnimationFrame = f => setTimeout(f, 0);

/* ---------- 加载 ---------- */
const agentDir = path.join(ROOT, 'assets/js/agents');
const agentFiles = fs.readdirSync(agentDir).filter(f => f.endsWith('.js')).sort();
const sources = {};
for (const rel of ['assets/js/data.js', 'assets/js/core.js', ...agentFiles.map(f => 'assets/js/agents/' + f)]) {
  const full = path.join(ROOT, rel);
  const code = fs.readFileSync(full, 'utf8');
  sources[rel] = code;
  vm.runInThisContext(code, { filename: full });
}

const CX = global.CX;
const mods = CX.modules;

/* route -> 源文件 */
const fileOf = {};
for (const f of agentFiles) {
  const src = sources['assets/js/agents/' + f];
  const m = src.match(/CX\.register\(['"]([a-z0-9]+)['"]/);
  if (m) fileOf[m[1]] = 'assets/js/agents/' + f;
}

const EXPECT = ['overview', 'market', 'params', 'voc', 'profit', 'compliance', 'opportunity', 'listing', 'promotion', 'flow', 'report'];
const problems = [];
const stats = [];

for (const id of EXPECT) {
  const def = mods[id];
  if (!def) { problems.push('MISSING ' + id); continue; }
  const html = def.render();
  const src = sources[fileOf[id]] || '';
  const file = fileOf[id] || id;

  /* 1) HTML 中的 id */
  const htmlIds = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  const dupInPage = htmlIds.filter((v, i) => htmlIds.indexOf(v) !== i);

  /* 2) 源码里查询的 id */
  const queried = [...src.matchAll(/querySelector\(\s*['"]#([A-Za-z0-9_-]+)['"]/g)].map(m => m[1])
    .concat([...src.matchAll(/getElementById\(\s*['"]([A-Za-z0-9_-]+)['"]/g)].map(m => m[1]));
  const missingHooks = [...new Set(queried)].filter(q => !htmlIds.includes(q));

  /* 3) data-go 目标 */
  const gos = [...html.matchAll(/data-go="([^"]+)"/g)].map(m => m[1]);
  const badGo = [...new Set(gos)].filter(g => !mods[g]);

  /* 4) 空 copy */
  const copies = [...html.matchAll(/data-copy="([^"]*)"/g)].map(m => m[1]);
  const emptyCopy = copies.filter(c => !c.trim()).length;

  stats.push({ id, file, len: html.length, ids: htmlIds.length, hooks: new Set(queried).size, gos: gos.length, copies: copies.length });

  if (dupInPage.length) problems.push(id + ' · 页面内重复 id: ' + [...new Set(dupInPage)].join(', '));
  if (missingHooks.length) problems.push(id + ' · 事件绑定的 id 不存在: ' + missingHooks.join(', '));
  if (badGo.length) problems.push(id + ' · data-go 指向未注册模块: ' + badGo.join(', '));
  if (emptyCopy) problems.push(id + ' · 空 data-copy: ' + emptyCopy + ' 处');
}

/* 5) CSS 变量是否都有定义 */
const theme = fs.readFileSync(path.join(ROOT, 'assets/css/theme.css'), 'utf8');
const defined = new Set([...theme.matchAll(/--([a-z0-9-]+)\s*:/g)].map(m => m[1]));
const used = new Set();
for (const [rel, code] of Object.entries(sources)) {
  if (!rel.includes('agents/') && !rel.endsWith('core.js')) continue;
  for (const m of code.matchAll(/var\(--([a-z0-9-]+)/g)) used.add(m[1]);
}
const missingVars = [...used].filter(v => !defined.has(v));
if (missingVars.length) problems.push('theme.css 未定义的 CSS 变量: ' + missingVars.join(', '));

/* 输出 */
console.log('=== 模块交互审计 ===');
for (const s of stats) {
  console.log('  ' + s.id.padEnd(12) + String(s.len).padStart(6) + ' chars  ids=' + String(s.ids).padStart(3) +
    '  hooks=' + String(s.hooks).padStart(2) + '  data-go=' + String(s.gos).padStart(2) + '  copy=' + s.copies);
}
console.log('\n=== CSS 变量 ===');
console.log('  定义 ' + defined.size + ' 个 · 引用 ' + used.size + ' 个 · 缺失 ' + missingVars.length);
console.log('\n=== 问题 (' + problems.length + ') ===');
problems.forEach(p => console.log('  ! ' + p));
if (!problems.length) console.log('  （无）');
console.log('\nRESULT: ' + (problems.length ? 'FAIL' : 'PASS'));
process.exit(problems.length ? 1 : 0);
