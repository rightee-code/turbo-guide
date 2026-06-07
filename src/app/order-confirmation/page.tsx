"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function Confirmation() {
  const params = useSearchParams();
  const orderId = params.get("id") ?? "—";

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-4">🎉</div>
      <h2 className="text-3xl font-bold text-stone-800 mb-2">
        Order Received!
      </h2>
      <p className="text-stone-500 mb-2">
        Thanks for your order. We&apos;ll have it fresh and ready for pickup.
      </p>
      <p className="text-sm text-amber-700 font-mono bg-amber-50 inline-block px-4 py-1.5 rounded-full mb-8">
        Order #{orderId}
      </p>
      <div className="bg-white border border-amber-100 rounded-2xl p-5 text-left text-sm text-stone-600 mb-8 space-y-2">
        <p>✅ We&apos;ll send a confirmation email shortly.</p>
        <p>✅ Your bread will be baked fresh the morning of pickup.</p>
        <p>✅ Come in and give us your order number or name at the counter.</p>
      </div>
      <Link
        href="/"
        className="inline-block bg-amber-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors"
      >
        Order More Bread
      </Link>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <Confirmation />
    </Suspense>
  );
}
