# 免 Key 地理数据目录

默认路径不要求 API Key / Token。**免 Key 不等于无限量、无 SLA、可任意抓取或免署名。** 每次按本片范围获取数据，并遵守数据集许可与服务 ToS。

先查 `storage.md` 缓存，命中即用。生产渲染优先本地数据 / PMTiles / 自托管；公共服务用于预览或小范围、合规请求，不作为批量出片的无限量后端。

## 底图、矢量和地图瓦片

| 需要 | 来源 | 如何使用 | 限制/提醒 |
| --- | --- | --- | --- |
| 全球矢量底图 | OpenFreeMap | 开发预览；符合 ToS 的用户主动离线下载；或采用获准数据包/自托管 | 公共服务 ToS（2026-11-24）：单次离线下载最多 3000 tiles 且不超过 50 MB，最多 4 并发，请求需唯一 User-Agent；更大需求须联系服务方。禁止后台自动拆单/循环抓取，不作为百万用户批量生产后端 |
| OSM 区域提取 | Geofabrik | <https://download.geofabrik.de> 按国家/地区取 PBF，再用 osmium/GDAL/ogr2ogr 裁切 | 大范围 OSM 数据优先 Geofabrik 或自托管；不要把公共 Overpass 当批量数据仓库 |
| OSM 指定小范围 | Overpass API | 仅小范围、低频、必要查询；结果保存本地 | 公共实例有资源限制，不能大规模循环查询；遵守实例政策 |
| 本地矢量瓦片归档 | PMTiles + Protomaps 工具 | <https://github.com/protomaps/PMTiles>；按区域准备归档，MapLibre 可读取 | 许可取决于被打包的数据；PMTiles 是容器格式，不会自动改变原始数据许可 |
| 全球国界、海岸和一级行政区 | Natural Earth | <https://www.naturalearthdata.com> | 适合小中尺度概览；按其公有领域说明保留出处 |
| 中国/全球行政区细分 | geoBoundaries | <https://www.geoboundaries.org> | 逐级核对版本和许可；中文名需独立核对 |

## 地形高程与地表影像

| 需要 | 来源 | 如何使用 | 限制/提醒 |
| --- | --- | --- | --- |
| MapLibre 三维地形瓦片 | Mapterhorn | <https://mapterhorn.com>；按 bbox 取 tile，或用 PMTiles archive + `pmtiles extract`，可以自托管 | 离线缓存/自托管取决于原始来源数据许可；查看 <https://mapterhorn.com/attribution> 并保存对应 attribution |
| 全球裸地高程瓦片 | AWS Terrain Tiles | <https://registry.opendata.aws/terrain-tiles/>；匿名 S3 访问，无需 AWS 账号 | 数据来源/署名按 Tilezen 项目说明执行；分辨率并非处处相同 |
| DSM 高程 | Copernicus DEM GLO-30 / GLO-90 | AWS Open Data，按 bbox 下载后 GDAL 裁切 | GLO-30 有区域缺失；GLO-90 用于更广覆盖。Copernicus DEM 是 DSM，树木/建筑可能影响高度，不应直接称裸地 DEM |
| 其他高程 | NASA SRTM / 公开区域 DEM | 按需从官方入口下载 | 个别服务入口需要账号/API Key；不能默认免 Key |
| 卫星概览纹理 | NASA Blue Marble / NASA GIBS | 下载适合范围/尺度的公开影像并本地化 | 概览图不是高清商业卫星街景；核对具体产品与署名要求 |
| 区域卫星纹理 | Copernicus Sentinel-2 | <https://dataspace.copernicus.eu>；按 bbox 获取后本地化 | 约 10 米级产品也不是街景；云量、拍摄时间与许可需核对，不能近距离冒充实拍 |
| 地表覆盖 | ESA WorldCover | <https://esa-worldcover.org> | 用于植被/水体/裸地分层设色；核对对应年份和产品许可 |
| 裸地高程补充 | FABDEM | <https://www.fabdem.org> | 可作为 Copernicus DEM 去除森林/建筑影响的补充；遵守 CC BY 4.0 署名 |
| 海底地形 | GEBCO | <https://www.gebco.net> | 按范围取；记录垂直基准，不要与陆地高程混用 |

Mapterhorn 官方说明允许按原始来源许可进行商业使用、离线缓存和自托管 PMTiles；它并不会为聚合数据额外增加一个统一许可。必须查实际可见数据源的归属和条款。批量使用建议通过合规区域数据包/PMTiles、自托管或获准的 CDN 分发，不要以瓦片接口可访问为由无限并发抓取。

## 面向规模化服务的供数原则

- 不要让每个用户任务都直接向 OpenFreeMap、Overpass、公共 OSRM 或其他公共 API 重复请求相同数据。
- 对重复使用的地区数据，采用有版本号的区域提取物/PMTiles/DEM 资产，由服务端共享缓存或自托管对象存储/CDN 分发；每个任务只读取所需范围和层级。
- 缓存键应包含数据集、版本/日期、区域或 bbox、zoom/LOD、CRS、处理参数和许可标识，避免不同来源或版本误命中。
- 服务端需有并发、配额、失败重试、来源熔断和缓存清理策略；不得通过轮换 User-Agent、代理或拆分请求规避供应商限制。
- 共享缓存是宿主平台的可选基础设施，不是本技能的硬依赖；没有共享缓存时仍可在单机作品目录工作，但不能据此宣称具备百万用户吞吐能力。

## 道路、建筑、水系

| 需要 | 来源 | 用法 |
| --- | --- | --- |
| 道路/铁路/道路等级 | OSM / Geofabrik | 按区域裁切；保留 ODbL 与署名要求 |
| 建筑足印 | OSM 或 Overture Maps | <https://overturemaps.org>；按 bbox/区域获取，导出 GeoJSON/GeoParquet/PMTiles |
| 河流 | HydroRIVERS | <https://www.hydrosheds.org>；按范围裁切，核对数据版本与许可 |
| 流域 | HydroBASINS | 同上 |
| 湖泊 | HydroLAKES | 同上 |
| 真实路线 | OSRM 自托管或用户提供的轨迹 | 公共 OSRM 服务只用于适量请求；大规模或批量项目自托管/预计算，路线需写入 manifest |
| 历史古道/古运河/古河道 | 经核验的公开历史数据 | 文献、可靠历史地图和可溯源矢量；禁止用现代 OSM 冒充历史路线 |

## 地球、宇宙与专题数据

| 需要 | 来源 | 说明 |
| --- | --- | --- |
| 地球白天/夜光/云 | NASA GIBS、Blue Marble、公开夜光 mosaics | 下载本地整幅纹理；不要在出帧时拉卫星瓦片 |
| 行星/卫星纹理 | NASA / Solar System Scope 等公开纹理 | 逐项核对分辨率和许可；优先适合镜头距离的 2K 纹理 |
| 地震 | USGS | 按时间与范围取公开事件数据 |
| 气候 | ERA5 / Copernicus CDS | 访问和许可按产品页面核对 |
| 火点 | NASA FIRMS | 按本片时段/范围取数；核对产品时效 |
| 人口 | WorldPop | 保留年份、空间分辨率和许可 |
| 经济 | World Bank Open Data | 保留指标、年份、单位和下载日期 |
| 天气/海洋 | NOAA 公开产品 | 核对产品尺度、时间和许可 |

## 数据获取原则

1. 先查 `geo/manifest.json` 和本机缓存，避免重复下载。
2. 只拉本片 bbox/路线范围及镜头所需的 zoom/LOD 层级。
3. 小范围交互查询用公共 API；批量、大范围、高重复使用则采用官方数据包、自托管或获准的 PMTiles 归档。
4. 任何瓦片或数据集都不得默认无限量下载；不得绕过服务限流、登录或许可。
5. 每个数据资产都记来源、数据时间/版本、许可、CRS、bbox、分辨率、垂直基准、归属要求。
