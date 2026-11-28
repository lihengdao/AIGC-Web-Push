# 复用哪些开源组件

**先使用已有完整项目和官方示例，再调用底层库；禁止把已有能力重新手写。** 完整候选与成熟度见 `projects.md`。

| 要做的事 | 优先复用 | 当前工程只需要做什么 | 不要做什么 |
| --- | --- | --- | --- |
| Remotion 平面地图镜头 | `remotion-dev/maplibre-example` | 迁移示例工程中的 MapLibre/Remotion 同步方式，替换路线、数据、画面风格 | 不要从空白项目重新写 MapLibre 生命周期与 Remotion 同步 |
| 地图相机、道路、边界、路线 | `maplibre-gl` 官方示例 + `@turf/turf` | 按帧设置相机、路线进度、图层可见状态 | 不要自写地图渲染器、瓦片读取器或路径几何库 |
| 三维地形地图 | MapLibre GL JS `3d-terrain` 示例 + 本地/可缓存 DEM | 选择 bbox、相机、terrain exaggeration、hillshade 和样式 | 不要把在线演示瓦片当成可任意批量下载的生产素材 |
| 三维建筑体量 | MapLibre `fill-extrusion` 官方示例；必要时 OSM/Overture 足印 | 选择建筑字段、颜色、高度和相机 | 不要把 LOD1 体块说成真实立面/数字孪生 |
| 高质量地形主镜头 | 本地 DEM + GDAL/QGIS + BlenderGIS + Blender | 裁切、检查 DEM/纹理、构图、材质、灯光、阴影、相机、预渲与合成 | 不要在 Remotion 帧循环中处理 DEM 或实时下载数据 |
| 快速复杂地形候选 | `three-map-terrain`；Blender 插件 PTerrain | 先做独立 POC，验证加载、来源、缓存和帧确定性 | 未验证前不要列为默认依赖 |
| 三维场景、相机、网格、材质 | `three` + `@remotion/three` / React Three Fiber | 把当前帧交给相机和进度；构图、灯光与标签 | 不要重复造通用 Three.js 场景框架 |
| 行政区投影、平面填色 | `d3-geo` + 已准备好的 GeoJSON/TopoJSON | 选投影、绑定数据、按帧高亮 | 不要为每个国家复制一套组件 |
| 大圆航线 | `@turf/turf` 的 `greatCircle` | 起终点、按帧进度、样式 | 不要为普通航线额外引入重复算法库或手算球面公式 |
| 沿线取点、长度、简化、空间运算 | `@turf/turf` | 把计算结果交给路线图层/跟拍镜头 | 不要手写常见空间几何算法 |
| 大量弧线、行程尾迹、热力 | `deck.gl` ArcLayer / TripsLayer / HeatmapLayer | 从帧号推导图层时间/进度，底图用 MapLibre | 不要把 deck.gl 当完整底图或时间轴 |
| 椭球地球俯冲 | CesiumJS，本地影像/地形 | 关闭默认墙钟动画，按帧设置相机，等待资源加载 | 不要依赖 Cesium ion / 商业 3D Tiles 作为默认资源 |
| 样式化地球 | Three.js 球体 + 公开本地纹理 + Turf `greatCircle`；也可用 MapLibre Globe | 当前帧驱动旋转、航线和相机 | 不要用 `three-globe` / `globe.gl` 内置 tween 或时钟驱动成片 |
| 大气/云层特效 | Three.js 自身能力；`three-geospatial` 作为可选增强 | 先确认当前 Three.js、WebGL/WebGPU 与插件版本兼容 | 不要把 Alpha/Beta 包写成强制依赖 |
| 定位、钉点、地名标签 | MapLibre 符号/文本图层；3D 场景用 Three.js 标签 | 坐标、样式、避让、语言 | 中文标签不要因追求 GPU 图层而牺牲清晰度 |
| 行走/驾车路线 | OSRM（OSM 路网）或用户提供的真实轨迹 | 保存路线 GeoJSON，Turf 重采样/平滑 | 不要手拼碎路段；OSRM 公共服务不可当无限量批处理 API |
| 河流、流域、海岸 | MapLibre 线/面图层 + HydroSHEDS / Natural Earth | 按帧揭示河网/流域，水面使用面数据 | 不要把河道中心线伪装成真实水面 |
| 平面底图预烘焙（HyperFrames） | HyperFrames `bake-basemap`；本地矢量/PMTiles | 只播放完整预烘焙底图 | 不要在 HyperFrames 出帧时请求网络瓦片 |

## 只写薄适配层

允许编写：

- `useCurrentFrame()` / seek 到 `drawProgress`、`alongTrack`、`growProgress`、相机参数。
- 替换示例中的路线、坐标、GeoJSON、bbox、地名和语言。
- 竖屏/横屏构图、标签避让、字幕、署名和图层顺序。
- 按范围取数、缓存、生成 `manifest.json`。
- 跟拍阻尼、前视方向、镜头关键帧等镜头参数。
- 将 Blender 已渲染的序列或视频合成进 Remotion 时间线。

不允许：

- 自己实现瓦片引擎、地图投影库、椭球地球、大圆路线公式、DEM 解码/重采样、通用 GIS 读写器。
- 每次都从空白项目创建 MapLibre + Remotion 集成；先使用官方示例。
- 为每个国家或城市复制一套不同的代码和视觉模板。
- 未经许可爬取/缓存商业地图数据。

**凡是准备自己写的功能，先在 `projects.md` 与对应官方文档里搜索一次。** 找到已有实现，就复用而不是重写。
