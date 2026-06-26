import React from "react";
import Link from "next/link";

const LINKS = [
  { label: "Contact us", href: "/contact" },
  { label: "About", href: "/about" },
  { label: "Help", href: "/help" },
  { label: "Join us", href: "/join-us" },
  { label: "Privacy", href: "/privacy" },
];

// Storefront footer. Matches the homepage footer.
export default function SiteFooter() {
  return (
    <footer style={{ background:"#fff",borderTop:"1px solid #e8e6e3" }}>
      <div style={{ textAlign:"center",padding:"28px 24px 20px",borderBottom:"1px solid #e8e6e3" }}>
        <Link href="/" style={{
          fontFamily:"'Instrument Serif',serif",fontSize:"1.3rem",fontWeight:400,
          letterSpacing:"0.08em",color:"#0d0c0b",textDecoration:"none",
        }}>
          HERE I&apos;M
        </Link>
      </div>
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:20,padding:"28px 24px 24px" }}>
        <nav style={{ display:"flex",gap:"32px",flexWrap:"wrap",justifyContent:"center" }}>
          {LINKS.map(({ label, href }) => (
            <Link key={href} href={href} style={{ fontSize:"0.75rem",color:"#0d0c0b",textDecoration:"none",letterSpacing:"0.02em" }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ width:"100%",maxWidth:1200,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <button aria-label="Theme" style={{ background:"none",border:"none",cursor:"pointer",color:"#888",padding:4 }}>
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
  );
}
