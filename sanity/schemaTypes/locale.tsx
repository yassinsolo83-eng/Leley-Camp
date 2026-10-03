import { defineField, defineType, type StringInputProps, type TextInputProps } from "sanity";

// Arabic fields are typed right-to-left in the Studio.
function RtlInput(props: StringInputProps | TextInputProps) {
  return <div dir="rtl">{props.renderDefault(props)}</div>;
}

export const localeString = defineType({
  name: "localeString",
  title: "Short text",
  type: "object",
  options: { columns: 2 },
  fields: [
    defineField({ name: "en", title: "English", type: "string" }),
    defineField({ name: "ar", title: "Arabic", type: "string", components: { input: RtlInput } }),
  ],
});

export const localeText = defineType({
  name: "localeText",
  title: "Paragraph",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "text", rows: 3 }),
    defineField({ name: "ar", title: "Arabic", type: "text", rows: 3, components: { input: RtlInput } }),
  ],
});

export const sectionHeading = defineType({
  name: "sectionHeading",
  title: "Section heading",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "tag", title: "Small label above the title", type: "localeString" }),
    defineField({ name: "title", title: "Title", type: "localeString" }),
    defineField({ name: "subtitle", title: "Subtitle", type: "localeText" }),
  ],
});

export const pageHeader = defineType({
  name: "pageHeader",
  title: "Page header",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "localeString" }),
    defineField({ name: "intro", title: "Intro", type: "localeText" }),
    defineField({ name: "image", title: "Header photo", type: "image", options: { hotspot: true } }),
  ],
});
