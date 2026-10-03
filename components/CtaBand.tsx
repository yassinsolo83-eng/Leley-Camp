import Link from "next/link";
import { localePath, tr, type Dictionary } from "@/lib/i18n";
import type { HomePage, Locale } from "@/lib/sanity/types";
import { WhatsAppIcon } from "./icons";

export default function CtaBand({ band, lang, dict, waUrl }: { band?: HomePage["ctaBand"]; lang: Locale; dict: Dictionary; waUrl: string }) {
  const title = tr(band?.title, lang);
  if (!title) return null;
  const sub = tr(band?.subtitle, lang);
  return (
    <section className="cta-band">
      <div className="container cta-inner">
        <div>
          <h2 className="display cta-title">{title}</h2>
          {sub && <p className="cta-sub">{sub}</p>}
        </div>
        <div className="cta-actions">
          <Link className="btn btn-red" href={localePath(lang, "/booking")}>{dict.heroCta}</Link>
          {waUrl && (
            <a className="btn btn-ghost-light" href={waUrl} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={16} /> {dict.whatsappUs}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
