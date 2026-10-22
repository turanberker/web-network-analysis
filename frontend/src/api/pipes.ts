import type { LatLngBounds } from "leaflet";
import { apiClient } from "./client";
import { GEOSERVER_WORKSPACE, WFS_URL, geoserverClient } from "./geoserver";
import type { NewPipe, PipeCollection, PipeFeature } from "../types/pipe";

export const PIPE_LAYER = `${GEOSERVER_WORKSPACE}:pipe`;

/**
 * WFS GetFeature: görünen alanla (bbox) kesişen boruları GeoJSON olarak ister.
 * Bir çizginin bbox'a girmesi için tamamen içinde olması gerekmez; GIST index ile && kesişimi yeterli.
 */
export async function fetchPipesInBounds(bounds: LatLngBounds): Promise<PipeCollection> {
  const { data } = await geoserverClient.get<PipeCollection>(WFS_URL, {
    params: {
      service: "WFS",
      version: "2.0.0",
      request: "GetFeature",
      typeNames: PIPE_LAYER,
      outputFormat: "application/json",
      srsName: "EPSG:4326",
      // WFS 2.0 + urn biçimli EPSG:4326: bbox sırası lat,lng.
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

/** Çizilen köşe noktalarını LineString olarak backend'e gönderir; uzunluğu PostGIS hesaplar. */
export async function createPipe(vertices: [number, number][], props: NewPipe): Promise<PipeFeature> {
  const { data } = await apiClient.post<PipeFeature>("/pipes", {
    type: "Feature",
    // Leaflet [lat, lng] -> GeoJSON [lng, lat]; yalnızca eksen sırası değişir.
    geometry: { type: "LineString", coordinates: vertices.map(([lat, lng]) => [lng, lat]) },
    properties: props,
  });
  return data;
}
