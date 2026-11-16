/**
 * Full-screen intro shown once per browser session.
 *
 * The markup is rendered on the server so it covers the very first paint.
 * PRELOADER_HEAD_SCRIPT (inlined in <head>) decides before anything is drawn
 * whether it should show at all, and lifts it on its own timer.
 */

export const PRELOADER_WORD = 'Neaz Morshed';
export const PRELOADER_SEEN_KEY = 'np-preloader-seen';

/** How long the intro stays up on the first visit, from navigation start. */
export const PRELOADER_MS = 750;
/** Length of the curtain-lift animation (html.np-exit in globals.css). */
export const PRELOADER_EXIT_MS = 1000;

/*
 * Inline in <head>, so it runs before the first paint and never waits for
 * React or the JavaScript bundles:
 * 1. Entrance reveals: adds html.np-motion (CSS hides [data-reveal] elements
 *    only when this is set) and marks each element [data-in] once it is in
 *    view and the page is revealed. Content stays visible without JS. A
 *    "wipe" element is fully clipped while hidden, which the browser reports
 *    as never visible, so its parent is watched instead.
 * 2. Intro: on the first homepage visit of a session it shows the preloader
 *    and lifts it after PRELOADER_MS by itself. Repeat visits, other pages,
 *    reduced-motion users and the admin skip it.
 */
export const PRELOADER_HEAD_SCRIPT = `(function(){var d=document.documentElement,w=window;
try{if('IntersectionObserver' in w&&!(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches)){d.classList.add('np-motion');var q=[],show=function(e){e.setAttribute('data-in','')};var io=new IntersectionObserver(function(es){for(var i=0;i<es.length;i++){var e=es[i];if(!e.isIntersecting)continue;io.unobserve(e.target);var ts=e.target.__npt||[e.target];e.target.__npt=null;for(var k=0;k<ts.length;k++){if(w.__npRevealed)show(ts[k]);else q.push(ts[k])}}},{threshold:0.12,rootMargin:'0px 0px -6% 0px'});var reg=function(n){if(n.__npw)return;n.__npw=1;var t=(n.getAttribute('data-reveal')==='wipe'&&n.parentElement)||n;(t.__npt||(t.__npt=[])).push(n);io.observe(t)};var watch=function(n){if(n.nodeType!==1)return;if(n.hasAttribute('data-reveal'))reg(n);if(n.firstElementChild){var l=n.querySelectorAll('[data-reveal]');for(var i=0;i<l.length;i++)reg(l[i])}};new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)watch(a[j])}}).observe(d,{childList:true,subtree:true});w.addEventListener('np:reveal',function(){q.splice(0).forEach(show)})}}catch(e){d.classList.remove('np-motion')}
try{var s=sessionStorage.getItem('${PRELOADER_SEEN_KEY}'),r=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;if(s||r||location.pathname!=='/'){d.classList.add('np-seen');w.__npRevealed=true;return}d.classList.add('np-loading');setTimeout(function(){d.classList.add('np-exit');w.__npRevealed=true;try{sessionStorage.setItem('${PRELOADER_SEEN_KEY}','1')}catch(e){}w.dispatchEvent(new Event('np:reveal'));setTimeout(function(){d.classList.add('np-done');d.classList.remove('np-loading','np-exit')},${PRELOADER_EXIT_MS})},Math.max(0,${PRELOADER_MS}-(w.performance&&performance.now?performance.now():0)))}catch(e){d.classList.add('np-seen');w.__npRevealed=true}})();`;

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
                style={{ animationDelay: `${i * 0.022}s` }}
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
