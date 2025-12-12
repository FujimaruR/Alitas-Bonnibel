import { useState } from "react";
import { Link } from "react-router-dom";

export function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen((p) => !p);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 pointer-events-none">
      {/* “aire” arriba */}
      <div className="pt-4 px-4 pointer-events-auto">
        {/* barra flotante */}
        <div className="max-w-6xl mx-auto">
          <div className="rounded-[28px] bg-white/85 backdrop-blur border border-slate-200 shadow-lg shadow-black/10">
            <div className="px-4 py-3 flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
                <div className="w-10 h-10 rounded-2xl bg-wings-500 flex items-center justify-center text-white font-extrabold shadow">
                  AB
                </div>
                <div className="leading-tight">
                  <div className="font-extrabold tracking-tight">Alitas Bonnibel</div>
                  <div className="text-xs text-slate-500">Wings &amp; Boneless</div>
                </div>
              </Link>

              {/* Menú desktop */}
              <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
                <a href="#menu" className="hover:text-wings-500 transition">Menú</a>
                <a href="#sabores" className="hover:text-wings-500 transition">Sabores</a>
                <a href="#nosotros" className="hover:text-wings-500 transition">Nosotros</a>
                <a href="#contacto" className="hover:text-wings-500 transition">Contacto</a>
              </nav>

              {/* Acciones */}
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="hidden sm:inline text-xs text-slate-500 hover:text-slate-800"
                >
                  Panel admin
                </Link>

                <button className="hidden md:inline px-4 py-2 rounded-full bg-wings-500 hover:bg-wings-400 text-white text-sm font-bold shadow-md transition">
                  Pide ahora
                </button>

                {/* Hamburguesa móvil */}
                <button
                  className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-2xl border border-slate-200 bg-white shadow-sm"
                  onClick={toggleMenu}
                  aria-label="Abrir menú"
                >
                  {isMenuOpen ? (
                    <span className="text-2xl leading-none">&times;</span>
                  ) : (
                    <span className="text-2xl leading-none">&#9776;</span>
                  )}
                </button>
              </div>
            </div>

            {/* Menú móvil */}
            {isMenuOpen && (
              <div className="md:hidden border-t border-slate-100 px-4 py-3">
                <div className="flex flex-col gap-3 text-sm font-semibold">
                  <a href="#menu" onClick={closeMenu} className="hover:text-wings-500">Menú</a>
                  <a href="#sabores" onClick={closeMenu} className="hover:text-wings-500">Sabores</a>
                  <a href="#nosotros" onClick={closeMenu} className="hover:text-wings-500">Nosotros</a>
                  <a href="#contacto" onClick={closeMenu} className="hover:text-wings-500">Contacto</a>

                  <div className="h-px bg-slate-100 my-1" />

                  <Link to="/login" onClick={closeMenu} className="text-slate-600 hover:text-slate-900">
                    Panel admin
                  </Link>

                  <button
                    className="mt-1 w-full px-4 py-2 rounded-full bg-wings-500 hover:bg-wings-400 text-white text-sm font-bold shadow-md transition"
                    onClick={closeMenu}
                  >
                    Pide ahora
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
