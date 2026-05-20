import type { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from "express";
import { validationResult } from "express-validator";
import { isDbConnected } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

export const validateRequest = (req: Request, _res: Response, next: NextFunction): void => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    next(new ApiError(422, "Validation failed", result.array()));
    return;
  }
  next();
};

export const notFound: RequestHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const requireDatabase: RequestHandler = (_req, _res, next) => {
  if (!isDbConnected()) {
    next(new ApiError(503, "Database is not connected. Check MONGO_URI on the backend deployment."));
    return;
  }
  next();
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const isMongoConnectionError =
    err instanceof Error &&
    (err.name === "MongooseServerSelectionError" || err.message.includes("Operation") || err.message.includes("buffering timed out"));
  const statusCode = err instanceof ApiError ? err.statusCode : isMongoConnectionError ? 503 : 500;
  res.status(statusCode).json({
    success: false,
    message: isMongoConnectionError ? "Database is not connected. Check MONGO_URI on the backend deployment." : err instanceof Error ? err.message : "Unexpected server error",
    details: err instanceof ApiError ? err.details : undefined
  });
};
