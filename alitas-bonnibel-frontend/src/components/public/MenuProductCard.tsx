import { useCart } from "../../cart/cart.context";

type Props = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  badges?: string[];
  onAdded?: () => void; // para abrir el drawer al agregar
};

export function MenuProductCard({
  id,
  name,
  description,
  price,
  imageUrl,
  badges = [],
  onAdded,
}: Props) {
  const { addItem } = useCart();

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-[0_16px_40px_rgba(15,23,42,0.12)] hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.16)] transition duration-300">
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.05] group-hover:-translate-y-1"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {badges.length > 0 && (
          <div className="absolute top-3 left-3">
            {badges.map((b) => (
              <span key={b} className="px-3 py-1.5 rounded-full bg-wings-200 text-slate-900 text-sm font-extrabold shadow">
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-base font-extrabold text-slate-900">{name}</h3>

        {description && (
          <p className="mt-2 text-xs text-slate-600 min-h-[34px]">
            {description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">


          <span className="px-3 py-1 rounded-full bg-wings-100 font-bold text-slate-900">
            ${price}
          </span>

          <button
            className="px-4 py-2 rounded-full border-2 border-wings-500 text-wings-500 font-extrabold text-sm bg-transparent hover:bg-wings-500 hover:text-white transition"
            type="button"
            onClick={() => {
              addItem({ id, name, price, imageUrl });
              onAdded?.();
            }}
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
