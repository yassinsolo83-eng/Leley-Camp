import { NextResponse } from "next/server";
import { createLoginToken } from "@/lib/auth";
import { sendLoginEmail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Starts a sign-in: emails a 15-minute magic link to the address the guest typed.
// No account/password is created here — the customer record only gets made (or
// matched) once that link is actually clicked, in /api/auth/verify.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 150) : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  const lang = body.lang === "ar" ? "ar" : "en";

  let token: string;
  try {
    token = createLoginToken(email);
  } catch (error) {
    console.error("Could not create a login token:", error);
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const origin = new URL(request.url).origin;
  const link = `${origin}/api/auth/verify?token=${encodeURIComponent(token)}&lang=${lang}`;

  const sent = await sendLoginEmail(email, link, lang);
  if (!sent) return NextResponse.json({ error: "send_failed" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
