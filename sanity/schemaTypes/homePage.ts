import { defineArrayMember, defineField, defineType } from "sanity";

const heading = (name: string, title: string, group: string) =>
  defineField({ name, title, type: "sectionHeading", group });

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "about", title: "About" },
    { name: "headings", title: "Section headings" },
    { name: "media", title: "Gallery & video" },
  ],
  fields: [
    defineField({ name: "hero", title: "Top of page", type: "object", group: "hero", fields: [
      defineField({ name: "badge", title: "Small badge", type: "localeString" }),
      defineField({ name: "title", title: "Big title", type: "string" }),
      defineField({ name: "subtitle", title: "Subtitle", type: "localeText" }),
      defineField({ name: "image", title: "Background photo", type: "image", options: { hotspot: true } }),
    ]}),
    defineField({ name: "vrSection", title: "360° tour block", type: "object", group: "hero", fields: [
      defineField({ name: "title", title: "Title", type: "localeString" }),
      defineField({ name: "subtitle", title: "Subtitle", type: "localeString" }),
    ]}),

    defineField({ name: "about", title: "About", type: "object", group: "about", fields: [
      defineField({ name: "heading", title: "Heading", type: "sectionHeading", options: { collapsed: false } }),
      defineField({ name: "paragraphs", title: "Paragraphs", type: "array", of: [defineArrayMember({ type: "localeText" })] }),
      defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true } }),
      defineField({ name: "stats", title: "Numbers", type: "array", of: [defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "value", title: "Number", type: "string", description: "Example: 12+" }),
          defineField({ name: "label", title: "Label", type: "localeString" }),
        ],
        preview: { select: { title: "value", subtitle: "label.en" } },
      })]}),
    ]}),

    heading("cabinsHeading", "Cabins", "headings"),
    heading("pricesHeading", "Prices", "headings"),
    heading("activitiesHeading", "Activities", "headings"),
    heading("reviewsHeading", "Reviews", "headings"),
    heading("galleryHeading", "Gallery", "headings"),
    heading("videoHeading", "Video", "headings"),
    heading("inquiryHeading", "Booking request form", "headings"),
    heading("bookHeading", "Book & explore links", "headings"),

    defineField({ name: "gallery", title: "Gallery photos", type: "array", group: "media",
      description: "Drag to reorder. Wide photos take two columns.",
      of: [defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
          defineField({ name: "alt", title: "Short description", type: "localeString" }),
          defineField({ name: "wide", title: "Wide", type: "boolean", initialValue: false }),
        ],
        preview: { select: { media: "image", title: "alt.en", wide: "wide" },
          prepare: ({ media, title, wide }) => ({ media, title: title || "Photo", subtitle: wide ? "Wide" : "" }) },
      })],
    }),
    defineField({ name: "video", title: "Video (MP4)", type: "file", group: "media", options: { accept: "video/mp4" } }),
    defineField({ name: "videoPoster", title: "Video cover photo", type: "image", group: "media" }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
