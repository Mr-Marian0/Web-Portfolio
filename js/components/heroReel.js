import { artworks } from "../data/artworks.js";
import { projects } from "../data/projects.js";
import { openLightbox } from "./lightbox.js";

/*
  Hero reel: two vertical columns of art and project images that loop
  forever, moving in opposite directions. Portrait and landscape images both
  fit because every image takes the column width and keeps its own height.

  Each column holds its images twice in a row. The CSS animation moves the
  column up by exactly half its height, so the loop has no visible jump.
*/

function buildPieces() {
  const art = artworks.map((a) => ({ src: a.src, title: a.title, meta: a.medium }));
  const work = projects.flatMap((p) =>
    [p.image, p.additionalImage[0]].filter(Boolean).map((src) => ({ src, title: p.jobType, meta: "Project" }))
  );

  // mix them: art, art, project, art, art, project...
  const mixed = [];
  let w = 0;
  art.forEach((piece, i) => {
    mixed.push(piece);
    if (i % 2 === 1 && w < work.length) mixed.push(work[w++]);
  });
  while (w < work.length) mixed.push(work[w++]);
  return mixed;
}

function buildColumn(pieces, reverse) {
  const col = document.createElement("div");
  col.className = `hero-reel__col${reverse ? " hero-reel__col--down" : ""}`;
  col.style.setProperty("--dur", `${pieces.length * 6}s`);

  const track = document.createElement("div");
  track.className = "hero-reel__track";

  const addSet = (isCopy) => {
    pieces.forEach((piece, i) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "hero-reel__item";
      if (isCopy) {
        item.tabIndex = -1;
        item.setAttribute("aria-hidden", "true");
      } else {
        item.setAttribute("aria-label", `View ${piece.title}`);
      }
      item.innerHTML = `<img src="${piece.src}" alt="" loading="lazy" decoding="async">`;
      item.addEventListener("click", () => {
        const img = item.querySelector("img");
        openLightbox(pieces, i, (n) => (n === i ? img : null));
      });
      track.appendChild(item);
    });
  };

  addSet(false);
  addSet(true);
  col.appendChild(track);
  return col;
}

export function renderHeroReel() {
  const reel = document.getElementById("heroReel");
  if (!reel) return;

  const pieces = buildPieces();
  const left = pieces.filter((_, i) => i % 2 === 0);
  const right = pieces.filter((_, i) => i % 2 === 1);

  reel.appendChild(buildColumn(left, false));
  reel.appendChild(buildColumn(right, true));
}
