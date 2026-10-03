"use client";

import { useEffect, useState } from "react";

export default function VisitorCounter({ offset, label, lang }: { offset: number; label: string; lang: string }) {
  const [count, setCount] = useState<string>("—");

  useEffect(() => {
    const format = (n: number) => n.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
    // Count each browser once per session so page refreshes don't inflate the number.
    const counted = sessionStorage.getItem("leley-visit-counted");
    const url = `https://api.counterapi.dev/v1/leleycamp-nuweiba/visits${counted ? "" : "/up"}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        sessionStorage.setItem("leley-visit-counted", "1");
        setCount(format((d.count || 1) + offset));
      })
      .catch(() => setCount(""));
  }, [offset, lang]);

  if (count === "") return null;
  return (
    <div className="visitor-counter">
      <span className="dot" />
      <span id="visit-count">{count}</span>
      <span>{label}</span>
    </div>
  );
}
