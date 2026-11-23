import { prefersReducedMotion } from "./motion.js";

/*
  Animated line icons (Lottie files in image/lottie/).

  mountLottie(container, name, trigger)
    container  element the icon is drawn into (its old content stays as a
               fallback until the animation has loaded)
    name       file name without .json, e.g. "paintbrush"
    trigger    element whose hover/focus plays the loop (the card or tile)

  The icon sits still on its first frame and only loops while `trigger` is
  hovered or focused. Colour comes from CSS (currentColor), so the icons
  follow the theme and its hover colours. Needs window.lottie (lottie_light),
  loaded in index.html; without it the fallback content simply stays.
*/

const cache = new Map();

function loadData(name) {
  if (!cache.has(name)) {
    cache.set(name, fetch(`image/lottie/${name}.json`).then((r) => {
      if (!r.ok) throw new Error(`Missing image/lottie/${name}.json`);
      return r.json();
    }));
  }
  // every instance needs its own copy; lottie mutates the data it is given
  return cache.get(name).then((data) => structuredClone(data));
}

export async function mountLottie(container, name, trigger = container) {
  if (!window.lottie || !container) return;

  let data;
  try {
    data = await loadData(name);
  } catch (err) {
    console.warn(err.message);
    return;
  }

  const holder = document.createElement("span");
  holder.className = "lottie-icon";
  holder.setAttribute("aria-hidden", "true");

  const anim = window.lottie.loadAnimation({
    container: holder,
    renderer: "svg",
    loop: true,
    autoplay: false,
    animationData: data,
    rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
  });

  anim.addEventListener("DOMLoaded", () => {
    container.replaceChildren(holder);
    container.classList.add("has-lottie");
    anim.goToAndStop(0, true);
  });

  if (prefersReducedMotion) return;

  const play = () => anim.play();
  const rest = () => anim.goToAndStop(0, true);
  trigger.addEventListener("pointerenter", play);
  trigger.addEventListener("pointerleave", rest);
  trigger.addEventListener("focusin", play);
  trigger.addEventListener("focusout", (e) => {
    if (!trigger.contains(e.relatedTarget)) rest();
  });
}
