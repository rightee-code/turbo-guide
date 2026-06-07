"use client";

import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import { Product } from "@/types";
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

export default function ProductCard({ product }: { product: Product }) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="bg-amber-50 h-40 flex items-center justify-center text-7xl">
        {BREAD_EMOJI[product.id] ?? "🍞"}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-stone-800 leading-tight">
            {product.name}
          </h3>
          <span className="text-amber-700 font-bold text-sm whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <p className="text-stone-500 text-sm flex-1 mb-4 leading-relaxed">
          {product.description}
        </p>

        {quantity === 0 ? (
          <button
            onClick={() => addItem(product)}
            className="w-full bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-white rounded-xl py-2 text-sm font-semibold transition-colors"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between bg-amber-50 rounded-xl p-1">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-700 text-white hover:bg-amber-600 active:bg-amber-800 transition-colors"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="font-bold text-stone-800">{quantity}</span>
            <button
              onClick={() => addItem(product)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-700 text-white hover:bg-amber-600 active:bg-amber-800 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
