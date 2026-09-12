"use strict";

export function renderNavbar() {
  const navbar = document.getElementById("navbar");

  if (!navbar) return;

  navbar.innerHTML = `
    <nav class="navbar">
      <div class="nav-container">

        <a href="#home" class="nav-logo">
          <span class="logo-icon">K</span>
          <span>Kewa<span class="logo-accent">Dev</span></span>
        </a>

        <button
          class="nav-toggle"
          id="navToggle"
          aria-label="Toggle navigation"
          aria-expanded="false"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="nav-menu" id="navMenu">
          <a href="#home" class="nav-link active">Home</a>
          <a href="#about" class="nav-link">About</a>
          <a href="#skills" class="nav-link">Skills</a>
          <a href="#projects" class="nav-link">Projects</a>
          <a href="#contact" class="nav-link">Contact</a>

          <a href="assets/cv/Deepak-Kewat-CV.pdf"
             class="nav-cv"
             target="_blank"
             rel="noopener">
            Download CV
          </a>
        </div>

      </div>
    </nav>
  `;

  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  toggle?.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");

    toggle.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]");
    const scrollPosition = window.scrollY + 150;

    sections.forEach((section) => {
      const id = section.getAttribute("id");
      const link = document.querySelector(
        `.nav-link[href="#${id}"]`
      );

      if (!link) return;

      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPosition >= top && scrollPosition < bottom) {
        document
          .querySelectorAll(".nav-link")
          .forEach((item) => item.classList.remove("active"));

        link.classList.add("active");
      }
    });
  });
}