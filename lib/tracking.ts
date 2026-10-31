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

// Customer details for Meta Advanced Matching / GA4 Enhanced Conversions.
// Raw values: the GTM tags hash them before sending.
export type TrackUser = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
};

// Bangladesh numbers -> E.164 digits (8801XXXXXXXXX), as Meta expects.
function formatPhone(value?: string): string | undefined {
  if (!value) return undefined;
  let d = value.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("8800")) d = `880${d.slice(4)}`;
  else if (d.startsWith("01")) d = `88${d}`;
  else if (d.startsWith("1") && d.length === 10) d = `880${d}`;
  return d.length >= 7 ? `+${d}` : undefined;
}

const compact = <T extends Record<string, unknown>>(obj: T) => {
  const entries = Object.entries(obj).filter(([, v]) => v !== undefined && v !== "");
  return entries.length ? Object.fromEntries(entries) : undefined;
};

// GA4 Enhanced Conversions layout: email / phone_number at the top level and
// the name + postal details nested under `address`.
function buildUserData(user?: TrackUser) {
  if (!user) return undefined;
  const address = compact({
    first_name: user.firstName?.trim(),
    last_name: user.lastName?.trim(),
    street: user.street?.trim(),
    city: user.city?.trim(),
    region: user.region?.trim(),
    postal_code: user.postalCode?.trim(),
    country: user.country?.trim().toUpperCase(),
  });
  return compact({
    email: user.email?.trim().toLowerCase(),
    phone_number: formatPhone(user.phone),
    address,
  });
}

type TrackArgs = {
  event: "page_view" | "view_item" | "add_to_cart" | "begin_checkout" | "purchase" | "search";
  // Shared with the server CAPI call so Meta de-duplicates browser + server.
  eventId: string;
  value?: number;
  shipping?: number;
  items?: TrackItem[];
  transactionId?: string;
  searchTerm?: string;
  user?: TrackUser;
};

export function track({ event, eventId, value, shipping, items, transactionId, searchTerm, user }: TrackArgs) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];

  const hasItems = !!items?.length;
  const userData = buildUserData(user);
  w.dataLayer.push({ ecommerce: null }); // clear the previous ecommerce object
  w.dataLayer.push({
    event,
    event_id: eventId,
    ...(userData ? { user_data: userData } : {}),
    ...(searchTerm ? { search_term: searchTerm } : {}),
    ...(hasItems || value !== undefined
      ? {
          ecommerce: {
            currency: "BDT",
            ...(value !== undefined ? { value } : {}),
            ...(transactionId ? { transaction_id: transactionId } : {}),
            ...(shipping !== undefined ? { shipping } : {}),
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
