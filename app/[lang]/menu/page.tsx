import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getContext, getPageData, pageMetadata } from "@/lib/data";
import { MENU_TEXT, resolveMenu } from "@/lib/menu";
import MenuBoard from "@/components/MenuBoard";

export const revalidate = 60;

// Same number the booking form uses when the Studio has none.
const DEFAULT_WHATSAPP = "201274057142";

export async function generateMetadata({ params }: PageProps<"/[lang]/menu">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { menu } = await getPageData();
  if (menu?.showMenu === false) return {};
  const en = MENU_TEXT.en;
  const ar = MENU_TEXT.ar;
  return pageMetadata(lang, "/menu", {
    title: { en: menu?.title?.en || en.title, ar: menu?.title?.ar || ar.title },
    seoTitle: { en: en.seoTitle, ar: ar.seoTitle },
    seoDescription: { en: en.seoDescription, ar: ar.seoDescription },
  });
}

export default async function MenuPage({ params }: PageProps<"/[lang]/menu">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ctx = await getContext(lang);
  const menu = resolveMenu(ctx.menu, lang);
  // The Studio's Menu document controls whether the page exists.
  if (!menu.open) notFound();
  const whatsappNumber = menu.whatsappNumber || ctx.settings?.whatsappNumber || DEFAULT_WHATSAPP;

  return (
    <div className="menu-page">
      <header className="menu-masthead">
        <div className="menu-lockup">
          <Image className="menu-candle" src="/menu/candle.webp" width={73} height={200} alt="" unoptimized />
          <span className="menu-rule" aria-hidden="true" />
          <Image className="menu-logo" src="/menu/logo.webp" width={720} height={920} alt={ctx.campName} priority unoptimized />
          <span className="menu-rule" aria-hidden="true" />
          <Image className="menu-candle" src="/menu/candle.webp" width={73} height={200} alt="" unoptimized />
        </div>
        <h1 className="menu-title display">{menu.title}</h1>
        <p className="menu-place">{menu.place}</p>
        <p className="menu-hint">{menu.hint}</p>
      </header>
      <MenuBoard lang={lang} groups={menu.groups} currency={menu.currency} whatsappNumber={whatsappNumber} />
    </div>
  );
}
