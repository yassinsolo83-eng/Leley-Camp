import Link from "next/link";
import Backdrop from "./Backdrop";

type Props = { href: string; title: string; subtitle: string; cta: string; posterUrl?: string; posterPosition?: string };

/** A big still photo that leads to the 360° tour page. */
export default function TourTeaser({ href, title, subtitle, cta, posterUrl, posterPosition }: Props) {
  return (
    <section className="vr-section">
      <Link className="vr-stage vr-link" href={href}>
        {posterUrl && <Backdrop src={posterUrl} position={posterPosition} />}
        <span className="vr-text">
          <span className="vr-label" dir="ltr">360°</span>
          <span className="vr-title">{title}</span>
          {subtitle && <span className="vr-sub">{subtitle}</span>}
          <span className="btn btn-sand">{cta}</span>
        </span>
      </Link>
    </section>
  );
}
