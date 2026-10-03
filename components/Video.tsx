import type { Locale, SectionHeading as Heading } from "@/lib/sanity/types";
import SectionHeading from "./SectionHeading";

type Props = { heading?: Heading; videoUrl: string; posterUrl: string; lang: Locale };

export default function Video({ heading, videoUrl, posterUrl, lang }: Props) {
  if (!videoUrl) return null;
  return (
    <section id="video">
      <div className="container">
        <SectionHeading heading={heading} lang={lang} />
        <div className="video-box">
          <video controls playsInline preload="metadata" poster={posterUrl || undefined}>
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
