import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getContext, pageMetadata } from "@/lib/data";
import LegalPage from "@/components/LegalPage";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { legal, dict } = await getContext(lang);
  return pageMetadata(lang, "/terms", { title: legal?.termsTitle }, dict.navTerms);
}

export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { legal, dict } = await getContext(lang);

  return (
    <LegalPage
      title={legal?.termsTitle}
      updatedAt={legal?.termsUpdatedAt}
      sections={legal?.termsSections}
      lang={lang}
      dict={dict}
      fallbackTitle={dict.navTerms}
    />
  );
}
