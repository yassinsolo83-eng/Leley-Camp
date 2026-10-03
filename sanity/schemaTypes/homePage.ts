import { defineArrayMember, defineField, defineType } from "sanity";

const heading = (name: string, title: string, group: string) =>
  defineField({ name, title, type: "sectionHeading", group });

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "about", title: "Story" },
    { name: "headings", title: "Section headings" },
    { name: "media", title: "Photos & video" },
  ],
  fields: [
    defineField({ name: "hero", title: "Top of page", type: "object", group: "hero", fields: [
      defineField({ name: "badge", title: "Small line above the title", type: "localeString" }),
      defineField({ name: "title", title: "Big title", type: "localeString" }),
      defineField({ name: "subtitle", title: "Subtitle", type: "localeText" }),
      defineField({ name: "image", title: "Background photo", type: "image", options: { hotspot: true } }),
    ]}),
    defineField({ name: "vrSection", title: "360° tour block", type: "object", group: "hero", fields: [
      defineField({ name: "title", title: "Title", type: "localeString" }),
      defineField({ name: "subtitle", title: "Subtitle", type: "localeString" }),
    ]}),

    defineField({ name: "about", title: "Story", type: "object", group: "about",
      description: "The first paragraph shows on the home page; all of them show on the About page.",
      fields: [
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
      ],
    }),

    heading("cabinsHeading", "Cabins", "headings"),
    heading("activitiesHeading", "Experiences", "headings"),
    heading("reviewsHeading", "Reviews", "headings"),
    heading("galleryHeading", "Photos", "headings"),
    defineField({ name: "ctaBand", title: "Booking banner at the bottom", type: "object", group: "headings", fields: [
      defineField({ name: "title", title: "Title", type: "localeString" }),
      defineField({ name: "subtitle", title: "Subtitle", type: "localeText" }),
    ]}),

    defineField({ name: "gallery", title: "Gallery photos", type: "array", group: "media",
      description: "Shown on the Gallery page; the first six also show on the home page. Drag to reorder. Wide photos take two columns.",
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
