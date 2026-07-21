/* ==========================================================================
   Personal Portfolio — script.js
   1) Intersection Observer: animate section content when it snaps into view
   2) Back to Top button: smooth scroll to the Hero section
   ========================================================================== */

(function () {
  "use strict";

  const container = document.getElementById("snapContainer");
  const pages = document.querySelectorAll(".page");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Scroll-triggered entry animations ---------- */
  if (!reducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const animated = entry.target.querySelectorAll(".animate");
          if (entry.isIntersecting) {
            // Section has snapped into view — play its entry animations
            animated.forEach((el) => el.classList.add("in-view"));
          } else {
            // Section left the viewport — reset so animations replay next visit
            animated.forEach((el) => el.classList.remove("in-view"));
          }
        });
      },
      {
        root: container,     // observe within the snap-scrolling container
        threshold: 0.35,     // fire once ~35% of the section is visible
      }
    );

    pages.forEach((page) => observer.observe(page));
  } else {
    // Fallback: no observer support or reduced motion — show everything
    document.querySelectorAll(".animate").forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- 2. Back to Top ---------- */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      container.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ---------- 3. Smooth in-page anchor scrolling (scroll indicator) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      container.scrollTo({
        top: target.offsetTop,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });
  });
})();
