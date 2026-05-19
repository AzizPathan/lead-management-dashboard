import { Router } from "express";
import { login, me, register } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginValidator, registerValidator } from "../validators/authValidators.js";

export const authRoutes = Router();

authRoutes.post("/register", registerValidator, validateRequest, asyncHandler(register));
authRoutes.post("/login", loginValidator, validateRequest, asyncHandler(login));
authRoutes.get("/me", requireAuth, asyncHandler(me));
