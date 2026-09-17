"use client";
const EXTERNAL_ID_KEY = "ks_external_id";
const CONTACT_KEY = "ks_fb_contact";
export type Contact = { email?: string; phone?: string; firstName?: string; lastName?: string };
const readCookie = (name: string) => document.cookie.match(new RegExp(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`))?.[2];
export function getExternalId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try { let id = localStorage.getItem(EXTERNAL_ID_KEY); if (!id) { id = crypto.randomUUID(); localStorage.setItem(EXTERNAL_ID_KEY, id); } document.cookie = `${EXTERNAL_ID_KEY}=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`; return id; } catch { return undefined; }
}
export function rememberContact(contact: Contact) { try { localStorage.setItem(CONTACT_KEY, JSON.stringify(contact)); } catch {} }
export function getRememberedContact(): Contact { try { return JSON.parse(localStorage.getItem(CONTACT_KEY) || "{}"); } catch { return {}; } }
export function getMetaIdentifiers() {
  if (typeof window === "undefined") return {};
  return { metaFbc: readCookie("_fbc") ? decodeURIComponent(readCookie("_fbc")!) : undefined, metaFbp: readCookie("_fbp") ? decodeURIComponent(readCookie("_fbp")!) : undefined, metaExternalId: getExternalId() };
}
