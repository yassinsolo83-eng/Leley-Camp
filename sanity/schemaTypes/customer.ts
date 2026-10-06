import { defineField, defineType } from "sanity";

const TIERS = [
  { title: "New", value: "new" },
  { title: "Returning", value: "returning" },
  { title: "VIP", value: "vip" },
];

// One document per phone number. Created or updated automatically by
// app/api/inquiry/route.ts every time a booking request comes in — name, email,
// booking count, last-booking date and the link to each request are all kept in
// sync there. Tier is the one field the admin sets by hand; the system only ever
// suggests context (the booking count) and never changes the tier itself.
export const customer = defineType({
  name: "customer",
  title: "Customer",
  type: "document",
  fields: [
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      description: "The full international number (e.g. +201111509666) — how customers are matched across visits.",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "name", title: "Name", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
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
    // The "remember me on this device" token(s) — see the device-recognition note
    // in components/ReserveForm.tsx. Not meant to be read or edited by hand.
    defineField({ name: "deviceTokens", title: "Device tokens", type: "array", of: [{ type: "string" }], hidden: true }),
  ],
  orderings: [{ title: "Last booking, newest first", name: "lastBooking", by: [{ field: "lastBookingAt", direction: "desc" }] }],
  preview: {
    select: { name: "name", phone: "phone", tier: "tier", count: "bookingsCount" },
    prepare: ({ name, phone, tier, count }) => ({
      title: name || phone || "Customer",
      subtitle: [phone, tier ? tier[0].toUpperCase() + tier.slice(1) : "", count ? `${count} booking${count === 1 ? "" : "s"}` : ""]
        .filter(Boolean).join(" · "),
    }),
  },
});
