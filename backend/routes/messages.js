"use strict";

const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const {
  getMessages,
  getMessageById,
  createMessage,
  updateMessageStatus,
  deleteMessage
} = require("../controllers/messageController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Route
|--------------------------------------------------------------------------
| Portfolio contact form se visitor message bhej sakta hai.
*/

// POST /api/messages
router.post("/", createMessage);


/*
|--------------------------------------------------------------------------
| Protected Admin Routes
|--------------------------------------------------------------------------
| Sirf authenticated admin messages dekh/edit/delete kar sakta hai.
*/

// GET /api/messages
router.get("/", authMiddleware, getMessages);

// GET /api/messages/:id
router.get("/:id", authMiddleware, getMessageById);

// PATCH /api/messages/:id/status
router.patch(
  "/:id/status",
  authMiddleware,
  updateMessageStatus
);

// DELETE /api/messages/:id
router.delete(
  "/:id",
  authMiddleware,
  deleteMessage
);


module.exports = router;

📁 Location

backend/
└── routes/
    ├── auth.js          ✅
    ├── projects.js      ✅
    ├── messages.js      ← अभी बनाया
    ├── blog.js          ⏳
    └── analytics.js     ⏳

🔄 Flow

Visitor
  ↓
Contact Form
  ↓
POST /api/messages
  ↓
Firebase Firestore
  ↓
Admin Dashboard
  ↓
GET /api/messages 🔐

Next: "backend/controllers/messageController.js" — यही Firebase में message save, fetch, status update और delete करेगा.
