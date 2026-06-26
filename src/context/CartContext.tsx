"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  getServerCart, mergeGuestCart, addServerCartItem,
  setServerCartItem, clearServerCart,
} from "@/features/cart/actions";

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

const GUEST_KEY = "hereich_cart";
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [pickupDate, setPickupDateState] = useState<string>("");
  const [pickupTime, setPickupTime] = useState<string>("12:00");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Tracks which user id we've already merged/loaded for, to avoid repeats.
  const syncedFor = useRef<string | null>(null);

  const loggedIn = !!user;

  // Default pickup date → tomorrow.
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    // Client-only default (avoids SSR/client hydration mismatch on the date).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPickupDateState(d.toISOString().split("T")[0]);
  }, []);

  const writeGuest = (next: CartItem[]) => {
    try { localStorage.setItem(GUEST_KEY, JSON.stringify(next)); } catch {}
  };
  const readGuest = (): CartItem[] => {
    try { return JSON.parse(localStorage.getItem(GUEST_KEY) ?? "[]"); } catch { return []; }
  };

  // Load / merge on auth state settle.
  useEffect(() => {
    if (authLoading) return;

    if (!loggedIn) {
      // Guest mode — restore from localStorage (client-only external store).
      if (syncedFor.current !== null) syncedFor.current = null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(readGuest());
      return;
    }

    if (syncedFor.current === user!.id) return; // already synced this user
    syncedFor.current = user!.id;

    (async () => {
      const guest = readGuest();
      const merged = guest.length > 0
        ? await mergeGuestCart(guest.map((i) => ({ id: i.id, quantity: i.quantity })))
        : await getServerCart();
      setItems(merged);
      try { localStorage.removeItem(GUEST_KEY); } catch {}
    })().catch((e) => console.error("Cart sync failed", e));
  }, [authLoading, loggedIn, user]);

  const apply = (next: CartItem[]) => {
    setItems(next);
    if (!loggedIn) writeGuest(next);
  };

  const addItem = (item: Omit<CartItem, "quantity">, qty = 1) => {
    const idx = items.findIndex((i) => i.id === item.id);
    const next = idx > -1
      ? items.map((i, k) => (k === idx ? { ...i, quantity: i.quantity + qty } : i))
      : [...items, { ...item, quantity: qty }];
    apply(next);
    if (loggedIn) addServerCartItem(item.id, qty).catch((e) => console.error(e));
  };

  const removeItem = (id: string) => {
    apply(items.filter((i) => i.id !== id));
    if (loggedIn) setServerCartItem(id, 0).catch((e) => console.error(e));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeItem(id);
    apply(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
    if (loggedIn) setServerCartItem(id, quantity).catch((e) => console.error(e));
  };

  const clearCart = () => {
    setItems([]);
    if (loggedIn) clearServerCart().catch((e) => console.error(e));
    else { try { localStorage.removeItem(GUEST_KEY); } catch {} }
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
