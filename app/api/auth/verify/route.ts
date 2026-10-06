import { NextResponse } from "next/server";
import { createSessionToken, verifyLoginToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth";
import { client as readClient, writeClient } from "@/lib/sanity/client";

// The link from the login email lands here. It finds-or-creates the customer record
// for that email, signs them into a cookie, and sends them back to the booking page.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  const lang = url.searchParams.get("lang") === "ar" ? "ar" : "en";
  const redirect = (path: string) => NextResponse.redirect(new URL(path, url.origin));

  let data: { email: string } | null;
  try {
    data = verifyLoginToken(token);
  } catch (error) {
    console.error("Could not verify the login token:", error);
    return redirect(`/${lang}/booking?login=error`);
  }
  if (!data) return redirect(`/${lang}/booking?login=expired`);

  const client = writeClient();
  if (!client) return redirect(`/${lang}/booking?login=error`);

  try {
    type CustomerDoc = { _id: string };
    let customer = await readClient.fetch<CustomerDoc | null>(
      `*[_type == "customer" && email == $email][0]{ _id }`,
      { email: data.email },
      { cache: "no-store" }
    );

    if (!customer) {
      const created = await client.create({ _type: "customer", email: data.email, tier: "new", bookingsCount: 0 });
      customer = { _id: created._id };
    }

    const session = createSessionToken({ email: data.email, customerId: customer._id });
    const res = redirect(`/${lang}/booking?welcome=1`);
    res.cookies.set(SESSION_COOKIE_NAME, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return res;
  } catch (error) {
    console.error("Signing in failed:", error);
    return redirect(`/${lang}/booking?login=error`);
  }
}
