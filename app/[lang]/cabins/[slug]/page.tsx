import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCALES, isLocale, localePath, tr } from "@/lib/i18n";
import { getContext, getPageData, pageMetadata } from "@/lib/data";
import { imageUrl } from "@/lib/sanity/image";
import CabinCard from "@/components/CabinCard";
import GalleryGrid from "@/components/GalleryGrid";
import RugBand from "@/components/RugBand";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";

export const revalidate = 60;

export async function generateStaticParams() {
  const { cabins } = await getPageData();
  return LOCALES.flatMap((lang) => cabins.map((c) => ({ lang, slug: c.slug! })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/cabins/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const { cabins } = await getPageData();
  const cabin = cabins.find((c) => c.slug === slug);
  if (!cabin) return {};
  return pageMetadata(lang, `/cabins/${slug}`, { title: cabin.name, intro: cabin.description, image: cabin.image });
}

export default async function CabinPage({ params }: PageProps<"/[lang]/cabins/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const ctx = await getContext(lang);
  const { cabins, dict } = ctx;
  const cabin = cabins.find((c) => c.slug === slug);
  if (!cabin) notFound();

  const name = tr(cabin.name, lang);
  const tag = tr(cabin.tag, lang);
  const details = (cabin.details ?? []).map((d) => tr(d, lang)).filter(Boolean);
  const amenities = (cabin.amenities ?? []).map((a) => tr(a, lang)).filter(Boolean);
  const photos = (cabin.photos ?? []).map((p, i) => ({ key: p._key || String(i), src: imageUrl(p), alt: name, wide: false })).filter((p) => p.src);
  const others = cabins.filter((c) => c._id !== cabin._id);
  const bookHref = `${localePath(lang, "/booking")}?cabin=${cabin.slug}#reserve`;

  return (
    <>
      <section className="cabin-hero">
        <Image src={imageUrl(cabin.image, "/images/cabin-1.jpg")} alt={name} fill priority sizes="100vw" className="hero-img" />
        <div className="container cabin-hero-inner">
          <Link className="crumb" href={localePath(lang, "/cabins")}>{dict.navCabins}</Link>
          <h1 className="display hero-title">{name}</h1>
          {tag && <p className="hero-badge">{tag}</p>}
        </div>
        <RugBand className="rug-bottom" />
      </section>

      <section className="section">
        <div className="container cabin-detail">
          <div className="cabin-detail-text">
            <p className="lead">{tr(cabin.description, lang)}</p>
            {details.map((d, i) => <p key={i}>{d}</p>)}
          </div>
          <aside className="cabin-aside">
            {amenities.length > 0 && (
              <>
                <h2 className="aside-title">{dict.amenities}</h2>
                <ul className="tick-list">{amenities.map((a) => <li key={a}>{a}</li>)}</ul>
              </>
            )}
            <Link className="btn btn-red btn-block" href={bookHref}>{dict.bookThisCabin}</Link>
            {ctx.waUrl && (
              <a className="btn btn-outline btn-block" href={ctx.waUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={16} /> {dict.whatsappUs}
              </a>
            )}
          </aside>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="section section-paper">
          <div className="container">
            <GalleryGrid items={photos} labels={{ close: dict.close, previous: dict.previous, next: dict.next }} />
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="heading">
              <h2 className="heading-title">{dict.otherCabins}</h2>
              <Link className="text-link" href={localePath(lang, "/cabins")}>{dict.allCabins} <ArrowIcon /></Link>
            </div>
            <div className="cabin-grid">
              {others.slice(0, 3).map((c) => <CabinCard key={c._id} cabin={c} lang={lang} cta={dict.viewCabin} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
