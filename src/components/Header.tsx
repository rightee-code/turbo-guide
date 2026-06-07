"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="bg-amber-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-3xl">🍞</span>
          <div>
            <h1 className="text-xl font-bold leading-none tracking-tight">
              Andy&apos;s Bread
            </h1>
            <p className="text-amber-300 text-xs">Artisan Bakery</p>
          </div>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-amber-100 hover:text-white transition-colors"
          >
            Menu
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-1.5 bg-amber-700 hover:bg-amber-600 transition-colors rounded-full px-4 py-1.5"
          >
            <ShoppingCartIcon className="w-4 h-4" />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="bg-white text-amber-900 rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center ml-0.5">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        <Link href="/cart" className="sm:hidden relative">
          <ShoppingCartIcon className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
