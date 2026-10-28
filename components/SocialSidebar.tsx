import { FacebookIcon, InstagramIcon } from "./icons";

type Props = { facebookUrl?: string; instagramUrl?: string };

/** A small vertical bar fixed to the left edge of the screen, always visible while
 * scrolling — a quieter, secondary way to reach the social links (the WhatsApp
 * float button stays as the main contact action, on the other side). */
export default function SocialSidebar({ facebookUrl, instagramUrl }: Props) {
  if (!facebookUrl && !instagramUrl) return null;

  return (
    <div className="social-sidebar">
      {facebookUrl && (
        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <FacebookIcon size={16} />
        </a>
      )}
      {instagramUrl && (
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <InstagramIcon size={16} />
        </a>
      )}
    </div>
  );
}
