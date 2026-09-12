"use strict";

const crypto = require("crypto");
const { db } = require("../config/firebase");

const COLLECTION = "analytics_events";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getClientIP(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

function hashIP(ip) {
  return crypto
    .createHash("sha256")
    .update(ip)
    .digest("hex");
}

function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getStartDate(days) {
  const date = new Date();

  date.setDate(
    date.getDate() - (days - 1)
  );

  date.setUTCHours(
    0,
    0,
    0,
    0
  );

  return date;
}

/*
|--------------------------------------------------------------------------
| TRACK VISITOR
| POST /api/analytics/track
|--------------------------------------------------------------------------
|
| Public endpoint
|
| Body:
| {
|   page: "/",
|   visitorId: "unique-browser-id"
| }
|--------------------------------------------------------------------------
*/

async function trackVisitor(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message:
          "Firebase database is not configured."
      });
    }

    const {
      page,
      visitorId
    } = req.body || {};

    const clientIP = getClientIP(req);

    const event = {
      type: "page_view",

      page:
        typeof page === "string" &&
        page.trim()
          ? page.trim().slice(0, 300)
          : "/",

      visitorId:
        typeof visitorId === "string" &&
        visitorId.trim()
          ? visitorId.trim().slice(0, 150)
          : "anonymous",

      ipHash: hashIP(clientIP),

      userAgent:
        req.headers["user-agent"] || "unknown",

      date: getDateKey(),

      createdAt: new Date()
    };

    await db
      .collection(COLLECTION)
      .add(event);

    return res.status(201).json({
      success: true,
      message: "Visitor tracked."
    });
  } catch (error) {
    console.error(
      "Track visitor error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to track visitor."
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET COMPLETE ANALYTICS
| GET /api/analytics
|--------------------------------------------------------------------------
*/

async function getAnalytics(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message:
          "Firebase database is not configured."
      });
    }

    const days = Number(
      req.query.days || 7
    );

    const validDays = [
      1,
      7,
      30,
      90
    ].includes(days)
      ? days
      : 7;

    const startDate =
      getStartDate(validDays);

    const snapshot = await db
      .collection(COLLECTION)
      .where(
        "createdAt",
        ">=",
        startDate
      )
      .orderBy(
        "createdAt",
        "asc"
      )
      .get();

    const events =
      snapshot.docs.map(
        (doc) => doc.data()
      );

    const uniqueVisitors =
      new Set(
        events
          .map(
            (event) =>
              event.visitorId
          )
          .filter(Boolean)
      );

    const todayKey =
      getDateKey();

    const todayEvents =
      events.filter(
        (event) =>
          event.date === todayKey
      );

    const todayVisitors =
      new Set(
        todayEvents
          .map(
            (event) =>
              event.visitorId
          )
          .filter(Boolean)
      );

    const pageViews =
      events.length;

    const dailyStats = {};

    for (
      let i = 0;
      i < validDays;
      i++
    ) {
      const date =
        new Date(startDate);

      date.setUTCDate(
        date.getUTCDate() + i
      );

      const key =
        getDateKey(date);

      dailyStats[key] = {
        date: key,
        visitors: 0,
        pageViews: 0
      };
    }

    for (const event of events) {
      const key = event.date;

      if (!dailyStats[key]) {
        dailyStats[key] = {
          date: key,
          visitors: 0,
          pageViews: 0
        };
      }

      dailyStats[key].pageViews += 1;
    }

    for (const key of Object.keys(
      dailyStats
    )) {
      const visitorsForDay =
        new Set(
          events
            .filter(
              (event) =>
                event.date === key
            )
            .map(
              (event) =>
                event.visitorId
            )
        );

      dailyStats[key].visitors =
        visitorsForDay.size;
    }

    return res.status(200).json({
      success: true,

      period: {
        days: validDays,
        startDate:
          getDateKey(startDate),
        endDate: todayKey
      },

      summary: {
        totalVisitors:
          uniqueVisitors.size,

        pageViews,

        todayVisitors:
          todayVisitors.size,

        todayPageViews:
          todayEvents.length
      },

      daily: Object.values(
        dailyStats
      )
    });
  } catch (error) {
    console.error(
      "Get analytics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch analytics."
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET VISITOR STATISTICS
| GET /api/analytics/visitors
|--------------------------------------------------------------------------
*/

async function getVisitorStats(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message:
          "Firebase database is not configured."
      });
    }

    const days = Number(
      req.query.days || 7
    );

    const validDays = [
      1,
      7,
      30,
      90
    ].includes(days)
      ? days
      : 7;

    const startDate =
      getStartDate(validDays);

    const snapshot = await db
      .collection(COLLECTION)
      .where(
        "createdAt",
        ">=",
        startDate
      )
      .get();

    const events =
      snapshot.docs.map(
        (doc) => doc.data()
      );

    const visitors =
      new Set(
        events
          .map(
            (event) =>
              event.visitorId
          )
          .filter(Boolean)
      );

    return res.status(200).json({
      success: true,

      period: {
        days: validDays
      },

      totalVisitors:
        visitors.size,

      pageViews:
        events.length
    });
  } catch (error) {
    console.error(
      "Visitor stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch visitor statistics."
    });
  }
}

/*
|--------------------------------------------------------------------------
| GET PAGE VIEWS
| GET /api/analytics/pageviews
|--------------------------------------------------------------------------
*/

async function getPageViews(req, res) {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message:
          "Firebase database is not configured."
      });
    }

    const days = Number(
      req.query.days || 7
    );

    const validDays = [
      1,
      7,
      30,
      90
    ].includes(days)
      ? days
      : 7;

    const startDate =
      getStartDate(validDays);

    const snapshot = await db
      .collection(COLLECTION)
      .where(
        "createdAt",
        ">=",
        startDate
      )
      .get();

    const pageViews = {};

    for (
      let i = 0;
      i < validDays;
      i++
    ) {
      const date =
        new Date(startDate);

      date.setUTCDate(
        date.getUTCDate() + i
      );

      const key =
        getDateKey(date);

      pageViews[key] = {
        date: key,
        views: 0
      };
    }

    snapshot.docs.forEach(
      (doc) => {
        const event = doc.data();

        if (pageViews[event.date]) {
          pageViews[event.date]
            .views += 1;
        }
      }
    );

    return res.status(200).json({
      success: true,

      period: {
        days: validDays
      },

      pageViews:
        Object.values(pageViews)
    });
  } catch (error) {
    console.error(
      "Page views error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch page views."
    });
  }
}

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  trackVisitor,
  getAnalytics,
  getVisitorStats,
  getPageViews
};