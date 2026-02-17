import { Router } from "express";

import authenticate from "../middlewares/authenticate.js";


import listRoutes from "./list.routes.js";
import taskRoutes from "./task.routes.js";
import workspaceRoutes from "./workspace.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

router.use("/workspaces", authenticate, workspaceRoutes);
router.use("/workspaces/:workspaceId/lists", authenticate, listRoutes);
router.use("/workspaces/:workspaceId/tasks", authenticate, taskRoutes);

export default router;
