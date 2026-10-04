import { formatNumber, timeAgo, type Dictionary } from "@/lib/i18n";
import type { Locale, Review } from "@/lib/sanity/types";

const stars = (n: number) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));

type Props = { reviews: Review[]; rating?: number; reviewCount?: number; lang: Locale; dict: Dictionary };

/** The first review is shown large; the rest sit beside it. */
export default function ReviewList({ reviews, rating, reviewCount, lang, dict }: Props) {
  if (!reviews.length) return null;
  const [first, ...rest] = reviews;

  const meta = (r: Review) => [r.source, timeAgo(r.date, lang)].filter(Boolean).join(" · ");

  return (
    <div className={`reviews${rest.length ? "" : " single"}`}>
      <figure className="review-feature">
        <div className="stars" aria-label={`${first.rating ?? 5}/5`}>{stars(first.rating ?? 5)}</div>
        <blockquote dir="auto">{first.text}</blockquote>
        <figcaption>
          <span className="review-name" dir="auto">{first.author}</span>
          {first.badge && <span className="review-badge">{first.badge}</span>}
          <span className="review-meta">{meta(first)}</span>
        </figcaption>
        {rating ? (
          <div className="rating-line">
            <span className="rating-num">{rating.toFixed(1)}</span>
            <span>
              {dict.ratedByGuests}
              {reviewCount ? ` · ${formatNumber(reviewCount)}` : ""}
              <br />
              <small>{dict.basedOnReviews}</small>
            </span>
          </div>
        ) : null}
      </figure>
      {rest.length > 0 && <div className="review-stack">
        {rest.map((r) => (
          <figure className="review-small" key={r._id}>
            <div className="stars" aria-label={`${r.rating ?? 5}/5`}>{stars(r.rating ?? 5)}</div>
            <blockquote dir="auto">{r.text}</blockquote>
            <figcaption>
              <span className="review-name" dir="auto">{r.author}</span>
              {r.badge && <span className="review-badge">{r.badge}</span>}
              <span className="review-meta">{meta(r)}</span>
            </figcaption>
          </figure>
        ))}
      </div>}
    </div>
  );
}
