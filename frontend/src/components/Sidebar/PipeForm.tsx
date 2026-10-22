import { useState, type FormEvent } from "react";
import { createPipe } from "../../api/pipes";

interface Props {
  drawMode: boolean;
  vertices: [number, number][];
  onStartDraw: () => void;
  onUndo: () => void;
  onCancel: () => void;
  onSaved: () => void;
}

export default function PipeForm({ drawMode, vertices, onStartDraw, onUndo, onCancel, onSaved }: Props) {
  const [material, setMaterial] = useState("");
  const [diameter, setDiameter] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (vertices.length < 2) return;
    try {
      const feature = await createPipe(vertices, {
        material: material === "" ? null : material,
        diameterMm: diameter === "" ? null : Number(diameter),
      });
      setMessage(`Kaydedildi: boru #${feature.properties.id}, ${feature.properties.length_m} m`);
      setMaterial("");
      setDiameter("");
      onSaved();
    } catch (error) {
      setMessage(`Hata: ${(error as Error).message}`);
    }
  }

  return (
    <form className="sidebar__section" onSubmit={handleSubmit}>
      <h2>Boru hattı çiz</h2>
      <label>
        Malzeme
        <input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="PVC, HDPE, döküm..." />
      </label>
      <label>
        Çap (mm)
        <input type="number" min="1" value={diameter} onChange={(e) => setDiameter(e.target.value)} />
      </label>
      {drawMode ? (
        <div className="sidebar__row">
          <button type="button" onClick={onUndo} disabled={vertices.length === 0}>
            Geri al
          </button>
          <button type="button" onClick={onCancel}>
            İptal
          </button>
        </div>
      ) : (
        <button type="button" onClick={onStartDraw}>
          Haritada çizmeye başla
        </button>
      )}
      <p className="sidebar__hint">
        {drawMode
          ? `Haritaya tıklayarak köşe ekleyin (${vertices.length} nokta). En az 2 nokta gerekir.`
          : "Çizim yok"}
      </p>
      <button type="submit" disabled={vertices.length < 2}>
        Boruyu kaydet
      </button>
      {message && <p className="sidebar__hint">{message}</p>}
    </form>
  );
}
