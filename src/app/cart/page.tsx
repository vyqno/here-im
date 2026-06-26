"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import PickupCalendar from "@/components/PickupCalendar";
import { useCart } from "@/context/CartContext";

// Pickup time slots within business hours (Wed–Sun, 8:15–18:00).
const TIME_SLOTS = [
  { value: "08:15", label: "8:15 – 10:00 am" },
  { value: "10:00", label: "10:00 – 12:00 pm" },
  { value: "12:00", label: "12:00 – 3:00 pm" },
  { value: "15:00", label: "3:00 – 6:00 pm" },
];

function formatDate(iso: string): string {
  if (!iso) return "Select a date";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, cartTotal, pickupDate, setPickupDate, pickupTime, setPickupTime } = useCart();
  const [calOpen, setCalOpen] = useState(false);

  if (items.length === 0) {
    return (
      <PageLayout>
        <section style={{ minHeight:"50vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20, padding:"96px 24px", textAlign:"center" }}>
          <h1 style={{ fontFamily:"'Instrument Serif',serif", fontSize:"clamp(2.4rem,6vw,4rem)", color:"#0d0c0b" }}>Your bag is empty</h1>
          <p style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:"0.9rem", color:"#888" }}>Add a sandwich or two and they&apos;ll appear here.</p>
          <Link href="/#shop" style={{ background:"#0d0c0b", color:"#fff", padding:"14px 32px", fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.15em", fontWeight:600, textDecoration:"none", fontFamily:"'Instrument Sans',sans-serif" }}>
            Browse the menu
          </Link>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section style={{ maxWidth:1080, margin:"0 auto", padding:"clamp(40px,6vw,72px) 24px clamp(72px,10vw,120px)" }}>
        <h1 style={{ fontFamily:"'Instrument Serif',serif", fontSize:"clamp(2rem,4vw,3rem)", color:"#0d0c0b", marginBottom:40 }}>
          Your bag
        </h1>

        <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1.6fr) minmax(0,1fr)", gap:"clamp(32px,5vw,64px)", alignItems:"start" }}>
          {/* Items + pickup */}
          <div style={{ display:"flex", flexDirection:"column", gap:32 }}>
            {/* item rows */}
            <div style={{ display:"flex", flexDirection:"column" }}>
              {items.map((item) => (
                <div key={item.id} style={{ display:"flex", gap:20, alignItems:"center", padding:"20px 0", borderBottom:"1px solid #f0eeeb" }}>
                  <div style={{ width:84, height:84, background:"#f2efe9", flexShrink:0, borderRadius:4 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:"0.85rem", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", color:"#0d0c0b" }}>{item.name}</p>
                    <p style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:"0.8rem", color:"#888", marginTop:4 }}>₹{item.price}</p>
                    <div style={{ display:"flex", alignItems:"center", border:"1px solid #e0ddd9", borderRadius:4, width:"fit-content", marginTop:12 }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity-1)} style={stepBtn} aria-label="Decrease">−</button>
                      <span style={{ width:30, textAlign:"center", fontSize:"0.85rem", fontFamily:"'Instrument Sans',sans-serif" }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity+1)} style={stepBtn} aria-label="Increase">+</button>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:12 }}>
                    <span style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:"0.95rem", fontWeight:600 }}>₹{item.price * item.quantity}</span>
                    <button onClick={() => removeItem(item.id)} style={{ background:"none", border:"none", color:"#aaa", fontSize:"0.7rem", textTransform:"uppercase", letterSpacing:"0.08em", cursor:"pointer", fontFamily:"'Instrument Sans',sans-serif" }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* pickup scheduling */}
            <div>
              <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:"1.4rem", color:"#0d0c0b", marginBottom:6 }}>When would you like to collect?</h2>
              <p style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:"0.8rem", color:"#999", marginBottom:20 }}>Pickup is available Wednesday to Sunday, up to 45 days ahead.</p>

              {/* date pill → calendar modal */}
              <div style={{ position:"relative", display:"inline-flex" }}>
                <button
                  type="button"
                  onClick={() => setCalOpen(true)}
                  style={{ display:"flex", alignItems:"center", gap:10, background:"#0d0c0b", color:"#fff", border:"none", borderRadius:999, padding:"13px 26px", fontSize:"0.82rem", fontWeight:600, fontFamily:"'Instrument Sans',sans-serif", cursor:"pointer" }}
                  aria-haspopup="dialog" aria-expanded={calOpen}
                >
                  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {formatDate(pickupDate)}
                </button>
              </div>

              {/* time slots */}
              <p style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.12em", color:"#999", margin:"28px 0 12px" }}>Choose a time slot</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                {TIME_SLOTS.map((slot) => {
                  const active = pickupTime === slot.value;
                  return (
                    <button
                      key={slot.value}
                      onClick={() => setPickupTime(slot.value)}
                      style={{
                        padding:"12px 20px", borderRadius:999, cursor:"pointer",
                        fontSize:"0.8rem", fontFamily:"'Instrument Sans',sans-serif",
                        border:`1px solid ${active ? "#0d0c0b" : "#e0ddd9"}`,
                        background: active ? "#0d0c0b" : "#fff",
                        color: active ? "#fff" : "#0d0c0b",
                        transition:"all 0.15s ease",
                      }}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* summary */}
          <aside style={{ border:"1px solid #e8e6e3", borderRadius:8, padding:"28px 24px", position:"sticky", top:80 }}>
            <h2 style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:"0.7rem", textTransform:"uppercase", letterSpacing:"0.12em", fontWeight:600, color:"#0d0c0b", marginBottom:20 }}>Order summary</h2>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.85rem", fontFamily:"'Instrument Sans',sans-serif", color:"#444", marginBottom:10 }}>
              <span>Subtotal</span><span>₹{cartTotal}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.8rem", fontFamily:"'Instrument Sans',sans-serif", color:"#999", marginBottom:20 }}>
              <span>Pickup</span><span>{formatDate(pickupDate).split(",")[0]}, {TIME_SLOTS.find(s=>s.value===pickupTime)?.label ?? "—"}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.95rem", fontWeight:600, fontFamily:"'Instrument Sans',sans-serif", borderTop:"1px solid #f0eeeb", paddingTop:16, marginBottom:20 }}>
              <span>Total</span><span>₹{cartTotal}</span>
            </div>
            <button
              style={{ width:"100%", background:"#0d0c0b", color:"#fff", border:"none", padding:"16px", fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.15em", fontWeight:600, fontFamily:"'Instrument Sans',sans-serif", cursor:"pointer", borderRadius:4 }}
            >
              Pre-order for pickup · ₹{cartTotal}
            </button>
            <p style={{ fontFamily:"'Instrument Sans',sans-serif", fontSize:"0.65rem", color:"#bbb", marginTop:14, textAlign:"center", lineHeight:1.6 }}>
              Secure payment on the next step. You&apos;ll receive a confirmation by email.
            </p>
          </aside>
        </div>
      </section>

      {/* calendar modal — same restrictions as the homepage */}
      {calOpen && (
        <div
          onClick={() => setCalOpen(false)}
          role="dialog" aria-modal="true" aria-label="Choose pickup date"
          style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(13,12,11,0.45)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, animation:"cartCalFade 0.2s ease" }}
        >
          <style>{`@keyframes cartCalFade{from{opacity:0}to{opacity:1}}`}</style>
          <PickupCalendar value={pickupDate} onChange={(iso) => { setPickupDate(iso); setCalOpen(false); }} />
        </div>
      )}
    </PageLayout>
  );
}

const stepBtn: React.CSSProperties = {
  width: 34, height: 34, background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "0.95rem", lineHeight: 1,
};
