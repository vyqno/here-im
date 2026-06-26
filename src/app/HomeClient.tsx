"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import type { MenuProduct } from "@/features/products/queries";
import PickupCalendar from "@/components/PickupCalendar";
import UserMenu from "@/features/auth/UserMenu";
import ProductDetailModal from "@/features/products/ProductDetailModal";
import CartButton from "@/features/cart/CartButton";

// ─── Loading Screen ──────────────────────────────────────────
function LoadingScreen() {
  const [gone, setGone] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // Only play the intro once per browser session — skip it on repeat
    // visits to the home page within the same session.
    if (sessionStorage.getItem("hi_intro_seen")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGone(true);
      return;
    }
    const t1 = setTimeout(() => setExit(true), 2200);
    const t2 = setTimeout(() => {
      setGone(true);
      sessionStorage.setItem("hi_intro_seen", "1");
    }, 3000);
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


// ─── Main Page ───────────────────────────────────────────────
export default function HomeClient({ products }: { products: MenuProduct[] }) {
  const { pickupDate, setPickupDate, addItem } = useCart();
  const [calOpen, setCalOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<MenuProduct | null>(null);
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
          <a href="/our-story" className="nav-hover" style={{ fontSize:"0.78rem",color:"#0d0c0b" }}>Our story</a>
          <a href="/menu" className="nav-hover" style={{ fontSize:"0.78rem",color:"#0d0c0b" }}>Menu</a>
          <a href="/events" className="nav-hover" style={{ fontSize:"0.78rem",color:"#0d0c0b" }}>Events</a>
        </nav>

        {/* right: icons */}
        <div style={{ display:"flex",alignItems:"center",gap:"16px" }}>
          {/* account — sign in / menu */}
          <UserMenu />
          {/* cart — hover preview, click → /cart */}
          <CartButton />
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
            background:"#f5f5f5",
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
            <div style={{ position:"relative",display:"inline-flex",alignSelf:"flex-start" }}>
              <button
                type="button"
                onClick={() => setCalOpen(o => !o)}
                style={{
                  display:"flex",alignItems:"center",gap:10,
                  background:"#fff",color:"#0d0c0b",
                  border:"none",borderRadius:999,
                  padding:"14px 28px",
                  fontSize:"0.875rem",fontWeight:600,fontFamily:"inherit",
                  cursor:"pointer",userSelect:"none",
                  width:"fit-content",
                }}
                aria-haspopup="dialog"
                aria-expanded={calOpen}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {fmtDate(pickupDate)}
              </button>

              {calOpen && (
                <div
                  onClick={() => setCalOpen(false)}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Choose pickup date"
                  style={{
                    position:"fixed",inset:0,zIndex:200,
                    background:"rgba(13,12,11,0.45)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    padding:16,
                    animation:"calFade 0.2s ease",
                  }}
                >
                  <style>{`@keyframes calFade{from{opacity:0}to{opacity:1}}`}</style>
                  <PickupCalendar
                    value={pickupDate}
                    onChange={(iso) => { setPickupDate(iso); setCalOpen(false); }}
                  />
                </div>
              )}
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
                {/* image placeholder — click opens product detail */}
                <div
                  className="card-img-wrap"
                  onClick={() => setDetailProduct(product)}
                  style={{ aspectRatio:"48/67",position:"relative",overflow:"hidden",cursor:"pointer" }}
                >
                  <img
                    className="placeholder"
                    src={`https://placehold.co/480x670/f5f5f5/b0b0b0?text=${encodeURIComponent(product.name)}`}
                    srcSet={`https://placehold.co/480x670/f5f5f5/b0b0b0?text=${encodeURIComponent(product.name)} 480w, https://placehold.co/960x1340/f5f5f5/b0b0b0?text=${encodeURIComponent(product.name)} 960w`}
                    sizes="(min-width: 994px) 308px, calc((100vw - 16px) / 3)"
                    width="308"
                    height="430"
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
                          onClick={(e) => { e.stopPropagation(); changeQty(product.id,-1); }}
                          style={{ width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,0.5)",border:"none",cursor:"pointer",padding:0 }}
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); changeQty(product.id,1); }}
                          style={{ width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,0.9)",border:"none",cursor:"pointer",padding:0 }}
                        />
                      </div>
                      <span style={{ fontSize:"0.8rem",color:"rgba(255,255,255,0.9)" }}>₹{product.price}</span>
                    </div>
                    {/* Add to bag circle button */}
                    <button
                      id={`add-${product.id}`}
                      onClick={(e) => { e.stopPropagation(); addToBag(product); }}
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
            {[
              { label:"Contact us", href:"/contact" },
              { label:"About", href:"/about" },
              { label:"Help", href:"/help" },
              { label:"Join us", href:"/join-us" },
              { label:"Privacy", href:"/privacy" },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="nav-hover" style={{
                fontSize:"0.75rem",color:"#0d0c0b",letterSpacing:"0.02em",
              }}>
                {label}
              </a>
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
            {/* spacer keeps the copyright centred */}
            <div style={{ width:26 }} />
          </div>
        </div>
      </footer>

      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAdd={(p, quantity) => {
          addItem({ id:p.id, name:p.name, price:p.price, image:"" }, quantity);
          setToast(`Added ${p.name}`);
          setTimeout(() => setToast(null), 2500);
        }}
      />
    </div>
  );
}
