import { useState, type FormEvent } from "react";
import { createWaterSource } from "../../api/waterSources";
import { WATER_SOURCE_TYPE_LABELS, type WaterSourceType } from "../../types/waterSource";

interface Props {
  pickMode: boolean;
  pickedPoint: [number, number] | null;
  onStartPick: () => void;
  onSaved: () => void;
}

export default function WaterSourceForm({ pickMode, pickedPoint, onStartPick, onSaved }: Props) {
  const [name, setName] = useState("");
  const [sourceType, setSourceType] = useState<WaterSourceType>("WELL");
  const [capacity, setCapacity] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!pickedPoint) return;
    try {
      const feature = await createWaterSource(pickedPoint[0], pickedPoint[1], {
        name,
        sourceType,
        capacityM3PerDay: capacity === "" ? null : Number(capacity),
      });
      setMessage(`Kaydedildi: #${feature.properties.id} ${feature.properties.name}`);
      setName("");
      setCapacity("");
      onSaved();
    } catch (error) {
      setMessage(`Hata: ${(error as Error).message}`);
    }
  }

  return (
    <form className="sidebar" onSubmit={handleSubmit}>
      <h2>Su kaynağı ekle</h2>
      <label>
        Ad
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Tip
        <select value={sourceType} onChange={(e) => setSourceType(e.target.value as WaterSourceType)}>
          {Object.entries(WATER_SOURCE_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Kapasite (m³/gün)
        <input type="number" min="0" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
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
