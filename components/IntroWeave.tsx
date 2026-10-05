/**
 * Home intro overlay: the Bedouin rug band weaves itself in, the logo and camp
 * name rise, then the whole panel lifts to reveal the hero. All motion lives in
 * CSS (keyframes in globals.css) — this component only renders the markup and a
 * tiny opt-in script.
 *
 * Safe by default: `.leley-intro` is `display: none` in CSS, so with no JS, on a
 * repeat visit this session, or when the visitor prefers reduced motion, the
 * overlay never shows and the hero is visible immediately. The inline script runs
 * before the hero paints and opts the animation IN only when it should play —
 * once per session. It injects a <style> tag (not a class on <html>, which React
 * resets on hydration) so the animation is not interrupted.
 */
export default function IntroWeave({
  logoUrl,
  campName,
  badge,
}: {
  logoUrl?: string;
  campName: string;
  badge?: string;
}) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var p=location.pathname;if((p==="/en"||p==="/en/"||p==="/ar"||p==="/ar/")&&!sessionStorage.getItem("leley-woven")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){var s=document.createElement("style");s.textContent=".leley-intro{display:flex;animation:li-lift .85s cubic-bezier(.76,0,.24,1) 1.9s forwards}.leley-rug-row{animation:weave 1s steps(32,end) .2s both}.leley-rug-row-flip{animation-delay:.34s}[dir=rtl] .leley-rug-row{animation-name:weave-rtl}.leley-intro-logo{animation:li-pop .6s cubic-bezier(.22,.61,.36,1) .95s both}.leley-intro-name{animation:li-rise .6s cubic-bezier(.22,.61,.36,1) 1.2s both}";document.head.appendChild(s);sessionStorage.setItem("leley-woven","1")}}catch(e){}`,
        }}
      />
      <div className="leley-intro" role="presentation" aria-hidden="true">
        <div className="leley-intro-band">
          <div className="leley-rug-row" />
          <div className="leley-rug-row leley-rug-row-flip" />
        </div>
        {logoUrl && (
          <div className="leley-intro-logo">
            {/* Brief decorative splash, not LCP content — a plain img avoids remote-image config. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="" />
          </div>
        )}
        <div className="leley-intro-name">
          <span className="display">{campName}</span>
          {badge && <span className="leley-intro-badge">{badge}</span>}
        </div>
      </div>
    </>
  );
}
