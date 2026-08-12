---
name: aigc-web-push
description: 支持通过 AI 生成符合规范的图文（文章和贴图），并推送到微信公众号（无需泄露公众号 Secret，无需配置 IP 白名单）或云电脑全球任何站点；兼容其它技能产出的图文、图片与公网视频 URL。
---

# aigc-web-push · 内容生成与全网推送

## 文件路径与作用

| 文件 | 位置 | 作用 |
| --- | --- | --- |
| **SKILL.md** | `aigc-web-push/` | 本说明 |
| **design.md** | 同上 | HTML 格式规范 |
| **design_cover.md** | 同上 | 封面 HTML 规范 |
| **Humanizer-zh.md** / **Humanizer.md** | 同上 | 去 AI 味（中 / 英） |
| **config.json** | 同上 | 配置向导生成后的真实配置 |
| **config.example.json** | 同上 | 字段说明 + 示例 |
| **push.js** | 同上 | 统一推送入口（公众号 / 云电脑） |
| **push-to-wechat-mp.js** | 同上 | 公众号推送实现 |
| **push-to-cloud.js** | 同上 | 云电脑推送实现 |

---

## 第一步：配置向导

| 项 | 内容 |
| --- | --- |
| **配置向导地址** | [https://app.pcloud.ac.cn/design/aigc-web-push.html](https://app.pcloud.ac.cn/design/aigc-web-push.html) |
| **流程** | AI 发向导给用户 → 用户微信扫码 → 选择通道（公众号 / 云电脑，可多选）→ 按向导完成授权或选机 → 用户复制发给 AI |

AI 检查 **aigc-web-push 目录** 下是否存在 `config.json`。如果不存在，则无法使用本技能，AI 需要发送配置向导地址给用户扫码配置。

**说明：**

- **微信公众号**：可选平台提供公众号，或扫码授权自己的公众号并填写 AppID / sn。
- **云电脑**：向导会列出**已开通**的全部云电脑并写入 `instances`；没有机器时，请先到下方「云电脑管理」开通，再回向导刷新。默认推送目标为向导选中的那一台（`selected: true`）。

**云电脑相关管理（不在本技能目录内操作）：**

| 事项 | 在哪里做 |
| --- | --- |
| 开通 / 开关机 / 销毁云电脑 | [云电脑管理](https://app.pcloud.ac.cn/design/#/manage?tab=server) |
| 在云电脑上绑定站点账号（文章 / 贴图 / 视频等） | 同上：进入对应云电脑控制台完成登录与账号绑定 |
| 选哪台机写入 `config.json` | 本技能配置向导；改默认机可改 `instances` 里的 `selected`，或重新走向导 |

向导**不能**开通机器，也**不能**代绑站点账号；机器与账号都准备好后，再扫码配置才能推送。

---

## 第二步：配置文件

AI 将配置向导得到的配置参数保存为 **aigc-web-push 目录** 下的 `config.json`，编码 **UTF-8**。

在已进入该目录时，可：

```bash
cat > config.json << 'EOF'
{ … 粘贴配置向导 JSON … }
EOF
```

（Windows 可用编辑器在该目录新建 `config.json` 并粘贴）

`config.json` 说明：

- `accounts`：选了公众号通道时才有；**写入可用公众号列表**，其中 `selected: true` 为默认公众号（有且仅一项）。
- `instances`：选了云电脑通道时才有；**写入已开通云电脑全量列表**，其中 `selected: true` 为默认云电脑（有且仅一项）。
- `skillKey`：向导签发，推送必带；勿手写。

---

## 第三步：写内容

1. 用户发送创作要求后，AI 必须根据 `design.md` 生成标准 HTML。若涉及文本文章，须按 `Humanizer-zh.md`（中文）或 `Humanizer.md`（英文）去 AI 味。两种类型：
   - **文章**：通用类型，页面默认宽度 677px
   - **贴图**：图文卡片（小绿书），页面默认宽度 375px，固定分页比例（默认 3:4）。推公众号时后台会把 HTML 转成图片
2. 生成主 HTML 后，若页面中没有引用图片，可再按 `design_cover.md` 根据 title 生成封面 HTML

**注意：** 无论文章还是贴图，必须先阅读 `design.md`；主 HTML 跟 `design.md`，封面跟 `design_cover.md`。

---

## 第四步：推送

统一入口：`push.js`。通道参数为 `wechat` 或 `cloud`。

### 推送 HTML（公众号）

```bash
cd aigc-web-push
node push.js wechat targetAppId html 你的文件.html
```

### 推送图片链接（公众号）

```bash
cd aigc-web-push
node push.js wechat targetAppId img '["https://cdn.example.com/1.png","https://cdn.example.com/2.png"]' "标题" "正文"
```

标题、正文可为空；含空格时用英文双引号。

### 推送 HTML（云电脑）

首参为云电脑 ID（`-` / `default` 表示用 `config.json` 里 `selected:true` 的云电脑）；可选 `categoryId`（`article` 默认 / `newspic` / `video`）、`publishMode`（`draft` 默认）。

```bash
cd aigc-web-push
node push.js cloud - html 你的文件.html article draft
```

### 推送图片链接（云电脑）

```bash
cd aigc-web-push
node push.js cloud - img '["https://cdn.example.com/1.png"]' "标题" draft
```

### 推送视频（仅云电脑）

本技能**不生成**视频。可推送用户提供的公网视频 URL。公众号不支持视频。

```bash
cd aigc-web-push
node push.js cloud - video 'https://cdn.example.com/xxx.mp4' "标题" draft
```

云电脑上须已绑定 `contentType=video` 的账号（在 [云电脑管理](https://app.pcloud.ac.cn/design/#/manage?tab=server) 控制台绑定）。只有本地文件、没有公网 URL 时无法推送。

### 说明

- **目标公众号 AppID**：用户未指定时，命令行写 `-` / `default`，脚本会取 `accounts` 中 `selected: true`（若选中的是平台号 `appId: default` 则走平台默认公众号；若是 `wx…` 则推到该号）。用户点名某个号时传入对应 AppID。
- **目标云电脑**：用户未指定时，用 `instances` 中 `selected: true`（命令行写 `-`）。
- **接口**：`config.json` 的 `apiBase`（缺省 `https://api.pcloud.ac.cn/openAccessService`），POST JSON；公众号 `action: sendToWechat`，云电脑 `action: sendToCloud`。
- **超时**：推送链路较长，若返回「超时」可视为已成功，勿重复狂推；请用户看服务通知、草稿箱或云电脑站点。

## 其它功能

### 清空草稿箱

POST `https://api.pcloud.ac.cn/openAccessService`：

```json
{
  "action": "cleanupDrafts",
  "openId": "",
  "skillKey": "",
  "appId": ""
}
```

超时可视为已成功；请用户在公众号草稿箱确认。
