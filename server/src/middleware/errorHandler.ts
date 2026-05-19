import type { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from "express";
import { validationResult } from "express-validator";
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

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err instanceof Error ? err.message : "Unexpected server error",
    details: err instanceof ApiError ? err.details : undefined
  });
};
