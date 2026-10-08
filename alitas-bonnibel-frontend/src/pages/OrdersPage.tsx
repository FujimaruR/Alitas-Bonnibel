import { errorMessage } from '../lib/errors';
import type { Order } from '../types/orders';
import { useLocale as useSiteLocale, t as tr, text as localizeText } from '../site/locale';
import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { AppLayout } from "../components/layout/AppLayout";

function formatDateTime(x: string) {
    try {
        return new Date(x).toLocaleString(document.documentElement.lang === "en" ? "en-US" : "es-MX");
    } catch {
        return x;
    }
}

export default function OrdersPage() {
  useSiteLocale();
    const [orders, setOrders] = useState<Order[]>([]);
    const [status, setStatus] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const query = useMemo(() => {
        const params = new URLSearchParams();
        if (status) params.set("status", status);
        if (type) params.set("type", type);
        params.set("limit", "80");
        const qs = params.toString();
        return qs ? `?${qs}` : "";
    }, [status, type]);

    async function load() {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get(`/orders${query}`);
            setOrders(res.data);
        } catch (e: unknown) {
            setError(errorMessage(e, "Error cargando órdenes"));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-wings-100">{tr("text.2582b2b860")}</h1>
                        <p className="text-sm text-slate-300 mt-2"> {tr("text.017ef4b7df")} </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-panel-card border border-white/10 rounded-xl px-3 py-2 text-sm"
                        >
                            <option value="">{tr("text.0e911db114")}</option>
                            <option value="PENDING">{tr("text.9a3897ef57")}</option>
                            <option value="IN_PREPARATION">{tr("text.c4eac97b03")}</option>
                            <option value="READY">{tr("text.f7c71d363f")}</option>
                            <option value="SERVED">{tr("text.a99ec083d1")}</option>
                            <option value="CANCELLED">{tr("text.f028e7914c")}</option>
                        </select>

                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="bg-panel-card border border-white/10 rounded-xl px-3 py-2 text-sm"
                        >
                            <option value="">{tr("text.71577ee257")}</option>
                            <option value="DINE_IN">{tr("text.9af0a9c042")}</option>
                            <option value="TAKEOUT">{tr("text.d8b4c27638")}</option>
                            <option value="DELIVERY">{tr("text.34d4e4c718")}</option>
                        </select>

                        <button
                            onClick={load}
                            className="px-4 py-2 rounded-xl bg-wings-500 hover:bg-wings-400 font-extrabold text-sm transition"
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
                ) : (
                    <div className="mt-8 grid gap-4">
                        {orders.map((o) => (
                            <div
                                key={o.id}
                                className="rounded-2xl bg-panel-card border border-white/10 p-5 hover:border-white/20 transition"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="font-extrabold text-white"> {tr("text.60ba402d92")}{localizeText(o.id)}{localizeText(" ")}
                                        <span className="text-white/60">•</span>{localizeText(" ")}
                                        <span className="text-wings-200">{localizeText(o.type)}</span>{localizeText(" ")}
                                        <span className="text-white/60">•</span>{localizeText(" ")}
                                        <span className="text-wings-100">{localizeText(o.status)}</span>
                                    </div>
                                    <div className="text-xs text-slate-400">{formatDateTime(o.created_at)}</div>
                                </div>

                                <div className="mt-2 text-sm text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
                                    <div> {tr("text.d8e7170f94")} <span className="font-extrabold text-white">${localizeText(o.total_amount)}</span>
                                    </div>
                                    {o.table ? <div>{tr("text.c29941d0dd")} <span className="text-white">{localizeText(o.table.name)}</span></div> : null}
                                    {o.created_by ? <div>{tr("text.34b98352ea")} <span className="text-white">{localizeText(o.created_by.name)}</span></div> : null}
                                </div>

                                <div className="mt-4 grid gap-2">
                                    {o.items?.map((it) => (
                                        <div key={it.id} className="flex justify-between text-sm">
                                            <div className="text-white/90">
                                                {localizeText(it.quantity)}{tr("text.11f6ad8ec5")} {localizeText(it.product?.name ?? "Producto")}
                                            </div>
                                            <div className="text-white/70">${localizeText(it.subtotal)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>

    );
}
