# 现成项目与官方示例目录

**审查日期：2026-11-28。** 这里不是 Star 排行榜，而是按“对 Remotion 出片的直接帮助、可复用程度、维护/成熟度、数据和许可风险”筛选。仓库状态会变化，使用前仍需查看最新 README、release、license 和数据源条款。

## A. 默认采用：直接解决主要问题

### 1. Remotion 官方 MapLibre 示例 — 地图镜头首选模板

- 仓库：<https://github.com/remotion-dev/maplibre-example>
- 官方说明：<https://github.com/remotion-dev/maplibre-example/blob/main/README.md>
- 适用：平面地图、镜头沿路线运动、GeoJSON 路线逐帧绘制、移动点沿路线前进。
- 已展示的关键实现：Remotion Composition 内创建 MapLibre；Turf 计算路线距离、裁切和沿线位置；使用 `delayRender()` / `continueRender()` 等资源就绪；关闭地图交互和淡入动画；启用 ANGLE WebGL 渲染器；为 GPU 地图渲染使用 `--concurrency=1`。
- 使用方式：将其视为**可运行的起始工程/实现模板**，克隆后检查依赖、配置和源码，再复制或合并需要的实现到当前作品。它不是一个 `npm install remotion-maplibre-example` 的通用组件包。
- 同时读取 Remotion 官方 `remotion-maps` 的 MapLibre `TECHNIQUE.md`；当前官方技术说明建议默认优先固定地图底板并动画化叠层，只有短 MP4 证明稳定后才逐帧移动相机。
- 边界：README 示例使用 OpenFreeMap 公共样式，适合开发验证，不代表公共底图可无限量用于批量生产。大范围与重复生产需合法本地数据、PMTiles 或获准自托管。
- 许可：不要仅凭它属于 Remotion 官方组织就推断全部源码和 Remotion 商业授权条件；复制/分发前检查仓库当前许可证，并检查 Remotion 自身商业许可要求。

### 2. MapLibre GL JS 官方示例 — 地图、地形、建筑

- 仓库：<https://github.com/maplibre/maplibre-gl-js>
- 文档：<https://maplibre.org/maplibre-gl-js/docs/>
- 3D 地形：<https://maplibre.org/maplibre-gl-js/docs/examples/3d-terrain/>
- 3D 建筑：<https://maplibre.org/maplibre-gl-js/docs/examples/3d-buildings/>
- 适用：底图、行政区、道路、水系、地形倾斜、hillshade、建筑挤出、Globe 投影和地图投影。
- 使用方式：从官方示例里复制对应 source/layer/terrain 配置；Remotion 侧只接管当前帧对应的相机、路线进度、图层状态和标注。不要把整段示例当普通网页动画直接录屏。
- 注意：MapLibre 引擎具备相关能力，不代表 Remotion 官方 2D MapLibre technique 自带三维地形或建筑模型；必须按本镜选择相应地图数据源和图层。
- 边界：地图引擎不提供高分辨率真实地表影像；三维地形效果受 DEM 精度、瓦片覆盖和当前相机距离限制。在线演示数据不自动等于可离线分发的数据。

### 3. BlenderGIS — 重型地理数据进入 Blender 的成熟桥梁

- 仓库：<https://github.com/domlysz/BlenderGIS>
- 适用：将本地 GeoTIFF / DEM、Shapefile、OSM XML、栅格影像和矢量数据导入 Blender，建立地理参考场景、地形网格并配合 Blender 材质、灯光、阴影和相机渲染。
- 使用方式：默认先用 GDAL/QGIS 下载、裁切和检查数据，再把本地数据导入 BlenderGIS。把 Blender 工程和渲染序列放在当前作品目录，最后由 Remotion 合成。
- 边界：BlenderGIS 是 GIS 数据导入/处理插件，不是自动生成电影级镜头的按钮。仓库说明中提到 OpenTopography 服务需 API Key；免 Key 工作流应避免依赖该在线入口，优先导入已获得的本地数据。
- 成熟度：社区规模较大、覆盖多种 GIS 数据格式；但仍须针对当前 Blender 版本测试插件兼容性。

## B. 按需采用：专业图层或数据量较大时

### 4. deck.gl — 轨迹、弧线、热力等高密度地理图层

- 仓库：<https://github.com/visgl/deck.gl>
- 文档：<https://deck.gl/>
- 适用：`ArcLayer`、`TripsLayer`、`HeatmapLayer` 等大规模轨迹和流动数据可视化。
- 与 Remotion 配合：把 `currentTime`、`getTimestamps` 或图层数据进度从 `useCurrentFrame()` 推导；确保同一帧输入产生相同画面。
- 边界：deck.gl 是图层渲染系统，不是完整地图底图或视频时间轴。通常叠在 MapLibre 上；中文标签优先使用 MapLibre/HTML/SVG，须检查清晰度。

### 5. PTerrain — Blender 地形生成插件候选

- 项目：<https://github.com/henrike586/pterrain>
- Blender Extensions：<https://extensions.blender.org/add-ons/pterrain/>
- 适用：在 Blender 中按位置/范围创建真实地形的快捷方案。
- 审查时可见信息：扩展页显示 1.0.4 版本、GPL-3.0-or-later、Blender 4.2.21 LTS 及更新版本兼容；插件请求文件和网络权限，用于保存下载瓦片及获取 DEM/地图瓦片。
- 使用方式：作为 BlenderGIS 之外的候选，先用目标地区做一个小范围测试，再决定是否纳入制作流程。
- 边界：不要把“插件可下载 DEM”理解为所有数据源均免 Key、免费、可商用或全球同精度。使用前核对它实际选择的数据服务、许可、访问限制和缓存策略。

## C. 实验性候选：不可作为默认生产底座

### 6. three-map-terrain — Three.js / React Three Fiber 真实地形库

- 仓库：<https://github.com/whidrubeld/three-map-terrain>
- 在线示例：<https://whidrubeld.github.io/three-map-terrain/>
- 适用：地形高程、影像纹理、OSM 建筑、道路、桥梁、水体、植被、LOD，以及 GPX 轨迹和 GLB/STL/USDZ 导出。
- 仓库信息：MIT；审查时约 20 stars、5 forks，仓库提供 WebGL/WebGPU 相关端到端测试和 React Three Fiber 示例。
- 使用方式：只在需要“一套场景组合地形+路网+建筑”的镜头上做独立验证。检查依赖树、瓦片源、离线缓存、加载时序，并验证 Remotion 每帧渲染可复现。
- 结论：功能方向很接近需求，但社区采用规模仍小。不得直接将其列为所有地形镜头的强制依赖或默认生产引擎。若稳定性或集成成本不理想，回退到 MapLibre Terrain 或 BlenderGIS。

### 7. three-geospatial — Three.js 地理渲染增强

- 仓库：<https://github.com/takram-design-engineering/three-geospatial>
- 适用：大气散射、云层和地理渲染增强。
- 当前项目自述将 core/effects 标为 Alpha、atmosphere/clouds 标为 Beta，并说明 WebGPU API 正在重构；部分包可能与当前 Three.js / Remotion WebGL 组合存在兼容变化。
- 结论：仅在特定镜头有明显收益且已通过当前环境测试时选用；不得写成必装，不得作为地形数据或地图瓦片的替代品。

## D. 独立工作台：借鉴镜头和画面，不替代 Remotion 时间轴

### 8. OpenAnimateMyMaps

- 仓库：<https://github.com/bouclem/OpenAnimateMyMaps>
- 适用：研究地图镜头 keyframe、fly-to/orbit/sweep、区域高亮、标注、16:9/9:16 以及 MP4 导出工作流。
- 结论：是独立浏览器地图动画工作台，MIT；不是 Remotion 组件。需要复用时先检查导出的数据/画面是否能合规进入当前工程，以及它使用的底图服务许可。

### 9. Video-GeoMap-Animator

- 仓库：<https://github.com/tri-ctrl/Video-GeoMap-Animator>
- 在线应用：<https://tri-ctrl.github.io/Video-GeoMap-Animator/>
- 适用：研究从空间建立、地点定位、航线、GPX/KML/GeoJSON 到摄像机关键帧和 MP4 导出的整套工作流。
- 结论：独立应用，MIT 代码许可；部分底图/影像另有许可，仓库明确提醒 Sentinel-2 cloudless 等底图可能为非商业许可。只把它当镜头设计参考或经许可的独立导出工具，不默认把其全部影像带入商业片。

### 10. GlobeStudio

- 仓库：<https://github.com/alevizio/globestudio>
- 适用：点阵/线框地球、样式化地球、地图视觉方案，支持 PNG/SVG/GLB/WebM/MP4/GIF 等导出。
- 结论：适合研究片头、转场和样式化地球资产；并非真实地形/卫星底图引擎。导出为独立素材后再合成；地图数据的第三方许可仍需核对，不能因代码 MIT 就忽略数据许可。

### 11. map-trip-video

- 仓库：<https://github.com/Calm-Rock/map-trip-video>
- 适用：学习 D3 地理投影、球面航线、Remotion + Three.js 场景切换和确定性随机数。
- 结论：README 描述为 30 秒演示项目，仓库历史很小；只参考思路，不作为生产级模板。

## 选型优先级（不可颠倒）

1. **先找现成模板：** Remotion 地图镜头先看 `remotion-dev/maplibre-example`。
2. **再用官方引擎能力：** MapLibre 官方 terrain/building/globe 示例；复杂图层才加 deck.gl。
3. **高质量真实地形：** 本地 DEM + BlenderGIS/Blender 预渲。
4. **实验项目：** three-map-terrain、PTerrain、three-geospatial 先测后用，不默认安装。
5. **独立工作台：** OpenAnimateMyMaps、Video-GeoMap-Animator、GlobeStudio 用于参考或合规导出，不取代 Remotion 的时间轴。

## Remotion 官方地图技能补充

- 官方技能：<https://github.com/remotion-dev/remotion/tree/main/packages/skills/skills/remotion-maps>
- MapLibre technique：<https://github.com/remotion-dev/remotion/blob/main/packages/skills/skills/remotion-maps/techniques/maplibre/TECHNIQUE.md>
- 先检查当前 Agent 环境是否已有 `remotion-maps`；已安装则读取对应 MapLibre technique，不要重复安装。未安装时直接读取官方文档/技术文件。
- 该技术文件要求 `preserveDrawingBuffer: true`、`--gl=angle`、资源加载和每帧更新使用 `delayRender()` / `continueRender()`、初始帧先完成 source/layer 与相机设置后等待 `idle`；并提醒不要随意添加 `map.remove()` cleanup。
- 官方建议地图默认保持静态；逐帧相机运动先导出短 MP4 检查 shimmer。地图、路线、标记和标签可以先通过 GeoJSON source/layer 动画完成。

## 项目采用前的最低验证

- 能否在当前服务器/容器安装，是否与当前 Node、React、Three.js、Remotion、Blender 版本兼容。
- 数据源是否免 Key、是否有调用/下载限制、是否允许离线缓存及商业用途。
- 是否能在渲染前把数据完整落到本地，避免逐帧网络请求。
- 同一帧重复渲染结果是否一致；不同帧之间是否无闪烁、无加载竞态。
- 能否实际导出目标分辨率 MP4；至少检查开场、中间、结束帧并听/看最终文件。
- 检查仓库代码许可、数据许可、归属标注与宿主（例如 Remotion）的独立商业许可。

未完成以上验证前，状态只能写“候选/待验证”，不得写“已集成/稳定可用”。
