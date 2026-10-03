type LoaderArgs = { src: string; width: number; quality?: number };

// Used by next/image for every image on the site (see next.config.ts).
export default function imageLoader({ src, width, quality }: LoaderArgs) {
  if (src.startsWith("https://cdn.sanity.io/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality || 75));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    return url.toString();
  }
  return src;
}
