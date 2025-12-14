// src/pages/LoginPage.tsx
import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("@example.com");
    const [password, setPassword] = useState(".....");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await api.post("/auth/login", { email, password });
            const { access_token, user } = res.data;
            // después de login exitoso:
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("user", JSON.stringify(user));

            const role = user?.role;

            if (role === "ADMIN") navigate("/dashboard");
            else if (role === "KITCHEN") navigate("/kitchen");
            else navigate("/orders"); // WAITER u otros

        } catch (err: any) {
            console.error(err);

            if (err.response) {
                // El backend respondió con un código de error (401, 400, etc.)
                setError("Correo o contraseña incorrectos");
            } else {
                // Error de red, CORS, backend caído, etc.
                setError("No se pudo conectar con el servidor. Intenta de nuevo.");
            }
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-panel-bg">
            <div className="w-full max-w-md bg-panel-card rounded-2xl p-8 shadow-xl border border-white/5">
                <h1 className="text-2xl font-bold mb-1 text-center text-wings-100">
                    Alitas Bonnibel
                </h1>
                <p className="text-sm text-slate-400 mb-6 text-center">
                    Panel de administración
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white mb-1">Correo electrónico</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-wings-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-1">Contraseña</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-wings-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 rounded-lg bg-wings-500 hover:bg-wings-400 font-semibold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Entrando..." : "Iniciar sesión"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="
                            w-full mt-3 py-2 rounded-lg
                            border border-white/20
                            text-white/80 text-sm font-medium
                            hover:bg-white/5 hover:text-white
                            transition
                        "
                    >
                        ← Volver al sitio
                    </button>

                </form>
            </div>
        </div>
    );
}
