import { useLocale as useSiteLocale, t as tr } from '../site/locale';
import { useState } from 'react';
import { track } from '../site/analytics';
import { PublicLayout } from "../components/layout/PublicLayout";
import { Reveal } from "../components/public/Reveal";
import { WaveSeparatorGradient } from "../components/public/WaveSeparatorGradient";

const WHATSAPP_NUMBER = "528118925876";
const WHATSAPP_TEXT = encodeURIComponent(
    "Hola! Quiero información o hacer un pedido 🍗🔥"
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;

export default function ContactoPage() {
  useSiteLocale();
    const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState(false);
    return (
        <PublicLayout>
            {/* HERO */}
            <section className="relative -mt-24 pt-32 bg-gradient-to-br from-wings-100 via-wings-300 to-wings-500">
                <div className="max-w-6xl mx-auto px-4 py-20">
                    <Reveal>
                        <h1 className="font-display text-4xl md:text-6xl text-slate-900"> {tr("text.5d8a4530e8")} </h1>
                        <p className="mt-4 max-w-xl text-slate-800"> {tr("text.4b9c59866f")} </p>

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
                        > {tr("text.7e7f2a110f")} </a>
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
                        <h2 className="text-2xl font-bold text-slate-900"> {tr("text.d4ed962f53")} </h2>

                        <ul className="mt-6 space-y-4 text-slate-700">
                            <li className="flex items-center gap-3">
                                📍 <span>{tr("text.17f06238db")}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                🕓 <span>{tr("text.542dd01ddd")}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                📱 <span>{tr("text.797247f9e2")}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                📸 <span>{tr("text.c70d445139")}</span>
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
                            > {tr("text.8d34949a6c")} </a>
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
                        noValidate
                        onChangeCapture={() => track('form_start', 'demo-contact')}
                        onSubmit={e => {
                            e.preventDefault();
                            track('form_submit_attempt', 'demo-contact');
                            if (!e.currentTarget.reportValidity()) { setValidationError(true); track('form_validation_error', 'demo-contact', 'validation'); return; }
                            setValidationError(false); setSubmitted(true);
                        }}
                    >
                        <h3 className="text-xl font-bold text-slate-900 mb-4"> {tr("text.6e95145b93")} </h3>

                        <div className="grid gap-4">
                            <input
                                required aria-label={tr("text.e68491e91c")} type="text"
                                placeholder={tr("text.e68491e91c")}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-wings-300 outline-none"
                            />

                            <input
                                required aria-label={tr("text.98f00c3e0a")} type="email"
                                placeholder={tr("text.98f00c3e0a")}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-wings-300 outline-none"
                            />

                            <textarea
                                required aria-label={tr("text.eb9e23efc4")} placeholder={tr("text.eb9e23efc4")}
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
                            > {tr("text.9568f09b89")} </button>
                        </div>
                    {submitted && <p role="status">{tr("text.a7f5c63f17")}</p>}
                        <p className="mt-4 text-sm">{tr("text.97274d08dd")}</p>
                    {validationError && <p role="alert">{tr('ui.validation')}</p>}
        </form>
                </Reveal>
            </section>

        </PublicLayout>
    );
}
