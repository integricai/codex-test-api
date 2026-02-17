import { Router } from "express";

import {
  createList,
  deleteList,
  listListsByWorkspace,
  updateList
} from "../controllers/list.controller.js";
import validate from "../middlewares/validate.js";
import {
  listByWorkspaceSchema,
  listCreateSchema,
  listIdSchema,
  listUpdateRequestSchema
} from "../validators/list.validator.js";

const router = Router({ mergeParams: true });

router.get("/", validate(listByWorkspaceSchema), listListsByWorkspace);
router.post("/", validate(listCreateSchema), createList);
router.patch("/:listId", validate(listUpdateRequestSchema), updateList);
router.delete("/:listId", validate(listIdSchema), deleteList);

export default router;
