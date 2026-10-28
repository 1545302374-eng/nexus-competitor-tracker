/* 打印媒体截图：CDP 强制 Emulation.setEmulatedMedia(print)，零依赖（Node 22+ 内置 WebSocket） */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROME = process.env.CHROME_PATH ||
  'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = Number(process.env.CDP_PORT || 9333);
const URL_BASE = process.env.URL_BASE || 'http://127.0.0.1:8770/?noreload=1';
const OUT_DIR = path.resolve(__dirname, '..', '.qa');
const PROFILE = path.join(process.env.TEMP || '/tmp', 'nexus-cdp-profile');

/* A4 纵向 / 横向（CSS px，96dpi） */
const VIEWPORTS = [
  { name: 'print-a4-portrait', width: 794, height: 1123 },
  { name: 'print-a4-landscape', width: 1123, height: 794 },
  { name: 'print-screen-390', width: 390, height: 844, media: 'screen' }
];

const PAGES = [
  { name: 'report', route: '#/report' },
  { name: 'flow', route: '#/flow' }
];

function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let b = '';
      res.on('data', d => (b += d));
      res.on('end', () => { try { resolve(JSON.parse(b)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.rmSync(PROFILE, { recursive: true, force: true });

  const chrome = spawn(CHROME, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    '--no-first-run', '--disable-extensions', '--mute-audio',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    'about:blank'
  ], { stdio: 'ignore' });

  let tabs;
  for (let i = 0; i < 60; i++) {
    try { tabs = await getJSON(`http://127.0.0.1:${PORT}/json/list`); if (tabs.length) break; } catch (e) {}
    await sleep(250);
  }
  if (!tabs || !tabs.length) { chrome.kill(); throw new Error('CDP 未就绪'); }

  const target = tabs.find(t => t.type === 'page') || tabs[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const pending = new Map();
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  };
  const send = (method, params) => new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, m => (m.error ? reject(new Error(method + ': ' + m.error.message)) : resolve(m.result)));
    ws.send(JSON.stringify({ id: mid, method, params: params || {} }));
  });

  await send('Page.enable');
  await send('Runtime.enable');

  const results = [];
  for (const vp of VIEWPORTS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width, height: vp.height, deviceScaleFactor: 2, mobile: false
    });
    await send('Emulation.setEmulatedMedia', { media: vp.media || 'print' });

    for (const pg of PAGES) {
      await send('Page.navigate', { url: URL_BASE + pg.route });
      await sleep(2200);
      const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      const file = path.join(OUT_DIR, `${vp.name}-${pg.name}.png`);
      fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
      results.push({ file: path.basename(file), kb: Math.round(fs.statSync(file).size / 1024) });
    }
  }

  /* 打印态下量一下关键元素（验证深色块是否转白、宽表是否被裁） */
  await send('Emulation.setDeviceMetricsOverride', { width: 794, height: 1123, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setEmulatedMedia', { media: 'print' });
  await send('Page.navigate', { url: URL_BASE + '#/report' });
  await sleep(2200);
  const probe = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(function(){
      var pick = function(sel){
        var el = document.querySelector(sel);
        if(!el) return null;
        var cs = getComputedStyle(el);
        var r = el.getBoundingClientRect();
        return { sel: sel, bg: cs.backgroundColor, color: cs.color, w: Math.round(r.width), right: Math.round(r.right), overflow: cs.overflow };
      };
      return {
        bodyBg: getComputedStyle(document.body).backgroundColor,
        vsplit: pick('.vsplit'),
        modcard: pick('.mod-card'),
        tbl: pick('.tbl'),
        tableWrap: pick('.table-wrap'),
        mainCell: pick('.tbl .main-cell'),
        verdictCols: (function(){var el=document.querySelector('.verdict');return el?getComputedStyle(el).gridTemplateColumns:'none';})(),
        verdictDisplay: (function(){var el=document.querySelector('.verdict');return el?getComputedStyle(el).display:'none';})(),
        kpiDisplay: (function(){var el=document.querySelector('.kpi-grid');return el?getComputedStyle(el).display:'none';})(),
        kpiCols: (function(){var el=document.querySelector('.kpi-grid');return el?getComputedStyle(el).gridTemplateColumns:'none';})(),
        kpiCount: document.querySelectorAll('.kpi').length,
        sideDisplay: (function(){var el=document.querySelector('.verdict-side');return el?getComputedStyle(el).display:'none';})(),
        docScroll: document.documentElement.scrollWidth,
        innerW: window.innerWidth
      };
    })()`
  });

  console.log(JSON.stringify({ shots: results, printProbe: probe.result.value }, null, 2));
  ws.close();
  chrome.kill();
  await sleep(300);
})().catch(e => { console.error('ERR ' + e.message); process.exit(1); });
