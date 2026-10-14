import { defineArrayMember, defineField, defineType } from "sanity";

// One block of a legal page: a heading plus its text. An array of these lets the
// admin add, remove and reorder sections freely, instead of one giant text box.
export const legalSection = defineType({
  name: "legalSection",
  title: "Section",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "localeString" }),
    defineField({ name: "body", title: "Body", type: "localeText",
      description: "Start a new line for a new paragraph." }),
  ],
  preview: {
    select: { title: "heading.en" },
    prepare: ({ title }) => ({ title: title || "Section" }),
  },
});

// A single document holding both pages, each in its own tab — same pattern as the
// other site-wide singletons (Site settings, Interface text, etc).
export const legalPages = defineType({
  name: "legalPages",
  title: "Privacy & Terms",
  type: "document",
  groups: [
    { name: "privacy", title: "Privacy Policy", default: true },
    { name: "terms", title: "Terms & Conditions" },
  ],
  fields: [
    defineField({ name: "privacyTitle", title: "Title", type: "localeString", group: "privacy" }),
    defineField({ name: "privacyUpdatedAt", title: "Last updated", type: "date", group: "privacy" }),
    defineField({
      name: "privacySections", title: "Sections", type: "array", group: "privacy",
      of: [defineArrayMember({ type: "legalSection" })],
    }),
    defineField({ name: "termsTitle", title: "Title", type: "localeString", group: "terms" }),
    defineField({ name: "termsUpdatedAt", title: "Last updated", type: "date", group: "terms" }),
    defineField({
      name: "termsSections", title: "Sections", type: "array", group: "terms",
      of: [defineArrayMember({ type: "legalSection" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Privacy & Terms" }) },
});
