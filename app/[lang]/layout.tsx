import { notFound } from "next/navigation";
import Script from "next/script";
import type { Viewport } from "next";
import { LOCALES, isLocale, localePath, otherLocale } from "@/lib/i18n";
import { getContext, visibleOffers } from "@/lib/data";
import { promoOffers } from "@/lib/offers";
import { navItems } from "@/lib/nav";
import TopBar from "@/components/TopBar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SocialSidebar from "@/components/SocialSidebar";
import OfferPromo from "@/components/OfferPromo";
import "../globals.css";

export const viewport: Viewport = { themeColor: "#0F3A4A" };

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const ctx = await getContext(lang);
  const other = otherLocale(lang);
  const nav = navItems(lang, ctx.dict, ctx.menu?.showMenu !== false);
  const offers = promoOffers(visibleOffers(ctx), lang, ctx.dict, ctx.settings?.showPrices !== false);
  const gaId = ctx.settings?.gaId?.trim().replace(/[^A-Z0-9-]/gi, "");

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <body>
        {/* The first home-page view of each session plays the intro overlay (components/IntroWeave.tsx),
            where the rug weaves in and the panel lifts to reveal the hero. */}
        <a className="skip-link" href="#main">{ctx.dict.skipToContent}</a>
        <div className="site-top">
          <OfferPromo
            offers={offers}
            offersHref={localePath(lang, "/offers")}
            homeHref={localePath(lang, "/")}
            badge={ctx.dict.offerBadge}
            viewLabel={ctx.dict.offerView}
            closeLabel={ctx.dict.close}
          />
          <TopBar
            facebookUrl={ctx.settings?.facebookUrl}
            instagramUrl={ctx.settings?.instagramUrl}
            phoneDisplay={ctx.settings?.phoneDisplay}
          />
          <SiteHeader
            lang={lang}
            campName={ctx.campName}
            logoUrl={ctx.logoUrl}
            nav={nav.slice(1)}
            switchLang={other}
            switchLabel={ctx.labels?.languageName?.[other] || (other === "ar" ? "AR" : "English")}
            waUrl={ctx.waUrl}
            bookNow={ctx.dict.bookNow}
            menuLabel={ctx.dict.menu}
            closeLabel={ctx.dict.close}
          />
        </div>
        <main id="main">{children}</main>
        <SiteFooter ctx={ctx} nav={nav} />
        <WhatsAppFloat href={ctx.waUrl} label={ctx.dict.chatWithUs} />
        <SocialSidebar facebookUrl={ctx.settings?.facebookUrl} instagramUrl={ctx.settings?.instagramUrl} />
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
