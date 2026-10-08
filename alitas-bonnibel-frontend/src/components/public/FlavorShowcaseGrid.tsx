import { useLocale as useSiteLocale, t as tr, text as localizeText } from '../../site/locale';
import { useState } from "react";

type Flavor = {
  name: string;
  heat: string;
  short: string;
  long: string;
  imageUrl: string;
  badge?: string;
};

const FLAVORS: Flavor[] = [
  {
    name: "Búfalo Clásico",
    heat: "🔥🔥",
    short: "Picor perfecto para los amantes del clásico.",
    long: "Equilibrio perfecto entre ácido, sal y picor. Ideal para empezar y para combinar con ranch o blue cheese.",
    imageUrl:
      "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=1400&q=80",
    badge: "Clásico",
  },
  {
    name: "Mango Habanero",
    heat: "🔥🔥🔥",
    short: "Dulce al inicio, fuego al final.",
    long: "Frutal y picosito con final intenso. Perfecta si quieres algo diferente sin perder el punch.",
    imageUrl:
      "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&w=1400&q=80",
    badge: "Top",
  },
  {
    name: "BBQ Ahumada",
    heat: "🔥",
    short: "Dulce, ahumada y pegajosa, como debe ser.",
    long: "Sabor profundo con toque ahumado. Va increíble con papas gajo y un extra de salsa.",
    imageUrl:
      "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1400&q=80",
    badge: "Ahumada",
  },
  {
    name: "Lemon Pepper",
    heat: "🌶️",
    short: "Refrescante, cítrica y especiada.",
    long: "Cítrico, pimienta y sal. Perfecta para los que quieren sabor sin enchilarse tanto.",
    imageUrl:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1400&q=80",
    badge: "Fresh",
  },
];

export function FlavorShowcaseGrid() {
  useSiteLocale();
  const [active, setActive] = useState<number>(0);

  return (
    <div
      className="
        grid gap-4
        grid-cols-1 sm:grid-cols-2
        md:grid-cols-4
        auto-rows-[190px]
        md:auto-rows-[170px]
      "
      onMouseLeave={() => setActive(0)}
    >
      {FLAVORS.map((f, i) => {
        const isActive = i === active;

        return (
          <button
            key={f.name}
            type="button"
            onMouseEnter={() => setActive(i)}
            className={`
              group relative overflow-hidden rounded-3xl text-left
              border border-white/25 bg-black
              transition-all duration-300 ease-out
              shadow-[0_16px_40px_rgba(0,0,0,0.18)]
              hover:shadow-[0_22px_55px_rgba(0,0,0,0.24)]
              focus:outline-none focus:ring-2 focus:ring-wings-300/60

              /* ✅ MÓVIL: todas normales (sin “activo”) */
              col-span-1 row-span-1

              /* ✅ DESKTOP: modo interactivo */
              md:${isActive ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}
              md:${!isActive ? "opacity-60" : "opacity-100"}
            `}
          >
            {/* ✅ IMAGEN: visible SIEMPRE en móvil, y en desktop solo FULL cuando active */}
            <div
              className={`
                absolute inset-0 bg-cover bg-center
                transition duration-300
                opacity-100
                md:${isActive ? "opacity-100 scale-[1.03]" : "opacity-35 scale-100"}
              `}
              style={{ backgroundImage: `url('${f.imageUrl}')` }}
            />

            {/* ✅ Overlay: en móvil suave, en desktop depende del active */}
            <div
              className={`
                absolute inset-0 transition duration-300
                bg-gradient-to-r from-black/55 via-black/25 to-black/10
                md:${isActive
                  ? "from-black/70 via-black/35 to-black/15"
                  : "from-black/55 via-black/25 to-black/10"}
              `}
            />

            {/* Borde interno */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/20 md:ring-transparent md:group-hover:ring-wings-300/40 transition" />

            {/* Contenido */}
            <div className="relative p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg md:text-base md:group-hover:text-base">
                      {localizeText(f.name)}
                    </h3>

                    {f.badge && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-wings-100 text-slate-900 shadow">
                        {localizeText(f.badge)}
                      </span>
                    )}
                  </div>

                  {/* ✅ MÓVIL: siempre muestra short */}
                  <p className="mt-2 text-sm text-white/85 md:text-xs md:text-white/75">
                    {localizeText(f.short)}
                  </p>
                </div>

                <span className="text-sm text-white">{localizeText(f.heat)}</span>
              </div>

              {/* ✅ Desktop: info extra solo cuando active */}
              <div
                className={`
                  mt-4 hidden md:grid gap-3
                  transition duration-300
                  ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
                `}
              >
                <p className="text-sm text-white/90 max-w-xl">{localizeText(f.long)}</p>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs"> {tr("text.eae4b7eb1c")} </span>
                  <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs"> {tr("text.faef499a26")} </span>
                  <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs"> {tr("text.242188afee")} </span>
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-white/70"> {tr("text.9c756414ab")} </span>

                  <span className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wings-500 hover:bg-wings-400 text-white text-sm font-extrabold shadow-lg shadow-wings-500/30 transition hover:scale-105"> {tr("text.1c4c8859ae")} </span>
                </div>
              </div>

              {/* ✅ Hint solo desktop y solo cuando no active */}
              <div className={`mt-4 hidden md:block text-xs text-white/70 ${isActive ? "opacity-0" : "opacity-100"}`}> {tr("text.6d8a4d65c3")} </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
