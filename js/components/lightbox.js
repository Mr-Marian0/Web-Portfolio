import { prefersReducedMotion, EASE, EASE_IN, EASE_IN_OUT } from "../effects/motion.js";

/*
  Image viewer shared by the art gallery and every skill-card carousel.

  Open/close is a shared-element MORPH: the viewer image starts exactly on top
  of the thumbnail that was clicked (same position, same scale, and a clip-path
  MASK matching whatever crop the thumbnail had), then grows into place.
  Closing runs the same thing in reverse back to the thumbnail.

  openLightbox(items, index, getOrigin)
    items      [{ src, title, meta }]
    index      starting item
    getOrigin  (i) => <img> currently showing item i on the page (or null)
*/

let els = null;
const state = { items: [], index: 0, getOrigin: null, lastFocus: null, busy: false, open: false };

function getEls() {
  if (els) return els;
  const box = document.getElementById("lightbox");
  els = {
    box,
    img: box.querySelector(".lightbox__img"),
    title: box.querySelector(".lightbox__title"),
    meta: box.querySelector(".lightbox__meta"),
    count: box.querySelector(".lightbox__count"),
    caption: box.querySelector(".lightbox__caption"),
    stage: box.querySelector(".lightbox__stage"),
  };
  bind();
  return els;
}

function bind() {
  const { box, stage } = els;
  box.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
  box.querySelector(".lightbox__prev").addEventListener("click", () => step(-1));
  box.querySelector(".lightbox__next").addEventListener("click", () => step(1));
  box.querySelector(".lightbox__backdrop").addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (!state.open) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "Tab") trapFocus(e, box);
  });

  let startX = null;
  stage.addEventListener("pointerdown", (e) => (startX = e.clientX));
  stage.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });
}

function trapFocus(e, container) {
  const focusable = [...container.querySelectorAll("button:not([disabled])")].filter((b) => !b.hidden);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/* Where the picture actually is on screen, accounting for object-fit and any
   overflow-hidden parent cropping it. `content` = full image box, `clip` = the
   visible part of it. */
function visibleRect(img) {
  const outer = img.getBoundingClientRect();
  const cs = getComputedStyle(img);
  const fit = cs.objectFit;
  // the picture is drawn inside the content box (padding excluded)
  const pl = parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth);
  const pr = parseFloat(cs.paddingRight) + parseFloat(cs.borderRightWidth);
  const pt = parseFloat(cs.paddingTop) + parseFloat(cs.borderTopWidth);
  const pb = parseFloat(cs.paddingBottom) + parseFloat(cs.borderBottomWidth);
  const box = { left: outer.left + pl, top: outer.top + pt, width: outer.width - pl - pr, height: outer.height - pt - pb };
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  let content = box;

  if (nw && nh && (fit === "contain" || fit === "cover")) {
    const scale = fit === "contain" ? Math.min(box.width / nw, box.height / nh) : Math.max(box.width / nw, box.height / nh);
    const w = nw * scale;
    const h = nh * scale;
    content = { left: box.left + (box.width - w) / 2, top: box.top + (box.height - h) / 2, width: w, height: h };
  }

  const parent = img.parentElement.getBoundingClientRect();
  const clip = {
    left: Math.max(content.left, box.left, parent.left),
    top: Math.max(content.top, box.top, parent.top),
    right: Math.min(content.left + content.width, box.left + box.width, parent.left + parent.width),
    bottom: Math.min(content.top + content.height, box.top + box.height, parent.top + parent.height),
  };
  return { content, clip };
}

function inViewport(el) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
}

/* Keyframe that places the viewer image over `origin` */
function originFrame(origin, target) {
  const { content, clip } = visibleRect(origin);
  const s = content.width / target.width;
  const dx = content.left - target.left;
  const dy = content.top - target.top;
  const inset = [
    clip.top - content.top,
    content.left + content.width - clip.right,
    content.top + content.height - clip.bottom,
    clip.left - content.left,
  ].map((v) => `${Math.max(0, v / s).toFixed(1)}px`);
  return {
    transform: `translate(${dx}px, ${dy}px) scale(${s})`,
    clipPath: `inset(${inset.join(" ")})`,
    borderRadius: "0px",
  };
}

const settled = { transform: "translate(0px, 0px) scale(1)", clipPath: "inset(0px 0px 0px 0px)", borderRadius: "2px" };

function fillCaption() {
  const { title, meta, count } = els;
  const item = state.items[state.index];
  title.textContent = item.title || "";
  meta.textContent = item.meta || "";
  count.textContent = `${String(state.index + 1).padStart(2, "0")} / ${String(state.items.length).padStart(2, "0")}`;
  els.img.alt = item.title || "";
}

async function loadInto(img, src) {
  img.src = src;
  try {
    await img.decode();
  } catch {
    /* broken image: still open the viewer */
  }
}

export async function openLightbox(items, index, getOrigin) {
  getEls();
  if (state.open || state.busy) return;
  Object.assign(state, { items, index, getOrigin, lastFocus: document.activeElement, open: true, busy: true });

  const { box, img } = els;
  const multiple = items.length > 1;
  box.querySelector(".lightbox__prev").hidden = !multiple;
  box.querySelector(".lightbox__next").hidden = !multiple;

  img.style.opacity = "0";
  box.hidden = false;
  document.body.style.overflow = "hidden";
  fillCaption();
  await loadInto(img, items[index].src);

  box.classList.add("is-open");
  box.querySelector(".lightbox__close").focus({ preventScroll: true });

  const origin = getOrigin?.(index);
  img.style.opacity = "";
  if (origin && inViewport(origin) && !prefersReducedMotion) {
    const from = originFrame(origin, img.getBoundingClientRect());
    origin.style.visibility = "hidden";
    const anim = img.animate([from, settled], { duration: 720, easing: EASE_IN_OUT });
    await anim.finished.catch(() => {});
    origin.style.visibility = "";
  } else {
    await img.animate([{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "none" }], {
      duration: prefersReducedMotion ? 1 : 420,
      easing: EASE,
    }).finished.catch(() => {});
  }
  state.busy = false;
}

async function step(dir) {
  if (!state.open || state.busy || state.items.length < 2) return;
  state.busy = true;
  const { img, caption } = els;
  const n = state.items.length;
  state.index = (state.index + dir + n) % n;
  const quick = prefersReducedMotion ? 1 : null;

  // out: slide + fade the old piece away
  const out = img.animate(
    [{ opacity: 1, transform: "none" }, { opacity: 0, transform: `translateX(${-dir * 48}px)` }],
    { duration: quick || 220, easing: EASE_IN, fill: "forwards" }
  );
  caption.animate([{ opacity: 1 }, { opacity: 0 }], { duration: quick || 180, fill: "forwards" });
  await out.finished.catch(() => {});

  await loadInto(img, state.items[state.index].src);
  fillCaption();
  out.cancel();

  // in: masked wipe from the side we're travelling toward
  img.animate(
    [
      { clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", transform: `translateX(${dir * 48}px)` },
      { clipPath: "inset(0 0 0 0)", transform: "none" },
    ],
    { duration: quick || 620, easing: EASE }
  );
  caption.getAnimations().forEach((a) => a.cancel());
  caption.animate(
    [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }],
    { duration: quick || 420, delay: quick ? 0 : 160, easing: EASE, fill: "backwards" }
  );
  await new Promise((r) => setTimeout(r, quick ? 0 : 260));
  state.busy = false;
}

export async function closeLightbox() {
  if (!state.open || state.busy) return;
  state.busy = true;
  const { box, img } = els;

  box.classList.remove("is-open");
  box.classList.add("is-closing");

  const origin = state.getOrigin?.(state.index);
  if (origin && inViewport(origin) && !prefersReducedMotion) {
    const to = originFrame(origin, img.getBoundingClientRect());
    const anim = img.animate([settled, to], { duration: 560, easing: EASE_IN_OUT, fill: "forwards" });
    await anim.finished.catch(() => {});
    origin.style.visibility = "";
    anim.cancel();
  } else {
    await img.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.95)" }], {
      duration: prefersReducedMotion ? 1 : 320,
      easing: EASE_IN,
      fill: "forwards",
    }).finished.catch(() => {});
  }

  box.hidden = true;
  box.classList.remove("is-closing");
  img.getAnimations().forEach((a) => a.cancel());
  img.removeAttribute("src");
  document.body.style.overflow = "";
  state.lastFocus?.focus({ preventScroll: true });
  Object.assign(state, { open: false, busy: false });
}
