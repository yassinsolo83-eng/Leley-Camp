import { defineArrayMember, defineField, defineType } from "sanity";

const order = defineField({ name: "order", title: "Order on the page", type: "number", description: "Lower numbers show first.", initialValue: 10 });

export const cabin = defineType({
  name: "cabin",
  title: "Cabin",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Page address", type: "slug", options: { source: "name.en", maxLength: 60 },
      description: "The end of this cabin's page link, e.g. sea-view → /en/cabins/sea-view",
      validation: (r) => r.required() }),
    defineField({ name: "description", title: "Short description", type: "localeText", description: "Shown on cards." }),
    defineField({ name: "tag", title: "Tag", type: "localeString", description: "Example: 🛏 Twin · Balcony" }),
    defineField({ name: "image", title: "Main photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "details", title: "Full description", type: "array", of: [defineArrayMember({ type: "localeText" })],
      description: "Paragraphs shown on the cabin's own page." }),
    defineField({ name: "amenities", title: "What's inside", type: "array", of: [defineArrayMember({ type: "localeString" })] }),
    defineField({ name: "photos", title: "More photos", type: "array", of: [defineArrayMember({ type: "image", options: { hotspot: true } })] }),
    order,
  ],
  preview: { select: { title: "name.en", subtitle: "tag.en", media: "image" } },
});

export const activity = defineType({
  name: "activity",
  title: "Activity",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
    defineField({ name: "icon", title: "Emoji", type: "string", description: "Example: 🤿" }),
    defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true } }),
    order,
  ],
  preview: { select: { title: "name.en", icon: "icon", media: "image" },
    prepare: ({ title, icon, media }) => ({ title: `${icon ? `${icon} ` : ""}${title || "Activity"}`, media }) },
});

export const pricePlan = defineType({
  name: "pricePlan",
  title: "Price plan",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "price", title: "Price", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "currency", title: "Currency", type: "string", initialValue: "EGP" }),
    defineField({ name: "unit", title: "Per", type: "localeString", description: "Example: / night per person" }),
    defineField({
      name: "guestsIncluded", title: "Guests this fits", type: "number",
      description: "If this package is for a fixed number of guests (Double → 2, Triple → 3), enter it here — the booking form fills in the Guests field automatically when the guest picks it. Leave empty for packages without a fixed headcount.",
      validation: (r) => r.min(1).integer(),
    }),
    defineField({ name: "features", title: "What's included", type: "array", of: [defineArrayMember({ type: "localeString" })] }),
    defineField({ name: "featured", title: "Highlight this plan", type: "boolean", initialValue: false }),
    defineField({ name: "badge", title: "Highlight badge", type: "localeString", description: "Example: Most popular", hidden: ({ parent }) => !parent?.featured }),
    defineField({ name: "active", title: "Show on the website", type: "boolean", initialValue: true }),
    order,
  ],
  preview: { select: { title: "name.en", price: "price", currency: "currency", active: "active", guests: "guestsIncluded" },
    prepare: ({ title, price, currency, active, guests }) => ({
      title: title || "Plan",
      subtitle: `${price ?? "—"} ${currency || ""}${guests ? ` · fits ${guests}` : ""}${active === false ? " · hidden" : ""}`,
    }) },
});

export const review = defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    defineField({ name: "author", title: "Guest name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "text", title: "Review", type: "text", rows: 5, description: "Paste it exactly as the guest wrote it.", validation: (r) => r.required() }),
    defineField({ name: "rating", title: "Stars", type: "number", initialValue: 5, validation: (r) => r.required().min(1).max(5).integer() }),
    defineField({ name: "source", title: "Where it was posted", type: "string", initialValue: "Google" }),
    defineField({ name: "badge", title: "Reviewer badge", type: "string", description: "Optional. Example: Local Guide" }),
    defineField({ name: "date", title: "Review date", type: "date", description: "The site shows it as \"4 months ago\" and keeps it up to date." }),
    order,
  ],
  preview: { select: { title: "author", subtitle: "text" } },
});
