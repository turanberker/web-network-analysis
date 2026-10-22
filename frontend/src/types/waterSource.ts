import type { Feature, FeatureCollection, Point } from "geojson";

/** GeoServer WFS / backend'in döndürdüğü properties (sütun adları PostGIS'teki gibi). */
export interface WaterSourceProperties {
  id: number;
  name: string;
}

export type WaterSourceFeature = Feature<Point, WaterSourceProperties>;
export type WaterSourceCollection = FeatureCollection<Point, WaterSourceProperties>;

/** POST /api/water-sources gövdesi. */
export interface NewWaterSource {
  name: string;
}
