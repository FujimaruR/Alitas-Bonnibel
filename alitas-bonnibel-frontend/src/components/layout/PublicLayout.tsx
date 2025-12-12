import type { ReactNode } from "react";
import { PublicNavbar } from "../public/PublicNavbar";
import { PublicFooter } from "../public/PublicFooter";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
