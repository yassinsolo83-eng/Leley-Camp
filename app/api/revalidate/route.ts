import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CACHE_TAG } from "@/lib/sanity/client";

// Called by a Sanity webhook after every publish, so changes appear instantly.
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ error: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });

  const { isValidSignature } = await parseBody(request, secret, true);
  if (!isValidSignature) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

  revalidateTag(CACHE_TAG, { expire: 0 });
  return NextResponse.json({ revalidated: true });
}
