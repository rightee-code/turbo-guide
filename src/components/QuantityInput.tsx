"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

export default function QuantityInput({ product }: { product: Product }) {
  const { quantityOf, setQuantity } = useCart();
  const qty = quantityOf(product.id);
  const tooFew = qty > 0 && qty < product.minQty;

  // Stepping up from zero jumps straight to the minimum; stepping down
  // from the minimum clears the line.
  const inc = () => setQuantity(product, qty === 0 ? product.minQty : qty + 1);
  const dec = () => setQuantity(product, qty <= product.minQty ? 0 : qty - 1);

  return (
    <div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={dec}
          disabled={qty === 0}
          aria-label={`Fewer ${product.name}`}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 disabled:opacity-40 transition-colors"
        >
          <MinusIcon className="w-4 h-4" />
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={qty === 0 ? "" : qty}
          placeholder="0"
          onChange={(e) => setQuantity(product, Number(e.target.value))}
          aria-label={`Quantity of ${product.name}`}
          className={`w-14 h-8 text-center font-semibold rounded-lg border outline-none focus:ring-2 focus:ring-amber-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none ${
            tooFew ? "border-red-400 text-red-600" : "border-stone-200 text-stone-800"
          }`}
        />
        <button
          type="button"
          onClick={inc}
          aria-label={`More ${product.name}`}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-700 text-white hover:bg-amber-600 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
      {tooFew && (
        <p className="text-red-500 text-xs mt-1">Min {product.minQty}</p>
      )}
    </div>
  );
}
