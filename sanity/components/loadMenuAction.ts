import { useState } from "react";
import { useClient, type DocumentActionComponent } from "sanity";
import { initialSections } from "../schemaTypes/menu";
import { apiVersion } from "../../lib/sanity/env";

/** Shown on the Menu document while it has no sections: one click loads every current dish
 * (names, prices, sections) so they can be edited here, and publishes it. */
export const loadMenuAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion });
  const [busy, setBusy] = useState(false);
  const doc = (props.draft || props.published) as { sections?: unknown[] } | null;
  if (props.id !== "menu" || (doc?.sections && doc.sections.length > 0)) return null;

  return {
    label: busy ? "Loading…" : "Load the current menu",
    tone: "primary",
    disabled: busy,
    onHandle: async () => {
      setBusy(true);
      try {
        const base = (props.draft || props.published || {}) as Record<string, unknown>;
        const tx = client.transaction();
        tx.createOrReplace({ ...base, _id: "menu", _type: "menu", showMenu: base.showMenu ?? true, sections: initialSections } as never);
        tx.delete("drafts.menu");
        await tx.commit();
      } finally {
        setBusy(false);
        props.onComplete();
      }
    },
  };
};
