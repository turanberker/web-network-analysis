import type { Feature, FeatureCollection, LineString } from "geojson";

/** GeoServer WFS / backend'in döndürdüğü properties (sütun adları PostGIS'teki gibi). */
export interface PipeProperties {
  id: number;
  material: string | null;
  diameter_mm: number | null;
  /** PostGIS'te ST_Length(geom::geography) ile hesaplanır (metre). */
  length_m: number;
}

export type PipeFeature = Feature<LineString, PipeProperties>;
export type PipeCollection = FeatureCollection<LineString, PipeProperties>;

/** POST /api/pipes gövdesi. */
export interface NewPipe {
  material: string | null;
  diameterMm: number | null;
}
