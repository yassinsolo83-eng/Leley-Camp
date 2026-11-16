/**
 * Draws an offer as a ready-to-post social image on a <canvas>, in the browser.
 * The canvas handles Arabic shaping and right-to-left text natively.
 *
 * Sizes (Facebook + Instagram):
 *  - post  1080×1350 (4:5) — shows uncropped in both feeds. Text stays away from the
 *          sides so Instagram's 3:4 profile-grid preview doesn't cut it.
 *  - story 1080×1920 (9:16) — text kept out of the top and bottom bands that the
 *          story UI covers (profile name at the top, reply bar at the bottom).
 */

export type SocialFormat = "post" | "story";

export const SOCIAL_SIZES: Record<SocialFormat, { width: number; height: number }> = {
  post: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
};

export type SocialImageData = {
  rtl: boolean;
  badge: string;
  title: string;
  dates: string;
  description: string;
  plan: string;
  prices: string[];
  site: string;
  campName: string;
  photoUrl?: string;
  photoFocus?: { x: number; y: number };
  logoUrl?: string;
};

const C = {
  deep: "#0F3A4A",
  deep2: "#0B2E3B",
  reef: "#1F8F98",
  sand: "#EFE4D2",
  white: "#FFFDF9",
  carpet: "#9B2C2C",
};

const RUG_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='28' viewBox='0 0 32 28'%3E%3Crect width='32' height='28' fill='%239B2C2C'/%3E%3Crect width='32' height='3' fill='%230F3A4A'/%3E%3Crect y='25' width='32' height='3' fill='%230F3A4A'/%3E%3Cpath d='M0 3l4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4z' fill='%23EFE4D2'/%3E%3Cpath d='M0 25l4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4z' fill='%23EFE4D2'/%3E%3Cpath d='M9 14l7-6 7 6-7 6z' fill='%23EFE4D2'/%3E%3Cpath d='M12.5 14l3.5-3 3.5 3-3.5 3z' fill='%230F3A4A'/%3E%3Cpath d='M-3 14l3-3 3 3-3 3zM29 14l3-3 3 3-3 3z' fill='%231F8F98'/%3E%3C/svg%3E";

const FONT_FILES: { family: string; file: string; weight: string; range: string }[] = [
  { family: "LeleyDisplay", file: "fraunces-latin-600-normal.woff2", weight: "600", range: "U+0000-00FF, U+2000-206F, U+20AC" },
  { family: "LeleyDisplay", file: "aref-ruqaa-arabic-700-normal.woff2", weight: "600", range: "U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFF" },
  { family: "LeleyBody", file: "ibm-plex-sans-arabic-latin-400-normal.woff2", weight: "400", range: "U+0000-00FF, U+2000-206F, U+20AC" },
  { family: "LeleyBody", file: "ibm-plex-sans-arabic-arabic-400-normal.woff2", weight: "400", range: "U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFF" },
  { family: "LeleyBody", file: "ibm-plex-sans-arabic-latin-600-normal.woff2", weight: "600", range: "U+0000-00FF, U+2000-206F, U+20AC" },
  { family: "LeleyBody", file: "ibm-plex-sans-arabic-arabic-600-normal.woff2", weight: "600", range: "U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFF" },
];

let fontsReady: Promise<void> | null = null;

/** Loads the site's fonts (served from /public/fonts) once per page. */
export function loadSocialFonts(): Promise<void> {
  if (!fontsReady) {
    fontsReady = Promise.all(
      FONT_FILES.map(async ({ family, file, weight, range }) => {
        const face = new FontFace(family, `url(/fonts/${file})`, { weight, unicodeRange: range });
        await face.load();
        document.fonts.add(face);
      })
    ).then(() => undefined).catch(() => undefined);
  }
  return fontsReady;
}

function loadImage(src?: string): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Draws an image to fill a box (like object-fit: cover), keeping the focus point in view. */
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, focus = { x: 0.5, y: 0.5 }) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = Math.min(Math.max(focus.x * img.width - sw / 2, 0), img.width - sw);
  const sy = Math.min(Math.max(focus.y * img.height - sh / 2, 0), img.height - sh);
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/** Splits text into lines that fit maxWidth; the last allowed line ends with "…" if text is cut. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width <= maxWidth || !line) {
      line = test;
      continue;
    }
    lines.push(line);
    line = words[i];
    if (lines.length === maxLines) {
      let last = lines[maxLines - 1];
      while (last && ctx.measureText(`${last}…`).width > maxWidth) last = last.split(" ").slice(0, -1).join(" ");
      lines[maxLines - 1] = `${last}…`;
      return lines;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function drawOfferImage(canvas: HTMLCanvasElement, format: SocialFormat, d: SocialImageData) {
  await loadSocialFonts();
  const [photo, logo, rugTile] = await Promise.all([loadImage(d.photoUrl), loadImage(d.logoUrl), loadImage(RUG_SVG)]);

  const { width: W, height: H } = SOCIAL_SIZES[format];
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const story = format === "story";
  const padX = 96; // keeps text inside the 3:4 grid preview and away from story edges
  const textW = W - padX * 2;
  const rugH = 42;
  // Footer sits above the story's bottom UI band; on the post it sits above the closing rug.
  const footerY = story ? H - 380 : H - 128;
  const sz = story
    ? { badge: 34, badgeH: 64, title: 92, dates: 46, plan: 36, desc: 36, price: 60, price2: 44, gap: 30 }
    : { badge: 30, badgeH: 56, title: 80, dates: 40, plan: 32, desc: 32, price: 52, price2: 38, gap: 24 };
  const titleLineH = sz.title * (d.rtl ? 1.4 : 1.12);
  let priceSize = d.prices.length > 1 ? sz.price2 : sz.price;
  ctx.font = `600 ${priceSize}px LeleyBody`;
  // Shrink the price text until the longest line fits inside its box.
  while (priceSize > 24 && d.prices.some((p) => ctx.measureText(p).width > textW - 56)) {
    priceSize -= 2;
    ctx.font = `600 ${priceSize}px LeleyBody`;
  }
  const priceLineH = priceSize * 1.4;

  ctx.direction = d.rtl ? "rtl" : "ltr";
  ctx.textAlign = d.rtl ? "right" : "left";
  ctx.textBaseline = "top";
  const tx = d.rtl ? W - padX : padX;

  // Measure the text block first, so the photo gives up height when the text is long.
  ctx.font = `600 ${sz.title}px LeleyDisplay`;
  const titleLines = wrap(ctx, d.title, textW, 2);
  ctx.font = `400 ${sz.desc}px LeleyBody`;
  let descLines = d.description ? wrap(ctx, d.description, textW, story ? 3 : 2) : [];
  const blockHeight = (desc: string[]) =>
    sz.badgeH + sz.gap +
    titleLines.length * titleLineH + sz.gap * 0.5 +
    (d.dates ? sz.dates * 1.3 + sz.gap * 0.6 : 0) +
    (d.plan ? sz.plan * 1.4 + sz.gap * 0.4 : 0) +
    (desc.length ? desc.length * sz.desc * 1.5 + sz.gap * 0.4 : 0) +
    (d.prices.length ? sz.gap + d.prices.length * priceLineH + 36 : 0);
  const topGap = story ? 80 : 60;
  const bottomGap = story ? 60 : 44;
  const maxPhoto = story ? 860 : 600;
  const minPhoto = story ? 560 : 380;
  let photoH = Math.min(maxPhoto, footerY - bottomGap - blockHeight(descLines) - topGap - rugH);
  if (photoH < minPhoto && descLines.length > 1) {
    descLines = descLines.slice(0, 1);
    descLines[0] = descLines[0].replace(/…?$/, "…");
    photoH = Math.min(maxPhoto, footerY - bottomGap - blockHeight(descLines) - topGap - rugH);
  }
  photoH = Math.max(photoH, minPhoto);

  // Background
  ctx.fillStyle = C.deep;
  ctx.fillRect(0, 0, W, H);

  // Photo
  if (photo) {
    drawCover(ctx, photo, 0, 0, W, photoH, d.photoFocus);
    const fade = ctx.createLinearGradient(0, photoH * 0.45, 0, photoH);
    fade.addColorStop(0, "rgba(11, 46, 59, 0)");
    fade.addColorStop(1, "rgba(11, 46, 59, 0.55)");
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, W, photoH);
  } else {
    ctx.fillStyle = C.deep2;
    ctx.fillRect(0, 0, W, photoH);
  }

  // Rug band under the photo
  const drawRug = (y: number) => {
    if (!rugTile) return;
    const scale = rugH / 28;
    const pattern = ctx.createPattern(rugTile, "repeat-x");
    if (!pattern) return;
    pattern.setTransform(new DOMMatrix().translate(0, y).scale(scale, scale));
    ctx.fillStyle = pattern;
    ctx.fillRect(0, y, W, rugH);
  };
  drawRug(photoH);

  // Logo badge on the photo (below the story's top UI band)
  const logoSize = story ? 150 : 128;
  const logoY = story ? 290 : 56;
  if (logo) {
    const cx = d.rtl ? W - padX - logoSize / 2 : padX + logoSize / 2;
    const cy = logoY + logoSize / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, logoSize / 2 + 6, 0, Math.PI * 2);
    ctx.fillStyle = C.white;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, logoSize / 2, 0, Math.PI * 2);
    ctx.clip();
    drawCover(ctx, logo, cx - logoSize / 2, cy - logoSize / 2, logoSize, logoSize);
    ctx.restore();
  }

  // Content, top to bottom
  let y = photoH + rugH + topGap;

  // Badge pill
  ctx.font = `600 ${sz.badge}px LeleyBody`;
  const badgeText = d.badge.toUpperCase();
  const bw = ctx.measureText(badgeText).width + 44;
  const bx = d.rtl ? W - padX - bw : padX;
  ctx.fillStyle = C.carpet;
  roundRect(ctx, bx, y, bw, sz.badgeH, 8);
  ctx.fill();
  ctx.fillStyle = C.white;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(badgeText, bx + bw / 2, y + sz.badgeH / 2 + 2);
  ctx.textAlign = d.rtl ? "right" : "left";
  ctx.textBaseline = "top";
  y += sz.badgeH + sz.gap;

  // Title
  ctx.font = `600 ${sz.title}px LeleyDisplay`;
  ctx.fillStyle = C.white;
  for (const line of titleLines) {
    ctx.fillText(line, tx, y);
    y += titleLineH;
  }
  y += sz.gap * 0.5;

  // Dates
  if (d.dates) {
    ctx.font = `600 ${sz.dates}px LeleyBody`;
    ctx.fillStyle = "#6FD1D8";
    ctx.fillText(d.dates, tx, y);
    y += sz.dates * 1.3 + sz.gap * 0.6;
  }

  // Package
  if (d.plan) {
    ctx.font = `600 ${sz.plan}px LeleyBody`;
    ctx.fillStyle = C.sand;
    ctx.fillText(d.plan, tx, y);
    y += sz.plan * 1.4 + sz.gap * 0.4;
  }

  // Description
  if (descLines.length) {
    ctx.font = `400 ${sz.desc}px LeleyBody`;
    ctx.fillStyle = "rgba(239, 228, 210, 0.85)";
    for (const line of descLines) {
      ctx.fillText(line, tx, y);
      y += sz.desc * 1.5;
    }
    y += sz.gap * 0.4;
  }

  // Prices
  if (d.prices.length) {
    y += sz.gap;
    ctx.font = `600 ${priceSize}px LeleyBody`;
    const boxH = d.prices.length * priceLineH + 36;
    const longest = Math.max(...d.prices.map((p) => ctx.measureText(p).width));
    const boxW = Math.min(longest + 56, textW);
    const boxX = d.rtl ? W - padX - boxW : padX;
    ctx.fillStyle = C.sand;
    roundRect(ctx, boxX, y, boxW, boxH, 10);
    ctx.fill();
    ctx.fillStyle = C.carpet;
    const px = d.rtl ? W - padX - 28 : padX + 28;
    let py = y + 18 + (priceLineH - priceSize) / 2;
    for (const p of d.prices) {
      ctx.fillText(p, px, py);
      py += priceLineH;
    }
  }

  // Footer: camp name + website on one baseline, then a closing rug band
  ctx.textBaseline = "alphabetic";
  ctx.font = `600 ${story ? 44 : 38}px LeleyDisplay`;
  ctx.fillStyle = C.white;
  ctx.fillText(d.campName, tx, footerY + 40);
  ctx.font = `600 ${story ? 36 : 32}px LeleyBody`;
  ctx.fillStyle = C.sand;
  ctx.textAlign = d.rtl ? "left" : "right";
  ctx.direction = "ltr";
  ctx.fillText(d.site, d.rtl ? padX : W - padX, footerY + 40);
  drawRug(H - rugH);
}
