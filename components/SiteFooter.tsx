import Image from "next/image";
import Link from "next/link";
import { tr } from "@/lib/i18n";
import type { PageContext } from "@/lib/data";
import type { NavItem } from "./SiteHeader";
import RugBand from "./RugBand";
import VisitorCounter from "./VisitorCounter";

export default function SiteFooter({ ctx, nav }: { ctx: PageContext; nav: NavItem[] }) {
  const { settings: s, dict, lang } = ctx;
  const external = { target: "_blank", rel: "noopener noreferrer" };
  const footerText = tr(s?.footerText, lang);
  return (
    <footer className="site-footer">
      <RugBand />
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image src={ctx.logoUrl} alt="" width={56} height={56} className="brand-logo" />
          <p className="footer-name">{ctx.campName}</p>
          {footerText && <p className="footer-text">{footerText}</p>}
        </div>
        <div>
          <p className="footer-head">{dict.footerExplore}</p>
          <ul className="footer-list">
            {nav.map((n) => <li key={n.href}><Link href={n.href}>{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="footer-head">{dict.footerContact}</p>
          <ul className="footer-list">
            {ctx.waUrl && <li><a href={ctx.waUrl} {...external}>WhatsApp</a></li>}
            {s?.phoneDisplay && <li><a href={`tel:+${s.phoneDisplay.replace(/\D/g, "")}`} dir="ltr">{s.phoneDisplay}</a></li>}
            {s?.mapsUrl && <li><a href={s.mapsUrl} {...external}>{dict.googleMaps}</a></li>}
            {s?.bookingUrl && <li><a href={s.bookingUrl} {...external}>Booking.com</a></li>}
            {s?.vrTourUrl && <li><a href={s.vrTourUrl} {...external}>{dict.vrTour}</a></li>}
            {s?.facebookUrl && <li><a href={s.facebookUrl} {...external}>{dict.facebook}</a></li>}
            {s?.instagramUrl && <li><a href={s.instagramUrl} {...external}>{dict.instagram}</a></li>}
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {ctx.campName}. {dict.allRights}</p>
        <VisitorCounter label={dict.visitors} />
      </div>
    </footer>
  );
}
