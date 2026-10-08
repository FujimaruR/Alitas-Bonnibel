import { useLocale as useSiteLocale, t as tr } from '../site/locale';
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
  useSiteLocale();
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
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-800 mb-3"> {tr("text.8283e635e4")} </p>
            <h1 className="text-3xl md:text-5xl font-display leading-tight mb-4 drop-shadow-sm"> {tr("text.dc2908faea")} <span className="block">{tr("text.e1c2c15f91")}</span>
            </h1>
            <p className="text-sm md:text-base text-slate-800/90 max-w-md mb-6"> {tr("text.a4e2968ca9")} </p>

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
              > {tr("text.34d6aa1522")} <span className="text-lg">🍗</span>
              </a>

              <button
                onClick={() => navigate("/menu")}
                className="px-4 py-2.5 rounded-full bg-white/90 text-slate-900 text-sm font-semibold border border-white/60 hover:bg-white transition"
              > {tr("text.fce155c8e7")} </button>

              <span className="text-xs text-slate-900/80"> {tr("text.8270b6bb15")} <strong>{tr("text.40504f5b2d")}</strong>
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
              <p className="text-xs font-display tracking-[0.22em] uppercase text-wings-100/95"> {tr("text.b0ffd1992b")} </p>

              <h3 className="mt-2 text-2xl md:text-3xl font-display text-white leading-tight"> {tr("text.9ad6e56c96")} </h3>

              <p className="mt-2 text-sm text-white/85 max-w-md"> {tr("text.538072c764")} </p>

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
                > {tr("text.21b0ffbe82")} </button>

                <span className="text-xs text-white/70">{tr("text.e2d4d54bd7")}</span>
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
            <h2 className="text-xl md:text-2xl font-display text-slate-900"> {tr("text.e7d61d7734")} </h2>
            <p className="text-xs md:text-sm text-slate-500"> {tr("text.18c6d1e001")} </p>
          </div>
          <span className="hidden md:inline text-xs font-semibold text-wings-400"> {tr("text.0370105a81")} </span>
        </div>

        <FlavorShowcaseGrid />
      </section>

      <WaveSeparator topColor="#FFA832" bottomColor="#ffffff" flip />

      {/* DESTACADOS / MENÚ */}
      <section id="menu" className="bg-wings-200">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-slate-900"> {tr("text.f62dbb2084")} </h2>
              <p className="text-sm text-slate-700 mt-1"> {tr("text.8eca5ad6c9")} </p>
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
            > {tr("text.34d6aa1522")} <span className="text-lg">→</span>
            </button>
          </div>

          {loadingFeat ? (
            <div className="text-slate-700">{tr("text.88d921e627")}</div>
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
            <h2 className="text-xl md:text-2xl font-display text-slate-900 mb-3"> {tr("text.1528599e47")} </h2>
            <p className="text-sm text-slate-600 mb-3"> {tr("text.8dceacf736")} </p>
            <p className="text-sm text-slate-600"> {tr("text.65c0cb1fac")} </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <div className="text-2xl mb-1">🍗</div>
              <div className="font-semibold text-slate-900 mb-1"> {tr("text.21c3c91571")} </div>
              <p className="text-slate-500"> {tr("text.0cad8ae0c3")} </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <div className="text-2xl mb-1">🔥</div>
              <div className="font-semibold text-slate-900 mb-1"> {tr("text.f0a40aa36e")} </div>
              <p className="text-slate-500"> {tr("text.ffaae8dc41")} </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <div className="text-2xl mb-1">🚗</div>
              <div className="font-semibold text-slate-900 mb-1"> {tr("text.e801cf9536")} </div>
              <p className="text-slate-500"> {tr("text.1ffeac8b0e")} </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <div className="text-2xl mb-1">💛</div>
              <div className="font-semibold text-slate-900 mb-1"> {tr("text.696cb30189")} </div>
              <p className="text-slate-500"> {tr("text.b880d25e89")} </p>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection />
    </PublicLayout>
  );
}
