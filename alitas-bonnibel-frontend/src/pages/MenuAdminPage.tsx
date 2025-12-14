import { useEffect, useMemo, useState } from "react";
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

  async function loadCategories() {
    const res = await api.get("/admin/categories");
    setCategories(res.data);
    if (!activeCategoryId && res.data.length) {
      setActiveCategoryId(res.data[0].id);
    }
  }

  async function loadProducts(categoryId?: number) {
    const qs = categoryId ? `?categoryId=${categoryId}` : "";
    const res = await api.get(`/admin/products${qs}`);
    setProducts(res.data);
  }

  useEffect(() => {
    loadCategories();
  }, []);

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
            <h1 className="text-3xl font-extrabold text-wings-100">Menú (Admin)</h1>
            <p className="text-sm text-slate-300 mt-2">
              Crea categorías y productos. Los inactivos no salen en el menú público.
              Los favoritos se muestran en la landing.
            </p>
          </div>
          <button
            onClick={() => activeCategoryId && loadProducts(activeCategoryId)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 font-extrabold text-sm transition"
          >
            Recargar
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Left: Categories */}
          <div className="rounded-2xl bg-panel-card border border-white/10 p-5">
            <h2 className="font-extrabold text-white">Categorías</h2>

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
                    <div className="font-extrabold text-white">{c.name}</div>
                    <div className="text-xs text-white/60">{c.slug}</div>
                  </div>
                </button>
              ))}
            </div>

            <form onSubmit={createCategory} className="mt-6 grid gap-2">
              <div className="text-xs text-white/60">Crear categoría</div>
              <input
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                placeholder="Nombre (ej. Alitas)"
                value={catForm.name}
                onChange={(e) => setCatForm((s) => ({ ...s, name: e.target.value }))}
                required
              />
              <input
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                placeholder="Slug (ej. alitas)"
                value={catForm.slug}
                onChange={(e) => setCatForm((s) => ({ ...s, slug: e.target.value }))}
                required
              />
              <button className="mt-2 px-4 py-2 rounded-xl bg-wings-500 hover:bg-wings-400 font-extrabold text-sm transition">
                Crear
              </button>
            </form>
          </div>

          {/* Right: Products */}
          <div className="lg:col-span-2 rounded-2xl bg-panel-card border border-white/10 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-extrabold text-white">
                Productos {activeCategory ? `— ${activeCategory.name}` : ""}
              </h2>
            </div>

            <form onSubmit={createProduct} className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                placeholder="Nombre (ej. Alitas 12 pzas)"
                value={prodForm.name}
                onChange={(e) => setProdForm((s) => ({ ...s, name: e.target.value }))}
                required
              />
              <input
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                placeholder="Precio (ej. 179)"
                type="number"
                value={prodForm.price}
                onChange={(e) => setProdForm((s) => ({ ...s, price: Number(e.target.value) }))}
                required
              />
              <input
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white md:col-span-2"
                placeholder="Image URL"
                value={prodForm.imageUrl}
                onChange={(e) => setProdForm((s) => ({ ...s, imageUrl: e.target.value }))}
                required
              />
              <input
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white md:col-span-2"
                placeholder="Descripción (opcional)"
                value={prodForm.description}
                onChange={(e) => setProdForm((s) => ({ ...s, description: e.target.value }))}
              />
              <input
                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white md:col-span-2"
                placeholder="Badges separados por coma (ej. Más pedido, 2 salsas)"
                value={prodForm.badges}
                onChange={(e) => setProdForm((s) => ({ ...s, badges: e.target.value }))}
              />

              {/* ✅ NUEVO: favorito al crear */}
              <div className="md:col-span-2 flex items-center justify-between rounded-xl bg-black/20 border border-white/10 px-3 py-2">
                <div className="text-sm text-white/80 font-extrabold">⭐ Favorito (landing)</div>
                <label className="inline-flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={prodForm.isFeatured}
                    onChange={(e) => setProdForm((s) => ({ ...s, isFeatured: e.target.checked }))}
                  />
                  Marcar
                </label>
              </div>

              <button className="md:col-span-2 mt-1 px-4 py-2 rounded-xl bg-wings-500 hover:bg-wings-400 font-extrabold text-sm transition">
                Crear producto
              </button>
            </form>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div key={p.id} className="rounded-2xl bg-black/20 border border-white/10 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-extrabold text-white">{p.name}</div>
                      <div className="text-sm text-white/70 mt-1">${p.price}</div>
                      <div className="text-xs text-white/50 mt-1">#{p.id}</div>
                    </div>

                    {p.isFeatured ? (
                      <div className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-wings-500/20 text-wings-100">
                        ⭐ Favorito
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-xs font-extrabold px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => toggleFeatured(p)}
                      className="text-xs font-extrabold px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition"
                    >
                      {p.isFeatured ? "Quitar favorito" : "Hacer favorito"}
                    </button>

                    <button
                      onClick={() => toggleProduct(p)}
                      className="text-xs font-extrabold px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition"
                    >
                      {p.isActive ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </div>
              ))}

              {!products.length ? (
                <div className="text-sm text-white/60 py-8">
                  No hay productos en esta categoría aún.
                </div>
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
                  <h3 className="text-xl font-extrabold text-white">Editar producto</h3>
                  <div className="text-xs text-white/60 mt-1">ID #{editing.id}</div>
                </div>

                <button
                  onClick={closeEdit}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-extrabold transition"
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-xs text-white/60">Categoría</label>
                  <select
                    value={editForm.categoryId}
                    onChange={(e) => setEditForm((s) => ({ ...s, categoryId: Number(e.target.value) }))}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-white/60">Nombre</label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60">Precio</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm((s) => ({ ...s, price: Number(e.target.value) }))}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60">Activo</label>
                  <select
                    value={editForm.isActive ? "1" : "0"}
                    onChange={(e) => setEditForm((s) => ({ ...s, isActive: e.target.value === "1" }))}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </select>
                </div>

                {/* ✅ NUEVO: favorito */}
                <div className="md:col-span-2 flex items-center justify-between rounded-xl bg-black/20 border border-white/10 px-3 py-2">
                  <div className="text-sm text-white/80 font-extrabold">⭐ Favorito (landing)</div>
                  <label className="inline-flex items-center gap-2 text-sm text-white/70">
                    <input
                      type="checkbox"
                      checked={editForm.isFeatured}
                      onChange={(e) => setEditForm((s) => ({ ...s, isFeatured: e.target.checked }))}
                    />
                    Marcar
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-white/60">Image URL</label>
                  <input
                    value={editForm.imageUrl}
                    onChange={(e) => setEditForm((s) => ({ ...s, imageUrl: e.target.value }))}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-white/60">Descripción</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm((s) => ({ ...s, description: e.target.value }))}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-white/60">Badges (separados por coma)</label>
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
                >
                  Cancelar
                </button>

                <button
                  onClick={saveEdit}
                  className="px-4 py-2 rounded-xl bg-wings-500 hover:bg-wings-400 font-extrabold text-sm transition"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
