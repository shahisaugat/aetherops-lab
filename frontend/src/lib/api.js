const API_BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "" : "https://aetherops.duckdns.org");

export const getApiModeLabel = () =>
  API_BASE ? "Custom API URL" : "Vite proxy";

export const fetchJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error ?? "Request failed");
  }

  return payload;
};

export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export { API_BASE };
