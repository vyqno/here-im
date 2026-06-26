"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthProvider";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0d0c0b" aria-hidden>
      <path d="M16.36 12.78c.02 2.48 2.17 3.3 2.2 3.31-.02.06-.34 1.18-1.13 2.33-.68 1-1.39 1.99-2.51 2.01-1.1.02-1.45-.65-2.7-.65-1.26 0-1.65.63-2.69.67-1.08.04-1.9-1.08-2.59-2.07-1.4-2.04-2.48-5.76-1.04-8.27.71-1.25 1.99-2.04 3.38-2.06 1.06-.02 2.06.71 2.71.71.65 0 1.87-.88 3.15-.75.54.02 2.05.22 3.02 1.64-.08.05-1.8 1.05-1.78 3.14M14.3 4.6c.58-.7.97-1.67.86-2.64-.83.03-1.84.55-2.44 1.25-.54.62-1.01 1.6-.88 2.55.93.07 1.88-.47 2.46-1.16"/>
    </svg>
  );
}

export default function AuthModal({ open, onClose, nextPath }: { open: boolean; onClose: () => void; nextPath?: string }) {
  const { signIn } = useAuth();
  const [busy, setBusy] = useState<"google" | "apple" | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handle = async (provider: "google" | "apple") => {
    try {
      setError(null);
      setBusy(provider);
      await signIn(provider, nextPath); // redirects away on success
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Sign-in failed.";
      setError(
        /provider is not enabled|not enabled|Unsupported provider/i.test(msg)
          ? `${provider === "google" ? "Google" : "Apple"} sign-in isn't enabled yet. Enable it in Supabase → Authentication → Providers.`
          : msg,
      );
      setBusy(null);
    }
  };

  const providerButton = (
    provider: "google" | "apple",
    label: string,
    icon: React.ReactNode,
  ) => (
    <button
      type="button"
      onClick={() => handle(provider)}
      disabled={busy !== null}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        width: "100%", padding: "14px 20px",
        background: "#fff", color: "#0d0c0b",
        border: "1px solid #e0ddd9", borderRadius: 999,
        fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.02em",
        fontFamily: "'Instrument Sans', sans-serif",
        cursor: busy ? "default" : "pointer", opacity: busy && busy !== provider ? 0.5 : 1,
        transition: "background 0.2s ease",
      }}
      onMouseEnter={(e) => { if (!busy) e.currentTarget.style.background = "#f7f5f2"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
    >
      {icon}
      {busy === provider ? "Redirecting…" : label}
    </button>
  );

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Sign in"
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(13,12,11,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, animation: "authFade 0.2s ease",
      }}
    >
      <style>{`@keyframes authFade{from{opacity:0}to{opacity:1}}`}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 16,
          boxShadow: "0 12px 48px rgba(13,12,11,0.18)",
          width: "min(400px, calc(100vw - 32px))",
          padding: "40px 36px 36px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: "absolute", top: 18, right: 20, background: "none", border: "none", fontSize: "1.1rem", color: "#999", cursor: "pointer", lineHeight: 1 }}
        >
          ✕
        </button>

        <h2 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "2rem", fontWeight: 400, color: "#0d0c0b",
          marginBottom: 6, lineHeight: 1.1,
        }}>
          Welcome
        </h2>
        <p style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "0.78rem", color: "#888", marginBottom: 28, lineHeight: 1.5,
        }}>
          Sign in to save your bag, track orders, and reorder in a tap.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {providerButton("google", "Continue with Google", <GoogleIcon />)}
          {providerButton("apple", "Continue with Apple", <AppleIcon />)}
        </div>

        {error && (
          <p style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "0.72rem", color: "#b4524a", marginTop: 16,
            textAlign: "center", lineHeight: 1.5,
          }}>
            {error}
          </p>
        )}

        <p style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: "0.6rem", color: "#bbb", marginTop: 24,
          textAlign: "center", lineHeight: 1.6, letterSpacing: "0.02em",
        }}>
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
