@echo off
chcp 65001 >nul
title NEXUS 竞品维度追踪台 · 本地预览
cd /d "%~dp0"

echo ================================================
echo   NEXUS 竞品维度追踪台 - 静态预览 + 热更新
echo   地址: http://127.0.0.1:8770/
echo   热更新: 已开启（改动 html/css/js 自动刷新）
echo   关闭本窗口即停止服务
echo ================================================
echo.

node scripts\dev-server.js

echo.
echo 服务已退出（若为端口占用，请先关闭占用 8770 的进程）
pause
