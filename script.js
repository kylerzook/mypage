/* ==========================================================================
   Personal Portfolio — script.js
   1) Intersection Observer: animate section content when it scrolls into view
   2) Section nav rail: highlight the section currently in view
   3) Back to Top + smooth in-page anchor scrolling
   ========================================================================== */

(function () {
  "use strict";

  const container = document.getElementById("snapContainer");
  const pages = Array.prototype.slice.call(document.querySelectorAll(".page"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Scroll-triggered entry animations ---------- */
  if (!reducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const animated = entry.target.querySelectorAll(".animate");
          if (entry.isIntersecting) {
            // Section scrolled into view — play its entry animations
            animated.forEach((el) => el.classList.add("in-view"));
          } else {
            // Section left the viewport — reset so animations replay next visit
            animated.forEach((el) => el.classList.remove("in-view"));
          }
        });
      },
      {
        root: container,     // observe within the scrolling container
        threshold: 0.25,     // fire once ~25% of the section is visible
      }
    );

    pages.forEach((page) => observer.observe(page));
  } else {
    // Fallback: no observer support or reduced motion — show everything
    document.querySelectorAll(".animate").forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- 2. Section nav rail ---------- */
  const navLinks = Array.prototype.slice.call(document.querySelectorAll(".page-nav a"));

  function syncNav() {
    if (!navLinks.length) return;

    // The active section is the last one whose top has passed the fold line.
    const fold = container.scrollTop + container.clientHeight * 0.35;
    let activeId = pages.length ? pages[0].id : null;

    pages.forEach((page) => {
      if (page.offsetTop <= fold) activeId = page.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + activeId);
    });
  }

  let ticking = false;
  container.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        syncNav();
        ticking = false;
      });
    },
    { passive: true }
  );
  window.addEventListener("resize", syncNav);
  syncNav();

  /* ---------- 3. Back to Top ---------- */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      container.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ---------- 4. Smooth in-page anchor scrolling ---------- */
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
