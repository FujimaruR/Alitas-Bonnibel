import { useLocale as useSiteLocale, money as formatMoney, t as tr, text as localizeText } from '../site/locale';
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { AppLayout } from "../components/layout/AppLayout";

type Category = {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

type Product = {
  id: number;
  categoryId: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl: string;
  badges: string[];
  isActive: boolean;
  isFeatured: boolean; // ✅ NUEVO
  sortOrder: number;
};

export default function MenuAdminPage() {
  useSiteLocale();
  const [editing, setEditing] = useState<Product | null>(null);

  const [editForm, setEditForm] = useState({
    categoryId: 0,
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    badges: "",
    isActive: true,
    isFeatured: false, // ✅ NUEVO
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const [catForm, setCatForm] = useState({ name: "", slug: "" });

  const [prodForm, setProdForm] = useState({
    categoryId: 0,
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    badges: "",
    isFeatured: false, // ✅ NUEVO (para crear ya como favorito si quieres)
  });

  function openEdit(p: Product) {
    setEditing(p);
    setEditForm({
      categoryId: p.categoryId,
      name: p.name,
      description: p.description ?? "",
      price: p.price,
      imageUrl: p.imageUrl,
      badges: (p.badges ?? []).join(", "),
      isActive: p.isActive,
      isFeatured: p.isFeatured ?? false, // ✅ NUEVO
    });
  }

  function closeEdit() {
    setEditing(null);
  }

  async function saveEdit() {
    if (!editing) return;

    await api.patch(`/admin/products/${editing.id}`, {
      categoryId: Number(editForm.categoryId),
      name: editForm.name,
      description: editForm.description || null,
      price: Number(editForm.price),
      imageUrl: editForm.imageUrl,
      badges: editForm.badges
        ? editForm.badges.split(",").map((x) => x.trim()).filter(Boolean)
        : [],
      isActive: editForm.isActive,
      isFeatured: editForm.isFeatured, // ✅ NUEVO
    });

    if (activeCategoryId) await loadProducts(activeCategoryId);
    await loadCategories();
    closeEdit();
  }

  const loadCategories = useCallback(async () => {
    const res = await api.get("/admin/categories");
    setCategories(res.data);
    setActiveCategoryId(previous => previous || res.data[0]?.id || previous);
  }, []);

  async function loadProducts(categoryId?: number) {
    const qs = categoryId ? `?categoryId=${categoryId}` : "";
    const res = await api.get(`/admin/products${qs}`);
    setProducts(res.data);
  }

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (activeCategoryId) loadProducts(activeCategoryId);
  }, [activeCategoryId]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCategoryId) ?? null,
    [categories, activeCategoryId]
  );

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/admin/categories", {
      name: catForm.name,
      slug: catForm.slug,
    });
    setCatForm({ name: "", slug: "" });
    await loadCategories();
  }

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!activeCategoryId) return;

    await api.post("/admin/products", {
      categoryId: activeCategoryId,
      name: prodForm.name,
      description: prodForm.description || undefined,
      price: Number(prodForm.price),
      imageUrl: prodForm.imageUrl,
      badges: prodForm.badges
        ? prodForm.badges.split(",").map((x) => x.trim()).filter(Boolean)
        : [],
      isFeatured: prodForm.isFeatured, // ✅ NUEVO
    });

    setProdForm({
      categoryId: 0,
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      badges: "",
      isFeatured: false,
    });

    await loadProducts(activeCategoryId);
    await loadCategories();
  }

  async function toggleProduct(p: Product) {
    await api.patch(`/admin/products/${p.id}`, { isActive: !p.isActive });
    if (activeCategoryId) await loadProducts(activeCategoryId);
  }

  async function toggleFeatured(p: Product) {
    await api.patch(`/admin/products/${p.id}`, { isFeatured: !p.isFeatured });
    if (activeCategoryId) await loadProducts(activeCategoryId);
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-wings-100">{tr("text.a9833c398f")}</h1>
            <p className="text-sm text-slate-300 mt-2"> {tr("text.3b47084615")} </p>
          </div>
          <button
            onClick={() => activeCategoryId && loadProducts(activeCategoryId)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 font-extrabold text-sm transition"
          > {tr("text.9d2c9d8010")} </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Left: Categories */}
          <div className="rounded-2xl bg-panel-card border border-white/10 p-5">
            <h2 className="font-extrabold text-white">{tr("text.941a1528f5")}</h2>

            <div className="mt-4 grid gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategoryId(c.id)}
                  className={[
                    "w-full text-left px-3 py-2 rounded-xl border transition",
                    c.id === activeCategoryId
                      ? "bg-white/10 border-white/20"
                      : "bg-black/20 border-white/10 hover:border-white/20",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold text-white">{localizeText(c.name)}</div>
                    <div className="text-xs text-white/60">{localizeText(c.slug)}</div>
                  </div>
                </button>
              ))}
            </div>

            <form onSubmit={createCategory} className="mt-6 grid gap-2">
              <div className="text-xs text-white/60">{tr("text.6d74a1cb98")}</div>
              <input
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                placeholder={tr("text.dd16d75f26")}
                value={catForm.name}
                onChange={(e) => setCatForm((s) => ({ ...s, name: e.target.value }))}
                required
              />
              <input
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                placeholder={tr("text.22c1f13ab2")}
                value={catForm.slug}
                onChange={(e) => setCatForm((s) => ({ ...s, slug: e.target.value }))}
                required
              />
              <button className="mt-2 px-4 py-2 rounded-xl bg-wings-500 hover:bg-wings-400 font-extrabold text-sm transition"> {tr("text.48a0686f58")} </button>
            </form>
          </div>

          {/* Right: Products */}
          <div className="lg:col-span-2 rounded-2xl bg-panel-card border border-white/10 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-extrabold text-white"> {tr("text.14e2a639ae")} {localizeText(activeCategory ? `— ${activeCategory.name}` : "")}
              </h2>
            </div>

            <form onSubmit={createProduct} className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                placeholder={tr("text.9d9d07014d")}
                value={prodForm.name}
                onChange={(e) => setProdForm((s) => ({ ...s, name: e.target.value }))}
                required
              />
              <input
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                placeholder={tr("text.cfb3a6126f")}
                type="number"
                value={prodForm.price}
                onChange={(e) => setProdForm((s) => ({ ...s, price: Number(e.target.value) }))}
                required
              />
              <input
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white md:col-span-2"
                placeholder={tr("text.35c80f9645")}
                value={prodForm.imageUrl}
                onChange={(e) => setProdForm((s) => ({ ...s, imageUrl: e.target.value }))}
                required
              />
              <input
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white md:col-span-2"
                placeholder={tr("text.7908858ff7")}
                value={prodForm.description}
                onChange={(e) => setProdForm((s) => ({ ...s, description: e.target.value }))}
              />
              <input
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white md:col-span-2"
                placeholder={tr("text.e7f1aa5a59")}
                value={prodForm.badges}
                onChange={(e) => setProdForm((s) => ({ ...s, badges: e.target.value }))}
              />

              {/* ✅ NUEVO: favorito al crear */}
              <div className="md:col-span-2 flex items-center justify-between rounded-xl bg-black/20 border border-white/10 px-3 py-2">
                <div className="text-sm text-white/80 font-extrabold">{tr("text.77d0785671")}</div>
                <label className="inline-flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={prodForm.isFeatured}
                    onChange={(e) => setProdForm((s) => ({ ...s, isFeatured: e.target.checked }))}
                  /> {tr("text.f05ea232f8")} </label>
              </div>

              <button className="md:col-span-2 mt-1 px-4 py-2 rounded-xl bg-wings-500 hover:bg-wings-400 font-extrabold text-sm transition"> {tr("text.7b0b7ab8ba")} </button>
            </form>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div key={p.id} className="rounded-2xl bg-black/20 border border-white/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-extrabold text-white">{localizeText(p.name)}</div>
                      <div className="text-sm text-white/70 mt-1">{formatMoney(p.price)}</div>
                      <div className="text-xs text-white/50 mt-1">#{localizeText(p.id)}</div>
                    </div>

                    {p.isFeatured ? (
                      <div className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-wings-500/20 text-wings-100"> {tr("text.65a9147b67")} </div>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-xs font-extrabold px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition"
                    > {tr("text.2b5f23437f")} </button>

                    <button
                      onClick={() => toggleFeatured(p)}
                      className="text-xs font-extrabold px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition"
                    >
                      {localizeText(p.isFeatured ? "Quitar favorito" : "Hacer favorito")}
                    </button>

                    <button
                      onClick={() => toggleProduct(p)}
                      className="text-xs font-extrabold px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition"
                    >
                      {localizeText(p.isActive ? "Desactivar" : "Activar")}
                    </button>
                  </div>
                </div>
              ))}

              {!products.length ? (
                <div className="text-sm text-white/60 py-8"> {tr("text.f6ab8a1ae9")} </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* ✅ Modal editar */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={closeEdit} />
            <div className="relative w-full max-w-xl rounded-2xl bg-panel-card border border-white/10 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-white">{tr("text.c45766d474")}</h3>
                  <div className="text-xs text-white/60 mt-1">{tr("text.8cbdfad7f9")}{localizeText(editing.id)}</div>
                </div>

                <button
                  onClick={closeEdit}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-extrabold transition"
                > {tr("text.4b0816bbd5")} </button>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-xs text-white/60">{tr("text.e8149c028c")}</label>
                  <select
                    value={editForm.categoryId}
                    onChange={(e) => setEditForm((s) => ({ ...s, categoryId: Number(e.target.value) }))}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {localizeText(c.name)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-white/60">{tr("text.e68491e91c")}</label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60">{tr("text.18e0707ea7")}</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm((s) => ({ ...s, price: Number(e.target.value) }))}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60">{tr("text.10140fb91e")}</label>
                  <select
                    value={editForm.isActive ? "1" : "0"}
                    onChange={(e) => setEditForm((s) => ({ ...s, isActive: e.target.value === "1" }))}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    <option value="1">{tr("text.873caab4d0")}</option>
                    <option value="0">{tr("text.816c52fd2b")}</option>
                  </select>
                </div>

                {/* ✅ NUEVO: favorito */}
                <div className="md:col-span-2 flex items-center justify-between rounded-xl bg-black/20 border border-white/10 px-3 py-2">
                  <div className="text-sm text-white/80 font-extrabold">{tr("text.77d0785671")}</div>
                  <label className="inline-flex items-center gap-2 text-sm text-white/70">
                    <input
                      type="checkbox"
                      checked={editForm.isFeatured}
                      onChange={(e) => setEditForm((s) => ({ ...s, isFeatured: e.target.checked }))}
                    /> {tr("text.f05ea232f8")} </label>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-white/60">{tr("text.35c80f9645")}</label>
                  <input
                    value={editForm.imageUrl}
                    onChange={(e) => setEditForm((s) => ({ ...s, imageUrl: e.target.value }))}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-white/60">{tr("text.7fda397059")}</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm((s) => ({ ...s, description: e.target.value }))}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-white/60">{tr("text.6677b8a69f")}</label>
                  <input
                    value={editForm.badges}
                    onChange={(e) => setEditForm((s) => ({ ...s, badges: e.target.value }))}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={closeEdit}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 font-extrabold text-sm transition"
                > {tr("text.c111e0ab9d")} </button>

                <button
                  onClick={saveEdit}
                  className="px-4 py-2 rounded-xl bg-wings-500 hover:bg-wings-400 font-extrabold text-sm transition"
                > {tr("text.831d46b9be")} </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
