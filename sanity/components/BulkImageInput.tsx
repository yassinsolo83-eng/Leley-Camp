import { useCallback, useRef, useState } from "react";
import { insert, setIfMissing, useClient, type ArrayOfObjectsInputProps } from "sanity";
import { apiVersion } from "../../lib/sanity/env";

const key = () => Math.random().toString(36).slice(2, 12);

/**
 * Adds an "Upload several photos" button above an image list.
 * Works for lists of plain images (cabin photos) and for lists of
 * objects that have an `image` field (gallery).
 */
export function BulkImageInput(props: ArrayOfObjectsInputProps) {
  const { onChange, schemaType } = props;
  const client = useClient({ apiVersion });
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const isPlainImage = schemaType.of?.[0]?.name === "image";

  const upload = useCallback(
    async (files: File[]) => {
      const images = files.filter((f) => f.type.startsWith("image/"));
      if (!images.length) return;
      setBusy(true);
      const items: Record<string, unknown>[] = [];
      for (let i = 0; i < images.length; i++) {
        setStatus(`Uploading ${i + 1} of ${images.length}…`);
        try {
          const asset = await client.assets.upload("image", images[i], { filename: images[i].name });
          const ref = { _type: "reference", _ref: asset._id };
          items.push(
            isPlainImage
              ? { _type: "image", _key: key(), asset: ref }
              : { _key: key(), image: { _type: "image", asset: ref } },
          );
        } catch {
          setStatus(`Could not upload ${images[i].name}`);
        }
      }
      if (items.length) {
        onChange([setIfMissing([]), insert(items, "after", [-1])]);
        setStatus(`${items.length} photo${items.length > 1 ? "s" : ""} added. Publish to save.`);
      }
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    },
    [client, isPlainImage, onChange],
  );

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload(Array.from(e.dataTransfer.files));
        }}
        style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, marginBottom: 12, border: "1px dashed #aab0b8", borderRadius: 6 }}
      >
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(Array.from(e.target.files || []))} />
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #c6cbd1", background: "#f2f3f5", font: "inherit", cursor: busy ? "wait" : "pointer" }}
        >
          Upload several photos
        </button>
        <span style={{ fontSize: 13, opacity: 0.75 }}>{status || "Select many at once, or drop them here."}</span>
      </div>
      {props.renderDefault(props)}
    </div>
  );
}
