import { NextResponse } from "next/server";
import { client, writeClient } from "@/lib/sanity/client";

const ID = "visitorCounter";
type Counter = { count?: number; showOnSite?: boolean } | null;

const noStore = { headers: { "Cache-Control": "no-store" } };

// GET: read the number (returning visitors).
export async function GET() {
  try {
    const doc = await client.withConfig({ useCdn: false }).fetch<Counter>(`*[_id == $id][0]{count, showOnSite}`, { id: ID }, { cache: "no-store" });
    return NextResponse.json({ count: doc?.count ?? 0, show: doc?.showOnSite !== false }, noStore);
  } catch {
    return NextResponse.json({ error: "read_failed" }, { status: 500 });
  }
}

// POST: add one (first visit from this browser) and return the new number.
export async function POST() {
  const sanity = writeClient();
  if (!sanity) return NextResponse.json({ error: "not_configured" }, { status: 500 });
  try {
    await sanity
      .transaction()
      .createIfNotExists({ _id: ID, _type: "visitorCounter", count: 0, showOnSite: true })
      .patch(ID, (p) => p.setIfMissing({ count: 0 }).inc({ count: 1 }))
      .commit();
    const doc = await sanity.fetch<Counter>(`*[_id == $id][0]{count, showOnSite}`, { id: ID }, { cache: "no-store" });
    return NextResponse.json({ count: doc?.count ?? 0, show: doc?.showOnSite !== false }, noStore);
  } catch {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }
}
