import { useCallback, useEffect, useState } from "react";
import { CircleMarker, Popup, useMap, useMapEvents } from "react-leaflet";
import { fetchWaterSourcesInBounds } from "../../api/waterSources";
import type { WaterSourceFeature } from "../../types/waterSource";

interface Props {
  /** Değiştiğinde katman yeniden yüklenir (yeni kaynak eklendikten sonra). */
  reloadKey: number;
}

/**
 * WFS katmanı: kaynaklar tarayıcıya vektör (GeoJSON) olarak gelir.
 * Her nokta tıklanabilir ve öznitelikleri (id, ad) popup'ta gösterilir.
 * Harita her kaydırıldığında yalnızca görünen bbox içindeki kaynaklar istenir.
 */
export default function WaterSourceWfsLayer({ reloadKey }: Props) {
  const map = useMap();
  const [features, setFeatures] = useState<WaterSourceFeature[]>([]);

  const load = useCallback(() => {
    fetchWaterSourcesInBounds(map.getBounds())
      .then((collection) => setFeatures(collection.features))
      .catch((error: Error) => console.error("WFS yüklenemedi:", error.message));
  }, [map]);

  useEffect(load, [load, reloadKey]);
  useMapEvents({ moveend: load });

  return (
    <>
      {features.map((feature) => {
        // GeoJSON [lng, lat] -> Leaflet [lat, lng]; hesaplama değil, yalnızca eksen sırası.
        const [lng, lat] = feature.geometry.coordinates;
        const p = feature.properties;
        return (
          <CircleMarker
            key={feature.id ?? p.id}
            center={[lat, lng]}
            radius={11}
            pathOptions={{ color: "#d81b60", weight: 2, fillOpacity: 0 }}
          >
            <Popup>
              <strong>{p.name}</strong> (#{p.id})
              <br />
              <small>Kaynak: WFS GetFeature</small>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
