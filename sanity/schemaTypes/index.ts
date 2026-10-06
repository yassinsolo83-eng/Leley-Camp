import { localeString, localeText, sectionHeading, pageHeader } from "./locale";
import { siteSettings } from "./siteSettings";
import { homePage } from "./homePage";
import { pages } from "./pages";
import { interfaceText } from "./interfaceText";
import { cabin, activity, pricePlan, review } from "./content";
import { inquiry } from "./inquiry";
import { promoCode } from "./promoCode";
import { customer } from "./customer";
import { visitorCounter } from "./visitorCounter";

export const schemaTypes = [
  localeString, localeText, sectionHeading, pageHeader,
  siteSettings, homePage, pages, interfaceText, visitorCounter,
  cabin, activity, pricePlan, review, inquiry, promoCode, customer,
];

export const SINGLETONS = ["siteSettings", "homePage", "pages", "interfaceText", "visitorCounter"];
