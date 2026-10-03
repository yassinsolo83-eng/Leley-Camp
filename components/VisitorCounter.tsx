"use client";

import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/i18n";

const STORAGE_KEY = "leley-visitor-counted";

/** Counts each browser once (first visit), then only reads the number. */
export default function VisitorCounter({ label }: { label: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let counted = false;
    try { counted = localStorage.getItem(STORAGE_KEY) === "1"; } catch {}
    fetch("/api/visit", { method: counted ? "GET" : "POST" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { count?: number; show?: boolean }) => {
        if (!counted) { try { localStorage.setItem(STORAGE_KEY, "1"); } catch {} }
        if (d.show !== false && typeof d.count === "number") setCount(d.count);
      })
      .catch(() => {});
  }, []);

  if (count === null) return null;
  return (
    <div className="visitor-counter">
      <span className="dot" aria-hidden="true" />
      <span className="visit-count">{formatNumber(count)}</span>
      <span>{label}</span>
    </div>
  );
}
