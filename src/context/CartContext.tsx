"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  pickupDate: string;
  setPickupDate: (date: string) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [pickupDate, setPickupDateState] = useState<string>("");
  const [pickupTime, setPickupTime] = useState<string>("12:00");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Init pickup date to tomorrow
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setPickupDateState(d.toISOString().split("T")[0]);
  }, []);

  // Load persisted cart
  useEffect(() => {
    try {
      const stored = localStorage.getItem("hereich_cart");
      if (stored) setItems(JSON.parse(stored));
    } catch (_) {}
  }, []);

  const persist = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("hereich_cart", JSON.stringify(newItems));
  };

  const addItem = (item: Omit<CartItem, "quantity">, qty = 1) => {
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx > -1) {
      const next = [...items];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
      persist(next);
    } else {
      persist([...items, { ...item, quantity: qty }]);
    }
  };

  const removeItem = (id: string) => persist(items.filter((i) => i.id !== id));

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeItem(id);
    persist(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("hereich_cart");
  };

  const setPickupDate = (date: string) => setPickupDateState(date);

  const cartCount = items.reduce((t, i) => t + i.quantity, 0);
  const cartTotal = items.reduce((t, i) => t + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, updateQuantity, clearCart,
        pickupDate, setPickupDate,
        pickupTime, setPickupTime,
        isCartOpen, setIsCartOpen,
        cartCount, cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
