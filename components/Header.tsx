import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { WhatsAppIcon } from "./icons";

type Props = {
  campName: string;
  logoUrl: string;
  whatsappUrl: string;
  switchHref: string;
  switchLabel: string;
  switchLang: string;
  showPrices: boolean;
  dict: Dictionary;
};

export default function Header({ campName, logoUrl, whatsappUrl, switchHref, switchLabel, switchLang, showPrices, dict }: Props) {
  return (
    <header>
      <nav className="nav">
        <a className="nav-brand" href="#home">
          <Image src={logoUrl} alt={campName} width={42} height={42} priority />
          <span>{campName}</span>
        </a>
        <ul className="nav-links">
          <li><a href="#about">{dict.navAbout}</a></li>
          <li><a href="#cabins">{dict.navCabins}</a></li>
          {showPrices && <li><a href="#prices">{dict.navPrices}</a></li>}
          <li><a href="#gallery">{dict.navGallery}</a></li>
          <li><a href="#reserve">{dict.navBook}</a></li>
        </ul>
        <div className="nav-right">
          <Link className="lang-btn" href={switchHref} hrefLang={switchLang} lang={switchLang}>{switchLabel}</Link>
          {whatsappUrl && (
            <a className="nav-cta" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              {dict.bookNow}
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
