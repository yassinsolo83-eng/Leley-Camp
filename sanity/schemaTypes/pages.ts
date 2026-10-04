import { defineField, defineType } from "sanity";

export const pages = defineType({
  name: "pages",
  title: "Other pages",
  type: "document",
  groups: [
    { name: "cabins", title: "Cabins", default: true },
    { name: "experiences", title: "Experiences" },
    { name: "gallery", title: "Gallery" },
    { name: "tour", title: "360° tour" },
    { name: "booking", title: "Prices & Booking" },
    { name: "about", title: "About" },
  ],
  fields: [
    defineField({ name: "cabins", title: "Cabins page", type: "pageHeader", group: "cabins" }),
    defineField({ name: "experiences", title: "Experiences page", type: "pageHeader", group: "experiences" }),
    defineField({ name: "gallery", title: "Gallery page", type: "pageHeader", group: "gallery" }),
    defineField({ name: "videoHeading", title: "Video heading", type: "sectionHeading", group: "gallery" }),
    defineField({ name: "tour", title: "360° tour page", type: "pageHeader", group: "tour",
      description: "Title and intro above the tour. The photo is not used here." }),
    defineField({ name: "booking", title: "Prices & Booking page", type: "pageHeader", group: "booking" }),
    defineField({ name: "pricesHeading", title: "Prices heading", type: "sectionHeading", group: "booking" }),
    defineField({ name: "formHeading", title: "Booking form heading", type: "sectionHeading", group: "booking" }),
    defineField({ name: "about", title: "About page", type: "pageHeader", group: "about" }),
    defineField({ name: "contactHeading", title: "Contact heading", type: "sectionHeading", group: "about" }),
  ],
  preview: { prepare: () => ({ title: "Other pages" }) },
});
