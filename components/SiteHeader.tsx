"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WhatsAppIcon, MenuIcon, CloseIcon } from "./icons";

export type NavItem = { href: string; label: string };

type Props = {
  lang: string;
  campName: string;
  logoUrl: string;
  nav: NavItem[];
  switchLang: string;
  switchLabel: string;
  waUrl: string;
  bookNow: string;
  menuLabel: string;
  closeLabel: string;
};

export default function SiteHeader({ lang, campName, logoUrl, nav, switchLang, switchLabel, waUrl, bookNow, menuLabel, closeLabel }: Props) {
  const pathname = usePathname() || `/${lang}`;
  const [open, setOpen] = useState(false);

  // Same page in the other language: /en/cabins/sea-view -> /ar/cabins/sea-view
  const switchHref = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${switchLang}`);
  const isActive = (href: string) => (href === `/${lang}` ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href={`/${lang}`}>
          <Image src={logoUrl} alt="" width={44} height={44} className="brand-logo" priority />
          <span className="brand-name">{campName}</span>
        </Link>

        <nav className="main-nav" aria-label={menuLabel}>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={isActive(item.href) ? "active" : undefined} aria-current={isActive(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="lang-switch" href={switchHref} hrefLang={switchLang} lang={switchLang}>{switchLabel}</Link>
          {waUrl && (
            <a className="btn btn-red btn-sm header-cta" href={waUrl} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={15} />
              {bookNow}
            </a>
          )}
          <button type="button" className="menu-btn" onClick={() => setOpen(true)} aria-label={menuLabel} aria-expanded={open}>
            <MenuIcon />
          </button>
        </div>
      </div>

      {open && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label={menuLabel}>
          <div className="drawer-top">
            <span className="brand-name">{campName}</span>
            <button type="button" className="menu-btn" onClick={() => setOpen(false)} aria-label={closeLabel}>
              <CloseIcon />
            </button>
          </div>
          <nav className="drawer-nav">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className={isActive(item.href) ? "active" : undefined}>{item.label}</Link>
            ))}
          </nav>
          <div className="drawer-actions">
            <Link className="lang-switch" href={switchHref} hrefLang={switchLang} lang={switchLang}>{switchLabel}</Link>
            {waUrl && (
              <a className="btn btn-red" href={waUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={16} /> {bookNow}
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
