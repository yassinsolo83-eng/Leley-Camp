import Image from "next/image";

/**
 * A photo that stays still while the page scrolls over it (works on iPhone too:
 * the section clips a fixed layer instead of using background-attachment).
 */
export default function Backdrop({ src, position, alt = "", priority = false }: { src: string; position?: string; alt?: string; priority?: boolean }) {
  if (!src) return null;
  return (
    <div className="backdrop" aria-hidden={alt ? undefined : true}>
      <Image src={src} alt={alt} fill priority={priority} sizes="100vw" style={{ objectFit: "cover", objectPosition: position }} />
    </div>
  );
}
