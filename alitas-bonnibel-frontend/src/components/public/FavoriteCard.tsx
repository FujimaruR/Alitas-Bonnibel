type FavoriteCardProps = {
  title: string;
  description: string;
  price: number;
  tag?: string;
  imageUrl: string;
};

export function FavoriteCard({
  title,
  description,
  price,
  tag,
  imageUrl,
}: FavoriteCardProps) {
  return (
    <article
      className="
        group relative overflow-hidden rounded-3xl bg-white
        border border-slate-100
        shadow-[0_18px_45px_rgba(15,23,42,0.12)]
        hover:shadow-[0_28px_65px_rgba(15,23,42,0.18)]
        hover:-translate-y-1
        transition duration-300 ease-out
      "
    >
      {/* Glow suave al hover (muy Pollomaton) */}
      <div
        className="
          pointer-events-none absolute -inset-20 opacity-0
          group-hover:opacity-100 transition duration-300
          bg-[radial-gradient(circle_at_30%_20%,rgba(253,58,45,0.22),transparent_60%)]
        "
      />

      {/* Imagen */}
      <div className="relative p-4">
        <div className="relative overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={imageUrl}
            alt={title}
            className="
              h-44 w-full object-cover
              transition duration-300 ease-out
              group-hover:-translate-y-2 group-hover:scale-[1.03]
            "
          />
          {/* overlay suave para texto legible si luego metes cosas encima */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

        {/* Tag */}
        {tag && (
          <div className="absolute top-6 left-6">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-wings-100 text-slate-900 shadow">
              {tag}
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="px-5 pb-5">
        <h3 className="text-base font-extrabold text-slate-900 leading-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 min-h-[34px]">
          {description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-extrabold text-slate-900">
            ${price}
          </div>

          <button
            className="
              px-4 py-2 rounded-full text-sm font-extrabold text-white
              bg-wings-500 hover:bg-wings-400
              shadow-md shadow-wings-500/30
              group-hover:shadow-lg group-hover:shadow-wings-500/35
              transition
            "
          >
            Agregar
          </button>
        </div>
      </div>

      {/* borde interno que aparece en hover (detalle que da “premium”) */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-transparent group-hover:ring-wings-300/40 transition" />
    </article>
  );
}
