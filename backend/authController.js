"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_TIME_MS = 15 * 60 * 1000;

const loginAttempts = new Map();

/*
|--------------------------------------------------------------------------
| Get Client IP
|--------------------------------------------------------------------------
*/

function getClientIP(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

/*
|--------------------------------------------------------------------------
| Check IP Block
|--------------------------------------------------------------------------
*/

function isBlocked(ip) {
  const record = loginAttempts.get(ip);

  if (!record) {
    return false;
  }

  if (
    Date.now() - record.firstAttempt >
    BLOCK_TIME_MS
  ) {
    loginAttempts.delete(ip);
    return false;
  }

  return record.count >= MAX_LOGIN_ATTEMPTS;
}

/*
|--------------------------------------------------------------------------
| Register Failed Login
|--------------------------------------------------------------------------
*/

function registerFailedAttempt(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (
    !record ||
    now - record.firstAttempt > BLOCK_TIME_MS
  ) {
    loginAttempts.set(ip, {
      count: 1,
      firstAttempt: now
    });

    return;
  }

  record.count += 1;
}

/*
|--------------------------------------------------------------------------
| Clear Failed Attempts
|--------------------------------------------------------------------------
*/

function clearFailedAttempts(ip) {
  loginAttempts.delete(ip);
}

/*
|--------------------------------------------------------------------------
| ADMIN LOGIN
| POST /api/auth/login
|--------------------------------------------------------------------------
*/

async function login(req, res) {
  const ip = getClientIP(req);

  try {
    if (isBlocked(ip)) {
      return res.status(429).json({
        success: false,
        message:
          "Too many failed login attempts. Please try again later."
      });
    }

    const { password } = req.body || {};

    if (
      !password ||
      typeof password !== "string"
    ) {
      registerFailedAttempt(ip);

      return res.status(400).json({
        success: false,
        message: "Password is required."
      });
    }

    if (
      !ADMIN_PASSWORD_HASH ||
      !JWT_SECRET
    ) {
      console.error(
        "Admin authentication environment variables are missing."
      );

      return res.status(500).json({
        success: false,
        message:
          "Authentication service is not configured."
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        ADMIN_PASSWORD_HASH
      );

    if (!passwordMatches) {
      registerFailedAttempt(ip);

      return res.status(401).json({
        success: false,
        message: "Invalid admin password."
      });
    }

    clearFailedAttempts(ip);

    const token = jwt.sign(
      {
        role: "admin",
        type: "admin_session"
      },
      JWT_SECRET,
      {
        expiresIn: "2h",
        issuer: "deepak-kewat-portfolio"
      }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token
    });
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal authentication error."
    });
  }
}

/*
|--------------------------------------------------------------------------
| ADMIN LOGOUT
| POST /api/auth/logout
|--------------------------------------------------------------------------
*/

async function logout(req, res) {
  return res.status(200).json({
    success: true,
    message:
      "Logout handled on the client. Please clear the admin session."
  });
}

/*
|--------------------------------------------------------------------------
| CHECK AUTHENTICATION
| GET /api/auth/me
|--------------------------------------------------------------------------
*/

async function getCurrentAdmin(req, res) {
  return res.status(200).json({
    success: true,
    admin: {
      role: req.admin?.role || "admin",
      type:
        req.admin?.type ||
        "admin_session",
      expiresAt: req.admin?.exp
        ? new Date(
            req.admin.exp * 1000
          ).toISOString()
        : null
    }
  });
}

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  login,
  logout,
  getCurrentAdmin
};