import { useLocale as useSiteLocale, text as localizeText } from '../../site/locale';
import type { ReactNode } from "react";
import { PublicNavbar } from "../public/PublicNavbar";
import { PublicFooter } from "../public/PublicFooter";

export function PublicLayout({ children }: { children: ReactNode }) {
  useSiteLocale();
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <PublicNavbar />
      <main className="flex-1">{localizeText(children)}</main>
      <PublicFooter />
    </div>
  );
}
