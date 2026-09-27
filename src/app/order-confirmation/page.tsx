import Link from "next/link";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await searchParams;
  const orderId = typeof id === "string" ? id : "—";

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-4">✅</div>
      <h2 className="text-3xl font-bold text-stone-800 mb-2">
        Order received
      </h2>
      <p className="text-stone-500 mb-4">
        Thanks! Your order is in the bake schedule.
      </p>
      <p className="text-sm text-amber-700 font-mono bg-amber-50 inline-block px-4 py-1.5 rounded-full mb-8">
        Order #{orderId}
      </p>
      <div className="bg-white border border-amber-100 rounded-2xl p-5 text-left text-sm text-stone-600 mb-8 space-y-2">
        <p>📧 We&apos;ll email a confirmation to your contact address.</p>
        <p>🥖 Everything is baked fresh the morning of your delivery.</p>
        <p>🧾 An invoice follows with your delivery (net-15).</p>
        <p>
          ✏️ Need a change? Call the bakery at least 24 hours before your
          delivery date and quote your order number.
        </p>
      </div>
      <Link
        href="/"
        className="inline-block bg-amber-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors"
      >
        Place another order
      </Link>
    </div>
  );
}
