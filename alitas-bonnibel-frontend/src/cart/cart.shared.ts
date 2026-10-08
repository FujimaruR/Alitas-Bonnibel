import { createContext, useContext } from 'react';
import type { CartItem } from './cart.types';
type AddItemInput = Omit<CartItem,'qty'> & { qty?: number };
export type CartContextValue = { items: CartItem[]; addItem: (item:AddItemInput)=>void; removeItem: (id:string)=>void; inc:(id:string)=>void; dec:(id:string)=>void; clear:()=>void; subtotal:number; totalItems:number };
export const CartContext = createContext<CartContextValue|null>(null);
export function useCart() { const context=useContext(CartContext); if(!context)throw new Error('useCart must be used within CartProvider'); return context; }
