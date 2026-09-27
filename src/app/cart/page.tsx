"use client";

import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import QuantityInput from "@/components/QuantityInput";
import { DELIVERY_MINIMUM, money } from "@/lib/schedule";

export default function CartPage() {
  const { items, removeItem, totalPrice, belowMinimum } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">
          Your order is empty
        </h2>
        <p className="text-stone-500 mb-6">
          Add products from the order sheet to get started.
        </p>
        <Link
          href="/"
          className="inline-block bg-amber-700 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-amber-600 transition-colors"
        >
          Go to order sheet
        </Link>
      </div>
    );
  }

  const shortOfDelivery = Math.max(0, DELIVERY_MINIMUM - totalPrice);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-stone-800 mb-6">Review order</h2>

      <div className="bg-white rounded-2xl border border-amber-100 divide-y divide-amber-50 mb-6">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4"
          >
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              {product.emoji}
            </div>
            <div className="flex-1 min-w-40">
              <p className="font-semibold text-stone-800">{product.name}</p>
              <p className="text-amber-700 text-sm">
                {money(product.price)} per {product.unit}
              </p>
            </div>
            <QuantityInput product={product} />
            <p className="w-20 text-right font-bold text-stone-800">
              {money(product.price * quantity)}
            </p>
            <button
              onClick={() => removeItem(product.id)}
              aria-label={`Remove ${product.name}`}
              className="text-stone-300 hover:text-red-400 transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-amber-100 p-5 mb-5 space-y-2">
        <div className="flex justify-between font-bold text-stone-800 text-lg">
          <span>Order total</span>
          <span>{money(totalPrice)}</span>
        </div>
        {shortOfDelivery > 0 ? (
          <p className="text-sm text-stone-500">
            Add {money(shortOfDelivery)} more to qualify for delivery, or
            choose pickup at checkout.
          </p>
        ) : (
          <p className="text-sm text-green-700">✓ Qualifies for free delivery</p>
        )}
      </div>

      {belowMinimum.length > 0 ? (
        <p className="text-center bg-red-50 text-red-600 rounded-xl p-3 text-sm mb-3">
          Some products are below their minimum quantity:{" "}
          {belowMinimum
            .map((i) => `${i.product.name} (min ${i.product.minQty})`)
            .join(", ")}
        </p>
      ) : (
        <Link
          href="/checkout"
          className="block w-full text-center bg-amber-700 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors text-lg"
        >
          Continue to delivery details
        </Link>
      )}
      <Link
        href="/"
        className="block w-full text-center text-stone-500 hover:text-stone-700 py-2 mt-2 text-sm transition-colors"
      >
        Back to order sheet
      </Link>
    </div>
  );
}
