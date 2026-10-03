import type { Labels, Locale, Localized } from "./sanity/types";

export const LOCALES: Locale[] = ["en", "ar"];

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export function otherLocale(lang: Locale): Locale {
  return lang === "en" ? "ar" : "en";
}

/** Picks the text for the current language, falling back to English when a translation is empty. */
export function tr(value: Localized, lang: Locale): string {
  if (!value) return "";
  return (value[lang] || value.en || "").trim();
}

/** English defaults for interface text. Translations (and edits) come from "Interface text" in the Studio. */
export const DEFAULT_LABELS = {
  navAbout: "About",
  navCabins: "Cabins",
  navPrices: "Prices",
  navGallery: "Gallery",
  navBook: "Book",
  bookNow: "Book Now",
  languageName: "English",
  reserveCabin: "Reserve a Cabin",
  scroll: "scroll",
  launchTour: "Launch Tour",
  vrHint: "Drag to explore",
  close: "Close",
  ratedByGuests: "Rated by our guests",
  viewOnMaps: "View on Maps",
  basedOnReviews: "Based on verified Google reviews",
  choosePlan: "Choose this",
  formName: "Full name",
  formPhone: "Phone / WhatsApp",
  formEmail: "Email (optional)",
  formCheckIn: "Check-in",
  formCheckOut: "Check-out",
  formGuests: "Guests",
  formCabin: "Cabin",
  formAnyCabin: "No preference",
  formPlan: "Package",
  formNoPlan: "Not sure yet",
  formMessage: "Anything we should know? (optional)",
  formSubmit: "Send request",
  formSending: "Sending…",
  formSuccess: "Request received. We will contact you soon to confirm availability.",
  formError: "The request was not sent. Check the highlighted fields or message us on WhatsApp.",
  formMissing: "Please fill in your name, phone, dates and number of guests.",
  formDates: "Check-out must be after check-in.",
  formAlsoWhatsapp: "Send the same details on WhatsApp",
  bookOnBooking: "Book on Booking.com",
  bookOnBookingSub: "Check availability & prices",
  vrCard: "Virtual 360° Tour",
  vrCardSub: "Explore before you arrive",
  facebookCard: "Follow on Facebook",
  facebookCardSub: "Photos, videos & updates",
  instagramCard: "Follow on Instagram",
  footerExplore: "Explore",
  footerAboutUs: "About Us",
  footerContact: "Contact & Links",
  googleMaps: "Google Maps",
  vrTour: "VR Tour",
  facebook: "Facebook",
  instagram: "Instagram",
  allRights: "All rights reserved.",
  visitors: "visitors",
  chatWithUs: "Chat with us",
};

export type LabelKey = keyof typeof DEFAULT_LABELS;
export type Dictionary = Record<LabelKey, string>;

export function buildDictionary(labels: Labels | null, lang: Locale): Dictionary {
  const dict = {} as Dictionary;
  for (const key of Object.keys(DEFAULT_LABELS) as LabelKey[]) {
    dict[key] = tr(labels?.[key], lang) || DEFAULT_LABELS[key];
  }
  return dict;
}

export function whatsappLink(number: string | undefined, message: string) {
  const digits = (number || "").replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

/** "4 months ago" in the page language, computed from the review date. */
export function timeAgo(date: string | undefined, lang: Locale): string {
  if (!date) return "";
  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.round((Date.now() - then) / 86_400_000);
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  if (days < 30) return rtf.format(-Math.max(days, 0), "day");
  if (days < 365) return rtf.format(-Math.round(days / 30), "month");
  return rtf.format(-Math.round(days / 365), "year");
}
