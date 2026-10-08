import { errorMessage } from '../lib/errors';
import type { Order } from '../types/orders';
import { useLocale as useSiteLocale, t as tr, text as localizeText } from '../site/locale';
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api/client";
import { AppLayout } from "../components/layout/AppLayout";

function nextStatus(s: string) {
    if (s === "PENDING") return "IN_PREPARATION";
    if (s === "IN_PREPARATION") return "READY";
    if (s === "READY") return "SERVED";
    return s;
}

function since(x: string) {
    const d = new Date(x).getTime();
    const now = Date.now();
    const mins = Math.max(0, Math.floor((now - d) / 60000));
    if (mins < 1) return tr('time.seconds');
    if (mins === 1) return tr('time.one');
    return tr("template.4d03fa36c1", {v0: localizeText(mins)});
}

export default function KitchenPage() {
  useSiteLocale();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Para detectar “nueva orden” y (opcional) vibrar/sonido luego
    const lastIdsRef = useRef<Set<number>>(new Set());

    async function load() {
        try {
            setError(null);
            const res = await api.get("/orders/kitchen");
            const data: Order[] = res.data ?? [];

            // Detectar nuevas (opcional)
            const currentIds = new Set<number>(data.map((o) => o.id));
            /*if (!loading) {
                let hasNew = false;
                for (const id of currentIds) {
                    if (!lastIdsRef.current.has(id)) {
                        hasNew = true;
                        break;
                    }
                }
                // Aquí luego podemos meter toast/sonido si hasNew === true
            }*/
            lastIdsRef.current = currentIds;

            setOrders(data);
        } catch (e: unknown) {
            setError(errorMessage(e, "Error cargando tablero"));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        const t = setInterval(load, 3000);
        return () => clearInterval(t);
    }, []);

    async function advance(orderId: number, current: string) {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: nextStatus(current) });
            await load();
        } catch (e: unknown) {
            alert(errorMessage(e, "No se pudo actualizar el estatus"));
        }
    }

    const grouped = useMemo(() => {
        const buckets: Record<string, Order[]> = {
            PENDING: [],
            IN_PREPARATION: [],
            READY: [],
        };
        for (const o of orders) {
            if (buckets[o.status]) buckets[o.status].push(o);
        }
        return buckets;
    }, [orders]);

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-wings-100">{tr("text.e22ac0e4ca")}</h1>
                        <p className="text-sm text-slate-300 mt-2"> {tr("text.34635bfe08")} </p>
                    </div>

                    <button
                        onClick={load}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-extrabold transition"
                    > {tr("text.9d2c9d8010")} </button>
                </div>

                {loading ? (
                    <div className="py-10 text-slate-300">{tr("text.6b416d9c40")}</div>
                ) : error ? (
                    <div className="py-10">
                        <div className="text-red-300 font-bold">{tr("text.7f2f6a15cf")}</div>
                        <div className="text-slate-300 text-sm mt-2">{localizeText(error)}</div>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 lg:grid-cols-3">
                        {(["PENDING", "IN_PREPARATION", "READY"] as const).map((col) => (
                            <div key={col} className="rounded-2xl bg-panel-card border border-white/10 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="font-extrabold text-white">
                                        {localizeText(col === "PENDING"
                                            ? "Pendientes"
                                            : col === "IN_PREPARATION"
                                                ? "En preparación"
                                                : "Listas")}
                                    </div>
                                    <div className="text-xs text-white/60">{localizeText(grouped[col].length)}</div>
                                </div>

                                <div className="mt-4 grid gap-3">
                                    {grouped[col].map((o) => (
                                        <div
                                            key={o.id}
                                            className="rounded-2xl bg-white/5 border border-white/10 p-4 hover:border-white/20 transition"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="font-extrabold text-white">#{localizeText(o.id)}</div>
                                                <div className="text-xs text-white/60">{since(o.created_at)}</div>
                                            </div>

                                            <div className="text-xs text-white/60 mt-1">
                                                {localizeText(o.type)}
                                                {localizeText(o.table ? tr('order.table', { name: o.table.name }) : "")}
                                            </div>

                                            <div className="mt-3 grid gap-1">
                                                {o.items?.map((it) => (
                                                    <div key={it.id} className="text-sm text-white/90">
                                                        <span className="font-extrabold">{localizeText(it.quantity)}{tr("text.11f6ad8ec5")}</span>{localizeText(" ")}
                                                        {localizeText(it.product?.name ?? "Producto")}
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => advance(o.id, o.status)}
                                                className="mt-4 w-full px-4 py-2.5 rounded-xl bg-wings-500 hover:bg-wings-400 font-extrabold text-sm transition"
                                            > {tr("text.e71fea85c3")} {localizeText(nextStatus(o.status))}
                                            </button>
                                        </div>
                                    ))}

                                    {!grouped[col].length ? (
                                        <div className="text-sm text-white/60 py-6 text-center"> {tr("text.b715e2047a")} </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>

    );
}
