/* 冒烟测试：无浏览器环境下加载 data.js / core.js / 全部板块模块，
   校验 CX.register 接线、每个板块 render() 是否可产出 HTML。 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

/* ---------- 最小 DOM 桩 ---------- */
function makeEl() {
  const el = {
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    dataset: {},
    style: {},
    children: [],
    innerHTML: '',
    textContent: '',
    value: '',
    addEventListener() {},
    removeEventListener() {},
    appendChild(c) { el.children.push(c); return c; },
    removeChild() {},
    remove() {},
    setAttribute() {},
    getAttribute() { return null; },
    querySelector() { return makeEl(); },
    querySelectorAll() { return []; },
    closest() { return null; },
    focus() {},
    scrollIntoView() {},
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; }
  };
  return el;
}

const doc = {
  readyState: 'complete',
  body: makeEl(),
  documentElement: makeEl(),
  querySelector() { return makeEl(); },
  querySelectorAll() { return []; },
  getElementById() { return makeEl(); },
  createElement() { return makeEl(); },
  createTextNode() { return {}; },
  addEventListener() {},
  removeEventListener() {}
};

const storage = { _d: {}, getItem(k) { return this._d[k] || null; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; } };

global.window = global;
global.document = doc;
global.localStorage = storage;
global.location = { hash: '', href: 'http://localhost/', pathname: '/' };
global.history = { replaceState() {}, pushState() {} };
global.navigator = { userAgent: 'node-smoke' };
global.requestAnimationFrame = (fn) => setTimeout(fn, 0);
global.CSS = { supports() { return true; } };

/* ---------- 加载脚本 ---------- */
const files = [
  'assets/js/data.js',
  'assets/js/core.js',
  ...fs.readdirSync(path.join(ROOT, 'assets/js/agents'))
    .filter(f => f.endsWith('.js'))
    .sort()
    .map(f => 'assets/js/agents/' + f)
];

const loadErrors = [];
for (const rel of files) {
  const full = path.join(ROOT, rel);
  try {
    vm.runInThisContext(fs.readFileSync(full, 'utf8'), { filename: full });
  } catch (e) {
    loadErrors.push(rel + ' :: ' + e.message);
  }
}

const CX = global.CX || {};
const mods = CX.modules || {};
const ids = Object.keys(mods);

/* ---------- 逐模块渲染 ---------- */
const rows = [];
const EXPECT = ['market', 'params', 'voc', 'profit', 'compliance', 'opportunity', 'listing', 'promotion', 'flow', 'report'];
const problems = [];

for (const id of EXPECT) {
  const def = mods[id];
  if (!def) { problems.push('MISSING module: ' + id); rows.push({ id, status: 'MISSING' }); continue; }
  try {
    const html = def.render();
    if (typeof html !== 'string') { problems.push(id + ': render() 返回 ' + typeof html); }
    const len = typeof html === 'string' ? html.length : 0;
    const undef = (String(html).match(/>undefined</g) || []).length;
    const nan = (String(html).match(/NaN/g) || []).length;
    const openDiv = (String(html).match(/<div/g) || []).length;
    const closeDiv = (String(html).match(/<\/div>/g) || []).length;
    if (len < 800) problems.push(id + ': 渲染过短 ' + len);
    if (undef) problems.push(id + ': 出现 ' + undef + ' 处 >undefined<');
    if (nan) problems.push(id + ': 出现 ' + nan + ' 处 NaN');
    if (openDiv !== closeDiv) problems.push(id + ': div 不配对 ' + openDiv + '/' + closeDiv);
    rows.push({ id, status: 'OK', len, divs: openDiv + '/' + closeDiv, after: typeof def.after === 'function' ? 'yes' : '-' , title: def.title });
  } catch (e) {
    problems.push(id + ': render 抛错 :: ' + e.message);
    rows.push({ id, status: 'THROW', err: e.message });
  }
}

/* ---------- 输出 ---------- */
console.log('=== load errors (' + loadErrors.length + ') ===');
loadErrors.forEach(e => console.log('  ' + e));
console.log('\n=== registered modules (' + ids.length + ') ===');
console.log('  ' + ids.join(', '));
console.log('\n=== per-module ===');
for (const r of rows) {
  console.log('  ' + String(r.id).padEnd(13) + String(r.status).padEnd(8) +
    String(r.len || '').padEnd(8) + String(r.divs || '').padEnd(12) +
    'after=' + (r.after || '-') + (r.title ? '  [' + r.title + ']' : '') + (r.err ? '  ERR:' + r.err : ''));
}
console.log('\n=== problems (' + problems.length + ') ===');
problems.forEach(p => console.log('  ! ' + p));
console.log('\nRESULT: ' + (problems.length === 0 && loadErrors.length === 0 ? 'PASS' : 'FAIL'));
process.exit(problems.length === 0 && loadErrors.length === 0 ? 0 : 1);
