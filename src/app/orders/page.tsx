"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authService, dbService, Order, UserProfile } from "@/lib/supabase";

export default function OrdersPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const u = await authService.getCurrentUser();
      setUser(u);
      if (u) {
        const { data } = await dbService.getUserOrders();
        setOrders(data ?? []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const formatDate = (s: string) => {
    const d = new Date(s);
    return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--c-bg)" }}>
      {/* Minimal header */}
      <header style={{
        borderBottom: "1px solid var(--c-border)",
        padding: "1.5rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            fontWeight: 300,
            letterSpacing: "0.1em",
            color: "var(--c-text)",
            textDecoration: "none",
          }}
        >
          HERE I'M
        </Link>
        <Link
          href="/"
          className="label link-underline"
          style={{ color: "var(--c-muted)", textDecoration: "none" }}
        >
          ← Back to shop
        </Link>
      </header>

      <main style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "clamp(3rem, 6vw, 5rem) 2rem",
      }}>
        <div style={{ marginBottom: "3rem" }}>
          <p className="label" style={{ color: "var(--c-muted)", marginBottom: "0.75rem" }}>My Account</p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 300,
              color: "var(--c-text)",
            }}
          >
            Pre-orders
          </h1>
        </div>

        {loading ? (
          <p className="label" style={{ color: "var(--c-muted)" }}>Loading…</p>
        ) : !user ? (
          <div style={{
            padding: "3rem",
            textAlign: "center",
            border: "1px solid var(--c-border)",
          }}>
            <p className="body-sm" style={{ color: "var(--c-muted)", marginBottom: "1.5rem" }}>
              You need to sign in to view your orders.
            </p>
            <Link href="/" className="btn btn-dark" style={{ display: "inline-flex" }}>
              Go to Shop
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            padding: "3rem",
            textAlign: "center",
            border: "1px solid var(--c-border)",
          }}>
            <p className="body-sm" style={{ color: "var(--c-muted)", marginBottom: "1.5rem" }}>
              No pre-orders yet. Browse the menu to get started.
            </p>
            <Link href="/#menu" className="btn btn-outline" style={{ display: "inline-flex" }}>
              View Menu
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: "1px solid var(--c-border)",
                  padding: "2rem",
                }}
              >
                {/* Order header */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                  paddingBottom: "1.5rem",
                  borderBottom: "1px solid var(--c-border)",
                }}>
                  <div>
                    <p className="label" style={{ color: "var(--c-muted)", marginBottom: "0.3rem" }}>
                      Order #{order.id}
                    </p>
                    <p className="body-sm" style={{ color: "var(--c-text)", fontWeight: 500 }}>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span
                    className="label"
                    style={{
                      padding: "0.375rem 0.875rem",
                      background: order.status === "confirmed" ? "#ecfdf5" : "#fef9ec",
                      color: order.status === "confirmed" ? "#059669" : "#d97706",
                      fontSize: "0.6rem",
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.5rem" }}>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span className="body-sm" style={{ color: "var(--c-text)" }}>
                        {item.quantity} × {item.name}
                      </span>
                      <span className="body-sm" style={{ color: "var(--c-muted)" }}>
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pickup info */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "1rem",
                  padding: "1.25rem",
                  background: "var(--c-surface)",
                  marginBottom: "1.25rem",
                }}>
                  <div>
                    <p className="label" style={{ color: "var(--c-muted)", marginBottom: "0.3rem" }}>Pickup Date</p>
                    <p className="body-sm" style={{ color: "var(--c-text)", fontWeight: 500 }}>{order.pickupDate}</p>
                  </div>
                  <div>
                    <p className="label" style={{ color: "var(--c-muted)", marginBottom: "0.3rem" }}>Pickup Time</p>
                    <p className="body-sm" style={{ color: "var(--c-text)", fontWeight: 500 }}>{order.pickupTime}</p>
                  </div>
                  <div>
                    <p className="label" style={{ color: "var(--c-muted)", marginBottom: "0.3rem" }}>Total</p>
                    <p className="body-sm" style={{ color: "var(--c-text)", fontWeight: 600 }}>₹{order.totalAmount.toFixed(0)}</p>
                  </div>
                </div>

                <p className="body-sm" style={{ color: "var(--c-muted)", fontSize: "0.65rem" }}>
                  Present this order ID at the counter: <strong style={{ color: "var(--c-text)" }}>{order.id}</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
