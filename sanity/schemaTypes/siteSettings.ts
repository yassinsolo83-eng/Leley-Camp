import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "contact", title: "Contact & links", default: true },
    { name: "brand", title: "Brand" },
    { name: "seo", title: "SEO & sharing" },
    { name: "extras", title: "Extras" },
  ],
  fields: [
    defineField({ name: "whatsappNumber", title: "WhatsApp number", type: "string", group: "contact",
      description: "International format, digits only. Example: 201274057142",
      validation: (r) => r.regex(/^\d{8,15}$/, { name: "digits" }).error("Digits only, with country code, no + or spaces.") }),
    defineField({ name: "whatsappMessage", title: "WhatsApp opening message", type: "localeString", group: "contact",
      description: "Pre-filled text when a guest taps any WhatsApp button." }),
    defineField({ name: "phoneDisplay", title: "Phone number as shown on the site", type: "string", group: "contact" }),
    defineField({ name: "mapsUrl", title: "Google Maps link", type: "url", group: "contact" }),
    defineField({ name: "bookingUrl", title: "Booking.com link", type: "url", group: "contact" }),
    defineField({ name: "vrTourUrl", title: "360° tour link", type: "url", group: "contact" }),
    defineField({ name: "facebookUrl", title: "Facebook link", type: "url", group: "contact" }),
    defineField({ name: "instagramUrl", title: "Instagram link", type: "url", group: "contact" }),
    defineField({ name: "instagramHandle", title: "Instagram handle", type: "string", group: "contact", description: "Example: @leley.camp" }),

    defineField({ name: "campName", title: "Camp name", type: "string", group: "brand" }),
    defineField({ name: "logo", title: "Logo", type: "image", group: "brand" }),
    defineField({ name: "footerText", title: "Footer text", type: "localeText", group: "brand" }),
    defineField({ name: "rating", title: "Google rating", type: "number", group: "brand",
      validation: (r) => r.min(0).max(5) }),
    defineField({ name: "reviewCount", title: "Number of Google reviews", type: "number", group: "brand" }),

    defineField({ name: "siteUrl", title: "Website address", type: "url", group: "seo", description: "Example: https://leleycamp.com" }),
    defineField({ name: "metaTitle", title: "Page title (Google & browser tab)", type: "localeString", group: "seo" }),
    defineField({ name: "metaDescription", title: "Description (Google results)", type: "localeText", group: "seo" }),
    defineField({ name: "ogImage", title: "Sharing image (1200×630)", type: "image", group: "seo",
      description: "Shown when the link is shared on WhatsApp or Facebook." }),
    defineField({ name: "gaId", title: "Google Analytics ID", type: "string", group: "seo", description: "Example: G-2GFJWSF7KM" }),

    defineField({ name: "showVisitorCounter", title: "Show visitor counter in the footer", type: "boolean", group: "extras", initialValue: true }),
    defineField({ name: "visitorCounterOffset", title: "Number added to the real visitor count", type: "number", group: "extras",
      description: "Set to 0 to show the real count only.", initialValue: 0 }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
