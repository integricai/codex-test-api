import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

import ApiError from "../utils/apiError.js";

const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const payload = {
    message: err.message || "Internal server error"
  };

  if (err instanceof ApiError && err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }

  return res.status(statusCode).json(payload);
};

export default errorHandler;
