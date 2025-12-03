import { useEffect, useMemo, useState } from "react";
import { useRecipesStore } from "../../store/useRecipesStore";
import { Spinner } from "../../components/Spinner";
import { useNavigate } from "react-router";

export default function Recipes() {
  const { items, loading, error, fetch } = useRecipesStore();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((r) => r.name.toLowerCase().includes(term));
  }, [q, items]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search recipes..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full max-w-md h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
        />
      </div>

      {/* Error */}
      {error && <div className="text-red-600 mb-3">{error}</div>}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-600"><Spinner size={16} /><span>Loading recipes...</span></div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-6 rounded-lg border border-gray-200 bg-gray-50">
          No recipes{q ? ` matching "${q}"` : ""}
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <li
              key={r.id}
              className="rounded-lg overflow-hidden border bg-white shadow-sm hover:shadow-md transition flex flex-col cursor-pointer"
              onClick={() => navigate(`/app/recipes/${r.id}`)}
            >
              {r.image_url && (
                <img
                  src={r.image_url}
                  alt={r.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-gray-800 text-lg">{r.name}</div>
                  {r.category && (
                    <div className="text-xs text-gray-500 mt-1 uppercase">{r.category}</div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
