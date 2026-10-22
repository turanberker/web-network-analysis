import { useEffect, useState } from "react";
import { fetchHealth } from "./api/health";
import MapView from "./components/Map/MapView";
import WaterSourceForm from "./components/Sidebar/WaterSourceForm";

export default function App() {
  const [status, setStatus] = useState("kontrol ediliyor...");
  const [reloadKey, setReloadKey] = useState(0);
  const [pickMode, setPickMode] = useState(false);
  const [pickedPoint, setPickedPoint] = useState<[number, number] | null>(null);

  useEffect(() => {
    fetchHealth()
      .then((data) => setStatus(`${data.status} (PostGIS ${data.postgisVersion})`))
      .catch((error: Error) => setStatus(`hata: ${error.message}`));
  }, []);

  return (
    <div className="layout">
      <header className="header">
        <h1>Su Hattı Vana Analizi</h1>
        <span>
          Backend: <strong>{status}</strong>
        </span>
      </header>
      <main className="content">
        <WaterSourceForm
          pickMode={pickMode}
          pickedPoint={pickedPoint}
          onStartPick={() => setPickMode(true)}
          onSaved={() => {
            setPickedPoint(null);
            setReloadKey((k) => k + 1);
          }}
        />
        <MapView
          reloadKey={reloadKey}
          pickMode={pickMode}
          pickedPoint={pickedPoint}
          onPick={(latlng) => {
            setPickedPoint(latlng);
            setPickMode(false);
          }}
        />
      </main>
    </div>
  );
}
