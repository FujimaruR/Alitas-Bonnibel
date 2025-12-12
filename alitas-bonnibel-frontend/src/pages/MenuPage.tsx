import { useMemo, useState } from "react";
import { PublicLayout } from "../components/layout/PublicLayout";
import { Reveal } from "../components/public/Reveal";
import { MenuCategoryTabs } from "../components/public/MenuCategoryTabs";
import { MenuProductCard } from "../components/public/MenuProductCard";
import { WaveSeparatorGradient } from "../components/public/WaveSeparatorGradient";
import { useCart } from "../cart/cart.context";
import { CartDrawer } from "../components/cart/CartDrawer";

const WHATSAPP_NUMBER = "528118925876"; // cámbialo

function waLink(message: string) {
    const text = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

const CATEGORIES = [
    { id: "alitas", label: "Alitas", emoji: "🍗" },
    { id: "boneless", label: "Boneless", emoji: "🍖" },
    { id: "papas", label: "Papas", emoji: "🍟" },
    { id: "bebidas", label: "Bebidas", emoji: "🥤" },
    { id: "combos", label: "Combos", emoji: "⭐" },
];

const MENU = {
    combos: [
        {
            name: "Combo 12 Alitas",
            description: "2 sabores + papas gajo + aderezo",
            price: 189,
            imageUrl:
                "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=1400&q=80",
            badges: ["Más pedido", "2 sabores"],
        },
        {
            name: "Boneless Lovers",
            description: "300g boneless + papas + dip",
            price: 169,
            imageUrl:
                "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&w=1400&q=80",
            badges: ["Recomendado"],
        },
        {
            name: "Mega Familiar",
            description: "24 alitas + boneless + papas + dips",
            price: 349,
            imageUrl:
                "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1400&q=80",
            badges: ["Para compartir"],
        },
    ],
    alitas: [
        {
            name: "Alitas 6 pzas",
            description: "Elige 1 salsa",
            price: 99,
            imageUrl:
                "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1400&q=80",
            badges: ["1 salsa"],
        },
        {
            name: "Alitas 12 pzas",
            description: "Elige 2 salsas",
            price: 179,
            imageUrl:
                "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=1400&q=80",
            badges: ["2 salsas"],
        },
        {
            name: "Alitas 24 pzas",
            description: "Elige 3 salsas",
            price: 329,
            imageUrl:
                "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=80",
            badges: ["3 salsas", "Familiar"],
        },
    ],
    boneless: [
        {
            name: "Boneless 200g",
            description: "Elige 1 salsa + dip",
            price: 129,
            imageUrl:
                "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&w=1400&q=80",
            badges: ["1 salsa"],
        },
        {
            name: "Boneless 300g",
            description: "Elige 2 salsas + dip",
            price: 169,
            imageUrl:
                "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=80",
            badges: ["2 salsas"],
        },
    ],
    papas: [
        {
            name: "Papas a la francesa",
            description: "Clásicas, crujientes",
            price: 59,
            imageUrl:
                "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1400&q=80",
            badges: ["Crispy"],
        },
        {
            name: "Papas gajo",
            description: "Con especias",
            price: 69,
            imageUrl:
                "https://images.unsplash.com/photo-1606755962773-d324e2b1b23b?auto=format&fit=crop&w=1400&q=80",
            badges: ["Top"],
        },
    ],
    bebidas: [
        {
            name: "Refresco",
            description: "355ml",
            price: 25,
            imageUrl:
                "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1400&q=80",
            badges: ["Frío"],
        },
        {
            name: "Agua",
            description: "600ml",
            price: 20,
            imageUrl:
                "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1400&q=80",
            badges: ["Natural"],
        },
    ],
};

function SectionHeader({
    id,
    title,
    subtitle,
}: {
    id: string;
    title: string;
    subtitle: string;
}) {
    return (
        <div id={id} className="scroll-mt-32">
            <div className="flex items-end justify-between gap-6">
                <div>
                    <h2 className="font-display text-3xl md:text-4xl text-slate-900">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
                </div>

                <a
                    href="#combos"
                    className="
            hidden md:inline-flex items-center gap-2
            px-4 py-2 rounded-full
            border-2 border-slate-900/70
            text-slate-900 font-extrabold
            bg-transparent
            hover:bg-slate-900 hover:text-white
            hover:scale-105 transition
          "
                >
                    Ver combos →
                </a>
            </div>
        </div>
    );
}

export default function MenuPage() {

    const [cartOpen, setCartOpen] = useState(false); // ✅ aquí sí
    const { items, subtotal, totalItems } = useCart(); // ✅ aquí sí

    const WHATSAPP_NUMBER = "528118925876";

    const whatsappUrl = useMemo(() => {
        const lines = items.map((x) => `• ${x.qty}x ${x.name} — $${x.price * x.qty}`);
        const msg =
            `Hola! Quiero hacer este pedido 🍗🔥\n\n` +
            (lines.length ? lines.join("\n") : "(carrito vacío)") +
            `\n\nSubtotal: $${subtotal}\n\n` +
            `Nombre: \nDirección (si aplica): \nForma de pago: `;
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    }, [items, subtotal]);

    return (
        <PublicLayout>
            {/* HERO corto */}
            <section className="relative -mt-24 pt-32 bg-gradient-to-br from-wings-100 via-wings-300 to-wings-500">
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <Reveal>
                        <h1 className="font-display text-4xl md:text-6xl text-slate-900">
                            Menú
                        </h1>
                        <p className="mt-3 text-slate-800 max-w-2xl">
                            Elige tu combo, tu salsa y deja que el antojo haga lo suyo 🍗🔥
                        </p>

                        <a
                            href={waLink("Hola! Quiero el menú y promos de hoy 🍗🔥")}
                            target="_blank"
                            rel="noreferrer"
                            className="
                inline-flex items-center gap-2 mt-6
                px-7 py-3 rounded-full
                bg-slate-900 text-white font-extrabold
                shadow-[0_18px_45px_rgba(0,0,0,0.3)]
                hover:scale-105 transition
              "
                        >
                            💬 Pedir por WhatsApp
                        </a>

                        <button
                            onClick={() => setCartOpen(true)}
                            className="
                                inline-flex items-center gap-2 mt-6
                                px-5 py-3 rounded-full
                                border-2 border-slate-900/70
                                bg-white/70 backdrop-blur
                                text-slate-900 font-extrabold
                                hover:bg-slate-900 hover:text-white
                                transition
                            "
                        >
                            🛒 Carrito <span className="text-xs opacity-80">({totalItems})</span>
                        </button>

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
                <MenuCategoryTabs categories={CATEGORIES} />
            </div>

            {/* Secciones */}
            <section className="max-w-6xl mx-auto px-4 pb-20 space-y-14">
                {/* Combos */}
                <Reveal>
                    <SectionHeader
                        id="combos"
                        title="⭐ Combos"
                        subtitle="Lo más pedido. Perfecto para compartir (o no)."
                    />
                </Reveal>

                <div className="grid md:grid-cols-3 gap-6">
                    {MENU.combos.map((p, i) => (
                        <Reveal key={p.name} delayMs={i * 140}>
                            <MenuProductCard
                                id={`combos-${p.name}`} // id único (por ahora)
                                name={p.name}
                                description={p.description}
                                price={p.price}
                                imageUrl={p.imageUrl}
                                badges={p.badges}
                                onAdded={() => setCartOpen(true)}
                            />

                        </Reveal>
                    ))}
                </div>

                {/* Alitas */}
                <Reveal>
                    <SectionHeader
                        id="alitas"
                        title="🍗 Alitas"
                        subtitle="Clásicas, jugosas, con salsa que se nota."
                    />
                </Reveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MENU.alitas.map((p, i) => (
                        <Reveal key={p.name} delayMs={i * 120}>
                            <MenuProductCard
                                id={`combos-${p.name}`} // id único (por ahora)
                                name={p.name}
                                description={p.description}
                                price={p.price}
                                imageUrl={p.imageUrl}
                                badges={p.badges}
                                onAdded={() => setCartOpen(true)}
                            />
                        </Reveal>
                    ))}
                </div>

                {/* Boneless */}
                <Reveal>
                    <SectionHeader
                        id="boneless"
                        title="🍖 Boneless"
                        subtitle="Crujientes por fuera, jugosos por dentro."
                    />
                </Reveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MENU.boneless.map((p, i) => (
                        <Reveal key={p.name} delayMs={i * 120}>
                            <MenuProductCard
                                id={`combos-${p.name}`} // id único (por ahora)
                                name={p.name}
                                description={p.description}
                                price={p.price}
                                imageUrl={p.imageUrl}
                                badges={p.badges}
                                onAdded={() => setCartOpen(true)}
                            />
                        </Reveal>
                    ))}
                </div>

                {/* Papas */}
                <Reveal>
                    <SectionHeader
                        id="papas"
                        title="🍟 Papas"
                        subtitle="El acompañamiento obligatorio."
                    />
                </Reveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MENU.papas.map((p, i) => (
                        <Reveal key={p.name} delayMs={i * 120}>
                            <MenuProductCard
                                id={`combos-${p.name}`} // id único (por ahora)
                                name={p.name}
                                description={p.description}
                                price={p.price}
                                imageUrl={p.imageUrl}
                                badges={p.badges}
                                onAdded={() => setCartOpen(true)}
                            />
                        </Reveal>
                    ))}
                </div>

                {/* Bebidas */}
                <Reveal>
                    <SectionHeader
                        id="bebidas"
                        title="🥤 Bebidas"
                        subtitle="Para acompañar el picor 🔥"
                    />
                </Reveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MENU.bebidas.map((p, i) => (
                        <Reveal key={p.name} delayMs={i * 120}>
                            <MenuProductCard
                                id={`combos-${p.name}`} // id único (por ahora)
                                name={p.name}
                                description={p.description}
                                price={p.price}
                                imageUrl={p.imageUrl}
                                badges={p.badges}
                                onAdded={() => setCartOpen(true)}
                            />
                        </Reveal>
                    ))}
                </div>

                {/* CTA final */}
                <Reveal>
                    <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-10 overflow-hidden relative">
                        <div className="absolute -inset-24 bg-[radial-gradient(circle_at_20%_20%,rgba(253,58,45,0.35),transparent_60%)]" />
                        <div className="relative">
                            <h3 className="font-display text-3xl md:text-4xl">
                                ¿Listo para pedir?
                            </h3>
                            <p className="mt-2 text-white/80 max-w-2xl">
                                Mándanos mensaje y te pasamos promos, salsas disponibles y tiempo de entrega.
                            </p>

                            <a
                                href={waLink("Hola! Quiero hacer un pedido 🍗🔥")}
                                target="_blank"
                                rel="noreferrer"
                                className="
                  inline-flex items-center gap-2 mt-6
                  px-7 py-3 rounded-full
                  bg-wings-500 hover:bg-wings-400
                  text-white font-extrabold
                  shadow-lg shadow-wings-500/30
                  hover:scale-105 transition
                "
                            >
                                💬 Pedir por WhatsApp
                            </a>
                        </div>
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
