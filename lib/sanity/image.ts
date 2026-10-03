import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./env";
import type { SanityImage } from "./types";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Returns a Sanity CDN URL for an image field, or the fallback path when the field is empty. */
export function imageUrl(image: SanityImage | undefined | null, fallback = ""): string {
  if (!image?.asset) return fallback;
  return builder.image(image).auto("format").url();
}
