import { defineField, defineType } from "sanity";

const STATUS = [
  { title: "New", value: "new" },
  { title: "Contacted", value: "contacted" },
  { title: "Confirmed", value: "confirmed" },
  { title: "Cancelled", value: "cancelled" },
];

export const inquiry = defineType({
  name: "inquiry",
  title: "Booking request",
  type: "document",
  groups: [
    { name: "handling", title: "Follow-up", default: true },
    { name: "request", title: "Request" },
  ],
  fields: [
    defineField({ name: "status", title: "Status", type: "string", group: "handling", initialValue: "new",
      options: { list: STATUS, layout: "radio", direction: "horizontal" } }),
    defineField({ name: "notes", title: "Internal notes", type: "text", rows: 3, group: "handling" }),
    ...[
      defineField({ name: "name", title: "Name", type: "string" }),
      defineField({ name: "phone", title: "Phone / WhatsApp", type: "string" }),
      defineField({ name: "email", title: "Email", type: "string" }),
      defineField({ name: "checkIn", title: "Check-in", type: "date" }),
      defineField({ name: "checkOut", title: "Check-out", type: "date" }),
      defineField({ name: "guests", title: "Guests", type: "number" }),
      defineField({ name: "cabin", title: "Cabin", type: "string" }),
      defineField({ name: "plan", title: "Package", type: "string" }),
      defineField({ name: "message", title: "Message", type: "text", rows: 4 }),
      defineField({ name: "language", title: "Site language", type: "string" }),
      defineField({ name: "submittedAt", title: "Sent at", type: "datetime" }),
    ].map((f) => ({ ...f, group: ["request", "handling"], readOnly: true })),
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: {
    select: { name: "name", checkIn: "checkIn", checkOut: "checkOut", guests: "guests", status: "status" },
    prepare: ({ name, checkIn, checkOut, guests, status }) => ({
      title: `${status === "new" ? "🆕 " : status === "confirmed" ? "✅ " : status === "cancelled" ? "✖️ " : "📞 "}${name || "Request"}`,
      subtitle: [checkIn && checkOut ? `${checkIn} → ${checkOut}` : "", guests ? `${guests} guests` : ""].filter(Boolean).join(" · "),
    }),
  },
});
