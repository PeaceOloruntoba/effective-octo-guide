import { createBrowserRouter, Navigate } from "react-router";
import { Layout, AdminLayout } from "../components/Layout";
import Landing from "../views/Landing";
import Login from "../views/auth/Login";
import Signup from "../views/auth/Signup";
import Dashboard from "../views/app/Dashboard";
import Recipes from "../views/app/Recipes";
import Nutrition from "../views/app/Nutrition";
import Pantry from "../views/app/Pantry";
import Shopping from "../views/app/Shopping";
import Settings from "../views/app/Settings";
import SettingsEditProfile from "../views/app/SettingsEditProfile";
import Billing from "../views/app/Billing";
import Processing from "../views/app/Processing";
import AdminUsers from "../views/admin/Users";
import AdminRecipes from "../views/admin/Recipes";
import AdminDashboard from "../views/admin/Dashboard";
import { useAuthStore } from "../store/useAuthStore";
import type { JSX } from "react";
import AdminSettings from "../views/admin/Settings";
import AdminSubscriptions from "../views/admin/Subscriptions";
import Forgot from "../views/auth/Forgot";
import Reset from "../views/auth/Reset";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { token, hydrated } = useAuthStore();
  if (!hydrated) return null;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user, hydrated, token } = useAuthStore();
  if (!hydrated) return null;
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/app/dashboard" replace />;
  return children;
}

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot-password", element: <Forgot /> },
  { path: "/reset-password", element: <Reset /> },
  {
    path: "/app",
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "recipes", element: <Recipes /> },
      { path: "nutrition", element: <Nutrition /> },
      { path: "pantry", element: <Pantry /> },
      { path: "shopping", element: <Shopping /> },
      { path: "settings", element: <Settings /> },
      { path: "settings/edit-profile", element: <SettingsEditProfile /> },
      { path: "billing", element: <Billing /> },
      { path: "billing/processing", element: <Processing /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <AdminUsers /> },
      { path: "recipes", element: <AdminRecipes /> },
      { path: "subscriptions", element: <AdminSubscriptions /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
]);
