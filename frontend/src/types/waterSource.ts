import type { Feature, FeatureCollection, Point } from "geojson";

export type WaterSourceType = "WELL" | "SPRING" | "DAM" | "RESERVOIR";

export const WATER_SOURCE_TYPE_LABELS: Record<WaterSourceType, string> = {
  WELL: "Kuyu",
  SPRING: "Pınar",
  DAM: "Baraj",
  RESERVOIR: "Depo",
};

/** GeoServer WFS / backend'in döndürdüğü properties (sütun adları PostGIS'teki gibi). */
export interface WaterSourceProperties {
  id: number;
  name: string;
  source_type: WaterSourceType;
  capacity_m3_per_day: number | null;
}

export type WaterSourceFeature = Feature<Point, WaterSourceProperties>;
export type WaterSourceCollection = FeatureCollection<Point, WaterSourceProperties>;

/** POST /api/water-sources gövdesi. */
export interface NewWaterSource {
  name: string;
  sourceType: WaterSourceType;
  capacityM3PerDay: number | null;
}
