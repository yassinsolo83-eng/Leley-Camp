import Image from "next/image";
import { tr } from "@/lib/i18n";
import { imageUrl } from "@/lib/sanity/image";
import type { Cabin, Locale, SectionHeading as Heading } from "@/lib/sanity/types";
import SectionHeading from "./SectionHeading";

export default function Cabins({ heading, cabins, lang }: { heading?: Heading; cabins: Cabin[]; lang: Locale }) {
  if (!cabins.length) return null;
  return (
    <section id="cabins">
      <div className="container">
        <SectionHeading heading={heading} lang={lang} />
        <div className="cabins-grid">
          {cabins.map((c) => {
            const src = imageUrl(c.image);
            const tag = tr(c.tag, lang);
            return (
              <article className="cabin-card" key={c._id}>
                {src && (
                  <div className="cabin-img">
                    <Image src={src} alt={tr(c.name, lang)} fill sizes="(max-width: 700px) 100vw, 400px" style={{ objectFit: "cover" }} />
                  </div>
                )}
                <div className="cabin-body">
                  <h3>{tr(c.name, lang)}</h3>
                  <p>{tr(c.description, lang)}</p>
                  {tag && <span className="cabin-tag">{tag}</span>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
