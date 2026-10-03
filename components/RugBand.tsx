/** The woven band inspired by Bedouin sadu rugs. Used sparingly: under page tops and above the footer. */
export default function RugBand({ className = "" }: { className?: string }) {
  return <div className={`rug ${className}`} role="presentation" />;
}
