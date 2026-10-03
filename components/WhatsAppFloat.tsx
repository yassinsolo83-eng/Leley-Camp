import { WhatsAppIcon } from "./icons";

export default function WhatsAppFloat({ href, label }: { href: string; label: string }) {
  if (!href) return null;
  return (
    <a className="wa-float" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
      <div className="wa-tooltip">{label}</div>
      <WhatsAppIcon size={30} color="#fff" />
    </a>
  );
}
