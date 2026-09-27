import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "bakery_admin";

/** Cookie value derived from the password, so the password itself isn't stored. */
export function adminToken(password: string) {
  return createHash("sha256").update(`bakery-admin:${password}`).digest("hex");
}

export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(adminToken(input));
  const b = Buffer.from(adminToken(expected));
  return timingSafeEqual(a, b);
}

export async function isAdmin() {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value ?? "";
  const a = Buffer.from(token);
  const b = Buffer.from(adminToken(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}
