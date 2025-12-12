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
  // Usamos la primera sucursal como centro del mapa
  const mainQuery = branches[0]?.mapQuery ?? "Monterrey Nuevo León";

  return (
    <Reveal>
      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
        <iframe
          title="Mapa sucursales"
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
