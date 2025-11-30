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

  useEffect(() => { fetch(); }, []);

  const addItem = async () => {
    if (!name.trim()) return toast.error("Name is required");
    setAdding(true);
    try {
      await create({ name, quantity, unit, expires_at: expiresAt || undefined } as any);
      setName(""); setQuantity(""); setUnit(""); setExpiresAt("");
      await fetch();
      toast.success("Added to pantry");
    } finally { setAdding(false); }
  };

  const onRemove = async (id: string | number) => {
    setRemovingId(id);
    try {
      await removeItem(id);
      await fetch();
      toast.success("Removed");
    } finally { setRemovingId(null); }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h2 className="text-2xl font-bold mb-5 text-gray-900">Pantry</h2>

      {/* Add Item Form */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <input
          className="h-12 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />
        <input
          className="h-12 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Quantity"
          value={quantity}
          onChange={(e)=>setQuantity(e.target.value)}
        />
        <input
          className="h-12 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Unit"
          value={unit}
          onChange={(e)=>setUnit(e.target.value)}
        />
        <input
          className="h-12 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Expires at (YYYY-MM-DD)"
          value={expiresAt}
          onChange={(e)=>setExpiresAt(e.target.value)}
        />
      </div>
      <button
        className="h-12 w-full sm:w-auto px-4 rounded-lg bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition disabled:opacity-60"
        disabled={adding}
        onClick={addItem}
      >
        {adding ? (<><Spinner size={16} color="#fff" /><span>Adding...</span></>) : "Add Item"}
      </button>

      {error && <div className="text-red-600 mt-3">{error}</div>}

      {/* Pantry Items List */}
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center gap-2 text-gray-600"><Spinner size={16} /><span>Loading...</span></div>
        ) : items.length === 0 ? (
          <div className="text-gray-500 text-center py-6 rounded-lg border border-gray-200 bg-gray-50">
            No pantry items
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex-1 mb-2 sm:mb-0">
                  <div className="font-semibold text-gray-800">{it.name}</div>
                  <div className="text-gray-600 text-sm">
                    {[it.quantity, it.unit].filter(Boolean).join(" ")}
                    {it.expires_at ? ` • Expires: ${new Date(it.expires_at).toLocaleDateString()}` : ""}
                  </div>
                </div>
                <button
                  className="inline-flex items-center gap-2 text-red-600 font-medium hover:underline disabled:opacity-60"
                  disabled={removingId === it.id}
                  onClick={() => onRemove(it.id)}
                >
                  {removingId === it.id ? (<><Spinner size={14} color="#b91c1c" /><span>Removing...</span></>) : "Remove"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
