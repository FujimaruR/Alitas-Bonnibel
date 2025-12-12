export function PublicFooter() {
  return (
    <footer id="contacto" className="bg-slate-950 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="text-xl font-extrabold text-wings-100">Alitas Bonnibel</div>
          <p className="text-sm text-white/70 mt-2 max-w-md">
            Alitas, boneless y papas con salsas brutales. Hecho para antojar,
            perfecto para compartir.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs">📍 Nuevo León</span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs">🕓 4pm–11pm</span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs">🛵 Para llevar</span>
          </div>
        </div>

        <div>
          <div className="font-bold mb-3">Secciones</div>
          <div className="space-y-2 text-sm text-white/75">
            <a className="block hover:text-wings-200 transition" href="#menu">Menú</a>
            <a className="block hover:text-wings-200 transition" href="#sabores">Sabores</a>
            <a className="block hover:text-wings-200 transition" href="#nosotros">Nosotros</a>
          </div>
        </div>

        <div>
          <div className="font-bold mb-3">Contacto</div>
          <div className="space-y-2 text-sm text-white/75">
            <p>WhatsApp: <span className="text-white">(+52) 81 1892 5876</span></p>
            <p>IG: <span className="text-white">@alitasbonnibel</span></p>
            <p>Correo: <span className="text-white">hola@alitasbonnibel.com</span></p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-white/60">
          <p>© {new Date().getFullYear()} Alitas Bonnibel. Todos los derechos reservados.</p>
          <p>Hecho con ❤️ y mucha salsa.</p>
        </div>
      </div>
    </footer>
  );
}
