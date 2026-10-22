import {
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  WMSTileLayer,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { WMS_URL } from "../../api/geoserver";
import { WATER_SOURCE_LAYER } from "../../api/waterSources";
import WaterSourceWfsLayer from "./WaterSourceWfsLayer";
import PipeWfsLayer from "./PipeWfsLayer";

// Vite ile paketlenince Leaflet'in varsayılan marker görselleri bulunamaz; açıkça veriyoruz.
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

// Başlangıç görünümü: Ankara (EPSG:4326, [lat, lng]).
const INITIAL_CENTER: [number, number] = [39.9334, 32.8597];
const INITIAL_ZOOM = 11;

interface Props {
  reloadKey: number;
  pickMode: boolean;
  pickedPoint: [number, number] | null;
  onPick: (latlng: [number, number]) => void;
  drawMode: boolean;
  /** Çizilmekte olan borunun köşeleri ([lat, lng]). */
  drawVertices: [number, number][];
  onAddVertex: (latlng: [number, number]) => void;
}

/** Aktifken her harita tıklamasını bir koordinat olarak bildirir (nokta seçme ve boru çizimi için). */
function ClickHandler({ enabled, onPick }: { enabled: boolean; onPick: Props["onPick"] }) {
  useMapEvents({
    click(e) {
      if (enabled) onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function MapView({
  reloadKey,
  pickMode,
  pickedPoint,
  onPick,
  drawMode,
  drawVertices,
  onAddVertex,
}: Props) {
  return (
    <MapContainer
      center={INITIAL_CENTER}
      zoom={INITIAL_ZOOM}
      className={pickMode || drawMode ? "map map--picking" : "map"}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıcıları'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LayersControl position="topright">
        {/* WMS: GeoServer kaynakları SLD stiline göre PNG karo olarak çizer; tarayıcı yalnızca resim görür. */}
        <LayersControl.Overlay checked name="Su kaynakları (WMS - görüntü)">
          <WMSTileLayer
            url={WMS_URL}
            params={{
              layers: WATER_SOURCE_LAYER,
              format: "image/png",
              transparent: true,
              // Yeni kayıttan sonra tarayıcı önbelleğini atlatmak için.
              _v: reloadKey,
            } as L.WMSParams}
          />
        </LayersControl.Overlay>
        {/* WFS: aynı veri vektör olarak gelir; tıklanabilir, öznitelikleri okunabilir. */}
        <LayersControl.Overlay checked name="Su kaynakları (WFS - vektör)">
          <LayerGroup>
            <WaterSourceWfsLayer reloadKey={reloadKey} />
          </LayerGroup>
        </LayersControl.Overlay>
        {/* Borular yalnızca WFS ile: tıklanınca malzeme/çap/uzunluk görünsün diye vektör gerekir. */}
        <LayersControl.Overlay checked name="Boru hatları (WFS - vektör)">
          <LayerGroup>
            <PipeWfsLayer reloadKey={reloadKey} />
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
      <ClickHandler enabled={pickMode} onPick={onPick} />
      <ClickHandler enabled={drawMode} onPick={onAddVertex} />
      {pickedPoint && <Marker position={pickedPoint} />}
      {/* Çizim önizlemesi: henüz kaydedilmemiş köşeler kesikli çizgiyle gösterilir. */}
      {drawVertices.length > 0 && (
        <Polyline positions={drawVertices} pathOptions={{ color: "#f4511e", weight: 3, dashArray: "6 6" }} />
      )}
    </MapContainer>
  );
}
