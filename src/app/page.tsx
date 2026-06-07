"use client";

import { useState } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered: Product[] =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <p className="text-amber-700 font-medium uppercase tracking-widest text-xs mb-2">
          Artisan Bakery
        </p>
        <h2 className="text-4xl font-bold text-stone-800 mb-3">
          Fresh Baked Daily
        </h2>
        <p className="text-stone-500 max-w-md mx-auto">
          Order ahead and pick up your favorites. All breads are baked to order
          — place yours at least 48 hours in advance.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap justify-center mb-8">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
