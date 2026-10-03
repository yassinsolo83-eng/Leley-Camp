import { defineField, defineType } from "sanity";

export const visitorCounter = defineType({
  name: "visitorCounter",
  title: "Visitor counter",
  type: "document",
  fields: [
    defineField({ name: "count", title: "Visitors", type: "number", initialValue: 0,
      description: "Goes up by one for every new visitor (each browser is counted once). You can change the number here; new visits keep adding to it.",
      validation: (r) => r.min(0).integer() }),
    defineField({ name: "showOnSite", title: "Show the counter in the footer", type: "boolean", initialValue: true }),
  ],
  preview: { select: { count: "count" }, prepare: ({ count }) => ({ title: "Visitor counter", subtitle: `${count ?? 0} visitors` }) },
});
