import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { CartItem } from "@shared/schema";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateMeters: (productId: number, meters: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  hasCustomPriceItems: () => boolean;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "qimma_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, meters: i.meters + item.meters }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateMeters = (productId: number, meters: number) => {
    if (meters < 0.5) return;
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, meters } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => {
      if (item.isCustomPrice || !item.pricePerMeter) return sum;
      return sum + item.pricePerMeter * item.meters;
    }, 0);
  };

  const hasCustomPriceItems = () => {
    return items.some((item) => item.isCustomPrice);
  };

  const itemCount = items.reduce((sum, item) => sum + 1, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateMeters,
        clearCart,
        getTotal,
        hasCustomPriceItems,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("ar-SA")} ر.س`;
}
