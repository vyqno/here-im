"use client";

import React, { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"show" | "exit" | "done">("show");

  useEffect(() => {
    const exit = setTimeout(() => setPhase("exit"), 2400);
    const done = setTimeout(() => setPhase("done"), 3400);
    return () => { clearTimeout(exit); clearTimeout(done); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--c-black)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        transform: phase === "exit" ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 1s cubic-bezier(0.65, 0, 0.35, 1)",
        willChange: "transform",
      }}
    >
      <h1
        className="logo-glow"
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 300,
          fontSize: "clamp(3.5rem, 12vw, 10rem)",
          color: "#faf9f7",
          letterSpacing: "0.05em",
          lineHeight: 1,
        }}
      >
        HERE I'M
      </h1>
      <p
        className="subtitle-fade label"
        style={{ color: "rgba(250,249,247,0.45)" }}
      >
        Jayanagar · Bengaluru
      </p>
    </div>
  );
}
