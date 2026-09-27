// Ordering rules shared by the browser and the server.

/** Days of notice required between ordering and delivery. */
export const LEAD_DAYS = 2;

/** Minimum order value for delivery, in dollars. Pickup has no minimum. */
export const DELIVERY_MINIMUM = 100;

/** Days of the week we do not bake (0 = Sunday). */
export const CLOSED_DAYS = [0];

export const DELIVERY_WINDOWS = [
  "Early (5–7 AM)",
  "Morning (7–9 AM)",
  "Late morning (9–11 AM)",
];

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Earliest date an order placed now can be delivered, as YYYY-MM-DD. */
export function earliestDeliveryDate(now = new Date()) {
  const d = new Date(now);
  d.setDate(d.getDate() + LEAD_DAYS);
  while (CLOSED_DAYS.includes(d.getDay())) d.setDate(d.getDate() + 1);
  return toISODate(d);
}

/** Returns an error message, or null if the date is a valid delivery date. */
export function checkDeliveryDate(date: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "Delivery date is required";
  const [y, m, d] = date.split("-").map(Number);
  const parsed = new Date(y, m - 1, d);
  if (parsed.getDate() !== d) return "Invalid date";
  if (CLOSED_DAYS.includes(parsed.getDay()))
    return "We don't bake on Sundays — pick another day";
  if (date < earliestDeliveryDate(now))
    return `Orders need ${LEAD_DAYS} days' notice`;
  return null;
}

export function formatDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export const money = (n: number) => `£${n.toFixed(2)}`;
