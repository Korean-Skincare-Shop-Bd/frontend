"use client";
import { getExternalId, getRememberedContact, type Contact } from "./identity";
type TrackArgs = { eventName: string; eventId: string; customData?: Record<string, unknown>; customerData?: Contact & Record<string, unknown> };
export async function sendCapiEvent({ eventName, eventId, customData = {}, customerData = {} }: TrackArgs) {
  try { const response = await fetch("/api/fb-conversion", { method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true, body: JSON.stringify({ eventName, eventId, eventTime: Math.floor(Date.now() / 1000), eventSourceUrl: window.location.href, customData, customerData: { ...getRememberedContact(), ...customerData, externalId: getExternalId() } }) }); if (!response.ok) console.error("[CAPI] failed", eventName, await response.text()); } catch (error) { console.error("[CAPI] network error", eventName, error); }
}
