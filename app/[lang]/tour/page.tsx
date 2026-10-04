import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { getContext, getPageData, pageMetadata } from "@/lib/data";
import TourViewer from "@/components/TourViewer";
import RugBand from "@/components/RugBand";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]/tour">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { pages, labels } = await getPageData();
  return pageMetadata(lang, "/tour", pages?.tour, tr(labels?.navTour, lang) || "360° tour");
}

export default async function TourPage({ params }: PageProps<"/[lang]/tour">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ctx = await getContext(lang);
  const { pages, dict, settings: s } = ctx;
  if (!s?.vrTourUrl) notFound();

  const title = tr(pages?.tour?.title, lang) || dict.navTour;
  const intro = tr(pages?.tour?.intro, lang);

  return (
    <section className="tour-page">
      <div className="container tour-head">
        <div>
          <h1 className="display tour-title">{title}</h1>
          <p className="tour-intro">{intro || dict.vrHint}</p>
        </div>
      </div>
      <TourViewer url={s.vrTourUrl} title={title} labels={{ fullscreen: dict.fullscreen, close: dict.close, openInNewTab: dict.openInNewTab }} />
      <RugBand />
      <div className="container tour-after">
        <Link className="btn btn-red" href={localePath(lang, "/booking")}>{dict.heroCta}</Link>
      </div>
    </section>
  );
}
