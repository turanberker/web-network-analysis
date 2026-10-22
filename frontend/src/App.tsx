import { useEffect, useState } from "react";
import { fetchHealth } from "./api";

export default function App() {
  const [status, setStatus] = useState("kontrol ediliyor...");

  useEffect(() => {
    fetchHealth()
      .then((data) => setStatus(data.status))
      .catch((error: Error) => setStatus(`hata: ${error.message}`));
  }, []);

  return (
    <main className="container">
      <h1>Web Network Analysis</h1>
      <p>
        Backend durumu: <strong>{status}</strong>
      </p>
    </main>
  );
}
