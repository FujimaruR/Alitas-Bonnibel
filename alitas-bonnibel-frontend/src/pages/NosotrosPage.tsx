import { useLocale as useSiteLocale, t as tr, text as localizeText } from '../site/locale';
import { PublicLayout } from "../components/layout/PublicLayout";
import { Reveal } from "../components/public/Reveal";
import { WaveSeparatorGradient } from "../components/public/WaveSeparatorGradient";

const WHATSAPP_NUMBER = "528118925876";
const WHATSAPP_TEXT = encodeURIComponent("Hola! Quiero conocer sus promos de hoy 🍗🔥");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;

export default function NosotrosPage() {
  useSiteLocale();
    return (
        <PublicLayout>
            {/* HERO */}
            <section className="relative -mt-24 pt-32 bg-gradient-to-br from-wings-100 via-wings-300 to-wings-500">
                <div className="max-w-6xl mx-auto px-4 py-20">
                    <Reveal>
                        <p className="text-xs font-extrabold tracking-[0.25em] uppercase text-slate-800"> {tr("text.63e7cb7598")} </p>
                        <h1 className="mt-3 font-display text-4xl md:text-6xl text-slate-900 leading-tight"> {tr("text.87c47b5200")} <span className="block">{tr("text.03005e5a76")}</span>
                        </h1>
                        <p className="mt-5 max-w-2xl text-slate-800/90 text-sm md:text-base"> {tr("text.e261ac6160")} </p>

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
                            > {tr("text.7e7f2a110f")} </a>

                            <span className="text-xs text-slate-900/70"> {tr("text.0c26d69f1c")} </span>
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
                                <h2 className="font-display text-3xl md:text-4xl leading-tight"> {tr("text.76fdf7faa4")} </h2>
                                <p className="mt-3 text-white/85 max-w-lg"> {tr("text.a4431902eb")} </p>

                                <div className="mt-6 flex flex-wrap gap-2 text-xs">
                                    <span className="px-3 py-1 rounded-full bg-white/15">{tr("text.08624efeb9")}</span>
                                    <span className="px-3 py-1 rounded-full bg-white/15">{tr("text.db4f50fe40")}</span>
                                    <span className="px-3 py-1 rounded-full bg-white/15">{tr("text.90eed9d57d")}</span>
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
                            <h3 className="mt-3 text-xl font-extrabold text-slate-900">{tr("text.8afc30a2bc")}</h3>
                            <p className="mt-2 text-sm text-slate-600"> {tr("text.603b875f24")} </p>

                            <div className="mt-5 grid gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-wings-500" />
                                    <span className="font-semibold text-slate-800">{tr("text.92856a3737")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-wings-400" />
                                    <span className="font-semibold text-slate-800">{tr("text.023a865e27")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-wings-300" />
                                    <span className="font-semibold text-slate-800">{tr("text.696cb30189")}</span>
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
                                <div className="text-3xl">{localizeText(v.icon)}</div>
                                <h4 className="mt-3 font-extrabold text-slate-900">{localizeText(v.title)}</h4>
                                <p className="mt-2 text-sm text-slate-600">{localizeText(v.text)}</p>
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
                            <h2 className="font-display text-3xl md:text-4xl text-slate-900"> {tr("text.9d0a633bbf")} </h2>
                            <p className="mt-2 text-sm text-slate-600 max-w-2xl"> {tr("text.5ffe5f8498")} </p>
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
                        > {tr("text.6a5587bef7")} </a>
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
                                    {localizeText(s.step)}
                                </div>
                                <h3 className="mt-2 text-lg font-extrabold text-slate-900">
                                    {localizeText(s.title)}
                                </h3>
                                <p className="mt-2 text-sm text-slate-600">{localizeText(s.text)}</p>
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
                        > {tr("text.6795b8ce22")} </a>
                    </div>
                </Reveal>
            </section>
        </PublicLayout>
    );
}
