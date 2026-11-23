import { artworks, artCategories } from "../data/artworks.js";
import { openLightbox } from "./lightbox.js";
import { observeReveal } from "../effects/reveal.js";
import { prefersReducedMotion, EASE, EASE_IN, EASE_IN_OUT } from "../effects/motion.js";

/*
  Art gallery
  - masonry made of up to 3 columns; each column has its own PARALLAX speed
    (data-parallax), so the columns slide past each other while scrolling
  - filters re-layout with a FLIP MORPH: pieces that stay glide to their new
    spot, pieces that leave fade/shrink out, new ones wipe in (MASK) staggered
  - each piece is shown slightly desaturated; a soft circular MASK follows the
    pointer and reveals the full-colour layer underneath it
  - clicking opens the shared viewer, which morphs out of the thumbnail
*/
const PARALLAX_SPEEDS = [0.05, -0.07, 0.03];

export function initGallery() {
  const board = document.getElementById("galleryBoard");
  const filtersEl = document.getElementById("galleryFilters");
  if (!board || !filtersEl) return;

  /* ---- columns (persistent so the parallax module can track them) ---- */
  const cols = PARALLAX_SPEEDS.map((speed) => {
    const col = document.createElement("div");
    col.className = "gallery-col";
    col.dataset.parallax = String(speed);
    col.dataset.parallaxMax = "70";
    board.appendChild(col);
    return col;
  });

  /* ---- items ---------------------------------------------------------- */
  const items = artworks.map((art, i) => {
    const el = document.createElement("figure");
    el.className = "gallery-item";
    el.style.setProperty("--i", i % 3);
    el.innerHTML = `
      <button class="gallery-item__frame" type="button" aria-label="View “${art.title}” larger">
        <img class="gallery-item__base" src="${art.src}" alt="" loading="lazy" draggable="false">
        <img class="gallery-item__color" src="${art.src}" alt="${art.title}" loading="lazy" draggable="false">
        <span class="gallery-item__caption" aria-hidden="true">
          <span class="gallery-item__title">${art.title}</span>
          <span class="gallery-item__medium">${art.medium || ""}</span>
        </span>
      </button>`;

    const color = el.querySelector(".gallery-item__color");
    const markLoaded = () => el.classList.add("is-loaded");
    if (color.complete && color.naturalWidth) markLoaded();
    else color.addEventListener("load", markLoaded, { once: true });

    const frame = el.querySelector(".gallery-item__frame");
    frame.addEventListener("pointermove", (e) => {
      const r = frame.getBoundingClientRect();
      frame.style.setProperty("--mx", `${e.clientX - r.left}px`);
      frame.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
    frame.addEventListener("click", () => {
      const idx = visible.findIndex((v) => v.el === el);
      openLightbox(
        visible.map((v) => ({ src: v.art.src, title: v.art.title, meta: v.art.medium })),
        idx,
        (k) => visible[k]?.el.querySelector(".gallery-item__color")
      );
    });

    return { art, el };
  });

  let visible = items;
  let activeKey = "all";
  let busy = false;

  /* ---- layout --------------------------------------------------------- */
  const colCount = () => (board.clientWidth >= 900 ? 3 : board.clientWidth >= 520 ? 2 : 1);
  let currentCols = 0;

  function layout(list) {
    currentCols = colCount();
    cols.forEach((c, i) => (c.hidden = i >= currentCols));
    list.forEach((it, i) => cols[i % currentCols].appendChild(it.el));
  }

  layout(visible);
  items.forEach((it) => observeReveal(it.el));

  window.addEventListener("resize", () => {
    if (colCount() !== currentCols) layout(visible);
  });

  /* ---- filters -------------------------------------------------------- */
  const indicator = document.createElement("span");
  indicator.className = "gallery-filters__indicator";
  indicator.setAttribute("aria-hidden", "true");
  filtersEl.appendChild(indicator);

  const buttons = artCategories.map((cat) => {
    const count = cat.key === "all" ? items.length : items.filter((it) => it.art.category === cat.key).length;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gallery-filter";
    btn.dataset.key = cat.key;
    btn.setAttribute("aria-pressed", String(cat.key === activeKey));
    btn.innerHTML = `${cat.label}<sup>${String(count).padStart(2, "0")}</sup>`;
    btn.addEventListener("click", () => applyFilter(cat.key));
    filtersEl.appendChild(btn);
    return btn;
  });

  // the indicator MORPHS (position + width) from one filter to the next
  function moveIndicator() {
    const active = buttons.find((b) => b.dataset.key === activeKey);
    if (!active) return;
    indicator.style.width = `${active.offsetWidth}px`;
    indicator.style.transform = `translateX(${active.offsetLeft}px)`;
  }
  requestAnimationFrame(moveIndicator);
  window.addEventListener("resize", moveIndicator);
  document.fonts?.ready.then(moveIndicator);

  async function applyFilter(key) {
    if (busy || key === activeKey) return;
    busy = true;
    activeKey = key;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.key === key)));
    moveIndicator();

    const next = items.filter((it) => key === "all" || it.art.category === key);
    const leaving = visible.filter((it) => !next.includes(it));
    const staying = visible.filter((it) => next.includes(it));
    const entering = next.filter((it) => !visible.includes(it));
    const quick = prefersReducedMotion ? 1 : null;

    // 1. leaving pieces fade + shrink out
    await Promise.all(
      leaving.map((it) =>
        it.el
          .animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.9)" }], {
            duration: quick || 260,
            easing: EASE_IN,
            fill: "forwards",
          })
          .finished.catch(() => {})
      )
    );

    // 2. FLIP: remember where staying pieces were, re-layout, then glide them
    const first = new Map(staying.map((it) => [it, it.el.getBoundingClientRect()]));
    leaving.forEach((it) => {
      it.el.getAnimations().forEach((a) => a.cancel());
      it.el.remove();
    });
    visible = next;
    layout(visible);

    staying.forEach((it) => {
      const a = first.get(it);
      const b = it.el.getBoundingClientRect();
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      it.el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }], {
        duration: quick || 720,
        easing: EASE_IN_OUT,
      });
    });

    // 3. entering pieces wipe up through a mask, staggered
    entering.forEach((it, i) => {
      it.el.classList.add("is-visible");
      it.el.animate(
        [
          { opacity: 0, clipPath: "inset(100% 0 0 0)", transform: "translateY(40px)" },
          { opacity: 1, clipPath: "inset(0 0 0 0)", transform: "translateY(0)" },
        ],
        { duration: quick || 760, delay: quick ? 0 : 180 + i * 80, easing: EASE, fill: "backwards" }
      );
    });

    setTimeout(() => (busy = false), quick ? 0 : 400);
  }
}
