#!/usr/bin/env node
/**
 * 推送到云电脑（auto-publish）。config.json 与本脚本同目录。
 *
 *   node push-to-cloud.js <instanceId|-> html <HTML文件> [categoryId] [publishMode]
 *   node push-to-cloud.js <instanceId|-> img '<JSON数组>' <title> [contentHtml文件可选] [publishMode]
 *   node push-to-cloud.js <instanceId|-> video '<视频URL或JSON数组>' <title> [publishMode]
 *
 * instanceId 为 "-" / default / 空：使用 config.instances 中 selected:true 的实例。
 * categoryId：article（默认）| newspic | video
 * publishMode：draft（默认）| publish | default
 *
 * 示例：
 *   node push-to-cloud.js - html article.html article draft
 *   node push-to-cloud.js ins-xxx img '["https://a.png"]' "标题" draft
 *   node push-to-cloud.js - video 'https://cdn.example.com/a.mp4' "标题" draft
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const DEFAULT_API = 'https://api.pcloud.ac.cn/openAccessService';
const DIR = __dirname;

function readJson(name) {
  const p = path.join(DIR, name);
  if (!fs.existsSync(p)) throw new Error('缺少: ' + p);
  return JSON.parse(fs.readFileSync(p, 'utf8').trim());
}

function titleFromHtml(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    const raw = titleMatch[1].replace(/<[^>]+>/g, '').trim();
    if (raw) return raw;
  }
  const hMatch = html.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
  if (hMatch) {
    const raw = hMatch[1].replace(/<[^>]+>/g, '').trim();
    if (raw) return raw;
  }
  return '未命名';
}

function parseImgUrlsArg(arg) {
  let trimmed = String(arg || '').trim();
  if (!trimmed) throw new Error('需要公网可访问的 URL（JSON 数组或单个 https 链接）');
  if (/^https?:\/\//i.test(trimmed)) return [trimmed];
  try {
    const arr = JSON.parse(trimmed);
    if (Array.isArray(arr) && arr.length) {
      return arr.map((u) => String(u).trim()).filter(Boolean);
    }
  } catch (_) {
    /* fallthrough */
  }
  if (!trimmed.startsWith('[')) trimmed = '[' + trimmed;
  if (!trimmed.endsWith(']')) trimmed = trimmed + ']';
  const arr = JSON.parse(trimmed);
  if (!Array.isArray(arr) || !arr.length) throw new Error('URL 列表无效');
  return arr.map((u) => String(u).trim()).filter(Boolean);
}

function postJson(apiBase, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(apiBase);
    const lib = u.protocol === 'http:' ? http : https;
    const data = Buffer.from(JSON.stringify(body), 'utf8');
    const req = lib.request(
      {
        hostname: u.hostname,
        port: u.port || (u.protocol === 'http:' ? 80 : 443),
        path: u.pathname + u.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
        timeout: 120000,
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = raw ? JSON.parse(raw) : {};
          } catch (e) {
            return reject(new Error('非 JSON 响应: ' + raw.slice(0, 200)));
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout'));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function resolveInstanceIds(cfg, arg) {
  const a = String(arg || '').trim();
  if (a && a !== '-' && a.toLowerCase() !== 'default') return [a];
  const list = Array.isArray(cfg.instances) ? cfg.instances : [];
  const selected = list.filter((x) => x && x.selected && x.instanceId).map((x) => x.instanceId);
  if (selected.length) return selected;
  const first = list.find((x) => x && x.instanceId);
  if (first) return [first.instanceId];
  throw new Error('config.json 中无可用 instances，请先运行配置向导');
}

async function main() {
  const cfg = readJson('config.json');
  const openId = String(cfg.openId || '').trim();
  if (!openId) throw new Error('config.json 缺少 openId');
  const skillKey = String(cfg.skillKey || '').trim();
  if (!skillKey) throw new Error('config.json 缺少 skillKey，请重新打开配置向导扫码');
  const apiBase = String(cfg.apiBase || DEFAULT_API).trim() || DEFAULT_API;

  const argv = process.argv.slice(2);
  if (argv.length < 2) {
    console.error(
      '用法:\n  node push-to-cloud.js <instanceId|-> html <file.html> [categoryId] [publishMode]\n  node push-to-cloud.js <instanceId|-> img \'<urlsJSON>\' <title> [content.html] [publishMode]\n  node push-to-cloud.js <instanceId|-> video \'<url或JSON>\' <title> [publishMode]'
    );
    process.exit(1);
  }

  const instanceArg = argv[0];
  const mode = String(argv[1] || '').toLowerCase();
  const serverInstanceIds = resolveInstanceIds(cfg, instanceArg);

  let body;
  if (mode === 'html') {
    const file = argv[2];
    if (!file) throw new Error('缺少 HTML 文件名');
    const htmlPath = path.isAbsolute(file) ? file : path.join(DIR, file);
    if (!fs.existsSync(htmlPath)) throw new Error('找不到文件: ' + htmlPath);
    const content = fs.readFileSync(htmlPath, 'utf8');
    const categoryId = String(argv[3] || 'article').trim() || 'article';
    const publishMode = String(argv[4] || 'draft').trim() || 'draft';
    const coverPath = path.join(DIR, 'cover.html');
    body = {
      action: 'sendToCloud',
      openId,
      skillKey,
      serverInstanceIds,
      categoryId,
      title: titleFromHtml(content),
      content,
      publishMode,
      ...(fs.existsSync(coverPath)
        ? { coverHtml: fs.readFileSync(coverPath, 'utf8') }
        : {}),
    };
  } else if (mode === 'img') {
    const urls = parseImgUrlsArg(argv[2]);
    const title = String(argv[3] || '配图').trim() || '配图';
    let publishMode = 'draft';
    let content = '';
    if (argv[4] && /\.html?$/i.test(argv[4])) {
      const htmlPath = path.isAbsolute(argv[4]) ? argv[4] : path.join(DIR, argv[4]);
      content = fs.readFileSync(htmlPath, 'utf8');
      publishMode = String(argv[5] || 'draft').trim() || 'draft';
    } else if (argv[4]) {
      publishMode = String(argv[4]).trim() || 'draft';
    }
    body = {
      action: 'sendToCloud',
      openId,
      skillKey,
      serverInstanceIds,
      categoryId: 'newspic',
      title,
      imgUrls: urls,
      publishMode,
      ...(content ? { content } : {}),
    };
  } else if (mode === 'video') {
    // 与 auto-publish 一致：不传 HTML，只传公网视频 URL → 附件 video.mp4
    const urls = parseImgUrlsArg(argv[2]);
    const title = String(argv[3] || '视频').trim() || '视频';
    const publishMode = String(argv[4] || 'draft').trim() || 'draft';
    body = {
      action: 'sendToCloud',
      openId,
      skillKey,
      serverInstanceIds,
      categoryId: 'video',
      title,
      imgUrls: urls,
      publishMode,
    };
  } else {
    throw new Error('第二参须为 html、img 或 video');
  }

  console.log('推送到云电脑', {
    apiBase,
    serverInstanceIds,
    categoryId: body.categoryId,
    title: body.title,
  });

  try {
    const res = await postJson(apiBase, body);
    console.log('HTTP', res.status, JSON.stringify(res.body, null, 2));
    if (!res.body || res.body.success === false) process.exit(2);
  } catch (e) {
    if (/timeout/i.test(String(e.message || ''))) {
      console.warn('请求超时：任务可能已在后台受理，请查看云电脑任务列表，勿重复推送。');
      process.exit(0);
    }
    console.error(e);
    process.exit(1);
  }
}

main();
