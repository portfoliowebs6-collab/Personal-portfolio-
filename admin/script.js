"use strict";

/* =========================================================
   ADMIN LOGIN SCRIPT
   Deepak Kewat Portfolio Admin Panel
   ========================================================= */


/* =========================================================
   API CONFIG
   ========================================================= */

const API_BASE_URL =
  (window.API_BASE_URL || "").replace(/\/$/, "");


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const loginForm =
  document.getElementById("loginForm");

const adminPassword =
  document.getElementById("adminPassword");

const loginButton =
  document.getElementById("loginButton");

const loginMessage =
  document.getElementById("loginMessage");

const togglePassword =
  document.getElementById("togglePassword");


/* =========================================================
   STORAGE KEYS
   ========================================================= */

const TOKEN_KEY = "adminToken";
const ADMIN_KEY = "adminUser";


/* =========================================================
   MESSAGE HELPER
   ========================================================= */

function setMessage(
  message,
  type = "error"
) {

  if (!loginMessage) return;


  loginMessage.textContent =
    message;


  loginMessage.className =
    `login-message ${type}`;


  loginMessage.hidden =
    !message;

}


/* =========================================================
   LOADING STATE
   ========================================================= */

function setLoading(isLoading) {

  if (!loginButton) return;


  loginButton.disabled =
    isLoading;


  if (isLoading) {

    if (
      !loginButton.dataset.originalText
    ) {

      loginButton.dataset.originalText =
        loginButton.textContent;

    }


    loginButton.textContent =
      "Signing in...";

  } else {

    loginButton.textContent =
      loginButton.dataset.originalText ||
      "Login";

  }

}


/* =========================================================
   TOKEN FUNCTIONS
   ========================================================= */

function getToken() {

  try {

    return (
      localStorage.getItem(TOKEN_KEY) ||
      sessionStorage.getItem(TOKEN_KEY) ||
      ""
    );

  } catch (error) {

    console.warn(
      "Unable to read authentication token."
    );

    return "";

  }

}


/* =========================================================
   SAVE TOKEN
   ========================================================= */

function saveToken(token) {

  if (!token) {
    return false;
  }


  try {

    /*
     * Save in both storages.
     * This keeps compatibility with
     * existing admin pages.
     */

    localStorage.setItem(
      TOKEN_KEY,
      token
    );

    sessionStorage.setItem(
      TOKEN_KEY,
      token
    );


    return true;

  } catch (error) {

    console.error(
      "Unable to save authentication token:",
      error
    );

    return false;

  }

}


/* =========================================================
   SAVE ADMIN INFO
   ========================================================= */

function saveAdmin(admin) {

  if (!admin) return;


  try {

    const adminData =
      JSON.stringify(admin);


    localStorage.setItem(
      ADMIN_KEY,
      adminData
    );

    sessionStorage.setItem(
      ADMIN_KEY,
      adminData
    );

  } catch (error) {

    console.warn(
      "Unable to save admin information."
    );

  }

}


/* =========================================================
   CLEAR AUTHENTICATION
   ========================================================= */

function clearAuth() {

  try {

    localStorage.removeItem(
      TOKEN_KEY
    );

    localStorage.removeItem(
      ADMIN_KEY
    );


    sessionStorage.removeItem(
      TOKEN_KEY
    );

    sessionStorage.removeItem(
      ADMIN_KEY
    );

  } catch (error) {

    console.warn(
      "Unable to completely clear authentication data."
    );

  }

}


/* =========================================================
   REDIRECT IF ALREADY LOGGED IN
   ========================================================= */

if (getToken()) {

  window.location.replace(
    "dashboard.html"
  );

}


/* =========================================================
   PASSWORD SHOW / HIDE
   ========================================================= */

if (
  togglePassword &&
  adminPassword
) {

  togglePassword.addEventListener(
    "click",
    () => {

      const isPassword =
        adminPassword.type ===
        "password";


      adminPassword.type =
        isPassword
          ? "text"
          : "password";


      togglePassword.textContent =
        isPassword
          ? "🙈"
          : "👁️";


      togglePassword.setAttribute(
        "aria-label",
        isPassword
          ? "Hide password"
          : "Show password"
      );

    }
  );

}


/* =========================================================
   LOGIN
   ========================================================= */

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const password =
        adminPassword?.value.trim() ||
        "";


      /* -----------------------------------------
         PASSWORD VALIDATION
      ----------------------------------------- */

      if (!password) {

        setMessage(
          "Please enter your admin password.",
          "error"
        );


        adminPassword?.focus();

        return;

      }


      /* -----------------------------------------
         API VALIDATION
      ----------------------------------------- */

      if (!API_BASE_URL) {

        setMessage(
          "Backend API URL is not configured.",
          "error"
        );

        return;

      }


      setLoading(true);

      setMessage(
        "",
        "info"
      );


      try {

        /* ---------------------------------------
           LOGIN REQUEST
        --------------------------------------- */

        const response =
          await fetch(
            `${API_BASE_URL}/api/auth/login`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json"
              },

              body: JSON.stringify({
                password
              })
            }
          );


        /* ---------------------------------------
           RESPONSE
        --------------------------------------- */

        let data = {};


        try {

          data =
            await response.json();

        } catch {

          data = {};

        }


        /* ---------------------------------------
           LOGIN ERROR
        --------------------------------------- */

        if (!response.ok) {

          throw new Error(
            data.message ||
            "Login failed. Please try again."
          );

        }


        /* ---------------------------------------
           TOKEN VALIDATION
        --------------------------------------- */

        if (!data.token) {

          throw new Error(
            "Login succeeded but no authentication token was received."
          );

        }


        /* ---------------------------------------
           SAVE AUTH
        --------------------------------------- */

        const tokenSaved =
          saveToken(
            data.token
          );


        if (!tokenSaved) {

          throw new Error(
            "Unable to save login session."
          );

        }


        /* ---------------------------------------
           SAVE ADMIN INFO
        --------------------------------------- */

        if (data.admin) {

          saveAdmin(
            data.admin
          );

        }


        /* ---------------------------------------
           CLEAR PASSWORD
        --------------------------------------- */

        if (adminPassword) {

          adminPassword.value =
            "";

        }


        /* ---------------------------------------
           SUCCESS MESSAGE
        --------------------------------------- */

        setMessage(
          "Login successful. Opening dashboard...",
          "success"
        );


        /* ---------------------------------------
           DASHBOARD REDIRECT
        --------------------------------------- */

        setTimeout(
          () => {

            window.location.replace(
              "dashboard.html"
            );

          },
          400
        );


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


        adminPassword?.focus();


      } finally {

        setLoading(false);

      }

    }
  );

}


/* =========================================================
   ENTER KEY SUPPORT
   ========================================================= */

if (adminPassword) {

  adminPassword.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();

        loginForm?.requestSubmit();

      }

    }
  );

}


/* =========================================================
   BACKEND CONNECTION CHECK
   ========================================================= */

async function checkBackend() {

  if (!API_BASE_URL) {

    return false;

  }


  try {

    const response =
      await fetch(
        `${API_BASE_URL}/api/health`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json"
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
      "🟢 Admin backend connected:",
      data
    );


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


/* =========================================================
   GLOBAL LOGOUT FUNCTION
   ========================================================= */

window.adminLogout =
  function () {

    clearAuth();


    window.location.replace(
      "index.html"
    );

  };