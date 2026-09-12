"use strict";

const API_BASE_URL =
  (window.API_BASE_URL || "").replace(/\/$/, "");

export function renderContact() {
  const contact = document.getElementById("contact");

  if (!contact) return;

  contact.innerHTML = `
    <section class="contact-section">

      <div class="section-container">

        <div class="section-heading center">
          <span class="section-label">CONTACT</span>

          <h2>
            Let's build something
            <span>great together.</span>
          </h2>

          <p>
            Have an idea, project or opportunity?
            Send me a message.
          </p>
        </div>

        <div class="contact-grid">

          <div class="contact-info">

            <div class="contact-card">
              <span class="contact-icon">✉</span>

              <div>
                <small>Email</small>
                <a href="mailto:kewasoftwere@gmail.com">
                  kewasoftwere@gmail.com
                </a>
              </div>
            </div>

            <div class="contact-card">
              <span class="contact-icon">◉</span>

              <div>
                <small>Availability</small>
                <strong>Open for opportunities</strong>
              </div>
            </div>

            <div class="contact-card">
              <span class="contact-icon">⚡</span>

              <div>
                <small>Response</small>
                <strong>Usually within 24–48 hours</strong>
              </div>
            </div>

          </div>

          <form id="contactForm" class="contact-form">

            <div class="form-row">

              <div class="form-group">
                <label for="contactName">Name</label>
                <input
                  type="text"
                  id="contactName"
                  name="name"
                  placeholder="Your name"
                  required
                  maxlength="100"
                />
              </div>

              <div class="form-group">
                <label for="contactEmail">Email</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="email"
                  placeholder="you@example.com"
                  required
                  maxlength="150"
                />
              </div>

            </div>

            <div class="form-group">

              <label for="contactSubject">Subject</label>

              <input
                type="text"
                id="contactSubject"
                name="subject"
                placeholder="Project inquiry"
                maxlength="200"
              />

            </div>

            <div class="form-group">

              <label for="contactMessage">Message</label>

              <textarea
                id="contactMessage"
                name="message"
                rows="6"
                placeholder="Tell me about your project..."
                required
                maxlength="5000"
              ></textarea>

            </div>

            <button
              type="submit"
              class="btn btn-primary contact-submit"
              id="contactSubmit"
            >
              <span>Send Message</span>
              <span>→</span>
            </button>

            <div
              id="contactStatus"
              class="contact-status"
              aria-live="polite"
            ></div>

          </form>

        </div>

      </div>

    </section>
  `;

  setupContactForm();
}

function setupContactForm() {
  const form = document.getElementById("contactForm");

  if (!form) return;

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const submitButton =
      document.getElementById("contactSubmit");

    const status =
      document.getElementById("contactStatus");

    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim()
    };

    if (!payload.name || !payload.email || !payload.message) {
      showStatus(
        status,
        "Please fill all required fields.",
        "error"
      );
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = `
      <span>Sending...</span>
    `;

    try {

      const response = await fetch(
        `${API_BASE_URL}/api/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Message could not be sent."
        );
      }

      form.reset();

      showStatus(
        status,
        "Message sent successfully. Thank you!",
        "success"
      );

    } catch (error) {

      console.error("Contact error:", error);

      showStatus(
        status,
        error.message || "Something went wrong.",
        "error"
      );

    } finally {

      submitButton.disabled = false;

      submitButton.innerHTML = `
        <span>Send Message</span>
        <span>→</span>
      `;
    }
  });
}

function showStatus(element, message, type) {

  if (!element) return;

  element.textContent = message;
  element.className = `contact-status ${type}`;
}