#!/usr/bin/env node
/**
 * 统一推送入口：公众号 | 云电脑
 *
 *   node push.js wechat <appId|-> html <file.html> [sendMode]
 *   node push.js wechat <appId|-> img '<urlsJSON>' <title> <content> [sendMode]
 *   node push.js cloud <instanceId|-> html <file.html> [categoryId] [publishMode]
 *   node push.js cloud <instanceId|-> img '<urlsJSON>' <title> [content.html] [publishMode]
 *   node push.js cloud <instanceId|-> video '<url或JSON>' <title> [publishMode]
 */

const { spawnSync } = require('child_process');
const path = require('path');

const channel = String(process.argv[2] || '').toLowerCase();
const rest = process.argv.slice(3);
const dir = __dirname;

if (channel !== 'wechat' && channel !== 'cloud') {
  console.error(`用法:
  node push.js wechat <appId|-> html <file.html> [sendMode]
  node push.js wechat <appId|-> img '<urlsJSON>' <title> <content> [sendMode]
  node push.js cloud  <instanceId|-> html <file.html> [categoryId] [publishMode]
  node push.js cloud  <instanceId|-> img '<urlsJSON>' <title> [content.html] [publishMode]
  node push.js cloud  <instanceId|-> video '<url或JSON>' <title> [publishMode]`);
  process.exit(1);
}

const script =
  channel === 'wechat'
    ? path.join(dir, 'push-to-wechat-mp.js')
    : path.join(dir, 'push-to-cloud.js');

const r = spawnSync(process.execPath, [script, ...rest], {
  cwd: dir,
  stdio: 'inherit',
});
process.exit(r.status == null ? 1 : r.status);
