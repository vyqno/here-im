import React from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight:"100vh", background:"#fff", display:"flex", flexDirection:"column" }}>
      <SiteHeader />
      <main style={{ flex:1 }}>{children}</main>
      <SiteFooter />
    </div>
  );
}
