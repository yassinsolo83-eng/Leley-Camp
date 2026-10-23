"use client";

import { useState } from "react";
import { formatNumber, tr, type Dictionary } from "@/lib/i18n";
import type { Locale, PricePlan } from "@/lib/sanity/types";

export const CHOOSE_PLAN_EVENT = "leley:choose-plan";

type GuestType = "egyptian" | "foreigner";

export default function PricePlans({
  plans, lang, dict, showPrices = true,
}: { plans: PricePlan[]; lang: Locale; dict: Dictionary; showPrices?: boolean }) {
  const [guestType, setGuestType] = useState<GuestType>("egyptian");
  const hasForeignerPrice = plans.some((p) => typeof p.priceForeigner === "number");

  if (!plans.length) return null;

  function choose(planName: string) {
    window.dispatchEvent(new CustomEvent(CHOOSE_PLAN_EVENT, { detail: planName }));
    document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
  }

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
      <div className="plans">
        {plans.map((p) => {
          const badge = p.featured ? tr(p.badge, lang) : "";
          const price = guestType === "foreigner" ? (p.priceForeigner ?? p.priceEgyptian) : p.priceEgyptian;
          return (
            <article key={p._id} className={`plan${p.featured ? " featured" : ""}`}>
              {badge && <p className="plan-badge">{badge}</p>}
              <h3 className="plan-name">{tr(p.name, lang)}</h3>
              {showPrices && (
                <p className="plan-price">
                  <span className="plan-num">{formatNumber(price ?? 0)}</span>
                  <span className="plan-cur">{p.currency}</span>
                  <span className="plan-unit">{tr(p.unit, lang)}</span>
                </p>
              )}
              {!!p.features?.length && (
                <ul className="plan-features">
                  {p.features.map((f, i) => {
                    const text = tr(f, lang);
                    return text ? <li key={i}>{text}</li> : null;
                  })}
                </ul>
              )}
              <button type="button" className={`btn ${p.featured ? "btn-red" : "btn-dark"} plan-btn`} onClick={() => choose(tr(p.name, "en"))}>
                {dict.choosePlan}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
