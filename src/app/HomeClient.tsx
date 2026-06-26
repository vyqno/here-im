"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import type { MenuProduct } from "@/features/products/queries";

// ─── Loading Screen ──────────────────────────────────────────
function LoadingScreen() {
  const [gone, setGone] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExit(true), 2200);
    const t2 = setTimeout(() => setGone(true), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (gone) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0d0c0b",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
      transform: exit ? "translateY(-100%)" : "translateY(0)",
      transition: "transform 0.9s cubic-bezier(0.65,0,0.35,1)",
    }}>
      <div style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: "clamp(3rem,10vw,7rem)",
        fontWeight: 400,
        color: "#fff",
        letterSpacing: "0.12em",
        animation: "glowIn 2.2s ease forwards",
      }}>
        HERE I&apos;M
      </div>
      <div style={{
        fontFamily: "'Instrument Sans', sans-serif",
        fontSize: "0.6rem",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)",
        animation: "fadeUp 0.8s ease 0.8s forwards",
        opacity: 0,
      }}>
        Jayanagar · Bengaluru
      </div>
      <style>{`
        @keyframes glowIn {
          0%   { opacity:0; letter-spacing:0.04em; }
          40%  { opacity:1; letter-spacing:0.14em; }
          100% { opacity:1; letter-spacing:0.12em; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Cart Drawer ─────────────────────────────────────────────
function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, pickupDate, setPickupDate, pickupTime, setPickupTime, cartTotal } = useCart();

  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:50,background:"rgba(0,0,0,0.4)" }} />
      <aside style={{
        position:"fixed",top:0,right:0,bottom:0,zIndex:51,
        width:"min(420px,100vw)",background:"#fff",
        display:"flex",flexDirection:"column",
        boxShadow:"-8px 0 40px rgba(0,0,0,0.1)",
      }}>
        {/* header */}
        <div style={{ padding:"1.5rem 1.75rem", borderBottom:"1px solid #e8e6e3", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"'Instrument Serif',serif", fontSize:"1.5rem" }}>Shopping bag</span>
          <button onClick={onClose} style={{ background:"none",border:"none",fontSize:"1.25rem",lineHeight:1,color:"#999" }}>✕</button>
        </div>
        {/* body */}
        <div style={{ flex:1, overflowY:"auto", padding:"1.5rem 1.75rem" }}>
          {items.length === 0 ? (
            <p style={{ color:"#999", fontSize:"0.8rem", textTransform:"uppercase", letterSpacing:"0.1em" }}>Your bag is empty</p>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {items.map(item => (
                <div key={item.id} style={{ display:"flex", gap:"0.75rem", paddingBottom:"1rem", borderBottom:"1px solid #f0eeeb" }}>
                  <div style={{ width:56, height:56, background:"#e8e6e3", flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontSize:"0.75rem", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em" }}>{item.name}</span>
                      <button onClick={() => removeItem(item.id)} style={{ background:"none",border:"none",color:"#999",fontSize:"0.75rem" }}>✕</button>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.5rem", alignItems:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", border:"1px solid #e8e6e3" }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity-1)} style={{ background:"none",border:"none",width:28,height:28,color:"#666" }}>−</button>
                        <span style={{ width:24,textAlign:"center",fontSize:"0.8rem" }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity+1)} style={{ background:"none",border:"none",width:28,height:28,color:"#666" }}>+</button>
                      </div>
                      <span style={{ fontSize:"0.8rem" }}>₹{(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {/* pickup */}
              <div style={{ marginTop:"0.5rem", padding:"1rem", background:"#f7f5f2" }}>
                <p style={{ fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:"0.75rem",fontWeight:500 }}>Collection Schedule</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
                  <div>
                    <label style={{ display:"block",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:"0.1em",color:"#999",marginBottom:"0.25rem" }}>Date</label>
                    <input type="date" value={pickupDate} onChange={e=>setPickupDate(e.target.value)} style={{ width:"100%",padding:"0.5rem",border:"1px solid #e0ddd9",fontSize:"0.75rem",fontFamily:"inherit" }}/>
                  </div>
                  <div>
                    <label style={{ display:"block",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:"0.1em",color:"#999",marginBottom:"0.25rem" }}>Time</label>
                    <input type="time" value={pickupTime} onChange={e=>setPickupTime(e.target.value)} style={{ width:"100%",padding:"0.5rem",border:"1px solid #e0ddd9",fontSize:"0.75rem",fontFamily:"inherit" }}/>
                  </div>
                </div>
                <p style={{ fontSize:"0.6rem",color:"#aaa",marginTop:"0.5rem" }}>Wed–Sun · 8:15 am – 6:00 pm</p>
              </div>
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div style={{ padding:"1.5rem 1.75rem", borderTop:"1px solid #e8e6e3" }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"1rem",fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:500 }}>
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <button style={{
              width:"100%", background:"#0d0c0b", color:"#fff",
              border:"none", padding:"1rem",
              fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.15em", fontWeight:500,
              fontFamily:"inherit", cursor:"pointer",
            }}>
              Pre-Order for Pickup · ₹{cartTotal}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function HomeClient({ products }: { products: MenuProduct[] }) {
  const { pickupDate, setPickupDate, addItem, cartCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [qtyMap, setQtyMap] = useState<Record<string,number>>({});
  const [toast, setToast] = useState<string|null>(null);

  const qty = (id: string) => qtyMap[id] ?? 1;
  const changeQty = (id: string, d: number) => setQtyMap(p => ({ ...p, [id]: Math.max(1, (p[id]??1)+d) }));

  const addToBag = (p: MenuProduct) => {
    addItem({ id:p.id, name:p.name, price:p.price, image:"" }, qty(p.id));
    setQtyMap(prev => ({ ...prev, [p.id]:1 }));
    setToast(`Added ${p.name}`);
    setTimeout(() => setToast(null), 2500);
  };

  const fmtDate = (s: string) => {
    if (!s) return "Select Date";
    return s.replace(/-/g, "/");
  };

  return (
    <div style={{ minHeight:"100vh", background:"#fff" }}>
      <LoadingScreen />

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed",top:"5rem",left:"50%",transform:"translateX(-50%)",zIndex:999,
          background:"#0d0c0b",color:"#fff",padding:"0.6rem 1.25rem",
          fontSize:"0.65rem",letterSpacing:"0.12em",textTransform:"uppercase",
          fontFamily:"'Instrument Sans',sans-serif",whiteSpace:"nowrap",
          animation:"fadeUp 0.3s ease",
        }}>
          {toast}
          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateX(-50%) translateY(-6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
        </div>
      )}

      {/* ── HEADER ────────────────────────────────────────── */}
      <header style={{
        position:"sticky",top:0,zIndex:40,
        background:"#fff",
        borderBottom:"1px solid #e8e6e3",
        height:"60px",
        display:"flex",alignItems:"center",
        padding:"0 24px",
        justifyContent:"space-between",
      }}>
        {/* left: hamburger + logo */}
        <div style={{ display:"flex",alignItems:"center",gap:"20px" }}>
          <button style={{ background:"none",border:"none",padding:4,color:"#0d0c0b",display:"flex",flexDirection:"column",gap:5,cursor:"pointer" }}>
            <span style={{ display:"block",width:20,height:1.5,background:"currentColor" }}/>
            <span style={{ display:"block",width:20,height:1.5,background:"currentColor" }}/>
            <span style={{ display:"block",width:20,height:1.5,background:"currentColor" }}/>
          </button>
          <span style={{ fontFamily:"'Instrument Serif',serif",fontSize:"1.05rem",letterSpacing:"0.08em",fontWeight:400 }}>
            HERE I&apos;M
          </span>
        </div>

        {/* center-right: nav */}
        <nav style={{ display:"flex",alignItems:"center",gap:"32px" }}>
          <a href="#shop" className="nav-hover nav-active" style={{ fontSize:"0.78rem",color:"#0d0c0b",letterSpacing:"0.02em" }}>
            Click &amp; collect
          </a>
          <a href="#" className="nav-hover" style={{ fontSize:"0.78rem",color:"#0d0c0b" }}>Our story</a>
          <a href="#" className="nav-hover" style={{ fontSize:"0.78rem",color:"#0d0c0b" }}>Menu</a>
          <a href="#" className="nav-hover" style={{ fontSize:"0.78rem",color:"#0d0c0b" }}>Events</a>
        </nav>

        {/* right: icons */}
        <div style={{ display:"flex",alignItems:"center",gap:"16px" }}>
          {/* user */}
          <button style={{ background:"none",border:"none",padding:4,color:"#0d0c0b",cursor:"pointer" }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </button>
          {/* cart count + bag */}
          <button
            onClick={() => setCartOpen(true)}
            style={{ background:"none",border:"none",display:"flex",alignItems:"center",gap:6,cursor:"pointer",color:"#0d0c0b" }}
          >
            {cartCount > 0 && (
              <span style={{ fontSize:"0.8rem",color:"#0d0c0b" }}>{cartCount}</span>
            )}
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>
        </div>
      </header>

      <main>
        {/* ── HERO SPLIT ───────────────────────────────────── */}
        <section id="shop" style={{
          display:"grid",
          gridTemplateColumns:"58% 42%",
          borderBottom:"1px solid #e8e6e3",
        }}>
          {/* LEFT: store details */}
          <div style={{
            background:"#f7f5f2",
            padding:"clamp(48px,7vw,96px) clamp(32px,6vw,80px)",
            display:"flex",flexDirection:"column",justifyContent:"center",gap:"20px",
          }}>
            {/* BENGALURU big display */}
            <h1 style={{
              fontFamily:"'Instrument Serif',serif",
              fontSize:"clamp(3.5rem,9vw,8rem)",
              fontWeight:400,
              letterSpacing:"-0.02em",
              lineHeight:0.95,
              color:"#0d0c0b",
            }}>
              BENGALURU
            </h1>
            <p style={{ fontSize:"0.78rem",color:"#666",letterSpacing:"0.02em" }}>By pre-order or take-away</p>
            <h2 style={{ fontFamily:"'Instrument Serif',serif",fontSize:"clamp(1.4rem,2.5vw,2rem)",fontWeight:400,color:"#0d0c0b" }}>
              Our seasonal creations
            </h2>
            <div style={{ fontSize:"0.78rem",color:"#555",lineHeight:1.9 }}>
              <p>12, 100 Feet Road, Jayanagar, Bengaluru — 560011</p>
              <p>To arrange a delivery, please contact us at: <a href="mailto:hello@here-im.in" style={{ color:"#0d0c0b",fontWeight:500 }}>hello@here-im.in</a></p>
              <p>Wednesday to Sunday – 8:15 am to 6:00 pm</p>
            </div>
          </div>

          {/* RIGHT: black pickup panel */}
          <div style={{
            background:"#0d0c0b",color:"#fff",
            padding:"clamp(48px,7vw,96px) clamp(32px,5vw,72px)",
            display:"flex",flexDirection:"column",justifyContent:"center",gap:"28px",
          }}>
            {/* dot + label */}
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <span style={{
                width:8,height:8,borderRadius:"50%",background:"#fff",
                boxShadow:"0 0 0 0 rgba(255,255,255,0.4)",
                animation:"ping 2s infinite",display:"inline-block",
              }}/>
              <style>{`@keyframes ping{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0.4)}50%{box-shadow:0 0 0 6px rgba(255,255,255,0)}}`}</style>
              <span style={{ fontSize:"0.7rem",color:"rgba(255,255,255,0.55)",letterSpacing:"0.08em" }}>
                Schedule your in-store pickup
              </span>
            </div>

            {/* headline */}
            <h2 style={{
              fontFamily:"'Instrument Sans',sans-serif",
              fontSize:"clamp(1.8rem,3.5vw,3rem)",
              fontWeight:500,
              letterSpacing:"-0.01em",
              lineHeight:1.15,
              color:"#fff",
            }}>
              I WILL COLLECT MY<br/>ORDER ON
            </h2>

            {/* date pill button */}
            <div style={{ position:"relative",display:"inline-flex" }}>
              <div style={{
                display:"flex",alignItems:"center",gap:10,
                background:"#fff",color:"#0d0c0b",
                borderRadius:999,
                padding:"14px 28px",
                fontSize:"0.875rem",fontWeight:600,
                cursor:"pointer",userSelect:"none",
                width:"fit-content",
              }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {fmtDate(pickupDate)}
              </div>
              <input
                type="date" value={pickupDate}
                onChange={e => setPickupDate(e.target.value)}
                style={{ position:"absolute",inset:0,opacity:0,cursor:"pointer",width:"100%",height:"100%" }}
              />
            </div>
          </div>
        </section>

        {/* ── PRODUCT GRID ─────────────────────────────────── */}
        <section style={{ padding: "48px 24px 0" }}>
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(4, 1fr)",
            gap: "20px",
          }}>
            {products.map((product) => (
              <article
                key={product.id}
                id={`product-${product.id}`}
                className="card-wrap"
                style={{ display:"flex",flexDirection:"column" }}
              >
                {/* image placeholder */}
                <div className="card-img-wrap" style={{ aspectRatio:"48/65",position:"relative",overflow:"hidden" }}>
                  <img
                    className="placeholder"
                    src={`https://placehold.co/480x650/f2efe9/b0aca5?text=${encodeURIComponent(product.name)}`}
                    srcSet={`https://placehold.co/480x650/f2efe9/b0aca5?text=${encodeURIComponent(product.name)} 480w, https://placehold.co/960x1300/f2efe9/b0aca5?text=${encodeURIComponent(product.name)} 960w`}
                    sizes="(min-width: 994px) 308px, calc((100vw - 16px) / 3)"
                    width="308"
                    height="417"
                    loading="lazy"
                    data-image-list=""
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />

                  {/* hover overlay */}
                  <div className="card-overlay">
                    <p style={{
                      fontFamily:"'Instrument Sans',sans-serif",
                      fontSize:"0.7rem",fontWeight:500,
                      textTransform:"uppercase",letterSpacing:"0.1em",
                      color:"#fff",textAlign:"center",padding:"0 12px",
                    }}>
                      {product.name}
                    </p>
                    {/* qty + price row */}
                    <div style={{ display:"flex",alignItems:"center",gap:16 }}>
                      <span style={{ fontSize:"0.8rem",color:"rgba(255,255,255,0.9)" }}>{qty(product.id)}</span>
                      {/* qty stepper dots */}
                      <div style={{ display:"flex",gap:3 }}>
                        <button
                          onClick={() => changeQty(product.id,-1)}
                          style={{ width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,0.5)",border:"none",cursor:"pointer",padding:0 }}
                        />
                        <button
                          onClick={() => changeQty(product.id,1)}
                          style={{ width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,0.9)",border:"none",cursor:"pointer",padding:0 }}
                        />
                      </div>
                      <span style={{ fontSize:"0.8rem",color:"rgba(255,255,255,0.9)" }}>₹{product.price}</span>
                    </div>
                    {/* Add to bag circle button */}
                    <button
                      id={`add-${product.id}`}
                      onClick={() => addToBag(product)}
                      style={{
                        width:44,height:44,borderRadius:"50%",
                        background:"#fff",border:"none",cursor:"pointer",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        color:"#0d0c0b",
                        transition:"transform 0.2s ease",
                      }}
                      onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.1)")}
                      onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}
                      aria-label={`Add ${product.name} to bag`}
                    >
                      <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* info below */}
                <div style={{ padding:"12px 4px 24px" }}>
                  <p style={{ fontSize:"0.7rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.08em",color:"#0d0c0b",marginBottom:3 }}>
                    {product.name}
                  </p>
                  <p style={{ fontSize:"0.72rem",color:"#666" }}>From ₹{product.price}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── CREATIONS FULL-WIDTH BANNER ───────────────────── */}
        <section style={{
          position:"relative",height:"clamp(380px,50vw,620px)",
          display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",
          gap:16,textAlign:"center",overflow:"hidden",
        }}>
          {/* placeholder background */}
          <div style={{ position:"absolute",inset:0,background:"#cac6be" }} />
          {/* dark overlay */}
          <div style={{ position:"absolute",inset:0,background:"rgba(13,12,11,0.45)" }} />
          <div style={{ position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:20,padding:"0 2rem" }}>
            <p style={{ fontSize:"0.6rem",color:"rgba(255,255,255,0.7)",letterSpacing:"0.2em",textTransform:"uppercase" }}>
              Private events upon request
            </p>
            <h2 style={{
              fontFamily:"'Instrument Serif',serif",
              fontSize:"clamp(3rem,8vw,7rem)",
              fontStyle:"italic",
              fontWeight:400,
              color:"#fff",
              letterSpacing:"-0.01em",
              lineHeight:1,
            }}>
              Creations
            </h2>
            <button style={{
              background:"transparent",color:"#fff",
              border:"1px solid rgba(255,255,255,0.7)",
              padding:"12px 32px",
              fontSize:"0.7rem",letterSpacing:"0.12em",textTransform:"uppercase",
              fontFamily:"'Instrument Sans',sans-serif",cursor:"pointer",
              transition:"background 0.25s, color 0.25s",
            }}
              onMouseEnter={e=>{ e.currentTarget.style.background="#fff"; e.currentTarget.style.color="#0d0c0b"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#fff"; }}
            >
              Contact us
            </button>
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background:"#fff",borderTop:"1px solid #e8e6e3" }}>
        {/* logo */}
        <div style={{ textAlign:"center",padding:"28px 24px 20px",borderBottom:"1px solid #e8e6e3" }}>
          <p style={{
            fontFamily:"'Instrument Serif',serif",
            fontSize:"1.3rem",
            fontWeight:400,
            letterSpacing:"0.08em",
            color:"#0d0c0b",
          }}>
            HERE I&apos;M
          </p>
        </div>
        {/* nav links */}
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:20,padding:"28px 24px 24px" }}>
          <nav style={{ display:"flex",gap:"32px",flexWrap:"wrap",justifyContent:"center" }}>
            {["Contact us","About","Help","Join us","Privacy"].map(label => (
              <a key={label} href="#" style={{
                fontSize:"0.75rem",color:"#0d0c0b",textDecoration:"none",letterSpacing:"0.02em",
              }}
                onMouseEnter={e=>(e.currentTarget.style.textDecoration="underline")}
                onMouseLeave={e=>(e.currentTarget.style.textDecoration="none")}
              >{label}</a>
            ))}
          </nav>
          {/* bottom row */}
          <div style={{ width:"100%",maxWidth:1200,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            {/* moon icon */}
            <button style={{ background:"none",border:"none",cursor:"pointer",color:"#888",padding:4 }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
            </button>
            <p style={{ fontSize:"0.6rem",color:"#bbb",letterSpacing:"0.04em" }}>
              © 2026 HERE I&apos;M &nbsp;·&nbsp; A site by here-im.in
            </p>
            {/* chat bubble */}
            <button style={{
              background:"#0d0c0b",color:"#fff",border:"none",
              borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",
              cursor:"pointer",boxShadow:"0 2px 12px rgba(0,0,0,0.15)",
            }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
