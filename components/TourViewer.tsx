"use client";

import { useEffect, useRef, useState } from "react";

type Props = { url: string; title: string; labels: { fullscreen: string; close: string; openInNewTab: string } };

/** The 360° tour, playable right on the page on phones and computers. */
export default function TourViewer({ url, title, labels }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    // iPhones can't put a page element in full screen; they get "open in a new tab" instead.
    setCanFullscreen(Boolean(document.fullscreenEnabled));
    const onChange = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrap.current?.requestFullscreen().catch(() => {});
  }

  return (
    <div className="tour-viewer" ref={wrap}>
      {/* Sits under the tour and is covered as soon as the tour draws. */}
      <div className="tour-loading" aria-hidden="true"><span className="tour-spinner" /></div>
      <iframe
        src={url}
        title={title}
        allow="fullscreen; gyroscope; accelerometer; magnetometer; xr-spatial-tracking"
        allowFullScreen
      />
      <div className="tour-controls">
        {canFullscreen ? (
          <button type="button" className="btn btn-sand btn-sm" onClick={toggleFullscreen}>
            {isFull ? labels.close : labels.fullscreen}
          </button>
        ) : (
          <a className="btn btn-sand btn-sm" href={url} target="_blank" rel="noopener noreferrer">{labels.openInNewTab}</a>
        )}
      </div>
    </div>
  );
}
