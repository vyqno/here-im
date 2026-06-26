"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/features/auth/AuthProvider";
import AuthModal from "@/features/auth/AuthModal";
import { createClient } from "@/lib/supabase/client";

interface OrderRow {
  id: string;
  placed_at: string;
  status: string;
  total_paise: number;
  pickup_date: string;
  pickup_time: string;
  order_items: { product_name: string; unit_price_paise: number; quantity: number }[];
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!user) { setLoading(false); return; }

    const supabase = createClient();
    supabase
      .from("orders")
      .select("id, placed_at, status, total_paise, pickup_date, pickup_time, order_items(product_name, unit_price_paise, quantity)")
      .eq("user_id", user.id)
      .order("placed_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as OrderRow[]) ?? []);
        setLoading(false);
      });
  }, [authLoading, user]);

  return (
    <PageLayout>
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(40px,6vw,72px) 24px clamp(72px,10vw,120px)" }}>
        <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "#aaa", marginBottom: 12 }}>My account</p>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(2.2rem,5vw,4rem)", color: "#0d0c0b", marginBottom: 40 }}>Pre-orders</h1>

        {authLoading || loading ? (
          <p style={{ fontFamily: "'Instrument Sans',sans-serif", color: "#999", fontSize: "0.85rem" }}>Loading…</p>
        ) : !user ? (
          <div style={{ border: "1px solid #e8e6e3", borderRadius: 8, padding: "48px", textAlign: "center" }}>
            <p style={{ fontFamily: "'Instrument Sans',sans-serif", color: "#888", fontSize: "0.9rem", marginBottom: 24 }}>Sign in to view your orders.</p>
            <button onClick={() => setAuthOpen(true)} style={{ background: "#0d0c0b", color: "#fff", border: "none", padding: "14px 32px", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, cursor: "pointer", fontFamily: "'Instrument Sans',sans-serif" }}>
              Sign in
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ border: "1px solid #e8e6e3", borderRadius: 8, padding: "48px", textAlign: "center" }}>
            <p style={{ fontFamily: "'Instrument Sans',sans-serif", color: "#888", fontSize: "0.9rem", marginBottom: 24 }}>No pre-orders yet.</p>
            <Link href="/#shop" style={{ background: "#0d0c0b", color: "#fff", padding: "14px 32px", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, textDecoration: "none", fontFamily: "'Instrument Sans',sans-serif" }}>
              Browse the menu
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {orders.map((order) => (
              <div key={order.id} style={{ border: "1px solid #e8e6e3", borderRadius: 8, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0eeeb", paddingBottom: 16, marginBottom: 16 }}>
                  <div>
                    <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#999" }}>Order #{order.id.slice(0, 8)}</p>
                    <p style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: "0.82rem", color: "#0d0c0b", marginTop: 4 }}>{formatDate(order.placed_at)}</p>
                  </div>
                  <span style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.08em", padding: "6px 12px", borderRadius: 4, background: "#f2efe9", color: "#666" }}>{order.status}</span>
                </div>
                {order.order_items.map((it, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Instrument Sans',sans-serif", fontSize: "0.82rem", color: "#444", padding: "4px 0" }}>
                    <span>{it.quantity} × {it.product_name}</span>
                    <span>₹{(it.unit_price_paise * it.quantity) / 100}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Instrument Sans',sans-serif", fontSize: "0.85rem", fontWeight: 600, borderTop: "1px solid #f0eeeb", marginTop: 12, paddingTop: 12 }}>
                  <span>Total · pickup {order.pickup_date} {order.pickup_time}</span>
                  <span>₹{order.total_paise / 100}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} nextPath="/orders" />
    </PageLayout>
  );
}
