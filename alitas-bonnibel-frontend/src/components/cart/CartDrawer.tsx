import { useCart } from "../../cart/cart.context";

type Props = {
  open: boolean;
  onClose: () => void;
  whatsappUrl: string;
};

export function CartDrawer({ open, onClose, whatsappUrl }: Props) {
  const { items, subtotal, inc, dec, removeItem, clear } = useCart();

  return (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* panel */}
      <aside
        className={`
          fixed top-0 right-0 z-50 h-full w-[92%] max-w-md
          bg-white shadow-2xl
          transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <div className="font-extrabold text-slate-900">Tu carrito</div>
              <div className="text-xs text-slate-500">Pedido (demo)</div>
            </div>
            <button
              className="w-10 h-10 rounded-2xl border border-slate-200 hover:bg-slate-50"
              onClick={onClose}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-auto px-5 py-4">
            {items.length === 0 ? (
              <div className="text-slate-600 text-sm">
                Aún no agregas nada. Ve al menú y elige algo 🍗
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="flex gap-3 rounded-2xl border border-slate-200 p-3"
                  >
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      {it.imageUrl ? (
                        <img
                          src={it.imageUrl}
                          alt={it.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="flex-1">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {it.name}
                      </div>
                      <div className="text-xs text-slate-500">${it.price} c/u</div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => dec(it.id)}
                            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold"
                          >
                            −
                          </button>
                          <div className="w-8 text-center font-extrabold">
                            {it.qty}
                          </div>
                          <button
                            onClick={() => inc(it.id)}
                            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(it.id)}
                          className="text-xs font-bold text-wings-500 hover:text-wings-400"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>

                    <div className="font-extrabold text-slate-900 text-sm">
                      ${it.price * it.qty}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-extrabold text-slate-900">${subtotal}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={clear}
                disabled={items.length === 0}
                className="
                  px-4 py-3 rounded-2xl
                  border-2 border-slate-900/60
                  bg-transparent text-slate-900 font-extrabold
                  hover:bg-slate-900 hover:text-white transition
                  disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-900
                "
              >
                Vaciar
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  // opcional: cerrar al pedir
                  onClose();
                }}
                className={`
                  px-4 py-3 rounded-2xl text-center
                  bg-wings-500 hover:bg-wings-400 text-white font-extrabold
                  shadow-lg shadow-wings-500/30
                  hover:scale-[1.02] transition
                  ${items.length === 0 ? "pointer-events-none opacity-50" : ""}
                `}
              >
                Pedir WhatsApp
              </a>
            </div>

            <div className="mt-3 text-[11px] text-slate-500">
              *Demo: el pedido se envía como mensaje de WhatsApp.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
