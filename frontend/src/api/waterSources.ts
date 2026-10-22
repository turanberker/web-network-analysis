import type { LatLngBounds } from "leaflet";
import { apiClient } from "./client";
import { GEOSERVER_WORKSPACE, WFS_URL, geoserverClient } from "./geoserver";
import type {
  NewWaterSource,
  WaterSourceCollection,
  WaterSourceFeature,
} from "../types/waterSource";

export const WATER_SOURCE_LAYER = `${GEOSERVER_WORKSPACE}:water_source`;

/**
 * WFS GetFeature: yalnızca görünen harita alanındaki (bbox) kaynakları GeoJSON olarak ister.
 * bbox'ı GeoServer PostGIS'e "geom && ST_MakeEnvelope(...)" olarak iletir; GIST index kullanılır.
 */
export async function fetchWaterSourcesInBounds(bounds: LatLngBounds): Promise<WaterSourceCollection> {
  const { data } = await geoserverClient.get<WaterSourceCollection>(WFS_URL, {
    params: {
      service: "WFS",
      version: "2.0.0",
      request: "GetFeature",
      typeNames: WATER_SOURCE_LAYER,
      outputFormat: "application/json",
      srsName: "EPSG:4326",
      // WFS 2.0 + EPSG:4326 eksen sırası lng,lat değil lat,lng'dir; urn biçimi bunu açıkça belirtir.
      bbox: [
        bounds.getSouth(),
        bounds.getWest(),
        bounds.getNorth(),
        bounds.getEast(),
        "urn:ogc:def:crs:EPSG::4326",
      ].join(","),
    },
  });
  return data;
}

/** Yazma işlemi backend REST API'sine gider (iş kuralları ve doğrulama orada). */
export async function createWaterSource(
  lat: number,
  lng: number,
  props: NewWaterSource,
): Promise<WaterSourceFeature> {
  const { data } = await apiClient.post<WaterSourceFeature>("/water-sources", {
    type: "Feature",
    // GeoJSON koordinat sırası [lng, lat]'tir.
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: props,
  });
  return data;
}
