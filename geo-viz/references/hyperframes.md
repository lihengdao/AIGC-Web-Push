# HyperFrames

工作区按宿主约定。硬约束：渲染时不访问网络、seek 可复现、资源在 `assets/`。

## 平面地图 / 真实地点（默认）

1. 阅读 HyperFrames 中与 Maps 相关的说明。
2. 用 `bake-basemap` 把底图烘焙为 `assets/<name>.mp4` 和 `<name>-coords.json`。烘焙前确认该路径上的瓦片已经完整，不要把缺瓦的烘焙结果留下。
3. 播放这块烘焙好的底图；边界、路线、标签用 SVG 按坐标叠在上面，相机需要移动时也只在已烘焙的范围内做。
4. 画面署名，必要时加 `data-layout-ignore`。

### 推荐 `STYLE`（免 Key）

| 值 | 含义 |
| --- | --- |
| `liberty` / `openfreemap` | OpenFreeMap liberty（默认） |
| `positron` / `bright` | 其他 OpenFreeMap 样式 |
| `gibs-bluemarble` | NASA GIBS 概览影像 |
| `dark` / `light` | Carto 备选 |
| 自托管 URL | 自托管 XYZ 或 style JSON |

不要把 Esri / 商业卫星样式当作默认。一次只烘焙一条，并把烘焙结果纳入项目，供离线渲染。

```bash
NAME=route-a STYLE=liberty CENTER="116.4,39.9" ZSTART=3 ZEND=10 \
  FPS=30 DUR=6 HOLD=0.55 OUT=./assets \
  node .cursor/skills/hyperframes/scripts/bake-basemap.mjs
```

## 三维

Three.js 通过 `hf-seek` / `__hf.buildReady` 驱动。DEM 与模型必须已经在 `assets/` 本地。过重的镜头先用 Blender 渲成 MP4 再切入。

## 数据

与 Remotion 使用同一份 `data.md`。当前片子优先用项目里的 `assets/geo/` 本地副本。

立体地形主镜头若按 `quality.md` 用 Blender 预渲，把已渲好的序列或视频合成进时间线即可；底图规则不变：只播放已烘焙的完整底图。
