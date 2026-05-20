import { Router } from "express";
import { login, me, register } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginValidator, registerValidator } from "../validators/authValidators.js";

export const authRoutes = Router();

authRoutes.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      name: "Auth API",
      endpoints: {
        register: { method: "POST", path: "/api/auth/register" },
        login: { method: "POST", path: "/api/auth/login" },
        me: { method: "GET", path: "/api/auth/me" }
      }
    }
  });
});

authRoutes.get("/register", (_req, res) => {
  res.json({
    success: true,
    message: "Use POST /api/auth/register to create an account.",
    data: {
      requiredBody: {
        name: "Your Name",
        email: "you@example.com",
        password: "Password123",
        role: "sales"
      }
    }
  });
});

authRoutes.get("/login", (_req, res) => {
  res.json({
    success: true,
    message: "Use POST /api/auth/login to sign in.",
    data: {
      requiredBody: {
        email: "you@example.com",
        password: "Password123"
      }
    }
  });
});

authRoutes.post("/register", registerValidator, validateRequest, asyncHandler(register));
authRoutes.post("/login", loginValidator, validateRequest, asyncHandler(login));
authRoutes.get("/me", requireAuth, asyncHandler(me));
