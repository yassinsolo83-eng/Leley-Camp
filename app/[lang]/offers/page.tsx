import { notFound } from "next/navigation";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { getContext, getPageData, pageMetadata, visibleOffers } from "@/lib/data";
import { offerDates } from "@/lib/offers";
import { imagePosition, imageUrl } from "@/lib/sanity/image";
import PageHero from "@/components/PageHero";
import OfferList from "@/components/OfferList";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]/offers">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { pages, labels, settings } = await getPageData();
  if (!settings?.offersEnabled) return {};
  return pageMetadata(lang, "/offers", pages?.offers, tr(labels?.navOffers, lang) || "Offers");
}

export default async function OffersPage({ params }: PageProps<"/[lang]/offers">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ctx = await getContext(lang);
  const { pages, dict, settings: s } = ctx;
  // The admin opens or closes this page from Site settings → Offers.
  if (!s?.offersEnabled) notFound();

  const offers = visibleOffers(ctx).map((o) => ({
    id: o._id,
    title: tr(o.title, lang),
    description: tr(o.description, lang),
    image: imageUrl(o.image),
    imagePosition: imagePosition(o.image),
    dates: offerDates(o, lang),
    planName: tr(o.planName, lang),
    priceEgyptian: o.priceEgyptian,
    priceForeigner: o.priceForeigner,
    currency: o.currency,
    unit: tr(o.unit, lang),
    bookHref: `${localePath(lang, "/booking")}?offer=${encodeURIComponent(o._id)}#reserve`,
  }));

  return (
    <>
      <PageHero header={pages?.offers} lang={lang} fallbackTitle={dict.navOffers} fallbackImage="/images/beach.jpg" />
      <section className="section">
        <div className="container">
          {offers.length ? (
            <OfferList offers={offers} dict={dict} showPrices={s?.showPrices !== false} />
          ) : (
            <p className="lead offer-empty">{dict.offersEmpty}</p>
          )}
        </div>
      </section>
    </>
  );
}
