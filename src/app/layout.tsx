import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/lib/locale-context";
import { CartProvider } from "@/lib/cart-context";
import { PWAInit } from "@/components/PWAInit";

export const metadata: Metadata = {
  title: "Rapidisimo | Delivery con garantía - República Dominicana",
  description:
    "La app de delivery más segura de RD. Precio claro, repartidores verificados y garantía de reembolso. Pedí tranquilo.",
  manifest: "/manifest.webmanifest",
  themeColor: "#16a34a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <LocaleProvider>
          <CartProvider>
            <PWAInit />
            {children}
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
