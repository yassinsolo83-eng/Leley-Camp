"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./icons";

export type PromoOffer = {
  id: string;
  title: string;
  description: string;
  image: string;
  imagePosition?: string;
  dates: string;
  prices: string[];
  ticker: string;
};

type Props = {
  offers: PromoOffer[];
  offersHref: string;
  homeHref: string;
  badge: string;
  viewLabel: string;
  closeLabel: string;
};

// The home page plays the rug intro first (components/IntroWeave.tsx), so wait for it to lift.
const HOME_DELAY = 1700;
const PAGE_DELAY = 400;

/**
 * Offer pop-up on every page load / refresh, then a moving bar at the top of the site
 * once the pop-up is closed. Both lead to the Offers page.
 */
export default function OfferPromo({ offers, offersHref, homeHref, badge, viewLabel, closeLabel }: Props) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const onOffersPage = pathname === offersHref || pathname.startsWith(`${offersHref}/`);
  // "pending" → waiting to open the pop-up, "open" → pop-up showing, "closed" → moving bar showing.
  const [stage, setStage] = useState<"pending" | "open" | "closed">(onOffersPage ? "closed" : "pending");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (stage !== "pending") return;
    const isHome = pathname === homeHref || pathname === `${homeHref}/`;
    const t = setTimeout(() => setStage("open"), isHome ? HOME_DELAY : PAGE_DELAY);
    return () => clearTimeout(t);
    // Only on the first load — moving between pages doesn't bring the pop-up back.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Arriving on the Offers page before the pop-up opened: skip it and show the bar.
  useEffect(() => {
    if (onOffersPage && stage === "pending") setStage("closed");
  }, [onOffersPage, stage]);

  useEffect(() => {
    if (stage !== "open") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setStage("closed");
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [stage]);

  if (!offers.length) return null;
  const first = offers[0];

  function goToOffers() {
    setStage("closed");
    router.push(offersHref);
  }

  const items = offers.map((o) => [o.ticker, o.dates, ...o.prices].filter(Boolean).join("  ·  "));
  const run = (
    <>
      {items.map((text, i) => (
        <span className="offer-ticker-item" key={i}>
          <span className="offer-ticker-badge">{badge}</span>
          {text}
          <span className="offer-ticker-cta">{viewLabel} →</span>
        </span>
      ))}
    </>
  );

  return (
    <>
      {stage === "closed" && (
        <Link className="offer-ticker" href={offersHref} aria-label={`${badge}: ${items.join(" — ")} — ${viewLabel}`}>
          <span className="offer-ticker-track" aria-hidden="true">
            <span className="offer-ticker-run">{run}{run}{run}</span>
            <span className="offer-ticker-run">{run}{run}{run}</span>
          </span>
        </Link>
      )}

      {stage === "open" && mounted && createPortal(
        <div className="offer-pop" onClick={() => setStage("closed")}>
          <div
            className="offer-pop-card"
            role="dialog"
            aria-modal="true"
            aria-label={first.title}
            onClick={(e) => {
              e.stopPropagation();
              goToOffers();
            }}
          >
            <button
              type="button"
              className="offer-pop-close"
              aria-label={closeLabel}
              onClick={(e) => {
                e.stopPropagation();
                setStage("closed");
              }}
            >
              <CloseIcon />
            </button>
            {first.image && (
              <div className="offer-pop-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={first.image} alt="" style={{ objectPosition: first.imagePosition }} />
              </div>
            )}
            <div className="offer-pop-body">
              <p className="offer-pop-badge">{badge}</p>
              <h2 className="display offer-pop-title">{first.title}</h2>
              {first.dates && <p className="offer-pop-dates">{first.dates}</p>}
              {first.description && <p className="offer-pop-desc">{first.description}</p>}
              {first.prices.length > 0 && (
                <div className="offer-pop-prices">
                  {first.prices.map((p) => <p key={p}>{p}</p>)}
                </div>
              )}
              <span className="btn btn-red btn-block">{viewLabel}</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
