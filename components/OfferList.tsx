"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatNumber, type Dictionary } from "@/lib/i18n";

export type OfferCard = {
  id: string;
  title: string;
  description: string;
  image: string;
  imagePosition?: string;
  dates: string;
  planName: string;
  priceEgyptian?: number;
  priceForeigner?: number;
  currency?: string;
  unit: string;
  bookHref: string;
};

type GuestType = "egyptian" | "foreigner";

export default function OfferList({ offers, dict, showPrices }: { offers: OfferCard[]; dict: Dictionary; showPrices: boolean }) {
  const [guestType, setGuestType] = useState<GuestType>("egyptian");
  const hasForeignerPrice = offers.some((o) => typeof o.priceForeigner === "number");

  return (
    <div>
      {showPrices && hasForeignerPrice && (
        <div className="guest-type-toggle" role="group" aria-label={dict.formGuestType}>
          <button type="button" className={guestType === "egyptian" ? "active" : ""} onClick={() => setGuestType("egyptian")}>
            {dict.guestEgyptian}
          </button>
          <button type="button" className={guestType === "foreigner" ? "active" : ""} onClick={() => setGuestType("foreigner")}>
            {dict.guestForeigner}
          </button>
        </div>
      )}
      <div className="offer-list">
        {offers.map((o) => {
          const price = guestType === "foreigner" ? (o.priceForeigner ?? o.priceEgyptian) : o.priceEgyptian;
          return (
            <article className="offer-card" key={o.id}>
              {o.image && (
                <div className="offer-card-img">
                  <Image src={o.image} alt="" fill sizes="(max-width: 860px) 100vw, 50vw" style={{ objectPosition: o.imagePosition }} />
                </div>
              )}
              <div className="offer-card-body">
                <p className="plan-badge">{dict.offerBadge}</p>
                <h2 className="display offer-card-title">{o.title}</h2>
                {o.dates && (
                  <p className="offer-card-meta"><strong>{dict.offerDates}:</strong> {o.dates}</p>
                )}
                {o.planName && (
                  <p className="offer-card-meta"><strong>{dict.formPlan}:</strong> {o.planName}</p>
                )}
                {o.description && <p className="offer-card-desc">{o.description}</p>}
                {showPrices && typeof price === "number" && (
                  <p className="plan-price">
                    <span className="plan-num">{formatNumber(price)}</span>
                    <span className="plan-cur">{o.currency}</span>
                    <span className="plan-unit">{o.unit}</span>
                  </p>
                )}
                <Link className="btn btn-red offer-card-btn" href={o.bookHref}>{dict.offerBook}</Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
