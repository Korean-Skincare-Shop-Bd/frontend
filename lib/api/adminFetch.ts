const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const LEGACY_ADMIN_STORAGE_KEYS = [
  "admin_token",
  "admin_data",
  "admin_token_timestamp",
  "authed",
];

export const clearLegacyAdminStorage = () => {
  if (typeof window === "undefined") return;

  LEGACY_ADMIN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

export class AdminUnauthorizedError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "AdminUnauthorizedError";
  }
}

const buildAdminUrl = (path: string) => {
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

export const adminFetch = async (
  path: string,
  init: RequestInit = {}
): Promise<Response> => {
  const response = await fetch(buildAdminUrl(path), {
    ...init,
    credentials: "include",
    headers: init.headers,
  });

  if (response.status === 401) {
    clearLegacyAdminStorage();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin:unauthorized"));
    }
  }

  return response;
};

export const parseErrorMessage = async (
  response: Response,
  fallback: string
) => {
  const error = await response.json().catch(() => null);
  return error?.message || error?.error || fallback;
};
