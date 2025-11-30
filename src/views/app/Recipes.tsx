import { useEffect, useMemo, useState } from "react";
import { useRecipesStore } from "../../store/useRecipesStore";

export default function Recipes() {
  const { items, loading, error, fetch } = useRecipesStore();
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((r) => r.name.toLowerCase().includes(term));
  }, [q, items]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center gap-3 mb-4">
        <input className="h-10 rounded border px-3 w-full max-w-md" placeholder="Search recipes" value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>
      {error ? <div className="text-red-600 mb-3">{error}</div> : null}
      {loading ? (
        <div>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500">No recipes{q?" for that search":""}</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <li key={r.id} className="rounded border overflow-hidden bg-white">
              {r.image_url ? <img src={r.image_url} alt={r.name} className="w-full h-40 object-cover" /> : null}
              <div className="p-3">
                <div className="font-semibold">{r.name}</div>
                {r.category ? <div className="text-xs text-gray-500 mt-1 uppercase">{r.category}</div> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
