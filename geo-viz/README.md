# geo-viz 3.1.1

地理与空间可视化模块，供宿主在出现真实地理、位置或空间主镜头时按需加载。

- Remotion 地图镜头：复用 Remotion 官方 MapLibre 示例与 `remotion-maps` technique；默认固定地图板 + 动态叠层，逐帧相机运动须先通过短片测试。
- 地图/轻量三维地形/建筑：MapLibre 官方能力。
- 高质量地形主镜头：本地 DEM + BlenderGIS/Blender，按需预渲。
- 复杂轨迹：按需使用 deck.gl。
- 实验性项目和数据源限制见 `references/projects.md` 与 `references/data.md`。

本目录是技能和流程说明，不含第三方源码、不自动安装项目，也不代表已在目标环境通过 MP4 测试。