"use client";

import React, { useState } from "react";
import { authService, UserProfile } from "@/lib/supabase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: Props) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const reset = () => { setError(null); setEmail(""); setPassword(""); setFullName(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let result;
      if (tab === "register") {
        result = await authService.signUp(email, password, fullName);
      } else {
        result = await authService.signIn(email, password);
      }
      if (result.error) {
        setError(result.error.message);
      } else {
        const user = await authService.getCurrentUser();
        if (user) onSuccess(user);
        reset();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t: "login" | "register") => { setTab(t); setError(null); };

  return (
    <div
      id="auth-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-modal)",
        background: "rgba(13,12,11,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        className="modal-pop"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--c-white)",
          width: "100%",
          maxWidth: "440px",
          padding: "3rem 2.5rem",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          id="auth-modal-close"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--c-muted)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </button>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "2rem", marginBottom: "2.5rem", borderBottom: "1px solid var(--c-border)", paddingBottom: "0" }}>
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              id={`auth-tab-${t}`}
              onClick={() => switchTab(t)}
              className="label"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                paddingBottom: "0.75rem",
                color: tab === t ? "var(--c-text)" : "var(--c-muted)",
                borderBottom: tab === t ? "1px solid var(--c-text)" : "1px solid transparent",
                marginBottom: "-1px",
              }}
            >
              {t === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <h2
          id="auth-modal-title"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2rem",
            fontWeight: 300,
            marginBottom: "2rem",
            color: "var(--c-text)",
          }}
        >
          {tab === "login" ? "Welcome back" : "Join HERE I'M"}
        </h2>

        {error && (
          <p
            role="alert"
            style={{
              color: "#c0392b",
              fontSize: "0.75rem",
              marginBottom: "1.25rem",
              padding: "0.75rem 1rem",
              background: "#fef2f2",
              borderLeft: "2px solid #c0392b",
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {tab === "register" && (
            <div>
              <label htmlFor="auth-name" className="label" style={{ display: "block", marginBottom: "0.4rem", color: "var(--c-muted)" }}>
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "1px solid var(--c-border)",
                  background: "var(--c-bg)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                  color: "var(--c-text)",
                  outline: "none",
                }}
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="label" style={{ display: "block", marginBottom: "0.4rem", color: "var(--c-muted)" }}>
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                border: "1px solid var(--c-border)",
                background: "var(--c-bg)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                color: "var(--c-text)",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="label" style={{ display: "block", marginBottom: "0.4rem", color: "var(--c-muted)" }}>
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              required
              autoComplete={tab === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                border: "1px solid var(--c-border)",
                background: "var(--c-bg)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                color: "var(--c-text)",
                outline: "none",
              }}
            />
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="btn btn-dark"
            style={{
              marginTop: "0.5rem",
              width: "100%",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
