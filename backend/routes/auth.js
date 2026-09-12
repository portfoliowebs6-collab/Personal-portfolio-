"use strict";

const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  login,
  logout,
  getCurrentAdmin
} = require("../controllers/authController");

const router = express.Router();


// Admin Login
router.post("/login", login);


// Admin Logout
router.post("/logout", logout);


// Current Admin
router.get(
  "/me",
  authMiddleware,
  getCurrentAdmin
);


module.exports = router;
