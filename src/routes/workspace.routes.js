import { Router } from "express";

import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaceById,
  listWorkspaces,
  updateWorkspace
} from "../controllers/workspace.controller.js";
import validate from "../middlewares/validate.js";
import {
  workspaceCreateSchema,
  workspaceIdSchema,
  workspaceListSchema,
  workspaceUpdateRequestSchema
} from "../validators/workspace.validator.js";

const router = Router();

router.get("/", validate(workspaceListSchema), listWorkspaces);
router.post("/", validate(workspaceCreateSchema), createWorkspace);
router.get("/:workspaceId", validate(workspaceIdSchema), getWorkspaceById);
router.patch("/:workspaceId", validate(workspaceUpdateRequestSchema), updateWorkspace);
router.delete("/:workspaceId", validate(workspaceIdSchema), deleteWorkspace);

export default router;
