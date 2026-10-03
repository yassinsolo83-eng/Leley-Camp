import { timeAgo, type Dictionary } from "@/lib/i18n";
import type { Locale, Review, SectionHeading as Heading } from "@/lib/sanity/types";
import SectionHeading from "./SectionHeading";

const AVATAR_COLORS = [
  { background: "#2A7F9E", color: "#fff" },
  { background: "#6B7280", color: "#fff" },
  { background: "#E76F51", color: "#fff" },
  { background: "#D4A96A", color: "#1A2B38" },
];

type Props = { heading?: Heading; reviews: Review[]; rating?: number; lang: Locale; dict: Dictionary };

export default function Reviews({ heading, reviews, rating, lang, dict }: Props) {
  if (!reviews.length) return null;
  const stars = (n: number) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));

  return (
    <section id="reviews">
      <div className="container">
        <SectionHeading heading={heading} lang={lang} />
        <div className="reviews-grid">
          {reviews.map((r, i) => {
            const meta = [r.source, r.rating ? `${r.rating}/5` : "", timeAgo(r.date, lang)].filter(Boolean).join(" · ");
            return (
              <article className="review-card" key={r._id}>
                <div className="stars" aria-label={`${r.rating ?? 5}/5`}>{stars(r.rating ?? 5)}</div>
                <blockquote className="review-text" dir="auto">&ldquo;{r.text}&rdquo;</blockquote>
                <div className="reviewer">
                  <div className="reviewer-avatar" style={AVATAR_COLORS[i % AVATAR_COLORS.length]} aria-hidden="true">
                    {(r.author || "?").trim().charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="reviewer-name" dir="auto">
                      {r.author}
                      {r.badge && <span className="reviewer-badge">{r.badge}</span>}
                    </div>
                    <div className="reviewer-source">{meta}</div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {rating ? (
          <div className="rating-summary">
            <div className="rating-big">{rating.toFixed(1)}</div>
            <div className="rating-info">
              <div className="stars" style={{ fontSize: "1.2rem" }}>{stars(rating)}</div>
              <p>{dict.basedOnReviews}</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
