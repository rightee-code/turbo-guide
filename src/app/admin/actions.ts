"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminToken, passwordMatches } from "@/lib/admin-auth";

export async function login(_prev: string, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) return "Incorrect password";
  (await cookies()).set(ADMIN_COOKIE, adminToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/admin",
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin");
}
