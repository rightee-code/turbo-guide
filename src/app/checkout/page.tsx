"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const PICKUP_TIMES = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

function getMinPickupDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split("T")[0];
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    pickupDate: "",
    pickupTime: "10:00 AM",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-500 mb-4">Your cart is empty.</p>
        <Link
          href="/"
          className="inline-block bg-amber-700 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-amber-600 transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.customerName.trim()) e.customerName = "Name is required";
    if (!form.email.includes("@")) e.email = "Valid email is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.pickupDate) e.pickupDate = "Pickup date is required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items, total: totalPrice }),
      });
      const data = await res.json();
      if (res.ok) {
        clearCart();
        router.push(`/order-confirmation?id=${data.orderId}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function field(name: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-stone-800 mb-6">Checkout</h2>

      <div className="bg-white rounded-2xl border border-amber-100 p-5 mb-6">
        <h3 className="font-semibold text-stone-700 mb-3 text-sm uppercase tracking-wide">
          Order Summary
        </h3>
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex justify-between text-sm text-stone-600 mb-1"
          >
            <span>
              {product.name} × {quantity}
            </span>
            <span>${(product.price * quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t border-amber-100 mt-3 pt-3 flex justify-between font-bold text-stone-800">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-2xl border border-amber-100 p-5 space-y-4">
          <h3 className="font-semibold text-stone-700 text-sm uppercase tracking-wide">
            Your Details
          </h3>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => field("customerName", e.target.value)}
              placeholder="Andy Smith"
              className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition ${
                errors.customerName ? "border-red-400" : "border-stone-200"
              }`}
            />
            {errors.customerName && (
              <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => field("email", e.target.value)}
              placeholder="andy@example.com"
              className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition ${
                errors.email ? "border-red-400" : "border-stone-200"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => field("phone", e.target.value)}
              placeholder="(555) 123-4567"
              className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition ${
                errors.phone ? "border-red-400" : "border-stone-200"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-5 space-y-4">
          <h3 className="font-semibold text-stone-700 text-sm uppercase tracking-wide">
            Pickup Details
          </h3>
          <p className="text-stone-400 text-xs">
            Orders require at least 48 hours notice.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Pickup Date
              </label>
              <input
                type="date"
                value={form.pickupDate}
                min={getMinPickupDate()}
                onChange={(e) => field("pickupDate", e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition ${
                  errors.pickupDate ? "border-red-400" : "border-stone-200"
                }`}
              />
              {errors.pickupDate && (
                <p className="text-red-500 text-xs mt-1">{errors.pickupDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Pickup Time
              </label>
              <select
                value={form.pickupTime}
                onChange={(e) => field("pickupTime", e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition"
              >
                {PICKUP_TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Special Requests (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => field("notes", e.target.value)}
              placeholder="Any special requests or instructions..."
              rows={3}
              className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-700 hover:bg-amber-600 disabled:bg-amber-300 text-white py-3 rounded-xl font-semibold text-lg transition-colors"
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
