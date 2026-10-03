"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type GalleryItem = { key: string; src: string; alt: string; wide: boolean; pos?: string };

type Props = { items: GalleryItem[]; labels: { close: string; previous: string; next: string } };

export default function GalleryGrid({ items, labels }: Props) {
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
    <>
      <div className="gallery-grid">
        {items.map((item, i) => (
          <button type="button" key={item.key} className={`g-item${item.wide ? " wide" : ""}`} onClick={() => setIndex(i)} aria-label={item.alt}>
            <Image src={item.src} alt={item.alt} fill sizes={item.wide ? "(max-width: 600px) 100vw, 50vw" : "(max-width: 600px) 100vw, 25vw"} style={{ objectPosition: item.pos }} />
          </button>
        ))}
      </div>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.alt} onClick={(e) => e.target === e.currentTarget && close()}>
          <button type="button" className="lb-btn lb-close" onClick={close} aria-label={labels.close}>✕</button>
          <button type="button" className="lb-btn lb-prev" onClick={() => move(-1)} aria-label={labels.previous}>‹</button>
          <div className="lb-img">
            <Image src={current.src} alt={current.alt} fill sizes="92vw" quality={85} style={{ objectFit: "contain" }} />
          </div>
          <button type="button" className="lb-btn lb-next" onClick={() => move(1)} aria-label={labels.next}>›</button>
          <p className="lb-caption">{current.alt} · {index! + 1}/{items.length}</p>
        </div>
      )}
    </>
  );
}
