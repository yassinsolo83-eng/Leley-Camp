import { NextResponse } from "next/server";
import { client as readClient } from "@/lib/sanity/client";

// Silent "welcome back" recognition for a device that has booked before — matched
// by a random token stored in the browser's localStorage, never by anything that
// could identify the device itself. Returns just enough to prefill the form.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ found: false });
  }

  const token = typeof body.deviceToken === "string" ? body.deviceToken.trim().slice(0, 100) : "";
  if (!token) return NextResponse.json({ found: false });

  try {
    const customer = await readClient.fetch<{ name?: string; phone?: string; email?: string } | null>(
      `*[_type == "customer" && $deviceToken in deviceTokens][0]{ name, phone, email }`,
      { deviceToken: token },
      { cache: "no-store" }
    );
    if (!customer) return NextResponse.json({ found: false });
    return NextResponse.json({ found: true, name: customer.name || "", phone: customer.phone || "", email: customer.email || "" });
  } catch (error) {
    console.error("Device recognition lookup failed:", error);
    return NextResponse.json({ found: false });
  }
}
