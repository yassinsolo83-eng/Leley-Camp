import type { Dictionary } from "@/lib/i18n";
import { ArrowIcon } from "./icons";

type Props = {
  bookingUrl?: string;
  vrTourUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  instagramHandle?: string;
  dict: Dictionary;
};

/** Booking.com, 360° tour and social links as a simple list of rows. */
export default function BookLinks({ bookingUrl, vrTourUrl, facebookUrl, instagramUrl, instagramHandle, dict }: Props) {
  const rows = [
    bookingUrl && { href: bookingUrl, title: dict.bookOnBooking, sub: dict.bookOnBookingSub, accent: "#003580" },
    vrTourUrl && { href: vrTourUrl, title: dict.vrCard, sub: dict.vrCardSub, accent: "#1F8F98" },
    facebookUrl && { href: facebookUrl, title: dict.facebookCard, sub: dict.facebookCardSub, accent: "#1877F2" },
    instagramUrl && { href: instagramUrl, title: dict.instagramCard, sub: instagramHandle || "", accent: "#C13584" },
  ].filter(Boolean) as { href: string; title: string; sub: string; accent: string }[];

  if (!rows.length) return null;

  return (
    <ul className="link-rows">
      {rows.map((r) => (
        <li key={r.href}>
          <a href={r.href} target="_blank" rel="noopener noreferrer" style={{ "--accent": r.accent } as React.CSSProperties}>
            <span>
              <span className="link-row-title">{r.title}</span>
              {r.sub && <span className="link-row-sub" dir="auto">{r.sub}</span>}
            </span>
            <ArrowIcon />
          </a>
        </li>
      ))}
    </ul>
  );
}
