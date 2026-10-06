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
    // Who placed this request, from their signed-in session — not the free-text name/phone
    // on the request itself, which the guest can still edit each time they book.
    defineField({
      name: "customer", title: "Customer", type: "reference", to: [{ type: "customer" }],
      group: ["request", "handling"], readOnly: true,
    }),
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
    // A snapshot of the package's price as it was at submission time — not a live
    // reference, so this stays accurate even if the plan's price changes later.
    ...[
      defineField({ name: "planPrice", title: "Package price", type: "number" }),
      defineField({ name: "planCurrency", title: "Currency", type: "string" }),
      defineField({ name: "planUnit", title: "Per", type: "string" }),
    ].map((f) => ({ ...f, group: ["request", "handling"], readOnly: true, hidden: ({ parent }: { parent?: { planPrice?: number } }) => parent?.planPrice == null })),
    // A snapshot of the promo code as it was at submission time — not a live reference,
    // so this stays accurate even if the code is edited or disabled afterwards.
    ...[
      defineField({ name: "promoCode", title: "Promo code used", type: "string" }),
      defineField({ name: "promoDiscountType", title: "Discount type", type: "string" }),
      defineField({ name: "promoValue", title: "Amount", type: "number" }),
      defineField({ name: "promoCurrency", title: "Currency", type: "string" }),
      defineField({ name: "promoPerkDescription", title: "Perk", type: "string" }),
      defineField({ name: "promoReason", title: "Discount reason", type: "string" }),
      defineField({ name: "promoSource", title: "Referred by", type: "string" }),
    ].map((f) => ({ ...f, group: ["request", "handling"], readOnly: true, hidden: ({ parent }: { parent?: { promoCode?: string } }) => !parent?.promoCode })),
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: {
    select: { name: "name", checkIn: "checkIn", checkOut: "checkOut", guests: "guests", status: "status", promoCode: "promoCode" },
    prepare: ({ name, checkIn, checkOut, guests, status, promoCode }) => ({
      title: `${status === "new" ? "🆕 " : status === "confirmed" ? "✅ " : status === "cancelled" ? "✖️ " : "📞 "}${name || "Request"}`,
      subtitle: [checkIn && checkOut ? `${checkIn} → ${checkOut}` : "", guests ? `${guests} guests` : "", promoCode ? `🏷️ ${promoCode}` : ""].filter(Boolean).join(" · "),
    }),
  },
});
