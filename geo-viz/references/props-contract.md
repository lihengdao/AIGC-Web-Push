# 地理场景输入约定

同一套场景实现服务不同地区；替换坐标、数据、语言和样式，不把单个国家写死在逻辑中。

## 坐标与单位

| 项 | 约定 |
| --- | --- |
| 水平坐标 | WGS84；GeoJSON RFC 7946 使用 `[longitude, latitude]` |
| bbox | `[west, south, east, north]`，坐标系必须明确 |
| 高程 | 米；垂直基准记录在 manifest |
| 分析长度 | 米；动画进度可归一化为 0–1 |
| 时间 | Remotion 整数帧；HyperFrames seek 时间 |

## 共用输入

```ts
type GeoLocale = {
  language: string; // BCP 47，例如 zh-CN、en、pt-BR
  labelsFrom?: "data" | "props" | "none";
};

type GeoAssets = {
  /** 浏览器可访问的静态资源 URL/服务路径；不是宿主机任意绝对路径 */
  assetsBase: string;
  attribution: string[];
};

type GeoCamera = {
  center: [lng: number, lat: number];
  zoomStart: number;
  zoomEnd: number;
  pitch?: number;
  bearing?: number;
  from?: [lng: number, lat: number];
};

type GeoExtent = {
  bbox: [west: number, south: number, east: number, north: number];
  /** 仅作为数据检索/缓存元数据，不可据此硬编码地理规则 */
  regionCode?: string;
};
```

## 场景输入示例

```ts
type MapRouteSceneProps = GeoExtent & GeoCamera & GeoAssets & {
  locale: GeoLocale;
  styleUrl?: string; // 本地或获准的 MapLibre style JSON
  stylePreset?: "liberty" | "positron" | "bright" | "local";
  route?: GeoJSON.FeatureCollection;
  points?: GeoJSON.FeatureCollection;
  borders?: GeoJSON.FeatureCollection;
  drawProgress: number; // 0–1，由当前帧计算
  headingUp?: boolean; // 默认北朝上
};

type TerrainProfileProps = GeoExtent & GeoAssets & {
  demUrl: string; // 浏览器可访问的本地/自托管 DEM 资源
  profileLine: GeoJSON.Feature;
  exaggerateZ?: number;
  cutProgress: number; // 0–1
};

type GlobeFlightProps = GeoCamera & GeoAssets & {
  terrainSource: "none" | "local-dem" | "mapterhorn";
  basemap: "none" | "openfreemap" | "local-vector";
  surfaceTexture: "none" | "blue-marble" | "gibs-local" | "local-image";
  route?: GeoJSON.Feature;
  flyProgress: number; // 0–1
};

type FootprintMassingProps = GeoExtent & GeoCamera & GeoAssets & {
  locale: GeoLocale;
  footprints: GeoJSON.FeatureCollection;
  growProgress: number; // 0–1
};

type TransitAtoBProps = GeoExtent & GeoCamera & GeoAssets & {
  locale: GeoLocale;
  route: GeoJSON.Feature; // 已验证并平滑的线
  alongTrack: number; // 0–1 弧长进度
  mode: "chase-3d" | "planar-nav";
};
```

以上是场景输入约定示例，不表示技能包内已经包含这些 TSX 组件。实际实现必须使用浏览器可访问的资源路径；Node/宿主机文件路径需通过 Remotion `staticFile()`、静态目录或获准资源服务暴露后再传给浏览器。

## Manifest

不要只用一个全局 `license` 字段覆盖所有混合数据。每个资产单独记录来源和许可，例如：

```json
{
  "assets": [
    {
      "id": "dem-main",
      "source": "dataset/provider",
      "versionOrDate": "YYYY-MM-DD or release",
      "license": "license identifier and URL",
      "attribution": "required credit",
      "crs": "EPSG:4326",
      "bbox": [0, 0, 1, 1],
      "resolution": "source-reported resolution",
      "verticalDatum": "when applicable"
    }
  ]
}
```

不要将全球 DEM / OSM / PMTiles 仓库打进技能包或 npm 包。
