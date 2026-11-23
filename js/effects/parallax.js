import { prefersReducedMotion } from "./motion.js";

/*
  Scroll parallax.
    data-parallax="0.12"        speed; positive drifts up as you scroll down
    data-parallax-axis="x"      move horizontally instead (marquee bands)
    data-parallax-max="60"      clamp in px (optional)

  Offsets are written to the CSS `translate` property, not `transform`, so
  they stack with any hover/reveal transforms on the same element.
  Position is measured from the parent, which the offset never moves, so
  there is no feedback jitter.

  Also drives:
    --scroll on <html>          0→1 page progress (nav progress bar)
    pointer parallax in the hero
*/
export function setupParallax() {
  const root = document.documentElement;
  const items = [...document.querySelectorAll("[data-parallax]")].map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax) || 0,
    axis: el.dataset.parallaxAxis === "x" ? "x" : "y",
    max: parseFloat(el.dataset.parallaxMax) || Infinity,
  }));

  let queued = false;

  function update() {
    queued = false;
    const vh = window.innerHeight;
    const scrollable = root.scrollHeight - vh;
    root.style.setProperty("--scroll", scrollable > 0 ? (window.scrollY / scrollable).toFixed(4) : "0");

    if (prefersReducedMotion) return;

    for (const item of items) {
      const rect = (item.el.parentElement || item.el).getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) continue;
      const fromCenter = rect.top + rect.height / 2 - vh / 2;
      let offset = -fromCenter * item.speed;
      offset = Math.max(-item.max, Math.min(item.max, offset));
      item.el.style.translate = item.axis === "x" ? `${offset.toFixed(1)}px 0` : `0 ${offset.toFixed(1)}px`;
    }
  }

  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  update();

  setupHeroPointer();
}

/* Hero: the image reel and the background grid lean toward the pointer. */
function setupHeroPointer() {
  if (prefersReducedMotion) return;
  const hero = document.getElementById("home");
  const frame = document.querySelector(".hero-reel");
  const overlay = document.querySelector(".grid-overlay");
  if (!hero || !frame) return;

  hero.addEventListener("pointermove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    frame.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    if (overlay) overlay.style.backgroundPosition = `${x * 14}px ${y * 14}px`;
  });

  hero.addEventListener("pointerleave", () => {
    frame.style.transform = "";
    if (overlay) overlay.style.backgroundPosition = "";
  });
}
