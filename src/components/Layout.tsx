import { Link, NavLink, Outlet } from "react-router";
import { Toaster } from "sonner";

export function Layout() {
  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <header className="sticky top-0 z-10 bg-primary">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-bold text-white">Bunzi</Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/app/dashboard" className={({isActive}) => isActive ? "text-accent" : "text-white/90"}>Dashboard</NavLink>
            <NavLink to="/app/recipes" className={({isActive}) => isActive ? "text-accent" : "text-white/90"}>Recipes</NavLink>
            <NavLink to="/app/nutrition" className={({isActive}) => isActive ? "text-accent" : "text-white/90"}>Nutrition</NavLink>
            <NavLink to="/app/shopping" className={({isActive}) => isActive ? "text-accent" : "text-white/90"}>Shopping</NavLink>
            <NavLink to="/app/pantry" className={({isActive}) => isActive ? "text-accent" : "text-white/90"}>Pantry</NavLink>
            <NavLink to="/app/billing" className={({isActive}) => isActive ? "text-accent" : "text-white/90"}>Billing</NavLink>
            <NavLink to="/app/settings" className={({isActive}) => isActive ? "text-accent" : "text-white/90"}>Settings</NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export function AdminLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-10 bg-primary">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/admin/dashboard" className="font-bold text-white">Bunzi Admin</Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/admin/users" className={({isActive}) => isActive ? "text-accent" : "text-white/90"}>Users</NavLink>
            <NavLink to="/admin/recipes" className={({isActive}) => isActive ? "text-accent" : "text-white/90"}>Recipes</NavLink>
            <NavLink to="/admin/subscriptions" className={({isActive}) => isActive ? "text-accent" : "text-white/90"}>Subscriptions</NavLink>
            <NavLink to="/admin/settings" className={({isActive}) => isActive ? "text-accent" : "text-white/90"}>Settings</NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
