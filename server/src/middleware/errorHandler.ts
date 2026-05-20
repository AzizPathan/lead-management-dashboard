import type { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from "express";
import { validationResult } from "express-validator";
import { isDbConnected } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

interface MongoErrorLike extends Error {
  code?: number;
}

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
  const error = err as MongoErrorLike;
  const isDuplicateKeyError = error.code === 11000;
  const isMongoConnectionError =
    err instanceof Error &&
    (err.name === "MongooseServerSelectionError" || err.message.includes("Operation") || err.message.includes("buffering timed out"));
  const statusCode = err instanceof ApiError ? err.statusCode : isDuplicateKeyError ? 409 : isMongoConnectionError ? 503 : 500;
  res.status(statusCode).json({
    success: false,
    message: isDuplicateKeyError
      ? "Email is already registered"
      : isMongoConnectionError
        ? "Database is not connected. Check MONGO_URI on the backend deployment."
        : err instanceof Error
          ? err.message
          : "Unexpected server error",
    details: err instanceof ApiError ? err.details : undefined
  });
};
