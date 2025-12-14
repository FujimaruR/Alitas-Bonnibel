import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";

type DashboardSummary = {
  today: { orders: number; revenue: number; avgTicket: number };
  statusCounts: Record<string, number>;
  recentOrders: any[];
};

function money(n: number) {
  return `$${Math.round(n).toLocaleString("es-MX")}`;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const res = await api.get("/orders/dashboard");
      setData(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Error cargando dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  const kpis = useMemo(() => {
    const orders = data?.today.orders ?? 0;
    const revenue = data?.today.revenue ?? 0;
    const avg = data?.today.avgTicket ?? 0;
    return { orders, revenue, avg };
  }, [data]);

  const status = data?.statusCounts ?? {};

  const recent = data?.recentOrders ?? [];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-wings-100">Dashboard</h1>
            <p className="text-sm text-slate-300 mt-2">
              Resumen de hoy. Auto-refresh cada 5s.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/kitchen")}
              className="px-4 py-2 rounded-xl bg-wings-500 hover:bg-wings-400 font-extrabold text-sm transition"
            >
              Ir a Cocina
            </button>
            <button
              onClick={load}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 font-extrabold text-sm transition"
            >
              Recargar
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-slate-300">Cargando…</div>
        ) : error ? (
          <div className="py-10">
            <div className="text-red-300 font-bold">Error</div>
            <div className="text-slate-300 text-sm mt-2">{error}</div>
          </div>
        ) : !data ? null : (
          <>
            {/* KPIs */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-panel-card border border-white/10 p-5">
                <div className="text-xs text-white/60">Órdenes hoy</div>
                <div className="mt-2 text-3xl font-extrabold text-white">{kpis.orders}</div>
              </div>

              <div className="rounded-2xl bg-panel-card border border-white/10 p-5">
                <div className="text-xs text-white/60">Ventas hoy</div>
                <div className="mt-2 text-3xl font-extrabold text-white">{money(kpis.revenue)}</div>
              </div>

              <div className="rounded-2xl bg-panel-card border border-white/10 p-5">
                <div className="text-xs text-white/60">Ticket promedio</div>
                <div className="mt-2 text-3xl font-extrabold text-white">{money(kpis.avg)}</div>
              </div>
            </div>

            {/* Status quick */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ["PENDING", "Pendientes"],
                ["IN_PREPARATION", "Preparación"],
                ["READY", "Listas"],
                ["SERVED", "Entregadas"],
                ["CANCELLED", "Canceladas"],
              ].map(([key, label]) => (
                <div key={key} className="rounded-2xl bg-panel-card border border-white/10 p-4">
                  <div className="text-xs text-white/60">{label}</div>
                  <div className="mt-2 text-2xl font-extrabold text-white">
                    {status[key] ?? 0}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="mt-8 rounded-2xl bg-panel-card border border-white/10 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-white">Órdenes recientes</h2>
                <button
                  onClick={() => navigate("/orders")}
                  className="text-sm font-extrabold text-wings-200 hover:text-wings-100"
                >
                  Ver todas →
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                {recent.map((o: any) => (
                  <div key={o.id} className="rounded-xl bg-black/20 border border-white/10 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="font-extrabold text-white">
                        #{o.id} <span className="text-white/50">•</span>{" "}
                        <span className="text-wings-200">{o.type}</span>{" "}
                        <span className="text-white/50">•</span>{" "}
                        <span className="text-wings-100">{o.status}</span>
                      </div>
                      <div className="text-xs text-white/60">
                        {new Date(o.created_at).toLocaleString()}
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
                      <div>Total: <span className="text-white font-extrabold">{money(o.total_amount)}</span></div>
                      {o.table ? <div>Mesa: <span className="text-white">{o.table.name}</span></div> : null}
                      {o.created_by ? <div>Por: <span className="text-white">{o.created_by.name}</span></div> : null}
                    </div>

                    <div className="mt-3 text-sm text-white/85">
                      {o.items?.slice(0, 4).map((it: any) => (
                        <div key={it.id}>
                          <span className="font-extrabold">{it.quantity}x</span>{" "}
                          {it.product?.name ?? "Producto"}
                        </div>
                      ))}
                      {o.items?.length > 4 ? (
                        <div className="text-xs text-white/60 mt-1">
                          +{o.items.length - 4} más…
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}

                {!recent.length ? (
                  <div className="text-sm text-white/60 py-6 text-center">
                    No hay órdenes hoy todavía.
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>

  );
}
