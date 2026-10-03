import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, tr } from "@/lib/i18n";
import { getContext, getPageData, pageMetadata } from "@/lib/data";
import { imageUrl } from "@/lib/sanity/image";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]/experiences">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { pages, labels } = await getPageData();
  return pageMetadata(lang, "/experiences", pages?.experiences, tr(labels?.navExperiences, lang) || "Experiences");
}

export default async function ExperiencesPage({ params }: PageProps<"/[lang]/experiences">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ctx = await getContext(lang);
  const { activities, dict, pages, home } = ctx;

  return (
    <>
      <PageHero header={pages?.experiences} lang={lang} fallbackTitle={dict.navExperiences} fallbackImage="/images/reef.jpg" />
      <section className="section">
        <div className="container exp-list">
          {activities.map((a) => {
            const src = imageUrl(a.image);
            return (
              <article className="exp-item" key={a._id}>
                <div className="exp-item-img">{src && <Image src={src} alt="" fill sizes="(max-width: 860px) 100vw, 50vw" />}</div>
                <div className="exp-item-body">
                  {a.icon && <p className="exp-icon" aria-hidden="true">{a.icon}</p>}
                  <h2 className="display exp-title">{tr(a.name, lang)}</h2>
                  <p className="lead">{tr(a.description, lang)}</p>
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
