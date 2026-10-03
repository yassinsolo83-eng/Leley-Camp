"use client";

import Backdrop from "./Backdrop";
import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";

type Props = { url: string; title: string; subtitle: string; posterUrl?: string; posterPosition?: string; dict: Dictionary };

export default function VrTour({ url, title, subtitle, posterUrl, posterPosition, dict }: Props) {
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
    <div className="vr-stage">
      {open ? (
        <>
          <iframe src={url} title={title} allowFullScreen />
          <div className="vr-badge">
            {dict.vrHint} · <button type="button" onClick={() => setOpen(false)}>{dict.close}</button>
          </div>
        </>
      ) : (
        <button type="button" className="vr-placeholder" onClick={launch}>
          {posterUrl && <Backdrop src={posterUrl} position={posterPosition} />}
          <span className="vr-text">
            <span className="vr-label">360°</span>
            <span className="vr-title">{title}</span>
            {subtitle && <span className="vr-sub">{subtitle}</span>}
            <span className="btn btn-sand">{dict.launchTour}</span>
          </span>
        </button>
      )}
    </div>
  );
}
