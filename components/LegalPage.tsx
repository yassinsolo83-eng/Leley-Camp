import { tr } from "@/lib/i18n";
import type { Locale, Localized, LegalSection } from "@/lib/sanity/types";
import PageHero from "./PageHero";

/** Splits a section's body on blank lines so each becomes its own paragraph. */
function paragraphs(text: string) {
  return text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
}

export default function LegalPage({
  title, updatedAt, sections, lang, dict, fallbackTitle,
}: {
  title?: Localized;
  updatedAt?: string;
  sections?: LegalSection[];
  lang: Locale;
  dict: { legalUpdated: string };
  fallbackTitle: string;
}) {
  return (
    <>
      <PageHero header={{ title }} lang={lang} fallbackTitle={fallbackTitle} />
      <section className="section">
        <div className="container legal-page">
          {updatedAt && <p className="legal-updated">{dict.legalUpdated}: {updatedAt}</p>}
          {(sections ?? []).map((s) => {
            const heading = tr(s.heading, lang);
            const body = tr(s.body, lang);
            if (!heading && !body) return null;
            return (
              <div className="legal-section" key={s._key}>
                {heading && <h2>{heading}</h2>}
                {paragraphs(body).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
