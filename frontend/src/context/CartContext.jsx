import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "artnest_cart";
const CartContext = createContext(null);

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const inCart = useMemo(() => new Set(items.map((i) => i.id)), [items]);

  // Original artworks are one-of-a-kind, so no quantity: add once, toggle to remove.
  const toggleCart = useCallback((art) => {
    setItems((prev) =>
      prev.some((i) => i.id === art.id)
        ? prev.filter((i) => i.id !== art.id)
        : [{ ...art, addedAt: Date.now() }, ...prev]
    );
  }, []);

  const removeFromCart = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, inCart, toggleCart, removeFromCart, clearCart }),
    [items, inCart, toggleCart, removeFromCart, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}