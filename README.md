# AIGC Web Push

AI 内容生成与全网推送技能（文章 / 贴图 / 视频 URL），支持微信公众号与云电脑通道。

## 安装

```bash
openclaw skills install @lihengdao/aigc-web-push
```

技能详情：https://clawhub.ai/lihengdao/skills/aigc-web-push

## 配置向导

https://app.pcloud.ac.cn/design/content-publish.html

扫码配置后，将向导 JSON 保存为本目录下的 `config.json`（见 `config.example.json`）。

## 推送

```bash
# 公众号 HTML
node push.js wechat default html your-file.html

# 云电脑 HTML
node push.js cloud - html your-file.html article draft
```

更多用法见 `SKILL.md`。
