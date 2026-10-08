import { errorMessage } from '../lib/errors';
import type { Order } from '../types/orders';
import { useLocale as useSiteLocale, t as tr, text as localizeText } from '../site/locale';
import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";

type DashboardSummary = {
  today: { orders: number; revenue: number; avgTicket: number };
  statusCounts: Record<string, number>;
  recentOrders: Order[];
};

function money(n: number) {
  return `$${Math.round(n).toLocaleString(document.documentElement.lang === "en" ? "en-US" : "es-MX")}`;
}

export default function DashboardPage() {
  useSiteLocale();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const res = await api.get("/orders/dashboard");
      setData(res.data);
    } catch (e: unknown) {
      setError(errorMessage(e, "Error cargando dashboard"));
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
            <h1 className="text-3xl font-extrabold text-wings-100">{tr("text.d87f47b47e")}</h1>
            <p className="text-sm text-slate-300 mt-2"> {tr("text.159ac99bae")} </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/kitchen")}
              className="px-4 py-2 rounded-xl bg-wings-500 hover:bg-wings-400 font-extrabold text-sm transition"
            > {tr("text.b357b80598")} </button>
            <button
              onClick={load}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 font-extrabold text-sm transition"
            > {tr("text.9d2c9d8010")} </button>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-slate-300">{tr("text.6b416d9c40")}</div>
        ) : error ? (
          <div className="py-10">
            <div className="text-red-300 font-bold">{tr("text.7f2f6a15cf")}</div>
            <div className="text-slate-300 text-sm mt-2">{localizeText(error)}</div>
          </div>
        ) : !data ? null : (
          <>
            {/* KPIs */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-panel-card border border-white/10 p-5">
                <div className="text-xs text-white/60">{tr("text.8d63114771")}</div>
                <div className="mt-2 text-3xl font-extrabold text-white">{localizeText(kpis.orders)}</div>
              </div>

              <div className="rounded-2xl bg-panel-card border border-white/10 p-5">
                <div className="text-xs text-white/60">{tr("text.b4e2897b8e")}</div>
                <div className="mt-2 text-3xl font-extrabold text-white">{money(kpis.revenue)}</div>
              </div>

              <div className="rounded-2xl bg-panel-card border border-white/10 p-5">
                <div className="text-xs text-white/60">{tr("text.30a64ac7b2")}</div>
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
                  <div className="text-xs text-white/60">{localizeText(label)}</div>
                  <div className="mt-2 text-2xl font-extrabold text-white">
                    {localizeText(status[key] ?? 0)}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="mt-8 rounded-2xl bg-panel-card border border-white/10 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-white">{tr("text.2b494091fa")}</h2>
                <button
                  onClick={() => navigate("/orders")}
                  className="text-sm font-extrabold text-wings-200 hover:text-wings-100"
                > {tr("text.fc104efebe")} </button>
              </div>

              <div className="mt-4 grid gap-3">
                {recent.map((o) => (
                  <div key={o.id} className="rounded-xl bg-black/20 border border-white/10 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="font-extrabold text-white">
                        #{localizeText(o.id)} <span className="text-white/50">•</span>{localizeText(" ")}
                        <span className="text-wings-200">{localizeText(o.type)}</span>{localizeText(" ")}
                        <span className="text-white/50">•</span>{localizeText(" ")}
                        <span className="text-wings-100">{localizeText(o.status)}</span>
                      </div>
                      <div className="text-xs text-white/60">
                        {new Date(o.created_at).toLocaleString(document.documentElement.lang === "en" ? "en-US" : "es-MX")}
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
                      <div>{tr("text.d8e7170f94")} <span className="text-white font-extrabold">{money(o.total_amount)}</span></div>
                      {o.table ? <div>{tr("text.c29941d0dd")} <span className="text-white">{localizeText(o.table.name)}</span></div> : null}
                      {o.created_by ? <div>{tr("text.34b98352ea")} <span className="text-white">{localizeText(o.created_by.name)}</span></div> : null}
                    </div>

                    <div className="mt-3 text-sm text-white/85">
                      {o.items?.slice(0, 4).map((it) => (
                        <div key={it.id}>
                          <span className="font-extrabold">{localizeText(it.quantity)}{tr("text.11f6ad8ec5")}</span>{localizeText(" ")}
                          {localizeText(it.product?.name ?? "Producto")}
                        </div>
                      ))}
                      {(o.items?.length ?? 0) > 4 ? (
                        <div className="text-xs text-white/60 mt-1">
                          +{(o.items?.length ?? 0) - 4} {tr("text.1d63920363")} </div>
                      ) : null}
                    </div>
                  </div>
                ))}

                {!recent.length ? (
                  <div className="text-sm text-white/60 py-6 text-center"> {tr("text.c5fa0308d0")} </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>

  );
}
