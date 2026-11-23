/*
  Entry point. Render data-driven sections first, then wire up the effects
  that need the finished DOM (reveal + parallax scan for their targets).

  js/
    data/        content you edit: projects, skills, artworks, icons
    components/  UI pieces: skill cards, carousel, tool grid, gallery, viewer…
    effects/     motion: intro, scroll reveal, parallax, shared easing
*/
import { runIntro } from "./effects/intro.js";
import { setupReveal } from "./effects/reveal.js";
import { setupParallax } from "./effects/parallax.js";
import { renderSkillDeck, renderSoftSkills } from "./components/skillDeck.js";
import { initGallery } from "./components/gallery.js";
import { renderProjects, setupProjectModal } from "./components/projects.js";
import { setupNav } from "./components/nav.js";
import { setupContactForm } from "./components/contactForm.js";
import { renderHeroReel } from "./components/heroReel.js";

function boot() {
  renderHeroReel();
  renderSkillDeck();
  renderSoftSkills();
  initGallery();
  renderProjects();
  setupProjectModal();
  setupNav();
  setupContactForm();
  setupReveal();
  setupParallax();
  runIntro();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
