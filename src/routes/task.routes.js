import { Router } from "express";

import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask
} from "../controllers/task.controller.js";
import validate from "../middlewares/validate.js";
import {
  taskCreateSchema,
  taskIdSchema,
  taskListSchema,
  taskUpdateRequestSchema
} from "../validators/task.validator.js";

const router = Router({ mergeParams: true });

router.get("/", validate(taskListSchema), listTasks);
router.post("/", validate(taskCreateSchema), createTask);
router.get("/:taskId", validate(taskIdSchema), getTaskById);
router.patch("/:taskId", validate(taskUpdateRequestSchema), updateTask);
router.delete("/:taskId", validate(taskIdSchema), deleteTask);

export default router;
