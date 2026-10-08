import { useLocale as useSiteLocale, t as tr, text as localizeText } from '../site/locale';
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { AppLayout } from "../components/layout/AppLayout";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at?: string;
};

export default function UsersPage() {
  useSiteLocale();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "KITCHEN",
    });

    async function load() {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch { alert(tr('ui.load_error')); }
        finally { setLoading(false); }
    }

    useEffect(() => {
        load();
    }, []);

    async function createUser(e: React.FormEvent) {
        e.preventDefault();
        await api.post("/users", form);
        setForm({ name: "", email: "", password: "", role: "KITCHEN" });
        await load();
    }

    async function deleteUser(id: number) {
        if (!confirm(tr("text.9e3962db53"))) return;
        await api.delete(`/users/${id}`);
        await load();
    }

    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-extrabold text-wings-100">{tr("text.cc13c6f5b1")}</h1>
                <p className="text-sm text-slate-300 mt-2">{tr("text.08b5b12110")}</p>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl bg-panel-card border border-white/10 p-5">
                        <h2 className="font-extrabold text-white">{tr("text.e0a3e106ba")}</h2>

                        <form onSubmit={createUser} className="mt-4 grid gap-3">
                            <input
                                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2"
                                placeholder={tr("text.e68491e91c")}
                                value={form.name}
                                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                                required
                            />
                            <input
                                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2"
                                placeholder={tr("text.84add5b295")}
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                                required
                            />
                            <input
                                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2"
                                placeholder={tr("text.8be3c943b1")}
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                                required
                            />
                            <select
                                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2"
                                value={form.role}
                                onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
                            >
                                <option value="ADMIN">{tr("text.b521caa6e1")}</option>
                                <option value="KITCHEN">{tr("text.0e6a0fe992")}</option>
                                <option value="WAITER">{tr("text.baa596bec4")}</option>
                            </select>

                            <button className="mt-2 px-4 py-2 rounded-xl bg-wings-500 hover:bg-wings-400 font-extrabold transition"> {tr("text.48a0686f58")} </button>
                        </form>
                    </div>

                    <div className="rounded-2xl bg-panel-card border border-white/10 p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="font-extrabold text-white">{tr("text.e41a947762")}</h2>
                            <button
                                onClick={load}
                                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-extrabold transition"
                            > {tr("text.9d2c9d8010")} </button>
                        </div>

                        {loading ? (
                            <div className="py-6 text-slate-300">{tr("text.6b416d9c40")}</div>
                        ) : (
                            <div className="mt-4 grid gap-3">
                                {users.map((u) => (
                                    <div key={u.id} className="rounded-xl bg-black/20 border border-white/10 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="font-extrabold text-white">{localizeText(u.name)}</div>
                                                <div className="text-sm text-slate-300">{localizeText(u.email)}</div>
                                                <div className="text-xs uppercase tracking-wide text-wings-200 mt-1">
                                                    {localizeText(u.role)}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => deleteUser(u.id)}
                                                className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-100 text-sm font-extrabold transition"
                                            > {tr("text.54e140f9f0")} </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>

    );
}
