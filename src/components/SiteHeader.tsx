"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartButton from "@/features/cart/CartButton";
import UserMenu from "@/features/auth/UserMenu";
import MobileNav from "@/components/MobileNav";

const NAV = [
  { label: "Click & collect", href: "/" },
  { label: "Our story", href: "/our-story" },
  { label: "Menu", href: "/menu" },
  { label: "Events", href: "/events" },
];

// Storefront header for sub-pages. Visually matches the homepage header.
export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header style={{
      position:"sticky",top:0,zIndex:40,
      background:"#fff",borderBottom:"1px solid #e8e6e3",
      height:"60px",display:"flex",alignItems:"center",
      padding:"0 24px",justifyContent:"space-between",
    }}>
      <div style={{ display:"flex",alignItems:"center",gap:"20px" }}>
        <MobileNav />
        <Link href="/" style={{ fontFamily:"'Instrument Serif',serif",fontSize:"1.05rem",letterSpacing:"0.08em",fontWeight:400,color:"#0d0c0b",textDecoration:"none" }}>
          HERE I&apos;M
        </Link>
      </div>

      <nav className="desktop-nav" style={{ display:"flex",alignItems:"center",gap:"32px" }}>
        {NAV.map(({ label, href }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`nav-hover${active ? " nav-active" : ""}`}
              style={{ fontSize:"0.78rem",color:"#0d0c0b",letterSpacing:"0.02em",textDecoration:"none" }}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div style={{ display:"flex",alignItems:"center",gap:"16px" }}>
        <UserMenu />
        <CartButton />
      </div>
    </header>
  );
}
