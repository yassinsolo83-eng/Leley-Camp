import { defineField, defineType } from "sanity";
import { DEFAULT_LABELS, type LabelKey } from "../../lib/i18n";

// Every button and small label on the site. English defaults live in lib/i18n.ts;
// anything filled in here replaces them.
const GROUPS: { name: string; title: string; keys: LabelKey[] }[] = [
  { name: "nav", title: "Menu & buttons", keys: ["navHome", "navCabins", "navExperiences", "navGallery", "navTour", "navBooking", "navAbout", "menu", "bookNow", "languageName", "heroCta", "whatsappUs", "chatWithUs"] },
  { name: "sections", title: "Sections", keys: ["ourStory", "tourCta", "fullscreen", "openInNewTab", "moreReviews", "viewCabin", "allCabins", "allExperiences", "seeAllPhotos", "bookThisCabin", "otherCabins", "amenities", "launchTour", "vrHint", "close", "previous", "next", "ratedByGuests", "viewOnMaps", "basedOnReviews", "choosePlan", "notFound", "backHome", "skipToContent"] },
  { name: "form", title: "Booking form", keys: ["formName", "formPhone", "formEmail", "formCheckIn", "formCheckOut", "formGuests", "formCabin", "formAnyCabin", "formPlan", "formNoPlan", "formMessage", "formSubmit", "formSending", "formSuccess", "formError", "formMissing", "formDates", "formAlsoWhatsapp", "formPromoCode", "formPromoChecking", "formPromoApplied", "formPromoInvalid"] },
  { name: "links", title: "Links & footer", keys: ["bookOnBooking", "bookOnBookingSub", "vrCard", "vrCardSub", "facebookCard", "facebookCardSub", "instagramCard", "callUs", "footerExplore", "footerContact", "googleMaps", "vrTour", "facebook", "instagram", "allRights", "visitors"] },
];

export const interfaceText = defineType({
  name: "interfaceText",
  title: "Interface text",
  type: "document",
  groups: GROUPS.map(({ name, title }, i) => ({ name, title, default: i === 0 })),
  fields: GROUPS.flatMap(({ name: group, keys }) =>
    keys.map((key) =>
      defineField({
        name: key,
        title: DEFAULT_LABELS[key],
        type: "localeString",
        group,
        description: key === "languageName" ? "The name of each language, shown on the language switch button." : undefined,
      })
    )
  ),
  preview: { prepare: () => ({ title: "Interface text" }) },
});
