import Image from "next/image";
import { tr, type Dictionary } from "@/lib/i18n";
import type { HomePage, Locale } from "@/lib/sanity/types";
import SectionHeading from "./SectionHeading";
import { PhoneIcon, PinIcon, WhatsAppIcon } from "./icons";

type Props = {
  about: HomePage["about"];
  imageUrl: string;
  rating?: number;
  whatsappUrl: string;
  phoneDisplay?: string;
  mapsUrl?: string;
  lang: Locale;
  dict: Dictionary;
};

export default function About({ about, imageUrl, rating, whatsappUrl, phoneDisplay, mapsUrl, lang, dict }: Props) {
  const phoneHref = phoneDisplay ? `tel:+${phoneDisplay.replace(/\D/g, "")}` : "";
  return (
    <section id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-img-wrap">
            <Image src={imageUrl} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            {rating ? (
              <div className="about-badge">
                <span>⭐ {rating.toFixed(1)}</span>
                <span>{dict.ratedByGuests}</span>
              </div>
            ) : null}
          </div>
          <div className="about-text">
            <SectionHeading heading={about?.heading} lang={lang} />
            {about?.paragraphs?.map((p, i) => {
              const text = tr(p, lang);
              return text ? <p key={i}>{text}</p> : null;
            })}
            {!!about?.stats?.length && (
              <div className="about-stats">
                {about.stats.map((s) => (
                  <div className="stat" key={s._key}>
                    <div className="stat-num">{s.value}</div>
                    <div className="stat-label">{tr(s.label, lang)}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="contact-chips">
              {whatsappUrl && (
                <a className="chip" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon size={15} color="#25D366" /> WhatsApp
                </a>
              )}
              {phoneDisplay && (
                <a className="chip" href={phoneHref} dir="ltr"><PhoneIcon /> {phoneDisplay}</a>
              )}
              {mapsUrl && (
                <a className="chip" href={mapsUrl} target="_blank" rel="noopener noreferrer"><PinIcon /> {dict.viewOnMaps}</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
