import { PublicLayout } from "../components/layout/PublicLayout";
import { Reveal } from "../components/public/Reveal";
import { WaveSeparatorGradient } from "../components/public/WaveSeparatorGradient";

const WHATSAPP_NUMBER = "528118925876";
const WHATSAPP_TEXT = encodeURIComponent("Hola! Quiero conocer sus promos de hoy 🍗🔥");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;

export default function NosotrosPage() {
    return (
        <PublicLayout>
            {/* HERO */}
            <section className="relative -mt-24 pt-32 bg-gradient-to-br from-wings-100 via-wings-300 to-wings-500">
                <div className="max-w-6xl mx-auto px-4 py-20">
                    <Reveal>
                        <p className="text-xs font-extrabold tracking-[0.25em] uppercase text-slate-800">
                            Nuestra historia
                        </p>
                        <h1 className="mt-3 font-display text-4xl md:text-6xl text-slate-900 leading-tight">
                            Más que alitas:
                            <span className="block">un lugar para el antojo.</span>
                        </h1>
                        <p className="mt-5 max-w-2xl text-slate-800/90 text-sm md:text-base">
                            Alitas Bonnibel nace con una idea simple: porciones generosas, salsas que se noten
                            y una experiencia que se sienta “de casa”, pero con nivel.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3 items-center">
                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="
                  inline-flex items-center gap-2
                  px-7 py-3 rounded-full
                  bg-slate-900 text-white font-extrabold
                  shadow-[0_18px_45px_rgba(0,0,0,0.30)]
                  hover:scale-105 transition
                "
                            >
                                💬 Escríbenos por WhatsApp
                            </a>

                            <span className="text-xs text-slate-900/70">
                                ⏰ 4:00 pm – 11:00 pm · NL
                            </span>
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

            {/* BLOQUES “bento” */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-12 gap-6">
                    {/* Imagen grande + copy */}
                    <Reveal className="md:col-span-7">
                        <div
                            className="
                relative overflow-hidden rounded-3xl
                border border-slate-200
                shadow-[0_18px_45px_rgba(15,23,42,0.12)]
                bg-cover bg-center
                min-h-[320px]
              "
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=1400&q=80')",
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/15" />
                            <div className="absolute inset-0 ring-1 ring-white/20 rounded-3xl" />

                            <div className="relative p-8 text-white">
                                <h2 className="font-display text-3xl md:text-4xl leading-tight">
                                    Salsas que se notan.
                                </h2>
                                <p className="mt-3 text-white/85 max-w-lg">
                                    Aquí no venimos a “cubrir” alitas, venimos a presumir salsa.
                                    Del clásico búfalo al mango habanero: sabor primero, siempre.
                                </p>

                                <div className="mt-6 flex flex-wrap gap-2 text-xs">
                                    <span className="px-3 py-1 rounded-full bg-white/15">🔥 Picor real</span>
                                    <span className="px-3 py-1 rounded-full bg-white/15">🍋 Opciones frescas</span>
                                    <span className="px-3 py-1 rounded-full bg-white/15">🍯 Dulce-picante</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Tarjeta “misión” */}
                    <Reveal delayMs={120} className="md:col-span-5">
                        <div
                            className="
                rounded-3xl bg-white p-7
                border border-slate-200
                shadow-[0_18px_45px_rgba(15,23,42,0.12)]
                hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.16)]
                transition
                h-full
              "
                        >
                            <div className="text-3xl">🎯</div>
                            <h3 className="mt-3 text-xl font-extrabold text-slate-900">Nuestra misión</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Hacer que cada pedido sea fácil, rápido y delicioso: porción generosa,
                                salsas memorables y papas crujientes siempre.
                            </p>

                            <div className="mt-5 grid gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-wings-500" />
                                    <span className="font-semibold text-slate-800">Calidad constante</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-wings-400" />
                                    <span className="font-semibold text-slate-800">Sabor auténtico</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-wings-300" />
                                    <span className="font-semibold text-slate-800">Servicio cercano</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Valores (3 cards) */}
                    {[
                        {
                            icon: "🍗",
                            title: "Porciones generosas",
                            text: "Nada de porciones tristes. Aquí se viene a comer a gusto.",
                        },
                        {
                            icon: "🔥",
                            title: "Sabor con carácter",
                            text: "Salsas intensas, combinaciones y niveles de picor reales.",
                        },
                        {
                            icon: "💛",
                            title: "Hecho con cariño",
                            text: "Queremos que se sienta casero, pero con nivel de restaurante.",
                        },
                    ].map((v, i) => (
                        <Reveal key={v.title} delayMs={180 + i * 120} className="md:col-span-4">
                            <div
                                className="
                  rounded-3xl bg-slate-50/70 p-6
                  border border-slate-200
                  shadow-[0_14px_35px_rgba(15,23,42,0.10)]
                  hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(15,23,42,0.14)]
                  transition
                  h-full
                "
                            >
                                <div className="text-3xl">{v.icon}</div>
                                <h4 className="mt-3 font-extrabold text-slate-900">{v.title}</h4>
                                <p className="mt-2 text-sm text-slate-600">{v.text}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* “Cómo lo hacemos” */}
            <section className="max-w-6xl mx-auto px-4 pb-20">
                <Reveal>
                    <div className="flex items-end justify-between gap-6">
                        <div>
                            <h2 className="font-display text-3xl md:text-4xl text-slate-900">
                                Cómo lo hacemos
                            </h2>
                            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
                                Un proceso simple, pero con detalles que hacen la diferencia.
                            </p>
                        </div>
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="
                hidden md:inline-flex items-center gap-2
                px-5 py-2 rounded-full
                border-2 border-slate-900/70
                text-slate-900 font-extrabold
                bg-transparent
                hover:bg-slate-900 hover:text-white
                hover:scale-105 transition
              "
                        >
                            Pregunta por promos →
                        </a>
                    </div>
                </Reveal>

                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    {[
                        {
                            step: "01",
                            title: "Elegimos el sabor",
                            text: "Selecciona tus salsas: clásico, dulce-picante o algo más intenso.",
                        },
                        {
                            step: "02",
                            title: "Cocinamos al momento",
                            text: "Cocción controlada para que queden jugosas y crujientes.",
                        },
                        {
                            step: "03",
                            title: "Empacamos y entregamos",
                            text: "Todo bien servido, con aderezos y papas listas para disfrutar.",
                        },
                    ].map((s, i) => (
                        <Reveal key={s.step} delayMs={120 + i * 140}>
                            <div
                                className="
                  rounded-3xl bg-white p-7
                  border border-slate-200
                  shadow-[0_16px_40px_rgba(15,23,42,0.12)]
                  hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.16)]
                  transition
                "
                            >
                                <div className="text-wings-500 font-extrabold tracking-wide">
                                    {s.step}
                                </div>
                                <h3 className="mt-2 text-lg font-extrabold text-slate-900">
                                    {s.title}
                                </h3>
                                <p className="mt-2 text-sm text-slate-600">{s.text}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal delayMs={220}>
                    <div className="mt-10 text-center">
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="
                inline-flex items-center gap-3
                px-8 py-3 rounded-full
                bg-gradient-to-r from-wings-500 to-wings-400
                text-white font-extrabold
                shadow-[0_20px_60px_rgba(253,58,45,0.45)]
                hover:scale-105 transition
              "
                        >
                            🍗 Haz tu pedido por WhatsApp
                        </a>
                    </div>
                </Reveal>
            </section>
        </PublicLayout>
    );
}
