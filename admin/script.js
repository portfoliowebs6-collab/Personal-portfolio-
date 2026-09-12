"use strict";

/* =========================================================
   ADMIN LOGIN SCRIPT
   Deepak Kewat Portfolio Admin Panel
   ========================================================= */

const API_BASE_URL =
  (window.API_BASE_URL || "").replace(/\/$/, "");

const loginForm = document.getElementById("loginForm");
const adminPassword = document.getElementById("adminPassword");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const togglePassword = document.getElementById("togglePassword");

/* =========================================================
   HELPERS
   ========================================================= */

function setMessage(message, type = "error") {
  if (!loginMessage) return;

  loginMessage.textContent = message;
  loginMessage.className = `login-message ${type}`;
  loginMessage.hidden = false;
}

function setLoading(isLoading) {
  if (!loginButton) return;

  loginButton.disabled = isLoading;

  if (isLoading) {
    loginButton.dataset.originalText =
      loginButton.textContent;

    loginButton.textContent = "Signing in...";
  } else {
    loginButton.textContent =
      loginButton.dataset.originalText || "Login";
  }
}

function getToken() {
  return sessionStorage.getItem("adminToken");
}

/* =========================================================
   REDIRECT IF ALREADY LOGGED IN
   ========================================================= */

if (getToken()) {
  window.location.href = "dashboard.html";
}

/* =========================================================
   PASSWORD SHOW / HIDE
   ========================================================= */

if (togglePassword && adminPassword) {
  togglePassword.addEventListener("click", () => {
    const isPassword =
      adminPassword.type === "password";

    adminPassword.type =
      isPassword ? "text" : "password";

    togglePassword.textContent =
      isPassword ? "🙈" : "👁️";

    togglePassword.setAttribute(
      "aria-label",
      isPassword
        ? "Hide password"
        : "Show password"
    );
  });
}

/* =========================================================
   LOGIN
   ========================================================= */

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const password =
      adminPassword?.value.trim() || "";

    if (!password) {
      setMessage(
        "Please enter your admin password.",
        "error"
      );
      adminPassword?.focus();
      return;
    }

    setLoading(true);
    setMessage("", "info");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            password
          })
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Login failed. Please try again."
        );
      }

      if (!data.token) {
        throw new Error(
          "Login succeeded but no authentication token was received."
        );
      }

      /* Save JWT */
      sessionStorage.setItem(
        "adminToken",
        data.token
      );

      /* Optional admin information */
      if (data.admin) {
        sessionStorage.setItem(
          "adminUser",
          JSON.stringify(data.admin)
        );
      }

      setMessage(
        "Login successful. Opening dashboard...",
        "success"
      );

      setTimeout(() => {
        window.location.href =
          "dashboard.html";
      }, 500);

    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setMessage(
        error.message ||
        "Unable to connect to backend.",
        "error"
      );

      /* Keep password field ready */
      adminPassword?.focus();

    } finally {
      setLoading(false);
    }
  });
}

/* =========================================================
   ENTER KEY SUPPORT
   ========================================================= */

if (adminPassword) {
  adminPassword.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter") {
        loginForm?.requestSubmit();
      }
    }
  );
}

/* =========================================================
   BACKEND CONNECTION CHECK
   ========================================================= */

async function checkBackend() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/health`,
      {
        method: "GET"
      }
    );

    if (!response.ok) {
      throw new Error("Backend unavailable");
    }

    return true;

  } catch (error) {
    console.warn(
      "Backend health check failed:",
      error.message
    );

    return false;
  }
}

/* =========================================================
   INITIAL BACKEND CHECK
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    const connected =
      await checkBackend();

    if (!connected) {
      setMessage(
        "Backend is currently unavailable. Please check your API URL.",
        "error"
      );
    }
  }
);