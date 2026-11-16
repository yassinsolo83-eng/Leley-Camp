import { defineField, defineType } from "sanity";
import { OfferSocialImages } from "../components/OfferSocialImages";

export const offer = defineType({
  name: "offer",
  title: "Offer",
  type: "document",
  fields: [
    defineField({ name: "active", title: "Show on the website", type: "boolean", initialValue: true,
      description: "Turn off to hide this offer. It also hides by itself once the \"to\" date arrives." }),
    defineField({ name: "title", title: "Offer title", type: "localeString", validation: (r) => r.required(),
      description: "Example: Full-moon weekend" }),
    defineField({ name: "description", title: "Short description", type: "localeText" }),
    defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "plan", title: "Package", type: "reference", to: [{ type: "pricePlan" }],
      description: "The package this offer is for. \"Book this offer\" selects it in the booking form.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "startDate", title: "Offer dates — from", type: "date", validation: (r) => r.required(),
      description: "Filled in as the check-in date when the guest books this offer." }),
    defineField({
      name: "endDate", title: "Offer dates — to", type: "date",
      description: "Filled in as the check-out date when the guest books this offer.",
      validation: (r) => r.required().custom((value, ctx) => {
        const start = (ctx.parent as { startDate?: string })?.startDate;
        return !value || !start || value > start ? true : "Must be after the start date.";
      }),
    }),
    defineField({ name: "priceEgyptian", title: "Offer price — Egyptian", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "priceForeigner", title: "Offer price — Foreigner", type: "number", validation: (r) => r.min(0),
      description: "Leave empty to charge the same price as Egyptian guests." }),
    defineField({ name: "currency", title: "Currency", type: "string", initialValue: "EGP" }),
    defineField({ name: "unit", title: "Per", type: "localeString", description: "Example: / night per person" }),
    defineField({ name: "tickerText", title: "Moving bar text", type: "localeString",
      description: "Text in the moving bar at the top of the site. Leave empty to use the offer title." }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 10,
      description: "Lower numbers show first. The first offer is the one in the pop-up." }),
    defineField({
      name: "socialImages", title: "Images for Facebook & Instagram", type: "string", readOnly: true,
      description: "Ready-sized images of this offer — download them and post them as they are.",
      components: { field: OfferSocialImages },
    }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title.en", from: "startDate", to: "endDate", price: "priceEgyptian", currency: "currency", active: "active", media: "image" },
    prepare: ({ title, from, to, price, currency, active, media }) => ({
      title: title || "Offer",
      subtitle: `${from || "?"} → ${to || "?"} · ${price ?? "—"} ${currency || ""}${active === false ? " · hidden" : ""}`,
      media,
    }),
  },
});
