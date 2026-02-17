import { admin, db } from "../config/firebase.js";

const serverTimestamp = () => admin.firestore.FieldValue.serverTimestamp();

const toDate = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value.toDate) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return value;
};

const serializeDoc = (doc) => {
  const data = doc.data();
  const out = { id: doc.id };

  Object.entries(data).forEach(([key, value]) => {
    out[key] = toDate(value);
  });

  return out;
};

const collections = {
  users: db.collection("users"),
  workspaces: db.collection("workspaces"),
  lists: db.collection("lists"),
  tasks: db.collection("tasks")
};

export { collections, db, serializeDoc, serverTimestamp };
