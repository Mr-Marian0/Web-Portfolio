import { tools, toolsMeta } from "../data/icons.js";
import { prefersReducedMotion } from "../effects/motion.js";

/*
  Tool tiles + the "readout" panel that unfolds under the row of whichever
  tile was picked. The readout is moved into the grid right after the last
  tile of that row so the rows below get pushed down.

  createToolGrid() -> HTMLElement (wrapper holding the grid)
*/
export function createToolGrid() {
  const wrap = document.createElement("div");
  wrap.className = "tool-grid-wrap";

  const grid = document.createElement("div");
  grid.className = "spec-grid spec-grid--tools";
  grid.setAttribute("role", "list");

  const readout = document.createElement("div");
  readout.className = "tool-readout";
  readout.setAttribute("aria-live", "polite");
  readout.innerHTML = `
    <span class="tool-readout__notch" aria-hidden="true"></span>
    <div class="tool-readout__inner">
      <div class="tool-readout__content">
        <div class="tool-readout__head">
          <p class="tool-readout__title"></p>
          <span class="tool-readout__level" aria-hidden="true">000%</span>
        </div>
        <span class="tool-readout__gauge" aria-hidden="true"><span></span></span>
        <p class="tool-readout__body"></p>
      </div>
    </div>`;

  const readoutTitle = readout.querySelector(".tool-readout__title");
  const readoutBody = readout.querySelector(".tool-readout__body");
  const readoutLevel = readout.querySelector(".tool-readout__level");
  let parkTimer = 0;

  toolsMeta.forEach((meta, i) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "spec-tile";
    tile.style.setProperty("--i", i);
    tile.setAttribute("role", "listitem");
    tile.setAttribute("aria-label", `Show details for ${meta.label}`);
    tile.style.setProperty("--level", `${meta.level}%`);
    tile.innerHTML = `
      <span class="spec-tile__glyph">${tools[meta.key] || ""}</span>
      <span class="spec-tile__label">${meta.label}</span>
      <span class="spec-tile__bar"><span></span></span>
      <span class="spec-tile__corner" aria-hidden="true"></span>
    `;

    tile.addEventListener("click", () => {
      const alreadyOpen = tile.classList.contains("is-active");
      grid.querySelectorAll(".spec-tile").forEach((t) => t.classList.remove("is-active"));
      clearTimeout(parkTimer);

      if (alreadyOpen) {
        readout.classList.remove("is-active", "is-plotting");
        // once folded, move it out of the grid so its empty row adds no gap line
        parkTimer = setTimeout(() => {
          if (!readout.classList.contains("is-active")) grid.after(readout);
        }, prefersReducedMotion ? 0 : 420);
        return;
      }

      tile.classList.add("is-active");
      readoutTitle.textContent = `${meta.label} · Proficiency ${meta.level}%`;
      readoutBody.textContent = meta.description;
      readout.style.setProperty("--level", `${meta.level}%`);

      const anchor = rowEndTile(grid, tile);
      if (readout.previousElementSibling !== anchor) {
        // Jumping rows: fold instantly, re-anchor, then unfold there, keeping
        // the clicked tile still on screen while rows above it collapse.
        const topBefore = tile.getBoundingClientRect().top;
        readout.classList.add("no-anim");
        readout.classList.remove("is-active", "is-plotting");
        anchor.after(readout);
        void readout.offsetWidth;
        readout.classList.remove("no-anim");
        const shift = tile.getBoundingClientRect().top - topBefore;
        if (shift) window.scrollBy({ top: shift, behavior: "instant" });
      }

      positionReadoutNotch(readout, tile);
      if (!readout.classList.contains("is-active")) void readout.offsetWidth;
      readout.classList.add("is-active");

      // replay the plot pass
      readout.classList.remove("is-plotting");
      void readout.offsetWidth;
      readout.classList.add("is-plotting");

      countUp(readoutLevel, meta.level);
    });

    grid.appendChild(tile);
  });

  wrap.append(grid, readout);

  window.addEventListener("resize", () => {
    const active = grid.querySelector(".spec-tile.is-active");
    if (!active) return;
    const anchor = rowEndTile(grid, active);
    if (readout.previousElementSibling !== anchor) anchor.after(readout);
    positionReadoutNotch(readout, active);
  });

  return wrap;
}

/** Last tile in the same visual row as `tile` (column count read from the live grid). */
function rowEndTile(grid, tile) {
  const tiles = [...grid.querySelectorAll(".spec-tile")];
  const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length || 1;
  const idx = tiles.indexOf(tile);
  const end = Math.min(Math.floor(idx / cols) * cols + cols - 1, tiles.length - 1);
  return tiles[end];
}

function positionReadoutNotch(readout, tile) {
  const readoutRect = readout.getBoundingClientRect();
  const tileRect = tile.getBoundingClientRect();
  readout.style.setProperty("--notch-x", `${tileRect.left + tileRect.width / 2 - readoutRect.left}px`);
}

let countUpFrame = 0;
function countUp(el, target) {
  cancelAnimationFrame(countUpFrame);
  const format = (n) => `${String(n).padStart(3, "0")}%`;
  if (prefersReducedMotion) {
    el.textContent = format(target);
    return;
  }
  const duration = 700;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = format(Math.round(target * (1 - Math.pow(1 - t, 3))));
    if (t < 1) countUpFrame = requestAnimationFrame(step);
  };
  countUpFrame = requestAnimationFrame(step);
}
