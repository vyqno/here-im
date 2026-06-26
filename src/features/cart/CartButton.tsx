"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

// Header cart control: hovering reveals a mini-cart preview; clicking
// navigates to the full /cart page.
export default function CartButton() {
  const { items, cartCount, cartTotal, updateQuantity } = useCart();
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "relative", display: "inline-flex" }}
    >
      <Link
        href="/cart"
        aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
        style={{ display: "flex", alignItems: "center", gap: 6, color: "#0d0c0b", textDecoration: "none" }}
      >
        {cartCount > 0 && <span style={{ fontSize: "0.8rem", color: "#0d0c0b" }}>{cartCount}</span>}
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </Link>

      {hover && cartCount > 0 && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 14px)", right: 0, zIndex: 80,
            width: 360, background: "#fff",
            border: "1px solid #e8e6e3", borderRadius: 12,
            boxShadow: "0 16px 48px rgba(13,12,11,0.14)",
            padding: "20px", fontFamily: "'Instrument Sans', sans-serif",
          }}
        >
          {/* little pointer gap so hover doesn't drop */}
          <div style={{ position: "absolute", top: -14, right: 0, height: 14, width: 120 }} />

          <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.1rem", marginBottom: 14 }}>
            Your bag · {cartCount}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 260, overflowY: "auto" }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, background: "#f2efe9", flexShrink: 0, borderRadius: 4 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0d0c0b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #e8e6e3", borderRadius: 4 }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={miniStep} aria-label="Decrease">−</button>
                      <span style={{ width: 22, textAlign: "center", fontSize: "0.75rem" }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={miniStep} aria-label="Increase">+</button>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#666" }}>₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0eeeb", marginTop: 16, paddingTop: 14 }}>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>Total</span>
            <span style={{ fontSize: "0.95rem", fontWeight: 600 }}>₹{cartTotal}</span>
          </div>

          <Link
            href="/cart"
            style={{
              display: "block", textAlign: "center", marginTop: 14,
              background: "#0d0c0b", color: "#fff", padding: "13px",
              fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600,
              textDecoration: "none", borderRadius: 4,
            }}
          >
            See your bag
          </Link>
        </div>
      )}
    </div>
  );
}

const miniStep: React.CSSProperties = {
  width: 26, height: 26, background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "0.85rem", lineHeight: 1,
};
