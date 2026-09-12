"use strict";

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = "deepak-kewat-portfolio";

function authMiddleware(req, res, next) {
  if (!JWT_SECRET) {
    console.error("❌ JWT_SECRET is not configured.");
    return res.status(500).json({
      success: false,
      message: "Server authentication configuration error."
    });
  }

  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing."
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER
    });

    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required."
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error("❌ Authentication error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authentication token has expired."
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token."
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed."
    });
  }
}

module.exports = authMiddleware;
