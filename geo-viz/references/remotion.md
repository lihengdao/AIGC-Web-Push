# Remotion 地理镜头

在当前作品的 `remotion/` 工程中实现。Remotion 负责唯一时间轴；地图引擎不自行播放动画。

## 实施前先读官方技术

- Remotion Maps 文档：<https://www.remotion.dev/docs/maps>
- Remotion `remotion-maps` 技能：<https://github.com/remotion-dev/remotion/tree/main/packages/skills/skills/remotion-maps>
- MapLibre technique：<https://github.com/remotion-dev/remotion/blob/main/packages/skills/skills/remotion-maps/techniques/maplibre/TECHNIQUE.md>

当前环境已经有 `remotion-maps` 时，直接读取其 MapLibre technique；没有时读取上述官方文档，不要为了每条作品重复安装技能。

## 选择合适的地图动画方式

1. **默认优先固定地图底板 + 动态图层。** 使用 GeoJSON source/layer 绘制路线、点位、区域高亮和标签；用 Remotion 帧控制数据进度。静态地图板可以减少瓦片加载抖动和逐帧相机 shimmer。
2. **需要镜头跟随时才移动地图相机。** 可参考 `remotion-dev/maplibre-example`，但先导出短 MP4，逐帧检查闪烁、抖动、文字重排和地图重绘痕迹；验证通过后才扩展到完整片长。
3. **真正的三维地形/山体主镜头**不要误用 2D 地图相机动画代替。根据 `scenes.md` 使用 MapLibre Terrain 或 Blender 预渲。

## Remotion + MapLibre 必要实现要点

- 地图只初始化一次；动画值由 `useCurrentFrame()` 计算，禁止墙钟、`requestAnimationFrame`、CSS transition 或 MapLibre 自带播放时钟。
- MapLibre 初始化设置 `interactive: false`、`fadeDuration: 0`，并设置 `canvasContextAttributes: { preserveDrawingBuffer: true }`。
- 使用 `delayRender()` / `continueRender()` 等待地图初始化、source/layer 添加和每帧画面更新；初始帧先应用相机，再等待 `idle` 后继续渲染。
- 每帧更新相机或 source 后，等待该帧更新完成（例如等待 `idle` 并触发 repaint），不得让 Remotion 截取尚未完成的 WebGL 画面。
- **不要照搬通用 React 组件的 cleanup 模式随意调用 `map.remove()`**；Remotion 官方 MapLibre technique 特别提示它可能干扰渲染生命周期。需要释放资源时，以当前官方 technique 和实际渲染测试为准。
- WebGL 地图渲染使用 `--gl=angle`，默认从 `--concurrency=1` 验证；确认稳定后再按机器资源和测试结果提高并发。
- MapLibre 自带 TypeScript 类型，不要额外安装 `@types/maplibre-gl`。
- 地图 worker、样式、瓦片、DEM、纹理和模型必须固定版本并预先可访问。生产/离线渲染不要依赖每次启动时从 unpkg 等第三方 CDN 临时下载 worker；优先随工程本地打包或部署到获准的静态资源源。
- 地图服务要求的 attribution 必须保留；不能因为隐藏 `attributionControl` 就省略许可证要求。

## 起始工程

第一选择：<https://github.com/remotion-dev/maplibre-example>。

它是可运行的 Remotion + MapLibre 起始工程，不是单独 npm 组件。先克隆并读 README 与源码，再复制/合并所需实现到当前作品。它展示了路线逐帧揭示、Turf 沿线取点、Remotion 资源等待和 ANGLE 渲染等机制。示例中的公开样式仅用于演示，不代表公共瓦片服务可无限量用于生产。

## 按需依赖

只安装本镜所需依赖，不要将所有地理库装入每个作品。

| 包/工具 | 用途 |
| --- | --- |
| `maplibre-gl` | 地图、行政区、路线、地形图层、建筑挤出、Globe 投影 |
| `@turf/turf` | 路线长度、greatCircle、沿线取点、裁切、距离、缓冲区和空间运算 |
| `three` + `@remotion/three` | 地球球体、三维地理图形和必要的 3D 场景 |
| `d3-geo` / `topojson-client` | 投影、TopoJSON 转换与平面行政区 |
| deck.gl 按需图层 | 大量轨迹、弧线、热力数据；分别从对应图层包安装 |
| `cesium` | 只有确实需要椭球飞越/本地三维地形时才引入；先验证 headless 渲染和本地数据 |
| GDAL / QGIS / BlenderGIS | 渲染前数据裁切、投影、检查和地形场景准备，不在逐帧循环中运行 |

不要依赖需要商业密钥的 Mapbox GL JS 作为默认方案。不要用 `three-globe` / `globe.gl` 内置时钟驱动成片动画。

## 三维地形路线

1. 先判断 MapLibre 官方 3D Terrain 是否适合该镜头与数据精度：<https://maplibre.org/maplibre-gl-js/docs/examples/3d-terrain/>。
2. DEM、地表影像和矢量图层在渲染前准备到本地或获准的自托管服务；相机距离必须符合数据实际分辨率。
3. 若需要更明确的山体光影和电影感，使用 `GDAL/QGIS → 本地 DEM/纹理 → BlenderGIS 导入 → Blender 材质/灯光/相机 → 预渲序列 → Remotion 合成`。
4. `three-map-terrain` 只作实验候选；先独立验证依赖、数据源、离线行为和 Remotion 帧确定性，不得直接假设可无缝嵌入。
5. PTerrain 是可选 Blender 插件；使用前检查 Blender 兼容性、数据源、网络权限和许可证。

## 确定性与工作目录

- 相机、路线进度、挤出进度、跟随位置都由整数帧计算；同一帧输入必须得到相同画面。
- 渲染前将底图、纹理、DEM、路线和模型放入作品 `geo/`，并记录 manifest。
- 禁止在 frame loop 中发网络请求、下载 DEM、做 GDAL 重投影或执行大规模 OSM 查询。
- MapLibre 使用本地 source 优先；`jumpTo` 后等待 `idle`/对应 source 就绪；关闭不必要的淡入转场，避免逐帧瓦片闪烁。
- 至少做同帧重复渲染和短片重复渲染，检查纹理、文字、瓦片、随机效果是否一致。

## 作品目录

```text
works/<日期>-<主题>/
  remotion/
  geo/
    manifest.json
    dem/
    vectors/
    routes/
    imagery/
    pmtiles/
  blender/
  pre-render/
  audio/
  out/<主题>.mp4
```

`assetsBase` 必须指向浏览器在渲染时可读取的 URL/静态资源路径，不是任意宿主机绝对文件路径。

## 商业与许可证

Remotion、Remotion 示例仓库、MapLibre、地图服务、数据集和第三方插件分别有自己的代码许可、服务条款与署名要求。逐项核对；免 Key 不等于免许可或允许批量再分发。
