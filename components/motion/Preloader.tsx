/**
 * Full-screen intro shown once per browser session.
 *
 * The markup is rendered on the server so it covers the very first paint.
 * PRELOADER_HEAD_SCRIPT (inlined in <head>) decides before anything is drawn
 * whether it should show at all; <SiteEffects /> runs the exit animation.
 */

export const PRELOADER_WORD = 'Neaz Morshed';
export const PRELOADER_SEEN_KEY = 'np-preloader-seen';

// Runs before first paint: repeat views in the same session, reduced-motion
// users and the admin area skip the intro entirely.
export const PRELOADER_HEAD_SCRIPT = `(function(){var d=document.documentElement;try{var s=sessionStorage.getItem('${PRELOADER_SEEN_KEY}');var r=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;var a=location.pathname.indexOf('/admin')===0;if(s||r||a){d.classList.add('np-seen');window.__npRevealed=true;}else{d.classList.add('np-loading');setTimeout(function(){if(!d.classList.contains('np-done')){d.classList.add('np-done');d.classList.remove('np-loading','np-exit');window.__npRevealed=true;}},6000);}}catch(e){d.classList.add('np-seen');window.__npRevealed=true;}})();`;

export default function Preloader() {
  const letters = PRELOADER_WORD.toUpperCase().split('');

  return (
    <div id="np-preloader" className="np-preloader" aria-hidden="true">
      <div className="np-preloader__panel">
        <div className="np-preloader__word">
          {letters.map((char, i) =>
            char === ' ' ? (
              <span key={i} className="np-preloader__space" />
            ) : (
              <span
                key={i}
                className="np-preloader__letter"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {char}
              </span>
            )
          )}
        </div>
        <div className="np-preloader__bar" />
        <div className="np-preloader__curve" />
      </div>
    </div>
  );
}
