import { useLocale as useSiteLocale, text as localizeText } from '../site/locale';
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { CartContext } from './cart.shared';
import type { CartContextValue } from './cart.shared';
import type { CartItem } from "./cart.types";

type AddItemInput = Omit<CartItem, "qty"> & { qty?: number };

export function CartProvider({ children }: { children: ReactNode }) {
  useSiteLocale();
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(input: AddItemInput) {
    const qtyToAdd = input.qty ?? 1;
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === input.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qtyToAdd };
        return copy;
      }
      return [...prev, { ...input, qty: qtyToAdd }];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  function inc(id: string) {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))
    );
  }

  function dec(id: string) {
    setItems((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0)
    );
  }

  function clear() {
    setItems([]);
  }

  const subtotal = useMemo(
    () => items.reduce((sum, x) => sum + x.price * x.qty, 0),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, x) => sum + x.qty, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    inc,
    dec,
    clear,
    subtotal,
    totalItems,
  };

  return <CartContext.Provider value={value}>{localizeText(children)}</CartContext.Provider>;
}
