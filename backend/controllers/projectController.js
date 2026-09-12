"use strict";

const { db } = require("../config/firebase");

const COLLECTION = "projects";

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

function cleanProjectData(data = {}) {
  return {
    title: typeof data.title === "string" ? data.title.trim() : "",
    description:
      typeof data.description === "string"
        ? data.description.trim()
        : "",
    image:
      typeof data.image === "string"
        ? data.image.trim()
        : "",
    liveUrl:
      typeof data.liveUrl === "string"
        ? data.liveUrl.trim()
        : "",
    githubUrl:
      typeof data.githubUrl === "string"
        ? data.githubUrl.trim()
        : "",
    technologies: Array.isArray(data.technologies)
      ? data.technologies
          .filter((item) => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [],
    featured: Boolean(data.featured),
    status:
      data.status === "draft" ||
      data.status === "archived"
        ? data.status
        : "published"
  };
}

/*
|--------------------------------------------------------------------------
| GET ALL PROJECTS
| GET /api/projects
|--------------------------------------------------------------------------
*/

async function getProjects(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Firebase database is not configured."
      });
    }

    const snapshot = await db
      .collection(COLLECTION)
      .orderBy("createdAt", "desc")
      .get();

    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects."
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET PROJECT BY ID
| GET /api/projects/:id
|--------------------------------------------------------------------------
*/

async function getProjectById(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Firebase database is not configured."
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required."
      });
    }

    const doc = await db
      .collection(COLLECTION)
      .doc(id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Project not found."
      });
    }

    return res.status(200).json({
      success: true,
      project: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    console.error("Get project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project."
    });
  }
}

/*
|--------------------------------------------------------------------------
| CREATE PROJECT
| POST /api/projects
|--------------------------------------------------------------------------
*/

async function createProject(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Firebase database is not configured."
      });
    }

    const projectData = cleanProjectData(req.body);

    if (!projectData.title) {
      return res.status(400).json({
        success: false,
        message: "Project title is required."
      });
    }

    if (!projectData.description) {
      return res.status(400).json({
        success: false,
        message: "Project description is required."
      });
    }

    const now = new Date();

    const newProject = {
      ...projectData,
      createdAt: now,
      updatedAt: now
    };

    const docRef = await db
      .collection(COLLECTION)
      .add(newProject);

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project: {
        id: docRef.id,
        ...newProject
      }
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create project."
    });
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE PROJECT
| PUT /api/projects/:id
|--------------------------------------------------------------------------
*/

async function updateProject(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Firebase database is not configured."
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required."
      });
    }

    const projectRef = db
      .collection(COLLECTION)
      .doc(id);

    const existingProject = await projectRef.get();

    if (!existingProject.exists) {
      return res.status(404).json({
        success: false,
        message: "Project not found."
      });
    }

    const projectData = cleanProjectData(req.body);

    if (!projectData.title) {
      return res.status(400).json({
        success: false,
        message: "Project title is required."
      });
    }

    if (!projectData.description) {
      return res.status(400).json({
        success: false,
        message: "Project description is required."
      });
    }

    const updatedData = {
      ...projectData,
      updatedAt: new Date()
    };

    await projectRef.update(updatedData);

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      project: {
        id,
        ...existingProject.data(),
        ...updatedData
      }
    });
  } catch (error) {
    console.error("Update project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update project."
    });
  }
}

/*
|--------------------------------------------------------------------------
| DELETE PROJECT
| DELETE /api/projects/:id
|--------------------------------------------------------------------------
*/

async function deleteProject(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Firebase database is not configured."
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required."
      });
    }

    const projectRef = db
      .collection(COLLECTION)
      .doc(id);

    const existingProject = await projectRef.get();

    if (!existingProject.exists) {
      return res.status(404).json({
        success: false,
        message: "Project not found."
      });
    }

    await projectRef.delete();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
      projectId: id
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete project."
    });
  }
}

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
