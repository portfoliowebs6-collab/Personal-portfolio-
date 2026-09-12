"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const messageRoutes = require("./routes/messages");
const blogRoutes = require("./routes/blog");
const analyticsRoutes = require("./routes/analytics");

const app = express();


// =====================================================
// CONFIGURATION
// =====================================================

const PORT = Number(process.env.PORT) || 5000;

const NODE_ENV =
  process.env.NODE_ENV || "development";


// =====================================================
// SECURITY
// =====================================================

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    }
  })
);


// =====================================================
// CORS
// =====================================================

const allowedOrigins = (
  process.env.FRONTEND_URL || ""
)
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);


const corsOptions = {

  origin: function (origin, callback) {

    // Allow server-to-server requests
    // and tools such as Postman.
    if (!origin) {
      return callback(null, true);
    }


    // Development mode
    if (
      NODE_ENV !== "production" &&
      allowedOrigins.length === 0
    ) {
      return callback(null, true);
    }


    if (
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }


    return callback(
      new Error("CORS: Origin not allowed")
    );

  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ],

  credentials: false,

  optionsSuccessStatus: 204

};


app.use(cors(corsOptions));


// =====================================================
// BODY PARSERS
// =====================================================

app.use(
  express.json({
    limit: "100kb"
  })
);


app.use(
  express.urlencoded({
    extended: true,
    limit: "100kb"
  })
);


// =====================================================
// GLOBAL API RATE LIMIT
// =====================================================

const apiLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max:
    NODE_ENV === "production"
      ? 300
      : 1000,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later."
  }

});


app.use(
  "/api",
  apiLimiter
);


// =====================================================
// REQUEST LOGGER
// =====================================================

app.use(
  (req, res, next) => {

    const start =
      Date.now();


    res.on(
      "finish",
      () => {

        const duration =
          Date.now() - start;


        console.log(
          `${req.method} ${req.originalUrl} ` +
          `${res.statusCode} ${duration}ms`
        );

      }
    );


    next();

  }
);


// =====================================================
// ROOT ROUTE
// =====================================================

app.get(
  "/",
  (req, res) => {

    res.json({

      success: true,

      message:
        "KewaDev Portfolio API is running 🚀",

      environment:
        NODE_ENV,

      version:
        "1.0.0",

      timestamp:
        new Date().toISOString()

    });

  }
);


// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
  "/api/health",
  (req, res) => {

    res.status(200).json({

      success: true,

      status: "healthy",

      service:
        "deepak-portfolio-backend",

      environment:
        NODE_ENV,

      timestamp:
        new Date().toISOString()

    });

  }
);


// =====================================================
// API ROUTES
// =====================================================


// Authentication
app.use(
  "/api/auth",
  authRoutes
);


// Projects
app.use(
  "/api/projects",
  projectRoutes
);


// Messages
app.use(
  "/api/messages",
  messageRoutes
);


// Blog
app.use(
  "/api/blog",
  blogRoutes
);


// Analytics
app.use(
  "/api/analytics",
  analyticsRoutes
);


// =====================================================
// API 404 HANDLER
// =====================================================

app.use(
  "/api",
  (req, res) => {

    res.status(404).json({

      success: false,

      message:
        "API endpoint not found.",

      path:
        req.originalUrl

    });

  }
);


// =====================================================
// GLOBAL 404 HANDLER
// =====================================================

app.use(
  (req, res) => {

    res.status(404).json({

      success: false,

      message:
        "Route not found.",

      path:
        req.originalUrl

    });

  }
);


// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (err, req, res, next) => {

    console.error(
      "❌ Server Error:",
      err
    );


    // CORS error
    if (
      err.message &&
      err.message.startsWith("CORS:")
    ) {

      return res.status(403).json({

        success: false,

        message:
          "Cross-origin request blocked."

      });

    }


    // JSON parsing error
    if (
      err instanceof SyntaxError &&
      err.status === 400 &&
      err.type === "entity.parse.failed"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid JSON payload."

      });

    }


    // Payload too large
    if (
      err.type ===
      "entity.too.large"
    ) {

      return res.status(413).json({

        success: false,

        message:
          "Request payload is too large."

      });

    }


    const statusCode =
      Number(err.statusCode) ||
      Number(err.status) ||
      500;


    res.status(
      statusCode >= 400 &&
      statusCode < 600
        ? statusCode
        : 500
    ).json({

      success: false,

      message:
        NODE_ENV === "production"
          ? "Internal server error."
          : (
              err.message ||
              "Internal server error."
            )

    });

  }
);


// =====================================================
// START SERVER
// =====================================================

const server =
  app.listen(
    PORT,
    () => {

      console.log("");
      console.log(
        "========================================"
      );

      console.log(
        "🚀 KewaDev Portfolio Backend"
      );

      console.log(
        "========================================"
      );

      console.log(
        `🌐 Port: ${PORT}`
      );

      console.log(
        `⚙️ Environment: ${NODE_ENV}`
      );

      console.log(
        `🔐 Auth: /api/auth`
      );

      console.log(
        `🚀 Projects: /api/projects`
      );

      console.log(
        `💬 Messages: /api/messages`
      );

      console.log(
        `📝 Blog: /api/blog`
      );

      console.log(
        `📊 Analytics: /api/analytics`
      );

      console.log(
        `❤️ Health: /api/health`
      );

      console.log(
        "========================================"
      );

      console.log("");

    }
);


// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================

function shutdown(signal) {

  console.log(
    `\n${signal} received. Shutting down...`
  );


  server.close(
    () => {

      console.log(
        "✅ Server closed successfully."
      );

      process.exit(0);

    }
  );


  setTimeout(
    () => {

      console.error(
        "⚠️ Forced shutdown."
      );

      process.exit(1);

    },
    10000
  );

}


process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);


process.on(
  "SIGINT",
  () => shutdown("SIGINT")
);


// =====================================================
// UNHANDLED ERRORS
// =====================================================

process.on(
  "unhandledRejection",
  (reason) => {

    console.error(
      "❌ Unhandled Promise Rejection:",
      reason
    );

  }
);


process.on(
  "uncaughtException",
  (error) => {

    console.error(
      "❌ Uncaught Exception:",
      error
    );

    shutdown("uncaughtException");

  }
);


// =====================================================
// EXPORT
// =====================================================

module.exports = app;