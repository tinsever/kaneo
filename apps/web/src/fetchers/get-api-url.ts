import { resolveApiBaseUrl } from "@kaneo/libs";

export function getApiUrl(path: string) {
  const trimmedBase = resolveApiBaseUrl(import.meta.env.VITE_API_URL).replace(
    /\/+$/,
    "",
  );
  const apiUrl = trimmedBase.endsWith("/api")
    ? trimmedBase
    : `${trimmedBase}/api`;
  const normalizedPath = `/${path.replace(/^\/+/, "")}`;

  return `${apiUrl}${normalizedPath}`;
}
