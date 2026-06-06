// CaePe landing - light interactions only.
// No scroll listeners (IntersectionObserver), reduced-motion aware.

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Scroll reveal (stagger via --reveal-delay) ---- */
  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach((el) => {
    const d = el.getAttribute("data-reveal-delay");
    if (d) el.style.setProperty("--reveal-delay", d);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---- Mobile menu ---- */
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    const setOpen = (open) => {
      menu.hidden = !open;
      menu.style.display = open ? "flex" : "none";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.innerHTML = open
        ? '<i class="ph-bold ph-x" aria-hidden="true"></i>'
        : '<i class="ph-bold ph-list" aria-hidden="true"></i>';
    };
    toggle.addEventListener("click", () => setOpen(menu.hidden));
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  }

  /* ---- FAQ: keep one open at a time ---- */
  const items = document.querySelectorAll(".faq__item");
  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---- Year ---- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
