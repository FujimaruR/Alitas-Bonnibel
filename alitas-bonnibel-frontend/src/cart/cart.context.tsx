import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { CartItem } from "./cart.types";

type AddItemInput = Omit<CartItem, "qty"> & { qty?: number };

type CartContextValue = {
  items: CartItem[];
  addItem: (item: AddItemInput) => void;
  removeItem: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  subtotal: number;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
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

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
