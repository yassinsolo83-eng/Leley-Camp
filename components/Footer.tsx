import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import VisitorCounter from "./VisitorCounter";

type Props = {
  campName: string;
  logoUrl: string;
  footerText: string;
  whatsappUrl: string;
  phoneDisplay?: string;
  mapsUrl?: string;
  bookingUrl?: string;
  vrTourUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  showCounter: boolean;
  counterOffset: number;
  lang: string;
  dict: Dictionary;
};

export default function Footer(p: Props) {
  const { dict } = p;
  const external = { target: "_blank", rel: "noopener noreferrer" };
  return (
    <footer id="contact">
      <div className="footer-inner">
        <div className="footer-brand">
          <Image src={p.logoUrl} alt="" width={52} height={52} />
          <h3>{p.campName}</h3>
          {p.footerText && <p>{p.footerText}</p>}
        </div>
        <div className="footer-col">
          <h4>{dict.footerExplore}</h4>
          <ul>
            <li><a href="#about">{dict.footerAboutUs}</a></li>
            <li><a href="#cabins">{dict.navCabins}</a></li>
            <li><a href="#gallery">{dict.navGallery}</a></li>
            <li><a href="#reserve">{dict.navBook}</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>{dict.footerContact}</h4>
          <ul>
            {p.whatsappUrl && <li><a href={p.whatsappUrl} {...external}>WhatsApp</a></li>}
            {p.phoneDisplay && <li><a href={`tel:+${p.phoneDisplay.replace(/\D/g, "")}`} dir="ltr">{p.phoneDisplay}</a></li>}
            {p.mapsUrl && <li><a href={p.mapsUrl} {...external}>📍 {dict.googleMaps}</a></li>}
            {p.bookingUrl && <li><a href={p.bookingUrl} {...external}>🏨 Booking.com</a></li>}
            {p.vrTourUrl && <li><a href={p.vrTourUrl} {...external}>🥽 {dict.vrTour}</a></li>}
            {p.facebookUrl && <li><a href={p.facebookUrl} {...external}>📘 {dict.facebook}</a></li>}
            {p.instagramUrl && <li><a href={p.instagramUrl} {...external}>📸 {dict.instagram}</a></li>}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} {p.campName}. {dict.allRights}</p>
        {p.showCounter && <VisitorCounter offset={p.counterOffset} label={dict.visitors} lang={p.lang} />}
      </div>
    </footer>
  );
}
