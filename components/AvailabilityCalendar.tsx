"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/sanity/types";

type Range = { from?: string; to?: string };

type Props = {
  blockedDates: Range[];
  lang: Locale;
  dict: { availabilityTitle: string; availabilityBooked: string; availabilityPrevMonth: string; availabilityNextMonth: string };
};

function toISO(d: Date) {
  const copy = new Date(d);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy.toISOString().slice(0, 10);
}

/** A read-only month grid showing which days are already booked for the selected cabin —
 * just a visual reference; the actual check-in/check-out inputs stay separate above it. */
export default function AvailabilityCalendar({ blockedDates, lang, dict }: Props) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const ranges = blockedDates.filter((r) => r.from && r.to) as { from: string; to: string }[];
  const isBlocked = (iso: string) => ranges.some((r) => iso >= r.from && iso <= r.to);

  const locale = lang === "ar" ? "ar-EG" : "en-GB";
  const monthLabel = month.toLocaleDateString(locale, { month: "long", year: "numeric" });
  const weekdayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2024, 0, 7 + i); // a known Sunday-start week
    return d.toLocaleDateString(locale, { weekday: "narrow" });
  });

  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay();
  const cells: (Date | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];

  const canGoBack = month.getFullYear() > today.getFullYear() || month.getMonth() > today.getMonth();

  return (
    <div className="availability-calendar">
      <div className="availability-head">
        <button type="button" aria-label={dict.availabilityPrevMonth} disabled={!canGoBack}
          onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}>‹</button>
        <span>{monthLabel}</span>
        <button type="button" aria-label={dict.availabilityNextMonth}
          onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}>›</button>
      </div>
      <div className="availability-grid availability-weekdays">
        {weekdayLabels.map((w, i) => <span key={i}>{w}</span>)}
      </div>
      <div className="availability-grid">
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const iso = toISO(d);
          const past = d < today;
          const blocked = isBlocked(iso);
          return (
            <span key={i} className={`availability-day${blocked ? " blocked" : ""}${past ? " past" : ""}`}>
              {d.getDate()}
            </span>
          );
        })}
      </div>
      <p className="availability-legend"><span className="availability-dot" /> {dict.availabilityBooked}</p>
    </div>
  );
}
