import { FacebookIcon, InstagramIcon } from "./icons";

type Props = {
  facebookUrl?: string;
  instagramUrl?: string;
  phoneDisplay?: string;
};

/** A thin strip above the main header — social links and a phone number, visible on every page. */
export default function TopBar({ facebookUrl, instagramUrl, phoneDisplay }: Props) {
  if (!facebookUrl && !instagramUrl && !phoneDisplay) return null;

  return (
    <div className="top-bar">
      <div className="container top-bar-inner">
        {phoneDisplay ? (
          <a className="top-bar-phone" href={`tel:+${phoneDisplay.replace(/\D/g, "")}`} dir="ltr">
            {phoneDisplay}
          </a>
        ) : <span />}
        <div className="top-bar-social">
          {facebookUrl && (
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookIcon size={15} />
            </a>
          )}
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon size={15} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
