import { useCallback, useEffect, useState } from "react";
import { Polyline, Popup, useMap, useMapEvents } from "react-leaflet";
import { fetchPipesInBounds } from "../../api/pipes";
import type { PipeFeature } from "../../types/pipe";

interface Props {
  /** Değiştiğinde katman yeniden yüklenir (yeni boru eklendikten sonra). */
  reloadKey: number;
}

/** WFS katmanı: borular vektör olarak gelir; tıklanınca malzeme, çap ve uzunluk gösterilir. */
export default function PipeWfsLayer({ reloadKey }: Props) {
  const map = useMap();
  const [features, setFeatures] = useState<PipeFeature[]>([]);

  const load = useCallback(() => {
    fetchPipesInBounds(map.getBounds())
      .then((collection) => setFeatures(collection.features))
      .catch((error: Error) => console.error("Boru WFS yüklenemedi:", error.message));
  }, [map]);

  useEffect(load, [load, reloadKey]);
  useMapEvents({ moveend: load });

  return (
    <>
      {features.map((feature) => {
        const p = feature.properties;
        return (
          <Polyline
            key={feature.id ?? p.id}
            positions={feature.geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number])}
            pathOptions={{ color: "#1e88e5", weight: 4 }}
          >
            <Popup>
              <strong>Boru #{p.id}</strong>
              <br />
              Malzeme: {p.material ?? "-"}
              <br />
              Çap: {p.diameter_mm != null ? `${p.diameter_mm} mm` : "-"}
              <br />
              Uzunluk: {p.length_m} m
              <br />
              <small>Kaynak: WFS GetFeature</small>
            </Popup>
          </Polyline>
        );
      })}
    </>
  );
}
