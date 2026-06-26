"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { MenuProduct } from "./queries";

// Product detail overlay (opens when a product is clicked). Large image
// placeholder on the left, details + quantity + add-to-cart on the right.
export default function ProductDetailModal({
  product,
  onClose,
  onAdd,
}: {
  product: MenuProduct | null;
  onClose: () => void;
  onAdd: (product: MenuProduct, quantity: number) => void;
}) {
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  // Placeholder gallery (4 slides) until real product images exist.
  const images = useMemo(() => {
    if (!product) return [];
    const shades = ["f2efe9", "ece7df", "e7e0d4", "efe9e0"];
    return shades.map(
      (s) => `https://placehold.co/900x900/${s}/b0aca5?text=${encodeURIComponent(product.name)}`,
    );
  }, [product]);

  // Reset quantity + gallery whenever a new product opens.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setQty(1); setImgIdx(0); }, [product?.id]);

  // Close on Escape.
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, onClose]);

  if (!product) return null;

  const prevImage = () => setImgIdx((i) => (i - 1 + images.length) % images.length);
  const nextImage = () => setImgIdx((i) => (i + 1) % images.length);

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      style={{
        position: "fixed", inset: 0, zIndex: 210,
        background: "rgba(13,12,11,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, animation: "pdpFade 0.2s ease",
      }}
    >
      <style>{`@keyframes pdpFade{from{opacity:0}to{opacity:1}}`}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 4,
          width: "min(1040px, calc(100vw - 32px))",
          maxHeight: "calc(100vh - 32px)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
          overflow: "hidden", position: "relative",
          boxShadow: "0 24px 80px rgba(13,12,11,0.3)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: "absolute", top: 18, right: 20, zIndex: 2, background: "none", border: "none", fontSize: "1.3rem", color: "#0d0c0b", cursor: "pointer", lineHeight: 1 }}
        >
          ✕
        </button>

        {/* Left — image placeholder (carousel-ready) */}
        <div style={{ position: "relative", background: "#f2efe9", aspectRatio: "1 / 1", maxHeight: "calc(100vh - 32px)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[imgIdx]} alt={`${product.name} — image ${imgIdx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          {/* carousel arrows */}
          <button onClick={prevImage} aria-label="Previous image" style={arrowStyle("left")}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#0d0c0b" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={nextImage} aria-label="Next image" style={arrowStyle("right")}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#0d0c0b" strokeWidth="1.5"><path d="M9 6l6 6-6 6" /></svg>
          </button>
          <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                aria-label={`Go to image ${i + 1}`}
                style={{ width: 7, height: 7, padding: 0, border: "none", borderRadius: "50%", cursor: "pointer", background: i === imgIdx ? "#0d0c0b" : "rgba(13,12,11,0.25)" }}
              />
            ))}
          </div>
        </div>

        {/* Right — details */}
        <div style={{ padding: "clamp(28px,4vw,48px)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <h2 style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "clamp(1.3rem,2.2vw,1.7rem)", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.02em", color: "#0d0c0b", lineHeight: 1.2,
          }}>
            {product.name}
          </h2>

          <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.95rem", color: "#333", marginTop: 14, lineHeight: 1.6 }}>
            {product.desc}
          </p>

          <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.78rem", color: "#999", marginTop: 16, lineHeight: 1.7 }}>
            — Allergen and nutrition information coming soon.<br />
            — Prepared fresh to order in our Jayanagar kitchen.
          </p>

          <div style={{ borderTop: "1px solid #eceae5", margin: "28px 0", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 24 }}>
            <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "#0d0c0b" }}>
              ₹{product.price}
            </span>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0ddd9", borderRadius: 999 }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" style={stepBtn}>−</button>
              <span style={{ width: 32, textAlign: "center", fontSize: "0.9rem", fontFamily: "'Instrument Sans', sans-serif" }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase" style={stepBtn}>+</button>
            </div>
          </div>

          <button
            onClick={() => { onAdd(product, qty); onClose(); }}
            style={{
              width: "100%", background: "#0d0c0b", color: "#fff", border: "none",
              padding: "16px", borderRadius: 4,
              fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600,
              fontFamily: "'Instrument Sans', sans-serif", cursor: "pointer",
            }}
          >
            Add to bag · ₹{product.price * qty}
          </button>

          <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.7rem", color: "#aaa", marginTop: 16, textAlign: "center" }}>
            Available for pickup, Wed–Sun · 8:15 am – 6:00 pm
          </p>
        </div>
      </div>
    </div>
  );
}

const stepBtn: React.CSSProperties = {
  width: 38, height: 38, background: "none", border: "none",
  color: "#0d0c0b", fontSize: "1rem", cursor: "pointer", lineHeight: 1,
};

function arrowStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    [side]: 14, width: 36, height: 36, borderRadius: "50%",
    background: "rgba(255,255,255,0.85)", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  };
}
