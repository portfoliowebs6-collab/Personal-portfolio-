:"use strict";

const API_BASE_URL =
  (window.API_BASE_URL || "").replace(/\/$/, "");

export async function renderProjects() {
  const projects = document.getElementById("projects");

  if (!projects) return;

  projects.innerHTML = `
    <section class="projects-section">

      <div class="section-container">

        <div class="section-heading">
          <span class="section-label">MY WORK</span>

          <h2>
            Selected
            <span>projects.</span>
          </h2>

          <p>
            Some of the web applications and digital experiences
            I've worked on.
          </p>
        </div>

        <div class="projects-grid" id="projectsGrid">

          <div class="project-loading">
            Loading projects...
          </div>

        </div>

      </div>

    </section>
  `;

  await loadProjects();
}

async function loadProjects() {
  const grid = document.getElementById("projectsGrid");

  if (!grid) return;

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/projects`
    );

    if (!response.ok) {
      throw new Error("Failed to load projects");
    }

    const data = await response.json();

    const projects = Array.isArray(data)
      ? data
      : data.projects || [];

    if (!projects.length) {
      grid.innerHTML = `
        <div class="project-empty">
          <h3>No projects yet</h3>
          <p>Projects will appear here soon.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = projects
      .filter(project => project.status !== "archived")
      .map(project => createProjectCard(project))
      .join("");

  } catch (error) {

    console.error("Projects error:", error);

    grid.innerHTML = `
      <div class="project-empty">
        <h3>Projects unavailable</h3>
        <p>Please check back soon.</p>
      </div>
    `;
  }
}

function createProjectCard(project) {
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];

  return `
    <article class="project-card">

      <div class="project-image">

        ${
          project.image
            ? `
              <img
                src="${escapeHTML(project.image)}"
                alt="${escapeHTML(project.title)}"
                loading="lazy"
              />
            `
            : `
              <div class="project-placeholder">
                PROJECT
              </div>
            `
        }

        ${
          project.featured
            ? `<span class="featured-badge">Featured</span>`
            : ""
        }

      </div>

      <div class="project-content">

        <h3>${escapeHTML(project.title || "Untitled Project")}</h3>

        <p>
          ${escapeHTML(
            project.description || "No description available."
          )}
        </p>

        <div class="project-tech">

          ${technologies
            .map(
              tech => `
                <span>${escapeHTML(tech)}</span>
              `
            )
            .join("")}

        </div>

        <div class="project-links">

          ${
            project.liveUrl
              ? `
                <a
                  href="${escapeHTML(project.liveUrl)}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Demo ↗
                </a>
              `
              : ""
          }

          ${
            project.githubUrl
              ? `
                <a
                  href="${escapeHTML(project.githubUrl)}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub ↗
                </a>
              `
              : ""
          }

        </div>

      </div>

    </article>
  `;
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}