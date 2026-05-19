import type { NextFunction, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../utils/token.js";
import type { AuthedRequest, Role } from "../types.js";

export const requireAuth = (req: AuthedRequest, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return next(new ApiError(401, "Authentication token is required"));

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

export const requireRole =
  (...roles: Role[]) =>
  (req: AuthedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new ApiError(401, "Authentication required"));
    if (!roles.includes(req.user.role)) return next(new ApiError(403, "You do not have permission for this action"));
    next();
  };
