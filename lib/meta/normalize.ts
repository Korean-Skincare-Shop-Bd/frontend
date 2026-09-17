import crypto from "crypto";

const sha256 = (value: string) => crypto.createHash("sha256").update(value).digest("hex");
const hashIfPresent = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? sha256(trimmed) : undefined;
};
export const normalizeEmail = (value?: string | null) => hashIfPresent(value?.toLowerCase());
export const normalizePhone = (value?: string | null) => {
  if (!value) return undefined;
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("01")) digits = `88${digits}`;
  else if (digits.startsWith("1") && digits.length === 10) digits = `880${digits}`;
  return hashIfPresent(digits);
};
export const normalizeName = (value?: string | null) => hashIfPresent(value?.toLowerCase().replace(/[^a-z\u0980-\u09ff ]/g, "").trim());
export const normalizeCountry = (value = "BD") => hashIfPresent(value.toLowerCase().slice(0, 2));
export const normalizeCity = (value?: string | null) => hashIfPresent(value?.toLowerCase().replace(/[^a-z]/g, ""));
export const normalizeZip = (value?: string | null) => hashIfPresent(value?.toLowerCase().replace(/[^a-z0-9]/g, ""));
export const normalizeExternalId = (value?: string | null) => hashIfPresent(value);
export const firstIp = (value?: string | null) => value?.split(",")[0]?.trim() || undefined;
export const compact = <T extends Record<string, unknown>>(value: T) => Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== null && item !== "" && !(Array.isArray(item) && item.length === 0)));
