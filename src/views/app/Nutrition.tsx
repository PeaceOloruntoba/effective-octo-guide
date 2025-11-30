import { useEffect, useState } from "react";
import { useNutritionStore } from "../../store/useNutritionStore";
import { useRecipesStore } from "../../store/useRecipesStore";

export default function Nutrition() {
  const { items, loading, error, fetch } = useNutritionStore();
  const [recipeId, setRecipeId] = useState<string>("");
  const { items: recipes, fetch: fetchRecipes } = useRecipesStore();

  const load = async () => {
    const rid = recipeId ? Number(recipeId) : undefined;
    await Promise.all([fetch(rid), recipes.length ? Promise.resolve() : fetchRecipes()]);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* FILTER INPUT */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-6">
        <input
          className="h-10 px-3 rounded-md border shadow-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Filter by Recipe ID (optional)"
          value={recipeId}
          onChange={(e) => setRecipeId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <button
          className="mt-2 sm:mt-0 h-10 px-4 rounded-md bg-primary text-white shadow hover:bg-primary/90 transition"
          onClick={load}
        >
          Apply Filter
        </button>
      </div>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      {/* LOADING */}
      {loading ? (
        <div className="text-gray-500">Loading nutrition records...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500">No nutrition records found</div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const recipe = recipes.find((r) => r.id === item.recipe_id);
            return (
              <li
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-white shadow-sm hover:shadow-lg transition"
              >
                {recipe?.image_url && (
                  <img
                    src={recipe.image_url}
                    alt={recipe.name}
                    className="w-full sm:w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="font-semibold text-emerald-700 mb-1">
                    #{item.recipe_id ?? "-"} - {recipe?.name ?? "-"}
                  </div>
                  <div className="text-gray-600 text-sm">
                    <span className="mr-2">Kcal {item.calories}</span>
                    <span className="mr-2">P {item.protein_grams}g</span>
                    <span className="mr-2">C {item.carbs_grams}g</span>
                    <span className="mr-2">F {item.fat_grams}g</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
