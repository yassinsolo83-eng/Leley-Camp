import { defineField, defineType } from "sanity";

// A single document type for every blocked date range across all cabins, so the
// admin can see and manage all of them from one list instead of opening each
// cabin separately. Each entry just points at the cabin it blocks.
export const blockedDate = defineType({
  name: "blockedDate",
  title: "Blocked date",
  type: "document",
  fields: [
    defineField({ name: "cabin", title: "Cabin", type: "reference", to: [{ type: "cabin" }], validation: (r) => r.required() }),
    defineField({ name: "from", title: "From", type: "date", validation: (r) => r.required() }),
    defineField({ name: "to", title: "To", type: "date", validation: (r) => r.required() }),
    defineField({ name: "note", title: "Note", type: "string", description: "Optional, for your own reference — e.g. a guest's name." }),
  ],
  orderings: [{ title: "Start date", name: "fromAsc", by: [{ field: "from", direction: "asc" }] }],
  preview: {
    select: { cabin: "cabin.name.en", from: "from", to: "to", note: "note" },
    prepare: ({ cabin, from, to, note }) => ({
      title: `${cabin || "Cabin"}: ${from || "?"} → ${to || "?"}`,
      subtitle: note,
    }),
  },
});
