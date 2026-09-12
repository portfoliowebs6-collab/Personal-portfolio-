"use strict";

export function renderAbout() {
  const about = document.getElementById("about");

  if (!about) return;

  about.innerHTML = `
    <section class="about-section">

      <div class="section-container">

        <div class="section-heading">
          <span class="section-label">ABOUT ME</span>

          <h2>
            Building ideas into
            <span>digital experiences.</span>
          </h2>

          <p>
            I'm a self-taught AI-assisted web developer and designer
            focused on creating useful, modern and visually engaging
            websites.
          </p>
        </div>

        <div class="about-grid">

          <div class="about-image-card">
            <img
              src="assets/images/profile.jpg"
              alt="Deepak Kewat"
              loading="lazy"
            />

            <div class="image-overlay">
              <strong>Creative Developer</strong>
              <span>AI + Web + Design</span>
            </div>
          </div>

          <div class="about-content">

            <h3>
              Turning creativity into
              <span>working products.</span>
            </h3>

            <p>
              I use modern development tools and AI assistants to
              design, build, improve and deploy web applications.
            </p>

            <p>
              My focus is not only on making a website look good,
              but also on making it responsive, functional,
              secure and easy to use.
            </p>

            <div class="about-points">

              <div class="about-point">
                <span>01</span>
                <div>
                  <strong>AI-Assisted Development</strong>
                  <p>
                    Faster development with modern AI tools.
                  </p>
                </div>
              </div>

              <div class="about-point">
                <span>02</span>
                <div>
                  <strong>Creative UI Design</strong>
                  <p>
                    Clean, modern and interactive interfaces.
                  </p>
                </div>
              </div>

              <div class="about-point">
                <span>03</span>
                <div>
                  <strong>Deployment & Hosting</strong>
                  <p>
                    Taking websites from code to live production.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  `;
}