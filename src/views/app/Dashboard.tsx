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
      {error ? <div className="text-red-600 mb-3">{error}</div> : null}
      {user?.role !== 'admin' ? (
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <Card label="Calories" value={String(totals?.calories ?? 0)} />
          <Card label="Protein" value={`${totals?.protein_grams ?? 0}g`} />
          <Card label="Carbs" value={`${totals?.carbs_grams ?? 0}g`} />
          <Card label="Fat" value={`${totals?.fat_grams ?? 0}g`} />
        </div>
      ) : null}
      <h2 className="text-xl font-semibold mb-3">Weekly plan</h2>
      <div className="mb-3">
        <button className="h-9 px-3 rounded text-white" style={{background:'#1f444c'}} onClick={()=>{ setWorkingPlan(plan || {}); setShowPlanner(true); }}>Create / Update Meal Plan</button>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="border rounded-md">
            <div className="grid grid-cols-4 md:grid-cols-8 text-sm">
              <HeaderCell label="Day" />
              <HeaderCell label="Breakfast" />
              <HeaderCell label="Lunch" />
              <HeaderCell label="Dinner" />
            </div>
            {(["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] as const).map((d) => (
              <div key={d} className="grid grid-cols-4 md:grid-cols-8 text-sm">
                <DayCell>{d}</DayCell>
                <MealCell>{plan?.[d]?.breakfast?.name || "-"}</MealCell>
                <MealCell>{plan?.[d]?.lunch?.name || "-"}</MealCell>
                <MealCell>{plan?.[d]?.dinner?.name || "-"}</MealCell>
              </div>
            ))}
          </div>
        </div>
      </div>
      {loading || statsLoading ? <div className="mt-4">Loading...</div> : null}

      {showPlanner ? (
        <PlannerModal
          plan={workingPlan}
          setPlan={setWorkingPlan}
          recipes={recipes}
          onClose={()=>setShowPlanner(false)}
          onSave={async()=> {
            try { await setPlan(workingPlan); toast.success("Meal plan saved"); setShowPlanner(false); fetchPlan(); } catch {}
          }}
        />
      ) : null}
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-md border p-3" style={{ background: "#fff" }}>
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function HeaderCell({ label }: { label: string }) {
  return <div className="px-3 py-2 border-b bg-gray-50 text-xs font-semibold uppercase tracking-wide">{label}</div>;
}
function DayCell({ children }: { children: React.ReactNode }) {
  return <div className="px-3 py-3 border-b bg-gray-50 font-medium">{children}</div>;
}
function MealCell({ children }: { children: React.ReactNode }) {
  return <div className="px-3 py-3 border-b">{children}</div>;
}

function PlannerModal({ plan, setPlan, recipes, onClose, onSave }: { plan: any; setPlan: (p: any)=>void; recipes: any[]; onClose: ()=>void; onSave: ()=>void }) {
  const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] as const;
  const SLOTS = ["breakfast","lunch","dinner"] as const;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-[95vw] max-w-3xl max-h-[90vh] overflow-auto rounded-md shadow-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Edit Meal Plan</h3>
          <button className="px-2 py-1 rounded border" onClick={onClose}>Close</button>
        </div>
        <div className="grid gap-4">
          {DAYS.map((day) => (
            <div key={day} className="rounded border p-3">
              <div className="font-semibold mb-2">{day}</div>
              <div className="grid gap-3 sm:grid-cols-3">
                {SLOTS.map((slot) => (
                  <div key={`${day}:${slot}`} className="grid gap-1">
                    <label className="text-xs text-gray-600 capitalize">{slot}</label>
                    <select
                      className="h-10 rounded border px-2"
                      value={plan?.[day]?.[slot]?.id || ""}
                      onChange={(e)=>{
                        const val = e.target.value;
                        const opt = recipes.find((r:any)=> String(r.id) === String(val));
                        setPlan({
                          ...plan,
                          [day]: {
                            ...(plan?.[day] || {}),
                            [slot]: val ? { id: Number(val), name: opt?.name } : null
                          }
                        });
                      }}
                    >
                      <option value="">- Select -</option>
                      {recipes.map((r:any)=>(<option key={r.id} value={r.id}>{r.name}</option>))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 h-10 rounded border" onClick={onClose}>Cancel</button>
          <button className="px-3 h-10 rounded text-white" style={{background:'#1f444c'}} onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
