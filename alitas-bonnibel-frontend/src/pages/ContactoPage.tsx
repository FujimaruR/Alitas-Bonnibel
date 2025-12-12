import { PublicLayout } from "../components/layout/PublicLayout";
import { Reveal } from "../components/public/Reveal";
import { WaveSeparatorGradient } from "../components/public/WaveSeparatorGradient";

const WHATSAPP_NUMBER = "528118925876";
const WHATSAPP_TEXT = encodeURIComponent(
    "Hola! Quiero información o hacer un pedido 🍗🔥"
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;

export default function ContactoPage() {
    return (
        <PublicLayout>
            {/* HERO */}
            <section className="relative -mt-24 pt-32 bg-gradient-to-br from-wings-100 via-wings-300 to-wings-500">
                <div className="max-w-6xl mx-auto px-4 py-20">
                    <Reveal>
                        <h1 className="font-display text-4xl md:text-6xl text-slate-900">
                            Contáctanos
                        </h1>
                        <p className="mt-4 max-w-xl text-slate-800">
                            ¿Antojo, duda o pedido? Escríbenos y te atendemos rápido 🔥
                        </p>

                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="
                inline-flex items-center gap-3 mt-6
                px-7 py-3 rounded-full
                bg-slate-900 text-white font-extrabold
                shadow-[0_18px_45px_rgba(0,0,0,0.3)]
                hover:scale-105 transition
              "
                        >
                            💬 Escríbenos por WhatsApp
                        </a>
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

            {/* CONTENIDO */}
            <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
                {/* INFO */}
                <Reveal>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Información de contacto
                        </h2>

                        <ul className="mt-6 space-y-4 text-slate-700">
                            <li className="flex items-center gap-3">
                                📍 <span>Nuevo León, México</span>
                            </li>
                            <li className="flex items-center gap-3">
                                🕓 <span>Lunes a Domingo · 4:00 pm – 11:00 pm</span>
                            </li>
                            <li className="flex items-center gap-3">
                                📱 <span>WhatsApp: +52 81 1234 5678</span>
                            </li>
                            <li className="flex items-center gap-3">
                                📸 <span>Instagram: @alitasbonnibel</span>
                            </li>
                        </ul>

                        <div className="mt-8">
                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="
                  inline-flex items-center gap-2
                  px-5 py-3 rounded-full
                  bg-wings-500 hover:bg-wings-400
                  text-white font-extrabold
                  shadow-lg transition
                "
                            >
                                🍗 Pedir ahora
                            </a>
                        </div>
                    </div>
                </Reveal>

                {/* FORMULARIO */}
                <Reveal delayMs={150}>
                    <form
                        className="
              bg-white rounded-3xl p-6
              border border-slate-200
              shadow-[0_16px_40px_rgba(15,23,42,0.12)]
            "
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <h3 className="text-xl font-bold text-slate-900 mb-4">
                            Envíanos un mensaje
                        </h3>

                        <div className="grid gap-4">
                            <input
                                type="text"
                                placeholder="Nombre"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-wings-300 outline-none"
                            />

                            <input
                                type="email"
                                placeholder="Correo"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-wings-300 outline-none"
                            />

                            <textarea
                                placeholder="Mensaje"
                                rows={4}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-wings-300 outline-none"
                            />

                            <button
                                type="submit"
                                className="
                  mt-2 px-5 py-3 rounded-full
                  bg-slate-900 text-white font-extrabold
                  hover:bg-slate-800 transition
                "
                            >
                                Enviar mensaje
                            </button>
                        </div>
                    </form>
                </Reveal>
            </section>

        </PublicLayout>
    );
}
