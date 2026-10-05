"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a number up from zero when it scrolls into view.
 * Keeps whatever is around the number: "12+", "5★", "4.9", "365".
 */
export default function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!match || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const [, before, num, after] = match;
    const target = parseFloat(num.replace(",", "."));
    const decimals = num.includes(".") || num.includes(",") ? num.split(/[.,]/)[1].length : 0;
    const show = (n: number) => setShown(`${before}${n.toFixed(decimals)}${after}`);

    show(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1200;
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          show(target * (1 - Math.pow(1 - t, 3))); // ease-out
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref}>{shown}</span>;
}
