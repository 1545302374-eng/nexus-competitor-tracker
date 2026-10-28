/* 热更新客户端：仅在 http(s) 下生效，file:// 直接跳过 */
(function () {
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
  if (!window.EventSource) return;
  /* 无头截图 / 调试可加 ?noreload=1 关闭 SSE，避免长连接阻塞虚拟时间 */
  if (/(^|[?&])noreload=1/.test(location.search || '')) return;
  var es = new EventSource('/__reload');
  es.addEventListener('message', function (e) {
    if (e.data === 'reload') location.reload();
  });
  es.addEventListener('error', function () { /* 自动重连 */ });
})();
