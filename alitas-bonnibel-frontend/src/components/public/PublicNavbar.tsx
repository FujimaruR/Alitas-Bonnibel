import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const WHATSAPP_NUMBER = "528118925876";
const WHATSAPP_TEXT = encodeURIComponent("Hola! Quiero pedir un desarrollo web 🍗🔥");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`;



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
                <NavLink to="/menu" className={({ isActive }) => isActive ? "text-wings-500" : "hover:text-wings-500 transition"}>
                  Menú
                </NavLink>
                <NavLink to="/nosotros" className={({ isActive }) => isActive ? "text-wings-500" : "hover:text-wings-500 transition"}>
                  Nosotros
                </NavLink>
                <NavLink to="/sucursales" className={({ isActive }) => isActive ? "text-wings-500" : "hover:text-wings-500 transition"}>
                  Sucursales
                </NavLink>
                <NavLink to="/contacto" className={({ isActive }) => isActive ? "text-wings-500" : "hover:text-wings-500 transition"}>
                  Contacto
                </NavLink>
              </nav>


              {/* Acciones */}
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="hidden sm:inline text-xs text-slate-500 hover:text-slate-800"
                >
                  Panel admin
                </Link>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden md:inline px-4 py-2 rounded-full bg-wings-500 hover:bg-wings-400 text-white text-sm font-bold shadow-md transition"
                >
                  Pide ahora
                </a>


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
                  <NavLink to="/menu" onClick={closeMenu} className={({ isActive }) => isActive ? "text-wings-500" : "hover:text-wings-500 transition"}>
                    Menú
                  </NavLink>
                  <NavLink to="/nosotros" onClick={closeMenu} className={({ isActive }) => isActive ? "text-wings-500" : "hover:text-wings-500 transition"}>
                    Nosotros
                  </NavLink>
                  <NavLink to="/sucursales" onClick={closeMenu} className={({ isActive }) => isActive ? "text-wings-500" : "hover:text-wings-500 transition"}>
                    Sucursales
                  </NavLink>
                  <NavLink to="/contacto" onClick={closeMenu} className={({ isActive }) => isActive ? "text-wings-500" : "hover:text-wings-500 transition"}>
                    Contacto
                  </NavLink>

                  <div className="h-px bg-slate-100 my-1" />

                  <Link to="/login" onClick={closeMenu} className="text-slate-600 hover:text-slate-900">
                    Panel admin
                  </Link>

                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 w-full px-4 py-2 rounded-full bg-wings-500 hover:bg-wings-400 text-white text-sm font-bold shadow-md transition text-center"
                    onClick={closeMenu}
                  >
                    Pide ahora
                  </a>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
