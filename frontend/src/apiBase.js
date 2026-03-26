function trimBase(url) {
  if (typeof url !== "string") return "";
  return url.trim().replace(/\/$/, "");
}

/**
 * API origin for browser calls. All values come from root `.env` (Vite `VITE_*`).
 *
 * - Opening the app on `localhost` / `127.0.0.1` → always `VITE_LOCAL_API_URL` (no remote API).
 * - Any other host → `VITE_API_BASE_URL` if set, else `VITE_PRODUCTION_API_URL`.
 */
export function resolveApiBaseUrl() {
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  if (isLocalhost) {
    return trimBase(import.meta.env.VITE_LOCAL_API_URL);
  }

  const override = trimBase(import.meta.env.VITE_API_BASE_URL);
  if (override) return override;

  return trimBase(import.meta.env.VITE_PRODUCTION_API_URL);
}
