import { notFound } from "next/navigation";
import Script from "next/script";
import type { Viewport } from "next";
import { LOCALES, isLocale, otherLocale } from "@/lib/i18n";
import { getContext } from "@/lib/data";
import { navItems } from "@/lib/nav";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloat from "@/components/WhatsAppFloat";
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
  const nav = navItems(lang, ctx.dict);
  const gaId = ctx.settings?.gaId?.trim().replace(/[^A-Z0-9-]/gi, "");

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <body>
        {/* First home-page view of this visit: let the rug under the hero weave itself in (keyframes in globals.css).
            A style tag is added instead of a class on <html>, because React resets that class. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(["/en","/en/","/ar","/ar/"].indexOf(location.pathname)>-1&&!sessionStorage.getItem("leley-woven")){var s=document.createElement("style");s.textContent=".rug-weave{animation:weave 1.8s steps(36,end) .4s both}[dir=rtl] .rug-weave{animation-name:weave-rtl}";document.head.appendChild(s);sessionStorage.setItem("leley-woven","1")}}catch(e){}`,
          }}
        />
        <a className="skip-link" href="#main">{ctx.dict.skipToContent}</a>
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
        <main id="main">{children}</main>
        <SiteFooter ctx={ctx} nav={nav} />
        <WhatsAppFloat href={ctx.waUrl} label={ctx.dict.chatWithUs} />
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
