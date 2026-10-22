import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Başlangıç görünümü: Ankara (EPSG:4326, [lat, lng]).
const INITIAL_CENTER: [number, number] = [39.9334, 32.8597];
const INITIAL_ZOOM = 12;

export default function MapView() {
  return (
    <MapContainer center={INITIAL_CENTER} zoom={INITIAL_ZOOM} className="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıcıları'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
