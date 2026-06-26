import React from "react";
import PageLayout from "./PageLayout";

export interface EditorialSection {
  heading?: string;
  paragraphs: string[];
}

export interface EditorialContent {
  eyebrow: string;
  title: string;
  intro?: string;
  sections?: EditorialSection[];
}

// Shared editorial layout for the storefront's content pages.
// Generous whitespace, serif display headings, narrow reading column —
// per the design system.
export default function EditorialPage({ eyebrow, title, intro, sections = [] }: EditorialContent) {
  return (
    <PageLayout>
      {/* Hero */}
      <section style={{
        padding:"clamp(72px,12vw,140px) 24px clamp(40px,6vw,72px)",
        textAlign:"center",
        display:"flex",flexDirection:"column",alignItems:"center",gap:20,
      }}>
        <p style={{
          fontFamily:"'Instrument Sans',sans-serif",
          fontSize:"0.6rem",letterSpacing:"0.2em",textTransform:"uppercase",color:"#aaa",
        }}>
          {eyebrow}
        </p>
        <h1 style={{
          fontFamily:"'Instrument Serif',serif",
          fontSize:"clamp(2.8rem,7vw,5.5rem)",fontWeight:400,letterSpacing:"-0.01em",
          lineHeight:1,color:"#0d0c0b",
        }}>
          {title}
        </h1>
        {intro && (
          <p style={{
            fontFamily:"'Instrument Sans',sans-serif",
            fontSize:"clamp(0.95rem,1.4vw,1.1rem)",color:"#555",lineHeight:1.7,
            maxWidth:560,marginTop:8,
          }}>
            {intro}
          </p>
        )}
      </section>

      {/* Body sections */}
      <div style={{
        maxWidth:680,margin:"0 auto",
        padding:"0 24px clamp(72px,12vw,140px)",
        display:"flex",flexDirection:"column",gap:"clamp(40px,6vw,64px)",
      }}>
        {sections.map((s, i) => (
          <section key={i} style={{ display:"flex",flexDirection:"column",gap:16 }}>
            {s.heading && (
              <h2 style={{
                fontFamily:"'Instrument Serif',serif",
                fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:400,color:"#0d0c0b",lineHeight:1.2,
              }}>
                {s.heading}
              </h2>
            )}
            {s.paragraphs.map((p, j) => (
              <p key={j} style={{
                fontFamily:"'Instrument Sans',sans-serif",
                fontSize:"1rem",color:"#444",lineHeight:1.85,
              }}>
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </PageLayout>
  );
}
