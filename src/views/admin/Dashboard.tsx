import { useEffect } from "react";
import { useAdminStore } from "../../store/useAdminStore";
import { useRecipesStore } from "../../store/useRecipesStore";

export default function AdminDashboard() {
  const { users, listUsers, loading: usersLoading, error: usersError } = useAdminStore();
  const { items: recipes, fetch: fetchRecipes } = useRecipesStore();

  useEffect(() => {
    listUsers().catch(() => {});
    if (recipes.length === 0) fetchRecipes().catch(() => {});
  }, []);

  const counts = {
    users: users.length,
    recipes: recipes.length,
    breakfast: recipes.filter((r: any) => r.category === "breakfast").length,
    lunch: recipes.filter((r: any) => r.category === "lunch").length,
    dinner: recipes.filter((r: any) => r.category === "dinner").length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
      {usersError ? <div className="text-red-600 mb-3">{usersError}</div> : null}
      <div className="grid gap-3 md:grid-cols-4">
        <Card label="Users" value={String(counts.users)} />
        <Card label="Recipes" value={String(counts.recipes)} />
        <Card label="Breakfast" value={String(counts.breakfast)} />
        <Card label="Lunch" value={String(counts.lunch)} />
        <Card label="Dinner" value={String(counts.dinner)} />
      </div>
      {(usersLoading) ? <div className="mt-4">Loading...</div> : null}
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-3 bg-white">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
