import { NextResponse } from "next/server";
import { sessionFromRequest } from "@/lib/auth";
import { client as readClient } from "@/lib/sanity/client";
import { ACTIVE_STATUSES } from "@/lib/booking";

type CustomerDoc = { name?: string; phone?: string; email?: string };
type ActiveInquiry = {
  status: string; checkIn: string; checkOut: string; guests: number;
  plan?: string; cabin?: string; planPrice?: number; planCurrency?: string; planUnit?: string;
};

// Tells the booking page who (if anyone) is signed in, and — the key bit — whether
// they already have a booking request in flight, so the form can get out of the way
// and show that instead of letting them send a second one.
export async function GET(request: Request) {
  const session = sessionFromRequest(request);
  if (!session) return NextResponse.json({ loggedIn: false });

  try {
    const customer = await readClient.fetch<CustomerDoc | null>(
      `*[_type == "customer" && _id == $id][0]{ name, phone, email }`,
      { id: session.customerId },
      { cache: "no-store" }
    );
    if (!customer) return NextResponse.json({ loggedIn: false });

    const active = await readClient.fetch<ActiveInquiry | null>(
      `*[_type == "inquiry" && customer._ref == $id && status in $statuses] | order(submittedAt desc)[0]{
        status, checkIn, checkOut, guests, plan, cabin, planPrice, planCurrency, planUnit
      }`,
      { id: session.customerId, statuses: ACTIVE_STATUSES },
      { cache: "no-store" }
    );

    return NextResponse.json({
      loggedIn: true,
      email: customer.email || session.email,
      name: customer.name || "",
      phone: customer.phone || "",
      activeBooking: active || null,
    });
  } catch (error) {
    console.error("Could not load the signed-in customer:", error);
    return NextResponse.json({ loggedIn: false });
  }
}
