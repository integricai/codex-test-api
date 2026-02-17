import { StatusCodes } from "http-status-codes";

import { assertWorkspaceAccess } from "../services/authorization.js";
import { collections, serializeDoc, serverTimestamp } from "../services/firestore.js";
import asyncHandler from "../utils/asyncHandler.js";

const ensureListBelongsToWorkspace = async (listId, workspaceId) => {
  const listDoc = await collections.lists.doc(listId).get();
  return listDoc.exists && listDoc.data().workspaceId === workspaceId;
};

const buildTaskQuery = (workspaceId, query) => {
  let taskQuery = collections.tasks.where("workspaceId", "==", workspaceId);

  if (query.listId) {
    taskQuery = taskQuery.where("listId", "==", query.listId);
  }
  if (query.status) {
    taskQuery = taskQuery.where("status", "==", query.status);
  }
  if (query.assigneeId) {
    taskQuery = taskQuery.where("assigneeIds", "array-contains", query.assigneeId);
  }
  if (typeof query.archived === "boolean") {
    taskQuery = taskQuery.where("archived", "==", query.archived);
  }

  return taskQuery.orderBy("updatedAt", "desc").limit(Number(query.limit || 50));
};

const listTasks = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { uid } = req.user;

  await assertWorkspaceAccess(workspaceId, uid, collections);

  const snap = await buildTaskQuery(workspaceId, req.query).get();
  let tasks = snap.docs.map(serializeDoc);

  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    tasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(search) ||
        (task.description || "").toLowerCase().includes(search)
    );
  }

  res.status(StatusCodes.OK).json({ data: tasks });
});

const getTaskById = asyncHandler(async (req, res) => {
  const { workspaceId, taskId } = req.params;
  const { uid } = req.user;

  await assertWorkspaceAccess(workspaceId, uid, collections);

  const taskDoc = await collections.tasks.doc(taskId).get();
  if (!taskDoc.exists || taskDoc.data().workspaceId !== workspaceId) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Task not found" });
  }

  return res.status(StatusCodes.OK).json({ data: serializeDoc(taskDoc) });
});

const createTask = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { uid } = req.user;

  await assertWorkspaceAccess(workspaceId, uid, collections);

  const listOk = await ensureListBelongsToWorkspace(req.body.listId, workspaceId);
  if (!listOk) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid list for workspace" });
  }

  const ref = collections.tasks.doc();
  await ref.set({
    workspaceId,
    listId: req.body.listId,
    title: req.body.title,
    description: req.body.description || "",
    status: req.body.status || "todo",
    priority: req.body.priority || "normal",
    dueDate: req.body.dueDate || null,
    startDate: req.body.startDate || null,
    assigneeIds: req.body.assigneeIds || [],
    tags: req.body.tags || [],
    estimateMinutes: req.body.estimateMinutes || null,
    parentTaskId: req.body.parentTaskId || null,
    archived: false,
    createdBy: uid,
    updatedBy: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  const created = await ref.get();
  res.status(StatusCodes.CREATED).json({ data: serializeDoc(created) });
});

const updateTask = asyncHandler(async (req, res) => {
  const { workspaceId, taskId } = req.params;
  const { uid } = req.user;

  await assertWorkspaceAccess(workspaceId, uid, collections);

  const ref = collections.tasks.doc(taskId);
  const doc = await ref.get();

  if (!doc.exists || doc.data().workspaceId !== workspaceId) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Task not found" });
  }

  if (req.body.listId) {
    const listOk = await ensureListBelongsToWorkspace(req.body.listId, workspaceId);
    if (!listOk) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid list for workspace" });
    }
  }

  await ref.update({
    ...req.body,
    updatedBy: uid,
    updatedAt: serverTimestamp()
  });

  const updated = await ref.get();
  res.status(StatusCodes.OK).json({ data: serializeDoc(updated) });
});

const deleteTask = asyncHandler(async (req, res) => {
  const { workspaceId, taskId } = req.params;
  const { uid } = req.user;

  await assertWorkspaceAccess(workspaceId, uid, collections);

  const ref = collections.tasks.doc(taskId);
  const doc = await ref.get();

  if (!doc.exists || doc.data().workspaceId !== workspaceId) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Task not found" });
  }

  await ref.delete();
  res.status(StatusCodes.NO_CONTENT).send();
});

export { createTask, deleteTask, getTaskById, listTasks, updateTask };
