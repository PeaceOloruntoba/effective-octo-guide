import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useAuthStore } from "../../store/useAuthStore";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<any>(null);
  const [summary, _setSummary] = useState<{ totals?: { calories: number; protein_grams: number; carbs_grams: number; fat_grams: number } } | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        const [p] = await Promise.all([
          api.meals.getPlan().catch(() => null),
        ]);
        setPlan(p);
        // Optionally call stats summary if available in web API list endpoint
      } catch (e: any) {
        setError(e?.response?.data?.error || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {error ? <div className="text-red-600 mb-3">{error}</div> : null}
      {user?.role !== 'admin' ? (
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <Card label="Calories" value={String(summary?.totals?.calories ?? 0)} />
          <Card label="Protein" value={`${summary?.totals?.protein_grams ?? 0}g`} />
          <Card label="Carbs" value={`${summary?.totals?.carbs_grams ?? 0}g`} />
          <Card label="Fat" value={`${summary?.totals?.fat_grams ?? 0}g`} />
        </div>
      ) : null}
      <h2 className="text-xl font-semibold mb-3">Weekly plan</h2>
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
      {loading ? <div className="mt-4">Loading...</div> : null}
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
