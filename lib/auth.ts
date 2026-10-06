import crypto from "crypto";

// Two kinds of signed, stateless tokens — nothing is stored in Sanity for either one,
// so there's no extra document type or write just to handle login.
//
// 1. A "login token" is emailed as a magic link. It's short-lived (15 minutes) and only
//    proves the click came from that inbox.
// 2. A "session token" lives in a cookie once someone's signed in. It's long-lived
//    (180 days) and carries which customer record this browser belongs to.
//
// Both are just base64url(JSON payload) + an HMAC signature, so they can't be forged
// or edited without the server's secret.

const SESSION_COOKIE = "leley_session";
const LOGIN_TOKEN_TTL_MS = 15 * 60 * 1000;
const SESSION_TTL_MS = 180 * 24 * 60 * 60 * 1000;

function encode(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}

function decode<T>(str: string): T {
  return JSON.parse(Buffer.from(str, "base64url").toString("utf8"));
}

function getSecret(name: "AUTH_LOGIN_SECRET" | "AUTH_SESSION_SECRET"): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set — add it in the project's environment variables.`);
  return value;
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function signedToken(payload: object, secret: string): string {
  const encoded = encode(payload);
  return `${encoded}.${sign(encoded, secret)}`;
}

function verifySignedToken<T>(token: string, secret: string): T | null {
  const [encoded, sig] = (token || "").split(".");
  if (!encoded || !sig) return null;
  if (!safeEqual(sign(encoded, secret), sig)) return null;
  try {
    return decode<T>(encoded);
  } catch {
    return null;
  }
}

export function createLoginToken(email: string): string {
  return signedToken({ email, exp: Date.now() + LOGIN_TOKEN_TTL_MS }, getSecret("AUTH_LOGIN_SECRET"));
}

export function verifyLoginToken(token: string): { email: string } | null {
  const data = verifySignedToken<{ email: string; exp: number }>(token, getSecret("AUTH_LOGIN_SECRET"));
  if (!data || Date.now() > data.exp) return null;
  return { email: data.email };
}

export type Session = { email: string; customerId: string };

export function createSessionToken(session: Session): string {
  return signedToken({ ...session, exp: Date.now() + SESSION_TTL_MS }, getSecret("AUTH_SESSION_SECRET"));
}

export function verifySessionToken(token: string): Session | null {
  const data = verifySignedToken<Session & { exp: number }>(token, getSecret("AUTH_SESSION_SECRET"));
  if (!data || Date.now() > data.exp) return null;
  return { email: data.email, customerId: data.customerId };
}

/** Reads and verifies the session cookie straight from a Request's headers (Route Handlers only). */
export function sessionFromRequest(request: Request): Session | null {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;
  try {
    return verifySessionToken(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
