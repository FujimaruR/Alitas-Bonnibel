// src/components/layout/AppLayout.tsx
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
}

type NavItem = { label: string; to: string };

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const role = user?.role as string | undefined;
  const isAdmin = role === "ADMIN";
  const isKitchen = role === "KITCHEN";

  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const navItems: NavItem[] = useMemo(() => {
    // ADMIN
    if (isAdmin) {
      return [
        { label: "Dashboard", to: "/dashboard" },
        { label: "Menú (Admin)", to: "/menu-admin" },
        { label: "Mesas", to: "/tables" },
        { label: "Órdenes", to: "/orders" },
        { label: "Nueva Orden", to: "/orders/new" },
        { label: "Cocina", to: "/kitchen" },
        { label: "Usuarios", to: "/users" },
      ];
    }

    // KITCHEN
    if (isKitchen) {
      return [
        { label: "Cocina", to: "/kitchen" },
        { label: "Órdenes (solo lectura)", to: "/orders" },
      ];
    }

    // Otros (mesero, etc.)
    return [
      { label: "Órdenes", to: "/orders" },
      { label: "Mesas", to: "/tables" },
      { label: "Nueva Orden", to: "/orders/new" },
    ];
  }, [isAdmin, isKitchen]);

  function go(to: string) {
    navigate(to);
    setMobileOpen(false);
  }

  function isActive(to: string) {
    // activo exacto o por prefijo (ej: /orders y /orders/new)
    if (to === "/") return location.pathname === "/";
    return location.pathname === to || location.pathname.startsWith(to + "/");
  }

  const SidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header fijo */}
      <div className="shrink-0 mb-4">
        <h2 className="text-xl font-bold text-wings-100">Alitas Bonnibel</h2>
        <p className="text-xs text-slate-400">Panel administrativo</p>
      </div>

      {/* NAV scrolleable */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <nav className="text-sm space-y-2 pb-4">
          {navItems.map((item) => (
            <button
              key={item.to}
              onClick={() => go(item.to)}
              className={[
                "block w-full text-left px-3 py-2 rounded-lg transition",
                isActive(item.to)
                  ? "bg-white/10 border border-white/15 text-white"
                  : "hover:bg-white/5 text-white/90",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer fijo + safe-area */}
      {user && (
        <div
          className="
          shrink-0 mt-3
          border-t border-white/5
          pt-3
          pb-[max(0.75rem,env(safe-area-inset-bottom))]
          text-xs text-slate-300
        "
        >
          <div className="mb-2">
            <div className="font-semibold text-sm">{user.name}</div>
            <div className="text-slate-400">{user.email}</div>
            <div className="uppercase text-[10px] tracking-wide text-wings-200">
              {user.role}
            </div>
          </div>

          <button
            className="w-full text-left px-3 py-2 rounded-lg bg-wings-500/90 hover:bg-wings-400 text-xs font-extrabold transition"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );



  return (
    <div className="min-h-screen bg-panel-bg text-white">
      {/* Topbar (solo mobile) */}
      <header className="md:hidden sticky top-0 z-30 bg-panel-card/90 backdrop-blur border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition font-extrabold"
            aria-label="Abrir menú"
          >
            ☰
          </button>

          <div className="text-sm font-extrabold text-wings-100">
            Alitas Bonnibel
          </div>

          <button
            onClick={() => navigate("/")}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition text-xs font-extrabold"
          >
            Público
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar desktop */}
        <aside className="hidden md:flex w-64 bg-panel-card border-r border-white/10 p-4">
          {SidebarContent}
        </aside>

        {/* Drawer mobile */}
        <div className={["md:hidden", mobileOpen ? "" : "pointer-events-none"].join(" ")}>
          {/* overlay */}
          <div
            className={[
              "fixed inset-0 z-40 bg-black/60 transition-opacity",
              mobileOpen ? "opacity-100" : "opacity-0",
            ].join(" ")}
            onClick={() => setMobileOpen(false)}
          />

          {/* panel */}
          <aside
            className={[
              "fixed left-0 top-0 z-50",
              "h-[100dvh] w-[85vw] max-w-xs",
              "bg-panel-card border-r border-white/10",
              "transform transition-transform",
              "overflow-hidden",
              mobileOpen ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
          >
            {/* CONTENEDOR INTERNO */}
            <div className="h-full flex flex-col p-4">
              {/* Header móvil */}
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="text-sm font-extrabold text-wings-100">Menú</div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition font-extrabold"
                  aria-label="Cerrar menú"
                >
                  ✕
                </button>
              </div>

              {/* SIDEBAR CONTENT */}
              <div className="flex-1 min-h-0 overflow-hidden">
                {SidebarContent}
              </div>
            </div>
          </aside>

        </div>

        {/* Main */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
