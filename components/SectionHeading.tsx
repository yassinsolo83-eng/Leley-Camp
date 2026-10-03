import { tr } from "@/lib/i18n";
import type { Locale, SectionHeading as Heading } from "@/lib/sanity/types";

export default function SectionHeading({ heading, lang, center = false }: { heading?: Heading; lang: Locale; center?: boolean }) {
  const tag = tr(heading?.tag, lang);
  const title = tr(heading?.title, lang);
  const subtitle = tr(heading?.subtitle, lang);
  if (!tag && !title && !subtitle) return null;
  return (
    <div className={center ? "section-head-center" : undefined}>
      {tag && <span className="section-tag">{tag}</span>}
      {title && <h2 className="section-title">{title}</h2>}
      {subtitle && <p className="section-sub">{subtitle}</p>}
    </div>
  );
}
