---

## name: content-publish
description: 可通过AI生成文章、图文卡片，您还可以提供视频URL，本系统可帮您把内容推送至全球任意网站。

# content-publish · 内容生成与全网推送

**生成**符合规范的 **文章**、**贴图（图文卡片）** HTML → **推送**到公众号和/或云电脑（全网任意站点）。也可推送其它技能或您提供的合规图文/图片/视频URL。

## 两条通道


| 通道            | 做什么                               | 怎么用                                                                                                                                               |
| ------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **微信公众号**     | 推送到草稿箱（HTML 文章 / 图片）；兼容其它技能的图文、图片 | 配置向导扫码授权即可。**无需**公众号 Secret，**无需**配 IP 白名单                                                                                                        |
| **云电脑（全网站点）** | 推到该机上已登录的文章、图片或视频站点               | ① [开通云电脑](https://app.pcloud.ac.cn/design/#/manage?tab=server) → ② 控制台绑定账号 → ③ [配置向导](https://app.pcloud.ac.cn/design/content-publish.html) 选中云电脑 |


- **配置向导**：[https://app.pcloud.ac.cn/design/content-publish.html（扫码得到](https://app.pcloud.ac.cn/design/content-publish.html（扫码得到) `config.json`）  
- 向导**不能开通**云电脑，只能选已有云电脑；列表空则先开通再刷新。


| 文件                                 | 作用                                                 |
| ---------------------------------- | -------------------------------------------------- |
| `SKILL.md`                         | 本说明                                                |
| `design.md` / `design_cover.md`    | 文章 / 贴图 HTML 与封面规范                                 |
| `Humanizer-zh.md` / `Humanizer.md` | 去 AI 味（中 / 英）                                      |
| `config.json`                      | 向导产出（推送必备）                                         |
| `config.example.json`              | 字段说明                                               |
| `push.js`                          | 统一入口 → `push-to-wechat-mp.js` / `push-to-cloud.js` |


---



## 第一步：配置向导


| 项        | 内容                                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------------------ |
| **配置向导** | [https://app.pcloud.ac.cn/design/content-publish.html](https://app.pcloud.ac.cn/design/content-publish.html) |
| **流程**   | AI 发向导给用户 → 用户微信扫码 → 勾选公众号和/或云电脑 → 用户复制发给 AI                                                                 |


AI 检查 **content-publish 目录** 下是否已有 `config.json`。若不存在，则无法推送，须先发向导地址让用户扫码配置。

---



## 第二步：配置文件

用户把向导 JSON（或「复制发给 AI」的整段提示）发给 AI 后，**AI 必须调用写文件命令**，将配置保存为 **content-publish 目录**（与 `SKILL.md` 同级）下的 `config.json`，编码 **UTF-8**。

在已进入该目录时，可：

```bash
cat > config.json << 'EOF'
{ … 粘贴配置向导 JSON … }
EOF
```

（Windows 可用编辑器在该目录新建 `config.json` 并粘贴。）

---



## 第三步：写内容

1. 按 `design.md` 生成主 HTML；去 AI 味：中文 `Humanizer-zh.md`，英文 `Humanizer.md`。
2. 类型（本技能生成范围）：
  - **文章**（`article`）：约 677px → 公众号或云电脑 `article` 账号  
  - **贴图**（`newspic`）：约 375px、3:4 分页 → 公众号转图推送，或云电脑 `image` 账号
3. 主 HTML 无图时，可再按 `design_cover.md` 出 `cover.html`。

推送时也可用 **html 文件** 或 **图片 URL 列表**（其它技能产出同样走 `push.js`）。

---



## 第四步：推送

推送方式：`html` 模式传入生成的 HTML 文件（本技能在第三步生成的主 HTML，请不要传入封面 HTML，封面 HTML 会自动通过脚本随主 HTML 推送。也可以是用户或其它技能提供的 HTML，非 HTML 内容可先按 `design.md` 整理成 HTML）；`img` 模式传入公网可访问的图片 URL 数组及标题、正文。**注意** 此模式仅适合用户或其它技能保证所提供的图片可以直接推送，无需本技能基于提供的内容进行创作。视频用 `video` 模式直接传公网 URL，见下方。

统一入口：`push.js`（通道 `wechat` 或 `cloud`）。

### 推送 HTML（公众号）

AI 调用脚本：通道 `wechat`，首参为目标公众号 AppID，再为 `html`，再传与脚本同目录下的 HTML 文件名：

```bash
cd content-publish
node push.js wechat targetAppId html 你的文件.html
```



### 推送图片链接（公众号）

AI 调用脚本：通道 `wechat`，首参为目标公众号 AppID，再为 `img`，再为**图片链接的 JSON 数组字符串**（整段一个参数；Bash 与 PowerShell 都可用单引号包住整段 JSON，例如 `'["https://...","https://..."]'`）。再依次传标题、正文。

```bash
cd content-publish
node push.js wechat targetAppId img '["https://cdn.example.com/1.png","https://cdn.example.com/2.png"]' "标题" "正文"
```

**标题、正文**（命令行各一个参数，含空格时用英文双引号）：标题和正文可为空。

### 推送 HTML（云电脑）

通道 `cloud`，首参为云电脑 ID（`-` / `default` 表示用 `config.json` 里 `selected:true` 的云电脑），再为 `html`，再传 HTML 文件名；可选 `categoryId`（`article` 默认 / `newspic` / `video`）、`publishMode`（`draft` 默认）。

```bash
cd content-publish
node push.js cloud - html 你的文件.html article draft
```



### 推送图片链接（云电脑）

```bash
cd content-publish
node push.js cloud - img '["https://cdn.example.com/1.png"]' "标题" draft
```



### 推送视频（仅云电脑）

本技能**不生成**视频。可推送用户提供的**公网可访问**视频 URL（`https://…`）。公众号**不支持**视频。

需要视频 URL + 标题：

```bash
cd content-publish
node push.js cloud - video 'https://cdn.example.com/xxx.mp4' "标题" draft
# 或 JSON 数组：node push.js cloud - video '["https://cdn.example.com/xxx.mp4"]' "标题"
```

云电脑上须已绑定 `contentType=video` 的账号。对话里只有本地文件、没有公网 URL 时无法推送，须先上传拿到链接。

### 说明

**目标公众号 AppID**：若用户未声明具体要发送的公众号，则选择 `config.json` 中 `accounts` 中 `selected: true` 的账号（命令行可写 `default` 或 `-`）。  
**目标云电脑**：若用户未声明云电脑，则选择 `config.json` 中 `instances` 中 `selected: true` 的云电脑（命令行写 `-`）。  

- **接口说明**（供查阅）：请求地址为 `config.json` 中的 `apiBase`（缺省 `https://api.pcloud.ac.cn/openAccessService`），**POST**、`Content-Type: application/json`；公众号 Body 含 `action: sendToWechat`；云电脑含 `action: sendToCloud`。  
- **超时说明**：推送链路较长，若返回「超时」可视为已成功，勿重复狂推；请用户看服务通知、草稿箱或云电脑站点。

