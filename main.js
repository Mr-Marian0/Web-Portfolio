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

      if (alreadyOpen) {
        readout.classList.remove("is-active");
        return;
      }

      tile.classList.add("is-active");
      readoutTitle.textContent = `${meta.label} — proficiency ${meta.level}%`;
      readoutBody.textContent = meta.description;
      readout.classList.add("is-active");
    });

    grid.appendChild(tile);
  });
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
    .map((key) => `<span class="tool-chip">${tools[key] || ""}${key}</span>`)
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
    thumb.addEventListener("click", () => selectThumb(src, thumb));
    thumb.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectThumb(src, thumb);
      }
    });
    modalThumbnails.appendChild(thumb);
  });

  modal.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("modalClose").focus();
}

function selectThumb(src, thumb) {
  document.getElementById("modalImage").src = src;
  document.querySelectorAll(".modal-thumb").forEach((t) => t.classList.remove("active"));
  thumb.classList.add("active");
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocusedElement) lastFocusedElement.focus();
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
