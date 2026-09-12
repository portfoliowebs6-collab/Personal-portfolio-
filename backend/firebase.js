"use strict";

/* =========================================
   DEEPAK KEWAT BACKEND
   Firebase Admin Configuration
========================================= */

const admin = require("firebase-admin");


/* =========================================
   FIREBASE CONFIG
========================================= */

/*
 * Firebase credentials .env se aayengi.
 *
 * Required:
 *
 * FIREBASE_PROJECT_ID
 * FIREBASE_CLIENT_EMAIL
 * FIREBASE_PRIVATE_KEY
 *
 * PRIVATE KEY me \n ko actual newline
 * me convert karna zaroori hai.
 */

const projectId =
  process.env.FIREBASE_PROJECT_ID;

const clientEmail =
  process.env.FIREBASE_CLIENT_EMAIL;

const privateKey =
  process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(
        /\\n/g,
        "\n"
      )
    : undefined;


/* =========================================
   VALIDATION
========================================= */

if (
  !projectId ||
  !clientEmail ||
  !privateKey
) {

  console.warn(
    "⚠️ Firebase credentials are not configured."
  );

  console.warn(
    "Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to .env"
  );
}


/* =========================================
   INITIALIZE FIREBASE
========================================= */

if (!admin.apps.length) {

  if (
    projectId &&
    clientEmail &&
    privateKey
  ) {

    admin.initializeApp({
      credential:
        admin.credential.cert({
          projectId,
          clientEmail,
          privateKey
        })
    });

    console.log(
      "🔥 Firebase Admin initialized successfully."
    );

  }

}


/* =========================================
   FIREBASE SERVICES
========================================= */

const db =
  admin.apps.length
    ? admin.firestore()
    : null;

const auth =
  admin.apps.length
    ? admin.auth()
    : null;


/* =========================================
   EXPORT
========================================= */

module.exports = {
  admin,
  db,
  auth
};