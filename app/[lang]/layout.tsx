import { notFound } from "next/navigation";
import Script from "next/script";
import type { Viewport } from "next";
import { LOCALES, isLocale } from "@/lib/i18n";
import { getPageData } from "@/lib/data";
import "../globals.css";

export const viewport: Viewport = { themeColor: "#D4A96A" };

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { settings } = await getPageData();
  const gaId = settings?.gaId?.trim();

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <body>
        {children}
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId.replace(/[^A-Z0-9-]/gi, "")}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
