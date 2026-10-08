import type { Table } from '../types/orders';
import { useLocale as useSiteLocale, t as tr, text as localizeText } from '../site/locale';
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { AppLayout } from "../components/layout/AppLayout";

const STATUS = [
    { v: "FREE", label: "Libre" },
    { v: "OCCUPIED", label: "Ocupada" },
    { v: "RESERVED", label: "Reservada" },
];

export default function TablesPage() {
  useSiteLocale();
    const [tables, setTables] = useState<Table[]>([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            const res = await api.get('/tables');
            setTables(res.data);
        } catch { alert(tr('ui.load_error')); }
        finally { setLoading(false); }
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
        if (!confirm(tr("text.c3957cd4b7"))) return;
        await api.delete(`/tables/${id}`);
        await load();
    }

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-wings-100">{tr("text.d006456c4f")}</h1>
                        <p className="text-sm text-slate-300 mt-2"> {tr("text.fd99b1e393")} </p>
                    </div>
                    <button
                        onClick={load}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 font-extrabold text-sm transition"
                    > {tr("text.9d2c9d8010")} </button>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl bg-panel-card border border-white/10 p-5">
                        <h2 className="font-extrabold text-white">{tr("text.2423c7858b")}</h2>
                        <form onSubmit={createTable} className="mt-4 grid gap-3">
                            <input
                                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white"
                                placeholder={tr("text.b9b8e84b01")}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <button className="px-4 py-2 rounded-xl bg-wings-500 hover:bg-wings-400 font-extrabold text-sm transition"> {tr("text.48a0686f58")} </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
                        {loading ? (
                            <div className="text-slate-300 py-8">{tr("text.6b416d9c40")}</div>
                        ) : (
                            tables.map((t) => (
                                <div key={t.id} className="rounded-2xl bg-panel-card border border-white/10 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="font-extrabold text-white">{localizeText(t.name)}</div>
                                            <div className="text-xs text-white/60">{tr("text.d789a1e992")} {localizeText(t.id)}</div>
                                        </div>

                                        <button
                                            onClick={() => removeTable(t.id)}
                                            className="text-xs font-extrabold px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-100 transition"
                                        > {tr("text.54e140f9f0")} </button>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-3">
                                        <span className="text-sm text-white/70">{tr("text.a57253206f")}</span>
                                        <select
                                            value={t.status}
                                            onChange={(e) => setStatus(t.id, e.target.value)}
                                            className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                                        >
                                            {STATUS.map((s) => (
                                                <option key={s.v} value={s.v}>
                                                    {localizeText(s.label)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mt-4 text-sm text-white/80">
                                        {t.orders?.[0] ? (
                                            <>
                                                <div className="text-white/60 text-xs">{tr("text.34aa4da164")}</div>
                                                <div className="font-extrabold">#{localizeText(t.orders[0].id)} — {localizeText(t.orders[0].status)}</div>
                                                <div className="mt-1 text-white/70">
                                                    {t.orders[0].items?.slice(0, 3).map((it) => (
                                                        <div key={it.id}>
                                                            <span className="font-extrabold">{localizeText(it.quantity)}{tr("text.11f6ad8ec5")}</span>{localizeText(" ")}
                                                            {localizeText(it.product?.name ?? "Producto")}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-white/60 text-xs">{tr("text.671f4d3902")}</div>
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
