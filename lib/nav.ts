import { localePath, type Dictionary } from "./i18n";
import type { Locale } from "./sanity/types";

export function navItems(lang: Locale, dict: Dictionary) {
  return [
    { href: localePath(lang, "/"), label: dict.navHome },
    { href: localePath(lang, "/cabins"), label: dict.navCabins },
    { href: localePath(lang, "/experiences"), label: dict.navExperiences },
    { href: localePath(lang, "/gallery"), label: dict.navGallery },
    { href: localePath(lang, "/booking"), label: dict.navBooking },
    { href: localePath(lang, "/about"), label: dict.navAbout },
  ];
}
