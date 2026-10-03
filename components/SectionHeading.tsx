import { tr } from "@/lib/i18n";
import type { Locale, SectionHeading as Heading } from "@/lib/sanity/types";

type Props = { heading?: Heading; lang: Locale; center?: boolean; as?: "h1" | "h2"; children?: React.ReactNode };

export default function SectionHeading({ heading, lang, center = false, as: Tag = "h2", children }: Props) {
  const tag = tr(heading?.tag, lang);
  const title = tr(heading?.title, lang);
  const subtitle = tr(heading?.subtitle, lang);
  if (!tag && !title && !subtitle && !children) return null;
  return (
    <div className={`heading${center ? " heading-center" : ""}`}>
      {tag && <p className="heading-tag">{tag}</p>}
      {title && <Tag className="heading-title">{title}</Tag>}
      {subtitle && <p className="heading-sub">{subtitle}</p>}
      {children}
    </div>
  );
}
