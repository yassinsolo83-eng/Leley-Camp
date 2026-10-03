import type { Dictionary } from "@/lib/i18n";

type Props = {
  heading: React.ReactNode;
  bookingUrl?: string;
  vrTourUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  instagramHandle?: string;
  dict: Dictionary;
};

export default function BookLinks({ heading, bookingUrl, vrTourUrl, facebookUrl, instagramUrl, instagramHandle, dict }: Props) {
  const cards = [
    bookingUrl && { href: bookingUrl, icon: "🏨", title: dict.bookOnBooking, sub: dict.bookOnBookingSub,
      style: { background: "#003580", boxShadow: "0 6px 20px rgba(0,53,128,0.3)" } },
    vrTourUrl && { href: vrTourUrl, icon: "🥽", title: dict.vrCard, sub: dict.vrCardSub,
      style: { background: "linear-gradient(135deg,#1A2B38,#2A7F9E)", boxShadow: "0 6px 20px rgba(42,127,158,0.3)" } },
    facebookUrl && { href: facebookUrl, icon: "📘", title: dict.facebookCard, sub: dict.facebookCardSub,
      style: { background: "#1877F2", boxShadow: "0 6px 20px rgba(24,119,242,0.3)" } },
    instagramUrl && { href: instagramUrl, icon: "📸", title: dict.instagramCard, sub: instagramHandle || "",
      style: { background: "linear-gradient(135deg,#833AB4,#FD1D1D,#F77737)", boxShadow: "0 6px 20px rgba(253,29,29,0.3)" } },
  ].filter(Boolean) as { href: string; icon: string; title: string; sub: string; style: React.CSSProperties }[];

  if (!cards.length) return null;

  return (
    <section id="book">
      <div className="container">
        {heading}
        <div className="book-grid">
          {cards.map((c) => (
            <a key={c.href} className="book-card" href={c.href} target="_blank" rel="noopener noreferrer" style={c.style}>
              <div className="book-card-icon" aria-hidden="true">{c.icon}</div>
              <div>
                <div className="book-card-title">{c.title}</div>
                {c.sub && <div className="book-card-sub" dir="auto">{c.sub}</div>}
              </div>
              <div className="book-card-arrow" aria-hidden="true">→</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
