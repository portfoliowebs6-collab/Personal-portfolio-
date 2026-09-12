"use strict";

export function renderHero() {
  const hero = document.getElementById("hero");

  if (!hero) return;

  hero.innerHTML = `
    <section class="hero-section">

      <div class="hero-bg"></div>

      <div class="hero-content">

        <div class="hero-badge">
          <span class="status-dot"></span>
          Available for opportunities
        </div>

        <p class="hero-small">
          HELLO, I'M
        </p>

        <h1 class="hero-title">
          Deepak <span>Kewat</span>
        </h1>

        <h2 class="hero-role">
          AI-Assisted Web Developer
          <br>
          <span>Designer & Creative Mind</span>
        </h2>

        <p class="hero-description">
          I build modern, responsive and intelligent web experiences
          using AI-assisted development, clean UI design and powerful
          web technologies.
        </p>

        <div class="hero-buttons">

          <a href="#projects" class="btn btn-primary">
            View My Work
            <span>→</span>
          </a>

          <a href="#contact" class="btn btn-secondary">
            Let's Connect
          </a>

        </div>

        <div class="hero-tech">

          <span>HTML</span>
          <span>CSS</span>
          <span>JavaScript</span>
          <span>Firebase</span>
          <span>AI</span>

        </div>

      </div>

      <div class="hero-scroll">
        <span>Scroll to explore</span>
        <div class="scroll-line"></div>
      </div>

    </section>
  `;
}