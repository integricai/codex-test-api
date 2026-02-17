import { StatusCodes } from "http-status-codes";

import { admin, db } from "../config/firebase.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Missing or invalid authorization header");
  }

  const token = authHeader.split(" ")[1];
  const decoded = await admin.auth().verifyIdToken(token);

  req.user = {
    uid: decoded.uid,
    email: decoded.email || null,
    name: decoded.name || null
  };

  const userRef = db.collection("users").doc(decoded.uid);
  await userRef.set(
    {
      email: decoded.email || null,
      name: decoded.name || null,
      photoURL: decoded.picture || null,
      lastSeenAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  next();
});

export default authenticate;
