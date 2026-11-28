# 场景 → 现成项目 → 引擎 → 数据

本表是默认路线。先读 `projects.md`，优先复用完整工程和官方示例；不要为同类镜头重新实现已有功能。输入遵守 `props-contract.md`。数据先查作品 `geo/` 缓存。

| 场景 | 首选现成实现 | 引擎/适配 | 数据 |
| --- | --- | --- | --- |
| 国家/省份/城市定位 | Remotion 官方 MapLibre 示例（默认固定地图板 + 动态叠层；需要跟拍时先做 shimmer 测试） | MapLibre 固定地图板 + Remotion 动态叠层；需镜头运动时才按帧控制相机 | OpenFreeMap 本地化/PMTiles 或本地 GeoJSON；行政区数据 |
| 路线生长、移动点、镜头沿路线 | Remotion 官方 MapLibre 示例（默认固定地图板 + 动态叠层；需要跟拍时先做 shimmer 测试） | MapLibre + Turf；`drawProgress` 由帧计算；相机默认固定 | 真实路线 GeoJSON；路线缺失时才用 OSRM 预计算 |
| 平面行政区填色 | MapLibre 官方示例或 D3 Geo/TopoJSON | MapLibre 或 `d3-geo` | Natural Earth / geoBoundaries |
| 3D 地形地图（中远景） | MapLibre 官方 3D Terrain 示例 | MapLibre raster-dem + hillshade + 帧驱动相机 | Mapterhorn 本地瓦片/PMTiles 或本地 DEM |
| 山脉、峡谷、河谷电影级主镜头 | BlenderGIS 导入已准备 DEM；PTerrain 仅作候选 | Blender 材质、灯光、阴影和相机预渲；Remotion 合成 | Copernicus/AWS Terrain Tiles/FABDEM + Sentinel-2/WorldCover |
| 地形剖面 | GDAL 裁切 DEM + Three.js/Blender | 按帧揭示剖面；标注垂直夸张 | 同一份本地 DEM，记录垂直基准与 Z exaggeration |
| 三维城市建筑体量 | MapLibre 3D Buildings 官方示例 | fill-extrusion；复杂镜头可用 Three.js/three-map-terrain（待验证） | OSM/Overture 建筑足印和高度属性 |
| 样式化地球与大圆航线 | MapLibre Globe 或 Remotion Three.js 示例 + Turf `greatCircle` | 所有旋转/弧进度由当前帧控制 | Natural Earth 国界、本地 Blue Marble 纹理 |
| 卫星地球/昼夜/云层 | Three.js 本地球体纹理；必要时 Cesium 本地影像 | Three.js / Cesium | NASA Blue Marble / GIBS 公开纹理 |
| 大量弧线、行程尾迹、热力 | deck.gl TripsLayer/ArcLayer/HeatmapLayer | deck.gl + MapLibre；时间来自帧 | 用户轨迹或公开数据，保留时间和来源 |
| 河流/流域 | MapLibre + HydroRIVERS/HydroBASINS | 河网线与流域面按帧揭示 | HydroSHEDS 数据；水面另用多边形 |
| 行人/驾车跟随 | MapLibre 路线/Three.js 标记；必要时独立 R3F 场景 | Turf 重采样/平滑，镜头阻尼由帧计算 | 预计算 OSRM 路线或用户真实轨迹 |
| 太空俯冲 | Cesium 本地影像，或 Three.js 样式化地球 | 关闭内置时钟，帧驱动相机 | 本地影像；无足够高分辨率数据时在尺度层级之间切换 |
| 太阳系/地月/行星 | Three.js 官方基础网格与本地纹理 | 示意性按帧轨道/相机，不伪装真实星历 | 公开行星纹理 |
| 历史疆域/古道/古运河 | MapLibre + 经核验历史 GeoJSON | 以已验证历史边界/路线做比较和揭示 | 史料、公开历史地图、可追溯矢量；不得用现代 OSM 替代 |

## 选择顺序

1. 地图/路线：Remotion 官方 MapLibre 示例（默认固定地图板 + 动态叠层；需跟拍时先做 shimmer 测试） → MapLibre 官方例子 → 仅写替换数据和帧驱动薄适配。
2. 三维地形：先评估 MapLibre Terrain 能否达到目标；需要电影级光影就 BlenderGIS + 本地 DEM 预渲。
3. 大量轨迹：需要时才加 deck.gl。
4. 特定地形库/插件：three-map-terrain、PTerrain 先测后用。
5. 其他成熟度较低的开源视频工作台只作镜头参考，不直接替代 Remotion。
