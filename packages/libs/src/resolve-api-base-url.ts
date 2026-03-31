/**
 * Resolves the API base URL from VITE_API_URL, fixing a common misconfiguration
 * where the API host is set to `api.<current-web-host>` (e.g. api.tenant.example.com)
 * while the app is already on a tenant subdomain (tenant.example.com), producing
 * a broken nested host (api.tenant...). In that case we use api.<parent-domain>.
 */
export function resolveApiBaseUrl(raw: string | undefined): string {
  const trimmed = (raw ?? "").trim();
  const fallback = trimmed || "http://localhost:1337";

  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const pageHost = window.location.hostname;
    const url = new URL(toAbsoluteUrl(fallback));
    const apiHost = normalizeApiHostAgainstPage(url.hostname, pageHost);
    if (apiHost !== url.hostname) {
      url.hostname = apiHost;
    }
    return url.toString().replace(/\/+$/, "");
  } catch {
    return fallback;
  }
}

function normalizeApiHostAgainstPage(
  apiHost: string,
  pageHost: string,
): string {
  const pageLabels = pageHost.split(".");
  if (apiHost === `api.${pageHost}` && pageLabels.length >= 3) {
    return `api.${pageLabels.slice(1).join(".")}`;
  }
  return apiHost;
}

function toAbsoluteUrl(value: string): string {
  if (value.includes("://")) {
    return value;
  }
  const isLocal =
    value.startsWith("localhost") || value.startsWith("127.0.0.1");
  return `${isLocal ? "http" : "https"}://${value}`;
}
