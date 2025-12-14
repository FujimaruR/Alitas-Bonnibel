import { useEffect, useState } from "react";
import { api } from "../api/client";
import { AppLayout } from "../components/layout/AppLayout";

type Table = any;

const STATUS = [
    { v: "FREE", label: "Libre" },
    { v: "OCCUPIED", label: "Ocupada" },
    { v: "RESERVED", label: "Reservada" },
];

export default function TablesPage() {
    const [tables, setTables] = useState<Table[]>([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        const res = await api.get("/tables");
        setTables(res.data);
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    async function createTable(e: React.FormEvent) {
        e.preventDefault();
        await api.post("/tables", { name, status: "FREE" });
        setName("");
        await load();
    }

    async function setStatus(id: number, status: string) {
        await api.patch(`/tables/${id}/status`, { status });
        await load();
    }

    async function removeTable(id: number) {
        if (!confirm("¿Eliminar mesa?")) return;
        await api.delete(`/tables/${id}`);
        await load();
    }

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-wings-100">Mesas</h1>
                        <p className="text-sm text-slate-300 mt-2">
                            Admin/Mesero: crear mesas, cambiar estatus y ver última orden activa.
                        </p>
                    </div>
                    <button
                        onClick={load}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 font-extrabold text-sm transition"
                    >
                        Recargar
                    </button>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl bg-panel-card border border-white/10 p-5">
                        <h2 className="font-extrabold text-white">Crear mesa</h2>
                        <form onSubmit={createTable} className="mt-4 grid gap-3">
                            <input
                                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white"
                                placeholder="Ej: Mesa 1"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <button className="px-4 py-2 rounded-xl bg-wings-500 hover:bg-wings-400 font-extrabold text-sm transition">
                                Crear
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
                        {loading ? (
                            <div className="text-slate-300 py-8">Cargando…</div>
                        ) : (
                            tables.map((t) => (
                                <div key={t.id} className="rounded-2xl bg-panel-card border border-white/10 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="font-extrabold text-white">{t.name}</div>
                                            <div className="text-xs text-white/60">ID: {t.id}</div>
                                        </div>

                                        <button
                                            onClick={() => removeTable(t.id)}
                                            className="text-xs font-extrabold px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-100 transition"
                                        >
                                            Eliminar
                                        </button>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-3">
                                        <span className="text-sm text-white/70">Estatus</span>
                                        <select
                                            value={t.status}
                                            onChange={(e) => setStatus(t.id, e.target.value)}
                                            className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                                        >
                                            {STATUS.map((s) => (
                                                <option key={s.v} value={s.v}>
                                                    {s.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mt-4 text-sm text-white/80">
                                        {t.orders?.[0] ? (
                                            <>
                                                <div className="text-white/60 text-xs">Última orden activa</div>
                                                <div className="font-extrabold">#{t.orders[0].id} — {t.orders[0].status}</div>
                                                <div className="mt-1 text-white/70">
                                                    {t.orders[0].items?.slice(0, 3).map((it: any) => (
                                                        <div key={it.id}>
                                                            <span className="font-extrabold">{it.quantity}x</span>{" "}
                                                            {it.product?.name ?? "Producto"}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-white/60 text-xs">Sin órdenes activas</div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>

    );
}
