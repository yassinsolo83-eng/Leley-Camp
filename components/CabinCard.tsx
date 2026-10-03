import Image from "next/image";
import Link from "next/link";
import { localePath, tr } from "@/lib/i18n";
import { imagePosition, imageUrl } from "@/lib/sanity/image";
import type { Cabin, Locale } from "@/lib/sanity/types";
import { ArrowIcon } from "./icons";

export default function CabinCard({ cabin, lang, cta }: { cabin: Cabin; lang: Locale; cta: string }) {
  const src = imageUrl(cabin.image);
  const name = tr(cabin.name, lang);
  const tag = tr(cabin.tag, lang);
  return (
    <Link className="cabin-card" href={localePath(lang, `/cabins/${cabin.slug}`)}>
      <div className="cabin-card-img">
        {src && <Image src={src} alt={name} fill sizes="(max-width: 760px) 100vw, 33vw" style={{ objectPosition: imagePosition(cabin.image) }} />}
      </div>
      <div className="cabin-card-body">
        {tag && <p className="cabin-tag">{tag}</p>}
        <h3>{name}</h3>
        <p className="cabin-card-text">{tr(cabin.description, lang)}</p>
        <span className="text-link">{cta} <ArrowIcon /></span>
      </div>
    </Link>
  );
}
