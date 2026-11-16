import { useEffect, useRef, useState } from "react";
import { useClient, useFormValue, type FieldProps } from "sanity";
import { DEFAULT_LABELS, tr } from "../../lib/i18n";
import { offerDates, offerPriceLines } from "../../lib/offers";
import { imageUrl } from "../../lib/sanity/image";
import type { Locale, Localized, Offer, SanityImage } from "../../lib/sanity/types";
import { drawOfferImage, SOCIAL_SIZES, type SocialFormat, type SocialImageData } from "../../lib/offerSocialImage";

type Shared = {
  campName?: string;
  siteUrl?: string;
  showPrices?: boolean;
  logo?: SanityImage;
  labels?: Record<string, Localized>;
  planName?: Localized;
};

const FORMATS: { format: SocialFormat; label: string }[] = [
  { format: "post", label: "Post — 1080 × 1350" },
  { format: "story", label: "Story — 1080 × 1920" },
];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "offer";
}

/** Two ready-to-post images (post + story) built from the offer as it is in the form right now. */
export function OfferSocialImages(props: FieldProps) {
  const client = useClient({ apiVersion: "2025-01-01" });
  const doc = useFormValue([]) as (Offer & { plan?: { _ref?: string } }) | undefined;
  const planRef = doc?.plan?._ref;
  const [lang, setLang] = useState<Locale>("en");
  const [shared, setShared] = useState<Shared | null>(null);

  useEffect(() => {
    let cancelled = false;
    client
      .fetch<Shared>(
        `{
          "campName": *[_id == "siteSettings"][0].campName,
          "siteUrl": *[_id == "siteSettings"][0].siteUrl,
          "showPrices": *[_id == "siteSettings"][0].showPrices,
          "logo": *[_id == "siteSettings"][0].logo,
          "labels": *[_id == "interfaceText"][0],
          "planName": *[_id == $plan][0].name
        }`,
        { plan: planRef || "" }
      )
      .then((data) => !cancelled && setShared(data || {}))
      .catch(() => !cancelled && setShared({}));
    return () => {
      cancelled = true;
    };
  }, [client, planRef]);

  const label = (key: keyof typeof DEFAULT_LABELS) => tr(shared?.labels?.[key], lang) || DEFAULT_LABELS[key];
  const dict = { guestEgyptian: label("guestEgyptian"), guestForeigner: label("guestForeigner") } as Parameters<typeof offerPriceLines>[2];

  let site = "";
  try {
    site = new URL(shared?.siteUrl || window.location.origin).hostname.replace(/^www\./, "");
  } catch {
    site = window.location.hostname;
  }

  const offer: Offer = { _id: doc?._id || "", ...doc } as Offer;
  const hotspot = doc?.image?.hotspot;
  const data: SocialImageData | null = doc?.title
    ? {
        rtl: lang === "ar",
        badge: label("offerBadge"),
        title: tr(doc.title, lang),
        dates: offerDates(offer, lang),
        description: tr(doc.description, lang),
        plan: tr(shared?.planName, lang) ? `${label("formPlan")}: ${tr(shared?.planName, lang)}` : "",
        prices: offerPriceLines(offer, lang, dict, shared?.showPrices !== false),
        site,
        campName: shared?.campName || "Leley Camp",
        photoUrl: doc.image?.asset ? `${imageUrl(doc.image)}&w=1600` : undefined,
        photoFocus: hotspot && typeof hotspot.x === "number" && typeof hotspot.y === "number" ? { x: hotspot.x, y: hotspot.y } : undefined,
        logoUrl: shared?.logo?.asset ? `${imageUrl(shared.logo)}&w=400` : "/images/logo.jpg",
      }
    : null;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {props.renderDefault({ ...props, children: null })}
      {!data || !shared ? (
        <p style={{ margin: 0, fontSize: 13, color: "#6e7683" }}>
          {doc?.title ? "Preparing images…" : "Fill in the offer title to see the images."}
        </p>
      ) : (
        <>
          <div style={{ display: "flex", gap: 6 }}>
            {(["en", "ar"] as Locale[]).map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)} style={toggleStyle(lang === l)}>
                {l === "en" ? "English" : "Arabic"}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, alignItems: "start" }}>
            {FORMATS.map(({ format, label: title }) => (
              <SocialPreview
                key={format}
                format={format}
                title={title}
                data={data}
                fileName={`${slugify(tr(doc?.title, "en"))}-${format}-${lang}.png`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SocialPreview({ format, title, data, fileName }: { format: SocialFormat; title: string; data: SocialImageData; fileName: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const key = JSON.stringify(data);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    setReady(false);
    const t = setTimeout(() => {
      drawOfferImage(canvas, format, data).then(() => !cancelled && setReady(true));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, key]);

  function download() {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }

  const { width, height } = SOCIAL_SIZES[format];
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{title}</p>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: "100%", height: "auto", aspectRatio: `${width} / ${height}`, borderRadius: 6, border: "1px solid #e3e4e8", background: "#0F3A4A" }}
      />
      <button type="button" onClick={download} disabled={!ready} style={downloadStyle(ready)}>
        Download {format}
      </button>
    </div>
  );
}

const toggleStyle = (active: boolean): React.CSSProperties => ({
  padding: "6px 14px",
  borderRadius: 6,
  border: "1px solid #c6cbd1",
  background: active ? "#0F3A4A" : "#f2f3f5",
  color: active ? "#fff" : "inherit",
  font: "inherit",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
});

const downloadStyle = (ready: boolean): React.CSSProperties => ({
  padding: "8px 14px",
  borderRadius: 6,
  border: "none",
  background: ready ? "#9B2C2C" : "#c6cbd1",
  color: "#fff",
  font: "inherit",
  fontSize: 13,
  fontWeight: 600,
  cursor: ready ? "pointer" : "default",
});
