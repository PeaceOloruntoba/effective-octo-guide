import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { Toaster } from "sonner";

function Sidebar({
  links,
  open,
  onClose,
}: {
  links: { name: string; to: string }[];
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-primary z-30 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } flex flex-col px-4 py-6`}
      >
        <div className="mb-6 flex justify-between items-center">
          <Link to="/" className="font-bold text-white text-xl">
            Bunzi
          </Link>
          <button onClick={onClose} className="text-white text-2xl md:hidden">
            ×
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `text-white/90 hover:text-accent transition ${
                  isActive ? "text-accent font-semibold" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const links = [
    { name: "Dashboard", to: "/app/dashboard" },
    { name: "Recipes", to: "/app/recipes" },
    { name: "Nutrition", to: "/app/nutrition" },
    { name: "Shopping", to: "/app/shopping" },
    { name: "Pantry", to: "/app/pantry" },
    { name: "Billing", to: "/app/billing" },
    { name: "Settings", to: "/app/settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-primary shadow-md">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-bold text-white text-lg md:text-xl">
            Bunzi
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "text-accent font-semibold" : "text-white/90 hover:text-accent transition"
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <Sidebar links={links} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* MAIN */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Toaster position="top-right" richColors />
    </div>
  );
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const links = [
    { name: "Users", to: "/admin/users" },
    { name: "Recipes", to: "/admin/recipes" },
    { name: "Subscriptions", to: "/admin/subscriptions" },
    { name: "Settings", to: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-primary shadow-md">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/admin/dashboard" className="font-bold text-white text-lg md:text-xl">
            Bunzi Admin
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "text-accent font-semibold" : "text-white/90 hover:text-accent transition"
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <Sidebar links={links} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* MAIN */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Toaster position="top-right" richColors />
    </div>
  );
}
