import { Reveal } from "./Reveal";

type Review = {
  name: string;
  text: string;
  avatarUrl: string;
  rating: number; // 1-5
};

const REVIEWS: Review[] = [
  {
    name: "Ancelma Martinez",
    text: "Excelente opción, muy rica la salsa de alitas!",
    avatarUrl: "https://i.pravatar.cc/100?img=32",
    rating: 5,
  },
  {
    name: "Ian Castillo",
    text: "Como siempre que compro, rapidito y bien rico las alitas.",
    avatarUrl: "https://i.pravatar.cc/100?img=12",
    rating: 5,
  },
  {
    name: "Oscar Cruz",
    text: "Excelentes alitas y la salsa bien sabrosa.",
    avatarUrl: "https://i.pravatar.cc/100?img=56",
    rating: 5,
  },
  {
    name: "Lizbeth Lopez",
    text: "Sin duda volvere a comprar.",
    avatarUrl: "https://i.pravatar.cc/100?img=47",
    rating: 5,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "text-slate-900" : "text-slate-900/30"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <Reveal>
        <h2 className="text-center font-display text-3xl md:text-5xl text-slate-900">
          Lo que dicen nuestros clientes
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {REVIEWS.map((r, i) => (
          <Reveal key={r.name} delayMs={i * 140}>
            <article
              className="
                rounded-3xl bg-wings-200
                border-2 border-slate-900/80
                shadow-[10px_10px_0_rgba(15,23,42,0.9)]
                hover:shadow-[14px_14px_0_rgba(15,23,42,0.9)]
                hover:-translate-y-1
                transition duration-300 ease-out
                p-6 h-full flex flex-col
              "
            >
              <Stars rating={r.rating} />

              <p className="mt-4 text-slate-900 text-base leading-relaxed">
                {r.text}
              </p>

              <div className="mt-auto pt-6 flex items-center gap-3">
                <div className="relative">
                  <img
                    src={r.avatarUrl}
                    alt={r.name}
                    className="w-12 h-12 rounded-full border-2 border-slate-900 object-cover"
                  />
                  <span className="absolute -right-1 -bottom-1 w-5 h-5 rounded-full bg-wings-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-extrabold">
                    ✓
                  </span>
                </div>

                <div className="font-extrabold text-slate-900">
                  {r.name}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delayMs={200}>
        <div className="mt-10 text-center">
          <a
            href="#contacto"
            className="
              inline-flex items-center gap-2
              px-6 py-3 rounded-full
              bg-slate-900 text-white font-extrabold
              shadow-[0_18px_45px_rgba(0,0,0,0.2)]
              hover:scale-105 transition
            "
          >
            Ver más reseñas <span>→</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
