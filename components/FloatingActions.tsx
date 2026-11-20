"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, WhatsAppIcon } from "./icons";

type Props = {
  logoUrl: string;
  waUrl: string;
  waLabel: string;
  menuHref?: string;
  menuLabel: string;
  openLabel: string;
  closeLabel: string;
};

/** One small pulsing button (the camp logo) fixed at the bottom corner. Tapping it opens two
 * actions: the food menu and WhatsApp. Replaces the separate WhatsApp float button. */
export default function FloatingActions({ logoUrl, waUrl, waLabel, menuHref, menuLabel, openLabel, closeLabel }: Props) {
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const onMenuPage = menuHref ? pathname === menuHref || pathname.startsWith(`${menuHref}/`) : false;
  const showMenu = Boolean(menuHref) && !onMenuPage;

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  if (!waUrl && !showMenu) return null;

  return (
    <div className={`fab${open ? " open" : ""}`} ref={ref}>
      {open && (
        <div className="fab-actions">
          {showMenu && menuHref && (
            <Link className="fab-action fab-menu" href={menuHref}>
              {menuLabel}
            </Link>
          )}
          {waUrl && (
            <a className="fab-action fab-wa" href={waUrl} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={18} color="#fff" />
              {waLabel}
            </a>
          )}
        </div>
      )}
      <button type="button" className="fab-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? closeLabel : openLabel}>
        {open ? <CloseIcon /> : <Image src={logoUrl} alt="" width={40} height={40} className="fab-logo" />}
      </button>
    </div>
  );
}
