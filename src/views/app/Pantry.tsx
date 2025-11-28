import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { toast } from "sonner";

export default function Pantry() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | number | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.pantry.list();
      setItems(data || []);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to load pantry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addItem = async () => {
    setAdding(true);
    try {
      await api.pantry.create({ name, quantity, unit, expires_at: expiresAt || undefined });
      setName(""); setQuantity(""); setUnit(""); setExpiresAt("");
      await load();
      toast.success("Added to pantry");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to add pantry item");
    } finally { setAdding(false); }
  };

  const remove = async (id: string | number) => {
    setRemovingId(id);
    try {
      await api.pantry.remove(id);
      await load();
      toast.success("Removed");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || "Failed to remove item");
    } finally { setRemovingId(null); }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h2 className="text-xl font-semibold mb-3">Add pantry item</h2>
      <div className="grid gap-2 mb-4 sm:grid-cols-2 lg:grid-cols-4">
        <input className="h-10 rounded border px-3" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="h-10 rounded border px-3" placeholder="Quantity" value={quantity} onChange={(e)=>setQuantity(e.target.value)} />
        <input className="h-10 rounded border px-3" placeholder="Unit" value={unit} onChange={(e)=>setUnit(e.target.value)} />
        <input className="h-10 rounded border px-3" placeholder="Expires at (YYYY-MM-DD)" value={expiresAt} onChange={(e)=>setExpiresAt(e.target.value)} />
      </div>
      <button className="h-10 px-4 rounded text-white disabled:opacity-60" style={{background:'#1f444c'}} disabled={adding} onClick={addItem}>{adding? 'Adding...' : 'Add'}</button>
      {error ? <div className="text-red-600 mt-3">{error}</div> : null}
      <div className="mt-5">
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-500">No pantry items</div>
        ) : (
          <ul className="divide-y">
            {items.map((it) => (
              <li key={it.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-600">{[it.quantity, it.unit].filter(Boolean).join(" ")}</div>
                </div>
                <button className="text-red-600 disabled:opacity-60" disabled={removingId===it.id} onClick={()=>remove(it.id)}>{removingId===it.id? 'Removing...' : 'Remove'}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
