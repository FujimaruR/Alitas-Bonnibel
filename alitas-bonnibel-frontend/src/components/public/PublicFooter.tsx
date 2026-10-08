import { useLocale as useSiteLocale, t as tr } from '../../site/locale';
export function PublicFooter() {
  useSiteLocale();
  return (
    <footer id="contacto" className="bg-slate-950 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="text-xl font-extrabold text-wings-100">{tr("text.5c77c70346")}</div>
          <p className="text-sm text-white/70 mt-2 max-w-md"> {tr("text.a15062349c")} </p>
          <div className="mt-4 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs">{tr("text.acfb387481")}</span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs">{tr("text.c6cea120a9")}</span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs">{tr("text.dc970b2798")}</span>
          </div>
        </div>

        <div>
          <div className="font-bold mb-3">{tr("text.69cc527f7a")}</div>
          <div className="space-y-2 text-sm text-white/75">
            <a className="block hover:text-wings-200 transition" href="#menu">{tr("text.17ea0a188c")}</a>
            <a className="block hover:text-wings-200 transition" href="#sabores">{tr("text.e98a8568c8")}</a>
            <a className="block hover:text-wings-200 transition" href="#nosotros">{tr("text.7fbc0ed481")}</a>
          </div>
        </div>

        <div>
          <div className="font-bold mb-3">{tr("text.d8a53e1f6d")}</div>
          <div className="space-y-2 text-sm text-white/75">
            <p>{tr("text.278fffb608")} <span className="text-white">(+52) 81 1234 5876</span></p>
            <p>{tr("text.56aa63fa2c")} <span className="text-white">{tr("text.6f49de9f10")}</span></p>
            <p>{tr("text.dae905606b")} <span className="text-white">{tr("text.fd087e505b")}</span></p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-white/60">
          <p>© {new Date().getFullYear()} {tr("text.da4fc86973")}</p>
          <p>{tr("text.8a5c465200")}</p>
        </div>
      </div>
    </footer>
  );
}
