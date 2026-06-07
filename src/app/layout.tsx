import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Andy's Bread — Artisan Bakery",
  description:
    "Order fresh artisan breads from Andy's Bakery. Sourdough, challah, focaccia, and more — baked daily.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-stone-50">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="bg-amber-900 text-amber-200 text-center text-sm py-6 mt-12">
            <p className="font-semibold text-white mb-1">Andy&apos;s Bread</p>
            <p>Baked fresh daily • Orders due 48 hours in advance</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
