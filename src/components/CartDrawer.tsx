"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { authService, dbService, UserProfile, CartItemSnapshot } from "@/lib/supabase";
import AuthModal from "./AuthModal";

export default function CartDrawer() {
  const {
    items, removeItem, updateQuantity, clearCart,
    pickupDate, setPickupDate,
    pickupTime, setPickupTime,
    isCartOpen, setIsCartOpen,
    cartTotal,
  } = useCart();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const checkout = async () => {
    setErr(null);
    const cu = await authService.getCurrentUser();
    if (!cu) { setAuthOpen(true); return; }
    if (items.length === 0) { setErr("Your bag is empty."); return; }
    if (!pickupDate) { setErr("Please select a pickup date."); return; }

    const d = new Date(pickupDate + "T00:00:00");
    const dow = d.getDay();
    if (dow === 1 || dow === 2) { setErr("We are open Wednesday to Sunday only."); return; }

    const [h, m] = pickupTime.split(":").map(Number);
    const mins = h * 60 + m;
    if (mins < 8 * 60 + 15 || mins > 18 * 60) {
      setErr("Pickup hours: 8:15 AM – 6:00 PM.");
      return;
    }

    setPlacing(true);
    try {
      const snapItems: CartItemSnapshot[] = items.map((i) => ({
        id: i.id, name: i.name, price: i.price, quantity: i.quantity,
      }));
      const { data, error } = await dbService.createOrder({
        items: snapItems, pickupDate, pickupTime, totalAmount: cartTotal,
      });
      if (error) { setErr(error.message); }
      else { setSuccess(data.id); clearCart(); }
    } catch { setErr("Failed to submit. Please try again."); }
    finally { setPlacing(false); }
  };

  const formatDate = (s: string) => {
    if (!s) return "Select date";
    const d = new Date(s + "T00:00:00");
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        id="cart-backdrop"
        onClick={() => setIsCartOpen(false)}
        className="overlay-enter"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: "var(--z-drawer)",
          background: "rgba(13,12,11,0.45)",
        }}
      />

      {/* Drawer panel */}
      <aside
        id="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className="drawer-enter"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: "var(--z-drawer)",
          width: "min(480px, 100vw)",
          background: "var(--c-white)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-24px 0 80px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "1.75rem 2rem",
          borderBottom: "1px solid var(--c-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 300 }}>
            Shopping Bag
          </h2>
          <button
            id="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--c-muted)" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <line x1="1" y1="1" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="17" y1="1" x2="1" y2="17" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 2rem" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <div style={{
                width: "3.5rem", height: "3.5rem",
                borderRadius: "50%",
                background: "#ecfdf5",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 300, marginBottom: "0.75rem" }}>
                Order Confirmed
              </h3>
              <p className="body-sm" style={{ color: "var(--c-muted)", marginBottom: "0.375rem" }}>
                Your pre-order has been placed.
              </p>
              <p className="label" style={{ color: "var(--c-muted)", letterSpacing: "0.1em" }}>
                Order #{success}
              </p>
              <button
                className="btn btn-outline"
                onClick={() => { setSuccess(null); setIsCartOpen(false); }}
                style={{ marginTop: "2rem" }}
              >
                Continue Shopping
              </button>
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--c-muted)" }}>
              <p className="label">Your bag is empty</p>
            </div>
          ) : (
            <>
              {err && (
                <p role="alert" style={{
                  color: "#c0392b",
                  fontSize: "0.75rem",
                  padding: "0.75rem 1rem",
                  background: "#fef2f2",
                  borderLeft: "2px solid #c0392b",
                  marginBottom: "1.5rem",
                }}>
                  {err}
                </p>
              )}

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                {items.map((item) => (
                  <div key={item.id} style={{
                    display: "grid",
                    gridTemplateColumns: "4.5rem 1fr",
                    gap: "1rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid var(--c-border)",
                  }}>
                    <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }}/>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p className="label" style={{ color: "var(--c-text)" }}>{item.name}</p>
                        <button
                          id={`remove-${item.id}`}
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--c-muted)" }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5"/>
                            <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        </button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--c-border)" }}>
                          <button
                            id={`qty-dec-${item.id}`}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ width: "2rem", height: "2rem", background: "none", border: "none", cursor: "pointer", color: "var(--c-muted)" }}
                          >−</button>
                          <span className="label" style={{ width: "2rem", textAlign: "center", letterSpacing: "0" }}>
                            {item.quantity}
                          </span>
                          <button
                            id={`qty-inc-${item.id}`}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ width: "2rem", height: "2rem", background: "none", border: "none", cursor: "pointer", color: "var(--c-muted)" }}
                          >+</button>
                        </div>
                        <p className="label" style={{ color: "var(--c-text)" }}>
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pickup scheduler */}
              <div style={{
                padding: "1.5rem",
                background: "var(--c-bg)",
                marginBottom: "1rem",
              }}>
                <p className="label" style={{ marginBottom: "1.25rem", color: "var(--c-text)" }}>
                  Collection Schedule
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label htmlFor="pickup-date" className="label" style={{ display: "block", marginBottom: "0.4rem", color: "var(--c-muted)" }}>
                      Date
                    </label>
                    <input
                      id="pickup-date"
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.625rem 0.75rem",
                        border: "1px solid var(--c-border)",
                        background: "var(--c-white)",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.75rem",
                        color: "var(--c-text)",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="pickup-time" className="label" style={{ display: "block", marginBottom: "0.4rem", color: "var(--c-muted)" }}>
                      Time
                    </label>
                    <input
                      id="pickup-time"
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.625rem 0.75rem",
                        border: "1px solid var(--c-border)",
                        background: "var(--c-white)",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.75rem",
                        color: "var(--c-text)",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
                <p className="body-sm" style={{ color: "var(--c-muted)", marginTop: "0.75rem", fontSize: "0.65rem" }}>
                  Wed – Sun · 8:15 AM to 6:00 PM · {formatDate(pickupDate)}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!success && items.length > 0 && (
          <div style={{
            padding: "1.5rem 2rem",
            borderTop: "1px solid var(--c-border)",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}>
              <span className="label" style={{ color: "var(--c-muted)" }}>Subtotal</span>
              <span className="label" style={{ color: "var(--c-text)", fontSize: "0.8rem" }}>
                ₹{cartTotal.toFixed(0)}
              </span>
            </div>
            <button
              id="checkout-btn"
              onClick={checkout}
              disabled={placing}
              className="btn btn-dark"
              style={{ width: "100%", opacity: placing ? 0.6 : 1 }}
            >
              {placing ? "Placing order…" : user ? `Pre-Order · ₹${cartTotal.toFixed(0)}` : "Sign in to Pre-Order"}
            </button>
          </div>
        )}
      </aside>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(u) => { setUser(u); setAuthOpen(false); }}
      />
    </>
  );
}
