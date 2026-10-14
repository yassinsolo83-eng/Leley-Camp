import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getContext, pageMetadata } from "@/lib/data";
import LegalPage from "@/components/LegalPage";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { legal, dict } = await getContext(lang);
  return pageMetadata(lang, "/privacy", { title: legal?.privacyTitle }, dict.navPrivacy);
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { legal, dict } = await getContext(lang);

  return (
    <LegalPage
      title={legal?.privacyTitle}
      updatedAt={legal?.privacyUpdatedAt}
      sections={legal?.privacySections}
      lang={lang}
      dict={dict}
      fallbackTitle={dict.navPrivacy}
    />
  );
}
