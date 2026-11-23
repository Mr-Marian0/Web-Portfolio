import { prefersReducedMotion, EASE, EASE_IN_OUT } from "../effects/motion.js";

/*
  Carousel used at the top of each skill card.

  Transition (direction-aware):
    - incoming slide is unmasked with a clip-path wipe from the travel side
    - its image eases from a slight zoom/offset back to rest
    - the outgoing image drifts the other way underneath — a short PARALLAX
      that makes the wipe read as one layer sliding over another
    - the caption cross-fades with a small rise

  Autoplay runs off a progress bar animation; it pauses on hover, on focus,
  while off-screen, and is disabled entirely for reduced-motion users.
  Swipe, arrow keys, dots and prev/next all work.

  createCarousel({ slides:[{src,caption}], label, fit, interval, onOpen(index, getImage) })
  returns { el, getImage(index) }
*/
export function createCarousel({ slides, label, fit = "cover", interval = 5200, onOpen }) {
  const el = document.createElement("div");
  el.className = `carousel carousel--${fit}`;
  el.setAttribute("role", "region");
  el.setAttribute("aria-roledescription", "carousel");
  el.setAttribute("aria-label", label);

  const pad = (n) => String(n).padStart(2, "0");

  el.innerHTML = `
    <div class="carousel__viewport">
      ${slides
        .map(
          (s, i) => `
        <figure class="carousel__slide${i === 0 ? " is-active" : ""}" role="group" aria-roledescription="slide"
                aria-label="${i + 1} of ${slides.length}" style="--bg:url('${new URL(s.src, document.baseURI).href}')" ${i === 0 ? "" : 'aria-hidden="true"'}>
          <img src="${s.src}" alt="${s.caption}" ${i === 0 ? "" : 'loading="lazy"'} draggable="false">
        </figure>`
        )
        .join("")}
      <button class="carousel__zoom" type="button" aria-label="Open image viewer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>
      </button>
    </div>
    <div class="carousel__bar">
      <p class="carousel__caption" aria-live="polite"><span class="carousel__count">${pad(1)}/${pad(slides.length)}</span><span class="carousel__text">${slides[0]?.caption || ""}</span></p>
      <div class="carousel__controls">
        <button class="carousel__arrow" type="button" data-dir="-1" aria-label="Previous slide">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
        </button>
        <div class="carousel__dots">
          ${slides.map((_, i) => `<button type="button" class="carousel__dot" aria-label="Go to slide ${i + 1}" ${i === 0 ? 'aria-current="true"' : ""}></button>`).join("")}
        </div>
        <button class="carousel__arrow" type="button" data-dir="1" aria-label="Next slide">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
    <span class="carousel__progress" aria-hidden="true"><span></span></span>
  `;

  const viewport = el.querySelector(".carousel__viewport");
  const slideEls = [...el.querySelectorAll(".carousel__slide")];
  const dots = [...el.querySelectorAll(".carousel__dot")];
  const count = el.querySelector(".carousel__count");
  const text = el.querySelector(".carousel__text");
  const progressBar = el.querySelector(".carousel__progress span");

  let index = 0;
  let busy = false;
  let progress = null;
  const pauseReasons = new Set();

  function go(next, dir) {
    if (busy || next === index || slides.length < 2) return;
    busy = true;
    const prev = index;
    index = (next + slides.length) % slides.length;
    dir = dir || (index > prev ? 1 : -1);

    const out = slideEls[prev];
    const inc = slideEls[index];
    const quick = prefersReducedMotion ? 1 : null;

    out.classList.add("is-leaving");
    out.classList.remove("is-active");
    inc.classList.add("is-active");
    inc.removeAttribute("aria-hidden");
    out.setAttribute("aria-hidden", "true");

    inc.animate(
      [{ clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
      { duration: quick || 900, easing: EASE_IN_OUT }
    );
    inc.querySelector("img").animate(
      [{ transform: `translateX(${dir * 8}%) scale(1.12)` }, { transform: "translateX(0) scale(1)" }],
      { duration: quick || 1100, easing: EASE }
    );
    const drift = out.querySelector("img").animate(
      [{ transform: "translateX(0) scale(1)" }, { transform: `translateX(${-dir * 14}%) scale(1.04)` }],
      { duration: quick || 900, easing: EASE_IN_OUT, fill: "forwards" }
    );

    text.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-6px)" }], {
      duration: quick || 200,
      fill: "forwards",
    }).finished.then(() => {
      text.textContent = slides[index].caption;
      count.textContent = `${pad(index + 1)}/${pad(slides.length)}`;
      text.getAnimations().forEach((a) => a.cancel());
      text.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], {
        duration: quick || 380,
        easing: EASE,
      });
    });

    dots.forEach((d, i) => (i === index ? d.setAttribute("aria-current", "true") : d.removeAttribute("aria-current")));

    drift.finished.then(() => {
      out.classList.remove("is-leaving");
      drift.cancel();
      busy = false;
    });

    restartProgress();
  }

  /* ---- autoplay ---------------------------------------------------- */
  function restartProgress() {
    if (prefersReducedMotion || slides.length < 2) return;
    progress?.cancel();
    progress = progressBar.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
      duration: interval,
      easing: "linear",
      fill: "forwards",
    });
    progress.onfinish = () => go(index + 1, 1);
    if (pauseReasons.size) progress.pause();
  }

  function pause(reason) {
    pauseReasons.add(reason);
    progress?.pause();
  }
  function resume(reason) {
    pauseReasons.delete(reason);
    if (!pauseReasons.size && progress?.playState === "paused") progress.play();
  }

  el.addEventListener("pointerenter", () => pause("hover"));
  el.addEventListener("pointerleave", () => resume("hover"));
  el.addEventListener("focusin", () => pause("focus"));
  el.addEventListener("focusout", (e) => {
    if (!el.contains(e.relatedTarget)) resume("focus");
  });

  new IntersectionObserver(([entry]) => (entry.isIntersecting ? resume("offscreen") : pause("offscreen")), {
    threshold: 0.25,
  }).observe(el);
  document.addEventListener("visibilitychange", () => (document.hidden ? pause("tab") : resume("tab")));

  pause("offscreen"); // the observer resumes it once visible
  restartProgress();

  /* ---- controls ---------------------------------------------------- */
  el.querySelectorAll(".carousel__arrow").forEach((btn) =>
    btn.addEventListener("click", () => {
      const dir = Number(btn.dataset.dir);
      go(index + dir, dir);
    })
  );
  dots.forEach((dot, i) => dot.addEventListener("click", () => go(i)));

  el.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(index + 1, 1);
    if (e.key === "ArrowLeft") go(index - 1, -1);
  });

  // swipe; a drag must not count as a click-to-open
  let startX = null;
  let dragged = false;
  viewport.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    dragged = false;
  });
  viewport.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) {
      dragged = true;
      go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    }
  });

  // only the slide on screen can be a morph origin for the viewer
  const getImage = (i) => (i === index ? slideEls[i]?.querySelector("img") : null);
  const open = () => onOpen?.(index, getImage);

  viewport.addEventListener("click", (e) => {
    if (dragged || e.target.closest(".carousel__zoom")) return;
    open();
  });
  el.querySelector(".carousel__zoom").addEventListener("click", open);

  return { el, getImage };
}
