import { NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/client";

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
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Saving the booking request failed:", error);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
