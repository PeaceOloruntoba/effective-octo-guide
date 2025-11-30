import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useMealsStore } from "../../store/useMealsStore";
import { useStatsStore } from "../../store/useStatsStore";
import { useRecipesStore } from "../../store/useRecipesStore";
import { toast } from "sonner";

export default function Dashboard() {
  const { plan, loading, error, fetchPlan, setPlan } = useMealsStore();
  const { totals, summary, loading: statsLoading } = useStatsStore();
  const { items: recipes, fetch: fetchRecipes } = useRecipesStore();
  const [showPlanner, setShowPlanner] = useState(false);
  const [workingPlan, setWorkingPlan] = useState<any | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPlan();
    summary("week");
    if (recipes.length === 0) fetchRecipes();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {error && <div className="text-red-600 mb-3">{error}</div>}

      {/* STATS CARDS */}
      {user?.role !== "admin" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          <Card label="Calories" value={String(totals?.calories ?? 0)} color="bg-yellow-100 text-yellow-700" />
          <Card label="Protein" value={`${totals?.protein_grams ?? 0}g`} color="bg-green-100 text-green-700" />
          <Card label="Carbs" value={`${totals?.carbs_grams ?? 0}g`} color="bg-blue-100 text-blue-700" />
          <Card label="Fat" value={`${totals?.fat_grams ?? 0}g`} color="bg-red-100 text-red-700" />
        </div>
      )}

      {/* MEAL PLAN HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-3">
        <h2 className="text-xl font-semibold">Weekly Plan</h2>
        <button
          className="h-10 px-4 rounded-md bg-primary text-white hover:bg-primary/90 transition"
          onClick={() => {
            setWorkingPlan(plan || {});
            setShowPlanner(true);
          }}
        >
          Create / Update Meal Plan
        </button>
      </div>

      {/* MEAL PLAN TABLE */}
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Day</th>
              <th className="px-4 py-2 text-left font-medium">Breakfast</th>
              <th className="px-4 py-2 text-left font-medium">Lunch</th>
              <th className="px-4 py-2 text-left font-medium">Dinner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] as const).map((d) => (
              <tr key={d} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium">{d}</td>
                <td className="px-4 py-3">{plan?.[d]?.breakfast?.name || "-"}</td>
                <td className="px-4 py-3">{plan?.[d]?.lunch?.name || "-"}</td>
                <td className="px-4 py-3">{plan?.[d]?.dinner?.name || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(loading || statsLoading) && <div className="mt-4 text-gray-500">Loading...</div>}

      {/* PLANNER MODAL */}
      {showPlanner && (
        <PlannerModal
          plan={workingPlan}
          setPlan={setWorkingPlan}
          recipes={recipes}
          onClose={() => setShowPlanner(false)}
          onSave={async () => {
            try {
              await setPlan(workingPlan);
              toast.success("Meal plan saved");
              setShowPlanner(false);
              fetchPlan();
            } catch {}
          }}
        />
      )}
    </div>
  );
}

// --- CARD COMPONENT ---
function Card({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className={`rounded-lg p-4 shadow-sm flex flex-col ${color ?? "bg-white"}`}>
      <span className="text-xs font-medium text-gray-500 mb-1">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}

// --- MODAL COMPONENT ---
function PlannerModal({
  plan,
  setPlan,
  recipes,
  onClose,
  onSave,
}: {
  plan: any;
  setPlan: (p: any) => void;
  recipes: any[];
  onClose: () => void;
  onSave: () => void;
}) {
  const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] as const;
  const SLOTS = ["breakfast","lunch","dinner"] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-0">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative bg-white w-full sm:w-[95%] max-w-3xl max-h-[90vh] overflow-auto rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Meal Plan</h3>
          <button className="text-gray-600 hover:text-gray-900" onClick={onClose}>✕</button>
        </div>

        <div className="grid gap-4">
          {DAYS.map((day) => (
            <div key={day} className="rounded-lg border p-4 shadow-sm">
              <div className="font-semibold mb-3">{day}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SLOTS.map((slot) => (
                  <div key={`${day}:${slot}`} className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 capitalize">{slot}</label>
                    <select
                      className="h-10 rounded border px-2 focus:outline-none focus:ring-2 focus:ring-accent"
                      value={plan?.[day]?.[slot]?.id || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        const opt = recipes.find((r) => String(r.id) === String(val));
                        setPlan({
                          ...plan,
                          [day]: {
                            ...(plan?.[day] || {}),
                            [slot]: val ? { id: Number(val), name: opt?.name } : null,
                          },
                        });
                      }}
                    >
                      <option value="">- Select -</option>
                      {recipes.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="px-4 py-2 rounded-md border hover:bg-gray-50" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
