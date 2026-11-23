import { hardSkillGroups } from "../data/skills.js";
import { softSkills } from "../data/icons.js";
import { createCarousel } from "./carousel.js";
import { createToolGrid } from "./toolGrid.js";
import { openLightbox } from "./lightbox.js";
import { prefersReducedMotion } from "../effects/motion.js";
import { mountLottie } from "../effects/lottieIcon.js";

/*
  The three hard-skill cards: header, carousel, then the skill list(s).
  The programming card additionally gets the tool tiles.
  Each card has a pointer-tracking glow on its border (a MASKED radial gradient).
*/
export function renderSkillDeck() {
  const deck = document.getElementById("skillDeck");
  if (!deck) return;

  hardSkillGroups.forEach((group, gi) => {
    const card = document.createElement("article");
    card.className = `skill-card skill-card--${group.id}${group.wide ? " skill-card--wide" : ""}`;
    card.style.setProperty("--i", gi);
    card.setAttribute("aria-labelledby", `skill-${group.id}-title`);

    card.innerHTML = `
      <header class="skill-card__head">
        <span class="skill-card__code" aria-hidden="true">${group.code}</span>
        <div>
          <h3 id="skill-${group.id}-title">${group.title}</h3>
          <p class="skill-card__blurb">${group.blurb}</p>
        </div>
      </header>
    `;

    const carousel = createCarousel({
      slides: group.slides,
      label: `${group.title} gallery`,
      fit: group.fit,
      interval: 5200 + gi * 900, // offset so the three cards never flip in unison
      onOpen: (index, getImage) =>
        openLightbox(
          group.slides.map((s) => ({ src: s.src, title: s.caption, meta: group.title })),
          index,
          getImage
        ),
    });
    card.appendChild(carousel.el);

    const body = document.createElement("div");
    body.className = "skill-card__body";

    if (group.tools) {
      const block = document.createElement("section");
      block.className = "skill-card__block skill-card__block--tools";
      block.innerHTML = `<h4 class="skill-card__label">Tools I have used <span>· select one</span></h4>`;
      block.appendChild(createToolGrid());
      body.appendChild(block);
    }

    group.lists.forEach((list) => {
      const block = document.createElement("section");
      block.className = "skill-card__block";
      block.innerHTML = `
        <h4 class="skill-card__label">${list.label}</h4>
        <ol class="skill-list">
          ${list.items
            .map(
              (item, i) =>
                `<li style="--i:${i}"><span class="skill-list__num">${String(i + 1).padStart(2, "0")}</span><span class="skill-list__name">${item}</span></li>`
            )
            .join("")}
        </ol>`;
      body.appendChild(block);
    });

    card.appendChild(body);
    deck.appendChild(card);
    trackGlow(card);
    if (group.icon) mountLottie(card.querySelector(".skill-card__code"), group.icon, card);
  });
}

function trackGlow(card) {
  if (prefersReducedMotion) return;
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
}

export function renderSoftSkills() {
  const grid = document.getElementById("softSkillGrid");
  if (!grid) return;

  softSkills.forEach((skill, i) => {
    const tile = document.createElement("div");
    tile.className = "spec-tile spec-tile--soft";
    tile.setAttribute("role", "listitem");
    tile.style.setProperty("--level", `${skill.level}%`);
    tile.style.setProperty("--i", i);
    tile.innerHTML = `
      <span class="spec-tile__glyph">${skill.svg}</span>
      <span class="spec-tile__label">${skill.name}</span>
      <p>${skill.description}</p>
      <span class="spec-tile__bar"><span></span></span>
    `;
    grid.appendChild(tile);
    if (skill.lottie) mountLottie(tile.querySelector(".spec-tile__glyph"), skill.lottie, tile);
  });
}
