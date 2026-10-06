import { NextResponse } from "next/server";
import { client as readClient } from "@/lib/sanity/client";

// Deliberately limited: given a phone number, returns only the name on file (if any) —
// never booking history, tier or anything else — so a different person typing in a
// familiar number on a shared device can't see anything private about its owner.
export async function GET(request: Request) {
  const phone = new URL(request.url).searchParams.get("phone")?.trim().slice(0, 30) || "";
  if (!phone) return NextResponse.json({ found: false });

  try {
    const customer = await readClient.fetch<{ name?: string } | null>(
      `*[_type == "customer" && phone == $phone][0]{ name }`,
      { phone },
      { cache: "no-store" }
    );
    if (!customer?.name) return NextResponse.json({ found: false });
    return NextResponse.json({ found: true, name: customer.name });
  } catch (error) {
    console.error("Customer name lookup failed:", error);
    return NextResponse.json({ found: false });
  }
}
