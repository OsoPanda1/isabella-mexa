import type { Request, Response, NextFunction } from "express";
import { createHmac, timingSafeEqual } from "node:crypto";

export type IsabellaRole = "viewer" | "citizen" | "operator" | "admin" | "system";
export interface AuthenticatedPrincipal {
  sub: string;
  tenantId: string;
  roles: IsabellaRole[];
  plan?: string;
  scopes: string[];
  exp?: number;
  iss?: string;
}

declare global {
  namespace Express {
    interface Request {
      principal?: AuthenticatedPrincipal;
    }
  }
}

const roleRank: Record<IsabellaRole, number> = { viewer: 0, citizen: 1, operator: 2, admin: 3, system: 4 };

function base64UrlDecode(input: string): Buffer {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "="), "base64");
}

function safeJson<T>(buf: Buffer): T | null {
  try { return JSON.parse(buf.toString("utf8")) as T; } catch { return null; }
}

export function verifyHs256Jwt(token: string, secret: string): AuthenticatedPrincipal | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = safeJson<{ alg?: string; typ?: string }>(base64UrlDecode(encodedHeader));
  if (header?.alg !== "HS256") return null;
  const expected = createHmac("sha256", secret).update(`${encodedHeader}.${encodedPayload}`).digest();
  const actual = base64UrlDecode(encodedSignature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  const payload = safeJson<any>(base64UrlDecode(encodedPayload));
  if (!payload?.sub || typeof payload.sub !== "string") return null;
  if (payload.exp && Number(payload.exp) * 1000 <= Date.now()) return null;
  const roles = Array.isArray(payload.roles) ? payload.roles : [payload.role || "citizen"];
  return {
    sub: payload.sub,
    tenantId: String(payload.tenantId || payload.tid || "nodo-cero-rdm"),
    roles: roles.filter((r: string) => r in roleRank),
    plan: typeof payload.plan === "string" ? payload.plan : undefined,
    scopes: Array.isArray(payload.scopes) ? payload.scopes.map(String) : [],
    exp: payload.exp,
    iss: payload.iss,
  };
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.ISABELLA_AUTH_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    return res.status(503).json({ ok: false, error: "Authentication authority is not configured." });
  }
  const auth = String(req.headers.authorization || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (token && secret) {
    const principal = verifyHs256Jwt(token, secret);
    if (!principal) return res.status(401).json({ ok: false, error: "Invalid or expired authentication token." });
    req.principal = principal;
    return next();
  }
  if (process.env.NODE_ENV !== "production" && process.env.ALLOW_DEV_AUTH_FALLBACK !== "false") {
    req.principal = { sub: "dev-local", tenantId: "nodo-cero-rdm", roles: ["admin"], scopes: ["*"] };
    return next();
  }
  return res.status(401).json({ ok: false, error: "Authentication required." });
}

export function requireRole(minRole: IsabellaRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    const roles = req.principal?.roles || [];
    const allowed = roles.some((r) => roleRank[r] >= roleRank[minRole]);
    if (!allowed) return res.status(403).json({ ok: false, error: "Insufficient privileges for this action." });
    return next();
  };
}

export function requireScope(scope: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const scopes = req.principal?.scopes || [];
    if (!scopes.includes("*") && !scopes.includes(scope)) {
      return res.status(403).json({ ok: false, error: `Missing required scope: ${scope}` });
    }
    return next();
  };
}

export function currentPrincipal(req: Request): AuthenticatedPrincipal {
  return req.principal || { sub: "anonymous", tenantId: "public", roles: ["viewer"], scopes: [] };
}
