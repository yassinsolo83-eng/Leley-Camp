import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import { ArrowDownIcon } from "./icons";

type Props = { badge: string; title: string; subtitle: string; imageUrl: string; logoUrl: string; whatsappUrl: string; dict: Dictionary };

export default function Hero({ badge, title, subtitle, imageUrl, logoUrl, whatsappUrl, dict }: Props) {
  return (
    <section id="home" className="hero">
      <Image src={imageUrl} alt={title} fill priority sizes="100vw" style={{ objectFit: "cover" }} />
      <div className="hero-overlay" />
      <div className="hero-logo">
        <Image src={logoUrl} alt="" width={126} height={126} />
      </div>
      <div className="hero-content">
        {badge && <div className="hero-badge">{badge}</div>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        <div className="hero-btns">
          {whatsappUrl && (
            <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">{dict.reserveCabin}</a>
          )}
        </div>
      </div>
      <a className="hero-scroll" href="#about" aria-label={dict.scroll}>
        <ArrowDownIcon />
        <span>{dict.scroll}</span>
      </a>
    </section>
  );
}
