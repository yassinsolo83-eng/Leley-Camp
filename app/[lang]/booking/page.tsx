import { notFound } from "next/navigation";
import { isLocale, tr } from "@/lib/i18n";
import { getContext, getPageData, pageMetadata } from "@/lib/data";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import PricePlans from "@/components/PricePlans";
import ReserveForm from "@/components/ReserveForm";
import BookLinks from "@/components/BookLinks";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]/booking">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { pages, labels } = await getPageData();
  return pageMetadata(lang, "/booking", pages?.booking, tr(labels?.navBooking, lang) || "Prices & Booking");
}

export default async function BookingPage({ params }: PageProps<"/[lang]/booking">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ctx = await getContext(lang);
  const { pages, dict, prices, cabins, settings: s } = ctx;

  return (
    <>
      <PageHero header={pages?.booking} lang={lang} fallbackTitle={dict.navBooking} fallbackImage="/images/beach.jpg" />

      {prices.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading heading={pages?.pricesHeading} lang={lang} />
            <PricePlans plans={prices} lang={lang} dict={dict} />
          </div>
        </section>
      )}

      <section className="section section-paper" id="reserve">
        <div className="container reserve-grid">
          <div>
            <SectionHeading heading={pages?.formHeading} lang={lang} />
            <BookLinks bookingUrl={s?.bookingUrl} dict={dict} />
          </div>
          <ReserveForm
            cabins={cabins.map((c) => ({ value: tr(c.name, "en"), label: tr(c.name, lang), slug: c.slug })).filter((o) => o.value)}
            plans={prices
              .map((p) => ({ value: tr(p.name, "en"), label: tr(p.name, lang), price: p.price, currency: p.currency, unit: tr(p.unit, lang), guestsIncluded: p.guestsIncluded }))
              .filter((o) => o.value)}
            whatsappNumber={s?.whatsappNumber}
            lang={lang}
            dict={dict}
          />
        </div>
      </section>
    </>
  );
}
