import axios from 'axios';
import { useLocale as useSiteLocale, t as tr, text as localizeText } from '../site/locale';
// src/pages/LoginPage.tsx
import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function LoginPage() {
  useSiteLocale();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

        } catch (err: unknown) {
            console.error(err);

            if (axios.isAxiosError(err) && err.response) {
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
                <h1 className="text-2xl font-bold mb-1 text-center text-wings-100"> {tr("text.5c77c70346")} </h1>
                <p className="text-sm text-slate-400 mb-6 text-center"> {tr("text.17c736c0c7")} </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="login-email" className="block text-white mb-1">{tr("text.59a16700ff")}</label>
                        <input
                            id="login-email" required type="email"
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-wings-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label htmlFor="login-password" className="block text-white mb-1">{tr("text.5a6d1c6129")}</label>
                        <input
                            id="login-password" required type="password"
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-wings-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                            {localizeText(error)}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 rounded-lg bg-wings-500 hover:bg-wings-400 font-semibold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {localizeText(loading ? "Entrando..." : "Iniciar sesión")}
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
                    > {tr("text.ed6e3a63cc")} </button>

                </form>
            </div>
        </div>
    );
}
