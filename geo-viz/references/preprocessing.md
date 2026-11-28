# 预处理（GDAL / QGIS）

重的 GIS 处理放在 Remotion / 烘焙 / Three 之前做完，不要放进渲染循环。

| 工具 | 用途 |
| --- | --- |
| GDAL（`gdalwarp`、`gdal_translate`） | DEM 裁切、重采样、转格式 |
| PROJ | 坐标系 |
| QGIS | 检查与提取 |
| osmium / osmconvert（可选） | 按 bbox 切 OSM PBF |
| Tippecanoe（可选） | 矢量瓦片 |
| 路线平滑 | 弧长重采样、倒角或等价平滑；记录参数到 manifest |

## DEM

1. 先查缓存；没有再按本镜 `bbox` 取 Copernicus DEM（或备选 SRTM）。
2. 用 `gdalwarp` 裁切、重采样。
3. 导出 Three / 地形所需格式；垂直比例写入 `manifest`。

## 矢量

1. 按范围从 Natural Earth / geoBoundaries / Hydro* / Geofabrik / Overpass 取子集。
2. 输出 WGS84 GeoJSON（或目标格式）。
3. 需要时用 Turf 简化；路线还要做平滑。容差写入 `manifest`。

## 禁止

- 在 Remotion 或 HyperFrames 的逐帧循环里做重 GIS
- 混合坐标系却不记录
- 把未裁切的国家级 PBF 直接丢进作品仓库
