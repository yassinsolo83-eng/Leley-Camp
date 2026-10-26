import { useCallback, useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";
import { apiVersion } from "../../lib/sanity/env";

type Range = { _id: string; from: string; to: string; note?: string };

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

// Date math done in UTC so daylight-saving shifts never move a day.
function shift(day: string, by: number) {
  const [y, m, d] = day.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + by));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

/** One calendar per cabin: click a day to close it, click it again to open it. */
export function CabinBlockedCalendar(props: { options?: { cabinId?: string } }) {
  const cabinId = props.options?.cabinId || "";
  const client = useClient({ apiVersion });

  const [ranges, setRanges] = useState<Range[]>([]);
  const [cabinName, setCabinName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const now = new Date();
  const [month, setMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));

  const load = useCallback(async () => {
    const res = await client.fetch<{ name?: string; ranges: Range[] }>(
      `{
        "name": *[_id == $id][0].name.en,
        "ranges": *[_type == "blockedDate" && cabin._ref == $id && !(_id in path("drafts.**"))]{ _id, from, to, note }
      }`,
      { id: cabinId }
    );
    setCabinName(res.name || "");
    setRanges((res.ranges || []).filter((r) => r.from && r.to));
  }, [client, cabinId]);

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);

  const rangeAt = useCallback((day: string) => ranges.find((r) => day >= r.from && day <= r.to), [ranges]);

  async function toggle(day: string) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const hit = rangeAt(day);
      if (!hit) {
        await client.create({ _type: "blockedDate", cabin: { _type: "reference", _ref: cabinId }, from: day, to: day });
      } else {
        // Remove just this day; if it sat inside a longer range, keep the remaining parts.
        const tx = client.transaction().delete(hit._id);
        const keep = (from: string, to: string) =>
          tx.create({ _type: "blockedDate", cabin: { _type: "reference", _ref: cabinId }, from, to, ...(hit.note ? { note: hit.note } : {}) });
        if (hit.from < day) keep(hit.from, shift(day, -1));
        if (hit.to > day) keep(shift(day, 1), hit.to);
        await tx.commit();
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const y = month.getFullYear();
  const m = month.getMonth();
  const todayIso = iso(now.getFullYear(), now.getMonth(), now.getDate());
  const cells = useMemo(() => {
    const lead = new Date(y, m, 1).getDay();
    const total = new Date(y, m + 1, 0).getDate();
    return [...Array.from({ length: lead }, () => null), ...Array.from({ length: total }, (_, i) => i + 1)] as (number | null)[];
  }, [y, m]);

  const navBtn = {
    padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(128,128,128,.4)",
    background: "transparent", color: "inherit", font: "inherit", fontSize: 16, cursor: "pointer",
  } as const;

  return (
    <div style={{ padding: 24, maxWidth: 440 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 20 }}>{cabinName || "Cabin"}</h2>
      <p style={{ margin: "0 0 16px", fontSize: 13, opacity: 0.7 }}>Click a day to close it. Click a closed day to open it again.</p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button type="button" style={navBtn} onClick={() => setMonth(new Date(y, m - 1, 1))}>‹</button>
        <strong>{month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</strong>
        <button type="button" style={navBtn} onClick={() => setMonth(new Date(y, m + 1, 1))}>›</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center", fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => <span key={w}>{w}</span>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, opacity: busy ? 0.6 : 1 }}>
        {cells.map((d, i) => {
          if (!d) return <span key={i} />;
          const day = iso(y, m, d);
          const closed = Boolean(rangeAt(day));
          return (
            <button
              key={i}
              type="button"
              disabled={busy}
              onClick={() => toggle(day)}
              style={{
                aspectRatio: "1", borderRadius: 6, font: "inherit", fontSize: 14, cursor: "pointer",
                border: day === todayIso ? "2px solid #2276fc" : "1px solid rgba(128,128,128,.35)",
                background: closed ? "#d93a3a" : "transparent",
                color: closed ? "#fff" : "inherit",
                fontWeight: closed ? 700 : 400,
                textDecoration: closed ? "line-through" : "none",
              }}
            >
              {d}
            </button>
          );
        })}
      </div>

      {error && <p style={{ color: "#d93a3a", fontSize: 13, marginTop: 12 }}>{error}</p>}
    </div>
  );
}
