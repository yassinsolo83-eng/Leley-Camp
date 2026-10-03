import { revalidateTag } from "next/cache";
import { writeClient, CACHE_TAG } from "@/lib/sanity/client";

// One-time import of the starter content file into Sanity.
// Open /api/seed in the browser, enter SEED_SECRET, choose the JSON file, press Import.
// Safe to run again: documents with the same _id are replaced, nothing is duplicated.

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const page = (body: string) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Import starter content</title>
<style>body{font-family:system-ui,sans-serif;max-width:560px;margin:48px auto;padding:0 20px;color:#1A2B38;line-height:1.6}
label{display:block;font-weight:600;margin:18px 0 6px}input{font:inherit;width:100%;padding:10px;border:1.5px solid #ddd;border-radius:8px}
button{margin-top:22px;font:inherit;font-weight:600;background:#2A7F9E;color:#fff;border:0;border-radius:50px;padding:12px 28px;cursor:pointer}
.ok{background:#E6F4EA;padding:14px;border-radius:8px}.err{background:#FDEDE8;padding:14px;border-radius:8px}
li{font-size:.9rem}</style></head><body>${body}</body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function GET() {
  return page(`<h1>Import starter content</h1>
<p>Uploads the starter content file (texts, photos and video) into Sanity. Running it again replaces the same documents.</p>
<form method="post" enctype="multipart/form-data">
<label for="secret">Seed secret</label><input id="secret" name="secret" type="password" required>
<label for="file">Starter content file (.json)</label><input id="file" name="file" type="file" accept=".json,application/json" required>
<button type="submit">Import</button></form>`);
}

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export async function POST(request: Request) {
  const secret = process.env.SEED_SECRET;
  if (!secret) return page(`<p class="err">SEED_SECRET is not set in Vercel → Settings → Environment Variables.</p>`);

  const form = await request.formData();
  if (form.get("secret") !== secret) return page(`<p class="err">Wrong seed secret.</p><p><a href="/api/seed">Try again</a></p>`);

  const client = writeClient();
  if (!client) return page(`<p class="err">SANITY_API_WRITE_TOKEN is not set.</p>`);

  let documents: { _id: string; _type: string }[];
  try {
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("No file was chosen.");
    const parsed = JSON.parse(await file.text());
    documents = Array.isArray(parsed) ? parsed : parsed.documents;
    if (!Array.isArray(documents) || !documents.every((d) => d?._id && d?._type)) throw new Error("Every document needs _id and _type.");
  } catch (e) {
    return page(`<p class="err">The file could not be read: ${escape(String((e as Error).message))}</p><p><a href="/api/seed">Try again</a></p>`);
  }

  const origin = new URL(request.url).origin;
  const uploaded = new Map<string, string>();
  const log: string[] = [];

  // Replaces {"_upload": "/images/x.jpg"} with a real Sanity image (or file) and
  // gives every object inside an array the _key Sanity needs.
  async function resolve(value: Json, inArray = false): Promise<Json> {
    if (Array.isArray(value)) return Promise.all(value.map((v) => resolve(v, true)));
    if (!value || typeof value !== "object") return value;

    if (typeof value._upload === "string") {
      const path = value._upload;
      const kind = value._uploadType === "file" ? "file" : "image";
      let assetId = uploaded.get(path);
      if (!assetId) {
        const res = await fetch(new URL(path, origin));
        if (!res.ok) throw new Error(`Could not load ${path} (${res.status})`);
        const asset = await client!.assets.upload(kind, Buffer.from(await res.arrayBuffer()), {
          filename: path.split("/").pop(),
          contentType: res.headers.get("content-type") || undefined,
        });
        assetId = asset._id;
        uploaded.set(path, assetId);
        log.push(`Uploaded ${path}`);
      }
      const ref: Json = { _type: kind, asset: { _type: "reference", _ref: assetId } };
      return inArray ? { ...(ref as object), _key: Math.random().toString(36).slice(2, 10) } : ref;
    }

    const out: { [key: string]: Json } = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === "_uploadType") continue;
      out[k] = await resolve(v);
    }
    if (inArray && !out._key) out._key = Math.random().toString(36).slice(2, 10);
    return out;
  }

  try {
    const tx = client.transaction();
    for (const doc of documents) {
      const resolved = (await resolve(doc as unknown as Json)) as { _id: string; _type: string };
      tx.createOrReplace(resolved);
      log.push(`Saved ${doc._type} “${doc._id}”`);
    }
    await tx.commit();
    revalidateTag(CACHE_TAG, { expire: 0 });
  } catch (e) {
    return page(`<p class="err">Import stopped: ${escape(String((e as Error).message))}</p><ul>${log.map((l) => `<li>${escape(l)}</li>`).join("")}</ul>`);
  }

  return page(`<p class="ok"><strong>Done.</strong> ${documents.length} documents imported. Open <a href="/studio">the Studio</a> or <a href="/">the site</a>.</p>
<ul>${log.map((l) => `<li>${escape(l)}</li>`).join("")}</ul>`);
}
