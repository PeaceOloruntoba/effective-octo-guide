import { useEffect, useState } from "react";
import { api } from "../../utils/api";

export default function Nutrition() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [recipeId, setRecipeId] = useState<string>("");
  const [recipes, setRecipes] = useState<{ id: number; name: string; image_url?: string }[]>([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const rid = recipeId ? Number(recipeId) : undefined;
      const [data, recs] = await Promise.all([
        api.nutrition.list(rid),
        api.recipes.list(),
      ]);
      setItems(data || []);
      setRecipes(recs || []);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to load nutrition");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-2 mb-3">
        <input className="h-10 rounded border px-3 w-full max-w-xs" placeholder="Filter by recipeId (optional)" value={recipeId} onChange={(e)=>setRecipeId(e.target.value)} />
        <div className="text-sm text-gray-500">Press Enter after typing to apply filter</div>
      </div>
      {error ? <div className="text-red-600 mb-3">{error}</div> : null}
      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500">No nutrition records</div>
      ) : (
        <ul className="grid gap-3">
          {items.map((item) => {
            const recipe = recipes.find((r) => r.id === item.recipe_id);
            return (
              <li key={item.id} className="rounded border bg-white p-3 flex items-center gap-3">
                {recipe?.image_url ? (
                  <img src={recipe.image_url} alt={recipe.name} className="w-14 h-14 object-cover rounded" />
                ) : null}
                <div className="flex-1">
                  <div className="font-semibold text-emerald-700">#{item.recipe_id ?? "-"} - {recipe?.name ?? "-"}</div>
                  <div className="text-gray-600 text-sm">Kcal {item.calories} • P {item.protein_grams}g • C {item.carbs_grams}g • F {item.fat_grams}g</div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  );
}
