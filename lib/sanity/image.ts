import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./env";
import type { SanityImage } from "./types";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Returns a Sanity CDN URL for an image field, or the fallback path when the field is empty. */
export function imageUrl(image: SanityImage | undefined | null, fallback = ""): string {
  if (!image?.asset) return fallback;
  return builder.image(image).auto("format").url();
}

/**
 * CSS object-position from the hotspot set in the Studio, so the important part
 * of a photo stays visible however the box is shaped. Accounts for any crop.
 */
export function imagePosition(image: SanityImage | undefined | null): string | undefined {
  const h = image?.hotspot;
  if (!h || typeof h.x !== "number" || typeof h.y !== "number") return undefined;
  const c = { left: image?.crop?.left ?? 0, right: image?.crop?.right ?? 0, top: image?.crop?.top ?? 0, bottom: image?.crop?.bottom ?? 0 };
  const w = 1 - c.left - c.right || 1;
  const hh = 1 - c.top - c.bottom || 1;
  const x = Math.min(Math.max((h.x - c.left) / w, 0), 1);
  const y = Math.min(Math.max((h.y - c.top) / hh, 0), 1);
  return `${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%`;
}
