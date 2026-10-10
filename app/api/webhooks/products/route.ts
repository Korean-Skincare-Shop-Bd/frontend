import { revalidatePath, revalidateTag } from "next/cache";
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
    const { action, productId, slug } = body as { action?: unknown; productId?: unknown; slug?: unknown };
    if (
      typeof action !== "string" || !ACTIONS.has(action) ||
      (productId !== undefined && (typeof productId !== "string" || !PRODUCT_ID.test(productId))) ||
      (slug !== undefined && (typeof slug !== "string" || !PRODUCT_ID.test(slug)))
    ) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }
    revalidatePath("/sitemap.xml");
    revalidatePath("/products");
    revalidateTag("products-list");
    if (typeof slug === "string") {
      // Targeted purge: only the changed product page is re-rendered/re-written.
      revalidateTag(`product:${slug}`);
      revalidatePath(`/products/${slug}`);
    } else {
      // Backend did not send a slug: fall back to purging every product page.
      // Have the backend include `slug` in the payload to avoid this.
      revalidatePath("/products/[slug]", "page");
      if (productId) revalidatePath(`/products/${productId}`);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }
}
