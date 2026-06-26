"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import AuthModal from "./AuthModal";

// Account control used in every header. Signed out → opens the sign-in
// modal. Signed in → avatar with a dropdown (My orders / Sign out).
export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const initial = (user?.user_metadata?.full_name || user?.email || "?").trim().charAt(0);

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <button
        onClick={() => { if (user) setMenuOpen((o) => !o); else setAuthOpen(true); }}
        aria-label={user ? "Account menu" : "Sign in"}
        style={{ background: "none", border: "none", padding: 4, color: "#0d0c0b", cursor: "pointer", display: "flex", alignItems: "center" }}
      >
        {user ? (
          <span style={{
            width: 26, height: 26, borderRadius: "50%", background: "#0d0c0b", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.7rem", fontWeight: 600, fontFamily: "'Instrument Sans',sans-serif", textTransform: "uppercase",
          }}>
            {initial}
          </span>
        ) : (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        )}
      </button>

      {user && menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 70 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 12px)", right: 0, zIndex: 71,
            background: "#fff", border: "1px solid #e8e6e3", borderRadius: 12,
            boxShadow: "0 12px 40px rgba(13,12,11,0.12)", minWidth: 220, padding: 8,
            fontFamily: "'Instrument Sans',sans-serif",
          }}>
            <div style={{ padding: "10px 12px", borderBottom: "1px solid #f0eeeb", marginBottom: 4 }}>
              <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#999" }}>Signed in</p>
              <p style={{ fontSize: "0.78rem", color: "#0d0c0b", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email ?? user.phone ?? "Account"}
              </p>
            </div>
            <a href="/orders" style={menuItem} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>My orders</a>
            <button
              onClick={async () => { setMenuOpen(false); await signOut(); }}
              style={{ ...menuItem, width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
              onMouseEnter={hoverIn} onMouseLeave={hoverOut}
            >
              Sign out
            </button>
          </div>
        </>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

const menuItem: React.CSSProperties = {
  display: "block", padding: "10px 12px", fontSize: "0.78rem", color: "#0d0c0b", textDecoration: "none", borderRadius: 8,
};
function hoverIn(e: React.MouseEvent<HTMLElement>) { e.currentTarget.style.background = "#f7f5f2"; }
function hoverOut(e: React.MouseEvent<HTMLElement>) { e.currentTarget.style.background = "transparent"; }
