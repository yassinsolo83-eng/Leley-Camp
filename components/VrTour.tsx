"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";

type Props = { url: string; title: string; subtitle: string; dict: Dictionary };

export default function VrTour({ url, title, subtitle, dict }: Props) {
  const [open, setOpen] = useState(false);

  function launch() {
    // Phones get the tour in a new tab, where it has the full screen.
    if (window.innerWidth < 768) {
      window.open(url, "_blank", "noopener");
      return;
    }
    setOpen(true);
  }

  return (
    <section id="vr-tour">
      <div className="vr-stage">
        {open ? (
          <>
            <iframe src={url} title={title} allowFullScreen />
            <div className="vr-badge">
              🥽 {dict.vrHint} ·<button type="button" onClick={() => setOpen(false)}>{dict.close}</button>
            </div>
          </>
        ) : (
          <button type="button" className="vr-placeholder" onClick={launch}>
            <span className="vr-icon" aria-hidden="true">🥽</span>
            <span className="vr-title">{title}</span>
            {subtitle && <span className="vr-sub">{subtitle}</span>}
            <span className="vr-launch">▶ {dict.launchTour}</span>
          </button>
        )}
      </div>
    </section>
  );
}
