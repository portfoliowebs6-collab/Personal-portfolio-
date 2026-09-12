"use strict";

const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  trackVisitor,
  getAnalytics,
  getVisitorStats,
  getPageViews
} = require("../controllers/analyticsController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC — Visitor Tracking
|--------------------------------------------------------------------------
| Portfolio par visitor aane par frontend ye endpoint call karega.
*/

// POST /api/analytics/track
router.post("/track", trackVisitor);


/*
|--------------------------------------------------------------------------
| PROTECTED — Admin Analytics
|--------------------------------------------------------------------------
| Sirf logged-in admin analytics dekh sakta hai.
*/

// GET /api/analytics
router.get(
  "/",
  authMiddleware,
  getAnalytics
);

// GET /api/analytics/visitors
router.get(
  "/visitors",
  authMiddleware,
  getVisitorStats
);

// GET /api/analytics/pageviews
router.get(
  "/pageviews",
  authMiddleware,
  getPageViews
);


module.exports = router;

