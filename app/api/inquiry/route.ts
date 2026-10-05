import { NextResponse } from "next/server";
import { client as readClient, writeClient } from "@/lib/sanity/client";

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (clip(body.company, 100)) return NextResponse.json({ ok: true });

  // The guest's browser already checked the code live (see /api/promo), but that is
  // only a UX convenience — re-check here before trusting it. If it has gone stale
  // (disabled, expired) between typing and submitting, drop it silently rather than
  // fail the whole booking request over a promo code.
  const promoCodeRaw = clip(body.promoCode, 40).toUpperCase();
  let promo: { _id: string; discountType?: string; value?: number; currency?: string; perkDescription?: string; reason?: string; source?: string } | null = null;
  if (promoCodeRaw) {
    try {
      const found = await readClient.fetch<typeof promo | null>(
        `*[_type == "promoCode" && upper(code) == $code][0]{ _id, discountType, value, currency, perkDescription, reason, source, status, expiresAt }`,
        { code: promoCodeRaw },
        { cache: "no-store" }
      );
      const today = new Date().toISOString().slice(0, 10);
      const f = found as (typeof promo & { status?: string; expiresAt?: string }) | null;
      if (f && f.status === "active" && (!f.expiresAt || f.expiresAt >= today)) promo = f;
    } catch (error) {
      console.error("Promo code lookup failed (booking request still proceeds):", error);
    }
  }

  const doc = {
    _type: "inquiry",
    status: "new",
    name: clip(body.name, 100),
    phone: clip(body.phone, 30),
    email: clip(body.email, 120),
    checkIn: clip(body.checkIn, 10),
    checkOut: clip(body.checkOut, 10),
    guests: Math.min(Math.max(parseInt(String(body.guests), 10) || 0, 0), 50),
    cabin: clip(body.cabin, 120),
    plan: clip(body.plan, 120),
    message: clip(body.message, 1500),
    language: body.language === "ar" ? "ar" : "en",
    submittedAt: new Date().toISOString(),
    ...(promo && {
      promoCode: promoCodeRaw,
      promoDiscountType: promo.discountType || "percentage",
      promoValue: promo.value ?? undefined,
      promoCurrency: promo.currency ?? undefined,
      promoPerkDescription: promo.perkDescription ?? undefined,
      promoReason: promo.reason ?? undefined,
      promoSource: promo.source ?? undefined,
    }),
  };

  if (!doc.name || !doc.phone || !doc.guests || !isDate(doc.checkIn) || !isDate(doc.checkOut)) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (doc.checkOut <= doc.checkIn) {
    return NextResponse.json({ error: "invalid_dates" }, { status: 400 });
  }

  const client = writeClient();
  if (!client) {
    console.error("SANITY_API_WRITE_TOKEN is not set, so the booking request could not be saved.");
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  try {
    await client.create(doc);
  } catch (error) {
    console.error("Saving the booking request failed:", error);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  if (promo) {
    // Just a usage counter for the admin to see in the Studio — the code itself
    // stays active until disabled by hand, so this is never allowed to fail the booking.
    client.patch(promo._id).setIfMissing({ timesUsed: 0 }).inc({ timesUsed: 1 }).commit().catch((error) => {
      console.error("Could not update the promo code's usage counter:", error);
    });
  }

  return NextResponse.json({ ok: true });
}
