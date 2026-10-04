import Image, { getImageProps } from "next/image";

type Props = {
  src: string;
  position?: string;
  /** Optional different photo for phones (portrait). */
  mobileSrc?: string;
  mobilePosition?: string;
  alt?: string;
  priority?: boolean;
};

const PHONE = "(max-width: 767px)";

/**
 * A photo that stays still while the page scrolls over it (works on iPhone too:
 * the section clips a fixed layer instead of using background-attachment).
 */
export default function Backdrop({ src, position, mobileSrc, mobilePosition, alt = "", priority = false }: Props) {
  if (!src) return null;
  const hidden = alt ? undefined : true;

  if (!mobileSrc) {
    return (
      <div className="backdrop" aria-hidden={hidden}>
        <Image src={src} alt={alt} fill priority={priority} sizes="100vw" style={{ objectFit: "cover", objectPosition: position }} />
      </div>
    );
  }

  // Phones and computers each download only their own photo.
  const common = { alt, fill: true, priority, sizes: "100vw" };
  const { props: { srcSet: desktopSet } } = getImageProps({ ...common, src });
  const { props: { srcSet: phoneSet, ...rest } } = getImageProps({ ...common, src: mobileSrc });
  const vars = { "--pos": position || "50% 50%", "--pos-phone": mobilePosition || "50% 50%" } as React.CSSProperties;

  return (
    <div className="backdrop" aria-hidden={hidden} style={vars}>
      <picture>
        <source media={PHONE} srcSet={phoneSet} />
        <source media="(min-width: 768px)" srcSet={desktopSet} />
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img {...rest} className="backdrop-art" />
      </picture>
    </div>
  );
}
