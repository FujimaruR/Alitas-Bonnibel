import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";

type Table = { id: number; name: string; status: "FREE" | "OCCUPIED" | "RESERVED" };
type Category = { id: number; name: string; slug: string; isActive: boolean };
type Product = {
    id: number;
    categoryId: number;
    name: string;
    description?: string | null;
    price: number;
    imageUrl: string;
    badges: string[];
    isActive: boolean;
};

type CartItem = { product: Product; qty: number };

type OrderType = "DINE_IN" | "TAKEOUT" | "DELIVERY";

function money(n: number) {
    return `$${Math.round(n).toLocaleString("es-MX")}`;
}

export default function NewOrderPage() {
    const navigate = useNavigate();

    const [type, setType] = useState<OrderType>("DINE_IN");
    const [tables, setTables] = useState<Table[]>([]);
    const [tableId, setTableId] = useState<number | "">("");

    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<number | "ALL">("ALL");
    const [q, setQ] = useState("");

    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadAll() {
        setLoading(true);
        setError(null);
        try {
            const [tRes, menuRes] = await Promise.all([
                api.get("/tables"),
                api.get("/public/menu"),
            ]);


            setTables(tRes.data);
            const menu = menuRes.data as Array<any>; // MenuCategory[]
            const cats = menu.map((c) => ({ id: c.id, name: c.name, slug: c.slug, isActive: true }));
            const prods = menu.flatMap((c) =>
                (c.products ?? []).map((p: any) => ({
                    ...p,
                    categoryId: c.id, // el menu público normalmente trae categoryId, pero lo forzamos por seguridad
                }))
            );

            setCategories(cats);
            setProducts(prods);


            // default mesa: primera FREE si es DINE_IN
            const firstFree = (tRes.data as Table[]).find((t) => t.status === "FREE");
            setTableId(firstFree ? firstFree.id : "");
        } catch (e: any) {
            setError(e?.response?.data?.message ?? e?.message ?? "Error cargando datos");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAll();
    }, []);

    // Si cambian tipo a no DINE_IN, no usar mesa
    useEffect(() => {
        if (type !== "DINE_IN") setTableId("");
        else {
            // intenta seleccionar una FREE si no hay mesa
            if (tableId === "") {
                const free = tables.find((t) => t.status === "FREE");
                if (free) setTableId(free.id);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    const filteredProducts = useMemo(() => {
        const qq = q.trim().toLowerCase();
        return products
            .filter((p) => p.isActive)
            .filter((p) => (activeCategoryId === "ALL" ? true : p.categoryId === activeCategoryId))
            .filter((p) => (qq ? p.name.toLowerCase().includes(qq) : true));
    }, [products, activeCategoryId, q]);

    const total = useMemo(() => {
        return cart.reduce((acc, it) => acc + it.product.price * it.qty, 0);
    }, [cart]);

    function addProduct(p: Product) {
        setCart((prev) => {
            const idx = prev.findIndex((x) => x.product.id === p.id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
                return next;
            }
            return [...prev, { product: p, qty: 1 }];
        });
    }

    function decProduct(productId: number) {
        setCart((prev) => {
            const idx = prev.findIndex((x) => x.product.id === productId);
            if (idx < 0) return prev;
            const next = [...prev];
            const item = next[idx];
            if (item.qty <= 1) {
                next.splice(idx, 1);
                return next;
            }
            next[idx] = { ...item, qty: item.qty - 1 };
            return next;
        });
    }

    function incProduct(productId: number) {
        setCart((prev) => {
            const idx = prev.findIndex((x) => x.product.id === productId);
            if (idx < 0) return prev;
            const next = [...prev];
            next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
            return next;
        });
    }

    async function createOrder() {
        setError(null);

        if (!cart.length) {
            setError("Agrega al menos 1 producto a la orden.");
            return;
        }

        if (type === "DINE_IN" && !tableId) {
            setError("Selecciona una mesa para DINE_IN.");
            return;
        }

        const payload: any = {
            type,
            items: cart.map((it) => ({ productId: it.product.id, quantity: it.qty })),
        };

        if (type === "DINE_IN") payload.table_id = Number(tableId);

        setSubmitting(true);
        try {
            const res = await api.post("/orders", payload);
            // si quieres, puedes navegar a /orders y resaltar la nueva
            navigate("/orders");
            // o: navigate(`/orders/${res.data.id}`) si tienes esa ruta
        } catch (e: any) {
            setError(e?.response?.data?.message ?? e?.message ?? "No se pudo crear la orden");
        } finally {
            setSubmitting(false);
        }
    }

    const tablesForSelect = useMemo(() => {
        // permitir escoger todas, pero visualmente marcamos ocupadas
        return tables.slice().sort((a, b) => a.id - b.id);
    }, [tables]);

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-wings-100">Nueva Orden</h1>
                        <p className="text-sm text-slate-300 mt-2">
                            Selecciona mesa (si aplica) y arma el pedido.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/orders")}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 font-extrabold text-sm transition"
                        >
                            Ver órdenes
                        </button>
                        <button
                            onClick={loadAll}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 font-extrabold text-sm transition"
                        >
                            Recargar
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="py-10 text-slate-300">Cargando…</div>
                ) : error ? (
                    <div className="mt-6 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3">
                        {error}
                    </div>
                ) : null}

                {!loading && (
                    <div className="mt-8 grid gap-6 lg:grid-cols-3">
                        {/* Left: order config */}
                        <div className="rounded-2xl bg-panel-card border border-white/10 p-5">
                            <h2 className="font-extrabold text-white">Detalles</h2>

                            <div className="mt-4 grid gap-3">
                                <label className="text-xs text-white/60">Tipo</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as OrderType)}
                                    className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                                >
                                    <option value="DINE_IN">DINE_IN (Mesa)</option>
                                    <option value="TAKEOUT">TAKEOUT</option>
                                    <option value="DELIVERY">DELIVERY</option>
                                </select>

                                {type === "DINE_IN" && (
                                    <>
                                        <label className="text-xs text-white/60 mt-2">Mesa</label>
                                        <select
                                            value={tableId}
                                            onChange={(e) => setTableId(e.target.value ? Number(e.target.value) : "")}
                                            className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                                        >
                                            <option value="">Selecciona…</option>
                                            {tablesForSelect.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.name} — {t.status}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="text-xs text-white/50">
                                            Tip: ideal escoger una mesa <span className="text-emerald-200 font-bold">FREE</span>.
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Cart */}
                            <div className="mt-6">
                                <h3 className="font-extrabold text-white">Carrito</h3>

                                <div className="mt-3 grid gap-2">
                                    {cart.map((it) => (
                                        <div
                                            key={it.product.id}
                                            className="rounded-xl bg-black/20 border border-white/10 p-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="font-extrabold text-white">{it.product.name}</div>
                                                    <div className="text-xs text-white/60">{money(it.product.price)} c/u</div>
                                                </div>
                                                <div className="text-sm font-extrabold text-white">{money(it.product.price * it.qty)}</div>
                                            </div>

                                            <div className="mt-2 flex items-center gap-2">
                                                <button
                                                    onClick={() => decProduct(it.product.id)}
                                                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 font-extrabold text-sm transition"
                                                >
                                                    −
                                                </button>
                                                <div className="min-w-10 text-center font-extrabold text-white">{it.qty}</div>
                                                <button
                                                    onClick={() => incProduct(it.product.id)}
                                                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 font-extrabold text-sm transition"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {!cart.length ? (
                                        <div className="text-sm text-white/60 py-6 text-center">
                                            Agrega productos de la lista ➜
                                        </div>
                                    ) : null}
                                </div>

                                <div className="mt-4 rounded-xl bg-black/30 border border-white/10 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-white/70 text-sm">Total</div>
                                        <div className="text-2xl font-extrabold text-white">{money(total)}</div>
                                    </div>

                                    <button
                                        onClick={createOrder}
                                        disabled={submitting}
                                        className="
                    w-full mt-4 py-3 rounded-xl
                    bg-wings-500 hover:bg-wings-400
                    font-extrabold text-sm transition
                    disabled:opacity-60 disabled:cursor-not-allowed
                  "
                                    >
                                        {submitting ? "Creando…" : "Crear orden"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right: products */}
                        <div className="lg:col-span-2 rounded-2xl bg-panel-card border border-white/10 p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="font-extrabold text-white">Productos</h2>

                                <div className="flex flex-wrap gap-2">
                                    <select
                                        value={activeCategoryId}
                                        onChange={(e) =>
                                            setActiveCategoryId(e.target.value === "ALL" ? "ALL" : Number(e.target.value))
                                        }
                                        className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                                    >
                                        <option value="ALL">Todas</option>
                                        {categories
                                            .filter((c) => c.isActive)
                                            .map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                    </select>

                                    <input
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                        placeholder="Buscar producto…"
                                        className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                                    />
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredProducts.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => addProduct(p)}
                                        className="text-left rounded-2xl bg-black/20 border border-white/10 p-4 hover:border-white/20 hover:bg-black/25 transition"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="font-extrabold text-white">{p.name}</div>
                                                <div className="text-xs text-white/60 mt-1">{money(p.price)}</div>
                                            </div>
                                            <div className="text-xs font-extrabold px-2 py-1 rounded-full bg-white/10 text-white/80">
                                                + Agregar
                                            </div>
                                        </div>

                                        {p.description ? (
                                            <div className="mt-2 text-xs text-white/60 line-clamp-2">{p.description}</div>
                                        ) : null}

                                        {p.badges?.length ? (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {p.badges.slice(0, 2).map((b) => (
                                                    <span
                                                        key={b}
                                                        className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-wings-500/20 text-wings-100"
                                                    >
                                                        {b}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : null}
                                    </button>
                                ))}

                                {!filteredProducts.length ? (
                                    <div className="text-sm text-white/60 py-10">
                                        No hay productos que coincidan con tu búsqueda.
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>

    );
}
