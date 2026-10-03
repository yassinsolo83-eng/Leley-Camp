"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";

export type GalleryItem = { key: string; src: string; alt: string; wide: boolean };

type Props = { items: GalleryItem[]; heading: React.ReactNode; dict: Dictionary };

export default function Gallery({ items, heading, dict }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const isOpen = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const move = useCallback(
    (step: number) => setIndex((i) => (i === null ? i : (i + step + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (!isOpen) return;
    const rtl = document.documentElement.dir === "rtl";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") move(rtl ? 1 : -1);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, move]);

  if (!items.length) return null;
  const current = index !== null ? items[index] : null;

  return (
    <section id="gallery">
      <div className="container">
        {heading}
        <div className="gallery-grid" style={{ marginTop: 36 }}>
          {items.map((item, i) => (
            <button type="button" key={item.key} className={`g-item${item.wide ? " wide" : ""}`} onClick={() => setIndex(i)} aria-label={item.alt}>
              <Image src={item.src} alt={item.alt} fill sizes={item.wide ? "(max-width: 500px) 100vw, 600px" : "(max-width: 500px) 100vw, 300px"} style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      </div>

      {current && (
        <div className="lightbox open" role="dialog" aria-modal="true" aria-label={current.alt} onClick={(e) => e.target === e.currentTarget && close()}>
          <button type="button" className="lightbox-close" onClick={close} aria-label={dict.close}>✕</button>
          <button type="button" className="lightbox-prev" onClick={() => move(-1)} aria-label="Previous">‹</button>
          <div className="lightbox-img-wrap" onClick={(e) => e.target === e.currentTarget && close()}>
            <Image src={current.src} alt={current.alt} fill sizes="92vw" quality={85} style={{ objectFit: "contain" }} />
          </div>
          <button type="button" className="lightbox-next" onClick={() => move(1)} aria-label="Next">›</button>
        </div>
      )}
    </section>
  );
}
