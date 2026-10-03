import Backdrop from "./Backdrop";
import { tr } from "@/lib/i18n";
import { imagePosition, imageUrl } from "@/lib/sanity/image";
import type { Locale, PageHeader } from "@/lib/sanity/types";
import RugBand from "./RugBand";

export default function PageHero({ header, lang, fallbackTitle, fallbackImage }: { header?: PageHeader | null; lang: Locale; fallbackTitle: string; fallbackImage?: string }) {
  const src = imageUrl(header?.image, fallbackImage || "");
  const intro = tr(header?.intro, lang);
  return (
    <section className={`page-hero${src ? "" : " no-image"}`}>
      <Backdrop src={src} position={imagePosition(header?.image)} priority />
      <div className="container page-hero-inner">
        <h1 className="display">{tr(header?.title, lang) || fallbackTitle}</h1>
        {intro && <p className="page-hero-intro">{intro}</p>}
      </div>
      <RugBand className="rug-bottom" />
    </section>
  );
}
