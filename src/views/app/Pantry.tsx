import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../../components/Spinner";
import { usePantryStore } from "../../store/usePantryStore";

export default function Pantry() {
  const { items, loading, error, fetch, create, remove: removeItem } = usePantryStore();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | number | null>(null);

  const load = async () => {
    await fetch();
  };

  useEffect(() => { load(); }, []);

  const addItem = async () => {
    setAdding(true);
    try {
      await create({ name, quantity, unit, expires_at: expiresAt || undefined } as any);
      setName(""); setQuantity(""); setUnit(""); setExpiresAt("");
      await load();
      toast.success("Added to pantry");
    } catch (e: any) {
      // error toasting handled in store; keep extra toast for safety if needed
      // toast.error(extractErrorMessage(e, "Failed to add pantry item"));
    } finally { setAdding(false); }
  };

  const onRemove = async (id: string | number) => {
    setRemovingId(id);
    try {
      await removeItem(id);
      await load();
      toast.success("Removed");
    } catch (e: any) {
      // error toasting handled in store
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
      <button className="h-10 px-4 rounded text-white disabled:opacity-60 flex items-center gap-2" style={{background:'#1f444c'}} disabled={adding} onClick={addItem}>
        {adding ? (<><Spinner size={16} color="#fff" /><span>Adding...</span></>) : 'Add'}
      </button>
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
                <button className="text-red-600 disabled:opacity-60 inline-flex items-center gap-2" disabled={removingId===it.id} onClick={()=>onRemove(it.id)}>
                  {removingId===it.id? (<><Spinner size={14} color="#b91c1c" /><span>Removing...</span></>) : 'Remove'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
