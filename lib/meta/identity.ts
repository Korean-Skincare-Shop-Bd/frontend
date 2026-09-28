"use client";
import { readCookie } from "./cookies";

const EXTERNAL_ID_KEY = "ks_external_id";
const CONTACT_KEY = "ks_fb_contact";
export type Contact = { email?: string; phone?: string; firstName?: string; lastName?: string };

// crypto.randomUUID() is unavailable in non-secure contexts and on Safari
// below 15.4; fall back to a manual UUID v4 instead of losing external_id.
function randomId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // fall through
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getExternalId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try { let id = localStorage.getItem(EXTERNAL_ID_KEY); if (!id) { id = randomId(); localStorage.setItem(EXTERNAL_ID_KEY, id); } document.cookie = `${EXTERNAL_ID_KEY}=${id}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`; return id; } catch { return undefined; }
}
export function rememberContact(contact: Contact) { try { localStorage.setItem(CONTACT_KEY, JSON.stringify(contact)); } catch {} }
export function getRememberedContact(): Contact { try { return JSON.parse(localStorage.getItem(CONTACT_KEY) || "{}"); } catch { return {}; } }
export function getMetaIdentifiers() {
  if (typeof window === "undefined") return {};
  return { metaFbc: readCookie("_fbc"), metaFbp: readCookie("_fbp"), metaExternalId: getExternalId() };
}
