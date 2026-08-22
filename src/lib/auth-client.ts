const TOKEN_KEY = "isabella_jwt_token";
const TOKEN_EXPIRY_KEY = "isabella_jwt_expiry";

let cachedToken: string | null = null;

function isTokenValid(token: string | null, expiry: string | null): boolean {
  if (!token) return false;
  if (!expiry) return false;
  try {
    return Date.now() < Number(expiry);
  } catch {
    return false;
  }
}

export function getStoredToken(): string | null {
  if (cachedToken) return cachedToken;
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (isTokenValid(token, expiry)) {
      cachedToken = token;
      return token;
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch { /* ignore */ }
  return null;
}

export function storeToken(token: string): void {
  cachedToken = token;
  try {
    localStorage.setItem(TOKEN_KEY, token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    localStorage.setItem(TOKEN_EXPIRY_KEY, String((payload.exp || 0) * 1000));
  } catch { /* ignore */ }
}

export function clearToken(): void {
  cachedToken = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch { /* ignore */ }
}

export async function ensureAuthToken(): Promise<string | null> {
  const existing = getStoredToken();
  if (existing) return existing;

  try {
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle: "nodo-cero", password: "isabella-dev-2026" }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        storeToken(data.token);
        return data.token;
      }
    }
  } catch { /* ignore */ }
  return null;
}

export function authHeaders(): Record<string, string> {
  const token = getStoredToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function authFetch(url: string, init?: RequestInit): Promise<Response> {
  let token = getStoredToken();
  if (!token) token = await ensureAuthToken();

  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...init, headers });

  if (res.status === 401) {
    clearToken();
    const newToken = await ensureAuthToken();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      return fetch(url, { ...init, headers });
    }
  }

  return res;
}
