import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/features/auth/AuthProvider";

export const metadata: Metadata = {
  title: "HERE I'M | Click & Collect — Jayanagar, Bengaluru",
  description: "Premium artisanal sandwiches and crispy fries. Pre-order for in-store pickup.",
};

// Critical for real phones — render at device width so the responsive
// layout actually applies (otherwise mobile renders the desktop layout).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
