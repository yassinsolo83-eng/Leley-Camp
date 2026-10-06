"use client";

import { useEffect, useState } from "react";
import { formatNumber, whatsappLink, type Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/sanity/types";
import { COUNTRIES, DEFAULT_COUNTRY, flagEmoji, splitPhone } from "@/lib/countries";
import { CHOOSE_PLAN_EVENT } from "./PricePlans";
import { WhatsAppIcon } from "./icons";

type Option = { value: string; label: string; slug?: string; price?: number; currency?: string; unit?: string; guestsIncluded?: number };

type Props = {
  cabins: Option[];
  plans: Option[];
  whatsappNumber?: string;
  lang: Locale;
  dict: Dictionary;
};

type Fields = {
  name: string; phone: string; phoneCountry: string; email: string; checkIn: string; checkOut: string;
  guests: string; cabin: string; plan: string; message: string; company: string; promoCode: string;
};

type PromoResult = { discountType: string; value: number | null; currency: string | null; perkDescription: string | null };

const EMPTY: Fields = {
  name: "", phone: "", phoneCountry: DEFAULT_COUNTRY, email: "", checkIn: "", checkOut: "",
  guests: "2", cabin: "", plan: "", message: "", company: "", promoCode: "",
};
const REQUIRED: (keyof Fields)[] = ["name", "phone", "checkIn", "checkOut", "guests"];
const DEVICE_TOKEN_KEY = "leley_device_token";

// The country code is explicit (picked, never guessed from the digits), so this
// always comes out as one clean, unambiguous international number — no local "0"
// trunk prefix left over from habit, no heuristics needed to match it up later.
function fullPhone(f: Fields) {
  return `${f.phoneCountry}${f.phone.replace(/^0+/, "")}`;
}

function today() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export default function ReserveForm({ cabins, plans, whatsappNumber, lang, dict }: Props) {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [invalid, setInvalid] = useState<(keyof Fields)[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [sentSummary, setSentSummary] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [promoResult, setPromoResult] = useState<PromoResult | null>(null);
  const [planJustChosen, setPlanJustChosen] = useState(false);
  const [deviceToken, setDeviceToken] = useState("");
  const [welcomeName, setWelcomeName] = useState("");
  const [recognized, setRecognized] = useState(false);

  // A random, meaningless token kept in this browser only — not a login, not tied to
  // anything identifying the device itself. It's how a returning guest on the same
  // browser gets greeted by name without typing anything. If recognize() finds a
  // customer for it, the empty fields below are filled in for them.
  useEffect(() => {
    try {
      let token = window.localStorage.getItem(DEVICE_TOKEN_KEY) || "";
      if (!token) {
        token = crypto.randomUUID();
        window.localStorage.setItem(DEVICE_TOKEN_KEY, token);
      }
      setDeviceToken(token);
      fetch("/api/customer/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceToken: token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data?.found) return;
          setRecognized(true);
          if (data.name) setWelcomeName(data.name);
          setFields((f) => {
            if (f.name || f.phone) return f; // guest already typed something — don't overwrite
            const { dial, local } = data.phone ? splitPhone(data.phone) : { dial: f.phoneCountry, local: "" };
            return { ...f, name: data.name || f.name, phoneCountry: dial || f.phoneCountry, phone: local || f.phone, email: data.email || f.email };
          });
        })
        .catch(() => {});
    } catch {
      // localStorage can be unavailable (private mode, etc.) — recognition just skips.
    }
  }, []);

  // When a guest who wasn't device-recognized finishes typing their phone number, a
  // name-only lookup (see app/api/customer/lookup) fills in Name if it's still empty —
  // a light touch for a returning guest on a new browser, with nothing else revealed.
  function onPhoneBlur() {
    if (recognized || fields.name.trim() || !fields.phone.trim()) return;
    fetch(`/api/customer/lookup?phone=${encodeURIComponent(fullPhone(fields))}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.found && data.name) setFields((f) => (f.name.trim() ? f : { ...f, name: data.name }));
      })
      .catch(() => {});
  }

  // Checks the promo code against /api/promo a moment after the guest stops typing.
  // The reason/source behind the discount are never sent to the browser — only the
  // discount itself (see app/api/promo/route.ts).
  useEffect(() => {
    const code = fields.promoCode.trim();
    if (!code) {
      setPromoStatus("idle");
      setPromoResult(null);
      return;
    }
    setPromoStatus("checking");
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/promo?code=${encodeURIComponent(code)}`, { signal: controller.signal });
        const data = await res.json();
        if (data?.valid) {
          setPromoResult({ discountType: data.discountType, value: data.value, currency: data.currency, perkDescription: data.perkDescription });
          setPromoStatus("valid");
        } else {
          setPromoResult(null);
          setPromoStatus("invalid");
        }
      } catch {
        if (!controller.signal.aborted) {
          setPromoResult(null);
          setPromoStatus("invalid");
        }
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [fields.promoCode]);

  // Sets the plan and, if that plan has a fixed headcount (Double → 2, Triple → 3),
  // fills Guests to match — used by both the "Choose this" buttons and the dropdown
  // below, so the two stay consistent. The guest can still type a different number
  // afterwards; this only sets the starting value at the moment of choosing.
  function applyPlan(value: string) {
    setFields((f) => {
      const match = plans.find((p) => p.value === value);
      const guests = match?.guestsIncluded ? String(match.guestsIncluded) : f.guests;
      return { ...f, plan: value, guests };
    });
    setInvalid((list) => list.filter((k) => k !== "plan" && k !== "guests"));
  }

  // A "Choose this" button in the prices section pre-selects the package here.
  useEffect(() => {
    const onChoose = (e: Event) => {
      applyPlan(String((e as CustomEvent).detail || ""));
      setPlanJustChosen(true);
    };
    window.addEventListener(CHOOSE_PLAN_EVENT, onChoose);
    return () => window.removeEventListener(CHOOSE_PLAN_EVENT, onChoose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans]);

  // The pulse is a one-off cue for the moment of choosing — switch it off shortly after
  // so it doesn't linger or replay if the component re-renders for another reason.
  useEffect(() => {
    if (!planJustChosen) return;
    const t = setTimeout(() => setPlanJustChosen(false), 1300);
    return () => clearTimeout(t);
  }, [planJustChosen]);

  // "Book this cabin" links arrive as /booking?cabin=<slug>#reserve.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("cabin");
    const match = slug && cabins.find((c) => c.slug === slug);
    if (match) setFields((f) => ({ ...f, cabin: match.value }));
  }, [cabins]);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setInvalid((list) => list.filter((k) => k !== key));
  };

  function promoText(r: PromoResult) {
    if (r.discountType === "percentage" && r.value) return `${dict.formPromoApplied} — ${r.value}%`;
    if (r.discountType === "fixed" && r.value) return `${dict.formPromoApplied} — ${r.value} ${r.currency || ""}`.trim();
    if (r.discountType === "perk" && r.perkDescription) return `${dict.formPromoApplied} — ${r.perkDescription}`;
    return dict.formPromoApplied;
  }

  const selectedPlan = plans.find((p) => p.value === fields.plan);

  function summary(f: Fields) {
    const label = (list: Option[], value: string) => list.find((o) => o.value === value)?.label || value;
    return [
      `${dict.formName}: ${f.name}`,
      `${dict.formPhone}: ${fullPhone(f)}`,
      `${dict.formCheckIn}: ${f.checkIn}`,
      `${dict.formCheckOut}: ${f.checkOut}`,
      `${dict.formGuests}: ${f.guests}`,
      f.cabin && `${dict.formCabin}: ${label(cabins, f.cabin)}`,
      f.plan && `${dict.formPlan}: ${label(plans, f.plan)}`,
      f.promoCode && `${dict.formPromoCode}: ${f.promoCode}`,
      f.message && f.message,
    ].filter(Boolean).join("\n");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const missing = REQUIRED.filter((k) => !fields[k].trim());
    if (missing.length) {
      setInvalid(missing);
      setStatus("error");
      setError(dict.formMissing);
      return;
    }
    if (fields.checkOut <= fields.checkIn) {
      setInvalid(["checkOut"]);
      setStatus("error");
      setError(dict.formDates);
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          phone: fullPhone(fields),
          planPrice: selectedPlan?.price,
          planCurrency: selectedPlan?.currency,
          planUnit: selectedPlan?.unit,
          deviceToken,
          language: lang,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSentSummary(summary(fields));
      setStatus("sent");
      setFields(EMPTY);
    } catch {
      setStatus("error");
      setError(dict.formError);
    }
  }

  const cls = (key: keyof Fields, full = false) => `field${full ? " full" : ""}${invalid.includes(key) ? " invalid" : ""}`;
  const wa = sentSummary ? whatsappLink(whatsappNumber, sentSummary) : "";
  const clearPlan = () => {
    setFields((f) => ({ ...f, plan: "" }));
    setPlanJustChosen(false);
  };

  return (
          <form className="reserve-form" onSubmit={submit} noValidate>
            {recognized && welcomeName && (
              <p className="form-note welcome">{dict.formWelcomeBack.replace("{name}", welcomeName)}</p>
            )}
            {selectedPlan && (
              <div className={`plan-confirm${planJustChosen ? " pulse" : ""}`}>
                <div>
                  <p className="plan-confirm-label">{dict.formPlanSelected}</p>
                  <p className="plan-confirm-name">{selectedPlan.label}</p>
                  {typeof selectedPlan.price === "number" && (
                    <p className="plan-confirm-price">
                      {formatNumber(selectedPlan.price)} {selectedPlan.currency} {selectedPlan.unit}
                    </p>
                  )}
                </div>
                <button type="button" className="plan-confirm-clear" onClick={clearPlan}>
                  {dict.formPlanClear}
                </button>
              </div>
            )}
            <div className={cls("name", true)}>
              <label htmlFor="r-name">{dict.formName}</label>
              <input id="r-name" autoComplete="name" value={fields.name} onChange={set("name")} required maxLength={100} />
            </div>
            <div className={cls("phone")}>
              <label htmlFor="r-phone">{dict.formPhone}</label>
              <div className="phone-field" dir="ltr">
                <select
                  aria-label={dict.formPhoneCountry} value={fields.phoneCountry}
                  onChange={(e) => setFields((f) => ({ ...f, phoneCountry: e.target.value }))}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.iso} value={c.dial}>
                      {flagEmoji(c.iso)} {c.dial} {c.name}
                    </option>
                  ))}
                </select>
                <input id="r-phone" type="tel" dir="ltr" autoComplete="tel" inputMode="numeric" value={fields.phone} onChange={set("phone")} onBlur={onPhoneBlur} required maxLength={14} />
              </div>
            </div>
            <div className={cls("email")}>
              <label htmlFor="r-email">{dict.formEmail}</label>
              <input id="r-email" type="email" dir="ltr" autoComplete="email" value={fields.email} onChange={set("email")} maxLength={120} />
            </div>
            <div className={cls("checkIn")}>
              <label htmlFor="r-in">{dict.formCheckIn}</label>
              <input id="r-in" type="date" min={today()} value={fields.checkIn} onChange={set("checkIn")} required />
            </div>
            <div className={cls("checkOut")}>
              <label htmlFor="r-out">{dict.formCheckOut}</label>
              <input id="r-out" type="date" min={fields.checkIn || today()} value={fields.checkOut} onChange={set("checkOut")} required />
            </div>
            <div className={cls("guests")}>
              <label htmlFor="r-guests">{dict.formGuests}</label>
              <input
                id="r-guests" type="number" inputMode="numeric" min={1} max={50}
                value={fields.guests} onChange={set("guests")} required
                disabled={!!selectedPlan?.guestsIncluded}
              />
              {!!selectedPlan?.guestsIncluded && <span className="field-hint checking">{dict.formGuestsFixed}</span>}
            </div>
            {cabins.length > 0 && (
              <div className={cls("cabin")}>
                <label htmlFor="r-cabin">{dict.formCabin}</label>
                <select id="r-cabin" value={fields.cabin} onChange={set("cabin")}>
                  <option value="">{dict.formAnyCabin}</option>
                  {cabins.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            )}
            {plans.length > 0 && (
              <div className={cls("plan", true)}>
                <label htmlFor="r-plan">{dict.formPlan}</label>
                <select id="r-plan" value={fields.plan} onChange={(e) => applyPlan(e.target.value)}>
                  <option value="">{dict.formNoPlan}</option>
                  {plans.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            )}
            <div className={cls("promoCode", true)}>
              <label htmlFor="r-promo">{dict.formPromoCode}</label>
              <input id="r-promo" dir="ltr" autoComplete="off" value={fields.promoCode} onChange={set("promoCode")} maxLength={40} />
              {promoStatus === "checking" && <span className="field-hint checking">{dict.formPromoChecking}</span>}
              {promoStatus === "valid" && promoResult && <span className="field-hint ok">{promoText(promoResult)}</span>}
              {promoStatus === "invalid" && <span className="field-hint bad">{dict.formPromoInvalid}</span>}
            </div>

            <div className={cls("message", true)}>
              <label htmlFor="r-message">{dict.formMessage}</label>
              <textarea id="r-message" value={fields.message} onChange={set("message")} maxLength={1500} />
            </div>

            {/* Left empty by people; bots fill it in. */}
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="r-company">Company</label>
              <input id="r-company" tabIndex={-1} autoComplete="off" value={fields.company} onChange={set("company")} />
            </div>

            {status === "error" && error && <p className="form-note error" role="alert">{error}</p>}
            {status === "sent" && (
              <p className="form-note success" role="status">
                {dict.formSuccess}
                {wa && (
                  <>
                    <br />
                    <a className="form-wa" href={wa} target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon size={15} color="#25D366" /> {dict.formAlsoWhatsapp}
                    </a>
                  </>
                )}
              </p>
            )}

            <div className="form-actions">
              <button className="btn btn-red form-submit" type="submit" disabled={status === "sending"}>
                {status === "sending" ? dict.formSending : dict.formSubmit}
              </button>
            </div>
          </form>
  );
}
