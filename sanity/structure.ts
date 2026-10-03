import type { StructureResolver } from "sanity/structure";

const singleton = (S: Parameters<StructureResolver>[0], id: string, title: string) =>
  S.listItem().id(id).title(title).child(S.document().schemaType(id).documentId(id).title(title));

const orderedList = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.documentTypeListItem(type).title(title).child(
    S.documentTypeList(type).title(title).defaultOrdering([{ field: "order", direction: "asc" }])
  );

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Leley Camp")
    .items([
      S.listItem().title("Booking requests").id("inquiries").child(
        S.list().title("Booking requests").items([
          S.listItem().title("New").id("new").child(
            S.documentList().title("New requests").schemaType("inquiry").filter('_type == "inquiry" && status == "new"')
              .defaultOrdering([{ field: "submittedAt", direction: "desc" }])),
          S.listItem().title("All requests").id("all").child(
            S.documentList().title("All requests").schemaType("inquiry").filter('_type == "inquiry"')
              .defaultOrdering([{ field: "submittedAt", direction: "desc" }])),
        ])
      ),
      S.divider(),
      singleton(S, "homePage", "Home page"),
      singleton(S, "pages", "Other pages"),
      orderedList(S, "cabin", "Cabins"),
      orderedList(S, "pricePlan", "Prices"),
      orderedList(S, "activity", "Activities"),
      orderedList(S, "review", "Reviews"),
      S.divider(),
      singleton(S, "siteSettings", "Site settings"),
      singleton(S, "interfaceText", "Interface text"),
      singleton(S, "visitorCounter", "Visitor counter"),
    ]);
