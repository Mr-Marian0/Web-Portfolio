import { tools, toolsMeta, softSkills } from "./image/svg/icons.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ==========================================================================
   Project data
   ========================================================================== */
const Main_Projects = [
  {
    jobType: "Mapping, Field Work & Web Development",
    sheet: "01",
    image: "image/projects/mamuric2.png",
    additionalImage: ["image/projects/mamuric1.png", "image/projects/mamuric3.png"],
    description: "Mapped Network Access Point locations for Mamuric7, an internet provider, then built a local server website with XAMPP so admins could manage that data through CRUD operations.",
    toolsUsed: ["html", "css", "javascript", "php", "xampp"],
  },
  {
    jobType: "Thesis / Capstone — Lab Assistant System",
    sheet: "02",
    image: "image/projects/thesis1.png",
    additionalImage: ["image/projects/thesis2.png", "image/projects/thesis3.png", "image/projects/thesis4.png"],
    description: "A local-server system for managing lab equipment borrowing and user logs, with RFID integration for fast user identification and automatic report generation.",
    toolsUsed: ["html", "css", "javascript", "nodejs", "git", "github", "mysql"],
  },
  {
    jobType: "Identification Reviewer",
    sheet: "03",
    image: "image/projects/revWeb1.png",
    additionalImage: ["image/projects/revWeb4.png", "image/projects/revWeb3.png", "image/projects/revWeb2.png"],
    description: "A study tool I built while prepping for the Civil Service Exam — users enter sentences, pick a word to blank out, and review against answers saved to localStorage.",
    toolsUsed: ["html", "css", "javascript", "vscode", "git", "github"],
  },
  {
    jobType: "Game Development — I'm Not Insane",
    sheet: "04",
    image: "image/projects/gameDev1.png",
    additionalImage: ["image/projects/gameDev2.png", "image/projects/gameDev3.png", "image/projects/gameDev4.png", "image/projects/gameDev5.png"],
    description: "A 2D top-down puzzle game where you solve rooms to escape an asylum. Characters, textures, and UI were drawn in Krita.",
    toolsUsed: ["unity", "csharp", "vscode", "krita", "git", "github"],
  },
];

/* ==========================================================================
   Boot
   ========================================================================== */
window.addEventListener("DOMContentLoaded", () => {
  runIntro();
  renderTools();
  renderSoftSkills();
  renderProjects();
  setupModal();
  setupNav();
  setupReveal();
  setupContactForm();
  setupHeroParallax();
  pickHeroPhoto();
});

/* ==========================================================================
   Intro loader
   ========================================================================== */
function runIntro() {
  const loader = document.getElementById("introLoader");
  if (!loader) return;

  if (prefersReducedMotion) {
    loader.remove();
    return;
  }

  const sides = loader.querySelectorAll(".intro-loader__side");
  const bar = loader.querySelector(".intro-loader__bar");

  requestAnimationFrame(() => {
    sides.forEach((el) => (el.style.transition = "opacity .5s ease"));
    sides.forEach((el) => (el.style.opacity = "1"));
    if (bar) {
      bar.style.transition = "width .7s cubic-bezier(.16,.84,.44,1)";
      bar.style.width = "160px";
    }
  });

  setTimeout(() => {
    loader.style.transition = "opacity .4s ease";
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 420);
  }, 1000);
}

/* ==========================================================================
   Hero photo
   ========================================================================== */
function pickHeroPhoto() {
  const img = document.getElementById("heroPhoto");
  if (!img) return;
  const n = Math.floor(Math.random() * 16) + 1;
  img.src = `image/me${n}.jpg`;
}

function setupHeroParallax() {
  if (prefersReducedMotion) return;
  const frame = document.querySelector(".schematic-frame");
  const overlay = document.querySelector(".grid-overlay");
  if (!frame) return;

  const hero = document.getElementById("home");
  hero.addEventListener("pointermove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    frame.style.transform = `translate(${x * 6}px, ${y * 6}px)`;
    if (overlay) overlay.style.backgroundPosition = `${x * 12}px ${y * 12}px`;
  });

  hero.addEventListener("pointerleave", () => {
    frame.style.transform = "translate(0,0)";
  });
}

/* ==========================================================================
   Tools grid
   ========================================================================== */
function renderTools() {
  const grid = document.getElementById("toolGrid");
  const readout = document.getElementById("toolReadout");
  const readoutTitle = document.getElementById("toolReadoutTitle");
  const readoutBody = document.getElementById("toolReadoutBody");
  const readoutLevel = document.getElementById("toolReadoutLevel");
  if (!grid) return;

  toolsMeta.forEach((meta) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "spec-tile";
    tile.setAttribute("role", "listitem");
    tile.setAttribute("aria-label", `${meta.label} — show details`);
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
      readoutTitle.textContent = `${meta.label} — proficiency ${meta.level}%`;
      readoutBody.textContent = meta.description;
      readout.style.setProperty("--level", `${meta.level}%`);

      const anchor = rowEndTile(grid, tile);
      const needsMove = readout.previousElementSibling !== anchor;

      if (needsMove) {
        // Jumping to another row: fold the old one instantly, re-anchor after the
        // new row, then unfold there. Keep the clicked tile still on screen while
        // the rows above it collapse.
        const topBefore = tile.getBoundingClientRect().top;
        readout.classList.add("no-anim");
        readout.classList.remove("is-active", "is-plotting");
        anchor.after(readout);
        void readout.offsetWidth;
        readout.classList.remove("no-anim");
        const shift = tile.getBoundingClientRect().top - topBefore;
        if (shift) window.scrollBy({ top: shift, behavior: "instant" });
      }

      // Opening fresh: commit the notch position before activating so it pops in
      // under the tile; it only glides when hopping between tiles in one row.
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

  window.addEventListener("resize", () => {
    const active = grid.querySelector(".spec-tile.is-active");
    if (!active) return;
    const anchor = rowEndTile(grid, active);
    if (readout.previousElementSibling !== anchor) anchor.after(readout);
    positionReadoutNotch(readout, active);
  });
}

let parkTimer = 0;

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
  const x = tileRect.left + tileRect.width / 2 - readoutRect.left;
  readout.style.setProperty("--notch-x", `${x}px`);
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
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = format(Math.round(target * eased));
    if (t < 1) countUpFrame = requestAnimationFrame(step);
  };
  countUpFrame = requestAnimationFrame(step);
}

/* ==========================================================================
   Soft skills grid
   ========================================================================== */
function renderSoftSkills() {
  const grid = document.getElementById("softSkillGrid");
  if (!grid) return;

  softSkills.forEach((skill) => {
    const tile = document.createElement("div");
    tile.className = "spec-tile spec-tile--soft";
    tile.setAttribute("role", "listitem");
    tile.style.setProperty("--level", `${skill.level}%`);
    tile.innerHTML = `
      <span class="spec-tile__glyph">${skill.svg}</span>
      <span class="spec-tile__label">${skill.name}</span>
      <p>${skill.description}</p>
      <span class="spec-tile__bar"><span></span></span>
    `;
    grid.appendChild(tile);
  });
}

/* ==========================================================================
   Projects grid
   ========================================================================== */
function renderProjects() {
  const grid = document.getElementById("projectGrid");
  if (!grid) return;

  Main_Projects.forEach((project, index) => {
    const toolIcons = project.toolsUsed.map((key) => tools[key] || "").join("");

    const card = document.createElement("article");
    card.className = "project-card";
    card.innerHTML = `
      <div class="project-card__media">
        <span class="project-card__sheet">Sheet ${project.sheet}/04</span>
        <img src="${project.image}" alt="Screenshot from ${project.jobType}" loading="lazy">
      </div>
      <div class="project-card__body">
        <h3>${project.jobType}</h3>
        <p>${project.description.length > 110 ? project.description.slice(0, 110) + "…" : project.description}</p>
        <div class="project-card__tools" aria-hidden="true">${toolIcons}</div>
        <button class="project-card__cta" data-index="${index}" type="button">Read more →</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll(".project-card__cta").forEach((btn) => {
    btn.addEventListener("click", () => openModal(parseInt(btn.dataset.index, 10)));
  });
}

/* ==========================================================================
   Modal
   ========================================================================== */
let lastFocusedElement = null;

function setupModal() {
  const modal = document.getElementById("imageModal");
  const closeBtn = document.getElementById("modalClose");
  if (!modal) return;

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
    if (e.key === "Tab" && !modal.hidden) trapFocus(e, modal);
  });
}

function trapFocus(e, container) {
  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])'
  );
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
  const project = Main_Projects[projectIndex];
  const modal = document.getElementById("imageModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalImage = document.getElementById("modalImage");
  const modalDescription = document.getElementById("modalDescription");
  const modalToolsList = document.getElementById("modalToolsList");
  const modalThumbnails = document.getElementById("modalThumbnails");

  lastFocusedElement = document.activeElement;

  modalTitle.textContent = project.jobType;
  modalImage.src = project.image;
  modalImage.alt = `Screenshot from ${project.jobType}`;
  modalDescription.textContent = project.description;

  modalToolsList.innerHTML = project.toolsUsed
    .map((key, i) => `<span class="tool-chip" style="--i:${i}">${tools[key] || ""}${key}</span>`)
    .join("");

  modalThumbnails.innerHTML = "";
  const allImages = [project.image, ...project.additionalImage];
  allImages.forEach((src, idx) => {
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

let modalCloseTimer = 0;
function closeModal() {
  const modal = document.getElementById("imageModal");
  if (modal.hidden || modal.classList.contains("is-closing")) return;

  const finish = () => {
    modal.hidden = true;
    modal.classList.remove("is-closing");
    document.body.style.overflow = "";
  };

  modal.classList.remove("is-open");
  if (lastFocusedElement) lastFocusedElement.focus({ preventScroll: true });

  if (prefersReducedMotion) {
    finish();
    return;
  }
  modal.classList.add("is-closing");
  modalCloseTimer = setTimeout(finish, 580);
}

/* ==========================================================================
   Navigation — active-section tracking + mobile toggle
   ========================================================================== */
function setupNav() {
  const links = document.querySelectorAll(".nav-list a");
  const toggle = document.getElementById("navToggle");
  const navList = document.getElementById("navList");

  if (toggle) {
    toggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    navList.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        navList.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  const sections = ["home", "about", "projects", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.removeAttribute("aria-current"));
        const active = document.querySelector(`.nav-list a[data-nav="${entry.target.id}"]`);
        if (active) active.setAttribute("aria-current", "true");
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   Scroll reveal
   ========================================================================== */
function setupReveal() {
  const targets = document.querySelectorAll("[data-reveal], .project-card, .spec-tile");

  if (prefersReducedMotion) {
    targets.forEach((t) => t.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((t) => observer.observe(t));
}

/* ==========================================================================
   Contact form
   ========================================================================== */
function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const status = document.getElementById("formStatus");
  const fields = {
    name: { input: document.getElementById("inputName"), error: document.getElementById("nameError") },
    email: { input: document.getElementById("inputEmail"), error: document.getElementById("emailError") },
    message: { input: document.getElementById("inputMessage"), error: document.getElementById("messageError") },
  };

  function validate() {
    let valid = true;

    if (!fields.name.input.value.trim()) {
      fields.name.error.textContent = "Please enter your name.";
      valid = false;
    } else {
      fields.name.error.textContent = "";
    }

    const emailValue = fields.email.input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
      fields.email.error.textContent = "Enter a valid email address.";
      valid = false;
    } else {
      fields.email.error.textContent = "";
    }

    if (!fields.message.input.value.trim()) {
      fields.message.error.textContent = "Please add a message.";
      valid = false;
    } else {
      fields.message.error.textContent = "";
    }

    return valid;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) {
      status.textContent = "Please fix the highlighted fields.";
      status.dataset.state = "error";
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    status.textContent = "Sending…";
    status.dataset.state = "";

    const params = {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      message: fields.message.input.value.trim(),
    };

    emailjs
      .send("service_zcz47oc", "template_bf4vakb", params)
      .then(() => {
        status.textContent = "Message sent — thanks for reaching out.";
        status.dataset.state = "success";
        form.reset();
      })
      .catch(() => {
        status.textContent = "Something went wrong. Please email me directly instead.";
        status.dataset.state = "error";
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });
}
