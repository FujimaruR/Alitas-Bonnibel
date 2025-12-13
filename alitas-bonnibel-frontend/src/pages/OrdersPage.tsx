import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { AppLayout } from "../components/layout/AppLayout";

type Order = any;

function formatDateTime(x: string) {
    try {
        return new Date(x).toLocaleString();
    } catch {
        return x;
    }
}

export default function OrdersPage() {
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
        } catch (e: any) {
            setError(e?.response?.data?.message ?? e?.message ?? "Error cargando órdenes");
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
                        <h1 className="text-3xl font-extrabold text-wings-100">Órdenes</h1>
                        <p className="text-sm text-slate-300 mt-2">
                            Panel admin: lista, filtra y revisa el detalle de cada orden.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-panel-card border border-white/10 rounded-xl px-3 py-2 text-sm"
                        >
                            <option value="">Todos los estatus</option>
                            <option value="PENDING">PENDIENTE</option>
                            <option value="IN_PREPARATION">EN PREPARACIÓN</option>
                            <option value="READY">LISTO</option>
                            <option value="SERVED">ENTREGADO</option>
                            <option value="CANCELLED">CANCELADO</option>
                        </select>

                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="bg-panel-card border border-white/10 rounded-xl px-3 py-2 text-sm"
                        >
                            <option value="">Todos los tipos</option>
                            <option value="DINE_IN">DINE_IN</option>
                            <option value="TAKEOUT">TAKEOUT</option>
                            <option value="DELIVERY">DELIVERY</option>
                        </select>

                        <button
                            onClick={load}
                            className="px-4 py-2 rounded-xl bg-wings-500 hover:bg-wings-400 font-extrabold text-sm transition"
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
                ) : (
                    <div className="mt-8 grid gap-4">
                        {orders.map((o: any) => (
                            <div
                                key={o.id}
                                className="rounded-2xl bg-panel-card border border-white/10 p-5 hover:border-white/20 transition"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="font-extrabold text-white">
                                        Orden #{o.id}{" "}
                                        <span className="text-white/60">•</span>{" "}
                                        <span className="text-wings-200">{o.type}</span>{" "}
                                        <span className="text-white/60">•</span>{" "}
                                        <span className="text-wings-100">{o.status}</span>
                                    </div>
                                    <div className="text-xs text-slate-400">{formatDateTime(o.created_at)}</div>
                                </div>

                                <div className="mt-2 text-sm text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
                                    <div>
                                        Total: <span className="font-extrabold text-white">${o.total_amount}</span>
                                    </div>
                                    {o.table ? <div>Mesa: <span className="text-white">{o.table.name}</span></div> : null}
                                    {o.created_by ? <div>Por: <span className="text-white">{o.created_by.name}</span></div> : null}
                                </div>

                                <div className="mt-4 grid gap-2">
                                    {o.items?.map((it: any) => (
                                        <div key={it.id} className="flex justify-between text-sm">
                                            <div className="text-white/90">
                                                {it.quantity}x {it.product?.name ?? "Producto"}
                                            </div>
                                            <div className="text-white/70">${it.subtotal}</div>
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
