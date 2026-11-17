"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatNumber, whatsappLink } from "@/lib/i18n";
import { MENU_GROUPS, MENU_TEXT, type MenuItem } from "@/lib/menu";
import type { Locale } from "@/lib/sanity/types";
import { CloseIcon, WhatsAppIcon } from "./icons";

const ART = {
  pizza: { src: "/menu/pizza.webp", w: 420, h: 278 },
  fish: { src: "/menu/fish.webp", w: 420, h: 192 },
  plate: { src: "/menu/plate.webp", w: 360, h: 247 },
  glass: { src: "/menu/glass.webp", w: 176, h: 300 },
  moka: { src: "/menu/moka.webp", w: 247, h: 340 },
  cone: { src: "/menu/cone.webp", w: 102, h: 240 },
} as const;

type Line = { item: MenuItem; qty: number };

export default function MenuBoard({ lang, whatsappNumber }: { lang: Locale; whatsappNumber: string }) {
  const t = MENU_TEXT[lang];
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [active, setActive] = useState(MENU_GROUPS[0].id);
  const chipsRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const name = (i: { en: string; ar: string }) => (lang === "ar" ? i.ar : i.en);
  const byId = useMemo(() => {
    const map = new Map<string, MenuItem>();
    MENU_GROUPS.forEach((g) => g.items.forEach((i) => map.set(i.id, i)));
    return map;
  }, []);

  const lines: Line[] = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ item: byId.get(id)!, qty }))
    .filter((l) => l.item);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((sum, l) => sum + (l.item.price ?? 0) * l.qty, 0);
  const hasUnpriced = lines.some((l) => l.item.price === null);

  const change = (id: string, delta: number) =>
    setCart((c) => {
      const next = Math.max(0, (c[id] ?? 0) + delta);
      const copy = { ...c };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });

  const priceLabel = (i: MenuItem) => (i.priceText ? i.priceText : i.price !== null ? formatNumber(i.price) : "");

  // WhatsApp message in the page language, listing every item with quantity and price.
  const message = (() => {
    const rows = lines.map(({ item, qty }) => {
      const unit = item.price !== null ? `${formatNumber(item.price * qty)} ${t.currency}` : `${item.priceText ? `${item.priceText}, ` : ""}${t.priceOnRequest}`;
      return `${qty} × ${name(item)} — ${unit}`;
    });
    const totalLine = `${t.msgTotal}: ${formatNumber(total)} ${t.currency}${hasUnpriced ? ` (${t.msgPlus})` : ""}`;
    const noteLine = notes.trim() ? `\n${t.msgNotes}: ${notes.trim()}` : "";
    return `${t.greeting}\n\n${rows.join("\n")}\n\n${totalLine}${noteLine}\n\n${t.msgName} `;
  })();
  const waHref = whatsappLink(whatsappNumber, message);

  // The chip bar sticks right under the site header (its height changes with the offer ticker).
  useEffect(() => {
    const top = document.querySelector<HTMLElement>(".site-top");
    if (!top) return;
    const set = () => document.documentElement.style.setProperty("--menu-top", `${top.getBoundingClientRect().height}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(top);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--menu-top");
    };
  }, []);

  // Highlight the chip of the section currently on screen.
  useEffect(() => {
    const sections = MENU_GROUPS.map((g) => document.getElementById(g.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-170px 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Keep the active chip visible inside the chip bar (without scrolling the page).
  useEffect(() => {
    const bar = chipsRef.current;
    const chip = bar?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (!bar || !chip) return;
    bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Closing the sheet when the cart is emptied.
  useEffect(() => {
    if (open && count === 0) setOpen(false);
  }, [open, count]);

  return (
    <>
      <div className="menu-chips-wrap">
        <div className="menu-chips" ref={chipsRef} role="navigation" aria-label={t.chips}>
          {MENU_GROUPS.map((g) => (
            <a key={g.id} href={`#${g.id}`} data-chip={g.id} className={`menu-chip${active === g.id ? " active" : ""}`} aria-current={active === g.id ? "true" : undefined}>
              {name(g)}
            </a>
          ))}
        </div>
      </div>

      <div className="container menu-groups">
        {MENU_GROUPS.map((g) => {
          const art = g.art ? ART[g.art] : null;
          const note = lang === "ar" ? g.noteAr : g.noteEn;
          const kicker = lang === "ar" ? g.kickerAr : g.kickerEn;
          return (
            <section key={g.id} id={g.id} className="menu-section" aria-labelledby={`${g.id}-title`}>
              {kicker && <h2 className="menu-kicker display">{kicker}</h2>}
              <div className={`menu-card${art ? " has-art" : ""}`}>
                <h3 id={`${g.id}-title`} className="menu-card-title">{name(g)}</h3>
                {art && <Image className="menu-art" src={art.src} width={art.w} height={art.h} alt="" unoptimized />}
                {note && <p className="menu-note">{note}</p>}
                {g.items.length > 0 && (
                  <ul className="menu-list">
                    {g.items.map((item) => {
                      const qty = cart[item.id] ?? 0;
                      const itemNote = lang === "ar" ? item.noteAr : item.noteEn;
                      return (
                        <li key={item.id} className="menu-item">
                          <div className="menu-item-text">
                            <span className="menu-item-name">{name(item)}</span>
                            {itemNote && <span className="menu-item-note">{itemNote}</span>}
                          </div>
                          <span className="menu-price" dir="ltr">{priceLabel(item)}</span>
                          {qty === 0 ? (
                            <button type="button" className="menu-add" onClick={() => change(item.id, 1)} aria-label={`${t.add}: ${name(item)}`}>
                              <span aria-hidden="true">+</span>
                            </button>
                          ) : (
                            <div className="menu-qty" role="group" aria-label={name(item)}>
                              <button type="button" onClick={() => change(item.id, -1)} aria-label={`${t.decrease}: ${name(item)}`}>−</button>
                              <span aria-live="polite">{qty}</span>
                              <button type="button" onClick={() => change(item.id, 1)} aria-label={`${t.increase}: ${name(item)}`}>+</button>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {count > 0 && !open && (
        <div className="menu-cartbar" role="region" aria-label={t.yourRequest}>
          <div className="menu-cartbar-info">
            <strong>{t.items(count)}</strong>
            <span>{formatNumber(total)} {t.currency}{hasUnpriced ? " +" : ""}</span>
          </div>
          <button type="button" className="menu-cartbar-btn" onClick={() => setOpen(true)}>{t.review}</button>
        </div>
      )}

      {open && (
        <div className="menu-sheet-wrap" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="menu-sheet" role="dialog" aria-modal="true" aria-label={t.yourRequest}>
            <div className="menu-sheet-head">
              <h2 className="display">{t.yourRequest}</h2>
              <button ref={closeRef} type="button" className="menu-sheet-close" onClick={() => setOpen(false)} aria-label={t.close}><CloseIcon /></button>
            </div>
            <ul className="menu-sheet-list">
              {lines.map(({ item, qty }) => (
                <li key={item.id}>
                  <span className="menu-sheet-name">{name(item)}</span>
                  <span className="menu-sheet-price" dir="ltr">
                    {item.price !== null ? formatNumber(item.price * qty) : item.priceText ?? "—"}
                  </span>
                  <div className="menu-qty" role="group" aria-label={name(item)}>
                    <button type="button" onClick={() => change(item.id, -1)} aria-label={`${t.decrease}: ${name(item)}`}>−</button>
                    <span>{qty}</span>
                    <button type="button" onClick={() => change(item.id, 1)} aria-label={`${t.increase}: ${name(item)}`}>+</button>
                  </div>
                </li>
              ))}
            </ul>
            <label className="menu-notes">
              <span>{t.notes}</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} maxLength={300} placeholder={t.notesHint} />
            </label>
            <div className="menu-total">
              <span>{t.total}</span>
              <strong>{formatNumber(total)} {t.currency}{hasUnpriced ? " +" : ""}</strong>
            </div>
            {hasUnpriced && <p className="menu-total-note">{t.totalNote}</p>}
            {waHref && (
              <a className="menu-send" href={waHref} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={18} color="#fff" /> {t.send}
              </a>
            )}
            <button type="button" className="menu-clear" onClick={() => { setCart({}); setNotes(""); setOpen(false); }}>{t.clear}</button>
          </div>
        </div>
      )}
    </>
  );
}
