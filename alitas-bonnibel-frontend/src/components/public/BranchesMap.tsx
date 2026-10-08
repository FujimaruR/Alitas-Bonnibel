import { useLocale as useSiteLocale, t as tr } from '../../site/locale';
import { Reveal } from "./Reveal";

type Branch = {
  name: string;
  address: string;
  mapQuery: string;
};

type Props = {
  branches: Branch[];
};

export function BranchesMap({ branches }: Props) {
  useSiteLocale();
  // Usamos la primera sucursal como centro del mapa
  const mainQuery = branches[0]?.mapQuery ?? "Monterrey Nuevo León";

  return (
    <Reveal>
      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
        <iframe
          title={tr("text.fe67dbb8d7")}
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            mainQuery
          )}&output=embed`}
          className="w-full h-[420px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Reveal>
  );
}
