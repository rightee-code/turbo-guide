"use client";

import { useState } from "react";
import Link from "next/link";
import { products, categories } from "@/data/products";
import QuantityInput from "@/components/QuantityInput";
import { useCart } from "@/context/CartContext";
import { DELIVERY_MINIMUM, LEAD_DAYS, money } from "@/lib/schedule";

export default function OrderSheet() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { totalItems, totalPrice, quantityOf, items } = useCart();

  const filtered = products.filter(
    (p) =>
      p.available && (activeCategory === "all" || p.category === activeCategory)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-32">
      <div className="mb-8">
        <p className="text-amber-700 font-medium uppercase tracking-widest text-xs mb-2">
          Wholesale Order Sheet
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-3">
          Fresh bread for your business
        </h2>
        <p className="text-stone-500 max-w-2xl">
          Enter quantities below and review your order. Orders need {LEAD_DAYS}{" "}
          days&apos; notice. Free delivery on orders over{" "}
          {money(DELIVERY_MINIMUM)}, or pick up at the bakery with no minimum.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeCategory === cat.id
                ? "bg-amber-700 text-white border-amber-700"
                : "bg-white text-stone-600 border-stone-200 hover:border-amber-400"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_7rem_6rem_9rem_5.5rem] gap-4 px-4 py-3 bg-amber-50 text-xs font-semibold uppercase tracking-wide text-stone-500">
          <span>Product</span>
          <span>Unit</span>
          <span className="text-right">Price</span>
          <span>Quantity</span>
          <span className="text-right">Line total</span>
        </div>
        <ul className="divide-y divide-amber-50">
          {filtered.map((p) => {
            const qty = quantityOf(p.id);
            return (
              <li
                key={p.id}
                className={`grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_7rem_6rem_9rem_5.5rem] gap-x-4 gap-y-2 px-4 py-4 items-center ${
                  qty > 0 ? "bg-amber-50/40" : ""
                }`}
              >
                <div className="flex gap-3 items-start col-span-2 sm:col-span-1">
                  <span className="text-3xl leading-none" aria-hidden>
                    {p.emoji}
                  </span>
                  <div>
                    <p className="font-semibold text-stone-800">{p.name}</p>
                    <p className="text-stone-500 text-sm">{p.description}</p>
                  </div>
                </div>
                <div className="text-sm text-stone-600">
                  <span className="sm:block">per {p.unit}</span>
                  <span className="text-stone-400 text-xs sm:block">
                    {" "}
                    · min {p.minQty}
                  </span>
                </div>
                <p className="text-right font-bold text-amber-700 sm:order-none">
                  {money(p.price)}
                </p>
                <QuantityInput product={p} />
                <p className="text-right font-semibold text-stone-800">
                  {qty > 0 ? money(p.price * qty) : "—"}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-amber-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-40">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-stone-500">
                {items.length} product{items.length !== 1 ? "s" : ""} ·{" "}
                {totalItems} unit{totalItems !== 1 ? "s" : ""}
              </p>
              <p className="text-xl font-bold text-stone-800">
                {money(totalPrice)}
              </p>
            </div>
            <Link
              href="/cart"
              className="bg-amber-700 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Review order
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
