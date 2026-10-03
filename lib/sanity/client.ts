import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, isSanityConfigured } from "./env";

export const client = createClient({ projectId, dataset, apiVersion, useCdn: false });

/** Server-only client that can create documents (inquiries, starter content). */
export function writeClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) return null;
  return createClient({ projectId, dataset, apiVersion, useCdn: false, token });
}

export const CACHE_TAG = "sanity";

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!isSanityConfigured) return null;
  try {
    return await client.fetch<T>(query, params, { next: { revalidate: 60, tags: [CACHE_TAG] } });
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return null;
  }
}
