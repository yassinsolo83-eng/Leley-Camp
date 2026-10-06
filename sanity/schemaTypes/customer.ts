import { defineField, defineType } from "sanity";

const TIERS = [
  { title: "New", value: "new" },
  { title: "Returning", value: "returning" },
  { title: "VIP", value: "vip" },
];

// One document per email address — email is how a guest signs in (a magic link sent
// to their inbox), so it's the one stable identity. Created the first time someone
// signs in; name, phone, booking count, last-booking date and the link to each
// request are all kept in sync automatically by app/api/inquiry/route.ts and
// app/api/auth/verify/route.ts. Tier is the one field the admin sets by hand — the
// system only ever suggests context (the booking count) and never changes it itself.
export const customer = defineType({
  name: "customer",
  title: "Customer",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "How this guest signs in. Matched exactly, so this is the one identity a customer record is keyed on.",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "name", title: "Name", type: "string", readOnly: true }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      description: "The full international number from their most recent booking request (e.g. +201111509666).",
      readOnly: true,
    }),
    defineField({
      name: "tier",
      title: "Tier",
      type: "string",
      initialValue: "new",
      options: { list: TIERS, layout: "radio", direction: "horizontal" },
      description: "Set this yourself — it's what decides which offers a customer gets. The system never changes it on its own.",
    }),
    defineField({ name: "bookingsCount", title: "Bookings so far", type: "number", initialValue: 0, readOnly: true }),
    defineField({ name: "lastBookingAt", title: "Last booking request", type: "datetime", readOnly: true }),
    defineField({
      name: "inquiries",
      title: "Booking history",
      type: "array",
      of: [{ type: "reference", to: [{ type: "inquiry" }] }],
      readOnly: true,
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 4,
      description: "Anything worth remembering about this customer — free text, for you only.",
    }),
  ],
  orderings: [{ title: "Last booking, newest first", name: "lastBooking", by: [{ field: "lastBookingAt", direction: "desc" }] }],
  preview: {
    select: { name: "name", email: "email", phone: "phone", tier: "tier", count: "bookingsCount" },
    prepare: ({ name, email, phone, tier, count }) => ({
      title: name || email || "Customer",
      subtitle: [email, phone, tier ? tier[0].toUpperCase() + tier.slice(1) : "", count ? `${count} booking${count === 1 ? "" : "s"}` : ""]
        .filter(Boolean).join(" · "),
    }),
  },
});
