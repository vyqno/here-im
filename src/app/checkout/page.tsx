"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/features/auth/AuthProvider";

const TIME_LABELS: Record<string, string> = {
  "08:15": "8:15 – 10:00 am",
  "10:00": "10:00 – 12:00 pm",
  "12:00": "12:00 – 3:00 pm",
  "15:00": "3:00 – 6:00 pm",
};

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function CheckoutPage() {
  const { items, cartTotal, pickupDate, pickupTime } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  // Checkout is for signed-in users only.
  useEffect(() => {
    if (!loading && !user) router.replace("/cart");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <PageLayout>
        <section style={{ minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Instrument Sans',sans-serif", color: "#999" }}>
          One moment…
        </section>
      </PageLayout>
    );
  }

  if (items.length === 0) {
    return (
      <PageLayout>
        <section style={{ minHeight: "40vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", padding: "96px 24px" }}>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "2.4rem" }}>Nothing to check out</h1>
          <Link href="/#shop" style={{ background: "#0d0c0b", color: "#fff", padding: "14px 32px", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, textDecoration: "none", fontFamily: "'Instrument Sans',sans-serif" }}>
            Browse the menu
          </Link>
        </section>
      </PageLayout>
    );
  }

  // Wired in the next phase: create Razorpay order → open checkout →
  // verified webhook creates the order. No-op until that lands.
  const handlePay = () => {};

  return (
    <PageLayout>
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(40px,6vw,72px) 24px clamp(72px,10vw,120px)" }}>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(2rem,4vw,3rem)", marginBottom: 8 }}>Checkout</h1>
        <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: "0.85rem", color: "#888", marginBottom: 40 }}>
          Signed in as {user.email ?? user.phone ?? "your account"}.
        </p>

        {/* order review */}
        <div style={{ border: "1px solid #e8e6e3", borderRadius: 8, padding: "24px 24px 8px" }}>
          <h2 style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 16 }}>Your order</h2>
          {items.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Instrument Sans',sans-serif", fontSize: "0.85rem", color: "#333", padding: "10px 0", borderBottom: "1px solid #f4f2ee" }}>
              <span>{item.quantity} × {item.name}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Instrument Sans',sans-serif", fontSize: "0.85rem", color: "#666", padding: "16px 0 6px" }}>
            <span>Pickup</span>
            <span>{formatDate(pickupDate).split(",")[0]}, {TIME_LABELS[pickupTime] ?? "—"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Instrument Sans',sans-serif", fontSize: "1rem", fontWeight: 600, padding: "14px 0", borderTop: "1px solid #f0eeeb", marginTop: 8 }}>
            <span>Total</span><span>₹{cartTotal}</span>
          </div>
        </div>

        <button
          onClick={handlePay}
          style={{ width: "100%", background: "#0d0c0b", color: "#fff", border: "none", padding: "18px", marginTop: 24, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, fontFamily: "'Instrument Sans',sans-serif", cursor: "pointer", borderRadius: 4 }}
        >
          Pay securely · ₹{cartTotal}
        </button>

        <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: "0.7rem", color: "#bbb", marginTop: 16, textAlign: "center" }}>
          <Link href="/cart" style={{ color: "#888" }}>← Back to bag</Link>
        </p>
      </section>
    </PageLayout>
  );
}
