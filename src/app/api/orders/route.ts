import { NextRequest, NextResponse } from "next/server";
import { buildOrder, saveOrder } from "@/lib/orders";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = buildOrder(body as Record<string, unknown>);
  if ("errors" in result) {
    return NextResponse.json(
      { error: "Please fix the highlighted fields", fields: result.errors },
      { status: 400 }
    );
  }

  await saveOrder(result.order);
  return NextResponse.json({ orderId: result.order.id }, { status: 201 });
}
