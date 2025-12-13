// src/components/layout/AppLayout.tsx
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const role = user?.role as string | undefined;

  const isAdmin = role === "ADMIN";
  const isKitchen = role === "KITCHEN";


  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-panel-bg text-white flex">
      <aside className="w-64 bg-panel-card border-r border-white/10 p-4 flex flex-col">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-wings-100">Alitas Bonnibel</h2>
          <p className="text-xs text-slate-400">Panel administrativo</p>
        </div>

        <nav className="flex-1 text-sm space-y-2">
          {/* ADMIN */}
          {isAdmin && (
            <>
              <button className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5" onClick={() => navigate("/dashboard")}>
                Dashboard
              </button>

              <button className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5" onClick={() => navigate("/menu-admin")}>
                Menú (Admin)
              </button>

              <button className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5" onClick={() => navigate("/tables")}>
                Mesas
              </button>

              <button className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5" onClick={() => navigate("/orders")}>
                Órdenes
              </button>

              <button className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5" onClick={() => navigate("/kitchen")}>
                Cocina
              </button>

              <button className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5" onClick={() => navigate("/users")}>
                Usuarios
              </button>
            </>
          )}

          {/* KITCHEN */}
          {isKitchen && (
            <>
              <button className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5" onClick={() => navigate("/kitchen")}>
                Cocina
              </button>

              <button className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5" onClick={() => navigate("/orders")}>
                Órdenes (solo lectura)
              </button>
            </>
          )}

          {/* Otros roles (opcional) */}
          {!isAdmin && !isKitchen && (
            <>
              <button className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5" onClick={() => navigate("/orders")}>
                Órdenes
              </button>
              <button className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5" onClick={() => navigate("/tables")}>
                Mesas
              </button>
            </>
          )}
        </nav>


        {user && (
          <div className="mt-6 border-t border-white/5 pt-3 text-xs text-slate-300">
            <div className="mb-2">
              <div className="font-semibold text-sm">{user.name}</div>
              <div className="text-slate-400">{user.email}</div>
              <div className="uppercase text-[10px] tracking-wide text-wings-200">
                {user.role}
              </div>
            </div>
            <button
              className="w-full text-left px-3 py-1.5 rounded-lg bg-wings-500/90 hover:bg-wings-400 text-xs transition"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
