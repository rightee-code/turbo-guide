import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getProduct } from "@/data/products";
import { Order, OrderLine } from "@/types";
import {
  checkDeliveryDate,
  DELIVERY_MINIMUM,
  DELIVERY_WINDOWS,
} from "@/lib/schedule";

// Orders are kept in a JSON file. Fine for a single server; swap for a
// database before running on serverless hosting where the disk is ephemeral.
const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

export async function listOrders(): Promise<Order[]> {
  try {
    return JSON.parse(await fs.readFile(ORDERS_FILE, "utf8"));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

// Serialize writes so concurrent orders don't clobber each other.
let writeQueue: Promise<unknown> = Promise.resolve();

export function saveOrder(order: Order) {
  const next = writeQueue.then(async () => {
    const orders = await listOrders();
    orders.push(order);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
  });
  writeQueue = next.catch(() => {});
  return next;
}

const str = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/**
 * Validates an order submission. Prices come from the catalog, never from
 * the client.
 */
export function buildOrder(
  body: Record<string, unknown>
): { order: Order } | { errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const businessName = str(body.businessName, 120);
  const contactName = str(body.contactName, 120);
  const email = str(body.email, 200);
  const phone = str(body.phone, 40);
  const fulfillment = body.fulfillment === "pickup" ? "pickup" : "delivery";
  const address = str(body.address);
  const deliveryDate = str(body.deliveryDate, 10);
  const deliveryWindow = str(body.deliveryWindow, 40);
  const poNumber = str(body.poNumber, 60);
  const notes = str(body.notes, 1000);

  if (!businessName) errors.businessName = "Business name is required";
  if (!contactName) errors.contactName = "Contact name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Valid email is required";
  if (!phone) errors.phone = "Phone number is required";
  if (fulfillment === "delivery" && !address)
    errors.address = "Delivery address is required";
  const dateError = checkDeliveryDate(deliveryDate);
  if (dateError) errors.deliveryDate = dateError;
  if (!DELIVERY_WINDOWS.includes(deliveryWindow))
    errors.deliveryWindow = "Choose a delivery window";

  const lines: OrderLine[] = [];
  const rawItems = Array.isArray(body.items) ? body.items : [];
  for (const raw of rawItems) {
    const product = getProduct(str(raw?.productId, 60));
    const quantity = Number(raw?.quantity);
    if (!product || !product.available) {
      errors.items = "Your order contains a product that is no longer available";
      continue;
    }
    if (!Number.isInteger(quantity) || quantity < product.minQty || quantity > 10000) {
      errors.items = `${product.name} has a minimum of ${product.minQty} per order`;
      continue;
    }
    if (lines.some((l) => l.productId === product.id)) continue;
    lines.push({
      productId: product.id,
      name: product.name,
      unit: product.unit,
      price: product.price,
      quantity,
      lineTotal: Math.round(product.price * quantity * 100) / 100,
    });
  }
  if (!lines.length && !errors.items) errors.items = "Your order is empty";

  const total =
    Math.round(lines.reduce((sum, l) => sum + l.lineTotal, 0) * 100) / 100;
  if (fulfillment === "delivery" && lines.length && total < DELIVERY_MINIMUM)
    errors.items = `Delivery orders have a $${DELIVERY_MINIMUM} minimum`;

  if (Object.keys(errors).length) return { errors };

  return {
    order: {
      id: randomUUID().slice(0, 8).toUpperCase(),
      businessName,
      contactName,
      email,
      phone,
      fulfillment,
      address: fulfillment === "delivery" ? address : "",
      deliveryDate,
      deliveryWindow,
      poNumber,
      notes,
      lines,
      total,
      createdAt: new Date().toISOString(),
    },
  };
}
