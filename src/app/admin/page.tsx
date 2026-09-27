import Link from "next/link";
import type { Metadata } from "next";
import { connection } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";
import { formatDate, money } from "@/lib/schedule";
import LoginForm from "./LoginForm";
import { logout } from "./actions";

export const metadata: Metadata = { title: "Bakery orders — Andy's Bread" };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Always render per request: orders change and the page is behind a login.
  await connection();

  if (!process.env.ADMIN_PASSWORD) {
    return (
      <Shell>
        <p className="text-stone-600">
          The admin view is disabled. Set the <code>ADMIN_PASSWORD</code>{" "}
          environment variable and restart the server to enable it.
        </p>
      </Shell>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Shell>
        <LoginForm />
      </Shell>
    );
  }

  const orders = await listOrders();
  const dates = [...new Set(orders.map((o) => o.deliveryDate))].sort();
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
  const { date } = await searchParams;
  const selected =
    typeof date === "string" && dates.includes(date)
      ? date
      : (dates.find((d) => d >= today) ?? dates.at(-1));

  const dayOrders = orders
    .filter((o) => o.deliveryDate === selected)
    .sort((a, b) => a.deliveryWindow.localeCompare(b.deliveryWindow));

  const production = new Map<string, { name: string; unit: string; qty: number }>();
  for (const o of dayOrders) {
    for (const l of o.lines) {
      const row = production.get(l.productId) ?? { name: l.name, unit: l.unit, qty: 0 };
      row.qty += l.quantity;
      production.set(l.productId, row);
    }
  }
  const dayTotal = dayOrders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-stone-800">Bakery orders</h2>
        <form action={logout}>
          <button className="text-sm text-stone-500 hover:text-stone-800">
            Sign out
          </button>
        </form>
      </div>

      {!selected ? (
        <p className="text-stone-500">No orders yet.</p>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap mb-6">
            {dates.map((d) => (
              <Link
                key={d}
                href={`/admin?date=${d}`}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  d === selected
                    ? "bg-amber-700 text-white border-amber-700"
                    : "bg-white text-stone-600 border-stone-200 hover:border-amber-400"
                } ${d < today ? "opacity-60" : ""}`}
              >
                {formatDate(d)}
              </Link>
            ))}
          </div>

          <section className="bg-white rounded-2xl border border-amber-100 p-5 mb-6">
            <div className="flex justify-between items-baseline mb-3">
              <h3 className="font-semibold text-stone-700 text-sm uppercase tracking-wide">
                Bake list · {formatDate(selected)}
              </h3>
              <span className="text-sm text-stone-500">
                {dayOrders.length} order{dayOrders.length !== 1 ? "s" : ""} ·{" "}
                {money(dayTotal)}
              </span>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-amber-50">
                {[...production.values()]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((p) => (
                    <tr key={p.name}>
                      <td className="py-2 text-stone-800">{p.name}</td>
                      <td className="py-2 text-right font-bold text-stone-800">
                        {p.qty}
                      </td>
                      <td className="py-2 pl-2 text-stone-400 w-28">{p.unit}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>

          <div className="space-y-4">
            {dayOrders.map((o) => (
              <article
                key={o.id}
                className="bg-white rounded-2xl border border-amber-100 p-5"
              >
                <div className="flex flex-wrap justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-stone-800">
                      {o.businessName}{" "}
                      <span className="font-mono text-xs text-stone-400">
                        #{o.id}
                      </span>
                    </p>
                    <p className="text-sm text-stone-500">
                      {o.contactName} · {o.phone} · {o.email}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium text-stone-700">
                      {o.fulfillment === "delivery" ? "🚚 Delivery" : "🏪 Pickup"} ·{" "}
                      {o.deliveryWindow}
                    </p>
                    {o.poNumber && (
                      <p className="text-stone-500">PO {o.poNumber}</p>
                    )}
                  </div>
                </div>
                {o.address && (
                  <p className="text-sm text-stone-600 whitespace-pre-line mb-2">
                    {o.address}
                  </p>
                )}
                <ul className="text-sm text-stone-600 mb-2">
                  {o.lines.map((l) => (
                    <li key={l.productId} className="flex justify-between">
                      <span>
                        {l.quantity} × {l.name} ({l.unit})
                      </span>
                      <span>{money(l.lineTotal)}</span>
                    </li>
                  ))}
                </ul>
                {o.notes && (
                  <p className="text-sm bg-amber-50 rounded-lg p-2 text-amber-900 mb-2">
                    {o.notes}
                  </p>
                )}
                <p className="text-right font-bold text-stone-800">
                  {money(o.total)}
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <h2 className="text-2xl font-bold text-stone-800 mb-4">Bakery admin</h2>
      {children}
    </div>
  );
}
