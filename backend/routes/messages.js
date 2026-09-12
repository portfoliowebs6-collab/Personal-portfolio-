"use strict";

const express = require("express");
const router = express.Router();

const {
  createMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

// Public route
router.post("/", createMessage);

// Protected admin routes
router.get("/", authMiddleware, getMessages);
router.get("/:id", authMiddleware, getMessageById);
router.patch("/:id/status", authMiddleware, updateMessageStatus);
router.delete("/:id", authMiddleware, deleteMessage);

module.exports = router;
