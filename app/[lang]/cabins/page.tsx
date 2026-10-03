import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { getContext, getPageData, pageMetadata } from "@/lib/data";
import { imagePosition, imageUrl } from "@/lib/sanity/image";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import { ArrowIcon } from "@/components/icons";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]/cabins">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { pages, labels } = await getPageData();
  return pageMetadata(lang, "/cabins", pages?.cabins, tr(labels?.navCabins, lang) || "Cabins");
}

export default async function CabinsPage({ params }: PageProps<"/[lang]/cabins">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ctx = await getContext(lang);
  const { cabins, dict, pages, home } = ctx;

  return (
    <>
      <PageHero header={pages?.cabins} lang={lang} fallbackTitle={dict.navCabins} fallbackImage="/images/cabin-1.jpg" />
      <section className="section">
        <div className="container cabin-rows">
          {cabins.map((c) => {
            const name = tr(c.name, lang);
            const src = imageUrl(c.image);
            const tag = tr(c.tag, lang);
            const amenities = (c.amenities ?? []).map((a) => tr(a, lang)).filter(Boolean).slice(0, 4);
            const href = localePath(lang, `/cabins/${c.slug}`);
            return (
              <article className="cabin-row" key={c._id}>
                <Link href={href} className="cabin-row-img" tabIndex={-1} aria-hidden="true">
                  {src && <Image src={src} alt="" fill sizes="(max-width: 860px) 100vw, 55vw" style={{ objectPosition: imagePosition(c.image) }} />}
                </Link>
                <div className="cabin-row-body">
                  {tag && <p className="cabin-tag">{tag}</p>}
                  <h2 className="display cabin-row-title"><Link href={href}>{name}</Link></h2>
                  <p className="lead">{tr(c.description, lang)}</p>
                  {amenities.length > 0 && <ul className="chips">{amenities.map((a) => <li key={a}>{a}</li>)}</ul>}
                  <div className="row-actions">
                    <Link className="btn btn-dark" href={href}>{dict.viewCabin}</Link>
                    <Link className="text-link" href={`${localePath(lang, "/booking")}?cabin=${c.slug}#reserve`}>{dict.bookThisCabin} <ArrowIcon /></Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <CtaBand band={home?.ctaBand} lang={lang} dict={dict} waUrl={ctx.waUrl} />
    </>
  );
}
