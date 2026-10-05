import { useCallback } from "react";
import { set, type StringInputProps } from "sanity";

// No 0/O or 1/I — easy to read back over a phone call or WhatsApp.
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode() {
  let s = "";
  for (let i = 0; i < 6; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)];
  return `LELEY-${s}`;
}

/** The admin can type a code by hand, or press Generate for a random one. */
export function PromoCodeInput(props: StringInputProps) {
  const { onChange } = props;
  const generate = useCallback(() => onChange(set(randomCode())), [onChange]);

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div style={{ flex: 1 }}>{props.renderDefault(props)}</div>
      <button
        type="button"
        onClick={generate}
        style={{
          flexShrink: 0,
          padding: "8px 14px",
          borderRadius: 6,
          border: "1px solid #c6cbd1",
          background: "#f2f3f5",
          font: "inherit",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Generate
      </button>
    </div>
  );
}
