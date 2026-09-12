"use strict";

const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} = require("../controllers/blogController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
| Visitors published blogs dekh sakte hain.
*/

// GET /api/blog
router.get("/", getBlogs);

// GET /api/blog/:id
router.get("/:id", getBlogById);


/*
|--------------------------------------------------------------------------
| Protected Admin Routes
|--------------------------------------------------------------------------
| Sirf authenticated admin blog create/edit/delete kar sakta hai.
*/

// POST /api/blog
router.post("/", authMiddleware, createBlog);

// PUT /api/blog/:id
router.put("/:id", authMiddleware, updateBlog);

// DELETE /api/blog/:id
router.delete("/:id", authMiddleware, deleteBlog);


module.exports = router;

📁 Ab routes folder

backend/
└── routes/
    ├── auth.js          ✅
    ├── projects.js      ✅
    ├── messages.js      ✅
    ├── blog.js          ✅
    └── analytics.js     ⏳

🔐 Blog flow

Visitor
   ↓
GET /api/blog
   ↓
Published Blogs

Admin Login
   ↓
JWT 🔐
   ↓
POST / PUT / DELETE
   ↓
Firebase Firestore

Ab routes me sirf "analytics.js" baaki hai. 📈
Uske baad controllers ka kaam start karenge.