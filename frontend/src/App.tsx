import { useEffect, useState } from "react";
import { fetchHealth } from "./api/health";
import MapView from "./components/Map/MapView";
import WaterSourceForm from "./components/Sidebar/WaterSourceForm";
import PipeForm from "./components/Sidebar/PipeForm";

export default function App() {
  const [status, setStatus] = useState("kontrol ediliyor...");
  const [reloadKey, setReloadKey] = useState(0);
  const [pickMode, setPickMode] = useState(false);
  const [pickedPoint, setPickedPoint] = useState<[number, number] | null>(null);
  const [drawMode, setDrawMode] = useState(false);
  const [drawVertices, setDrawVertices] = useState<[number, number][]>([]);

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
        <aside className="sidebar">
          <WaterSourceForm
            pickMode={pickMode}
            pickedPoint={pickedPoint}
            onStartPick={() => {
              setDrawMode(false);
              setPickMode(true);
            }}
            onSaved={() => {
              setPickedPoint(null);
              setReloadKey((k) => k + 1);
            }}
          />
          <PipeForm
            drawMode={drawMode}
            vertices={drawVertices}
            onStartDraw={() => {
              setPickMode(false);
              setDrawVertices([]);
              setDrawMode(true);
            }}
            onUndo={() => setDrawVertices((v) => v.slice(0, -1))}
            onCancel={() => {
              setDrawMode(false);
              setDrawVertices([]);
            }}
            onSaved={() => {
              setDrawMode(false);
              setDrawVertices([]);
              setReloadKey((k) => k + 1);
            }}
          />
        </aside>
        <MapView
          reloadKey={reloadKey}
          pickMode={pickMode}
          pickedPoint={pickedPoint}
          onPick={(latlng) => {
            setPickedPoint(latlng);
            setPickMode(false);
          }}
          drawMode={drawMode}
          drawVertices={drawVertices}
          onAddVertex={(latlng) => setDrawVertices((v) => [...v, latlng])}
        />
      </main>
    </div>
  );
}
