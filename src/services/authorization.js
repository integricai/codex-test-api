import { StatusCodes } from "http-status-codes";

import ApiError from "../utils/apiError.js";

const assertWorkspaceAccess = async (workspaceId, userId, collections) => {
  const workspaceSnap = await collections.workspaces.doc(workspaceId).get();
  if (!workspaceSnap.exists) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Workspace not found");
  }

  const workspace = workspaceSnap.data();
  const allowed = workspace.ownerId === userId || (workspace.members || []).includes(userId);

  if (!allowed) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You do not have access to this workspace");
  }

  return workspaceSnap;
};

export { assertWorkspaceAccess };
