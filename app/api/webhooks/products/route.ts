import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const ACTIONS = new Set(["created", "updated", "deleted"]);
const PRODUCT_ID = /^[A-Za-z0-9_-]{1,128}$/;

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook unavailable" }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${webhookSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    const { action, productId } = body as { action?: unknown; productId?: unknown };
    if (typeof action !== "string" || !ACTIONS.has(action) || (productId !== undefined && (typeof productId !== "string" || !PRODUCT_ID.test(productId)))) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }
    revalidatePath("/sitemap.xml");
    revalidatePath("/products");
    if (productId && action !== "deleted") revalidatePath(`/products/${productId}`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }
}
