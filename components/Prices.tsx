"use client";

import { tr, type Dictionary } from "@/lib/i18n";
import type { Locale, PricePlan, SectionHeading as Heading } from "@/lib/sanity/types";
import SectionHeading from "./SectionHeading";

export const CHOOSE_PLAN_EVENT = "leley:choose-plan";

type Props = { heading?: Heading; plans: PricePlan[]; lang: Locale; dict: Dictionary };

export default function Prices({ heading, plans, lang, dict }: Props) {
  if (!plans.length) return null;

  function choose(planName: string) {
    window.dispatchEvent(new CustomEvent(CHOOSE_PLAN_EVENT, { detail: planName }));
    document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
  }

  const format = new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US");

  return (
    <section id="prices">
      <div className="container">
        <SectionHeading heading={heading} lang={lang} center />
        <div className="prices-grid">
          {plans.map((p) => {
            const name = tr(p.name, lang);
            return (
              <article key={p._id} className={`price-card${p.featured ? " featured" : ""}`} data-badge={p.featured ? tr(p.badge, lang) || undefined : undefined}>
                <h3 className="price-name">{name}</h3>
                <div className="price-amount">
                  <span className="price-num">{format.format(p.price ?? 0)}</span>
                  <span className="price-currency">{p.currency}</span>
                  <span className="price-unit">{tr(p.unit, lang)}</span>
                </div>
                {!!p.features?.length && (
                  <>
                    <div className="price-divider" />
                    <ul className="price-features">
                      {p.features.map((f, i) => {
                        const text = tr(f, lang);
                        return text ? <li key={i}>{text}</li> : null;
                      })}
                    </ul>
                  </>
                )}
                <button type="button" className="price-btn" onClick={() => choose(tr(p.name, "en") || name)}>
                  {dict.choosePlan}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
