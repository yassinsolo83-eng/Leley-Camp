import Image from "next/image";
import { tr } from "@/lib/i18n";
import { imageUrl } from "@/lib/sanity/image";
import type { Activity, Locale, SectionHeading as Heading } from "@/lib/sanity/types";
import SectionHeading from "./SectionHeading";

export default function Activities({ heading, activities, lang }: { heading?: Heading; activities: Activity[]; lang: Locale }) {
  if (!activities.length) return null;
  return (
    <section id="activities">
      <div className="container">
        <SectionHeading heading={heading} lang={lang} />
        <div className="activities-grid">
          {activities.map((a) => {
            const src = imageUrl(a.image);
            return (
              <article className="activity-card" key={a._id}>
                {src && (
                  <div className="activity-img">
                    <Image src={src} alt={tr(a.name, lang)} fill sizes="(max-width: 700px) 100vw, 400px" style={{ objectFit: "cover" }} />
                  </div>
                )}
                <div className="activity-body">
                  {a.icon && <div className="activity-icon" aria-hidden="true">{a.icon}</div>}
                  <h3>{tr(a.name, lang)}</h3>
                  <p>{tr(a.description, lang)}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
