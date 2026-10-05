import { defineField, defineType } from "sanity";
import { PromoCodeInput } from "../components/PromoCodeInput";

const STATUS = [
  { title: "Active", value: "active" },
  { title: "Disabled", value: "disabled" },
];

const DISCOUNT_TYPES = [
  { title: "Percentage off", value: "percentage" },
  { title: "Fixed amount off", value: "fixed" },
  { title: "Other perk (e.g. free drinks)", value: "perk" },
];

// A code stays active until the admin disables it here — there's no automatic
// single-use lock. "Times used" just counts how many booking requests used it.
export const promoCode = defineType({
  name: "promoCode",
  title: "Promo code",
  type: "document",
  fields: [
    defineField({
      name: "code",
      title: "Code",
      type: "string",
      description: "What the guest types in on the booking form. Type one yourself, or press Generate.",
      validation: (Rule) => Rule.required().regex(/^[A-Za-z0-9-]+$/, { name: "letters, numbers and dashes only" }),
      components: { input: PromoCodeInput },
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "active",
      options: { list: STATUS, layout: "radio", direction: "horizontal" },
    }),
    defineField({
      name: "discountType",
      title: "Discount type",
      type: "string",
      initialValue: "percentage",
      options: { list: DISCOUNT_TYPES },
    }),
    defineField({
      name: "value",
      title: "Amount",
      type: "number",
      description: "The number for a percentage (e.g. 15) or a fixed amount off (e.g. 500).",
      hidden: ({ parent }) => parent?.discountType === "perk",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "EGP",
      hidden: ({ parent }) => parent?.discountType !== "fixed",
    }),
    defineField({
      name: "perkDescription",
      title: "Perk shown to the guest",
      type: "string",
      description: 'What the guest sees once the code is accepted, e.g. "Two drinks on the house".',
      hidden: ({ parent }) => parent?.discountType !== "perk",
    }),
    defineField({
      name: "reason",
      title: "Reason",
      type: "string",
      description: "Why this discount exists. Internal only — the guest never sees this.",
    }),
    defineField({
      name: "source",
      title: "Referred by",
      type: "string",
      description: 'Who this is attributed to — a person\'s name, or "Solo Retreats". Internal only.',
    }),
    defineField({
      name: "expiresAt",
      title: "Expires on",
      type: "date",
      description: "Optional. Leave empty for no expiry.",
    }),
    defineField({
      name: "timesUsed",
      title: "Times used",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
  ],
  preview: {
    select: { code: "code", status: "status", discountType: "discountType", value: "value", currency: "currency", perk: "perkDescription", used: "timesUsed" },
    prepare: ({ code, status, discountType, value, currency, perk, used }) => ({
      title: `${status === "active" ? "✓ " : "✖ "}${code || "Untitled code"}`,
      subtitle: [
        discountType === "percentage" ? `${value ?? 0}% off`
          : discountType === "fixed" ? `${value ?? 0} ${currency || ""} off`
          : perk || "Perk",
        used ? `used ${used}×` : null,
      ].filter(Boolean).join(" · "),
    }),
  },
});
