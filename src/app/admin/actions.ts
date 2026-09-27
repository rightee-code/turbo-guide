"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminToken, passwordMatches } from "@/lib/admin-auth";

export async function login(_prev: string, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) return "Incorrect password";
  // Only mark the cookie Secure over HTTPS, or browsers drop it when the app
  // is opened over plain HTTP on a local network (e.g. a home Docker host).
  const proto = (await headers()).get("x-forwarded-proto")?.split(",")[0];
  (await cookies()).set(ADMIN_COOKIE, adminToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: proto === "https",
    maxAge: 60 * 60 * 24 * 30,
    path: "/admin",
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin");
}
