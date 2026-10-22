import { useEffect, useState } from "react";
import { fetchHealth } from "./api/health";
import MapView from "./components/Map/MapView";

export default function App() {
  const [status, setStatus] = useState("kontrol ediliyor...");

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
      <MapView />
    </div>
  );
}
