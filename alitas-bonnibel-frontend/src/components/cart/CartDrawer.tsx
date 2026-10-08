import { useState } from 'react';
import { track } from '../../site/analytics';
import { useLocale as useSiteLocale, money as formatMoney, t as tr, text as localizeText } from '../../site/locale';
import { useCart } from "../../cart/cart.shared";
import { createOrder } from "../../lib/orders";

type Props = {
  open: boolean;
  onClose: () => void;
  whatsappUrl: string;
};

export function CartDrawer({ open, onClose }: Props) {
  useSiteLocale();
  const { items, subtotal, inc, dec, removeItem, clear } = useCart();

  const [submitting, setSubmitting] = useState(false);
  async function handleConfirmOrder() {
    if (submitting) return;
    track('form_start', 'public-order');
    track('form_submit_attempt', 'public-order');
    if (!items.length) { track('form_validation_error', 'public-order', 'validation'); return; }
    setSubmitting(true);
    try {
      const order = await createOrder(items);
      track('form_submit_success','public-order');
      clear();
      alert(tr("template.b10019f2e5", {v0: localizeText(order.id)}));
      // aquí luego limpiamos carrito
    } catch {
      track('form_submit_error', 'public-order', 'service');
      alert(tr("text.28c0146f2a"));
    }
  }

  return (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition ${open ? "opacity-100" : "opacity-0 pointer-events-none"
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
              <div className="font-extrabold text-slate-900">{tr("text.a7349b7cad")}</div>
              <div className="text-xs text-slate-500">{tr("text.ec62e4ba4b")}</div>
            </div>
            <button
              className="w-10 h-10 rounded-2xl border border-slate-200 hover:bg-slate-50"
              onClick={onClose}
              aria-label={tr("text.4b0816bbd5")}
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-auto px-5 py-4">
            {items.length === 0 ? (
              <div className="text-slate-600 text-sm"> {tr("text.ba601ffba0")} </div>
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
                          alt={localizeText(it.name)}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="flex-1">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {localizeText(it.name)}
                      </div>
                      <div className="text-xs text-slate-500">{formatMoney(it.price)} {tr("text.707b8df477")}</div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => dec(it.id)}
                            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold"
                          >
                            −
                          </button>
                          <div className="w-8 text-center font-extrabold">
                            {localizeText(it.qty)}
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
                        > {tr("text.be78bcf6d4")} </button>
                      </div>
                    </div>

                    <div className="font-extrabold text-slate-900 text-sm">
                      {formatMoney(it.price * it.qty)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{tr("text.97f7359ed8")}</span>
              <span className="font-extrabold text-slate-900">{formatMoney(subtotal)}</span>
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
              > {tr("text.40a9e5aa4d")} </button>

              <button
                disabled={submitting || !items.length} onClick={handleConfirmOrder}
                className="
                  px-4 py-3 rounded-2xl
                  border-2 border-slate-900/60
                  bg-transparent text-slate-900 font-extrabold
                  hover:bg-slate-900 hover:text-white transition
                  disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-900
                "
              > {tr("text.a81e4b6071")} </button>
            </div>

            <div className="mt-3 text-[11px] text-slate-500"> {tr("text.fefafc9475")} </div>
          </div>
        </div>
      </aside>
    </>
  );
}
