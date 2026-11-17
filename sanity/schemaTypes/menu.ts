import { defineArrayMember, defineField, defineType } from "sanity";
import { MENU_GROUPS, MENU_TEXT } from "../../lib/menu";

// Everything about the food menu lives in this one document: the page texts, the WhatsApp number
// for requests, and every section and dish. Drag sections and dishes to reorder them.

const key = (s: string) => s.replace(/[^a-z0-9]/gi, "").toLowerCase();

// First time the document is opened, the Studio pre-fills it with the current menu.
// Press Publish once and the website starts reading the menu from here.
const initialSections = MENU_GROUPS.map((g) => ({
  _type: "menuSection",
  _key: `sec${key(g.id)}`,
  title: { _type: "localeString", en: g.en, ar: g.ar },
  kicker: g.kickerEn ? { _type: "localeString", en: g.kickerEn, ar: g.kickerAr } : undefined,
  art: g.art ?? "none",
  note: g.noteEn ? { _type: "localeText", en: g.noteEn, ar: g.noteAr } : undefined,
  items: g.items.map((i) => ({
    _type: "menuItem",
    _key: `it${key(i.id)}`,
    name: { _type: "localeString", en: i.en, ar: i.ar },
    price: i.price ?? undefined,
    priceText: i.priceText,
    note: i.noteEn ? { _type: "localeString", en: i.noteEn, ar: i.noteAr } : undefined,
  })),
}));

export const menuItem = defineType({
  name: "menuItem",
  title: "Dish or drink",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "price", title: "Price (EGP)", type: "number", validation: (r) => r.min(0),
      description: "Numbers only. Leave empty if the dish has no fixed price — guests can still request it and you confirm the price on WhatsApp." }),
    defineField({ name: "priceText", title: "Price as text (optional)", type: "string",
      description: "Shown instead of the number, e.g. 75 – 150 or 100 / 170. Use it when the price is a range." }),
    defineField({ name: "note", title: "Small note under the name (optional)", type: "localeString",
      description: "Example: the juice flavours." }),
    defineField({ name: "hidden", title: "Hide from the menu", type: "boolean", initialValue: false,
      description: "Turn on when it's finished today. Turn it off to bring it back." }),
  ],
  preview: {
    select: { en: "name.en", ar: "name.ar", price: "price", priceText: "priceText", hidden: "hidden" },
    prepare: ({ en, ar, price, priceText, hidden }) => ({
      title: `${hidden ? "(hidden) " : ""}${en || ar || "New item"}`,
      subtitle: priceText || (price != null ? `${price} EGP` : "No price"),
    }),
  },
});

export const menuSection = defineType({
  name: "menuSection",
  title: "Menu section",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "kicker", title: "Big heading above this section (optional)", type: "localeString",
      description: "Example: Main Course. Shows once, above this section." }),
    defineField({ name: "art", title: "Small drawing on the card", type: "string", initialValue: "none",
      options: { list: [
        { title: "None", value: "none" }, { title: "Pizza", value: "pizza" }, { title: "Fish", value: "fish" },
        { title: "Plate", value: "plate" }, { title: "Cold drink", value: "glass" }, { title: "Coffee pot", value: "moka" },
        { title: "Ice cream", value: "cone" },
      ] } }),
    defineField({ name: "note", title: "Notice (optional)", type: "localeText",
      description: "A message shown on the card, e.g. the seafood is prepared fresh on order." }),
    defineField({ name: "items", title: "Dishes & drinks", type: "array", of: [defineArrayMember({ type: "menuItem" })] }),
  ],
  preview: {
    select: { en: "title.en", ar: "title.ar", items: "items" },
    prepare: ({ en, ar, items }) => ({ title: en || ar || "New section", subtitle: `${(items || []).length} items` }),
  },
});

export const menu = defineType({
  name: "menu",
  title: "Menu",
  type: "document",
  initialValue: {
    showMenu: true,
    title: { _type: "localeString", en: MENU_TEXT.en.title, ar: MENU_TEXT.ar.title },
    place: { _type: "localeString", en: MENU_TEXT.en.place, ar: MENU_TEXT.ar.place },
    hint: { _type: "localeText", en: MENU_TEXT.en.hint, ar: MENU_TEXT.ar.hint },
    currency: { _type: "localeString", en: MENU_TEXT.en.currency, ar: MENU_TEXT.ar.currency },
    sections: initialSections,
  },
  groups: [
    { name: "dishes", title: "Sections & dishes", default: true },
    { name: "page", title: "Page & ordering" },
  ],
  fields: [
    defineField({ name: "sections", title: "Sections", type: "array", group: "dishes", of: [defineArrayMember({ type: "menuSection" })],
      description: "Drag to reorder. Open a section to edit, add, hide or reorder its dishes." }),
    defineField({ name: "showMenu", title: "Menu page is open", type: "boolean", group: "page", initialValue: true,
      description: "On by default. Turn off to hide the Menu page and its link from the website." }),
    defineField({ name: "title", title: "Page title", type: "localeString", group: "page" }),
    defineField({ name: "place", title: "Line under the title", type: "localeString", group: "page" }),
    defineField({ name: "hint", title: "Short instructions for guests", type: "localeText", group: "page" }),
    defineField({ name: "currency", title: "Currency label", type: "localeString", group: "page", description: "Shown next to the total. Example: EGP." }),
    defineField({ name: "whatsappNumber", title: "WhatsApp number for menu requests (optional)", type: "string", group: "page",
      description: "Digits only with country code. Leave empty to use the number from Site settings.",
      validation: (r) => r.regex(/^\d{8,15}$/, { name: "digits" }).error("Digits only, with country code, no + or spaces.") }),
  ],
  preview: { prepare: () => ({ title: "Menu" }) },
});
