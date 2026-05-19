import { Router } from "express";
import { createLead, deleteLead, exportLeads, getLead, listLeads, updateLead } from "../controllers/leadController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { leadIdValidator, leadValidator, listLeadsValidator, updateLeadValidator } from "../validators/leadValidators.js";

export const leadRoutes = Router();

leadRoutes.use(requireAuth);
leadRoutes.get("/", listLeadsValidator, validateRequest, asyncHandler(listLeads));
leadRoutes.get("/export", listLeadsValidator, validateRequest, asyncHandler(exportLeads));
leadRoutes.post("/", leadValidator, validateRequest, asyncHandler(createLead));
leadRoutes.get("/:id", leadIdValidator, validateRequest, asyncHandler(getLead));
leadRoutes.put("/:id", leadIdValidator, updateLeadValidator, validateRequest, asyncHandler(updateLead));
leadRoutes.delete("/:id", leadIdValidator, validateRequest, requireRole("admin"), asyncHandler(deleteLead));
