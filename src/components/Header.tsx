"use client";

import Link from "next/link";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { items } = useCart();
  const lines = items.length;

  return (
    <header className="bg-amber-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-3xl">🍞</span>
          <div>
            <h1 className="text-xl font-bold leading-none tracking-tight">
              Andy&apos;s Bread
            </h1>
            <p className="text-amber-300 text-xs">Wholesale</p>
          </div>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
          <Link
            href="/"
            className="hidden sm:inline text-amber-100 hover:text-white transition-colors"
          >
            Order sheet
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-1.5 bg-amber-700 hover:bg-amber-600 transition-colors rounded-full px-4 py-1.5"
          >
            <ClipboardDocumentListIcon className="w-4 h-4" />
            <span>Your order</span>
            {lines > 0 && (
              <span className="bg-white text-amber-900 rounded-full text-xs font-bold min-w-5 h-5 px-1 flex items-center justify-center ml-0.5">
                {lines}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
