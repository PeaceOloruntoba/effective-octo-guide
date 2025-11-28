import { Link, NavLink, Outlet } from "react-router";
import { Toaster } from "sonner";
import { Colors } from "../utils/api";

export function Layout() {
  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: "#fff" }}>
      <header className="sticky top-0 z-10" style={{ backgroundColor: Colors.primary }}>
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-bold text-white">Bunzi</Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/app/dashboard" className={({isActive}) => `text-${isActive?"["+Colors.accent+"]":"[#eaeaea]"}`}>Dashboard</NavLink>
            <NavLink to="/app/recipes" className="text-[#eaeaea]">Recipes</NavLink>
            <NavLink to="/app/nutrition" className="text-[#eaeaea]">Nutrition</NavLink>
            <NavLink to="/app/shopping" className="text-[#eaeaea]">Shopping</NavLink>
            <NavLink to="/app/pantry" className="text-[#eaeaea]">Pantry</NavLink>
            <NavLink to="/app/settings" className="text-[#eaeaea]">Settings</NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export function AdminLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-10" style={{ backgroundColor: Colors.primary }}>
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-bold text-white">Bunzi Admin</Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/admin/users" className="text-[#eaeaea]">Users</NavLink>
            <NavLink to="/admin/recipes" className="text-[#eaeaea]">Recipes</NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster position="top-center" richColors />
    </div>
  );
}
