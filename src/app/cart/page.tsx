"use client";

import Link from "next/link";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";

const BREAD_EMOJI: Record<string, string> = {
  "sourdough-loaf": "🍞",
  "whole-wheat": "🌾",
  "cinnamon-raisin": "🥐",
  rye: "🫓",
  challah: "✨",
  brioche: "🧈",
  focaccia: "🫒",
  baguette: "🥖",
  "dinner-rolls": "🍞",
  "pretzel-rolls": "🥨",
};

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-stone-500 mb-6">
          Add some fresh breads to get started.
        </p>
        <Link
          href="/"
          className="inline-block bg-amber-700 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-amber-600 transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-stone-800 mb-6">Your Cart</h2>

      <div className="bg-white rounded-2xl border border-amber-100 divide-y divide-amber-50 mb-6">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-4 p-4">
            <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
              {BREAD_EMOJI[product.id] ?? "🍞"}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 truncate">
                {product.name}
              </p>
              <p className="text-amber-700 text-sm font-medium">
                ${product.price.toFixed(2)} each
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-bold text-stone-800">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>

            <p className="w-16 text-right font-bold text-stone-800">
              ${(product.price * quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeItem(product.id)}
              className="text-stone-300 hover:text-red-400 transition-colors ml-1"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-amber-100 p-5 mb-5">
        <div className="flex justify-between text-stone-600 text-sm mb-2">
          <span>{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-stone-800 text-lg border-t border-amber-100 pt-3 mt-3">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="block w-full text-center bg-amber-700 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors text-lg"
      >
        Proceed to Checkout
      </Link>
      <Link
        href="/"
        className="block w-full text-center text-stone-500 hover:text-stone-700 py-2 mt-2 text-sm transition-colors"
      >
        Continue shopping
      </Link>
    </div>
  );
}
