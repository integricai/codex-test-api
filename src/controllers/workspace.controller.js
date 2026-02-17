import { StatusCodes } from "http-status-codes";

import { collections, serializeDoc, serverTimestamp } from "../services/firestore.js";
import asyncHandler from "../utils/asyncHandler.js";

const listWorkspaces = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const limit = Number(req.query.limit || 50);

  const [ownedSnap, memberSnap] = await Promise.all([
    collections.workspaces.where("ownerId", "==", uid).limit(limit).get(),
    collections.workspaces.where("members", "array-contains", uid).limit(limit).get()
  ]);

  const seen = new Set();
  const merged = [];

  for (const snap of [ownedSnap, memberSnap]) {
    snap.docs.forEach((doc) => {
      if (!seen.has(doc.id)) {
        seen.add(doc.id);
        merged.push(serializeDoc(doc));
      }
    });
  }

  res.status(StatusCodes.OK).json({ data: merged });
});

const createWorkspace = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { name, description, memberIds = [] } = req.body;

  const cleanMemberIds = [...new Set(memberIds.filter((id) => id !== uid))];

  const ref = collections.workspaces.doc();
  await ref.set({
    name,
    description: description || "",
    ownerId: uid,
    members: cleanMemberIds,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  const created = await ref.get();
  res.status(StatusCodes.CREATED).json({ data: serializeDoc(created) });
});

const getWorkspaceById = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { uid } = req.user;

  const doc = await collections.workspaces.doc(workspaceId).get();
  if (!doc.exists) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Workspace not found" });
  }

  const workspace = doc.data();
  const allowed = workspace.ownerId === uid || (workspace.members || []).includes(uid);
  if (!allowed) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied" });
  }

  return res.status(StatusCodes.OK).json({ data: serializeDoc(doc) });
});

const updateWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { uid } = req.user;

  const ref = collections.workspaces.doc(workspaceId);
  const doc = await ref.get();

  if (!doc.exists) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Workspace not found" });
  }

  const current = doc.data();
  if (current.ownerId !== uid) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "Only workspace owner can update it" });
  }

  const payload = { ...req.body, updatedAt: serverTimestamp() };
  if (payload.memberIds) {
    payload.members = [...new Set(payload.memberIds.filter((id) => id !== uid))];
    delete payload.memberIds;
  }

  await ref.update(payload);

  const updated = await ref.get();
  return res.status(StatusCodes.OK).json({ data: serializeDoc(updated) });
});

const deleteWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { uid } = req.user;

  const ref = collections.workspaces.doc(workspaceId);
  const doc = await ref.get();

  if (!doc.exists) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Workspace not found" });
  }

  const current = doc.data();
  if (current.ownerId !== uid) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "Only workspace owner can delete it" });
  }

  await ref.delete();

  res.status(StatusCodes.NO_CONTENT).send();
});

export { createWorkspace, deleteWorkspace, getWorkspaceById, listWorkspaces, updateWorkspace };
