import { formatNumber, tr, type Dictionary } from "./i18n";
import { imagePosition, imageUrl } from "./sanity/image";
import type { Locale, Offer } from "./sanity/types";

/** "12 – 15 Dec 2026" in the page language, always with Western digits. */
export function offerDates(offer: Offer, lang: Locale): string {
  if (!offer.startDate || !offer.endDate) return "";
  const locale = lang === "ar" ? "ar-EG-u-nu-latn" : "en-GB";
  const fmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  return fmt.formatRange(new Date(`${offer.startDate}T00:00:00Z`), new Date(`${offer.endDate}T00:00:00Z`));
}

/** Price lines for the pop-up and moving bar — both guest types when they differ. Empty when prices are hidden. */
export function offerPriceLines(offer: Offer, lang: Locale, dict: Dictionary, showPrices: boolean): string[] {
  if (!showPrices || typeof offer.priceEgyptian !== "number") return [];
  const tail = [offer.currency, tr(offer.unit, lang)].filter(Boolean).join(" ");
  const line = (n: number) => `${formatNumber(n)} ${tail}`.trim();
  const foreigner = offer.priceForeigner;
  if (typeof foreigner !== "number" || foreigner === offer.priceEgyptian) return [line(offer.priceEgyptian)];
  return [`${dict.guestEgyptian}: ${line(offer.priceEgyptian)}`, `${dict.guestForeigner}: ${line(foreigner)}`];
}

export function promoOffers(offers: Offer[], lang: Locale, dict: Dictionary, showPrices: boolean) {
  return offers.map((o) => {
    const title = tr(o.title, lang);
    return {
      id: o._id,
      title,
      description: tr(o.description, lang),
      image: imageUrl(o.image),
      imagePosition: imagePosition(o.image),
      dates: offerDates(o, lang),
      prices: offerPriceLines(o, lang, dict, showPrices),
      ticker: tr(o.tickerText, lang) || title,
    };
  });
}
