"use strict";

export function renderSkills() {
  const skills = document.getElementById("skills");

  if (!skills) return;

  skills.innerHTML = `
    <section class="skills-section">

      <div class="section-container">

        <div class="section-heading center">
          <span class="section-label">MY SKILLS</span>

          <h2>
            Tools I use to
            <span>build things.</span>
          </h2>

          <p>
            A combination of web technologies, AI tools,
            backend services and creative thinking.
          </p>
        </div>

        <div class="skills-grid">

          <div class="skill-card">
            <div class="skill-icon">⌘</div>
            <h3>HTML</h3>
            <p>Semantic and structured web pages.</p>
            <div class="skill-bar">
              <span style="width: 95%"></span>
            </div>
          </div>

          <div class="skill-card">
            <div class="skill-icon">✦</div>
            <h3>CSS</h3>
            <p>Responsive and modern UI design.</p>
            <div class="skill-bar">
              <span style="width: 90%"></span>
            </div>
          </div>

          <div class="skill-card">
            <div class="skill-icon">JS</div>
            <h3>JavaScript</h3>
            <p>Interactive and functional web applications.</p>
            <div class="skill-bar">
              <span style="width: 85%"></span>
            </div>
          </div>

          <div class="skill-card">
            <div class="skill-icon">🔥</div>
            <h3>Firebase</h3>
            <p>Authentication, database and backend services.</p>
            <div class="skill-bar">
              <span style="width: 80%"></span>
            </div>
          </div>

          <div class="skill-card">
            <div class="skill-icon">AI</div>
            <h3>ChatGPT</h3>
            <p>AI-assisted coding, debugging and development.</p>
            <div class="skill-bar">
              <span style="width: 95%"></span>
            </div>
          </div>

          <div class="skill-card">
            <div class="skill-icon">✧</div>
            <h3>Gemini</h3>
            <p>AI-assisted research, coding and creative work.</p>
            <div class="skill-bar">
              <span style="width: 90%"></span>
            </div>
          </div>

        </div>

      </div>

    </section>
  `;
}