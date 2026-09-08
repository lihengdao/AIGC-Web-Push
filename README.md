# aigc-web-push · AI内容生成与全网推送

[ClawHub](https://clawhub.ai/lihengdao/aigc-web-push) · [虾评Skill](https://xiaping.coze.com/skill/015db5c8-8dc6-4c44-b16c-b865ea3c06f0)

支持通过 AI 生成文章和图文卡片，并推送到微信公众号（无需泄露公众号 Secret，无需配置 IP 白名单）或经由云电脑推送至全球任意站点；兼容其它技能产出的文章、图片与视频。

## 功能特性

- **扫码配置** — 通过配置向导授权公众号 / 选择云电脑，支持多账号、多实例
- **图文生成** — 按 `design.md` 生成标准 HTML，并可用 Humanizer 去 AI 味
- **双通道推送** — 微信公众号草稿箱，或云电脑绑定站点（文章 / 贴图 / 视频）
- **统一入口** — `push.js` 覆盖公众号与云电脑推送

## 安装

- **链接安装**：发送 [https://clawhub.ai/lihengdao/aigc-web-push](https://clawhub.ai/lihengdao/aigc-web-push) 给 AI
- **命令行安装**：

```bash
npx skills add lihengdao/aigc-web-push
```

## 快速开始

### 1. 配置向导

```
https://app.pcloud.ac.cn/design/aigc-web-push.html
```

1. 用户微信扫码  
2. 选择通道（公众号 / 云电脑，可多选）并完成授权或选机  
3. 复制生成的配置发给 AI  

云电脑开通 / 开关机 / 绑定站点账号请在 [云电脑管理](https://app.pcloud.ac.cn/design/#/manage?tab=server) 完成。

### 2. 保存配置

将配置保存为技能目录下的 `config.json`（UTF-8）。

### 3. 写内容

按 `design.md` 生成主 HTML；文本文章按 `Humanizer-zh.md` / `Humanizer.md` 去 AI 味。

- **文章**：默认宽度 677px  
- **贴图**：默认宽度 375px，固定分页比例（默认 3:4）  

无内嵌图片时可再按 `design_cover.md` 生成 `你的文件_cover.html`。

### 4. 推送

统一入口：`push.js`。

**公众号 · HTML**

```bash
cd aigc-web-push
node push.js wechat targetAppId html 你的文件.html
```

**公众号 · 图片链接**

```bash
cd aigc-web-push
node push.js wechat targetAppId img '["https://cdn.example.com/1.png"]' "标题" "正文"
```

**云电脑 · HTML**

```bash
cd aigc-web-push
node push.js cloud - html 你的文件.html article draft
```

**云电脑 · 视频**（仅公网 URL）

```bash
cd aigc-web-push
node push.js cloud - video 'https://cdn.example.com/xxx.mp4' "标题" draft
```

目标未指定时，命令行写 `-` / `default`，脚本会使用 `config.json` 中 `selected: true` 的公众号或云电脑。

## 详细文档

- **SKILL.md** — 完整技能说明  
- **design.md** / **design_cover.md** — HTML 与封面规范  
- **config.example.json** — 配置字段说明  

## 注意事项

- 推送链路较长，若返回「超时」可视为已成功，勿重复狂推  
- 请用户在服务通知、草稿箱或云电脑站点确认结果  
- 勿将真实 `config.json` / `skillKey` 提交到公开仓库  

## 相关链接

- [ClawHub 技能页](https://clawhub.ai/lihengdao/aigc-web-push)  
- [虾评技能页](https://xiaping.coze.com/skill/015db5c8-8dc6-4c44-b16c-b865ea3c06f0)  
- [配置向导](https://app.pcloud.ac.cn/design/aigc-web-push.html)  

## 维护者

[@lihengdao](https://clawhub.ai/users/lihengdao)
