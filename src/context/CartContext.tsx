"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { CartItem, Product } from "@/types";

interface CartContextValue {
  items: CartItem[];
  quantityOf: (productId: string) => number;
  setQuantity: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  /** Lines whose quantity is below the product's minimum. */
  belowMinimum: CartItem[];
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const setQuantity = useCallback((product: Product, quantity: number) => {
    const qty = Math.max(0, Math.floor(quantity) || 0);
    setItems((prev) => {
      if (qty === 0) return prev.filter((i) => i.product.id !== product.id);
      if (prev.some((i) => i.product.id === product.id)) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: qty } : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const quantityOf = useCallback(
    (productId: string) =>
      items.find((i) => i.product.id === productId)?.quantity ?? 0,
    [items]
  );

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const belowMinimum = items.filter((i) => i.quantity < i.product.minQty);

  return (
    <CartContext.Provider
      value={{
        items,
        quantityOf,
        setQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
        belowMinimum,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
