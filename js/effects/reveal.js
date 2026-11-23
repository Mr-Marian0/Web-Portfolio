import { prefersReducedMotion } from "./motion.js";

/*
  Scroll reveal. Anything matching REVEAL_SELECTOR gets .is-visible once it
  scrolls into view; CSS decides what that means (fade, rise, mask wipe…).
  Elements can carry a --i custom property to offset their delay, which is
  how lists and grids get their staggered cascade.
*/
const REVEAL_SELECTOR = "[data-reveal], [data-mask], .project-card, .spec-tile, .skill-card, .skill-list li";

let observer = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  return observer;
}

export function observeReveal(el) {
  if (prefersReducedMotion) {
    el.classList.add("is-visible");
    return;
  }
  getObserver().observe(el);
}

export function setupReveal(root = document) {
  root.querySelectorAll(REVEAL_SELECTOR).forEach(observeReveal);
}
