import { projects } from "../data/projects.js";
import { tools } from "../data/icons.js";
import { prefersReducedMotion } from "../effects/motion.js";

/* ==========================================================================
   Project cards + the plotter-style detail modal
   ========================================================================== */
export function renderProjects() {
  const grid = document.getElementById("projectGrid");
  if (!grid) return;
  const total = String(projects.length).padStart(2, "0");

  projects.forEach((project, index) => {
    const toolIcons = project.toolsUsed.map((key) => tools[key] || "").join("");
    const sheet = String(index + 1).padStart(2, "0");

    const card = document.createElement("article");
    card.className = "project-card";
    card.style.setProperty("--i", index % 2);
    card.innerHTML = `
      <div class="project-card__media" data-mask>
        <span class="project-card__sheet">Sheet ${sheet}/${total}</span>
        <img src="${project.image}" alt="Screenshot from ${project.jobType}" loading="lazy" data-parallax="0.06" data-parallax-max="24">
      </div>
      <div class="project-card__body">
        <h3>${project.jobType}</h3>
        <p>${project.description.length > 110 ? project.description.slice(0, 110) + "…" : project.description}</p>
        <div class="project-card__tools" aria-hidden="true">${toolIcons}</div>
        <div class="project-card__actions">
          <button class="project-card__cta" data-index="${index}" type="button">Read more <span aria-hidden="true">→</span></button>
          ${project.link ? `<a class="project-card__cta project-card__link" href="${project.link}" target="_blank" rel="noopener noreferrer">Visit site <span aria-hidden="true">↗</span></a>` : ""}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll(".project-card__cta").forEach((btn) => {
    btn.addEventListener("click", () => openModal(parseInt(btn.dataset.index, 10)));
  });
}

let lastFocusedElement = null;
let modalCloseTimer = 0;

export function setupProjectModal() {
  const modal = document.getElementById("imageModal");
  if (!modal) return;

  document.getElementById("modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") trapFocus(e, modal);
  });
}

function trapFocus(e, container) {
  const focusable = container.querySelectorAll('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])');
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

function openModal(projectIndex) {
  const project = projects[projectIndex];
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalThumbnails = document.getElementById("modalThumbnails");

  lastFocusedElement = document.activeElement;

  document.getElementById("modalTitle").textContent = project.jobType;
  modalImage.src = project.image;
  modalImage.alt = `Screenshot from ${project.jobType}`;
  document.getElementById("modalDescription").textContent = project.description;
  document.getElementById("modalToolsList").innerHTML = project.toolsUsed
    .map((key, i) => `<span class="tool-chip" style="--i:${i}">${tools[key] || ""}${key}</span>`)
    .join("");

  const modalLink = document.getElementById("modalLink");
  if (project.link) {
    modalLink.href = project.link;
    modalLink.hidden = false;
  } else {
    modalLink.removeAttribute("href");
    modalLink.hidden = true;
  }

  modalThumbnails.innerHTML = "";
  [project.image, ...project.additionalImage].forEach((src, idx) => {
    const thumb = document.createElement("img");
    thumb.src = src;
    thumb.alt = `View ${idx + 1} of ${project.jobType}`;
    thumb.className = "modal-thumb" + (idx === 0 ? " active" : "");
    thumb.loading = "lazy";
    thumb.tabIndex = 0;
    thumb.style.setProperty("--i", idx);
    thumb.addEventListener("click", () => selectThumb(src, thumb));
    thumb.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectThumb(src, thumb);
      }
    });
    modalThumbnails.appendChild(thumb);
  });

  clearTimeout(modalCloseTimer);
  modal.classList.remove("is-closing");
  modal.hidden = false;
  modal.classList.add("is-open");
  modal.querySelector(".modal-dialog").scrollTop = 0;
  document.body.style.overflow = "hidden";
  document.getElementById("modalClose").focus({ preventScroll: true });
}

function selectThumb(src, thumb) {
  if (thumb.classList.contains("active")) return;
  const image = document.getElementById("modalImage");
  const frame = image.parentElement;
  image.src = src;
  frame.classList.remove("is-swapping");
  void frame.offsetWidth;
  frame.classList.add("is-swapping");
  document.querySelectorAll(".modal-thumb").forEach((t) => t.classList.remove("active"));
  thumb.classList.add("active");
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  if (modal.hidden || modal.classList.contains("is-closing")) return;

  const finish = () => {
    modal.hidden = true;
    modal.classList.remove("is-closing");
    document.body.style.overflow = "";
  };

  modal.classList.remove("is-open");
  lastFocusedElement?.focus({ preventScroll: true });

  if (prefersReducedMotion) return finish();
  modal.classList.add("is-closing");
  modalCloseTimer = setTimeout(finish, 580);
}
