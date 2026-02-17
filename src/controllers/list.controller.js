import { StatusCodes } from "http-status-codes";

import { assertWorkspaceAccess } from "../services/authorization.js";
import { collections, serializeDoc, serverTimestamp } from "../services/firestore.js";
import asyncHandler from "../utils/asyncHandler.js";

const listListsByWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { uid } = req.user;

  await assertWorkspaceAccess(workspaceId, uid, collections);

  const snap = await collections.lists
    .where("workspaceId", "==", workspaceId)
    .orderBy("position", "asc")
    .get();

  res.status(StatusCodes.OK).json({
    data: snap.docs.map(serializeDoc)
  });
});

const createList = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { uid } = req.user;

  await assertWorkspaceAccess(workspaceId, uid, collections);

  const { name, description, statuses, position = 0 } = req.body;
  const ref = collections.lists.doc();

  await ref.set({
    workspaceId,
    name,
    description: description || "",
    statuses: statuses || ["todo", "in-progress", "done"],
    position,
    createdBy: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  const created = await ref.get();
  res.status(StatusCodes.CREATED).json({ data: serializeDoc(created) });
});

const updateList = asyncHandler(async (req, res) => {
  const { workspaceId, listId } = req.params;
  const { uid } = req.user;

  await assertWorkspaceAccess(workspaceId, uid, collections);

  const ref = collections.lists.doc(listId);
  const doc = await ref.get();

  if (!doc.exists || doc.data().workspaceId !== workspaceId) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "List not found" });
  }

  await ref.update({ ...req.body, updatedAt: serverTimestamp() });

  const updated = await ref.get();
  res.status(StatusCodes.OK).json({ data: serializeDoc(updated) });
});

const deleteList = asyncHandler(async (req, res) => {
  const { workspaceId, listId } = req.params;
  const { uid } = req.user;

  await assertWorkspaceAccess(workspaceId, uid, collections);

  const ref = collections.lists.doc(listId);
  const doc = await ref.get();

  if (!doc.exists || doc.data().workspaceId !== workspaceId) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "List not found" });
  }

  await ref.delete();
  res.status(StatusCodes.NO_CONTENT).send();
});

export { createList, deleteList, listListsByWorkspace, updateList };
