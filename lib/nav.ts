import { localePath, type Dictionary } from "./i18n";
import { MENU_TEXT } from "./menu";
import type { Locale } from "./sanity/types";

export function navItems(lang: Locale, dict: Dictionary, showMenu = true) {
  const items = [
    { href: localePath(lang, "/"), label: dict.navHome },
    { href: localePath(lang, "/cabins"), label: dict.navCabins },
    { href: localePath(lang, "/experiences"), label: dict.navExperiences },
    { href: localePath(lang, "/gallery"), label: dict.navGallery },
    { href: localePath(lang, "/tour"), label: dict.navTour },
    { href: localePath(lang, "/booking"), label: dict.navBooking },
    { href: localePath(lang, "/about"), label: dict.navAbout },
  ];
  // The Menu link sits after Experiences, unless the Studio closes the Menu page.
  if (showMenu) items.splice(3, 0, { href: localePath(lang, "/menu"), label: MENU_TEXT[lang].nav });
  return items;
}
