"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [error, action, pending] = useActionState(login, "");

  return (
    <form action={action} className="space-y-3">
      <input
        type="password"
        name="password"
        placeholder="Admin password"
        autoFocus
        required
        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        disabled={pending}
        className="w-full bg-amber-700 hover:bg-amber-600 disabled:bg-amber-300 text-white py-2.5 rounded-xl font-semibold transition-colors"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
