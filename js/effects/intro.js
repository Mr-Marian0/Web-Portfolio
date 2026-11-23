import { prefersReducedMotion } from "./motion.js";

/*
  Intro sequence
  1. "BI — MO" mark fades in while the accent bar draws out          (0 → 900ms)
  2. the mark lifts away, and the two shutter panels slide apart —
     a split mask that uncovers the page                              (950 → 1750ms)
  3. html.is-ready flips on as the shutters open, which triggers the
     staggered hero reveal in CSS (masked headline lines, photo wipe,
     scribble underline drawing itself, callouts)
*/
export function runIntro() {
  const root = document.documentElement;
  const loader = document.getElementById("introLoader");

  if (!loader || prefersReducedMotion) {
    loader?.remove();
    root.classList.add("is-ready");
    return;
  }

  document.body.style.overflow = "hidden";
  // two frames so the starting styles are committed before the transition
  requestAnimationFrame(() => requestAnimationFrame(() => loader.classList.add("is-drawing")));

  setTimeout(() => loader.classList.add("is-leaving"), 950);
  setTimeout(() => root.classList.add("is-ready"), 1150);
  setTimeout(() => {
    loader.remove();
    document.body.style.overflow = "";
  }, 1900);
}
