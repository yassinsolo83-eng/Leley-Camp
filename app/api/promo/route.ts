import { NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";

type PromoDoc = {
  discountType?: string;
  value?: number;
  currency?: string;
  perkDescription?: string;
  status?: string;
  expiresAt?: string;
};

// Guests use this to check a code as they type it. Only the discount itself is
// ever returned — "reason" and "source" are for the admin only (see /api/inquiry
// and the Studio), so they are left out of this query entirely.
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("code") || "";
  const code = raw.trim().toUpperCase().slice(0, 40);
  if (!code) return NextResponse.json({ valid: false, reason: "empty" });

  let doc: PromoDoc | null = null;
  try {
    doc = await client.fetch<PromoDoc | null>(
      `*[_type == "promoCode" && upper(code) == $code][0]{ discountType, value, currency, perkDescription, status, expiresAt }`,
      { code },
      { cache: "no-store" }
    );
  } catch (error) {
    console.error("Promo code lookup failed:", error);
    return NextResponse.json({ valid: false, reason: "lookup_failed" }, { status: 500 });
  }

  if (!doc) return NextResponse.json({ valid: false, reason: "not_found" });
  if (doc.status !== "active") return NextResponse.json({ valid: false, reason: "inactive" });
  if (doc.expiresAt && doc.expiresAt < new Date().toISOString().slice(0, 10)) {
    return NextResponse.json({ valid: false, reason: "expired" });
  }

  return NextResponse.json({
    valid: true,
    discountType: doc.discountType || "percentage",
    value: doc.value ?? null,
    currency: doc.currency ?? null,
    perkDescription: doc.perkDescription ?? null,
  });
}
