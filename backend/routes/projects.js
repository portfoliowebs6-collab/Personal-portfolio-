"use strict";

const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
| Portfolio website projects dekh sakti hai.
*/

// GET /api/projects
router.get("/", getProjects);

// GET /api/projects/:id
router.get("/:id", getProjectById);


/*
|--------------------------------------------------------------------------
| Protected Admin Routes
|--------------------------------------------------------------------------
| In routes ko access karne ke liye valid JWT admin token required hai.
*/

// POST /api/projects
router.post("/", authMiddleware, createProject);

// PUT /api/projects/:id
router.put("/:id", authMiddleware, updateProject);

// DELETE /api/projects/:id
router.delete("/:id", authMiddleware, deleteProject);


module.exports = router;

📌 File yahan hogi

backend/
└── routes/
    ├── auth.js
    └── projects.js    ← ye wali

🔐 Routes ka kaam

Method| Endpoint| Access
GET| "/api/projects"| 🌐 Public
GET| "/api/projects/:id"| 🌐 Public
POST| "/api/projects"| 🔐 Admin
PUT| "/api/projects/:id"| 🔐 Admin
DELETE| "/api/projects/:id"| 🔐 Admin

Next file: "backend/controllers/projectController.js" — ye actual Firebase/Firestore ke saath Add, Edit, Delete aur Fetch ka kaam karegi.
