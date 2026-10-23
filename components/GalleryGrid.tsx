"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

export type GalleryItem = { key: string; type: "photo" | "video"; src: string; videoSrc?: string; alt: string; wide: boolean; pos?: string };

type Filter = "all" | "photo" | "video";

type Props = {
  items: GalleryItem[];
  labels: { close: string; previous: string; next: string; all: string; photos: string; videos: string };
};

export default function GalleryGrid({ items, labels }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [index, setIndex] = useState<number | null>(null);
  const isOpen = index !== null;

  const hasVideos = items.some((i) => i.type === "video");
  const visible = useMemo(() => (filter === "all" ? items : items.filter((i) => i.type === filter)), [items, filter]);

  const close = useCallback(() => setIndex(null), []);
  const move = useCallback(
    (step: number) => setIndex((i) => (i === null ? i : (i + step + visible.length) % visible.length)),
    [visible.length]
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
  const current = index !== null ? visible[index] : null;

  return (
    <>
      {hasVideos && (
        <div className="gallery-filter" role="group" aria-label={labels.all}>
          {([["all", labels.all], ["photo", labels.photos], ["video", labels.videos]] as [Filter, string][]).map(([key, label]) => (
            <button type="button" key={key} className={filter === key ? "active" : ""} onClick={() => { setFilter(key); setIndex(null); }}>
              {label}
            </button>
          ))}
        </div>
      )}
      <div className="gallery-grid">
        {visible.map((item, i) => (
          <button type="button" key={item.key} className={`g-item${item.wide ? " wide" : ""}`} onClick={() => setIndex(i)} aria-label={item.alt}>
            <Image src={item.src} alt={item.alt} fill sizes={item.wide ? "(max-width: 600px) 100vw, 50vw" : "(max-width: 600px) 100vw, 25vw"} style={{ objectPosition: item.pos }} />
            {item.type === "video" && (
              <span className="g-play" aria-hidden="true">
                <span className="g-play-icon">▶</span>
                <span className="g-play-label">{labels.videos.replace(/s$/, "")}</span>
              </span>
            )}
          </button>
        ))}
      </div>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.alt} onClick={(e) => e.target === e.currentTarget && close()}>
          <button type="button" className="lb-btn lb-close" onClick={close} aria-label={labels.close}>✕</button>
          <button type="button" className="lb-btn lb-prev" onClick={() => move(-1)} aria-label={labels.previous}>‹</button>
          <div className="lb-img">
            {current.type === "video" ? (
              <video key={current.key} controls autoPlay playsInline poster={current.src} className="lb-video">
                <source src={current.videoSrc} type="video/mp4" />
              </video>
            ) : (
              <Image src={current.src} alt={current.alt} fill sizes="92vw" quality={85} style={{ objectFit: "contain" }} />
            )}
          </div>
          <button type="button" className="lb-btn lb-next" onClick={() => move(1)} aria-label={labels.next}>›</button>
          <p className="lb-caption">{current.alt} · {index! + 1}/{visible.length}</p>
        </div>
      )}
    </>
  );
}
