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
  follow the theme and its hover colours.

  The Lottie player is fetched here in the background, NOT in index.html.
  A script tag in the page would make the whole site wait for the CDN; this
  way the page renders at once and the icons upgrade when the player arrives.
  If it never arrives, the fallback content simply stays.
*/

const LOTTIE_SRC = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie_light.min.js";
let playerPromise = null;

function loadPlayer() {
  if (window.lottie) return Promise.resolve(window.lottie);
  if (!playerPromise) {
    playerPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = LOTTIE_SRC;
      script.async = true;
      script.onload = () => (window.lottie ? resolve(window.lottie) : reject(new Error("Lottie player missing")));
      script.onerror = () => reject(new Error("Could not load the Lottie player"));
      document.head.appendChild(script);
    });
  }
  return playerPromise;
}

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
  if (!container) return;

  let data;
  try {
    [, data] = await Promise.all([loadPlayer(), loadData(name)]);
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
