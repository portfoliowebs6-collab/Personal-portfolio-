/* =========================================================
   DEEPAK KEWAT PORTFOLIO
   Main JavaScript
   ========================================================= */

import { renderNavbar } from "./components/navbar.js";
import { renderHero } from "./components/hero.js";
import { renderAbout } from "./components/about.js";
import { renderSkills } from "./components/skills.js";
import { renderProjects } from "./components/projects.js";
import { renderContact } from "./components/contact.js";

/* =========================================================
   API CONFIG
   ========================================================= */

const API_BASE_URL = (
  window.API_BASE_URL || ""
).replace(/\/$/, "");

/*
  Make API URL available to components.
*/
window.PORTFOLIO_API_URL = API_BASE_URL;

/* =========================================================
   GLOBAL ERROR HANDLING
   ========================================================= */

window.addEventListener("error", (event) => {
  console.error(
    "Portfolio error:",
    event.error || event.message
  );
});

window.addEventListener("unhandledrejection", (event) => {
  console.error(
    "Unhandled promise rejection:",
    event.reason
  );
});

/* =========================================================
   NAVBAR SCROLL EFFECT
   ========================================================= */

function setupNavbarScroll() {
  const navbar =
    document.querySelector(".navbar");

  if (!navbar) return;

  const updateNavbar = () => {
    if (window.scrollY > 30) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  updateNavbar();

  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );
}

/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function setupRevealAnimations() {
  const elements = document.querySelectorAll(
    ".portfolio-section, .skill-card, .project-card, .highlight-card, .contact-info, .contact-form"
  );

  if (!elements.length) return;

  /*
    IntersectionObserver supported browsers
  */
  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        (entries, observerInstance) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "visible"
              );

              observerInstance.unobserve(
                entry.target
              );
            }

          });

        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -40px 0px"
        }
      );

    elements.forEach((element) => {

      element.classList.add("reveal");

      observer.observe(element);

    });

  } else {

    elements.forEach((element) => {
      element.classList.add("visible");
    });

  }
}

/* =========================================================
   SMOOTH ANCHOR HANDLING
   ========================================================= */

function setupSmoothLinks() {
  document.addEventListener(
    "click",
    (event) => {

      const link =
        event.target.closest(
          'a[href^="#"]'
        );

      if (!link) return;

      const targetId =
        link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#"
      ) {
        return;
      }

      const target =
        document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }
  );
}

/* =========================================================
   BACKEND HEALTH CHECK
   ========================================================= */

async function checkBackend() {

  if (!API_BASE_URL) {
    console.warn(
      "⚠️ API_BASE_URL is not configured."
    );

    return false;
  }

  try {

    const response =
      await fetch(
        `${API_BASE_URL}/api/health`,
        {
          method: "GET",
          headers: {
            Accept: "application/json"
          }
        }
      );

    if (!response.ok) {
      throw new Error(
        `Backend returned ${response.status}`
      );
    }

    const data =
      await response.json();

    console.log(
      "🟢 Backend connected:",
      data
    );

    return true;

  } catch (error) {

    console.warn(
      "⚠️ Backend connection failed:",
      error.message
    );

    return false;
  }
}

/* =========================================================
   ANALYTICS TRACKING
   ========================================================= */

function getVisitorId() {

  const storageKey =
    "deepak_portfolio_visitor_id";

  try {

    let visitorId =
      localStorage.getItem(storageKey);

    if (visitorId) {
      return visitorId;
    }

    visitorId =
      window.crypto &&
      typeof window.crypto.randomUUID ===
        "function"
        ? window.crypto.randomUUID()
        : `visitor_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 10)}`;

    localStorage.setItem(
      storageKey,
      visitorId
    );

    return visitorId;

  } catch (error) {

    console.warn(
      "Visitor ID storage unavailable."
    );

    return `visitor_${Date.now()}`;
  }
}

async function trackPageView() {

  if (!API_BASE_URL) {
    return;
  }

  try {

    const payload = {
      visitorId: getVisitorId(),
      page:
        window.location.pathname ||
        "/",
      referrer:
        document.referrer || "",
      userAgent:
        navigator.userAgent || "",
      screenWidth:
        window.innerWidth,
      screenHeight:
        window.innerHeight
    };

    await fetch(
      `${API_BASE_URL}/api/analytics/track`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
          Accept:
            "application/json"
        },

        body:
          JSON.stringify(payload),

        /*
          Analytics should never block
          the portfolio.
        */
        keepalive: true
      }
    );

  } catch (error) {

    console.warn(
      "Analytics tracking failed:",
      error.message
    );
  }
}

/* =========================================================
   BACK TO TOP
   ========================================================= */

function setupBackToTop() {

  const button =
    document.getElementById(
      "backToTop"
    );

  if (!button) return;

  const updateButton = () => {

    if (window.scrollY > 600) {
      button.classList.add("show");
    } else {
      button.classList.remove("show");
    }

  };

  window.addEventListener(
    "scroll",
    updateButton,
    { passive: true }
  );

  button.addEventListener(
    "click",
    () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );

  updateButton();
}

/* =========================================================
   IMAGE ERROR HANDLING
   ========================================================= */

function setupImageFallbacks() {

  document.addEventListener(
    "error",
    (event) => {

      const image =
        event.target;

      if (
        image &&
        image.tagName === "IMG"
      ) {

        image.classList.add(
          "image-load-error"
        );

        /*
          Prevent repeated error loops.
        */
        image.onerror = null;

      }

    },
    true
  );
}

/* =========================================================
   COMPONENT RENDERING
   ========================================================= */

async function renderPortfolio() {

  /*
    Navbar
  */
  renderNavbar();

  /*
    Hero
  */
  renderHero();

  /*
    About
  */
  renderAbout();

  /*
    Skills
  */
  renderSkills();

  /*
    Projects
    This can communicate with backend.
  */
  try {

    await renderProjects();

  } catch (error) {

    console.error(
      "Projects rendering failed:",
      error
    );

    const projects =
      document.getElementById(
        "projects"
      );

    if (projects) {

      projects.innerHTML = `
        <div class="section-container">
          <div class="section-heading">
            <h2>My <span>Projects</span></h2>
            <p>
              Projects are temporarily unavailable.
              Please try again later.
            </p>
          </div>

          <div class="error-state">
            Unable to load projects right now.
          </div>
        </div>
      `;

    }

  }

  /*
    Contact
  */
  renderContact();
}

/* =========================================================
   APPLICATION START
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    console.log(
      "🚀 Deepak Kewat Portfolio starting..."
    );

    /*
      Render everything first.
    */
    await renderPortfolio();

    /*
      Setup interactions after components
      have been inserted into DOM.
    */
    setupNavbarScroll();

    setupSmoothLinks();

    setupRevealAnimations();

    setupBackToTop();

    setupImageFallbacks();

    /*
      Backend check runs in background.
    */
    checkBackend();

    /*
      Track portfolio visit.
    */
    trackPageView();

    console.log(
      "✅ Portfolio loaded successfully."
    );

  }
);