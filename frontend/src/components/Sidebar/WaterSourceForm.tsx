import { useState, type FormEvent } from "react";
import { createWaterSource } from "../../api/waterSources";

interface Props {
  pickMode: boolean;
  pickedPoint: [number, number] | null;
  onStartPick: () => void;
  onSaved: () => void;
}

export default function WaterSourceForm({ pickMode, pickedPoint, onStartPick, onSaved }: Props) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!pickedPoint) return;
    try {
      const feature = await createWaterSource(pickedPoint[0], pickedPoint[1], { name });
      setMessage(`Kaydedildi: #${feature.properties.id} ${feature.properties.name}`);
      setName("");
      onSaved();
    } catch (error) {
      setMessage(`Hata: ${(error as Error).message}`);
    }
  }

  return (
    <form className="sidebar__section" onSubmit={handleSubmit}>
      <h2>Su kaynağı ekle</h2>
      <label>
        Ad
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <button type="button" onClick={onStartPick} disabled={pickMode}>
        {pickMode ? "Haritaya tıklayın..." : "Haritadan konum seç"}
      </button>
      <p className="sidebar__hint">
        {pickedPoint ? `Konum: ${pickedPoint[0].toFixed(5)}, ${pickedPoint[1].toFixed(5)}` : "Konum seçilmedi"}
      </p>
      <button type="submit" disabled={!pickedPoint || !name}>
        Kaydet
      </button>
      {message && <p className="sidebar__hint">{message}</p>}
    </form>
  );
}
