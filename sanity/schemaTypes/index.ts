import { localeString, localeText, sectionHeading } from "./locale";
import { siteSettings } from "./siteSettings";
import { homePage } from "./homePage";
import { interfaceText } from "./interfaceText";
import { cabin, activity, pricePlan, review } from "./content";
import { inquiry } from "./inquiry";

export const schemaTypes = [
  localeString, localeText, sectionHeading,
  siteSettings, homePage, interfaceText,
  cabin, activity, pricePlan, review, inquiry,
];

export const SINGLETONS = ["siteSettings", "homePage", "interfaceText"];
