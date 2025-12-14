import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PublicLayout } from "../components/layout/PublicLayout";
import { WaveSeparator } from "../components/public/WaveSeparator";
import { WaveSeparatorGradient } from "../components/public/WaveSeparatorGradient";
import { Reveal } from "../components/public/Reveal";
import { FlavorShowcaseGrid } from "../components/public/FlavorShowcaseGrid";
import { ReviewsSection } from "../components/public/ReviewsSection";
import { MenuProductCard } from "../components/public/MenuProductCard";

import { apiGet } from "../lib/api";

type Featured = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl: string;
  badges: string[];
};

export default function PublicHomePage() {
  const navigate = useNavigate();

  const [featured, setFeatured] = useState<Featured[]>([]);
  const [loadingFeat, setLoadingFeat] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoadingFeat(true);
        const data = await apiGet<Featured[]>("/public/featured?limit=6");
        if (mounted) setFeatured(data);
      } finally {
        if (mounted) setLoadingFeat(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative -mt-24 pt-32 bg-gradient-to-br from-wings-100 via-wings-300 to-wings-500">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          {/* Texto */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-800 mb-3">
              WINGS · BONELESS · PAPAS
            </p>
            <h1 className="text-3xl md:text-5xl font-display leading-tight mb-4 drop-shadow-sm">
              Alitas que despiertan
              <span className="block">el antojo desde la primera vista.</span>
            </h1>
            <p className="text-sm md:text-base text-slate-800/90 max-w-md mb-6">
              Combos de alitas, boneless y papas con salsas que van desde el
              “apenas pica” hasta el “¿por qué hice esto?”. Pide, comparte y disfruta.
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <a
                href="#menu"
                className="
                  inline-flex items-center gap-2
                  px-7 py-3 rounded-full
                  text-base font-extrabold
                  text-white
                  bg-gradient-to-r from-wings-500 to-wings-400
                  shadow-[0_18px_45px_rgba(253,58,45,0.45)]
                  transition
                  hover:scale-105 hover:shadow-[0_24px_60px_rgba(253,58,45,0.55)]
                  animate-soft-pulse
                "
              >
                Ver menú <span className="text-lg">🍗</span>
              </a>

              <button
                onClick={() => navigate("/menu")}
                className="px-4 py-2.5 rounded-full bg-white/90 text-slate-900 text-sm font-semibold border border-white/60 hover:bg-white transition"
              >
                Pide para llevar
              </button>

              <span className="text-xs text-slate-900/80">
                ⏰ Hoy abrimos de <strong>4:00 pm a 11:00 pm</strong>
              </span>
            </div>
          </div>

          {/* Highlight */}
          <div
            className="
              animate-slide-up
              relative overflow-hidden rounded-3xl
              shadow-[0_26px_70px_rgba(0,0,0,0.28)]
              bg-cover bg-center
            "
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=1400&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/15" />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20" />

            <div className="relative p-7">
              <p className="text-xs font-display tracking-[0.22em] uppercase text-wings-100/95">
                Hoy se antoja
              </p>

              <h3 className="mt-2 text-2xl md:text-3xl font-display text-white leading-tight">
                Combo 12 Alitas
              </h3>

              <p className="mt-2 text-sm text-white/85 max-w-md">
                Elige hasta 2 sabores, papas gajo y un dip cremoso.
              </p>

              <div className="mt-5 flex flex-wrap gap-3 items-center">
                <button
                  onClick={() => navigate("/menu")}
                  className="
                    px-6 py-2.5 rounded-2xl
                    border-2 border-white/70
                    bg-white/10 text-white font-extrabold
                    shadow-sm
                    transition
                    hover:bg-white/15 hover:scale-105
                  "
                >
                  Pedir ahora!
                </button>

                <span className="text-xs text-white/70">⏰ Promo limitada</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveSeparatorGradient
        id="hero-to-white"
        from="#FE8330"
        to="#FD3A2D"
        bottomColor="#ffffff"
        angle={135}
      />

      {/* SABORES */}
      <section id="sabores" className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-display text-slate-900">
              Salsas y sabores
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Del “tranqui” al “¡trae leche por favor!”. Elige tu nivel de picor.
            </p>
          </div>
          <span className="hidden md:inline text-xs font-semibold text-wings-400">
            4+ sabores para combinar
          </span>
        </div>

        <FlavorShowcaseGrid />
      </section>

      <WaveSeparator topColor="#FFA832" bottomColor="#ffffff" flip />

      {/* DESTACADOS / MENÚ */}
      <section id="menu" className="bg-wings-200">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-slate-900">
                Los favoritos de la casa
              </h2>
              <p className="text-sm text-slate-700 mt-1">
                Estos se eligen solos. Los marcaste como ⭐ en admin.
              </p>
            </div>

            <button
              onClick={() => navigate("/menu")}
              className="
                inline-flex items-center gap-2
                px-4 py-2 rounded-full
                text-sm font-extrabold
                text-slate-900
                border-2 border-slate-900/70
                bg-transparent
                transition
                hover:bg-slate-900 hover:text-white
                hover:scale-105
              "
            >
              Ver menú <span className="text-lg">→</span>
            </button>
          </div>

          {loadingFeat ? (
            <div className="text-slate-700">Cargando favoritos…</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p, i) => (
                <Reveal key={p.id} delayMs={i * 120}>
                  <MenuProductCard
                    id={`p-${p.id}`}
                    name={p.name}
                    description={p.description ?? ""}
                    price={p.price}
                    imageUrl={p.imageUrl}
                    badges={p.badges}
                    onAdded={() => navigate("/menu")}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <WaveSeparator topColor="#FFA832" bottomColor="#ffffff" />

      {/* NOSOTROS */}
      <section id="nosotros" className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-display text-slate-900 mb-3">
              Alitas con cariño de cocina casera.
            </h2>
            <p className="text-sm text-slate-600 mb-3">
              Alitas Bonnibel nace del amor por compartir comida rica, honesta
              y bien servida. Nada de porciones tristes: aquí se viene a comer
              a gusto.
            </p>
            <p className="text-sm text-slate-600">
              Usamos ingredientes frescos, salsas preparadas al momento y
              combinaciones pensadas para que siempre encuentres algo nuevo
              que probar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <div className="text-2xl mb-1">🍗</div>
              <div className="font-semibold text-slate-900 mb-1">
                Porciones generosas
              </div>
              <p className="text-slate-500">
                Combos pensados para compartir (o no compartir, tampoco juzgamos).
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <div className="text-2xl mb-1">🔥</div>
              <div className="font-semibold text-slate-900 mb-1">
                Niveles de picor
              </div>
              <p className="text-slate-500">
                Desde salsas suaves hasta retos para valientes.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <div className="text-2xl mb-1">🚗</div>
              <div className="font-semibold text-slate-900 mb-1">
                Para llevar y en sitio
              </div>
              <p className="text-slate-500">
                Pide para tu casa o ven a disfrutar la experiencia completa.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <div className="text-2xl mb-1">💛</div>
              <div className="font-semibold text-slate-900 mb-1">
                Servicio cercano
              </div>
              <p className="text-slate-500">
                Queremos ser “tu lugar de confianza” para alitas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection />
    </PublicLayout>
  );
}
