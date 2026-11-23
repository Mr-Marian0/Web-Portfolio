/*
  Navigation: mobile toggle + active-section tracking.
  The active marker is a single bracket element that MORPHS (slides and
  resizes) from one link to the next instead of jumping.
*/
export function setupNav() {
  const navList = document.getElementById("navList");
  const toggle = document.getElementById("navToggle");
  if (!navList) return;
  const links = [...navList.querySelectorAll("a")];

  const indicator = document.createElement("li");
  indicator.className = "nav-indicator";
  indicator.setAttribute("aria-hidden", "true");
  navList.appendChild(indicator);

  function moveIndicator(link) {
    if (!link) {
      indicator.style.opacity = "0";
      return;
    }
    indicator.style.opacity = "1";
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
  }

  toggle?.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.forEach((link) =>
    link.addEventListener("click", () => {
      navList.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    })
  );

  const sections = links.map((l) => document.getElementById(l.dataset.nav)).filter(Boolean);

  const setActive = (id) => {
    let current = null;
    links.forEach((link) => {
      const on = link.dataset.nav === id;
      if (on) {
        link.setAttribute("aria-current", "true");
        current = link;
      } else link.removeAttribute("aria-current");
    });
    moveIndicator(current);
  };

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
    { rootMargin: "-45% 0px -45% 0px" }
  );
  sections.forEach((s) => observer.observe(s));

  window.addEventListener("resize", () => moveIndicator(navList.querySelector('a[aria-current="true"]')));
  document.fonts?.ready.then(() => moveIndicator(navList.querySelector('a[aria-current="true"]')));
}
