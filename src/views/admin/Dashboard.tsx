import { useEffect } from "react";
import { useAdminStore } from "../../store/useAdminStore";
import { useRecipesStore } from "../../store/useRecipesStore";

export default function AdminDashboard() {
  const {
    users,
    listUsers,
    loading: usersLoading,
    error: usersError,
  } = useAdminStore();
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
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {usersError && <div className="text-red-600 mb-3">{usersError}</div>}

      <div className="grid gap-4 md:grid-cols-5">
        <Card
          label="Users"
          value={counts.users}
          color="from-blue-400 to-blue-600"
        />
        <Card
          label="Recipes"
          value={counts.recipes}
          color="from-purple-400 to-purple-600"
        />
        <Card
          label="Breakfast"
          value={counts.breakfast}
          color="from-yellow-400 to-yellow-500"
        />
        <Card
          label="Lunch"
          value={counts.lunch}
          color="from-green-400 to-green-600"
        />
        <Card
          label="Dinner"
          value={counts.dinner}
          color="from-red-400 to-red-600"
        />
      </div>

      {usersLoading && <div className="mt-4">Loading...</div>}
    </div>
  );
}

function Card({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className={`rounded-xl p-4 text-white bg-gradient-to-r ${color} shadow-lg hover:scale-105 transform transition-all duration-200`}
    >
      <div className="text-sm opacity-90">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
