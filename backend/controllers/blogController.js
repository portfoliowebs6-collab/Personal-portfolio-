"use strict";

const { db } = require("../config/firebase");

const COLLECTION = "blogs";

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

function cleanBlogData(data = {}) {
  return {
    title:
      typeof data.title === "string"
        ? data.title.trim()
        : "",

    slug:
      typeof data.slug === "string"
        ? data.slug.trim().toLowerCase()
        : "",

    excerpt:
      typeof data.excerpt === "string"
        ? data.excerpt.trim()
        : "",

    content:
      typeof data.content === "string"
        ? data.content.trim()
        : "",

    coverImage:
      typeof data.coverImage === "string"
        ? data.coverImage.trim()
        : "",

    category:
      typeof data.category === "string"
        ? data.category.trim()
        : "General",

    tags: Array.isArray(data.tags)
      ? data.tags
          .filter(
            (tag) =>
              typeof tag === "string"
          )
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],

    status:
      data.status === "draft" ||
      data.status === "archived"
        ? data.status
        : "published",

    featured: Boolean(data.featured)
  };
}

/*
|--------------------------------------------------------------------------
| Generate Slug
|--------------------------------------------------------------------------
*/

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/*
|--------------------------------------------------------------------------
| GET ALL BLOGS
| GET /api/blog
|--------------------------------------------------------------------------
*/

async function getBlogs(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message:
          "Firebase database is not configured."
      });
    }

    const snapshot = await db
      .collection(COLLECTION)
      .orderBy("createdAt", "desc")
      .get();

    const blogs = snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data()
      })
    );

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    console.error(
      "Get blogs error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs."
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET BLOG BY ID
| GET /api/blog/:id
|--------------------------------------------------------------------------
*/

async function getBlogById(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message:
          "Firebase database is not configured."
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required."
      });
    }

    const doc = await db
      .collection(COLLECTION)
      .doc(id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Blog not found."
      });
    }

    return res.status(200).json({
      success: true,
      blog: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    console.error(
      "Get blog error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog."
    });
  }
}

/*
|--------------------------------------------------------------------------
| CREATE BLOG
| POST /api/blog
|--------------------------------------------------------------------------
*/

async function createBlog(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message:
          "Firebase database is not configured."
      });
    }

    const blogData =
      cleanBlogData(req.body);

    if (!blogData.title) {
      return res.status(400).json({
        success: false,
        message: "Blog title is required."
      });
    }

    if (!blogData.content) {
      return res.status(400).json({
        success: false,
        message: "Blog content is required."
      });
    }

    if (!blogData.slug) {
      blogData.slug =
        generateSlug(blogData.title);
    }

    if (!blogData.slug) {
      return res.status(400).json({
        success: false,
        message:
          "A valid blog slug could not be generated."
      });
    }

    // Check duplicate slug
    const duplicate = await db
      .collection(COLLECTION)
      .where("slug", "==", blogData.slug)
      .limit(1)
      .get();

    if (!duplicate.empty) {
      return res.status(409).json({
        success: false,
        message:
          "A blog with this slug already exists."
      });
    }

    const now = new Date();

    const newBlog = {
      ...blogData,
      views: 0,
      createdAt: now,
      updatedAt: now
    };

    const docRef = await db
      .collection(COLLECTION)
      .add(newBlog);

    return res.status(201).json({
      success: true,
      message:
        "Blog created successfully.",
      blog: {
        id: docRef.id,
        ...newBlog
      }
    });
  } catch (error) {
    console.error(
      "Create blog error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create blog."
    });
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE BLOG
| PUT /api/blog/:id
|--------------------------------------------------------------------------
*/

async function updateBlog(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message:
          "Firebase database is not configured."
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required."
      });
    }

    const blogRef = db
      .collection(COLLECTION)
      .doc(id);

    const existingBlog =
      await blogRef.get();

    if (!existingBlog.exists) {
      return res.status(404).json({
        success: false,
        message: "Blog not found."
      });
    }

    const blogData =
      cleanBlogData(req.body);

    if (!blogData.title) {
      return res.status(400).json({
        success: false,
        message: "Blog title is required."
      });
    }

    if (!blogData.content) {
      return res.status(400).json({
        success: false,
        message: "Blog content is required."
      });
    }

    if (!blogData.slug) {
      blogData.slug =
        generateSlug(blogData.title);
    }

    // Check if another blog already uses slug
    const duplicate = await db
      .collection(COLLECTION)
      .where("slug", "==", blogData.slug)
      .limit(2)
      .get();

    const duplicateExists =
      duplicate.docs.some(
        (doc) => doc.id !== id
      );

    if (duplicateExists) {
      return res.status(409).json({
        success: false,
        message:
          "Another blog already uses this slug."
      });
    }

    const oldData =
      existingBlog.data();

    const updatedData = {
      ...blogData,
      views:
        typeof oldData.views === "number"
          ? oldData.views
          : 0,
      updatedAt: new Date()
    };

    await blogRef.update(
      updatedData
    );

    return res.status(200).json({
      success: true,
      message:
        "Blog updated successfully.",
      blog: {
        id,
        ...oldData,
        ...updatedData
      }
    });
  } catch (error) {
    console.error(
      "Update blog error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update blog."
    });
  }
}

/*
|--------------------------------------------------------------------------
| DELETE BLOG
| DELETE /api/blog/:id
|--------------------------------------------------------------------------
*/

async function deleteBlog(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message:
          "Firebase database is not configured."
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required."
      });
    }

    const blogRef = db
      .collection(COLLECTION)
      .doc(id);

    const existingBlog =
      await blogRef.get();

    if (!existingBlog.exists) {
      return res.status(404).json({
        success: false,
        message: "Blog not found."
      });
    }

    await blogRef.delete();

    return res.status(200).json({
      success: true,
      message:
        "Blog deleted successfully.",
      blogId: id
    });
  } catch (error) {
    console.error(
      "Delete blog error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete blog."
    });
  }
}

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};
