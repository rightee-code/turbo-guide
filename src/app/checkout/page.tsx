"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Fulfillment } from "@/types";
import {
  checkDeliveryDate,
  DELIVERY_MINIMUM,
  DELIVERY_WINDOWS,
  earliestDeliveryDate,
  LEAD_DAYS,
  money,
} from "@/lib/schedule";

type Form = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  fulfillment: Fulfillment;
  address: string;
  deliveryDate: string;
  deliveryWindow: string;
  poNumber: string;
  notes: string;
};

type Errors = Partial<Record<keyof Form | "items", string>>;

const inputClass = (error?: string) =>
  `w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition ${
    error ? "border-red-400" : "border-stone-200"
  }`;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-stone-700 mb-1">
        {label}
      </span>
      {children}
      {error && <span className="block text-red-500 text-xs mt-1">{error}</span>}
    </label>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, belowMinimum } = useCart();
  const router = useRouter();

  const [form, setForm] = useState<Form>({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    fulfillment: "delivery",
    address: "",
    deliveryDate: "",
    deliveryWindow: DELIVERY_WINDOWS[1],
    poNumber: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-500 mb-4">Your order is empty.</p>
        <Link
          href="/"
          className="inline-block bg-amber-700 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-amber-600 transition-colors"
        >
          Go to order sheet
        </Link>
      </div>
    );
  }

  const isDelivery = form.fulfillment === "delivery";
  const underMinimum = isDelivery && totalPrice < DELIVERY_MINIMUM;

  function validate() {
    const e: Errors = {};
    if (!form.businessName.trim()) e.businessName = "Business name is required";
    if (!form.contactName.trim()) e.contactName = "Contact name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Valid email is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (isDelivery && !form.address.trim())
      e.address = "Delivery address is required";
    const dateError = checkDeliveryDate(form.deliveryDate);
    if (dateError) e.deliveryDate = dateError;
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
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
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        clearCart();
        router.push(`/order-confirmation?id=${data.orderId}`);
        return;
      }
      setErrors(data.fields ?? {});
      setFormError(
        data.fields?.items ?? data.error ?? "Something went wrong. Please try again."
      );
    } catch {
      setFormError("Couldn't reach the bakery. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function field<K extends keyof Form>(name: K, value: Form[K]) {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-stone-800 mb-6">
        Delivery details
      </h2>

      <div className="bg-white rounded-2xl border border-amber-100 p-5 mb-6">
        <div className="flex justify-between items-baseline mb-3">
          <h3 className="font-semibold text-stone-700 text-sm uppercase tracking-wide">
            Order summary
          </h3>
          <Link href="/cart" className="text-sm text-amber-700 hover:underline">
            Edit
          </Link>
        </div>
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex justify-between text-sm text-stone-600 mb-1"
          >
            <span>
              {quantity} × {product.name}{" "}
              <span className="text-stone-400">({product.unit})</span>
            </span>
            <span>{money(product.price * quantity)}</span>
          </div>
        ))}
        <div className="border-t border-amber-100 mt-3 pt-3 flex justify-between font-bold text-stone-800">
          <span>Total</span>
          <span>{money(totalPrice)}</span>
        </div>
        <p className="text-xs text-stone-400 mt-2">
          Invoiced on net-15 terms. Prices exclude any applicable tax.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="bg-white rounded-2xl border border-amber-100 p-5 space-y-4">
          <h3 className="font-semibold text-stone-700 text-sm uppercase tracking-wide">
            Business
          </h3>
          <Field label="Business name" error={errors.businessName}>
            <input
              value={form.businessName}
              onChange={(e) => field("businessName", e.target.value)}
              placeholder="Corner Café"
              autoComplete="organization"
              className={inputClass(errors.businessName)}
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Contact name" error={errors.contactName}>
              <input
                value={form.contactName}
                onChange={(e) => field("contactName", e.target.value)}
                autoComplete="name"
                className={inputClass(errors.contactName)}
              />
            </Field>
            <Field label="PO number (optional)">
              <input
                value={form.poNumber}
                onChange={(e) => field("poNumber", e.target.value)}
                className={inputClass()}
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => field("email", e.target.value)}
                autoComplete="email"
                className={inputClass(errors.email)}
              />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => field("phone", e.target.value)}
                autoComplete="tel"
                className={inputClass(errors.phone)}
              />
            </Field>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 p-5 space-y-4">
          <h3 className="font-semibold text-stone-700 text-sm uppercase tracking-wide">
            Fulfillment
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {(["delivery", "pickup"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => field("fulfillment", opt)}
                aria-pressed={form.fulfillment === opt}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  form.fulfillment === opt
                    ? "bg-amber-700 border-amber-700 text-white"
                    : "bg-white border-stone-200 text-stone-600 hover:border-amber-400"
                }`}
              >
                {opt === "delivery" ? "🚚 Delivery" : "🏪 Pick up at bakery"}
              </button>
            ))}
          </div>

          {underMinimum && (
            <p className="text-sm bg-amber-50 text-amber-800 rounded-xl p-3">
              Delivery requires a {money(DELIVERY_MINIMUM)} minimum. Add{" "}
              {money(DELIVERY_MINIMUM - totalPrice)} more, or choose pickup.
            </p>
          )}

          {isDelivery && (
            <Field label="Delivery address" error={errors.address}>
              <textarea
                value={form.address}
                onChange={(e) => field("address", e.target.value)}
                rows={2}
                autoComplete="street-address"
                placeholder="Street, city, and any dock or back-door instructions"
                className={`${inputClass(errors.address)} resize-none`}
              />
            </Field>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label={isDelivery ? "Delivery date" : "Pickup date"}
              error={errors.deliveryDate}
            >
              <input
                type="date"
                value={form.deliveryDate}
                min={earliestDeliveryDate()}
                onChange={(e) => field("deliveryDate", e.target.value)}
                className={inputClass(errors.deliveryDate)}
              />
            </Field>
            <Field label={isDelivery ? "Delivery window" : "Pickup window"}>
              <select
                value={form.deliveryWindow}
                onChange={(e) => field("deliveryWindow", e.target.value)}
                className={inputClass()}
              >
                {DELIVERY_WINDOWS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <p className="text-stone-400 text-xs">
            {LEAD_DAYS} days&apos; notice required. We bake Monday–Saturday.
          </p>

          <Field label="Notes for the bakery (optional)">
            <textarea
              value={form.notes}
              onChange={(e) => field("notes", e.target.value)}
              placeholder="Slicing requests, substitutions, standing order changes…"
              rows={3}
              className={`${inputClass()} resize-none`}
            />
          </Field>
        </div>

        {formError && (
          <p className="bg-red-50 text-red-600 rounded-xl p-3 text-sm">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || underMinimum || belowMinimum.length > 0}
          className="w-full bg-amber-700 hover:bg-amber-600 disabled:bg-amber-300 text-white py-3 rounded-xl font-semibold text-lg transition-colors"
        >
          {submitting ? "Submitting order…" : `Submit order · ${money(totalPrice)}`}
        </button>
      </form>
    </div>
  );
}
