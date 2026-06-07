import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { customerName, email, phone, pickupDate, pickupTime, notes, items, total } = body;

  if (!customerName || !email || !phone || !pickupDate || !items?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const order = {
    id: randomUUID().slice(0, 8).toUpperCase(),
    customerName,
    email,
    phone,
    pickupDate,
    pickupTime,
    notes,
    items,
    total,
    createdAt: new Date().toISOString(),
  };

  // In production this would persist to a database.
  console.log("New order:", JSON.stringify(order, null, 2));

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
