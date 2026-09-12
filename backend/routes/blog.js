"use strict";

const express = require("express");
const router = express.Router();

const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} = require("../controllers/blogController");

const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.get("/", getBlogs);
router.get("/:id", getBlogById);

// Protected admin routes
router.post("/", authMiddleware, createBlog);
router.put("/:id", authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

module.exports = router;
