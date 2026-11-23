/* Shared motion constants so JS-driven animations match the CSS easing tokens. */
export const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const EASE = "cubic-bezier(0.16, 0.84, 0.44, 1)"; // --ease (expo-ish out)
export const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)"; // --ease-in-out
export const EASE_IN = "cubic-bezier(0.55, 0, 0.75, 0.2)";

/** Element.animate that collapses to an instant jump when reduced motion is on. */
export function animate(el, keyframes, options) {
  if (!el) return null;
  const opts = typeof options === "number" ? { duration: options } : { ...options };
  if (prefersReducedMotion) opts.duration = 1;
  return el.animate(keyframes, { easing: EASE, fill: "both", ...opts });
}

export const wait = (ms) => new Promise((r) => setTimeout(r, prefersReducedMotion ? 0 : ms));
