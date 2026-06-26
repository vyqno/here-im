"use client";

import React, { useState } from "react";
import Link from "next/link";

const NAV = [
  { label: "Click & collect", href: "/" },
  { label: "Our story", href: "/our-story" },
  { label: "Menu", href: "/menu" },
  { label: "Events", href: "/events" },
];

const SECONDARY = [
  { label: "My orders", href: "/orders" },
  { label: "About", href: "/about" },
  { label: "Help", href: "/help" },
  { label: "Contact", href: "/contact" },
];

// Hamburger that opens a full-screen premium menu. The hamburger only
// shows on small screens (CSS .mobile-menu-btn); desktop keeps inline nav.
export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        style={{ background: "none", border: "none", padding: 4, color: "#0d0c0b", flexDirection: "column", gap: 5, cursor: "pointer" }}
      >
        <span style={{ display: "block", width: 20, height: 1.5, background: "currentColor" }} />
        <span style={{ display: "block", width: 20, height: 1.5, background: "currentColor" }} />
        <span style={{ display: "block", width: 20, height: 1.5, background: "currentColor" }} />
      </button>

      {open && (
        <div className="mobile-nav-overlay">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 28 }}>
            <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: "1.05rem", letterSpacing: "0.08em" }}>HERE I&apos;M</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" style={{ background: "none", border: "none", fontSize: "1.4rem", lineHeight: 1, color: "#0d0c0b", cursor: "pointer" }}>✕</button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 48 }}>
            {NAV.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{ fontFamily: "'Instrument Serif',serif", fontSize: "2rem", color: "#0d0c0b", textDecoration: "none", padding: "10px 0" }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <nav style={{ display: "flex", flexWrap: "wrap", gap: "16px 28px", marginTop: "auto", paddingTop: 32, borderTop: "1px solid #eceae5" }}>
            {SECONDARY.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: "0.8rem", color: "#666", textDecoration: "none" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
