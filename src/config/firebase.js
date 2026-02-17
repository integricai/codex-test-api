import fs from "node:fs";

import admin from "firebase-admin";

import env from "./env.js";

function loadCredentials() {
  if (env.firebaseServiceAccountJson) {
    return JSON.parse(env.firebaseServiceAccountJson);
  }

  if (env.firebaseServiceAccountPath && fs.existsSync(env.firebaseServiceAccountPath)) {
    const file = fs.readFileSync(env.firebaseServiceAccountPath, "utf8");
    return JSON.parse(file);
  }

  return null;
}

const credentials = loadCredentials();

if (!admin.apps.length) {
  const options = credentials
    ? {
        credential: admin.credential.cert(credentials),
        projectId: env.firebaseProjectId || credentials.project_id
      }
    : {
        credential: admin.credential.applicationDefault(),
        projectId: env.firebaseProjectId
      };

  admin.initializeApp(options);
}

const db = admin.firestore();

export { admin, db };
