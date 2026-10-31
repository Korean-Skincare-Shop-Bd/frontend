"use client";

// Single entry point for analytics. The site only pushes to window.dataLayer;
// every GA4 and Meta Pixel tag lives in the GTM container. Never call fbq() or
// gtag() directly, or events are counted twice.

export type TrackItem = {
  item_id: string;
  item_name?: string;
  price?: number;
  quantity?: number;
};

type TrackArgs = {
  event: "page_view" | "view_item" | "add_to_cart" | "begin_checkout" | "purchase" | "search";
  // Shared with the server CAPI call so Meta de-duplicates browser + server.
  eventId: string;
  value?: number;
  items?: TrackItem[];
  transactionId?: string;
  searchTerm?: string;
};

export function track({ event, eventId, value, items, transactionId, searchTerm }: TrackArgs) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];

  const hasItems = !!items?.length;
  w.dataLayer.push({ ecommerce: null }); // clear the previous ecommerce object
  w.dataLayer.push({
    event,
    event_id: eventId,
    ...(searchTerm ? { search_term: searchTerm } : {}),
    ...(hasItems || value !== undefined
      ? {
          ecommerce: {
            currency: "BDT",
            ...(value !== undefined ? { value } : {}),
            ...(transactionId ? { transaction_id: transactionId } : {}),
            ...(hasItems ? { items } : {}),
          },
          // Meta-shaped parameters so the GTM Meta tags can map them 1:1.
          meta: {
            currency: "BDT",
            ...(value !== undefined ? { value } : {}),
            ...(hasItems
              ? {
                  content_type: "product",
                  content_ids: items!.map((i) => i.item_id),
                  contents: items!.map((i) => ({ id: i.item_id, quantity: i.quantity ?? 1 })),
                  num_items: items!.reduce((n, i) => n + (i.quantity ?? 1), 0),
                }
              : {}),
            ...(transactionId ? { order_id: transactionId } : {}),
          },
        }
      : {}),
  });
}
