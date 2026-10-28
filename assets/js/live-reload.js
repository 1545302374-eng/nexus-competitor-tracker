/* 热更新客户端：只在本地预览服务下生效，file:// 和线上静态托管直接跳过 */
(function () {
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
  if (!/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return;
  if (!window.EventSource) return;
  /* 无头截图 / 调试可加 ?noreload=1 关闭 SSE，避免长连接阻塞虚拟时间 */
  if (/(^|[?&])noreload=1/.test(location.search || '')) return;
  var es = new EventSource('/__reload');
  es.addEventListener('message', function (e) {
    if (e.data === 'reload') location.reload();
  });
  es.addEventListener('error', function () { /* 自动重连 */ });
})();
