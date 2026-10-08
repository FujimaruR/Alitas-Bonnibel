import { errorMessage } from '../lib/errors';
import { useLocale as useSiteLocale, t as tr, text as localizeText } from '../site/locale';
import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../lib/api";
import type { MenuCategory } from "../types/menu";

import { PublicLayout } from "../components/layout/PublicLayout";
import { Reveal } from "../components/public/Reveal";
import { MenuCategoryTabs } from "../components/public/MenuCategoryTabs";
import { MenuProductCard } from "../components/public/MenuProductCard";
import { WaveSeparatorGradient } from "../components/public/WaveSeparatorGradient";
import { useCart } from "../cart/cart.shared";
import { CartDrawer } from "../components/cart/CartDrawer";

const WHATSAPP_NUMBER = "528118925876";

function waLink(message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function emojiBySlug(slug: string) {
  switch (slug) {
    case "alitas":
      return "🍗";
    case "boneless":
      return "🍖";
    case "papas":
      return "🍟";
    case "bebidas":
      return "🥤";
    case "combos":
      return "⭐";
    default:
      return "🔥";
  }
}

function subtitleBySlug(slug: string) {
  switch (slug) {
    case "combos":
      return "Lo más pedido. Perfecto para compartir (o no).";
    case "alitas":
      return "Clásicas, jugosas, con salsa que se nota.";
    case "boneless":
      return "Crujientes por fuera, jugosos por dentro.";
    case "papas":
      return "El acompañamiento obligatorio.";
    case "bebidas":
      return "Para acompañar el picor 🔥";
    default:
      return "Elige tu favorito.";
  }
}

function SectionHeader({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle: string;
}) {
  useSiteLocale();
  return (
    <div id={id} className="scroll-mt-32">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-3xl md:text-4xl text-slate-900">
            {localizeText(title)}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{localizeText(subtitle)}</p>
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  useSiteLocale();
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cartOpen, setCartOpen] = useState(false);
  const { items, subtotal, totalItems } = useCart();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const data = await apiGet<MenuCategory[]>("/public/menu");
        if (mounted) setMenu(data);
      } catch (e: unknown) {
        if (mounted) setError(errorMessage(e, "Error cargando menú"));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const whatsappUrl = useMemo(() => {
    const lines = items.map(
      (x) => `• ${x.qty}x ${x.name} — $${x.price * x.qty}`
    );
    const msg =
      `Hola! Quiero hacer este pedido 🍗🔥\n\n` +
      (lines.length ? lines.join("\n") : "(carrito vacío)") +
      `\n\nSubtotal: $${subtotal}\n\n` +
      `Nombre:\nDirección:\nForma de pago:`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }, [items, subtotal]);

  if (loading) {
    return <div className="px-6 py-10">{tr("text.addbb5a3b5")}</div>;
  }

  if (error) {
    return (
      <div className="px-6 py-10">
        <div className="font-extrabold text-wings-500"> {tr("text.c0dd54901c")} </div>
        <div className="text-sm text-slate-600 mt-2">{localizeText(error)}</div>
      </div>
    );
  }

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative -mt-24 pt-32 bg-gradient-to-br from-wings-100 via-wings-300 to-wings-500">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <Reveal>
            <h1 className="font-display text-4xl md:text-6xl text-slate-900"> {tr("text.17ea0a188c")} </h1>
            <p className="mt-3 text-slate-800 max-w-2xl"> {tr("text.233bbdd7ea")} </p>

            <div className="flex flex-wrap gap-4 mt-6">
              <a
                href={waLink("Hola! Quiero el menú y promos de hoy 🍗🔥")}
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3 rounded-full bg-slate-900 text-white font-extrabold hover:scale-105 transition"
              > {tr("text.d177555653")} </a>

              <button
                onClick={() => setCartOpen(true)}
                className="px-5 py-3 rounded-full border-2 border-slate-900/70 bg-white/70 backdrop-blur font-extrabold hover:bg-slate-900 hover:text-white transition"
              > {tr("text.1bd9f47b2f")}{localizeText(totalItems)})
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <WaveSeparatorGradient
        id="hero-to-white"
        from="#FE8330"
        to="#FD3A2D"
        bottomColor="#ffffff"
        angle={135}
      />

      {/* Tabs */}
      <div className="py-6">
        <MenuCategoryTabs
          categories={menu.map((c) => ({
            id: c.slug,
            label: c.name,
            emoji: emojiBySlug(c.slug),
          }))}
        />
      </div>

      {/* MENU */}
      <section className="max-w-6xl mx-auto px-4 pb-20 space-y-16">
        {menu.map((cat, catIndex) => (
          <div key={cat.slug} className="space-y-6">
            <Reveal>
              <SectionHeader
                id={cat.slug}
                title={localizeText(`${emojiBySlug(cat.slug)} ${cat.name}`)}
                subtitle={subtitleBySlug(cat.slug)}
              />
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.products.map((p, i) => (
                <Reveal key={p.id} delayMs={catIndex * 120 + i * 120}>
                  <MenuProductCard
                    id={`p-${p.id}`}
                    name={p.name}
                    description={p.description ?? ""}
                    price={p.price}
                    imageUrl={p.imageUrl}
                    badges={p.badges ?? []}
                    onAdded={() => setCartOpen(true)}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        ))}

        {/* CTA FINAL */}
        <Reveal>
          <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-10">
            <h3 className="font-display text-3xl md:text-4xl"> {tr("text.5988e0409d")} </h3>
            <p className="mt-2 text-white/80 max-w-2xl"> {tr("text.a0d7de2810")} </p>

            <a
              href={waLink("Hola! Quiero hacer un pedido 🍗🔥")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-7 py-3 rounded-full bg-wings-500 hover:bg-wings-400 font-extrabold transition"
            > {tr("text.d177555653")} </a>
          </div>
        </Reveal>
      </section>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        whatsappUrl={whatsappUrl}
      />
    </PublicLayout>
  );
}
