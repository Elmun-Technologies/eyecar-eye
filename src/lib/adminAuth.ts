/**
 * Admin panel autentifikatsiyasi (faqat serverda ishlaydi).
 *
 * Parol ADMIN_PASSWORD muhit o'zgaruvchisida turadi (Vercel dashboard →
 * Settings → Environment Variables). Sessiya — paroldan hosil qilingan
 * HMAC token, httpOnly cookie'da saqlanadi. Parol o'rnatilmagan bo'lsa,
 * kirish butunlay yopiq (standart parol yo'q).
 */
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "smile-admin";
const SESSION_HOURS = 12;

function adminPassword(): string | null {
  const pwd = process.env.ADMIN_PASSWORD;
  return pwd && pwd.length >= 8 ? pwd : null;
}

export function authConfigured(): boolean {
  return adminPassword() !== null;
}

function sessionToken(): string | null {
  const pwd = adminPassword();
  if (!pwd) return null;
  return createHmac("sha256", pwd).update("smile-admin-session-v1").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHmac("sha256", "cmp").update(a).digest();
  const hb = createHmac("sha256", "cmp").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(candidate: string): boolean {
  const pwd = adminPassword();
  return pwd !== null && safeEqual(candidate, pwd);
}

export function sessionCookie(): string {
  const token = sessionToken();
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_HOURS * 3600}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

/** So'rovdagi cookie orqali sessiyani tekshiradi */
export function isAuthed(req: Request): boolean {
  const expected = sessionToken();
  if (!expected) return false;
  const header = req.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === COOKIE_NAME) {
      return safeEqual(rest.join("="), expected);
    }
  }
  return false;
}
