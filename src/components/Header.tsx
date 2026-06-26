"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { authService, UserProfile } from "@/lib/supabase";
import AuthModal from "./AuthModal";

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    await authService.signOut();
    setUser(null);
    setUserMenuOpen(false);
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: "var(--z-overlay)",
          background: scrolled ? "rgba(250,249,247,0.92)" : "var(--c-bg)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: `1px solid ${scrolled ? "var(--c-border)" : "transparent"}`,
          transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 2rem",
            height: "4.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Hamburger (mobile) */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              color: "var(--c-text)",
            }}
            className="mobile-menu-btn"
          >
            <svg width="22" height="16" fill="none" viewBox="0 0 22 16">
              <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="0" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="0" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>

          {/* Logo */}
          <Link
            href="/"
            id="site-logo"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.5rem",
              fontWeight: 300,
              letterSpacing: "0.1em",
              color: "var(--c-text)",
              textDecoration: "none",
              lineHeight: 1,
            }}
          >
            HERE I'M
          </Link>

          {/* Desktop nav */}
          <nav
            id="desktop-nav"
            aria-label="Main navigation"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3rem",
            }}
          >
            {[
              { label: "Click & Collect", href: "#shop" },
              { label: "Our Story", href: "#story" },
              { label: "Menu", href: "#menu" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="link-underline label"
                style={{ color: "var(--c-muted)", textDecoration: "none" }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            {/* User */}
            <div ref={menuRef} style={{ position: "relative" }}>
              {user ? (
                <>
                  <button
                    id="user-menu-btn"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="User account"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--c-text)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                    }}
                  >
                    <UserIcon />
                    <span className="label" style={{ color: "var(--c-muted)", fontSize: "0.6rem" }}>
                      {user.fullName.split(" ")[0]}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 0.75rem)",
                        right: 0,
                        minWidth: "200px",
                        background: "var(--c-white)",
                        border: "1px solid var(--c-border)",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.08)",
                        zIndex: "var(--z-modal)",
                      }}
                    >
                      <div
                        style={{
                          padding: "0.875rem 1.25rem",
                          borderBottom: "1px solid var(--c-border)",
                        }}
                      >
                        <p className="label" style={{ color: "var(--c-muted)", marginBottom: "0.2rem" }}>Signed in as</p>
                        <p className="body-sm" style={{ fontWeight: 500, color: "var(--c-text)" }}>{user.email}</p>
                      </div>
                      <Link
                        href="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: "block",
                          padding: "0.875rem 1.25rem",
                          textDecoration: "none",
                          color: "var(--c-text)",
                        }}
                        className="label"
                      >
                        My Pre-orders
                      </Link>
                      <button
                        onClick={handleSignOut}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "0.875rem 1.25rem",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#c0392b",
                          borderTop: "1px solid var(--c-border)",
                        }}
                        className="label"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  id="sign-in-btn"
                  onClick={() => setIsAuthOpen(true)}
                  aria-label="Sign in"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--c-text)",
                    padding: "0.25rem",
                  }}
                >
                  <UserIcon />
                </button>
              )}
            </div>

            {/* Cart */}
            <button
              id="cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--c-text)",
                position: "relative",
                padding: "0.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              <BagIcon />
              {cartCount > 0 && (
                <span className="label" style={{ color: "var(--c-muted)", fontSize: "0.6rem" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: "var(--z-drawer)",
            background: "var(--c-bg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2.5rem",
          }}
        >
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "2rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--c-text)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="1" y1="1" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="21" y1="1" x2="1" y2="21" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>

          {[
            { label: "Click & Collect", href: "#shop" },
            { label: "Our Story", href: "#story" },
            { label: "Menu", href: "#menu" },
            { label: "Location", href: "#location" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 8vw, 3.5rem)",
                fontWeight: 300,
                color: "var(--c-text)",
                textDecoration: "none",
                letterSpacing: "-0.01em",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          #desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u) => { setUser(u); setIsAuthOpen(false); }}
      />
    </>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/>
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}
