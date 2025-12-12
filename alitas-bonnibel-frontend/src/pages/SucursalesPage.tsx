import { PublicLayout } from "../components/layout/PublicLayout";
import { Reveal } from "../components/public/Reveal";
import { BranchesMap } from "../components/public/BranchesMap";
import { WaveSeparatorGradient } from "../components/public/WaveSeparatorGradient";

const BRANCHES = [
    {
        name: "Alitas Bonnibel · Centro",
        address: "Av. Juárez 123, Centro, Monterrey, NL",
        mapQuery: "Centro Monterrey Nuevo León",
    },
    {
        name: "Alitas Bonnibel · San Nicolás",
        address: "Av. Universidad 456, San Nicolás, NL",
        mapQuery: "San Nicolás de los Garza Nuevo León",
    },
    {
        name: "Alitas Bonnibel · Guadalupe",
        address: "Av. Miguel Alemán 789, Guadalupe, NL",
        mapQuery: "Guadalupe Nuevo León",
    },
];

export default function SucursalesPage() {
    return (
        <PublicLayout>
            {/* HERO */}
            <section className="relative -mt-24 pt-32 bg-gradient-to-br from-wings-100 via-wings-300 to-wings-500">
                <div className="max-w-6xl mx-auto px-4 py-20">
                    <Reveal>
                        <h1 className="font-display text-4xl md:text-6xl text-slate-900">
                            Nuestras sucursales
                        </h1>
                        <p className="mt-4 max-w-xl text-slate-800">
                            Encuentra la sucursal más cercana y ven por tus alitas favoritas 🍗🔥
                        </p>
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

            {/* MAPA */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <BranchesMap branches={BRANCHES} />
            </section>

            {/* LISTADO */}
            <section className="max-w-6xl mx-auto px-4 pb-20">
                <div className="grid md:grid-cols-3 gap-6">
                    {BRANCHES.map((b, i) => (
                        <Reveal key={b.name} delayMs={i * 140}>
                            <article
                                className="
                  rounded-3xl bg-white p-6
                  border border-slate-200
                  shadow-[0_16px_40px_rgba(15,23,42,0.12)]
                  hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.18)]
                  transition duration-300
                "
                            >
                                <h3 className="font-extrabold text-lg text-slate-900">
                                    {b.name}
                                </h3>

                                <p className="mt-2 text-sm text-slate-600">
                                    {b.address}
                                </p>

                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs text-slate-500">
                                        🕓 4:00 pm – 11:00 pm
                                    </span>

                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                            b.mapQuery
                                        )}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="
                      inline-flex items-center gap-2
                      px-4 py-2 rounded-full
                      text-sm font-extrabold
                      text-wings-500
                      border-2 border-wings-500
                      bg-transparent
                      hover:bg-wings-500 hover:text-white
                      transition
                    "
                                    >
                                        Ver en mapa
                                        <span>↗</span>
                                    </a>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
